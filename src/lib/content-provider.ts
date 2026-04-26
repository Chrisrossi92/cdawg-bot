import type { Topic } from "../config/topics.js";
import type { ThisDayInHistoryEvent } from "../content/history/this-day.js";
import type { TriviaItem } from "../content/trivia/general.js";

export type ContentType = "fact" | "history" | "joke" | "wyr" | "prompt" | "trivia";

export type ContentItemMap = {
  fact: string;
  history: ThisDayInHistoryEvent;
  joke: string;
  wyr: string;
  prompt: string;
  trivia: TriviaItem;
};

export type ContentItem<T extends ContentType> = ContentItemMap[T];

export type ContentProviderRequest<T extends ContentType> = {
  contentType: T;
  topic: Topic;
  channelId?: string;
  recentItemKeys?: readonly string[];
};

export type ContentProviderResult<T extends ContentType> = {
  items: readonly ContentItem<T>[];
  sourceTopic: Topic;
  providerName: string;
};

export interface ContentProvider {
  readonly name: string;
  getItems<T extends ContentType>(
    request: ContentProviderRequest<T>,
  ): Promise<ContentProviderResult<T> | undefined>;
}
