---
title: Claude Desktop
description: Configure Claude Desktop to talk to your Agelo install.
sidebar:
  order: 3
---

Claude Desktop discovers MCP servers from a single JSON config file. After [installing `agelo-mcp`](/docs/mcp/installing-the-server) globally, add an entry pointing at it.

## Locate the config

The config file lives at:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

If the file doesn't exist, create it.

## Add the server

```json
{
  "mcpServers": {
    "agelo": {
      "command": "agelo-mcp",
      "args": ["--transport", "stdio"],
      "env": {
        "AGELO_PUBLIC_URL": "https://agelo.example.com",
        "AGELO_API_KEY": "AGK_a4f8e7c3b1..."
      }
    }
  }
}
```

Save and restart Claude Desktop. The Agelo tools should appear under the MCP tools menu within a few seconds.

## Multiple installs

If you connect to several Agelo orgs (one for work, one for a side project), give each one its own server entry with a distinct name:

```json
{
  "mcpServers": {
    "agelo-work": {
      "command": "agelo-mcp",
      "args": ["--transport", "stdio"],
      "env": {
        "AGELO_PUBLIC_URL": "https://agelo.work.example.com",
        "AGELO_API_KEY": "AGK_…"
      }
    },
    "agelo-side": {
      "command": "agelo-mcp",
      "args": ["--transport", "stdio"],
      "env": {
        "AGELO_PUBLIC_URL": "https://agelo.dev.example.com",
        "AGELO_API_KEY": "AGK_…"
      }
    }
  }
}
```

## Verifying

Open Claude Desktop and ask the model to list its tools. The Agelo tools should appear under the prefix you configured (`agelo:list_cards`, `agelo:comment_on_card`, etc.). If they don't, check Claude Desktop's developer log for the MCP handshake — typically auth or path issues.
