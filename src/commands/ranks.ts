import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { rankTiers } from "../systems/xp.js";

export const data = new SlashCommandBuilder()
  .setName("ranks")
  .setDescription("Show all current progression ranks and level thresholds");

export async function execute(interaction: ChatInputCommandInteraction) {
  const lines = rankTiers.map((tier) => `**${tier.title}** — Level ${tier.minLevel}+`);

  await interaction.reply(`**Cdawg Bot Ranks**\n${lines.join("\n")}`);
}
