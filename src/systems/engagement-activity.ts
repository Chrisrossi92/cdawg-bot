import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type MessageLengthBucket = "empty" | "short" | "medium" | "long" | "very-long";
export type EngagementLabel = "active" | "quiet" | "dormant" | "unknown";

export type EngagementActivityInput = {
  timestamp?: number;
  guildId: string | null;
  channelId: string;
  channelName: string | null;
  authorId: string;
  isBot: boolean;
  messageLength: number;
  hasAttachments: boolean;
  hasEmbeds: boolean;
};

export type EngagementActivityRecord = {
  timestamp: number;
  guildId: string | null;
  channelId: string;
  channelName: string | null;
  authorHash: string;
  isBot: boolean;
  messageLengthBucket: MessageLengthBucket;
  hasAttachments: boolean;
  hasEmbeds: boolean;
};

export type ChannelEngagementWindowSummary = {
  channelId: string;
  channelName: string | null;
  messageCount: number;
  approxActiveUsers: number;
  botMessageCount: number;
  attachmentOrEmbedCount: number;
  lastActivityAt: number | null;
};

export type EngagementSummary = {
  generatedAt: number;
  windows: {
    last1h: ChannelEngagementWindowSummary[];
    last24h: ChannelEngagementWindowSummary[];
    last7d: ChannelEngagementWindowSummary[];
  };
};

export type ChannelEngagementActivityWindow = ChannelEngagementWindowSummary & {
  humanMessageCount: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "engagement-activity.json");
const MAX_ENGAGEMENT_RECORDS = 4000;
const FLUSH_DELAY_MS = 500;
const windowDurations = {
  last1h: 60 * 60 * 1000,
  last24h: 24 * 60 * 60 * 1000,
  last7d: 7 * 24 * 60 * 60 * 1000,
} as const;

let flushTimeout: NodeJS.Timeout | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function sanitizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

function sanitizeLengthBucket(value: unknown): MessageLengthBucket | null {
  return value === "empty" || value === "short" || value === "medium" || value === "long" || value === "very-long"
    ? value
    : null;
}

function getMessageLengthBucket(length: number): MessageLengthBucket {
  if (!Number.isFinite(length) || length <= 0) {
    return "empty";
  }

  if (length <= 40) {
    return "short";
  }

  if (length <= 160) {
    return "medium";
  }

  if (length <= 800) {
    return "long";
  }

  return "very-long";
}

function hashAuthorId(authorId: string) {
  return crypto.createHash("sha256").update(authorId).digest("hex").slice(0, 24);
}

function sanitizeStoredRecord(value: unknown): EngagementActivityRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const timestamp = sanitizeTimestamp(value.timestamp);
  const channelId = sanitizeString(value.channelId, 32);
  const authorHash = sanitizeString(value.authorHash, 64);
  const messageLengthBucket = sanitizeLengthBucket(value.messageLengthBucket);

  if (!timestamp || !channelId || !authorHash || !messageLengthBucket) {
    return null;
  }

  return {
    timestamp,
    guildId: sanitizeString(value.guildId, 32),
    channelId,
    channelName: sanitizeString(value.channelName, 100),
    authorHash,
    isBot: value.isBot === true,
    messageLengthBucket,
    hasAttachments: value.hasAttachments === true,
    hasEmbeds: value.hasEmbeds === true,
  };
}

function loadEngagementActivity() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(fileContents);
    const rawRecords = isRecord(parsed) && Array.isArray(parsed.records) ? parsed.records : [];
    return rawRecords
      .map((record) => sanitizeStoredRecord(record))
      .filter((record): record is EngagementActivityRecord => Boolean(record))
      .sort((left, right) => right.timestamp - left.timestamp)
      .slice(0, MAX_ENGAGEMENT_RECORDS);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[engagement] could not load activity from ${DATA_FILE}.`, error);
    }

    return [];
  }
}

function flushEngagementActivityToDisk() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(
      temporaryFilePath,
      JSON.stringify(
        {
          records: engagementActivityRecords.slice(0, MAX_ENGAGEMENT_RECORDS),
        },
        null,
        2,
      ),
    );
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[engagement] could not save activity to ${DATA_FILE}.`, error);
  }
}

function scheduleFlush() {
  if (flushTimeout) {
    return;
  }

  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushEngagementActivityToDisk();
  }, FLUSH_DELAY_MS);
}

const engagementActivityRecords: EngagementActivityRecord[] = loadEngagementActivity();

export function recordEngagementActivity(input: EngagementActivityInput) {
  const record: EngagementActivityRecord = {
    timestamp: input.timestamp ?? Date.now(),
    guildId: input.guildId,
    channelId: input.channelId,
    channelName: input.channelName?.trim() || null,
    authorHash: hashAuthorId(input.authorId),
    isBot: input.isBot,
    messageLengthBucket: getMessageLengthBucket(input.messageLength),
    hasAttachments: input.hasAttachments,
    hasEmbeds: input.hasEmbeds,
  };

  engagementActivityRecords.unshift(record);
  engagementActivityRecords.splice(MAX_ENGAGEMENT_RECORDS);
  scheduleFlush();
  return record;
}

function summarizeWindow(since: number): ChannelEngagementWindowSummary[] {
  const summariesByChannelId = new Map<
    string,
    ChannelEngagementWindowSummary & {
      authorHashes: Set<string>;
    }
  >();

  for (const record of engagementActivityRecords) {
    if (record.timestamp < since) {
      continue;
    }

    const summary = summariesByChannelId.get(record.channelId) ?? {
      channelId: record.channelId,
      channelName: record.channelName,
      messageCount: 0,
      approxActiveUsers: 0,
      botMessageCount: 0,
      attachmentOrEmbedCount: 0,
      lastActivityAt: null,
      authorHashes: new Set<string>(),
    };

    summary.channelName = summary.channelName ?? record.channelName;
    summary.messageCount += 1;
    summary.authorHashes.add(record.authorHash);
    summary.botMessageCount += record.isBot ? 1 : 0;
    summary.attachmentOrEmbedCount += record.hasAttachments || record.hasEmbeds ? 1 : 0;
    summary.lastActivityAt = Math.max(summary.lastActivityAt ?? 0, record.timestamp);
    summariesByChannelId.set(record.channelId, summary);
  }

  return [...summariesByChannelId.values()]
    .map(({ authorHashes, ...summary }) => ({
      ...summary,
      approxActiveUsers: authorHashes.size,
    }))
    .sort((left, right) => right.messageCount - left.messageCount || left.channelId.localeCompare(right.channelId));
}

export function summarizeChannelEngagementActivityWindow(
  channelId: string,
  since: number,
  until: number,
): ChannelEngagementActivityWindow {
  const authorHashes = new Set<string>();
  let channelName: string | null = null;
  let messageCount = 0;
  let botMessageCount = 0;
  let attachmentOrEmbedCount = 0;
  let lastActivityAt: number | null = null;

  for (const record of engagementActivityRecords) {
    if (record.channelId !== channelId || record.timestamp < since || record.timestamp > until) {
      continue;
    }

    channelName = channelName ?? record.channelName;
    messageCount += 1;
    botMessageCount += record.isBot ? 1 : 0;
    attachmentOrEmbedCount += record.hasAttachments || record.hasEmbeds ? 1 : 0;
    authorHashes.add(record.authorHash);
    lastActivityAt = Math.max(lastActivityAt ?? 0, record.timestamp);
  }

  return {
    channelId,
    channelName,
    messageCount,
    approxActiveUsers: authorHashes.size,
    botMessageCount,
    humanMessageCount: Math.max(0, messageCount - botMessageCount),
    attachmentOrEmbedCount,
    lastActivityAt,
  };
}

export function getEngagementSummary(now = Date.now()): EngagementSummary {
  return {
    generatedAt: now,
    windows: {
      last1h: summarizeWindow(now - windowDurations.last1h),
      last24h: summarizeWindow(now - windowDurations.last24h),
      last7d: summarizeWindow(now - windowDurations.last7d),
    },
  };
}

export function getChannelEngagementSnapshot(channelId: string, now = Date.now()) {
  const summary = getEngagementSummary(now);
  const last24h = summary.windows.last24h.find((entry) => entry.channelId === channelId) ?? null;
  const last7d = summary.windows.last7d.find((entry) => entry.channelId === channelId) ?? null;
  const last24hMessages = last24h?.messageCount ?? 0;
  const last7dMessages = last7d?.messageCount ?? 0;
  const approxActiveUsers24h = last24h?.approxActiveUsers ?? 0;
  const lastActivityAt = Math.max(last24h?.lastActivityAt ?? 0, last7d?.lastActivityAt ?? 0) || null;
  const engagementLabel: EngagementLabel =
    !lastActivityAt
      ? "unknown"
      : last24hMessages >= 10 || approxActiveUsers24h >= 3
        ? "active"
        : last24hMessages > 0
          ? "quiet"
          : last7dMessages > 0
            ? "dormant"
            : "unknown";

  return {
    last24hMessages,
    last7dMessages,
    approxActiveUsers24h,
    lastActivityAt,
    engagementLabel,
  };
}
