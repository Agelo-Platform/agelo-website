---
title: Projects
description: The unit of board scope inside an organization.
sidebar:
  order: 5
---

A **project** in Agelo is a single board scoped to one workstream. It owns its columns, card types, presets, status transitions, and cards. Projects belong to an organization; one org can have many.

## Lifecycle

Projects move through three states:

1. **Active** — appears in the SPA's project switcher; cards can be created and moved.
2. **Archived** — soft-deleted. Hidden from the default view but everything can be restored. Reachable from `/api/v1/archive`.
3. **Permanently deleted** — removed from MySQL. Only available when the SA explicitly chooses `?mode=permanent` on the delete call.

This mirrors the same `archive` / `permanent` semantics used for organizations and cards. See the [archive](/docs/api/archive) page for restoration rules.

## What lives on a project

| Resource | Scope |
| --- | --- |
| Columns | Per project. |
| Status transitions | Per project, between its columns. |
| Cards | Per project. |
| Card types | **Per organization** — shared across projects. |
| Presets | Per organization. |

Card types are deliberately org-scoped: a single `Bug` shape across all your projects is usually what you want. If a project really needs its own type, you create a new type that's only used by that project.

## Creating a project

```http
POST /api/v1/organizations/{orgId}/projects
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "title": "Onboarding flow",
  "color": "#2edab0",
  "template": "default_kanban"
}
```

Templates are limited; today only `default_kanban` and `blank` are recognized. Anything else falls back to `blank`.

See [`/projects` in the API reference](/docs/api/projects) for update / delete shapes.
