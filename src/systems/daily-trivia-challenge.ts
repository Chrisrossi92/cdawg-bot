import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Topic } from "../config/topics.js";
import {
  getDailyAllowedWindowBlockedUntil,
  isWithinDailyAllowedWindow,
  type DailyAllowedWindow,
} from "../lib/allowed-window.js";
import { getLatestTriviaSessionSnapshot } from "../lib/trivia-session.js";
import { getChannelOperationalStatus } from "./channel-operations.js";

export type DailyTriviaChallengeConfig = {
  id: "daily-trivia-challenge";
  enabled: boolean;
  channelId: string;
  dailyTime: string;
  topicOverride: Topic | null;
  allowedWindow: DailyAllowedWindow | null;
  createdAt: number;
  updatedAt: number;
  lastExecutedAt: number | null;
};

type DailyTriviaChallengePatch = Partial<
  Pick<DailyTriviaChallengeConfig, "enabled" | "channelId" | "dailyTime" | "topicOverride" | "allowedWindow">
>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "daily-trivia-challenge.json");

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

function sanitizeDailyTime(value: unknown) {
  return typeof value === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value.trim()) ? value.trim() : null;
}

function sanitizeAllowedWindow(value: unknown): DailyAllowedWindow | null {
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

function sanitizeTopicOverride(value: unknown): Topic | null {
  return typeof value === "string" && value.trim().length > 0 ? (value.trim() as Topic) : null;
}

function sanitizeConfig(value: unknown): DailyTriviaChallengeConfig | null {
  if (!isRecord(value)) {
    return null;
  }

  const channelId = sanitizeString(value.channelId);
  const dailyTime = sanitizeDailyTime(value.dailyTime);
  const createdAt = sanitizeTimestamp(value.createdAt);
  const updatedAt = sanitizeTimestamp(value.updatedAt);

  if (!channelId || !dailyTime || !createdAt || !updatedAt) {
    return null;
  }

  return {
    id: "daily-trivia-challenge",
    enabled: value.enabled !== false,
    channelId,
    dailyTime,
    topicOverride: sanitizeTopicOverride(value.topicOverride),
    allowedWindow: sanitizeAllowedWindow(value.allowedWindow),
    createdAt,
    updatedAt,
    lastExecutedAt: sanitizeTimestamp(value.lastExecutedAt),
  };
}

function saveConfig(config: DailyTriviaChallengeConfig | null) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    if (!config) {
      if (fs.existsSync(DATA_FILE)) {
        fs.unlinkSync(DATA_FILE);
      }
      return;
    }

    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(config, null, 2));
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[daily-trivia] could not save config to ${DATA_FILE}.`, error);
  }
}

function loadConfig() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, "utf8");
    return sanitizeConfig(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[daily-trivia] could not load config from ${DATA_FILE}.`, error);
    }

    return null;
  }
}

function logDailyTriviaEvent(
  event: "configured" | "executed" | "blocked-window",
  details: Record<string, string | number | null | undefined>,
) {
  const parts = [`event=${event}`];

  for (const [key, value] of Object.entries(details)) {
    if (value !== null && value !== undefined && value !== "") {
      parts.push(`${key}=${String(value)}`);
    }
  }

  console.log(`[daily-trivia] ${parts.join(" ")}`);
}

function buildScheduledAtForDay(dailyTime: string, referenceTime: number) {
  const [hoursText, minutesText] = dailyTime.split(":");
  const scheduledAt = new Date(referenceTime);
  scheduledAt.setSeconds(0, 0);
  scheduledAt.setHours(Number(hoursText ?? 0), Number(minutesText ?? 0), 0, 0);
  return scheduledAt.getTime();
}

function wasExecutedForScheduledSlot(lastExecutedAt: number | null, scheduledAt: number) {
  return typeof lastExecutedAt === "number" && lastExecutedAt >= scheduledAt;
}

let activeConfig = loadConfig();
const loggedWindowBlockKeys = new Set<string>();

export function getDailyTriviaChallengeConfig() {
  return activeConfig;
}

export function upsertDailyTriviaChallengeConfig(input: {
  enabled: boolean;
  channelId: string;
  dailyTime: string;
  topicOverride?: Topic | null;
  allowedWindow?: DailyAllowedWindow | null;
}) {
  const now = Date.now();
  const nextConfig: DailyTriviaChallengeConfig = {
    id: "daily-trivia-challenge",
    enabled: input.enabled,
    channelId: input.channelId,
    dailyTime: input.dailyTime,
    topicOverride: input.topicOverride ?? null,
    allowedWindow: input.allowedWindow ?? null,
    createdAt: activeConfig?.createdAt ?? now,
    updatedAt: now,
    lastExecutedAt: activeConfig?.lastExecutedAt ?? null,
  };

  activeConfig = nextConfig;
  saveConfig(activeConfig);
  logDailyTriviaEvent("configured", {
    enabled: String(nextConfig.enabled),
    channelId: nextConfig.channelId,
    dailyTime: nextConfig.dailyTime,
  });
  return nextConfig;
}

export function updateDailyTriviaChallengeConfig(patch: DailyTriviaChallengePatch) {
  if (!activeConfig) {
    return null;
  }

  activeConfig = {
    ...activeConfig,
    ...patch,
    topicOverride: patch.topicOverride === undefined ? activeConfig.topicOverride : patch.topicOverride,
    allowedWindow: patch.allowedWindow === undefined ? activeConfig.allowedWindow : patch.allowedWindow,
    updatedAt: Date.now(),
  };
  saveConfig(activeConfig);
  logDailyTriviaEvent("configured", {
    enabled: String(activeConfig.enabled),
    channelId: activeConfig.channelId,
    dailyTime: activeConfig.dailyTime,
  });
  return activeConfig;
}

export function getDailyTriviaChallengeDueAt(config: DailyTriviaChallengeConfig, now = Date.now()) {
  const todayScheduledAt = buildScheduledAtForDay(config.dailyTime, now);

  if (!wasExecutedForScheduledSlot(config.lastExecutedAt, todayScheduledAt)) {
    return todayScheduledAt;
  }

  const tomorrow = new Date(todayScheduledAt);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.getTime();
}

export function getDailyTriviaChallengeBlockedReason(config: DailyTriviaChallengeConfig, now = Date.now()) {
  if (!config.enabled) {
    return null;
  }

  const operationalStatus = getChannelOperationalStatus(config.channelId, now);

  if (!operationalStatus.globalAutomationEnabled) {
    return "global-disabled" as const;
  }

  if (!operationalStatus.channelAutomationEnabled) {
    return "disabled" as const;
  }

  if (operationalStatus.isSilenced) {
    return "silenced" as const;
  }

  if (operationalStatus.isCoolingDown) {
    return "cooldown" as const;
  }

  if (operationalStatus.skipNextSend) {
    return "skip-next" as const;
  }

  if (!isWithinDailyAllowedWindow(config.allowedWindow, now)) {
    return "outside-window" as const;
  }

  return null;
}

export function getDailyTriviaChallengeBlockedUntil(config: DailyTriviaChallengeConfig, now = Date.now()) {
  if (!config.enabled) {
    return null;
  }

  const operationalStatus = getChannelOperationalStatus(config.channelId, now);

  if (!operationalStatus.isAutomationEnabled) {
    return null;
  }

  if (operationalStatus.isSilenced) {
    return operationalStatus.silencedUntil;
  }

  if (operationalStatus.isCoolingDown) {
    return operationalStatus.cooldownUntil;
  }

  if (!isWithinDailyAllowedWindow(config.allowedWindow, now)) {
    return getDailyAllowedWindowBlockedUntil(config.allowedWindow, now);
  }

  return null;
}

export function getDailyTriviaChallengeNextRunAt(config: DailyTriviaChallengeConfig, now = Date.now()) {
  if (!config.enabled) {
    return null;
  }

  const dueAt = getDailyTriviaChallengeDueAt(config, now);
  const blockedUntil = getDailyTriviaChallengeBlockedUntil(config, now);
  return blockedUntil ? Math.max(dueAt, blockedUntil) : dueAt;
}

export function shouldRunDailyTriviaChallengeNow(config: DailyTriviaChallengeConfig, now = Date.now()) {
  if (!config.enabled) {
    return false;
  }

  return getDailyTriviaChallengeDueAt(config, now) <= now;
}

export function recordDailyTriviaChallengeExecuted(executedAt = Date.now()) {
  if (!activeConfig) {
    return null;
  }

  activeConfig = {
    ...activeConfig,
    lastExecutedAt: executedAt,
    updatedAt: Math.max(activeConfig.updatedAt, executedAt),
  };
  saveConfig(activeConfig);
  loggedWindowBlockKeys.clear();
  logDailyTriviaEvent("executed", {
    channelId: activeConfig.channelId,
    executedAt,
  });
  return activeConfig;
}

export function logDailyTriviaChallengeWindowBlocked(config: DailyTriviaChallengeConfig, now = Date.now()) {
  const dueAt = getDailyTriviaChallengeDueAt(config, now);

  if (dueAt > now) {
    return;
  }

  const blockKey = `${config.channelId}:${dueAt}`;

  if (loggedWindowBlockKeys.has(blockKey)) {
    return;
  }

  loggedWindowBlockKeys.add(blockKey);
  logDailyTriviaEvent("blocked-window", {
    channelId: config.channelId,
    dueAt,
    blockedUntil: getDailyTriviaChallengeBlockedUntil(config, now),
  });
}

export function getDailyTriviaChallengeStatus(now = Date.now()) {
  if (!activeConfig) {
    return null;
  }

  const latestSession = getLatestTriviaSessionSnapshot("daily-challenge", activeConfig.channelId);

  return {
    ...activeConfig,
    blockedReason: getDailyTriviaChallengeBlockedReason(activeConfig, now),
    blockedUntil: getDailyTriviaChallengeBlockedUntil(activeConfig, now),
    dueAt: getDailyTriviaChallengeDueAt(activeConfig, now),
    nextRunAt: getDailyTriviaChallengeNextRunAt(activeConfig, now),
    latestSession,
  };
}
