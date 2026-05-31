---
title: Cards
description: Read, update, transition, archive, and restore individual cards.
sidebar:
  order: 8
---

The card endpoints are scoped by card id (the org id is resolved server-side from the card). They split between **JWT** routes (any authenticated user) and **ApiKey** routes (machine agents). Application-layer rules apply identically to both.

For the org-scoped list endpoints (`GET /organizations/{orgId}/cards`), see the bottom of this page.

## JWT routes

### `GET /cards/{id}`

Auth: `JWT`. Return a card with its field values.

**Response 200**

```json
{
  "id": "card_…",
  "title": "Wire up email verification",
  "columnId": "col_in_progress",
  "cardTypeId": "ctype_task",
  "assignedAgentId": "claude-1",
  "assignedUserId": null,
  "priority": "high",
  "dueDate": "2026-06-01T00:00:00Z",
  "fieldValues": [
    { "fieldId": "field_severity", "value": "P3" }
  ],
  "createdAt": "2025-04-29T10:14:22Z",
  "updatedAt": "2025-05-02T11:02:11Z"
}
```

### `PATCH /cards/{id}`

Auth: `JWT`. Update title, assignee, priority, due date, and/or field values. Every field is optional: a missing key is left unchanged, while an explicit `null` clears it.

**Body**

```json
{
  "title": "Wire up email verification (urgent)",
  "assignedAgentId": "claude-1",
  "priority": "urgent",
  "dueDate": "2026-06-01T00:00:00Z",
  "fieldValues": [
    { "fieldId": "field_severity", "value": "P2" }
  ]
}
```

**Priority** — one of `none` (default), `low`, `medium`, `high`, `urgent`. Shown as a badge in the card-detail aside.

**Due date** — an ISO-8601 timestamp, or `null` to clear. Surfaced with an amber tint as the date approaches.

**Field validation** — when a custom field declares a `validation` regex, a string value that fails to match is rejected with `400 field_validation_failed`. Non-string values (lists, nulls) skip validation.

### `PATCH /cards/{id}/status`

Auth: `JWT`. Move the card to a column. The column must have an inbound transition from the current column.

**Body** — `{ "toColumnId": "col_in_review" }`

**Errors**

- `400 transition_not_allowed` — there's no transition from the current column.
- `400 required_fields_missing` — the destination column requires fields that are still empty.
- `403` — the transition `requiresApproval` and the caller is an agent.

### `DELETE /cards/{id}?mode=archive|permanent`

Auth: `JWT`. Default `archive`. Returns `{ "success": true }`.

### `POST /cards/{id}/restore`

Auth: `JWT`. Restore an archived card. Returns the card.

### `GET /cards/{id}/history`

Auth: `JWT`. Append-only log of changes to the card. Each row records actor type, id, action, and a snapshot of the changed fields.

## ApiKey (agent) routes

### `GET /cards/{id}/mcp`

Same shape as `GET /cards/{id}`. Cross-org guarded.

### `PATCH /cards/{id}/mcp`

Same shape as `PATCH /cards/{id}` plus an optional `agentId` field that becomes the actor id in the history row.

```json
{
  "title": "...",
  "fieldValues": [...],
  "agentId": "claude-1"
}
```

### `PATCH /cards/{id}/mcp/status`

Same shape as the JWT transition, plus `agentId`.

```json
{ "toColumnId": "col_in_review", "agentId": "claude-1" }
```

## Org-scoped card list

```http
GET /organizations/{orgId}/cards
```

Auth: `JWT`. Returns the cards the user can see in the org, optionally filtered:

| Param | Purpose |
| --- | --- |
| `projectId` | Limit to one project. |
| `columnId` | Limit to one column. |
| `assignedAgentId` | Cards assigned to a specific agent. |
| `page`, `pageSize` | Pagination. |

```http
GET /organizations/{orgId}/cards/mcp
```

Auth: `ApiKey`. Same shape, cross-org guarded.
