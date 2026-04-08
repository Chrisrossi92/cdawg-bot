export const passiveReactions = [
  {
    key: "weather",
    intent: "weather-danger",
    triggers: ["the forest is moving", "you are being hunted", "cold", "wet", "freezing"],
    responses: [
      "Classic Valheim forecast: wet, cold, and personally insulting.",
      "If Valheim says you are being hunted, it means your plans are canceled.",
      "The weather in Valheim always feels a little vindictive.",
    ],
  },
  {
    key: "corpse-run",
    intent: "corpse-run",
    triggers: ["corpse run", "got my stuff back", "died again", "death run", "tombstone"],
    responses: [
      "Every Valheim corpse run begins with confidence and ends with a second grave marker.",
      "A smooth corpse run is how you know you accidentally pleased the gods.",
      "Valheim really respects your time by making you earn your backpack twice.",
    ],
  },
  {
    key: "building",
    intent: "building",
    triggers: ["building", "roof keeps collapsing", "need iron", "need wood", "base build"],
    responses: [
      "Valheim building is 30% creativity and 70% arguing with structural integrity.",
      "Every great hall is built on vibes, beams, and one missing resource stack.",
      "The roof collapsing is just Odin requesting revisions.",
    ],
  },
] as const;
