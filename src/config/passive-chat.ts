export const passiveChatConfig = {
  enabled: true,
  eligibleChannelIds: new Set([
    "1480388771001139302",
    "1463685992782237890",
    "1463686052509388894",
    "1482887724871712788",
  ]),
  globalCooldownMs: 12 * 60 * 1000,
  channelCooldownMs: 5 * 60 * 1000,
  triggerChance: 0.14,
  minNonSpaceChars: 8,
  minWordCount: 2,
} as const;
