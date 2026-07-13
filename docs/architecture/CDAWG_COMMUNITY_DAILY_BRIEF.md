# Cdawg Community Daily Brief

Date: 2026-07-13

## Purpose

The Community Daily Brief is the first owner-visible product built on the Community Evidence and Community Recommendation layers.

It answers:

> What should Chris know about the community today, and what, if anything, should he do next?

The brief is informational and review-first. It does not post to Discord, enable conversation participation, change passive chat, call AI, or replace the legacy daily briefing.

## Relationship To Evidence And Recommendations

The implementation lives in `src/systems/community-daily-brief.ts`.

The module consumes:

- `CommunityEvidenceRecord`
- `CommunityRecommendationRecord`

It does not directly query:

- engagement activity
- automation activity
- content outcomes
- channel profiles
- conversation participation stores

Those systems are reached through the evidence and recommendation layers only.

## Orchestration Flow

`generateCommunityDailyBrief` supports explicit generation.

Default flow:

1. Generate or load Community Evidence.
2. Generate Community Recommendations from evidence.
3. Expire stale recommendations.
4. Load active recommendations.
5. Filter invalid, stale, dismissed, acted, expired, superseded, acknowledged, and actively postponed records.
6. Validate every recommendation's evidence references.
7. Rank and classify recommendations.
8. Select bounded section items.
9. Select zero or one recommended next step.
10. Return and optionally persist the brief.

Generation is deterministic for a fixed clock and fixed inputs.

## Brief Schema

Core fields:

- `id`
- `schemaVersion`
- `generatedAt`
- `periodStart`
- `periodEnd`
- `status`
- `headline`
- `summary`
- `sections`
- `counts`

Each item stores:

- section
- recommendation ID when applicable
- evidence IDs
- title
- summary
- reason
- priority
- confidence
- suggested action
- server context
- channel ID
- timestamps

## Sections

### Community Pulse

Factual overview of notable recent activity.

Sources:

- `channel_activity_window`
- `post_window_outcome`

Limits:

- maximum 3 items
- one newest/most-complete item per server context, channel, normalized window, and activity classification
- normal output should usually contain 0-2 items; 3 is reserved for distinct useful signals

Claims avoided:

- health
- happiness
- momentum
- conversation quality
- causation

### Needs Attention

Owner-relevant issues requiring timely review.

Primary source:

- `investigate_automation_issue`

Limits:

- maximum 3 items
- critical and high priority first

Routine skips and low-confidence speculation are excluded.

### Worth Reviewing

Potentially useful but non-urgent items.

Sources:

- medium automation availability issues
- `review_post_window_outcome`
- `review_channel_activity`
- `review_channel_context`

Limits:

- maximum 3 items

### Conversation Watch

Preview-only conversation participation observations.

Source:

- `review_conversation_opportunity`

Limits:

- maximum 2 items
- no reply text
- no posting controls

### Recommended Next Step

The single most useful owner action, or no item if nothing is worth doing.

Selection prefers:

1. critical unresolved recommendation
2. high-priority automation issue
3. actionable medium automation availability review
4. timely conversation review
5. post-window review
6. no action

Limits:

- exactly zero or one item

## Ranking

Recommendation ranking is deterministic:

1. priority
2. trusted server context, with Fantasy and Primal ahead of generic signals
3. lifecycle status, with `new` above equivalent `seen`
4. confidence
5. update time
6. stable ID

Large numbers of low-priority items should not crowd out important issues.

## Lifecycle Filtering

The brief excludes:

- dismissed recommendations
- acted recommendations
- expired recommendations
- superseded recommendations
- acknowledged recommendations
- postponed recommendations whose `postponedUntil` is in the future

The brief does not mark recommendations as seen. A future explicit owner action should control that.

## Calm-State Behavior

Calm output is valid.

Examples:

- no evidence yet
- evidence exists but nothing is notable
- activity exists but no owner action is useful

The brief should not fabricate work to fill sections.

## Server Context

The brief preserves server context from evidence and recommendations:

- Fantasy
- Primal
- General
- Unknown

It does not infer context from weak keyword matching.

Phase 1E resolves context in this order:

1. explicit `community-context:<value>` channel-profile metadata
2. configured production channel IDs
3. configured role relationships
4. documented exact stable channel names
5. explicitly general channels
6. `unknown`

Unmapped channels are no longer silently treated as General. The production mappings live in `src/config/community-intelligence.ts`; operational, alert, bot-output, automation, and announcement-only channels are explicitly classified so they cannot inherit Fantasy or Primal from loose text.

## Phase 1E Selection And Consolidation

Rolling activity evidence is consolidated before pulse selection by server context, channel, normalized window, and activity classification. Newer or more complete evidence wins. Recommendation-backed items are still checked for active evidence and lifecycle eligibility.

The brief does not force section population. A calm or sparse brief with no recommended next step is valid. Recommended Next Step excludes low-priority generic activity, expected skips, and intentional blocks.

## Provenance

Every brief item preserves evidence IDs, and recommendation-backed items preserve recommendation IDs.

Raw JSON and IDs are not intended for primary owner UI, but they are available for debugging and future "why" views.

## API Integration

Phase 1C adds isolated API endpoints:

```text
GET /api/community-intelligence/brief
POST /api/community-intelligence/generate-brief
```

`GET` returns the latest generated brief or a clear empty state. It does not regenerate evidence, recommendations, or briefs.

`POST` explicitly generates evidence, recommendations, expires stale recommendations, generates the brief, persists the generated records, and returns the brief.

## Persistence Decision

Briefs are persisted in a bounded history:

```text
data/community-daily-briefs.json
```

Reasons:

- allows comparison with the legacy briefing
- supports regression checks over fixed windows
- avoids regenerating just to read
- prepares for future owner view/open tracking

The store is capped to 30 briefs. Brief IDs are deterministic from the time window and input evidence/recommendation fingerprints. Tests use temporary paths and must not create production data.

## Dashboard Preview Behavior

No major dashboard preview UI was added in Phase 1C.

The API is ready for a contained preview panel near existing owner guidance in a later UI slice:

- Community Intelligence Brief - Preview
- status
- headline
- summary
- compact sections
- one recommended next step

## Legacy Daily Briefing Relationship

The existing `src/systems/daily-briefing.ts` remains intact.

Difference:

- Legacy briefing derives directly from operational systems.
- Community Daily Brief consumes durable evidence and recommendations.
- Community Daily Brief respects recommendation lifecycle.
- Community Daily Brief preserves evidence and recommendation IDs for provenance.
- Community Daily Brief can avoid dismissed, acted, expired, superseded, and postponed items.

Replacement should not be considered until:

1. stable generation over real production data
2. useful output on active and calm days
3. no recommendation flooding
4. correct lifecycle filtering
5. clear Fantasy/Primal context where evidence supports it
6. owner preference for the new version
7. no regression in operational issue visibility

## Current Limitations

The brief cannot yet understand:

- conversation quality
- member helpfulness
- owner preference
- true topic momentum
- post causation
- screenshot meaning
- GameOps activity
- Shareable Moments
- news relevance

It can only summarize and prioritize evidence-backed recommendations.

## Recommended Next Phase

After Phase 1E production validation, the next phase should be chosen from message-linked post outcomes, further refinement, or continued validation based on real brief quality. No next-phase capability is implemented here.
