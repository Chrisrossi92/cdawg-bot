import assert from "node:assert/strict";
import {
  clearConversationParticipationForTests,
  evaluateConversationParticipation,
  handleConversationParticipationMessage,
  recordConversationParticipationMessage,
  recordConversationParticipationBotPost,
} from "../src/systems/conversation-participation.js";
import { updateBotSettingsInMemoryForTests } from "../src/systems/bot-settings.js";
import { setChannelProfilesInMemoryForTests } from "../src/systems/channel-profiles.js";
import type { ChannelProfile } from "../src/systems/channel-profiles.js";

const channelId = "1463686052509388894";
const otherChannelId = "1480395367546748938";
const baseNow = new Date("2026-07-10T12:00:00Z").getTime();

function configure(overrides = {}) {
  updateBotSettingsInMemoryForTests({
    globalAutomationEnabled: true,
    conversationParticipation: {
      enabled: true,
      previewMode: true,
      eligibleChannelIds: [channelId],
      channelModes: {},
      directMentionsEnabled: true,
      inlineRepliesEnabled: true,
      lullPromptsEnabled: true,
      lullTriviaEnabled: true,
      activeConversationWindowMs: 10 * 60 * 1000,
      minHumanMessages: 4,
      minDistinctHumans: 2,
      inlineReplyCooldownMs: 20 * 60 * 1000,
      lullPromptCooldownMs: 60 * 60 * 1000,
      lullTriviaCooldownMs: 3 * 60 * 60 * 1000,
      promptLullMs: 4 * 60 * 1000,
      triviaLullMs: 8 * 60 * 1000,
      deadChannelCutoffMs: 30 * 60 * 1000,
      dailyChannelCap: 3,
      dailyTriviaCap: 1,
      botRatioHumanMessages: 4,
      noResponseWindowMs: 15 * 60 * 1000,
      suppressionRecoveryHumanMessages: 3,
      relevanceThreshold: 2,
      ...overrides,
    },
  });
}

function reset(overrides = {}) {
  clearConversationParticipationForTests();
  setChannelProfilesInMemoryForTests([]);
  configure(overrides);
}

function human(offsetMs: number, authorId: string, content = "my palworld base has pals stuck and needs ore") {
  recordConversationParticipationMessage({
    channelId,
    channelName: "palworld-chat",
    authorId,
    isBot: false,
    content,
    timestamp: baseNow + offsetMs,
  });
}

function seedActiveConversation(startOffsetMs = -9 * 60 * 1000) {
  human(startOffsetMs, "user-a");
  human(startOffsetMs + 60 * 1000, "user-b");
  human(startOffsetMs + 2 * 60 * 1000, "user-a");
  human(startOffsetMs + 3 * 60 * 1000, "user-b");
}

reset();
seedActiveConversation(-6 * 60 * 1000);
let result = evaluateConversationParticipation(channelId, "lull-prompt", { now: baseNow });
assert.equal(result.state, "LULL_PENDING", "active conversation should enter lull pending before enough quiet time");
assert.equal(result.humanMessageCount, 4);
assert.equal(result.distinctHumanCount, 2);

reset();
human(-9 * 60 * 1000, "solo");
human(-8 * 60 * 1000, "solo");
human(-7 * 60 * 1000, "solo");
human(-6 * 60 * 1000, "solo");
result = evaluateConversationParticipation(channelId, "lull-prompt", { now: baseNow });
assert.equal(result.reason, "waiting for more people", "one human alone should not qualify");

reset();
seedActiveConversation(-45 * 60 * 1000);
result = evaluateConversationParticipation(channelId, "lull-prompt", { now: baseNow });
assert.equal(result.reason, "conversation is too old", "dead channels should not produce lull posts");

reset();
recordConversationParticipationBotPost(channelId, "lull-prompt", baseNow - 5 * 60 * 1000);
seedActiveConversation(-9 * 60 * 1000);
result = evaluateConversationParticipation(channelId, "lull-prompt", { now: baseNow });
assert.equal(result.state, "SUPPRESSED", "bot post cannot arm another bot post without human response after it");

reset({ activeConversationWindowMs: 60 * 60 * 1000 });
seedActiveConversation(-30 * 60 * 1000);
recordConversationParticipationBotPost(channelId, "lull-prompt", baseNow - 20 * 60 * 1000);
human(-10 * 60 * 1000, "user-a");
human(-9 * 60 * 1000, "user-b");
result = evaluateConversationParticipation(channelId, "lull-prompt", { now: baseNow });
assert.equal(result.reason, "suppressed because the last bot post received no response");

human(-2 * 60 * 1000, "user-a");
human(-90 * 1000, "user-b");
human(-60 * 1000, "user-c");
result = evaluateConversationParticipation(channelId, "lull-prompt", { now: baseNow + 3 * 60 * 1000 });
assert.notEqual(result.reason, "suppressed because the last bot post received no response", "three new human messages recover suppression");

reset();
seedActiveConversation();
recordConversationParticipationBotPost(channelId, "inline-reply", baseNow - 2 * 60 * 1000);
recordConversationParticipationBotPost(channelId, "inline-reply", baseNow - 60 * 1000);
human(-45 * 1000, "user-a");
human(-30 * 1000, "user-b");
human(-15 * 1000, "user-c");
result = evaluateConversationParticipation(channelId, "inline-reply", { now: baseNow, content: "palworld base is chaos" });
assert.equal(result.reason, "bot-to-human message ratio is too high");

reset({ dailyChannelCap: 1 });
seedActiveConversation(-12 * 60 * 1000);
recordConversationParticipationBotPost(channelId, "lull-prompt", baseNow - 5 * 60 * 1000);
human(-2 * 60 * 1000, "user-c");
human(-90 * 1000, "user-d");
human(-60 * 1000, "user-e");
human(-30 * 1000, "user-f");
result = evaluateConversationParticipation(channelId, "lull-prompt", { now: baseNow + 5 * 60 * 1000 });
assert.equal(result.reason, "daily channel cap reached");

reset();
seedActiveConversation();
result = evaluateConversationParticipation(channelId, "inline-reply", { now: baseNow, content: "palworld base is broken" });
assert.equal(result.decision, "would-send", "keyword relevance should produce inline preview eligibility");

reset();
seedActiveConversation();
result = evaluateConversationParticipation(channelId, "inline-reply", { now: baseNow, content: "just chatting about lunch plans" });
assert.equal(result.reason, "topic was unclear", "unclear topics should skip");

reset();
seedActiveConversation();
result = evaluateConversationParticipation(channelId, "inline-reply", { now: baseNow, content: "mods need to ban this drama" });
assert.equal(result.reason, "context appears sensitive or moderation-related");

reset();
seedActiveConversation(-8 * 60 * 1000);
result = evaluateConversationParticipation(channelId, "lull-prompt", { now: baseNow });
assert.equal(result.decision, "would-send", "prompt lull should become eligible after configured quiet time");

reset({ activeConversationWindowMs: 20 * 60 * 1000 });
seedActiveConversation(-6 * 60 * 1000);
result = evaluateConversationParticipation(channelId, "lull-trivia", { now: baseNow });
assert.equal(result.state, "LULL_PENDING", "lull trivia should require the stronger trivia lull");

result = evaluateConversationParticipation(channelId, "lull-trivia", { now: baseNow + 6 * 60 * 1000 });
assert.equal(result.decision, "would-send", "lull trivia should be eligible after stronger lull with relevant topic");

reset();
const directMentionResult = handleConversationParticipationMessage({
  channelId,
  channelName: "palworld-chat",
  authorId: "user-a",
  isBot: false,
  content: "hey cdawg what can you do?",
  timestamp: baseNow,
  isDirectMention: true,
});
assert.equal(directMentionResult?.mode, "direct-mention");
assert.equal(directMentionResult?.decision, "would-send");

reset({ eligibleChannelIds: [] });
const profile: ChannelProfile = {
  channelId: otherChannelId,
  channelName: "private-admin",
  purpose: "gaming",
  audience: "admins",
  accessMode: "private",
  tone: "friendly",
  preferredContentTypes: ["prompt"],
  topicOverride: "palworld",
  suggestedRoleId: null,
  signupPanelId: null,
  followupId: null,
  notes: null,
  createdAt: baseNow,
  updatedAt: baseNow,
};
setChannelProfilesInMemoryForTests([profile]);
result = evaluateConversationParticipation(otherChannelId, "inline-reply", {
  now: baseNow,
  content: "palworld base is broken",
});
assert.equal(result.reason, "channel is not allowed for conversational participation");

configure({ eligibleChannelIds: [], channelModes: { [otherChannelId]: "preview-only" } });
result = evaluateConversationParticipation(otherChannelId, "inline-reply", {
  now: baseNow,
  content: "palworld base is broken",
});
assert.notEqual(result.reason, "channel profile requires explicit opt-in", "explicit preview-only channel mode should opt into private profile evaluation");

clearConversationParticipationForTests();
