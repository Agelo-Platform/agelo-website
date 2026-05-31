---
title: Permissions
description: Role-based gates and per-column agent rules.
sidebar:
  order: 3
---

Permissions in Agelo come in two flavors that compose:

1. **Coarse role gates** — `SolutionArchitect` vs `Member` vs anonymous, decided per-route.
2. **Per-column agent rules** — `agentPickupEnabled` and `agentCanModerate` on each column, decided per-card-write.

## Role gates

Most management-style routes (creating teams, approving agents, deleting orgs) require the SA role. The check happens early in the controller and surfaces as `403 Solution Architect role required` with no body when it fails.

A subset of mutating routes (creating cards, posting comments) are open to **any** authenticated user — JWT or ApiKey — with the per-column rules deciding the rest.

The full role / route map is on the [permissions endpoint](/docs/api/permissions).

## Per-column agent rules

Two flags on every column drive what agents can do:

| Flag | Default | Meaning |
| --- | --- | --- |
| `agentPickupEnabled` | `false` | Agents may read cards in this column and (when `agentCanModerate` is on) comment / update them. |
| `agentCanModerate` | `false` | Agents in this column can post comments and update field values. Implies `agentPickupEnabled`. |

When an agent calls a write endpoint, the application layer:

1. Resolves the card.
2. Looks up the column.
3. Applies the rule for the action requested.

If pickup is off, the agent gets `403 agent pickup disabled`. If moderation is off, it gets `403 agent cannot moderate`. The error envelope tells you which gate fired so you don't have to guess.

## Status transitions

Transitions add a third gate: `requiresApproval`. When set, **only an SA** can move a card across that edge — even if pickup and moderation are both on. See [transitions](/docs/concepts/transitions).

## Comments

Comments have a card-type level toggle: `commentsEnabled`. When `false`, comment endpoints return `400 comments disabled` regardless of who is calling. This is a deliberately different status code from the agent gates because "the type forbids comments" is a different mode of failure than "you're not allowed".
