import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type GuildMember,
  type GuildTextBasedChannel,
} from "discord.js";
import { windroseConfig } from "../config/windrose.js";

export const windroseAccessButtonCustomId = "windrose-access:request";

function buildWindroseAccessButton(disabled = false) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(windroseAccessButtonCustomId)
      .setLabel(windroseConfig.buttonLabel)
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
  );
}

export function buildWindroseAccessPanel(messageOverride?: string | null) {
  const message = messageOverride?.trim() || windroseConfig.panelMessage;

  return {
    content: `**${windroseConfig.panelTitle}**\n${message}`,
    components: [buildWindroseAccessButton()],
  };
}

export async function sendWindroseAccessPanel(
  interaction: ChatInputCommandInteraction,
  targetChannel: GuildTextBasedChannel,
  messageOverride?: string | null,
) {
  await targetChannel.send(buildWindroseAccessPanel(messageOverride));

  await interaction.reply({
    content: `Windrose access panel posted in ${targetChannel}.`,
    ephemeral: true,
  });
}

export function isSendableGuildTextChannel(channel: unknown): channel is GuildTextBasedChannel {
  return Boolean(
    channel &&
      typeof channel === "object" &&
      "type" in channel &&
      channel.type === ChannelType.GuildText &&
      "send" in channel,
  );
}

export async function getWindrosePanelTargetChannel(interaction: ChatInputCommandInteraction) {
  const selectedChannel = interaction.options.getChannel("channel");

  if (selectedChannel) {
    return isSendableGuildTextChannel(selectedChannel) ? selectedChannel : null;
  }

  if (windroseConfig.panelChannelId.trim() && interaction.guild) {
    const configuredChannel = await interaction.guild.channels.fetch(windroseConfig.panelChannelId);
    return isSendableGuildTextChannel(configuredChannel) ? configuredChannel : null;
  }

  if (interaction.channel && isSendableGuildTextChannel(interaction.channel)) {
    return interaction.channel;
  }

  return null;
}

export async function handleWindroseAccessInteraction(interaction: ButtonInteraction) {
  if (interaction.customId !== windroseAccessButtonCustomId) {
    return false;
  }

  if (!windroseConfig.roleId.trim()) {
    await interaction.reply({
      content: "Windrose access is not configured yet. Missing WINDROSE_ROLE_ID.",
      ephemeral: true,
    });
    return true;
  }

  if (!interaction.inCachedGuild()) {
    await interaction.reply({
      content: "Windrose access can only be requested inside the server.",
      ephemeral: true,
    });
    return true;
  }

  const member = interaction.member as GuildMember;

  if (member.roles.cache.has(windroseConfig.roleId)) {
    await interaction.reply({
      content: "You already have Windrose access.",
      ephemeral: true,
    });
    return true;
  }

  try {
    await member.roles.add(windroseConfig.roleId);
    await interaction.reply({
      content: "Windrose access granted. You now have the Windrose role.",
      ephemeral: true,
    });
  } catch (error) {
    console.error(`[windrose-access] failed to assign role ${windroseConfig.roleId} to ${interaction.user.id}:`, error);
    await interaction.reply({
      content: "I couldn't grant Windrose access. Please ask an admin to check my role permissions.",
      ephemeral: true,
    });
  }

  return true;
}
