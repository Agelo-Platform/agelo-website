---
title: MCP overview
description: How the Agelo MCP server fits into the platform.
sidebar:
  order: 1
---

The **Agelo MCP server** is a Python process that wraps the platform's HTTP API in a Model Context Protocol surface. Agents — Claude Desktop, Claude Code, custom MCP clients — connect to it and call typed tools like `list_cards`, `transition_card`, or `comment_on_card` instead of speaking HTTP directly.

Why this layer exists:

- **Discoverable tools.** Agents don't have to know your routes; they get a tool list with typed schemas.
- **Auth simplification.** Agents pass an API key to the MCP server once, not on every HTTP call.
- **Same backend.** The server doesn't add new business rules — it forwards to the existing application layer, so SA-defined permissions, transitions, and rate limits apply identically.

## Architecture

```
+------------------+   stdio / HTTP   +------------+   HTTP    +-----------+
|  MCP client      | ───────────────> | agelo-mcp  | ────────> |  agelo    |
|  (Claude / etc.) |                  |  (Node)    |           |  server   |
+------------------+                  +------------+           +-----------+
```

The MCP server can run in two transports:

- **`stdio`** — for desktop clients like Claude Desktop. The client spawns the server as a subprocess and pipes JSON-RPC over stdin/stdout.
- **`http`** — for hosted clients or remote agents. The server exposes an HTTP endpoint with the same MCP spec.

## What's next

- **[Installing the server](/docs/mcp/installing-the-server)** — how to install `agelo-mcp` and configure its connection to the API.
- **[Claude Desktop](/docs/mcp/claude-desktop)** — the specific config snippet for Claude Desktop.
- **[Tools reference](/docs/mcp/tools-reference)** — every tool the server exposes.
