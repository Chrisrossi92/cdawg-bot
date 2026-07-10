import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { schedules, type Schedule } from "../config/schedules.js";
import { getThisDayInHistoryEvents } from "../lib/history-content.js";
import { getChannelOperationalStatus } from "./channel-operations.js";
import { getRecentAutomationActivity } from "./automation-activity.js";

type DailyHistoryPostStore = {
  postedDateByScheduleKey: Record<string, string>;
};

export type DailyHistoryStatusState = "running" | "paused" | "needs-setup";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "daily-history-posts.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeStore(value: unknown): DailyHistoryPostStore {
  if (!isRecord(value) || !isRecord(value.postedDateByScheduleKey)) {
    return {
      postedDateByScheduleKey: {},
    };
  }

  return {
    postedDateByScheduleKey: Object.fromEntries(
      Object.entries(value.postedDateByScheduleKey).filter(
        (entry): entry is [string, string] => Boolean(entry[0]) && typeof entry[1] === "string",
      ),
    ),
  };
}

function loadStore(): DailyHistoryPostStore {
  try {
    return sanitizeStore(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[daily-history] could not load state from ${DATA_FILE}.`, error);
    }

    return {
      postedDateByScheduleKey: {},
    };
  }
}

function saveStore(store: DailyHistoryPostStore) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(store, null, 2));
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[daily-history] could not save state to ${DATA_FILE}.`, error);
  }
}

function getLocalDateKey(now: Date) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hasDailyHistoryTime(schedule: Schedule): schedule is Schedule & { hour: number; minute: number } {
  return schedule.contentType === "history" && typeof schedule.hour === "number" && typeof schedule.minute === "number";
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

const activeStore = loadStore();

export function getDailyHistorySchedule() {
  return schedules.find(hasDailyHistoryTime) ?? null;
}

export function getDailyHistoryScheduleKey(schedule: Pick<Schedule, "channelId" | "contentType">) {
  return `${schedule.channelId}:${schedule.contentType}`;
}

export function wasDailyHistoryPostedForDate(schedule: Schedule, now = new Date()) {
  return activeStore.postedDateByScheduleKey[getDailyHistoryScheduleKey(schedule)] === getLocalDateKey(now);
}

export function recordDailyHistoryPosted(schedule: Schedule, postedAt = new Date()) {
  activeStore.postedDateByScheduleKey[getDailyHistoryScheduleKey(schedule)] = getLocalDateKey(postedAt);
  saveStore(activeStore);
}

export function getDailyHistoryStatus(now = Date.now()) {
  const schedule = getDailyHistorySchedule();

  if (!schedule) {
    return {
      state: "needs-setup" as const,
      configured: false,
      destinationChannelId: null,
      dailyTime: null,
      nextScheduledPostAt: null,
      lastResult: null,
      contentSource: "not-configured" as const,
      todayEventCount: 0,
      fallback: "history-fact" as const,
      blockedReason: "not-configured" as const,
      globalAutomationEnabled: null,
      channelAutomationEnabled: null,
      effectiveAutomationEnabled: null,
    };
  }

  const operationalStatus = getChannelOperationalStatus(schedule.channelId, now);
  const currentDate = new Date(now);
  const todayEventCount = getThisDayInHistoryEvents(currentDate).length;
  const lastResult =
    getRecentAutomationActivity(100).find(
      (item) =>
        item.source === "scheduler" &&
        item.contentType === "history" &&
        item.channelId === schedule.channelId &&
        (item.status === "success" || item.status === "failure"),
    ) ?? null;
  const blockedReason = !operationalStatus.globalAutomationEnabled
    ? "global-disabled"
    : !operationalStatus.channelAutomationEnabled
      ? "disabled"
      : operationalStatus.isSilenced
        ? "silenced"
        : operationalStatus.isCoolingDown
          ? "cooldown"
          : operationalStatus.skipNextSend
            ? "skip-next"
            : null;

  return {
    state: blockedReason ? ("paused" as const) : ("running" as const),
    configured: true,
    destinationChannelId: schedule.channelId,
    dailyTime: `${String(schedule.hour).padStart(2, "0")}:${String(schedule.minute).padStart(2, "0")}`,
    nextScheduledPostAt: getNextDailyRunAt(schedule, now),
    lastResult,
    contentSource: todayEventCount > 0 ? ("this-day-in-history" as const) : ("history-fact-fallback" as const),
    todayEventCount,
    fallback: "history-fact" as const,
    blockedReason,
    blockedUntil: operationalStatus.nextEligibleAt,
    globalAutomationEnabled: operationalStatus.globalAutomationEnabled,
    channelAutomationEnabled: operationalStatus.channelAutomationEnabled,
    effectiveAutomationEnabled: operationalStatus.isAutomationEnabled,
    alreadyPostedToday: wasDailyHistoryPostedForDate(schedule, currentDate),
  };
}
