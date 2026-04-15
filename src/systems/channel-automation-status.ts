import { schedules, type Schedule } from "../config/schedules.js";
import { getPassiveChatSettings } from "../config/passive-chat.js";
import type { ContentType } from "../lib/content-provider.js";
import { getFeedConfigs, getFeedNextEligibleAt } from "./feed-configs.js";
import type { AutomationBlockReason } from "./channel-operations.js";
import { getChannelOperationalStatus } from "./channel-operations.js";

export type AutomationOperationalStatus = "active" | "disabled" | "silenced" | "cooling-down";

export type AutomationMode =
  | "none"
  | "passive"
  | "scheduled"
  | "feed"
  | "passive+scheduler"
  | "passive+feed"
  | "scheduler+feed"
  | "passive+scheduler+feed";

export type ChannelAutomationStatus = {
  channelId: string;
  automationEnabled: boolean;
  operationalStatus: AutomationOperationalStatus;
  blockedReason: AutomationBlockReason | null;
  blockedUntil: number | null;
  skipNextSendPending: boolean;
  lastAutomatedSendAt: number | null;
  nextEligibleSendAt: number | null;
  passiveEligibleAt: number | null;
  scheduledEligibleAt: number | null;
  automationMode: AutomationMode;
};

export type NextAutomatedContentPlan = {
  channelId: string;
  source: "scheduler" | "passive-chat" | "feed";
  contentType: ContentType;
  eligibleAt: number | null;
};

const lastAutomatedSendAtByChannelId = new Map<string, number>();
const lastPassiveSendAtByChannelId = new Map<string, number>();
let lastPassiveSendAtGlobal = 0;

function getSchedulesForChannel(channelId: string) {
  return schedules.filter((schedule) => schedule.channelId === channelId);
}

function getFeedsForChannel(channelId: string) {
  return getFeedConfigs().filter((feed) => feed.enabled && feed.channelId === channelId);
}

function getAutomationMode(channelId: string) {
  if (!getChannelOperationalStatus(channelId).isAutomationEnabled) {
    return "none" as const;
  }

  const passiveEnabled = getPassiveChatSettings().enabled && getPassiveChatSettings().eligibleChannelIds.has(channelId);
  const hasScheduledContent = getSchedulesForChannel(channelId).length > 0;
  const hasManagedFeed = getFeedsForChannel(channelId).length > 0;

  if (passiveEnabled && hasScheduledContent && hasManagedFeed) {
    return "passive+scheduler+feed" as const;
  }

  if (passiveEnabled && hasScheduledContent) {
    return "passive+scheduler" as const;
  }

  if (passiveEnabled && hasManagedFeed) {
    return "passive+feed" as const;
  }

  if (hasScheduledContent && hasManagedFeed) {
    return "scheduler+feed" as const;
  }

  if (passiveEnabled) {
    return "passive" as const;
  }

  if (hasScheduledContent) {
    return "scheduled" as const;
  }

  if (hasManagedFeed) {
    return "feed" as const;
  }

  return "none" as const;
}

function getNextDailyRunAt(schedule: Schedule & { hour: number; minute: number }, referenceTime: number) {
  const nextRun = new Date(referenceTime);
  nextRun.setSeconds(0, 0);
  nextRun.setHours(schedule.hour, schedule.minute, 0, 0);

  if (nextRun.getTime() <= referenceTime) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun.getTime();
}

function getNextIntervalRunAt(schedule: Schedule & { intervalMinutes: number }, channelId: string, referenceTime: number) {
  const lastAutomatedSendAt = lastAutomatedSendAtByChannelId.get(channelId);

  if (!lastAutomatedSendAt) {
    return null;
  }

  return lastAutomatedSendAt + schedule.intervalMinutes * 60 * 1000 > referenceTime
    ? lastAutomatedSendAt + schedule.intervalMinutes * 60 * 1000
    : referenceTime;
}

function getScheduledEligibleAt(channelId: string, blockedUntil: number | null, now: number) {
  if (!getChannelOperationalStatus(channelId, now).isAutomationEnabled) {
    return null;
  }

  const schedulesForChannel = getSchedulesForChannel(channelId);

  if (schedulesForChannel.length === 0) {
    return null;
  }

  const referenceTime = Math.max(now, blockedUntil ?? 0);
  const candidateTimes = schedulesForChannel
    .map((schedule) => {
      if (typeof schedule.hour === "number" && typeof schedule.minute === "number") {
        return getNextDailyRunAt(schedule as Schedule & { hour: number; minute: number }, referenceTime);
      }

      if (typeof schedule.intervalMinutes === "number") {
        return getNextIntervalRunAt(schedule as Schedule & { intervalMinutes: number }, channelId, referenceTime);
      }

      return null;
    })
    .filter((timestamp): timestamp is number => typeof timestamp === "number" && Number.isFinite(timestamp));

  if (candidateTimes.length === 0) {
    return null;
  }

  return Math.min(...candidateTimes);
}

function getNextScheduledPlan(channelId: string, blockedUntil: number | null, now: number): NextAutomatedContentPlan | null {
  if (!getChannelOperationalStatus(channelId, now).isAutomationEnabled) {
    return null;
  }

  const schedulesForChannel = getSchedulesForChannel(channelId);

  if (schedulesForChannel.length === 0) {
    return null;
  }

  const referenceTime = Math.max(now, blockedUntil ?? 0);
  type ScheduledPlanCandidate = {
    channelId: string;
    source: "scheduler";
    contentType: ContentType;
    eligibleAt: number;
  };
  const candidatePlans = schedulesForChannel
    .map((schedule) => {
      if (typeof schedule.hour === "number" && typeof schedule.minute === "number") {
        return {
          channelId,
          source: "scheduler" as const,
          contentType: schedule.contentType,
          eligibleAt: getNextDailyRunAt(schedule as Schedule & { hour: number; minute: number }, referenceTime),
        };
      }

      if (typeof schedule.intervalMinutes === "number") {
        return {
          channelId,
          source: "scheduler" as const,
          contentType: schedule.contentType,
          eligibleAt: getNextIntervalRunAt(schedule as Schedule & { intervalMinutes: number }, channelId, referenceTime),
        };
      }

      return null;
    })
    .filter((plan): plan is ScheduledPlanCandidate => Boolean(plan && typeof plan.eligibleAt === "number"));

  if (candidatePlans.length === 0) {
    return null;
  }

  return candidatePlans.sort((left, right) => left.eligibleAt - right.eligibleAt)[0] ?? null;
}

function getPassiveEligibleAt(channelId: string, blockedUntil: number | null, now: number) {
  if (!getChannelOperationalStatus(channelId, now).isAutomationEnabled) {
    return null;
  }

  const passiveChatSettings = getPassiveChatSettings();

  if (!passiveChatSettings.enabled || !passiveChatSettings.eligibleChannelIds.has(channelId)) {
    return null;
  }

  const lastChannelPassiveSendAt = lastPassiveSendAtByChannelId.get(channelId) ?? 0;

  return Math.max(
    now,
    blockedUntil ?? 0,
    lastPassiveSendAtGlobal + passiveChatSettings.globalCooldownMs,
    lastChannelPassiveSendAt + passiveChatSettings.channelCooldownMs,
  );
}

function getNextPassivePlan(channelId: string, blockedUntil: number | null, now: number): NextAutomatedContentPlan | null {
  if (!getChannelOperationalStatus(channelId, now).isAutomationEnabled) {
    return null;
  }

  const passiveChatSettings = getPassiveChatSettings();

  if (!passiveChatSettings.enabled || !passiveChatSettings.eligibleChannelIds.has(channelId)) {
    return null;
  }

  return {
    channelId,
    source: "passive-chat",
    contentType: passiveChatSettings.conversationNudgeContentTypes[0] ?? "prompt",
    eligibleAt: getPassiveEligibleAt(channelId, blockedUntil, now),
  };
}

function getFeedEligibleAt(channelId: string, blockedUntil: number | null, now: number) {
  if (!getChannelOperationalStatus(channelId, now).isAutomationEnabled) {
    return null;
  }

  const candidateTimes = getFeedsForChannel(channelId)
    .map((feed) => Math.max(getFeedNextEligibleAt(feed, now), blockedUntil ?? 0))
    .filter((timestamp): timestamp is number => Number.isFinite(timestamp));

  if (candidateTimes.length === 0) {
    return null;
  }

  return Math.min(...candidateTimes);
}

function getNextFeedPlan(channelId: string, blockedUntil: number | null, now: number): NextAutomatedContentPlan | null {
  if (!getChannelOperationalStatus(channelId, now).isAutomationEnabled) {
    return null;
  }

  const candidatePlans = getFeedsForChannel(channelId).map((feed) => ({
    channelId,
    source: "feed" as const,
    contentType: feed.contentType,
    eligibleAt: Math.max(getFeedNextEligibleAt(feed, now), blockedUntil ?? 0),
  }));

  if (candidatePlans.length === 0) {
    return null;
  }

  return candidatePlans.sort((left, right) => left.eligibleAt - right.eligibleAt)[0] ?? null;
}

function getBlockedState(channelId: string, now: number) {
  const operationalStatus = getChannelOperationalStatus(channelId, now);

  if (!operationalStatus.isAutomationEnabled) {
    return {
      automationEnabled: false,
      operationalStatus: "disabled" as const,
      blockedReason: "disabled" as const,
      blockedUntil: null,
    };
  }

  if (operationalStatus.isSilenced) {
    return {
      automationEnabled: true,
      operationalStatus: "silenced" as const,
      blockedReason: "silenced" as const,
      blockedUntil: operationalStatus.silencedUntil,
    };
  }

  if (operationalStatus.isCoolingDown) {
    return {
      automationEnabled: true,
      operationalStatus: "cooling-down" as const,
      blockedReason: "cooldown" as const,
      blockedUntil: operationalStatus.cooldownUntil,
    };
  }

  return {
    automationEnabled: true,
    operationalStatus: "active" as const,
    blockedReason: null,
    blockedUntil: null,
  };
}

export function recordAutomatedContentSend(
  channelId: string,
  source: "passive-chat" | "scheduler" | "feed" | "daily-challenge",
  sentAt = Date.now(),
) {
  lastAutomatedSendAtByChannelId.set(channelId, sentAt);

  if (source === "passive-chat") {
    lastPassiveSendAtGlobal = sentAt;
    lastPassiveSendAtByChannelId.set(channelId, sentAt);
  }
}

export function getChannelAutomationStatus(channelId: string, now = Date.now()): ChannelAutomationStatus {
  const blockedState = getBlockedState(channelId, now);
  const passiveEligibleAt = getPassiveEligibleAt(channelId, blockedState.blockedUntil, now);
  const scheduledEligibleAt = getScheduledEligibleAt(channelId, blockedState.blockedUntil, now);
  const feedEligibleAt = getFeedEligibleAt(channelId, blockedState.blockedUntil, now);
  const nextEligibleCandidates = [passiveEligibleAt, scheduledEligibleAt, feedEligibleAt].filter(
    (timestamp): timestamp is number => typeof timestamp === "number" && Number.isFinite(timestamp),
  );

  return {
    channelId,
    automationEnabled: blockedState.automationEnabled,
    operationalStatus: blockedState.operationalStatus,
    blockedReason: blockedState.blockedReason ?? (getChannelOperationalStatus(channelId, now).skipNextSend ? "skip-next" : null),
    blockedUntil: blockedState.blockedUntil,
    skipNextSendPending: getChannelOperationalStatus(channelId, now).skipNextSend,
    lastAutomatedSendAt: lastAutomatedSendAtByChannelId.get(channelId) ?? null,
    nextEligibleSendAt: nextEligibleCandidates.length > 0 ? Math.min(...nextEligibleCandidates) : null,
    passiveEligibleAt,
    scheduledEligibleAt,
    automationMode: getAutomationMode(channelId),
  };
}

export function getChannelAutomationStatuses(channelIds: readonly string[], now = Date.now()) {
  return channelIds.map((channelId) => getChannelAutomationStatus(channelId, now));
}

export function getNextAutomatedContentPlan(
  channelId: string,
  now = Date.now(),
  options?: { includeDisabled?: boolean },
): NextAutomatedContentPlan | null {
  if (!options?.includeDisabled && !getChannelOperationalStatus(channelId, now).isAutomationEnabled) {
    return null;
  }

  const blockedUntil = getChannelOperationalStatus(channelId, now).nextEligibleAt;
  const scheduledPlan = getNextScheduledPlan(channelId, blockedUntil, now);
  const passivePlan = getNextPassivePlan(channelId, blockedUntil, now);
  const feedPlan = getNextFeedPlan(channelId, blockedUntil, now);
  const candidatePlans = [scheduledPlan, passivePlan, feedPlan].filter((plan): plan is NextAutomatedContentPlan => Boolean(plan));

  if (candidatePlans.length === 0) {
    return null;
  }

  return candidatePlans.sort(
    (left, right) => (left.eligibleAt ?? Number.POSITIVE_INFINITY) - (right.eligibleAt ?? Number.POSITIVE_INFINITY),
  )[0] ?? null;
}
