import { DEFAULT_TOPIC, channelTopics } from "../config/channel-topics.js";
import { topics, type Topic } from "../config/topics.js";
import { facts as generalFacts } from "../content/facts/general.js";
import { facts as historyFacts } from "../content/facts/history.js";
import { facts as palworldFacts } from "../content/facts/palworld.js";
import { facts as pokemonFacts } from "../content/facts/pokemon.js";
import { facts as valheimFacts } from "../content/facts/valheim.js";
import { prompts as generalDiscussionPrompts } from "../content/prompts/general.js";
import { prompts as genealogyPrompts } from "../content/prompts/genealogy.js";
import { prompts as harryPotterPrompts } from "../content/prompts/harry-potter.js";
import { prompts as historyDiscussionPrompts } from "../content/prompts/history.js";
import { prompts as musicPrompts } from "../content/prompts/music.js";
import { prompts as palworldPrompts } from "../content/prompts/palworld.js";
import { prompts as pokemonDiscussionPrompts } from "../content/prompts/pokemon.js";
import { prompts as valheimPrompts } from "../content/prompts/valheim.js";
import { trivia as generalTrivia, type TriviaItem } from "../content/trivia/general.js";
import { trivia as historyTrivia } from "../content/trivia/history.js";
import { trivia as palworldTrivia } from "../content/trivia/palworld.js";
import { trivia as pokemonTrivia } from "../content/trivia/pokemon.js";
import { trivia as valheimTrivia } from "../content/trivia/valheim.js";
import { wyrPrompts as generalWyrPrompts } from "../content/wyr/general.js";
import { wyrPrompts as historyWyrPrompts } from "../content/wyr/history.js";
import { wyrPrompts as pokemonWyrPrompts } from "../content/wyr/pokemon.js";
import { wyrPrompts as valheimWyrPrompts } from "../content/wyr/valheim.js";

export type ContentType = "fact" | "wyr" | "prompt" | "trivia";
const RECENT_ITEMS_TO_REMEMBER = 3;

const factsByTopic: Partial<Record<Topic, readonly string[]>> = {
  general: generalFacts,
  history: historyFacts,
  palworld: palworldFacts,
  pokemon: pokemonFacts,
  valheim: valheimFacts,
};

const wyrPromptsByTopic: Partial<Record<Topic, readonly string[]>> = {
  general: generalWyrPrompts,
  history: historyWyrPrompts,
  pokemon: pokemonWyrPrompts,
  valheim: valheimWyrPrompts,
};

const discussionPromptsByTopic: Partial<Record<Topic, readonly string[]>> = {
  general: generalDiscussionPrompts,
  history: historyDiscussionPrompts,
  genealogy: genealogyPrompts,
  palworld: palworldPrompts,
  pokemon: pokemonDiscussionPrompts,
  "harry-potter": harryPotterPrompts,
  music: musicPrompts,
  valheim: valheimPrompts,
};

const triviaByTopic: Partial<Record<Topic, readonly TriviaItem[]>> = {
  general: generalTrivia,
  history: historyTrivia,
  pokemon: pokemonTrivia,
  palworld: palworldTrivia,
  valheim: valheimTrivia,
};

let lastFact: string | null = null;
const recentItemKeysByChannelContent = new Map<string, string[]>();

export function getChannelTopic(channelId: string | null): Topic {
  if (!channelId) {
    return DEFAULT_TOPIC;
  }

  return channelTopics[channelId] ?? DEFAULT_TOPIC;
}

export function resolveTopic(topic: string | null, channelId: string | null): Topic {
  if (topic && topics.includes(topic as Topic)) {
    return topic as Topic;
  }

  return getChannelTopic(channelId);
}

export function pickRandomItem<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  return items[Math.floor(Math.random() * items.length)];
}

function getChannelContentKey(channelId: string, contentType: ContentType): string {
  return `${channelId}:${contentType}`;
}

function pickRandomItemAvoidingRecent<T>(
  items: readonly T[],
  recentKeys: readonly string[],
  getItemKey: (item: T) => string,
): T | undefined {
  const availableItems = items.filter((item) => !recentKeys.includes(getItemKey(item)));
  const pool = availableItems.length > 0 ? availableItems : items;
  return pickRandomItem(pool);
}

function rememberRecentItem(channelId: string, contentType: ContentType, itemKey: string) {
  const historyKey = getChannelContentKey(channelId, contentType);
  const currentHistory = recentItemKeysByChannelContent.get(historyKey) ?? [];
  const nextHistory = [...currentHistory.filter((key) => key !== itemKey), itemKey];
  const trimmedHistory = nextHistory.slice(-RECENT_ITEMS_TO_REMEMBER);

  recentItemKeysByChannelContent.set(historyKey, trimmedHistory);
}

export function getFactText(topic: Topic): string | undefined {
  const topicFacts = factsByTopic[topic] ?? generalFacts;
  const availableFacts = topicFacts.filter((fact) => fact !== lastFact);
  const pool = availableFacts.length > 0 ? availableFacts : topicFacts;
  const randomFact = pickRandomItem(pool);

  if (!randomFact) {
    return undefined;
  }

  lastFact = randomFact;
  return randomFact;
}

export function formatFactMessage(fact: string): string {
  return `**Cdawg Bot Fact Drop**\n${fact}`;
}

export function getWyrText(topic: Topic): string | undefined {
  const prompts = wyrPromptsByTopic[topic] ?? generalWyrPrompts;
  return pickRandomItem(prompts);
}

export function formatWyrMessage(prompt: string): string {
  return `**Would You Rather...**\n${prompt}`;
}

export function getPromptText(topic: Topic): string | undefined {
  const prompts = discussionPromptsByTopic[topic] ?? generalDiscussionPrompts;
  return pickRandomItem(prompts);
}

export function formatPromptMessage(prompt: string): string {
  return `**Cdawg Bot Discussion Prompt**\n${prompt}`;
}

export function getTriviaItem(topic: Topic): TriviaItem | undefined {
  const triviaPool = triviaByTopic[topic] ?? generalTrivia;
  return pickRandomItem(triviaPool);
}

export function formatTriviaMessage(item: TriviaItem): string {
  const [optionA, optionB, optionC, optionD] = item.options;

  return `**Cdawg Bot Trivia**\n${item.question}\n\nA. ${optionA}\nB. ${optionB}\nC. ${optionC}\nD. ${optionD}\n\nAnswer: ||${item.answer}||`;
}

export function getContentMessage(
  contentType: ContentType,
  topic: Topic,
  channelId?: string,
): string | undefined {
  const recentKeys = channelId
    ? recentItemKeysByChannelContent.get(getChannelContentKey(channelId, contentType)) ?? []
    : [];

  switch (contentType) {
    case "fact": {
      const topicFacts = factsByTopic[topic] ?? generalFacts;
      const fact = channelId
        ? pickRandomItemAvoidingRecent(topicFacts, recentKeys, (item) => item)
        : getFactText(topic);

      if (channelId && fact) {
        rememberRecentItem(channelId, contentType, fact);
      }

      return fact ? formatFactMessage(fact) : undefined;
    }
    case "wyr": {
      const prompts = wyrPromptsByTopic[topic] ?? generalWyrPrompts;
      const prompt = channelId
        ? pickRandomItemAvoidingRecent(prompts, recentKeys, (item) => item)
        : getWyrText(topic);

      if (channelId && prompt) {
        rememberRecentItem(channelId, contentType, prompt);
      }

      return prompt ? formatWyrMessage(prompt) : undefined;
    }
    case "prompt": {
      const prompts = discussionPromptsByTopic[topic] ?? generalDiscussionPrompts;
      const prompt = channelId
        ? pickRandomItemAvoidingRecent(prompts, recentKeys, (item) => item)
        : getPromptText(topic);

      if (channelId && prompt) {
        rememberRecentItem(channelId, contentType, prompt);
      }

      return prompt ? formatPromptMessage(prompt) : undefined;
    }
    case "trivia": {
      const triviaPool = triviaByTopic[topic] ?? generalTrivia;
      const item = channelId
        ? pickRandomItemAvoidingRecent(triviaPool, recentKeys, (entry) => entry.question)
        : getTriviaItem(topic);

      if (channelId && item) {
        rememberRecentItem(channelId, contentType, item.question);
      }

      return item ? formatTriviaMessage(item) : undefined;
    }
  }
}
