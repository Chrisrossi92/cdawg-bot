import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import { data as announce } from "./commands/announce.js";
import { data as botHelp } from "./commands/bot-help.js";
import { data as ping } from "./commands/ping.js";
import { data as fact } from "./commands/fact.js";
import { data as joke } from "./commands/joke.js";
import { data as leaderboard } from "./commands/leaderboard.js";
import { data as metrics } from "./commands/metrics.js";
import { data as profile } from "./commands/profile.js";
import { data as prompt } from "./commands/prompt.js";
import { data as ranks } from "./commands/ranks.js";
import { data as settings } from "./commands/settings.js";
import { data as trivia } from "./commands/trivia.js";
import { data as triviaLeaderboard } from "./commands/trivia-leaderboard.js";
import { data as triviaStats } from "./commands/trivia-stats.js";
import { data as xpCheck } from "./commands/xp-check.js";
import { data as xpGrant } from "./commands/xp-grant.js";
import { data as xpInfo } from "./commands/xp-info.js";
import { data as xpRemove } from "./commands/xp-remove.js";
import { data as xpSet } from "./commands/xp-set.js";
import { data as wyr } from "./commands/wyr.js";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error("Missing DISCORD_TOKEN, DISCORD_CLIENT_ID, or DISCORD_GUILD_ID in environment.");
}

const appClientId = clientId;
const appGuildId = guildId;

const commands = [
  announce.toJSON(),
  botHelp.toJSON(),
  ping.toJSON(),
  fact.toJSON(),
  joke.toJSON(),
  leaderboard.toJSON(),
  metrics.toJSON(),
  profile.toJSON(),
  prompt.toJSON(),
  ranks.toJSON(),
  settings.toJSON(),
  trivia.toJSON(),
  triviaLeaderboard.toJSON(),
  triviaStats.toJSON(),
  xpCheck.toJSON(),
  xpGrant.toJSON(),
  xpInfo.toJSON(),
  xpRemove.toJSON(),
  xpSet.toJSON(),
  wyr.toJSON(),
];
const rest = new REST({ version: "10" }).setToken(token);

async function main() {
  await rest.put(Routes.applicationGuildCommands(appClientId, appGuildId), {
    body: commands,
  });

  console.log("Registered slash commands.");
}

void main();
