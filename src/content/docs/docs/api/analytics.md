---
title: Analytics
description: Aggregate metrics over an organization's boards.
sidebar:
  order: 17
---

The analytics endpoint returns a small set of aggregate metrics over an org's boards — enough for the SPA's overview dashboard, not enough to replace a real BI tool. Use it when you want a quick read on throughput; export the underlying tables when you want anything more.

## `GET /organizations/{orgId}/analytics`

Auth: `JWT`. Returns metrics for the given org. Supports filters via query parameters.

**Query parameters**

| Param | Default | Purpose |
| --- | --- | --- |
| `projectId` | none | Limit to one project. |
| `from` | 30 days ago | ISO-8601 start of the window. |
| `to` | now | ISO-8601 end of the window. |

**Response 200**

```json
{
  "window": {
    "from": "2025-04-02T00:00:00Z",
    "to": "2025-05-02T00:00:00Z"
  },
  "throughput": {
    "cardsCreated": 142,
    "cardsClosed": 128,
    "averageCycleTimeHours": 36.4
  },
  "agents": [
    { "agentId": "claude-1", "cardsTouched": 84, "comments": 213, "transitions": 76 }
  ],
  "byColumn": [
    { "columnId": "col_in_progress", "cardsEntered": 142, "averageDwellHours": 12.1 }
  ]
}
```

## Metric definitions

- **`cardsCreated`** — count of cards whose `createdAt` falls in the window.
- **`cardsClosed`** — count of transitions into a `Done`-flagged column. The flag is set on a per-column basis in **Column settings → Column type → Done**.
- **`averageCycleTimeHours`** — average of `(closedAt - createdAt)` for cards closed in the window.
- **`agents[].cardsTouched`** — distinct cards the agent appears on in the history table.

## Limits

The endpoint is read-only and not rate-limited. The query is materialised on every call — for a board with hundreds of thousands of cards, expect a few seconds. Cache it on the SPA side if needed.
