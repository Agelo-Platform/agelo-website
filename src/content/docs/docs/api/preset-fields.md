---
title: Preset fields
description: Reusable templates for the most common card shapes.
sidebar:
  order: 15
---

Presets are stored as **field-level overrides** on a card type, which is why they live under `preset-fields`. The full preset for a given `(cardType, presetName)` is the union of every preset-field row with that pair.

See [presets](/docs/concepts/presets) for the conceptual model.

## `GET /preset-fields`

Auth: `JWT`. List preset fields. Supports `?cardTypeId=…&presetName=…` to narrow.

**Response 200**

```json
[
  {
    "id": "pf_…",
    "cardTypeId": "ctype_bug",
    "presetName": "P3-bug",
    "fieldId": "field_severity",
    "value": "P3"
  }
]
```

## `GET /preset-fields/{id}`

Auth: `JWT`. Return one preset-field row.

## `POST /preset-fields`

Auth: `JWT`. SA-only. Create a preset-field row.

**Body**

```json
{
  "cardTypeId": "ctype_bug",
  "presetName": "P3-bug",
  "fieldId": "field_severity",
  "value": "P3"
}
```

A preset is "born" the first time a row is created with its name; deleting the last row deletes the preset.

## `PATCH /preset-fields/{id}`

Auth: `JWT`. SA-only. Update the value.

**Body** — `{ "value": "P2" }`

## `DELETE /preset-fields/{id}`

Auth: `JWT`. SA-only. Remove the row. If it was the last row for that preset, the preset disappears from the SPA's **+ New from preset** menu.

## Applying a preset at card creation

The card-creation route accepts a `presetName` parameter. When set, the backend pre-fills the card's field values from the preset rows before applying the explicit values in the body.

```http
POST /api/v1/organizations/{orgId}/cards
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "projectId": "proj_…",
  "columnId": "col_backlog",
  "cardTypeId": "ctype_bug",
  "presetName": "P3-bug",
  "title": "Login button styled wrong on Safari"
}
```

Field values you supply explicitly always win over preset defaults.
