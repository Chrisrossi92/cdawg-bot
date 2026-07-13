import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getConversationParticipationSettings } from "../config/conversation-participation.js";
import { getChannelTopic } from "../lib/content.js";
import type { ContentType } from "../lib/content-provider.js";
import { findPassiveReaction, getPassiveTopicSignalScores } from "../lib/passive-content.js";
import { isLikelyCommandMessage, normalizeChatMessage, passesMessageQualityThresholds } from "../lib/chat-messages.js";
import { getActiveTriviaSessionSnapshotForChannel } from "../lib/trivia-session.js";
import { getChannelOperationalStatus } from "./channel-operations.js";
import { getBotSettings } from "./bot-settings.js";
import { getChannelProfile } from "./channel-profiles.js";
import type { Topic } from "../config/topics.js";

export type ConversationParticipationMode = "direct-mention" | "inline-reply" | "lull-prompt" | "lull-trivia";
export type ConversationParticipationState =
  | "DISABLED"
  | "OBSERVING"
  | "ACTIVE_CONVERSATION"
  | "ELIGIBLE_INLINE_REPLY"
  | "LULL_PENDING"
  | "ELIGIBLE_LULL_POST"
  | "SUPPRESSED"
  | "COOLDOWN";
export type ConversationParticipationDecision = "would-send" | "skipped";

export type ConversationParticipationInput = {
  channelId: string;
  channelName?: string | null;
  authorId: string;
  isBot: boolean;
  content: string;
  timestamp?: number;
  isDirectMention?: boolean;
};

export type ConversationParticipationResult = {
  timestamp: number;
  channelId: string;
  channelName: string | null;
  mode: ConversationParticipationMode;
  state: ConversationParticipationState;
  decision: ConversationParticipationDecision;
  reason: string;
  humanMessageCount: number;
  distinctHumanCount: number;
  relevanceScore: number;
  matchedTopics: string[];
  botHumanRatio: number;
  cooldownActive: boolean;
  capReached: boolean;
  suppressionActive: boolean;
  proposedContentType: ContentType | null;
  previewOnly: boolean;
};

export type ConversationDecisionRecord = ConversationParticipationResult & {
  id: string;
};

type RecentHumanMessage = {
  timestamp: number;
  authorHash: string;
  normalizedContent: string;
};

type BotConversationPost = {
  timestamp: number;
  mode: ConversationParticipationMode;
};

type ChannelConversationState = {
  channelId: string;
  channelName: string | null;
  recentHumanMessages: RecentHumanMessage[];
  botConversationPosts: BotConversationPost[];
  lastDecisionStateByMode: Partial<Record<ConversationParticipationMode, ConversationParticipationState>>;
  lastDecisionReasonByMode: Partial<Record<ConversationParticipationMode, string>>;
  lastWouldSendAtByMode: Partial<Record<ConversationParticipationMode, number>>;
  lastPassiveBotPostAt: number | null;
  humansAfterLastPassiveBotPost: number;
  dailyCountsDateKey: string;
  dailyCount: number;
  dailyTriviaCount: number;
};

type ConversationDecisionStore = {
  items: ConversationDecisionRecord[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "conversation-decisions.json");
const MAX_DECISION_RECORDS = 250;
const MAX_RECENT_HUMAN_MESSAGES = 24;
const DECISION_FLUSH_DELAY_MS = 500;
const sensitivePatterns = [
  /\b(mods?|moderator|admin|ban|banned|kick|mute|report|appeal)\b/i,
  /\b(harass|harassment|threat|abuse|creep|unsafe)\b/i,
  /\b(depressed|suicide|self harm|self-harm|crisis|panic attack)\b/i,
  /\b(racist|slur|hate speech|nsfw)\b/i,
  /\b(fight|drama|argument|arguing|beef)\b/i,
];

let flushTimeout: NodeJS.Timeout | null = null;
let nextDecisionSequence = 0;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
}

function sanitizeText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, maxLength) : null;
}

function sanitizeMode(value: unknown): ConversationParticipationMode | null {
  return value === "direct-mention" || value === "inline-reply" || value === "lull-prompt" || value === "lull-trivia"
    ? value
    : null;
}

function sanitizeState(value: unknown): ConversationParticipationState | null {
  return value === "DISABLED" ||
    value === "OBSERVING" ||
    value === "ACTIVE_CONVERSATION" ||
    value === "ELIGIBLE_INLINE_REPLY" ||
    value === "LULL_PENDING" ||
    value === "ELIGIBLE_LULL_POST" ||
    value === "SUPPRESSED" ||
    value === "COOLDOWN"
    ? value
    : null;
}

function sanitizeDecision(value: unknown): ConversationParticipationDecision | null {
  return value === "would-send" || value === "skipped" ? value : null;
}

function sanitizeContentType(value: unknown): ContentType | null {
  return value === "fact" || value === "history" || value === "joke" || value === "wyr" || value === "prompt" || value === "trivia"
    ? value
    : null;
}

function sanitizeDecisionRecord(value: unknown): ConversationDecisionRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeText(value.id, 48);
  const timestamp = sanitizeNumber(value.timestamp);
  const channelId = sanitizeText(value.channelId, 32);
  const mode = sanitizeMode(value.mode);
  const state = sanitizeState(value.state);
  const decision = sanitizeDecision(value.decision);
  const reason = sanitizeText(value.reason, 180);

  if (!id || !timestamp || !channelId || !mode || !state || !decision || !reason) {
    return null;
  }

  return {
    id,
    timestamp,
    channelId,
    channelName: sanitizeText(value.channelName, 100),
    mode,
    state,
    decision,
    reason,
    humanMessageCount: sanitizeNumber(value.humanMessageCount) ?? 0,
    distinctHumanCount: sanitizeNumber(value.distinctHumanCount) ?? 0,
    relevanceScore: typeof value.relevanceScore === "number" && Number.isFinite(value.relevanceScore) ? value.relevanceScore : 0,
    matchedTopics: Array.isArray(value.matchedTopics)
      ? value.matchedTopics.filter((entry): entry is string => typeof entry === "string").slice(0, 6)
      : [],
    botHumanRatio: typeof value.botHumanRatio === "number" && Number.isFinite(value.botHumanRatio) ? value.botHumanRatio : 0,
    cooldownActive: value.cooldownActive === true,
    capReached: value.capReached === true,
    suppressionActive: value.suppressionActive === true,
    proposedContentType: sanitizeContentType(value.proposedContentType),
    previewOnly: value.previewOnly !== false,
  };
}

function loadDecisionStore(): ConversationDecisionStore {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const items = isRecord(parsed) && Array.isArray(parsed.items) ? parsed.items : [];
    return {
      items: items
        .map((item) => sanitizeDecisionRecord(item))
        .filter((item): item is ConversationDecisionRecord => Boolean(item))
        .sort((left, right) => right.timestamp - left.timestamp)
        .slice(0, MAX_DECISION_RECORDS),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[conversation] could not load decisions from ${DATA_FILE}.`, error);
    }

    return {
      items: [],
    };
  }
}

function flushDecisionStore() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify({ items: decisionStore.items.slice(0, MAX_DECISION_RECORDS) }, null, 2));
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[conversation] could not save decisions to ${DATA_FILE}.`, error);
  }
}

function scheduleDecisionFlush() {
  if (flushTimeout) {
    return;
  }

  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushDecisionStore();
  }, DECISION_FLUSH_DELAY_MS);
}

function createDecisionId(timestamp: number) {
  nextDecisionSequence = (nextDecisionSequence + 1) % Number.MAX_SAFE_INTEGER;
  return `${timestamp.toString(36)}-${nextDecisionSequence.toString(36)}`;
}

function hashAuthorId(authorId: string) {
  return crypto.createHash("sha256").update(authorId).digest("hex").slice(0, 20);
}

function getLocalDateKey(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSensitiveContext(content: string) {
  return sensitivePatterns.some((pattern) => pattern.test(content));
}

function getModeEnabled(mode: ConversationParticipationMode) {
  const settings = getConversationParticipationSettings();

  switch (mode) {
    case "direct-mention":
      return settings.directMentionsEnabled;
    case "inline-reply":
      return settings.inlineRepliesEnabled;
    case "lull-prompt":
      return settings.lullPromptsEnabled;
    case "lull-trivia":
      return settings.lullTriviaEnabled;
  }
}

function getModeCooldownMs(mode: ConversationParticipationMode) {
  const settings = getConversationParticipationSettings();

  switch (mode) {
    case "direct-mention":
      return 0;
    case "inline-reply":
      return settings.inlineReplyCooldownMs;
    case "lull-prompt":
      return settings.lullPromptCooldownMs;
    case "lull-trivia":
      return settings.lullTriviaCooldownMs;
  }
}

function getOrCreateChannelState(channelId: string): ChannelConversationState {
  const current = conversationStateByChannelId.get(channelId);

  if (current) {
    return current;
  }

  const now = Date.now();
  const nextState: ChannelConversationState = {
    channelId,
    channelName: null,
    recentHumanMessages: [],
    botConversationPosts: [],
    lastDecisionStateByMode: {},
    lastDecisionReasonByMode: {},
    lastWouldSendAtByMode: {},
    lastPassiveBotPostAt: null,
    humansAfterLastPassiveBotPost: 0,
    dailyCountsDateKey: getLocalDateKey(now),
    dailyCount: 0,
    dailyTriviaCount: 0,
  };

  conversationStateByChannelId.set(channelId, nextState);
  return nextState;
}

function pruneChannelState(state: ChannelConversationState, now: number) {
  const maxWindow = Math.max(
    getConversationParticipationSettings().activeConversationWindowMs,
    getConversationParticipationSettings().deadChannelCutoffMs,
    getConversationParticipationSettings().noResponseWindowMs,
  );
  const cutoff = now - maxWindow - 60 * 60 * 1000;
  state.recentHumanMessages = state.recentHumanMessages
    .filter((message) => message.timestamp >= cutoff)
    .slice(-MAX_RECENT_HUMAN_MESSAGES);
  state.botConversationPosts = state.botConversationPosts.filter((post) => post.timestamp >= now - 24 * 60 * 60 * 1000);

  const dateKey = getLocalDateKey(now);
  if (state.dailyCountsDateKey !== dateKey) {
    state.dailyCountsDateKey = dateKey;
    state.dailyCount = 0;
    state.dailyTriviaCount = 0;
  }
}

function getWindowHumanMessages(state: ChannelConversationState, now: number) {
  const cutoff = now - getConversationParticipationSettings().activeConversationWindowMs;
  return state.recentHumanMessages.filter((message) => message.timestamp >= cutoff);
}

function getDistinctHumanCount(messages: readonly RecentHumanMessage[]) {
  return new Set(messages.map((message) => message.authorHash)).size;
}

function getLastHumanMessageAt(state: ChannelConversationState) {
  return state.recentHumanMessages.at(-1)?.timestamp ?? null;
}

function getBotHumanRatio(state: ChannelConversationState, humanMessageCount: number, now: number) {
  const cutoff = now - 30 * 60 * 1000;
  const botCount = state.botConversationPosts.filter((post) => post.timestamp >= cutoff).length;
  return humanMessageCount > 0 ? botCount / humanMessageCount : botCount;
}

function getConversationTopic(channelId: string, recentMessages: readonly RecentHumanMessage[]) {
  const channelTopic = getChannelTopic(channelId);
  const profile = getChannelProfile(channelId);
  const profileTopic = profile?.topicOverride ?? null;
  const signalScores = getPassiveTopicSignalScores(recentMessages.map((message) => message.normalizedContent))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);
  const topSignal = signalScores[0] ?? null;

  return {
    channelTopic,
    profile,
    profileTopic,
    signalScores,
    resolvedTopic: (topSignal?.topic ?? profileTopic ?? channelTopic) as Topic,
    topSignal,
  };
}

function scoreRelevance(input: {
  channelId: string;
  mode: ConversationParticipationMode;
  content: string | null;
  recentMessages: readonly RecentHumanMessage[];
}) {
  const topicContext = getConversationTopic(input.channelId, input.recentMessages);
  let score = 0;
  const matchedTopics: string[] = [];
  let proposedContentType: ContentType | null = null;

  if (input.content) {
    const matchedReaction = findPassiveReaction(input.content, topicContext.resolvedTopic);

    if (matchedReaction) {
      score += 2;
      matchedTopics.push(matchedReaction.intent);
      proposedContentType = matchedReaction.intent === "help" || matchedReaction.intent === "newcomer" ? "prompt" : "joke";
    }
  }

  if (topicContext.profileTopic && topicContext.profileTopic === topicContext.resolvedTopic) {
    score += 1;
    matchedTopics.push(`profile:${topicContext.profileTopic}`);
  } else if (topicContext.profile?.purpose && topicContext.profile.purpose === topicContext.resolvedTopic) {
    score += 1;
    matchedTopics.push(`profile:${topicContext.profile.purpose}`);
  }

  if (topicContext.topSignal && topicContext.topSignal.score >= 2) {
    score += 1;
    matchedTopics.push(`signal:${topicContext.topSignal.topic}`);
  }

  if (input.content && isSensitiveContext(input.content)) {
    score -= 2;
    matchedTopics.push("excluded:sensitive-context");
  }

  if (input.mode === "lull-trivia") {
    proposedContentType = "trivia";
  } else if (input.mode === "lull-prompt") {
    proposedContentType = "prompt";
  } else if (input.mode === "inline-reply") {
    proposedContentType = proposedContentType ?? "fact";
  }

  return {
    score,
    matchedTopics: [...new Set(matchedTopics)],
    proposedContentType,
    topicContext,
  };
}

function getSafetyBlock(input: {
  state: ChannelConversationState;
  mode: ConversationParticipationMode;
  content: string | null;
  now: number;
  directMention: boolean;
}) {
  const settings = getConversationParticipationSettings();
  const globalSettings = getBotSettings();
  const operationalStatus = getChannelOperationalStatus(input.state.channelId, input.now);
  const profile = getChannelProfile(input.state.channelId);
  const channelMode = settings.channelModes[input.state.channelId] ?? null;
  const explicitlyAllowed = channelMode === "allowed" || channelMode === "preview-only";

  if (!globalSettings.globalAutomationEnabled) {
    return "global automation is off";
  }

  if (!settings.enabled) {
    return "conversational participation is off";
  }

  if (!operationalStatus.channelAutomationEnabled) {
    return "channel automation is off";
  }

  if (!getModeEnabled(input.mode)) {
    return `${input.mode} mode is off`;
  }

  if (channelMode === "off") {
    return "channel participation is off";
  }

  if (!settings.eligibleChannelIds.has(input.state.channelId) && !explicitlyAllowed) {
    return "channel is not allowed for conversational participation";
  }

  if (profile && (profile.accessMode === "announcement" || profile.accessMode === "private") && !explicitlyAllowed) {
    return "channel profile requires explicit opt-in";
  }

  if (input.content && isLikelyCommandMessage(input.content)) {
    return "message is command-like";
  }

  if (input.content && isSensitiveContext(input.content)) {
    return "context appears sensitive or moderation-related";
  }

  const activeTriviaSession = getActiveTriviaSessionSnapshotForChannel(input.state.channelId);
  if (activeTriviaSession && input.mode !== "direct-mention") {
    return "a trivia session is already active";
  }

  return null;
}

function buildResult(input: {
  state: ChannelConversationState;
  mode: ConversationParticipationMode;
  decisionState: ConversationParticipationState;
  decision: ConversationParticipationDecision;
  reason: string;
  humanMessageCount: number;
  distinctHumanCount: number;
  relevanceScore: number;
  matchedTopics: string[];
  botHumanRatio: number;
  cooldownActive?: boolean;
  capReached?: boolean;
  suppressionActive?: boolean;
  proposedContentType?: ContentType | null;
  now: number;
}) {
  return {
    timestamp: input.now,
    channelId: input.state.channelId,
    channelName: input.state.channelName,
    mode: input.mode,
    state: input.decisionState,
    decision: input.decision,
    reason: input.reason,
    humanMessageCount: input.humanMessageCount,
    distinctHumanCount: input.distinctHumanCount,
    relevanceScore: input.relevanceScore,
    matchedTopics: input.matchedTopics,
    botHumanRatio: input.botHumanRatio,
    cooldownActive: input.cooldownActive === true,
    capReached: input.capReached === true,
    suppressionActive: input.suppressionActive === true,
    proposedContentType: input.proposedContentType ?? null,
    previewOnly: true,
  } satisfies ConversationParticipationResult;
}

function shouldPersistDecision(result: ConversationParticipationResult, state: ChannelConversationState) {
  if (result.decision === "would-send") {
    return true;
  }

  const previousState = state.lastDecisionStateByMode[result.mode];
  const previousReason = state.lastDecisionReasonByMode[result.mode];

  if (previousState !== result.state || previousReason !== result.reason) {
    return true;
  }

  return result.suppressionActive || result.capReached || result.cooldownActive;
}

function recordDecision(result: ConversationParticipationResult) {
  const state = getOrCreateChannelState(result.channelId);

  if (!shouldPersistDecision(result, state)) {
    return result;
  }

  state.lastDecisionStateByMode[result.mode] = result.state;
  state.lastDecisionReasonByMode[result.mode] = result.reason;

  const item: ConversationDecisionRecord = {
    id: createDecisionId(result.timestamp),
    ...result,
  };
  decisionStore.items.unshift(item);
  decisionStore.items.splice(MAX_DECISION_RECORDS);
  scheduleDecisionFlush();
  return result;
}

export function recordConversationParticipationMessage(input: ConversationParticipationInput) {
  const now = input.timestamp ?? Date.now();
  const settings = getConversationParticipationSettings();
  const state = getOrCreateChannelState(input.channelId);
  state.channelName = input.channelName ?? state.channelName;
  pruneChannelState(state, now);

  if (input.isBot) {
    return;
  }

  if (!passesMessageQualityThresholds(input.content, getBotSettings().passiveChat.minNonSpaceChars, getBotSettings().passiveChat.minWordCount)) {
    return;
  }

  const normalizedContent = normalizeChatMessage(input.content);

  if (!normalizedContent || isLikelyCommandMessage(normalizedContent)) {
    return;
  }

  state.recentHumanMessages.push({
    timestamp: now,
    authorHash: hashAuthorId(input.authorId),
    normalizedContent,
  });
  state.recentHumanMessages = state.recentHumanMessages.slice(-Math.max(settings.minHumanMessages, MAX_RECENT_HUMAN_MESSAGES));

  if (state.lastPassiveBotPostAt && now > state.lastPassiveBotPostAt) {
    state.humansAfterLastPassiveBotPost += 1;
  }
}

export function recordConversationParticipationBotPost(
  channelId: string,
  mode: ConversationParticipationMode,
  postedAt = Date.now(),
) {
  const state = getOrCreateChannelState(channelId);
  pruneChannelState(state, postedAt);
  state.botConversationPosts.push({ timestamp: postedAt, mode });
  state.lastPassiveBotPostAt = postedAt;
  state.humansAfterLastPassiveBotPost = 0;
  state.dailyCount += 1;
  if (mode === "lull-trivia") {
    state.dailyTriviaCount += 1;
  }
}

export function evaluateConversationParticipation(
  channelId: string,
  mode: ConversationParticipationMode,
  options?: {
    now?: number;
    channelName?: string | null;
    content?: string | null;
    directMention?: boolean;
  },
) {
  const now = options?.now ?? Date.now();
  const settings = getConversationParticipationSettings();
  const state = getOrCreateChannelState(channelId);
  state.channelName = options?.channelName ?? state.channelName;
  pruneChannelState(state, now);

  const windowMessages = getWindowHumanMessages(state, now);
  const humanMessageCount = windowMessages.length;
  const distinctHumanCount = getDistinctHumanCount(windowMessages);
  const lastHumanMessageAt = getLastHumanMessageAt(state);
  const botHumanRatio = getBotHumanRatio(state, Math.max(1, humanMessageCount), now);
  const latestContent = options?.content ? normalizeChatMessage(options.content) : state.recentHumanMessages.at(-1)?.normalizedContent ?? null;
  const safetyBlock = getSafetyBlock({
    state,
    mode,
    content: latestContent,
    now,
    directMention: options?.directMention === true,
  });
  const relevance = scoreRelevance({
    channelId,
    mode,
    content: latestContent,
    recentMessages: windowMessages,
  });

  if (safetyBlock) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "DISABLED",
      decision: "skipped",
      reason: safetyBlock,
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (mode === "direct-mention") {
    const eligible = relevance.score >= settings.relevanceThreshold || options?.directMention === true;
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: eligible ? "ELIGIBLE_INLINE_REPLY" : "OBSERVING",
      decision: eligible ? "would-send" : "skipped",
      reason: eligible ? "direct mention would receive a contextual reply in preview mode" : "direct mention topic was unclear",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      proposedContentType: relevance.proposedContentType ?? "prompt",
      now,
    }));
  }

  if (!lastHumanMessageAt) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "OBSERVING",
      decision: "skipped",
      reason: "waiting for human activity",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (now - lastHumanMessageAt > settings.deadChannelCutoffMs) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "OBSERVING",
      decision: "skipped",
      reason: "conversation is too old",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (state.lastPassiveBotPostAt && state.humansAfterLastPassiveBotPost === 0) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "SUPPRESSED",
      decision: "skipped",
      reason: "no human activity occurred after the previous passive bot post",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      suppressionActive: true,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (
    state.lastPassiveBotPostAt &&
    now - state.lastPassiveBotPostAt >= settings.noResponseWindowMs &&
    state.humansAfterLastPassiveBotPost < settings.suppressionRecoveryHumanMessages
  ) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "SUPPRESSED",
      decision: "skipped",
      reason: "suppressed because the last bot post received no response",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      suppressionActive: true,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (humanMessageCount < settings.minHumanMessages || distinctHumanCount < settings.minDistinctHumans) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "OBSERVING",
      decision: "skipped",
      reason: "waiting for more people",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (state.lastPassiveBotPostAt && state.humansAfterLastPassiveBotPost === 0) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "SUPPRESSED",
      decision: "skipped",
      reason: "no human activity occurred after the previous passive bot post",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      suppressionActive: true,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (
    state.lastPassiveBotPostAt &&
    now - state.lastPassiveBotPostAt >= settings.noResponseWindowMs &&
    state.humansAfterLastPassiveBotPost < settings.suppressionRecoveryHumanMessages
  ) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "SUPPRESSED",
      decision: "skipped",
      reason: "suppressed because the last bot post received no response",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      suppressionActive: true,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (botHumanRatio > 1 / settings.botRatioHumanMessages) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "SUPPRESSED",
      decision: "skipped",
      reason: "bot-to-human message ratio is too high",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      suppressionActive: true,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (state.dailyCount >= settings.dailyChannelCap || (mode === "lull-trivia" && state.dailyTriviaCount >= settings.dailyTriviaCap)) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "SUPPRESSED",
      decision: "skipped",
      reason: mode === "lull-trivia" ? "daily trivia cap reached" : "daily channel cap reached",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      capReached: true,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  const lastWouldSendAt = state.lastWouldSendAtByMode[mode] ?? 0;
  const cooldownMs = getModeCooldownMs(mode);
  if (cooldownMs > 0 && now - lastWouldSendAt < cooldownMs) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "COOLDOWN",
      decision: "skipped",
      reason: "mode cooldown is active",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      cooldownActive: true,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  if (mode === "inline-reply") {
    const eligible = relevance.score >= settings.relevanceThreshold;
    const result = buildResult({
      state,
      mode,
      decisionState: eligible ? "ELIGIBLE_INLINE_REPLY" : "ACTIVE_CONVERSATION",
      decision: eligible ? "would-send" : "skipped",
      reason: eligible ? "relevant inline reply would fit in preview mode" : "topic was unclear",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      proposedContentType: relevance.proposedContentType,
      now,
    });
    if (eligible) {
      state.lastWouldSendAtByMode[mode] = now;
    }
    return recordDecision(result);
  }

  const requiredLullMs = mode === "lull-trivia" ? settings.triviaLullMs : settings.promptLullMs;
  const lullElapsed = now - lastHumanMessageAt;

  if (lullElapsed < requiredLullMs) {
    return recordDecision(buildResult({
      state,
      mode,
      decisionState: "LULL_PENDING",
      decision: "skipped",
      reason: "waiting for a natural lull",
      humanMessageCount,
      distinctHumanCount,
      relevanceScore: relevance.score,
      matchedTopics: relevance.matchedTopics,
      botHumanRatio,
      proposedContentType: relevance.proposedContentType,
      now,
    }));
  }

  const hasTopic = relevance.matchedTopics.some((topic) => topic.startsWith("signal:") || topic.startsWith("profile:"));
  const eligible = mode === "lull-trivia" ? relevance.score >= settings.relevanceThreshold && hasTopic : hasTopic;
  const result = buildResult({
    state,
    mode,
    decisionState: eligible ? "ELIGIBLE_LULL_POST" : "ACTIVE_CONVERSATION",
    decision: eligible ? "would-send" : "skipped",
    reason: eligible
      ? mode === "lull-trivia"
        ? "lull trivia would fit in preview mode"
        : "lull prompt would fit in preview mode"
      : "topic was unclear",
    humanMessageCount,
    distinctHumanCount,
    relevanceScore: relevance.score,
    matchedTopics: relevance.matchedTopics,
    botHumanRatio,
    proposedContentType: relevance.proposedContentType,
    now,
  });
  if (eligible) {
    state.lastWouldSendAtByMode[mode] = now;
  }
  return recordDecision(result);
}

export function handleConversationParticipationMessage(input: ConversationParticipationInput) {
  recordConversationParticipationMessage(input);

  if (input.isBot) {
    return null;
  }

  const options = {
    ...(input.timestamp !== undefined ? { now: input.timestamp } : {}),
    ...(input.channelName !== undefined ? { channelName: input.channelName } : {}),
    content: input.content,
  };

  if (input.isDirectMention) {
    return evaluateConversationParticipation(input.channelId, "direct-mention", {
      ...options,
      directMention: true,
    });
  }

  return evaluateConversationParticipation(input.channelId, "inline-reply", options);
}

export function evaluateConversationParticipationChannels(now = Date.now()) {
  const settings = getConversationParticipationSettings();
  const channelIds = new Set<string>([
    ...settings.eligibleChannelIds,
    ...Object.keys(settings.channelModes),
    ...conversationStateByChannelId.keys(),
  ]);
  const results: ConversationParticipationResult[] = [];

  for (const channelId of channelIds) {
    results.push(evaluateConversationParticipation(channelId, "lull-prompt", { now }));
    results.push(evaluateConversationParticipation(channelId, "lull-trivia", { now }));
  }

  return results;
}

export function shouldSuppressLegacyPassiveChat() {
  const settings = getConversationParticipationSettings();
  return settings.previewMode && (
    settings.directMentionsEnabled ||
    settings.inlineRepliesEnabled ||
    settings.lullPromptsEnabled ||
    settings.lullTriviaEnabled
  );
}

export function getRecentConversationDecisions(limit = 50) {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, MAX_DECISION_RECORDS) : 50;
  return decisionStore.items.slice(0, safeLimit);
}

export function clearConversationParticipationForTests() {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
  conversationStateByChannelId.clear();
  decisionStore.items.splice(0, decisionStore.items.length);
}

export function getConversationParticipationStatus(now = Date.now()) {
  const settings = getConversationParticipationSettings();
  const channelStates = [...conversationStateByChannelId.values()].map((state) => {
    pruneChannelState(state, now);
    const windowMessages = getWindowHumanMessages(state, now);
    return {
      channelId: state.channelId,
      channelName: state.channelName,
      humanMessageCount: windowMessages.length,
      distinctHumanCount: getDistinctHumanCount(windowMessages),
      lastHumanMessageAt: getLastHumanMessageAt(state),
      lastPassiveBotPostAt: state.lastPassiveBotPostAt,
      humansAfterLastPassiveBotPost: state.humansAfterLastPassiveBotPost,
      dailyCount: state.dailyCount,
      dailyTriviaCount: state.dailyTriviaCount,
    };
  });

  return {
    previewOnly: settings.previewMode,
    masterEnabled: settings.enabled,
    modes: {
      directMentions: settings.directMentionsEnabled,
      inlineReplies: settings.inlineRepliesEnabled,
      lullPrompts: settings.lullPromptsEnabled,
      lullTrivia: settings.lullTriviaEnabled,
    },
    settings: {
      activeConversationWindowMs: settings.activeConversationWindowMs,
      minHumanMessages: settings.minHumanMessages,
      minDistinctHumans: settings.minDistinctHumans,
      promptLullMs: settings.promptLullMs,
      triviaLullMs: settings.triviaLullMs,
      deadChannelCutoffMs: settings.deadChannelCutoffMs,
      dailyChannelCap: settings.dailyChannelCap,
      dailyTriviaCap: settings.dailyTriviaCap,
      botRatioHumanMessages: settings.botRatioHumanMessages,
      noResponseWindowMs: settings.noResponseWindowMs,
      suppressionRecoveryHumanMessages: settings.suppressionRecoveryHumanMessages,
      relevanceThreshold: settings.relevanceThreshold,
    },
    channelModes: settings.channelModes,
    channelStates,
    recentDecisions: getRecentConversationDecisions(50),
  };
}

const conversationStateByChannelId = new Map<string, ChannelConversationState>();
const decisionStore = loadDecisionStore();
