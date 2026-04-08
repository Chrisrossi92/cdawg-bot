import { factProviderConfig } from "../config/fact-provider.js";
import type { ContentProvider, ContentProviderRequest, ContentProviderResult, ContentType } from "./content-provider.js";
import { logContentProviderEvent } from "./content-provider-logging.js";

type FactApiResponse = {
  id?: string;
  text?: string;
  permalink?: string;
  source?: string;
  source_url?: string;
  language?: string;
};

const recentApiFactKeys: string[] = [];

function rememberRecentApiFact(factKey: string) {
  const nextKeys = [...recentApiFactKeys.filter((key) => key !== factKey), factKey];
  recentApiFactKeys.splice(0, recentApiFactKeys.length, ...nextKeys.slice(-factProviderConfig.recentApiFactMemorySize));
}

function buildFactApiUrl() {
  const url = new URL(factProviderConfig.apiBaseUrl);
  url.searchParams.set("language", factProviderConfig.apiLanguage);
  return url;
}

function getFactTextFromResponse(response: FactApiResponse) {
  const factText = response.text?.trim();
  return factText && factText.length > 0 ? factText : undefined;
}

function getApiFactKey(response: FactApiResponse, factText: string) {
  if (typeof response.id === "string" && response.id.length > 0) {
    return `id:${response.id}`;
  }

  return `text:${factText}`;
}

async function fetchApiFact(recentItemKeys: readonly string[]) {
  const disallowedKeys = new Set([...recentApiFactKeys, ...recentItemKeys]);

  for (let attempt = 0; attempt <= factProviderConfig.apiRetryCount; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), factProviderConfig.apiTimeoutMs);

    try {
      const response = await fetch(buildFactApiUrl(), {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        logContentProviderEvent("fact", "api-failure", {
          provider: "api-fact",
          reason: `http-${response.status}`,
        });
        return undefined;
      }

      const parsed = (await response.json()) as FactApiResponse;
      const factText = getFactTextFromResponse(parsed);

      if (!factText) {
        logContentProviderEvent("fact", "api-rejected", {
          provider: "api-fact",
          reason: "malformed-response",
        });
        continue;
      }

      const factKey = getApiFactKey(parsed, factText);

      if (disallowedKeys.has(factKey) || disallowedKeys.has(`text:${factText}`) || disallowedKeys.has(factText)) {
        logContentProviderEvent("fact", "api-rejected", {
          provider: "api-fact",
          reason: "recent-use",
          itemKey: factKey,
        });
        continue;
      }

      rememberRecentApiFact(factKey);
      logContentProviderEvent("fact", "api-success", {
        provider: "api-fact",
        itemKey: factKey,
      });

      return {
        item: factText,
        itemKey: factKey,
      };
    } catch {
      logContentProviderEvent("fact", "api-failure", {
        provider: "api-fact",
        reason: controller.signal.aborted ? "timeout" : "fetch-error",
      });
      return undefined;
    } finally {
      clearTimeout(timeout);
    }
  }

  return undefined;
}

function createApiFactResult(item: string): ContentProviderResult<"fact"> {
  return {
    items: [item],
    sourceTopic: "general",
    providerName: "api-fact",
  };
}

export const apiFactProvider: ContentProvider = {
  name: "api-fact",
  async getItems<T extends ContentType>(request: ContentProviderRequest<T>) {
    const { contentType, recentItemKeys } = request;

    if (!factProviderConfig.apiEnabled || contentType !== "fact") {
      logContentProviderEvent("fact", "provider-skip", {
        provider: "api-fact",
        reason: !factProviderConfig.apiEnabled ? "disabled" : "not-applicable",
      });
      return undefined;
    }

    const apiFact = await fetchApiFact(recentItemKeys ?? []);

    if (!apiFact) {
      return undefined;
    }

    return createApiFactResult(apiFact.item) as unknown as ContentProviderResult<T>;
  },
};
