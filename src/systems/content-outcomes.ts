import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentType } from "../lib/content-provider.js";
import { summarizeChannelEngagementActivityWindow } from "./engagement-activity.js";

export type ContentOutcomeSource =
  | "scheduler"
  | "feed"
  | "dailyTrivia"
  | "passiveChat"
  | "manualPush"
  | "composer"
  | "historyPush"
  | "unknown";

export type ContentOutcomeLabel = "sparked" | "some response" | "no response" | "unknown";

export type ContentOutcomeInput = {
  postedAt?: number;
  channelId: string;
  channelName?: string | null;
  source?: ContentOutcomeSource | null;
  contentType?: ContentType | string | null;
  messageId?: string | null;
  label?: string | null;
};

export type ContentOutcomeRecord = {
  postedAt: number;
  channelId: string;
  channelName: string | null;
  source: ContentOutcomeSource;
  contentType: string | null;
  messageId: string | null;
  label: string | null;
};

export type ContentOutcomeSummary = ContentOutcomeRecord & {
  activity: {
    messages15m: number;
    messages60m: number;
    approxActiveUsers60m: number;
    botMessages60m: number;
    humanMessages60m: number;
    outcomeLabel: ContentOutcomeLabel;
  };
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "content-outcomes.json");
const MAX_CONTENT_OUTCOME_RECORDS = 500;
const FLUSH_DELAY_MS = 500;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const SIXTY_MINUTES_MS = 60 * 60 * 1000;

const validSources = new Set<ContentOutcomeSource>([
  "scheduler",
  "feed",
  "dailyTrivia",
  "passiveChat",
  "manualPush",
  "composer",
  "historyPush",
  "unknown",
]);

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

function sanitizeSource(value: unknown): ContentOutcomeSource {
  return typeof value === "string" && validSources.has(value as ContentOutcomeSource)
    ? (value as ContentOutcomeSource)
    : "unknown";
}

function sanitizeStoredRecord(value: unknown): ContentOutcomeRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const postedAt = sanitizeTimestamp(value.postedAt);
  const channelId = sanitizeString(value.channelId, 32);

  if (!postedAt || !channelId) {
    return null;
  }

  return {
    postedAt,
    channelId,
    channelName: sanitizeString(value.channelName, 100),
    source: sanitizeSource(value.source),
    contentType: sanitizeString(value.contentType, 60),
    messageId: sanitizeString(value.messageId, 32),
    label: sanitizeString(value.label, 140),
  };
}

function loadContentOutcomes() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(fileContents);
    const rawRecords = isRecord(parsed) && Array.isArray(parsed.records) ? parsed.records : [];
    return rawRecords
      .map((record) => sanitizeStoredRecord(record))
      .filter((record): record is ContentOutcomeRecord => Boolean(record))
      .sort((left, right) => right.postedAt - left.postedAt)
      .slice(0, MAX_CONTENT_OUTCOME_RECORDS);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[content-outcomes] could not load records from ${DATA_FILE}.`, error);
    }

    return [];
  }
}

function flushContentOutcomesToDisk() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(
      temporaryFilePath,
      JSON.stringify(
        {
          records: contentOutcomeRecords.slice(0, MAX_CONTENT_OUTCOME_RECORDS),
        },
        null,
        2,
      ),
    );
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[content-outcomes] could not save records to ${DATA_FILE}.`, error);
  }
}

function scheduleFlush() {
  if (flushTimeout) {
    return;
  }

  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushContentOutcomesToDisk();
  }, FLUSH_DELAY_MS);
}

function getOutcomeLabel(postedAt: number, now: number, humanMessages60m: number): ContentOutcomeLabel {
  if (now - postedAt < FIFTEEN_MINUTES_MS) {
    return "unknown";
  }

  if (humanMessages60m >= 10) {
    return "sparked";
  }

  if (humanMessages60m > 0) {
    return "some response";
  }

  return "no response";
}

function summarizeOutcome(record: ContentOutcomeRecord, now: number): ContentOutcomeSummary {
  const activity15m = summarizeChannelEngagementActivityWindow(
    record.channelId,
    record.postedAt + 1,
    Math.min(record.postedAt + FIFTEEN_MINUTES_MS, now),
  );
  const activity60m = summarizeChannelEngagementActivityWindow(
    record.channelId,
    record.postedAt + 1,
    Math.min(record.postedAt + SIXTY_MINUTES_MS, now),
  );

  return {
    ...record,
    channelName: record.channelName ?? activity60m.channelName ?? activity15m.channelName,
    activity: {
      messages15m: activity15m.messageCount,
      messages60m: activity60m.messageCount,
      approxActiveUsers60m: activity60m.approxActiveUsers,
      botMessages60m: activity60m.botMessageCount,
      humanMessages60m: activity60m.humanMessageCount,
      outcomeLabel: getOutcomeLabel(record.postedAt, now, activity60m.humanMessageCount),
    },
  };
}

const contentOutcomeRecords: ContentOutcomeRecord[] = loadContentOutcomes();

export function recordContentOutcome(input: ContentOutcomeInput) {
  const record: ContentOutcomeRecord = {
    postedAt: input.postedAt ?? Date.now(),
    channelId: input.channelId,
    channelName: input.channelName?.trim() || null,
    source: input.source && validSources.has(input.source) ? input.source : "unknown",
    contentType: input.contentType?.trim() || null,
    messageId: input.messageId?.trim() || null,
    label: input.label?.trim().slice(0, 140) || null,
  };

  contentOutcomeRecords.unshift(record);
  contentOutcomeRecords.splice(MAX_CONTENT_OUTCOME_RECORDS);
  scheduleFlush();
  return record;
}

export function getContentOutcomeSummary(options: { source?: ContentOutcomeSource | "all"; limit?: number } = {}) {
  const now = Date.now();
  const source = options.source && options.source !== "all" && validSources.has(options.source) ? options.source : null;
  const limit = Math.max(1, Math.min(100, Math.floor(options.limit ?? 50)));
  const items = contentOutcomeRecords
    .filter((record) => !source || record.source === source)
    .slice(0, limit)
    .map((record) => summarizeOutcome(record, now));

  return {
    generatedAt: now,
    retentionLimit: MAX_CONTENT_OUTCOME_RECORDS,
    items,
    summary: {
      totalTracked: contentOutcomeRecords.length,
      returned: items.length,
    },
  };
}
