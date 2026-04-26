import { thisDayInHistoryByDate, type ThisDayInHistoryEvent } from "../content/history/this-day.js";
import { getLastHistoryItem, getRecentHistoryItemIds, isHistoryItemRecentlyUsed } from "./content.js";

function formatMonthDayKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

export function getThisDayInHistoryDateKey(date = new Date()) {
  return formatMonthDayKey(date);
}

export function getThisDayInHistoryDateLabel(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export function getThisDayInHistoryEvents(date = new Date()): readonly ThisDayInHistoryEvent[] {
  return thisDayInHistoryByDate[getThisDayInHistoryDateKey(date)] ?? [];
}

export function formatThisDayInHistoryYear(year: number) {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }

  return String(year);
}

export function formatThisDayInHistoryMessage(event: ThisDayInHistoryEvent, date = new Date()) {
  const dateLabel = getThisDayInHistoryDateLabel(date);
  const yearLabel = formatThisDayInHistoryYear(event.year);

  return [
    `📅 **This Day in History - ${dateLabel}**`,
    `🚀 **${yearLabel} - ${event.title}**`,
    event.summary,
    "",
    `**Why it matters:** ${event.impact}`,
    `🔎 Learn more: ${event.link}`,
  ].join("\n");
}

function getPreviewStateKey(channelId: string, dateKey: string) {
  return `${channelId}:${dateKey}`;
}

const previewEventIdByChannelDateKey = new Map<string, string>();

export function getHistoryEventById(eventId: string, date = new Date()) {
  return getThisDayInHistoryEvents(date).find((event) => event.id === eventId) ?? null;
}

export function getHistoryPreviewEvent(
  channelId: string,
  date = new Date(),
  options?: { reroll?: boolean },
) {
  const dateKey = getThisDayInHistoryDateKey(date);
  const events = getThisDayInHistoryEvents(date);

  if (events.length === 0) {
    return null;
  }

  const previewStateKey = getPreviewStateKey(channelId, dateKey);
  const currentPreviewId = previewEventIdByChannelDateKey.get(previewStateKey);
  const currentPreview = currentPreviewId ? events.find((event) => event.id === currentPreviewId) ?? null : null;

  if (currentPreview && !options?.reroll) {
    return currentPreview;
  }

  const recentIds = new Set(getRecentHistoryItemIds(channelId));
  const recentFilteredEvents = events.filter((event) => !recentIds.has(event.id));
  const basePool = recentFilteredEvents.length > 0 ? recentFilteredEvents : events;
  const rerollPool =
    options?.reroll && currentPreview && basePool.length > 1
      ? basePool.filter((event) => event.id !== currentPreview.id)
      : basePool;
  const selectionPool = rerollPool.length > 0 ? rerollPool : basePool;
  const nextPreview = selectionPool[Math.floor(Math.random() * selectionPool.length)] ?? events[0] ?? null;

  if (!nextPreview) {
    return null;
  }

  previewEventIdByChannelDateKey.set(previewStateKey, nextPreview.id);
  return nextPreview;
}

export function getHistoryReviewSnapshot(channelId: string, date = new Date()) {
  const dateKey = getThisDayInHistoryDateKey(date);
  const previewEvent = getHistoryPreviewEvent(channelId, date);
  const allEventsForDate = getThisDayInHistoryEvents(date);
  const lastPostedEvent = getLastHistoryItem(channelId);

  return {
    channelId,
    dateKey,
    dateLabel: getThisDayInHistoryDateLabel(date),
    totalEventsForDate: allEventsForDate.length,
    recentHistoryItemIds: getRecentHistoryItemIds(channelId),
    previewEvent,
    previewEventRecentlyUsed: previewEvent ? isHistoryItemRecentlyUsed(previewEvent.id, channelId) : false,
    lastPostedEvent,
    lastPostedEventRecentlyUsed: lastPostedEvent ? isHistoryItemRecentlyUsed(lastPostedEvent.id, channelId) : false,
  };
}
