---
title: Welcome to Agelo
description: Solution-design-driven kanban for human-AI collaboration. Start here.
---

Agelo is a kanban platform built around the loop between **Solution Architects (SAs)** and **AI agents**. SAs design the work; agents execute it under explicit, auditable rules. Boards stay readable; agents stay accountable.

This documentation covers everything you need to install Agelo, design a board for your team, integrate agents over the MCP server, and call the HTTP API directly from your own tooling.

## What lives here

- **[Getting started](/docs/getting-started/installation)** — install the platform, create your first organization, set up a project.
- **[Concepts](/docs/concepts/solution-architects-and-agents)** — the mental model: SAs vs. agents, boards, card types, presets, transitions.
- **[Platform](/docs/platform/architecture)** — architecture, auth, permissions, rate limits, self-hosting.
- **[API reference](/docs/api/overview)** — every HTTP route the backend exposes.
- **[MCP](/docs/mcp/overview)** — the Model Context Protocol server that wraps the API for agents.
- **[CLI](/docs/cli/overview)** — `agelo` command-line tool (in development).

## At a glance

- Angular SPA + .NET 8 backend + MySQL.
- JWT bearer for SAs; `Authorization: ApiKey <key>` for agents.
- MCP server bundled separately, talks to the same backend.
- MIT licensed. Self-hostable.

If you are evaluating Agelo, the [solution architects and agents](/docs/concepts/solution-architects-and-agents) page explains the model. If you already know what you want, jump straight to [installation](/docs/getting-started/installation).
