import { triviaProviderConfig } from "../config/trivia-provider.js";
import type { TriviaItem } from "../content/trivia/general.js";
import type { ContentProvider, ContentProviderRequest, ContentProviderResult, ContentType } from "./content-provider.js";
import { logContentProviderEvent } from "./content-provider-logging.js";
import { recordContentProviderApiFailure, recordContentProviderApiSuccess } from "../systems/bot-metrics.js";

type OpenTriviaApiResponse = {
  response_code?: number;
  results?: OpenTriviaQuestion[];
};

type OpenTriviaQuestion = {
  type?: string;
  difficulty?: string;
  category?: string;
  question?: string;
  correct_answer?: string;
  incorrect_answers?: string[];
};

const recentApiTriviaKeys: string[] = [];

function rememberRecentApiTrivia(triviaKey: string) {
  const nextKeys = [...recentApiTriviaKeys.filter((key) => key !== triviaKey), triviaKey];
  recentApiTriviaKeys.splice(0, recentApiTriviaKeys.length, ...nextKeys.slice(-triviaProviderConfig.recentApiTriviaMemorySize));
}

function buildTriviaApiUrl() {
  const url = new URL(triviaProviderConfig.apiBaseUrl);
  url.searchParams.set("amount", String(triviaProviderConfig.apiAmount));
  url.searchParams.set("type", triviaProviderConfig.apiType);
  url.searchParams.set("encode", triviaProviderConfig.apiEncoding);
  return url;
}

function decodeTriviaText(value: string) {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function shuffleTriviaOptions(options: readonly string[]) {
  const shuffled = [...options];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    const swapValue = shuffled[swapIndex];

    if (current === undefined || swapValue === undefined) {
      continue;
    }

    shuffled[index] = swapValue;
    shuffled[swapIndex] = current;
  }

  return shuffled;
}

function isValidTriviaOptions(options: readonly string[], answer: string): options is [string, string, string, string] {
  return options.length === 4 && new Set(options).size === 4 && options.includes(answer);
}

function normalizeTriviaItem(question: OpenTriviaQuestion): TriviaItem | undefined {
  if (question.type !== "multiple") {
    return undefined;
  }

  const rawQuestion = typeof question.question === "string" ? decodeTriviaText(question.question) : "";
  const rawAnswer = typeof question.correct_answer === "string" ? decodeTriviaText(question.correct_answer) : "";
  const rawIncorrectAnswers = Array.isArray(question.incorrect_answers)
    ? question.incorrect_answers
        .filter((answer): answer is string => typeof answer === "string")
        .map((answer) => decodeTriviaText(answer))
    : [];

  if (!rawQuestion || !rawAnswer || rawIncorrectAnswers.length !== 3) {
    return undefined;
  }

  const shuffledOptions = shuffleTriviaOptions([...rawIncorrectAnswers, rawAnswer]);

  if (!isValidTriviaOptions(shuffledOptions, rawAnswer)) {
    return undefined;
  }

  return {
    question: rawQuestion,
    options: shuffledOptions,
    answer: rawAnswer,
    ...(typeof question.category === "string" && question.category.trim().length > 0
      ? { category: decodeTriviaText(question.category) }
      : {}),
    ...(typeof question.difficulty === "string" && question.difficulty.trim().length > 0
      ? { difficulty: decodeTriviaText(question.difficulty) }
      : {}),
  };
}

function getApiTriviaKey(item: TriviaItem) {
  return `question:${item.question}`;
}

async function fetchApiTrivia(recentItemKeys: readonly string[]) {
  const disallowedKeys = new Set([...recentApiTriviaKeys, ...recentItemKeys]);

  for (let attempt = 0; attempt <= triviaProviderConfig.apiRetryCount; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), triviaProviderConfig.apiTimeoutMs);

    try {
      const response = await fetch(buildTriviaApiUrl(), {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        recordContentProviderApiFailure("trivia", "api-trivia");
        logContentProviderEvent("trivia", "api-failure", {
          provider: "api-trivia",
          reason: `http-${response.status}`,
        });
        return undefined;
      }

      const parsed = (await response.json()) as OpenTriviaApiResponse;

      if (parsed.response_code !== 0 || !Array.isArray(parsed.results) || parsed.results.length === 0) {
        logContentProviderEvent("trivia", "api-rejected", {
          provider: "api-trivia",
          reason: "malformed-response",
        });
        continue;
      }

      const item = normalizeTriviaItem(parsed.results[0] ?? {});

      if (!item) {
        logContentProviderEvent("trivia", "api-rejected", {
          provider: "api-trivia",
          reason: "invalid-trivia-shape",
        });
        continue;
      }

      const triviaKey = getApiTriviaKey(item);

      if (disallowedKeys.has(triviaKey) || disallowedKeys.has(item.question)) {
        logContentProviderEvent("trivia", "api-rejected", {
          provider: "api-trivia",
          reason: "recent-use",
          itemKey: triviaKey,
        });
        continue;
      }

      rememberRecentApiTrivia(triviaKey);
      recordContentProviderApiSuccess("trivia", "api-trivia");
      logContentProviderEvent("trivia", "api-success", {
        provider: "api-trivia",
        itemKey: triviaKey,
      });

      return {
        item,
        itemKey: triviaKey,
      };
    } catch {
      recordContentProviderApiFailure("trivia", "api-trivia");
      logContentProviderEvent("trivia", "api-failure", {
        provider: "api-trivia",
        reason: controller.signal.aborted ? "timeout" : "fetch-error",
      });
      return undefined;
    } finally {
      clearTimeout(timeout);
    }
  }

  return undefined;
}

function createApiTriviaResult(item: TriviaItem): ContentProviderResult<"trivia"> {
  return {
    items: [item],
    sourceTopic: "general",
    providerName: "api-trivia",
  };
}

export const apiTriviaProvider: ContentProvider = {
  name: "api-trivia",
  async getItems<T extends ContentType>(request: ContentProviderRequest<T>) {
    const { contentType, recentItemKeys } = request;

    if (!triviaProviderConfig.apiEnabled || contentType !== "trivia") {
      logContentProviderEvent("trivia", "provider-skip", {
        provider: "api-trivia",
        reason: !triviaProviderConfig.apiEnabled ? "disabled" : "not-applicable",
      });
      return undefined;
    }

    const apiTrivia = await fetchApiTrivia(recentItemKeys ?? []);

    if (!apiTrivia) {
      return undefined;
    }

    return createApiTriviaResult(apiTrivia.item) as unknown as ContentProviderResult<T>;
  },
};
