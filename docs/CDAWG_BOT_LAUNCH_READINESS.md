# Cdawg Bot Launch Readiness

Short checklist for running Cdawg Bot and the dashboard safely during live Discord activity.

## Discord Requirements

Required application scopes:

- `bot`
- `applications.commands`

Required gateway intents:

- Guilds
- Guild Members
- Guild Messages
- Message Content

Recommended bot permissions:

- View Channels
- Send Messages
- Embed Links
- Read Message History
- Manage Roles, if role signup buttons or rank role sync are enabled

Keep the bot role above any role it needs to grant or remove.

## API Exposure

The bot API defaults to `127.0.0.1`. Keep that default unless the VPS has a firewall or authenticated reverse proxy in front of the API.

If `BOT_API_HOST` is set to `0.0.0.0`, `::`, or another non-local interface, the API may be reachable off-machine. Set `BOT_DASHBOARD_API_TOKEN` when exposing the API outside localhost. Mutating dashboard API calls require that token when it is configured.

The dashboard can send the token from Advanced / Debug -> API Token.

## Launch Checklist

- Confirm PM2 runs exactly one `cdawg-bot` process and one `cdawg-dashboard` process.
- Confirm `BOT_API_ENABLED=true` only where the dashboard needs it.
- Confirm `BOT_API_HOST=127.0.0.1` unless protected by firewall/proxy and `BOT_DASHBOARD_API_TOKEN`.
- Confirm `.env` contains the expected Discord token, client ID, guild ID, and any game role IDs.
- Confirm Discord Developer Portal has Guild Members and Message Content intents enabled.
- Run `npm exec tsc -- --noEmit` before deploy.
- Register commands only when command definitions changed.
- Back up `data/*.json` before launch week and before manual VPS edits.

## Pause Automation Reminder

Use the dashboard automation master switch before making risky live changes. When Automatic Posting is OFF, scheduled content, managed feeds, daily trivia, and passive chat posting are blocked until re-enabled.

For one channel only, use Channel Posting Controls to silence, cooldown, skip next, disable, or resume that channel.

## Palworld Launch Notes

- Verify the Palworld channel ID in `src/config/channel-topics.ts`.
- Verify Palworld role signup and follow-up messages before inviting players.
- Keep Palworld automation conservative during the first live week.
- Prefer reviewed manual posts from Content Studio for server info, event reminders, and launch announcements.
- Watch Engagement and Recent Posted Content Outcomes for whether bot posts are helping or adding noise.
