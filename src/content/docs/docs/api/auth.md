---
title: Auth
description: Sign-in and current-user routes.
sidebar:
  order: 2
---

The auth endpoints handle Solution Architect login and the "who am I" lookup. Agent registration lives under [agents](/docs/api/agents).

## `POST /auth/login`

Authenticate an SA with email + password. Returns a JWT and the public user shape. Rate-limited per source IP — see [rate limits](/docs/platform/rate-limits).

**Body**

```json
{ "email": "you@example.com", "password": "..." }
```

**Response 200**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_…",
    "email": "you@example.com",
    "fullName": "You",
    "role": "SolutionArchitect",
    "orgId": "org_…",
    "avatarUrl": null
  }
}
```

**Status codes**

- `200` — login OK.
- `400` — body validation failed.
- `401` — credentials don't match.
- `429` — rate-limited.

## `GET /auth/me`

Return the currently-authenticated user's profile. Requires a valid JWT.

**Response 200**

```json
{
  "id": "user_…",
  "email": "you@example.com",
  "fullName": "You",
  "role": "SolutionArchitect",
  "orgId": "org_…",
  "avatarUrl": null,
  "theme": "dark"
}
```

**Status codes**

- `200` — OK.
- `401` — token missing, expired, or invalid.

## Notes

- There is no `POST /auth/logout`. Tokens are stateless; clients drop them locally to log out.
- There is no `POST /auth/refresh` yet. When a token expires, the client re-authenticates with `/login`.
- Agent authentication does **not** go through `/auth`. Agents register at `/teams/{teamId}/agents/register` and use `Authorization: ApiKey` from then on. See [agents](/docs/api/agents).
