# Product analytics

Samarata uses a first-party `/api/events` endpoint backed by Cloudflare Workers Analytics Engine. Product analytics is best-effort: failures and missing bindings never block calculation or receipt actions.

## Privacy contract

- No analytics cookies, fingerprinting, persistent user ID, or login are used.
- A random UUID is created per browser tab in `sessionStorage`.
- `localStorage` contains only an opt-out preference and a boolean returning-visit signal.
- Participant names, order names, exact monetary values, receipt content, images, free text, email, and payment data are forbidden.
- The server rejects unknown envelope fields, unknown property fields, and values outside closed enums.
- The user-facing notice and opt-out control live at `/privacy`.
- Analytics Engine retention is fixed by Cloudflare at three months. Workers Logs is a separate operational system with the retention of the active Cloudflare plan.

This configuration is a product decision, not a legal conclusion for every jurisdiction. Reassess consent requirements before materially changing the data, regions, providers, identifiers, or marketing use.

## Dataset mapping

Binding: `PRODUCT_ANALYTICS`  
Dataset: `samarata_product_events`

Analytics Engine uses ordered arrays, so column positions are part of the schema:

| Column | Meaning |
| --- | --- |
| `blob1` | event name |
| `blob2` | locale |
| `blob3` | currency |
| `blob4` | participant-count bucket |
| `blob5` | device class |
| `blob6` | share mode |
| `blob7` | surface |
| `blob8` | variant |
| `blob9` | closed-enum use case |
| `double1` | schema version |
| `double2` | returning boolean (`0` or `1`) |
| `index1` | random per-tab session UUID and sampling key |

Empty dimensions are stored as empty strings to preserve the mapping. The Analytics Engine `timestamp` is the trusted ingestion time; the client `occurredAt` value is validated but intentionally not stored.

## Weekly dashboard queries

Run queries through the Cloudflare Analytics Engine SQL API with an `Account Analytics Read` token. Never expose that token to the browser or commit it.

### Canonical funnel, last seven days

```sql
SELECT
  blob1 AS event_name,
  count(DISTINCT index1) AS sessions,
  sum(_sample_interval) AS estimated_events
FROM samarata_product_events
WHERE
  timestamp >= NOW() - INTERVAL '7' DAY
  AND blob1 IN (
    'landing_viewed',
    'calculation_started',
    'calculation_completed',
    'receipt_downloaded',
    'receipt_copied',
    'receipt_shared',
    'returning_usage',
    'tip_exposed',
    'tip_clicked'
  )
GROUP BY event_name
ORDER BY sessions DESC
```

Treat any of `receipt_downloaded`, `receipt_copied`, or `receipt_shared` as `receipt_action_completed`. `tip_exposed` and `tip_clicked` are the current `monetization_exposed` and `monetization_clicked` events. Samarata does not emit `monetization_converted` because Saweria has not provided a trusted payment confirmation integration.

### Survey demand

```sql
SELECT
  blob9 AS use_case,
  sum(_sample_interval) AS estimated_responses
FROM samarata_product_events
WHERE
  timestamp >= NOW() - INTERVAL '7' DAY
  AND blob1 = 'survey_submitted'
GROUP BY use_case
ORDER BY estimated_responses DESC
```

### Daily completion health

```sql
SELECT
  intDiv(toUInt32(timestamp), 86400) * 86400 AS day,
  blob1 AS event_name,
  sum(_sample_interval) AS estimated_events
FROM samarata_product_events
WHERE
  timestamp >= NOW() - INTERVAL '28' DAY
  AND blob1 IN ('landing_viewed', 'calculation_completed')
GROUP BY day, event_name
ORDER BY day ASC, event_name ASC
```

Review these three views weekly. Record observations, not user-level exports. `returning_usage` is a directional signal based on a local boolean; it is deliberately not a cross-device or persistent-user cohort.

## Operational checks

- `POST /api/events` should return `202` for a valid event.
- Invalid JSON or schema returns `400`, an oversized body returns `413`, and a wrong content type returns `415`.
- Workers invocation logs are sampled at 10%. Application code must not log request bodies or raw errors containing user input.
- After changing `wrangler.jsonc`, regenerate bindings with `bunx wrangler types`.

References: [Analytics Engine setup](https://developers.cloudflare.com/analytics/analytics-engine/get-started/), [SQL API](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/), and [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).
