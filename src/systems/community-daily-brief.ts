import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateCommunityEvidence,
  listCommunityEvidence,
  type CommunityEvidenceRecord,
  type CommunityEvidenceServerContext,
} from "./community-evidence.js";
import {
  expireCommunityRecommendations,
  generateCommunityRecommendations,
  listCommunityRecommendations,
  type CommunityRecommendationPriority,
  type CommunityRecommendationRecord,
  type CommunitySuggestedAction,
} from "./community-recommendations.js";

export type CommunityDailyBriefSectionType =
  | "community_pulse"
  | "needs_attention"
  | "worth_reviewing"
  | "conversation_watch"
  | "recommended_next_step";

export type CommunityDailyBriefItem = {
  id: string;
  section: CommunityDailyBriefSectionType;
  recommendationId?: string;
  evidenceIds: string[];
  title: string;
  summary: string;
  reason: string;
  priority: CommunityRecommendationPriority;
  confidence: number;
  suggestedAction?: CommunitySuggestedAction;
  serverContext?: CommunityEvidenceServerContext;
  channelId?: string;
  createdAt: string;
  expiresAt?: string;
};

export type CommunityDailyBriefStatus = "calm" | "informational" | "attention_needed" | "urgent";

export type CommunityDailyBrief = {
  id: string;
  schemaVersion: number;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  status: CommunityDailyBriefStatus;
  headline: string;
  summary: string;
  sections: {
    communityPulse: CommunityDailyBriefItem[];
    needsAttention: CommunityDailyBriefItem[];
    worthReviewing: CommunityDailyBriefItem[];
    conversationWatch: CommunityDailyBriefItem[];
    recommendedNextStep: CommunityDailyBriefItem[];
  };
  counts: {
    evidenceConsidered: number;
    recommendationsConsidered: number;
    activeRecommendations: number;
    attentionItems: number;
  };
};

export type CommunityDailyBriefGenerationOptions = {
  now?: number;
  periodStart?: number;
  periodEnd?: number;
  evidenceRecords?: CommunityEvidenceRecord[];
  recommendationRecords?: CommunityRecommendationRecord[];
  generateEvidence?: boolean;
  generateRecommendations?: boolean;
  persistEvidence?: boolean;
  persistRecommendations?: boolean;
  persistBrief?: boolean;
  evidenceStorageFilePath?: string;
  recommendationStorageFilePath?: string;
  briefStorageFilePath?: string;
};

type CommunityDailyBriefStore = {
  briefs: CommunityDailyBrief[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "community-daily-briefs.json");
const SCHEMA_VERSION = 1;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_BRIEF_HISTORY = 30;
const priorityRank: Record<CommunityRecommendationPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
const contextRank: Record<CommunityEvidenceServerContext, number> = {
  fantasy: 0,
  primal: 1,
  general: 2,
  unknown: 3,
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

function sanitizeStringArray(value: unknown, maxLength: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.map((entry) => sanitizeString(entry, maxLength)).filter((entry): entry is string => Boolean(entry)))];
}

function sanitizeBriefItem(value: unknown): CommunityDailyBriefItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id, 180);
  const section = value.section === "community_pulse" ||
    value.section === "needs_attention" ||
    value.section === "worth_reviewing" ||
    value.section === "conversation_watch" ||
    value.section === "recommended_next_step"
    ? value.section
    : null;
  const title = sanitizeString(value.title, 180);
  const summary = sanitizeString(value.summary, 500);
  const reason = sanitizeString(value.reason, 800);
  const priority = value.priority === "low" || value.priority === "medium" || value.priority === "high" || value.priority === "critical"
    ? value.priority
    : null;
  const confidence = sanitizeConfidence(value.confidence);
  const createdAt = sanitizeIsoTimestamp(value.createdAt);

  if (!id || !section || !title || !summary || !reason || !priority || confidence === null || !createdAt) {
    return null;
  }

  return {
    id,
    section,
    ...(sanitizeString(value.recommendationId, 180) ? { recommendationId: sanitizeString(value.recommendationId, 180)! } : {}),
    evidenceIds: sanitizeStringArray(value.evidenceIds, 180),
    title,
    summary,
    reason,
    priority,
    confidence,
    ...(value.suggestedAction === "review" ||
      value.suggestedAction === "investigate" ||
      value.suggestedAction === "acknowledge" ||
      value.suggestedAction === "draft_follow_up" ||
      value.suggestedAction === "no_action"
      ? { suggestedAction: value.suggestedAction }
      : {}),
    ...(value.serverContext === "fantasy" || value.serverContext === "primal" || value.serverContext === "general" || value.serverContext === "unknown"
      ? { serverContext: value.serverContext }
      : {}),
    ...(sanitizeString(value.channelId, 32) ? { channelId: sanitizeString(value.channelId, 32)! } : {}),
    createdAt,
    ...(sanitizeIsoTimestamp(value.expiresAt) ? { expiresAt: sanitizeIsoTimestamp(value.expiresAt)! } : {}),
  };
}

function sanitizeBrief(value: unknown): CommunityDailyBrief | null {
  if (!isRecord(value) || !isRecord(value.sections) || !isRecord(value.counts)) {
    return null;
  }

  const id = sanitizeString(value.id, 180);
  const generatedAt = sanitizeIsoTimestamp(value.generatedAt);
  const periodStart = sanitizeIsoTimestamp(value.periodStart);
  const periodEnd = sanitizeIsoTimestamp(value.periodEnd);
  const status = value.status === "calm" ||
    value.status === "informational" ||
    value.status === "attention_needed" ||
    value.status === "urgent"
    ? value.status
    : null;
  const headline = sanitizeString(value.headline, 180);
  const summary = sanitizeString(value.summary, 800);

  if (!id || !generatedAt || !periodStart || !periodEnd || !status || !headline || !summary) {
    return null;
  }

  return {
    id,
    schemaVersion: typeof value.schemaVersion === "number" && value.schemaVersion > 0 ? Math.floor(value.schemaVersion) : SCHEMA_VERSION,
    generatedAt,
    periodStart,
    periodEnd,
    status,
    headline,
    summary,
    sections: {
      communityPulse: sanitizeBriefItems(value.sections.communityPulse),
      needsAttention: sanitizeBriefItems(value.sections.needsAttention),
      worthReviewing: sanitizeBriefItems(value.sections.worthReviewing),
      conversationWatch: sanitizeBriefItems(value.sections.conversationWatch),
      recommendedNextStep: sanitizeBriefItems(value.sections.recommendedNextStep).slice(0, 1),
    },
    counts: {
      evidenceConsidered: sanitizeCount(value.counts.evidenceConsidered),
      recommendationsConsidered: sanitizeCount(value.counts.recommendationsConsidered),
      activeRecommendations: sanitizeCount(value.counts.activeRecommendations),
      attentionItems: sanitizeCount(value.counts.attentionItems),
    },
  };
}

function sanitizeBriefItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => sanitizeBriefItem(item)).filter((item): item is CommunityDailyBriefItem => Boolean(item));
}

function sanitizeCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

function loadBriefStore(storageFilePath = DATA_FILE): CommunityDailyBriefStore {
  try {
    const parsed = JSON.parse(fs.readFileSync(storageFilePath, "utf8"));
    const rawBriefs = isRecord(parsed) && Array.isArray(parsed.briefs) ? parsed.briefs : [];
    return {
      briefs: sortBriefs(rawBriefs.map((brief) => sanitizeBrief(brief)).filter((brief): brief is CommunityDailyBrief => Boolean(brief))).slice(0, MAX_BRIEF_HISTORY),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[community-daily-brief] could not load briefs from ${storageFilePath}.`, error);
    }

    return {
      briefs: [],
    };
  }
}

function saveBriefStore(store: CommunityDailyBriefStore, storageFilePath = DATA_FILE) {
  try {
    fs.mkdirSync(path.dirname(storageFilePath), { recursive: true });
    const temporaryFilePath = `${storageFilePath}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify({ briefs: sortBriefs(store.briefs).slice(0, MAX_BRIEF_HISTORY) }, null, 2));
    fs.renameSync(temporaryFilePath, storageFilePath);
  } catch (error) {
    console.warn(`[community-daily-brief] could not save briefs to ${storageFilePath}.`, error);
  }
}

function sortBriefs(briefs: readonly CommunityDailyBrief[]) {
  return [...briefs].sort(
    (left, right) =>
      Date.parse(right.generatedAt) - Date.parse(left.generatedAt) ||
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

function makeItemId(section: CommunityDailyBriefSectionType, sourceId: string) {
  return `${section}:${hashStableValue([section, sourceId])}`;
}

function evidenceIsActive(evidence: CommunityEvidenceRecord, now: number) {
  return evidence.status === "active" && (!evidence.expiresAt || Date.parse(evidence.expiresAt) > now);
}

function evidenceInPeriodOrDurable(evidence: CommunityEvidenceRecord, periodStart: number, periodEnd: number) {
  const observedAt = Date.parse(evidence.observedAt);
  if (!Number.isFinite(observedAt)) {
    return false;
  }

  if (observedAt >= periodStart && observedAt <= periodEnd) {
    return true;
  }

  return evidence.type === "channel_context" && evidence.status === "active";
}

function sortRecommendationsForBrief(records: readonly CommunityRecommendationRecord[]) {
  return [...records].sort(
    (left, right) =>
      priorityRank[left.priority] - priorityRank[right.priority] ||
      contextRank[left.serverContext ?? "unknown"] - contextRank[right.serverContext ?? "unknown"] ||
      statusRank(left.status) - statusRank(right.status) ||
      right.confidence - left.confidence ||
      Date.parse(right.updatedAt) - Date.parse(left.updatedAt) ||
      left.id.localeCompare(right.id),
  );
}

function statusRank(status: CommunityRecommendationRecord["status"]) {
  if (status === "new") {
    return 0;
  }

  if (status === "seen") {
    return 1;
  }

  return 2;
}

function sortEvidenceForPulse(records: readonly CommunityEvidenceRecord[]) {
  return [...records].sort(
    (left, right) =>
      contextRank[left.serverContext ?? "unknown"] - contextRank[right.serverContext ?? "unknown"] ||
      right.confidence - left.confidence ||
      Date.parse(right.observedAt) - Date.parse(left.observedAt) ||
      left.id.localeCompare(right.id),
  );
}

function getEvidenceMap(records: readonly CommunityEvidenceRecord[]) {
  return new Map(records.map((record) => [record.id, record]));
}

function recommendationHasValidEvidence(
  recommendation: CommunityRecommendationRecord,
  evidenceById: Map<string, CommunityEvidenceRecord>,
  now: number,
  periodStart: number,
  periodEnd: number,
) {
  if (recommendation.evidenceIds.length === 0) {
    return false;
  }

  return recommendation.evidenceIds.every((evidenceId) => {
    const evidence = evidenceById.get(evidenceId);
    return Boolean(evidence && evidenceIsActive(evidence, now) && evidenceInPeriodOrDurable(evidence, periodStart, periodEnd));
  });
}

function recommendationIsEligible(recommendation: CommunityRecommendationRecord, now: number) {
  if (recommendation.status !== "new" && recommendation.status !== "seen") {
    if (recommendation.status === "postponed" && recommendation.postponedUntil && Date.parse(recommendation.postponedUntil) <= now) {
      return true;
    }

    return false;
  }

  return !recommendation.expiresAt || Date.parse(recommendation.expiresAt) > now;
}

function createItemFromRecommendation(section: CommunityDailyBriefSectionType, recommendation: CommunityRecommendationRecord): CommunityDailyBriefItem {
  return {
    id: makeItemId(section, recommendation.id),
    section,
    recommendationId: recommendation.id,
    evidenceIds: recommendation.evidenceIds,
    title: recommendation.title,
    summary: recommendation.summary,
    reason: recommendation.reason,
    priority: recommendation.priority,
    confidence: recommendation.confidence,
    suggestedAction: recommendation.suggestedAction,
    ...(recommendation.serverContext ? { serverContext: recommendation.serverContext } : {}),
    ...(recommendation.channelId ? { channelId: recommendation.channelId } : {}),
    createdAt: recommendation.createdAt,
    ...(recommendation.expiresAt ? { expiresAt: recommendation.expiresAt } : {}),
  };
}

function createPulseItem(evidence: CommunityEvidenceRecord): CommunityDailyBriefItem | null {
  if (evidence.type !== "channel_activity_window" && evidence.type !== "post_window_outcome") {
    return null;
  }

  if (evidence.type === "channel_activity_window") {
    const windowKey = evidence.facts.windowKey;
    const humanMessages = evidence.facts.humanMessageCount;
    const participants = evidence.facts.approxActiveUsers;
    const humanAttachments = evidence.facts.humanAttachmentOrEmbedCount;

    if (windowKey !== "last24h" || typeof humanMessages !== "number" || humanMessages < 10) {
      return null;
    }

    return {
      id: makeItemId("community_pulse", evidence.id),
      section: "community_pulse",
      evidenceIds: [evidence.id],
      title: "Recent channel activity",
      summary: evidence.summary,
      reason: `${participants ?? "Some"} approximate participant${participants === 1 ? "" : "s"} and ${humanMessages} human message${humanMessages === 1 ? "" : "s"} were recorded in the latest 24-hour window. This shows activity volume, not sentiment or content quality.`,
      priority: humanAttachments && typeof humanAttachments === "number" && humanAttachments >= 5 ? "medium" : "low",
      confidence: evidence.confidence,
      ...(evidence.serverContext ? { serverContext: evidence.serverContext } : {}),
      ...(evidence.channelId ? { channelId: evidence.channelId } : {}),
      createdAt: evidence.createdAt,
      ...(evidence.expiresAt ? { expiresAt: evidence.expiresAt } : {}),
    };
  }

  const humanMessages60m = evidence.facts.humanMessages60m;

  if (typeof humanMessages60m !== "number" || humanMessages60m < 10) {
    return null;
  }

  return {
    id: makeItemId("community_pulse", evidence.id),
    section: "community_pulse",
    evidenceIds: [evidence.id],
    title: "Notable post-window activity",
    summary: evidence.summary,
    reason: `${humanMessages60m} human message${humanMessages60m === 1 ? "" : "s"} were recorded in the 60-minute post window. This does not prove causation.`,
    priority: humanMessages60m >= 20 ? "medium" : "low",
    confidence: evidence.confidence,
    ...(evidence.serverContext ? { serverContext: evidence.serverContext } : {}),
    ...(evidence.channelId ? { channelId: evidence.channelId } : {}),
    createdAt: evidence.createdAt,
    ...(evidence.expiresAt ? { expiresAt: evidence.expiresAt } : {}),
  };
}

function dedupeItemsBySubject(items: readonly CommunityDailyBriefItem[]) {
  const seen = new Set<string>();
  const deduped: CommunityDailyBriefItem[] = [];

  for (const item of items) {
    const key = `${item.section}:${[...item.evidenceIds].sort().join("|")}:${item.channelId ?? "none"}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

function pulseGroupingKey(evidence: CommunityEvidenceRecord) {
  if (evidence.type === "channel_activity_window") {
    return [
      evidence.serverContext ?? "unknown",
      evidence.channelId ?? evidence.subjectId ?? "community",
      evidence.facts.windowKey ?? "unknown",
      evidence.facts.activityClassification ?? "unknown",
    ].join(":");
  }

  return `${evidence.type}:${evidence.subjectId ?? evidence.id}`;
}

function consolidatePulseEvidence(records: readonly CommunityEvidenceRecord[]) {
  const grouped = new Map<string, CommunityEvidenceRecord>();
  for (const record of records) {
    if (record.type !== "channel_activity_window" && record.type !== "post_window_outcome") continue;
    const key = pulseGroupingKey(record);
    const existing = grouped.get(key);
    const completeness = Number(record.facts.humanMessageCount ?? record.facts.humanMessages60m ?? 0) + Number(record.facts.approxActiveUsers ?? 0);
    const existingCompleteness = Number(existing?.facts.humanMessageCount ?? existing?.facts.humanMessages60m ?? 0) + Number(existing?.facts.approxActiveUsers ?? 0);
    if (!existing || Date.parse(record.createdAt) > Date.parse(existing.createdAt) || (
      Date.parse(record.createdAt) === Date.parse(existing.createdAt) && completeness > existingCompleteness
    )) {
      grouped.set(key, record);
    }
  }
  return [...grouped.values()];
}

function getStatus(needsAttention: readonly CommunityDailyBriefItem[], otherItemsCount: number): CommunityDailyBriefStatus {
  if (needsAttention.some((item) => item.priority === "critical")) {
    return "urgent";
  }

  if (needsAttention.some((item) => item.priority === "high")) {
    return "attention_needed";
  }

  if (otherItemsCount > 0) {
    return "informational";
  }

  return "calm";
}

function getHeadline(status: CommunityDailyBriefStatus, counts: { attentionItems: number; reviewItems: number; pulseItems: number; conversationItems: number }) {
  if (status === "urgent") {
    return counts.attentionItems === 1 ? "One issue needs immediate attention" : `${counts.attentionItems} issues need immediate attention`;
  }

  if (status === "attention_needed") {
    return counts.attentionItems === 1 ? "One item needs attention" : `${counts.attentionItems} items need attention`;
  }

  const reviewCount = counts.reviewItems + counts.conversationItems;
  if (status === "informational") {
    if (reviewCount > 0) {
      return reviewCount === 1 ? "One item is worth reviewing" : `${reviewCount} items are worth reviewing`;
    }

    return "Community activity was recorded; no action is required";
  }

  return "No meaningful issues detected";
}

function getSummary(status: CommunityDailyBriefStatus, counts: { evidence: number; activeRecommendations: number; attentionItems: number }) {
  if (status === "urgent") {
    return "A critical recommendation is active. Review the recommended next step before making other community-management changes.";
  }

  if (status === "attention_needed") {
    return `${counts.attentionItems} owner-relevant item${counts.attentionItems === 1 ? "" : "s"} should be reviewed. Recommendations remain review-first and do not trigger Discord actions.`;
  }

  if (status === "informational") {
    return `${counts.evidence} evidence record${counts.evidence === 1 ? "" : "s"} and ${counts.activeRecommendations} active recommendation${counts.activeRecommendations === 1 ? "" : "s"} were considered. Nothing requires immediate action.`;
  }

  return "Community activity may exist, but no meaningful issues or opportunities were detected in the selected period.";
}

function getBriefId(input: {
  periodStart: string;
  periodEnd: string;
  evidenceIds: string[];
  recommendationIds: string[];
}) {
  return `community-brief:${hashStableValue([
    input.periodStart,
    input.periodEnd,
    [...input.evidenceIds].sort(),
    [...input.recommendationIds].sort(),
  ])}`;
}

function saveBrief(brief: CommunityDailyBrief, storageFilePath?: string) {
  const store = loadBriefStore(storageFilePath);
  const briefsById = new Map(store.briefs.map((item) => [item.id, item]));
  briefsById.set(brief.id, brief);
  saveBriefStore({ briefs: sortBriefs([...briefsById.values()]).slice(0, MAX_BRIEF_HISTORY) }, storageFilePath);
}

export function generateCommunityDailyBrief(options: CommunityDailyBriefGenerationOptions = {}): CommunityDailyBrief {
  const now = options.now ?? Date.now();
  const periodEnd = options.periodEnd ?? now;
  const periodStart = options.periodStart ?? periodEnd - DAY_MS;
  const generatedAt = toIso(now);
  const periodStartIso = toIso(periodStart);
  const periodEndIso = toIso(periodEnd);

  const evidenceRecords = options.evidenceRecords ?? (
    options.generateEvidence === false
      ? listCommunityEvidence({ status: "all", limit: 1000 }, options.evidenceStorageFilePath ? { storageFilePath: options.evidenceStorageFilePath } : {})
      : generateCommunityEvidence({
          now,
          persist: options.persistEvidence !== false,
          ...(options.evidenceStorageFilePath ? { storageFilePath: options.evidenceStorageFilePath } : {}),
        }).records
  );

  if (options.recommendationRecords === undefined && options.generateRecommendations !== false) {
    generateCommunityRecommendations({
      now,
      evidenceRecords,
      persist: options.persistRecommendations !== false,
      ...(options.recommendationStorageFilePath ? { storageFilePath: options.recommendationStorageFilePath } : {}),
    });
    expireCommunityRecommendations({
      now,
      ...(options.recommendationStorageFilePath ? { storageFilePath: options.recommendationStorageFilePath } : {}),
    });
  }

  const recommendationRecords = options.recommendationRecords ?? listCommunityRecommendations(
    {
      status: "active",
      now,
      limit: 1000,
    },
    options.recommendationStorageFilePath ? { storageFilePath: options.recommendationStorageFilePath } : {},
  );
  const activeEvidence = evidenceRecords.filter((evidence) => evidenceIsActive(evidence, now) && evidenceInPeriodOrDurable(evidence, periodStart, periodEnd));
  const evidenceById = getEvidenceMap(activeEvidence);
  const validRecommendations = sortRecommendationsForBrief(recommendationRecords)
    .filter((recommendation) => recommendationIsEligible(recommendation, now))
    .filter((recommendation) => recommendationHasValidEvidence(recommendation, evidenceById, now, periodStart, periodEnd));

  const needsAttention = dedupeItemsBySubject(validRecommendations
    .filter((recommendation) => recommendation.type === "investigate_automation_issue" && (recommendation.priority === "critical" || recommendation.priority === "high"))
    .map((recommendation) => createItemFromRecommendation("needs_attention", recommendation)))
    .slice(0, 3);

  const worthReviewing = dedupeItemsBySubject(validRecommendations
    .filter((recommendation) =>
      (recommendation.type === "investigate_automation_issue" && recommendation.priority === "medium") ||
      recommendation.type === "review_post_window_outcome" ||
      recommendation.type === "review_channel_activity" ||
      recommendation.type === "review_channel_context")
    .map((recommendation) => createItemFromRecommendation("worth_reviewing", recommendation)))
    .slice(0, 3);

  const conversationWatch = dedupeItemsBySubject(validRecommendations
    .filter((recommendation) => recommendation.type === "review_conversation_opportunity")
    .map((recommendation) => createItemFromRecommendation("conversation_watch", recommendation)))
    .slice(0, 2);

  const recommendationItemIds = new Set([
    ...needsAttention,
    ...worthReviewing,
    ...conversationWatch,
  ].map((item) => item.recommendationId).filter(Boolean));

  const communityPulse = dedupeItemsBySubject(sortEvidenceForPulse(consolidatePulseEvidence(activeEvidence))
    .map((evidence) => createPulseItem(evidence))
    .filter((item): item is CommunityDailyBriefItem => Boolean(item))
    .filter((item) => !item.evidenceIds.some((evidenceId) => validRecommendations.some((recommendation) => recommendationItemIds.has(recommendation.id) && recommendation.evidenceIds.includes(evidenceId)))))
    .slice(0, 3);

  const nextStepSource = sortRecommendationsForBrief(validRecommendations)
    .find((recommendation) =>
      recommendation.suggestedAction !== "no_action" && (
        recommendation.priority === "critical" ||
        recommendation.priority === "high" ||
        (recommendation.priority === "medium" && (
          recommendation.type === "investigate_automation_issue" ||
          recommendation.type === "review_conversation_opportunity" ||
          recommendation.type === "review_post_window_outcome"
        ))
      ));
  const recommendedNextStep = nextStepSource ? [createItemFromRecommendation("recommended_next_step", nextStepSource)] : [];
  const status = getStatus(needsAttention, communityPulse.length + worthReviewing.length + conversationWatch.length);
  const headline = getHeadline(status, {
    attentionItems: needsAttention.length,
    reviewItems: worthReviewing.length,
    pulseItems: communityPulse.length,
    conversationItems: conversationWatch.length,
  });
  const summary = getSummary(status, {
    evidence: activeEvidence.length,
    activeRecommendations: validRecommendations.length,
    attentionItems: needsAttention.length,
  });
  const evidenceIds = activeEvidence.map((evidence) => evidence.id);
  const recommendationIds = validRecommendations.map((recommendation) => recommendation.id);
  const brief: CommunityDailyBrief = {
    id: getBriefId({
      periodStart: periodStartIso,
      periodEnd: periodEndIso,
      evidenceIds,
      recommendationIds,
    }),
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    periodStart: periodStartIso,
    periodEnd: periodEndIso,
    status,
    headline,
    summary,
    sections: {
      communityPulse,
      needsAttention,
      worthReviewing,
      conversationWatch,
      recommendedNextStep,
    },
    counts: {
      evidenceConsidered: activeEvidence.length,
      recommendationsConsidered: recommendationRecords.length,
      activeRecommendations: validRecommendations.length,
      attentionItems: needsAttention.length,
    },
  };

  if (options.persistBrief !== false) {
    saveBrief(brief, options.briefStorageFilePath);
  }

  return brief;
}

export function getLatestCommunityDailyBrief(options: { storageFilePath?: string } = {}) {
  return loadBriefStore(options.storageFilePath).briefs[0] ?? null;
}

export function listCommunityDailyBriefs(options: { storageFilePath?: string; limit?: number } = {}) {
  const limit = Number.isInteger(options.limit) && options.limit && options.limit > 0 ? Math.min(options.limit, MAX_BRIEF_HISTORY) : MAX_BRIEF_HISTORY;
  return loadBriefStore(options.storageFilePath).briefs.slice(0, limit);
}

export function clearCommunityDailyBriefsForTests(options: { storageFilePath?: string } = {}) {
  saveBriefStore({ briefs: [] }, options.storageFilePath);
}
