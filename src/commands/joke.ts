import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { formatJokeMessage, getJokeText, resolveTopic } from "../lib/content.js";

const JOKE_SELECTABLE_TOPICS = ["general", "palworld", "valheim"] as const;

export const data = new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Get a random joke for this channel")
  .addStringOption((option) =>
    JOKE_SELECTABLE_TOPICS.reduce(
      (builder, topic) => builder.addChoices({ name: topic, value: topic }),
      option.setName("topic").setDescription("Pick a topic for this joke").setRequired(false),
    ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const topic = resolveTopic(interaction.options.getString("topic"), interaction.channelId);
  const joke = getJokeText(topic);

  if (!joke) {
    await interaction.reply("No jokes are available right now.");
    return;
  }

  await interaction.reply(formatJokeMessage(joke));
}
