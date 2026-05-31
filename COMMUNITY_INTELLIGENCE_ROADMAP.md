# Community Intelligence Roadmap

## Vision

Community Intelligence is CDawg's ability to understand the health, momentum, and needs of a Discord community using existing operational and engagement data.

The goal is not surveillance or vanity analytics. The goal is to help a community owner make better decisions: where to post, what to revive, what is working, and what needs attention.

## Intelligence Layers

### Layer 1: Operational Health

Answers whether CDawg and its automation systems are functioning.

Signals:

- Bot health.
- API health.
- Provider failures.
- Automation failures.
- Blocked channels.
- Missing configuration.

### Layer 2: Engagement Health

Answers whether the community is active.

Signals:

- Message volume.
- Active users.
- Active channels.
- XP activity.
- Trivia participation.
- Recent role interactions.

### Layer 3: Content Health

Answers whether useful content is available and being used.

Signals:

- Scheduled feeds.
- Upcoming post timing.
- Content provider usage.
- History availability.
- Daily trivia availability.
- Saved message templates.

### Layer 4: Channel Health

Answers which channels are healthy, inactive, under-configured, or over-automated.

Signals:

- Channel automation status.
- Channel-specific feeds.
- Channel activity.
- Channel role workflows.
- Channel failures or blocked states.

### Layer 5: Strategic Recommendations

Answers what the owner should do next.

Examples:

- Add scheduled content to an inactive channel.
- Pause or review noisy automation.
- Configure trivia in a channel that has active users.
- Fix stale role workflows.
- Try an underused content type.

## MVP Intelligence

The smallest useful version should use existing dashboard data:

- System health.
- Metrics snapshot.
- Automation activity.
- Feed configuration.
- Channel automation status.
- Daily trivia state.
- Composer templates.
- History review.
- Role workflow data.
- XP data where already available.

The MVP should surface summaries and recommendations without requiring new APIs.

## Roadmap

### Phase 1: Existing-State Intelligence

Build frontend-derived summaries from existing loaded dashboard state.

Outputs:

- Community Health summary.
- Action Needed cards.
- Content Opportunity cards.
- Recent Activity cards.

### Phase 2: Channel Profile Intelligence

Create derived Channel Profiles that combine metadata, automation, feeds, role workflows, and activity.

Outputs:

- Per-channel health labels.
- Channel-specific recommendations.
- Better scheduled-content suggestions.

### Phase 3: Trend Awareness

Add time-window comparisons once reliable historical metrics are available.

Outputs:

- Activity up or down.
- Channels gaining or losing momentum.
- Content types performing better or worse.

### Phase 4: Recommendation Scoring

Rank opportunities by impact, urgency, confidence, and user effort.

Outputs:

- Better above-the-fold prioritization.
- Less noisy recommendations.
- Clearer severity levels.

### Phase 5: AI-Assisted Intelligence

Use AI for summarization, natural-language briefings, and planning once deterministic data is reliable.

Outputs:

- Weekly community briefings.
- Natural-language explanations.
- Drafted action plans.
- Suggested content calendars.

## Data Gaps

Likely future gaps include:

- Reliable per-channel message trends.
- Active user counts by time window.
- Content engagement outcomes.
- Recommendation dismissal history.
- User-defined channel goals.
- Historical automation success rates by channel.

These should be filled only as the Mission Control and Channel Profile UX proves the need.

## Guardrails

- Keep analytics actionable.
- Avoid invasive or unexplained inference.
- Do not use AI where deterministic metrics are enough.
- Make confidence and data limitations visible.
- Do not create pressure to over-automate community interaction.
