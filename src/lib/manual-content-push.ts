import type { Client } from "discord.js";
import { resolveTopic, getContentMessage } from "./content.js";
import type { ContentType } from "./content-provider.js";
import type { Topic } from "../config/topics.js";
import { getChannelAutomationStatus, getNextAutomatedContentPlan, recordAutomatedContentSend } from "../systems/channel-automation-status.js";
import { postInteractiveTriviaSession, type TriviaSessionPresentation } from "./trivia-session.js";
import { getEligibleTriviaItem, type TriviaIneligibilityCode } from "./trivia-topic-eligibility.js";

export const manualPushContentTypes = ["joke", "prompt", "fact", "trivia"] as const;

export type ManualPushContentType = (typeof manualPushContentTypes)[number];

export type ManualContentPushRequest = {
  channelId: string;
  contentType: ContentType;
  topicOverride?: Topic | null;
  source?: "manual" | "feed" | "scheduler" | "command" | "passive-chat" | "daily-challenge";
  triviaPresentation?: TriviaSessionPresentation;
};

export type ManualContentPushResult =
  | {
      ok: true;
      channelId: string;
      contentType: ContentType;
      resolvedTopic: Topic;
      messageId: string;
    }
  | {
      ok: false;
      code: "BOT_NOT_READY" | "CHANNEL_NOT_FOUND" | "CHANNEL_NOT_SENDABLE" | "CONTENT_UNAVAILABLE" | "TRIVIA_INELIGIBLE";
      error: string;
      triviaIneligibilityCode?: TriviaIneligibilityCode;
      resolvedTopic?: Topic;
    };

export type TriggerAutomatedContentNowResult =
  | {
      ok: true;
      channelId: string;
      contentType: ContentType;
      source: "scheduler" | "passive-chat" | "feed";
      resolvedTopic: Topic;
      messageId: string;
    }
  | {
      ok: false;
      code:
        | "BOT_NOT_READY"
        | "CHANNEL_NOT_FOUND"
        | "CHANNEL_NOT_SENDABLE"
        | "CONTENT_UNAVAILABLE"
        | "TRIVIA_INELIGIBLE"
        | "CHANNEL_BLOCKED"
        | "NO_AUTOMATED_CONTENT_PLAN";
      error: string;
      triviaIneligibilityCode?: TriviaIneligibilityCode;
      resolvedTopic?: Topic;
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
    source: request.source ?? "manual",
    topicOverride: request.topicOverride ?? null,
    resolvedTopic,
  });

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

  if (request.contentType === "trivia") {
    const triviaResult = await getEligibleTriviaItem(request.channelId, request.topicOverride ?? null);

    if (!triviaResult.ok) {
      logManualPush("error", {
        contentType: request.contentType,
        channelId: request.channelId,
        source: request.source ?? "manual",
        resolvedTopic: triviaResult.resolvedTopic,
        reason: triviaResult.code,
      });
      return {
        ok: false,
        code:
          triviaResult.code === "no-eligible-trivia-available" && triviaResult.resolvedTopic === "general"
            ? "CONTENT_UNAVAILABLE"
            : "TRIVIA_INELIGIBLE",
        error: triviaResult.error,
        triviaIneligibilityCode: triviaResult.code,
        resolvedTopic: triviaResult.resolvedTopic,
      };
    }

    const sentMessage = await postInteractiveTriviaSession({
      item: triviaResult.item,
      source: request.source ?? "manual",
      ...(request.triviaPresentation ? { presentation: request.triviaPresentation } : {}),
      post: (payload) => channel.send(payload),
    });
    logManualPush("success", {
      contentType: request.contentType,
      channelId: request.channelId,
      source: request.source ?? "manual",
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

  const message = await getContentMessage(request.contentType as ContentType, resolvedTopic, request.channelId);

  if (!message) {
    logManualPush("error", {
      contentType: request.contentType,
      channelId: request.channelId,
      source: request.source ?? "manual",
      resolvedTopic,
      reason: "content-unavailable",
    });
    return {
      ok: false,
      code: "CONTENT_UNAVAILABLE",
      error: "No content is available for that request.",
    };
  }

  const sentMessage = await channel.send(message);
  logManualPush("success", {
    contentType: request.contentType,
    channelId: request.channelId,
    source: request.source ?? "manual",
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

function logAutomatedTrigger(
  event: "attempt" | "success" | "error",
  details: Record<string, string | null | undefined>,
) {
  const parts = [`event=${event}`];

  for (const [key, value] of Object.entries(details)) {
    if (value) {
      parts.push(`${key}=${value}`);
    }
  }

  console.log(`[automation-trigger] ${parts.join(" ")}`);
}

export async function triggerAutomatedContentNow(
  client: Client,
  request: { channelId: string },
): Promise<TriggerAutomatedContentNowResult> {
  const automationStatus = getChannelAutomationStatus(request.channelId);

  if (automationStatus.blockedReason) {
    logAutomatedTrigger("error", {
      channelId: request.channelId,
      reason: automationStatus.blockedReason,
    });
    return {
      ok: false,
      code: "CHANNEL_BLOCKED",
      error:
        automationStatus.blockedReason === "skip-next"
          ? "Skip-next is pending for this channel. Clear it before triggering automated content."
          : `Channel is currently blocked by ${automationStatus.blockedReason}.`,
    };
  }

  const nextPlan = getNextAutomatedContentPlan(request.channelId);

  if (!nextPlan) {
    logAutomatedTrigger("error", {
      channelId: request.channelId,
      reason: "no-automated-plan",
    });
    return {
      ok: false,
      code: "NO_AUTOMATED_CONTENT_PLAN",
      error: "No automated content plan is configured for that channel.",
    };
  }

  logAutomatedTrigger("attempt", {
    channelId: request.channelId,
    source: nextPlan.source,
    contentType: nextPlan.contentType,
  });

  const pushResult = await pushManualContentToChannel(client, {
    channelId: request.channelId,
    contentType: nextPlan.contentType,
    source: nextPlan.source,
  });

  if (!pushResult.ok) {
    logAutomatedTrigger("error", {
      channelId: request.channelId,
      source: nextPlan.source,
      contentType: nextPlan.contentType,
      reason: pushResult.code,
    });
    return pushResult;
  }

  recordAutomatedContentSend(request.channelId, nextPlan.source);
  logAutomatedTrigger("success", {
    channelId: request.channelId,
    source: nextPlan.source,
    contentType: nextPlan.contentType,
    messageId: pushResult.messageId,
  });

  return {
    ok: true,
    channelId: request.channelId,
    contentType: nextPlan.contentType,
    source: nextPlan.source,
    resolvedTopic: pushResult.resolvedTopic,
    messageId: pushResult.messageId,
  };
}
