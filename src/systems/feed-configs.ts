import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentType } from "../lib/content-provider.js";
import type { Topic } from "../config/topics.js";
import {
  getDailyAllowedWindowBlockedUntil,
  getDailyAllowedWindowNextStartAt,
  isWithinDailyAllowedWindow,
  type DailyAllowedWindow,
} from "../lib/allowed-window.js";

export type FeedConfig = {
  id: string;
  enabled: boolean;
  channelId: string;
  contentType: ContentType;
  cadenceMinutes: number;
  topicOverride: Topic | null;
  allowedWindow: FeedAllowedWindow | null;
  createdAt: number;
  updatedAt: number;
  lastExecutedAt: number | null;
};

export type FeedAllowedWindow = DailyAllowedWindow;

export type FeedOverlapWarning = {
  code: "AGGRESSIVE_CADENCE" | "SAME_CHANNEL_CONTENT_OVERLAP";
  message: string;
};

type FeedStore = {
  feeds: FeedConfig[];
};

type FeedPatch = Partial<Pick<FeedConfig, "enabled" | "channelId" | "contentType" | "cadenceMinutes" | "topicOverride" | "allowedWindow">>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FEEDS_DATA_DIR = path.resolve(__dirname, "../../data");
const FEEDS_DATA_FILE = path.join(FEEDS_DATA_DIR, "feed-configs.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

function sanitizeString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeContentType(value: unknown): ContentType | null {
  const allowedContentTypes: readonly ContentType[] = ["fact", "joke", "wyr", "prompt", "trivia"];
  return typeof value === "string" && allowedContentTypes.includes(value as ContentType) ? (value as ContentType) : null;
}

function sanitizeCadenceMinutes(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const normalizedValue = Math.floor(value);
  return normalizedValue >= 1 ? normalizedValue : null;
}

function sanitizeTopicOverride(value: unknown): Topic | null {
  return typeof value === "string" && value.trim().length > 0 ? (value.trim() as Topic) : null;
}

function sanitizeDailyTime(value: unknown) {
  return typeof value === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value.trim()) ? value.trim() : null;
}

function sanitizeAllowedWindow(value: unknown): FeedAllowedWindow | null {
  if (!isRecord(value)) {
    return null;
  }

  const startTime = sanitizeDailyTime(value.startTime);
  const endTime = sanitizeDailyTime(value.endTime);

  if (!startTime || !endTime || startTime === endTime) {
    return null;
  }

  return {
    startTime,
    endTime,
  };
}

function sanitizeFeedConfig(value: unknown): FeedConfig | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id);
  const channelId = sanitizeString(value.channelId);
  const contentType = sanitizeContentType(value.contentType);
  const cadenceMinutes = sanitizeCadenceMinutes(value.cadenceMinutes);
  const createdAt = sanitizeTimestamp(value.createdAt);
  const updatedAt = sanitizeTimestamp(value.updatedAt);

  if (!id || !channelId || !contentType || !cadenceMinutes || !createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    enabled: value.enabled !== false,
    channelId,
    contentType,
    cadenceMinutes,
    topicOverride: sanitizeTopicOverride(value.topicOverride),
    allowedWindow: sanitizeAllowedWindow(value.allowedWindow),
    createdAt,
    updatedAt,
    lastExecutedAt: sanitizeTimestamp(value.lastExecutedAt),
  };
}

function sanitizeFeedStore(value: unknown): FeedStore {
  if (!isRecord(value) || !Array.isArray(value.feeds)) {
    return {
      feeds: [],
    };
  }

  return {
    feeds: value.feeds
      .map((feed) => sanitizeFeedConfig(feed))
      .filter((feed): feed is FeedConfig => Boolean(feed)),
  };
}

function saveFeedStoreToDisk(feedStore: FeedStore) {
  try {
    fs.mkdirSync(FEEDS_DATA_DIR, { recursive: true });
    const temporaryFilePath = `${FEEDS_DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(feedStore, null, 2));
    fs.renameSync(temporaryFilePath, FEEDS_DATA_FILE);
  } catch (error) {
    console.warn(`[feeds] could not save feed configs to ${FEEDS_DATA_FILE}.`, error);
  }
}

function loadFeedStore(): FeedStore {
  try {
    const fileContents = fs.readFileSync(FEEDS_DATA_FILE, "utf8");
    return sanitizeFeedStore(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[feeds] could not load feed configs from ${FEEDS_DATA_FILE}.`, error);
    }

    return {
      feeds: [],
    };
  }
}

function logFeedEvent(
  event: "created" | "updated" | "enabled" | "disabled" | "deleted" | "executed" | "window-blocked",
  details: Record<string, string | number | null | undefined>,
) {
  const parts = [`event=${event}`];

  for (const [key, value] of Object.entries(details)) {
    if (value !== null && value !== undefined && value !== "") {
      parts.push(`${key}=${String(value)}`);
    }
  }

  console.log(`[feeds] ${parts.join(" ")}`);
}

function createFeedId() {
  return `feed_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

let activeFeedStore = loadFeedStore();

export function getFeedConfigs() {
  return activeFeedStore.feeds;
}

export function getFeedConfig(feedId: string) {
  return activeFeedStore.feeds.find((feed) => feed.id === feedId) ?? null;
}

export function getFeedNextEligibleAt(feed: FeedConfig, now = Date.now()) {
  const referenceTime = Math.max(feed.lastExecutedAt ?? feed.createdAt, feed.updatedAt);
  const nextEligibleAt = referenceTime + feed.cadenceMinutes * 60 * 1000;
  return nextEligibleAt > now ? nextEligibleAt : now;
}

export function isWithinFeedAllowedWindow(feed: FeedConfig, now = Date.now()) {
  return isWithinDailyAllowedWindow(feed.allowedWindow, now);
}

export function getFeedAllowedWindowNextStartAt(feed: FeedConfig, now = Date.now()) {
  return getDailyAllowedWindowNextStartAt(feed.allowedWindow, now);
}

export function getFeedWindowBlockedUntil(feed: FeedConfig, now = Date.now()) {
  return getDailyAllowedWindowBlockedUntil(feed.allowedWindow, now);
}

export function logFeedWindowBlocked(feed: FeedConfig, blockedUntil: number | null) {
  logFeedEvent("window-blocked", {
    feedId: feed.id,
    channelId: feed.channelId,
    blockedUntil,
  });
}

export function getFeedOverlapWarnings(feed: FeedConfig, feeds = activeFeedStore.feeds): FeedOverlapWarning[] {
  const warnings: FeedOverlapWarning[] = [];
  const overlappingFeeds = feeds.filter(
    (candidate) =>
      candidate.id !== feed.id &&
      candidate.enabled &&
      candidate.channelId === feed.channelId &&
      candidate.contentType === feed.contentType,
  );

  if (feed.cadenceMinutes <= 5) {
    warnings.push({
      code: "AGGRESSIVE_CADENCE",
      message: `Cadence is very aggressive at every ${feed.cadenceMinutes} minutes.`,
    });
  }

  if (overlappingFeeds.length > 0) {
    warnings.push({
      code: "SAME_CHANNEL_CONTENT_OVERLAP",
      message: `${overlappingFeeds.length + 1} feeds target ${feed.contentType} in this channel.`,
    });
  }

  return warnings;
}

export function createFeedConfig(input: {
  enabled: boolean;
  channelId: string;
  contentType: ContentType;
  cadenceMinutes: number;
  topicOverride?: Topic | null;
  allowedWindow?: FeedAllowedWindow | null;
}) {
  const now = Date.now();
  const feed: FeedConfig = {
    id: createFeedId(),
    enabled: input.enabled,
    channelId: input.channelId,
    contentType: input.contentType,
    cadenceMinutes: input.cadenceMinutes,
    topicOverride: input.topicOverride ?? null,
    allowedWindow: input.allowedWindow ?? null,
    createdAt: now,
    updatedAt: now,
    lastExecutedAt: null,
  };

  activeFeedStore = {
    feeds: [...activeFeedStore.feeds, feed],
  };
  saveFeedStoreToDisk(activeFeedStore);
  logFeedEvent("created", {
    feedId: feed.id,
    channelId: feed.channelId,
    contentType: feed.contentType,
    cadenceMinutes: feed.cadenceMinutes,
  });
  return feed;
}

export function updateFeedConfig(feedId: string, patch: FeedPatch) {
  const currentFeed = getFeedConfig(feedId);

  if (!currentFeed) {
    return null;
  }

  const nextFeed: FeedConfig = {
    ...currentFeed,
    ...patch,
    topicOverride: patch.topicOverride === undefined ? currentFeed.topicOverride : patch.topicOverride,
    allowedWindow: patch.allowedWindow === undefined ? currentFeed.allowedWindow : patch.allowedWindow,
    updatedAt: Date.now(),
  };

  activeFeedStore = {
    feeds: activeFeedStore.feeds.map((feed) => (feed.id === feedId ? nextFeed : feed)),
  };
  saveFeedStoreToDisk(activeFeedStore);
  logFeedEvent("updated", {
    feedId: nextFeed.id,
    channelId: nextFeed.channelId,
    contentType: nextFeed.contentType,
    cadenceMinutes: nextFeed.cadenceMinutes,
    enabled: String(nextFeed.enabled),
  });
  return nextFeed;
}

export function setFeedEnabled(feedId: string, enabled: boolean) {
  const nextFeed = updateFeedConfig(feedId, {
    enabled,
  });

  if (nextFeed) {
    logFeedEvent(enabled ? "enabled" : "disabled", {
      feedId: nextFeed.id,
      channelId: nextFeed.channelId,
    });
  }

  return nextFeed;
}

export function deleteFeedConfig(feedId: string) {
  const currentFeed = getFeedConfig(feedId);

  if (!currentFeed) {
    return false;
  }

  activeFeedStore = {
    feeds: activeFeedStore.feeds.filter((feed) => feed.id !== feedId),
  };
  saveFeedStoreToDisk(activeFeedStore);
  logFeedEvent("deleted", {
    feedId: currentFeed.id,
    channelId: currentFeed.channelId,
  });
  return true;
}

export function recordFeedExecuted(feedId: string, executedAt = Date.now()) {
  const currentFeed = getFeedConfig(feedId);

  if (!currentFeed) {
    return null;
  }

  const nextFeed: FeedConfig = {
    ...currentFeed,
    lastExecutedAt: executedAt,
  };

  activeFeedStore = {
    feeds: activeFeedStore.feeds.map((feed) => (feed.id === feedId ? nextFeed : feed)),
  };
  saveFeedStoreToDisk(activeFeedStore);
  logFeedEvent("executed", {
    feedId: nextFeed.id,
    channelId: nextFeed.channelId,
    contentType: nextFeed.contentType,
    executedAt,
  });
  return nextFeed;
}
