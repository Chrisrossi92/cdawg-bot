import type { Message } from "discord.js";
import { passiveChatConfig } from "../config/passive-chat.js";
import { passesMessageQualityThresholds, isLikelyCommandMessage, normalizeChatMessage } from "../lib/chat-messages.js";
import { getChannelTopic } from "../lib/content.js";
import { getPassiveReactionReply } from "../lib/passive-content.js";

let lastPassiveReplyAt = 0;
const lastPassiveReplyAtByChannelId = new Map<string, number>();

export async function handlePassiveChatMessage(message: Message) {
  if (!passiveChatConfig.enabled || message.author.bot) {
    return;
  }

  if (!passiveChatConfig.eligibleChannelIds.has(message.channelId)) {
    return;
  }

  if (isLikelyCommandMessage(message.content)) {
    return;
  }

  if (
    !passesMessageQualityThresholds(
      message.content,
      passiveChatConfig.minNonSpaceChars,
      passiveChatConfig.minWordCount,
    )
  ) {
    return;
  }

  const normalizedContent = normalizeChatMessage(message.content);

  if (!normalizedContent) {
    return;
  }

  const topic = getChannelTopic(message.channelId);
  const reply = getPassiveReactionReply(normalizedContent, topic);

  if (!reply) {
    return;
  }

  if (Math.random() >= passiveChatConfig.triggerChance) {
    return;
  }

  const now = Date.now();
  const lastChannelReplyAt = lastPassiveReplyAtByChannelId.get(message.channelId) ?? 0;

  if (now - lastPassiveReplyAt < passiveChatConfig.globalCooldownMs) {
    return;
  }

  if (now - lastChannelReplyAt < passiveChatConfig.channelCooldownMs) {
    return;
  }

  if (!("send" in message.channel)) {
    return;
  }

  lastPassiveReplyAt = now;
  lastPassiveReplyAtByChannelId.set(message.channelId, now);

  await message.channel.send(reply);
}
