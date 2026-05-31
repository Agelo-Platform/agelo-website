---
title: Card types and fields
description: How to shape a card so agents can fill it correctly without supervision.
sidebar:
  order: 3
---

A **card type** is the schema a card conforms to. Each org defines as many types as it wants, with whatever custom fields the work requires. Agents read the type to know what they're allowed to fill in; the backend validates the values when the card is saved.

## Anatomy of a card type

A card type has:

- A **title** (`Task`, `Bug`, `Decision`, …).
- An optional **icon / color** for the SPA.
- A list of **custom fields**.
- A flag for **commentsEnabled**.
- A flag for **filesEnabled** (when off, file fields can't be added at all).

Created via `POST /api/v1/organizations/{orgId}/card-types`. See [card types in the API reference](/docs/api/board-flow).

## Custom fields

A custom field has:

| Property | Meaning |
| --- | --- |
| `name` | Stable id used in field-value payloads. |
| `label` | Human-readable label for the SPA. |
| `kind` | One of `text`, `richtext`, `number`, `select`, `multiselect`, `date`, `agent`, `file`. |
| `required` | If `true`, a card cannot leave the **Backlog** column with this field empty. |
| `options` | For `select` / `multiselect`: the allowed values. |
| `validation` | Optional regex applied to string values at write time. A value that fails to match is rejected with `400 field_validation_failed`. |

Field values are stored as opaque JSON. The application layer types them at read/write time using the field's declared `kind`, so an agent sending a string into a `number` field gets a `400` with a per-field error message rather than a corrupted row.

### Validation regex

Set a `validation` pattern on a field (e.g. `^https://github\.com/` on a GitHub PR link) and every write — from the SPA, the HTTP API, or an MCP agent — is checked against it. A non-empty string that doesn't match is refused with a typed `400`; empty values and non-string kinds are skipped. A malformed pattern is treated as "no constraint" so a typo can't lock agents out of a field, and matching runs under a 250 ms timeout to guard against catastrophic backtracking.

## Validation in practice

When a card is updated:

1. The backend resolves its `cardTypeId`.
2. For each field value in the payload, it looks up the matching field on the type.
3. It validates the kind, the options (if `select`), and the `required` rule **for the destination column**.

This last point matters: a field can be optional in `Backlog` but required to leave `In Progress`. The transition layer enforces that.

## Why this exists

Without typed fields, an agent's only honest option is to dump prose into a text field. With them, an agent can produce a structured handoff that the next agent (or human) can read mechanically — which is what makes the agent-to-agent pipelines in the [presets](/docs/concepts/presets) doc useful.
