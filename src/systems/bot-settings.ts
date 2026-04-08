import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentType } from "../lib/content-provider.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SETTINGS_DATA_DIR = path.resolve(__dirname, "../../data");
const SETTINGS_DATA_FILE = path.join(SETTINGS_DATA_DIR, "bot-settings.json");

export type PassiveChatSettings = {
  enabled: boolean;
  debugLogging: boolean;
  eligibleChannelIds: string[];
  globalCooldownMs: number;
  channelCooldownMs: number;
  triggerChance: number;
  minNonSpaceChars: number;
  minWordCount: number;
  recentReplyMemorySize: number;
  recentMessageMemorySize: number;
  quietChannelThresholdMs: number;
  conversationNudgeMessageThreshold: number;
  topicBiasMinimumMatches: number;
  conversationNudgeContentTypes: ContentType[];
};

export type ContentProviderSettings = {
  debugLogging: boolean;
};

export type BotSettings = {
  passiveChat: PassiveChatSettings;
  contentProviders: ContentProviderSettings;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export const defaultBotSettings: BotSettings = {
  passiveChat: {
    enabled: true,
    debugLogging: true,
    eligibleChannelIds: [
      "1480388771001139302",
      "1463685992782237890",
      "1463686052509388894",
      "1482887724871712788",
    ],
    globalCooldownMs: 12 * 60 * 1000,
    channelCooldownMs: 5 * 60 * 1000,
    triggerChance: 0.14,
    minNonSpaceChars: 8,
    minWordCount: 2,
    recentReplyMemorySize: 3,
    recentMessageMemorySize: 6,
    quietChannelThresholdMs: 20 * 60 * 1000,
    conversationNudgeMessageThreshold: 6,
    topicBiasMinimumMatches: 2,
    conversationNudgeContentTypes: ["prompt", "trivia", "joke"],
  },
  contentProviders: {
    debugLogging: true,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeStringArray(value: unknown, fallback: readonly string[]) {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  const validEntries = value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
  return validEntries.length > 0 ? validEntries : [...fallback];
}

function sanitizeContentTypes(value: unknown, fallback: readonly ContentType[]) {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  const allowedContentTypes: readonly ContentType[] = ["fact", "joke", "wyr", "prompt", "trivia"];
  const validEntries = value.filter(
    (entry): entry is ContentType => typeof entry === "string" && allowedContentTypes.includes(entry as ContentType),
  );

  return validEntries.length > 0 ? validEntries : [...fallback];
}

function sanitizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizeNumber(value: unknown, fallback: number, minimum = 0, maximum = Number.POSITIVE_INFINITY) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(Math.max(value, minimum), maximum);
}

function mergeBotSettings(partialSettings: unknown): BotSettings {
  const settings = isRecord(partialSettings) ? partialSettings : {};
  const passiveChat = isRecord(settings.passiveChat) ? settings.passiveChat : {};
  const contentProviders = isRecord(settings.contentProviders) ? settings.contentProviders : {};

  return {
    passiveChat: {
      enabled: sanitizeBoolean(passiveChat.enabled, defaultBotSettings.passiveChat.enabled),
      debugLogging: sanitizeBoolean(passiveChat.debugLogging, defaultBotSettings.passiveChat.debugLogging),
      eligibleChannelIds: sanitizeStringArray(
        passiveChat.eligibleChannelIds,
        defaultBotSettings.passiveChat.eligibleChannelIds,
      ),
      globalCooldownMs: sanitizeNumber(
        passiveChat.globalCooldownMs,
        defaultBotSettings.passiveChat.globalCooldownMs,
        1000,
      ),
      channelCooldownMs: sanitizeNumber(
        passiveChat.channelCooldownMs,
        defaultBotSettings.passiveChat.channelCooldownMs,
        1000,
      ),
      triggerChance: sanitizeNumber(passiveChat.triggerChance, defaultBotSettings.passiveChat.triggerChance, 0, 1),
      minNonSpaceChars: sanitizeNumber(
        passiveChat.minNonSpaceChars,
        defaultBotSettings.passiveChat.minNonSpaceChars,
        1,
      ),
      minWordCount: sanitizeNumber(passiveChat.minWordCount, defaultBotSettings.passiveChat.minWordCount, 1),
      recentReplyMemorySize: sanitizeNumber(
        passiveChat.recentReplyMemorySize,
        defaultBotSettings.passiveChat.recentReplyMemorySize,
        1,
      ),
      recentMessageMemorySize: sanitizeNumber(
        passiveChat.recentMessageMemorySize,
        defaultBotSettings.passiveChat.recentMessageMemorySize,
        1,
      ),
      quietChannelThresholdMs: sanitizeNumber(
        passiveChat.quietChannelThresholdMs,
        defaultBotSettings.passiveChat.quietChannelThresholdMs,
        1000,
      ),
      conversationNudgeMessageThreshold: sanitizeNumber(
        passiveChat.conversationNudgeMessageThreshold,
        defaultBotSettings.passiveChat.conversationNudgeMessageThreshold,
        1,
      ),
      topicBiasMinimumMatches: sanitizeNumber(
        passiveChat.topicBiasMinimumMatches,
        defaultBotSettings.passiveChat.topicBiasMinimumMatches,
        1,
      ),
      conversationNudgeContentTypes: sanitizeContentTypes(
        passiveChat.conversationNudgeContentTypes,
        defaultBotSettings.passiveChat.conversationNudgeContentTypes,
      ),
    },
    contentProviders: {
      debugLogging: sanitizeBoolean(contentProviders.debugLogging, defaultBotSettings.contentProviders.debugLogging),
    },
  };
}

function loadBotSettings(): BotSettings {
  try {
    const fileContents = fs.readFileSync(SETTINGS_DATA_FILE, "utf8");
    const parsed = JSON.parse(fileContents);
    return mergeBotSettings(parsed);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[settings] could not load settings from ${SETTINGS_DATA_FILE}. Using defaults.`, error);
    }

    return mergeBotSettings(defaultBotSettings);
  }
}

function saveBotSettingsToDisk(settings: BotSettings) {
  try {
    fs.mkdirSync(SETTINGS_DATA_DIR, { recursive: true });
    const temporaryFilePath = `${SETTINGS_DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(settings, null, 2));
    fs.renameSync(temporaryFilePath, SETTINGS_DATA_FILE);
  } catch (error) {
    console.warn(`[settings] could not save settings to ${SETTINGS_DATA_FILE}.`, error);
  }
}

let activeBotSettings = loadBotSettings();

export function getBotSettings() {
  return activeBotSettings;
}

export function updateBotSettings(
  nextSettings: DeepPartial<BotSettings> | ((current: BotSettings) => DeepPartial<BotSettings>),
) {
  const resolvedPatch = typeof nextSettings === "function" ? nextSettings(activeBotSettings) : nextSettings;
  activeBotSettings = mergeBotSettings({
    ...activeBotSettings,
    ...resolvedPatch,
    passiveChat: {
      ...activeBotSettings.passiveChat,
      ...resolvedPatch.passiveChat,
    },
    contentProviders: {
      ...activeBotSettings.contentProviders,
      ...resolvedPatch.contentProviders,
    },
  });
  saveBotSettingsToDisk(activeBotSettings);
  return activeBotSettings;
}

export function saveBotSettings() {
  saveBotSettingsToDisk(activeBotSettings);
}
