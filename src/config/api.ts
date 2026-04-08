function parseBooleanEnv(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  return value === "1" || value.toLowerCase() === "true";
}

function parsePortEnv(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    return fallback;
  }

  return parsed;
}

export const apiConfig = {
  enabled: parseBooleanEnv(process.env.BOT_API_ENABLED, false),
  host: process.env.BOT_API_HOST || "127.0.0.1",
  port: parsePortEnv(process.env.BOT_API_PORT, 8787),
  maxRequestBodyBytes: 64 * 1024,
} as const;
