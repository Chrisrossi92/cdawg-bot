import type { Client } from "discord.js";
import { schedules, type Schedule } from "../config/schedules.js";
import { getContentMessage, resolveTopic } from "../lib/content.js";

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

  const topic = resolveTopic(null, schedule.channelId);
  const message = getContentMessage(schedule.contentType, topic, schedule.channelId);

  if (!message) {
    return;
  }

  const channel = await client.channels.fetch(schedule.channelId);

  if (!channel || !channel.isTextBased() || !("send" in channel)) {
    return;
  }

  await channel.send(message);
  lastPostedMinuteBySchedule.set(scheduleKey, minuteWindowKey);
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
}
