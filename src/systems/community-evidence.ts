import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getEngagementSummary, type EngagementSummary } from "./engagement-activity.js";
import { getContentOutcomeSummary, type ContentOutcomeSummary } from "./content-outcomes.js";
import { getRecentAutomationActivity, type AutomationActivityItem } from "./automation-activity.js";
import { listChannelProfiles, type ChannelProfile } from "./channel-profiles.js";
import { getRecentConversationDecisions, type ConversationDecisionRecord } from "./conversation-participation.js";

export type CommunityEvidenceType =
  | "channel_activity_window"
  | "post_window_outcome"
  | "automation_issue"
  | "channel_context"
  | "conversation_decision";

export type CommunityEvidenceSourceSystem =
  | "engagement_activity"
  | "content_outcomes"
  | "automation_activity"
  | "channel_profiles"
  | "conversation_participation";

export type CommunityEvidenceSubjectType =
  | "community"
  | "channel"
  | "member"
  | "content"
  | "automation"
  | "conversation";

export type CommunityEvidenceServerContext = "fantasy" | "primal" | "general" | "unknown";
export type CommunityEvidenceStatus = "active" | "expired" | "superseded";
export type CommunityEvidenceFactValue = string | number | boolean | null;

export type CommunityEvidenceRecord = {
  id: string;
  schemaVersion: number;
  type: CommunityEvidenceType;
  sourceSystem: CommunityEvidenceSourceSystem;
  sourceRecordIds: string[];
  guildId?: string;
  channelId?: string;
  memberIdHash?: string;
  subjectType: CommunityEvidenceSubjectType;
  subjectId?: string;
  serverContext?: CommunityEvidenceServerContext;
  summary: string;
  facts: Record<string, CommunityEvidenceFactValue>;
  confidence: number;
  provenance: {
    sourceSystem: string;
    sourceRecordIds: string[];
    derivedBy: string;
    derivedAt: string;
  };
  observedAt: string;
  createdAt: string;
  expiresAt?: string;
  status: CommunityEvidenceStatus;
};

export type CommunityEvidenceGenerationResult = {
  generatedAt: string;
  generated: CommunityEvidenceRecord[];
  records: CommunityEvidenceRecord[];
  summary: {
    generated: number;
    retained: number;
  };
};

export type CommunityEvidenceSources = {
  engagementSummary?: EngagementSummary;
  contentOutcomes?: ContentOutcomeSummary[];
  automationActivity?: AutomationActivityItem[];
  channelProfiles?: ChannelProfile[];
  conversationDecisions?: ConversationDecisionRecord[];
};

export type CommunityEvidenceQuery = {
  type?: CommunityEvidenceType;
  sourceSystem?: CommunityEvidenceSourceSystem;
  status?: CommunityEvidenceStatus | "all";
  channelId?: string;
  subjectType?: CommunityEvidenceSubjectType;
  serverContext?: CommunityEvidenceServerContext;
  limit?: number;
};

type CommunityEvidenceStore = {
  records: CommunityEvidenceRecord[];
};

type CommunityEvidenceGenerationOptions = {
  now?: number;
  sources?: CommunityEvidenceSources;
  persist?: boolean;
  storageFilePath?: string;
  retentionLimit?: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "community-evidence.json");
const SCHEMA_VERSION = 1;
const DEFAULT_RETENTION_LIMIT = 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const validEvidenceTypes = new Set<CommunityEvidenceType>([
  "channel_activity_window",
  "post_window_outcome",
  "automation_issue",
  "channel_context",
  "conversation_decision",
]);
const validSourceSystems = new Set<CommunityEvidenceSourceSystem>([
  "engagement_activity",
  "content_outcomes",
  "automation_activity",
  "channel_profiles",
  "conversation_participation",
]);
const validSubjectTypes = new Set<CommunityEvidenceSubjectType>([
  "community",
  "channel",
  "member",
  "content",
  "automation",
  "conversation",
]);
const validServerContexts = new Set<CommunityEvidenceServerContext>(["fantasy", "primal", "general", "unknown"]);
const validStatuses = new Set<CommunityEvidenceStatus>(["active", "expired", "superseded"]);
const windowDurations: Record<keyof EngagementSummary["windows"], number> = {
  last1h: 60 * 60 * 1000,
  last24h: DAY_MS,
  last7d: 7 * DAY_MS,
};

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

function sanitizeStringArray(value: unknown, maxLength: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.map((entry) => sanitizeString(entry, maxLength)).filter((entry): entry is string => Boolean(entry)))];
}

function sanitizeIsoTimestamp(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function sanitizeConfidence(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return Math.min(1, Math.max(0, value));
}

function sanitizeFacts(value: unknown): Record<string, CommunityEvidenceFactValue> {
  if (!isRecord(value)) {
    return {};
  }

  const facts: Record<string, CommunityEvidenceFactValue> = {};

  for (const [key, factValue] of Object.entries(value)) {
    if (!key || key.length > 80) {
      continue;
    }

    if (
      typeof factValue === "string" ||
      typeof factValue === "number" ||
      typeof factValue === "boolean" ||
      factValue === null
    ) {
      facts[key] = typeof factValue === "string" ? factValue.slice(0, 500) : factValue;
    }
  }

  return facts;
}

function sanitizeEvidenceRecord(value: unknown): CommunityEvidenceRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id, 160);
  const type = typeof value.type === "string" && validEvidenceTypes.has(value.type as CommunityEvidenceType)
    ? (value.type as CommunityEvidenceType)
    : null;
  const sourceSystem = typeof value.sourceSystem === "string" && validSourceSystems.has(value.sourceSystem as CommunityEvidenceSourceSystem)
    ? (value.sourceSystem as CommunityEvidenceSourceSystem)
    : null;
  const subjectType = typeof value.subjectType === "string" && validSubjectTypes.has(value.subjectType as CommunityEvidenceSubjectType)
    ? (value.subjectType as CommunityEvidenceSubjectType)
    : null;
  const summary = sanitizeString(value.summary, 500);
  const confidence = sanitizeConfidence(value.confidence);
  const observedAt = sanitizeIsoTimestamp(value.observedAt);
  const createdAt = sanitizeIsoTimestamp(value.createdAt);
  const status = typeof value.status === "string" && validStatuses.has(value.status as CommunityEvidenceStatus)
    ? (value.status as CommunityEvidenceStatus)
    : null;

  if (!id || !type || !sourceSystem || !subjectType || !summary || confidence === null || !observedAt || !createdAt || !status) {
    return null;
  }

  const sourceRecordIds = sanitizeStringArray(value.sourceRecordIds, 160);
  const provenance = isRecord(value.provenance) ? value.provenance : {};
  const derivedAt = sanitizeIsoTimestamp(provenance.derivedAt) ?? createdAt;

  return {
    id,
    schemaVersion: typeof value.schemaVersion === "number" && value.schemaVersion > 0 ? Math.floor(value.schemaVersion) : SCHEMA_VERSION,
    type,
    sourceSystem,
    sourceRecordIds,
    ...(sanitizeString(value.guildId, 32) ? { guildId: sanitizeString(value.guildId, 32)! } : {}),
    ...(sanitizeString(value.channelId, 32) ? { channelId: sanitizeString(value.channelId, 32)! } : {}),
    ...(sanitizeString(value.memberIdHash, 64) ? { memberIdHash: sanitizeString(value.memberIdHash, 64)! } : {}),
    subjectType,
    ...(sanitizeString(value.subjectId, 160) ? { subjectId: sanitizeString(value.subjectId, 160)! } : {}),
    ...(typeof value.serverContext === "string" && validServerContexts.has(value.serverContext as CommunityEvidenceServerContext)
      ? { serverContext: value.serverContext as CommunityEvidenceServerContext }
      : {}),
    summary,
    facts: sanitizeFacts(value.facts),
    confidence,
    provenance: {
      sourceSystem: sanitizeString(provenance.sourceSystem, 80) ?? sourceSystem,
      sourceRecordIds: sanitizeStringArray(provenance.sourceRecordIds, 160),
      derivedBy: sanitizeString(provenance.derivedBy, 120) ?? "community-evidence",
      derivedAt,
    },
    observedAt,
    createdAt,
    ...(sanitizeIsoTimestamp(value.expiresAt) ? { expiresAt: sanitizeIsoTimestamp(value.expiresAt)! } : {}),
    status,
  };
}

function loadCommunityEvidenceStore(storageFilePath = DATA_FILE): CommunityEvidenceStore {
  try {
    const parsed = JSON.parse(fs.readFileSync(storageFilePath, "utf8"));
    const rawRecords = isRecord(parsed) && Array.isArray(parsed.records) ? parsed.records : [];
    return normalizeStoreRecords(rawRecords);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[community-evidence] could not load evidence from ${storageFilePath}.`, error);
    }

    return {
      records: [],
    };
  }
}

function saveCommunityEvidenceStore(store: CommunityEvidenceStore, storageFilePath = DATA_FILE) {
  try {
    fs.mkdirSync(path.dirname(storageFilePath), { recursive: true });
    const temporaryFilePath = `${storageFilePath}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify({ records: sortEvidenceRecords(store.records) }, null, 2));
    fs.renameSync(temporaryFilePath, storageFilePath);
  } catch (error) {
    console.warn(`[community-evidence] could not save evidence to ${storageFilePath}.`, error);
  }
}

function normalizeStoreRecords(rawRecords: unknown[], retentionLimit = DEFAULT_RETENTION_LIMIT): CommunityEvidenceStore {
  const recordsById = new Map<string, CommunityEvidenceRecord>();

  for (const rawRecord of rawRecords) {
    const record = sanitizeEvidenceRecord(rawRecord);

    if (record) {
      recordsById.set(record.id, record);
    }
  }

  return {
    records: sortEvidenceRecords([...recordsById.values()]).slice(0, retentionLimit),
  };
}

function sortEvidenceRecords(records: readonly CommunityEvidenceRecord[]) {
  return [...records].sort(
    (left, right) =>
      Date.parse(right.observedAt) - Date.parse(left.observedAt) ||
      Date.parse(right.createdAt) - Date.parse(left.createdAt) ||
      left.id.localeCompare(right.id),
  );
}

function toIso(timestamp: number) {
  return new Date(timestamp).toISOString();
}

function hashStableValue(value: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 24);
}

function makeEvidenceId(type: CommunityEvidenceType, parts: Array<string | number | boolean | null | undefined>) {
  const normalizedParts = parts.map((part) => (part === null || part === undefined ? "none" : String(part)));
  return `${type}:${hashStableValue(normalizedParts)}`;
}

function confidence(value: number) {
  return Math.min(1, Math.max(0, value));
}

function createEvidenceRecord(input: {
  type: CommunityEvidenceType;
  sourceSystem: CommunityEvidenceSourceSystem;
  sourceRecordIds: string[];
  subjectType: CommunityEvidenceSubjectType;
  subjectId?: string;
  guildId?: string | null;
  channelId?: string | null;
  memberIdHash?: string | null;
  serverContext?: CommunityEvidenceServerContext;
  summary: string;
  facts: Record<string, CommunityEvidenceFactValue>;
  confidence: number;
  derivedBy: string;
  observedAt: string;
  createdAt: string;
  expiresAt?: string;
  idParts: Array<string | number | boolean | null | undefined>;
}): CommunityEvidenceRecord {
  return {
    id: makeEvidenceId(input.type, input.idParts),
    schemaVersion: SCHEMA_VERSION,
    type: input.type,
    sourceSystem: input.sourceSystem,
    sourceRecordIds: [...new Set(input.sourceRecordIds)],
    ...(input.guildId ? { guildId: input.guildId } : {}),
    ...(input.channelId ? { channelId: input.channelId } : {}),
    ...(input.memberIdHash ? { memberIdHash: input.memberIdHash } : {}),
    subjectType: input.subjectType,
    ...(input.subjectId ? { subjectId: input.subjectId } : {}),
    ...(input.serverContext ? { serverContext: input.serverContext } : {}),
    summary: input.summary,
    facts: input.facts,
    confidence: confidence(input.confidence),
    provenance: {
      sourceSystem: input.sourceSystem,
      sourceRecordIds: [...new Set(input.sourceRecordIds)],
      derivedBy: input.derivedBy,
      derivedAt: input.createdAt,
    },
    observedAt: input.observedAt,
    createdAt: input.createdAt,
    ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
    status: "active",
  };
}

function getServerContextForChannel(channelId: string | null | undefined, profile?: Pick<ChannelProfile, "purpose" | "topicOverride" | "notes" | "channelName"> | null): CommunityEvidenceServerContext {
  if (!channelId && !profile) {
    return "unknown";
  }

  const explicitText = [
    profile?.channelName,
    profile?.topicOverride,
    profile?.notes,
  ].filter(Boolean).join(" ").toLowerCase();

  if (/\bfantasy\b/.test(explicitText)) {
    return "fantasy";
  }

  if (/\bprimal\b/.test(explicitText)) {
    return "primal";
  }

  if (profile || channelId) {
    return "general";
  }

  return "unknown";
}

function getActivityClassification(humanMessages: number, approxActiveUsers: number) {
  if (humanMessages >= 10 || approxActiveUsers >= 3) {
    return "active";
  }

  if (humanMessages > 0) {
    return "quiet";
  }

  return "no_recent_human_messages";
}

export function buildEngagementActivityEvidence(summary: EngagementSummary, now = Date.now()) {
  const createdAt = toIso(now);
  const records: CommunityEvidenceRecord[] = [];

  for (const [windowKey, channels] of Object.entries(summary.windows) as Array<[keyof EngagementSummary["windows"], EngagementSummary["windows"][keyof EngagementSummary["windows"]]]>) {
    const windowDurationMs = windowDurations[windowKey];
    const windowEndsAt = toIso(summary.generatedAt);
    const windowStartsAt = toIso(summary.generatedAt - windowDurationMs);

    for (const channel of channels) {
      const humanMessageCount = Math.max(0, channel.messageCount - channel.botMessageCount);
      const activityClassification = getActivityClassification(humanMessageCount, channel.approxActiveUsers);
      const sourceRecordId = `engagement:${windowKey}:${channel.channelId}:${summary.generatedAt}`;
      const participantText = `${channel.approxActiveUsers} approximate participant${channel.approxActiveUsers === 1 ? "" : "s"}`;
      const messageText = `${humanMessageCount} human message${humanMessageCount === 1 ? "" : "s"}`;

      records.push(createEvidenceRecord({
        type: "channel_activity_window",
        sourceSystem: "engagement_activity",
        sourceRecordIds: [sourceRecordId],
        subjectType: "channel",
        subjectId: channel.channelId,
        channelId: channel.channelId,
        serverContext: getServerContextForChannel(channel.channelId),
        summary: `${participantText} sent ${messageText} in ${channel.channelName ? `#${channel.channelName}` : "this channel"} during the ${windowKey} activity window.`,
        facts: {
          windowKey,
          windowDurationMs,
          windowStartsAt,
          windowEndsAt,
          totalMessageCount: channel.messageCount,
          humanMessageCount,
          botMessageCount: channel.botMessageCount,
          approxActiveUsers: channel.approxActiveUsers,
          attachmentOrEmbedCount: channel.attachmentOrEmbedCount,
          lastActivityAt: channel.lastActivityAt ? toIso(channel.lastActivityAt) : null,
          activityClassification,
        },
        confidence: 0.82,
        derivedBy: "community-evidence:engagement-activity-adapter",
        observedAt: channel.lastActivityAt ? toIso(channel.lastActivityAt) : windowEndsAt,
        createdAt,
        expiresAt: toIso(summary.generatedAt + windowDurationMs),
        idParts: ["engagement_activity", windowKey, channel.channelId, summary.generatedAt],
      }));
    }
  }

  return records;
}

export function buildContentOutcomeEvidence(outcomes: readonly ContentOutcomeSummary[], now = Date.now()) {
  const createdAt = toIso(now);

  return outcomes.map((outcome) => {
    const sourceRecordId = outcome.messageId
      ? `content-outcome:${outcome.messageId}`
      : `content-outcome:${outcome.source}:${outcome.channelId}:${outcome.postedAt}`;
    const humanMessages60m = outcome.activity.humanMessages60m;
    const channelLabel = outcome.channelName ? `#${outcome.channelName}` : "the channel";

    return createEvidenceRecord({
      type: "post_window_outcome",
      sourceSystem: "content_outcomes",
      sourceRecordIds: [sourceRecordId],
      subjectType: "content",
      subjectId: outcome.messageId ?? `${outcome.source}:${outcome.channelId}:${outcome.postedAt}`,
      channelId: outcome.channelId,
      serverContext: getServerContextForChannel(outcome.channelId),
      summary: `${channelLabel} recorded ${humanMessages60m} human message${humanMessages60m === 1 ? "" : "s"} within 60 minutes after this ${outcome.source} post.`,
      facts: {
        source: outcome.source,
        contentType: outcome.contentType,
        postedAt: toIso(outcome.postedAt),
        messageId: outcome.messageId,
        label: outcome.label,
        messages15m: outcome.activity.messages15m,
        messages60m: outcome.activity.messages60m,
        approxActiveUsers60m: outcome.activity.approxActiveUsers60m,
        botMessages60m: outcome.activity.botMessages60m,
        humanMessages60m,
        deterministicOutcomeLabel: outcome.activity.outcomeLabel,
        measurementType: "post_window_channel_activity",
      },
      confidence: 0.74,
      derivedBy: "community-evidence:content-outcomes-adapter",
      observedAt: toIso(outcome.postedAt),
      createdAt,
      expiresAt: toIso(outcome.postedAt + 30 * DAY_MS),
      idParts: ["content_outcomes", outcome.messageId ?? outcome.source, outcome.channelId, outcome.postedAt],
    });
  });
}

export function buildAutomationIssueEvidence(items: readonly AutomationActivityItem[], now = Date.now()) {
  const createdAt = toIso(now);
  const problemItems = items.filter((item) => item.status === "failure" || item.status === "blocked");
  const grouped = new Map<string, AutomationActivityItem[]>();

  for (const item of problemItems) {
    const key = [
      item.source,
      item.channelId ?? "community",
      item.status,
      item.errorCode ?? item.blockedReason ?? "unspecified",
      item.contentType ?? "any",
    ].join(":");
    grouped.set(key, [...(grouped.get(key) ?? []), item]);
  }

  return [...grouped.entries()].map(([key, group]) => {
    const sorted = [...group].sort((left, right) => left.timestamp - right.timestamp);
    const first = sorted[0]!;
    const last = sorted.at(-1)!;
    const reason = last.errorCode ?? last.blockedReason ?? "unspecified";
    const channelLabel = last.channelName ? `#${last.channelName}` : last.channelId ? "this channel" : "the community";

    return createEvidenceRecord({
      type: "automation_issue",
      sourceSystem: "automation_activity",
      sourceRecordIds: sorted.map((item) => item.id),
      subjectType: "automation",
      subjectId: key,
      ...(last.channelId ? { channelId: last.channelId } : {}),
      serverContext: getServerContextForChannel(last.channelId),
      summary: `${last.source} automation recorded ${sorted.length} ${last.status} event${sorted.length === 1 ? "" : "s"} for ${channelLabel}; latest reason: ${reason}.`,
      facts: {
        automationSource: last.source,
        status: last.status,
        contentType: last.contentType ?? null,
        reason,
        errorCode: last.errorCode ?? null,
        blockedReason: last.blockedReason ?? null,
        occurrenceCount: sorted.length,
        firstSeenAt: toIso(first.timestamp),
        lastSeenAt: toIso(last.timestamp),
        latestMessage: last.message,
      },
      confidence: sorted.length > 1 ? 0.9 : 0.84,
      derivedBy: "community-evidence:automation-activity-adapter",
      observedAt: toIso(last.timestamp),
      createdAt,
      expiresAt: toIso(last.timestamp + 7 * DAY_MS),
      idParts: ["automation_activity", key],
    });
  });
}

export function buildChannelContextEvidence(profiles: readonly ChannelProfile[], now = Date.now()) {
  const createdAt = toIso(now);

  return profiles.map((profile) => {
    const serverContext = getServerContextForChannel(profile.channelId, profile);
    const sourceRecordId = `channel-profile:${profile.channelId}:${profile.updatedAt}`;
    const channelLabel = profile.channelName ? `#${profile.channelName}` : `channel ${profile.channelId}`;

    return createEvidenceRecord({
      type: "channel_context",
      sourceSystem: "channel_profiles",
      sourceRecordIds: [sourceRecordId],
      subjectType: "channel",
      subjectId: profile.channelId,
      channelId: profile.channelId,
      serverContext,
      summary: `${channelLabel} has owner-authored context: purpose ${profile.purpose}, audience ${profile.audience}, tone ${profile.tone}.`,
      facts: {
        channelName: profile.channelName,
        purpose: profile.purpose,
        audience: profile.audience,
        accessMode: profile.accessMode,
        tone: profile.tone,
        preferredContentTypes: profile.preferredContentTypes.join(","),
        topicOverride: profile.topicOverride,
        suggestedRoleId: profile.suggestedRoleId,
        signupPanelId: profile.signupPanelId,
        followupId: profile.followupId,
        hasNotes: Boolean(profile.notes),
        serverContext,
        ownerAuthored: true,
      },
      confidence: 0.96,
      derivedBy: "community-evidence:channel-profiles-adapter",
      observedAt: toIso(profile.updatedAt),
      createdAt,
      idParts: ["channel_profiles", profile.channelId, profile.updatedAt],
    });
  });
}

export function buildConversationDecisionEvidence(decisions: readonly ConversationDecisionRecord[], now = Date.now()) {
  const createdAt = toIso(now);

  return decisions.map((decision) => {
    const wouldHaveSpoken = decision.decision === "would-send";
    const channelLabel = decision.channelName ? `#${decision.channelName}` : "this channel";

    return createEvidenceRecord({
      type: "conversation_decision",
      sourceSystem: "conversation_participation",
      sourceRecordIds: [decision.id],
      subjectType: "conversation",
      subjectId: decision.id,
      channelId: decision.channelId,
      serverContext: getServerContextForChannel(decision.channelId),
      summary: `Conversation preview ${wouldHaveSpoken ? "would have suggested speaking" : "stayed silent"} in ${channelLabel}: ${decision.reason}.`,
      facts: {
        mode: decision.mode,
        state: decision.state,
        decision: decision.decision,
        reason: decision.reason,
        humanMessageCount: decision.humanMessageCount,
        distinctHumanCount: decision.distinctHumanCount,
        relevanceScore: decision.relevanceScore,
        matchedTopics: decision.matchedTopics.join(","),
        botHumanRatio: decision.botHumanRatio,
        cooldownActive: decision.cooldownActive,
        capReached: decision.capReached,
        suppressionActive: decision.suppressionActive,
        proposedContentType: decision.proposedContentType,
        previewOnly: decision.previewOnly,
        wouldHaveSpoken,
      },
      confidence: decision.previewOnly ? 0.78 : 0.7,
      derivedBy: "community-evidence:conversation-participation-adapter",
      observedAt: toIso(decision.timestamp),
      createdAt,
      expiresAt: toIso(decision.timestamp + 7 * DAY_MS),
      idParts: ["conversation_participation", decision.id],
    });
  });
}

function getDefaultSources(now: number): Required<CommunityEvidenceSources> {
  return {
    engagementSummary: getEngagementSummary(now),
    contentOutcomes: getContentOutcomeSummary({ limit: 100 }).items,
    automationActivity: getRecentAutomationActivity(400),
    channelProfiles: listChannelProfiles(),
    conversationDecisions: getRecentConversationDecisions(100),
  };
}

function buildEvidenceFromSources(sources: Required<CommunityEvidenceSources>, now: number) {
  return [
    ...buildEngagementActivityEvidence(sources.engagementSummary, now),
    ...buildContentOutcomeEvidence(sources.contentOutcomes, now),
    ...buildAutomationIssueEvidence(sources.automationActivity, now),
    ...buildChannelContextEvidence(sources.channelProfiles, now),
    ...buildConversationDecisionEvidence(sources.conversationDecisions, now),
  ];
}

function mergeEvidenceRecords(existingRecords: readonly CommunityEvidenceRecord[], generatedRecords: readonly CommunityEvidenceRecord[], retentionLimit: number) {
  const recordsById = new Map<string, CommunityEvidenceRecord>();

  for (const record of existingRecords) {
    recordsById.set(record.id, record);
  }

  for (const record of generatedRecords) {
    const existing = recordsById.get(record.id);
    recordsById.set(record.id, {
      ...record,
      createdAt: existing?.createdAt ?? record.createdAt,
      status: existing?.status === "expired" ? "expired" : record.status,
    });
  }

  return sortEvidenceRecords([...recordsById.values()]).slice(0, retentionLimit);
}

export function generateCommunityEvidence(options: CommunityEvidenceGenerationOptions = {}): CommunityEvidenceGenerationResult {
  const now = options.now ?? Date.now();
  const retentionLimit = Math.max(1, Math.min(5000, Math.floor(options.retentionLimit ?? DEFAULT_RETENTION_LIMIT)));
  const defaultSources = options.sources ? getDefaultSources(now) : null;
  const sources: Required<CommunityEvidenceSources> = {
    engagementSummary: options.sources?.engagementSummary ?? defaultSources?.engagementSummary ?? getEngagementSummary(now),
    contentOutcomes: options.sources?.contentOutcomes ?? defaultSources?.contentOutcomes ?? getContentOutcomeSummary({ limit: 100 }).items,
    automationActivity: options.sources?.automationActivity ?? defaultSources?.automationActivity ?? getRecentAutomationActivity(400),
    channelProfiles: options.sources?.channelProfiles ?? defaultSources?.channelProfiles ?? listChannelProfiles(),
    conversationDecisions: options.sources?.conversationDecisions ?? defaultSources?.conversationDecisions ?? getRecentConversationDecisions(100),
  };
  const generated = buildEvidenceFromSources(sources, now);
  const store = loadCommunityEvidenceStore(options.storageFilePath);
  const records = mergeEvidenceRecords(store.records, generated, retentionLimit);

  if (options.persist !== false) {
    saveCommunityEvidenceStore({ records }, options.storageFilePath);
  }

  return {
    generatedAt: toIso(now),
    generated,
    records,
    summary: {
      generated: generated.length,
      retained: records.length,
    },
  };
}

export function listCommunityEvidence(query: CommunityEvidenceQuery = {}, options: { storageFilePath?: string } = {}) {
  const limit = Number.isInteger(query.limit) && query.limit && query.limit > 0 ? Math.min(query.limit, DEFAULT_RETENTION_LIMIT) : DEFAULT_RETENTION_LIMIT;
  return loadCommunityEvidenceStore(options.storageFilePath).records
    .filter((record) => query.status === "all" || !query.status || record.status === query.status)
    .filter((record) => !query.type || record.type === query.type)
    .filter((record) => !query.sourceSystem || record.sourceSystem === query.sourceSystem)
    .filter((record) => !query.channelId || record.channelId === query.channelId)
    .filter((record) => !query.subjectType || record.subjectType === query.subjectType)
    .filter((record) => !query.serverContext || record.serverContext === query.serverContext)
    .slice(0, limit);
}

export function getCommunityEvidenceById(id: string, options: { storageFilePath?: string } = {}) {
  return loadCommunityEvidenceStore(options.storageFilePath).records.find((record) => record.id === id) ?? null;
}

export function findCommunityEvidence(query: CommunityEvidenceQuery = {}, options: { storageFilePath?: string } = {}) {
  return listCommunityEvidence(query, options);
}

export function expireCommunityEvidence(id: string, options: { storageFilePath?: string; expiredAt?: number } = {}) {
  const store = loadCommunityEvidenceStore(options.storageFilePath);
  const currentRecord = store.records.find((record) => record.id === id);

  if (!currentRecord) {
    return null;
  }

  const expiredRecord: CommunityEvidenceRecord = {
    ...currentRecord,
    status: "expired",
    expiresAt: toIso(options.expiredAt ?? Date.now()),
  };
  const records = sortEvidenceRecords(store.records.map((record) => (record.id === id ? expiredRecord : record)));
  saveCommunityEvidenceStore({ records }, options.storageFilePath);
  return expiredRecord;
}

export function clearCommunityEvidenceForTests(options: { storageFilePath?: string } = {}) {
  saveCommunityEvidenceStore({ records: [] }, options.storageFilePath);
}
