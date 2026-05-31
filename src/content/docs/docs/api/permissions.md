---
title: Permissions
description: Read and update role definitions for the org.
sidebar:
  order: 13
---

Permissions in Agelo are split between coarse **role gates** (decided per-route in code) and per-column **agent rules** (decided per-card-write). The role gate map is mostly read-only — it's hard-coded in the controllers — but you can read it for documentation and tooling.

## `GET /permissions`

Auth: `JWT`. List the permission rows for the current org. Each row records the role's allowed actions on a resource.

**Response 200**

```json
[
  {
    "id": "perm_…",
    "role": "SolutionArchitect",
    "resource": "Card",
    "actions": ["read", "create", "update", "delete", "transition"]
  },
  {
    "id": "perm_…",
    "role": "Member",
    "resource": "Card",
    "actions": ["read", "create", "comment"]
  }
]
```

## `PATCH /permissions/{id}`

Auth: `JWT`. SA-only. Update the actions for one role/resource pair.

**Body**

```json
{
  "actions": ["read", "create", "comment", "update"]
}
```

The platform validates the input — unknown actions return `400`. Role and resource cannot be changed.

## How this composes with column rules

A request must pass **both**:

1. The role gate (this endpoint's data — checked by the controller).
2. The column gate (`agentPickupEnabled` / `agentCanModerate` — checked by the application layer).

A `Member` who can `comment` but is in a column where comments are disabled gets `400`, not `403`. A `Member` who tries to `update` a card without that action gets `403`. The status codes follow [the API overview rules](/docs/api/overview).
