import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentType } from "../lib/content-provider.js";

export type AutomationActivityStatus = "success" | "failure" | "blocked" | "info";

export type AutomationActivityEvent = {
  channelId?: string | null;
  channelName?: string | null;
  source: string;
  status: AutomationActivityStatus;
  message: string;
  contentType?: ContentType | null;
  errorCode?: string | null;
  blockedReason?: string | null;
};

export type AutomationActivityItem = AutomationActivityEvent & {
  id: string;
  timestamp: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "automation-activity.json");
const MAX_ACTIVITY_ITEMS = 400;
const DEFAULT_ACTIVITY_LIMIT = 25;
const ACTIVITY_FLUSH_DELAY_MS = 500;
const tokenLikePattern =
  /(?:mfa\.[a-z0-9_-]{20,}|[a-z0-9_-]{23,}\.[a-z0-9_-]{6,}\.[a-z0-9_-]{20,}|[a-f0-9]{32,}|[a-z0-9_-]{48,})/gi;

let nextActivitySequence = 0;
let activityFlushTimeout: NodeJS.Timeout | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeText(value: unknown, fallback = "No details available.") {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value
    .replace(tokenLikePattern, "[redacted]")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return fallback;
  }

  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

function sanitizeOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const sanitized = sanitizeText(value, "");
  return sanitized || null;
}

function sanitizeSource(value: unknown) {
  return sanitizeText(value, "unknown").slice(0, 48);
}

function sanitizeStatus(value: unknown): AutomationActivityStatus {
  return value === "success" || value === "failure" || value === "blocked" || value === "info" ? value : "info";
}

function sanitizeContentType(value: unknown): ContentType | null {
  const allowedContentTypes: readonly ContentType[] = ["fact", "history", "joke", "wyr", "prompt", "trivia"];
  return typeof value === "string" && allowedContentTypes.includes(value as ContentType) ? (value as ContentType) : null;
}

function sanitizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

function sanitizeStoredActivityItem(value: unknown): AutomationActivityItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const timestamp = sanitizeTimestamp(value.timestamp);
  const id = sanitizeOptionalText(value.id);

  if (!timestamp || !id) {
    return null;
  }

  return {
    id,
    timestamp,
    source: sanitizeSource(value.source),
    status: sanitizeStatus(value.status),
    message: sanitizeText(value.message),
    ...(value.channelId ? { channelId: sanitizeText(value.channelId, "").slice(0, 32) } : {}),
    ...(value.channelName ? { channelName: sanitizeText(value.channelName, "").slice(0, 80) } : {}),
    ...(sanitizeContentType(value.contentType) ? { contentType: sanitizeContentType(value.contentType) } : {}),
    ...(value.errorCode ? { errorCode: sanitizeText(value.errorCode, "").slice(0, 64) } : {}),
    ...(value.blockedReason ? { blockedReason: sanitizeText(value.blockedReason, "").slice(0, 64) } : {}),
  };
}

function loadAutomationActivity() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(fileContents);
    const rawItems = isRecord(parsed) && Array.isArray(parsed.items) ? parsed.items : [];
    return rawItems
      .map((item) => sanitizeStoredActivityItem(item))
      .filter((item): item is AutomationActivityItem => Boolean(item))
      .sort((left, right) => right.timestamp - left.timestamp)
      .slice(0, MAX_ACTIVITY_ITEMS);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[automation-activity] could not load activity from ${DATA_FILE}.`, error);
    }

    return [];
  }
}

function flushAutomationActivityToDisk() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(
      temporaryFilePath,
      JSON.stringify(
        {
          items: automationActivityItems.slice(0, MAX_ACTIVITY_ITEMS),
        },
        null,
        2,
      ),
    );
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[automation-activity] could not save activity to ${DATA_FILE}.`, error);
  }
}

function scheduleActivityFlush() {
  if (activityFlushTimeout) {
    return;
  }

  activityFlushTimeout = setTimeout(() => {
    activityFlushTimeout = null;
    flushAutomationActivityToDisk();
  }, ACTIVITY_FLUSH_DELAY_MS);
}

function createActivityId(timestamp: number) {
  nextActivitySequence = (nextActivitySequence + 1) % Number.MAX_SAFE_INTEGER;
  return `${timestamp.toString(36)}-${nextActivitySequence.toString(36)}`;
}

const automationActivityItems: AutomationActivityItem[] = loadAutomationActivity();

export function recordAutomationActivity(event: AutomationActivityEvent) {
  const timestamp = Date.now();
  const item: AutomationActivityItem = {
    id: createActivityId(timestamp),
    timestamp,
    source: sanitizeSource(event.source),
    status: sanitizeStatus(event.status),
    message: sanitizeText(event.message),
    ...(event.channelId ? { channelId: sanitizeText(event.channelId, "").slice(0, 32) } : {}),
    ...(event.channelName ? { channelName: sanitizeText(event.channelName, "").slice(0, 80) } : {}),
    ...(event.contentType ? { contentType: event.contentType } : {}),
    ...(event.errorCode ? { errorCode: sanitizeText(event.errorCode, "").slice(0, 64) } : {}),
    ...(event.blockedReason ? { blockedReason: sanitizeText(event.blockedReason, "").slice(0, 64) } : {}),
  };

  automationActivityItems.unshift(item);
  automationActivityItems.splice(MAX_ACTIVITY_ITEMS);
  scheduleActivityFlush();
  return item;
}

export function getRecentAutomationActivity(limit = DEFAULT_ACTIVITY_LIMIT) {
  const normalizedLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, MAX_ACTIVITY_ITEMS) : DEFAULT_ACTIVITY_LIMIT;
  return automationActivityItems.slice(0, normalizedLimit);
}

export function clearAutomationActivity() {
  automationActivityItems.splice(0, automationActivityItems.length);
  scheduleActivityFlush();
}
