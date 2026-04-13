import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { addXp } from "./xp.js";

export type DogAction = "feed" | "play" | "walk";
export type DogImageKey = "happy" | "hungry" | "excited" | "sleepy" | "sad";

export type DogInteraction = {
  userId: string;
  action: DogAction;
  timestamp: number;
  xpAmount: number;
  xpAwarded: boolean;
  statChanges: {
    hunger: number;
    mood: number;
    energy: number;
  };
};

export type DogState = {
  hunger: number;
  mood: number;
  energy: number;
  updatedAt: number;
  recentInteractions: DogInteraction[];
  dailyActionClaims: Record<string, number>;
};

export type DogPassivePrompt = {
  content: string;
  imageKey: DogImageKey;
  reason: "hungry" | "tired" | "sad";
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOG_DATA_DIR = path.resolve(__dirname, "../../data");
const DOG_DATA_FILE = path.join(DOG_DATA_DIR, "cdawg-dog.json");
const MAX_RECENT_INTERACTIONS = 12;
const DOG_STAT_MIN = 0;
const DOG_STAT_MAX = 100;
const DECAY_INTERVAL_MS = 60 * 60 * 1000;

const DOG_ACTION_XP: Record<DogAction, number> = {
  feed: 4,
  play: 5,
  walk: 6,
};

const DOG_ACTION_DELTAS: Record<DogAction, { hunger: number; mood: number; energy: number }> = {
  feed: { hunger: 28, mood: 6, energy: 2 },
  play: { hunger: -8, mood: 20, energy: -10 },
  walk: { hunger: -10, mood: 14, energy: -14 },
};

function clampStat(value: number) {
  return Math.max(DOG_STAT_MIN, Math.min(DOG_STAT_MAX, Math.round(value)));
}

function createDefaultDogState(now = Date.now()): DogState {
  return {
    hunger: 76,
    mood: 72,
    energy: 74,
    updatedAt: now,
    recentInteractions: [],
    dailyActionClaims: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function sanitizeTimestamp(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : Date.now();
}

function sanitizeAction(value: unknown): DogAction | null {
  return value === "feed" || value === "play" || value === "walk" ? value : null;
}

function sanitizeDogInteraction(value: unknown): DogInteraction | null {
  if (!isRecord(value)) {
    return null;
  }

  const action = sanitizeAction(value.action);
  const userId = typeof value.userId === "string" && value.userId.trim().length > 0 ? value.userId.trim() : null;

  if (!action || !userId) {
    return null;
  }

  const statChanges = isRecord(value.statChanges) ? value.statChanges : {};

  return {
    userId,
    action,
    timestamp: sanitizeTimestamp(value.timestamp),
    xpAmount: Math.max(0, Math.floor(sanitizeNumber(value.xpAmount, 0))),
    xpAwarded: value.xpAwarded === true,
    statChanges: {
      hunger: Math.round(sanitizeNumber(statChanges.hunger, 0)),
      mood: Math.round(sanitizeNumber(statChanges.mood, 0)),
      energy: Math.round(sanitizeNumber(statChanges.energy, 0)),
    },
  };
}

function sanitizeDogState(value: unknown): DogState {
  if (!isRecord(value)) {
    return createDefaultDogState();
  }

  const recentInteractions = Array.isArray(value.recentInteractions)
    ? value.recentInteractions
        .map((interaction) => sanitizeDogInteraction(interaction))
        .filter((interaction): interaction is DogInteraction => Boolean(interaction))
        .slice(0, MAX_RECENT_INTERACTIONS)
    : [];

  const dailyActionClaims = isRecord(value.dailyActionClaims)
    ? Object.fromEntries(
        Object.entries(value.dailyActionClaims).filter(
          (entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number",
        ),
      )
    : {};

  return {
    hunger: clampStat(sanitizeNumber(value.hunger, 76)),
    mood: clampStat(sanitizeNumber(value.mood, 72)),
    energy: clampStat(sanitizeNumber(value.energy, 74)),
    updatedAt: sanitizeTimestamp(value.updatedAt),
    recentInteractions,
    dailyActionClaims,
  };
}

function saveDogStateToDisk(state: DogState) {
  try {
    fs.mkdirSync(DOG_DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DOG_DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(state, null, 2));
    fs.renameSync(temporaryFilePath, DOG_DATA_FILE);
  } catch (error) {
    console.warn(`[dog] could not save dog state to ${DOG_DATA_FILE}.`, error);
  }
}

function loadDogState() {
  try {
    const fileContents = fs.readFileSync(DOG_DATA_FILE, "utf8");
    return sanitizeDogState(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[dog] could not load dog state from ${DOG_DATA_FILE}.`, error);
    }

    return createDefaultDogState();
  }
}

function logDogEvent(
  event: "action" | "passive-prompt",
  details: Record<string, string | number | boolean | null | undefined>,
) {
  const parts = [`event=${event}`];

  for (const [key, value] of Object.entries(details)) {
    if (value !== null && value !== undefined && value !== "") {
      parts.push(`${key}=${String(value)}`);
    }
  }

  console.log(`[dog] ${parts.join(" ")}`);
}

function applyDecay(state: DogState, now = Date.now()) {
  const elapsedIntervals = Math.floor((now - state.updatedAt) / DECAY_INTERVAL_MS);

  if (elapsedIntervals <= 0) {
    return state;
  }

  let hunger = state.hunger;
  let mood = state.mood;
  let energy = state.energy;

  for (let index = 0; index < elapsedIntervals; index += 1) {
    hunger = clampStat(hunger - 4);
    energy = clampStat(energy - 3);
    mood = clampStat(mood - 1);

    if (hunger <= 40) {
      mood = clampStat(mood - 2);
    }

    if (energy <= 35) {
      mood = clampStat(mood - 2);
    }
  }

  return {
    ...state,
    hunger,
    mood,
    energy,
    updatedAt: state.updatedAt + elapsedIntervals * DECAY_INTERVAL_MS,
  };
}

function getDayKey(now = Date.now()) {
  const date = new Date(now);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getActionClaimKey(userId: string, action: DogAction, now = Date.now()) {
  return `${getDayKey(now)}:${userId}:${action}`;
}

function pruneDailyActionClaims(claims: Record<string, number>, now = Date.now()) {
  const currentDayKey = getDayKey(now);

  return Object.fromEntries(
    Object.entries(claims).filter(([key]) => key.startsWith(currentDayKey)),
  );
}

let activeDogState = loadDogState();

function syncDogState(now = Date.now()) {
  const decayedState = applyDecay(activeDogState, now);
  const nextClaims = pruneDailyActionClaims(decayedState.dailyActionClaims, now);
  const nextState =
    decayedState !== activeDogState || Object.keys(nextClaims).length !== Object.keys(decayedState.dailyActionClaims).length
      ? {
          ...decayedState,
          dailyActionClaims: nextClaims,
        }
      : decayedState;

  if (nextState !== activeDogState) {
    activeDogState = nextState;
    saveDogStateToDisk(activeDogState);
  }

  return activeDogState;
}

export function getDogState(now = Date.now()) {
  return syncDogState(now);
}

export function getDogActionAvailability(userId: string, now = Date.now()) {
  const state = syncDogState(now);

  return {
    feed: !state.dailyActionClaims[getActionClaimKey(userId, "feed", now)],
    play: !state.dailyActionClaims[getActionClaimKey(userId, "play", now)],
    walk: !state.dailyActionClaims[getActionClaimKey(userId, "walk", now)],
  };
}

export function getDogImageKeyFromState(state: Pick<DogState, "hunger" | "mood" | "energy">): DogImageKey {
  if (state.hunger <= 30) {
    return "hungry";
  }

  if (state.energy <= 25) {
    return "sleepy";
  }

  if (state.mood <= 30) {
    return "sad";
  }

  if (state.mood >= 80 && state.energy >= 60) {
    return "excited";
  }

  return "happy";
}

export function getDogPassivePrompt(now = Date.now()): DogPassivePrompt | null {
  const state = syncDogState(now);

  if (state.hunger <= 30) {
    return {
      reason: "hungry",
      imageKey: "hungry",
      content: "*Cdawg Dog noses the food bin and whines.* I am running on crumbs over here.",
    };
  }

  if (state.energy <= 25) {
    return {
      reason: "tired",
      imageKey: "sleepy",
      content: "*Cdawg Dog flops onto the floor.* I need a walk, a nap, or possibly both.",
    };
  }

  if (state.mood <= 30) {
    return {
      reason: "sad",
      imageKey: "sad",
      content: "*Cdawg Dog gives the room dramatic puppy eyes.* I could really use some playtime.",
    };
  }

  return null;
}

export function getDogStatusSummary(now = Date.now()) {
  const state = syncDogState(now);

  return {
    ...state,
    imageKey: getDogImageKeyFromState(state),
    lowFlags: {
      hunger: state.hunger <= 30,
      mood: state.mood <= 30,
      energy: state.energy <= 25,
    },
  };
}

export function performDogAction(userId: string, action: DogAction, now = Date.now()) {
  const state = syncDogState(now);
  const claimKey = getActionClaimKey(userId, action, now);

  if (state.dailyActionClaims[claimKey]) {
    return {
      ok: false as const,
      error: `You already used ${action} today. Try again tomorrow.`,
      state: getDogStatusSummary(now),
    };
  }

  const deltas = DOG_ACTION_DELTAS[action];
  const nextState: DogState = {
    ...state,
    hunger: clampStat(state.hunger + deltas.hunger),
    mood: clampStat(state.mood + deltas.mood),
    energy: clampStat(state.energy + deltas.energy),
    updatedAt: now,
    dailyActionClaims: {
      ...state.dailyActionClaims,
      [claimKey]: now,
    },
  };
  const xpAmount = DOG_ACTION_XP[action];
  const xpResult = addXp(userId, xpAmount);
  const interaction: DogInteraction = {
    userId,
    action,
    timestamp: now,
    xpAmount,
    xpAwarded: xpResult.awarded,
    statChanges: deltas,
  };

  nextState.recentInteractions = [interaction, ...state.recentInteractions].slice(0, MAX_RECENT_INTERACTIONS);
  activeDogState = nextState;
  saveDogStateToDisk(activeDogState);

  logDogEvent("action", {
    userId,
    action,
    xpAmount,
    xpAwarded: xpResult.awarded,
    hunger: nextState.hunger,
    mood: nextState.mood,
    energy: nextState.energy,
  });

  return {
    ok: true as const,
    action,
    xpAmount,
    xpAwarded: xpResult.awarded,
    xpResult,
    state: getDogStatusSummary(now),
    interaction,
  };
}

export function recordDogPassivePrompt(reason: DogPassivePrompt["reason"], now = Date.now()) {
  const state = syncDogState(now);
  logDogEvent("passive-prompt", {
    reason,
    hunger: state.hunger,
    mood: state.mood,
    energy: state.energy,
  });
}
