# Phase 0 — Pull (7-day window, minimal by design)

**Exactly two lists:** top 10 queries by clicks and top 10 pages by clicks over the last **7 days**. No baselines, no extra dimensions. The 7-day window clears the signal threshold on a low-traffic site while keeping the input tiny.

```bash
python3 scripts/trend_pass/gsc_pull_7d.py --base-url <BASE_URL> \
  --json reports/trend-pass/$(date +%Y-%m-%d).pull.json
```

## Failure handling
- Exit 2 (no creds) / 3 (permission) → hard blocker: email failure, exit 0.
- Exit 5 (no data in 7d) → email failure ("GSC returned no data for 7 days"), exit 0.
- A low/zero-click week is NOT a failure — it's a valid "no clear trend" input; continue to Phase 1.

## Output
The pull JSON path → Phase 1. Fetch nothing else from GSC this run.
