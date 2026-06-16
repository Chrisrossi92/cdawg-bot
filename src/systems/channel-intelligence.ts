import { channelTopics } from "../config/channel-topics.js";
import { getRecentAutomationActivity } from "./automation-activity.js";
import {
  getChannelAutomationStatus,
  getChannelAutomationStatuses,
  type ChannelAutomationStatus,
} from "./channel-automation-status.js";
import { getDailyTriviaChallengeConfig } from "./daily-trivia-challenge.js";
import { getFeedConfigs, type FeedConfig } from "./feed-configs.js";
import { listChannelProfiles, type ChannelProfile } from "./channel-profiles.js";
import { getFollowups, type RoleFollowup } from "./role-followups.js";
import { listPanels, type RoleAccessPanel } from "./role-access-panels.js";
import { getChannelEngagementSnapshot, type EngagementLabel } from "./engagement-activity.js";

export type ChannelIntelligenceMetadataChannel = {
  id: string;
  name: string;
  type: string;
  parentId?: string | null;
};

export type ChannelHealthLabel = "healthy" | "needs setup" | "attention" | "inactive" | "unknown";
export type ChannelIntelligenceActionPriority = "high" | "medium" | "low";
export type ChannelIntelligenceActionTarget =
  | "profile"
  | "topic"
  | "automation"
  | "feeds"
  | "daily-trivia"
  | "role-workflows"
  | "activity"
  | "manual-content"
  | "composer"
  | "none";

export type ChannelIntelligenceRecommendedAction = {
  id: string;
  label: string;
  targetDashboardSection: ChannelIntelligenceActionTarget;
  priority: ChannelIntelligenceActionPriority;
  reason: string;
};

export type ChannelIntelligenceSummary = {
  channelId: string;
  channelName: string;
  channelType: string;
  parentId: string | null;
  profile: {
    status: "saved" | "missing";
    purpose: ChannelProfile["purpose"] | null;
    tone: ChannelProfile["tone"] | null;
    preferredContentTypes: ChannelProfile["preferredContentTypes"];
  };
  topic: {
    status: "mapped" | "profile override" | "missing";
    topic: string | null;
  };
  automation: {
    status: ChannelAutomationStatus["operationalStatus"];
    mode: ChannelAutomationStatus["automationMode"];
    blockedReason: ChannelAutomationStatus["blockedReason"];
    nextEligibleSendAt: number | null;
    lastAutomatedSendAt: number | null;
  };
  feeds: {
    total: number;
    enabled: number;
    disabled: number;
    contentTypes: string[];
  };
  dailyTrivia: {
    relevant: boolean;
    enabled: boolean;
    role: "target" | "none";
  };
  roleWorkflows: {
    panels: number;
    followups: number;
    relevantRoleIds: string[];
  };
  recentActivity: {
    count: number;
    blockedOrFailureCount: number;
    since: number;
  };
  engagement: {
    last24hMessages: number;
    last7dMessages: number;
    approxActiveUsers24h: number;
    lastActivityAt: number | null;
    engagementLabel: EngagementLabel;
  };
  recommendedNextAction: {
    label: string;
    reason: string;
    target: ChannelIntelligenceActionTarget;
  };
  healthReasons: string[];
  detectedGaps: string[];
  configuredFeatures: string[];
  recommendedActions: ChannelIntelligenceRecommendedAction[];
  manageable: boolean;
  managementLimitations: string[];
  healthLabel: ChannelHealthLabel;
  trust: {
    confidence: "high" | "medium" | "low";
    freshness: string;
    sources: string[];
  };
};

export type ChannelIntelligenceResponse = {
  generatedAt: number;
  activityWindowMs: number;
  channels: ChannelIntelligenceSummary[];
  summary: Record<ChannelHealthLabel, number>;
  sources: string[];
  metadataAvailable: boolean;
};

const activityWindowMs = 7 * 24 * 60 * 60 * 1000;
const sourceLabels = [
  "guild metadata",
  "channel profiles",
  "channel topics",
  "channel automation status",
  "feed configs",
  "daily trivia config",
  "role panels",
  "role followups",
  "automation activity",
];

function getProfileForChannel(channelId: string, profiles: readonly ChannelProfile[]) {
  return profiles.find((profile) => profile.channelId === channelId) ?? null;
}

function getFeedsForChannel(channelId: string, feeds: readonly FeedConfig[]) {
  return feeds.filter((feed) => feed.channelId === channelId);
}

function getRelevantRoleIds(profile: ChannelProfile | null, panels: readonly RoleAccessPanel[], followups: readonly RoleFollowup[]) {
  return [
    ...new Set([
      ...(profile?.suggestedRoleId ? [profile.suggestedRoleId] : []),
      ...panels.map((panel) => panel.roleId).filter(Boolean),
      ...followups.map((followup) => followup.roleId).filter(Boolean),
    ]),
  ];
}

function getRolePanelsForChannel(channelId: string, profile: ChannelProfile | null, panels: readonly RoleAccessPanel[]) {
  return panels.filter(
    (panel) =>
      panel.targetChannelId === channelId ||
      Boolean(profile?.suggestedRoleId && panel.roleId === profile.suggestedRoleId),
  );
}

function getRoleFollowupsForChannel(channelId: string, profile: ChannelProfile | null, followups: readonly RoleFollowup[]) {
  return followups.filter(
    (followup) =>
      followup.channelId === channelId ||
      Boolean(profile?.suggestedRoleId && followup.roleId === profile.suggestedRoleId),
  );
}

function getRecentActivityForChannel(channelId: string, since: number) {
  return getRecentAutomationActivity(400).filter(
    (item) => item.channelId === channelId && item.timestamp >= since,
  );
}

function getTopicSummary(channelId: string, profile: ChannelProfile | null) {
  const mappedTopic = channelTopics[channelId];

  if (mappedTopic) {
    return {
      status: "mapped" as const,
      topic: mappedTopic,
    };
  }

  if (profile?.topicOverride) {
    return {
      status: "profile override" as const,
      topic: profile.topicOverride,
    };
  }

  return {
    status: "missing" as const,
    topic: null,
  };
}

function getRecommendedNextAction(input: {
  profile: ChannelProfile | null;
  topicStatus: ReturnType<typeof getTopicSummary>["status"];
  automation: ChannelAutomationStatus;
  feeds: readonly FeedConfig[];
  dailyTriviaRelevant: boolean;
  rolePanelCount: number;
  roleFollowupCount: number;
  recentProblemCount: number;
}): Pick<ChannelIntelligenceRecommendedAction, "label" | "reason"> & { target: ChannelIntelligenceActionTarget } {
  if (input.recentProblemCount > 0) {
    return {
      label: "Review recent automation problems",
      reason: `${input.recentProblemCount} recent blocked or failed automation event${input.recentProblemCount === 1 ? "" : "s"} were recorded for this channel.`,
      target: "activity" as const,
    };
  }

  if (input.automation.blockedReason) {
    return {
      label: "Review channel automation",
      reason: `Automation is currently blocked by ${input.automation.blockedReason}.`,
      target: "automation" as const,
    };
  }

  if (!input.profile) {
    return {
      label: "Set up a channel profile",
      reason: "CDawg does not have saved purpose, audience, tone, or content preferences for this channel.",
      target: "profile" as const,
    };
  }

  if (input.topicStatus === "missing") {
    return {
      label: "Choose a topic mapping",
      reason: "This channel has no topic mapping or profile topic override for topic-aware content.",
      target: "topic" as const,
    };
  }

  const enabledFeeds = input.feeds.filter((feed) => feed.enabled);
  if (enabledFeeds.length === 0 && !input.dailyTriviaRelevant && input.automation.automationMode === "none") {
    return {
      label: "Add a scheduled content plan",
      reason: "No enabled feed, daily trivia target, or automation mode is currently configured.",
      target: "feeds" as const,
    };
  }

  if ((input.profile.accessMode === "opt-in" || input.profile.accessMode === "private") && input.rolePanelCount === 0) {
    return {
      label: "Add or connect a role signup button",
      reason: "This profile uses restricted or opt-in access but no relevant role panel was found.",
      target: "role-workflows" as const,
    };
  }

  if ((input.profile.accessMode === "opt-in" || input.profile.accessMode === "private") && input.roleFollowupCount === 0) {
    return {
      label: "Add a role follow-up message",
      reason: "This profile uses restricted or opt-in access but no relevant role follow-up was found.",
      target: "role-workflows" as const,
    };
  }

  return {
    label: "No immediate action needed",
    reason: "Existing configuration has no operational readiness issue from the available data.",
    target: "none" as const,
  };
}

function getHealthReasons(input: {
  healthLabel: ChannelHealthLabel;
  profile: ChannelProfile | null;
  topicStatus: ReturnType<typeof getTopicSummary>["status"];
  automation: ChannelAutomationStatus;
  enabledFeedCount: number;
  dailyTriviaRelevant: boolean;
  recentActivityCount: number;
  recentProblemCount: number;
}) {
  if (input.healthLabel === "attention") {
    const reasons = [];

    if (input.recentProblemCount > 0) {
      reasons.push(`${input.recentProblemCount} recent blocked or failed automation event${input.recentProblemCount === 1 ? "" : "s"} were found.`);
    }

    if (input.automation.blockedReason) {
      reasons.push(`Automation is currently blocked by ${input.automation.blockedReason}.`);
    }

    return reasons.length > 0 ? reasons : ["A current operational issue needs review."];
  }

  if (input.healthLabel === "needs setup") {
    const reasons = [];

    if (!input.profile) {
      reasons.push("No saved channel profile exists yet, so CDawg does not know the channel purpose, tone, or preferred content.");
    }

    if (input.topicStatus === "missing") {
      reasons.push("The channel has no topic mapping or profile topic override.");
    }

    return reasons;
  }

  if (input.healthLabel === "inactive") {
    return ["No enabled feed, daily trivia target, automation mode, or recent automation activity was found from the available operational data."];
  }

  if (input.healthLabel === "healthy") {
    return ["Existing setup has no operational readiness issue from the current data sources."];
  }

  return ["CDawg does not have enough metadata to make a confident readiness call for this channel."];
}

function getDetectedGaps(input: {
  profile: ChannelProfile | null;
  topicStatus: ReturnType<typeof getTopicSummary>["status"];
  automation: ChannelAutomationStatus;
  enabledFeedCount: number;
  dailyTriviaRelevant: boolean;
  relevantRoleIds: readonly string[];
  rolePanelCount: number;
  roleFollowupCount: number;
  recentProblemCount: number;
}) {
  const gaps: string[] = [];

  if (!input.profile) {
    gaps.push("Missing saved channel profile.");
  }

  if (input.topicStatus === "missing") {
    gaps.push("Missing topic mapping or profile topic override.");
  }

  if (input.automation.blockedReason) {
    gaps.push(`Automation blocked by ${input.automation.blockedReason}.`);
  }

  if (input.enabledFeedCount === 0 && !input.dailyTriviaRelevant && input.automation.automationMode === "none") {
    gaps.push("No active content automation found.");
  }

  if (input.profile && input.relevantRoleIds.length > 0 && input.rolePanelCount === 0) {
    gaps.push("Relevant role exists but no matching role signup panel was found.");
  }

  if (input.profile && input.relevantRoleIds.length > 0 && input.roleFollowupCount === 0) {
    gaps.push("Relevant role exists but no matching role follow-up message was found.");
  }

  if (input.recentProblemCount > 0) {
    gaps.push("Recent automation problems need review.");
  }

  return gaps;
}

function getConfiguredFeatures(input: {
  profile: ChannelProfile | null;
  topic: ReturnType<typeof getTopicSummary>;
  automation: ChannelAutomationStatus;
  totalFeedCount: number;
  enabledFeedCount: number;
  dailyTriviaRelevant: boolean;
  dailyTriviaEnabled: boolean;
  rolePanelCount: number;
  roleFollowupCount: number;
  recentActivityCount: number;
}) {
  const features: string[] = [];

  if (input.profile) {
    features.push(`Profile saved: ${input.profile.purpose} / ${input.profile.tone}.`);
  }

  if (input.topic.topic) {
    features.push(`Topic available: ${input.topic.topic} (${input.topic.status}).`);
  }

  if (input.automation.automationMode !== "none") {
    features.push(`Automation mode: ${input.automation.automationMode}.`);
  }

  if (input.totalFeedCount > 0) {
    features.push(`${input.enabledFeedCount} enabled feed${input.enabledFeedCount === 1 ? "" : "s"} / ${input.totalFeedCount} total.`);
  }

  if (input.dailyTriviaRelevant) {
    features.push(`Daily trivia target: ${input.dailyTriviaEnabled ? "enabled" : "disabled"}.`);
  }

  if (input.rolePanelCount > 0) {
    features.push(`${input.rolePanelCount} relevant role signup panel${input.rolePanelCount === 1 ? "" : "s"}.`);
  }

  if (input.roleFollowupCount > 0) {
    features.push(`${input.roleFollowupCount} relevant role follow-up${input.roleFollowupCount === 1 ? "" : "s"}.`);
  }

  if (input.recentActivityCount > 0) {
    features.push(`${input.recentActivityCount} recent automation event${input.recentActivityCount === 1 ? "" : "s"} in the activity window.`);
  }

  return features;
}

function createRecommendedAction(
  id: string,
  label: string,
  targetDashboardSection: ChannelIntelligenceActionTarget,
  priority: ChannelIntelligenceActionPriority,
  reason: string,
): ChannelIntelligenceRecommendedAction {
  return {
    id,
    label,
    targetDashboardSection,
    priority,
    reason,
  };
}

function getRecommendedActions(input: {
  recommendedNextAction: ReturnType<typeof getRecommendedNextAction>;
  profile: ChannelProfile | null;
  topicStatus: ReturnType<typeof getTopicSummary>["status"];
  automation: ChannelAutomationStatus;
  enabledFeedCount: number;
  dailyTriviaRelevant: boolean;
  relevantRoleIds: readonly string[];
  rolePanelCount: number;
  roleFollowupCount: number;
  recentProblemCount: number;
}) {
  const actions: ChannelIntelligenceRecommendedAction[] = [];

  if (input.recentProblemCount > 0) {
    actions.push(createRecommendedAction(
      "review-recent-problems",
      "Review recent automation problems",
      "activity",
      "high",
      `${input.recentProblemCount} blocked or failed automation event${input.recentProblemCount === 1 ? "" : "s"} were recorded for this channel.`,
    ));
  }

  if (input.automation.blockedReason) {
    actions.push(createRecommendedAction(
      "manage-automation-block",
      "Manage automation controls",
      "automation",
      "high",
      `Automation is currently blocked by ${input.automation.blockedReason}.`,
    ));
  }

  if (!input.profile) {
    actions.push(createRecommendedAction(
      "setup-channel-profile",
      "Set up channel profile",
      "profile",
      "high",
      "A saved profile gives CDawg purpose, tone, audience, and content preferences for this channel.",
    ));
  }

  if (input.topicStatus === "missing") {
    actions.push(createRecommendedAction(
      "choose-topic",
      "Choose topic mapping",
      "topic",
      input.profile ? "medium" : "high",
      "Topic-aware content needs a channel topic mapping or profile topic override.",
    ));
  }

  if (input.enabledFeedCount === 0 && !input.dailyTriviaRelevant && input.automation.automationMode === "none") {
    actions.push(createRecommendedAction(
      "add-feed",
      "Add scheduled content",
      "feeds",
      "medium",
      "No enabled feed, daily trivia target, or automation mode is currently configured.",
    ));
  }

  if (input.profile && input.relevantRoleIds.length > 0 && input.rolePanelCount === 0) {
    actions.push(createRecommendedAction(
      "add-role-panel",
      "Add or connect role signup button",
      "role-workflows",
      "medium",
      "A relevant role exists but no matching role signup panel was found.",
    ));
  }

  if (input.profile && input.relevantRoleIds.length > 0 && input.roleFollowupCount === 0) {
    actions.push(createRecommendedAction(
      "add-role-followup",
      "Add role follow-up message",
      "role-workflows",
      "medium",
      "A relevant role exists but no matching role follow-up message was found.",
    ));
  }

  actions.push(createRecommendedAction(
    "prepare-manual-content",
    "Prepare manual content",
    "manual-content",
    "low",
    "Manual content can be reviewed before any post action.",
  ));

  actions.push(createRecommendedAction(
    "open-composer",
    "Open composer",
    "composer",
    "low",
    "Composer can prepare a reviewed message without saving automation changes.",
  ));

  if (actions.length === 2 && input.recommendedNextAction.target === "none") {
    actions.unshift(createRecommendedAction(
      "review-channel",
      "Review channel setup",
      "profile",
      "low",
      input.recommendedNextAction.reason,
    ));
  }

  return actions;
}

function getManagementLimitations(input: {
  hasPreset: boolean;
  channelType: string;
}) {
  const limitations: string[] = [];

  if (!input.hasPreset) {
    limitations.push("Some posting workflows can only preselect channels that exist in dashboard channel presets.");
  }

  if (/forum/i.test(input.channelType)) {
    limitations.push("Forum channels may not be manageable by existing message-posting controls.");
  }

  return limitations;
}

function getHealthLabel(input: {
  metadataAvailable: boolean;
  profile: ChannelProfile | null;
  topicStatus: ReturnType<typeof getTopicSummary>["status"];
  automation: ChannelAutomationStatus;
  feedCount: number;
  dailyTriviaRelevant: boolean;
  recentActivityCount: number;
  recentProblemCount: number;
}): ChannelHealthLabel {
  if (!input.metadataAvailable) {
    return "unknown";
  }

  if (input.recentProblemCount > 0 || input.automation.blockedReason) {
    return "attention";
  }

  if (!input.profile || input.topicStatus === "missing") {
    return "needs setup";
  }

  if (input.feedCount === 0 && !input.dailyTriviaRelevant && input.automation.automationMode === "none" && input.recentActivityCount === 0) {
    return "inactive";
  }

  return "healthy";
}

function buildSummary(channels: readonly ChannelIntelligenceSummary[]) {
  return channels.reduce<Record<ChannelHealthLabel, number>>(
    (summary, channel) => {
      summary[channel.healthLabel] += 1;
      return summary;
    },
    {
      healthy: 0,
      "needs setup": 0,
      attention: 0,
      inactive: 0,
      unknown: 0,
    },
  );
}

export function getChannelIntelligence(
  channels: readonly ChannelIntelligenceMetadataChannel[],
  now = Date.now(),
): ChannelIntelligenceResponse {
  const profiles = listChannelProfiles();
  const feeds = getFeedConfigs();
  const dailyTrivia = getDailyTriviaChallengeConfig();
  const panels = listPanels();
  const followups = getFollowups();
  const automationStatuses = getChannelAutomationStatuses(channels.map((channel) => channel.id), now);
  const automationByChannelId = new Map(automationStatuses.map((status) => [status.channelId, status]));
  const activitySince = now - activityWindowMs;
  const metadataAvailable = channels.length > 0;

  const intelligenceChannels = channels
    .map((channel) => {
      const profile = getProfileForChannel(channel.id, profiles);
      const topic = getTopicSummary(channel.id, profile);
      const automation = automationByChannelId.get(channel.id) ?? getChannelAutomationStatus(channel.id, now);
      const channelFeeds = getFeedsForChannel(channel.id, feeds);
      const enabledFeeds = channelFeeds.filter((feed) => feed.enabled);
      const relevantPanels = getRolePanelsForChannel(channel.id, profile, panels);
      const relevantFollowups = getRoleFollowupsForChannel(channel.id, profile, followups);
      const relevantRoleIds = getRelevantRoleIds(profile, relevantPanels, relevantFollowups);
      const recentActivity = getRecentActivityForChannel(channel.id, activitySince);
      const engagement = getChannelEngagementSnapshot(channel.id, now);
      const recentProblemCount = recentActivity.filter((item) => item.status === "blocked" || item.status === "failure").length;
      const dailyTriviaRelevant = dailyTrivia?.channelId === channel.id;
      const dailyTriviaEnabled = dailyTriviaRelevant ? dailyTrivia?.enabled === true : false;
      const recommendedNextAction = getRecommendedNextAction({
        profile,
        topicStatus: topic.status,
        automation,
        feeds: channelFeeds,
        dailyTriviaRelevant,
        rolePanelCount: relevantPanels.length,
        roleFollowupCount: relevantFollowups.length,
        recentProblemCount,
      });
      const healthLabel = getHealthLabel({
        metadataAvailable,
        profile,
        topicStatus: topic.status,
        automation,
        feedCount: enabledFeeds.length,
        dailyTriviaRelevant,
        recentActivityCount: recentActivity.length,
        recentProblemCount,
      });
      const healthReasons = getHealthReasons({
        healthLabel,
        profile,
        topicStatus: topic.status,
        automation,
        enabledFeedCount: enabledFeeds.length,
        dailyTriviaRelevant,
        recentActivityCount: recentActivity.length,
        recentProblemCount,
      });
      const detectedGaps = getDetectedGaps({
        profile,
        topicStatus: topic.status,
        automation,
        enabledFeedCount: enabledFeeds.length,
        dailyTriviaRelevant,
        relevantRoleIds,
        rolePanelCount: relevantPanels.length,
        roleFollowupCount: relevantFollowups.length,
        recentProblemCount,
      });
      const configuredFeatures = getConfiguredFeatures({
        profile,
        topic,
        automation,
        totalFeedCount: channelFeeds.length,
        enabledFeedCount: enabledFeeds.length,
        dailyTriviaRelevant,
        dailyTriviaEnabled,
        rolePanelCount: relevantPanels.length,
        roleFollowupCount: relevantFollowups.length,
        recentActivityCount: recentActivity.length,
      });
      const recommendedActions = getRecommendedActions({
        recommendedNextAction,
        profile,
        topicStatus: topic.status,
        automation,
        enabledFeedCount: enabledFeeds.length,
        dailyTriviaRelevant,
        relevantRoleIds,
        rolePanelCount: relevantPanels.length,
        roleFollowupCount: relevantFollowups.length,
        recentProblemCount,
      });
      const managementLimitations = getManagementLimitations({
        hasPreset: Boolean(channelTopics[channel.id]),
        channelType: channel.type,
      });

      return {
        channelId: channel.id,
        channelName: channel.name,
        channelType: channel.type,
        parentId: channel.parentId ?? null,
        profile: {
          status: profile ? ("saved" as const) : ("missing" as const),
          purpose: profile?.purpose ?? null,
          tone: profile?.tone ?? null,
          preferredContentTypes: profile?.preferredContentTypes ?? [],
        },
        topic,
        automation: {
          status: automation.operationalStatus,
          mode: automation.automationMode,
          blockedReason: automation.blockedReason,
          nextEligibleSendAt: automation.nextEligibleSendAt,
          lastAutomatedSendAt: automation.lastAutomatedSendAt,
        },
        feeds: {
          total: channelFeeds.length,
          enabled: enabledFeeds.length,
          disabled: channelFeeds.length - enabledFeeds.length,
          contentTypes: [...new Set(channelFeeds.map((feed) => feed.contentType))],
        },
        dailyTrivia: {
          relevant: dailyTriviaRelevant,
          enabled: dailyTriviaRelevant ? dailyTrivia?.enabled === true : false,
          role: dailyTriviaRelevant ? ("target" as const) : ("none" as const),
        },
        roleWorkflows: {
          panels: relevantPanels.length,
          followups: relevantFollowups.length,
          relevantRoleIds,
        },
        recentActivity: {
          count: recentActivity.length,
          blockedOrFailureCount: recentProblemCount,
          since: activitySince,
        },
        engagement,
        recommendedNextAction,
        healthReasons,
        detectedGaps,
        configuredFeatures,
        recommendedActions,
        manageable: managementLimitations.length === 0,
        managementLimitations,
        healthLabel,
        trust: {
          confidence: metadataAvailable ? ("high" as const) : ("low" as const),
          freshness: "current API response plus persisted automation activity from the last 7 days",
          sources: sourceLabels,
        },
      };
    })
    .sort((left, right) => {
      const healthRank: Record<ChannelHealthLabel, number> = {
        attention: 0,
        "needs setup": 1,
        inactive: 2,
        unknown: 3,
        healthy: 4,
      };

      return healthRank[left.healthLabel] - healthRank[right.healthLabel] || left.channelName.localeCompare(right.channelName);
    });

  return {
    generatedAt: now,
    activityWindowMs,
    channels: intelligenceChannels,
    summary: buildSummary(intelligenceChannels),
    sources: sourceLabels,
    metadataAvailable,
  };
}
