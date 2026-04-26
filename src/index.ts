import { ChannelType, Client, Collection, Events, GatewayIntentBits, PermissionFlagsBits } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import * as dotenv from "dotenv";
import { apiConfig } from "./config/api.js";
import { DOG_ENABLED } from "./config/dog.js";
import {
  CHAT_XP_AMOUNT,
  CHAT_XP_COOLDOWN_MS,
  CHAT_XP_MIN_NON_SPACE_CHARS,
  CHAT_XP_MIN_WORD_COUNT,
  chatXpEligibleChannelIds,
} from "./config/chat-xp.js";
import * as announce from "./commands/announce.js";
import * as botHelp from "./commands/bot-help.js";
import { welcomeConfig } from "./config/welcome.js";
import * as ping from "./commands/ping.js";
import * as ranks from "./commands/ranks.js";
import * as settings from "./commands/settings.js";
import * as fact from "./commands/fact.js";
import * as dog from "./commands/dog.js";
import * as joke from "./commands/joke.js";
import * as leaderboard from "./commands/leaderboard.js";
import * as metrics from "./commands/metrics.js";
import * as profile from "./commands/profile.js";
import * as prompt from "./commands/prompt.js";
import * as rolePanel from "./commands/role-panel.js";
import * as trivia from "./commands/trivia.js";
import * as triviaLeaderboard from "./commands/trivia-leaderboard.js";
import * as triviaStats from "./commands/trivia-stats.js";
import * as windrose from "./commands/windrose.js";
import * as xpCheck from "./commands/xp-check.js";
import * as xpGrant from "./commands/xp-grant.js";
import * as xpInfo from "./commands/xp-info.js";
import * as xpRemove from "./commands/xp-remove.js";
import * as xpSet from "./commands/xp-set.js";
import * as wyr from "./commands/wyr.js";
import { getRankMilestoneMessage } from "./lib/rank-milestones.js";
import { startScheduler } from "./scheduler/scheduler.js";
import { handleLevelShareInteraction } from "./systems/level-share.js";
import { handleRoleFollowups } from "./systems/role-followups.js";
import {
  buildRoleAccessPanelMessage,
  getPanelById,
  handleRoleAccessPanelInteraction,
  isSendableGuildTextChannel,
  upsertPanel,
} from "./systems/role-access-panels.js";
import { addXp } from "./systems/xp.js";
import { buildWelcomeMessage } from "./lib/welcome.js";
import { isLikelyCommandMessage, normalizeChatMessage, passesMessageQualityThresholds } from "./lib/chat-messages.js";
import { incrementSlashCommandUsage } from "./systems/bot-metrics.js";
import { handlePassiveChatMessage } from "./systems/passive-chat.js";
import { startApiServer } from "./api/server.js";
import { pushManualContentToChannel, pushHistoryEventToChannel, triggerAutomatedContentNow } from "./lib/manual-content-push.js";
import { getHistoryEventById } from "./lib/history-content.js";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

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
  ...(DOG_ENABLED ? [[dog.data.name, dog] as const] : []),
  [ping.data.name, ping],
  [fact.data.name, fact],
  [joke.data.name, joke],
  [leaderboard.data.name, leaderboard],
  [metrics.data.name, metrics],
  [profile.data.name, profile],
  [prompt.data.name, prompt],
  [rolePanel.data.name, rolePanel],
  [ranks.data.name, ranks],
  [settings.data.name, settings],
  [trivia.data.name, trivia],
  [triviaLeaderboard.data.name, triviaLeaderboard],
  [triviaStats.data.name, triviaStats],
  [windrose.data.name, windrose],
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

  if (apiConfig.enabled) {
    startApiServer({
      getHealthSnapshot: () => ({
        botReady: client.isReady(),
        botTag: client.isReady() ? client.user.tag : null,
      }),
      getGuildMetadata: async () => {
        if (!guildId) {
          return {
            roles: [],
            channels: [],
          };
        }

        const guild = await readyClient.guilds.fetch(guildId);
        await guild.roles.fetch();
        await guild.channels.fetch();

        const roles = [...guild.roles.cache.values()]
          .filter((role) => role.id !== guild.id)
          .map((role) => ({
            id: role.id,
            name: role.name,
            color: role.color,
            position: role.position,
          }))
          .sort((left, right) => (right.position ?? 0) - (left.position ?? 0) || left.name.localeCompare(right.name));

        const channels = [...guild.channels.cache.values()]
          .filter((channel) => {
            if (!channel) {
              return false;
            }

            const supportedTypes = [ChannelType.GuildText, ChannelType.GuildAnnouncement];

            if (!supportedTypes.includes(channel.type)) {
              return false;
            }

            const permissions = channel.permissionsFor(readyClient.user);
            return permissions?.has(PermissionFlagsBits.SendMessages) === true;
          })
          .map((channel) => ({
            id: channel.id,
            name: channel.name,
            type: ChannelType[channel.type] ?? String(channel.type),
            parentId: channel.parentId ?? null,
          }))
          .sort((left, right) => left.name.localeCompare(right.name));

        return {
          roles,
          channels,
        };
      },
      pushManualContent: (request) => pushManualContentToChannel(client, request),
      postRoleAccessPanel: async (request) => {
        if (!client.isReady()) {
          return {
            ok: false,
            code: "BOT_NOT_READY",
            error: "Bot is not ready.",
          };
        }

        const panel = getPanelById(request.panelId);

        if (!panel) {
          return {
            ok: false,
            code: "PANEL_NOT_FOUND",
            error: "Role access panel was not found.",
          };
        }

        const targetChannelId = request.channelId?.trim() || panel.targetChannelId;

        if (!targetChannelId) {
          return {
            ok: false,
            code: "CHANNEL_UNAVAILABLE",
            error: "No target channel was supplied or configured for this panel.",
          };
        }

        try {
          const channel = await client.channels.fetch(targetChannelId);

          if (!isSendableGuildTextChannel(channel)) {
            return {
              ok: false,
              code: "CHANNEL_UNAVAILABLE",
              error: "Target channel is not available or is not a text channel.",
            };
          }

          await channel.send(buildRoleAccessPanelMessage(panel));

          const lastPostedAt = Date.now();
          upsertPanel({
            ...panel,
            lastPostedAt,
          });

          return {
            ok: true,
            panelId: panel.id,
            channelId: targetChannelId,
            lastPostedAt,
          };
        } catch (error) {
          console.error(`[role-panels] failed to post panel ${panel.id} to ${targetChannelId}:`, error);
          return {
            ok: false,
            code: "SEND_FAILED",
            error: "Failed to post the role access panel.",
          };
        }
      },
      pushHistoryPreview: async (request) => {
        const event = getHistoryEventById(request.eventId);

        if (!event) {
          return {
            ok: false,
            code: "CONTENT_UNAVAILABLE",
            error: "History event was not found for today's date key.",
          };
        }

        return pushHistoryEventToChannel(client, {
          channelId: request.channelId,
          event,
          source: "manual",
        });
      },
      triggerAutomatedContentNow: (request) => triggerAutomatedContentNow(client, request),
    });
    console.log(
      `[api] server enabled at http://${apiConfig.host}:${apiConfig.port}`
    );
  } else {
    console.log("[api] disabled");
  }
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
  await handleRoleFollowups(oldMember, newMember);
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

    const rolePanelHandled = await handleRoleAccessPanelInteraction(interaction);

    if (rolePanelHandled) {
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

client.login(token);
