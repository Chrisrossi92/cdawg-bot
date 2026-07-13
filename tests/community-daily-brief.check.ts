import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  generateCommunityDailyBrief,
  getLatestCommunityDailyBrief,
  listCommunityDailyBriefs,
} from "../src/systems/community-daily-brief.js";
import type { CommunityEvidenceRecord } from "../src/systems/community-evidence.js";
import type { CommunityRecommendationRecord } from "../src/systems/community-recommendations.js";
import { getDailyBriefing } from "../src/systems/daily-briefing.js";
import type { ChannelIntelligenceResponse } from "../src/systems/channel-intelligence.js";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdawg-community-daily-brief-"));
const briefStorageFilePath = path.join(tempDir, "community-daily-briefs.json");
const now = new Date("2026-07-12T12:00:00.000Z").getTime();
const periodStart = now - 24 * 60 * 60 * 1000;
const channelId = "1463686052509388894";

function evidence(id: string, patch: Partial<CommunityEvidenceRecord> & Pick<CommunityEvidenceRecord, "type" | "sourceSystem" | "subjectType" | "summary" | "facts">): CommunityEvidenceRecord {
  const createdAt = new Date(now - 60_000).toISOString();

  return {
    id,
    schemaVersion: 1,
    sourceRecordIds: [`source:${id}`],
    confidence: 0.8,
    createdAt,
    observedAt: createdAt,
    status: "active",
    provenance: {
      sourceSystem: patch.sourceSystem,
      sourceRecordIds: [`source:${id}`],
      derivedBy: "test",
      derivedAt: createdAt,
    },
    ...patch,
  };
}

function recommendation(
  id: string,
  patch: Partial<CommunityRecommendationRecord> & Pick<CommunityRecommendationRecord, "type" | "evidenceIds" | "subjectType" | "title" | "summary" | "reason" | "suggestedAction" | "priority">,
): CommunityRecommendationRecord {
  const createdAt = new Date(now - 30_000).toISOString();

  return {
    id,
    schemaVersion: 1,
    confidence: 0.8,
    status: "new",
    createdAt,
    updatedAt: createdAt,
    provenance: {
      derivedBy: "test",
      derivedAt: createdAt,
      evidenceIds: patch.evidenceIds,
    },
    ...patch,
  };
}

const evAutomation = evidence("ev-automation", {
  type: "automation_issue",
  sourceSystem: "automation_activity",
  channelId,
  subjectType: "automation",
  subjectId: "feed:blocked:cooldown",
  serverContext: "primal",
  summary: "feed automation recorded 2 blocked events for #palworld-chat; latest reason: cooldown.",
  facts: {
    status: "blocked",
    reason: "cooldown",
    occurrenceCount: 2,
  },
  confidence: 0.9,
  expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
});
const evPost = evidence("ev-post", {
  type: "post_window_outcome",
  sourceSystem: "content_outcomes",
  channelId,
  subjectType: "content",
  subjectId: "message-1",
  serverContext: "fantasy",
  summary: "#palworld-chat recorded 22 human messages within 60 minutes after this composer post.",
  facts: {
    humanMessages60m: 22,
    deterministicOutcomeLabel: "sparked",
  },
  confidence: 0.74,
  expiresAt: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(),
});
const evConversation = evidence("ev-conversation", {
  type: "conversation_decision",
  sourceSystem: "conversation_participation",
  channelId,
  subjectType: "conversation",
  subjectId: "decision-1",
  serverContext: "general",
  summary: "Conversation preview would have suggested speaking in #palworld-chat.",
  facts: {
    wouldHaveSpoken: true,
    relevanceScore: 3,
  },
  confidence: 0.78,
  expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
});
const evActivity = evidence("ev-activity", {
  type: "channel_activity_window",
  sourceSystem: "engagement_activity",
  channelId,
  subjectType: "channel",
  subjectId: channelId,
  serverContext: "primal",
  summary: "7 approximate participants sent 38 human messages in #palworld-chat during the last24h activity window.",
  facts: {
    windowKey: "last24h",
    humanMessageCount: 38,
    approxActiveUsers: 7,
    attachmentOrEmbedCount: 1,
  },
  confidence: 0.82,
  expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
});
const evContext = evidence("ev-context", {
  type: "channel_context",
  sourceSystem: "channel_profiles",
  channelId,
  subjectType: "channel",
  subjectId: channelId,
  serverContext: "unknown",
  summary: "#palworld-chat has owner-authored context: purpose custom, audience members, tone friendly.",
  facts: {
    purpose: "custom",
    accessMode: "everyone",
    topicOverride: null,
  },
  confidence: 0.96,
});

const recAutomation = recommendation("rec-automation", {
  type: "investigate_automation_issue",
  evidenceIds: [evAutomation.id],
  channelId,
  subjectType: "automation",
  subjectId: "feed:blocked:cooldown",
  serverContext: "primal",
  title: "Investigate automation issue",
  summary: evAutomation.summary,
  reason: "2 blocked automation events were observed. Latest reason: cooldown.",
  suggestedAction: "investigate",
  priority: "high",
  confidence: 0.9,
  expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
});
const recPost = recommendation("rec-post", {
  type: "review_post_window_outcome",
  evidenceIds: [evPost.id],
  channelId,
  subjectType: "content",
  subjectId: "message-1",
  serverContext: "fantasy",
  title: "Review notable post-window activity",
  summary: evPost.summary,
  reason: "The channel recorded 22 human messages within 60 minutes after the post. This does not prove causation.",
  suggestedAction: "review",
  priority: "medium",
  confidence: 0.74,
  expiresAt: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(),
});
const recConversation = recommendation("rec-conversation", {
  type: "review_conversation_opportunity",
  evidenceIds: [evConversation.id],
  channelId,
  subjectType: "conversation",
  subjectId: "decision-1",
  serverContext: "general",
  title: "Review conversation preview opportunity",
  summary: evConversation.summary,
  reason: "The preview-only conversation engine recorded a would-send decision.",
  suggestedAction: "review",
  priority: "medium",
  confidence: 0.78,
  expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
});
const recContext = recommendation("rec-context", {
  type: "review_channel_context",
  evidenceIds: [evContext.id],
  channelId,
  subjectType: "channel",
  subjectId: channelId,
  serverContext: "unknown",
  title: "Review channel context",
  summary: evContext.summary,
  reason: "This owner-authored channel profile uses a custom purpose without a topic override.",
  suggestedAction: "review",
  priority: "low",
  confidence: 0.82,
  expiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString(),
});

let brief = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [evAutomation, evPost, evConversation, evActivity, evContext],
  recommendationRecords: [recAutomation, recPost, recConversation, recContext],
  briefStorageFilePath,
});

assert.equal(brief.status, "attention_needed");
assert.equal(brief.sections.needsAttention.length, 1);
assert.equal(brief.sections.worthReviewing.length, 2);
assert.equal(brief.sections.conversationWatch.length, 1);
assert.equal(brief.sections.recommendedNextStep.length, 1);
assert.equal(brief.sections.recommendedNextStep[0]?.recommendationId, recAutomation.id);
assert.equal(brief.sections.communityPulse.length <= 3, true);
assert.equal(brief.counts.evidenceConsidered, 5);
assert.equal(brief.counts.activeRecommendations, 4);
assert.ok(brief.sections.needsAttention[0]?.evidenceIds.includes(evAutomation.id));
assert.equal(brief.sections.worthReviewing.some((item) => item.serverContext === "fantasy"), true);
assert.equal(brief.sections.needsAttention[0]?.serverContext, "primal");
assert.equal(getLatestCommunityDailyBrief({ storageFilePath: briefStorageFilePath })?.id, brief.id);
assert.equal(listCommunityDailyBriefs({ storageFilePath: briefStorageFilePath }).length, 1);

const repeatedBrief = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [evAutomation, evPost, evConversation, evActivity, evContext],
  recommendationRecords: [recAutomation, recPost, recConversation, recContext],
  briefStorageFilePath,
});
assert.equal(repeatedBrief.id, brief.id, "fixed inputs should produce deterministic brief IDs");
assert.equal(listCommunityDailyBriefs({ storageFilePath: briefStorageFilePath }).length, 1, "same brief should not duplicate history");

const urgent = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [evAutomation],
  recommendationRecords: [
    {
      ...recAutomation,
      id: "rec-critical",
      priority: "critical",
    },
  ],
  persistBrief: false,
});
assert.equal(urgent.status, "urgent");

const informational = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [evPost],
  recommendationRecords: [recPost],
  persistBrief: false,
});
assert.equal(informational.status, "informational");
assert.equal(informational.sections.needsAttention.length, 0);

const calmEmpty = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [],
  recommendationRecords: [],
  persistBrief: false,
});
assert.equal(calmEmpty.status, "calm");
assert.equal(calmEmpty.sections.recommendedNextStep.length, 0);
assert.match(calmEmpty.summary, /no meaningful issues/i);

const calmWithUnnotableEvidence = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [
    {
      ...evActivity,
      id: "ev-low-activity",
      facts: {
        ...evActivity.facts,
        humanMessageCount: 2,
        approxActiveUsers: 1,
      },
    },
  ],
  recommendationRecords: [],
  persistBrief: false,
});
assert.equal(calmWithUnnotableEvidence.status, "calm");

for (const status of ["dismissed", "acted", "expired", "superseded"] as const) {
  const filtered = generateCommunityDailyBrief({
    now,
    periodStart,
    periodEnd: now,
    evidenceRecords: [evAutomation],
    recommendationRecords: [
      {
        ...recAutomation,
        id: `rec-${status}`,
        status,
      },
    ],
    persistBrief: false,
  });
  assert.equal(filtered.counts.activeRecommendations, 0, `${status} recommendations should be excluded`);
  assert.equal(filtered.sections.needsAttention.length, 0);
}

const postponed = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [evAutomation],
  recommendationRecords: [
    {
      ...recAutomation,
      id: "rec-postponed",
      status: "postponed",
      postponedUntil: new Date(now + 60 * 60 * 1000).toISOString(),
    },
  ],
  persistBrief: false,
});
assert.equal(postponed.counts.activeRecommendations, 0, "active postponement should be excluded");

const acknowledged = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [evAutomation],
  recommendationRecords: [
    {
      ...recAutomation,
      id: "rec-acknowledged",
      status: "acknowledged",
    },
  ],
  persistBrief: false,
});
assert.equal(acknowledged.counts.activeRecommendations, 0, "acknowledged recommendations should be excluded from active brief");

const missingEvidence = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [],
  recommendationRecords: [recAutomation],
  persistBrief: false,
});
assert.equal(missingEvidence.counts.activeRecommendations, 0);

const expiredEvidence = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [
    {
      ...evAutomation,
      id: "ev-expired",
      status: "expired",
    },
  ],
  recommendationRecords: [
    {
      ...recAutomation,
      id: "rec-expired-evidence",
      evidenceIds: ["ev-expired"],
    },
  ],
  persistBrief: false,
});
assert.equal(expiredEvidence.counts.activeRecommendations, 0);

const seenVsNew = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [evAutomation],
  recommendationRecords: [
    {
      ...recAutomation,
      id: "rec-seen",
      status: "seen",
      confidence: 0.9,
    },
    {
      ...recAutomation,
      id: "rec-new",
      status: "new",
      confidence: 0.9,
    },
  ],
  persistBrief: false,
});
assert.equal(seenVsNew.sections.needsAttention[0]?.recommendationId, "rec-new", "new recommendations should rank above equivalent seen recommendations");

const duplicateRecommendations = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [evAutomation],
  recommendationRecords: [recAutomation, { ...recAutomation, id: "rec-automation-duplicate" }],
  persistBrief: false,
});
assert.equal(duplicateRecommendations.sections.needsAttention.length, 1, "equivalent recommendations with the same evidence should dedupe");
assert.equal(duplicateRecommendations.sections.recommendedNextStep.length, 1);

const oldEvidence = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [
    {
      ...evActivity,
      id: "ev-old",
      observedAt: new Date(periodStart - 60_000).toISOString(),
    },
  ],
  recommendationRecords: [],
  persistBrief: false,
});
assert.equal(oldEvidence.sections.communityPulse.length, 0, "out-of-window activity evidence should be excluded");

const weakKeywordContext = generateCommunityDailyBrief({
  now,
  periodStart,
  periodEnd: now,
  evidenceRecords: [
    {
      ...evActivity,
      id: "ev-weak-keyword",
      serverContext: "unknown",
      summary: "Fantasy word appears in free text, but context remains unknown.",
    },
  ],
  recommendationRecords: [],
  persistBrief: false,
});
assert.equal(weakKeywordContext.sections.communityPulse[0]?.serverContext, "unknown", "brief should preserve evidence context instead of inferring from keywords");

const fakeChannelIntelligence: ChannelIntelligenceResponse = {
  generatedAt: now,
  activityWindowMs: 7 * 24 * 60 * 60 * 1000,
  channels: [],
  summary: {
    healthy: 0,
    "needs setup": 0,
    attention: 0,
    inactive: 0,
    unknown: 0,
  },
  sources: [],
  metadataAvailable: true,
};
assert.ok(getDailyBriefing(fakeChannelIntelligence).summary, "legacy daily briefing should remain callable");

assert.equal(fs.existsSync(path.join(process.cwd(), "data/community-daily-briefs.json")), false, "tests should not create production brief data");
