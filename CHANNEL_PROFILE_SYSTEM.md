# Channel Profile System

## Purpose

The Channel Profile system is the architecture for making CDawg channel-aware. Each Discord channel should eventually have a structured profile describing what the channel is for, how active it is, what content fits there, what automation is configured, and what risks or opportunities CDawg sees.

This is the foundation for better recommendations, safer scheduled posting, and more useful community intelligence.

## Channel Profile Concept

A Channel Profile is a normalized view of a channel that combines metadata, configuration, activity, and recommendations.

It should answer:

- What is this channel for?
- What content belongs here?
- Is automation enabled, paused, blocked, or missing?
- How active is the channel?
- Are there role workflows tied to this channel?
- What should CDawg suggest next?

## Initial Data Inputs

The system can start from existing data:

- Guild metadata and channel lists.
- Channel automation status.
- Feed configurations.
- Daily trivia configuration.
- Role access panels.
- Role follow-ups.
- Automation activity.
- Metrics snapshots.
- XP and community activity data.
- Composer templates where channel targeting exists.

No new backend system is required to begin modeling Channel Profiles in the dashboard.

## Proposed Profile Fields

### Identity

- Channel ID.
- Channel name.
- Channel type.
- Parent or category, if available.
- Visibility or permission hints, where safely available.

### Purpose

- Manual purpose label.
- Inferred content category.
- Allowed or preferred content types.
- Tone guidance.

### Automation

- Automation mode.
- Enabled or disabled state.
- Paused or skip-next state.
- Next eligible send time.
- Feed cadence.
- Daily trivia participation, if configured.

### Engagement

- Recent message volume.
- Recent active users.
- XP activity.
- Trivia participation.
- Scheduled post activity.

### Role Workflows

- Role signup panels targeting the channel.
- Follow-up messages targeting the channel.
- Missing or stale role/channel references.

### Opportunity State

- Missing setup.
- Inactive channel.
- Overlapping feeds.
- Disabled automation.
- Content gap.
- Repeated failures.

## Mission Control Integration

Mission Control should use Channel Profiles to produce higher-quality recommendations:

- "This channel has no scheduled content."
- "This channel has automation enabled but no upcoming post."
- "This role panel references a missing role."
- "This channel is active but has no content support configured."
- "This channel is inactive and may need a prompt or trivia event."

The user should be able to navigate from a recommendation to the relevant channel-focused settings or workflow.

## Implementation Shape

### Phase 1: Derived Profiles

Build frontend-only derived profiles from already loaded dashboard state. Use them to power Mission Control cards without changing APIs.

### Phase 2: Shared Profile Model

Introduce a typed shared model once the data shape stabilizes and multiple views need the same profile logic.

### Phase 3: Persisted Profile Metadata

Add saved channel purpose, tone, and preferred content types when there is a clear UX for editing and using them.

### Phase 4: AI-Assisted Profiles

Use AI to summarize channel purpose or suggest profile changes only after deterministic profile data exists.

## Guardrails

- Do not infer sensitive channel meaning from private content without explicit product decisions.
- Do not auto-post based only on inferred profiles.
- Keep profile fields explainable.
- Prefer deterministic checks for configuration drift.
- Let users override inferred purpose and content preferences.
