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

- Generated at: `2026-07-13T13:52:32.040Z`
- Evidence considered: 70 (before: 193)
- Recommendations considered: 5 (before: 22)
- Active recommendations in the brief: 5 (before: 21)
- Status: informational (before: urgent)
- Sections: Community Pulse 0; Needs Attention 0; Worth Reviewing 3; Conversation Watch 0; Recommended Next Step 1
- Recommended Next Step: Medium `Review automation content availability` for repeated history content exhaustion (before: Critical `Investigate automation issue`)
- Populated brief contexts: Fantasy 1; General 3. No Primal item crossed the current brief thresholds, but current non-expired evidence includes Fantasy 15, Primal 3, General 52, and Unknown 5 records.
- Equivalent pulse duplicates: 0 (before: 3)
- Visible attachment-heavy recommendations: 1 legitimate Fantasy community-channel item; bot/alert attachment recommendations: 0
- Intentional/expected automation states: 6 intentional-block and 1 expected-skip evidence groups remained factual evidence but produced no owner recommendation
- Repeated `CONTENT_UNAVAILABLE`: Medium; one-time trigger-now content unavailability was suppressed
- Recommendation lifecycle store: 28 total; 5 visible active, 1 postponed historical record, 22 superseded historical records

The apparent total evidence store grew because history was preserved. Older equivalent evidence was marked superseded rather than deleted; 180 old rolling activity records and 11 old automation records were reconciled to superseded.

## Deployment And Health

- Implementation commit: `61512b906fced3d181ad5641a4bc2afb30dad807`
- Clean release worktree: `/root/cdawg-bot-release-61512b9`
- Runtime `.env`, `data/`, and `node_modules` point to the preserved resources under `/root/cdawg-bot`
- The dirty `/root/cdawg-bot` checkout was not reset, pulled, or overwritten
- Restarted only `cdawg-bot` and `cdawg-dashboard`; Palworld/GameOps processes were untouched
- PM2: both Cdawg processes online on the new release
- Bot ready: `Cdawg Bot#7292`
- Public dashboard: 200
- Public health: 200
- Brief read: 200
- Legacy Daily Briefing: 200
- Unauthorized generation/disposition: 401
- Authorized generation: 200
- Authorized disposition of a nonexistent recommendation: 404, confirming the protected route was reached without mutating lifecycle data
- Restart persistence: latest brief ID/timestamp, 1 postponed record, and 22 superseded records persisted; bot returned ready after restart

During the first cutover, the clean worktree's tracked `data/role-access-panels.json` caused `data/` to remain a release-local directory. The first test generation therefore wrote only isolated release-local files and did not touch production data. The processes were stopped, that release-local directory was removed, the intended `/root/cdawg-bot/data` link was installed, and only then was the real production brief generated. No production JSON was manually rewritten.

## Usefulness Assessment

- Clarity: improved. Automation content exhaustion is explained as an available automation with an exhausted content source, including the technical reason only after plain language.
- Selectivity: materially improved. Five visible active recommendations remain instead of 21, with no forced attention or pulse items.
- Explainability: improved through context source/confidence, channel kind, human attachment facts, issue class, and explicit evidence limitations.
- Actionability: improved. The next step is a Medium content-source review rather than a Critical broken-automation claim.
- Context: improved. Fantasy and Primal are present in current evidence where configured; unmapped channels are Unknown instead of silently General.
- Lifecycle memory: preserved. Old equivalents are superseded, not deleted, and postponed state survived regeneration and restart.

## Remaining Limitations

- Context is deterministic and only as complete as the documented production mapping. Unmapped channels remain Unknown.
- Post-window outcomes are channel-window correlations, not message-linked attribution or proof of causation.
- Attachment evidence measures authorship and counts, not screenshot/file meaning or quality.
- Calm-state production quality depends on observing a naturally quiet production window.

## Next-Phase Recommendation

Option A - Phase 2A: Message-Linked Post Outcomes.

Phase 1E is selective and proportionate on current production data. The largest remaining intelligence weakness is that post-window outcomes are channel-level correlations rather than message-linked attribution. Do not implement Phase 2A as part of Phase 1E.
