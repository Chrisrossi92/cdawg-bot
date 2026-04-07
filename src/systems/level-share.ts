import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ButtonInteraction,
  type InteractionReplyOptions,
} from "discord.js";
import { getRank } from "./xp.js";

type LevelShareState = {
  userId: string;
  level: number;
  rank: string;
  channelId: string;
  shared: boolean;
};

const levelShareStates = new Map<string, LevelShareState>();

function buildShareButton(shareId: string, disabled = false) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`level-share:${shareId}`)
      .setLabel("Share")
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
  );
}

export function createLevelUpMessage(
  userId: string,
  level: number,
  channelId: string | null,
): InteractionReplyOptions {
  if (!channelId) {
    return {
      content: `🔥 You leveled up to Level ${level}!`,
      ephemeral: true,
    };
  }

  const shareId = `${userId}:${level}:${Date.now()}`;

  levelShareStates.set(shareId, {
    userId,
    level,
    rank: getRank(userId),
    channelId,
    shared: false,
  });

  return {
    content: `🔥 You leveled up to Level ${level}!`,
    components: [buildShareButton(shareId)],
    ephemeral: true,
  };
}

export async function handleLevelShareInteraction(interaction: ButtonInteraction) {
  if (!interaction.customId.startsWith("level-share:")) {
    return false;
  }

  const shareId = interaction.customId.replace("level-share:", "");
  const shareState = levelShareStates.get(shareId);

  if (!shareState) {
    await interaction.reply({
      content: "That level-up share is no longer available.",
      ephemeral: true,
    });
    return true;
  }

  if (interaction.user.id !== shareState.userId) {
    await interaction.reply({
      content: "Only the player who leveled up can share this achievement.",
      ephemeral: true,
    });
    return true;
  }

  if (shareState.shared) {
    await interaction.reply({
      content: "You already shared this level-up.",
      ephemeral: true,
    });
    return true;
  }

  if (!interaction.channel || !("send" in interaction.channel)) {
    await interaction.reply({
      content: "I couldn't share this achievement in the current channel.",
      ephemeral: true,
    });
    return true;
  }

  shareState.shared = true;

  await interaction.channel.send(
    `🎉 <@${shareState.userId}> reached **Level ${shareState.level}** and earned the **${shareState.rank}** rank!`,
  );

  await interaction.update({
    components: [buildShareButton(shareId, true)],
  });

  return true;
}
