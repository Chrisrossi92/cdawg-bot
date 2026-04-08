import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentType } from "../lib/content-provider.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const METRICS_DATA_DIR = path.resolve(__dirname, "../../data");
const METRICS_DATA_FILE = path.join(METRICS_DATA_DIR, "bot-metrics.json");
const METRICS_FLUSH_DELAY_MS = 500;

type CounterMap = Record<string, number>;

export type BotMetrics = {
  slashCommandUsageCounts: CounterMap;
  passiveChat: {
    triggerCount: number;
    quietGapTriggerCount: number;
    conversationNudgeCount: number;
  };
  contentProviders: {
    usageCounts: CounterMap;
    apiSuccessCounts: CounterMap;
    fallbackToLocalCounts: CounterMap;
    apiFailureCounts: CounterMap;
  };
};

export const defaultBotMetrics: BotMetrics = {
  slashCommandUsageCounts: {},
  passiveChat: {
    triggerCount: 0,
    quietGapTriggerCount: 0,
    conversationNudgeCount: 0,
  },
  contentProviders: {
    usageCounts: {},
    apiSuccessCounts: {},
    fallbackToLocalCounts: {},
    apiFailureCounts: {},
  },
};

let metricsFlushTimeout: NodeJS.Timeout | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeCounterMap(value: unknown): CounterMap {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number",
    ),
  );
}

function sanitizeNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && !Number.isNaN(value) ? value : fallback;
}

function mergeBotMetrics(partialMetrics: unknown): BotMetrics {
  const metrics = isRecord(partialMetrics) ? partialMetrics : {};
  const passiveChat = isRecord(metrics.passiveChat) ? metrics.passiveChat : {};
  const contentProviders = isRecord(metrics.contentProviders) ? metrics.contentProviders : {};

  return {
    slashCommandUsageCounts: sanitizeCounterMap(metrics.slashCommandUsageCounts),
    passiveChat: {
      triggerCount: sanitizeNumber(passiveChat.triggerCount),
      quietGapTriggerCount: sanitizeNumber(passiveChat.quietGapTriggerCount),
      conversationNudgeCount: sanitizeNumber(passiveChat.conversationNudgeCount),
    },
    contentProviders: {
      usageCounts: sanitizeCounterMap(contentProviders.usageCounts),
      apiSuccessCounts: sanitizeCounterMap(contentProviders.apiSuccessCounts),
      fallbackToLocalCounts: sanitizeCounterMap(contentProviders.fallbackToLocalCounts),
      apiFailureCounts: sanitizeCounterMap(contentProviders.apiFailureCounts),
    },
  };
}

function loadBotMetrics() {
  try {
    const fileContents = fs.readFileSync(METRICS_DATA_FILE, "utf8");
    return mergeBotMetrics(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[metrics] could not load metrics from ${METRICS_DATA_FILE}. Using defaults.`, error);
    }

    return mergeBotMetrics(defaultBotMetrics);
  }
}

function flushBotMetricsToDisk(metrics: BotMetrics) {
  try {
    fs.mkdirSync(METRICS_DATA_DIR, { recursive: true });
    const temporaryFilePath = `${METRICS_DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(metrics, null, 2));
    fs.renameSync(temporaryFilePath, METRICS_DATA_FILE);
  } catch (error) {
    console.warn(`[metrics] could not save metrics to ${METRICS_DATA_FILE}.`, error);
  }
}

function scheduleMetricsFlush() {
  if (metricsFlushTimeout) {
    return;
  }

  metricsFlushTimeout = setTimeout(() => {
    metricsFlushTimeout = null;
    flushBotMetricsToDisk(activeBotMetrics);
  }, METRICS_FLUSH_DELAY_MS);
}

function incrementCounter(counterMap: CounterMap, key: string) {
  counterMap[key] = (counterMap[key] ?? 0) + 1;
  scheduleMetricsFlush();
}

function getProviderMetricKey(contentType: ContentType, providerName: string) {
  return `${contentType}:${providerName}`;
}

let activeBotMetrics = loadBotMetrics();

export function getBotMetrics() {
  return activeBotMetrics;
}

export function incrementSlashCommandUsage(commandName: string) {
  incrementCounter(activeBotMetrics.slashCommandUsageCounts, commandName);
}

export function recordPassiveChatTrigger(triggerType: "keyword" | "quiet-gap" | "conversation-nudge") {
  activeBotMetrics.passiveChat.triggerCount += 1;

  if (triggerType === "quiet-gap") {
    activeBotMetrics.passiveChat.quietGapTriggerCount += 1;
  }

  if (triggerType === "conversation-nudge") {
    activeBotMetrics.passiveChat.conversationNudgeCount += 1;
  }

  scheduleMetricsFlush();
}

export function recordContentProviderUsage(contentType: ContentType, providerName: string) {
  incrementCounter(activeBotMetrics.contentProviders.usageCounts, getProviderMetricKey(contentType, providerName));
}

export function recordContentProviderApiSuccess(contentType: ContentType, providerName: string) {
  incrementCounter(activeBotMetrics.contentProviders.apiSuccessCounts, getProviderMetricKey(contentType, providerName));
}

export function recordContentProviderFallbackToLocal(contentType: ContentType, providerName: string) {
  incrementCounter(
    activeBotMetrics.contentProviders.fallbackToLocalCounts,
    getProviderMetricKey(contentType, providerName),
  );
}

export function recordContentProviderApiFailure(contentType: ContentType, providerName: string) {
  incrementCounter(activeBotMetrics.contentProviders.apiFailureCounts, getProviderMetricKey(contentType, providerName));
}

export function saveBotMetrics() {
  if (metricsFlushTimeout) {
    clearTimeout(metricsFlushTimeout);
    metricsFlushTimeout = null;
  }

  flushBotMetricsToDisk(activeBotMetrics);
}
