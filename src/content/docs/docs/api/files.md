---
title: Files
description: Upload, fetch, and delete files attached to card fields.
sidebar:
  order: 10
---

Files in Agelo are stored on disk (path from `AGELO_FILES_PATH`) and referenced by their database row. They live as values inside `file`-kind custom fields on a card.

## `POST /files`

Auth: `JWT`. Upload a file. The body is `multipart/form-data` with these parts:

| Part | Required | Purpose |
| --- | --- | --- |
| `file` | yes | The blob. Max size 50 MB by default. |
| `cardId` | yes | The card to attach to. |
| `fieldId` | yes | The `file`-kind field on the card. |

**Response 200**

```json
{
  "id": "file_…",
  "name": "design.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 14823,
  "cardId": "card_…",
  "fieldId": "field_design",
  "uploadedAt": "2025-05-02T11:14:22Z"
}
```

## `GET /files/card/{cardId}/field/{fieldId}`

Auth: `JWT`. List the files currently attached to a card field.

**Response 200** — array of file metadata records as above.

## `GET /files/{id}/content`

Auth: `JWT`. Stream the file content. Sets `Content-Type` from the stored mime type and `Content-Disposition: attachment; filename="…"` so browsers download with the original name.

Use `?inline=1` to flip the disposition to `inline` (useful for in-page PDF previews).

## `DELETE /files/{id}`

Auth: `JWT`. SA-only. Remove the file from the card field and delete the blob from disk.

**Response 200** — `{ "success": true }`.

## Limits

- Max upload size: 50 MB. Configurable via `AGELO_FILES_MAX_BYTES`.
- Allowed mime types: any. The frontend gates by extension; the backend stores whatever it receives.
- Concurrent uploads to the same field overwrite previous values when the field is single-valued. Multi-valued file fields store all uploads.

## Storage

Files are written to `${AGELO_FILES_PATH}/${orgId}/${cardId}/${fileId}`. The path is **deterministic** from the metadata, so a backup tool that walks the filesystem doesn't need a separate index.
