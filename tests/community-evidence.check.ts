import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  expireCommunityEvidence,
  generateCommunityEvidence,
  getCommunityEvidenceById,
  listCommunityEvidence,
  type CommunityEvidenceSources,
} from "../src/systems/community-evidence.js";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdawg-community-evidence-"));
const storageFilePath = path.join(tempDir, "community-evidence.json");
const now = new Date("2026-07-12T12:00:00.000Z").getTime();
const channelId = "1463686052509388894";

const sources: CommunityEvidenceSources = {
  engagementSummary: {
    generatedAt: now,
    windows: {
      last1h: [],
      last24h: [
        {
          channelId,
          channelName: "palworld-chat",
          messageCount: 42,
          approxActiveUsers: 7,
          botMessageCount: 4,
          attachmentOrEmbedCount: 3,
          lastActivityAt: now - 60_000,
        },
      ],
      last7d: [],
    },
  },
  contentOutcomes: [
    {
      postedAt: now - 60 * 60 * 1000,
      channelId,
      channelName: "palworld-chat",
      source: "composer",
      contentType: "message",
      messageId: "1480000000000000001",
      label: "Composer message",
      activity: {
        messages15m: 6,
        messages60m: 22,
        approxActiveUsers60m: 5,
        botMessages60m: 2,
        humanMessages60m: 20,
        outcomeLabel: "sparked",
      },
    },
  ],
  automationActivity: [
    {
      id: "auto-1",
      timestamp: now - 30 * 60 * 1000,
      source: "feed",
      status: "blocked",
      channelId,
      channelName: "palworld-chat",
      contentType: "prompt",
      blockedReason: "cooldown",
      message: "Managed feed was blocked by cooldown.",
    },
    {
      id: "auto-2",
      timestamp: now - 20 * 60 * 1000,
      source: "feed",
      status: "blocked",
      channelId,
      channelName: "palworld-chat",
      contentType: "prompt",
      blockedReason: "cooldown",
      message: "Managed feed was blocked by cooldown.",
    },
    {
      id: "auto-success",
      timestamp: now - 10 * 60 * 1000,
      source: "feed",
      status: "success",
      channelId,
      channelName: "palworld-chat",
      contentType: "prompt",
      message: "Routine success should not become issue evidence.",
    },
  ],
  channelProfiles: [
    {
      channelId,
      channelName: "palworld-chat",
      purpose: "gaming",
      audience: "members",
      accessMode: "everyone",
      tone: "friendly",
      preferredContentTypes: ["prompt", "trivia"],
      topicOverride: "palworld",
      suggestedRoleId: null,
      signupPanelId: null,
      followupId: null,
      notes: "Fantasy launch community context.",
      createdAt: now - 5 * 24 * 60 * 60 * 1000,
      updatedAt: now - 2 * 60 * 60 * 1000,
    },
  ],
  conversationDecisions: [
    {
      id: "decision-1",
      timestamp: now - 5 * 60 * 1000,
      channelId,
      channelName: "palworld-chat",
      mode: "inline-reply",
      state: "ELIGIBLE_INLINE_REPLY",
      decision: "would-send",
      reason: "relevant inline reply would fit in preview mode",
      humanMessageCount: 5,
      distinctHumanCount: 3,
      relevanceScore: 3,
      matchedTopics: ["signal:palworld"],
      botHumanRatio: 0,
      cooldownActive: false,
      capReached: false,
      suppressionActive: false,
      proposedContentType: "fact",
      previewOnly: true,
    },
  ],
};

let result = generateCommunityEvidence({
  now,
  sources,
  storageFilePath,
});

assert.equal(result.summary.generated, 5, "all five source adapters should create evidence");
assert.equal(result.summary.retained, 5);
assert.deepEqual(
  result.generated.map((record) => record.type).sort(),
  [
    "automation_issue",
    "channel_activity_window",
    "channel_context",
    "conversation_decision",
    "post_window_outcome",
  ].sort(),
);

const firstIds = result.records.map((record) => record.id);
result = generateCommunityEvidence({
  now,
  sources,
  storageFilePath,
});
assert.deepEqual(result.records.map((record) => record.id), firstIds, "repeated generation should dedupe stable evidence IDs");
assert.equal(result.summary.retained, 5);

const activityEvidence = listCommunityEvidence({ type: "channel_activity_window" }, { storageFilePath })[0];
assert.ok(activityEvidence, "activity evidence should be queryable");
assert.equal(activityEvidence.facts.humanMessageCount, 38);
assert.equal(activityEvidence.sourceRecordIds.length, 1);
assert.equal(activityEvidence.provenance.sourceSystem, "engagement_activity");
assert.equal(activityEvidence.summary.includes("healthy"), false, "activity summary must not overclaim health");

const outcomeEvidence = listCommunityEvidence({ type: "post_window_outcome" }, { storageFilePath })[0];
assert.ok(outcomeEvidence);
assert.equal(outcomeEvidence.facts.measurementType, "post_window_channel_activity");
assert.equal(outcomeEvidence.summary.includes("caused"), false, "outcome summary must not claim causation");

const automationEvidence = listCommunityEvidence({ type: "automation_issue" }, { storageFilePath })[0];
assert.ok(automationEvidence);
assert.deepEqual(automationEvidence.sourceRecordIds, ["auto-2", "auto-success"]);
assert.equal(automationEvidence.facts.occurrenceCount, 2);
assert.equal(automationEvidence.facts.issueClass, "recovered");

const channelContextEvidence = listCommunityEvidence({ type: "channel_context" }, { storageFilePath })[0];
assert.ok(channelContextEvidence);
assert.equal(channelContextEvidence.facts.ownerAuthored, true);
assert.equal(channelContextEvidence.serverContext, "fantasy");

const conversationEvidence = listCommunityEvidence({ type: "conversation_decision" }, { storageFilePath })[0];
assert.ok(conversationEvidence);
assert.equal(conversationEvidence.facts.wouldHaveSpoken, true);
assert.equal(conversationEvidence.facts.previewOnly, true);

for (const record of result.records) {
  assert.ok(record.confidence >= 0 && record.confidence <= 1, "confidence should stay within bounds");
  assert.ok(record.provenance.derivedBy.startsWith("community-evidence:"), "provenance should identify the adapter");
}

const fetched = getCommunityEvidenceById(activityEvidence.id, { storageFilePath });
assert.equal(fetched?.id, activityEvidence.id);

const expired = expireCommunityEvidence(activityEvidence.id, {
  storageFilePath,
  expiredAt: now + 60_000,
});
assert.equal(expired?.status, "expired");
assert.equal(listCommunityEvidence({ status: "active" }, { storageFilePath }).some((record) => record.id === activityEvidence.id), false);
assert.equal(listCommunityEvidence({ status: "all" }, { storageFilePath }).some((record) => record.id === activityEvidence.id), true);

const emptyStorageFilePath = path.join(tempDir, "empty-community-evidence.json");
const emptyResult = generateCommunityEvidence({
  now,
  storageFilePath: emptyStorageFilePath,
  sources: {
    engagementSummary: {
      generatedAt: now,
      windows: {
        last1h: [],
        last24h: [],
        last7d: [],
      },
    },
    contentOutcomes: [],
    automationActivity: [],
    channelProfiles: [],
    conversationDecisions: [],
  },
});
assert.equal(emptyResult.summary.generated, 0, "empty source stores should be safe");
assert.deepEqual(listCommunityEvidence({}, { storageFilePath: path.join(tempDir, "missing.json") }), [], "missing evidence store should be safe");

const malformedStorageFilePath = path.join(tempDir, "malformed-community-evidence.json");
fs.writeFileSync(
  malformedStorageFilePath,
  JSON.stringify({
    records: [
      {
        id: "",
        type: "not-real",
        confidence: 7,
      },
    ],
  }),
);
assert.deepEqual(listCommunityEvidence({ status: "all" }, { storageFilePath: malformedStorageFilePath }), [], "malformed evidence records should be ignored");
