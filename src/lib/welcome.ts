import type { GuildMember } from "discord.js";
import { welcomeConfig } from "../config/welcome.js";

export function buildWelcomeMessage(member: GuildMember) {
  const games = welcomeConfig.availableGames.join(" and ");

  return `Welcome to **${welcomeConfig.serverLabel}**, ${member}! We currently have **${games}** here.\n\nReply in ${welcomeConfig.replyChannelMention} with:\n1. how you found the Discord\n2. which game you want to play\n\nOnce you do that, we’ll give you the right role and open the correct channels for you.`;
}
