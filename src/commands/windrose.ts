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
  .setName("windrose")
  .setDescription("Manage Windrose community game access")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("panel")
      .setDescription("Post the Windrose role-access panel")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel to post the panel in")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription("Optional panel message override")
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

  if (subcommand !== "panel") {
    await interaction.reply({
      content: "That Windrose action is not available.",
      ephemeral: true,
    });
    return;
  }

  const panel = getPanelById("windrose");

  if (!panel) {
    await interaction.reply({
      content: "Windrose access is not configured yet. Missing role access panel windrose.",
      ephemeral: true,
    });
    return;
  }

  const targetChannel = await getRoleAccessPanelTargetChannel(interaction, panel);

  if (!targetChannel) {
    await interaction.reply({
      content: "I couldn't post the Windrose panel in the selected channel.",
      ephemeral: true,
    });
    return;
  }

  const messageOverride = interaction.options.getString("message", false);

  await postRoleAccessPanel(interaction, panel, targetChannel, messageOverride);
}
