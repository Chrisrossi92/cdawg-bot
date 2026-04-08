import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { formatFactMessage, getResolvedContentItem } from "../lib/content.js";
import { getRankMilestoneMessage } from "../lib/rank-milestones.js";
import { syncRankRoleForMember } from "../lib/rank-role-sync.js";
import { topics } from "../config/topics.js";
import { addXp } from "../systems/xp.js";
import { createLevelUpMessage } from "../systems/level-share.js";

export const data = new SlashCommandBuilder()
  .setName("fact")
  .setDescription("Replies with a random fact.")
  .addStringOption((option) =>
    topics.reduce(
      (builder, topic) => builder.addChoices({ name: topic, value: topic }),
      option.setName("topic").setDescription("Pick a topic for this fact").setRequired(false),
    ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const randomFact = getResolvedContentItem("fact", interaction.options.getString("topic"), interaction.channelId);

  if (!randomFact) {
    await interaction.reply("No facts are available right now.");
    return;
  }

  const xpResult = addXp(interaction.user.id, 5);
  await interaction.reply(formatFactMessage(randomFact));

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
