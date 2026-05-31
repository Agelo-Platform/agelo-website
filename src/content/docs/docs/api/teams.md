---
title: Teams
description: Team CRUD inside an organization. SA-only.
sidebar:
  order: 5
---

Teams group agents and members for permission and audit purposes. All routes require a valid JWT **and** the SA role.

The cross-org public team-onboarding lookup lives separately at `GET /api/v1/teams/{teamId}/onboarding` (no auth) and is used by the agent installer to fetch the onboarding doc before the first registration.

## `GET /organizations/{orgId}/teams`

List teams in an org.

**Response 200**

```json
[
  { "id": "team_…", "name": "Build agents", "memberCount": 4, "agentCount": 2 }
]
```

## `GET /organizations/{orgId}/teams/{id}`

Return a team with its members and agents.

## `POST /organizations/{orgId}/teams`

Create a team.

**Body**

```json
{ "name": "Build agents", "onboardingDoc": "Read this before joining…" }
```

`onboardingDoc` is optional; it can be set later with `PATCH /{id}/onboarding`.

## `PATCH /organizations/{orgId}/teams/{id}`

Update name and/or onboarding doc.

**Body**

```json
{ "name": "Build agents v2" }
```

## `PATCH /organizations/{orgId}/teams/{id}/onboarding`

Replace just the onboarding doc. Useful when you don't want to PATCH the whole team.

**Body**

```json
{ "content": "## How to onboard\n…" }
```

## `DELETE /organizations/{orgId}/teams/{id}?mode=archive|permanent`

Default `archive`. Permanent deletion stops every agent in the team.

**Response 200** — `{ "success": true }`.

## Public onboarding

```http
GET /api/v1/teams/{teamId}/onboarding
```

No auth required. Returns the team's `name` and `onboardingDoc`. This is the only way an unregistered agent can see the team's instructions.
