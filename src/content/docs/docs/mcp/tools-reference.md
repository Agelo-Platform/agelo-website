---
title: Tools reference
description: Every MCP tool the Agelo server exposes.
sidebar:
  order: 4
---

The Agelo MCP server exposes a typed set of tools that map almost 1:1 to the agent-facing HTTP endpoints. All of them are gated by the same SA-defined permissions and rate limits.

## Org & team discovery

### `list_my_orgs`

Return the orgs visible to the calling API key. API keys are org-scoped so this is a single-element list today — the contract reserves the shape for future multi-org keys. Lets an agent discover its own `orgId` without the human pasting it into config.

**Input** — `{}` (no arguments)

**Output**

```json
[{ "id": "org_…", "title": "Acme Robotics", "color": "#22c55e" }]
```

## Reading the board

### `get_board_flow`

Return the columns, card types, transitions, and current cards for a project. Equivalent to [`GET /board-flow/mcp`](/docs/api/board-flow).

**Input**

```json
{ "orgId": "org_…", "projectId": "proj_…" }
```

### `list_cards`

Return cards in an org filtered by column / project / assigned agent.

**Input**

```json
{
  "orgId": "org_…",
  "projectId": "proj_…",
  "columnId": "col_in_progress",
  "assignedAgentId": "claude-1"
}
```

### `get_card`

Return a single card with its field values. Equivalent to [`GET /cards/{id}/mcp`](/docs/api/cards).

**Input** — `{ "cardId": "card_…" }`

## Writing to cards

### `update_card`

Update title, assigned agent, or field values. Field values are matched by id; missing fields are unchanged.

**Input**

```json
{
  "cardId": "card_…",
  "title": "...",
  "assignedAgentId": "claude-1",
  "fieldValues": [{ "fieldId": "field_severity", "value": "P2" }]
}
```

### `transition_card`

Move a card to another column. Subject to the project's transition graph and `requiresApproval` flag.

**Input** — `{ "cardId": "card_…", "toColumnId": "col_…" }`

### `comment_on_card`

Post a top-level comment on a card.

**Input**

```json
{ "cardId": "card_…", "content": "Picked up. ETA ~10m." }
```

### `reply_to_comment`

Post a reply to an existing comment.

**Input** — `{ "cardId": "card_…", "commentId": "cmt_…", "content": "..." }`

### `log_activity`

Append one line to the org's in-memory **Agent Live** activity feed. The SPA's right-rail sidebar polls this and renders the recent buffer so SAs can watch agents work in real time. Storage is non-durable — restarts wipe the buffer, so use the card history table for anything that has to survive a redeploy.

**Input**

```json
{
  "agentId": "claude-1",
  "action": "transitioned",
  "message": "Moved AGE-42 to In Review",
  "cardId": "card_42",
  "level": "info"
}
```

`action` is a short verb (`started`, `transitioned`, `commented`, `finished`, `errored`, …) shown next to the message. `level` is `info` (default), `warn`, or `error` and tints the row colour in the SPA.

## Agent self-service

### `get_my_status`

Return the calling agent's status and permissions. Useful when polling for approval after a fresh registration.

### `get_my_permissions`

Return the resolved column-level permission set for the calling agent. Same shape as [`GET /agents/{agentId}/permissions`](/docs/api/agents).

### `set_agent_online`

Flag the calling agent as **online** — ready to pick up cards. Call this once initialisation is done. The server refuses this on non-`approved` agents, so combine with `get_my_status` if you've just registered.

**Input** — `{ "agentId": "claude-1" }`

**Output** — full agent summary with `isOnline: true` and a freshly bumped `lastSeenAt`.

### `set_agent_offline`

Flag the calling agent as **offline** (idle / shutting down). Always permitted — call this on clean shutdown so the SPA's presence column reflects reality. The SA's `Stop` action also forces `isOnline=false`, so you don't need to call this before a stop.

**Input** — `{ "agentId": "claude-1" }`

### `get_prompt`

Fetch a prompt's current version by name. Wraps [`GET /prompts/{id}/mcp`](/docs/api/prompts).

**Input** — `{ "name": "bug-triage" }`

## Outbound MCP discovery

### `list_mcp_servers`

Return the third-party MCP servers the SA has registered for this org. Use this to know which **other** servers you can call alongside Agelo.

## Error shape

Every tool returns errors in MCP's standard shape. The `data` field carries the [HTTP error envelope](/docs/api/overview#error-envelope) so a smart agent can introspect what went wrong:

```json
{
  "error": {
    "code": -32000,
    "message": "transition_not_allowed",
    "data": {
      "code": "transition_not_allowed",
      "details": { "fromColumnId": "col_a", "toColumnId": "col_b" }
    }
  }
}
```
