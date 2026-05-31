---
title: Installing the server
description: Install agelo-mcp and configure the connection to your API.
sidebar:
  order: 2
---

The MCP server is a Python package. Wheels are published as assets on the
[GitHub Releases page](https://github.com/Agelo-Platform/agelo-mcp/releases).

## Install

Requires Python 3.11+. The repository is public, so the wheel installs straight
from its release URL:

```bash
pip install https://github.com/Agelo-Platform/agelo-mcp/releases/download/v0.0.1.0/agelo_mcp-0.0.1.0-py3-none-any.whl
```

This puts the `agelo-mcp` command on your `PATH`. To check:

```bash
agelo-mcp --version
```

## Configure

The server reads two environment variables:

| Variable | Purpose |
| --- | --- |
| `AGELO_API_URL` | Base URL of your `agelo-server` API (e.g. `https://agelo.example.com/api/v1`). |
| `AGELO_API_KEY` | The team-scoped API key the server should use. Issue one from **Settings → API keys**. |

You can also pass them on the command line: `agelo-mcp --api-url https://… --api-key ag_ak_…`.

## Verify

Run the server in stdio mode and make a single tool call to make sure auth works:

```bash
agelo-mcp --transport stdio
```

Then send the standard MCP `initialize` + `tools/list` JSON-RPC payloads on stdin. If you get a tool list back, you're set.

For HTTP mode:

```bash
agelo-mcp --transport http --port 8765
```

Then `curl http://localhost:8765/mcp/tools/list` (the path is the MCP-standard surface).

## Auto-start

Most desktop clients spawn the server themselves — see [Claude Desktop](/docs/mcp/claude-desktop) for the config file format. For a long-running HTTP deployment, run it under a process manager (systemd, pm2, Docker). It exits non-zero on auth failure; supervise accordingly.

## Updating

Install the wheel for a newer release tag over the top:

```bash
pip install --upgrade https://github.com/Agelo-Platform/agelo-mcp/releases/download/<newer-tag>/agelo_mcp-<newer-version>-py3-none-any.whl
```

The MCP tool surface is **versioned alongside the platform**: `agelo-mcp` 0.4.x talks to `agelo-server` 0.4.x. Mismatched majors will refuse to start.
