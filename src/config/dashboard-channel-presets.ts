import { channelTopics } from "./channel-topics.js";
import type { Topic } from "./topics.js";

export type DashboardChannelPreset = {
  channelId: string;
  label: string;
  defaultTopic?: Topic;
};

const presetLabelsByChannelId: Record<string, string> = {
  "1480394568917585990": "History Content Channel",
  "1480394876502937661": "Genealogy Content Channel",
  "1480395108317921402": "Pokemon Content Channel",
  "1480395367546748938": "Harry Potter Content Channel",
  "1480402034464260186": "True Crime Content Channel",
  "1482034986537455626": "Music Content Channel",
  "1480388771001139302": "General Trivia Channel",
  "1463685992782237890": "General Prompt Channel",
  "1463686052509388894": "Palworld Community Chat",
  "1482887724871712788": "Valheim Community Chat",
  "1468627019742052474": "General Chat",
};

export const dashboardChannelPresets: DashboardChannelPreset[] = Object.entries(channelTopics)
  .map(([channelId, defaultTopic]) => ({
    channelId,
    label: presetLabelsByChannelId[channelId] ?? `Channel ${channelId}`,
    defaultTopic,
  }))
  .sort((left, right) => left.label.localeCompare(right.label));
