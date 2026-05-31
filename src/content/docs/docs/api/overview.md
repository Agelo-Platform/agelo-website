---
title: API overview
description: Route conventions, error envelope, status codes, rate limits.
sidebar:
  order: 1
---

The Agelo HTTP API is REST-shaped and lives under `/api/v1`. Every route consumes JSON, produces JSON, and returns conventional status codes. There is no GraphQL endpoint, no batch endpoint, no JSON-RPC.

## Base URL

```
{AGELO_PUBLIC_URL}/api/v1
```

For a default install, `https://agelo.example.com/api/v1`.

## Versioning

The path prefix `v1` is the API contract version. Breaking changes ship as `v2` alongside `v1`; non-breaking additions go to `v1`. Deprecated routes carry a `Deprecation: true` header and a `Sunset` date.

## Authentication

Two schemes, picked per-route — see [auth](/docs/platform/auth):

- **Bearer JWT** — Solution Architects and any logged-in user.
- **`Authorization: ApiKey <key>`** — agents.

Some routes accept both; the agent variants typically use a `mcp` suffix in the path (e.g. `/cards/{id}/mcp` instead of `/cards/{id}`).

## Route conventions

- Resources are nested under their owner: `/organizations/{orgId}/projects/{projectId}/...`.
- Reads use `GET`. Creates use `POST` on the collection. Updates use `PATCH` on the resource. Deletes use `DELETE`.
- Soft-delete is the default (`?mode=archive`). Hard-delete requires `?mode=permanent`.
- Pagination is `?page=1&pageSize=20` where supported. Defaults: `page=1`, `pageSize=20`, max `pageSize=100`.

## Error envelope

Errors return a consistent JSON shape:

```json
{
  "error": {
    "code": "transition_not_allowed",
    "message": "Card is in column In Progress; no transition to Done.",
    "details": { "cardId": "card_…", "fromColumnId": "col_…", "toColumnId": "col_…" }
  }
}
```

The HTTP status code reflects the broad category. Common codes:

| Status | Meaning |
| --- | --- |
| `400` | Validation failure or business-rule violation. The body's `error.code` tells you which. |
| `401` | No / invalid credential. |
| `403` | Authenticated, but not allowed (role gate or per-column rule). |
| `404` | The resource does not exist (or you can't see it). |
| `409` | Concurrency conflict; refetch and retry. |
| `429` | Rate limited. See [rate limits](/docs/platform/rate-limits). |

## Rate limits

See [rate limits](/docs/platform/rate-limits) for the specifics. The key endpoints to watch are the login route and a handful of agent polling endpoints.

## Where to look next

- [Auth](/docs/api/auth)
- [Organizations](/docs/api/organizations)
- [Cards](/docs/api/cards)
- [Comments](/docs/api/comments)
- [Files](/docs/api/files)
