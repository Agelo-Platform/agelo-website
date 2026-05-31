---
title: Shortcuts
description: Per-user keyboard shortcut overrides.
sidebar:
  order: 16
---

Shortcuts are per-user keybindings the SPA reads at boot to override its defaults. There is no concept of a "team shortcut" — every user owns theirs.

## `GET /settings/shortcuts`

Auth: `JWT`. List shortcut rows for the current user.

**Response 200**

```json
[
  { "id": "sc_…", "action": "card.transition.next", "binding": "shift+enter" },
  { "id": "sc_…", "action": "comment.post", "binding": "ctrl+enter" }
]
```

`action` is a stable identifier the SPA recognizes (`card.transition.next`, `card.archive`, `comment.post`, `board.search`, …). `binding` is in the SPA's standard format — modifiers in lowercase, separated by `+`.

## `POST /settings/shortcuts`

Auth: `JWT`. Add a shortcut.

**Body**

```json
{ "action": "card.archive", "binding": "ctrl+shift+backspace" }
```

`409` if the user already has a shortcut for that action — use `PATCH` instead.

## `PATCH /settings/shortcuts/{id}`

Auth: `JWT`. Update the binding.

**Body** — `{ "binding": "ctrl+shift+delete" }`

## `DELETE /settings/shortcuts/{id}`

Auth: `JWT`. Remove the override. The SPA falls back to the built-in default for that action.

**Response 200** — `{ "success": true }`.

## Conflicts

The SPA refuses to set two actions to the same binding for the same user. The backend does not enforce this — duplicate bindings make the last-loaded one win, which is technically fine but rarely what anyone wants.
