# Mission Control Strategy

## Role

Mission Control is the primary CDawg dashboard experience. It is the place where a community operator starts, understands the current state, and chooses the next safe action.

The rest of the dashboard remains important, but those pages should increasingly act as detailed tools that Mission Control routes users into.

## Core Sections

### CDawg Briefing

A short human-readable summary of community and system state.

It should include:

- System health.
- Automation summary.
- Opportunity count.
- Problem count.
- Next scheduled activity.

### Action Needed

Only warning-level and action-needed opportunities.

These cards should focus on broken, stale, missing, or risky configuration. Actions should be navigation-only until direct mutations are deliberately introduced.

### Things I Found For You

Content opportunities CDawg can identify from existing state.

Examples:

- Today in History preview.
- Daily Trivia status.
- Upcoming scheduled posts.
- Saved message templates.
- Underused content types from provider metrics.
- Optional community game status.

### Recommended Actions

Lower-severity suggestions that help the user improve the community without implying something is broken.

Examples:

- Add scheduled content to an inactive channel.
- Reuse a saved message.
- Try a lightly used content type.
- Review a role workflow.

### Recent Activity

A concise feed of automation, posting, role, trivia, and system events.

This should help users understand what CDawg has done recently and whether failures or blocked states are repeating.

## Data Doctrine

Mission Control should first use data already loaded through dashboard state and existing endpoints.

Current useful sources include:

- Health snapshot.
- Metrics snapshot.
- Automation activity.
- Channel automation status.
- Feed configs.
- Daily trivia state.
- Role access panels.
- Role follow-ups.
- Guild metadata.
- Composer templates.
- History review.
- XP and community stats.

New APIs should be added only after the frontend-derived model proves what data shape is needed.

## Recommendation Doctrine

Mission Control recommendations should be deterministic before AI-assisted.

Good deterministic opportunities include:

- Missing role referenced by a panel.
- Follow-up channel missing.
- Automation disabled or paused.
- Skip-next pending.
- No enabled scheduled posts.
- Daily trivia not configured.
- Provider failures.
- Repeated automation failures.
- Saved content available.
- Upcoming content ready.

## UX Priority

Above the fold should show:

1. CDawg Briefing.
2. Action Needed.
3. Things I Found For You.

Bot Status and lower-level operational metrics can remain available below Mission Control, but they should not be the first thing the user has to interpret.

## Implementation Strategy

### Slice 1

CDawg Briefing and Action Needed using existing state.

### Slice 2

Things I Found For You using existing content and metric sources.

### Slice 3

Recommended Actions using non-critical opportunities.

### Slice 4

Recent Activity consolidation.

### Slice 5

Channel Profile derived model.

### Slice 6

Optional AI-assisted summaries after deterministic recommendations are stable.

## Guardrails

- No direct posting from Mission Control until reviewed workflows exist.
- No hidden mutations.
- No new backend dependency for the MVP.
- Keep recommendations explainable.
- Keep configuration pages intact.
