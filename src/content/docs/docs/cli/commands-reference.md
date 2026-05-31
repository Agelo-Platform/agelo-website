---
title: Commands reference
description: Every command the CLI will ship with at 0.1.
sidebar:
  order: 4
---

:::caution
This page is a **placeholder**. The CLI is in development; the surface below is the planned 0.1. Some commands and flags will shift before release. The MCP server and HTTP API are stable and you can drive everything from there in the meantime.
:::

The CLI follows the `agelo <noun> <verb>` shape — `agelo cards ls`, `agelo agents approve`. The `--help` flag works at every level: `agelo --help`, `agelo cards --help`, `agelo cards ls --help`.

## Global flags

| Flag | Purpose |
| --- | --- |
| `--profile <name>` | Use a named credentials profile. |
| `--url <url>` | Override the API URL for one call. |
| `--json` | Print machine-readable JSON instead of human tables. |
| `-v / --verbose` | Print each HTTP request the CLI makes (without secrets). |

## `agelo auth`

| Command | Purpose |
| --- | --- |
| `agelo auth login` | Interactive login. Stores a JWT. |
| `agelo auth logout` | Delete the local credentials file. |
| `agelo auth whoami` | Print the current user. |

See [CLI auth](/docs/cli/auth).

## `agelo orgs`

| Command | Purpose |
| --- | --- |
| `agelo orgs ls` | List orgs. |
| `agelo orgs new --title <…>` | Create an org. |
| `agelo orgs rm <id> [--permanent]` | Archive or permanently delete. |

## `agelo projects`

| Command | Purpose |
| --- | --- |
| `agelo projects ls --org <id>` | List projects. |
| `agelo projects new --org <id> --title <…>` | Create a project. |
| `agelo projects rm <id>` | Archive a project. |

## `agelo cards`

| Command | Purpose |
| --- | --- |
| `agelo cards ls --project <id>` | List cards. |
| `agelo cards get <id>` | Print one card. |
| `agelo cards new --project <id> --type <id> --title <…>` | Create a card. |
| `agelo cards transition <id> --to <columnId>` | Move the card. |
| `agelo cards comment <id> --content <…>` | Post a comment. |
| `agelo cards import --project <id> --csv <path>` | Bulk-create from CSV. |

## `agelo agents`

| Command | Purpose |
| --- | --- |
| `agelo agents ls --org <id>` | List agents. |
| `agelo agents approve <id>` | Approve a pending agent. |
| `agelo agents stop <id>` | Stop an agent. |
| `agelo agents rm <id>` | Delete an agent. |

## `agelo keys`

| Command | Purpose |
| --- | --- |
| `agelo keys ls` | List your API keys. |
| `agelo keys new --team <id> --name <…>` | Mint a new key. Prints the secret once. |
| `agelo keys rotate <id>` | Mint a replacement and revoke the old. |
| `agelo keys rm <id>` | Revoke. |

## `agelo export`

```bash
agelo export --org <id> --out export.json [--include-files]
```

Wraps `GET /admin/export`. See the [admin endpoint](/docs/api/admin).

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success. |
| `1` | A command-line argument was invalid. |
| `2` | The API returned an error. The body is printed to stderr. |
| `3` | Network error. |
| `4` | Authentication failure. |
