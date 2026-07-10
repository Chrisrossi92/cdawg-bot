import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GuildMember } from "discord.js";
import { welcomeConfig } from "../config/welcome.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WELCOME_DATA_DIR = path.resolve(__dirname, "../../data");
const WELCOME_DATA_FILE = path.join(WELCOME_DATA_DIR, "welcome-settings.json");
const discordSnowflakePattern = /^\d{17,20}$/;
const allowedWelcomeTokens = new Set(["member", "server", "games", "replyChannel"]);

export type WelcomeSettings = {
  enabled: boolean;
  welcomeChannelId: string;
  serverLabel: string;
  availableGames: string[];
  replyChannelMention: string;
  messageTemplate: string;
};

export type WelcomeSettingsPatch = {
  enabled?: boolean;
  welcomeChannelId?: string;
  messageTemplate?: string;
};

export const defaultWelcomeMessageTemplate =
  `Welcome to **{server}**, {member}! We currently have **{games}** here.\n\n` +
  `Reply in {replyChannel} with:\n` +
  `1. how you found the Discord\n` +
  `2. which game you want to play\n\n` +
  `Once you do that, we’ll give you the right role and open the correct channels for you.`;

export const defaultWelcomeSettings: WelcomeSettings = {
  enabled: welcomeConfig.enabled,
  welcomeChannelId: welcomeConfig.welcomeChannelId,
  serverLabel: welcomeConfig.serverLabel,
  availableGames: [...welcomeConfig.availableGames],
  replyChannelMention: welcomeConfig.replyChannelMention,
  messageTemplate: defaultWelcomeMessageTemplate,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizeChannelId(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();
  return discordSnowflakePattern.test(trimmedValue) ? trimmedValue : fallback;
}

function sanitizeString(value: unknown, fallback: string, maximumLength: number) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue.slice(0, maximumLength) : fallback;
}

function sanitizeStringArray(value: unknown, fallback: readonly string[]) {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  const validValues = value
    .filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    .map((entry) => entry.trim().slice(0, 80));

  return validValues.length > 0 ? validValues : [...fallback];
}

export function getUnsupportedWelcomeTokens(messageTemplate: string) {
  const matches = messageTemplate.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g);
  return [
    ...new Set(
      [...matches]
        .map((match) => match[1])
        .filter((token): token is string => typeof token === "string" && !allowedWelcomeTokens.has(token)),
    ),
  ];
}

export function validateWelcomeMessageTemplate(messageTemplate: string) {
  const unsupportedTokens = getUnsupportedWelcomeTokens(messageTemplate);

  if (!messageTemplate.trim()) {
    return "Welcome message is required.";
  }

  if (messageTemplate.length > 2000) {
    return "Welcome message must be 2,000 characters or less.";
  }

  if (unsupportedTokens.length > 0) {
    return `Unsupported welcome token: ${unsupportedTokens.join(", ")}.`;
  }

  return null;
}

function mergeWelcomeSettings(rawSettings: unknown): WelcomeSettings {
  const settings = isRecord(rawSettings) ? rawSettings : {};
  const nextSettings = {
    enabled: sanitizeBoolean(settings.enabled, defaultWelcomeSettings.enabled),
    welcomeChannelId: sanitizeChannelId(settings.welcomeChannelId, defaultWelcomeSettings.welcomeChannelId),
    serverLabel: sanitizeString(settings.serverLabel, defaultWelcomeSettings.serverLabel, 120),
    availableGames: sanitizeStringArray(settings.availableGames, defaultWelcomeSettings.availableGames),
    replyChannelMention: sanitizeString(settings.replyChannelMention, defaultWelcomeSettings.replyChannelMention, 80),
    messageTemplate: sanitizeString(settings.messageTemplate, defaultWelcomeSettings.messageTemplate, 2000),
  };

  const templateError = validateWelcomeMessageTemplate(nextSettings.messageTemplate);
  return {
    ...nextSettings,
    messageTemplate: templateError ? defaultWelcomeSettings.messageTemplate : nextSettings.messageTemplate,
  };
}

function loadWelcomeSettings(): WelcomeSettings {
  try {
    const fileContents = fs.readFileSync(WELCOME_DATA_FILE, "utf8");
    return mergeWelcomeSettings(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[welcome] could not load welcome settings from ${WELCOME_DATA_FILE}. Using defaults.`, error);
    }

    return mergeWelcomeSettings(defaultWelcomeSettings);
  }
}

function saveWelcomeSettingsToDisk(settings: WelcomeSettings) {
  fs.mkdirSync(WELCOME_DATA_DIR, { recursive: true });
  const temporaryFilePath = `${WELCOME_DATA_FILE}.tmp`;
  fs.writeFileSync(temporaryFilePath, JSON.stringify(settings, null, 2));
  fs.renameSync(temporaryFilePath, WELCOME_DATA_FILE);
}

let activeWelcomeSettings = loadWelcomeSettings();

export function getWelcomeSettings() {
  return activeWelcomeSettings;
}

export function updateWelcomeSettings(patch: WelcomeSettingsPatch) {
  const nextSettings = mergeWelcomeSettings({
    ...activeWelcomeSettings,
    ...patch,
  });
  activeWelcomeSettings = nextSettings;
  saveWelcomeSettingsToDisk(activeWelcomeSettings);
  return activeWelcomeSettings;
}

export function renderWelcomeMessageTemplate(
  settings: WelcomeSettings,
  replacements: {
    member: string;
  },
) {
  return settings.messageTemplate
    .replace(/\{member\}/g, replacements.member)
    .replace(/\{server\}/g, settings.serverLabel)
    .replace(/\{games\}/g, settings.availableGames.join(" and "))
    .replace(/\{replyChannel\}/g, settings.replyChannelMention);
}

export function buildWelcomeMessage(member: GuildMember, settings = getWelcomeSettings()) {
  return renderWelcomeMessageTemplate(settings, {
    member: String(member),
  });
}
