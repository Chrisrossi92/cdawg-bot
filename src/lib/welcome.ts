import type { GuildMember } from "discord.js";
import { buildWelcomeMessage as buildConfiguredWelcomeMessage } from "../systems/welcome-settings.js";

export function buildWelcomeMessage(member: GuildMember) {
  return buildConfiguredWelcomeMessage(member);
}
