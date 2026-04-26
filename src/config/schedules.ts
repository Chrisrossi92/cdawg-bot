import type { ContentType } from "../lib/content.js";

export type Schedule = {
  channelId: string;
  contentType: ContentType;
  intervalMinutes?: number;
  hour?: number;
  minute?: number;
};

export const schedules: Schedule[] = [
  {
    channelId: "1480394568917585990",
    contentType: "history",
    hour: 10,
    minute: 0,
  },
  {
    channelId: "1480388771001139302",
    contentType: "trivia",
    hour: 14,
    minute: 0,
  },
  {
    channelId: "1480395108317921402",
    contentType: "prompt",
    hour: 18,
    minute: 0,
  },
  {
    channelId: "1463685992782237890",
    contentType: "prompt",
    hour: 20,
    minute: 0,
  },
];
