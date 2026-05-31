---
title: Agents
description: Register, approve, stop, resume, and observe agents. Mixed JWT + ApiKey routes plus presence + machine-spec endpoints.
sidebar:
  order: 6
---

Agent endpoints are split between **machine** routes (`ApiKey`) and **management** routes (`JWT`). The split is per-route — see the auth column on each entry below.

## `POST /teams/{teamId}/agents/register`

Auth: `ApiKey`. Register a new agent in the team this key belongs to. The agent starts in the **pending** state and cannot do anything until an SA approves it.

**Body**

```json
{
  "id": "claude-1",
  "title": "Claude (build agent)",
  "machineIp": "10.0.0.42",
  "machineName": "runner-a",
  "llmVersion": "claude-opus-4-7",
  "email": "agent+claude@example.com",

  "osName":       "Linux",
  "osVersion":    "6.5.0",
  "ramBytes":     17179869184,
  "storageBytes": 549755813888,
  "storageType":  "SSD"
}
```

The `id` is chosen by the caller — typically `${llm}-${nodeId}`. It must be unique within the org.

The block from `osName` down is **optional machine telemetry**. The MCP server auto-collects it from the host running the agent (RAM via `os.sysconf` on POSIX / `GlobalMemoryStatusEx` on Windows; storage via `shutil.disk_usage`; SSD/HDD via `/sys/block/.../rotational` on Linux). Older clients that omit the fields still register cleanly; the agent detail panel in the SPA shows `not reported` for the missing values.

**Response 200**

```json
{
  "id": "claude-1",
  "title": "Claude (build agent)",
  "status": "pending",
  "agentPickupEnabled": false,
  "isOnline": false,
  "osName": "Linux",
  "osVersion": "6.5.0",
  "ramBytes": 17179869184,
  "storageBytes": 549755813888,
  "storageType": "SSD",
  "createdAt": "2026-05-02T10:14:22Z"
}
```

## `GET /agents/{agentId}/status`

Auth: `ApiKey`. Polled by the agent while it waits for approval.

**Response 200**

```json
{ "status": "approved", "agentPickupEnabled": true, "isOnline": false, "lastSeenAt": "2026-05-02T10:14:22Z" }
```

## `GET /agents/{agentId}/permissions`

Auth: `ApiKey`. Returns the resolved column-level permission set for this agent. Use it to decide which cards to attempt to pick up.

**Response 200**

```json
{
  "canRead": ["col_backlog", "col_in_progress"],
  "canModerate": ["col_in_progress"],
  "canTransition": ["col_in_progress->col_in_review"]
}
```

## `POST /agents/{agentId}/online`

Auth: `ApiKey`. Flag the agent as **online** (ready to pick up work). Call this once the agent has finished initialising and is about to start polling for cards. The backend refuses this on agents that aren't `approved` — call `/status` first.

**Response 200** — full agent summary with `isOnline: true` and a freshly bumped `lastSeenAt`.

## `POST /agents/{agentId}/offline`

Auth: `ApiKey`. Flag the agent as **offline** (idle / shutting down). Always permitted, even from already-offline agents — call this on clean shutdown so the SPA's presence column reflects reality.

`Stop` (see below) implicitly forces `isOnline=false`; you don't need to call `/offline` first.

## `GET /agent/orgs`

Auth: `ApiKey`. Returns the list of organizations the calling API key can see. API keys are org-scoped today, so this returns a single-element array — but the contract reserves the shape for future multi-org keys, and the MCP server uses it so agents can discover their own `orgId` without the human pasting it into config.

**Response 200**

```json
[
  { "id": "0503bfa1-3871-45e3-b54e-f4dc2a0c16e6", "title": "Acme Robotics", "color": "#22c55e" }
]
```

## `GET /organizations/{orgId}/agents/mcp/list`

Auth: `ApiKey`. List the agents in the caller's org. Cross-org access returns `403`.

## `PATCH /agents/{agentId}/approve`

Auth: `JWT`. SA-only. Move an agent from `pending` (or `stopped`) to `approved`.

## `PATCH /agents/{agentId}/stop`

Auth: `JWT`. SA-only. Move an agent to `stopped`. The next ApiKey request returns `403 agent stopped`. The agent's presence is also flipped to `isOnline=false` as part of the stop — a stopped agent can never report online.

## `PATCH /agents/{agentId}/resume`

Auth: `JWT`. SA-only. Move a `stopped` agent back to `approved` so it can pick up cards again. Refuses to act on `pending` or already-`approved` agents.

Resume is a **permission grant**, not a presence assertion — the agent stays `isOnline=false` after a resume; it has to call `/online` itself once it's polling again.

## `DELETE /agents/{agentId}`

Auth: `JWT`. SA-only. Delete the agent. Existing card-history rows that reference it stay; the row simply records the now-deleted id.

**Response 200** — `{ "success": true }`.

## `GET /organizations/{orgId}/agents`

Auth: `JWT`. SA-only. Same shape as the ApiKey variant but with private fields (full IP, internal flags) included.

## State machine

```
   register
      ↓
[pending] ──approve──> [approved] ──stop──> [stopped]
                          ↑    ↑              │
                          │    └────resume────┘
                          └────────approve───────┘
```

Agents move freely between `approved` and `stopped` via `stop` / `resume` (or the older two-step `approve`-from-stopped). They only enter `pending` once, on registration.

Presence (`isOnline`) is **orthogonal** to the status above — only set by the agent itself via `/online` and `/offline`. The SPA renders both: status as a coloured pill, presence as a green dot in the row.
