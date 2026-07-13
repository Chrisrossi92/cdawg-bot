import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { generateCommunityDailyBrief } from "../src/systems/community-daily-brief.js";
import type { CommunityEvidenceRecord } from "../src/systems/community-evidence.js";
import {
  generateCommunityRecommendations,
  listCommunityRecommendations,
  postponeCommunityRecommendation,
  type CommunityRecommendationRecord,
} from "../src/systems/community-recommendations.js";
import { resolveCommunityServerContext } from "../src/systems/community-server-context.js";
import { summarizeEngagementRecords } from "../src/systems/engagement-activity.js";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdawg-community-phase-1e-"));
const now = Date.parse("2026-07-13T12:00:00.000Z");
const day = 24 * 60 * 60 * 1000;

function evidence(id: string, patch: Partial<CommunityEvidenceRecord> & Pick<CommunityEvidenceRecord, "type" | "sourceSystem" | "subjectType" | "summary" | "facts">): CommunityEvidenceRecord {
  const createdAt = new Date(now - 60_000).toISOString();
  return {
    id,
    schemaVersion: 1,
    sourceRecordIds: [`source:${id}`],
    confidence: 0.85,
    createdAt,
    observedAt: createdAt,
    status: "active",
    provenance: { sourceSystem: patch.sourceSystem, sourceRecordIds: [`source:${id}`], derivedBy: "phase-1e-test", derivedAt: createdAt },
    expiresAt: new Date(now + day).toISOString(),
    ...patch,
  };
}

function recommendation(id: string, evidenceId: string, patch: Partial<CommunityRecommendationRecord>): CommunityRecommendationRecord {
  const createdAt = new Date(now - 30_000).toISOString();
  return {
    id,
    schemaVersion: 1,
    type: "review_channel_activity",
    evidenceIds: [evidenceId],
    subjectType: "channel",
    title: "Review notable channel activity",
    summary: "Activity was recorded.",
    reason: "This is a deterministic activity signal.",
    suggestedAction: "review",
    priority: "low",
    confidence: 0.8,
    status: "new",
    createdAt,
    updatedAt: createdAt,
    expiresAt: new Date(now + day).toISOString(),
    provenance: { derivedBy: "phase-1e-test", derivedAt: createdAt, evidenceIds: [evidenceId] },
    ...patch,
  };
}

// Trusted context mapping: configured IDs and explicit metadata win; weak text does not.
assert.deepEqual(resolveCommunityServerContext({ channelId: "1463686052509388894", channelName: "renamed" }).context, "fantasy");
assert.deepEqual(resolveCommunityServerContext({ channelId: "1524582546875224094", channelName: "renamed" }).context, "primal");
assert.deepEqual(resolveCommunityServerContext({ channelId: "1468627019742052474" }).context, "general");
assert.deepEqual(resolveCommunityServerContext({ channelId: "999", channelName: "ordinary-chat" }).context, "unknown");
assert.deepEqual(resolveCommunityServerContext({ channelId: "1489073492514181301", channelName: "fantasy-alerts" }).context, "general");
assert.deepEqual(resolveCommunityServerContext({ channelId: "999", channelName: "fantasy-fans" }).context, "unknown");
assert.deepEqual(resolveCommunityServerContext({
  channelId: "profile-channel",
  profile: { notes: "community-context:primal", suggestedRoleId: null, accessMode: "everyone" },
}).source, "channel_profile");

const attachmentSummary = summarizeEngagementRecords([
  { timestamp: now, guildId: "guild", channelId: "media", channelName: "media", authorHash: "bot", isBot: true, messageLengthBucket: "short", hasAttachments: true, hasEmbeds: false },
  { timestamp: now, guildId: "guild", channelId: "media", channelName: "media", authorHash: "human-a", isBot: false, messageLengthBucket: "short", hasAttachments: true, hasEmbeds: false },
  { timestamp: now, guildId: "guild", channelId: "media", channelName: "media", authorHash: "human-b", isBot: false, messageLengthBucket: "short", hasAttachments: false, hasEmbeds: true },
], now - 1_000)[0]!;
assert.equal(attachmentSummary.attachmentOrEmbedCount, 3);
assert.equal(attachmentSummary.humanAttachmentOrEmbedCount, 2);
assert.equal(attachmentSummary.humanAttachmentParticipantCount, 2);

const fantasyActivity = evidence("activity-fantasy-new", {
  type: "channel_activity_window",
  sourceSystem: "engagement_activity",
  channelId: "1463686052509388894",
  subjectType: "channel",
  subjectId: "1463686052509388894",
  serverContext: "fantasy",
  summary: "Ten participants sent 40 human messages in Fantasy.",
  facts: { windowKey: "last24h", activityClassification: "active", humanMessageCount: 40, approxActiveUsers: 10, humanAttachmentOrEmbedCount: 0 },
  createdAt: new Date(now - 10_000).toISOString(),
});
const fantasyEquivalent = { ...fantasyActivity, id: "activity-fantasy-old", createdAt: new Date(now - 20_000).toISOString(), facts: { ...fantasyActivity.facts, humanMessageCount: 39 } };
const primalActivity = evidence("activity-primal", {
  ...fantasyActivity,
  channelId: "1524582546875224094",
  subjectId: "1524582546875224094",
  serverContext: "primal",
  summary: "Four participants sent 20 human messages in Primal.",
  facts: { ...fantasyActivity.facts, humanMessageCount: 20, approxActiveUsers: 4 },
});
const pulseBrief = generateCommunityDailyBrief({
  now,
  periodStart: now - day,
  periodEnd: now,
  evidenceRecords: [fantasyEquivalent, fantasyActivity, primalActivity],
  recommendationRecords: [],
  persistBrief: false,
});
assert.equal(pulseBrief.sections.communityPulse.length, 2, "equivalent rolling windows should consolidate while Fantasy and Primal remain separate");
assert.equal(pulseBrief.sections.communityPulse.filter((item) => item.serverContext === "fantasy").length, 1);
assert.equal(pulseBrief.sections.communityPulse.some((item) => item.evidenceIds.includes(fantasyActivity.id)), true, "newest equivalent activity should win");
assert.deepEqual(generateCommunityDailyBrief({ now, periodStart: now - day, periodEnd: now, evidenceRecords: [fantasyEquivalent, fantasyActivity], recommendationRecords: [], persistBrief: false }).sections.communityPulse.map((item) => item.id),
  generateCommunityDailyBrief({ now, periodStart: now - day, periodEnd: now, evidenceRecords: [fantasyEquivalent, fantasyActivity], recommendationRecords: [], persistBrief: false }).sections.communityPulse.map((item) => item.id));

function activityEvidence(id: string, channelId: string, facts: Record<string, string | number | boolean | null>) {
  return evidence(id, {
    type: "channel_activity_window",
    sourceSystem: "engagement_activity",
    channelId,
    subjectType: "channel",
    subjectId: channelId,
    serverContext: "general",
    summary: "Attachment activity was recorded.",
    facts: { windowKey: "last24h", activityClassification: "quiet", humanMessageCount: 5, approxActiveUsers: 3, ...facts },
  });
}

const suppressedBot = generateCommunityRecommendations({ now, evidenceRecords: [activityEvidence("bot-media", "bot", { communityReviewEligible: false, channelKind: "bot_output", humanAttachmentOrEmbedCount: 30, humanAttachmentParticipantCount: 5 })], storageFilePath: path.join(tempDir, "bot.json") });
assert.equal(suppressedBot.generated.length, 0);
const suppressedAlert = generateCommunityRecommendations({ now, evidenceRecords: [activityEvidence("alert-media", "alerts", { communityReviewEligible: false, channelKind: "alerts", humanAttachmentOrEmbedCount: 30, humanAttachmentParticipantCount: 5 })], storageFilePath: path.join(tempDir, "alerts.json") });
assert.equal(suppressedAlert.generated.length, 0);
const suppressedSingle = generateCommunityRecommendations({ now, evidenceRecords: [activityEvidence("single-media", "community", { communityReviewEligible: true, channelKind: "community", humanAttachmentOrEmbedCount: 1, humanAttachmentParticipantCount: 1 })], storageFilePath: path.join(tempDir, "single.json") });
assert.equal(suppressedSingle.generated.length, 0);
const eligibleMedia = activityEvidence("eligible-media", "community", { communityReviewEligible: true, channelKind: "community", humanAttachmentOrEmbedCount: 5, humanAttachmentParticipantCount: 3 });
const eligibleResult = generateCommunityRecommendations({ now, evidenceRecords: [eligibleMedia], storageFilePath: path.join(tempDir, "eligible.json") });
assert.equal(eligibleResult.generated.length, 1);
assert.match(eligibleResult.generated[0]!.reason, /5 human-authored.*3 participants/i);
const equivalentMedia = { ...eligibleMedia, id: "eligible-media-new", facts: { ...eligibleMedia.facts, humanAttachmentOrEmbedCount: 6 } };
const mediaStore = path.join(tempDir, "media-dedupe.json");
generateCommunityRecommendations({ now, evidenceRecords: [eligibleMedia], storageFilePath: mediaStore });
generateCommunityRecommendations({ now: now + 1_000, evidenceRecords: [equivalentMedia], storageFilePath: mediaStore });
assert.equal(listCommunityRecommendations({ status: "active", now: now + 1_000 }, { storageFilePath: mediaStore }).length, 1);
assert.equal(listCommunityRecommendations({ status: "all" }, { storageFilePath: mediaStore }).some((item) => item.status === "superseded"), true);

function automationEvidence(id: string, issueClass: string, occurrenceCount: number, reason: string) {
  return evidence(id, {
    type: "automation_issue",
    sourceSystem: "automation_activity",
    channelId: "automation-channel",
    subjectType: "automation",
    subjectId: `scheduler:automation-channel:history:${issueClass}`,
    serverContext: "general",
    summary: "Automation state was recorded.",
    facts: { automationKey: "scheduler:automation-channel:history", status: issueClass === "recovered" ? "success" : "failure", issueClass, occurrenceCount, reason },
  });
}

for (const issueClass of ["intentional_block", "expected_skip", "recovered"]) {
  const result = generateCommunityRecommendations({ now, evidenceRecords: [automationEvidence(`auto-${issueClass}`, issueClass, 5, issueClass)], storageFilePath: path.join(tempDir, `${issueClass}.json`) });
  assert.equal(result.generated.length, 0, `${issueClass} should not create an active owner recommendation`);
}
assert.equal(generateCommunityRecommendations({ now, evidenceRecords: [automationEvidence("content-once", "temporary_unavailable", 1, "CONTENT_UNAVAILABLE")], storageFilePath: path.join(tempDir, "content-once.json") }).generated.length, 0);
assert.equal(generateCommunityRecommendations({ now, evidenceRecords: [automationEvidence("content-repeat", "temporary_unavailable", 3, "CONTENT_UNAVAILABLE")], storageFilePath: path.join(tempDir, "content-repeat.json") }).generated[0]?.priority, "medium");
assert.equal(generateCommunityRecommendations({ now, evidenceRecords: [automationEvidence("failure-repeat", "failure", 3, "SEND_FAILED")], storageFilePath: path.join(tempDir, "failure-repeat.json") }).generated[0]?.priority, "high");
assert.equal(generateCommunityRecommendations({ now, evidenceRecords: [automationEvidence("failure-severe", "failure", 3, "AUTH_PERMISSION_FAILURE")], storageFilePath: path.join(tempDir, "failure-severe.json") }).generated[0]?.priority, "critical");

const recoveryStore = path.join(tempDir, "recovery.json");
const unresolved = automationEvidence("unresolved", "failure", 2, "SEND_FAILED");
generateCommunityRecommendations({ now, evidenceRecords: [unresolved], storageFilePath: recoveryStore });
generateCommunityRecommendations({ now: now + 1_000, evidenceRecords: [automationEvidence("recovered", "recovered", 2, "successful execution")], storageFilePath: recoveryStore });
assert.equal(listCommunityRecommendations({ status: "active", now: now + 1_000 }, { storageFilePath: recoveryStore }).length, 0);
assert.equal(listCommunityRecommendations({ status: "all" }, { storageFilePath: recoveryStore }).some((item) => item.status === "superseded"), true);

const lifecycleStore = path.join(tempDir, "lifecycle.json");
generateCommunityRecommendations({ now, evidenceRecords: [eligibleMedia], storageFilePath: lifecycleStore });
const lifecycleRecord = listCommunityRecommendations({ status: "all" }, { storageFilePath: lifecycleStore })[0]!;
postponeCommunityRecommendation(lifecycleRecord.id, now + day, "Review tomorrow", { storageFilePath: lifecycleStore, now: now + 1_000 });
generateCommunityRecommendations({ now: now + 2_000, evidenceRecords: [eligibleMedia], storageFilePath: lifecycleStore });
assert.equal(listCommunityRecommendations({ status: "all" }, { storageFilePath: lifecycleStore })[0]?.status, "postponed");

const strongEvidence = automationEvidence("strong", "failure", 3, "SEND_FAILED");
const strongRecommendation = recommendation("strong-rec", strongEvidence.id, {
  type: "investigate_automation_issue",
  subjectType: "automation",
  subjectId: "scheduler:strong",
  title: "Investigate automation failure",
  suggestedAction: "investigate",
  priority: "high",
});
const genericRecommendation = recommendation("generic-rec", fantasyActivity.id, { channelId: "1463686052509388894", subjectId: "1463686052509388894" });
const selectionBrief = generateCommunityDailyBrief({ now, periodStart: now - day, periodEnd: now, evidenceRecords: [strongEvidence, fantasyActivity], recommendationRecords: [genericRecommendation, strongRecommendation], persistBrief: false });
assert.equal(selectionBrief.sections.recommendedNextStep[0]?.recommendationId, strongRecommendation.id);
const noNextStep = generateCommunityDailyBrief({ now, periodStart: now - day, periodEnd: now, evidenceRecords: [fantasyActivity], recommendationRecords: [genericRecommendation], persistBrief: false });
assert.equal(noNextStep.sections.recommendedNextStep.length, 0);
assert.equal(noNextStep.sections.needsAttention.length, 0);
assert.equal(generateCommunityDailyBrief({ now, periodStart: now - day, periodEnd: now, evidenceRecords: [], recommendationRecords: [], persistBrief: false }).status, "calm");

assert.equal(fs.existsSync(path.join(process.cwd(), "data/community-evidence.json")), false);
assert.equal(fs.existsSync(path.join(process.cwd(), "data/community-recommendations.json")), false);
assert.equal(fs.existsSync(path.join(process.cwd(), "data/community-daily-briefs.json")), false);
