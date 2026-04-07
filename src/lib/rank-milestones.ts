import { rankTiers } from "../systems/xp.js";

export const milestoneRanks = ["Veteran", "Elite", "Master"] as const;

const announcedMilestones = new Set<string>();

function getRankIndex(rank: string) {
  return rankTiers.findIndex((tier) => tier.title === rank);
}

export function getRankMilestoneMessage(
  userId: string,
  previousRank: string,
  newRank: string,
  newLevel: number,
  newXp: number,
) {
  const previousRankIndex = getRankIndex(previousRank);
  const newRankIndex = getRankIndex(newRank);
  const isMilestoneRank = milestoneRanks.includes(newRank as (typeof milestoneRanks)[number]);

  if (!isMilestoneRank || newRankIndex <= previousRankIndex) {
    return null;
  }

  const announcementKey = `${userId}:${newRank}:${newLevel}:${newXp}`;

  if (announcedMilestones.has(announcementKey)) {
    return null;
  }

  announcedMilestones.add(announcementKey);

  return `🏆 <@${userId}> just reached **${newRank}** at **Level ${newLevel}**!`;
}
