import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { buildDogActionMessage, buildDogStatusMessage } from "../lib/cdawg-dog.js";
import { getRankMilestoneMessage } from "../lib/rank-milestones.js";
import { syncRankRoleForMember } from "../lib/rank-role-sync.js";
import { createLevelUpMessage } from "../systems/level-share.js";
import { addXp } from "../systems/xp.js";
import { getDogActionAvailability, getDogStatusSummary, performDogAction, type DogAction } from "../systems/cdawg-dog.js";

function formatActionAvailability(userId: string) {
  const availability = getDogActionAvailability(userId);
  const remainingActions = (Object.entries(availability) as [DogAction, boolean][])
    .filter(([, available]) => available)
    .map(([action]) => action);

  return remainingActions.length > 0 ? `Available today: ${remainingActions.join(", ")}` : "All dog actions are used up for today.";
}

async function maybeSendLevelUpFollowup(interaction: ChatInputCommandInteraction, xpResult: ReturnType<typeof addXp>) {
  if (!xpResult.awarded || !xpResult.leveledUp) {
    return;
  }

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

export const data = new SlashCommandBuilder()
  .setName("dog")
  .setDescription("Check on Cdawg Dog or help with daily actions")
  .addSubcommand((subcommand) => subcommand.setName("status").setDescription("View Cdawg Dog's current state"))
  .addSubcommand((subcommand) => subcommand.setName("feed").setDescription("Feed Cdawg Dog once for today"))
  .addSubcommand((subcommand) => subcommand.setName("play").setDescription("Play with Cdawg Dog once for today"))
  .addSubcommand((subcommand) => subcommand.setName("walk").setDescription("Walk Cdawg Dog once for today"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand(true);

  if (subcommand === "status") {
    const state = getDogStatusSummary();
    await interaction.reply({
      ...buildDogStatusMessage({
        title: "**Cdawg Dog Status**",
        state,
        imageKey: state.imageKey,
        extraLine: formatActionAvailability(interaction.user.id),
      }),
    });
    return;
  }

  const result = performDogAction(interaction.user.id, subcommand as DogAction);

  if (!result.ok) {
    await interaction.reply({
      ...buildDogStatusMessage({
        title: "**Cdawg Dog**",
        state: result.state,
        imageKey: result.state.imageKey,
        extraLine: `${result.error}\n${formatActionAvailability(interaction.user.id)}`,
      }),
      ephemeral: true,
    });
    return;
  }

  await interaction.reply(buildDogActionMessage({
    action: result.action,
    state: result.state,
    imageKey: result.state.imageKey,
    xpAmount: result.xpAmount,
    xpAwarded: result.xpAwarded,
  }));

  await maybeSendLevelUpFollowup(interaction, result.xpResult);
}
