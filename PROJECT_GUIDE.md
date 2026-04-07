# Cdawg Bot Project Guide

## Purpose

Cdawg Bot is a standalone Discord engagement bot for a community server.

The product is designed around topic-aware content by channel, so generic commands can adapt to the context of where they are used.

It may later integrate with GameOps Bridge, but it should remain a separate product with loose coupling and its own local architecture.

## Current Architecture

Cdawg Bot is currently slash-command based.

The command layer is generic and content-oriented. Current commands are actions like:
- `/fact`
- `/wyr`
- `/prompt`
- `/trivia`

Topic routing currently works in this order:
1. Use an explicit `topic` argument if the user provided one.
2. Otherwise use the channel-to-topic mapping.
3. Otherwise use the default topic.
4. Then fall back to general content if a topic-specific content pool does not exist for that command.

This keeps commands reusable while allowing channels to feel customized.

## Folder Structure

High-level structure:
- `src/commands`
  Slash command definitions and execution handlers.
- `src/content`
  Local content pools organized by command type and topic.
- `src/config`
  Shared config such as supported topics and channel-to-topic mapping.
- `src/lib`
  Small reusable helpers for topic resolution and content selection.

## Current Commands

Currently implemented:
- `/fact`
- `/wyr`
- `/prompt`
- `/trivia`

## Locked-In Design Principles

- Keep commands generic, not topic-specific.
- Keep content local-file based for now.
- Prefer reusable systems over one-off gimmicks.
- Keep GameOps integration loosely coupled.
- Avoid overengineering early.
- Do not add a database unless there is a clear need.

## Roadmap

### Phase 1: Foundation and Topic-Aware Content
- Establish slash-command architecture.
- Add topic config and channel-to-topic routing.
- Build reusable local content structure.
- Support generic content commands with topic fallback behavior.

### Phase 2: Content Expansion
- Fill out more topic pools for facts, prompts, WYR, and trivia.
- Add more supported topics where needed.
- Improve consistency and quality across content files.

### Phase 3: Automated Engagement / Scheduled Posting
- Add scheduled posting for prompts, facts, trivia, or rotating engagement content.
- Allow channel-aware scheduled content based on mapped topic.
- Keep scheduling local and simple before introducing heavier systems.

### Phase 4: Interactive Game Systems
- Add richer interactions such as answer reveals, voting flows, or lightweight mini-games.
- Expand trivia from static question delivery into more interactive play.

### Phase 5: Participation and Progression
- Consider score tracking, streaks, or lightweight participation rewards.
- Only add persistence once the engagement model is stable enough to justify it.

### Phase 6: GameOps Integration
- Integrate selected GameOps Bridge capabilities where useful.
- Keep the integration optional and loosely coupled so Cdawg Bot can still operate independently.

### Phase 7: Advanced Community Systems
- Explore more advanced server systems such as recurring events, reputation layers, progression loops, or hybrid utility/engagement features.
- Add these only after the core engagement loop is proven.

## Near-Term Next Steps

- Continue filling topic content for existing commands.
- Add scheduled posting.
- Improve trivia interaction.
- Consider score tracking after engagement systems are stable.
