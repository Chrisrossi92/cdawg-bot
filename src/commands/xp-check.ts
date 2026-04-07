import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { xpManagementPermissions } from "../config/permissions.js";
import { hasConfiguredCommandPermission } from "../lib/permissions.js";
import { getLevel, getRank, getXp } from "../systems/xp.js";

export const data = new SlashCommandBuilder()
  .setName("xp-check")
  .setDescription("Check a user's XP, level, and rank")
  .addUserOption((option) => option.setName("user").setDescription("User to inspect").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!hasConfiguredCommandPermission(interaction, xpManagementPermissions)) {
    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    return;
  }

  const user = interaction.options.getUser("user", true);
  const xp = getXp(user.id);
  const level = getLevel(user.id);
  const rank = getRank(user.id);

  await interaction.reply({
    content: `XP check for <@${user.id}>.\nXP: ${xp}\nLevel: ${level}\nRank: ${rank}`,
    ephemeral: true,
  });
}
