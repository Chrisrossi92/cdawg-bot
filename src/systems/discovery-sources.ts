import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentType } from "../lib/content-provider.js";

export const discoverySourceTypes = ["rss", "youtube", "reddit", "local", "generated", "saved-message"] as const;
export const discoverySafetyStatuses = ["ok", "needs-review", "blocked"] as const;
export const discoverySuggestedContentTypes = ["fact", "history", "joke", "wyr", "prompt", "trivia", "saved-message", "link", "video"] as const;

export type DiscoverySourceType = (typeof discoverySourceTypes)[number];
export type DiscoverySafetyStatus = (typeof discoverySafetyStatuses)[number];
export type DiscoverySuggestedContentType = ContentType | "saved-message" | "link" | "video";

export type DiscoverySourceConfig = {
  id: string;
  type: DiscoverySourceType;
  enabled: boolean;
  name: string;
  url: string | null;
  defaultTags: string[];
  preferredChannelIds: string[];
  createdAt: number;
  updatedAt: number;
  lastRefreshAt: number | null;
  lastError: string | null;
};

export type DiscoverySourceInput = Omit<DiscoverySourceConfig, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type DiscoveryItem = {
  id: string;
  sourceType: DiscoverySourceType;
  sourceId: string;
  externalId: string;
  sourceName: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  thumbnailKind: string | null;
  sourceUrl: string | null;
  publishedAt: number | null;
  discoveredAt: number;
  suggestedChannelId: string | null;
  suggestedReason: string;
  suggestedContentType: DiscoverySuggestedContentType;
  tags: string[];
  score: number;
  safetyStatus: DiscoverySafetyStatus;
  isMock: boolean;
};

type DiscoverySourceStore = {
  sources: DiscoverySourceConfig[];
};

type DiscoveryItemStore = {
  items: DiscoveryItem[];
};

type ValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: string;
    };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const SOURCES_DATA_FILE = path.join(DATA_DIR, "discovery-sources.json");
const ITEMS_DATA_FILE = path.join(DATA_DIR, "discovery-items.json");

const idPattern = /^[a-z0-9][a-z0-9_-]{0,79}$/;
const tagPattern = /^[a-z0-9][a-z0-9_-]{0,39}$/;
const discordSnowflakePattern = /^\d{17,20}$/;
const maxTags = 12;
const maxPreferredChannels = 20;
const maxNameLength = 120;
const maxTitleLength = 180;
const maxDescriptionLength = 600;
const maxReasonLength = 500;
const maxErrorLength = 500;
const maxExternalIdLength = 240;
const maxThumbnailKindLength = 40;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.length > maxLength) {
    return null;
  }

  return trimmedValue;
}

function sanitizeNullableString(value: unknown, maxLength: number) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return sanitizeString(value, maxLength);
}

function sanitizeTimestamp(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return Math.floor(value);
}

function sanitizeBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function sanitizeEnum<T extends readonly string[]>(value: unknown, allowedValues: T): T[number] | null {
  return typeof value === "string" && allowedValues.includes(value) ? value : null;
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeOptionalHttpsUrl(value: unknown, fieldName: string): ValidationResult<string | null> {
  const url = sanitizeNullableString(value, 2048);

  if (!url) {
    return {
      ok: true,
      value: null,
    };
  }

  if (!isHttpsUrl(url)) {
    return {
      ok: false,
      error: `${fieldName} must be an https URL when provided.`,
    };
  }

  return {
    ok: true,
    value: url,
  };
}

function sanitizeTags(value: unknown, fieldName: string): ValidationResult<string[]> {
  if (!Array.isArray(value)) {
    return {
      ok: false,
      error: `${fieldName} must be an array.`,
    };
  }

  const tags = [...new Set(value.map((entry) => (typeof entry === "string" ? entry.trim().toLowerCase() : "")).filter(Boolean))];

  if (tags.length > maxTags || tags.some((tag) => !tagPattern.test(tag))) {
    return {
      ok: false,
      error: `${fieldName} must contain ${maxTags} or fewer lowercase tag values.`,
    };
  }

  return {
    ok: true,
    value: tags,
  };
}

function sanitizeChannelIds(value: unknown): ValidationResult<string[]> {
  if (!Array.isArray(value)) {
    return {
      ok: false,
      error: "preferredChannelIds must be an array.",
    };
  }

  const channelIds = [...new Set(value.map((entry) => (typeof entry === "string" ? entry.trim() : "")).filter(Boolean))];

  if (channelIds.length > maxPreferredChannels || channelIds.some((channelId) => !discordSnowflakePattern.test(channelId))) {
    return {
      ok: false,
      error: "preferredChannelIds must contain valid Discord snowflake strings.",
    };
  }

  return {
    ok: true,
    value: channelIds,
  };
}

function createDiscoverySourceId(type: DiscoverySourceType, name: string) {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "source";
  return `discovery_${type}_${normalizedName}_${Date.now().toString(36)}`;
}

function getDiscoveryItemDedupeKey(item: Pick<DiscoveryItem, "sourceType" | "sourceId" | "externalId">) {
  return `${item.sourceType}:${item.sourceId}:${item.externalId}`;
}

export function validateDiscoverySourceInput(value: unknown): ValidationResult<DiscoverySourceInput> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Discovery source payload must be a JSON object.",
    };
  }

  const id = value.id === undefined ? undefined : sanitizeString(value.id, 80);

  if (value.id !== undefined && (!id || !idPattern.test(id))) {
    return {
      ok: false,
      error: "Invalid discovery source ID.",
    };
  }

  const type = sanitizeEnum(value.type, discoverySourceTypes);

  if (!type) {
    return {
      ok: false,
      error: `Invalid discovery source type. Allowed values: ${discoverySourceTypes.join(", ")}.`,
    };
  }

  const enabled = sanitizeBoolean(value.enabled);

  if (enabled === null) {
    return {
      ok: false,
      error: "Invalid enabled flag.",
    };
  }

  const name = sanitizeString(value.name, maxNameLength);

  if (!name) {
    return {
      ok: false,
      error: `Name is required and must be ${maxNameLength} characters or fewer.`,
    };
  }

  const urlValidation = sanitizeOptionalHttpsUrl(value.url, "url");

  if (!urlValidation.ok) {
    return urlValidation;
  }

  const defaultTagsValidation = sanitizeTags(value.defaultTags, "defaultTags");

  if (!defaultTagsValidation.ok) {
    return defaultTagsValidation;
  }

  const preferredChannelIdsValidation = sanitizeChannelIds(value.preferredChannelIds);

  if (!preferredChannelIdsValidation.ok) {
    return preferredChannelIdsValidation;
  }

  const lastRefreshAt = sanitizeTimestamp(value.lastRefreshAt);

  if (value.lastRefreshAt !== null && value.lastRefreshAt !== undefined && lastRefreshAt === null) {
    return {
      ok: false,
      error: "Invalid lastRefreshAt timestamp.",
    };
  }

  const lastError = sanitizeNullableString(value.lastError, maxErrorLength);

  if (value.lastError !== null && value.lastError !== undefined && value.lastError !== "" && !lastError) {
    return {
      ok: false,
      error: `lastError must be ${maxErrorLength} characters or fewer.`,
    };
  }

  return {
    ok: true,
    value: {
      ...(id ? { id } : {}),
      type,
      enabled,
      name,
      url: urlValidation.value,
      defaultTags: defaultTagsValidation.value,
      preferredChannelIds: preferredChannelIdsValidation.value,
      lastRefreshAt,
      lastError,
    },
  };
}

export function validateDiscoverySourceDeleteRequest(value: unknown): ValidationResult<{ id: string }> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Discovery source payload must be a JSON object.",
    };
  }

  const id = sanitizeString(value.id, 80);

  if (!id || !idPattern.test(id)) {
    return {
      ok: false,
      error: "Invalid discovery source ID.",
    };
  }

  return {
    ok: true,
    value: { id },
  };
}

export function validateDiscoveryItemInput(value: unknown): ValidationResult<DiscoveryItem> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Discovery item payload must be a JSON object.",
    };
  }

  const id = sanitizeString(value.id, 120);

  if (!id || !/^[a-z0-9][a-z0-9:_-]{0,119}$/.test(id)) {
    return {
      ok: false,
      error: "Invalid discovery item ID.",
    };
  }

  const sourceType = sanitizeEnum(value.sourceType, discoverySourceTypes);

  if (!sourceType) {
    return {
      ok: false,
      error: `Invalid discovery source type. Allowed values: ${discoverySourceTypes.join(", ")}.`,
    };
  }

  const sourceId = sanitizeString(value.sourceId, 80);

  if (!sourceId || !idPattern.test(sourceId)) {
    return {
      ok: false,
      error: "Invalid discovery source ID.",
    };
  }

  const externalId = sanitizeString(value.externalId, maxExternalIdLength);

  if (!externalId) {
    return {
      ok: false,
      error: `externalId is required and must be ${maxExternalIdLength} characters or fewer.`,
    };
  }

  const sourceName = sanitizeString(value.sourceName, maxNameLength);
  const title = sanitizeString(value.title, maxTitleLength);
  const description = sanitizeString(value.description, maxDescriptionLength);

  if (!sourceName || !title || !description) {
    return {
      ok: false,
      error: "sourceName, title, and description are required.",
    };
  }

  const thumbnailUrlValidation = sanitizeOptionalHttpsUrl(value.thumbnailUrl, "thumbnailUrl");

  if (!thumbnailUrlValidation.ok) {
    return thumbnailUrlValidation;
  }

  const thumbnailKind = sanitizeNullableString(value.thumbnailKind, maxThumbnailKindLength);

  if (value.thumbnailKind !== null && value.thumbnailKind !== undefined && value.thumbnailKind !== "" && !thumbnailKind) {
    return {
      ok: false,
      error: `thumbnailKind must be ${maxThumbnailKindLength} characters or fewer.`,
    };
  }

  const sourceUrlValidation = sanitizeOptionalHttpsUrl(value.sourceUrl, "sourceUrl");

  if (!sourceUrlValidation.ok) {
    return sourceUrlValidation;
  }

  const publishedAt = sanitizeTimestamp(value.publishedAt);

  if (value.publishedAt !== null && value.publishedAt !== undefined && publishedAt === null) {
    return {
      ok: false,
      error: "Invalid publishedAt timestamp.",
    };
  }

  const discoveredAt = sanitizeTimestamp(value.discoveredAt);

  if (discoveredAt === null) {
    return {
      ok: false,
      error: "Invalid discoveredAt timestamp.",
    };
  }

  const suggestedChannelId = sanitizeNullableString(value.suggestedChannelId, 20);

  if (
    value.suggestedChannelId !== null &&
    value.suggestedChannelId !== undefined &&
    value.suggestedChannelId !== "" &&
    (!suggestedChannelId || !discordSnowflakePattern.test(suggestedChannelId))
  ) {
    return {
      ok: false,
      error: "Invalid suggestedChannelId. Expected a Discord snowflake string or null.",
    };
  }

  const suggestedReason = sanitizeString(value.suggestedReason, maxReasonLength);

  if (!suggestedReason) {
    return {
      ok: false,
      error: `suggestedReason is required and must be ${maxReasonLength} characters or fewer.`,
    };
  }

  const suggestedContentType = sanitizeEnum(value.suggestedContentType, discoverySuggestedContentTypes);

  if (!suggestedContentType) {
    return {
      ok: false,
      error: `Invalid suggestedContentType. Allowed values: ${discoverySuggestedContentTypes.join(", ")}.`,
    };
  }

  const tagsValidation = sanitizeTags(value.tags, "tags");

  if (!tagsValidation.ok) {
    return tagsValidation;
  }

  if (typeof value.score !== "number" || !Number.isFinite(value.score) || value.score < 0 || value.score > 100) {
    return {
      ok: false,
      error: "score must be a number between 0 and 100.",
    };
  }

  const safetyStatus = sanitizeEnum(value.safetyStatus, discoverySafetyStatuses);

  if (!safetyStatus) {
    return {
      ok: false,
      error: `Invalid safetyStatus. Allowed values: ${discoverySafetyStatuses.join(", ")}.`,
    };
  }

  const isMock = sanitizeBoolean(value.isMock);

  if (isMock === null) {
    return {
      ok: false,
      error: "Invalid isMock flag.",
    };
  }

  return {
    ok: true,
    value: {
      id,
      sourceType,
      sourceId,
      externalId,
      sourceName,
      title,
      description,
      thumbnailUrl: thumbnailUrlValidation.value,
      thumbnailKind,
      sourceUrl: sourceUrlValidation.value,
      publishedAt,
      discoveredAt,
      suggestedChannelId,
      suggestedReason,
      suggestedContentType: suggestedContentType as DiscoverySuggestedContentType,
      tags: tagsValidation.value,
      score: value.score,
      safetyStatus,
      isMock,
    },
  };
}

export function validateDiscoveryItemsInput(value: unknown): ValidationResult<DiscoveryItem[]> {
  let rawItems: unknown[];

  if (Array.isArray(value)) {
    rawItems = value;
  } else if (isRecord(value) && Array.isArray(value.items)) {
    rawItems = value.items;
  } else if (isRecord(value) && isRecord(value.item)) {
    rawItems = [value.item];
  } else {
    rawItems = [value];
  }

  const items: DiscoveryItem[] = [];

  for (const rawItem of rawItems) {
    const validation = validateDiscoveryItemInput(rawItem);

    if (!validation.ok) {
      return validation;
    }

    items.push(validation.value);
  }

  return {
    ok: true,
    value: items,
  };
}

export function validateDiscoveryItemDeleteRequest(value: unknown): ValidationResult<{ id: string }> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Discovery item payload must be a JSON object.",
    };
  }

  const id = sanitizeString(value.id, 120);

  if (!id || !/^[a-z0-9][a-z0-9:_-]{0,119}$/.test(id)) {
    return {
      ok: false,
      error: "Invalid discovery item ID.",
    };
  }

  return {
    ok: true,
    value: { id },
  };
}

function sanitizeDiscoverySourceFromDisk(value: unknown): DiscoverySourceConfig | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id, 80);
  const createdAt = sanitizeTimestamp(value.createdAt);
  const updatedAt = sanitizeTimestamp(value.updatedAt);
  const inputValidation = validateDiscoverySourceInput(value);

  if (!id || !idPattern.test(id) || !createdAt || !updatedAt || !inputValidation.ok) {
    return null;
  }

  return {
    ...inputValidation.value,
    id,
    createdAt,
    updatedAt,
  };
}

function sanitizeDiscoveryItemFromDisk(value: unknown): DiscoveryItem | null {
  const validation = validateDiscoveryItemInput(value);
  return validation.ok ? validation.value : null;
}

function sanitizeSourceStore(value: unknown): DiscoverySourceStore {
  if (!isRecord(value) || !Array.isArray(value.sources)) {
    return {
      sources: [],
    };
  }

  const sourcesById = new Map<string, DiscoverySourceConfig>();

  for (const rawSource of value.sources) {
    const source = sanitizeDiscoverySourceFromDisk(rawSource);

    if (source) {
      sourcesById.set(source.id, source);
    }
  }

  return {
    sources: [...sourcesById.values()].sort((left, right) => left.name.localeCompare(right.name)),
  };
}

function sanitizeItemStore(value: unknown): DiscoveryItemStore {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return {
      items: [],
    };
  }

  const itemsById = new Map<string, DiscoveryItem>();
  const idsByDedupeKey = new Map<string, string>();

  for (const rawItem of value.items) {
    const item = sanitizeDiscoveryItemFromDisk(rawItem);

    if (!item) {
      continue;
    }

    const dedupeKey = getDiscoveryItemDedupeKey(item);
    const existingId = idsByDedupeKey.get(dedupeKey);

    if (existingId) {
      itemsById.delete(existingId);
    }

    idsByDedupeKey.set(dedupeKey, item.id);
    itemsById.set(item.id, item);
  }

  return {
    items: [...itemsById.values()].sort((left, right) => right.discoveredAt - left.discoveredAt),
  };
}

function saveJsonFile(filePath: string, value: unknown, label: string) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${filePath}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(value, null, 2));
    fs.renameSync(temporaryFilePath, filePath);
  } catch (error) {
    console.warn(`[discovery] could not save ${label} to ${filePath}.`, error);
  }
}

function loadSourceStore(): DiscoverySourceStore {
  try {
    const fileContents = fs.readFileSync(SOURCES_DATA_FILE, "utf8");
    return sanitizeSourceStore(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[discovery] could not load discovery sources from ${SOURCES_DATA_FILE}.`, error);
    }

    return {
      sources: [],
    };
  }
}

function loadItemStore(): DiscoveryItemStore {
  try {
    const fileContents = fs.readFileSync(ITEMS_DATA_FILE, "utf8");
    return sanitizeItemStore(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[discovery] could not load discovery items from ${ITEMS_DATA_FILE}.`, error);
    }

    return {
      items: [],
    };
  }
}

let activeDiscoverySourceStore = loadSourceStore();
let activeDiscoveryItemStore = loadItemStore();

export function listDiscoverySources() {
  return activeDiscoverySourceStore.sources;
}

export function upsertDiscoverySource(input: DiscoverySourceInput) {
  const now = Date.now();
  const currentSource = input.id ? activeDiscoverySourceStore.sources.find((source) => source.id === input.id) : null;
  const sourceId = input.id ?? createDiscoverySourceId(input.type, input.name);
  const nextSource: DiscoverySourceConfig = {
    id: sourceId,
    type: input.type,
    enabled: input.enabled,
    name: input.name.trim(),
    url: input.url,
    defaultTags: [...new Set(input.defaultTags)],
    preferredChannelIds: [...new Set(input.preferredChannelIds)],
    createdAt: currentSource?.createdAt ?? now,
    updatedAt: now,
    lastRefreshAt: input.lastRefreshAt,
    lastError: input.lastError,
  };

  activeDiscoverySourceStore = {
    sources: currentSource
      ? activeDiscoverySourceStore.sources.map((source) => (source.id === nextSource.id ? nextSource : source))
      : [...activeDiscoverySourceStore.sources, nextSource],
  };
  saveJsonFile(SOURCES_DATA_FILE, activeDiscoverySourceStore, "discovery sources");
  return nextSource;
}

export function deleteDiscoverySource(id: string) {
  const currentSource = activeDiscoverySourceStore.sources.find((source) => source.id === id);

  if (!currentSource) {
    return false;
  }

  activeDiscoverySourceStore = {
    sources: activeDiscoverySourceStore.sources.filter((source) => source.id !== id),
  };
  saveJsonFile(SOURCES_DATA_FILE, activeDiscoverySourceStore, "discovery sources");
  return true;
}

export function listDiscoveryItems() {
  return activeDiscoveryItemStore.items;
}

export function upsertDiscoveryItems(items: DiscoveryItem[]) {
  const itemsById = new Map(activeDiscoveryItemStore.items.map((item) => [item.id, item]));
  const idsByDedupeKey = new Map(activeDiscoveryItemStore.items.map((item) => [getDiscoveryItemDedupeKey(item), item.id]));

  for (const item of items) {
    const dedupeKey = getDiscoveryItemDedupeKey(item);
    const existingId = idsByDedupeKey.get(dedupeKey);

    if (existingId && existingId !== item.id) {
      itemsById.delete(existingId);
    }

    idsByDedupeKey.set(dedupeKey, item.id);
    itemsById.set(item.id, item);
  }

  activeDiscoveryItemStore = {
    items: [...itemsById.values()].sort((left, right) => right.discoveredAt - left.discoveredAt),
  };
  saveJsonFile(ITEMS_DATA_FILE, activeDiscoveryItemStore, "discovery items");
  return items;
}

export function deleteDiscoveryItem(id: string) {
  const currentItem = activeDiscoveryItemStore.items.find((item) => item.id === id);

  if (!currentItem) {
    return false;
  }

  activeDiscoveryItemStore = {
    items: activeDiscoveryItemStore.items.filter((item) => item.id !== id),
  };
  saveJsonFile(ITEMS_DATA_FILE, activeDiscoveryItemStore, "discovery items");
  return true;
}

export function clearDiscoveryItemsForSource(sourceId: string) {
  const previousCount = activeDiscoveryItemStore.items.length;
  activeDiscoveryItemStore = {
    items: activeDiscoveryItemStore.items.filter((item) => item.sourceId !== sourceId),
  };

  if (activeDiscoveryItemStore.items.length !== previousCount) {
    saveJsonFile(ITEMS_DATA_FILE, activeDiscoveryItemStore, "discovery items");
  }

  return previousCount - activeDiscoveryItemStore.items.length;
}
