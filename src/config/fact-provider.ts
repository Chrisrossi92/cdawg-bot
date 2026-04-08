export const factProviderConfig = {
  apiEnabled: true,
  apiBaseUrl: "https://uselessfacts.jsph.pl/api/v2/facts/random",
  apiLanguage: "en",
  apiTimeoutMs: 3000,
  apiRetryCount: 2,
  recentApiFactMemorySize: 20,
} as const;
