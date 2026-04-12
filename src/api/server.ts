import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { apiConfig } from "../config/api.js";
import type { ContentType } from "../lib/content-provider.js";
import { manualPushContentTypes, type ManualPushContentType, type ManualContentPushResult } from "../lib/manual-content-push.js";
import { topics, type Topic } from "../config/topics.js";
import { getBotMetrics } from "../systems/bot-metrics.js";
import { getBotSettings, updateBotSettings } from "../systems/bot-settings.js";

type ApiHealthSnapshot = {
  botReady: boolean;
  botTag: string | null;
};

type ApiServerDependencies = {
  getHealthSnapshot: () => ApiHealthSnapshot;
  pushManualContent: (request: { channelId: string; contentType: ManualPushContentType; topicOverride?: Topic | null }) => Promise<ManualContentPushResult>;
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
          const statusCode = result.code === "CONTENT_UNAVAILABLE" ? 404 : result.code === "BOT_NOT_READY" ? 503 : 400;
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
