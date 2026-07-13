# Cdawg Community Intelligence Owner Review Loop

Phase 1D completes the first owner-facing Community Intelligence loop:

1. Observation signals are normalized into shared community evidence.
2. Evidence-backed recommendations are generated and persisted with lifecycle state.
3. The Daily Community Brief selects active recommendations for owner review.
4. The dashboard exposes explicit owner dispositions for those recommendations.

## Dashboard Behavior

The Home tab now includes a compact Community Intelligence Brief preview. It loads the latest saved brief without creating new records. The owner must choose **Generate Brief** or **Refresh Intelligence** to generate and persist a new brief.

Opening a recommendation expands the evidence explanation and marks the recommendation `seen`. This is the only implicit lifecycle mutation, and it requires an explicit owner open/expand action. Simply loading the dashboard does not mark recommendations seen.

Each recommendation supports these owner dispositions:

- `acknowledge`: confirm the recommendation was reviewed.
- `dismiss`: remove it from active owner review.
- `postpone`: hide it until the selected future time. The dashboard control currently postpones for 24 hours.
- `acted`: record that the owner took action outside the bot.

The evidence detail view shows the recommendation reason, routing context, confidence, suggested action, and source evidence IDs from the shared evidence backbone.

## API Boundary

Owner dispositions are handled by:

`POST /api/community-intelligence/recommendations/:id/disposition`

Request body:

```json
{
  "action": "acknowledge",
  "reason": "Owner disposition from dashboard Community Intelligence Brief."
}
```

Allowed actions are `seen`, `acknowledge`, `dismiss`, `postpone`, and `acted`. `postpone` also requires a future `postponedUntil` timestamp.

The route follows the dashboard API's existing mutation-auth rule: non-GET requests require the configured `BOT_DASHBOARD_API_TOKEN` when that token is set.

## Safety Boundary

Phase 1D does not trigger Discord posting, passive conversation behavior, scheduled content, or automation changes. Dispositions only mutate Community Intelligence recommendation records.

The legacy deterministic Daily Briefing remains unchanged. The Community Intelligence Brief is a separate owner-review surface backed by the Phase 1A-1C evidence, recommendation, and brief records.
