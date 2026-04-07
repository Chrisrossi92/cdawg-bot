import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { getLevel, getRank, getXp } from "../systems/xp.js";
import { syncRankRoleForMember } from "../lib/rank-role-sync.js";

export const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("Show your Cdawg Bot XP profile");

export async function execute(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const xp = getXp(userId);
  const level = getLevel(userId);
  const rank = getRank(userId);

  if (interaction.inCachedGuild()) {
    await syncRankRoleForMember(interaction.member, rank);
  }

  await interaction.reply(
    `**Cdawg Bot Profile**\nXP: ${xp}\nLevel: ${level}\nRank: ${rank}`,
  );
}
