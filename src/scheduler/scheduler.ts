import type { Client } from "discord.js";
import { schedules, type Schedule } from "../config/schedules.js";
import { pushManualContentToChannel } from "../lib/manual-content-push.js";
import { isWithinDailyAllowedWindow } from "../lib/allowed-window.js";
import { getAutomatedContentBlock } from "../systems/channel-operations.js";
import { recordAutomatedContentSend } from "../systems/channel-automation-status.js";
import { evaluatePassiveChatChannels } from "../systems/passive-chat.js";
import {
  getDailyTriviaChallengeConfig,
  logDailyTriviaChallengeWindowBlocked,
  recordDailyTriviaChallengeExecuted,
  shouldRunDailyTriviaChallengeNow,
} from "../systems/daily-trivia-challenge.js";
import {
  getFeedConfigs,
  getFeedNextEligibleAt,
  isWithinFeedAllowedWindow,
  recordFeedExecuted,
  type FeedConfig,
} from "../systems/feed-configs.js";

const lastPostedMinuteBySchedule = new Map<string, string>();

function getScheduleKey(schedule: Schedule): string {
  return `${schedule.channelId}:${schedule.contentType}`;
}

function getMinuteWindowKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}-${hour}:${minute}`;
}

function hasDailyTime(schedule: Schedule): schedule is Schedule & { hour: number; minute: number } {
  return typeof schedule.hour === "number" && typeof schedule.minute === "number";
}

async function postScheduledContent(client: Client, schedule: Schedule, now: Date) {
  const scheduleKey = getScheduleKey(schedule);
  const minuteWindowKey = getMinuteWindowKey(now);

  if (lastPostedMinuteBySchedule.get(scheduleKey) === minuteWindowKey) {
    return;
  }

  const automationBlock = getAutomatedContentBlock(schedule.channelId, "scheduler", now.getTime());

  if (automationBlock.blocked) {
    return;
  }

  const result = await pushManualContentToChannel(client, {
    channelId: schedule.channelId,
    contentType: schedule.contentType,
    source: "scheduler",
  });

  if (!result.ok) {
    return;
  }

  recordAutomatedContentSend(schedule.channelId, "scheduler", now.getTime());
  lastPostedMinuteBySchedule.set(scheduleKey, minuteWindowKey);
}

async function postManagedFeed(client: Client, feed: FeedConfig, now: Date) {
  if (!feed.enabled || getFeedNextEligibleAt(feed, now.getTime()) > now.getTime()) {
    return;
  }

  if (!isWithinFeedAllowedWindow(feed, now.getTime())) {
    return;
  }

  const automationBlock = getAutomatedContentBlock(feed.channelId, "feed", now.getTime());

  if (automationBlock.blocked) {
    return;
  }

  const result = await pushManualContentToChannel(client, {
    channelId: feed.channelId,
    contentType: feed.contentType,
    topicOverride: feed.topicOverride,
    source: "feed",
  });

  if (!result.ok) {
    return;
  }

  recordFeedExecuted(feed.id, now.getTime());
  recordAutomatedContentSend(feed.channelId, "feed", now.getTime());
}

async function postDailyTriviaChallenge(client: Client, now: Date) {
  const config = getDailyTriviaChallengeConfig();

  if (!config || !config.enabled || !shouldRunDailyTriviaChallengeNow(config, now.getTime())) {
    return;
  }

  if (!isWithinDailyAllowedWindow(config.allowedWindow, now.getTime())) {
    logDailyTriviaChallengeWindowBlocked(config, now.getTime());
    return;
  }

  const automationBlock = getAutomatedContentBlock(config.channelId, "daily-challenge", now.getTime());

  if (automationBlock.blocked) {
    return;
  }

  const result = await pushManualContentToChannel(client, {
    channelId: config.channelId,
    contentType: "trivia",
    topicOverride: config.topicOverride,
    source: "daily-challenge",
    triviaPresentation: {
      variant: "daily-challenge",
    },
  });

  if (!result.ok) {
    return;
  }

  recordDailyTriviaChallengeExecuted(now.getTime());
  recordAutomatedContentSend(config.channelId, "daily-challenge", now.getTime());
}

export function startScheduler(client: Client) {
  for (const schedule of schedules) {
    if (hasDailyTime(schedule)) {
      setInterval(async () => {
        const now = new Date();

        if (now.getHours() !== schedule.hour || now.getMinutes() !== schedule.minute) {
          return;
        }

        try {
          await postScheduledContent(client, schedule, now);
        } catch (error) {
          console.error(
            `Error posting scheduled ${schedule.contentType} to channel ${schedule.channelId}:`,
            error,
          );
        }
      }, 30 * 1000);

      continue;
    }

    if (!schedule.intervalMinutes) {
      continue;
    }

    const intervalMs = schedule.intervalMinutes * 60 * 1000;

    setInterval(async () => {
      try {
        await postScheduledContent(client, schedule, new Date());
      } catch (error) {
        console.error(
          `Error posting scheduled ${schedule.contentType} to channel ${schedule.channelId}:`,
          error,
        );
      }
    }, intervalMs);
  }

  setInterval(async () => {
    const now = new Date();

    for (const feed of getFeedConfigs()) {
      try {
        await postManagedFeed(client, feed, now);
      } catch (error) {
        console.error(
          `Error posting managed feed ${feed.id} ${feed.contentType} to channel ${feed.channelId}:`,
          error,
        );
      }
    }

    try {
      await postDailyTriviaChallenge(client, now);
    } catch (error) {
      console.error("Error posting Daily Trivia Challenge:", error);
    }

    try {
      await evaluatePassiveChatChannels(client, now.getTime());
    } catch (error) {
      console.error("Error evaluating passive chat automation:", error);
    }
  }, 30 * 1000);
}
