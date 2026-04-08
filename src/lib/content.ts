import { DEFAULT_TOPIC, channelTopics } from "../config/channel-topics.js";
import { topics, type Topic } from "../config/topics.js";
import type { TriviaItem } from "../content/trivia/general.js";
import type { ContentItem, ContentProvider, ContentType } from "./content-provider.js";
import { localContentProvider } from "./local-content-provider.js";

const RECENT_ITEMS_TO_REMEMBER = 3;
const contentProviders: readonly ContentProvider[] = [localContentProvider];
const recentItemKeysByScopeContent = new Map<string, string[]>();

export type { ContentType } from "./content-provider.js";

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

function getScopeContentKey(contentType: ContentType, channelId?: string) {
  return `${channelId ?? "global"}:${contentType}`;
}

function rememberRecentItem(contentType: ContentType, itemKey: string, channelId?: string) {
  const historyKey = getScopeContentKey(contentType, channelId);
  const currentHistory = recentItemKeysByScopeContent.get(historyKey) ?? [];
  const nextHistory = [...currentHistory.filter((key) => key !== itemKey), itemKey];
  recentItemKeysByScopeContent.set(historyKey, nextHistory.slice(-RECENT_ITEMS_TO_REMEMBER));
}

function getRecentItemKeys(contentType: ContentType, channelId?: string) {
  return recentItemKeysByScopeContent.get(getScopeContentKey(contentType, channelId)) ?? [];
}

function getItemKey<T extends ContentType>(contentType: T, item: ContentItem<T>) {
  if (contentType === "trivia") {
    return (item as TriviaItem).question;
  }

  return item as string;
}

function pickRandomItemAvoidingRecent<T extends ContentType>(
  contentType: T,
  items: readonly ContentItem<T>[],
  channelId?: string,
): ContentItem<T> | undefined {
  const recentKeys = getRecentItemKeys(contentType, channelId);
  const availableItems = items.filter((item) => !recentKeys.includes(getItemKey(contentType, item)));
  const pool = availableItems.length > 0 ? availableItems : items;
  return pickRandomItem(pool);
}

function getProviderItems<T extends ContentType>(contentType: T, topic: Topic) {
  for (const provider of contentProviders) {
    const result = provider.getItems({ contentType, topic });

    if (result && result.items.length > 0) {
      return result;
    }
  }

  return undefined;
}

export function getContentItem<T extends ContentType>(
  contentType: T,
  topic: Topic,
  channelId?: string,
): ContentItem<T> | undefined {
  const providerResult = getProviderItems(contentType, topic);

  if (!providerResult) {
    return undefined;
  }

  const item = pickRandomItemAvoidingRecent(contentType, providerResult.items, channelId);

  if (!item) {
    return undefined;
  }

  rememberRecentItem(contentType, getItemKey(contentType, item), channelId);
  return item;
}

export function getResolvedContentItem<T extends ContentType>(
  contentType: T,
  topic: string | null,
  channelId: string | null,
): ContentItem<T> | undefined {
  const resolvedTopic = resolveTopic(topic, channelId);
  return getContentItem(contentType, resolvedTopic, channelId ?? undefined);
}

export function getFactText(topic: Topic, channelId?: string): string | undefined {
  return getContentItem("fact", topic, channelId);
}

export function formatFactMessage(fact: string): string {
  return `**Cdawg Bot Fact Drop**\n${fact}`;
}

export function getJokeText(topic: Topic, channelId?: string): string | undefined {
  return getContentItem("joke", topic, channelId);
}

export function formatJokeMessage(joke: string): string {
  return `**Cdawg Bot Joke Drop**\n${joke}`;
}

export function getWyrText(topic: Topic, channelId?: string): string | undefined {
  return getContentItem("wyr", topic, channelId);
}

export function formatWyrMessage(prompt: string): string {
  return `**Would You Rather...**\n${prompt}`;
}

export function getPromptText(topic: Topic, channelId?: string): string | undefined {
  return getContentItem("prompt", topic, channelId);
}

export function formatPromptMessage(prompt: string): string {
  return `**Cdawg Bot Discussion Prompt**\n${prompt}`;
}

export function getTriviaItem(topic: Topic, channelId?: string): TriviaItem | undefined {
  return getContentItem("trivia", topic, channelId);
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
  switch (contentType) {
    case "fact": {
      const fact = getContentItem(contentType, topic, channelId);
      return fact ? formatFactMessage(fact) : undefined;
    }
    case "joke": {
      const joke = getContentItem(contentType, topic, channelId);
      return joke ? formatJokeMessage(joke) : undefined;
    }
    case "wyr": {
      const prompt = getContentItem(contentType, topic, channelId);
      return prompt ? formatWyrMessage(prompt) : undefined;
    }
    case "prompt": {
      const prompt = getContentItem(contentType, topic, channelId);
      return prompt ? formatPromptMessage(prompt) : undefined;
    }
    case "trivia": {
      const item = getContentItem(contentType, topic, channelId);
      return item ? formatTriviaMessage(item) : undefined;
    }
  }
}
