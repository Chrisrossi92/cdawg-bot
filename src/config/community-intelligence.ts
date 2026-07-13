export const communityChannelMappings = {
  // Fantasy server channels confirmed from production metadata.
  "1463685100473553127": { context: "fantasy", kind: "community" },
  "1463686052509388894": { context: "fantasy", kind: "community" },

  // Primal server channels confirmed from production metadata.
  "1524582404126408704": { context: "primal", kind: "community" },
  "1524582546875224094": { context: "primal", kind: "community" },

  // Explicit general-purpose owner/community channels.
  "1463685003564027946": { context: "general", kind: "community" },
  "1468627019742052474": { context: "general", kind: "community" },
  "1524555527894335508": { context: "general", kind: "community" },

  // Operational and bot-authored destinations are never attachment-review eligible.
  "1463685223048024127": { context: "general", kind: "announcement_only" },
  "1480388771001139302": { context: "general", kind: "bot_output" },
  "1489073335252947024": { context: "general", kind: "bot_output" },
  "1489073492514181301": { context: "general", kind: "alerts" },
  "1491294532950818836": { context: "general", kind: "bot_output" },
  "1500710256207200356": { context: "general", kind: "bot_output" },
  "1524951888196534342": { context: "general", kind: "bot_output" },

  // Existing configured content destinations are explicitly general-purpose.
  "1480394568917585990": { context: "general", kind: "automation" },
  "1480394876502937661": { context: "general", kind: "automation" },
  "1480395108317921402": { context: "general", kind: "automation" },
  "1480395367546748938": { context: "general", kind: "automation" },
  "1480402034464260186": { context: "general", kind: "automation" },
  "1482034986537455626": { context: "general", kind: "automation" },
  "1463685992782237890": { context: "general", kind: "automation" },
  "1482887724871712788": { context: "general", kind: "community" },
} as const;

export const stableCommunityChannelNameMappings = {
  "fantasy-server-info": { context: "fantasy", kind: "community" },
  "fantasy-world-chat": { context: "fantasy", kind: "community" },
  "primal-server-info": { context: "primal", kind: "community" },
  "primal-chat": { context: "primal", kind: "community" },
  "conference-room": { context: "general", kind: "community" },
} as const;

export const communityRoleChannelRelationships = {
  "1463690145516490825": "fantasy",
  "1482886824564101140": "general",
  "1524579696950640752": "primal",
} as const;
