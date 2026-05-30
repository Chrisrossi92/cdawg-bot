import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Topic } from "../config/topics.js";
import type { ContentType } from "../lib/content-provider.js";

export const channelProfilePurposes = [
  "genealogy",
  "gaming",
  "sports",
  "news",
  "history",
  "memes",
  "general-chat",
  "custom",
] as const;

export const channelProfileAudiences = [
  "everyone",
  "members",
  "role-members",
  "admins",
  "custom",
] as const;

export const channelProfileAccessModes = [
  "everyone",
  "opt-in",
  "private",
  "announcement",
  "unsure",
] as const;

export const channelProfileTones = [
  "friendly",
  "informational",
  "playful",
  "serious",
  "supportive",
  "custom",
] as const;

export type ChannelProfilePurpose = (typeof channelProfilePurposes)[number];
export type ChannelProfileAudience = (typeof channelProfileAudiences)[number];
export type ChannelProfileAccessMode = (typeof channelProfileAccessModes)[number];
export type ChannelProfileTone = (typeof channelProfileTones)[number];

export type ChannelProfile = {
  channelId: string;
  purpose: ChannelProfilePurpose;
  audience: ChannelProfileAudience;
  accessMode: ChannelProfileAccessMode;
  tone: ChannelProfileTone;
  preferredContentTypes: ContentType[];
  topicOverride: Topic | null;
  suggestedRoleId: string | null;
  signupPanelId: string | null;
  followupId: string | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
};

export type ChannelProfileInput = Omit<ChannelProfile, "createdAt" | "updatedAt">;

type ChannelProfileStore = {
  channelProfiles: ChannelProfile[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "channel-profiles.json");
const allowedContentTypes: readonly ContentType[] = ["fact", "history", "joke", "wyr", "prompt", "trivia"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeNullableString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

function sanitizeEnum<T extends readonly string[]>(value: unknown, allowedValues: T): T[number] | null {
  return typeof value === "string" && allowedValues.includes(value) ? value : null;
}

function sanitizeContentTypes(value: unknown): ContentType[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const uniqueContentTypes = [
    ...new Set(value.filter((entry): entry is ContentType => typeof entry === "string" && allowedContentTypes.includes(entry as ContentType))),
  ];

  return uniqueContentTypes.length > 0 ? uniqueContentTypes : null;
}

function sanitizeProfile(value: unknown): ChannelProfile | null {
  if (!isRecord(value)) {
    return null;
  }

  const channelId = sanitizeString(value.channelId);
  const purpose = sanitizeEnum(value.purpose, channelProfilePurposes);
  const audience = sanitizeEnum(value.audience, channelProfileAudiences);
  const accessMode = sanitizeEnum(value.accessMode, channelProfileAccessModes);
  const tone = sanitizeEnum(value.tone, channelProfileTones);
  const preferredContentTypes = sanitizeContentTypes(value.preferredContentTypes);
  const createdAt = sanitizeTimestamp(value.createdAt);
  const updatedAt = sanitizeTimestamp(value.updatedAt);

  if (!channelId || !purpose || !audience || !accessMode || !tone || !preferredContentTypes || !createdAt || !updatedAt) {
    return null;
  }

  return {
    channelId,
    purpose,
    audience,
    accessMode,
    tone,
    preferredContentTypes,
    topicOverride: sanitizeNullableString(value.topicOverride) as Topic | null,
    suggestedRoleId: sanitizeNullableString(value.suggestedRoleId),
    signupPanelId: sanitizeNullableString(value.signupPanelId),
    followupId: sanitizeNullableString(value.followupId),
    notes: sanitizeNullableString(value.notes),
    createdAt,
    updatedAt,
  };
}

function sanitizeStore(value: unknown): ChannelProfileStore {
  if (!isRecord(value) || !Array.isArray(value.channelProfiles)) {
    return {
      channelProfiles: [],
    };
  }

  const profilesByChannelId = new Map<string, ChannelProfile>();

  for (const profile of value.channelProfiles) {
    const sanitizedProfile = sanitizeProfile(profile);

    if (sanitizedProfile) {
      profilesByChannelId.set(sanitizedProfile.channelId, sanitizedProfile);
    }
  }

  return {
    channelProfiles: [...profilesByChannelId.values()].sort((left, right) => left.channelId.localeCompare(right.channelId)),
  };
}

function saveChannelProfilesToDisk(store: ChannelProfileStore) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(store, null, 2));
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[channel-profiles] could not save channel profiles to ${DATA_FILE}.`, error);
  }
}

function loadChannelProfiles(): ChannelProfileStore {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, "utf8");
    return sanitizeStore(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[channel-profiles] could not load channel profiles from ${DATA_FILE}.`, error);
    }

    return {
      channelProfiles: [],
    };
  }
}

let activeChannelProfileStore = loadChannelProfiles();

export function listChannelProfiles() {
  return activeChannelProfileStore.channelProfiles;
}

export function getChannelProfile(channelId: string) {
  return activeChannelProfileStore.channelProfiles.find((profile) => profile.channelId === channelId) ?? null;
}

export function upsertChannelProfile(input: ChannelProfileInput) {
  const now = Date.now();
  const currentProfile = getChannelProfile(input.channelId);
  const nextProfile: ChannelProfile = {
    channelId: input.channelId.trim(),
    purpose: input.purpose,
    audience: input.audience,
    accessMode: input.accessMode,
    tone: input.tone,
    preferredContentTypes: [...new Set(input.preferredContentTypes)],
    topicOverride: input.topicOverride,
    suggestedRoleId: input.suggestedRoleId?.trim() || null,
    signupPanelId: input.signupPanelId?.trim() || null,
    followupId: input.followupId?.trim() || null,
    notes: input.notes?.trim() || null,
    createdAt: currentProfile?.createdAt ?? now,
    updatedAt: now,
  };

  activeChannelProfileStore = {
    channelProfiles: currentProfile
      ? activeChannelProfileStore.channelProfiles.map((profile) => (profile.channelId === nextProfile.channelId ? nextProfile : profile))
      : [...activeChannelProfileStore.channelProfiles, nextProfile].sort((left, right) => left.channelId.localeCompare(right.channelId)),
  };
  saveChannelProfilesToDisk(activeChannelProfileStore);
  return nextProfile;
}

export function deleteChannelProfile(channelId: string) {
  const currentProfile = getChannelProfile(channelId);

  if (!currentProfile) {
    return false;
  }

  activeChannelProfileStore = {
    channelProfiles: activeChannelProfileStore.channelProfiles.filter((profile) => profile.channelId !== channelId),
  };
  saveChannelProfilesToDisk(activeChannelProfileStore);
  return true;
}
