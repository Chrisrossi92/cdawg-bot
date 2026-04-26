import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GuildMember, PartialGuildMember } from "discord.js";
import { roleFollowupConfig } from "../config/role-followups.js";

export type RoleFollowup = {
  id: string;
  roleId: string;
  channelId: string;
  message: string;
  enabled: boolean;
};

type RoleFollowupStore = {
  followups: RoleFollowup[];
};

type RoleFollowupInput = RoleFollowup;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "role-followups.json");
const activeRoleFollowupKeys = new Set<string>();
const seededFollowupIds = new Set(Object.keys(roleFollowupConfig.roles));

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeFollowup(value: unknown): RoleFollowup | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id);
  const roleId = sanitizeString(value.roleId);
  const channelId = sanitizeString(value.channelId);
  const message = sanitizeString(value.message);

  if (!id || !roleId || !channelId || !message) {
    return null;
  }

  return {
    id,
    roleId,
    channelId,
    message,
    enabled: value.enabled !== false,
  };
}

function sanitizeStore(value: unknown): RoleFollowupStore {
  if (!isRecord(value) || !Array.isArray(value.followups)) {
    return {
      followups: [],
    };
  }

  return {
    followups: value.followups
      .map((followup) => sanitizeFollowup(followup))
      .filter((followup): followup is RoleFollowup => Boolean(followup)),
  };
}

function messageHasUserMention(message: string) {
  return /\{user\}|<@/.test(message);
}

function preserveLegacyAutoMention(message: string) {
  const trimmedMessage = message.trim();
  return messageHasUserMention(trimmedMessage) ? trimmedMessage : `{user} ${trimmedMessage}`;
}

function migrateLegacySeedFollowups(store: RoleFollowupStore) {
  let migrated = false;
  const followups = store.followups.map((followup) => {
    if (!seededFollowupIds.has(followup.id) || messageHasUserMention(followup.message)) {
      return followup;
    }

    migrated = true;
    return {
      ...followup,
      message: preserveLegacyAutoMention(followup.message),
    };
  });

  return {
    store: {
      followups,
    },
    migrated,
  };
}

function buildSeedFollowups(): RoleFollowupStore {
  return {
    followups: Object.entries(roleFollowupConfig.roles).map(([id, followup]) => ({
      id,
      roleId: followup.roleId,
      channelId: followup.channelId,
      message: preserveLegacyAutoMention(followup.message),
      enabled: true,
    })),
  };
}

function saveFollowups(store: RoleFollowupStore) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(store, null, 2));
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[role-followup] could not save role followups to ${DATA_FILE}.`, error);
  }
}

export function loadFollowups(): RoleFollowupStore {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, "utf8");
    const { store, migrated } = migrateLegacySeedFollowups(sanitizeStore(JSON.parse(fileContents)));

    if (migrated) {
      saveFollowups(store);
    }

    return store;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[role-followup] could not load role followups from ${DATA_FILE}.`, error);
      return {
        followups: [],
      };
    }

    const seededStore = buildSeedFollowups();
    saveFollowups(seededStore);
    return seededStore;
  }
}

let activeFollowupStore = loadFollowups();

export function getFollowups() {
  return activeFollowupStore.followups;
}

export function getFollowupsForRole(roleId: string) {
  return activeFollowupStore.followups.filter((followup) => followup.enabled && followup.roleId === roleId);
}

export function upsertFollowup(followup: RoleFollowupInput) {
  const nextFollowup: RoleFollowup = {
    id: followup.id.trim(),
    roleId: followup.roleId.trim(),
    channelId: followup.channelId.trim(),
    message: followup.message.trim(),
    enabled: followup.enabled !== false,
  };
  const currentFollowup = activeFollowupStore.followups.find((entry) => entry.id === nextFollowup.id);

  activeFollowupStore = {
    followups: currentFollowup
      ? activeFollowupStore.followups.map((entry) => (entry.id === nextFollowup.id ? nextFollowup : entry))
      : [...activeFollowupStore.followups, nextFollowup],
  };
  saveFollowups(activeFollowupStore);
  return nextFollowup;
}

export function deleteFollowup(id: string) {
  const currentFollowup = activeFollowupStore.followups.find((entry) => entry.id === id);

  if (!currentFollowup) {
    return false;
  }

  activeFollowupStore = {
    followups: activeFollowupStore.followups.filter((entry) => entry.id !== id),
  };
  saveFollowups(activeFollowupStore);
  return true;
}

function renderFollowupMessage(followup: RoleFollowup, member: GuildMember) {
  const displayName = member.displayName || member.user.username;

  return followup.message
    .replace(/\{user\}/g, `<@${member.id}>`)
    .replace(/\{username\}/g, displayName)
    .replace(/\{role\}/g, `<@&${followup.roleId}>`)
    .replace(/\{channel\}/g, `<#${followup.channelId}>`);
}

export async function handleRoleFollowups(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
  const memberLabel = newMember.user.tag ?? newMember.user.id;
  const oldRoleIds = [...oldMember.roles.cache.keys()];
  const newRoleIds = [...newMember.roles.cache.keys()];
  const addedRoleIds = newRoleIds.filter((roleId) => !oldMember.roles.cache.has(roleId));
  const removedRoleIds = oldRoleIds.filter((roleId) => !newMember.roles.cache.has(roleId));

  console.log(`[role-followup] GuildMemberUpdate fired for ${memberLabel}`);
  console.log(`[role-followup] old roles=${oldRoleIds.join(", ") || "none"}`);
  console.log(`[role-followup] new roles=${newRoleIds.join(", ") || "none"}`);
  console.log(`[role-followup] newly added roles=${addedRoleIds.join(", ") || "none"}`);

  for (const roleId of removedRoleIds) {
    for (const followup of getFollowupsForRole(roleId)) {
      const followupKey = `${newMember.id}:${followup.roleId}`;
      activeRoleFollowupKeys.delete(followupKey);
      console.log(`[role-followup] cleared duplicate guard for removed role ${followup.roleId}`);
    }
  }

  for (const roleId of addedRoleIds) {
    for (const followup of getFollowupsForRole(roleId)) {
      const followupKey = `${newMember.id}:${followup.roleId}`;

      if (activeRoleFollowupKeys.has(followupKey)) {
        continue;
      }

      console.log(`[role-followup] matched configured role ${followup.roleId}`);
      console.log(`[role-followup] target channelId=${followup.channelId}`);

      try {
        const channel = await newMember.guild.channels.fetch(followup.channelId);
        const channelFound = Boolean(channel);
        const channelSendable = Boolean(channel?.isTextBased() && "send" in channel);

        console.log(`[role-followup] target channel found=${channelFound}`);
        console.log(`[role-followup] target channel sendable=${channelSendable}`);

        if (!channel?.isTextBased() || !("send" in channel)) {
          continue;
        }

        activeRoleFollowupKeys.add(followupKey);
        console.log(`[role-followup] sending follow-up for ${memberLabel} role=${followup.roleId}`);
        await channel.send(renderFollowupMessage(followup, newMember));
      } catch (error) {
        console.error(
          `[role-followup] failed to send follow-up for ${memberLabel} role=${followup.roleId}:`,
          error,
        );
        // Fail quietly if the follow-up channel is missing or inaccessible.
      }
    }
  }

  if (!addedRoleIds.some((roleId) => getFollowupsForRole(roleId).length > 0)) {
    console.log("[role-followup] no configured follow-up matched");
  }
}
