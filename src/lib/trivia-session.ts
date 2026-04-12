import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  type ButtonInteraction,
  type Message,
} from "discord.js";
import type { TriviaItem } from "../content/trivia/general.js";
import { getRankMilestoneMessage } from "./rank-milestones.js";
import { syncRankRoleForMember } from "./rank-role-sync.js";
import { addXp } from "../systems/xp.js";
import { createLevelUpMessage } from "../systems/level-share.js";
import { recordCorrectTriviaAnswer, resetTriviaStreak } from "../systems/trivia-streaks.js";

const TRIVIA_BONUS_XP = 15;
const TRIVIA_CORRECT_XP = 8;
const TRIVIA_TIMEOUT_MS = 10 * 60 * 1000;

type TriviaSessionSource = "command" | "manual" | "feed" | "scheduler" | "daily-challenge" | "passive-chat";

type ActiveTriviaQuestion = {
  question: string;
  correctAnswer: string;
  options: readonly [string, string, string, string];
  userAnswers: Map<string, string>;
  answeredUsers: Set<string>;
  correctUsers: Set<string>;
  fastestCorrectUserId: string | null;
  firstCorrectAt: number | null;
  source: TriviaSessionSource;
};

const activeTriviaQuestions = new Map<string, ActiveTriviaQuestion>();

function logTriviaSession(
  event: "posted" | "answered" | "closed",
  details: Record<string, string | null | undefined>,
) {
  const parts = [`event=${event}`];

  for (const [key, value] of Object.entries(details)) {
    if (value) {
      parts.push(`${key}=${value}`);
    }
  }

  console.log(`[trivia-session] ${parts.join(" ")}`);
}

function buildTriviaButtons(questionId: string, disabled = false) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`trivia:${questionId}:0`).setLabel("A").setStyle(ButtonStyle.Primary).setDisabled(disabled),
    new ButtonBuilder().setCustomId(`trivia:${questionId}:1`).setLabel("B").setStyle(ButtonStyle.Primary).setDisabled(disabled),
    new ButtonBuilder().setCustomId(`trivia:${questionId}:2`).setLabel("C").setStyle(ButtonStyle.Primary).setDisabled(disabled),
    new ButtonBuilder().setCustomId(`trivia:${questionId}:3`).setLabel("D").setStyle(ButtonStyle.Primary).setDisabled(disabled),
  );
}

function getCorrectOptionLabel(options: readonly [string, string, string, string], answer: string): string {
  const correctIndex = options.findIndex((option) => option === answer);
  return ["A", "B", "C", "D"][correctIndex] ?? answer;
}

function formatTriviaQuestion(item: TriviaItem) {
  const [optionA, optionB, optionC, optionD] = item.options;
  return `**Cdawg Bot Trivia**\n${item.question}\n\nA. ${optionA}\nB. ${optionB}\nC. ${optionC}\nD. ${optionD}\n\nAnswers are open for 10 minutes.\nFastest correct gets bonus XP.\nOthers can still answer before time runs out.`;
}

function formatResolvedTriviaQuestion(activeQuestion: ActiveTriviaQuestion, userId: string) {
  const labels = ["A", "B", "C", "D"];
  const optionLines = activeQuestion.options.map((option, index) => {
    const label = labels[index] ?? "?";
    return option === activeQuestion.correctAnswer ? `${label}. ✅ ${option}` : `${label}. ${option}`;
  });

  return `**Cdawg Bot Trivia**\n${activeQuestion.question}\n\n${optionLines.join("\n")}\n\n🏆 First correct: <@${userId}>`;
}

function formatClosedTriviaQuestion(activeQuestion: ActiveTriviaQuestion) {
  const labels = ["A", "B", "C", "D"];
  const correctOption = getCorrectOptionLabel(activeQuestion.options, activeQuestion.correctAnswer);
  const optionLines = activeQuestion.options.map((option, index) => {
    const label = labels[index] ?? "?";
    return option === activeQuestion.correctAnswer ? `${label}. ✅ ${option}` : `${label}. ${option}`;
  });
  const totalAnswers = activeQuestion.answeredUsers.size;
  const correctCount = activeQuestion.correctUsers.size;
  const wrongCount = totalAnswers - correctCount;
  const fastestLine = activeQuestion.fastestCorrectUserId
    ? `🏆 Fastest correct: <@${activeQuestion.fastestCorrectUserId}>`
    : "🏆 No correct answers this round.";

  return `**Cdawg Bot Trivia Results**\n${activeQuestion.question}\n\n${optionLines.join("\n")}\n\n✅ Correct answer: ${correctOption}\n${fastestLine}\n📊 Correct: ${correctCount} • Incorrect: ${wrongCount}`;
}

async function handleTriviaAnswer(buttonInteraction: ButtonInteraction, questionId: string, optionIndex: number) {
  const activeQuestion = activeTriviaQuestions.get(questionId);

  if (!activeQuestion) {
    await buttonInteraction.reply({
      content: "This trivia question is no longer active.",
      ephemeral: true,
    });
    return;
  }

  if (activeQuestion.answeredUsers.has(buttonInteraction.user.id)) {
    await buttonInteraction.reply({
      content: "You already answered this trivia question.",
      ephemeral: true,
    });
    return;
  }

  activeQuestion.answeredUsers.add(buttonInteraction.user.id);
  const selectedAnswer = activeQuestion.options[optionIndex];
  activeQuestion.userAnswers.set(buttonInteraction.user.id, selectedAnswer ?? "");

  if (!selectedAnswer) {
    await buttonInteraction.reply({
      content: "That answer option is invalid.",
      ephemeral: true,
    });
    return;
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

    logTriviaSession("answered", {
      source: activeQuestion.source,
      questionId,
      userId: buttonInteraction.user.id,
      result: isFirstCorrect ? "first-correct" : "correct",
    });
    await buttonInteraction.reply(replyOptions);
    return;
  }

  resetTriviaStreak(buttonInteraction.user.id);
  logTriviaSession("answered", {
    source: activeQuestion.source,
    questionId,
    userId: buttonInteraction.user.id,
    result: "wrong",
  });
  await buttonInteraction.reply({
    content: "❌ Wrong!",
    ephemeral: true,
  });
}

export async function postInteractiveTriviaSession(options: {
  item: TriviaItem;
  source: TriviaSessionSource;
  post: (payload: {
    content: string;
    components: ActionRowBuilder<ButtonBuilder>[];
    fetchReply: true;
  }) => Promise<Message>;
}) {
  const questionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const row = buildTriviaButtons(questionId);

  activeTriviaQuestions.set(questionId, {
    question: options.item.question,
    correctAnswer: options.item.answer,
    options: options.item.options,
    userAnswers: new Map(),
    answeredUsers: new Set(),
    correctUsers: new Set(),
    fastestCorrectUserId: null,
    firstCorrectAt: null,
    source: options.source,
  });

  const message = await options.post({
    content: formatTriviaQuestion(options.item),
    components: [row],
    fetchReply: true,
  });

  logTriviaSession("posted", {
    source: options.source,
    questionId,
    messageId: message.id,
  });

  const collector = message.createMessageComponentCollector({
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

    await handleTriviaAnswer(buttonInteraction, questionId, Number(rawOptionIndex));
  });

  collector.on("end", async () => {
    const activeQuestion = activeTriviaQuestions.get(questionId);

    if (!activeQuestion) {
      return;
    }

    activeTriviaQuestions.delete(questionId);
    logTriviaSession("closed", {
      source: activeQuestion.source,
      questionId,
      messageId: message.id,
    });

    try {
      await message.edit({
        content: formatClosedTriviaQuestion(activeQuestion),
        components: [buildTriviaButtons(questionId, true)],
      });
    } catch {
      // Ignore edit failures if the message was removed or already updated.
    }
  });

  return message;
}
