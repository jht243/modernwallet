# Phase 1 — Scrape + diff (NET-NEW)

Run the scraper to crawl every roster competitor, diff against the ledger, and emit candidates. This is deterministic Python — **no LLM, no AI spend** here.

## Run the scraper

```bash
TODAY="$(date +%Y-%m-%d)"
python3 scripts/competitor_monitor/scraper.py detect \
  --out "reports/competitor-monitor/candidates-$TODAY.json"
```

This:
- Crawls each competitor's sitemap(s) (robots.txt + `/sitemap.xml` + `/sitemap_index.xml`), diffs URLs against `reports/competitor-monitor/ledger.json`.
- **First crawl of a competitor is a QUIET SEED** — every current URL is marked `baseline`, **0 candidates emitted** (no publish/email storm on first run).
- For an already-seeded competitor, emits **new** URLs and **materially-updated** pages (lastmod advanced + content hash changed). Still-`pending` pages from a prior crashed run are re-emitted (crash-safety).
- **Applies the relevance gate.** Only pages inside this project's niche (AI/automation/agents/CRM/receptionist/customer-service/SMB-ops/LLM/RAG, etc.) become candidates. Off-niche pages (crypto, mobile dev, enterprise cloud, etc.) are **recorded as `skipped-off-niche` in the ledger and NOT generated** — they appear in `payload.skipped_off_niche` for the email, and never re-surface.
- Writes the updated ledger (seen-state + `pending` markers + off-niche skips) and the candidates file.

> The scraper writing the ledger here is expected — it is part of this run's commit. New/updated candidates are marked `pending`; they only become `done` when Phase 6 records a disposition.

## Read the candidates

Load `reports/competitor-monitor/candidates-$TODAY.json`. Each candidate has: `competitor`, `competitor_name`, `url`, `title`, `kind` (`page`|`comparison`|`tool`), `change` (`new`|`updated`|`pending-retry`), `lastmod`, `content_hash`, `outline` (H2/H3 = the **coverage floor**), `tool_io` (for tools).

## Decision

- **`candidate_count == 0`** (first run, or nothing new) → do NOT generate anything. Commit the ledger (and candidates file) and hand to the email phase as **`no-changes`** ("No new competitor content detected; ledger seeded/refreshed."). Exit the run after the email.
- **Otherwise** → apply the per-run cap from the launcher (default 10): if candidates exceed the cap, keep the **most recent** N (sort by `lastmod` desc, then `change` priority new>updated>pending-retry), and record the overflow URLs for the email. Carry the kept candidates to Phase 2.

Print: total candidates, by-kind counts, fetch failures, kept vs overflow. **Auto-continue to Phase 2.**
