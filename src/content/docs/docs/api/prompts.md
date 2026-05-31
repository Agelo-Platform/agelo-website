---
title: Prompts
description: Versioned prompt library for agents to fetch by id.
sidebar:
  order: 11
---

The prompts API is a versioned library of named prompts. Agents fetch them by id at runtime instead of carrying hard-coded strings, so SAs can iterate on the prompts without redeploying agent binaries.

## `GET /prompts`

Auth: `JWT`. List prompts in the current org. Supports `?categoryId=…` to filter by category.

**Response 200**

```json
[
  {
    "id": "prompt_…",
    "name": "bug-triage",
    "categoryId": "cat_…",
    "currentVersionId": "ver_…",
    "updatedAt": "2025-05-02T11:14:22Z"
  }
]
```

## `GET /prompts/{id}`

Auth: `JWT`. Return the prompt with its full version list.

## `GET /prompts/{id}/mcp`

Auth: `ApiKey`. The agent-facing read. Returns just the **current** version's body, no metadata. This is the only call an agent ever needs to make for a prompt.

**Response 200**

```json
{
  "name": "bug-triage",
  "version": "v3",
  "body": "You are a bug triage agent. ..."
}
```

## `POST /prompts`

Auth: `JWT`. SA-only. Create a prompt with its first version.

**Body**

```json
{
  "name": "bug-triage",
  "categoryId": "cat_triage",
  "body": "You are a bug triage agent. ..."
}
```

## `PATCH /prompts/{id}`

Auth: `JWT`. SA-only. Update the prompt's metadata (name, category). Use the versions sub-route to change the body.

## `DELETE /prompts/{id}`

Auth: `JWT`. SA-only. Soft-delete the prompt. Agents fetching it after deletion get `404`.

## `POST /prompts/{id}/versions`

Auth: `JWT`. SA-only. Create a new version. The new version becomes `current` only if `?activate=1` is passed.

**Body**

```json
{
  "label": "v3",
  "body": "You are a bug triage agent. Updated rubric: ..."
}
```

## `PATCH /prompts/{id}/versions/{versionId}`

Auth: `JWT`. SA-only. Activate (or deactivate) a specific version.

**Body**

```json
{ "active": true }
```

## Categories

```http
GET    /prompt-categories
POST   /prompt-categories
DELETE /prompt-categories/{id}
```

Auth: `JWT`. Categories are simple — `id`, `name`, `color`. Use them to group prompts in the SPA.
