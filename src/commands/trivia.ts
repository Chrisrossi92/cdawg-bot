import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
} from "discord.js";
import { getTriviaItem, resolveTopic } from "../lib/content.js";
import { getRankMilestoneMessage } from "../lib/rank-milestones.js";
import { syncRankRoleForMember } from "../lib/rank-role-sync.js";
import { addXp } from "../systems/xp.js";
import { createLevelUpMessage } from "../systems/level-share.js";
import { recordCorrectTriviaAnswer, resetTriviaStreak } from "../systems/trivia-streaks.js";

const TRIVIA_BONUS_XP = 15;
const TRIVIA_CORRECT_XP = 8;
const TRIVIA_TIMEOUT_MS = 10 * 60 * 1000;
const TRIVIA_SELECTABLE_TOPICS = ["general", "history", "pokemon", "palworld", "valheim"] as const;

type ActiveTriviaQuestion = {
  question: string;
  correctAnswer: string;
  options: readonly [string, string, string, string];
  userAnswers: Map<string, string>;
  answeredUsers: Set<string>;
  correctUsers: Set<string>;
  fastestCorrectUserId: string | null;
  firstCorrectAt: number | null;
};

const activeTriviaQuestions = new Map<string, ActiveTriviaQuestion>();

function buildTriviaButtons(questionId: string, disabled = false) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`trivia:${questionId}:0`)
      .setLabel("A")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`trivia:${questionId}:1`)
      .setLabel("B")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`trivia:${questionId}:2`)
      .setLabel("C")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`trivia:${questionId}:3`)
      .setLabel("D")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
  );
}

function getCorrectOptionLabel(options: readonly [string, string, string, string], answer: string): string {
  const correctIndex = options.findIndex((option) => option === answer);
  return ["A", "B", "C", "D"][correctIndex] ?? answer;
}

function formatTriviaQuestion(item: { question: string; options: readonly [string, string, string, string] }) {
  const [optionA, optionB, optionC, optionD] = item.options;

  return `**Cdawg Bot Trivia**\n${item.question}\n\nA. ${optionA}\nB. ${optionB}\nC. ${optionC}\nD. ${optionD}\n\nAnswers are open for 10 minutes.\nFastest correct gets bonus XP.\nOthers can still answer before time runs out.`;
}

function formatResolvedTriviaQuestion(activeQuestion: ActiveTriviaQuestion, userId: string) {
  const labels = ["A", "B", "C", "D"];
  const optionLines = activeQuestion.options.map((option, index) => {
    const label = labels[index] ?? "?";
    const isCorrect = option === activeQuestion.correctAnswer;
    return isCorrect ? `${label}. ✅ ${option}` : `${label}. ${option}`;
  });

  return `**Cdawg Bot Trivia**\n${activeQuestion.question}\n\n${optionLines.join("\n")}\n\n🏆 First correct: <@${userId}>`;
}

function formatClosedTriviaQuestion(activeQuestion: ActiveTriviaQuestion) {
  const labels = ["A", "B", "C", "D"];
  const correctOption = getCorrectOptionLabel(activeQuestion.options, activeQuestion.correctAnswer);
  const optionLines = activeQuestion.options.map((option, index) => {
    const label = labels[index] ?? "?";
    const isCorrect = option === activeQuestion.correctAnswer;
    return isCorrect ? `${label}. ✅ ${option}` : `${label}. ${option}`;
  });
  const totalAnswers = activeQuestion.answeredUsers.size;
  const correctCount = activeQuestion.correctUsers.size;
  const wrongCount = totalAnswers - correctCount;
  const fastestLine = activeQuestion.fastestCorrectUserId
    ? `🏆 Fastest correct: <@${activeQuestion.fastestCorrectUserId}>`
    : "🏆 No correct answers this round.";

  return `**Cdawg Bot Trivia Results**\n${activeQuestion.question}\n\n${optionLines.join("\n")}\n\n✅ Correct answer: ${correctOption}\n${fastestLine}\n📊 Correct: ${correctCount} • Incorrect: ${wrongCount}`;
}

async function handleTriviaAnswer(
  buttonInteraction: ButtonInteraction,
  questionId: string,
  optionIndex: number,
) {
  const activeQuestion = activeTriviaQuestions.get(questionId);

  if (!activeQuestion) {
    await buttonInteraction.reply({
      content: "This trivia question is no longer active.",
      ephemeral: true,
    });
    return false;
  }

  if (activeQuestion.answeredUsers.has(buttonInteraction.user.id)) {
    await buttonInteraction.reply({
      content: "You already answered this trivia question.",
      ephemeral: true,
    });
    return false;
  }

  activeQuestion.answeredUsers.add(buttonInteraction.user.id);
  const selectedAnswer = activeQuestion.options[optionIndex];
  activeQuestion.userAnswers.set(buttonInteraction.user.id, selectedAnswer ?? "");

  if (!selectedAnswer) {
    await buttonInteraction.reply({
      content: "That answer option is invalid.",
      ephemeral: true,
    });
    return false;
  }

  if (selectedAnswer === activeQuestion.correctAnswer) {
    const isFirstCorrect = activeQuestion.firstCorrectAt === null;

    if (isFirstCorrect) {
      activeQuestion.firstCorrectAt = Date.now();
      activeQuestion.fastestCorrectUserId = buttonInteraction.user.id;
    }

    activeQuestion.correctUsers.add(buttonInteraction.user.id);

    const xpAmount = isFirstCorrect ? TRIVIA_BONUS_XP : TRIVIA_CORRECT_XP;
    const streakResult = recordCorrectTriviaAnswer(buttonInteraction.user.id);
    const totalXp = xpAmount + streakResult.bonusXp;
    const xpResult = addXp(buttonInteraction.user.id, totalXp);
    const xpText = xpResult.awarded
      ? isFirstCorrect
        ? `🔥 First Correct! +${xpAmount} XP`
        : `✅ Correct! +${xpAmount} XP`
      : isFirstCorrect
        ? "🔥 First Correct! Cooldown blocked XP this time."
        : "✅ Correct! Cooldown blocked XP this time.";
    const streakMessage = xpResult.awarded
      ? streakResult.bonusXp > 0
        ? `\n🔥 Trivia streak: ${streakResult.streak} in a row! +${streakResult.bonusXp} bonus XP`
        : ""
      : streakResult.bonusXp > 0
        ? `\n🔥 Trivia streak: ${streakResult.streak} in a row! Bonus XP is waiting once cooldown clears.`
        : "";
    const levelUpReply =
      xpResult.awarded && xpResult.leveledUp
        ? createLevelUpMessage(buttonInteraction.user.id, xpResult.newLevel, buttonInteraction.channelId)
        : null;

    if (xpResult.awarded && xpResult.leveledUp && buttonInteraction.inCachedGuild()) {
      await syncRankRoleForMember(buttonInteraction.member, xpResult.newRank);
    }

    const milestoneMessage = xpResult.awarded
      ? getRankMilestoneMessage(
          buttonInteraction.user.id,
          xpResult.previousRank,
          xpResult.newRank,
          xpResult.newLevel,
          xpResult.newXp,
        )
      : null;

    if (milestoneMessage && buttonInteraction.channel && "send" in buttonInteraction.channel) {
      await buttonInteraction.channel.send(milestoneMessage);
    }

    const replyOptions = levelUpReply
      ? {
          ...levelUpReply,
          content: `${xpText}${streakMessage}\n${levelUpReply.content}`,
        }
      : {
          content: `${xpText}${streakMessage}`,
          ephemeral: true,
        };

    await buttonInteraction.reply(replyOptions);

    return false;
  }

  resetTriviaStreak(buttonInteraction.user.id);

  await buttonInteraction.reply({
    content: "❌ Wrong!",
    ephemeral: true,
  });

  return false;
}

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
  const topic = resolveTopic(interaction.options.getString("topic"), interaction.channelId);
  const item = getTriviaItem(topic);

  if (!item) {
    await interaction.reply("No trivia questions are available right now.");
    return;
  }

  const questionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const row = buildTriviaButtons(questionId);

  activeTriviaQuestions.set(questionId, {
    question: item.question,
    correctAnswer: item.answer,
    options: item.options,
    userAnswers: new Map(),
    answeredUsers: new Set(),
    correctUsers: new Set(),
    fastestCorrectUserId: null,
    firstCorrectAt: null,
  });

  const reply = await interaction.reply({
    content: formatTriviaQuestion(item),
    components: [row],
    fetchReply: true,
  });

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: TRIVIA_TIMEOUT_MS,
  });

  collector.on("collect", async (buttonInteraction) => {
    const [prefix, collectedQuestionId, rawOptionIndex] = buttonInteraction.customId.split(":");

    if (prefix !== "trivia" || collectedQuestionId !== questionId) {
      await buttonInteraction.reply({
        content: "That button does not belong to this trivia question.",
        ephemeral: true,
      });
      return;
    }

    const optionIndex = Number(rawOptionIndex);
    await handleTriviaAnswer(
      buttonInteraction,
      questionId,
      optionIndex,
    );
  });

  collector.on("end", async () => {
    const activeQuestion = activeTriviaQuestions.get(questionId);

    if (!activeQuestion) {
      return;
    }

    activeTriviaQuestions.delete(questionId);

    try {
      await reply.edit({
        content: formatClosedTriviaQuestion(activeQuestion),
        components: [buildTriviaButtons(questionId, true)],
      });
    } catch {
      // Ignore edit failures if the message was removed or already updated.
    }
  });
}
