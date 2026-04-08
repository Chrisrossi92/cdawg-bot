import { contentProviderConfig } from "../config/content-provider.js";
import type { ContentType } from "./content-provider.js";

type ContentProviderLogDetails = {
  channelId?: string | undefined;
  topic?: string | undefined;
  provider?: string | undefined;
  reason?: string | undefined;
  itemKey?: string | undefined;
  sourceTopic?: string | undefined;
};

export function logContentProviderEvent(
  contentType: ContentType,
  event: string,
  details: ContentProviderLogDetails = {},
) {
  if (!contentProviderConfig.debugLogging) {
    return;
  }

  const parts = [`type=${contentType}`, `event=${event}`];

  if (details.provider) {
    parts.push(`provider=${details.provider}`);
  }

  if (details.topic) {
    parts.push(`topic=${details.topic}`);
  }

  if (details.sourceTopic) {
    parts.push(`sourceTopic=${details.sourceTopic}`);
  }

  if (details.channelId) {
    parts.push(`channel=${details.channelId}`);
  }

  if (details.reason) {
    parts.push(`reason=${details.reason}`);
  }

  if (details.itemKey) {
    parts.push(`itemKey=${details.itemKey}`);
  }

  console.log(`[content-provider] ${parts.join(" ")}`);
}
