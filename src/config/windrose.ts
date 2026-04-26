export const windroseConfig = {
  roleId: process.env.WINDROSE_ROLE_ID ?? "",
  panelChannelId: process.env.WINDROSE_PANEL_CHANNEL_ID ?? "",
  panelTitle: "Windrose Access",
  panelMessage:
    "Join the Windrose community game by requesting access below. The bot will add the Windrose role so you can see the game channels.",
  buttonLabel: "Request Windrose Access",
} as const;
