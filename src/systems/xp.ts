import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const XP_DATA_DIR = path.resolve(__dirname, "../../data");
const XP_DATA_FILE = path.join(XP_DATA_DIR, "xp.json");

function loadXpData(): Record<string, number> {
  console.log(`[xp] loading XP data from ${XP_DATA_FILE}`);

  try {
    const fileContents = fs.readFileSync(XP_DATA_FILE, "utf8");
    const parsed = JSON.parse(fileContents);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn(`[xp] XP data file is malformed at ${XP_DATA_FILE}. Starting with empty XP data.`);
      return {};
    }

    const entries = Object.entries(parsed).filter(
      (entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number",
    );

    const xpData = Object.fromEntries(entries);
    console.log(`[xp] load succeeded from ${XP_DATA_FILE}. Loaded ${entries.length} user records.`);
    return xpData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log(`[xp] no XP data file found at ${XP_DATA_FILE}. Starting fresh.`);
      return {};
    }

    console.warn(`[xp] could not load XP data from ${XP_DATA_FILE}. Starting with empty XP data.`, error);
    return {};
  }
}

function saveXpData(xpData: Record<string, number>) {
  try {
    fs.mkdirSync(XP_DATA_DIR, { recursive: true });
    fs.writeFileSync(XP_DATA_FILE, JSON.stringify(xpData, null, 2));
  } catch (error) {
    console.warn("Could not save XP data.", error);
  }
}

const xpByUserId: Record<string, number> = loadXpData();
const lastXpGainAtByUserId: Record<string, number> = {};
const XP_COOLDOWN_MS = 30 * 1000;

export const rankTiers = [
  { minLevel: 0, title: "Newblood" },
  { minLevel: 3, title: "Regular" },
  { minLevel: 6, title: "Veteran" },
  { minLevel: 10, title: "Elite" },
  { minLevel: 15, title: "Master" },
] as const;

export function getRankForLevel(level: number): string {
  let currentRank: string = rankTiers[0]?.title ?? "Newblood";

  for (const tier of rankTiers) {
    if (level >= tier.minLevel) {
      currentRank = tier.title;
    }
  }

  return currentRank;
}

export function addXp(userId: string, amount: number) {
  const now = Date.now();
  const lastGainAt = lastXpGainAtByUserId[userId] ?? 0;
  const previousLevel = getLevel(userId);
  const previousRank = getRankForLevel(previousLevel);

  if (now - lastGainAt < XP_COOLDOWN_MS) {
    return {
      awarded: false,
      newXp: getXp(userId),
      newLevel: previousLevel,
      previousRank,
      newRank: previousRank,
      rankChanged: false,
      leveledUp: false,
    };
  }

  const currentXp = xpByUserId[userId] ?? 0;
  const safeAmount = Math.max(0, amount);
  const nextXp = currentXp + safeAmount;

  xpByUserId[userId] = nextXp;
  saveXpData(xpByUserId);
  lastXpGainAtByUserId[userId] = now;
  const newLevel = getLevel(userId);
  const newRank = getRankForLevel(newLevel);

  return {
    awarded: true,
    newXp: nextXp,
    newLevel,
    previousRank,
    newRank,
    rankChanged: newRank !== previousRank,
    leveledUp: newLevel > previousLevel,
  };
}

export function getXp(userId: string): number {
  return xpByUserId[userId] ?? 0;
}

export function getLevel(userId: string): number {
  const xp = getXp(userId);
  return Math.floor(Math.sqrt(xp / 10));
}

export function getRank(userId: string): string {
  return getRankForLevel(getLevel(userId));
}

export function getTopUsers(limit: number) {
  return Object.entries(xpByUserId)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([userId, xp]) => ({
      userId,
      xp,
      level: Math.floor(Math.sqrt(xp / 10)),
    }));
}

function setXpValue(userId: string, amount: number) {
  const previousXp = getXp(userId);
  const previousLevel = getLevel(userId);
  const previousRank = getRankForLevel(previousLevel);
  const safeAmount = Math.max(0, amount);

  xpByUserId[userId] = safeAmount;
  saveXpData(xpByUserId);

  const newXp = getXp(userId);
  const newLevel = getLevel(userId);
  const newRank = getRankForLevel(newLevel);

  return {
    previousXp,
    previousLevel,
    previousRank,
    newXp,
    newLevel,
    newRank,
    rankChanged: newRank !== previousRank,
  };
}

export function grantXpDirect(userId: string, amount: number) {
  return setXpValue(userId, getXp(userId) + Math.max(0, amount));
}

export function removeXpDirect(userId: string, amount: number) {
  return setXpValue(userId, Math.max(0, getXp(userId) - Math.max(0, amount)));
}

export function setXpDirect(userId: string, amount: number) {
  return setXpValue(userId, amount);
}
