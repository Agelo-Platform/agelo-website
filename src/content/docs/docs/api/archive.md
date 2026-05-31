---
title: Archive
description: Browse, restore, or permanently delete soft-deleted resources.
sidebar:
  order: 18
---

The archive endpoints expose every soft-deleted resource in the org in one place. Use them when you want to undo a delete or do a periodic sweep.

The default `DELETE` on each resource (`/cards/{id}`, `/projects/{id}`, etc.) is a soft-delete and lands the row here. `?mode=permanent` skips the archive entirely.

## `GET /archive`

Auth: `JWT`. List archived resources for the current org.

**Query parameters**

| Param | Default | Purpose |
| --- | --- | --- |
| `type` | all | Filter to one resource type: `card`, `project`, `team`, `organization`. |
| `page` | `1` | Pagination. |
| `pageSize` | `20` | 1–100. |

**Response 200**

```json
{
  "items": [
    {
      "type": "card",
      "id": "card_…",
      "title": "Wire up email verification",
      "archivedAt": "2025-04-29T18:00:00Z",
      "archivedBy": { "type": "User", "id": "user_…", "label": "you@example.com" }
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 42
}
```

## `POST /archive/{type}/{id}/restore`

Auth: `JWT`. Restore a resource. Returns the restored object.

`type` accepts `card`, `project`, `team`. Restoring a project also restores its columns and card types if they were archived as part of the same delete.

**Response 200** — the restored resource.

## `DELETE /archive/{type}/{id}`

Auth: `JWT`. SA-only. Permanently delete an archived resource. Once gone, it cannot be restored.

**Response 204** — no body.

## Notes

- Archived organizations are treated specially: only their owner SA can see and restore them.
- Cards have a dedicated convenience route `POST /cards/{id}/restore` — the result is the same as calling this route with `type=card`.
- The list call respects soft-delete cascades — a card whose project was archived will show up here only if the project's archive walked into it. Permanently-deleting a project removes its cards from this list too.
