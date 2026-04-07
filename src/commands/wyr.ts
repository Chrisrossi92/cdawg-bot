import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { getWyrText, resolveTopic } from "../lib/content.js";
import { syncRankRoleForMember } from "../lib/rank-role-sync.js";
import { addXp } from "../systems/xp.js";

const WYR_POLL_DURATION_MS = 5 * 60 * 1000;
const WYR_VOTE_XP = 2;
const WYR_SELECTABLE_TOPICS = ["general", "history", "pokemon", "valheim"] as const;

type VoteChoice = "A" | "B";

type ActiveWyrPoll = {
  promptText: string;
  optionA: string;
  optionB: string;
  votes: Map<string, VoteChoice>;
  totals: {
    A: number;
    B: number;
  };
  xpAwardedUserIds: Set<string>;
  messageId: string;
};

const activeWyrPolls = new Map<string, ActiveWyrPoll>();

function parseWyrPrompt(rawPrompt: string) {
  const match = rawPrompt.match(/^Would you rather\s+(.+?)\s+or\s+(.+?)\?$/i);

  if (!match) {
    return {
      promptText: rawPrompt,
      optionA: "Option A",
      optionB: "Option B",
    };
  }

  return {
    promptText: "Would You Rather...",
    optionA: match[1] ?? "Option A",
    optionB: match[2] ?? "Option B",
  };
}

function buildWyrButtons(pollId: string, disabled = false) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`wyr:${pollId}:A`)
      .setLabel("Option A")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`wyr:${pollId}:B`)
      .setLabel("Option B")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );
}

function getVoteTotals(votes: Map<string, VoteChoice>) {
  let countA = 0;
  let countB = 0;

  for (const vote of votes.values()) {
    if (vote === "A") {
      countA += 1;
      continue;
    }

    countB += 1;
  }

  return { A: countA, B: countB };
}

function formatPercentage(count: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((count / total) * 100)}%`;
}

function getPollResultLine(totals: { A: number; B: number }) {
  if (totals.A === totals.B) {
    return "Result: It's a tie.";
  }

  return totals.A > totals.B ? "Result: Option A wins." : "Result: Option B wins.";
}

function formatWyrPollMessage(poll: ActiveWyrPoll, closed = false) {
  const totalVotes = poll.totals.A + poll.totals.B;
  const header = closed ? "**Would You Rather...** `Closed`" : "**Would You Rather...**";
  const footer = closed ? `\n\n${getPollResultLine(poll.totals)}` : "";
  const intro = closed ? "" : "\nVote below. Results update live.\nYou can change your vote while the poll is open.";

  return `${header}
${poll.promptText}

A. ${poll.optionA}
B. ${poll.optionB}

${intro}

Votes:
Option A: ${poll.totals.A} (${formatPercentage(poll.totals.A, totalVotes)})
Option B: ${poll.totals.B} (${formatPercentage(poll.totals.B, totalVotes)})${footer}`;
}

export const data = new SlashCommandBuilder()
  .setName("wyr")
  .setDescription("Get a random Would You Rather prompt")
  .addStringOption((option) =>
    WYR_SELECTABLE_TOPICS.reduce(
      (builder, topic) => builder.addChoices({ name: topic, value: topic }),
      option.setName("topic").setDescription("Pick a topic for this prompt").setRequired(false),
    ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const topic = resolveTopic(interaction.options.getString("topic"), interaction.channelId);
  const rawPrompt = getWyrText(topic);

  if (!rawPrompt) {
    await interaction.reply("No Would You Rather prompts are available right now.");
    return;
  }

  const parsedPrompt = parseWyrPrompt(rawPrompt);
  const pollId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const reply = await interaction.reply({
    content: formatWyrPollMessage({
      ...parsedPrompt,
      votes: new Map(),
      totals: { A: 0, B: 0 },
      xpAwardedUserIds: new Set(),
      messageId: "",
    }),
    components: [buildWyrButtons(pollId)],
    fetchReply: true,
  });

  const poll: ActiveWyrPoll = {
    ...parsedPrompt,
    votes: new Map(),
    totals: { A: 0, B: 0 },
    xpAwardedUserIds: new Set(),
    messageId: reply.id,
  };

  activeWyrPolls.set(pollId, poll);

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: WYR_POLL_DURATION_MS,
  });

  collector.on("collect", async (buttonInteraction) => {
    const [prefix, collectedPollId, voteChoice] = buttonInteraction.customId.split(":");

    if (prefix !== "wyr" || collectedPollId !== pollId || (voteChoice !== "A" && voteChoice !== "B")) {
      await buttonInteraction.reply({
        content: "That vote does not belong to this WYR poll.",
        ephemeral: true,
      });
      return;
    }

    const activePoll = activeWyrPolls.get(pollId);

    if (!activePoll) {
      await buttonInteraction.reply({
        content: "This WYR poll is no longer active.",
        ephemeral: true,
      });
      return;
    }

    activePoll.votes.set(buttonInteraction.user.id, voteChoice);
    activePoll.totals = getVoteTotals(activePoll.votes);

    if (!activePoll.xpAwardedUserIds.has(buttonInteraction.user.id)) {
      const xpResult = addXp(buttonInteraction.user.id, WYR_VOTE_XP);

      if (xpResult.awarded) {
        activePoll.xpAwardedUserIds.add(buttonInteraction.user.id);

        if (xpResult.leveledUp && buttonInteraction.inCachedGuild()) {
          await syncRankRoleForMember(buttonInteraction.member, xpResult.newRank);
        }
      }
    }

    await buttonInteraction.update({
      content: formatWyrPollMessage(activePoll),
      components: [buildWyrButtons(pollId)],
    });
  });

  collector.on("end", async () => {
    const activePoll = activeWyrPolls.get(pollId);

    if (!activePoll) {
      return;
    }

    activeWyrPolls.delete(pollId);

    try {
      await reply.edit({
        content: formatWyrPollMessage(activePoll, true),
        components: [buildWyrButtons(pollId, true)],
      });
    } catch {
      // Ignore edit failures if the message was removed.
    }
  });
}
