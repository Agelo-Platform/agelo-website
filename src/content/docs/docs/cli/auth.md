---
title: CLI auth
description: Log in interactively or use an API key for CI.
sidebar:
  order: 3
---

The CLI accepts the same two credential forms the rest of the platform does: **JWT** for an interactive human and **API key** for a script. Pick whichever fits your environment.

## Interactive login (JWT)

```bash
agelo auth login
```

You'll be prompted for the API URL, your email, and your password. The CLI calls `POST /auth/login`, stores the returned token in `~/.config/agelo/credentials.json`, and uses it for subsequent commands.

The file looks like:

```json
{
  "url": "https://agelo.example.com",
  "user": { "id": "user_…", "email": "you@example.com" },
  "token": "eyJhbGciOi...",
  "expiresAt": "2025-05-03T11:00:00Z"
}
```

The token is short-lived (default 12h) — re-run `agelo auth login` when it expires. There is no refresh endpoint yet.

## Personal Access Token

For CI / scripts where SSO and prompts aren't an option, the CLI also accepts a [Personal Access Token](/docs/api/settings#personal-access-tokens). Mint one in the SPA at *Settings → Personal Access Tokens* (the raw `agp_…` value is shown exactly once) and save it locally:

```bash
agelo login-pat agp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

The PAT is cached at `~/.agelo/config.json` under a `pat` field and sent as `Authorization: Bearer agp_…` from then on. Use `--pat <token>` or `AGELO_PAT=agp_…` to override per-call without persisting to disk. PATs do not expire unless you set `expiresAt` at creation; rotate one with `agelo pat disable <id>` followed by a fresh `agelo pat create`.

## Non-interactive (API key)

For agent / MCP-side automation set:

```bash
export AGELO_PUBLIC_URL=https://agelo.example.com
export AGELO_API_KEY=AGK_a4f8e7c3b1...
```

When `AGELO_API_KEY` is set, the CLI uses it as the `Authorization: ApiKey` header for every request and ignores the credentials file entirely.

This is the same key shape the MCP server uses — issue it from the SPA at **Settings → API keys** or via the [API keys endpoint](/docs/api/settings#api-keys).

## Switching contexts

Use `--profile <name>` to keep multiple sets of credentials around:

```bash
agelo --profile work auth login
agelo --profile side auth login
agelo --profile work cards ls
```

Profiles are stored as separate files at `~/.config/agelo/<profile>.json`.

## Logging out

```bash
agelo auth logout
```

This deletes the credentials file. Tokens are stateless on the server — there's no revocation; the file deletion is purely local.

## Verifying

```bash
agelo auth whoami
```

Calls `GET /auth/me` and prints the user info. If you get a `401`, your token has expired or your `AGELO_API_KEY` is wrong.
