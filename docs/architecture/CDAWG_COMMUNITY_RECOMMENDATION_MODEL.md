# Cdawg Community Recommendation Model

Date: 2026-07-12

## Purpose

The Community Recommendation layer creates durable, review-first recommendation records from Community Evidence.

It implements this portion of the intelligence chain:

```text
observation -> evidence -> recommendation -> owner disposition
```

Phase 1B does not execute actions. It does not post to Discord, enable conversation replies, change passive chat, infer owner preferences, or replace the existing opportunity engine and daily briefing.

## Relationship To Community Evidence

Recommendations are generated only from `CommunityEvidenceRecord` objects.

Every recommendation must reference at least one evidence ID. Recommendation adapters do not reach directly into raw operational stores such as engagement activity, content outcomes, automation activity, or conversation decisions.

Evidence answers:

> What factual signal was observed?

Recommendations answer:

> Why might the owner want to review this signal?

## Record Schema

The implementation lives in `src/systems/community-recommendations.ts`.

Core fields:

- `id`: deterministic recommendation ID.
- `schemaVersion`: recommendation schema version.
- `type`: recommendation type.
- `evidenceIds`: supporting Community Evidence IDs.
- `guildId`, `channelId`: optional scope.
- `subjectType`: community, channel, content, automation, or conversation.
- `subjectId`: stable subject identifier where available.
- `serverContext`: `fantasy`, `primal`, `general`, or `unknown`.
- `title`, `summary`, `reason`: human-readable explanation.
- `suggestedAction`: structured review-first action.
- `priority`: owner urgency.
- `confidence`: how justified the recommendation is by the supporting evidence.
- `status`: lifecycle state.
- lifecycle timestamps: seen, acknowledged, dismissed, postponed, acted, expired.
- `dispositionReason`: optional owner note.
- `provenance`: adapter name, derivation timestamp, evidence IDs.

## Recommendation Types

### `investigate_automation_issue`

Source evidence: `automation_issue`

Created for:

- failed automation
- repeated blocked automation
- persistent automation problems

One-time routine blocked events are suppressed to avoid noise.

### `review_post_window_outcome`

Source evidence: `post_window_outcome`

Created only when the deterministic post-window signal is notable:

- high 60-minute human message count
- no-response outcome

This recommendation must not claim the post caused the activity or silence.

### `review_conversation_opportunity`

Source evidence: `conversation_decision`

Created for selected preview-only conversation decisions:

- would-send preview decisions
- high-relevance suppressed decisions worth auditing

It does not generate reply text and does not enable posting.

### `review_channel_activity`

Source evidence: `channel_activity_window`

Created only for owner-relevant deterministic thresholds:

- notable 24-hour message/user activity
- attachment-heavy activity

It does not claim community health, quality, or momentum.

### `review_channel_context`

Source evidence: `channel_context`

Created only when owner-authored context appears incomplete or uncertain for downstream routing:

- custom purpose without topic override
- unsure access mode
- unknown server context

It does not warn about speculative mismatches.

## Suggested Actions

Supported action values:

- `review`
- `investigate`
- `acknowledge`
- `draft_follow_up`
- `no_action`

These are owner-facing suggestions only. They do not execute Discord actions.

## Lifecycle

Supported statuses:

- `new`: generated and not yet reviewed.
- `seen`: displayed or opened by an owner-facing system.
- `acknowledged`: owner is aware and no immediate action is needed.
- `dismissed`: owner says it is not useful or relevant.
- `postponed`: hidden until a future timestamp.
- `acted`: owner indicates they handled it.
- `expired`: no longer timely.
- `superseded`: replaced by newer evidence or a better recommendation.

API functions include:

- `generateCommunityRecommendations`
- `listCommunityRecommendations`
- `getCommunityRecommendationById`
- `findCommunityRecommendations`
- `markCommunityRecommendationSeen`
- `acknowledgeCommunityRecommendation`
- `dismissCommunityRecommendation`
- `postponeCommunityRecommendation`
- `markCommunityRecommendationActed`
- `expireCommunityRecommendations`
- `supersedeCommunityRecommendation`

Generation does not automatically mark records as seen.

## Confidence

Confidence means:

> How certain is the system that the supporting evidence and deterministic rule justify showing this recommendation?

It does not mean:

> How likely this recommendation is to create engagement.

Confidence is bounded from `0.0` to `1.0`.

## Priority

Priority reflects owner urgency:

- `critical`: repeated operational failure or immediate operational concern.
- `high`: meaningful issue needing timely review.
- `medium`: useful opportunity worth reviewing.
- `low`: optional or informational review.

Routine inactivity is not critical.

## Expiration

Recommendations use explicit expiration windows:

- automation issues: 7 days
- post-window outcomes: 14 days
- conversation opportunities: 1 day
- channel activity reviews: 2 days
- channel context reviews: 30 days

`expireCommunityRecommendations` marks active recommendations expired when their expiration time passes.

## Superseding

`supersedeCommunityRecommendation` records that a recommendation was replaced by newer evidence, corrected context, or a better recommendation.

Phase 1B provides the lifecycle operation. It does not yet automatically infer superseding relationships across recommendation families.

## Deduplication

Recommendation IDs are deterministic fingerprints of:

- recommendation type
- subject
- channel/context
- important evidence facts
- source evidence change indicators

Repeated generation from identical evidence does not duplicate records.

## Dismissal And Regeneration Rules

The same unchanged evidence must not immediately regenerate a recommendation after the owner:

- acknowledges it
- dismisses it
- marks it acted
- postpones it into the future

A new recommendation may be generated when:

- supporting evidence has a new ID
- material facts change, such as occurrence count or post-window message count
- priority changes because the underlying evidence changed
- the subject or context changes

Expired recommendations do not regenerate from the same unchanged evidence fingerprint. They can reappear only when new evidence produces a new deterministic ID.

## Storage

Default storage:

```text
data/community-recommendations.json
```

The store follows existing local JSON conventions:

- missing file loads as empty
- malformed records are ignored
- writes use temp-file then rename
- retention is capped
- ordering is deterministic

Tests use temporary storage paths and must not create production recommendation data.

## Review-First Boundary

Recommendations are intentionally inert. They can be listed, marked seen, acknowledged, dismissed, postponed, acted, expired, or superseded.

They do not:

- post to Discord
- generate reply text
- run automation
- alter passive chat
- trigger GameOps workflows
- call AI
- infer owner preferences

## Current Limitations

The recommendation layer cannot yet conclude:

- whether a post caused a response
- whether a conversation was high quality
- whether a member is helpful
- whether a topic is emerging or fading
- whether a channel is healthy
- whether owner preferences have changed
- whether GameOps telemetry created a shareable moment

It is a durable review and disposition layer, not a full intelligence engine.

## Phase 1C Consumption

The next slice should build an Evidence-backed Daily Community Brief that consumes durable recommendation records.

Phase 1C should:

- generate evidence explicitly
- generate recommendations explicitly
- select active recommendations
- group them by urgency and type
- cite evidence IDs/reasons
- avoid replacing the existing daily briefing until validated

## Future Owner Feedback Learning

Lifecycle history is owner behavior data.

Phase 1B stores disposition state, but it does not infer preferences. Later phases can use repeated acknowledgements, dismissals, postponements, edits, and acted states to adjust ranking or suppress low-value recommendation types, but those rules should remain visible and explainable.
