# Cdawg Community Intelligence Phase 1E Validation

Date: 2026-07-13

## Scope

Phase 1E refines the existing evidence, recommendation, and daily brief layers. It adds no intelligence domain and performs no Discord action.

## Production Baseline

- Evidence considered: 193
- Recommendations considered: 22
- Active recommendations: 21
- Status: urgent
- Sections: Community Pulse 3; Needs Attention 3; Worth Reviewing 3; Conversation Watch 0; Recommended Next Step 1
- Context distribution across populated items: General 10; Fantasy 0; Primal 0; Unknown 0
- Equivalent pulse duplicates: 3 items for the same Fantasy channel
- Active recommendation store after lifecycle validation: 23, including repeated automation and attachment-window variants
- Recommended Next Step: critical history automation `CONTENT_UNAVAILABLE`

## Root-Cause Investigation

- Context was assigned in evidence generation by loose profile text and otherwise defaulted every channel ID to General. Engagement, automation, outcomes, and conversation evidence did not receive profile/config mappings.
- Rolling engagement generation included the derivation timestamp in evidence IDs and never superseded older equivalent windows.
- Attachment counts combined bot and human authors. Bot/alert channel eligibility was not represented, and three attachment/embed events alone could create a recommendation.
- Every repeated block became High; three `failure` events became Critical even when the technical reason was routine content exhaustion.
- Recommendation fingerprints included changing counts, while merge logic reconciled only identical IDs. Older active equivalents remained in the queue.
- Brief pulse deduplication keyed on evidence IDs, so equivalent rolling records survived.

Production aggregate inspection identified bot-only attachment volume in activity/alert/bot destinations and intentional `disabled` plus expected `allowed-window` automation blocks. No Discord message body was read or included in this report.

## Phase 1E Rules

- Trusted context order: explicit profile label, configured channel ID, configured role relationship, documented exact stable name, explicit General, otherwise Unknown.
- Production Fantasy mappings: configured Fantasy server-info and world-chat IDs. Production Primal mappings: configured Primal server-info and chat IDs.
- Pulse key: context + channel + normalized window + activity classification; newest/most-complete wins.
- Attachment review: eligible community channel + at least 5 human-authored attachment/embed events + at least 3 distinct human participants.
- Automation classes: failure, unexpected block, intentional block, expected skip, temporary unavailable, recovered, unknown.
- Critical requires repeated severe authentication, permission, crash, or fatal failure. Repeated `CONTENT_UNAVAILABLE` is Medium. Intentional blocks and expected skips are suppressed.
- Newer equivalent recommendations supersede older active `new`/`seen` records. Missing, superseded, expired, or recovered evidence reconciles its recommendation to superseded.
- Brief sections may remain empty. Recommended Next Step requires a meaningful non-low owner action.

## Local Validation

- PASS: `./node_modules/.bin/tsc --noEmit`
- PASS: `node --check dashboard/public/app.js`
- PASS: `git diff --check`
- PASS: `./node_modules/.bin/tsx tests/community-evidence.check.ts`
- PASS: `./node_modules/.bin/tsx tests/community-recommendations.check.ts`
- PASS: `./node_modules/.bin/tsx tests/community-daily-brief.check.ts`
- PASS: `./node_modules/.bin/tsx tests/community-brief-phase-1e.check.ts`
- PASS: `./node_modules/.bin/tsx tests/conversation-participation.check.ts`
- PASS: `./node_modules/.bin/tsx tests/daily-history.check.ts`

The TSX runner required permission for its local temporary IPC pipe; the initial sandboxed run failed with `listen EPERM`, and the permitted reruns passed. Tests use temporary Community Intelligence stores and created no production Community Intelligence data files.

## Production After

Pending deployment and real-data regeneration.

## Remaining Limitations

- Context is deterministic and only as complete as the documented production mapping. Unmapped channels remain Unknown.
- Post-window outcomes are channel-window correlations, not message-linked attribution or proof of causation.
- Attachment evidence measures authorship and counts, not screenshot/file meaning or quality.
- Calm-state production quality depends on observing a naturally quiet production window.
