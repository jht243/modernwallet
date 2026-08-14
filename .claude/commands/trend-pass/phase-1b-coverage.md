# Phase 1b — Coverage lane (uncovered top-query detection)

**The second, independent work trigger. Runs EVERY night, no matter what Phase 1 decided** — new trend, no trend, or already-caught. Where the trend lane asks "what's spiking?", this lane asks a flatter, always-relevant question:

> **"Are any of our top-20 queries missing a dedicated page — demand we already earn impressions/clicks for but have never built a home for?"**

Those uncovered queries are the candidates this lane feeds into the shared build pipeline. This is the lane that keeps the engine productive on the (common) nights when the trend lane stops.

## Input
`coverage_queries[20]` from the Phase 0 pull JSON, plus `top_pages[10]` (for winner protection).

## 1. Enumerate what the site already covers (FREE, local)
```bash
python3 scripts/trend_pass/slug_inventory.py --flat > /tmp/trend-slugs.txt
wc -l /tmp/trend-slugs.txt
```
This is every slug/route the site already claims (data files + static pages + redirects). It is the fast first filter, not the whole answer — a query can be "covered" by a page whose slug doesn't string-match it.

## 2. Classify each of the 20 queries into exactly one bucket
For every query in `coverage_queries`, decide — **by intent, not string equality**:

1. **COVERED** — a dedicated page already serves this intent. Evidence, any of:
   - the slugified query (or an obvious synonym slug) is in `/tmp/trend-slugs.txt`, **or**
   - a page in the site's content source (its data file, generator, or content/markdown dir — whatever this repo uses) clearly targets it (title/keywords match the intent), **or**
   - **a `top_pages[10]` page already earns clicks for it** — see winner protection below.
   Drop it. No candidate.

2. **WINNER-PROTECTED** — a top-10 page already ranks/earns clicks for this query (or a page whose target query-set overlaps it). We do **not** auto-build a competing page against a page that's already winning (cannibalization risk). Do NOT emit a build candidate; instead add it to the digest's **"Flagged for the human (winner protection)"** list. This is the same guardrail the trend lane uses — apply it here too.

3. **UNCOVERED** — real demand (it's a top-20 query, so it already gets impressions), no dedicated page, and not winner-protected. **This is a candidate — and it triggers the breadth framework, not a lone page.** Identify the entity behind the query (the company/service/product/model/compound/tool it's about) and expand it into the full angle cluster per `_breadth-framework.md` (deep-dive, comparison, alternatives, pricing, is-it-worth-it, how-to-use, safety, etc.), applying that file's HARD fit gate so no thin or forced angle is created. The uncovered query itself is usually the deep-dive/anchor; the cluster captures the rest of the traffic around the same topic. Tag every surviving angle `source: coverage` + its angle.

Print the classification table (query, clicks, impressions, verdict, matched page/slug if covered) so it lands in the transcript and can be pasted into the digest.

## 3. Ledger check (don't re-propose what we already judged)
Read `reports/trend-pass/ledger.md`. Drop any `source: coverage` candidate whose slug/intent already appears as **KEPT** (we built it — it should already be COVERED next run) or **DROPPED** (we considered and declined it). This stops the lane from re-surfacing the same sticky uncovered query every single night. Anything that survives is genuinely new to consider.

## 4. Hand off
The surviving UNCOVERED candidates become seeds for **Phase 3** (autocomplete + SEMrush expansion runs on the trend entities **∪** these coverage queries) and flow through **Phase 4** dedup and **Phase 5** build exactly like trend candidates — same 4-layer dedup, same winner protection, same ledger logging. **Cap:** the coverage lane has its **own 25-page/night cap, separate from the trend lane's 25** (up to 50 total/night) — the two lanes never pool or borrow budget.

## Output
- Candidate list tagged `source: coverage` (may be empty — that's fine) → merged with any trend candidates → Phase 3.
- Digest material: the coverage classification counts (covered / winner-protected / uncovered), plus any winner-protection flags.

## Notes
- **Coverage ≠ ranking well.** A query can be COVERED (a page exists) yet rank poorly — improving an existing page's rank is the job of `/page-quality-pass` and `/question-gap-pass`, NOT this lane. This lane only creates a NEW page when there is **no** page at all. Never rewrite/regenerate an existing page here (additive-only guardrail).
- **Empty is a valid, cheap outcome.** If all 20 queries are covered or winner-protected, this lane contributes nothing and costs almost nothing — exactly like a trendless night in the trend lane.
