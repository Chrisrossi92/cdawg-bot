# Cdawg Community Intelligence Phase 1D Validation

Date: 2026-07-13

## Scope

Phase 1D adds the owner disposition loop for Community Intelligence recommendations:

- Home dashboard Community Intelligence Brief preview.
- Explicit brief generation control.
- Expand-to-review evidence explanation.
- Recommendation disposition API for `seen`, `acknowledge`, `dismiss`, `postpone`, and `acted`.
- No Discord posting or automation behavior changes.

## Local Validation

Completed checks:

- PASS: TypeScript compile, `./node_modules/.bin/tsc --noEmit`
- PASS: Dashboard JavaScript syntax, `node --check dashboard/public/app.js`
- PASS: Community Intelligence evidence check, `./node_modules/.bin/tsx tests/community-evidence.check.ts`
- PASS: Community Intelligence recommendation check, `./node_modules/.bin/tsx tests/community-recommendations.check.ts`
- PASS: Community Intelligence daily brief check, `./node_modules/.bin/tsx tests/community-daily-brief.check.ts`
- PASS: Conversation participation regression check, `./node_modules/.bin/tsx tests/conversation-participation.check.ts`
- PASS: Daily history regression check, `./node_modules/.bin/tsx tests/daily-history.check.ts`

Note: TSX checks required local execution permission for the runner's IPC pipe. The first sandboxed daily brief run failed with `listen EPERM`; rerunning with the needed local permission passed.

Data-file check:

- PASS: `data/community-evidence.json` was not created by validation.
- PASS: `data/community-recommendations.json` was not created by validation.
- PASS: `data/community-daily-briefs.json` was not created by validation.

## Owner Review Loop

Validated behaviors:

- Dashboard GET loads the latest saved Community Intelligence Brief without generating a new one.
- Dashboard POST generation is explicit through the owner control.
- Opening a recommendation marks it `seen`.
- Disposition controls call the protected recommendation lifecycle route.
- Disposition controls update recommendation state only; no Discord action is invoked.

## Production Deployment

Status: completed.

Local commits:

- `804a91f6a24d744018344cf9afd4dd0d51201eb8` - Community Intelligence owner review loop.
- `b2e0b7566551d84ab6f2b3b5d6ccd7e166501fbe` - merge preserving the production-only welcome commit.
- `4c18a817bff603778d7501889eb6d6e94476c431` - minimal production-blocking fix to load `.env` before API config reads `BOT_DASHBOARD_API_TOKEN`.

Deployed artifact:

- Clean release checkout at `/root/cdawg-bot-release-b2e0b75`, checked out at `4c18a817bff603778d7501889eb6d6e94476c431`.
- Runtime `data/`, `.env`, and `node_modules` are linked to the existing production resources under `/root/cdawg-bot`.
- Existing dirty production checkout at `/root/cdawg-bot` was not reset or overwritten.

Deployment method:

- Preserved VPS-only commit `bb465ea` by fetching it locally and merging before deployment.
- Did not run `git pull` against the dirty VPS checkout.
- Restarted only PM2 processes `cdawg-bot` and `cdawg-dashboard`.
- Left Palworld/GameOps services untouched.

Production safety fix:

- `BOT_DASHBOARD_API_TOKEN` was missing in production and unauthenticated POSTs initially reached mutation routes.
- Backed up `.env` to `.env.backup.20260713T022600Z.phase1d1`.
- Added a generated `BOT_DASHBOARD_API_TOKEN` to `.env`.
- Fixed startup order so `dotenv/config` loads before `apiConfig`.
- Revalidated unauthenticated public generation and disposition POSTs: both now return `401`.

Service health:

- PM2 `cdawg-bot`: online, cwd `/root/cdawg-bot-release-b2e0b75`.
- PM2 `cdawg-dashboard`: online, cwd `/root/cdawg-bot-release-b2e0b75`.
- Public dashboard: `https://dashboard.cdawgbot.xyz/` returns `200`.
- Public API health: `https://dashboard.cdawgbot.xyz/health` returns `200` with bot ready.
- Public Community Intelligence brief read endpoint returns `200`.
- Legacy Daily Briefing endpoint returns `200`.
- Discord bot health reports ready as `Cdawg Bot#7292`.

## Production Data Validation

Status: completed against real production data.

Generation result:

- Generated at: `2026-07-13T04:36:58.180Z`.
- Brief after lifecycle test generated at: `2026-07-13T04:44:57.034Z`.
- Evidence considered: `193`.
- Recommendations considered: `22`.
- Active recommendations: `21`.
- Recommendation store total after lifecycle test: `23`.
- Attention items: `3`.
- Brief status: `urgent`.
- Headline: `3 issues need immediate attention`.
- Populated sections: `communityPulse:3`, `needsAttention:3`, `worthReviewing:3`, `recommendedNextStep:1`.
- Recommended Next Step: critical `Investigate automation issue` for the history automation channel, latest reason `CONTENT_UNAVAILABLE`.

Lifecycle action exercised:

- Selected safe low-priority item: `Review attachment-heavy channel activity`.
- Original status: `new`.
- Deliberate open/inspection status: `seen`.
- Safe disposition: `postpone`.
- Resulting status: `postponed`.
- Postponed until: `2026-07-14T04:44:56.979Z`.
- Regeneration result: postponed recommendation was not present in the regenerated brief.
- Restart persistence: after restarting only `cdawg-bot`, recommendation remained `postponed`, `firstSeenAt` persisted, `postponedUntil` persisted, and latest brief history persisted.

Usefulness rubric:

- Clarity: passed. The brief can be scanned quickly and the recommended next step is clear.
- Selectivity: partially passed. It surfaces real automation problems, but activity-window evidence created repeated pulse items and low-value attachment-heavy recommendations.
- Explainability: partially passed. Evidence reasons are understandable, but the dashboard evidence presentation still leads with raw evidence IDs after the plain-language reason.
- Actionability: passed for the critical history automation failure; partially passed for attachment-heavy channel activity.
- Fantasy/Primal context: failed. All populated production items were labeled `general`, including Fantasy-related channels.
- Lifecycle memory: passed. `seen`, `postponed`, regeneration exclusion, and restart persistence worked.
- Calm-state quality: not exercised. Production data had urgent/high attention items.
- Legacy comparison: new brief is more useful for lifecycle-backed owner review, but legacy Daily Briefing currently provides broader operational coverage and clearer channel-health summary.

Observed limitations:

- Server context mapping is weak or missing: populated contexts were `general:10`, with no `fantasy` or `primal` labels.
- Community pulse included duplicate/equivalent activity items across repeated generations.
- Attachment-heavy activity recommendations are noisy for bot/alert channels.
- Critical automation recommendations are meaningful, but disabled/allowed-window blocks may need better classification so intentional safe blocks do not appear urgent.
- Public browser console was not exercised with a headed browser; HTTP/API validation was completed through Caddy/public endpoints.

Recommended next phase:

- Option A - Phase 1E: Brief Quality Refinement.
- Reason: lifecycle behavior is sound, but production validation found context labeling gaps, repeated pulse items, noisy attachment-heavy recommendations, and likely over-urgent classification of some intentional automation blocks.
