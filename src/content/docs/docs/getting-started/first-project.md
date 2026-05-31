---
title: Your first project
description: Create a project, drop in the default kanban template, and add a card.
sidebar:
  order: 3
---

A **project** in Agelo is a board scoped to a single workstream — typically a product, a service line, or a client. Projects own their columns, card types, and presets, so different teams can run different processes inside the same org.

## Create the project

Inside your org, open **Projects** and click **New project**. Pick the **Default Kanban** template if you want a sensible starting board (Backlog → Todo → In Progress → Review → Done). Pick **Blank** if you want to start from zero.

```http
POST /api/v1/organizations/{orgId}/projects
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "title": "Onboarding flow",
  "color": "#14B8A6",
  "template": "default_kanban"
}
```

The default template seeds:

- **Five columns** with sensible status transitions: Backlog, Todo, In Progress, Review, Done.
- A `Task` card type with eight custom fields: `github_pr_link`, `attachments`, `required_mcp`, `description`, `acceptance_criteria`, `tags`, `prompts`, `time_budget`.
- Bidirectional transitions between the workflow columns (Todo ⇄ In Progress, In Progress ⇄ Review, Review ⇄ Done).
- A `Coder` team at the org level with a canonical onboarding doc (only on the **first** default-kanban provisioning per org; subsequent projects don't duplicate it).

## Add your first card

Cards are created against a column. From the SPA, click the `+` icon at the top of the **Backlog** column and pick the `Task` card type. From the API:

```http
POST /api/v1/organizations/{orgId}/cards
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "projectId": "proj_…",
  "columnId": "col_backlog",
  "cardTypeId": "ctype_task",
  "title": "Wire up email verification"
}
```

The response includes the card id; use it to PATCH fields, transition status, or post comments.

## Hand it to an agent

If you have an agent registered and approved, set its id on the card's `assignedAgentId` field. Once `agentPickupEnabled` is `true` for the column, the agent's polling loop will see the card and start working.

Read on for the model: [Solution Architects and agents](/docs/concepts/solution-architects-and-agents).
