# Phase 0 — Pull (GA4 engagement, 28-day window)

One pull, wide window, engagement metrics on. This is deliberately different from the 24h passes: engagement RATES need sample size, and this pass diagnoses quality, not momentum.

```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 scripts/trend_pass/ga4_pull_24h.py \
  --property-id <GA4_PROPERTY_ID_FROM_ROUTINE> \
  --with-engagement --with-channels --days 28 --top 25 \
  --json reports/page-quality-pass/<YYYY-MM-DD>.pull.json
```

(Same inline-SA-per-command pattern as every sibling pass — env vars do not persist across Bash calls.)

Each `top_pages` row carries: `views`, `sessions`, `active_users`, `avg_eng_s` (userEngagementDuration ÷ activeUsers — the number the GA4 UI shows as "Average engagement time per active user"), `engagement_rate`, `bounce_rate`, and — on properties with enhanced-measurement scroll tracking — `scrolled_users` / `scrolled_pct` (share of users who scrolled 90%). The script auto-retries without the scroll metric on properties that lack it; when `scrolled_pct` is absent, every downstream rule that reads it is simply skipped.

## Validation
- Exit 2/3 (credentials / permission) → email failure per the orchestrator, exit 0.
- Exit 5 (no data) → digest "GA4 window empty", `--status no-changes`, exit 0.
- Fewer than 8 rows or total sessions < 100 across the window → the site is too small for stable engagement diagnosis this window: digest "insufficient traffic for quality diagnosis", `--status no-changes`, exit 0. (Do NOT lower the floors to force findings.)

## Output
`reports/page-quality-pass/<YYYY-MM-DD>.pull.json` → Phase 1. Do not widen the pull, add dimensions, or re-rank by anything other than views — selection logic lives in Phase 1.
