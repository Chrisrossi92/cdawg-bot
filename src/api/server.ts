import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { apiConfig } from "../config/api.js";
import { dashboardChannelPresets } from "../config/dashboard-channel-presets.js";
import type { DailyAllowedWindow } from "../lib/allowed-window.js";
import type { ContentType } from "../lib/content-provider.js";
import {
  manualPushContentTypes,
  type ManualPushContentType,
  type ManualContentPushResult,
  type TriggerAutomatedContentNowResult,
} from "../lib/manual-content-push.js";
import { getTriviaTopicEligibility } from "../lib/trivia-topic-eligibility.js";
import { topics, type Topic } from "../config/topics.js";
import {
  clearChannelSkipNextSend,
  getChannelOperationalStates,
  resumeChannelAutomation,
  setChannelSkipNextSend,
  setChannelManualCooldown,
  setChannelSilenced,
} from "../systems/channel-operations.js";
import { getChannelAutomationStatuses } from "../systems/channel-automation-status.js";
import { getBotMetrics } from "../systems/bot-metrics.js";
import { getBotSettings, updateBotSettings } from "../systems/bot-settings.js";
import {
  createFeedConfig,
  deleteFeedConfig,
  getFeedConfig,
  getFeedConfigs,
  getFeedNextEligibleAt,
  getFeedOverlapWarnings,
  getFeedWindowBlockedUntil,
  isWithinFeedAllowedWindow,
  setFeedEnabled,
  updateFeedConfig,
  type FeedAllowedWindow,
} from "../systems/feed-configs.js";
import { getChannelOperationalStatus } from "../systems/channel-operations.js";
import {
  getDailyTriviaChallengeConfig,
  getDailyTriviaChallengeStatus,
  updateDailyTriviaChallengeConfig,
  upsertDailyTriviaChallengeConfig,
} from "../systems/daily-trivia-challenge.js";
import { getDogStatusSummary } from "../systems/cdawg-dog.js";

type ApiHealthSnapshot = {
  botReady: boolean;
  botTag: string | null;
};

type ApiServerDependencies = {
  getHealthSnapshot: () => ApiHealthSnapshot;
  pushManualContent: (request: { channelId: string; contentType: ManualPushContentType; topicOverride?: Topic | null }) => Promise<ManualContentPushResult>;
  triggerAutomatedContentNow: (request: { channelId: string }) => Promise<TriggerAutomatedContentNowResult>;
};

type SettingsPatchBody = {
  passiveChat?: {
    enabled?: boolean;
    debugLogging?: boolean;
    eligibleChannelIds?: string[];
    globalCooldownMs?: number;
    channelCooldownMs?: number;
    triggerChance?: number;
    minNonSpaceChars?: number;
    minWordCount?: number;
    recentReplyMemorySize?: number;
    recentMessageMemorySize?: number;
    quietChannelThresholdMs?: number;
    conversationNudgeMessageThreshold?: number;
    topicBiasMinimumMatches?: number;
    conversationNudgeContentTypes?: ContentType[];
  };
  contentProviders?: {
    debugLogging?: boolean;
  };
};

const allowedContentTypes: readonly ContentType[] = ["fact", "joke", "wyr", "prompt", "trivia"];
const defaultHealthSnapshot: ApiHealthSnapshot = {
  botReady: true,
  botTag: null,
};
const discordSnowflakePattern = /^\d{17,20}$/;

type ManualPushRequestBody = {
  channelId: string;
  contentType: ManualPushContentType;
  topicOverride?: Topic;
};

type ManualPushValidationResult =
  | {
      ok: true;
      value: ManualPushRequestBody;
    }
  | {
      ok: false;
      error: string;
    };

type ChannelOperationRequestBody = {
  channelId: string;
  durationMs?: number;
};

type FeedRequestBody = {
  id?: string;
  enabled?: boolean;
  channelId?: string;
  contentType?: ContentType;
  cadenceMinutes?: number;
  topicOverride?: Topic | null;
  allowedWindow?: FeedAllowedWindow | null;
};

type DailyTriviaChallengeRequestBody = {
  enabled?: boolean;
  channelId?: string;
  dailyTime?: string;
  topicOverride?: Topic | null;
  allowedWindow?: DailyAllowedWindow | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function sendMethodNotAllowed(response: ServerResponse) {
  sendJson(response, 405, {
    error: "Method not allowed.",
  });
}

function sendNotFound(response: ServerResponse) {
  sendJson(response, 404, {
    error: "Not found.",
  });
}

function sendUnsupportedRoute(response: ServerResponse) {
  sendJson(response, 503, {
    error: "Manual push route is unavailable.",
  });
}

function sanitizeSettingsPatch(value: unknown): SettingsPatchBody | null {
  if (!isRecord(value)) {
    return null;
  }

  const nextPatch: SettingsPatchBody = {};

  if (isRecord(value.passiveChat)) {
    const passiveChatPatch: NonNullable<SettingsPatchBody["passiveChat"]> = {};

    if ("enabled" in value.passiveChat && typeof value.passiveChat.enabled === "boolean") {
      passiveChatPatch.enabled = value.passiveChat.enabled;
    }

    if ("debugLogging" in value.passiveChat && typeof value.passiveChat.debugLogging === "boolean") {
      passiveChatPatch.debugLogging = value.passiveChat.debugLogging;
    }

    if (
      "eligibleChannelIds" in value.passiveChat &&
      Array.isArray(value.passiveChat.eligibleChannelIds) &&
      value.passiveChat.eligibleChannelIds.every((entry) => typeof entry === "string")
    ) {
      passiveChatPatch.eligibleChannelIds = value.passiveChat.eligibleChannelIds;
    }

    const numericFields = [
      "globalCooldownMs",
      "channelCooldownMs",
      "triggerChance",
      "minNonSpaceChars",
      "minWordCount",
      "recentReplyMemorySize",
      "recentMessageMemorySize",
      "quietChannelThresholdMs",
      "conversationNudgeMessageThreshold",
      "topicBiasMinimumMatches",
    ] as const;

    for (const field of numericFields) {
      const nextValue = value.passiveChat[field];

      if (typeof nextValue === "number" && !Number.isNaN(nextValue)) {
        passiveChatPatch[field] = nextValue;
      }
    }

    if (
      "conversationNudgeContentTypes" in value.passiveChat &&
      Array.isArray(value.passiveChat.conversationNudgeContentTypes) &&
      value.passiveChat.conversationNudgeContentTypes.every(
        (entry): entry is ContentType => typeof entry === "string" && allowedContentTypes.includes(entry as ContentType),
      )
    ) {
      passiveChatPatch.conversationNudgeContentTypes = value.passiveChat.conversationNudgeContentTypes;
    }

    if (Object.keys(passiveChatPatch).length > 0) {
      nextPatch.passiveChat = passiveChatPatch;
    }
  }

  if (isRecord(value.contentProviders)) {
    const contentProviderPatch: NonNullable<SettingsPatchBody["contentProviders"]> = {};

    if ("debugLogging" in value.contentProviders && typeof value.contentProviders.debugLogging === "boolean") {
      contentProviderPatch.debugLogging = value.contentProviders.debugLogging;
    }

    if (Object.keys(contentProviderPatch).length > 0) {
      nextPatch.contentProviders = contentProviderPatch;
    }
  }

  return Object.keys(nextPatch).length > 0 ? nextPatch : null;
}

function sanitizeManualPushRequest(value: unknown): ManualPushValidationResult {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Manual push payload must be a JSON object.",
    };
  }

  const { channelId, contentType, topicOverride } = value;

  if (typeof channelId !== "string" || !discordSnowflakePattern.test(channelId)) {
    return {
      ok: false,
      error: "Invalid channel ID. Expected a Discord snowflake string.",
    };
  }

  if (typeof contentType !== "string" || !manualPushContentTypes.includes(contentType as ManualPushContentType)) {
    return {
      ok: false,
      error: `Unsupported content type. Allowed values: ${manualPushContentTypes.join(", ")}.`,
    };
  }

  if (topicOverride !== undefined && (typeof topicOverride !== "string" || !topics.includes(topicOverride as Topic))) {
    return {
      ok: false,
      error: `Invalid topic override. Allowed values: ${topics.join(", ")}.`,
    };
  }

  return {
    ok: true,
    value: {
      channelId,
      contentType: contentType as ManualPushContentType,
      ...(topicOverride ? { topicOverride: topicOverride as Topic } : {}),
    },
  };
}

function sanitizeChannelOperationRequest(value: unknown, requireDuration: boolean) {
  if (!isRecord(value)) {
    return {
      ok: false as const,
      error: "Channel operation payload must be a JSON object.",
    };
  }

  if (typeof value.channelId !== "string" || !discordSnowflakePattern.test(value.channelId)) {
    return {
      ok: false as const,
      error: "Invalid channel ID. Expected a Discord snowflake string.",
    };
  }

  if (!requireDuration) {
    return {
      ok: true as const,
      value: {
        channelId: value.channelId,
      } satisfies ChannelOperationRequestBody,
    };
  }

  if (typeof value.durationMs !== "number" || !Number.isFinite(value.durationMs) || value.durationMs < 1000) {
    return {
      ok: false as const,
      error: "Invalid duration. Expected a number of at least 1000 milliseconds.",
    };
  }

  return {
    ok: true as const,
    value: {
      channelId: value.channelId,
      durationMs: Math.floor(value.durationMs),
    } satisfies ChannelOperationRequestBody,
  };
}

function sanitizeFeedRequest(value: unknown, requireId: boolean, requireFullConfig: boolean) {
  if (!isRecord(value)) {
    return {
      ok: false as const,
      error: "Feed payload must be a JSON object.",
    };
  }

  const nextValue: FeedRequestBody = {};

  if (requireId || "id" in value) {
    if (typeof value.id !== "string" || value.id.trim().length === 0) {
      return {
        ok: false as const,
        error: "Invalid feed ID.",
      };
    }

    nextValue.id = value.id.trim();
  }

  if (requireFullConfig || "enabled" in value) {
    if (typeof value.enabled !== "boolean") {
      return {
        ok: false as const,
        error: "Invalid enabled flag.",
      };
    }

    nextValue.enabled = value.enabled;
  }

  if (requireFullConfig || "channelId" in value) {
    if (typeof value.channelId !== "string" || !discordSnowflakePattern.test(value.channelId)) {
      return {
        ok: false as const,
        error: "Invalid channel ID. Expected a Discord snowflake string.",
      };
    }

    nextValue.channelId = value.channelId;
  }

  if (requireFullConfig || "contentType" in value) {
    if (typeof value.contentType !== "string" || !allowedContentTypes.includes(value.contentType as ContentType)) {
      return {
        ok: false as const,
        error: `Unsupported content type. Allowed values: ${allowedContentTypes.join(", ")}.`,
      };
    }

    nextValue.contentType = value.contentType as ContentType;
  }

  if (requireFullConfig || "cadenceMinutes" in value) {
    if (typeof value.cadenceMinutes !== "number" || !Number.isFinite(value.cadenceMinutes) || value.cadenceMinutes < 1) {
      return {
        ok: false as const,
        error: "Invalid cadence minutes. Expected a number of at least 1.",
      };
    }

    nextValue.cadenceMinutes = Math.floor(value.cadenceMinutes);
  }

  if ("topicOverride" in value) {
    if (value.topicOverride !== null && (typeof value.topicOverride !== "string" || !topics.includes(value.topicOverride as Topic))) {
      return {
        ok: false as const,
        error: `Invalid topic override. Allowed values: ${topics.join(", ")}.`,
      };
    }

    nextValue.topicOverride = value.topicOverride as Topic | null;
  }

  if ("allowedWindow" in value) {
    if (value.allowedWindow !== null && !isRecord(value.allowedWindow)) {
      return {
        ok: false as const,
        error: "Invalid allowed window.",
      };
    }

    if (value.allowedWindow === null) {
      nextValue.allowedWindow = null;
    } else {
      const startTime = typeof value.allowedWindow.startTime === "string" ? value.allowedWindow.startTime.trim() : "";
      const endTime = typeof value.allowedWindow.endTime === "string" ? value.allowedWindow.endTime.trim() : "";

      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(startTime) || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(endTime) || startTime === endTime) {
        return {
          ok: false as const,
          error: "Invalid allowed window. Expected daily HH:MM start/end values.",
        };
      }

      nextValue.allowedWindow = {
        startTime,
        endTime,
      };
    }
  }

  if (Object.keys(nextValue).length === 0) {
    return {
      ok: false as const,
      error: "No feed fields were provided.",
    };
  }

  return {
    ok: true as const,
    value: nextValue,
  };
}

function sanitizeDailyTriviaChallengeRequest(value: unknown, requireFullConfig: boolean) {
  if (!isRecord(value)) {
    return {
      ok: false as const,
      error: "Daily trivia payload must be a JSON object.",
    };
  }

  const nextValue: DailyTriviaChallengeRequestBody = {};

  if (requireFullConfig || "enabled" in value) {
    if (typeof value.enabled !== "boolean") {
      return {
        ok: false as const,
        error: "Invalid enabled flag.",
      };
    }

    nextValue.enabled = value.enabled;
  }

  if (requireFullConfig || "channelId" in value) {
    if (typeof value.channelId !== "string" || !discordSnowflakePattern.test(value.channelId)) {
      return {
        ok: false as const,
        error: "Invalid channel ID. Expected a Discord snowflake string.",
      };
    }

    nextValue.channelId = value.channelId;
  }

  if (requireFullConfig || "dailyTime" in value) {
    if (typeof value.dailyTime !== "string" || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(value.dailyTime.trim())) {
      return {
        ok: false as const,
        error: "Invalid daily time. Expected a local HH:MM value.",
      };
    }

    nextValue.dailyTime = value.dailyTime.trim();
  }

  if ("topicOverride" in value) {
    if (value.topicOverride !== null && (typeof value.topicOverride !== "string" || !topics.includes(value.topicOverride as Topic))) {
      return {
        ok: false as const,
        error: `Invalid topic override. Allowed values: ${topics.join(", ")}.`,
      };
    }

    nextValue.topicOverride = value.topicOverride as Topic | null;
  }

  if ("allowedWindow" in value) {
    if (value.allowedWindow !== null && !isRecord(value.allowedWindow)) {
      return {
        ok: false as const,
        error: "Invalid allowed window.",
      };
    }

    if (value.allowedWindow === null) {
      nextValue.allowedWindow = null;
    } else {
      const startTime = typeof value.allowedWindow.startTime === "string" ? value.allowedWindow.startTime.trim() : "";
      const endTime = typeof value.allowedWindow.endTime === "string" ? value.allowedWindow.endTime.trim() : "";

      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(startTime) || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(endTime) || startTime === endTime) {
        return {
          ok: false as const,
          error: "Invalid allowed window. Expected daily HH:MM start/end values.",
        };
      }

      nextValue.allowedWindow = {
        startTime,
        endTime,
      };
    }
  }

  if (Object.keys(nextValue).length === 0) {
    return {
      ok: false as const,
      error: "No daily trivia fields were provided.",
    };
  }

  return {
    ok: true as const,
    value: nextValue,
  };
}

function buildFeedResponse(feedId: string) {
  const feed = getFeedConfig(feedId);

  if (!feed) {
    return null;
  }

  const operationalStatus = getChannelOperationalStatus(feed.channelId);
  const outsideAllowedWindow = !isWithinFeedAllowedWindow(feed);
  const allowedWindowBlockedUntil = outsideAllowedWindow ? getFeedWindowBlockedUntil(feed) : null;
  const preset = dashboardChannelPresets.find((entry) => entry.channelId === feed.channelId);
  const triviaEligibility = feed.contentType === "trivia" ? getTriviaTopicEligibility(feed.channelId, feed.topicOverride) : null;
  const blockedReason = operationalStatus.isSilenced
    ? "silenced"
    : operationalStatus.isCoolingDown
      ? "cooldown"
      : operationalStatus.skipNextSend
        ? "skip-next"
        : outsideAllowedWindow
          ? "outside-window"
          : triviaEligibility && !triviaEligibility.ok
            ? "trivia-ineligible"
        : null;
  const blockedUntil = operationalStatus.isSilenced
    ? operationalStatus.silencedUntil
    : operationalStatus.isCoolingDown
      ? operationalStatus.cooldownUntil
      : outsideAllowedWindow
        ? allowedWindowBlockedUntil
      : null;
  const nextRunAt = blockedUntil ? Math.max(getFeedNextEligibleAt(feed), blockedUntil) : getFeedNextEligibleAt(feed);

  return {
    ...feed,
    nextEligibleAt: getFeedNextEligibleAt(feed),
    nextRunAt,
    blockedReason,
    blockedUntil,
    triviaEligibility,
    overlapWarnings: getFeedOverlapWarnings(feed),
    channelLabel: preset?.label ?? feed.channelId,
    presetTopic: preset?.defaultTopic ?? null,
  };
}

function buildDailyTriviaChallengeResponse() {
  const config = getDailyTriviaChallengeConfig();
  const status = getDailyTriviaChallengeStatus();

  if (!config || !status) {
    return null;
  }

  const preset = dashboardChannelPresets.find((entry) => entry.channelId === config.channelId);
  const triviaEligibility = getTriviaTopicEligibility(config.channelId, config.topicOverride);

  return {
    ...status,
    blockedReason: status.blockedReason ?? (!triviaEligibility.ok ? "trivia-ineligible" : null),
    triviaEligibility,
    channelLabel: preset?.label ?? config.channelId,
    presetTopic: preset?.defaultTopic ?? null,
  };
}

function buildDogResponse() {
  return {
    dog: getDogStatusSummary(),
  };
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;

    if (totalBytes > apiConfig.maxRequestBodyBytes) {
      throw new Error("BODY_TOO_LARGE");
    }

    chunks.push(buffer);
  }

  const bodyText = Buffer.concat(chunks).toString("utf8");

  if (!bodyText.trim()) {
    throw new Error("EMPTY_BODY");
  }

  return JSON.parse(bodyText) as unknown;
}

export function startApiServer(dependencies?: ApiServerDependencies) {
  if (!apiConfig.enabled) {
    return null;
  }

  const getHealthSnapshot = dependencies?.getHealthSnapshot ?? (() => defaultHealthSnapshot);
  const pushManualContent = dependencies?.pushManualContent;
  const triggerAutomatedContentNow = dependencies?.triggerAutomatedContentNow;

  const server = http.createServer(async (request, response) => {
    const method = request.method ?? "GET";
    const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

    try {
      if (method === "OPTIONS") {
        response.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        });
        response.end();
        return;
      }

      if (requestUrl.pathname === "/health") {
        if (method !== "GET") {
          sendMethodNotAllowed(response);
          return;
        }

        sendJson(response, 200, {
          ok: true,
          apiEnabled: true,
          ...getHealthSnapshot(),
        });
        return;
      }

      if (requestUrl.pathname === "/api/settings") {
        if (method === "GET") {
          sendJson(response, 200, {
            settings: getBotSettings(),
          });
          return;
        }

        if (method === "POST") {
          const nextBody = await readJsonBody(request);
          const patch = sanitizeSettingsPatch(nextBody);

          if (!patch) {
            sendJson(response, 400, {
              error: "Invalid settings payload.",
            });
            return;
          }

          const settings = updateBotSettings(patch);
          sendJson(response, 200, {
            settings,
          });
          return;
        }

        sendMethodNotAllowed(response);
        return;
      }

      if (requestUrl.pathname === "/api/metrics") {
        if (method !== "GET") {
          sendMethodNotAllowed(response);
          return;
        }

        sendJson(response, 200, {
          metrics: getBotMetrics(),
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-presets") {
        if (method !== "GET") {
          sendMethodNotAllowed(response);
          return;
        }

        sendJson(response, 200, {
          channelPresets: dashboardChannelPresets,
        });
        return;
      }

      if (requestUrl.pathname === "/api/dog") {
        if (method !== "GET") {
          sendMethodNotAllowed(response);
          return;
        }

        sendJson(response, 200, buildDogResponse());
        return;
      }

      if (requestUrl.pathname === "/api/daily-trivia") {
        if (method !== "GET") {
          sendMethodNotAllowed(response);
          return;
        }

        sendJson(response, 200, {
          dailyTriviaChallenge: buildDailyTriviaChallengeResponse(),
        });
        return;
      }

      if (requestUrl.pathname === "/api/daily-trivia/update") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeDailyTriviaChallengeRequest(nextBody, true);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const currentConfig = getDailyTriviaChallengeConfig();
        const config = currentConfig
          ? updateDailyTriviaChallengeConfig({
              ...(validation.value.enabled !== undefined ? { enabled: validation.value.enabled } : {}),
              ...(validation.value.channelId ? { channelId: validation.value.channelId } : {}),
              ...(validation.value.dailyTime ? { dailyTime: validation.value.dailyTime } : {}),
              ...("topicOverride" in validation.value ? { topicOverride: validation.value.topicOverride ?? null } : {}),
              ...("allowedWindow" in validation.value ? { allowedWindow: validation.value.allowedWindow ?? null } : {}),
            })
          : upsertDailyTriviaChallengeConfig({
              enabled: validation.value.enabled ?? true,
              channelId: validation.value.channelId ?? "",
              dailyTime: validation.value.dailyTime ?? "09:00",
              topicOverride: validation.value.topicOverride ?? null,
              allowedWindow: validation.value.allowedWindow ?? null,
            });

        sendJson(response, 200, {
          dailyTriviaChallenge: config ? buildDailyTriviaChallengeResponse() : null,
        });
        return;
      }

      if (requestUrl.pathname === "/api/feeds") {
        if (method !== "GET") {
          sendMethodNotAllowed(response);
          return;
        }

        sendJson(response, 200, {
          feeds: getFeedConfigs()
            .map((feed) => buildFeedResponse(feed.id))
            .filter((feed): feed is NonNullable<ReturnType<typeof buildFeedResponse>> => Boolean(feed)),
        });
        return;
      }

      if (requestUrl.pathname === "/api/feeds/create") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeFeedRequest(nextBody, false, true);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const feed = createFeedConfig({
          enabled: validation.value.enabled ?? true,
          channelId: validation.value.channelId ?? "",
          contentType: validation.value.contentType ?? "prompt",
          cadenceMinutes: validation.value.cadenceMinutes ?? 60,
          topicOverride: validation.value.topicOverride ?? null,
          allowedWindow: validation.value.allowedWindow ?? null,
        });

        sendJson(response, 200, {
          feed: buildFeedResponse(feed.id),
        });
        return;
      }

      if (requestUrl.pathname === "/api/feeds/update") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeFeedRequest(nextBody, true, false);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const feed = updateFeedConfig(validation.value.id ?? "", {
          ...(validation.value.enabled !== undefined ? { enabled: validation.value.enabled } : {}),
          ...(validation.value.channelId ? { channelId: validation.value.channelId } : {}),
          ...(validation.value.contentType ? { contentType: validation.value.contentType } : {}),
          ...(validation.value.cadenceMinutes ? { cadenceMinutes: validation.value.cadenceMinutes } : {}),
          ...("topicOverride" in validation.value ? { topicOverride: validation.value.topicOverride ?? null } : {}),
          ...("allowedWindow" in validation.value ? { allowedWindow: validation.value.allowedWindow ?? null } : {}),
        });

        if (!feed) {
          sendJson(response, 404, {
            error: "Feed not found.",
          });
          return;
        }

        sendJson(response, 200, {
          feed: buildFeedResponse(feed.id),
        });
        return;
      }

      if (requestUrl.pathname === "/api/feeds/set-enabled") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeFeedRequest(nextBody, true, false);

        if (!validation.ok || typeof validation.value.enabled !== "boolean") {
          sendJson(response, 400, {
            error: validation.ok ? "Enabled flag is required." : validation.error,
          });
          return;
        }

        const feed = setFeedEnabled(validation.value.id ?? "", validation.value.enabled);

        if (!feed) {
          sendJson(response, 404, {
            error: "Feed not found.",
          });
          return;
        }

        sendJson(response, 200, {
          feed: buildFeedResponse(feed.id),
        });
        return;
      }

      if (requestUrl.pathname === "/api/feeds/delete") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeFeedRequest(nextBody, true, false);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const deleted = deleteFeedConfig(validation.value.id ?? "");

        if (!deleted) {
          sendJson(response, 404, {
            error: "Feed not found.",
          });
          return;
        }

        sendJson(response, 200, {
          ok: true,
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-operations") {
        if (method !== "GET") {
          sendMethodNotAllowed(response);
          return;
        }

        const channelIds = [
          ...new Set([
            ...dashboardChannelPresets.map((preset) => preset.channelId),
            ...getChannelOperationalStates().map((status) => status.channelId),
          ]),
        ];
        const channelOperations = getChannelOperationalStates(channelIds).map((status) => {
          const preset = dashboardChannelPresets.find((entry) => entry.channelId === status.channelId);
          return {
            ...status,
            label: preset?.label ?? status.channelId,
            defaultTopic: preset?.defaultTopic ?? null,
          };
        });

        sendJson(response, 200, {
          channelOperations,
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-automation-status") {
        if (method !== "GET") {
          sendMethodNotAllowed(response);
          return;
        }

        const channelIds = [
          ...new Set([
            ...dashboardChannelPresets.map((preset) => preset.channelId),
            ...getChannelOperationalStates().map((status) => status.channelId),
          ]),
        ];
        const channelAutomationStatuses = getChannelAutomationStatuses(channelIds).map((status) => {
          const preset = dashboardChannelPresets.find((entry) => entry.channelId === status.channelId);
          return {
            ...status,
            label: preset?.label ?? status.channelId,
            defaultTopic: preset?.defaultTopic ?? null,
          };
        });

        sendJson(response, 200, {
          channelAutomationStatuses,
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-operations/silence") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeChannelOperationRequest(nextBody, true);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const channelOperation = setChannelSilenced(
          validation.value.channelId,
          Date.now() + (validation.value.durationMs ?? 0),
        );
        sendJson(response, 200, {
          channelOperation,
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-operations/cooldown") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeChannelOperationRequest(nextBody, true);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const channelOperation = setChannelManualCooldown(
          validation.value.channelId,
          Date.now() + (validation.value.durationMs ?? 0),
        );
        sendJson(response, 200, {
          channelOperation,
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-operations/skip-next") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeChannelOperationRequest(nextBody, false);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const channelOperation = setChannelSkipNextSend(validation.value.channelId);
        sendJson(response, 200, {
          channelOperation,
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-operations/clear-skip-next") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeChannelOperationRequest(nextBody, false);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const channelOperation = clearChannelSkipNextSend(validation.value.channelId);
        sendJson(response, 200, {
          channelOperation,
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-operations/resume") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeChannelOperationRequest(nextBody, false);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const channelOperation = resumeChannelAutomation(validation.value.channelId);
        sendJson(response, 200, {
          channelOperation,
        });
        return;
      }

      if (requestUrl.pathname === "/api/channel-operations/trigger-now") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        if (!triggerAutomatedContentNow) {
          sendUnsupportedRoute(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const validation = sanitizeChannelOperationRequest(nextBody, false);

        if (!validation.ok) {
          sendJson(response, 400, {
            error: validation.error,
          });
          return;
        }

        const result = await triggerAutomatedContentNow({
          channelId: validation.value.channelId,
        });

        if (!result.ok) {
          const statusCode =
            result.code === "BOT_NOT_READY"
              ? 503
              : result.code === "CHANNEL_BLOCKED" || result.code === "NO_AUTOMATED_CONTENT_PLAN"
                ? 409
                : result.code === "CONTENT_UNAVAILABLE"
                  ? 404
                  : 400;
          sendJson(response, statusCode, result);
          return;
        }

        sendJson(response, 200, result);
        return;
      }

      if (requestUrl.pathname === "/api/actions/push-content") {
        if (method !== "POST") {
          sendMethodNotAllowed(response);
          return;
        }

        if (!pushManualContent) {
          sendUnsupportedRoute(response);
          return;
        }

        const nextBody = await readJsonBody(request);
        const manualPushValidation = sanitizeManualPushRequest(nextBody);

        if (!manualPushValidation.ok) {
          sendJson(response, 400, {
            error: manualPushValidation.error,
          });
          return;
        }

        const result = await pushManualContent(manualPushValidation.value);

        if (!result.ok) {
          const statusCode =
            result.code === "CONTENT_UNAVAILABLE"
              ? 404
              : result.code === "BOT_NOT_READY"
                ? 503
                : result.code === "TRIVIA_INELIGIBLE"
                  ? 409
                  : 400;
          sendJson(response, statusCode, result);
          return;
        }

        sendJson(response, 200, result);
        return;
      }

      sendNotFound(response);
    } catch (error) {
      if ((error as Error).message === "BODY_TOO_LARGE") {
        sendJson(response, 413, {
          error: "Request body too large.",
        });
        return;
      }

      if ((error as Error).message === "EMPTY_BODY" || error instanceof SyntaxError) {
        sendJson(response, 400, {
          error: "Invalid JSON body.",
        });
        return;
      }

      console.error("[api] request failed:", error);
      sendJson(response, 500, {
        error: "Internal server error.",
      });
    }
  });

  server.on("error", (error) => {
    console.error("[api] server error:", error);
  });

  server.listen(apiConfig.port, apiConfig.host, () => {
    console.log(`[api] listening on http://${apiConfig.host}:${apiConfig.port}`);
  });

  return server;
}
