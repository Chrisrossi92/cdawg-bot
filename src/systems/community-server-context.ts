import {
  communityChannelMappings,
  communityRoleChannelRelationships,
  stableCommunityChannelNameMappings,
} from "../config/community-intelligence.js";
import type { ChannelProfile } from "./channel-profiles.js";
import type { CommunityEvidenceServerContext } from "./community-evidence.js";

export type CommunityServerContextSource =
  | "channel_profile"
  | "configured_channel"
  | "configured_role_relationship"
  | "stable_channel_name"
  | "default_general"
  | "unresolved";

export type CommunityChannelKind =
  | "community"
  | "bot_output"
  | "logs"
  | "alerts"
  | "automation"
  | "feeds"
  | "internal_admin"
  | "system_status"
  | "announcement_only"
  | "unknown";

type Mapping = {
  context: CommunityEvidenceServerContext;
  kind?: CommunityChannelKind;
};

export type CommunityContextMappings = {
  channels?: Record<string, Mapping>;
  roleRelationships?: Record<string, CommunityEvidenceServerContext>;
  stableChannelNames?: Record<string, Mapping>;
  explicitlyGeneralChannelIds?: readonly string[];
};

export type ResolveCommunityServerContextInput = {
  guildId?: string | null | undefined;
  channelId?: string | null | undefined;
  channelName?: string | null | undefined;
  profile?: Pick<ChannelProfile, "notes" | "suggestedRoleId" | "accessMode"> | null;
  configuredMappings?: CommunityContextMappings;
};

const defaultMappings: Required<CommunityContextMappings> = {
  channels: communityChannelMappings,
  roleRelationships: communityRoleChannelRelationships,
  stableChannelNames: stableCommunityChannelNameMappings,
  explicitlyGeneralChannelIds: [],
};

function normalizeChannelName(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/^#/, "") ?? "";
}

function getExplicitProfileContext(notes: string | null | undefined): CommunityEvidenceServerContext | null {
  const match = notes?.match(/(?:^|\s)community-context\s*:\s*(fantasy|primal|general|unknown)(?:\s|$)/i);
  return match?.[1]?.toLowerCase() as CommunityEvidenceServerContext | null ?? null;
}

export function resolveCommunityServerContext(input: ResolveCommunityServerContextInput) {
  const mappings = {
    channels: input.configuredMappings?.channels ?? defaultMappings.channels,
    roleRelationships: input.configuredMappings?.roleRelationships ?? defaultMappings.roleRelationships,
    stableChannelNames: input.configuredMappings?.stableChannelNames ?? defaultMappings.stableChannelNames,
    explicitlyGeneralChannelIds: input.configuredMappings?.explicitlyGeneralChannelIds ?? defaultMappings.explicitlyGeneralChannelIds,
  };
  const profileContext = getExplicitProfileContext(input.profile?.notes);

  if (profileContext) {
    return { context: profileContext, source: "channel_profile" as const, confidence: 0.99 };
  }

  if (input.channelId && mappings.channels[input.channelId]) {
    return { context: mappings.channels[input.channelId]!.context, source: "configured_channel" as const, confidence: 0.99 };
  }

  if (input.profile?.suggestedRoleId && mappings.roleRelationships[input.profile.suggestedRoleId]) {
    return {
      context: mappings.roleRelationships[input.profile.suggestedRoleId]!,
      source: "configured_role_relationship" as const,
      confidence: 0.96,
    };
  }

  const stableName = mappings.stableChannelNames[normalizeChannelName(input.channelName)];
  if (stableName) {
    return { context: stableName.context, source: "stable_channel_name" as const, confidence: 0.92 };
  }

  if (input.channelId && mappings.explicitlyGeneralChannelIds.includes(input.channelId)) {
    return { context: "general" as const, source: "default_general" as const, confidence: 0.9 };
  }

  return { context: "unknown" as const, source: "unresolved" as const, confidence: 0.35 };
}

export function resolveCommunityChannelKind(input: ResolveCommunityServerContextInput): CommunityChannelKind {
  const channels = input.configuredMappings?.channels ?? defaultMappings.channels;
  const stableNames = input.configuredMappings?.stableChannelNames ?? defaultMappings.stableChannelNames;
  const configured = input.channelId ? channels[input.channelId] : null;

  if (configured?.kind) {
    return configured.kind;
  }

  const stable = stableNames[normalizeChannelName(input.channelName)];
  if (stable?.kind) {
    return stable.kind;
  }

  if (input.profile?.accessMode === "announcement") {
    return "announcement_only";
  }

  return input.profile ? "community" : "unknown";
}

export function isCommunityReviewEligible(kind: CommunityChannelKind) {
  return kind === "community";
}
