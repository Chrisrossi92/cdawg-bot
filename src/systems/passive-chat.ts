import type { AttachmentBuilder, Client, Message } from "discord.js";
import { DOG_ENABLED } from "../config/dog.js";
import { getPassiveChatSettings } from "../config/passive-chat.js";
import type { Topic } from "../config/topics.js";
import { buildDogStatusMessage } from "../lib/cdawg-dog.js";
import { passesMessageQualityThresholds, isLikelyCommandMessage, normalizeChatMessage } from "../lib/chat-messages.js";
import { getChannelTopic, pickRandomItem } from "../lib/content.js";
import type { ContentType } from "../lib/content-provider.js";
import { getPassiveTopicSignalScores } from "../lib/passive-content.js";
import { pushManualContentToChannel } from "../lib/manual-content-push.js";
import { recordPassiveChatTrigger } from "./bot-metrics.js";
import { getDogPassivePrompt, getDogStatusSummary, recordDogPassivePrompt } from "./cdawg-dog.js";
import { getAutomatedContentBlock } from "./channel-operations.js";
import { recordAutomatedContentSend } from "./channel-automation-status.js";

type ChannelPassiveState = {
  lastUserMessageAt: number;
  recentMessages: string[];
  messagesSinceBotInteraction: number;
};

type PassiveReplyCandidate =
  | {
      kind: "smart";
      topic: Topic;
      contentType: ContentType;
      reason: string;
    }
  | {
      kind: "dog";
      topic: Topic;
      reply: {
        content: string;
        files: AttachmentBuilder[];
      };
      reason: string;
    };

let lastPassiveReplyAt = 0;
const lastPassiveReplyAtByChannelId = new Map<string, number>();
const passiveStateByChannelId = new Map<string, ChannelPassiveState>();

function logPassiveDecision(channelId: string, reason: string, details?: string, authorId?: string) {
  if (!getPassiveChatSettings().debugLogging) {
    return;
  }

  const parts = [`channel=${channelId}`];

  if (authorId) {
    parts.push(`author=${authorId}`);
  }

  parts.push(`reason=${reason}`);

  if (details) {
    parts.push(details);
  }

  console.log(`[passive-chat] ${parts.join(" ")}`);
}

function getOrCreateChannelState(channelId: string): ChannelPassiveState {
  const existingState = passiveStateByChannelId.get(channelId);

  if (existingState) {
    return existingState;
  }

  const nextState: ChannelPassiveState = {
    lastUserMessageAt: 0,
    recentMessages: [],
    messagesSinceBotInteraction: 0,
  };

  passiveStateByChannelId.set(channelId, nextState);
  return nextState;
}

function rememberChannelMessage(state: ChannelPassiveState, normalizedContent: string) {
  const settings = getPassiveChatSettings();
  const nextMessages = [...state.recentMessages, normalizedContent];
  state.recentMessages = nextMessages.slice(-settings.recentMessageMemorySize);
}

function getBiasedTopic(channelTopic: Topic, recentMessages: readonly string[]) {
  if (channelTopic !== "general") {
    return channelTopic;
  }

  const settings = getPassiveChatSettings();
  const topicScores = getPassiveTopicSignalScores(recentMessages)
    .filter((entry) => entry.score >= settings.topicBiasMinimumMatches)
    .sort((left, right) => right.score - left.score);
  const topScore = topicScores[0];
  const secondScore = topicScores[1];

  if (!topScore || (secondScore && secondScore.score === topScore.score)) {
    return channelTopic;
  }

  return topScore.topic;
}

function getConversationNudgeContentType() {
  return pickRandomItem(getPassiveChatSettings().conversationNudgeContentTypes) ?? "prompt";
}

function getSmartCandidate(state: ChannelPassiveState, topic: Topic): PassiveReplyCandidate {
  const settings = getPassiveChatSettings();

  if (state.messagesSinceBotInteraction < settings.conversationNudgeMessageThreshold) {
    return {
      kind: "smart",
      topic,
      contentType: "prompt",
      reason: "smart quiet-gap contentType=prompt",
    };
  }

  const contentType = getConversationNudgeContentType();
  return {
    kind: "smart",
    topic,
    contentType,
    reason: `smart quiet-gap conversation-nudge contentType=${contentType} messagesSinceBot=${state.messagesSinceBotInteraction}`,
  };
}

function getDogCandidate(topic: Topic): PassiveReplyCandidate | undefined {
  if (!DOG_ENABLED) {
    return undefined;
  }

  const dogPrompt = getDogPassivePrompt();

  if (!dogPrompt) {
    return undefined;
  }

  const dogState = getDogStatusSummary();

  return {
    kind: "dog",
    topic,
    reason: `dog ${dogPrompt.reason}`,
    reply: buildDogStatusMessage({
      title: "**Cdawg Dog**",
      state: dogState,
      imageKey: dogPrompt.imageKey,
      extraLine: dogPrompt.content,
    }),
  };
}

function passesPassiveCooldowns(channelId: string, candidate: PassiveReplyCandidate, now: number) {
  const settings = getPassiveChatSettings();
  const lastChannelReplyAt = lastPassiveReplyAtByChannelId.get(channelId) ?? 0;

  if (Math.random() >= settings.triggerChance) {
    logPassiveDecision(channelId, "skip.chance-gate", `topic=${candidate.topic} ${candidate.reason}`);
    return false;
  }

  if (now - lastPassiveReplyAt < settings.globalCooldownMs) {
    logPassiveDecision(channelId, "skip.global-cooldown", `topic=${candidate.topic} ${candidate.reason}`);
    return false;
  }

  if (now - lastChannelReplyAt < settings.channelCooldownMs) {
    logPassiveDecision(channelId, "skip.channel-cooldown", `topic=${candidate.topic} ${candidate.reason}`);
    return false;
  }

  return true;
}

function markPassiveInteraction(channelId: string, sentAt = Date.now()) {
  lastPassiveReplyAt = sentAt;
  lastPassiveReplyAtByChannelId.set(channelId, sentAt);

  const state = passiveStateByChannelId.get(channelId);

  if (state) {
    state.messagesSinceBotInteraction = 0;
  }
}

function getPassiveTriggerType(candidate: Extract<PassiveReplyCandidate, { kind: "smart" }>) {
  return candidate.contentType === "prompt" ? ("quiet-gap" as const) : ("conversation-nudge" as const);
}

function hasQuietGapElapsed(state: ChannelPassiveState, now: number) {
  return state.lastUserMessageAt > 0 && now - state.lastUserMessageAt >= getPassiveChatSettings().quietChannelThresholdMs;
}

async function evaluatePassiveChatChannel(client: Client, channelId: string, now: number) {
  const state = passiveStateByChannelId.get(channelId);

  if (!state || !hasQuietGapElapsed(state, now)) {
    return;
  }

  const channelTopic = getChannelTopic(channelId);
  const engagementTopic = getBiasedTopic(channelTopic, state.recentMessages);

  if (engagementTopic !== channelTopic) {
    logPassiveDecision(channelId, "topic.bias", `channelTopic=${channelTopic} engagementTopic=${engagementTopic}`);
  }

  const candidate = getDogCandidate(engagementTopic) ?? getSmartCandidate(state, engagementTopic);

  if (!passesPassiveCooldowns(channelId, candidate, now)) {
    return;
  }

  const automationBlock = getAutomatedContentBlock(channelId, "passive-chat", now);

  if (automationBlock.blocked) {
    logPassiveDecision(
      channelId,
      `skip.channel-${automationBlock.reason}`,
      `blockedUntil=${automationBlock.blockedUntil ?? "unknown"}`,
    );
    return;
  }

  const channel = await client.channels.fetch(channelId);

  if (!channel || !channel.isTextBased() || !("send" in channel)) {
    logPassiveDecision(channelId, "skip.channel-not-sendable");
    return;
  }

  if (candidate.kind === "dog") {
    await channel.send(candidate.reply);
    recordDogPassivePrompt(candidate.reason.includes("hungry") ? "hungry" : candidate.reason.includes("tired") ? "tired" : "sad", now);
    markPassiveInteraction(channelId, now);
    recordAutomatedContentSend(channelId, "passive-chat", now);
    logPassiveDecision(channelId, "send", `topic=${candidate.topic} ${candidate.reason}`);
    return;
  }

  const topicOverride = candidate.topic !== channelTopic ? candidate.topic : undefined;
  const pushResult = await pushManualContentToChannel(client, {
    channelId,
    contentType: candidate.contentType,
    source: "passive-chat",
    ...(topicOverride ? { topicOverride } : {}),
  });

  if (!pushResult.ok) {
    logPassiveDecision(channelId, "skip.content-unavailable", `contentType=${candidate.contentType} code=${pushResult.code}`);
    return;
  }

  recordPassiveChatTrigger(getPassiveTriggerType(candidate));
  markPassiveInteraction(channelId, now);
  recordAutomatedContentSend(channelId, "passive-chat", now);
  logPassiveDecision(channelId, "send", `topic=${candidate.topic} ${candidate.reason}`);
}

export async function evaluatePassiveChatChannels(client: Client, now = Date.now()) {
  const settings = getPassiveChatSettings();

  if (!settings.enabled || !client.isReady()) {
    return;
  }

  for (const channelId of settings.eligibleChannelIds) {
    try {
      await evaluatePassiveChatChannel(client, channelId, now);
    } catch (error) {
      console.error(`[passive-chat] failed to evaluate channel=${channelId}:`, error);
    }
  }
}

export async function handlePassiveChatMessage(message: Message) {
  const settings = getPassiveChatSettings();

  if (!settings.enabled || message.author.bot) {
    return;
  }

  if (!settings.eligibleChannelIds.has(message.channelId)) {
    logPassiveDecision(message.channelId, "skip.channel-not-allowlisted", undefined, message.author.id);
    return;
  }

  if (isLikelyCommandMessage(message.content)) {
    logPassiveDecision(message.channelId, "skip.command-like", undefined, message.author.id);
    return;
  }

  if (
    !passesMessageQualityThresholds(
      message.content,
      settings.minNonSpaceChars,
      settings.minWordCount,
    )
  ) {
    logPassiveDecision(message.channelId, "skip.low-quality", undefined, message.author.id);
    return;
  }

  const normalizedContent = normalizeChatMessage(message.content);

  if (!normalizedContent) {
    logPassiveDecision(message.channelId, "skip.empty", undefined, message.author.id);
    return;
  }

  const state = getOrCreateChannelState(message.channelId);
  state.lastUserMessageAt = Date.now();
  state.messagesSinceBotInteraction += 1;
  rememberChannelMessage(state, normalizedContent);

  logPassiveDecision(
    message.channelId,
    "activity-recorded",
    `messagesSinceBot=${state.messagesSinceBotInteraction}`,
    message.author.id,
  );
}
