import { jokeProviderConfig } from "../config/joke-provider.js";
import type { ContentProvider, ContentProviderRequest, ContentProviderResult, ContentType } from "./content-provider.js";

type JokeApiResponse =
  | {
      error: false;
      id?: number;
      type: "single";
      joke: string;
    }
  | {
      error: false;
      id?: number;
      type: "twopart";
      setup: string;
      delivery: string;
    }
  | {
      error: true;
      message?: string;
    };

const recentApiJokeKeys: string[] = [];

function rememberRecentApiJoke(jokeKey: string) {
  const nextKeys = [...recentApiJokeKeys.filter((key) => key !== jokeKey), jokeKey];
  recentApiJokeKeys.splice(0, recentApiJokeKeys.length, ...nextKeys.slice(-jokeProviderConfig.recentApiJokeMemorySize));
}

function getApiJokeKey(response: JokeApiResponse, jokeText: string) {
  if ("id" in response && typeof response.id === "number") {
    return `id:${response.id}`;
  }

  return `text:${jokeText}`;
}

function getJokeTextFromResponse(response: JokeApiResponse) {
  if (response.error) {
    return undefined;
  }

  if (response.type === "single") {
    const joke = response.joke.trim();
    return joke.length > 0 ? joke : undefined;
  }

  const setup = response.setup.trim();
  const delivery = response.delivery.trim();

  if (!setup || !delivery) {
    return undefined;
  }

  return `${setup}\n${delivery}`;
}

function buildJokeApiUrl() {
  const categoryPath = jokeProviderConfig.apiGeneralCategories.join(",");
  const url = new URL(`${jokeProviderConfig.apiBaseUrl}/${categoryPath}`);
  url.searchParams.set("type", "single,twopart");

  if (jokeProviderConfig.apiSafeMode) {
    url.searchParams.set("safe-mode", "");
  }

  if (jokeProviderConfig.apiBlacklistFlags.length > 0) {
    url.searchParams.set("blacklistFlags", jokeProviderConfig.apiBlacklistFlags.join(","));
  }

  return url;
}

async function fetchApiJoke(recentItemKeys: readonly string[]) {
  const disallowedKeys = new Set([...recentApiJokeKeys, ...recentItemKeys]);

  for (let attempt = 0; attempt <= jokeProviderConfig.apiRetryCount; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), jokeProviderConfig.apiTimeoutMs);

    try {
      const response = await fetch(buildJokeApiUrl(), {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return undefined;
      }

      const parsed = (await response.json()) as JokeApiResponse;
      const jokeText = getJokeTextFromResponse(parsed);

      if (!jokeText) {
        continue;
      }

      const jokeKey = getApiJokeKey(parsed, jokeText);

      if (disallowedKeys.has(jokeKey) || disallowedKeys.has(`text:${jokeText}`) || disallowedKeys.has(jokeText)) {
        continue;
      }

      rememberRecentApiJoke(jokeKey);

      return {
        item: jokeText,
        itemKey: jokeKey,
      };
    } catch {
      return undefined;
    } finally {
      clearTimeout(timeout);
    }
  }

  return undefined;
}

function createApiJokeResult(item: string): ContentProviderResult<"joke"> {
  return {
    items: [item],
    sourceTopic: "general",
    providerName: "api-joke",
  };
}

export const apiJokeProvider: ContentProvider = {
  name: "api-joke",
  async getItems<T extends ContentType>(request: ContentProviderRequest<T>) {
    const { contentType, recentItemKeys } = request;

    if (!jokeProviderConfig.apiEnabled || contentType !== "joke") {
      return undefined;
    }

    const apiJoke = await fetchApiJoke(recentItemKeys ?? []);

    if (!apiJoke) {
      return undefined;
    }

    return createApiJokeResult(apiJoke.item) as unknown as ContentProviderResult<T>;
  },
};
