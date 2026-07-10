import assert from "node:assert/strict";
import { getSchedulerRegistrations } from "../src/scheduler/scheduler.js";
import { formatHistoryFactMessage } from "../src/lib/content.js";
import { getThisDayInHistoryEvents } from "../src/lib/history-content.js";
import { getDailyHistorySchedule, getDailyHistoryStatus } from "../src/systems/daily-history.js";

const historySchedule = getDailyHistorySchedule();

assert.ok(historySchedule, "daily history schedule should be configured");
assert.equal(historySchedule.channelId, "1480394568917585990");
assert.equal(historySchedule.contentType, "history");
assert.equal(historySchedule.hour, 10);
assert.equal(historySchedule.minute, 0);

assert.ok(
  getSchedulerRegistrations().some(
    (registration) =>
      registration.source === "scheduler" &&
      registration.cadence === "daily" &&
      registration.channelId === historySchedule.channelId &&
      registration.contentType === "history" &&
      registration.hour === 10 &&
      registration.minute === 0,
  ),
  "scheduler registrations should include the daily history post",
);

const status = getDailyHistoryStatus(new Date("2026-07-10T09:00:00").getTime());
assert.equal(status.state, "running");
assert.equal(status.destinationChannelId, "1480394568917585990");
assert.equal(status.dailyTime, "10:00");
assert.equal(status.contentSource, "history-fact-fallback");
assert.equal(getThisDayInHistoryEvents(new Date("2026-07-10T09:00:00")).length, 0);
assert.match(formatHistoryFactMessage("History fact fallback works."), /Daily History/);
