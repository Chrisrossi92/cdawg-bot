export const topics = [
  "general",
  "palworld",
  "history",
  "genealogy",
  "pokemon",
  "harry-potter",
  "true-crime",
  "music",
  "valheim",
] as const;

export type Topic = (typeof topics)[number];
