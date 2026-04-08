import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { settingsManagementPermissions } from "../config/permissions.js";
import { hasConfiguredCommandPermission } from "../lib/permissions.js";
import { getBotSettings, updateBotSettings } from "../systems/bot-settings.js";

function formatSettingsSummary() {
  const settings = getBotSettings();

  return [
    "**Runtime Settings**",
    `Passive Chat Enabled: ${settings.passiveChat.enabled ? "on" : "off"}`,
    `Passive Chat Trigger Chance: ${settings.passiveChat.triggerChance}`,
    `Passive Chat Global Cooldown: ${settings.passiveChat.globalCooldownMs}ms`,
    `Passive Chat Channel Cooldown: ${settings.passiveChat.channelCooldownMs}ms`,
    `Passive Chat Quiet Gap: ${settings.passiveChat.quietChannelThresholdMs}ms`,
    `Passive Chat Conversation Threshold: ${settings.passiveChat.conversationNudgeMessageThreshold}`,
    `Passive Chat Allowed Channels: ${
      settings.passiveChat.eligibleChannelIds.length > 0 ? settings.passiveChat.eligibleChannelIds.join(", ") : "none"
    }`,
    `Content Provider Logging: ${settings.contentProviders.debugLogging ? "on" : "off"}`,
  ].join("\n");
}

function buildUpdatedMessage(label: string, value: string) {
  return `Updated ${label}.\nNew Value: ${value}`;
}

export const data = new SlashCommandBuilder()
  .setName("settings")
  .setDescription("View or update runtime bot settings")
  .addSubcommand((subcommand) => subcommand.setName("view").setDescription("View current runtime settings"))
  .addSubcommand((subcommand) =>
    subcommand
      .setName("set-passive-enabled")
      .setDescription("Enable or disable passive chat")
      .addBooleanOption((option) =>
        option.setName("enabled").setDescription("Whether passive chat should be enabled").setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("set-trigger-chance")
      .setDescription("Set passive chat trigger chance")
      .addNumberOption((option) =>
        option.setName("value").setDescription("Chance between 0 and 1").setRequired(true).setMinValue(0).setMaxValue(1),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("set-global-cooldown")
      .setDescription("Set passive chat global cooldown in milliseconds")
      .addIntegerOption((option) =>
        option.setName("milliseconds").setDescription("Global cooldown in ms").setRequired(true).setMinValue(1000),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("set-channel-cooldown")
      .setDescription("Set passive chat per-channel cooldown in milliseconds")
      .addIntegerOption((option) =>
        option.setName("milliseconds").setDescription("Per-channel cooldown in ms").setRequired(true).setMinValue(1000),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("set-quiet-gap")
      .setDescription("Set passive chat quiet-gap timing in milliseconds")
      .addIntegerOption((option) =>
        option.setName("milliseconds").setDescription("Quiet-gap timing in ms").setRequired(true).setMinValue(1000),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("set-conversation-threshold")
      .setDescription("Set messages required before a conversation nudge")
      .addIntegerOption((option) =>
        option.setName("count").setDescription("Message threshold").setRequired(true).setMinValue(1),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("set-provider-logging")
      .setDescription("Enable or disable content provider debug logging")
      .addBooleanOption((option) =>
        option.setName("enabled").setDescription("Whether content provider logging should be enabled").setRequired(true),
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

  switch (subcommand) {
    case "view": {
      await interaction.reply({
        content: formatSettingsSummary(),
        ephemeral: true,
      });
      return;
    }
    case "set-passive-enabled": {
      const enabled = interaction.options.getBoolean("enabled", true);
      updateBotSettings({
        passiveChat: {
          enabled,
        },
      });
      await interaction.reply({
        content: buildUpdatedMessage("passive chat enabled", enabled ? "on" : "off"),
        ephemeral: true,
      });
      return;
    }
    case "set-trigger-chance": {
      const value = interaction.options.getNumber("value", true);
      updateBotSettings({
        passiveChat: {
          triggerChance: value,
        },
      });
      await interaction.reply({
        content: buildUpdatedMessage("passive chat trigger chance", String(value)),
        ephemeral: true,
      });
      return;
    }
    case "set-global-cooldown": {
      const milliseconds = interaction.options.getInteger("milliseconds", true);
      updateBotSettings({
        passiveChat: {
          globalCooldownMs: milliseconds,
        },
      });
      await interaction.reply({
        content: buildUpdatedMessage("passive chat global cooldown", `${milliseconds}ms`),
        ephemeral: true,
      });
      return;
    }
    case "set-channel-cooldown": {
      const milliseconds = interaction.options.getInteger("milliseconds", true);
      updateBotSettings({
        passiveChat: {
          channelCooldownMs: milliseconds,
        },
      });
      await interaction.reply({
        content: buildUpdatedMessage("passive chat per-channel cooldown", `${milliseconds}ms`),
        ephemeral: true,
      });
      return;
    }
    case "set-quiet-gap": {
      const milliseconds = interaction.options.getInteger("milliseconds", true);
      updateBotSettings({
        passiveChat: {
          quietChannelThresholdMs: milliseconds,
        },
      });
      await interaction.reply({
        content: buildUpdatedMessage("passive chat quiet-gap timing", `${milliseconds}ms`),
        ephemeral: true,
      });
      return;
    }
    case "set-conversation-threshold": {
      const count = interaction.options.getInteger("count", true);
      updateBotSettings({
        passiveChat: {
          conversationNudgeMessageThreshold: count,
        },
      });
      await interaction.reply({
        content: buildUpdatedMessage("passive chat conversation threshold", String(count)),
        ephemeral: true,
      });
      return;
    }
    case "set-provider-logging": {
      const enabled = interaction.options.getBoolean("enabled", true);
      updateBotSettings({
        contentProviders: {
          debugLogging: enabled,
        },
      });
      await interaction.reply({
        content: buildUpdatedMessage("content provider logging", enabled ? "on" : "off"),
        ephemeral: true,
      });
      return;
    }
    default: {
      await interaction.reply({
        content: "That settings action is not available.",
        ephemeral: true,
      });
    }
  }
}
