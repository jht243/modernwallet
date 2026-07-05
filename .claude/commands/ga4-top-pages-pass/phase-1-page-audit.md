# Phase 1 — Per-page audit setup: classify → cooldown filter → GSC evidence

No trend detection. Each of the 10 pages is judged **on its own**. This phase decides WHICH pages get audited tonight and gathers the per-page evidence the lanes in Phase 2 need.

## 1. Classify each page
For each of the 10 pages: **entity/topic** (what the page is about — cross-reference any release-recency data the repo tracks, e.g. `data/model-origins.ts` on sites that track model releases; newer entities are higher-signal), **archetype** (discovered from the site's own page shapes — comparison / alternatives / explainer / vertical spoke / roundup / service / tool / any site-specific family), **vertical** (may be none), and **non-Organic %** from `channel_split` (Direct + Referral + Unassigned share of sessions). Majority-non-Organic pages are **GSC-invisible winners** — the highest-priority audits, because no GSC-driven pass will ever work on them.

## 2. Cooldown filter (the page-level dedup — the reason this pass stays cheap on sticky sites)
Read `reports/trend-pass/ga4-page-audits.md` (create with a header if missing):

```markdown
| route | audited | views_at_audit | actions (spokes/comparisons/enrich/meta/tools) | deferred |
```

**HARD RULE — 7-day cooldown:** a page audited any time in the prior **7 days** is NEVER re-analyzed, no exception (not for a traffic spike, not for any reasoning). The only thing permitted inside the window is draining its own DEFERRED rows.

A page is **AUDITED tonight** only if:
- **(a) never audited** — no row in the ledger; or
- **(b) ≥7 days** since its last audit.

Additionally, independent of eligibility:
- **(c) DEFERRED-drain:** a page with DEFERRED actions remaining may have ONLY those drained (through Phases 3–4) — no fresh mining. This does not count as an audit and does not reset its cooldown date.

Everything else is **SKIPPED (cooldown)** — list it in the digest's per-page table with its next-eligible date. **All 10 skipped and nothing to drain → early exit** (`--status no-changes`, "All top-10 pages on cooldown"), a first-class success.

Order the audited pages: GSC-invisible winners first, then by views desc (processing order only — there is no per-night audit limit; every eligible page in the top-10 gets a full audit).

## 3. Per-page GSC evidence (the SEO-traffic-data input for metadata + FAQ decisions)
For each AUDITED page, pull its search-side performance:

```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
  --base-url <BASE_URL_FROM_ROUTINE> \
  --page <BASE_URL_FROM_ROUTINE><route> --trend
```
(Same inline SA as the Phase 0 pull, prefixed on this command — env doesn't persist. GSC scope is derived automatically.)

(Requires the same SA creds as the pull; GSC scope. If GSC returns no data for a page — common for AI-traffic-only winners — record `verdict: no-data` and continue; that page's metadata lane is closed but every other lane stays open.)

Record per page: `totals` (impressions/clicks/CTR/position), `top_queries`, and `verdict` (`performing` / `underperforming` / `no-data` / `mixed`, plus `rewrite_recommended`). This verdict is the ONLY thing that can authorize a metadata rewrite in Phase 2, and `top_queries` seeds the autocomplete mining.

## Output
The **audit roster**: every eligible page, each with classification, channel profile, GSC evidence, and (for cooldown-drain pages) their DEFERRED rows. → Phase 2.
