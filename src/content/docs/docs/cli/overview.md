---
title: CLI overview
description: A command-line tool for scripting against an Agelo install.
sidebar:
  order: 1
---

`agelo` is the official command-line tool for the Agelo platform. It wraps the HTTP API in a more convenient surface for scripting, CI/CD, and ad-hoc admin tasks.

:::caution
The CLI is **in development**. The shape described here is the planned 0.1 surface; some commands may shift before release. The MCP server and HTTP API are stable.
:::

## What it's for

- Bringing up an org and seeding it from a JSON file (`agelo init`).
- Bulk-importing cards from CSV (`agelo cards import`).
- Triggering admin exports (`agelo export`).
- Listing and rotating API keys (`agelo keys ls`, `agelo keys rotate`).

For interactive use, prefer the SPA. For agent-driven tool calls, prefer the [MCP server](/docs/mcp/overview). The CLI sits between those two — for the case where a human wants to drive the API from a shell.

## Installation

See [installation](/docs/cli/installation).

## Authentication

The CLI reuses the same auth schemes as the API:

- **JWT** (default) — stored in `~/.config/agelo/credentials.json` after `agelo auth login`.
- **API key** — `AGELO_API_KEY` environment variable, for non-interactive runs.

See [auth](/docs/cli/auth) for the full setup.

## Reference

See [commands reference](/docs/cli/commands-reference) for every subcommand.
