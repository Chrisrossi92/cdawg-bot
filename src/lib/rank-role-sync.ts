import type { GuildMember } from "discord.js";
import { rankRoleIds } from "../config/rank-roles.js";

export async function syncRankRoleForMember(member: GuildMember | null, rank: string) {
  if (!member) {
    return;
  }

  const configuredRoleIds = (Object.values(rankRoleIds) as string[]).filter((roleId) => roleId.trim().length > 0);

  if (configuredRoleIds.length === 0) {
    return;
  }

  const targetRoleId = rankRoleIds[rank as keyof typeof rankRoleIds];

  if (!targetRoleId || targetRoleId.trim().length === 0) {
    return;
  }

  try {
    const rolesToRemove = configuredRoleIds.filter(
      (roleId) => roleId !== targetRoleId && member.roles.cache.has(roleId),
    );

    if (rolesToRemove.length > 0) {
      await member.roles.remove(rolesToRemove);
    }

    if (!member.roles.cache.has(targetRoleId)) {
      await member.roles.add(targetRoleId);
    }
  } catch {
    // Fail quietly if roles are missing or the bot cannot manage them.
  }
}
