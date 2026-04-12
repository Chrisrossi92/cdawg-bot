import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { getResolvedContentItem } from "../lib/content.js";
import { postInteractiveTriviaSession } from "../lib/trivia-session.js";
const TRIVIA_SELECTABLE_TOPICS = ["general", "history", "pokemon", "palworld", "valheim"] as const;

export const data = new SlashCommandBuilder()
  .setName("trivia")
  .setDescription("Get a trivia question for this channel")
  .addStringOption((option) =>
    TRIVIA_SELECTABLE_TOPICS.reduce(
      (builder, topic) => builder.addChoices({ name: topic, value: topic }),
      option.setName("topic").setDescription("Pick a topic for this trivia").setRequired(false),
    ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const item = await getResolvedContentItem("trivia", interaction.options.getString("topic"), interaction.channelId);

  if (!item) {
    await interaction.reply("No trivia questions are available right now.");
    return;
  }

  await postInteractiveTriviaSession({
    item,
    source: "command",
    post: (payload) => interaction.reply(payload),
  });
}
