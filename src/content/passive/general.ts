export const passiveReactions = [
  {
    key: "dead-chat",
    intent: "dead-chat",
    triggers: ["dead chat", "chat dead", "quiet in here", "so quiet", "slow chat"],
    responses: [
      "Dead chat allegations have been logged.",
      "Chat is just gathering energy for a worse bit.",
      "Quiet phase. Somebody roll initiative.",
    ],
  },
  {
    key: "boring",
    intent: "boredom",
    triggers: ["boring", "bored", "im bored", "i'm bored"],
    responses: [
      "Boredom detected. Start an argument about the best snack and watch chaos happen.",
      "If chat is boring, blame the current lack of unhinged lore.",
      "Bored? That sounds like a volunteer opening for posting something cursed.",
    ],
  },
  {
    key: "new-here",
    intent: "newcomer",
    triggers: ["new here", "im new", "i'm new", "first time here", "just joined"],
    responses: [
      "Fresh arrival detected. Welcome to the mess. `/bot-help` is there if you want a quick rundown.",
      "New here? Perfect timing. Lurking is valid, chaos is optional, and `/bot-help` covers the bot basics.",
      "Welcome in. If you want to see what the bot can do, `/bot-help` is the clean starting point.",
    ],
  },
  {
    key: "command-help",
    intent: "help",
    triggers: ["help", "what commands", "what can the bot do", "bot commands", "how do i use"],
    responses: [
      "If you need the command list, `/bot-help` is the fastest route.",
      "Command confusion detected. `/bot-help` should get you oriented.",
      "Try `/bot-help` if you want the quick version of what the bot can do.",
    ],
  },
] as const;
