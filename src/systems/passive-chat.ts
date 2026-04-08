import type { Message } from "discord.js";
import { passiveChatConfig } from "../config/passive-chat.js";
import { passesMessageQualityThresholds, isLikelyCommandMessage, normalizeChatMessage } from "../lib/chat-messages.js";
import { getChannelTopic } from "../lib/content.js";
import { getMatchedPassiveReaction } from "../lib/passive-content.js";

let lastPassiveReplyAt = 0;
const lastPassiveReplyAtByChannelId = new Map<string, number>();
const recentPassiveRepliesByChannelId = new Map<string, string[]>();

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

  const topic = getChannelTopic(message.channelId);
  const recentReplies = recentPassiveRepliesByChannelId.get(message.channelId) ?? [];
  const matchedReaction = getMatchedPassiveReaction(normalizedContent, topic, recentReplies);

  if (!matchedReaction) {
    logPassiveDecision(message, "skip.no-match", `topic=${topic}`);
    return;
  }

  if (Math.random() >= passiveChatConfig.triggerChance) {
    logPassiveDecision(
      message,
      "skip.chance-gate",
      `topic=${topic} intent=${matchedReaction.reaction.intent} key=${matchedReaction.reaction.key}`,
    );
    return;
  }

  const now = Date.now();
  const lastChannelReplyAt = lastPassiveReplyAtByChannelId.get(message.channelId) ?? 0;

  if (now - lastPassiveReplyAt < passiveChatConfig.globalCooldownMs) {
    logPassiveDecision(
      message,
      "skip.global-cooldown",
      `topic=${topic} intent=${matchedReaction.reaction.intent} key=${matchedReaction.reaction.key}`,
    );
    return;
  }

  if (now - lastChannelReplyAt < passiveChatConfig.channelCooldownMs) {
    logPassiveDecision(
      message,
      "skip.channel-cooldown",
      `topic=${topic} intent=${matchedReaction.reaction.intent} key=${matchedReaction.reaction.key}`,
    );
    return;
  }

  if (!("send" in message.channel)) {
    logPassiveDecision(message, "skip.channel-not-sendable");
    return;
  }

  lastPassiveReplyAt = now;
  lastPassiveReplyAtByChannelId.set(message.channelId, now);
  rememberPassiveReply(message.channelId, matchedReaction.reply);

  logPassiveDecision(
    message,
    "send",
    `topic=${topic} intent=${matchedReaction.reaction.intent} key=${matchedReaction.reaction.key}`,
  );

  await message.channel.send(matchedReaction.reply);
}
