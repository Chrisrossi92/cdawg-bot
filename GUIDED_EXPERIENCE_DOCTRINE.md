# Guided Experience Doctrine

## Philosophy

CDawg should guide the user instead of forcing them to hunt through settings. The product should feel like an operator that watches the community, understands configuration state, and presents the next useful step in plain language.

Guidance does not mean hiding complexity. It means sequencing complexity so the user sees the right detail at the right time.

## Design Principles

### Start With the Briefing

The first screen should answer what is happening now. Mission Control should summarize health, automation, opportunities, and recent activity before showing lower-level controls.

### Explain Why

Every recommendation should include a short reason. Users should know whether CDawg is reacting to missing configuration, inactive channels, scheduled content, provider failures, role drift, or community activity.

### Prefer Safe Actions

Early guided actions should be navigation-only or prefill-only. CDawg can point the user to the correct section, open the relevant workflow, or prepare a draft where existing safe helpers support it.

Direct mutations should require stronger product maturity, clear confirmation, and auditability.

### Reduce Empty Confusion

Empty states should explain what CDawg does not know yet and what the user can do to make the system useful. A blank panel is not guidance.

### Keep Admin Usability First

The interface can have personality, but it must remain readable, predictable, and efficient. Community operators need to scan, compare, and act quickly.

## Recommendation Quality Bar

A guided recommendation should have:

- A clear name.
- A trigger condition.
- A severity.
- A plain-language reason.
- A safe next action.
- A visible data source or implied source.

Recommendations should avoid vague advice such as "boost engagement" unless CDawg can point to a concrete channel, feature, or configuration.

## Severity Doctrine

### Info

Useful context that does not require action.

### Suggestion

A low-risk improvement or content opportunity.

### Warning

A condition that may reduce automation quality, visibility, or community engagement.

### Action Needed

A broken, missing, conflicting, or stale configuration that likely needs user attention.

## Action Doctrine

### Navigation-Only

Use when CDawg identifies an issue or opportunity and routes the user to an existing section.

### Prefill-Only

Use when existing safe helpers can prepare a form or draft without posting, saving, or mutating data.

### Confirmed Mutation

Use only when the user has reviewed the proposed change and the product has clear confirmation and error handling.

### Autonomous Action

Long-term only. Requires strong trust, audit trails, undo or rollback where possible, and clear boundaries.

## Copy Doctrine

CDawg copy should be friendly, direct, and specific.

Good guidance:

- "Daily trivia is configured, but the channel is missing. Open Daily Trivia to choose a valid channel."
- "Three saved messages are ready to reuse in Post Now."
- "No enabled feeds have an upcoming run. Open Scheduled Posts to review cadence."

Weak guidance:

- "Improve engagement."
- "Something may be wrong."
- "Use AI to optimize your community."

## UX Doctrine

Mission Control should prioritize:

1. Current health.
2. Action needed.
3. Useful content found.
4. Recommended next actions.
5. Recent activity.

Configuration screens should remain available, but Mission Control should increasingly become the place where users discover why those screens matter.
