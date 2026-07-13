import { getBotSettings } from "../systems/bot-settings.js";

export function getConversationParticipationSettings() {
  const settings = getBotSettings().conversationParticipation;

  return {
    ...settings,
    eligibleChannelIds: new Set(settings.eligibleChannelIds),
  };
}
