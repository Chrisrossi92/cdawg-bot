import { getBotSettings } from "../systems/bot-settings.js";

export function getContentProviderSettings() {
  return getBotSettings().contentProviders;
}
