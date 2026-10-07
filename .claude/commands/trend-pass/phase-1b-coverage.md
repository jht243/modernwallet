# Phase 1b — Coverage lane (uncovered top-query detection)

**The second, independent work trigger. Runs EVERY run, no matter what Phase 1 decided** — new trend, no trend, or already-caught. Where the trend lane asks "what's spiking?", this lane asks a flatter, always-relevant question:

> **"Are any of our top-20 queries missing a dedicated page — demand we already earn impressions/clicks for but have never built a home for?"**

Those uncovered queries are **findings** for the research pack (Phase 4). **Research only (2026-10-05):** this lane never builds or writes pages and calls no external API — local files + the Phase 0 pull only. Mindmap (Phase 4c) decides what gets built, and handles winner protection. This is the lane that keeps the engine productive on the (common) runs when the trend lane stops.

## Input
`coverage_queries[20]` from the Phase 0 pull JSON, plus `top_pages[10]`.

## 1. Enumerate what the site already covers (FREE, local)
```bash
python3 scripts/trend_pass/slug_inventory.py --base-url <BASE_URL> --flat > /tmp/trend-slugs.txt
wc -l /tmp/trend-slugs.txt
```
This is every slug/route the site already claims (data files + static pages + redirects). It is the fast first filter, not the whole answer — a query can be "covered" by a page whose slug doesn't string-match it.

## 2. Classify each of the 20 queries into exactly one bucket
For every query in `coverage_queries`, decide — **by intent, not string equality**:

1. **COVERED** — a dedicated page already serves this intent. Evidence, any of:
   - the slugified query (or an obvious synonym slug) is in `/tmp/trend-slugs.txt`, **or**
   - a page in the site's content source (on this site: the `src/data/*.ts` page registries — `calculators.ts`, `spokes-*.ts`, `guides*.ts`, `comparisons*.ts`, `roundups*.ts`, hub files) clearly targets it (title/keywords match the intent), **or**
   - **a `top_pages[10]` page is the dedicated page for it.**
   Drop it. No finding.

2. **UNCOVERED** — real demand (it's a top-20 query, so it already gets impressions), no dedicated page. **This is a finding — and it triggers the breadth framework, not a lone page.** Identify the entity behind the query (the company/service/product/model/compound/tool it's about) and expand it into the full angle cluster per `_breadth-framework.md` (deep-dive, comparison, alternatives, pricing, is-it-worth-it, how-to-use, safety, etc.), applying that file's HARD fit gate so no thin or forced angle is suggested (reasoning only — no keyword lookups). The uncovered query itself is usually the deep-dive/anchor; the cluster captures the rest of the traffic around the same topic. Tag every surviving angle `source: coverage` + its angle.

Print the classification table (query, clicks, impressions, verdict COVERED/UNCOVERED, matched page/slug if covered) so it lands in the transcript and can be pasted into the digest.

## 3. Ledger check (don't re-propose what we already judged)
Read `reports/trend-pass/ledger.md`. Drop any `source: coverage` finding whose slug/intent already appears as **KEPT** (we built it — it should already be COVERED next run) or **DROPPED** (we considered and declined it). This stops the lane from re-surfacing the same sticky uncovered query every single run. Anything that survives is genuinely new to consider.

## 4. Hand off
Surviving UNCOVERED findings (anchor query + suggested angles, tagged `source: coverage`) go to **Phase 4**, which pre-filters them locally and puts them in the research pack for mindmap. No cap here — the 25-page-per-run cap is applied by mindmap (Phase 4c).

## Output
- Findings tagged `source: coverage` (may be empty — that's fine) → Phase 4.
- Digest material: the coverage classification counts (covered / uncovered).

## Notes
- **Coverage ≠ ranking well.** A query can be COVERED (a page exists) yet rank poorly — improving an existing page's rank is the job of `/page-quality-pass` and `/question-gap-pass`, NOT this lane. This lane only creates a NEW page when there is **no** page at all. Never rewrite/regenerate an existing page here (additive-only guardrail).
- **Empty is a valid, cheap outcome.** If all 20 queries are covered, this lane contributes nothing and costs almost nothing — exactly like a trendless run in the trend lane.
