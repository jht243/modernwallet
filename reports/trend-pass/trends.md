# Trend ledger — trends the trend-pass engine has already built out

> **Read by `/trend-pass-auto` Phase 1 BEFORE any mining.** A detected 7-day trend
> that matches a row here means **ALL WORK STOPS** (no mining/building/backlog) —
> the run reports "trend already caught" and exits. Only a theme absent from every
> row proceeds to build.
>
> **"Owned by another engine" is NEVER a stop/drop reason.** If trend-pass finds a
> good, non-existent opportunity it writes it; cross-engine overlap is resolved
> only by content-existence dedup (Phase 4), mutually — whoever writes it first
> wins, the other engine dedups next run.
>
> Status values: `MINED` (content already built), `EVERGREEN` (steady site demand,
> pages exist), `SERVICE-CORE` (money/brand pages — winner-protected).

Seeded empty 2026-07-05 — no historical trends recorded yet. The first genuinely
new 7-day trend detected will be mined, built, and appended here. Phase 4
content-existence dedup (live sitemap + git) protects against rebuilding any page
that already exists, so an empty ledger is safe on night one.

| # | Theme | Entities | Format | Caught | Status | Coverage / pointers |
|---|---|---|---|---|---|---|
| 1 | 401(k) — small-business plan setup & withdrawal/distribution tax | 401(k), small-business 401k providers/administrators, 401k withdrawal tax, 401k distribution tax | roundup / comparison / calculator | 2026-07-20 | EVERGREEN | Fully covered by existing pages: roundup/best-401k-providers-for-small-business, compare/gusto-401k-vs-paychex-401k, compare/sep-ira-vs-solo-401k, compare/simple-ira-vs-401k, retirement/401k-early-withdrawal-calculator, retirement/401k-calculator, retirement/rmd-calculator, guides/401k-beneficiary-rules. 4 candidates mechanically generated and all DROPPED as near-dups by Layer-4 adversarial review (see ledger.md 2026-07-20 rows). 0 new pages this run — corroborates the independent 2026-07-18 ga4-top-pages-pass "no gap" finding for the same vertical.
