---
title: Settings
description: Per-user settings — password, theme, profile, avatar, API keys.
sidebar:
  order: 14
---

The settings endpoints affect the **current user**. There is no `/settings/{userId}` form — you can only edit yourself.

## `POST /settings/password`

Auth: `JWT`. Change the current user's password.

**Body**

```json
{
  "currentPassword": "...",
  "newPassword": "..."
}
```

`400` if `currentPassword` doesn't match. Sessions are not invalidated automatically; the client should re-login if it wants the new token.

## `PATCH /settings/theme`

Auth: `JWT`. Persist the SPA theme.

**Body**

```json
{ "theme": "dark" }
```

Allowed values: `light`, `dark`, `system`.

## `PATCH /settings/avatar`

Auth: `JWT`. Multipart form with a single `avatar` file part. Returns the new public URL.

## `PATCH /settings/profile`

Auth: `JWT`. Update name and timezone.

**Body**

```json
{ "fullName": "Jeff Nasseri", "timezone": "America/Vancouver" }
```

## API keys

The API keys section is where SAs mint, rotate, and revoke the team-scoped keys agents authenticate with.

### `GET /settings/api-keys`

Auth: `JWT`. List the keys the current user owns. Each row shows the prefix and creation time — the secret part is only shown once at creation.

**Response 200**

```json
[
  {
    "id": "key_…",
    "name": "build-bot",
    "prefix": "AGK_a4f8…",
    "createdAt": "2025-04-01T10:00:00Z",
    "expiresAt": "2025-06-30T00:00:00Z"
  }
]
```

`expiresAt` is `null` for keys that never expire.

### `POST /settings/api-keys`

Auth: `JWT`. Mint a new key. The full secret is in the response — store it now.

**Body**

```json
{ "name": "build-bot", "orgId": "org_…", "expiresAt": "2025-06-30T00:00:00Z" }
```

`expiresAt` is optional. Omit it (or send `null`) for a key that never expires; the SPA's create dialog offers 30 / 90 / 180 / 365-day and "never" presets. Once an expiry passes, the auth handler rejects the key with `401` exactly as it would a disabled key — no cron job required.

**Response 200**

```json
{
  "id": "key_…",
  "name": "build-bot",
  "secret": "AGK_a4f8e7c3b1...",
  "prefix": "AGK_a4f8…",
  "expiresAt": "2025-06-30T00:00:00Z"
}
```

### `PATCH /settings/api-keys/{id}`

Auth: `JWT`. Rename the key.

**Body** — `{ "name": "build-bot-v2" }`

### `DELETE /settings/api-keys/{id}`

Auth: `JWT`. Revoke the key. Agents using it get `401` on the next request.

**Response 200** — `{ "success": true }`.

## Personal Access Tokens

Personal Access Tokens (PATs) are GitHub-style, per-user bearer credentials with a 15-section permission matrix. They sit alongside the email/password JWT flow — useful for CI, scripts, and the `agelo` CLI when an interactive login isn't available. The auth handler that validates them runs in front of the JWT scheme and is gated on the `agp_` prefix; everything else falls through to the JWT bearer scheme.

The endpoints are **JWT-only**: management of PATs requires an SSO browser session — you cannot use one PAT to mint another.

### `GET /settings/personal-access-tokens`

Auth: `JWT`. List the current user's PATs. The raw token is **never** returned after creation — only the prefix and last 4 are stored.

**Response 200**

```json
[
  {
    "id": "pat_…",
    "name": "ci",
    "prefix": "agp_X1Y2",
    "last4": "ab12",
    "permissions": { "cards": "write", "prompts": "read" },
    "expiresAt": null,
    "lastUsedAt": "2026-05-09T11:42:00Z",
    "isActive": true,
    "createdAt": "2026-05-08T10:00:00Z"
  }
]
```

### `POST /settings/personal-access-tokens`

Auth: `JWT`. Mint a new PAT. The full secret is in the response — store it now.

**Body**

```json
{
  "name": "ci",
  "permissions": { "cards": "write", "prompts": "read" },
  "expiresAt": null
}
```

`permissions` is a flat map keyed by section (`organizations`, `teams`, `agents`, `boardFlow`, `cards`, `comments`, `files`, `prompts`, `mcpServers`, `permissions`, `settings`, `presets`, `analytics`, `archive`, `admin`) with values `read` or `write`. Sections you omit default to no access. Pass `null` for `expiresAt` to make the token never expire.

**Response 200**

```json
{
  "id": "pat_…",
  "name": "ci",
  "token": "agp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "prefix": "agp_X1Y2",
  "permissions": { "cards": "write", "prompts": "read" },
  "expiresAt": null,
  "createdAt": "2026-05-09T11:42:00Z"
}
```

### `PATCH /settings/personal-access-tokens/{id}`

Auth: `JWT`. Rename or toggle a PAT.

**Body**

```json
{ "name": "renamed", "isActive": true }
```

Either field may be omitted. Disabling and re-enabling is reversible; the token's hash stays the same.

### `POST /settings/personal-access-tokens/{id}/disable`

Auth: `JWT`. Convenience action to flip `isActive` to `false`.

**Response 200** — `{ "ok": true }`.

### `DELETE /settings/personal-access-tokens/{id}`

Auth: `JWT`. **Hard delete.** The row is removed and the hash is gone — there is no recovery. Use `disable` instead if you might want to re-enable.

**Response 200** — `{ "ok": true }`.
