import {
  ChannelType,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { announcementPermissions } from "../config/permissions.js";
import { hasConfiguredCommandPermission } from "../lib/permissions.js";

export const data = new SlashCommandBuilder()
  .setName("announce")
  .setDescription("Post a formatted server announcement")
  .addStringOption((option) =>
    option.setName("title").setDescription("Announcement title").setRequired(true),
  )
  .addStringOption((option) =>
    option.setName("message").setDescription("Announcement message").setRequired(true),
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Channel to post the announcement in")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!hasConfiguredCommandPermission(interaction, announcementPermissions)) {
    await interaction.reply({
      content: "You do not have permission to use this command.",
      ephemeral: true,
    });
    return;
  }

  const title = interaction.options.getString("title", true);
  const message = interaction.options.getString("message", true);
  const targetChannel = interaction.options.getChannel("channel") ?? interaction.channel;

  if (!targetChannel || !("send" in targetChannel)) {
    await interaction.reply({
      content: "I couldn't post that announcement in the selected channel.",
      ephemeral: true,
    });
    return;
  }

  await targetChannel.send(`**📢 ${title}**\n${message}`);

  await interaction.reply({
    content: `Announcement posted in ${targetChannel}.`,
    ephemeral: true,
  });
}
