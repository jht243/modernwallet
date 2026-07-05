# Phase 0 — Pull (GA4, minimal by design)

**Exactly one list and its channel split, nothing more:** the top-10 most-visited pages over the freshest 24h of GA4 data, plus the per-page channel breakdown. GA4 is the ALL-traffic source — the list already includes direct, referral, and AI-assistant (Unassigned) traffic that GSC never reports. **Do not widen this pull.**

## Run

The routine message supplies this site's GA4 property id and the inline `GOOGLE_REPORTING_SA_JSON`. Pass the property id via `--property-id` and prefix the SA **on this same command** (env vars do NOT persist across separate commands, so never rely on an earlier `export`):

```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 scripts/trend_pass/ga4_pull_24h.py \
  --property-id <PROPERTY_ID_FROM_ROUTINE> \
  --with-channels \
  --json reports/trend-pass/$(date +%Y-%m-%d).ga4.pull.json
```

(The routine typically already ran this exact pull as its step 1 — if `reports/trend-pass/<date>.ga4.pull.json` already exists, reuse it instead of re-pulling.) Missing property id → pull exits 4; that's a hard blocker: email failure, exit 0.

The script probes the last 4 days and uses the freshest date with sessions. The JSON contains `data_date`, `source: "ga4"`, `top_pages[10]` (each with `views`, `sessions`, `active_users`, and a `clicks` alias = views), `top10_pages_total_views`, and `channel_split` (per-page sessions by default channel group).

> Distinct filename: `<date>.ga4.pull.json` (the GSC trend pass writes `<date>.pull.json`). Shared report dir; separate pulls.

## Failure handling
- Exit 2 (no credentials) or 3 (permission) → hard blocker: email failure, exit 0.
- Exit 5 (no data in 4 days) → email failure ("GA4 returned no data for the last 4 days"), exit 0.
- Low/zero views is NOT a failure — pages with even a handful of real visits are auditable; continue to Phase 1.

## Output
The GA4 pull JSON path → Phase 1. Do not fetch anything else from GA4 this run.
