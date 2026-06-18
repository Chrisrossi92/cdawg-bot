import { getRecentAutomationActivity } from "./automation-activity.js";
import type { ChannelIntelligenceResponse, ChannelIntelligenceSummary } from "./channel-intelligence.js";
import { getContentOutcomeSummary, type ContentOutcomeSummary } from "./content-outcomes.js";
import { getEngagementSummary, type EngagementSummary } from "./engagement-activity.js";
import { getOpportunities, type Opportunity, type OpportunityResponse } from "./opportunity-engine.js";

export type DailyBriefingHealth = "Excellent" | "Good" | "Fair" | "Attention Needed";

export type DailyBriefingResponse = {
  generatedAt: number;
  overallHealth: DailyBriefingHealth;
  summary: string;
  highlights: string[];
  concerns: string[];
  recommendations: string[];
  supportingMetrics: {
    activeChannels: number;
    dormantChannels: number;
    opportunitiesCount: number;
    recentSuccessfulOutcomes: number;
    recentFailedOutcomes: number;
  };
};

function channelLabel(channel: Pick<ChannelIntelligenceSummary, "channelName">) {
  return `#${channel.channelName}`;
}

function getMostActiveChannel(channels: readonly ChannelIntelligenceSummary[]) {
  return [...channels]
    .filter((channel) => channel.engagement.last24hMessages > 0 || channel.engagement.last7dMessages > 0)
    .sort(
      (left, right) =>
        right.engagement.last24hMessages - left.engagement.last24hMessages ||
        right.engagement.approxActiveUsers24h - left.engagement.approxActiveUsers24h ||
        right.engagement.last7dMessages - left.engagement.last7dMessages ||
        left.channelName.localeCompare(right.channelName),
    )[0] ?? null;
}

function getBestRecentOutcome(outcomes: readonly ContentOutcomeSummary[]) {
  const score = (outcome: ContentOutcomeSummary) => {
    if (outcome.activity.outcomeLabel === "sparked") {
      return 3;
    }

    if (outcome.activity.outcomeLabel === "some response") {
      return 2;
    }

    if (outcome.activity.outcomeLabel === "unknown") {
      return 1;
    }

    return 0;
  };

  return [...outcomes]
    .filter((outcome) => outcome.activity.outcomeLabel === "sparked" || outcome.activity.outcomeLabel === "some response")
    .sort(
      (left, right) =>
        score(right) - score(left) ||
        right.activity.humanMessages60m - left.activity.humanMessages60m ||
        right.postedAt - left.postedAt,
    )[0] ?? null;
}

function getHighPotentialOpportunity(opportunities: readonly Opportunity[]) {
  return opportunities.find((opportunity) => opportunity.category === "High Potential Channel") ?? null;
}

function getRecentAutomationSuccess() {
  return getRecentAutomationActivity(50).find((item) => item.status === "success") ?? null;
}

function getSupportingMetrics(input: {
  channelIntelligence: ChannelIntelligenceResponse;
  opportunities: OpportunityResponse;
  outcomes: readonly ContentOutcomeSummary[];
}) {
  const activeChannels = input.channelIntelligence.channels.filter(
    (channel) => channel.engagement.engagementLabel === "active" || channel.engagement.last24hMessages > 0,
  ).length;
  const dormantChannels = input.channelIntelligence.channels.filter(
    (channel) => channel.engagement.engagementLabel === "dormant" || (channel.engagement.last7dMessages > 0 && channel.engagement.last24hMessages === 0),
  ).length;
  const recentSuccessfulOutcomes = input.outcomes.filter(
    (outcome) => outcome.activity.outcomeLabel === "sparked" || outcome.activity.outcomeLabel === "some response",
  ).length;
  const recentFailedOutcomes = input.outcomes.filter((outcome) => outcome.activity.outcomeLabel === "no response").length;

  return {
    activeChannels,
    dormantChannels,
    opportunitiesCount: input.opportunities.count,
    recentSuccessfulOutcomes,
    recentFailedOutcomes,
  };
}

function getOverallHealth(input: {
  opportunities: readonly Opportunity[];
  metrics: DailyBriefingResponse["supportingMetrics"];
  automationProblemCount: number;
}) {
  const criticalCount = input.opportunities.filter((opportunity) => opportunity.priority === "critical").length;
  const highCount = input.opportunities.filter((opportunity) => opportunity.priority === "high").length;

  if (criticalCount > 0 || input.automationProblemCount >= 5) {
    return "Attention Needed" as const;
  }

  if (highCount > 0 || input.metrics.dormantChannels >= 3 || input.metrics.recentFailedOutcomes > input.metrics.recentSuccessfulOutcomes) {
    return "Fair" as const;
  }

  if (
    input.metrics.activeChannels > 0 &&
    input.metrics.dormantChannels === 0 &&
    input.metrics.opportunitiesCount <= 2 &&
    input.metrics.recentFailedOutcomes === 0
  ) {
    return "Excellent" as const;
  }

  return "Good" as const;
}

function getSummary(health: DailyBriefingHealth, metrics: DailyBriefingResponse["supportingMetrics"]) {
  if (health === "Attention Needed") {
    return `Today needs review: ${metrics.opportunitiesCount} opportunities are open, with ${metrics.dormantChannels} dormant channels and ${metrics.recentFailedOutcomes} weak recent content outcomes.`;
  }

  if (health === "Fair") {
    return `Today is mixed: ${metrics.activeChannels} channels show recent activity, but ${metrics.opportunitiesCount} opportunities and ${metrics.dormantChannels} dormant channels need attention.`;
  }

  if (health === "Excellent") {
    return `Today looks strong: ${metrics.activeChannels} channels are active, no dormant channels are flagged, and recent content outcomes are healthy.`;
  }

  return `Today looks stable: ${metrics.activeChannels} channels show recent activity, with ${metrics.opportunitiesCount} deterministic opportunities available for review.`;
}

function getHighlights(input: {
  channelIntelligence: ChannelIntelligenceResponse;
  outcomes: readonly ContentOutcomeSummary[];
  opportunities: readonly Opportunity[];
}) {
  const highlights: string[] = [];
  const mostActive = getMostActiveChannel(input.channelIntelligence.channels);
  const bestOutcome = getBestRecentOutcome(input.outcomes);
  const highPotential = getHighPotentialOpportunity(input.opportunities);
  const automationSuccess = getRecentAutomationSuccess();

  if (mostActive) {
    highlights.push(`${channelLabel(mostActive)} is the most active channel with ${mostActive.engagement.last24hMessages} messages in 24 hours and approximately ${mostActive.engagement.approxActiveUsers24h} active users.`);
  }

  if (bestOutcome) {
    highlights.push(`${bestOutcome.label ?? bestOutcome.source} in #${bestOutcome.channelName ?? bestOutcome.channelId} had a ${bestOutcome.activity.outcomeLabel} outcome with ${bestOutcome.activity.humanMessages60m} human messages in 60 minutes.`);
  }

  if (highPotential) {
    highlights.push(`${highPotential.title}: ${highPotential.suggestedAction}`);
  }

  if (automationSuccess) {
    highlights.push(`Recent automation success: ${automationSuccess.message}`);
  }

  return highlights.slice(0, 4);
}

function getConcerns(input: {
  channelIntelligence: ChannelIntelligenceResponse;
  opportunities: readonly Opportunity[];
  outcomes: readonly ContentOutcomeSummary[];
  automationProblemCount: number;
}) {
  const concerns: string[] = [];
  const dormantChannels = input.channelIntelligence.channels.filter(
    (channel) => channel.engagement.last7dMessages > 0 && channel.engagement.last24hMessages === 0,
  );
  const missingSetup = input.opportunities.filter(
    (opportunity) => opportunity.category === "Untended Channel" || opportunity.category === "Quick Wins",
  );
  const failedOutcomes = input.outcomes.filter((outcome) => outcome.activity.outcomeLabel === "no response");

  if (dormantChannels.length > 0) {
    concerns.push(`${dormantChannels.length} channel${dormantChannels.length === 1 ? " is" : "s are"} dormant after having activity in the last 7 days.`);
  }

  if (input.automationProblemCount > 0) {
    concerns.push(`${input.automationProblemCount} recent automation blocked/failure event${input.automationProblemCount === 1 ? "" : "s"} need review.`);
  }

  if (missingSetup.length > 0) {
    concerns.push(`${missingSetup.length} setup opportunit${missingSetup.length === 1 ? "y is" : "ies are"} open across profiles, topics, feeds, or role workflows.`);
  }

  if (failedOutcomes.length > 0) {
    concerns.push(`${failedOutcomes.length} recent content outcome${failedOutcomes.length === 1 ? " had" : "s had"} no human response within 60 minutes.`);
  }

  return concerns.slice(0, 4);
}

function getRecommendations(opportunities: readonly Opportunity[]) {
  const recommendations: string[] = [];

  for (const opportunity of opportunities) {
    const recommendation = `${opportunity.suggestedAction} (${opportunity.title})`;
    if (!recommendations.includes(recommendation)) {
      recommendations.push(recommendation);
    }

    if (recommendations.length >= 3) {
      break;
    }
  }

  return recommendations;
}

export function getDailyBriefing(channelIntelligence: ChannelIntelligenceResponse): DailyBriefingResponse {
  const generatedAt = Date.now();
  const opportunities = getOpportunities(channelIntelligence);
  const engagementSummary: EngagementSummary = getEngagementSummary(generatedAt);
  const outcomes = getContentOutcomeSummary({ limit: 50 }).items;
  const automationProblems = getRecentAutomationActivity(50).filter(
    (item) => item.status === "blocked" || item.status === "failure",
  );
  const metrics = getSupportingMetrics({
    channelIntelligence,
    opportunities,
    outcomes,
  });
  const health = getOverallHealth({
    opportunities: opportunities.opportunities,
    metrics,
    automationProblemCount: automationProblems.length,
  });
  const engagementChannelCount = engagementSummary.windows.last24h.length;
  const highlights = getHighlights({
    channelIntelligence,
    outcomes,
    opportunities: opportunities.opportunities,
  });
  const concerns = getConcerns({
    channelIntelligence,
    opportunities: opportunities.opportunities,
    outcomes,
    automationProblemCount: automationProblems.length,
  });
  const recommendations = getRecommendations(opportunities.opportunities);

  return {
    generatedAt,
    overallHealth: health,
    summary: `${getSummary(health, metrics)} Engagement data currently covers ${engagementChannelCount} channel${engagementChannelCount === 1 ? "" : "s"} in the last 24 hours.`,
    highlights,
    concerns,
    recommendations,
    supportingMetrics: metrics,
  };
}
