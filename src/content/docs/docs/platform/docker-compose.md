---
title: Run with Docker Compose
description: Self-host the full Agelo stack with Docker Compose — from prebuilt GHCR images or built from source.
sidebar:
  order: 6
---

The whole Agelo stack — API, SPA, marketing/docs site, and MySQL — runs from a
single Docker Compose file. There is no separate `local-compose` repository to
clone; just copy one of the files below into a folder and run it.

Two flavours are provided:

- **From GHCR** — pull the prebuilt images. This is the fastest path and what
  most self-hosters want.
- **From source** — build the images yourself from the three repositories.
  Use this when you're modifying Agelo or want to pin to your own fork.

:::caution[Change the defaults before exposing this publicly]
The samples ship with development defaults so they run out of the box. Before
putting Agelo on a network you don't fully control, set a strong
`JWT_SECRET`, a real `SA_PASSWORD`, and non-default MySQL passwords — see
[Security checklist](#security-checklist).
:::

## Option A — from GHCR (recommended)

Every component is published to `ghcr.io/agelo-platform/*`. Create a folder,
drop in the two files below, and start the stack.

Save this as `docker-compose.yml`:

```yaml
# Agelo — self-hosted stack from prebuilt GHCR images.
# Override the tag with IMAGE_TAG (default: latest).
services:
  agelo-db:
    image: mysql:8.0
    container_name: agelo-db
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpw}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-agelo}
      MYSQL_USER: ${MYSQL_USER:-agelo}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-agelo}
    command: ["--default-authentication-plugin=mysql_native_password"]
    volumes:
      - agelo-db-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-p${MYSQL_ROOT_PASSWORD:-rootpw}"]
      interval: 5s
      timeout: 5s
      retries: 20

  agelo-backend:
    image: ghcr.io/agelo-platform/agelo-server:${IMAGE_TAG:-latest}
    container_name: agelo-backend
    depends_on:
      agelo-db:
        condition: service_healthy
    environment:
      ConnectionStrings__Default: "Server=agelo-db;Port=3306;Database=${MYSQL_DATABASE:-agelo};User=${MYSQL_USER:-agelo};Password=${MYSQL_PASSWORD:-agelo};"
      ASPNETCORE_ENVIRONMENT: Production
      ASPNETCORE_URLS: http://+:3000
      Cors__Origins: ${CORS_ORIGINS:-http://localhost:4200,http://127.0.0.1:4200}
      # In-house JWT (HMAC HS256) used by /auth/login. CHANGE THIS.
      Jwt__Secret: ${JWT_SECRET:-change-me-32-bytes-minimum-secret}
      Jwt__Issuer: ${JWT_ISSUER:-agelo}
      Jwt__Audience: ${JWT_AUDIENCE:-agelo-spa}
      Jwt__Lifetime: ${JWT_LIFETIME:-12:00:00}
      # Bootstrap Solution Architect, created on first boot only.
      Sa__BootstrapEmail: ${SA_EMAIL:-architect@agelo.local}
      Sa__BootstrapPassword: ${SA_PASSWORD:-Architect#1}
    ports:
      - "3000:3000"

  agelo-frontend:
    image: ghcr.io/agelo-platform/agelo-angular:${IMAGE_TAG:-latest}
    container_name: agelo-frontend
    depends_on:
      - agelo-backend
    environment:
      API_BASE_URL: ${API_BASE_URL:-http://localhost:3000/api/v1}
    ports:
      - "4200:80"

  agelo-website:
    image: ghcr.io/agelo-platform/agelo-website:${IMAGE_TAG:-latest}
    container_name: agelo-website
    ports:
      - "4173:80"

volumes:
  agelo-db-data:
```

Pull and start:

```bash
# Public images pull anonymously. If any agelo-platform package is still
# private, log in once first:
#   echo $GH_TOKEN | docker login ghcr.io -u <your-github-user> --password-stdin
docker compose pull
docker compose up -d
```

To pin a specific build instead of `latest`:

```bash
IMAGE_TAG=0.0.1.0 docker compose up -d
```

## Option B — from source

Clone the three repositories as siblings, then add the compose file next to
them. The build contexts are relative paths, so the layout matters:

```text
agelo/
├── agelo-server/        # git clone https://github.com/Agelo-Platform/agelo-server
├── agelo-angular/       # git clone https://github.com/Agelo-Platform/agelo-angular
├── agelo-website/       # git clone https://github.com/Agelo-Platform/agelo-website
└── docker-compose.yml   # the file below
```

Save this as `docker-compose.yml` in the parent `agelo/` folder:

```yaml
# Agelo — self-hosted stack built from source.
# Run with: docker compose up -d --build
services:
  agelo-db:
    image: mysql:8.0
    container_name: agelo-db
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpw}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-agelo}
      MYSQL_USER: ${MYSQL_USER:-agelo}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-agelo}
    command: ["--default-authentication-plugin=mysql_native_password"]
    volumes:
      - agelo-db-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-p${MYSQL_ROOT_PASSWORD:-rootpw}"]
      interval: 5s
      timeout: 5s
      retries: 20

  agelo-backend:
    build:
      context: ./agelo-server
      dockerfile: Dockerfile
    container_name: agelo-backend
    depends_on:
      agelo-db:
        condition: service_healthy
    environment:
      ConnectionStrings__Default: "Server=agelo-db;Port=3306;Database=${MYSQL_DATABASE:-agelo};User=${MYSQL_USER:-agelo};Password=${MYSQL_PASSWORD:-agelo};"
      ASPNETCORE_ENVIRONMENT: Production
      ASPNETCORE_URLS: http://+:3000
      Cors__Origins: ${CORS_ORIGINS:-http://localhost:4200,http://127.0.0.1:4200}
      Jwt__Secret: ${JWT_SECRET:-change-me-32-bytes-minimum-secret}
      Jwt__Issuer: ${JWT_ISSUER:-agelo}
      Jwt__Audience: ${JWT_AUDIENCE:-agelo-spa}
      Jwt__Lifetime: ${JWT_LIFETIME:-12:00:00}
      Sa__BootstrapEmail: ${SA_EMAIL:-architect@agelo.local}
      Sa__BootstrapPassword: ${SA_PASSWORD:-Architect#1}
    ports:
      - "3000:3000"

  agelo-frontend:
    build:
      context: ./agelo-angular
      dockerfile: Dockerfile
      args:
        API_BASE_URL: ${API_BASE_URL:-http://localhost:3000/api/v1}
    container_name: agelo-frontend
    depends_on:
      - agelo-backend
    environment:
      API_BASE_URL: ${API_BASE_URL:-http://localhost:3000/api/v1}
    ports:
      - "4200:80"

  agelo-website:
    build:
      context: ./agelo-website
      dockerfile: Dockerfile
    container_name: agelo-website
    ports:
      - "4173:80"

volumes:
  agelo-db-data:
```

Build and start:

```bash
docker compose up -d --build
```

## Configuration (`.env`)

Compose reads a `.env` file from the same folder. Both files above use the same
variables, so one `.env` works for either. Start from this template:

```bash
# --- MySQL ---
MYSQL_ROOT_PASSWORD=change-me-root
MYSQL_DATABASE=agelo
MYSQL_USER=agelo
MYSQL_PASSWORD=change-me-db

# --- Backend ---
# 32+ byte random string. Generate one: openssl rand -base64 48
JWT_SECRET=change-me-32-bytes-minimum-secret
# Comma-separated origins the SPA is served from.
CORS_ORIGINS=http://localhost:4200
# Where the SPA reaches the API. Use your public URL behind a proxy.
API_BASE_URL=http://localhost:3000/api/v1

# --- Bootstrap Solution Architect (first boot only) ---
SA_EMAIL=architect@agelo.local
SA_PASSWORD=change-me-strong-password

# --- GHCR only ---
IMAGE_TAG=latest
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `MYSQL_*` | `agelo` / `rootpw` | Database name and credentials. |
| `JWT_SECRET` | dev placeholder | HMAC key signing SA login tokens. **Must change.** |
| `CORS_ORIGINS` | `localhost:4200` | Origins allowed to call the API. |
| `API_BASE_URL` | `localhost:3000/api/v1` | URL the SPA + agents reach the API at. |
| `SA_EMAIL` / `SA_PASSWORD` | `architect@agelo.local` | Bootstrap Solution Architect, seeded once. |
| `IMAGE_TAG` | `latest` | GHCR image tag (Option A only). |

## After it boots

| Service | URL |
| --- | --- |
| SPA (dashboard) | `http://localhost:4200` |
| API (Swagger at `/api/docs`) | `http://localhost:3000` |
| Marketing + docs site | `http://localhost:4173` |
| MySQL | `localhost:3306` |

Sign in to the dashboard with the `SA_EMAIL` / `SA_PASSWORD` you configured. The
database schema is created automatically on first boot — no manual migration
step.

Tear everything down (add `-v` to also drop the database volume):

```bash
docker compose down        # stop containers, keep data
docker compose down -v     # stop containers and delete the MySQL volume
```

## Security checklist

Before exposing Agelo beyond your laptop:

- [ ] Set a random `JWT_SECRET` (32+ bytes). Rotating it invalidates all SA sessions.
- [ ] Set a strong `SA_PASSWORD` and change it again from **Settings → Security** after first login.
- [ ] Replace the MySQL passwords and don't publish port `3306` to the internet.
- [ ] Put a TLS-terminating reverse proxy in front — see [Self-hosting](/docs/platform/self-hosting/) for an nginx example.
- [ ] Narrow `CORS_ORIGINS` to the exact origin(s) your SPA is served from.

## Upgrading (GHCR)

```bash
docker compose pull
docker compose up -d
```

Containers recreate against the new images; the named `agelo-db-data` volume
keeps your data across upgrades.
