# CDawg Product Vision

## Product Direction

CDawg is evolving from a Discord engagement bot into an AI Community Operator: a guided operations layer that helps a server owner understand what is happening, decide what needs attention, and keep the community active without needing to manage every channel manually.

The product should still feel practical and admin-first. CDawg should not become a novelty chatbot, a generic content generator, or an opaque automation engine. It should behave like a capable operator that explains what it sees, recommends clear next steps, and routes the user to safe controls.

## Core Promise

CDawg helps community owners answer four questions:

- Is my community healthy?
- What needs attention right now?
- What useful content or opportunities did CDawg find?
- What should I do next?

The dashboard should make those answers visible without requiring users to inspect every configuration page.

## Product Pillars

### Mission Control First

Mission Control is the primary UX. It should become the homepage for the operator experience, summarizing system health, community activity, content opportunities, and recommended actions.

Configuration pages still matter, but they are supporting surfaces. Users should not need to know where every feature lives before CDawg can help them.

### Guided Experience

CDawg should guide users through the next useful action. Recommendations should explain the reason, the source data, and the safe action available.

The product should avoid dumping raw metrics on users without interpretation. Metrics are useful when they support a decision.

### Channel Intelligence

Channels are the natural operating unit of a Discord community. CDawg should understand each channel's purpose, tone, content types, posting cadence, automation state, and role relationship.

The long-term goal is for each channel to have a profile that helps CDawg recommend better content and safer automation.

### Human-in-Control Automation

CDawg should automate routine engagement, but the admin remains in control. Risky actions should be reviewable, reversible, or navigation-only until trust is earned.

The system should prefer suggestions, previews, and guided workflows before direct mutations.

## Near-Term Product Shape

The near-term product should focus on:

- Mission Control as the default dashboard experience.
- Action-needed and warning-level opportunities.
- Content opportunities from existing history, trivia, feeds, templates, and metrics.
- Channel Profile foundations.
- Community Intelligence summaries based on existing activity and XP data.
- Clear recommendations that route to existing safe controls.

## Long-Term Product Shape

The long-term direction is a Jarvis-style community operator: an assistant that can brief the owner, explain community changes, draft plans, prepare content, identify risks, and eventually execute approved actions.

This does not mean adding AI everywhere. AI should be used where interpretation, summarization, planning, or natural-language assistance creates real value beyond deterministic rules.

## Product Boundaries

CDawg should not:

- Hide important automation behind vague AI decisions.
- Post or mutate state without clear user intent and safe controls.
- Replace useful deterministic rules with AI for simple checks.
- Become a general-purpose chatbot disconnected from the server's operational needs.
- Prioritize flashy UI over readable admin workflows.

## Success Criteria

CDawg succeeds when a server owner can open Mission Control and quickly understand:

- Whether the bot and community are healthy.
- What requires attention.
- What content is ready or worth using.
- Which channels are under-served or over-automated.
- What safe action to take next.
