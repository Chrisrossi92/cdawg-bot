# Guided Experience Doctrine

## Philosophy

CDawg should guide the user instead of forcing them to hunt through settings. The product should feel like an operator that watches the community, understands configuration state, and presents the next useful step in plain language.

Guidance does not mean hiding complexity. It means sequencing complexity so the user sees the right detail at the right time.

Golden Rule:

> CDawg should reduce decisions, not create them.

The user should not need to start by choosing a feature. The user should be able to start with an outcome:

- I want a genealogy community.
- I want more activity.
- I want sports highlights.
- I want people to opt in.

CDawg translates intent into implementation details such as role panels, follow-ups, feed configuration, channel profiles, and automation settings.

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

### Progressive Disclosure

Only show what is needed for the next decision.

Default surfaces should show:

- Recommendations.
- Opportunities.
- Guidance.

Default surfaces should hide:

- Advanced forms.
- Technical settings.
- Debug data.

Hidden details should remain available through expandable panels, modals, assistant flows, or explicit advanced controls.

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

## Guidance Flow

Every meaningful action should follow this path:

Guidance -> Preview -> Approval -> Execution -> Feedback

Guidance explains the reason and recommended path.

Preview shows the proposed content, configuration, or operation before anything changes.

Approval requires the user to explicitly confirm the change.

Execution performs only the approved action.

Feedback reports what happened and what to do next.

There should be no hidden automation and no autonomous mutations without explicit approval.

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

The future workspace model should separate intent from internals:

- Mission Control for briefing, action needed, things found, recommendations, and activity.
- Community Builder for channel profiles, access models, signup systems, and follow-ups.
- Content Studio for discovery, generated content, saved messages, and future external sources.
- Settings for advanced controls, diagnostics, and automation tuning.

The experience should feel more like Jarvis, Mission Control, and a Community Operating System than a Discord Admin Panel or settings dashboard.
