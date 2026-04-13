import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DogAction, DogImageKey } from "../systems/cdawg-dog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOG_ASSET_DIR = path.resolve(__dirname, "../../assets/dog");

const dogImageFileNamesByKey: Record<DogImageKey, string> = {
  happy: "happy.svg",
  hungry: "hungry.svg",
  excited: "excited.svg",
  sleepy: "sleepy.svg",
  sad: "sad.svg",
};

const dogActionCopy: Record<DogAction, string> = {
  feed: "Cdawg Dog demolishes the snack bowl and looks much less offended by life.",
  play: "Cdawg Dog tears after a toy like this was the only mission that mattered.",
  walk: "Cdawg Dog power-struts the server perimeter and returns feeling accomplished.",
};

export function getDogImagePath(imageKey: DogImageKey) {
  return path.join(DOG_ASSET_DIR, dogImageFileNamesByKey[imageKey]);
}

export function formatDogStatsLine(state: { hunger: number; mood: number; energy: number }) {
  return `Hunger ${state.hunger}/100 • Mood ${state.mood}/100 • Energy ${state.energy}/100`;
}

export function buildDogStatusMessage(input: {
  title?: string;
  state: { hunger: number; mood: number; energy: number };
  imageKey: DogImageKey;
  extraLine?: string | null;
}) {
  return {
    content: [input.title ?? "**Cdawg Dog**", formatDogStatsLine(input.state), input.extraLine ?? null].filter(Boolean).join("\n"),
    files: [getDogImagePath(input.imageKey)],
  };
}

export function buildDogActionMessage(input: {
  action: DogAction;
  state: { hunger: number; mood: number; energy: number };
  imageKey: DogImageKey;
  xpAmount: number;
  xpAwarded: boolean;
}) {
  return buildDogStatusMessage({
    title: `**Cdawg Dog: ${input.action[0]?.toUpperCase()}${input.action.slice(1)}**`,
    state: input.state,
    imageKey: input.imageKey,
    extraLine: `${dogActionCopy[input.action]}\n${input.xpAwarded ? `+${input.xpAmount} XP awarded.` : `${input.xpAmount} XP was blocked by cooldown.`}`,
  });
}
