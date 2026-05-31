---
title: Self-hosting
description: Run Agelo on your own infrastructure — production-ready guidance.
sidebar:
  order: 5
---

Agelo is designed to be self-hosted. There is no cloud SaaS to depend on; every component is a static binary or a static-site bundle.

## Sizing

A small Agelo install (one org, ~100 cards / week, a handful of agents) fits on:

- 1 vCPU / 1 GB API container
- 1 vCPU / 512 MB SPA static container (or just a CDN)
- 1 vCPU / 2 GB MySQL with 10 GB disk

Scale the API horizontally before MySQL. The application is stateless — replicas behind a round-robin LB are the path.

## Reverse proxy

Sit nginx, Caddy, or Traefik in front. Terminate TLS there, forward `/api/*` to the .NET service, and serve everything else from the SPA's `dist/` directory. Example nginx fragment:

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:5101;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $remote_addr;
  proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
  root   /var/www/agelo-spa;
  try_files $uri $uri/ /index.html;
}
```

## Environment

The most important variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `AGELO_DB_CONNECTION` | yes | MySQL connection string. |
| `AGELO_JWT_SECRET` | yes | HMAC key for SA tokens. 32+ bytes, kept in your secrets store. |
| `AGELO_PUBLIC_URL` | yes | URL the SPA and MCP server reach the API at. |
| `AGELO_RATE_LIMIT_LOGIN` | no | Per-IP login attempts per minute. Default `10`. |
| `AGELO_RATE_LIMITS` | no | Set to `disabled` only in test environments. |
| `AGELO_FILES_PATH` | no | Filesystem path for uploaded files. Default `/var/lib/agelo/files`. |
| `AGELO_LOG_LEVEL` | no | `Trace` / `Debug` / `Information` / `Warning` / `Error`. Default `Information`. |

## Backups

Two things to back up:

1. **MySQL** — daily `mysqldump` is fine for small installs. Use replication for larger ones.
2. **`AGELO_FILES_PATH`** — file uploads are not in MySQL.

## Upgrading

The API performs EF Core migrations on startup if `AGELO_DB_AUTOMIGRATE=true` is set. For production we recommend running migrations as a separate step:

```bash
dotnet ef database update --project src/Agelo.Infrastructure
```

Then restart the API. Migrations are designed to be backwards-compatible for one minor version, so a rolling restart is safe.
