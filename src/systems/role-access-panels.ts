import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type GuildMember,
  type GuildTextBasedChannel,
} from "discord.js";
import { windroseConfig } from "../config/windrose.js";

export type RoleAccessPanel = {
  id: string;
  title: string;
  body: string;
  buttonLabel: string;
  roleId: string;
  targetChannelId: string | null;
  successMessage: string | null;
  alreadyHasRoleMessage: string | null;
  active: boolean;
  createdAt: number;
  updatedAt: number;
  lastPostedAt: number | null;
};

type RoleAccessPanelStore = {
  panels: RoleAccessPanel[];
};

type RoleAccessPanelInput = Pick<
  RoleAccessPanel,
  "id" | "title" | "body" | "buttonLabel" | "roleId" | "targetChannelId" | "successMessage" | "alreadyHasRoleMessage" | "active"
> &
  Partial<Pick<RoleAccessPanel, "createdAt" | "updatedAt" | "lastPostedAt">>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "role-access-panels.json");
const legacyWindroseButtonCustomId = "windrose-access:request";
export const roleAccessPanelCustomIdPrefix = "role-access-panel:";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function sanitizeString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeNullableString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function sanitizeTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.floor(value);
}

function buildDefaultWindrosePanel(now = Date.now()): RoleAccessPanel {
  return {
    id: "windrose",
    title: windroseConfig.panelTitle,
    body: windroseConfig.panelMessage,
    buttonLabel: windroseConfig.buttonLabel,
    roleId: windroseConfig.roleId,
    targetChannelId: windroseConfig.panelChannelId.trim() || null,
    successMessage: "Windrose access granted. You now have the Windrose role.",
    alreadyHasRoleMessage: "You already have Windrose access.",
    active: true,
    createdAt: now,
    updatedAt: now,
    lastPostedAt: null,
  };
}

function sanitizePanel(value: unknown): RoleAccessPanel | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id);
  const title = sanitizeString(value.title);
  const body = sanitizeString(value.body);
  const buttonLabel = sanitizeString(value.buttonLabel);
  const createdAt = sanitizeTimestamp(value.createdAt);
  const updatedAt = sanitizeTimestamp(value.updatedAt);

  if (!id || !title || !body || !buttonLabel || !createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    title,
    body,
    buttonLabel,
    roleId: sanitizeNullableString(value.roleId) ?? "",
    targetChannelId: sanitizeNullableString(value.targetChannelId),
    successMessage: sanitizeNullableString(value.successMessage),
    alreadyHasRoleMessage: sanitizeNullableString(value.alreadyHasRoleMessage),
    active: value.active !== false,
    createdAt,
    updatedAt,
    lastPostedAt: sanitizeTimestamp(value.lastPostedAt),
  };
}

function sanitizeStore(value: unknown): RoleAccessPanelStore {
  if (!isRecord(value) || !Array.isArray(value.panels)) {
    return {
      panels: [],
    };
  }

  return {
    panels: value.panels
      .map((panel) => sanitizePanel(panel))
      .filter((panel): panel is RoleAccessPanel => Boolean(panel)),
  };
}

export function savePanels(store = activePanelStore) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const temporaryFilePath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(temporaryFilePath, JSON.stringify(store, null, 2));
    fs.renameSync(temporaryFilePath, DATA_FILE);
  } catch (error) {
    console.warn(`[role-panels] could not save role access panels to ${DATA_FILE}.`, error);
  }
}

export function loadPanels(): RoleAccessPanelStore {
  try {
    const fileContents = fs.readFileSync(DATA_FILE, "utf8");
    return sanitizeStore(JSON.parse(fileContents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`[role-panels] could not load role access panels from ${DATA_FILE}.`, error);
      return {
        panels: [],
      };
    }

    const seededStore = {
      panels: [buildDefaultWindrosePanel()],
    };
    savePanels(seededStore);
    return seededStore;
  }
}

let activePanelStore = loadPanels();

export function listPanels() {
  return activePanelStore.panels;
}

export function getPanelById(id: string) {
  return activePanelStore.panels.find((panel) => panel.id === id) ?? null;
}

export function upsertPanel(panel: RoleAccessPanelInput) {
  const now = Date.now();
  const currentPanel = getPanelById(panel.id);
  const nextPanel: RoleAccessPanel = {
    ...panel,
    id: panel.id.trim(),
    title: panel.title.trim(),
    body: panel.body.trim(),
    buttonLabel: panel.buttonLabel.trim(),
    roleId: panel.roleId.trim(),
    targetChannelId: panel.targetChannelId?.trim() || null,
    successMessage: panel.successMessage?.trim() || null,
    alreadyHasRoleMessage: panel.alreadyHasRoleMessage?.trim() || null,
    createdAt: currentPanel?.createdAt ?? panel.createdAt ?? now,
    updatedAt: now,
    lastPostedAt: panel.lastPostedAt ?? currentPanel?.lastPostedAt ?? null,
  };

  activePanelStore = {
    panels: currentPanel
      ? activePanelStore.panels.map((entry) => (entry.id === nextPanel.id ? nextPanel : entry))
      : [...activePanelStore.panels, nextPanel],
  };
  savePanels();
  return nextPanel;
}

export function deletePanel(id: string) {
  const panel = getPanelById(id);

  if (!panel) {
    return false;
  }

  activePanelStore = {
    panels: activePanelStore.panels.filter((entry) => entry.id !== id),
  };
  savePanels();
  return true;
}

export function buildRoleAccessPanelCustomId(panelId: string) {
  return `${roleAccessPanelCustomIdPrefix}${panelId}`;
}

function buildRoleAccessPanelButton(panel: RoleAccessPanel) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(buildRoleAccessPanelCustomId(panel.id))
      .setLabel(panel.buttonLabel)
      .setStyle(ButtonStyle.Success)
      .setDisabled(!panel.active),
  );
}

function buildRoleAccessPanelEmbed(panel: RoleAccessPanel) {
  return new EmbedBuilder()
    .setTitle(panel.title)
    .setDescription(panel.body)
    .setColor(panel.active ? 0x137333 : 0x74859a);
}

export function buildRoleAccessPanelMessage(panel: RoleAccessPanel) {
  return {
    embeds: [buildRoleAccessPanelEmbed(panel)],
    components: [buildRoleAccessPanelButton(panel)],
  };
}

export function isSendableGuildTextChannel(channel: unknown): channel is GuildTextBasedChannel {
  return Boolean(
    channel &&
      typeof channel === "object" &&
      "type" in channel &&
      channel.type === ChannelType.GuildText &&
      "send" in channel,
  );
}

export async function getRoleAccessPanelTargetChannel(interaction: ChatInputCommandInteraction, panel: RoleAccessPanel) {
  const selectedChannel = interaction.options.getChannel("channel");

  if (selectedChannel) {
    return isSendableGuildTextChannel(selectedChannel) ? selectedChannel : null;
  }

  if (panel.targetChannelId && interaction.guild) {
    const configuredChannel = await interaction.guild.channels.fetch(panel.targetChannelId);
    return isSendableGuildTextChannel(configuredChannel) ? configuredChannel : null;
  }

  if (interaction.channel && isSendableGuildTextChannel(interaction.channel)) {
    return interaction.channel;
  }

  return null;
}

export async function postRoleAccessPanel(
  interaction: ChatInputCommandInteraction,
  panel: RoleAccessPanel,
  targetChannel: GuildTextBasedChannel,
  bodyOverride?: string | null,
) {
  const postedPanel = bodyOverride?.trim() ? { ...panel, body: bodyOverride.trim() } : panel;
  await targetChannel.send(buildRoleAccessPanelMessage(postedPanel));
  upsertPanel({
    ...panel,
    lastPostedAt: Date.now(),
  });

  await interaction.reply({
    content: `Role access panel **${panel.title}** posted in ${targetChannel}.`,
    ephemeral: true,
  });
}

function resolvePanelIdFromCustomId(customId: string) {
  if (customId === legacyWindroseButtonCustomId) {
    return "windrose";
  }

  if (!customId.startsWith(roleAccessPanelCustomIdPrefix)) {
    return null;
  }

  return customId.slice(roleAccessPanelCustomIdPrefix.length);
}

export async function handleRoleAccessPanelInteraction(interaction: ButtonInteraction) {
  const panelId = resolvePanelIdFromCustomId(interaction.customId);

  if (!panelId) {
    return false;
  }

  const panel = getPanelById(panelId);

  if (!panel) {
    await interaction.reply({
      content: "This access panel is no longer available.",
      ephemeral: true,
    });
    return true;
  }

  if (!panel.active) {
    await interaction.reply({
      content: "This access panel is currently inactive.",
      ephemeral: true,
    });
    return true;
  }

  if (!panel.roleId.trim()) {
    await interaction.reply({
      content: "This access panel is missing a configured role.",
      ephemeral: true,
    });
    return true;
  }

  if (!interaction.inCachedGuild()) {
    await interaction.reply({
      content: "Role access can only be requested inside the server.",
      ephemeral: true,
    });
    return true;
  }

  const member = interaction.member as GuildMember;

  if (member.roles.cache.has(panel.roleId)) {
    await interaction.reply({
      content: panel.alreadyHasRoleMessage ?? "You already have this role.",
      ephemeral: true,
    });
    return true;
  }

  try {
    await member.roles.add(panel.roleId);
    await interaction.reply({
      content: panel.successMessage ?? "Access granted. The role has been added.",
      ephemeral: true,
    });
  } catch (error) {
    console.error(`[role-panels] failed to assign role ${panel.roleId} to ${interaction.user.id} for panel ${panel.id}:`, error);
    await interaction.reply({
      content: "I couldn't grant access. Please ask an admin to check my role permissions.",
      ephemeral: true,
    });
  }

  return true;
}
