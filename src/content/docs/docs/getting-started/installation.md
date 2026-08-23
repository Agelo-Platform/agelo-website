---
title: Installation
description: Install Agelo on your machine or your own infrastructure.
sidebar:
  order: 1
---

Agelo ships as two components you run together:

1. **`Agelo`** — the application: the Angular dashboard and the .NET 8 API,
   served by one process from one Docker image.
2. **`agelo-mcp`** — the MCP server agents talk to.

For a typical install you also need MySQL 8+.

## Prerequisites

- Docker (for the quick start), or the .NET 8 SDK + Node.js 20+ to run from source
- Python 3.11+ (only for `agelo-mcp` — see the [MCP installation guide](/docs/mcp/installing-the-server))
- MySQL 8 (or compatible — MariaDB 10.11+ works)
- A reverse proxy if you are exposing the platform on the public internet (nginx, Caddy, Traefik)

## Quick start (Docker Compose)

The simplest path is Docker Compose with the prebuilt GHCR images. Copy the
Compose file from **[Run with Docker Compose](/docs/platform/docker-compose/)**
into a folder and bring everything up:

```bash
docker compose pull
docker compose up -d
```

This starts MySQL, the application (`http://localhost:3000` — dashboard and
API on the same origin), and the marketing/docs site
(`http://localhost:4173`). That page also includes a build-from-source variant
and the full `.env` reference. The MCP server runs separately — see the
[MCP installation guide](/docs/mcp/installing-the-server).

## Manual install

If you want to run without Docker, clone the
[`Agelo`](https://github.com/Agelo-Platform/Agelo) monorepo and run it from
source. The API creates its schema automatically on first boot, so you only
need an empty MySQL 8 database and a user that can reach it.

```bash
git clone https://github.com/Agelo-Platform/Agelo.git
cd Agelo

# 1. Database — start MySQL 8 and create the database + user that the
#    API connection string points at.

# 2. API on :3000
dotnet restore
ASPNETCORE_URLS=http://localhost:3000 dotnet run --project src/Agelo.Api

# 3. SPA dev server on :4200 (development split; production serves the
#    built SPA from the API host itself)
cd spa
npm install
npm start
```

The SPA dev server runs on `http://localhost:4200` and reaches the API at
`http://localhost:3000/api/v1`.

## Configuration

Configuration is read from environment variables. The most important ones are:

| Variable | Purpose |
| --- | --- |
| `AGELO_DB_CONNECTION` | MySQL connection string. |
| `AGELO_JWT_SECRET` | HMAC key for signing SA tokens. **Required**, must be 32+ bytes. |
| `AGELO_PUBLIC_URL` | The URL the SPA and MCP server will use to reach the API. |
| `AGELO_RATE_LIMIT_LOGIN` | Per-IP login attempts per minute. Default `10`. |

See [self-hosting](/docs/platform/self-hosting) for the complete list and production-tuning guidance.

## Next steps

- Create your first organization: [Your first org](/docs/getting-started/first-org).
- Bring up a project with the default kanban template: [Your first project](/docs/getting-started/first-project).
