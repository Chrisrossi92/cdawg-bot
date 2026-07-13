# Cdawg Community Evidence Model

Date: 2026-07-12

## Purpose

The Community Evidence layer converts existing trusted operational data into normalized, durable, explainable records.

It is the first backbone for the future chain:

```text
observation -> evidence -> recommendation -> owner decision -> action -> outcome
```

Phase 1A implements evidence only. Evidence records do not trigger Discord posts, automation, recommendations, AI calls, GameOps actions, or dashboard workflow changes.

## Evidence Principles

- Evidence must be factual and replayable.
- Evidence must preserve provenance.
- Evidence must identify the source system and source record IDs where available.
- Evidence summaries must be cautious and human-readable.
- Evidence facts must be structured.
- Evidence confidence must be explicit.
- Evidence can expire or be superseded.
- Evidence must not overstate what the source data proves.

Allowed:

> The channel recorded 20 human messages within 60 minutes after this post.

Not allowed:

> This post caused 20 messages.

Allowed:

> Seven approximate participants sent 38 human messages in the selected activity window.

Not allowed:

> This was a healthy, engaging conversation.

## Record Schema

The shared model lives in `src/systems/community-evidence.ts`.

Current evidence types:

- `channel_activity_window`
- `post_window_outcome`
- `automation_issue`
- `channel_context`
- `conversation_decision`

Core fields:

- `id`: deterministic evidence ID.
- `schemaVersion`: evidence schema version.
- `type`: normalized evidence type.
- `sourceSystem`: originating system.
- `sourceRecordIds`: source IDs or stable source fingerprints.
- `guildId`, `channelId`, `memberIdHash`: optional scoped identifiers.
- `subjectType`: community, channel, member, content, automation, or conversation.
- `subjectId`: stable subject identifier where available.
- `serverContext`: `fantasy`, `primal`, `general`, or `unknown`.
- `summary`: cautious human-readable statement.
- `facts`: structured factual values.
- `confidence`: number from 0 to 1.
- `provenance`: source, source IDs, adapter name, derivation time.
- `observedAt`: when the source observation occurred.
- `createdAt`: when evidence was generated.
- `expiresAt`: optional staleness point.
- `status`: `active`, `expired`, or `superseded`.

## Source Adapters

### Engagement Activity

Source: `src/systems/engagement-activity.ts`

Creates `channel_activity_window` evidence from engagement summaries.

Facts include:

- window key and duration
- window start/end
- total message count
- human message count
- bot message count
- approximate active users
- attachment/embed count
- last activity
- cautious activity classification

This adapter does not claim conversation quality, health, helpfulness, or momentum.

### Content Outcomes

Source: `src/systems/content-outcomes.ts`

Creates `post_window_outcome` evidence from tracked post-window activity.

Facts include:

- source
- content type
- posted timestamp
- message ID when available
- 15-minute and 60-minute message counts
- 60-minute approximate active users
- bot and human messages
- deterministic outcome label
- measurement type

This is post-window channel activity, not confirmed post engagement or causation.

### Automation Activity

Source: `src/systems/automation-activity.ts`

Creates `automation_issue` evidence for blocked or failed automation. Routine successes are not emitted as issue evidence.

Facts include:

- automation source
- status
- content type
- failure/block reason
- occurrence count
- first seen
- last seen
- latest message

Repeated similar failures are grouped into one evidence record.

### Channel Profiles

Source: `src/systems/channel-profiles.ts`

Creates `channel_context` evidence from explicit owner-authored channel profiles.

Facts include:

- purpose
- audience
- access mode
- tone
- preferred content types
- topic override
- related role/panel/follow-up IDs
- owner-authored marker
- server context

These records represent explicit owner memory, not learned conclusions.

### Conversation Participation

Source: `src/systems/conversation-participation.ts`

Creates `conversation_decision` evidence from persisted preview decisions.

Facts include:

- mode
- state
- decision
- reason
- human message count
- distinct human count
- relevance score
- matched topics
- bot-human ratio
- cooldown/cap/suppression flags
- proposed content type
- preview-only flag
- whether the system would have spoken

This adapter does not enable posting or generate reply text.

## Provenance

Every evidence record includes:

- source system
- source record IDs
- deterministic adapter name
- derivation timestamp

Where source systems do not expose native record IDs, the adapter uses stable source fingerprints such as channel/window/timestamp identifiers.

## Confidence

Confidence is bounded between `0` and `1`.

Current adapter confidence is intentionally conservative:

- channel context is high confidence because it is owner-authored
- automation issues are high confidence because they come from direct operation records
- engagement and outcome evidence are lower because they are aggregate measurements
- conversation decisions are preview evidence, not validated action evidence

Confidence does not mean importance. It means how directly the evidence follows from the available source data.

## Expiration

Evidence can expire through `expireCommunityEvidence`.

Adapters set `expiresAt` for time-sensitive evidence:

- engagement windows expire after the window duration
- content outcomes expire after 30 days
- automation issues expire after 7 days
- conversation decisions expire after 7 days

Channel context evidence does not currently expire automatically because it reflects owner-authored profile state.

## Deduplication

Evidence IDs are deterministic fingerprints of evidence type and stable source fields.

Repeated generation with the same source data updates or preserves the same record instead of appending duplicates.

The store is capped and sorted by `observedAt`, `createdAt`, and ID.

## Retention

Default retention is 1000 records. The generation API accepts a bounded retention override for tests and future maintenance tasks.

The current storage file is:

```text
data/community-evidence.json
```

Writes use the repository's existing atomic JSON convention: write a temporary file, then rename.

## Server Context

Supported contexts:

- `fantasy`
- `primal`
- `general`
- `unknown`

Phase 1A uses only deterministic context:

- explicit owner-authored profile text/metadata for Fantasy or Primal
- known channel/profile presence as general context
- unknown when no trusted mapping exists

It does not infer Fantasy or Primal from weak keyword guesses or message content.

## Current Limitations

The evidence layer cannot yet conclude:

- conversation health
- member helpfulness
- topic leadership
- community momentum
- whether a post caused engagement
- screenshot meaning
- owner preference
- GameOps player/session facts
- Shareable Moments
- news relevance beyond existing source/profile data

It also does not replace existing direct derivation paths in channel intelligence, opportunities, or daily briefing.

## Future Consumers

Phase 1B should add durable recommendation records that reference evidence IDs.

Future recommendation records should store:

- recommendation ID
- recommendation type
- evidence IDs
- confidence
- reason
- suggested action
- lifecycle status
- owner feedback
- resulting action ID if approved

## Future Integrations

GameOps telemetry can later create evidence such as:

- player session facts
- server activity windows
- player milestones
- reconciled presence facts

News intelligence can later create evidence such as:

- discovered source item
- source trust
- freshness
- duplicate status
- profile/topic match

Owner feedback can later create evidence such as:

- recommendation approved
- recommendation rejected
- draft edited
- item dismissed
- post published

All future integrations should feed the same evidence model instead of creating separate intelligence silos.
