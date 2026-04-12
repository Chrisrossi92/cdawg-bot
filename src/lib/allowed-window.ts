export type DailyAllowedWindow = {
  startTime: string;
  endTime: string;
};

function getMinutesSinceMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function parseWindowMinutes(time: string) {
  const parts = time.split(":");
  const hours = Number(parts[0] ?? 0);
  const minutes = Number(parts[1] ?? 0);
  return hours * 60 + minutes;
}

export function isWithinDailyAllowedWindow(window: DailyAllowedWindow | null, now = Date.now()) {
  if (!window) {
    return true;
  }

  const date = new Date(now);
  const nowMinutes = getMinutesSinceMidnight(date);
  const startMinutes = parseWindowMinutes(window.startTime);
  const endMinutes = parseWindowMinutes(window.endTime);

  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

export function getDailyAllowedWindowNextStartAt(window: DailyAllowedWindow | null, now = Date.now()) {
  if (!window) {
    return null;
  }

  const date = new Date(now);
  const nowMinutes = getMinutesSinceMidnight(date);
  const startMinutes = parseWindowMinutes(window.startTime);
  const endMinutes = parseWindowMinutes(window.endTime);
  const nextStart = new Date(now);
  nextStart.setSeconds(0, 0);

  if (startMinutes < endMinutes) {
    if (nowMinutes < startMinutes) {
      nextStart.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
      return nextStart.getTime();
    }

    nextStart.setDate(nextStart.getDate() + 1);
    nextStart.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
    return nextStart.getTime();
  }

  if (nowMinutes >= startMinutes || nowMinutes < endMinutes) {
    return now;
  }

  nextStart.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
  return nextStart.getTime();
}

export function getDailyAllowedWindowBlockedUntil(window: DailyAllowedWindow | null, now = Date.now()) {
  if (!window) {
    return null;
  }

  if (isWithinDailyAllowedWindow(window, now)) {
    return null;
  }

  return getDailyAllowedWindowNextStartAt(window, now);
}
