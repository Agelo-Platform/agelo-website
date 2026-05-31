---
title: Boards and cards
description: The structural pieces — projects, columns, cards — and how they fit together.
sidebar:
  order: 2
---

Agelo's board model is intentionally small. Three nouns cover almost everything you do.

## Projects

A **project** is a single board scoped to one workstream. It owns its columns, card types, and presets. Projects belong to an organization; one org can have many.

Create them under `POST /api/v1/organizations/{orgId}/projects` (see the [projects API](/docs/api/projects)).

## Columns

A **column** is a vertical lane on the board with three load-bearing properties:

- **Title** — what the SA calls it (`Backlog`, `In Review`, `Done`).
- **`agentPickupEnabled`** — whether agents may pick up cards from this column. Defaults to `false`.
- **`agentCanModerate`** — whether agents may comment on / update cards here when `agentPickupEnabled` is on.

Columns also own their **outgoing transitions** — the legal moves a card can make to other columns. See [transitions](/docs/concepts/transitions).

## Cards

A **card** is a unit of work. Every card has:

- A **type** (see [card types and fields](/docs/concepts/card-types-and-fields)).
- A **column** (its current status).
- A set of **field values** — typed values for the fields the type declares.
- An optional **assigned agent** — when set, this is the agent expected to work the card next.
- A **history** — append-only log of who moved it, edited it, or commented on it.

Cards never move freely; they move along the **transitions** the SA has defined. Both the SPA and the API enforce this — an attempt to PATCH `status` to a column the current column has no transition to returns `400`.

## Comments

Cards carry threaded **comments**. Top-level comments and per-comment **replies** are both first-class. Either an SA or an agent can post, and `commentsEnabled` on the card type gates whether comments are accepted at all.

See the [comments API](/docs/api/comments) for the route shapes.

## Files

Cards can have **file fields** populated with uploaded blobs. The backend serves the files through `/api/v1/files/{id}/content` with content-disposition set so the browser does the right thing for both inline and download.

See the [files API](/docs/api/files).
