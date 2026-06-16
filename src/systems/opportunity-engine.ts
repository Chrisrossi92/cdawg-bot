import { getRecentAutomationActivity } from "./automation-activity.js";
import type { ChannelIntelligenceResponse, ChannelIntelligenceSummary } from "./channel-intelligence.js";
import { getContentOutcomeSummary, type ContentOutcomeSource, type ContentOutcomeSummary } from "./content-outcomes.js";

export type OpportunityCategory =
  | "Dormant Channel"
  | "Untended Channel"
  | "High Potential Channel"
  | "Successful Content Pattern"
  | "Failed Content Pattern"
  | "Automation Failure Risk"
  | "Quick Wins";

export type OpportunityPriority = "critical" | "high" | "medium" | "low";
export type OpportunityConfidence = "high" | "medium" | "low";

export type Opportunity = {
  id: string;
  category: OpportunityCategory;
  title: string;
  description: string;
  priority: OpportunityPriority;
  confidence: OpportunityConfidence;
  affectedChannels: Array<{
    id: string;
    name: string | null;
  }>;
  suggestedAction: string;
  supportingSignals: string[];
};

export type OpportunityResponse = {
  generatedAt: number;
  opportunities: Opportunity[];
  count: number;
  sources: string[];
};

const priorityRank: Record<OpportunityPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const confidenceRank: Record<OpportunityConfidence, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function channelRef(channel: ChannelIntelligenceSummary) {
  return {
    id: channel.channelId,
    name: channel.channelName,
  };
}

function channelLabel(channel: ChannelIntelligenceSummary) {
  return `#${channel.channelName}`;
}

function makeId(parts: Array<string | number | null | undefined>) {
  return parts
    .filter((part) => part !== null && part !== undefined && String(part).trim())
    .map((part) => String(part).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    .join(":");
}

function addUnique(opportunities: Opportunity[], opportunity: Opportunity) {
  if (opportunities.some((item) => item.id === opportunity.id)) {
    return;
  }

  opportunities.push(opportunity);
}

function getOutcomeScore(outcome: ContentOutcomeSummary) {
  if (outcome.activity.outcomeLabel === "sparked") {
    return 2;
  }

  if (outcome.activity.outcomeLabel === "some response") {
    return 1;
  }

  if (outcome.activity.outcomeLabel === "no response") {
    return 0;
  }

  return null;
}

function buildChannelOpportunityRules(channelIntelligence: ChannelIntelligenceResponse, opportunities: Opportunity[]) {
  for (const channel of channelIntelligence.channels) {
    const noAutomation =
      channel.automation.mode === "none" &&
      channel.feeds.enabled === 0 &&
      !channel.dailyTrivia.relevant;
    const missingStrategy =
      channel.profile.status === "missing" &&
      channel.topic.status === "missing" &&
      noAutomation;

    if (channel.engagement.last7dMessages > 0 && channel.engagement.last24hMessages === 0) {
      addUnique(opportunities, {
        id: makeId(["dormant-channel", channel.channelId]),
        category: "Dormant Channel",
        title: `${channelLabel(channel)} has gone quiet`,
        description: "This channel had activity in the last 7 days but none in the last 24 hours.",
        priority: channel.engagement.last7dMessages >= 10 ? "high" : "medium",
        confidence: "medium",
        affectedChannels: [channelRef(channel)],
        suggestedAction: "Review this channel for a lightweight prompt, scheduled feed, or community follow-up.",
        supportingSignals: [
          `${channel.engagement.last7dMessages} messages in 7 days`,
          `${channel.engagement.last24hMessages} messages in 24 hours`,
          `last activity ${channel.engagement.lastActivityAt ?? "unknown"}`,
        ],
      });
    }

    if (missingStrategy) {
      addUnique(opportunities, {
        id: makeId(["untended-channel", channel.channelId]),
        category: "Untended Channel",
        title: `${channelLabel(channel)} has no setup strategy`,
        description: "No saved profile, topic mapping, enabled feed, daily trivia target, or automation mode was found.",
        priority: "medium",
        confidence: "high",
        affectedChannels: [channelRef(channel)],
        suggestedAction: "Create a channel profile first, then choose a topic and one content workflow.",
        supportingSignals: [
          "profile missing",
          "topic missing",
          "no enabled automation",
          `${channel.feeds.total} feed configs`,
        ],
      });
    }

    if ((channel.engagement.last24hMessages >= 10 || channel.engagement.approxActiveUsers24h >= 3) && noAutomation) {
      addUnique(opportunities, {
        id: makeId(["high-potential-channel", channel.channelId]),
        category: "High Potential Channel",
        title: `${channelLabel(channel)} is active without much automation`,
        description: "Recent human activity is present, but there is little configured content support.",
        priority: "high",
        confidence: "medium",
        affectedChannels: [channelRef(channel)],
        suggestedAction: "Add a channel profile and one reviewed scheduled content source for this active audience.",
        supportingSignals: [
          `${channel.engagement.last24hMessages} messages in 24 hours`,
          `approximately ${channel.engagement.approxActiveUsers24h} active users in 24 hours`,
          "no enabled feed, daily trivia target, or automation mode",
        ],
      });
    }

    const quickWin = channel.recommendedActions.find((action) =>
      action.id.includes("profile") ||
      action.id.includes("topic") ||
      action.id.includes("feed") ||
      action.id.includes("role"),
    );

    if (quickWin && channel.healthLabel !== "healthy") {
      addUnique(opportunities, {
        id: makeId(["quick-win", quickWin.id, channel.channelId]),
        category: "Quick Wins",
        title: `${channelLabel(channel)} has an easy setup improvement`,
        description: quickWin.reason,
        priority: quickWin.priority === "high" ? "high" : "low",
        confidence: channel.trust.confidence,
        affectedChannels: [channelRef(channel)],
        suggestedAction: quickWin.label,
        supportingSignals: [
          `health: ${channel.healthLabel}`,
          `profile: ${channel.profile.status}`,
          `topic: ${channel.topic.status}`,
          `${channel.feeds.enabled} enabled feeds`,
        ],
      });
    }
  }
}

function buildOutcomePatternRules(opportunities: Opportunity[]) {
  const outcomes = getContentOutcomeSummary({ limit: 100 }).items;
  const evaluated = outcomes.filter((outcome) => getOutcomeScore(outcome) !== null);

  if (evaluated.length < 3) {
    return;
  }

  const globalAverage =
    evaluated.reduce((total, outcome) => total + (getOutcomeScore(outcome) ?? 0), 0) / evaluated.length;
  const bySource = new Map<ContentOutcomeSource, ContentOutcomeSummary[]>();

  for (const outcome of evaluated) {
    const items = bySource.get(outcome.source) ?? [];
    items.push(outcome);
    bySource.set(outcome.source, items);
  }

  for (const [source, items] of bySource.entries()) {
    if (items.length < 3) {
      continue;
    }

    const average = items.reduce((total, outcome) => total + (getOutcomeScore(outcome) ?? 0), 0) / items.length;
    const responseCount = items.filter((outcome) => outcome.activity.humanMessages60m > 0).length;
    const affectedChannels = [
      ...new Map(items.map((item) => [item.channelId, { id: item.channelId, name: item.channelName }])).values(),
    ].slice(0, 6);

    if (average > globalAverage && responseCount >= Math.ceil(items.length / 2)) {
      addUnique(opportunities, {
        id: makeId(["successful-content-pattern", source]),
        category: "Successful Content Pattern",
        title: `${source} posts are outperforming recent content`,
        description: "This source has repeated above-average post outcomes compared with other tracked content.",
        priority: "medium",
        confidence: items.length >= 5 ? "high" : "medium",
        affectedChannels,
        suggestedAction: "Review this pattern and consider expanding it to similar channels.",
        supportingSignals: [
          `${items.length} evaluated posts`,
          `${responseCount} posts had human response within 60 minutes`,
          `source score ${average.toFixed(2)} vs overall ${globalAverage.toFixed(2)}`,
        ],
      });
    }

    if (average < globalAverage && responseCount === 0) {
      addUnique(opportunities, {
        id: makeId(["failed-content-pattern", source]),
        category: "Failed Content Pattern",
        title: `${source} posts are not drawing response`,
        description: "This source has repeated weak outcomes in the currently tracked content window.",
        priority: "medium",
        confidence: items.length >= 5 ? "high" : "medium",
        affectedChannels,
        suggestedAction: "Review cadence, channel fit, and content type before posting more from this source.",
        supportingSignals: [
          `${items.length} evaluated posts`,
          "0 posts had human response within 60 minutes",
          `source score ${average.toFixed(2)} vs overall ${globalAverage.toFixed(2)}`,
        ],
      });
    }
  }
}

function buildAutomationFailureRules(channelIntelligence: ChannelIntelligenceResponse, opportunities: Opportunity[]) {
  const problemEvents = getRecentAutomationActivity(400).filter(
    (item) => item.status === "blocked" || item.status === "failure",
  );
  const byChannel = new Map<string, typeof problemEvents>();

  for (const event of problemEvents) {
    if (!event.channelId) {
      continue;
    }

    const events = byChannel.get(event.channelId) ?? [];
    events.push(event);
    byChannel.set(event.channelId, events);
  }

  for (const [channelId, events] of byChannel.entries()) {
    if (events.length < 3) {
      continue;
    }

    const channel = channelIntelligence.channels.find((item) => item.channelId === channelId);
    const failures = events.filter((event) => event.status === "failure").length;
    const blocked = events.length - failures;
    addUnique(opportunities, {
      id: makeId(["automation-failure-risk", channelId]),
      category: "Automation Failure Risk",
      title: `${channel ? channelLabel(channel) : channelId} has recurring automation problems`,
      description: "Multiple blocked or failed automation events were recorded for this channel.",
      priority: failures > 0 ? "critical" : "high",
      confidence: "high",
      affectedChannels: [
        {
          id: channelId,
          name: channel?.channelName ?? events[0]?.channelName ?? null,
        },
      ],
      suggestedAction: "Review channel automation controls, allowed windows, and recent failure details.",
      supportingSignals: [
        `${events.length} blocked/failure events in recent activity`,
        `${blocked} blocked events`,
        `${failures} failure events`,
      ],
    });
  }
}

export function getOpportunities(channelIntelligence: ChannelIntelligenceResponse): OpportunityResponse {
  const opportunities: Opportunity[] = [];

  buildChannelOpportunityRules(channelIntelligence, opportunities);
  buildOutcomePatternRules(opportunities);
  buildAutomationFailureRules(channelIntelligence, opportunities);

  const sorted = opportunities
    .sort(
      (left, right) =>
        priorityRank[left.priority] - priorityRank[right.priority] ||
        confidenceRank[left.confidence] - confidenceRank[right.confidence] ||
        left.category.localeCompare(right.category) ||
        left.title.localeCompare(right.title),
    )
    .slice(0, 25);

  return {
    generatedAt: Date.now(),
    opportunities: sorted,
    count: sorted.length,
    sources: [
      "channel intelligence",
      "engagement activity",
      "content outcomes",
      "automation activity",
      "feeds",
      "daily trivia",
      "channel profiles",
    ],
  };
}
