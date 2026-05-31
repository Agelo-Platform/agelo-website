---
title: Rate limits
description: Per-IP and per-key limits enforced by the API.
sidebar:
  order: 4
---

Agelo enforces rate limits in two places: the login endpoint (per-IP) and a small set of high-cost agent endpoints (per-key). Everything else is unlimited at the application layer — front it with a reverse proxy if you need a global cap.

## Login

`POST /api/v1/auth/login` is rate-limited by source IP. The default is **10 attempts per minute**, configurable via `AGELO_RATE_LIMIT_LOGIN`. Going over returns `429 Too Many Requests` with a `Retry-After` header.

This protects against brute-force credential stuffing. It does not protect against a botnet — sit a CDN or WAF in front of the API for that.

## Agent endpoints

A small set of endpoints have a per-key cap because they are cheap for the caller and expensive for the server:

| Endpoint | Limit | Reason |
| --- | --- | --- |
| `GET /api/v1/agents/{agentId}/status` | 60/min | Polled by every agent waiting for approval. |
| `GET /api/v1/organizations/{orgId}/board-flow/mcp` | 30/min | Aggregate query; loads project graph. |
| `POST /api/v1/cards/{id}/comments/mcp` | 60/min | Avoids comment-spam loops. |

Going over returns `429` with a `Retry-After` header in seconds. Agents should respect the header before retrying.

## Headers

When a request is allowed, the response carries:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1700000000
```

`X-RateLimit-Reset` is a Unix timestamp.

## Disabling limits

For testing, set `AGELO_RATE_LIMITS=disabled` in the environment. **Do not** ship this to production — the login limiter is the only thing standing between your install and a credential-stuffing run.
