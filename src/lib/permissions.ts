import { PermissionFlagsBits, type ChatInputCommandInteraction } from "discord.js";

type PermissionConfig = {
  allowedRoleIds: readonly string[];
  allowManageGuild: boolean;
  allowAdministrator: boolean;
};

export function hasConfiguredCommandPermission(
  interaction: ChatInputCommandInteraction,
  permissionConfig: PermissionConfig,
) {
  if (!interaction.inCachedGuild()) {
    return false;
  }

  const member = interaction.member;

  if (permissionConfig.allowedRoleIds.some((roleId) => member.roles.cache.has(roleId))) {
    return true;
  }

  if (permissionConfig.allowAdministrator && member.permissions.has(PermissionFlagsBits.Administrator)) {
    return true;
  }

  if (permissionConfig.allowManageGuild && member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return true;
  }

  return false;
}
