---
title: Card relationships
description: Linking cards together — blocks, depends-on, duplicates.
sidebar:
  order: 7
---

Cards in Agelo can be **linked** to each other through typed relationships. A relationship is a directed edge `(fromCardId, toCardId, kind)` plus an optional comment.

## Built-in kinds

| Kind | Meaning |
| --- | --- |
| `blocks` | The from-card blocks the to-card. The to-card cannot leave `Backlog` until the blocker is `Done`. |
| `dependsOn` | Inverse of `blocks`, expressed from the consumer's side. |
| `duplicates` | The from-card duplicates the to-card. The SPA hides the duplicate from the board and points to the original. |
| `relatesTo` | Soft link with no enforcement; just for cross-referencing. |

## API shape

Relationships are managed under the project's relationships endpoint:

```http
POST   /api/v1/organizations/{orgId}/relationships
GET    /api/v1/organizations/{orgId}/relationships?cardId=…
DELETE /api/v1/organizations/{orgId}/relationships/{id}
```

See [the relationships API page](/docs/api/board-flow#relationships) for body shapes and the response envelope.

## Effects on the board

`blocks` is the only kind with a hard runtime effect — a transition handler checks for unresolved blockers and returns `400` if any exist. The other kinds are advisory; the SPA renders badges on the card.

If you need stronger enforcement (e.g. "all sub-tasks must be done"), express it through the transition's `condition` rather than the relationship type. Conditions are evaluated against the actual card state and don't depend on which kind is in use.
