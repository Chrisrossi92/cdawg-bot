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

const MAX_ACTIVITY_ITEMS = 100;
const DEFAULT_ACTIVITY_LIMIT = 25;
const tokenLikePattern =
  /(?:mfa\.[a-z0-9_-]{20,}|[a-z0-9_-]{23,}\.[a-z0-9_-]{6,}\.[a-z0-9_-]{20,}|[a-f0-9]{32,}|[a-z0-9_-]{48,})/gi;

let nextActivitySequence = 0;
const automationActivityItems: AutomationActivityItem[] = [];

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

function createActivityId(timestamp: number) {
  nextActivitySequence = (nextActivitySequence + 1) % Number.MAX_SAFE_INTEGER;
  return `${timestamp.toString(36)}-${nextActivitySequence.toString(36)}`;
}

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
  return item;
}

export function getRecentAutomationActivity(limit = DEFAULT_ACTIVITY_LIMIT) {
  const normalizedLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, MAX_ACTIVITY_ITEMS) : DEFAULT_ACTIVITY_LIMIT;
  return automationActivityItems.slice(0, normalizedLimit);
}

export function clearAutomationActivity() {
  automationActivityItems.splice(0, automationActivityItems.length);
}
