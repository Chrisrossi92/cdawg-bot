export const roleFollowupConfig = {
  welcomeChannelId: "1463685003564027946",
  supportLogChannelId: "1488962637852311643",
  roles: {
    palworld: {
      roleId: "1463690145516490825",
      channelId: "1463685003564027946",
      message:
        "You now have access to **Palworld**.\n\nServer info: <#1463685100473553127>\n\nCommunity chat: <#1463686052509388894>",
    },
    valheim: {
      roleId: "1482886824564101140",
      channelId: "1463685003564027946",
      message:
        "You now have access to **Valheim**.\n\nServer info: <#1482888318470328492>\n\nCommunity chat: <#1482887724871712788>",
    },
    supporter: {
      roleId: "1488957456989294733",
      channelId: "1488962637852311643",
      message: "Thanks for supporting the server.",
    },
    legendDonor: {
      roleId: "1488959352755847228",
      channelId: "1488962637852311643",
      message: "A Legend donor role was added. Thank you for the support.",
    },
  },
} as const;
