import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ContentType } from "../lib/content-provider.js";
import { reloadChannelProfiles, type ChannelProfile } from "./channel-profiles.js";

export const discoverySourceTypes = ["rss", "youtube", "reddit", "local", "generated", "saved-message"] as const;
export const discoverySafetyStatuses = ["ok", "needs-review", "blocked"] as const;
export const discoverySuggestedContentTypes = ["fact", "history", "joke", "wyr", "prompt", "trivia", "saved-message", "link", "video"] as const;
export const discoveryItemWorkflowStates = ["new", "reviewed", "saved", "dismissed", "prepared", "posted"] as const;

export type DiscoverySourceType = (typeof discoverySourceTypes)[number];
export type DiscoverySafetyStatus = (typeof discoverySafetyStatuses)[number];
export type DiscoverySuggestedContentType = ContentType | "saved-message" | "link" | "video";
export type DiscoveryItemWorkflowState = (typeof discoveryItemWorkflowStates)[number];

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
  suggestedChannelName: string | null;
  suggestedReason: string;
  suggestedContentType: DiscoverySuggestedContentType;
  tags: string[];
  score: number;
  safetyStatus: DiscoverySafetyStatus;
  isMock: boolean;
};

export type DiscoveryItemState = {
  itemId: string;
  state: DiscoveryItemWorkflowState;
  updatedAt: number;
  note: string | null;
  preparedMessage: string | null;
};

export type DiscoveryItemWithState = DiscoveryItem & {
  workflowState: DiscoveryItemWorkflowState;
  workflowUpdatedAt: number | null;
  workflowNote: string | null;
  preparedMessage: string | null;
};

type DiscoverySourceStore = {
  sources: DiscoverySourceConfig[];
};

type DiscoveryItemStore = {
  items: DiscoveryItem[];
};

type DiscoveryActionStore = {
  actions: DiscoveryItemState[];
};

export type DiscoveryRefreshResult = {
  sourceId: string;
  ok: boolean;
  itemCount: number;
  error: string | null;
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
const ACTIONS_DATA_FILE = path.join(DATA_DIR, "discovery-actions.json");

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
const rssFetchTimeoutMs = 8000;
const rssMaxRedirects = 3;
const rssMaxItemsPerSource = 20;
const rssUnsafePattern = /\b(?:adult|casino|gambling|nsfw|porn|sex|viagra|xxx|crypto giveaway|free money|work from home)\b/i;

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

function normalizeHttpsUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") {
      return null;
    }

    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key) || ["fbclid", "gclid"].includes(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }

    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function hashDiscoveryValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_match, code) => String.fromCharCode(Number.parseInt(code, 16)));
}

function stripHtml(value: string) {
  return decodeXmlEntities(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampText(value: string, maxLength: number) {
  const sanitizedValue = stripHtml(value);
  return sanitizedValue.length > maxLength ? sanitizedValue.slice(0, maxLength - 1).trimEnd() : sanitizedValue;
}

function getXmlTagValue(block: string, tagName: string) {
  const match = block.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match?.[1] ?? null;
}

function getXmlAttributeValue(block: string, tagName: string, attributeName: string) {
  const tagMatch = block.match(new RegExp(`<${tagName}\\b([^>]*)>`, "i"));
  const attributes = tagMatch?.[1] ?? "";
  const attributeMatch = attributes.match(new RegExp(`${attributeName}=["']([^"']+)["']`, "i"));
  return attributeMatch?.[1] ? decodeXmlEntities(attributeMatch[1]) : null;
}

function parseRssDate(value: string | null) {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(stripHtml(value));
  return Number.isFinite(timestamp) ? timestamp : null;
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

  const suggestedChannelName = sanitizeNullableString(value.suggestedChannelName, maxNameLength);

  if (
    value.suggestedChannelName !== null &&
    value.suggestedChannelName !== undefined &&
    value.suggestedChannelName !== "" &&
    !suggestedChannelName
  ) {
    return {
      ok: false,
      error: `suggestedChannelName must be ${maxNameLength} characters or fewer.`,
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
      suggestedChannelName,
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

export function validateDiscoveryItemStateRequest(value: unknown): ValidationResult<{
  itemId: string;
  state: DiscoveryItemWorkflowState;
  note: string | null;
  preparedMessage: string | null;
}> {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Discovery item state payload must be a JSON object.",
    };
  }

  const itemId = sanitizeString(value.itemId, 120);

  if (!itemId || !/^[a-z0-9][a-z0-9:_-]{0,119}$/.test(itemId)) {
    return {
      ok: false,
      error: "Invalid discovery item ID.",
    };
  }

  const state = sanitizeEnum(value.state, discoveryItemWorkflowStates);

  if (!state) {
    return {
      ok: false,
      error: `Invalid discovery item state. Allowed values: ${discoveryItemWorkflowStates.join(", ")}.`,
    };
  }

  const note = sanitizeNullableString(value.note, 500);
  const preparedMessage = sanitizeNullableString(value.preparedMessage, 2000);

  if (value.note !== null && value.note !== undefined && value.note !== "" && !note) {
    return {
      ok: false,
      error: "note must be 500 characters or fewer.",
    };
  }

  if (value.preparedMessage !== null && value.preparedMessage !== undefined && value.preparedMessage !== "" && !preparedMessage) {
    return {
      ok: false,
      error: "preparedMessage must be 2000 characters or fewer.",
    };
  }

  return {
    ok: true,
    value: {
      itemId,
      state,
      note,
      preparedMessage,
    },
  };
}

export function validateDiscoveryRefreshRequest(value: unknown): ValidationResult<{ sourceId: string | null }> {
  if (value === null || value === undefined) {
    return {
      ok: true,
      value: {
        sourceId: null,
      },
    };
  }

  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Discovery refresh payload must be a JSON object.",
    };
  }

  if (value.sourceId === undefined || value.sourceId === null || value.sourceId === "") {
    return {
      ok: true,
      value: {
        sourceId: null,
      },
    };
  }

  const sourceId = sanitizeString(value.sourceId, 80);

  if (!sourceId || !idPattern.test(sourceId)) {
    return {
      ok: false,
      error: "Invalid discovery source ID.",
    };
  }

  return {
    ok: true,
    value: {
      sourceId,
    },
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

function sanitizeDiscoveryItemStateFromDisk(value: unknown): DiscoveryItemState | null {
  if (!isRecord(value)) {
    return null;
  }

  const validation = validateDiscoveryItemStateRequest(value);
  const updatedAt = sanitizeTimestamp(value.updatedAt);

  if (!validation.ok || updatedAt === null) {
    return null;
  }

  return {
    itemId: validation.value.itemId,
    state: validation.value.state,
    updatedAt,
    note: validation.value.note,
    preparedMessage: validation.value.preparedMessage,
  };
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

function sanitizeActionStore(value: unknown): DiscoveryActionStore {
  if (!isRecord(value) || !Array.isArray(value.actions)) {
    return {
      actions: [],
    };
  }

  const actionsByItemId = new Map<string, DiscoveryItemState>();

  for (const rawAction of value.actions) {
    const action = sanitizeDiscoveryItemStateFromDisk(rawAction);

    if (action) {
      actionsByItemId.set(action.itemId, action);
    }
  }

  return {
    actions: [...actionsByItemId.values()].sort((left, right) => right.updatedAt - left.updatedAt),
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

function loadActionStore(): DiscoveryActionStore {
  try {
    const fileContents = fs.readFileSync(ACTIONS_DATA_FILE, "utf8");
    return sanitizeActionStore(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[discovery] could not load discovery actions from ${ACTIONS_DATA_FILE}.`, error);
    }

    return {
      actions: [],
    };
  }
}

let activeDiscoverySourceStore = loadSourceStore();
let activeDiscoveryItemStore = loadItemStore();
let activeDiscoveryActionStore = loadActionStore();

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

function getDiscoveryItemState(itemId: string) {
  return activeDiscoveryActionStore.actions.find((action) => action.itemId === itemId) ?? null;
}

function withDiscoveryItemState(item: DiscoveryItem): DiscoveryItemWithState {
  const action = getDiscoveryItemState(item.id);

  return {
    ...item,
    workflowState: action?.state ?? "new",
    workflowUpdatedAt: action?.updatedAt ?? null,
    workflowNote: action?.note ?? null,
    preparedMessage: action?.preparedMessage ?? null,
  };
}

export function listDiscoveryItems() {
  return activeDiscoveryItemStore.items.map(withDiscoveryItemState);
}

export function upsertDiscoveryItemState(input: {
  itemId: string;
  state: DiscoveryItemWorkflowState;
  note?: string | null;
  preparedMessage?: string | null;
}) {
  const currentItem = activeDiscoveryItemStore.items.find((item) => item.id === input.itemId);

  if (!currentItem) {
    return null;
  }

  const now = Date.now();
  const nextAction: DiscoveryItemState = {
    itemId: input.itemId,
    state: input.state,
    updatedAt: now,
    note: input.note?.trim() || null,
    preparedMessage: input.preparedMessage?.trim() || null,
  };

  activeDiscoveryActionStore = {
    actions: [
      nextAction,
      ...activeDiscoveryActionStore.actions.filter((action) => action.itemId !== input.itemId),
    ].sort((left, right) => right.updatedAt - left.updatedAt),
  };
  saveJsonFile(ACTIONS_DATA_FILE, activeDiscoveryActionStore, "discovery actions");
  return withDiscoveryItemState(currentItem);
}

export function upsertDiscoveryItems(items: DiscoveryItem[]) {
  const itemsById = new Map(activeDiscoveryItemStore.items.map((item) => [item.id, item]));
  const idsByDedupeKey = new Map(activeDiscoveryItemStore.items.map((item) => [getDiscoveryItemDedupeKey(item), item.id]));

  reloadChannelProfiles();
  const rankedItems = items.map(rankDiscoveryItem);

  for (const item of rankedItems) {
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
  return rankedItems;
}

export function rerankDiscoveryItems(sourceId?: string | null) {
  reloadChannelProfiles();
  const rerankedItems = activeDiscoveryItemStore.items.map((item) => (sourceId && item.sourceId !== sourceId ? item : rankDiscoveryItem(item)));

  activeDiscoveryItemStore = {
    items: rerankedItems.sort((left, right) => right.discoveredAt - left.discoveredAt),
  };
  saveJsonFile(ITEMS_DATA_FILE, activeDiscoveryItemStore, "discovery items");
  return activeDiscoveryItemStore.items;
}

export function getDiscoveryRerankDebug(items: DiscoveryItem[] = activeDiscoveryItemStore.items) {
  return createDiscoveryRerankDebug(items);
}

export function deleteDiscoveryItem(id: string) {
  const currentItem = activeDiscoveryItemStore.items.find((item) => item.id === id);

  if (!currentItem) {
    return false;
  }

  activeDiscoveryItemStore = {
    items: activeDiscoveryItemStore.items.filter((item) => item.id !== id),
  };
  activeDiscoveryActionStore = {
    actions: activeDiscoveryActionStore.actions.filter((action) => action.itemId !== id),
  };
  saveJsonFile(ITEMS_DATA_FILE, activeDiscoveryItemStore, "discovery items");
  saveJsonFile(ACTIONS_DATA_FILE, activeDiscoveryActionStore, "discovery actions");
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

const discoveryMatchStopWords = new Set([
  "and",
  "are",
  "for",
  "from",
  "into",
  "news",
  "rss",
  "the",
  "this",
  "with",
]);

const purposeKeywordMap: Record<string, string[]> = {
  genealogy: ["genealogy", "family", "ancestry", "ancestor", "record", "records", "research"],
  gaming: ["gaming", "game", "games", "player", "players", "console"],
  sports: ["sports", "sport", "match", "matchup", "player", "team", "teams", "season"],
  news: ["news", "headline", "headlines", "story", "current", "world", "politics"],
  history: ["history", "historical", "archive", "archives", "past", "century", "war"],
  science: ["science", "space", "nasa", "research", "discovery", "mission", "astronomy"],
  memes: ["meme", "memes", "funny", "joke", "humor", "viral"],
  "general-chat": ["community", "chat", "conversation", "discussion", "general"],
  custom: [],
};

function getDiscoveryMatchTokens(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !discoveryMatchStopWords.has(token));
}

function getTokenSet(values: Array<string | null | undefined>) {
  return new Set(values.flatMap(getDiscoveryMatchTokens));
}

function getOverlappingTokens(leftTokens: Set<string>, rightTokens: Set<string>) {
  return [...leftTokens].filter((token) => rightTokens.has(token));
}

function getProfilePurposeTokens(profile: ChannelProfile) {
  return getTokenSet([
    profile.channelName,
    profile.purpose,
    ...(purposeKeywordMap[profile.purpose] ?? []),
    profile.topicOverride,
    profile.notes,
  ]);
}

function getProfileSourceTokens(profile: ChannelProfile) {
  return getTokenSet([
    profile.channelName,
    profile.purpose,
    profile.topicOverride,
    ...(purposeKeywordMap[profile.purpose] ?? []),
  ]);
}

function getDiscoveryContentTypeCandidates(item: DiscoveryItem) {
  const candidates = new Set<DiscoverySuggestedContentType>([item.suggestedContentType]);
  const textTokens = getTokenSet([item.sourceName, item.title, item.description, ...item.tags]);

  if (item.suggestedContentType === "link" || item.sourceType === "rss") {
    candidates.add("prompt");

    if (["news", "science", "technology", "finance", "sports"].some((token) => textTokens.has(token))) {
      candidates.add("fact");
    }

    if (["history", "genealogy", "archive", "archives"].some((token) => textTokens.has(token))) {
      candidates.add("history");
      candidates.add("fact");
    }

    if (["gaming", "game", "games", "music", "movie", "movies"].some((token) => textTokens.has(token))) {
      candidates.add("trivia");
      candidates.add("prompt");
    }
  }

  return candidates;
}

function getProfilePreferredContentMatch(profile: ChannelProfile, item: DiscoveryItem) {
  const contentTypeCandidates = getDiscoveryContentTypeCandidates(item);
  return profile.preferredContentTypes.find((contentType) => contentTypeCandidates.has(contentType));
}

function getDiscoveryFreshnessScore(item: DiscoveryItem) {
  const timestamp = item.publishedAt ?? item.discoveredAt;
  return timestamp && Date.now() - timestamp <= 7 * 24 * 60 * 60 * 1000 ? 10 : 0;
}

function getSuggestedChannelName(profile: ChannelProfile) {
  return profile.channelName || `<#${profile.channelId}>`;
}

function scoreDiscoveryItemForProfile(item: DiscoveryItem, profile: ChannelProfile) {
  const discoveryTextTokens = getTokenSet([
    item.sourceName,
    item.title,
    item.description,
    item.suggestedContentType,
    ...item.tags,
  ]);
  const profilePurposeTokens = getProfilePurposeTokens(profile);
  const tagTokens = getTokenSet(item.tags);
  const profileSourceTokens = getProfileSourceTokens(profile);
  const matchedParts: string[] = [];
  let score = 0;

  const purposeMatches = getOverlappingTokens(profilePurposeTokens, discoveryTextTokens);
  if (purposeMatches.length > 0) {
    score += 40;
    matchedParts.push(`profile topic matched ${purposeMatches.slice(0, 3).join(", ")}`);
  }

  const preferredContentType = getProfilePreferredContentMatch(profile, item);
  if (preferredContentType) {
    score += 25;
    matchedParts.push(`profile prefers ${preferredContentType}`);
  }

  const tagMatches = getOverlappingTokens(tagTokens, profilePurposeTokens);
  if (tagMatches.length > 0) {
    score += 15;
    matchedParts.push(`tagged ${tagMatches.slice(0, 3).join(", ")}`);
  }

  const sourceMatches = getOverlappingTokens(profileSourceTokens, getTokenSet([item.sourceName, ...item.tags]));
  if (sourceMatches.length > 0) {
    score += 10;
    matchedParts.push(`${item.sourceName} matches ${sourceMatches.slice(0, 2).join(", ")}`);
  }

  const freshnessScore = getDiscoveryFreshnessScore(item);
  if (freshnessScore > 0) {
    score += freshnessScore;
    matchedParts.push("source item is fresh");
  }

  return {
    profile,
    score: Math.min(100, score),
    matchedParts,
  };
}

function rankDiscoveryItem(item: DiscoveryItem): DiscoveryItem {
  const rankedProfiles = getRankedProfileMatches(item, reloadChannelProfiles());
  const bestMatch = rankedProfiles[0];

  if (!bestMatch || bestMatch.score < 40) {
    return {
      ...item,
      suggestedChannelId: null,
      suggestedChannelName: null,
      suggestedReason: "No channel profile strongly matched.",
      score: Math.max(0, Math.min(100, bestMatch?.score ?? 0)),
    };
  }

  const suggestedChannelName = getSuggestedChannelName(bestMatch.profile);
  const reasonDetails = bestMatch.matchedParts.length > 0
    ? bestMatch.matchedParts.join("; ")
    : "the channel profile matched this discovery item";

  return {
    ...item,
    suggestedChannelId: bestMatch.profile.channelId,
    suggestedChannelName,
    suggestedReason: `Matched ${suggestedChannelName} because ${reasonDetails}.`,
    score: bestMatch.score,
  };
}

function getRankedProfileMatches(item: DiscoveryItem, profiles: ChannelProfile[]) {
  return profiles
    .map((profile) => scoreDiscoveryItemForProfile(item, profile))
    .sort((left, right) => right.score - left.score || left.profile.channelId.localeCompare(right.profile.channelId));
}

function createDiscoveryRerankDebug(items: DiscoveryItem[]) {
  const profiles = reloadChannelProfiles();

  return {
    profileCount: profiles.length,
    profiles: profiles.map((profile) => ({
      channelId: profile.channelId,
      channelName: profile.channelName,
      purpose: profile.purpose,
      topicOverride: profile.topicOverride,
      preferredContentTypes: profile.preferredContentTypes,
    })),
    topCandidatesForUnmatchedItems: items
      .filter((item) => !item.suggestedChannelId)
      .slice(0, 25)
      .map((item) => {
        const topCandidate = getRankedProfileMatches(item, profiles)[0] ?? null;

        return {
          itemId: item.id,
          sourceName: item.sourceName,
          title: item.title,
          tags: item.tags,
          score: item.score,
          topCandidate: topCandidate
            ? {
                channelId: topCandidate.profile.channelId,
                channelName: topCandidate.profile.channelName,
                purpose: topCandidate.profile.purpose,
                topicOverride: topCandidate.profile.topicOverride,
                preferredContentTypes: topCandidate.profile.preferredContentTypes,
                score: topCandidate.score,
                matchedParts: topCandidate.matchedParts,
              }
            : null,
        };
      }),
  };
}

function updateDiscoverySourceRefreshState(sourceId: string, patch: Pick<DiscoverySourceConfig, "lastRefreshAt" | "lastError">) {
  const currentSource = activeDiscoverySourceStore.sources.find((source) => source.id === sourceId);

  if (!currentSource) {
    return null;
  }

  const nextSource: DiscoverySourceConfig = {
    ...currentSource,
    lastRefreshAt: patch.lastRefreshAt,
    lastError: patch.lastError,
    updatedAt: Date.now(),
  };

  activeDiscoverySourceStore = {
    sources: activeDiscoverySourceStore.sources.map((source) => (source.id === sourceId ? nextSource : source)),
  };
  saveJsonFile(SOURCES_DATA_FILE, activeDiscoverySourceStore, "discovery sources");
  return nextSource;
}

async function fetchRssText(url: string, redirectCount = 0): Promise<string> {
  const normalizedUrl = normalizeHttpsUrl(url);

  if (!normalizedUrl) {
    throw new Error("RSS source URL must be https.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), rssFetchTimeoutMs);

  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.1",
        "User-Agent": "CdawgBotDiscovery/1.0",
      },
      redirect: "manual",
      signal: controller.signal,
    });

    if (response.status >= 300 && response.status < 400) {
      if (redirectCount >= rssMaxRedirects) {
        throw new Error("RSS fetch exceeded redirect limit.");
      }

      const location = response.headers.get("location");

      if (!location) {
        throw new Error("RSS redirect did not include a location.");
      }

      const redirectUrl = normalizeHttpsUrl(new URL(location, normalizedUrl).toString());

      if (!redirectUrl) {
        throw new Error("RSS redirect target must be https.");
      }

      return fetchRssText(redirectUrl, redirectCount + 1);
    }

    if (!response.ok) {
      throw new Error(`RSS fetch failed with ${response.status}.`);
    }

    const contentLength = Number(response.headers.get("content-length") ?? 0);

    if (contentLength > 1_000_000) {
      throw new Error("RSS feed is too large.");
    }

    const body = await response.text();

    if (body.length > 1_000_000) {
      throw new Error("RSS feed is too large.");
    }

    return body;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error("RSS fetch timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getRssEntryBlocks(xmlText: string) {
  const itemMatches = xmlText.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  if (itemMatches.length > 0) {
    return itemMatches;
  }

  return xmlText.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];
}

function getRssEntryUrl(entryBlock: string) {
  const rawRssLink = getXmlTagValue(entryBlock, "link");
  const rawAtomLink = getXmlAttributeValue(entryBlock, "link", "href");
  const rawUrl = rawRssLink ? stripHtml(rawRssLink) : rawAtomLink;
  return rawUrl ? normalizeHttpsUrl(rawUrl) : null;
}

function getRssEntryDescription(entryBlock: string, fallbackTitle: string) {
  const rawDescription =
    getXmlTagValue(entryBlock, "description") ??
    getXmlTagValue(entryBlock, "summary") ??
    getXmlTagValue(entryBlock, "content") ??
    getXmlTagValue(entryBlock, "content:encoded") ??
    fallbackTitle;
  return clampText(rawDescription, maxDescriptionLength);
}

function buildRssExternalId(entryBlock: string, sourceUrl: string, title: string, publishedAt: number | null) {
  const guid = getXmlTagValue(entryBlock, "guid");
  const id = getXmlTagValue(entryBlock, "id");
  const rawExternalId = stripHtml(guid ?? id ?? sourceUrl ?? `${title}:${publishedAt ?? ""}`);
  return hashDiscoveryValue(rawExternalId).slice(0, maxExternalIdLength);
}

function buildRssDiscoveryItem(source: DiscoverySourceConfig, entryBlock: string, discoveredAt: number): DiscoveryItem | null {
  const rawTitle = getXmlTagValue(entryBlock, "title");
  const title = rawTitle ? clampText(rawTitle, maxTitleLength) : "";

  if (!title) {
    return null;
  }

  const sourceUrl = getRssEntryUrl(entryBlock);

  if (!sourceUrl) {
    return null;
  }

  const description = getRssEntryDescription(entryBlock, title);
  const unsafeText = `${title} ${description}`;

  if (rssUnsafePattern.test(unsafeText)) {
    return null;
  }

  const publishedAt = parseRssDate(getXmlTagValue(entryBlock, "pubDate") ?? getXmlTagValue(entryBlock, "published") ?? getXmlTagValue(entryBlock, "updated"));
  const externalId = buildRssExternalId(entryBlock, sourceUrl, title, publishedAt);
  const itemHash = hashDiscoveryValue(`${source.type}:${source.id}:${externalId}`);
  const suggestedChannelId = source.preferredChannelIds[0] ?? null;
  const suggestedReason = suggestedChannelId
    ? `Loaded from ${source.name} and will be ranked against channel profiles before review.`
    : `Loaded from ${source.name}. Review before choosing where to use it.`;

  return {
    id: `rss:${source.id}:${itemHash}`,
    sourceType: "rss",
    sourceId: source.id,
    externalId,
    sourceName: source.name,
    title,
    description: description || title,
    thumbnailUrl: null,
    thumbnailKind: "rss",
    sourceUrl,
    publishedAt,
    discoveredAt,
    suggestedChannelId,
    suggestedChannelName: null,
    suggestedReason,
    suggestedContentType: "link",
    tags: source.defaultTags,
    score: 0,
    safetyStatus: "needs-review",
    isMock: false,
  };
}

function parseRssDiscoveryItems(source: DiscoverySourceConfig, xmlText: string, discoveredAt: number) {
  return getRssEntryBlocks(xmlText)
    .slice(0, rssMaxItemsPerSource)
    .map((entryBlock) => buildRssDiscoveryItem(source, entryBlock, discoveredAt))
    .filter((item): item is DiscoveryItem => Boolean(item));
}

async function refreshSingleRssSource(source: DiscoverySourceConfig): Promise<DiscoveryRefreshResult> {
  if (source.type !== "rss") {
    return {
      sourceId: source.id,
      ok: false,
      itemCount: 0,
      error: "Discovery source is not an RSS source.",
    };
  }

  if (!source.url || !normalizeHttpsUrl(source.url)) {
    const error = "RSS source URL must be https.";
    updateDiscoverySourceRefreshState(source.id, {
      lastRefreshAt: Date.now(),
      lastError: error,
    });
    return {
      sourceId: source.id,
      ok: false,
      itemCount: 0,
      error,
    };
  }

  try {
    const discoveredAt = Date.now();
    const xmlText = await fetchRssText(source.url);
    const items = parseRssDiscoveryItems(source, xmlText, discoveredAt);
    upsertDiscoveryItems(items);
    rerankDiscoveryItems(source.id);
    updateDiscoverySourceRefreshState(source.id, {
      lastRefreshAt: discoveredAt,
      lastError: null,
    });
    return {
      sourceId: source.id,
      ok: true,
      itemCount: items.length,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, maxErrorLength) : "RSS refresh failed.";
    updateDiscoverySourceRefreshState(source.id, {
      lastRefreshAt: Date.now(),
      lastError: message,
    });
    return {
      sourceId: source.id,
      ok: false,
      itemCount: 0,
      error: message,
    };
  }
}

export async function refreshRssDiscoverySources(sourceId?: string | null) {
  const sources = sourceId
    ? activeDiscoverySourceStore.sources.filter((source) => source.id === sourceId)
    : activeDiscoverySourceStore.sources.filter((source) => source.type === "rss" && source.enabled !== false);

  if (sourceId && sources.length === 0) {
    return {
      ok: false,
      code: "SOURCE_NOT_FOUND" as const,
      error: "Discovery source not found.",
      results: [] as DiscoveryRefreshResult[],
      items: listDiscoveryItems(),
      sources: listDiscoverySources(),
    };
  }

  if (sourceId && sources[0]?.type !== "rss") {
    return {
      ok: false,
      code: "SOURCE_NOT_RSS" as const,
      error: "Discovery source is not an RSS source.",
      results: [] as DiscoveryRefreshResult[],
      items: listDiscoveryItems(),
      sources: listDiscoverySources(),
    };
  }

  const results: DiscoveryRefreshResult[] = [];

  for (const source of sources) {
    results.push(await refreshSingleRssSource(source));
  }

  return {
    ok: results.every((result) => result.ok),
    code: "OK" as const,
    results,
    items: listDiscoveryItems(),
    sources: listDiscoverySources(),
  };
}
