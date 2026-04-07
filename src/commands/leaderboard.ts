import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { getTopUsers } from "../systems/xp.js";

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Show the top Cdawg Bot XP leaderboard");

export async function execute(interaction: ChatInputCommandInteraction) {
  const topUsers = getTopUsers(10);

  if (topUsers.length === 0) {
    await interaction.reply("No leaderboard data yet. Start using commands first.");
    return;
  }

  const medalByIndex = ["🥇", "🥈", "🥉"];
  const lines = topUsers.map((entry, index) => {
    const prefix = medalByIndex[index] ?? `#${index + 1}`;
    return `${prefix} **<@${entry.userId}>** • Lv ${entry.level} • ${entry.xp} XP`;
  });

  await interaction.reply(`**Cdawg Bot Leaderboard**\n${lines.join("\n")}`);
}
