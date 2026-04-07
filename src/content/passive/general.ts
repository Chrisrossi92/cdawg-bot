export const passiveReactions = [
  {
    key: "dead-chat",
    keywords: ["dead chat", "chat dead", "quiet in here", "so quiet", "slow chat"],
    responses: [
      "Dead chat allegations have been logged.",
      "Chat is just gathering energy for a worse bit.",
      "Quiet phase. Somebody roll initiative.",
    ],
  },
  {
    key: "boring",
    keywords: ["boring", "bored", "im bored", "i'm bored"],
    responses: [
      "Boredom detected. Start an argument about the best snack and watch chaos happen.",
      "If chat is boring, blame the current lack of unhinged lore.",
      "Bored? That sounds like a volunteer opening for posting something cursed.",
    ],
  },
  {
    key: "new-here",
    keywords: ["new here", "im new", "i'm new", "first time here", "just joined"],
    responses: [
      "Fresh arrival detected. Welcome to the mess.",
      "New here? Perfect timing. Pretend you understand the lore and nobody will question it.",
      "Welcome in. Lurking is valid, chaos is optional.",
    ],
  },
] as const;
