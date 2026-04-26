import {
  ChannelType,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { settingsManagementPermissions } from "../config/permissions.js";
import { hasConfiguredCommandPermission } from "../lib/permissions.js";
import {
  getPanelById,
  getRoleAccessPanelTargetChannel,
  postRoleAccessPanel,
} from "../systems/role-access-panels.js";

export const data = new SlashCommandBuilder()
  .setName("role-panel")
  .setDescription("Manage reusable role access panels")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("post")
      .setDescription("Post a role access panel")
      .addStringOption((option) =>
        option
          .setName("panel-id")
          .setDescription("Role access panel ID")
          .setRequired(true),
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel to post the panel in")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false),
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!hasConfiguredCommandPermission(interaction, settingsManagementPermissions)) {
    await interaction.reply({
      content: "You do not have permission to use this command.",
      ephemeral: true,
    });
    return;
  }

  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand !== "post") {
    await interaction.reply({
      content: "That role panel action is not available.",
      ephemeral: true,
    });
    return;
  }

  const panelId = interaction.options.getString("panel-id", true).trim();
  const panel = getPanelById(panelId);

  if (!panel) {
    await interaction.reply({
      content: `Role access panel **${panelId}** was not found.`,
      ephemeral: true,
    });
    return;
  }

  const targetChannel = await getRoleAccessPanelTargetChannel(interaction, panel);

  if (!targetChannel) {
    await interaction.reply({
      content: "I couldn't post that role access panel in the selected channel.",
      ephemeral: true,
    });
    return;
  }

  await postRoleAccessPanel(interaction, panel, targetChannel);
}
