import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { metricsManagementPermissions } from "../config/permissions.js";
import { hasConfiguredCommandPermission } from "../lib/permissions.js";
import { getBotMetrics } from "../systems/bot-metrics.js";

function formatCounterMap(title: string, counters: Record<string, number>) {
  const entries = Object.entries(counters).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const lines = entries.length > 0 ? entries.map(([key, count]) => `- ${key}: ${count}`) : ["- none"];
  return [`**${title}**`, ...lines].join("\n");
}

function formatMetricsSummary() {
  const metrics = getBotMetrics();

  return [
    "**Bot Metrics**",
    "",
    formatCounterMap("Slash Commands", metrics.slashCommandUsageCounts),
    "",
    "**Passive Chat**",
    `- total triggers: ${metrics.passiveChat.triggerCount}`,
    `- quiet-gap triggers: ${metrics.passiveChat.quietGapTriggerCount}`,
    `- conversation nudges: ${metrics.passiveChat.conversationNudgeCount}`,
    "",
    formatCounterMap("Provider Usage", metrics.contentProviders.usageCounts),
    "",
    formatCounterMap("API Success", metrics.contentProviders.apiSuccessCounts),
    "",
    formatCounterMap("Fallback To Local", metrics.contentProviders.fallbackToLocalCounts),
    "",
    formatCounterMap("API Failure/Timeout", metrics.contentProviders.apiFailureCounts),
  ].join("\n");
}

export const data = new SlashCommandBuilder()
  .setName("metrics")
  .setDescription("View runtime bot metrics")
  .addSubcommand((subcommand) => subcommand.setName("view").setDescription("View current runtime metrics"));

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!hasConfiguredCommandPermission(interaction, metricsManagementPermissions)) {
    await interaction.reply({
      content: "You do not have permission to use this command.",
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({
    content: formatMetricsSummary(),
    ephemeral: true,
  });
}
