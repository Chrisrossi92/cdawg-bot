import { resolveTopic, getChannelTopic, getResolvedContentItem, getStrictContentItem } from "./content.js";
import type { Topic } from "../config/topics.js";
import { hasLocalContentPool } from "./local-content-provider.js";

export type TriviaIneligibilityCode =
  | "generic-trivia-blocked-for-themed-channel"
  | "channel-topic-mismatch"
  | "missing-topic-trivia-pool"
  | "no-eligible-trivia-available";

export type TriviaTopicEligibility =
  | {
      ok: true;
      channelTopic: Topic;
      resolvedTopic: Topic;
      requiresTopicStrictness: boolean;
    }
  | {
      ok: false;
      code: TriviaIneligibilityCode;
      error: string;
      channelTopic: Topic;
      resolvedTopic: Topic;
    };

export function getTriviaTopicEligibility(channelId: string, topicOverride?: Topic | null): TriviaTopicEligibility {
  const channelTopic = getChannelTopic(channelId);
  const resolvedTopic = resolveTopic(topicOverride ?? null, channelId);

  if (channelTopic !== "general") {
    if (resolvedTopic === "general") {
      return {
        ok: false,
        code: "generic-trivia-blocked-for-themed-channel",
        error: `Generic trivia is not eligible for the ${channelTopic} channel.`,
        channelTopic,
        resolvedTopic,
      };
    }

    if (resolvedTopic !== channelTopic) {
      return {
        ok: false,
        code: "channel-topic-mismatch",
        error: `Trivia for topic ${resolvedTopic} is not eligible for the ${channelTopic} channel.`,
        channelTopic,
        resolvedTopic,
      };
    }

    if (!hasLocalContentPool("trivia", channelTopic)) {
      return {
        ok: false,
        code: "missing-topic-trivia-pool",
        error: `No dedicated trivia pool exists yet for topic ${channelTopic}.`,
        channelTopic,
        resolvedTopic,
      };
    }

    return {
      ok: true,
      channelTopic,
      resolvedTopic,
      requiresTopicStrictness: true,
    };
  }

  if (resolvedTopic !== "general") {
    if (!hasLocalContentPool("trivia", resolvedTopic)) {
      return {
        ok: false,
        code: "missing-topic-trivia-pool",
        error: `No dedicated trivia pool exists yet for topic ${resolvedTopic}.`,
        channelTopic,
        resolvedTopic,
      };
    }

    return {
      ok: true,
      channelTopic,
      resolvedTopic,
      requiresTopicStrictness: true,
    };
  }

  return {
    ok: true,
    channelTopic,
    resolvedTopic,
    requiresTopicStrictness: false,
  };
}

export async function getEligibleTriviaItem(channelId: string, topicOverride?: Topic | null) {
  const eligibility = getTriviaTopicEligibility(channelId, topicOverride);

  if (!eligibility.ok) {
    return eligibility;
  }

  const item = eligibility.requiresTopicStrictness
    ? await getStrictContentItem("trivia", eligibility.resolvedTopic, channelId)
    : await getResolvedContentItem("trivia", eligibility.resolvedTopic, channelId);

  if (!item) {
    return {
      ok: false as const,
      code: "no-eligible-trivia-available" as const,
      error:
        eligibility.resolvedTopic === "general"
          ? "No trivia questions are available for that request."
          : `No eligible trivia questions are currently available for topic ${eligibility.resolvedTopic}.`,
      channelTopic: eligibility.channelTopic,
      resolvedTopic: eligibility.resolvedTopic,
    };
  }

  return {
    ok: true as const,
    item,
    channelTopic: eligibility.channelTopic,
    resolvedTopic: eligibility.resolvedTopic,
  };
}
