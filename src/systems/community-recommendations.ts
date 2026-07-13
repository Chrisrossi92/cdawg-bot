import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  listCommunityEvidence,
  type AutomationIssueClass,
  type CommunityEvidenceRecord,
  type CommunityEvidenceServerContext,
  type CommunityEvidenceSubjectType,
} from "./community-evidence.js";

export type CommunityRecommendationType =
  | "investigate_automation_issue"
  | "review_post_window_outcome"
  | "review_conversation_opportunity"
  | "review_channel_activity"
  | "review_channel_context";

export type CommunitySuggestedAction =
  | "review"
  | "investigate"
  | "acknowledge"
  | "draft_follow_up"
  | "no_action";

export type CommunityRecommendationStatus =
  | "new"
  | "seen"
  | "acknowledged"
  | "dismissed"
  | "postponed"
  | "acted"
  | "expired"
  | "superseded";

export type CommunityRecommendationPriority = "low" | "medium" | "high" | "critical";
export type CommunityRecommendationSubjectType = Exclude<CommunityEvidenceSubjectType, "member">;

export type CommunityRecommendationRecord = {
  id: string;
  schemaVersion: number;
  type: CommunityRecommendationType;
  evidenceIds: string[];
  guildId?: string;
  channelId?: string;
  subjectType: CommunityRecommendationSubjectType;
  subjectId?: string;
  serverContext?: CommunityEvidenceServerContext;
  title: string;
  summary: string;
  reason: string;
  suggestedAction: CommunitySuggestedAction;
  priority: CommunityRecommendationPriority;
  confidence: number;
  status: CommunityRecommendationStatus;
  createdAt: string;
  updatedAt: string;
  firstSeenAt?: string;
  acknowledgedAt?: string;
  dismissedAt?: string;
  postponedUntil?: string;
  actedAt?: string;
  expiresAt?: string;
  dispositionReason?: string;
  provenance: {
    derivedBy: string;
    derivedAt: string;
    evidenceIds: string[];
  };
};

export type CommunityRecommendationQuery = {
  type?: CommunityRecommendationType;
  status?: CommunityRecommendationStatus | "active" | "all";
  channelId?: string;
  subjectType?: CommunityRecommendationSubjectType;
  serverContext?: CommunityEvidenceServerContext;
  includePostponed?: boolean;
  now?: number;
  limit?: number;
};

export type CommunityRecommendationGenerationResult = {
  generatedAt: string;
  generated: CommunityRecommendationRecord[];
  records: CommunityRecommendationRecord[];
  summary: {
    generated: number;
    retained: number;
  };
};

type RecommendationStore = {
  recommendations: CommunityRecommendationRecord[];
};

type RecommendationGenerationOptions = {
  now?: number;
  evidenceRecords?: CommunityEvidenceRecord[];
  evidenceStorageFilePath?: string;
  storageFilePath?: string;
  persist?: boolean;
  retentionLimit?: number;
};

type RecommendationDraft = Omit<CommunityRecommendationRecord, "id" | "schemaVersion" | "createdAt" | "updatedAt" | "status" | "provenance"> & {
  dedupeParts: Array<string | number | boolean | null | undefined>;
  derivedBy: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "community-recommendations.json");
const SCHEMA_VERSION = 1;
const DEFAULT_RETENTION_LIMIT = 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const activeStatuses = new Set<CommunityRecommendationStatus>(["new", "seen", "postponed"]);
const terminalSuppressingStatuses = new Set<CommunityRecommendationStatus>(["acknowledged", "dismissed", "acted"]);
const validTypes = new Set<CommunityRecommendationType>([
  "investigate_automation_issue",
  "review_post_window_outcome",
  "review_conversation_opportunity",
  "review_channel_activity",
  "review_channel_context",
]);
const validActions = new Set<CommunitySuggestedAction>(["review", "investigate", "acknowledge", "draft_follow_up", "no_action"]);
const validStatuses = new Set<CommunityRecommendationStatus>([
  "new",
  "seen",
  "acknowledged",
  "dismissed",
  "postponed",
  "acted",
  "expired",
  "superseded",
]);
const validPriorities = new Set<CommunityRecommendationPriority>(["low", "medium", "high", "critical"]);
const validSubjectTypes = new Set<CommunityRecommendationSubjectType>(["community", "channel", "content", "automation", "conversation"]);
const validServerContexts = new Set<CommunityEvidenceServerContext>(["fantasy", "primal", "general", "unknown"]);

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

function sanitizeRecommendationRecord(value: unknown): CommunityRecommendationRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id, 180);
  const type = typeof value.type === "string" && validTypes.has(value.type as CommunityRecommendationType)
    ? (value.type as CommunityRecommendationType)
    : null;
  const subjectType = typeof value.subjectType === "string" && validSubjectTypes.has(value.subjectType as CommunityRecommendationSubjectType)
    ? (value.subjectType as CommunityRecommendationSubjectType)
    : null;
  const title = sanitizeString(value.title, 180);
  const summary = sanitizeString(value.summary, 500);
  const reason = sanitizeString(value.reason, 800);
  const suggestedAction = typeof value.suggestedAction === "string" && validActions.has(value.suggestedAction as CommunitySuggestedAction)
    ? (value.suggestedAction as CommunitySuggestedAction)
    : null;
  const priority = typeof value.priority === "string" && validPriorities.has(value.priority as CommunityRecommendationPriority)
    ? (value.priority as CommunityRecommendationPriority)
    : null;
  const confidence = sanitizeConfidence(value.confidence);
  const status = typeof value.status === "string" && validStatuses.has(value.status as CommunityRecommendationStatus)
    ? (value.status as CommunityRecommendationStatus)
    : null;
  const createdAt = sanitizeIsoTimestamp(value.createdAt);
  const updatedAt = sanitizeIsoTimestamp(value.updatedAt);

  if (!id || !type || !subjectType || !title || !summary || !reason || !suggestedAction || !priority || confidence === null || !status || !createdAt || !updatedAt) {
    return null;
  }

  const provenance = isRecord(value.provenance) ? value.provenance : {};
  const evidenceIds = sanitizeStringArray(value.evidenceIds, 180);

  if (evidenceIds.length === 0) {
    return null;
  }

  return {
    id,
    schemaVersion: typeof value.schemaVersion === "number" && value.schemaVersion > 0 ? Math.floor(value.schemaVersion) : SCHEMA_VERSION,
    type,
    evidenceIds,
    ...(sanitizeString(value.guildId, 32) ? { guildId: sanitizeString(value.guildId, 32)! } : {}),
    ...(sanitizeString(value.channelId, 32) ? { channelId: sanitizeString(value.channelId, 32)! } : {}),
    subjectType,
    ...(sanitizeString(value.subjectId, 180) ? { subjectId: sanitizeString(value.subjectId, 180)! } : {}),
    ...(typeof value.serverContext === "string" && validServerContexts.has(value.serverContext as CommunityEvidenceServerContext)
      ? { serverContext: value.serverContext as CommunityEvidenceServerContext }
      : {}),
    title,
    summary,
    reason,
    suggestedAction,
    priority,
    confidence,
    status,
    createdAt,
    updatedAt,
    ...(sanitizeIsoTimestamp(value.firstSeenAt) ? { firstSeenAt: sanitizeIsoTimestamp(value.firstSeenAt)! } : {}),
    ...(sanitizeIsoTimestamp(value.acknowledgedAt) ? { acknowledgedAt: sanitizeIsoTimestamp(value.acknowledgedAt)! } : {}),
    ...(sanitizeIsoTimestamp(value.dismissedAt) ? { dismissedAt: sanitizeIsoTimestamp(value.dismissedAt)! } : {}),
    ...(sanitizeIsoTimestamp(value.postponedUntil) ? { postponedUntil: sanitizeIsoTimestamp(value.postponedUntil)! } : {}),
    ...(sanitizeIsoTimestamp(value.actedAt) ? { actedAt: sanitizeIsoTimestamp(value.actedAt)! } : {}),
    ...(sanitizeIsoTimestamp(value.expiresAt) ? { expiresAt: sanitizeIsoTimestamp(value.expiresAt)! } : {}),
    ...(sanitizeString(value.dispositionReason, 500) ? { dispositionReason: sanitizeString(value.dispositionReason, 500)! } : {}),
    provenance: {
      derivedBy: sanitizeString(provenance.derivedBy, 120) ?? "community-recommendations",
      derivedAt: sanitizeIsoTimestamp(provenance.derivedAt) ?? createdAt,
      evidenceIds: sanitizeStringArray(provenance.evidenceIds, 180),
    },
  };
}

function loadRecommendationStore(storageFilePath = DATA_FILE): RecommendationStore {
  try {
    const parsed = JSON.parse(fs.readFileSync(storageFilePath, "utf8"));
    const rawRecords = isRecord(parsed) && Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    return normalizeRecommendationStore(rawRecords);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[community-recommendations] could not load recommendations from ${storageFilePath}.`, error);
    }

    return {
      recommendations: [],
    };
  }
}

function saveRecommendationStore(store: RecommendationStore, storageFilePath = DATA_FILE) {
  try {
    fs.mkdirSync(path.dirname(storageFilePath), { recursive: true });
    const temporaryFilePath = `${storageFilePath}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify({ recommendations: sortRecommendations(store.recommendations) }, null, 2));
    fs.renameSync(temporaryFilePath, storageFilePath);
  } catch (error) {
    console.warn(`[community-recommendations] could not save recommendations to ${storageFilePath}.`, error);
  }
}

function normalizeRecommendationStore(rawRecords: unknown[], retentionLimit = DEFAULT_RETENTION_LIMIT): RecommendationStore {
  const recordsById = new Map<string, CommunityRecommendationRecord>();

  for (const rawRecord of rawRecords) {
    const record = sanitizeRecommendationRecord(rawRecord);

    if (record) {
      recordsById.set(record.id, record);
    }
  }

  return {
    recommendations: sortRecommendations([...recordsById.values()]).slice(0, retentionLimit),
  };
}

function sortRecommendations(records: readonly CommunityRecommendationRecord[]) {
  const priorityRank: Record<CommunityRecommendationPriority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...records].sort(
    (left, right) =>
      priorityRank[left.priority] - priorityRank[right.priority] ||
      Date.parse(right.updatedAt) - Date.parse(left.updatedAt) ||
      Date.parse(right.createdAt) - Date.parse(left.createdAt) ||
      left.id.localeCompare(right.id),
  );
}

function toIso(timestamp: number) {
  return new Date(timestamp).toISOString();
}

function clampConfidence(value: number) {
  return Math.min(1, Math.max(0, value));
}

function hashStableValue(value: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 24);
}

function makeRecommendationId(type: CommunityRecommendationType, parts: Array<string | number | boolean | null | undefined>) {
  const normalizedParts = parts.map((part) => (part === null || part === undefined ? "none" : String(part)));
  return `${type}:${hashStableValue(normalizedParts)}`;
}

function evidenceIsActive(evidence: CommunityEvidenceRecord, now: number) {
  if (evidence.status !== "active") {
    return false;
  }

  return !evidence.expiresAt || Date.parse(evidence.expiresAt) > now;
}

function evidenceNumber(evidence: CommunityEvidenceRecord, key: string, fallback = 0) {
  const value = evidence.facts[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function evidenceString(evidence: CommunityEvidenceRecord, key: string, fallback = "") {
  const value = evidence.facts[key];
  return typeof value === "string" ? value : fallback;
}

function evidenceBoolean(evidence: CommunityEvidenceRecord, key: string, fallback = false) {
  const value = evidence.facts[key];
  return typeof value === "boolean" ? value : fallback;
}

function createRecommendationFromDraft(draft: RecommendationDraft, now: number): CommunityRecommendationRecord {
  const createdAt = toIso(now);

  return {
    id: makeRecommendationId(draft.type, draft.dedupeParts),
    schemaVersion: SCHEMA_VERSION,
    type: draft.type,
    evidenceIds: [...new Set(draft.evidenceIds)],
    ...(draft.guildId ? { guildId: draft.guildId } : {}),
    ...(draft.channelId ? { channelId: draft.channelId } : {}),
    subjectType: draft.subjectType,
    ...(draft.subjectId ? { subjectId: draft.subjectId } : {}),
    ...(draft.serverContext ? { serverContext: draft.serverContext } : {}),
    title: draft.title,
    summary: draft.summary,
    reason: draft.reason,
    suggestedAction: draft.suggestedAction,
    priority: draft.priority,
    confidence: clampConfidence(draft.confidence),
    status: "new",
    createdAt,
    updatedAt: createdAt,
    ...(draft.expiresAt ? { expiresAt: draft.expiresAt } : {}),
    provenance: {
      derivedBy: draft.derivedBy,
      derivedAt: createdAt,
      evidenceIds: [...new Set(draft.evidenceIds)],
    },
  };
}

function buildAutomationIssueRecommendation(evidence: CommunityEvidenceRecord, now: number): RecommendationDraft | null {
  if (evidence.type !== "automation_issue") {
    return null;
  }

  const status = evidenceString(evidence, "status");
  const occurrenceCount = evidenceNumber(evidence, "occurrenceCount", 1);
  const reason = evidenceString(evidence, "reason", "unspecified");
  const issueClass = (evidenceString(evidence, "issueClass") || (
    reason === "CONTENT_UNAVAILABLE"
      ? "temporary_unavailable"
      : status === "failure"
        ? "failure"
        : status === "blocked"
          ? "unexpected_block"
          : "unknown"
  )) as AutomationIssueClass;

  if (issueClass === "intentional_block" || issueClass === "expected_skip" || issueClass === "recovered") {
    return null;
  }

  if ((issueClass === "temporary_unavailable" || issueClass === "unexpected_block" || issueClass === "unknown") && occurrenceCount < 2) {
    return null;
  }

  const severeFailure = /auth|permission|crash|fatal/i.test(reason);
  const priority: CommunityRecommendationPriority = issueClass === "failure"
    ? severeFailure && occurrenceCount >= 3
      ? "critical"
      : occurrenceCount >= 2
        ? "high"
        : "medium"
    : issueClass === "unexpected_block" && occurrenceCount >= 4
      ? "high"
      : "medium";
  const automationKey = evidenceString(evidence, "automationKey", evidence.subjectId ?? evidence.channelId ?? evidence.id);
  const explanation = issueClass === "temporary_unavailable"
    ? `Eligible content was unavailable in ${occurrenceCount} recent run${occurrenceCount === 1 ? "" : "s"}. The automation remained online, but its content source may need review.`
    : issueClass === "unexpected_block"
      ? `${occurrenceCount} unexpected blocks affected this automation. Review the workflow configuration if the block is still active.`
      : `${occurrenceCount} automation failure${occurrenceCount === 1 ? " was" : "s were"} recorded. This indicates an execution problem, not an intentional pause.`;

  return {
    type: "investigate_automation_issue",
    evidenceIds: [evidence.id],
    ...(evidence.guildId ? { guildId: evidence.guildId } : {}),
    ...(evidence.channelId ? { channelId: evidence.channelId } : {}),
    subjectType: "automation",
    subjectId: automationKey,
    ...(evidence.serverContext ? { serverContext: evidence.serverContext } : {}),
    title: issueClass === "temporary_unavailable" ? "Review automation content availability" : "Investigate automation failure",
    summary: evidence.summary,
    reason: `${explanation} Technical reason: ${reason}.`,
    suggestedAction: issueClass === "temporary_unavailable" ? "review" : "investigate",
    priority,
    confidence: Math.min(0.96, evidence.confidence + (occurrenceCount >= 2 ? 0.04 : 0)),
    expiresAt: toIso(now + (issueClass === "temporary_unavailable" ? 3 : 7) * DAY_MS),
    derivedBy: "community-recommendations:automation-issue-adapter",
    dedupeParts: ["automation_issue", automationKey, issueClass, reason, occurrenceCount, evidence.id],
  };
}

function buildPostWindowOutcomeRecommendation(evidence: CommunityEvidenceRecord, now: number): RecommendationDraft | null {
  if (evidence.type !== "post_window_outcome") {
    return null;
  }

  const humanMessages60m = evidenceNumber(evidence, "humanMessages60m");
  const outcomeLabel = evidenceString(evidence, "deterministicOutcomeLabel", "unknown");

  if (humanMessages60m < 10 && outcomeLabel !== "no response") {
    return null;
  }

  const highActivity = humanMessages60m >= 20;
  const noResponse = outcomeLabel === "no response";

  return {
    type: "review_post_window_outcome",
    evidenceIds: [evidence.id],
    ...(evidence.guildId ? { guildId: evidence.guildId } : {}),
    ...(evidence.channelId ? { channelId: evidence.channelId } : {}),
    subjectType: "content",
    subjectId: evidence.subjectId ?? evidence.id,
    ...(evidence.serverContext ? { serverContext: evidence.serverContext } : {}),
    title: noResponse ? "Review post-window silence" : "Review notable post-window activity",
    summary: evidence.summary,
    reason: noResponse
      ? "The tracked post-window measurement currently shows no human messages in the 60-minute window. This is worth reviewing, but it does not prove the post was the cause."
      : `The channel recorded ${humanMessages60m} human messages within 60 minutes after the post. This indicates notable post-window activity but does not prove causation.`,
    suggestedAction: "review",
    priority: highActivity ? "medium" : "low",
    confidence: evidence.confidence,
    expiresAt: toIso(now + 14 * DAY_MS),
    derivedBy: "community-recommendations:post-window-outcome-adapter",
    dedupeParts: ["post_window_outcome", evidence.subjectId, evidence.channelId, humanMessages60m, outcomeLabel],
  };
}

function buildConversationOpportunityRecommendation(evidence: CommunityEvidenceRecord, now: number): RecommendationDraft | null {
  if (evidence.type !== "conversation_decision") {
    return null;
  }

  const wouldHaveSpoken = evidence.facts.wouldHaveSpoken === true;
  const suppressionActive = evidence.facts.suppressionActive === true;
  const relevanceScore = evidenceNumber(evidence, "relevanceScore");

  if (!wouldHaveSpoken && !(suppressionActive && relevanceScore >= 3)) {
    return null;
  }

  return {
    type: "review_conversation_opportunity",
    evidenceIds: [evidence.id],
    ...(evidence.guildId ? { guildId: evidence.guildId } : {}),
    ...(evidence.channelId ? { channelId: evidence.channelId } : {}),
    subjectType: "conversation",
    subjectId: evidence.subjectId ?? evidence.id,
    ...(evidence.serverContext ? { serverContext: evidence.serverContext } : {}),
    title: wouldHaveSpoken ? "Review conversation preview opportunity" : "Review suppressed conversation opportunity",
    summary: evidence.summary,
    reason: wouldHaveSpoken
      ? "The preview-only conversation engine recorded a would-send decision. Review the evidence before considering future draft workflows."
      : "The preview-only conversation engine suppressed a relevant-looking opportunity. Review this only as a configuration or safety audit signal.",
    suggestedAction: "review",
    priority: wouldHaveSpoken ? "medium" : "low",
    confidence: evidence.confidence,
    expiresAt: toIso(now + DAY_MS),
    derivedBy: "community-recommendations:conversation-decision-adapter",
    dedupeParts: ["conversation_decision", evidence.subjectId, evidence.channelId, wouldHaveSpoken, suppressionActive, relevanceScore],
  };
}

function buildChannelActivityRecommendation(evidence: CommunityEvidenceRecord, now: number): RecommendationDraft | null {
  if (evidence.type !== "channel_activity_window") {
    return null;
  }

  const windowKey = evidenceString(evidence, "windowKey");
  const humanMessageCount = evidenceNumber(evidence, "humanMessageCount");
  const approxActiveUsers = evidenceNumber(evidence, "approxActiveUsers");
  const attachmentOrEmbedCount = evidenceNumber(evidence, "attachmentOrEmbedCount");
  const humanAttachmentOrEmbedCount = evidenceNumber(evidence, "humanAttachmentOrEmbedCount");
  const humanAttachmentParticipantCount = evidenceNumber(evidence, "humanAttachmentParticipantCount");
  const reviewEligible = evidenceBoolean(evidence, "communityReviewEligible");
  const qualifiesForAttachmentReview = reviewEligible && humanAttachmentOrEmbedCount >= 5 && humanAttachmentParticipantCount >= 3;
  const qualifiesForActivityReview = humanMessageCount >= 30 || approxActiveUsers >= 6;

  if (windowKey !== "last24h" || (!qualifiesForActivityReview && !qualifiesForAttachmentReview)) {
    return null;
  }

  const attachmentHeavy = qualifiesForAttachmentReview;

  return {
    type: "review_channel_activity",
    evidenceIds: [evidence.id],
    ...(evidence.guildId ? { guildId: evidence.guildId } : {}),
    ...(evidence.channelId ? { channelId: evidence.channelId } : {}),
    subjectType: "channel",
    subjectId: evidence.subjectId ?? evidence.channelId ?? evidence.id,
    ...(evidence.serverContext ? { serverContext: evidence.serverContext } : {}),
    title: attachmentHeavy ? "Review attachment-heavy channel activity" : "Review notable channel activity",
    summary: evidence.summary,
    reason: attachmentHeavy
      ? `${humanAttachmentOrEmbedCount} human-authored attachment or embed events from ${humanAttachmentParticipantCount} participants were recorded in this eligible community channel. The evidence cannot determine content quality.`
      : `${humanMessageCount} human messages and approximately ${approxActiveUsers} participants were recorded in this activity window. This is an activity signal only, not a quality or health conclusion.`,
    suggestedAction: "review",
    priority: "low",
    confidence: evidence.confidence,
    expiresAt: toIso(now + DAY_MS),
    derivedBy: "community-recommendations:channel-activity-adapter",
    dedupeParts: ["channel_activity_window", evidence.subjectId, evidence.channelId, windowKey, humanMessageCount, approxActiveUsers, attachmentOrEmbedCount, humanAttachmentOrEmbedCount, humanAttachmentParticipantCount],
  };
}

function buildChannelContextRecommendation(evidence: CommunityEvidenceRecord, now: number): RecommendationDraft | null {
  if (evidence.type !== "channel_context") {
    return null;
  }

  const purpose = evidenceString(evidence, "purpose");
  const accessMode = evidenceString(evidence, "accessMode");
  const topicOverride = evidence.facts.topicOverride;
  const serverContext = evidence.serverContext ?? "unknown";
  const incompleteContext = purpose === "custom" && !topicOverride;
  const unsureAccess = accessMode === "unsure";
  const unmappedContext = serverContext === "unknown";

  if (!incompleteContext && !unsureAccess && !unmappedContext) {
    return null;
  }

  return {
    type: "review_channel_context",
    evidenceIds: [evidence.id],
    ...(evidence.guildId ? { guildId: evidence.guildId } : {}),
    ...(evidence.channelId ? { channelId: evidence.channelId } : {}),
    subjectType: "channel",
    subjectId: evidence.subjectId ?? evidence.channelId ?? evidence.id,
    serverContext,
    title: "Review channel context",
    summary: evidence.summary,
    reason: incompleteContext
      ? "This owner-authored channel profile uses a custom purpose without a topic override, which limits downstream deterministic routing."
      : unsureAccess
        ? "This owner-authored channel profile has an unsure access mode. Review it before using the profile for downstream recommendations."
        : "This channel context does not have a trusted server context mapping.",
    suggestedAction: "review",
    priority: "low",
    confidence: Math.min(evidence.confidence, 0.82),
    expiresAt: toIso(now + 30 * DAY_MS),
    derivedBy: "community-recommendations:channel-context-adapter",
    dedupeParts: ["channel_context", evidence.subjectId, evidence.channelId, purpose, accessMode, topicOverride ?? "none", serverContext],
  };
}

function buildRecommendationDrafts(evidenceRecords: readonly CommunityEvidenceRecord[], now: number) {
  const activeEvidence = evidenceRecords.filter((evidence) => evidenceIsActive(evidence, now));
  const drafts: RecommendationDraft[] = [];

  for (const evidence of activeEvidence) {
    const draft =
      buildAutomationIssueRecommendation(evidence, now) ??
      buildPostWindowOutcomeRecommendation(evidence, now) ??
      buildConversationOpportunityRecommendation(evidence, now) ??
      buildChannelActivityRecommendation(evidence, now) ??
      buildChannelContextRecommendation(evidence, now);

    if (draft) {
      drafts.push(draft);
    }
  }

  return drafts;
}

function shouldPreserveExistingRecommendation(existing: CommunityRecommendationRecord | undefined, next: CommunityRecommendationRecord, now: number) {
  if (!existing) {
    return false;
  }

  if (terminalSuppressingStatuses.has(existing.status)) {
    return true;
  }

  if (existing.status === "postponed" && existing.postponedUntil && Date.parse(existing.postponedUntil) > now) {
    return true;
  }

  if (existing.status === "expired" && evidenceFingerprint(existing.evidenceIds) === evidenceFingerprint(next.evidenceIds)) {
    return true;
  }

  return false;
}

function evidenceFingerprint(evidenceIds: readonly string[]) {
  return [...evidenceIds].sort().join("|");
}

function recommendationSupersedingKey(record: CommunityRecommendationRecord) {
  if (record.type === "review_post_window_outcome" || record.type === "review_conversation_opportunity") {
    return `${record.type}:${record.subjectId ?? record.id}`;
  }

  return [record.type, record.subjectId ?? record.channelId ?? "community", record.channelId ?? "none"].join(":");
}

function mergeRecommendations(
  existingRecords: readonly CommunityRecommendationRecord[],
  generatedRecords: readonly CommunityRecommendationRecord[],
  activeEvidenceIds: ReadonlySet<string>,
  now: number,
  retentionLimit: number,
) {
  const recordsById = new Map<string, CommunityRecommendationRecord>();
  const nowIso = toIso(now);

  for (const record of existingRecords) {
    const lostActiveEvidence = (record.status === "new" || record.status === "seen") &&
      record.evidenceIds.length > 0 &&
      !record.evidenceIds.some((id) => activeEvidenceIds.has(id));
    recordsById.set(record.id, lostActiveEvidence
      ? { ...record, status: "superseded", updatedAt: nowIso, dispositionReason: "Supporting evidence was superseded, expired, or recovered." }
      : record);
  }

  for (const generated of generatedRecords) {
    const supersedingKey = recommendationSupersedingKey(generated);
    for (const [id, existingRecord] of recordsById) {
      if (
        id !== generated.id &&
        (existingRecord.status === "new" || existingRecord.status === "seen") &&
        recommendationSupersedingKey(existingRecord) === supersedingKey
      ) {
        recordsById.set(id, {
          ...existingRecord,
          status: "superseded",
          updatedAt: nowIso,
          dispositionReason: "Replaced by newer equivalent evidence.",
        });
      }
    }

    const existing = recordsById.get(generated.id);

    if (shouldPreserveExistingRecommendation(existing, generated, now)) {
      continue;
    }

    if (!existing) {
      recordsById.set(generated.id, generated);
      continue;
    }

    const nextRecord: CommunityRecommendationRecord = {
      ...generated,
      createdAt: existing.createdAt,
      status: existing.status === "seen" ? "seen" : generated.status,
      updatedAt: generated.updatedAt,
      ...(existing.firstSeenAt ? { firstSeenAt: existing.firstSeenAt } : {}),
    };

    recordsById.set(generated.id, nextRecord);
  }

  return sortRecommendations([...recordsById.values()]).slice(0, retentionLimit);
}

function loadEvidenceForGeneration(options: RecommendationGenerationOptions, now: number) {
  return options.evidenceRecords ?? listCommunityEvidence(
    {
      status: "all",
      limit: 1000,
    },
    options.evidenceStorageFilePath ? { storageFilePath: options.evidenceStorageFilePath } : {},
  ).filter((evidence) => evidenceIsActive(evidence, now));
}

export function generateCommunityRecommendations(options: RecommendationGenerationOptions = {}): CommunityRecommendationGenerationResult {
  const now = options.now ?? Date.now();
  const retentionLimit = Math.max(1, Math.min(5000, Math.floor(options.retentionLimit ?? DEFAULT_RETENTION_LIMIT)));
  const evidenceRecords = loadEvidenceForGeneration(options, now);
  const evidenceIds = new Set(evidenceRecords.map((evidence) => evidence.id));
  const generated = buildRecommendationDrafts(evidenceRecords, now)
    .filter((draft) => draft.evidenceIds.length > 0 && draft.evidenceIds.every((id) => evidenceIds.has(id)))
    .map((draft) => createRecommendationFromDraft(draft, now));
  const store = loadRecommendationStore(options.storageFilePath);
  const activeEvidenceIds = new Set(evidenceRecords.filter((evidence) => evidenceIsActive(evidence, now)).map((evidence) => evidence.id));
  const records = mergeRecommendations(store.recommendations, generated, activeEvidenceIds, now, retentionLimit);

  if (options.persist !== false) {
    saveRecommendationStore({ recommendations: records }, options.storageFilePath);
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

function isVisibleForQuery(record: CommunityRecommendationRecord, query: CommunityRecommendationQuery, now: number) {
  if (query.status === "all") {
    return true;
  }

  if (query.status && query.status !== "active") {
    return record.status === query.status;
  }

  if (!activeStatuses.has(record.status)) {
    return false;
  }

  if (record.expiresAt && Date.parse(record.expiresAt) <= now) {
    return false;
  }

  if (record.status === "postponed" && !query.includePostponed && record.postponedUntil && Date.parse(record.postponedUntil) > now) {
    return false;
  }

  return true;
}

export function listCommunityRecommendations(query: CommunityRecommendationQuery = {}, options: { storageFilePath?: string } = {}) {
  const now = query.now ?? Date.now();
  const limit = Number.isInteger(query.limit) && query.limit && query.limit > 0 ? Math.min(query.limit, DEFAULT_RETENTION_LIMIT) : DEFAULT_RETENTION_LIMIT;

  return loadRecommendationStore(options.storageFilePath).recommendations
    .filter((record) => isVisibleForQuery(record, query, now))
    .filter((record) => !query.type || record.type === query.type)
    .filter((record) => !query.channelId || record.channelId === query.channelId)
    .filter((record) => !query.subjectType || record.subjectType === query.subjectType)
    .filter((record) => !query.serverContext || record.serverContext === query.serverContext)
    .slice(0, limit);
}

export function findCommunityRecommendations(query: CommunityRecommendationQuery = {}, options: { storageFilePath?: string } = {}) {
  return listCommunityRecommendations(query, options);
}

export function getCommunityRecommendationById(id: string, options: { storageFilePath?: string } = {}) {
  return loadRecommendationStore(options.storageFilePath).recommendations.find((record) => record.id === id) ?? null;
}

function updateRecommendation(
  id: string,
  updater: (record: CommunityRecommendationRecord, nowIso: string) => CommunityRecommendationRecord,
  options: { storageFilePath?: string; now?: number } = {},
) {
  const store = loadRecommendationStore(options.storageFilePath);
  const current = store.recommendations.find((record) => record.id === id);

  if (!current) {
    return null;
  }

  const nowIso = toIso(options.now ?? Date.now());
  const next = updater(current, nowIso);
  const recommendations = sortRecommendations(store.recommendations.map((record) => (record.id === id ? next : record)));
  saveRecommendationStore({ recommendations }, options.storageFilePath);
  return next;
}

export function markCommunityRecommendationSeen(id: string, options: { storageFilePath?: string; now?: number } = {}) {
  return updateRecommendation(id, (record, nowIso) => ({
    ...record,
    status: record.status === "new" ? "seen" : record.status,
    firstSeenAt: record.firstSeenAt ?? nowIso,
    updatedAt: nowIso,
  }), options);
}

export function acknowledgeCommunityRecommendation(id: string, dispositionReason?: string | null, options: { storageFilePath?: string; now?: number } = {}) {
  return updateRecommendation(id, (record, nowIso) => ({
    ...record,
    status: "acknowledged",
    acknowledgedAt: nowIso,
    updatedAt: nowIso,
    ...(dispositionReason?.trim() ? { dispositionReason: dispositionReason.trim().slice(0, 500) } : {}),
  }), options);
}

export function dismissCommunityRecommendation(id: string, dispositionReason?: string | null, options: { storageFilePath?: string; now?: number } = {}) {
  return updateRecommendation(id, (record, nowIso) => ({
    ...record,
    status: "dismissed",
    dismissedAt: nowIso,
    updatedAt: nowIso,
    ...(dispositionReason?.trim() ? { dispositionReason: dispositionReason.trim().slice(0, 500) } : {}),
  }), options);
}

export function postponeCommunityRecommendation(id: string, postponedUntil: number, dispositionReason?: string | null, options: { storageFilePath?: string; now?: number } = {}) {
  return updateRecommendation(id, (record, nowIso) => ({
    ...record,
    status: "postponed",
    postponedUntil: toIso(postponedUntil),
    updatedAt: nowIso,
    ...(dispositionReason?.trim() ? { dispositionReason: dispositionReason.trim().slice(0, 500) } : {}),
  }), options);
}

export function markCommunityRecommendationActed(id: string, dispositionReason?: string | null, options: { storageFilePath?: string; now?: number } = {}) {
  return updateRecommendation(id, (record, nowIso) => ({
    ...record,
    status: "acted",
    actedAt: nowIso,
    updatedAt: nowIso,
    ...(dispositionReason?.trim() ? { dispositionReason: dispositionReason.trim().slice(0, 500) } : {}),
  }), options);
}

export function supersedeCommunityRecommendation(id: string, dispositionReason?: string | null, options: { storageFilePath?: string; now?: number } = {}) {
  return updateRecommendation(id, (record, nowIso) => ({
    ...record,
    status: "superseded",
    updatedAt: nowIso,
    ...(dispositionReason?.trim() ? { dispositionReason: dispositionReason.trim().slice(0, 500) } : {}),
  }), options);
}

export function expireCommunityRecommendations(options: { storageFilePath?: string; now?: number } = {}) {
  const now = options.now ?? Date.now();
  const nowIso = toIso(now);
  const store = loadRecommendationStore(options.storageFilePath);
  let expiredCount = 0;
  const recommendations = store.recommendations.map((record) => {
    if (!activeStatuses.has(record.status) || !record.expiresAt || Date.parse(record.expiresAt) > now) {
      return record;
    }

    expiredCount += 1;
    return {
      ...record,
      status: "expired" as const,
      updatedAt: nowIso,
    };
  });

  if (expiredCount > 0) {
    saveRecommendationStore({ recommendations: sortRecommendations(recommendations) }, options.storageFilePath);
  }

  return {
    expiredCount,
    records: sortRecommendations(recommendations),
  };
}

export function clearCommunityRecommendationsForTests(options: { storageFilePath?: string } = {}) {
  saveRecommendationStore({ recommendations: [] }, options.storageFilePath);
}
