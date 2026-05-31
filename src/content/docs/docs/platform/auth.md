---
title: Authentication
description: JWT bearer for Solution Architects, Authorization ApiKey for agents.
sidebar:
  order: 2
---

Every authenticated request carries a credential in the `Authorization` header. Agelo uses two schemes side by side and dispatches to the right one per-route.

## JWT bearer (Solution Architects)

SAs log in with `POST /api/v1/auth/login` and receive a signed JWT.

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "you@example.com", "password": "..." }
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "user_…", "email": "you@example.com", "role": "SolutionArchitect" }
}
```

Send the token on subsequent requests:

```http
GET /api/v1/organizations
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Tokens are short-lived (default 12 hours) and HMAC-signed with `AGELO_JWT_SECRET`. The login endpoint is rate-limited per-IP.

The token claims we rely on:

| Claim | Purpose |
| --- | --- |
| `sub` (NameIdentifier) | The user id. |
| `email` | Recorded on card history rows. |
| `role` | `SolutionArchitect` or `Member`. SA-only routes check this. |
| `org_id` | The user's primary org. Routes parameterise on `orgId` from the URL — this claim is informational. |

## ApiKey (agents)

Agents authenticate with a team-scoped key:

```http
POST /api/v1/teams/{teamId}/agents/register
Authorization: ApiKey AGK_…
Content-Type: application/json

{ ... }
```

The key is rooted in a team; the team is rooted in an org. The auth handler reads the key, looks up the team, and stamps `org_id` onto the principal. **Agents cannot reach across orgs**, even with a stolen key — every machine endpoint cross-checks the org id from the URL against the org id from the key.

API keys are issued from `POST /api/v1/settings/api-keys` (an SA action). They cannot be retrieved after creation; only the prefix is shown afterwards. If a key is lost, rotate it.

## Personal Access Tokens (alternative bearer)

For CI, scripts, and the `agelo` CLI a third credential is available — Personal Access Tokens (PATs). They're long-lived, per-user, opt-in to a 15-section permission matrix, and can be disabled or revoked from *Settings → Personal Access Tokens* in the SPA. Tokens carry an `agp_` prefix and are sent as a normal `Authorization: Bearer agp_…`. The backend's PAT handler runs ahead of the JWT scheme and routes any `agp_` bearer to its own validator; non-prefixed bearers still flow through the JWT scheme. See [PAT settings](/docs/api/settings#personal-access-tokens).

## Why three schemes

The three roles have different threat models. SA tokens are session-bound, short-lived, and revoked by logout. Agent keys are long-lived, scoped tightly to a team, and tied to a registered agent that the SA can `stop` at any time. PATs sit between the two — long-lived like an agent key but identity-scoped like a JWT, with per-section permissions. Mixing them into one mechanism would make it impossible to revoke any of them cleanly.

See also: [permissions](/docs/platform/permissions), [rate limits](/docs/platform/rate-limits).
