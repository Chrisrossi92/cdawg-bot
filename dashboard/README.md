# Cdawg Bot Dashboard

Minimal local operational panel for health, runtime settings, and metrics.

## Run locally

1. Start the bot API:
   `BOT_API_ENABLED=true npm run dev`
2. In a second terminal, start the dashboard:
   `npm run dashboard`
3. Open:
   `http://127.0.0.1:4173`

## Dashboard usage

- The top-right API form controls which internal API base URL the dashboard uses.
- `Refresh All` reloads health, settings, and metrics together.
- `Auto-refresh` polls the API every 15 seconds for lightweight live updates.
- The settings form only edits the safe subset already supported by the internal API.
- `Reset Form` restores the current saved runtime values from the API before you submit changes.

## Notes

- The dashboard reads from the internal bot API.
- The default API base URL in the UI is `http://127.0.0.1:8787`.
- You can change the dashboard host/port with:
  `DASHBOARD_HOST` and `DASHBOARD_PORT`
- You can change the bot API host/port with:
  `BOT_API_HOST` and `BOT_API_PORT`
