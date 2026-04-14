import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { Topic } from "../config/topics.js";
import { getEligibleTriviaItem } from "../lib/trivia-topic-eligibility.js";
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
  const topic = interaction.options.getString("topic") as Topic | null;
  const triviaResult = await getEligibleTriviaItem(interaction.channelId, topic);

  if (!triviaResult.ok) {
    await interaction.reply(triviaResult.error);
    return;
  }

  await postInteractiveTriviaSession({
    item: triviaResult.item,
    source: "command",
    post: (payload) => interaction.reply(payload),
  });
}
