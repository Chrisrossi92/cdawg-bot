import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { getTopTriviaUsers } from "../systems/trivia-streaks.js";

export const data = new SlashCommandBuilder()
  .setName("trivia-leaderboard")
  .setDescription("Show the top trivia players");

export async function execute(interaction: ChatInputCommandInteraction) {
  const topUsers = getTopTriviaUsers(10);

  if (topUsers.length === 0) {
    await interaction.reply("No trivia leaderboard data yet. Start answering trivia questions first.");
    return;
  }

  const medalByIndex = ["🥇", "🥈", "🥉"];
  const lines = topUsers.map((entry, index) => {
    const prefix = medalByIndex[index] ?? `#${index + 1}`;
    return `${prefix} **<@${entry.userId}>** • ${entry.totalCorrect} correct • Best ${entry.bestStreak}`;
  });

  await interaction.reply(`**Cdawg Bot Trivia Leaderboard**\n${lines.join("\n")}`);
}
