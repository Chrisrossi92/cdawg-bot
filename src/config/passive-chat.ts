import { getBotSettings } from "../systems/bot-settings.js";

export function getPassiveChatSettings() {
  const passiveChatSettings = getBotSettings().passiveChat;

  return {
    ...passiveChatSettings,
    eligibleChannelIds: new Set(passiveChatSettings.eligibleChannelIds),
  };
}
