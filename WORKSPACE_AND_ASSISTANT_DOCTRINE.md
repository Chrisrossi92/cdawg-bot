# Workspace and Assistant Doctrine

## Core Philosophy

CDawg is an AI Community Operator.

The goal is not to expose features. The goal is to reduce decisions.

CDawg should guide users toward outcomes and recommendations rather than configuration-first workflows. The product should translate community intent into a safe implementation path.

Golden Rule:

> CDawg should reduce decisions, not create them.

## Outcome-Driven UX

Users should be able to think in outcomes:

- I want a genealogy community.
- I want more activity.
- I want sports highlights.
- I want people to opt in.

CDawg should translate those intents into implementation details:

- Channel purpose and profile.
- Access model.
- Role signup system.
- Follow-up message.
- Scheduled or one-time content.
- Recommended next action.

Users should not need to understand role panels, follow-ups, feed configuration, automation internals, or debug data before CDawg can help them.

## Progressive Disclosure Doctrine

Only show what is needed for the next decision.

Default surfaces should show:

- Recommendations.
- Opportunities.
- Guidance.
- Brief summaries.
- Safe next actions.

Default surfaces should hide:

- Advanced forms.
- Technical settings.
- Debug data.
- Raw payloads.
- Low-level configuration internals.

Those details should remain available, but only after the user asks for them or enters a focused workflow.

## Future Workspace Model

### Mission Control

Mission Control is the operating homepage.

It should contain:

- Briefing.
- Action Needed.
- Things I Found For You.
- Recommendations.
- Activity.

Mission Control should answer what is happening, what matters, and what CDawg recommends next.

### Community Builder

Community Builder is the guided space for shaping how the Discord community works.

It should contain:

- Channel Profiles.
- Access Models.
- Signup Systems.
- Follow-Ups.

Users should start from the community outcome, not from individual configuration primitives.

### Content Studio

Content Studio is the guided space for content discovery, preparation, and posting.

It should contain:

- Content Discovery.
- Generate Content.
- Saved Messages.
- Future Reddit, YouTube, and RSS sources.

Content Studio should help users find and prepare useful material without requiring them to understand every source or provider.

### Settings

Settings is for advanced controls, diagnostics, and automation tuning.

It should contain:

- Advanced Controls.
- Diagnostics.
- Automation.

Settings should not be the primary way users discover what to do.

## Channel Profile Doctrine

Channel Profiles become CDawg's memory layer.

Everything should increasingly derive from channel profiles:

- Recommendations.
- Content matching.
- Future AI adaptation.
- Future discovery sources.
- Future personalities.

A channel profile should describe what a channel is for, who it serves, how access works, what tone fits, and what content belongs there. It should not directly mutate Discord or hidden automation. It is context first.

## Assistant Evolution Ladder

### Level 1: Rules

CDawg detects simple conditions from deterministic data.

### Level 2: Completeness

CDawg identifies missing setup pieces and incomplete workflows.

### Level 3: Recommendations

CDawg ranks safe next actions and explains why they matter.

### Level 4: Discovery

CDawg finds useful content and opportunities from connected sources.

### Level 5: Adaptation

CDawg adjusts recommendations based on channel profiles, outcomes, and community patterns.

### Level 6: Personality

CDawg develops channel-aware voice and operator presence while remaining admin-safe and approval-driven.

## Guidance Doctrine

Every meaningful action should follow this path:

Guidance -> Preview -> Approval -> Execution -> Feedback

No hidden automation.

No autonomous mutations without explicit approval.

CDawg may guide, prefill, summarize, and recommend. Execution requires a clear reviewed action unless a future feature explicitly establishes trusted automation with auditability and rollback.

## North Star

The dashboard should eventually feel more like:

- Jarvis.
- Mission Control.
- Community Operating System.

and less like:

- Discord Admin Panel.
- Settings Dashboard.

CDawg should make the user feel guided through community operations, not dropped into a pile of controls.
