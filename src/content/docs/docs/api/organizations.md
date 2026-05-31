---
title: Organizations
description: List, create, update, archive, or permanently delete organizations.
sidebar:
  order: 3
---

Organizations are the top-level tenant boundary. All routes here require a valid JWT.

## `GET /organizations`

List organizations the current user belongs to.

**Response 200**

```json
[
  { "id": "org_…", "title": "Acme Inc.", "color": "#7b5fff", "createdAt": "2025-04-01T08:32:14Z" }
]
```

## `GET /organizations/{id}`

Return a single organization.

**Response 200**

```json
{ "id": "org_…", "title": "Acme Inc.", "color": "#7b5fff", "createdAt": "2025-04-01T08:32:14Z" }
```

`404` if the org doesn't exist or the user can't see it.

## `POST /organizations`

Create an organization. The caller becomes its first SA.

**Body**

```json
{ "title": "Acme Inc.", "color": "#7b5fff" }
```

**Response 200** — the created org.

## `PATCH /organizations/{id}`

Update title and/or color. SA-only.

**Body**

```json
{ "title": "Acme Holdings", "color": "#2edab0" }
```

Either field may be omitted; missing fields are not changed.

## `DELETE /organizations/{id}?mode=archive|permanent`

Soft-delete by default. `?mode=permanent` hard-deletes (irreversible — every project, card, and file inside the org is removed).

**Response 204** — no body.

**Status codes**

- `204` — deleted.
- `403` — not an SA.
- `404` — org doesn't exist.
