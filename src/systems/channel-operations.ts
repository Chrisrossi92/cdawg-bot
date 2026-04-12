import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type ChannelOperationalState = {
  silencedUntil: number | null;
  cooldownUntil: number | null;
  skipNextSend: boolean;
};

export type ChannelOperationalStatus = {
  channelId: string;
  silencedUntil: number | null;
  cooldownUntil: number | null;
  skipNextSend: boolean;
  isSilenced: boolean;
  isCoolingDown: boolean;
  nextEligibleAt: number | null;
};

export type AutomationBlockReason = "silenced" | "cooldown" | "skip-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHANNEL_OPERATIONS_DATA_DIR = path.resolve(__dirname, "../../data");
const CHANNEL_OPERATIONS_DATA_FILE = path.join(CHANNEL_OPERATIONS_DATA_DIR, "channel-operations.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

function sanitizeChannelOperationalState(value: unknown): ChannelOperationalState {
  if (!isRecord(value)) {
    return {
      silencedUntil: null,
      cooldownUntil: null,
      skipNextSend: false,
    };
  }

  return {
    silencedUntil: sanitizeTimestamp(value.silencedUntil),
    cooldownUntil: sanitizeTimestamp(value.cooldownUntil),
    skipNextSend: value.skipNextSend === true,
  };
}

function sanitizeChannelOperationsStore(value: unknown) {
  if (!isRecord(value)) {
    return {} as Record<string, ChannelOperationalState>;
  }

  const nextStore: Record<string, ChannelOperationalState> = {};

  for (const [channelId, rawState] of Object.entries(value)) {
    if (!channelId) {
      continue;
    }

    nextStore[channelId] = sanitizeChannelOperationalState(rawState);
  }

  return nextStore;
}

function saveChannelOperationsToDisk(channelOperations: Record<string, ChannelOperationalState>) {
  try {
    fs.mkdirSync(CHANNEL_OPERATIONS_DATA_DIR, { recursive: true });
    const temporaryFilePath = `${CHANNEL_OPERATIONS_DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(channelOperations, null, 2));
    fs.renameSync(temporaryFilePath, CHANNEL_OPERATIONS_DATA_FILE);
  } catch (error) {
    console.warn(`[channel-ops] could not save channel operations to ${CHANNEL_OPERATIONS_DATA_FILE}.`, error);
  }
}

function loadChannelOperations() {
  try {
    const fileContents = fs.readFileSync(CHANNEL_OPERATIONS_DATA_FILE, "utf8");
    return sanitizeChannelOperationsStore(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[channel-ops] could not load channel operations from ${CHANNEL_OPERATIONS_DATA_FILE}.`, error);
    }

    return {} as Record<string, ChannelOperationalState>;
  }
}

function logChannelOperation(
  event: "silence-set" | "cooldown-set" | "skip-next-set" | "skip-next-cleared" | "skip-next-consumed" | "resumed" | "blocked-send",
  details: Record<string, string | number | null | undefined>,
) {
  const parts = [`event=${event}`];

  for (const [key, value] of Object.entries(details)) {
    if (value !== null && value !== undefined && value !== "") {
      parts.push(`${key}=${String(value)}`);
    }
  }

  console.log(`[channel-ops] ${parts.join(" ")}`);
}

function getEmptyChannelOperationalState(): ChannelOperationalState {
  return {
    silencedUntil: null,
    cooldownUntil: null,
    skipNextSend: false,
  };
}

function pruneExpiredState(channelId: string, now: number) {
  const currentState = activeChannelOperations[channelId];

  if (!currentState) {
    return;
  }

  const nextState: ChannelOperationalState = {
    silencedUntil: currentState.silencedUntil && currentState.silencedUntil > now ? currentState.silencedUntil : null,
    cooldownUntil: currentState.cooldownUntil && currentState.cooldownUntil > now ? currentState.cooldownUntil : null,
    skipNextSend: currentState.skipNextSend === true,
  };

  if (!nextState.silencedUntil && !nextState.cooldownUntil && !nextState.skipNextSend) {
    delete activeChannelOperations[channelId];
    saveChannelOperationsToDisk(activeChannelOperations);
    return;
  }

  if (
    nextState.silencedUntil !== currentState.silencedUntil ||
    nextState.cooldownUntil !== currentState.cooldownUntil
  ) {
    activeChannelOperations[channelId] = nextState;
    saveChannelOperationsToDisk(activeChannelOperations);
  }
}

function getChannelOperationalStateInternal(channelId: string, now = Date.now()) {
  pruneExpiredState(channelId, now);
  return activeChannelOperations[channelId] ?? getEmptyChannelOperationalState();
}

function buildChannelOperationalStatus(channelId: string, state: ChannelOperationalState, now = Date.now()): ChannelOperationalStatus {
  const isSilenced = typeof state.silencedUntil === "number" && state.silencedUntil > now;
  const isCoolingDown = typeof state.cooldownUntil === "number" && state.cooldownUntil > now;
  const nextEligibleAt = Math.max(state.silencedUntil ?? 0, state.cooldownUntil ?? 0) || null;

  return {
    channelId,
    silencedUntil: isSilenced ? state.silencedUntil : null,
    cooldownUntil: isCoolingDown ? state.cooldownUntil : null,
    skipNextSend: state.skipNextSend,
    isSilenced,
    isCoolingDown,
    nextEligibleAt,
  };
}

let activeChannelOperations = loadChannelOperations();

export function getChannelOperationalStatus(channelId: string, now = Date.now()): ChannelOperationalStatus {
  const state = getChannelOperationalStateInternal(channelId, now);
  return buildChannelOperationalStatus(channelId, state, now);
}

export function getChannelOperationalStates(channelIds?: readonly string[], now = Date.now()) {
  const targetChannelIds = channelIds && channelIds.length > 0 ? [...channelIds] : Object.keys(activeChannelOperations);
  return targetChannelIds.map((channelId) => getChannelOperationalStatus(channelId, now));
}

export function setChannelSilenced(channelId: string, silencedUntil: number) {
  const currentState = getChannelOperationalStateInternal(channelId);
  activeChannelOperations[channelId] = {
    ...currentState,
    silencedUntil,
  };
  saveChannelOperationsToDisk(activeChannelOperations);
  logChannelOperation("silence-set", {
    channelId,
    silencedUntil,
  });
  return getChannelOperationalStatus(channelId);
}

export function setChannelManualCooldown(channelId: string, cooldownUntil: number) {
  const currentState = getChannelOperationalStateInternal(channelId);
  activeChannelOperations[channelId] = {
    ...currentState,
    cooldownUntil,
  };
  saveChannelOperationsToDisk(activeChannelOperations);
  logChannelOperation("cooldown-set", {
    channelId,
    cooldownUntil,
  });
  return getChannelOperationalStatus(channelId);
}

export function setChannelSkipNextSend(channelId: string) {
  const currentState = getChannelOperationalStateInternal(channelId);
  activeChannelOperations[channelId] = {
    ...currentState,
    skipNextSend: true,
  };
  saveChannelOperationsToDisk(activeChannelOperations);
  logChannelOperation("skip-next-set", {
    channelId,
  });
  return getChannelOperationalStatus(channelId);
}

export function clearChannelSkipNextSend(channelId: string) {
  const currentState = getChannelOperationalStateInternal(channelId);
  const nextState: ChannelOperationalState = {
    ...currentState,
    skipNextSend: false,
  };

  if (!nextState.silencedUntil && !nextState.cooldownUntil) {
    delete activeChannelOperations[channelId];
  } else {
    activeChannelOperations[channelId] = nextState;
  }

  saveChannelOperationsToDisk(activeChannelOperations);
  logChannelOperation("skip-next-cleared", {
    channelId,
  });
  return getChannelOperationalStatus(channelId);
}

export function resumeChannelAutomation(channelId: string) {
  delete activeChannelOperations[channelId];
  saveChannelOperationsToDisk(activeChannelOperations);
  logChannelOperation("resumed", {
    channelId,
  });
  return getChannelOperationalStatus(channelId);
}

export function getAutomatedContentBlock(channelId: string, source: string, now = Date.now()) {
  const status = getChannelOperationalStatus(channelId, now);

  if (status.isSilenced) {
    logChannelOperation("blocked-send", {
      channelId,
      source,
      reason: "silenced",
      blockedUntil: status.silencedUntil,
    });
    return {
      blocked: true as const,
      reason: "silenced" as AutomationBlockReason,
      blockedUntil: status.silencedUntil,
      status,
    };
  }

  if (status.isCoolingDown) {
    logChannelOperation("blocked-send", {
      channelId,
      source,
      reason: "cooldown",
      blockedUntil: status.cooldownUntil,
    });
    return {
      blocked: true as const,
      reason: "cooldown" as AutomationBlockReason,
      blockedUntil: status.cooldownUntil,
      status,
    };
  }

  if (status.skipNextSend) {
    clearChannelSkipNextSend(channelId);
    logChannelOperation("skip-next-consumed", {
      channelId,
      source,
    });
    return {
      blocked: true as const,
      reason: "skip-next" as AutomationBlockReason,
      blockedUntil: null,
      status: getChannelOperationalStatus(channelId, now),
    };
  }

  return {
    blocked: false as const,
    status,
  };
}
