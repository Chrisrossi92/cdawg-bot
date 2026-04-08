import type { Message } from "discord.js";
import { passiveChatConfig } from "../config/passive-chat.js";
import type { Topic } from "../config/topics.js";
import { passesMessageQualityThresholds, isLikelyCommandMessage, normalizeChatMessage } from "../lib/chat-messages.js";
import { getChannelTopic, getContentMessage, pickRandomItem } from "../lib/content.js";
import type { ContentType } from "../lib/content-provider.js";
import { getMatchedPassiveReaction, getPassiveTopicSignalScores } from "../lib/passive-content.js";

type ChannelPassiveState = {
  lastUserMessageAt: number;
  recentMessages: string[];
  messagesSinceBotInteraction: number;
};

type PassiveReplyCandidate =
  | {
      kind: "keyword";
      topic: Topic;
      reply: string;
      reason: string;
    }
  | {
      kind: "smart";
      topic: Topic;
      contentType: ContentType;
      reason: string;
    };

let lastPassiveReplyAt = 0;
const lastPassiveReplyAtByChannelId = new Map<string, number>();
const recentPassiveRepliesByChannelId = new Map<string, string[]>();
const passiveStateByChannelId = new Map<string, ChannelPassiveState>();

function logPassiveDecision(message: Message, reason: string, details?: string) {
  if (!passiveChatConfig.debugLogging) {
    return;
  }

  const suffix = details ? ` ${details}` : "";
  console.log(`[passive-chat] channel=${message.channelId} author=${message.author.id} reason=${reason}${suffix}`);
}

function rememberPassiveReply(channelId: string, reply: string) {
  const recentReplies = recentPassiveRepliesByChannelId.get(channelId) ?? [];
  const nextReplies = [...recentReplies.filter((entry) => entry !== reply), reply];
  recentPassiveRepliesByChannelId.set(channelId, nextReplies.slice(-passiveChatConfig.recentReplyMemorySize));
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
  const nextMessages = [...state.recentMessages, normalizedContent];
  state.recentMessages = nextMessages.slice(-passiveChatConfig.recentMessageMemorySize);
}

function getBiasedTopic(channelTopic: Topic, recentMessages: readonly string[]) {
  if (channelTopic !== "general") {
    return channelTopic;
  }

  const topicScores = getPassiveTopicSignalScores(recentMessages)
    .filter((entry) => entry.score >= passiveChatConfig.topicBiasMinimumMatches)
    .sort((left, right) => right.score - left.score);
  const topScore = topicScores[0];
  const secondScore = topicScores[1];

  if (!topScore || (secondScore && secondScore.score === topScore.score)) {
    return channelTopic;
  }

  return topScore.topic;
}

function getConversationNudgeContentType() {
  return pickRandomItem(passiveChatConfig.conversationNudgeContentTypes) ?? "prompt";
}

function getKeywordCandidate(message: Message, normalizedContent: string, topic: Topic): PassiveReplyCandidate | undefined {
  const recentReplies = recentPassiveRepliesByChannelId.get(message.channelId) ?? [];
  const matchedReaction = getMatchedPassiveReaction(normalizedContent, topic, recentReplies);

  if (!matchedReaction) {
    return undefined;
  }

  return {
    kind: "keyword",
    topic,
    reply: matchedReaction.reply,
    reason: `keyword intent=${matchedReaction.reaction.intent} key=${matchedReaction.reaction.key}`,
  };
}

function getSmartCandidate(
  state: ChannelPassiveState,
  previousLastUserMessageAt: number,
  topic: Topic,
  now: number,
): PassiveReplyCandidate | undefined {
  if (
    previousLastUserMessageAt > 0 &&
    now - previousLastUserMessageAt >= passiveChatConfig.quietChannelThresholdMs
  ) {
    return {
      kind: "smart",
      topic,
      contentType: "prompt",
      reason: "smart low-activity contentType=prompt",
    };
  }

  if (state.messagesSinceBotInteraction < passiveChatConfig.conversationNudgeMessageThreshold) {
    return undefined;
  }

  return {
    kind: "smart",
    topic,
    contentType: getConversationNudgeContentType(),
    reason: `smart conversation-nudge messagesSinceBot=${state.messagesSinceBotInteraction}`,
  };
}

function passesPassiveCooldowns(message: Message, candidate: PassiveReplyCandidate, now: number) {
  const lastChannelReplyAt = lastPassiveReplyAtByChannelId.get(message.channelId) ?? 0;

  if (Math.random() >= passiveChatConfig.triggerChance) {
    logPassiveDecision(message, "skip.chance-gate", `topic=${candidate.topic} ${candidate.reason}`);
    return false;
  }

  if (now - lastPassiveReplyAt < passiveChatConfig.globalCooldownMs) {
    logPassiveDecision(message, "skip.global-cooldown", `topic=${candidate.topic} ${candidate.reason}`);
    return false;
  }

  if (now - lastChannelReplyAt < passiveChatConfig.channelCooldownMs) {
    logPassiveDecision(message, "skip.channel-cooldown", `topic=${candidate.topic} ${candidate.reason}`);
    return false;
  }

  return true;
}

async function resolveSmartReply(
  message: Message,
  candidate: Extract<PassiveReplyCandidate, { kind: "smart" }>,
): Promise<string | undefined> {
  const reply = await getContentMessage(candidate.contentType, candidate.topic, message.channelId);

  if (!reply) {
    logPassiveDecision(
      message,
      "skip.smart-empty",
      `topic=${candidate.topic} contentType=${candidate.contentType} reason=${candidate.reason}`,
    );
    return undefined;
  }

  return reply;
}

function markPassiveInteraction(channelId: string, reply: string) {
  lastPassiveReplyAt = Date.now();
  lastPassiveReplyAtByChannelId.set(channelId, lastPassiveReplyAt);
  rememberPassiveReply(channelId, reply);

  const state = passiveStateByChannelId.get(channelId);

  if (state) {
    state.messagesSinceBotInteraction = 0;
  }
}

export async function handlePassiveChatMessage(message: Message) {
  if (!passiveChatConfig.enabled || message.author.bot) {
    return;
  }

  if (!passiveChatConfig.eligibleChannelIds.has(message.channelId)) {
    logPassiveDecision(message, "skip.channel-not-allowlisted");
    return;
  }

  if (isLikelyCommandMessage(message.content)) {
    logPassiveDecision(message, "skip.command-like");
    return;
  }

  if (
    !passesMessageQualityThresholds(
      message.content,
      passiveChatConfig.minNonSpaceChars,
      passiveChatConfig.minWordCount,
    )
  ) {
    logPassiveDecision(message, "skip.low-quality");
    return;
  }

  const normalizedContent = normalizeChatMessage(message.content);

  if (!normalizedContent) {
    logPassiveDecision(message, "skip.empty");
    return;
  }

  const now = Date.now();
  const state = getOrCreateChannelState(message.channelId);
  const previousLastUserMessageAt = state.lastUserMessageAt;

  state.lastUserMessageAt = now;
  state.messagesSinceBotInteraction += 1;
  rememberChannelMessage(state, normalizedContent);

  const channelTopic = getChannelTopic(message.channelId);
  const engagementTopic = getBiasedTopic(channelTopic, state.recentMessages);

  if (engagementTopic !== channelTopic) {
    logPassiveDecision(message, "topic.bias", `channelTopic=${channelTopic} engagementTopic=${engagementTopic}`);
  }

  const candidate =
    getKeywordCandidate(message, normalizedContent, engagementTopic) ??
    getSmartCandidate(state, previousLastUserMessageAt, engagementTopic, now);

  if (!candidate) {
    logPassiveDecision(message, "skip.no-match", `topic=${engagementTopic} messagesSinceBot=${state.messagesSinceBotInteraction}`);
    return;
  }

  if (!passesPassiveCooldowns(message, candidate, now)) {
    return;
  }

  if (!("send" in message.channel)) {
    logPassiveDecision(message, "skip.channel-not-sendable");
    return;
  }

  const reply =
    candidate.kind === "keyword" ? candidate.reply : await resolveSmartReply(message, candidate);

  if (!reply) {
    return;
  }

  markPassiveInteraction(message.channelId, reply);

  logPassiveDecision(message, "send", `topic=${candidate.topic} ${candidate.reason}`);

  await message.channel.send(reply);
}
