import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("xp-info")
  .setDescription("Explain how Cdawg Bot XP works");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply(
    "**Cdawg Bot XP Info**\nXP comes from meaningful participation across the server. Using bot commands, answering trivia, voting in WYR polls, and chatting in eligible channels can all help you earn XP.\n\nAnti-spam and cooldown protections are active, so not every action or message will count.\n\nUse `/profile` to check your progress, `/leaderboard` to see top players, and `/ranks` to view the current rank tiers.",
  );
}
