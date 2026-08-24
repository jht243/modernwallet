# Phase 0 — Pull top GSC pages, then read each page's live SERP

Two steps, both read-only. Step A finds the pages worth checking; Step B reads the actual Google result page for each so Phase 1 can see who the AI Overview cites. Nothing is judged here.

## Step A — top pages + each page's top query (GSC)
```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
  --base-url <BASE_URL_FROM_ROUTINE> \
  --top-pages 25 --json reports/ai-answer-citation-pass/<YYYY-MM-DD>.pages.json
```
Then, for each of those 25 routes, pull its own top query (the query the page actually ranks for — that is the query whose SERP we read):
```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
  --base-url <BASE_URL_FROM_ROUTINE> --stdin --json reports/ai-answer-citation-pass/<YYYY-MM-DD>.pagequeries.json \
  < <one route URL per line>
```
(Same inline-SA-per-command pattern as every sibling pass — env vars do not persist across Bash calls.)

Build a `route<TAB>query` pairs file — one line per page, `query` = that page's highest-click `top_queries` entry. Skip a page whose top query is non-English or empty (the SERP read would be for the wrong intent) and note it under Skipped.

## Step B — read the live SERP for each page's query (DataForSEO)
```bash
DATAFORSEO_B64='<DATAFORSEO_B64_FROM_ROUTINE>' python3 scripts/lib/serp.py paa \
  --pairs-file reports/ai-answer-citation-pass/<YYYY-MM-DD>.pairs.tsv \
  --out reports/ai-answer-citation-pass/<YYYY-MM-DD>.serp.json --cap 25
```
Cost ≈ $0.004 per page (~$0.10 for 25). Each `pages` entry carries, per route: `query`, `verdict`, `ai_overview_present`, **`ai_overview_cited_domains`**, `top10_domains`, `forum_dominated`, `featured_snippet`, `paa`, `related_searches`, `recommended_shape`. `ai_overview_cited_domains` and `top10_domains` are the two fields Phase 1 buckets on.

## Validation
- GSC exit 2/3 (credentials / permission) → email failure per the orchestrator, exit 0.
- GSC returns 0 pages → digest "GSC window empty", `--status no-changes`, exit 0.
- `serp.py` reports no DataForSEO client / auth error for EVERY page → the SERP can't be read this run: digest "SERP read unavailable (DataForSEO)", `--status no-changes`, exit 0. Never guess citations. A per-page read that fails lands as `verdict: unread` for that route and is carried as Skipped, not fatal.

## Output
`reports/ai-answer-citation-pass/<YYYY-MM-DD>.serp.json` (+ the GSC pulls) → Phase 1. Do not judge citations here — bucketing is Phase 1.
