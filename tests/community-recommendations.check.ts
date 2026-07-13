import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  acknowledgeCommunityRecommendation,
  dismissCommunityRecommendation,
  expireCommunityRecommendations,
  findCommunityRecommendations,
  generateCommunityRecommendations,
  getCommunityRecommendationById,
  listCommunityRecommendations,
  markCommunityRecommendationActed,
  markCommunityRecommendationSeen,
  postponeCommunityRecommendation,
  supersedeCommunityRecommendation,
  type CommunityRecommendationRecord,
} from "../src/systems/community-recommendations.js";
import type { CommunityEvidenceRecord } from "../src/systems/community-evidence.js";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdawg-community-recommendations-"));
const storageFilePath = path.join(tempDir, "community-recommendations.json");
const now = new Date("2026-07-12T12:00:00.000Z").getTime();
const channelId = "1463686052509388894";

function evidence(
  id: string,
  patch: Omit<CommunityEvidenceRecord, "id" | "schemaVersion" | "sourceRecordIds" | "confidence" | "provenance" | "createdAt" | "observedAt" | "status"> &
    Partial<Pick<CommunityEvidenceRecord, "sourceRecordIds" | "confidence" | "createdAt" | "observedAt" | "status" | "provenance">>,
): CommunityEvidenceRecord {
  const createdAt = new Date(now - 60_000).toISOString();
  const sourceRecordIds = patch.sourceRecordIds ?? [`source:${id}`];

  return {
    id,
    schemaVersion: 1,
    sourceRecordIds,
    confidence: patch.confidence ?? 0.8,
    createdAt: patch.createdAt ?? createdAt,
    observedAt: patch.observedAt ?? createdAt,
    status: patch.status ?? "active",
    provenance: patch.provenance ?? {
      sourceSystem: patch.sourceSystem,
      sourceRecordIds,
      derivedBy: "test",
      derivedAt: createdAt,
    },
    ...patch,
  };
}

const baseEvidence: CommunityEvidenceRecord[] = [
  evidence("ev-auto", {
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
      automationSource: "feed",
      blockedReason: "cooldown",
    },
    confidence: 0.9,
    expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }),
  evidence("ev-outcome", {
    type: "post_window_outcome",
    sourceSystem: "content_outcomes",
    channelId,
    subjectType: "content",
    subjectId: "1480000000000000001",
    serverContext: "general",
    summary: "#palworld-chat recorded 22 human messages within 60 minutes after this composer post.",
    facts: {
      humanMessages60m: 22,
      deterministicOutcomeLabel: "sparked",
      source: "composer",
      measurementType: "post_window_channel_activity",
    },
    confidence: 0.74,
    expiresAt: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(),
  }),
  evidence("ev-conversation", {
    type: "conversation_decision",
    sourceSystem: "conversation_participation",
    channelId,
    subjectType: "conversation",
    subjectId: "decision-1",
    serverContext: "general",
    summary: "Conversation preview would have suggested speaking in #palworld-chat.",
    facts: {
      wouldHaveSpoken: true,
      suppressionActive: false,
      relevanceScore: 3,
      reason: "relevant inline reply would fit in preview mode",
    },
    confidence: 0.78,
    expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
  }),
  evidence("ev-activity", {
    type: "channel_activity_window",
    sourceSystem: "engagement_activity",
    channelId,
    subjectType: "channel",
    subjectId: channelId,
    serverContext: "general",
    summary: "7 approximate participants sent 38 human messages in #palworld-chat during the last24h activity window.",
    facts: {
      windowKey: "last24h",
      humanMessageCount: 38,
      approxActiveUsers: 7,
      attachmentOrEmbedCount: 1,
    },
    confidence: 0.82,
    expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
  }),
  evidence("ev-context", {
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
      ownerAuthored: true,
    },
    confidence: 0.96,
  }),
];

let result = generateCommunityRecommendations({
  now,
  evidenceRecords: baseEvidence,
  storageFilePath,
});

assert.equal(result.summary.generated, 5, "all five recommendation adapters should create records");
assert.equal(result.summary.retained, 5);
assert.deepEqual(
  result.generated.map((record) => record.type).sort(),
  [
    "investigate_automation_issue",
    "review_post_window_outcome",
    "review_conversation_opportunity",
    "review_channel_activity",
    "review_channel_context",
  ].sort(),
);

for (const recommendation of result.records) {
  assert.ok(recommendation.evidenceIds.length > 0, "recommendations must reference evidence");
  assert.ok(recommendation.evidenceIds.every((id) => baseEvidence.some((item) => item.id === id)), "evidence IDs must be valid");
  assert.ok(recommendation.confidence >= 0 && recommendation.confidence <= 1, "confidence should stay within bounds");
  assert.equal(recommendation.summary.includes("caused"), false, "recommendations should not claim causation");
}

const firstIds = result.records.map((record) => record.id);
result = generateCommunityRecommendations({
  now,
  evidenceRecords: baseEvidence,
  storageFilePath,
});
assert.deepEqual(result.records.map((record) => record.id), firstIds, "repeated generation should dedupe stable IDs");

const automationRecommendation = listCommunityRecommendations({ type: "investigate_automation_issue", status: "all" }, { storageFilePath })[0]!;
assert.equal(automationRecommendation.priority, "high");
assert.equal(automationRecommendation.suggestedAction, "investigate");

const seen = markCommunityRecommendationSeen(automationRecommendation.id, { storageFilePath, now: now + 1_000 });
assert.equal(seen?.status, "seen");
assert.ok(seen?.firstSeenAt);

const acknowledged = acknowledgeCommunityRecommendation(automationRecommendation.id, "Noted", { storageFilePath, now: now + 2_000 });
assert.equal(acknowledged?.status, "acknowledged");
assert.equal(acknowledged?.dispositionReason, "Noted");

result = generateCommunityRecommendations({
  now: now + 3_000,
  evidenceRecords: baseEvidence,
  storageFilePath,
});
assert.equal(getCommunityRecommendationById(automationRecommendation.id, { storageFilePath })?.status, "acknowledged", "acknowledged recommendation should not regenerate from identical evidence");

const outcomeRecommendation = listCommunityRecommendations({ type: "review_post_window_outcome", status: "all" }, { storageFilePath })[0]!;
const dismissed = dismissCommunityRecommendation(outcomeRecommendation.id, "Not useful", { storageFilePath, now: now + 4_000 });
assert.equal(dismissed?.status, "dismissed");

result = generateCommunityRecommendations({
  now: now + 5_000,
  evidenceRecords: baseEvidence,
  storageFilePath,
});
assert.equal(getCommunityRecommendationById(outcomeRecommendation.id, { storageFilePath })?.status, "dismissed", "dismissed recommendation should not regenerate from identical evidence");

const changedOutcomeEvidence = baseEvidence.map((item) =>
  item.id === "ev-outcome"
    ? {
        ...item,
        id: "ev-outcome-new",
        subjectId: "1480000000000000002",
        facts: {
          ...item.facts,
          humanMessages60m: 35,
        },
      }
    : item,
);
result = generateCommunityRecommendations({
  now: now + 6_000,
  evidenceRecords: changedOutcomeEvidence,
  storageFilePath,
});
assert.ok(
  result.records.some((record) => record.type === "review_post_window_outcome" && record.id !== outcomeRecommendation.id),
  "materially changed evidence should create a new recommendation",
);

const conversationRecommendation = listCommunityRecommendations({ type: "review_conversation_opportunity", status: "all" }, { storageFilePath })[0]!;
const postponedUntil = now + 2 * 24 * 60 * 60 * 1000;
const postponed = postponeCommunityRecommendation(conversationRecommendation.id, postponedUntil, "Later", {
  storageFilePath,
  now: now + 7_000,
});
assert.equal(postponed?.status, "postponed");
assert.equal(
  listCommunityRecommendations({ status: "active", now: now + 8_000 }, { storageFilePath }).some((record) => record.id === conversationRecommendation.id),
  false,
  "active lists should hide postponed recommendations until due",
);
assert.equal(
  listCommunityRecommendations({ status: "active", includePostponed: true, now: now + 8_000 }, { storageFilePath }).some((record) => record.id === conversationRecommendation.id),
  true,
);

const activityRecommendation = listCommunityRecommendations({ type: "review_channel_activity", status: "all" }, { storageFilePath })[0]!;
const acted = markCommunityRecommendationActed(activityRecommendation.id, "Reviewed manually", {
  storageFilePath,
  now: now + 9_000,
});
assert.equal(acted?.status, "acted");

const contextRecommendation = listCommunityRecommendations({ type: "review_channel_context", status: "all" }, { storageFilePath })[0]!;
const superseded = supersedeCommunityRecommendation(contextRecommendation.id, "Profile updated", {
  storageFilePath,
  now: now + 10_000,
});
assert.equal(superseded?.status, "superseded");

const expiringStorageFilePath = path.join(tempDir, "expiring-recommendations.json");
const expiringResult = generateCommunityRecommendations({
  now,
  evidenceRecords: [
    evidence("ev-conversation-expiring", {
      type: "conversation_decision",
      sourceSystem: "conversation_participation",
      channelId,
      subjectType: "conversation",
      subjectId: "decision-expiring",
      serverContext: "general",
      summary: "Conversation preview would have suggested speaking.",
      facts: {
        wouldHaveSpoken: true,
        suppressionActive: false,
        relevanceScore: 3,
      },
      confidence: 0.78,
      expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
    }),
  ],
  storageFilePath: expiringStorageFilePath,
});
const expiringRecommendation = expiringResult.records[0]!;
const expirationResult = expireCommunityRecommendations({
  storageFilePath: expiringStorageFilePath,
  now: Date.parse(expiringRecommendation.expiresAt!) + 1,
});
assert.equal(expirationResult.expiredCount, 1);
assert.equal(getCommunityRecommendationById(expiringRecommendation.id, { storageFilePath: expiringStorageFilePath })?.status, "expired");

const inactiveEvidenceResult = generateCommunityRecommendations({
  now,
  evidenceRecords: [
    {
      ...baseEvidence[0]!,
      id: "ev-expired",
      status: "expired",
    },
  ],
  storageFilePath: path.join(tempDir, "inactive-recommendations.json"),
});
assert.equal(inactiveEvidenceResult.summary.generated, 0, "expired evidence should not create recommendations");

const emptyStorageFilePath = path.join(tempDir, "empty-recommendations.json");
assert.equal(generateCommunityRecommendations({ now, evidenceRecords: [], storageFilePath: emptyStorageFilePath }).summary.generated, 0);
assert.deepEqual(findCommunityRecommendations({}, { storageFilePath: path.join(tempDir, "missing-recommendations.json") }), []);

const malformedStorageFilePath = path.join(tempDir, "malformed-recommendations.json");
fs.writeFileSync(
  malformedStorageFilePath,
  JSON.stringify({
    recommendations: [
      {
        id: "",
        type: "not-real",
        evidenceIds: [],
      },
    ],
  }),
);
assert.deepEqual(listCommunityRecommendations({ status: "all" }, { storageFilePath: malformedStorageFilePath }), [], "malformed stored recommendations should be ignored");

const oneTimeBlocked = generateCommunityRecommendations({
  now,
  evidenceRecords: [
    evidence("ev-one-time-blocked", {
      type: "automation_issue",
      sourceSystem: "automation_activity",
      channelId,
      subjectType: "automation",
      subjectId: "feed:blocked:cooldown:single",
      serverContext: "general",
      summary: "feed automation recorded 1 blocked event.",
      facts: {
        status: "blocked",
        reason: "cooldown",
        occurrenceCount: 1,
      },
      confidence: 0.84,
    }),
  ],
  storageFilePath: path.join(tempDir, "one-time-blocked.json"),
});
assert.equal(oneTimeBlocked.summary.generated, 0, "routine one-time blocked automation should not create noise");

const criticalFailure = generateCommunityRecommendations({
  now,
  evidenceRecords: [
    evidence("ev-critical-failure", {
      type: "automation_issue",
      sourceSystem: "automation_activity",
      channelId,
      subjectType: "automation",
      subjectId: "scheduler:failure:repeated",
      serverContext: "general",
      summary: "scheduler automation recorded 3 failure events.",
      facts: {
        status: "failure",
        reason: "SEND_FAILED",
        occurrenceCount: 3,
      },
      confidence: 0.9,
    }),
  ],
  storageFilePath: path.join(tempDir, "critical-failure.json"),
});
assert.equal(criticalFailure.records[0]?.priority, "critical", "repeated failures should be urgent");

assert.equal(fs.existsSync(path.join(process.cwd(), "data/community-recommendations.json")), false, "tests should not create production recommendation data");
