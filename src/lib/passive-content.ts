import type { Topic } from "../config/topics.js";
import { passiveReactions as generalPassiveReactions } from "../content/passive/general.js";
import { passiveReactions as palworldPassiveReactions } from "../content/passive/palworld.js";
import { passiveReactions as valheimPassiveReactions } from "../content/passive/valheim.js";
import { pickRandomItem } from "./content.js";

export type PassiveReaction = {
  key: string;
  keywords: readonly string[];
  responses: readonly string[];
};

const passiveReactionsByTopic: Partial<Record<Topic, readonly PassiveReaction[]>> = {
  general: generalPassiveReactions,
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

export function getPassiveReactionsForTopic(topic: Topic): readonly PassiveReaction[] {
  if (topic === "general") {
    return generalPassiveReactions;
  }

  return [...generalPassiveReactions, ...(passiveReactionsByTopic[topic] ?? [])];
}

export function findPassiveReaction(content: string, topic: Topic): PassiveReaction | undefined {
  return getPassiveReactionsForTopic(topic).find((reaction) =>
    reaction.keywords.some((keyword) => keywordMatchesMessage(content, keyword)),
  );
}

export function getPassiveReactionReply(content: string, topic: Topic): string | undefined {
  const reaction = findPassiveReaction(content, topic);

  if (!reaction) {
    return undefined;
  }

  return pickRandomItem(reaction.responses);
}
