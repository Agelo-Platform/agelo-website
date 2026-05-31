---
title: Admin
description: Build info, full-org export, and round-trip import. SA-only.
sidebar:
  order: 19
---

The admin endpoints expose deployment metadata, a one-shot full-DB export, and a matching import. All require the SA role.

## `GET /admin/about`

Auth: `JWT`. Returns information about the running deployment. Useful for a footer in the SPA, for support, or for an automated environment-comparison tool.

**Response 200**

```json
{
  "version": "0.4.2",
  "gitSha": "af68fad",
  "buildTime": "2025-04-30T14:23:11Z",
  "dotnetVersion": "8.0.4",
  "host": "agelo-api-1",
  "uptime": "P3DT4H22M",
  "database": {
    "engine": "MySQL",
    "version": "8.4.0"
  }
}
```

## `GET /admin/export`

Auth: `JWT`. SA-only. Export the entire current organization as a single JSON document. Useful for backups, migrations between installs, or audit reviews.

**Query parameters**

| Param | Default | Purpose |
| --- | --- | --- |
| `includeFiles` | `false` | When `true`, file blobs are inlined as base64 in the response. With many uploads this can be very large — prefer `false` plus a separate filesystem snapshot. |
| `includeHistory` | `true` | Include the card history rows. |

**Response 200**

```json
{
  "organization": { "id": "org_…", "title": "Acme Inc." },
  "projects": [...],
  "columns": [...],
  "cardTypes": [...],
  "fields": [...],
  "presets": [...],
  "transitions": [...],
  "cards": [...],
  "comments": [...],
  "history": [...],
  "agents": [...],
  "files": [],
  "exportedAt": "2025-05-02T11:14:22Z"
}
```

The response is streamed; the API sets `Content-Type: application/json` and writes the document with no top-level array wrapping, so a streaming JSON parser can consume it incrementally.

## `POST /admin/import`

Auth: `JWT`. SA-only. The round-trip of `GET /admin/export`: consumes a JSON snapshot produced by the export endpoint and upserts every covered entity back into the database, preserving the original ids so cross-aggregate links survive.

**Request**

Accepts either `multipart/form-data` with a `file` field (the common form-submit path used by the SPA) or a raw `application/json` body. Body size is capped at **64 MiB** — generous for SA-scale backups; raise the limit at the reverse proxy if you need more.

```bash
# multipart upload
curl -sSf -X POST https://agelo.example/api/v1/admin/import \
  -H "authorization: Bearer $JWT" \
  -F "file=@snapshot.json;type=application/json"

# or raw JSON body
curl -sSf -X POST https://agelo.example/api/v1/admin/import \
  -H "authorization: Bearer $JWT" \
  -H "content-type: application/json" \
  --data-binary @snapshot.json
```

**Response 200**

```json
{
  "summary": {
    "imported": {
      "organizations": 1, "projects": 3, "teams": 2, "agents": 5,
      "cardTypes": 6, "customFields": 24, "boardColumns": 15,
      "statusTransitions": 18, "cardRelationships": 2,
      "promptCategories": 4, "prompts": 17, "promptVersions": 31,
      "cards": 142, "fieldValues": 318, "comments": 67
    },
    "skipped": {
      "users": 4, "apiKeys": 6,
      "permissions": 12, "rolePermissions": 24
    }
  },
  "sourceMeta": {
    "product": "Agelo",
    "version": "0.0.1",
    "exportedAt": "2026-05-16T09:03:50.2587375Z"
  },
  "importedAt": "2026-05-16T11:14:22Z"
}
```

**Skipped groups** (with rationale)

| Group | Why it's skipped |
| --- | --- |
| `users` | Password hashes are never exported. Re-importing users would brick login on the destination. Bootstrap a new SA via `SA_BOOTSTRAP_*` env vars instead. |
| `apiKeys` | The `keyHash` is never exported. Re-imported keys could not authenticate. Mint fresh keys on the destination after import. |
| `permissions`, `rolePermissions` | Seeded automatically by `DatabaseInitializer` on first boot. Merging them risks reverting role grants the destination operator already curated. |

The writer runs every group in dependency order with a `SaveChangesAsync` at every FK boundary, so MySQL's eager FK validation never fires on partial state. Re-running the same import is **idempotent** — rows are matched by their original id and updated in-place.

**Error envelope** — the import fails as a unit. If any group's persistence step throws, none of that group's rows commit. Validation errors carry typed codes:

| HTTP | Code | Cause |
| --- | --- | --- |
| `400` | `InvalidSnapshotShape` | The JSON parsed but didn't carry the required `meta` block. |
| `400` | `UnsupportedProduct` | `meta.product` wasn't `Agelo`. Catches the case where an unrelated JSON gets uploaded. |
| `400` | `EmptySnapshot` | The snapshot parsed cleanly but had zero rows across every covered entity — we refuse rather than silently no-op. |
| `400` | `UnknownExceptionDuringParse` | The body wasn't valid JSON. |

## Notes

- The export is **org-scoped**. There is no cross-org export — that would be a different threat model.
- API keys are **never** included, even hashed. They must be re-issued on the destination install.
- The structure is stable across minor versions; breaking changes ship as `v2/admin/export`.
- For a fresh-node restore: deploy the destination, log in as the bootstrap SA, then upload the exported snapshot at **Settings → Data → Database import** in the SPA. The form posts to `/admin/import` and renders the summary inline.
