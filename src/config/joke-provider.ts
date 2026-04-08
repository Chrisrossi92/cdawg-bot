export const jokeProviderConfig = {
  apiEnabled: true,
  apiBaseUrl: "https://v2.jokeapi.dev/joke",
  apiGeneralCategories: ["Programming", "Misc", "Pun"],
  apiTimeoutMs: 3000,
  apiBlacklistFlags: ["nsfw", "religious", "political", "racist", "sexist", "explicit"],
  apiSafeMode: true,
  apiRetryCount: 2,
  recentApiJokeMemorySize: 20,
} as const;
