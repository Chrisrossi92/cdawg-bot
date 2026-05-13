export const composerAssistModes = ["engaging", "question", "hype", "shorter", "cleaner", "emojis"] as const;

export type ComposerAssistMode = (typeof composerAssistModes)[number];

type ComposerAssistRequest = {
  mode: ComposerAssistMode;
  message: string;
  channelLabel?: string | null;
};

const maxComposerMessageLength = 2000;
const tokenPattern = /(<#\d{17,20}>|<@&\d{17,20}>|<@\d{17,20}>|\{user\})/g;
const placeholderPrefix = "\u0000CDTOKEN";
const placeholderSuffix = "\u0000";

function preserveTokens(value: string) {
  const tokens: string[] = [];
  const text = value.replace(tokenPattern, (token) => {
    const index = tokens.push(token) - 1;
    return `${placeholderPrefix}${index}${placeholderSuffix}`;
  });

  return {
    text,
    restore: (nextValue: string) =>
      nextValue.replace(new RegExp(`${placeholderPrefix}(\\d+)${placeholderSuffix}`, "g"), (_match, rawIndex) => {
        const token = tokens[Number(rawIndex)];
        return token ?? "";
      }),
  };
}

function normalizeWhitespace(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .join("\n");
}

function stripTrailingPunctuation(value: string) {
  return value.replace(/[.!?]+$/g, "").trim();
}

function ensureSentenceEnding(value: string, ending = ".") {
  const trimmed = value.trim();

  if (!trimmed) {
    return trimmed;
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}${ending}`;
}

function limitMessage(value: string) {
  const trimmed = value.trim();

  if (trimmed.length <= maxComposerMessageLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxComposerMessageLength - 3).trimEnd()}...`;
}

function removeSoftFiller(value: string) {
  return value
    .replace(/\b(just|really|very|basically|actually|kind of|sort of|maybe|please note that)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function makeEngaging(value: string, channelLabel?: string | null) {
  const cleaned = ensureSentenceEnding(normalizeWhitespace(value));
  const context = channelLabel ? ` ${channelLabel}` : "";

  if (/^(quick heads up|heads up|friendly reminder)/i.test(cleaned)) {
    return cleaned;
  }

  return `Quick heads up${context}: ${cleaned}`;
}

function turnIntoQuestion(value: string) {
  const cleaned = stripTrailingPunctuation(normalizeWhitespace(value));

  if (!cleaned) {
    return cleaned;
  }

  if (/^(what|how|why|when|where|who|which|should|could|would|do|does|did|is|are|can)\b/i.test(cleaned)) {
    return `${cleaned}?`;
  }

  return `What do you think about this: ${cleaned}?`;
}

function makeHype(value: string) {
  const cleaned = stripTrailingPunctuation(normalizeWhitespace(value));

  if (!cleaned) {
    return cleaned;
  }

  return `Let's go! ${cleaned}!`;
}

function makeShorter(value: string) {
  const cleaned = removeSoftFiller(normalizeWhitespace(value));
  const sentences = cleaned.match(/[^.!?\n]+[.!?]?/g) ?? [cleaned];
  const firstTwo = sentences.slice(0, 2).join(" ").trim();
  const shortened = firstTwo.length > 240 ? `${firstTwo.slice(0, 237).trimEnd()}...` : firstTwo;

  return ensureSentenceEnding(shortened);
}

function makeCleaner(value: string) {
  const cleaned = normalizeWhitespace(value)
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/([.!?])([^\s\n])/g, "$1 $2");

  return ensureSentenceEnding(cleaned);
}

function addLightEmojis(value: string) {
  const cleaned = ensureSentenceEnding(normalizeWhitespace(value));

  if (!cleaned) {
    return cleaned;
  }

  if (/[\u{1F300}-\u{1FAFF}]/u.test(cleaned)) {
    return cleaned;
  }

  return `✨ ${cleaned}`;
}

function rewriteComposerMessage(request: ComposerAssistRequest) {
  const { text, restore } = preserveTokens(request.message);

  const rewritten =
    request.mode === "engaging"
      ? makeEngaging(text, request.channelLabel)
      : request.mode === "question"
        ? turnIntoQuestion(text)
        : request.mode === "hype"
          ? makeHype(text)
          : request.mode === "shorter"
            ? makeShorter(text)
            : request.mode === "cleaner"
              ? makeCleaner(text)
              : addLightEmojis(text);

  return limitMessage(restore(rewritten));
}

export function assistComposerMessage(request: ComposerAssistRequest) {
  return rewriteComposerMessage(request);
}
