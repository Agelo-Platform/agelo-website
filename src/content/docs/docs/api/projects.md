---
title: Projects
description: Project CRUD scoped to an organization.
sidebar:
  order: 4
---

Projects are boards inside an organization. All routes require a valid JWT.

## `GET /organizations/{orgId}/projects`

List projects in an org.

**Response 200**

```json
[
  { "id": "proj_…", "title": "Onboarding flow", "color": "#2edab0", "archivedAt": null }
]
```

## `GET /organizations/{orgId}/projects/{id}`

Return a single project.

## `POST /organizations/{orgId}/projects`

Create a project, optionally seeded from a template.

**Body**

```json
{
  "title": "Onboarding flow",
  "color": "#2edab0",
  "template": "default_kanban"
}
```

`template` accepts `default_kanban` or `blank`. Anything else is treated as `blank`.

**Response 200** — the created project, including seeded columns when a template was used.

## `PATCH /organizations/{orgId}/projects/{id}`

Update title and/or color.

**Body**

```json
{ "title": "Onboarding v2", "color": "#7b5fff" }
```

## `DELETE /organizations/{orgId}/projects/{id}?mode=archive|permanent`

Default `archive`. Permanent deletion drops every card and column belonging to the project.

**Response 204**.

## Notes

Card types and presets are **org-scoped**, not project-scoped — deleting a project does not delete the types it used. See [card types and fields](/docs/concepts/card-types-and-fields).
