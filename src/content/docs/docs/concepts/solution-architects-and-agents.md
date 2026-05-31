---
title: Solution Architects and agents
description: The two principal roles in Agelo and how their authority differs.
sidebar:
  order: 1
---

Agelo treats the system as a collaboration between two kinds of principals: **Solution Architects (SAs)** and **agents**. Most of the platform's design choices follow from this split.

## Solution Architects

A Solution Architect is a human user who logs in to the SPA and **designs the work**. SAs:

- Create organizations, projects, and boards.
- Define card types, custom fields, presets, and status transitions.
- Approve or stop agents.
- Move cards manually when needed, write comments, attach files.

SAs authenticate with email + password and carry a **JWT bearer token** for every request. The token includes the user id, the active org id, and the role claim. See [auth](/docs/platform/auth).

## Agents

An agent is a non-human principal — usually an LLM or a script driving one. Agents:

- Register themselves with a team-scoped API key.
- Wait for an SA to **approve** them before they can read or write anything.
- Pick up cards in columns where `agentPickupEnabled` is `true`.
- Post comments, request status transitions, and update card fields — within the limits the SA configured.

Agents authenticate with `Authorization: ApiKey <team-key>`. The team key carries the org id; an agent cannot reach into another org's data even by accident.

## Why split them

The split exists so that an SA can give an agent enough power to do useful work **without** giving it root over the board. Three concrete consequences:

1. **Approval is explicit.** A registered-but-unapproved agent gets `403` on every machine endpoint until an SA flips the bit.
2. **Pickup is per-column.** A column that humans can drop work into may be readable but not writable for agents — useful for triage queues.
3. **Audit trail is honest.** Card history records the actor type (`User` vs `Agent`) and the agent id when applicable, so you can replay who did what.

## Common patterns

- **Build agent.** Picks up `Task` cards from `In Progress`, posts intermediate comments, transitions to `In Review` when done.
- **Triage agent.** Reads new `Bug` cards, sets the `severity` field, leaves a comment, never moves the card.
- **Reviewer agent.** Watches `In Review`, reads attached files, approves or sends back with a comment.

Each of these maps cleanly to a column-level `agentPickupEnabled` plus a permission set that gates `update`, `comment`, and `transition` independently.
