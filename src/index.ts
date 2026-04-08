import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import * as dotenv from "dotenv";
import {
  CHAT_XP_AMOUNT,
  CHAT_XP_COOLDOWN_MS,
  CHAT_XP_MIN_NON_SPACE_CHARS,
  CHAT_XP_MIN_WORD_COUNT,
  chatXpEligibleChannelIds,
} from "./config/chat-xp.js";
import * as announce from "./commands/announce.js";
import { roleFollowupConfig } from "./config/role-followups.js";
import * as botHelp from "./commands/bot-help.js";
import { welcomeConfig } from "./config/welcome.js";
import * as ping from "./commands/ping.js";
import * as ranks from "./commands/ranks.js";
import * as settings from "./commands/settings.js";
import * as fact from "./commands/fact.js";
import * as joke from "./commands/joke.js";
import * as leaderboard from "./commands/leaderboard.js";
import * as metrics from "./commands/metrics.js";
import * as profile from "./commands/profile.js";
import * as prompt from "./commands/prompt.js";
import * as trivia from "./commands/trivia.js";
import * as triviaLeaderboard from "./commands/trivia-leaderboard.js";
import * as triviaStats from "./commands/trivia-stats.js";
import * as xpCheck from "./commands/xp-check.js";
import * as xpGrant from "./commands/xp-grant.js";
import * as xpInfo from "./commands/xp-info.js";
import * as xpRemove from "./commands/xp-remove.js";
import * as xpSet from "./commands/xp-set.js";
import * as wyr from "./commands/wyr.js";
import { getRankMilestoneMessage } from "./lib/rank-milestones.js";
import { startScheduler } from "./scheduler/scheduler.js";
import { handleLevelShareInteraction } from "./systems/level-share.js";
import { addXp } from "./systems/xp.js";
import { buildWelcomeMessage } from "./lib/welcome.js";
import { isLikelyCommandMessage, normalizeChatMessage, passesMessageQualityThresholds } from "./lib/chat-messages.js";
import { incrementSlashCommandUsage } from "./systems/bot-metrics.js";
import { handlePassiveChatMessage } from "./systems/passive-chat.js";
import { startApiServer } from "./api/server.js";

dotenv.config();

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("Missing DISCORD_TOKEN in environment.");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const lastChatXpGainAtByUserId = new Map<string, number>();
const recentChatMessagesByUserId = new Map<string, string[]>();
const RECENT_CHAT_MESSAGE_LIMIT = 5;
const activeRoleFollowupKeys = new Set<string>();

type CommandModule = {
  data: {
    name: string;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

function isRecentDuplicateMessage(userId: string, normalizedContent: string) {
  const recentMessages = recentChatMessagesByUserId.get(userId) ?? [];
  return recentMessages.includes(normalizedContent);
}

function rememberRecentChatMessage(userId: string, normalizedContent: string) {
  const recentMessages = recentChatMessagesByUserId.get(userId) ?? [];
  const nextMessages = [...recentMessages.filter((message) => message !== normalizedContent), normalizedContent];
  recentChatMessagesByUserId.set(userId, nextMessages.slice(-RECENT_CHAT_MESSAGE_LIMIT));
}

const commands = new Collection<string, CommandModule>([
  [announce.data.name, announce],
  [botHelp.data.name, botHelp],
  [ping.data.name, ping],
  [fact.data.name, fact],
  [joke.data.name, joke],
  [leaderboard.data.name, leaderboard],
  [metrics.data.name, metrics],
  [profile.data.name, profile],
  [prompt.data.name, prompt],
  [ranks.data.name, ranks],
  [settings.data.name, settings],
  [trivia.data.name, trivia],
  [triviaLeaderboard.data.name, triviaLeaderboard],
  [triviaStats.data.name, triviaStats],
  [xpCheck.data.name, xpCheck],
  [xpGrant.data.name, xpGrant],
  [xpInfo.data.name, xpInfo],
  [xpRemove.data.name, xpRemove],
  [xpSet.data.name, xpSet],
  [wyr.data.name, wyr],
]);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Cdawg Bot is online as ${readyClient.user.tag}`);
  startScheduler(readyClient);
});

client.on(Events.GuildMemberAdd, async (member) => {
  const memberLabel = member.user.tag ?? member.user.id;
  console.log(`[welcome] GuildMemberAdd fired for ${memberLabel}`);
  console.log(`[welcome] enabled=${welcomeConfig.enabled} channelId=${welcomeConfig.welcomeChannelId || "unset"}`);

  if (!welcomeConfig.enabled || !welcomeConfig.welcomeChannelId) {
    return;
  }

  try {
    const channel = await member.guild.channels.fetch(welcomeConfig.welcomeChannelId);
    const channelFound = Boolean(channel);
    const channelSendable = Boolean(channel?.isTextBased() && "send" in channel);

    console.log(`[welcome] target channel found=${channelFound}`);
    console.log(`[welcome] target channel sendable=${channelSendable}`);

    if (!channel?.isTextBased() || !("send" in channel)) {
      return;
    }

    console.log(`[welcome] sending welcome message for ${memberLabel}`);
    await channel.send(buildWelcomeMessage(member));
  } catch (error) {
    console.error(`[welcome] failed to send welcome message for ${memberLabel}:`, error);
    // Fail quietly if the welcome channel is missing or inaccessible.
  }
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const memberLabel = newMember.user.tag ?? newMember.user.id;
  const configuredRoles = Object.values(roleFollowupConfig.roles);
  const oldRoleIds = [...oldMember.roles.cache.keys()];
  const newRoleIds = [...newMember.roles.cache.keys()];
  const addedRoleIds = newRoleIds.filter((roleId) => !oldMember.roles.cache.has(roleId));
  const removedRoleIds = oldRoleIds.filter((roleId) => !newMember.roles.cache.has(roleId));

  console.log(`[role-followup] GuildMemberUpdate fired for ${memberLabel}`);
  console.log(`[role-followup] old roles=${oldRoleIds.join(", ") || "none"}`);
  console.log(`[role-followup] new roles=${newRoleIds.join(", ") || "none"}`);
  console.log(`[role-followup] newly added roles=${addedRoleIds.join(", ") || "none"}`);

  for (const roleConfig of configuredRoles) {
    if (!removedRoleIds.includes(roleConfig.roleId)) {
      continue;
    }

    const followupKey = `${newMember.id}:${roleConfig.roleId}`;
    activeRoleFollowupKeys.delete(followupKey);
    console.log(`[role-followup] cleared duplicate guard for removed role ${roleConfig.roleId}`);
  }

  for (const roleConfig of configuredRoles) {
    const followupKey = `${newMember.id}:${roleConfig.roleId}`;
    const hadRole = oldMember.roles.cache.has(roleConfig.roleId);
    const hasRole = newMember.roles.cache.has(roleConfig.roleId);

    if (!hasRole) {
      continue;
    }

    if (hadRole || activeRoleFollowupKeys.has(followupKey)) {
      continue;
    }

    console.log(`[role-followup] matched configured role ${roleConfig.roleId}`);
    console.log(`[role-followup] target channelId=${roleConfig.channelId}`);

    try {
      const channel = await newMember.guild.channels.fetch(roleConfig.channelId);
      const channelFound = Boolean(channel);
      const channelSendable = Boolean(channel?.isTextBased() && "send" in channel);

      console.log(`[role-followup] target channel found=${channelFound}`);
      console.log(`[role-followup] target channel sendable=${channelSendable}`);

      if (!channel?.isTextBased() || !("send" in channel)) {
        continue;
      }

      activeRoleFollowupKeys.add(followupKey);
      console.log(`[role-followup] sending follow-up for ${memberLabel} role=${roleConfig.roleId}`);
      await channel.send(`<@${newMember.id}> ${roleConfig.message}`);
    } catch (error) {
      console.error(
        `[role-followup] failed to send follow-up for ${memberLabel} role=${roleConfig.roleId}:`,
        error,
      );
      // Fail quietly if the follow-up channel is missing or inaccessible.
    }
  }

  if (!configuredRoles.some((roleConfig) => addedRoleIds.includes(roleConfig.roleId))) {
    console.log("[role-followup] no configured follow-up matched");
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) {
    return;
  }

  if (chatXpEligibleChannelIds.has(message.channelId) && !isLikelyCommandMessage(message.content)) {
    const normalizedContent = normalizeChatMessage(message.content);

    if (
      normalizedContent &&
      passesMessageQualityThresholds(message.content, CHAT_XP_MIN_NON_SPACE_CHARS, CHAT_XP_MIN_WORD_COUNT) &&
      !isRecentDuplicateMessage(message.author.id, normalizedContent)
    ) {
      const now = Date.now();
      const lastGainAt = lastChatXpGainAtByUserId.get(message.author.id) ?? 0;

      if (now - lastGainAt < CHAT_XP_COOLDOWN_MS) {
        rememberRecentChatMessage(message.author.id, normalizedContent);
      } else {
        const xpResult = addXp(message.author.id, CHAT_XP_AMOUNT);

        rememberRecentChatMessage(message.author.id, normalizedContent);

        if (xpResult.awarded) {
          lastChatXpGainAtByUserId.set(message.author.id, now);

          const milestoneMessage = getRankMilestoneMessage(
            message.author.id,
            xpResult.previousRank,
            xpResult.newRank,
            xpResult.newLevel,
            xpResult.newXp,
          );

          if (milestoneMessage) {
            await message.channel.send(milestoneMessage);
          }
        }
      }
    }
  }

  await handlePassiveChatMessage(message);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    const handled = await handleLevelShareInteraction(interaction);

    if (handled) {
      return;
    }
  }

  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commands.get(interaction.commandName);

  if (!command) {
    await interaction.reply({
      content: "That command is not available.",
      ephemeral: true,
    });
    return;
  }

  try {
    incrementSlashCommandUsage(interaction.commandName);
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error running /${interaction.commandName}:`, error);

    const errorMessage = { content: "There was an error while running that command.", ephemeral: true } as const;

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
      return;
    }

    await interaction.reply(errorMessage);
  }
});

startApiServer({
  getHealthSnapshot: () => ({
    botReady: client.isReady(),
    botTag: client.isReady() ? client.user.tag : null,
  }),
});

client.login(token);
