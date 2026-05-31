# AI Assistant Evolution Plan

## Direction

CDawg's long-term AI direction is a Jarvis-style community assistant: a trusted operator that can brief the owner, interpret community state, recommend actions, draft content, and eventually perform approved tasks.

This should be an evolution, not a jump. CDawg should earn autonomy through deterministic systems, clear recommendations, safe workflows, and visible user control.

## Appropriate AI Usage Doctrine

AI should be used when it adds value through interpretation, summarization, drafting, planning, or conversation.

AI should not replace deterministic checks for simple configuration facts.

Good AI use cases:

- Summarizing community health.
- Explaining why several signals matter together.
- Drafting content ideas from approved context.
- Creating a weekly operator briefing.
- Helping plan a content calendar.
- Translating raw metrics into plain-language guidance.

Poor AI use cases:

- Checking whether a role ID exists.
- Checking whether a channel is missing.
- Counting saved templates.
- Deciding to post without review.
- Hiding configuration logic behind a black box.

## Evolution Stages

### Stage 1: Deterministic Operator

CDawg identifies opportunities from existing state and routes users to safe controls.

Capabilities:

- Mission Control briefing.
- Action Needed recommendations.
- Content opportunity cards.
- Recent activity summaries.

AI requirement: none.

### Stage 2: Assisted Briefing

AI helps summarize deterministic signals in natural language.

Capabilities:

- Human-readable daily or weekly briefing.
- Explanation of grouped issues.
- Friendly interpretation of community health.

AI requirement: summarization only, using bounded data.

### Stage 3: Drafting Assistant

AI drafts content and plans for user review.

Capabilities:

- Suggested posts.
- Trivia themes.
- Channel-specific prompts.
- Role follow-up copy.
- Content calendar drafts.

AI requirement: generation with explicit review before use.

### Stage 4: Workflow Copilot

AI helps the user complete multi-step dashboard tasks.

Capabilities:

- "Set up trivia for this channel."
- "Prepare three posts for the week."
- "Review inactive channels and suggest a plan."

AI requirement: tool-aware planning with confirmation before mutation.

### Stage 5: Approved Operator

AI can execute approved, bounded tasks with clear audit trails.

Capabilities:

- Apply reviewed configuration changes.
- Schedule approved content.
- Pause or resume automation after confirmation.
- Generate reports on completed work.

AI requirement: strict permissions, auditability, confirmations, and rollback where feasible.

## Trust and Safety Requirements

Before AI can mutate state, CDawg needs:

- Clear user intent.
- Preview of proposed changes.
- Confirmation step.
- Error handling.
- Audit trail.
- Permission boundaries.
- Ability to explain what happened.

## Context Strategy

AI should receive structured context, not unbounded raw application state.

Good context packets:

- Mission Control summary.
- Channel Profile.
- Current opportunities.
- Recent activity.
- User-selected target channel or workflow.

Avoid:

- Dumping full raw logs.
- Sending unnecessary user data.
- Sending private content without explicit product decisions.
- Using stale context without visible timestamps.

## Product Guardrails

- AI should sound like an operator, not a mascot.
- AI should cite or describe the source of its recommendation.
- AI should admit when data is missing.
- AI should prefer drafts and plans before actions.
- AI should not create fake certainty.

## Long-Term Assistant Shape

The long-term assistant should be able to answer:

- "What should I worry about today?"
- "What did CDawg find for me?"
- "Which channels need attention?"
- "What content should I post this week?"
- "Why did automation skip that channel?"
- "Set up a safe plan to revive this channel."

The assistant should sit on top of Mission Control, Channel Profiles, and Community Intelligence. It should not bypass them.
