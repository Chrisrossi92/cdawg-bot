# Cdawg Bot Dashboard

Minimal local dashboard shell for operational checks.

## Run locally

1. Start the bot API:
   `BOT_API_ENABLED=true npm run dev`
2. In a second terminal, start the dashboard:
   `npm run dashboard`
3. Open:
   `http://127.0.0.1:4173`

## Notes

- The dashboard reads from the internal bot API.
- The default API base URL in the UI is `http://127.0.0.1:8787`.
- You can change the dashboard host/port with:
  `DASHBOARD_HOST` and `DASHBOARD_PORT`
- You can change the bot API host/port with:
  `BOT_API_HOST` and `BOT_API_PORT`
