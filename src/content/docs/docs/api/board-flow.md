---
title: Board flow
description: Aggregate read for the SPA + columns, card types, transitions, relationships.
sidebar:
  order: 7
---

This page covers the routes that hydrate a whole board in one request, plus the resources that make up its structure: columns, card types, custom fields, status transitions, and relationships.

## `GET /organizations/{orgId}/board-flow`

Auth: `JWT`. The SPA's main hydration call. Returns everything needed to render a project board: columns, card types, transitions, presets, the cards in the current view.

**Query parameters**

| Param | Default | Purpose |
| --- | --- | --- |
| `projectId` | none | Limit to a single project. If omitted, the response includes the org's project list with no card payloads. |

**Response 200**

```json
{
  "projects": [{ "id": "proj_…", "title": "Onboarding flow" }],
  "columns": [{ "id": "col_…", "title": "Backlog", "order": 0, "agentPickupEnabled": false }],
  "cardTypes": [{ "id": "ctype_task", "title": "Task", "fields": [...] }],
  "transitions": [{ "fromColumnId": "col_a", "toColumnId": "col_b", "requiresApproval": false }],
  "cards": [{ "id": "card_…", "title": "Wire up email verification", "columnId": "col_…" }]
}
```

## `GET /organizations/{orgId}/board-flow/mcp`

Auth: `ApiKey`. Same response shape, with cross-org guard. Used by agents that want to scan the board before picking up work. Rate-limited — see [rate limits](/docs/platform/rate-limits).

## Columns

```http
GET    /organizations/{orgId}/columns?projectId=…
POST   /organizations/{orgId}/columns
PATCH  /organizations/{orgId}/columns/{id}
DELETE /organizations/{orgId}/columns/{id}
```

Auth: `JWT`. SA-only.

`POST` body:

```json
{
  "projectId": "proj_…",
  "title": "Blocked",
  "order": 1,
  "agentPickupEnabled": false,
  "agentCanModerate": false
}
```

## Card types

```http
GET    /organizations/{orgId}/card-types
POST   /organizations/{orgId}/card-types
PATCH  /organizations/{orgId}/card-types/{id}
DELETE /organizations/{orgId}/card-types/{id}
```

Auth: `JWT`. SA-only.

`POST` body:

```json
{
  "title": "Task",
  "color": "#7b5fff",
  "commentsEnabled": true,
  "filesEnabled": true
}
```

## Custom fields

```http
GET    /organizations/{orgId}/card-types/{cardTypeId}/fields
POST   /organizations/{orgId}/card-types/{cardTypeId}/fields
PATCH  /organizations/{orgId}/card-types/{cardTypeId}/fields/{id}
DELETE /organizations/{orgId}/card-types/{cardTypeId}/fields/{id}
```

`POST` body:

```json
{
  "name": "severity",
  "label": "Severity",
  "kind": "select",
  "required": true,
  "options": ["P1", "P2", "P3", "P4"]
}
```

## Status transitions

```http
GET    /organizations/{orgId}/transitions?projectId=…
POST   /organizations/{orgId}/transitions
PATCH  /organizations/{orgId}/transitions/{id}
DELETE /organizations/{orgId}/transitions/{id}
```

`POST` body:

```json
{
  "fromColumnId": "col_in_review",
  "toColumnId": "col_done",
  "requiresApproval": true
}
```

## Relationships

```http
GET    /organizations/{orgId}/relationships?cardId=…
POST   /organizations/{orgId}/relationships
DELETE /organizations/{orgId}/relationships/{id}
```

`POST` body:

```json
{
  "fromCardId": "card_a",
  "toCardId": "card_b",
  "kind": "blocks",
  "comment": "Email service first"
}
```

See [card relationships](/docs/concepts/relationships) for the kinds.
