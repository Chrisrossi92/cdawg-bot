import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { getTriviaStats } from "../systems/trivia-streaks.js";

export const data = new SlashCommandBuilder()
  .setName("trivia-stats")
  .setDescription("Show your current trivia performance stats");

export async function execute(interaction: ChatInputCommandInteraction) {
  const stats = getTriviaStats(interaction.user.id);

  await interaction.reply(
    `**Cdawg Bot Trivia Stats**\nCurrent streak: ${stats.currentStreak}\nBest streak: ${stats.bestStreak}\nTotal correct: ${stats.totalCorrect}\nTotal wrong: ${stats.totalWrong}`,
  );
}
