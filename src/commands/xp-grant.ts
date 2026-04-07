import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { xpManagementPermissions } from "../config/permissions.js";
import { getRankMilestoneMessage } from "../lib/rank-milestones.js";
import { syncRankRoleForMember } from "../lib/rank-role-sync.js";
import { hasConfiguredCommandPermission } from "../lib/permissions.js";
import { grantXpDirect } from "../systems/xp.js";

export const data = new SlashCommandBuilder()
  .setName("xp-grant")
  .setDescription("Grant XP to a user")
  .addUserOption((option) => option.setName("user").setDescription("User to grant XP to").setRequired(true))
  .addIntegerOption((option) => option.setName("amount").setDescription("XP amount to grant").setRequired(true).setMinValue(0))
  .addStringOption((option) => option.setName("reason").setDescription("Reason for the XP grant").setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!hasConfiguredCommandPermission(interaction, xpManagementPermissions)) {
    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    return;
  }

  const user = interaction.options.getUser("user", true);
  const amount = interaction.options.getInteger("amount", true);
  const reason = interaction.options.getString("reason");
  const result = grantXpDirect(user.id, amount);

  if (interaction.inCachedGuild()) {
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (result.rankChanged) {
      await syncRankRoleForMember(member, result.newRank);
    }
  }

  const reasonLine = reason ? `\nReason: ${reason}` : "";
  const milestoneMessage = getRankMilestoneMessage(
    user.id,
    result.previousRank,
    result.newRank,
    result.newLevel,
    result.newXp,
  );
  const milestoneLine = milestoneMessage ? `\nMilestone: ${result.newRank}` : "";

  await interaction.reply({
    content: `Granted XP to <@${user.id}>.\nXP: ${result.newXp}\nLevel: ${result.newLevel}\nRank: ${result.newRank}${milestoneLine}${reasonLine}`,
    ephemeral: true,
  });
}
