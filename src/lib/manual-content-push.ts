import type { Client } from "discord.js";
import { resolveTopic, getContentMessage } from "./content.js";
import type { ContentType } from "./content-provider.js";
import type { Topic } from "../config/topics.js";

export const manualPushContentTypes = ["joke", "prompt", "fact", "trivia"] as const;

export type ManualPushContentType = (typeof manualPushContentTypes)[number];

export type ManualContentPushRequest = {
  channelId: string;
  contentType: ManualPushContentType;
  topicOverride?: Topic | null;
};

export type ManualContentPushResult =
  | {
      ok: true;
      channelId: string;
      contentType: ManualPushContentType;
      resolvedTopic: Topic;
      messageId: string;
    }
  | {
      ok: false;
      code: "BOT_NOT_READY" | "CHANNEL_NOT_FOUND" | "CHANNEL_NOT_SENDABLE" | "CONTENT_UNAVAILABLE";
      error: string;
    };

function logManualPush(
  event: "attempt" | "success" | "error",
  details: Record<string, string | null | undefined>,
) {
  const parts = [`event=${event}`];

  for (const [key, value] of Object.entries(details)) {
    if (value) {
      parts.push(`${key}=${value}`);
    }
  }

  console.log(`[manual-push] ${parts.join(" ")}`);
}

export async function pushManualContentToChannel(
  client: Client,
  request: ManualContentPushRequest,
): Promise<ManualContentPushResult> {
  if (!client.isReady()) {
    logManualPush("error", {
      contentType: request.contentType,
      channelId: request.channelId,
      reason: "bot-not-ready",
    });
    return {
      ok: false,
      code: "BOT_NOT_READY",
      error: "Bot is not ready.",
    };
  }

  const resolvedTopic = resolveTopic(request.topicOverride ?? null, request.channelId);
  logManualPush("attempt", {
    contentType: request.contentType,
    channelId: request.channelId,
    topicOverride: request.topicOverride ?? null,
    resolvedTopic,
  });

  const message = await getContentMessage(request.contentType as ContentType, resolvedTopic, request.channelId);

  if (!message) {
    logManualPush("error", {
      contentType: request.contentType,
      channelId: request.channelId,
      resolvedTopic,
      reason: "content-unavailable",
    });
    return {
      ok: false,
      code: "CONTENT_UNAVAILABLE",
      error: "No content is available for that request.",
    };
  }

  const channel = await client.channels.fetch(request.channelId);

  if (!channel) {
    logManualPush("error", {
      contentType: request.contentType,
      channelId: request.channelId,
      resolvedTopic,
      reason: "channel-not-found",
    });
    return {
      ok: false,
      code: "CHANNEL_NOT_FOUND",
      error: "Discord channel was not found.",
    };
  }

  if (!channel.isTextBased() || !("send" in channel)) {
    logManualPush("error", {
      contentType: request.contentType,
      channelId: request.channelId,
      resolvedTopic,
      reason: "channel-not-sendable",
    });
    return {
      ok: false,
      code: "CHANNEL_NOT_SENDABLE",
      error: "Discord channel is not sendable.",
    };
  }

  const sentMessage = await channel.send(message);
  logManualPush("success", {
    contentType: request.contentType,
    channelId: request.channelId,
    resolvedTopic,
    messageId: sentMessage.id,
  });

  return {
    ok: true,
    channelId: request.channelId,
    contentType: request.contentType,
    resolvedTopic,
    messageId: sentMessage.id,
  };
}
