import { DEFAULT_TOPIC, channelTopics } from "../config/channel-topics.js";
import { topics, type Topic } from "../config/topics.js";
import type { TriviaItem } from "../content/trivia/general.js";
import { apiFactProvider } from "./api-fact-provider.js";
import { apiTriviaProvider } from "./api-trivia-provider.js";
import type { ContentItem, ContentProvider, ContentType } from "./content-provider.js";
import { logContentProviderEvent } from "./content-provider-logging.js";
import { apiJokeProvider } from "./api-joke-provider.js";
import { localContentProvider } from "./local-content-provider.js";
import { recordContentProviderFallbackToLocal, recordContentProviderUsage } from "../systems/bot-metrics.js";

const RECENT_ITEMS_TO_REMEMBER = 3;
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

function buildProviderRequest<T extends ContentType>(
  contentType: T,
  topic: Topic,
  recentItemKeys: readonly string[],
  channelId?: string,
) {
  return {
    contentType,
    topic,
    recentItemKeys,
    ...(channelId ? { channelId } : {}),
  };
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

async function getProviderItems<T extends ContentType>(
  contentType: T,
  topic: Topic,
  channelId?: string,
) {
  const recentItemKeys = getRecentItemKeys(contentType, channelId);
  const providerRequest = buildProviderRequest(contentType, topic, recentItemKeys, channelId);

  if (contentType === "fact") {
    const localTopicResult = await localContentProvider.getItems(providerRequest);

    if (topic !== "general" && localTopicResult?.sourceTopic === topic && localTopicResult.items.length > 0) {
      logContentProviderEvent(contentType, "provider-selected", {
        provider: localTopicResult.providerName,
        topic,
        sourceTopic: localTopicResult.sourceTopic,
        channelId,
        reason: "topic-local-preferred",
      });
      return localTopicResult;
    }

    const apiResult = await apiFactProvider.getItems(providerRequest);

    if (apiResult && apiResult.items.length > 0) {
      logContentProviderEvent(contentType, "provider-selected", {
        provider: apiResult.providerName,
        topic,
        sourceTopic: apiResult.sourceTopic,
        channelId,
        reason: "api-selected",
      });
      return apiResult;
    }

    if (localTopicResult && localTopicResult.items.length > 0) {
      recordContentProviderFallbackToLocal(contentType, localTopicResult.providerName);
      logContentProviderEvent(contentType, "fallback-local", {
        provider: localTopicResult.providerName,
        topic,
        sourceTopic: localTopicResult.sourceTopic,
        channelId,
        reason: "api-unavailable",
      });
      return localTopicResult;
    }

    logContentProviderEvent(contentType, "provider-miss", {
      topic,
      channelId,
      reason: "no-fact-provider-result",
    });
    return undefined;
  }

  if (contentType === "joke") {
    const localTopicResult = await localContentProvider.getItems(providerRequest);

    if (topic !== "general" && localTopicResult?.sourceTopic === topic && localTopicResult.items.length > 0) {
      logContentProviderEvent(contentType, "provider-selected", {
        provider: localTopicResult.providerName,
        topic,
        sourceTopic: localTopicResult.sourceTopic,
        channelId,
        reason: "topic-local-preferred",
      });
      return localTopicResult;
    }

    const apiResult = await apiJokeProvider.getItems(providerRequest);

    if (apiResult && apiResult.items.length > 0) {
      logContentProviderEvent(contentType, "provider-selected", {
        provider: apiResult.providerName,
        topic,
        sourceTopic: apiResult.sourceTopic,
        channelId,
        reason: "api-selected",
      });
      return apiResult;
    }

    if (localTopicResult && localTopicResult.items.length > 0) {
      recordContentProviderFallbackToLocal(contentType, localTopicResult.providerName);
      logContentProviderEvent(contentType, "fallback-local", {
        provider: localTopicResult.providerName,
        topic,
        sourceTopic: localTopicResult.sourceTopic,
        channelId,
        reason: "api-unavailable",
      });
      return localTopicResult;
    }

    logContentProviderEvent(contentType, "provider-miss", {
      topic,
      channelId,
      reason: "no-joke-provider-result",
    });
    return undefined;
  }

  if (contentType === "trivia") {
    const localTopicResult = await localContentProvider.getItems(providerRequest);

    if (topic !== "general" && localTopicResult?.sourceTopic === topic && localTopicResult.items.length > 0) {
      logContentProviderEvent(contentType, "provider-selected", {
        provider: localTopicResult.providerName,
        topic,
        sourceTopic: localTopicResult.sourceTopic,
        channelId,
        reason: "topic-local-preferred",
      });
      return localTopicResult;
    }

    const apiResult = await apiTriviaProvider.getItems(providerRequest);

    if (apiResult && apiResult.items.length > 0) {
      logContentProviderEvent(contentType, "provider-selected", {
        provider: apiResult.providerName,
        topic,
        sourceTopic: apiResult.sourceTopic,
        channelId,
        reason: "api-selected",
      });
      return apiResult;
    }

    if (localTopicResult && localTopicResult.items.length > 0) {
      recordContentProviderFallbackToLocal(contentType, localTopicResult.providerName);
      logContentProviderEvent(contentType, "fallback-local", {
        provider: localTopicResult.providerName,
        topic,
        sourceTopic: localTopicResult.sourceTopic,
        channelId,
        reason: "api-unavailable",
      });
      return localTopicResult;
    }

    logContentProviderEvent(contentType, "provider-miss", {
      topic,
      channelId,
      reason: "no-trivia-provider-result",
    });
    return undefined;
  }

  const contentProviders: readonly ContentProvider[] = [localContentProvider];

  for (const provider of contentProviders) {
    const result = await provider.getItems(buildProviderRequest(contentType, topic, recentItemKeys, channelId));

    if (result && result.items.length > 0) {
      logContentProviderEvent(contentType, "provider-selected", {
        provider: result.providerName,
        topic,
        sourceTopic: result.sourceTopic,
        channelId,
        reason: "local-selected",
      });
      return result;
    }
  }

  logContentProviderEvent(contentType, "provider-miss", {
    topic,
    channelId,
    reason: "no-provider-result",
  });
  return undefined;
}

export async function getContentItem<T extends ContentType>(
  contentType: T,
  topic: Topic,
  channelId?: string,
): Promise<ContentItem<T> | undefined> {
  const providerResult = await getProviderItems(contentType, topic, channelId);

  if (!providerResult) {
    return undefined;
  }

  const item = pickRandomItemAvoidingRecent(contentType, providerResult.items, channelId);

  if (!item) {
    logContentProviderEvent(contentType, "selection-rejected", {
      provider: providerResult.providerName,
      topic,
      sourceTopic: providerResult.sourceTopic,
      channelId,
      reason: "recent-channel-history",
    });
    return undefined;
  }

  const itemKey = getItemKey(contentType, item);
  rememberRecentItem(contentType, itemKey, channelId);
  recordContentProviderUsage(contentType, providerResult.providerName);
  logContentProviderEvent(contentType, "item-selected", {
    provider: providerResult.providerName,
    topic,
    sourceTopic: providerResult.sourceTopic,
    channelId,
    itemKey,
  });
  return item;
}

export async function getResolvedContentItem<T extends ContentType>(
  contentType: T,
  topic: string | null,
  channelId: string | null,
): Promise<ContentItem<T> | undefined> {
  const resolvedTopic = resolveTopic(topic, channelId);
  return getContentItem(contentType, resolvedTopic, channelId ?? undefined);
}

export function getFactText(topic: Topic, channelId?: string): Promise<string | undefined> {
  return getContentItem("fact", topic, channelId);
}

export function formatFactMessage(fact: string): string {
  return `**Cdawg Bot Fact Drop**\n${fact}`;
}

export function getJokeText(topic: Topic, channelId?: string): Promise<string | undefined> {
  return getContentItem("joke", topic, channelId);
}

export function formatJokeMessage(joke: string): string {
  return `**Cdawg Bot Joke Drop**\n${joke}`;
}

export function getWyrText(topic: Topic, channelId?: string): Promise<string | undefined> {
  return getContentItem("wyr", topic, channelId);
}

export function formatWyrMessage(prompt: string): string {
  return `**Would You Rather...**\n${prompt}`;
}

export function getPromptText(topic: Topic, channelId?: string): Promise<string | undefined> {
  return getContentItem("prompt", topic, channelId);
}

export function formatPromptMessage(prompt: string): string {
  return `**Cdawg Bot Discussion Prompt**\n${prompt}`;
}

export function getTriviaItem(topic: Topic, channelId?: string): Promise<TriviaItem | undefined> {
  return getContentItem("trivia", topic, channelId);
}

export function formatTriviaMessage(item: TriviaItem): string {
  const [optionA, optionB, optionC, optionD] = item.options;

  return `**Cdawg Bot Trivia**\n${item.question}\n\nA. ${optionA}\nB. ${optionB}\nC. ${optionC}\nD. ${optionD}\n\nAnswer: ||${item.answer}||`;
}

export async function getContentMessage(
  contentType: ContentType,
  topic: Topic,
  channelId?: string,
): Promise<string | undefined> {
  switch (contentType) {
    case "fact": {
      const fact = await getContentItem(contentType, topic, channelId);
      return fact ? formatFactMessage(fact) : undefined;
    }
    case "joke": {
      const joke = await getContentItem(contentType, topic, channelId);
      return joke ? formatJokeMessage(joke) : undefined;
    }
    case "wyr": {
      const prompt = await getContentItem(contentType, topic, channelId);
      return prompt ? formatWyrMessage(prompt) : undefined;
    }
    case "prompt": {
      const prompt = await getContentItem(contentType, topic, channelId);
      return prompt ? formatPromptMessage(prompt) : undefined;
    }
    case "trivia": {
      const item = await getContentItem(contentType, topic, channelId);
      return item ? formatTriviaMessage(item) : undefined;
    }
  }
}
