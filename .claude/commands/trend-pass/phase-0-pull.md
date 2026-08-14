# Phase 0 — Pull (7-day window, minimal for the trend lane; +top-20 for coverage)

**The TREND lane reads exactly two lists:** top 10 queries by clicks and top 10 pages by clicks over the last **7 days**. No baselines, no extra dimensions. The 7-day window clears the signal threshold on a low-traffic site while keeping the trend input tiny.

**One sanctioned addition — `coverage_queries` (top 20 queries).** The pull also returns the top **20** queries (same 7-day window) for the COVERAGE lane (Phase 1b), which asks *"are any top queries missing a dedicated page?"* Trend detection (Phase 1) ignores this field and still works only from `top_queries[10]`.

```bash
python3 scripts/trend_pass/gsc_pull_7d.py --base-url <BASE_URL> \
  --json reports/trend-pass/$(date +%Y-%m-%d).pull.json
```

## Failure handling
- Exit 2 (no creds) / 3 (permission) → hard blocker: email failure, exit 0.
- Exit 5 (no data in 7d) → email failure ("GSC returned no data for 7 days"), exit 0.
- A low/zero-click week is NOT a failure — it's a valid "no clear trend" input; continue to Phase 1.

## Output
The pull JSON (now with `top_queries[10]`, `coverage_queries[20]`, `top_pages[10]`) → Phase 1 (trend lane) **and** Phase 1b (coverage lane). Fetch nothing else from GSC this run.
