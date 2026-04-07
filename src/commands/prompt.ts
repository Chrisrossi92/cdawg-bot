import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { formatPromptMessage, getPromptText, resolveTopic } from "../lib/content.js";
import { getRankMilestoneMessage } from "../lib/rank-milestones.js";
import { syncRankRoleForMember } from "../lib/rank-role-sync.js";
import { addXp } from "../systems/xp.js";
import { createLevelUpMessage } from "../systems/level-share.js";

const PROMPT_SELECTABLE_TOPICS = [
  "general",
  "history",
  "genealogy",
  "palworld",
  "pokemon",
  "harry-potter",
  "music",
  "valheim",
] as const;

export const data = new SlashCommandBuilder()
  .setName("prompt")
  .setDescription("Get a discussion prompt for this channel")
  .addStringOption((option) =>
    PROMPT_SELECTABLE_TOPICS.reduce(
      (builder, topic) => builder.addChoices({ name: topic, value: topic }),
      option.setName("topic").setDescription("Pick a topic for this prompt").setRequired(false),
    ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const topic = resolveTopic(interaction.options.getString("topic"), interaction.channelId);
  const prompt = getPromptText(topic);

  if (!prompt) {
    await interaction.reply("No discussion prompts are available right now.");
    return;
  }

  const xpResult = addXp(interaction.user.id, 5);
  await interaction.reply(formatPromptMessage(prompt));

  if (xpResult.awarded && xpResult.leveledUp) {
    if (interaction.inCachedGuild()) {
      await syncRankRoleForMember(interaction.member, xpResult.newRank);
    }

    const milestoneMessage = getRankMilestoneMessage(
      interaction.user.id,
      xpResult.previousRank,
      xpResult.newRank,
      xpResult.newLevel,
      xpResult.newXp,
    );

    if (milestoneMessage && interaction.channel && "send" in interaction.channel) {
      await interaction.channel.send(milestoneMessage);
    }

    await interaction.followUp(createLevelUpMessage(interaction.user.id, xpResult.newLevel, interaction.channelId));
  }
}
