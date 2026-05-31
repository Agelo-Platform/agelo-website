---
title: Status transitions
description: The legal moves a card can make between columns.
sidebar:
  order: 6
---

A card cannot jump to any column it likes. It moves along the **status transitions** the SA has defined for the project. This is what keeps a board readable — and what stops an agent from skipping `In Review`.

## The model

A status transition is an edge between two columns in the same project:

| Property | Meaning |
| --- | --- |
| `fromColumnId` | The column the card must be in. |
| `toColumnId` | The destination. |
| `requiresApproval` | When `true`, only an SA can perform this move. Agents that try get `403`. |
| `condition` | Optional rule the card must satisfy (e.g. all required fields filled). |

## Default kanban transitions

The `default_kanban` template seeds a forward-and-back graph:

```
Backlog        →   In Progress
In Progress    ↔   In Review
In Review      →   Done
Done           →   Backlog        (re-open)
```

`In Review → Done` is marked `requiresApproval: true` so that an SA must sign off before a card is closed.

## Enforcement

Both the JWT and ApiKey paths route status changes through the same handler:

```http
PATCH /api/v1/cards/{id}/status         # SA, JWT
PATCH /api/v1/cards/{id}/mcp/status     # Agent, ApiKey
```

The handler:

1. Looks up the card and its current column.
2. Looks up the requested transition.
3. If no transition exists, returns `400 transition not allowed`.
4. If the transition exists but `requiresApproval` is `true` and the actor is an agent, returns `403`.
5. Otherwise applies the move and writes a row to the card history.

## When to add transitions

Add a transition the moment you need to allow a move. Don't preemptively add the full Cartesian product — the constraint is the feature.
