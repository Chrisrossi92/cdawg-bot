export function normalizeChatMessage(content: string) {
  return content.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isLikelyCommandMessage(content: string) {
  const trimmed = content.trim();
  return trimmed.startsWith("/") || trimmed.startsWith("!") || trimmed.startsWith(".");
}

export function passesMessageQualityThresholds(
  content: string,
  minNonSpaceChars: number,
  minWordCount: number,
) {
  const nonSpaceChars = content.replace(/\s+/g, "").length;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return nonSpaceChars >= minNonSpaceChars && wordCount >= minWordCount;
}
