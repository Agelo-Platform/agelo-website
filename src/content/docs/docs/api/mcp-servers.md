---
title: MCP servers
description: Register and manage MCP server connections an agent may call out to.
sidebar:
  order: 12
---

MCP servers in this context are **outbound** connections — third-party MCP servers that an Agelo agent may want to call. The Agelo platform itself has its own [bundled MCP server](/docs/mcp/overview); these endpoints are about everything else.

## `GET /mcp-servers`

Auth: `JWT`. List the MCP servers registered in the current org.

**Response 200**

```json
[
  {
    "id": "mcp_filesystem",
    "name": "filesystem",
    "transport": "stdio",
    "command": "npx @modelcontextprotocol/server-filesystem /workspaces",
    "enabled": true
  }
]
```

## `GET /mcp-servers/{id}`

Auth: `JWT`. Return one MCP server with its full config.

## `POST /mcp-servers`

Auth: `JWT`. SA-only. Register a server.

**Body** (stdio transport)

```json
{
  "name": "filesystem",
  "transport": "stdio",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-filesystem", "/workspaces"],
  "env": { "DEBUG": "1" }
}
```

**Body** (HTTP transport)

```json
{
  "name": "remote-tools",
  "transport": "http",
  "url": "https://tools.example.com/mcp",
  "auth": {
    "kind": "bearer",
    "token": "..."
  }
}
```

The `auth.token` is encrypted at rest with a key derived from `AGELO_JWT_SECRET`.

## `PATCH /mcp-servers/{id}`

Auth: `JWT`. SA-only. Update name, command/url, env, or `enabled`.

## `DELETE /mcp-servers/{id}`

Auth: `JWT`. SA-only. Remove the server. Agents that had it in their tool set will see it disappear on the next refresh.

## How agents discover servers

The bundled Agelo MCP server exposes a `list_mcp_servers` tool. Agents call it on startup to see which servers the SA has registered, then route tool calls accordingly. See [tools reference](/docs/mcp/tools-reference).
