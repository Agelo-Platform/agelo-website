---
title: Your first organization
description: Sign up as a Solution Architect and create the first organization.
sidebar:
  order: 2
---

An **organization** in Agelo is the top-level tenant boundary. Everything — projects, boards, agents, cards — lives inside one. Most installs run with a single org per company; multi-org is supported when you need hard isolation between teams (e.g. consultancy work for separate clients).

## Sign in

Open the SPA at the URL you configured (`http://localhost:4200` if you ran the quick start) and log in with the seed Solution Architect credentials your install printed. If you skipped seeding, register through `POST /api/v1/auth/login` after creating an SA row directly in the database.

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "you@example.com", "password": "..." }
```

The response carries a JWT — the SPA stores it for you. See [auth](/docs/platform/auth) for the token shape and lifetime.

## Create the org

From the org switcher in the top-left, choose **Create organization**. Pick:

- A **title** (shown in the SPA header and emails).
- A **color** (used as the accent for cards in this org's boards).

Or call the API directly:

```http
POST /api/v1/organizations
Authorization: Bearer <jwt>
Content-Type: application/json

{ "title": "Acme Inc.", "color": "#7b5fff" }
```

You will be the org's first member with the **Solution Architect** role. Other SAs can be invited from **Settings → Team**.

## What's next

- Add a project: [Your first project](/docs/getting-started/first-project).
- Read about the [SA / agent split](/docs/concepts/solution-architects-and-agents) before you start designing boards.
