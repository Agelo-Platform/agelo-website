---
title: Architecture
description: How the pieces fit together — Angular SPA, .NET 8 backend, MySQL, MCP server.
sidebar:
  order: 1
---

Agelo is built on a small, boring stack. Each piece is replaceable; none of them are clever.

## Components

| Component | Stack | What it does |
| --- | --- | --- |
| `agelo-spa` | Angular 18 | Single-page app for SAs and team members. |
| `agelo-server` | .NET 8 + MediatR + EF Core | HTTP API. Owns business rules, persistence, auth. |
| `agelo-mcp` | Python + MCP SDK | MCP server agents speak to. Wraps the same HTTP API. |
| MySQL 8 | — | The single source of truth. |

## Request flow

A request from the SPA carries a JWT. A request from an agent carries `Authorization: ApiKey <team-key>`. Both schemes route to the same controllers:

```
+-----------+        JWT        +---------------+      SQL      +-------+
|  SPA      | ----------------> |               | ------------> |       |
+-----------+                   |  agelo-server |               | MySQL |
+-----------+      ApiKey       |   .NET 8      | <------------ |       |
| MCP / CLI | ----------------> |               |               +-------+
+-----------+                   +---------------+
```

Each controller picks an auth scheme per-route. Some routes (e.g. card reads) are JWT-only; some (e.g. agent register) are ApiKey-only; some (e.g. card updates) accept either, with `mcp` variants for agents to make the difference explicit in URLs.

## Code organisation

```
src/
  Agelo.Domain         Plain C# entities + value objects. No EF, no MediatR.
  Agelo.Application    Commands, queries, validators. Talks to interfaces.
  Agelo.Infrastructure EF Core, MySQL, JWT, ApiKey handler.
  Agelo.Api            ASP.NET Core controllers. Thin — just bind + send.
```

The Application layer is the boundary an MCP tool implementation calls into the same way an HTTP controller does. There is no special "MCP path" through the code.

## Data model

A few high-level tables drive everything:

- `organizations`, `users`, `team_memberships`
- `projects`, `columns`, `status_transitions`
- `card_types`, `custom_fields`, `presets`
- `cards`, `card_field_values`, `card_history`, `card_relationships`
- `agents`, `api_keys`, `mcp_servers`
- `comments`, `files`, `prompts`, `prompt_versions`

Soft-deletes are modelled as a nullable `deletedAt` column with a global EF query filter that excludes archived rows by default. The archive controller bypasses the filter to list and restore.

## What we don't have

No Redis, no message bus, no eventual consistency. If the data ever grows past a single MySQL instance we'll add a read replica before we add anything else.
