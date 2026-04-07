import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("bot-help")
  .setDescription("Show available Cdawg Bot commands");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply(
    "**Cdawg Bot Help**\n\n**Engagement**\n`/fact` for quick facts, `/wyr` for live voting, `/prompt` for discussion starters, `/trivia` for timed trivia rounds.\n\n**Progression**\n`/profile` to check your stats, `/leaderboard` to see server standings, `/xp-info` to learn how XP works, `/ranks` to view progression tiers.\n\n**Trivia**\n`/trivia-stats` for your personal performance, `/trivia-leaderboard` for the top trivia players.\n\n**Utility**\nUse `/bot-help` anytime for a quick command refresher.",
  );
}
