import type { Topic } from "../config/topics.js";
import { passiveReactions as generalPassiveReactions } from "../content/passive/general.js";
import { passiveReactions as palworldPassiveReactions } from "../content/passive/palworld.js";
import { passiveReactions as valheimPassiveReactions } from "../content/passive/valheim.js";
import { pickRandomItem } from "./content.js";

export type PassiveReaction = {
  key: string;
  intent: string;
  triggers: readonly string[];
  responses: readonly string[];
};

export type MatchedPassiveReaction = {
  reaction: PassiveReaction;
  reply: string;
};

const passiveReactionsByTopic: Partial<Record<Topic, readonly PassiveReaction[]>> = {
  general: generalPassiveReactions,
  palworld: palworldPassiveReactions,
  valheim: valheimPassiveReactions,
};

const passiveTopicSignalReactions: Partial<Record<Topic, readonly PassiveReaction[]>> = {
  palworld: palworldPassiveReactions,
  valheim: valheimPassiveReactions,
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordMatchesMessage(content: string, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const pattern = escapeRegExp(normalizedKeyword).replace(/\s+/g, "\\s+");
  return new RegExp(`(?:^|\\b)${pattern}(?:\\b|$)`, "i").test(content);
}

function pickPassiveReplyAvoidingRecent(
  responses: readonly string[],
  recentReplies: readonly string[],
): string | undefined {
  const availableReplies = responses.filter((response) => !recentReplies.includes(response));
  const pool = availableReplies.length > 0 ? availableReplies : responses;
  return pickRandomItem(pool);
}

export function getPassiveReactionsForTopic(topic: Topic): readonly PassiveReaction[] {
  if (topic === "general") {
    return generalPassiveReactions;
  }

  return [...generalPassiveReactions, ...(passiveReactionsByTopic[topic] ?? [])];
}

export function findPassiveReaction(content: string, topic: Topic): PassiveReaction | undefined {
  return getPassiveReactionsForTopic(topic).find((reaction) =>
    reaction.triggers.some((keyword) => keywordMatchesMessage(content, keyword)),
  );
}

export function getPassiveTopicSignalScores(messages: readonly string[]) {
  return Object.entries(passiveTopicSignalReactions).map(([topic, reactions]) => ({
    topic: topic as Topic,
    score: messages.reduce(
      (total, message) =>
        total +
        reactions.reduce(
          (reactionTotal, reaction) =>
            reactionTotal + (reaction.triggers.some((keyword) => keywordMatchesMessage(message, keyword)) ? 1 : 0),
          0,
        ),
      0,
    ),
  }));
}

export function getMatchedPassiveReaction(
  content: string,
  topic: Topic,
  recentReplies: readonly string[] = [],
): MatchedPassiveReaction | undefined {
  const reaction = findPassiveReaction(content, topic);

  if (!reaction) {
    return undefined;
  }

  const reply = pickPassiveReplyAvoidingRecent(reaction.responses, recentReplies);

  if (!reply) {
    return undefined;
  }

  return {
    reaction,
    reply,
  };
}
