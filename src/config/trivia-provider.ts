export const triviaProviderConfig = {
  apiEnabled: true,
  apiBaseUrl: "https://opentdb.com/api.php",
  apiAmount: 1,
  apiType: "multiple",
  apiEncoding: "url3986",
  apiTimeoutMs: 3000,
  apiRetryCount: 2,
  recentApiTriviaMemorySize: 20,
} as const;
