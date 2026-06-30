# Phase 6 — Auto-decision push + IndexNow + record ledger (NET-NEW)

No human gate. Apply the launcher's auto-decision table, then push, ping IndexNow, and record dispositions back into the ledger so acted-on competitor URLs are never re-processed.

## 1. Apply the auto-decision (first match wins)

| Condition | Decision |
|---|---|
| Phase 5 reverted (typecheck failed) | skip push; status `failure` |
| Phase 4 marked **every** item `draft: true` | leave the draft commit unpushed; status `failure` |
| ≥1 item shipped non-draft | push + IndexNow; status `success` |
| (handled earlier) 0 candidates / all duplicate | record ledger + commit; status `no-changes` |

## 2. Record dispositions into the ledger (ALWAYS, even on no-changes)

Build a dispositions file mapping **every candidate's competitor source URL** to its outcome, then merge it into the ledger so those URLs flip from `pending` → `done`:

```bash
# /tmp/cm-dispositions.json — one entry per candidate acted on or dropped this run:
# { "dispositions": { "<competitor_url>": { "disposition": "...", "our_url": "<our route or ''>" } } }
#   disposition ∈ published | enriched | skipped-duplicate | skipped-low-value | fetch-failed
#   (a draft that was held counts as published — it shipped as a route, just noindex; use "published")
python3 scripts/competitor_monitor/scraper.py record --dispositions /tmp/cm-dispositions.json
```

> Items left over by the per-run cap (overflow) get **no** disposition — they stay `pending` and re-surface next run. That is intended.

## 2b. Refresh the baseline chart (ALWAYS — this is the chart future runs diff against)

Regenerate the snapshot chart so it reflects the current state, and so the NEXT run can spot the difference against it. The command auto-diffs against the previous chart and writes a "Changes since the previous chart" section.

```bash
python3 scripts/competitor_monitor/scraper.py baseline
# writes reports/competitor-monitor/baseline-<today>.{md,json}
```

Read the new `baseline-<today>.json` field `total_new_since_prev` and each competitor's `new_since_prev` / `delta` — these are the human-facing "what changed vs last chart" numbers for the email. Keep ALL dated baseline files (do not delete old ones) — the dated history IS the audit trail of competitor publishing over time.

## 3. Push + IndexNow (only on `success`)

```bash
git add -A                      # include the updated ledger + candidates + refreshed baseline chart
git commit -m "competitor-monitor: ledger + baseline chart refresh ($(date +%Y-%m-%d))" \
  -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"   # if state changed after Phase 5's commit
git push origin HEAD
```

Then IndexNow the **live (non-draft)** URLs only (use the project's publish/IndexNow helper if Phase 0 found one, else POST the URLs to the IndexNow API with the project's key), e.g. `{BASE_URL}/guides/<slug>`, `…/comparisons/<slug>`, `…/tools/<slug>`. Capture the HTTP status. Skip drafts. Optionally fire the Google Indexing ping if the other radars do.

On `no-changes` / `failure`: still commit the updated ledger **and the refreshed baseline chart** (so seed/refresh state + the dated chart history persist) and push them; skip IndexNow.

## Output
Report: pushed SHA, branch, IndexNow status + URL count, ledger dispositions recorded (published/enriched/duplicate counts), overflow left pending. Capture all of this for the email. **Auto-continue to Phase 7.**
