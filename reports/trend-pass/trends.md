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
| 2 | Military Chapter 61 / DoD medical retirement / CRDP | Title 10 U.S.C. Chapter 61, DoD/military medical (disability) retirement, CRDP (Concurrent Retirement and Disability Pay), CRSC, Disability Severance Pay | comparison / explainer / FAQ | 2026-08-17 | MINED | Detected from 5 of the 7d top-10 GSC queries (cdrp military, ch 61 retirement, chapter 61 military retirement, dod medical retirement, 10 usc chapter 61); top page /compare/military-retirement-vs-medical-retirement/ (30 impr). Adversarial refutation (self-review pass — see 2026-08-17.md for the tool-availability note) found the grouping GENUINE (one coherent Chapter-61/CRDP topic, not coincidental) and NO MATCH in this ledger at detection time. The obvious core angles (Chapter-61-vs-regular-retirement, CRDP/CRSC-vs-VA-disability) were already substantively covered by two deep comparison pages + 3 FAQs shipped 2026-07-22 by ga4-top-pages-pass (compare/military-retirement-vs-medical-retirement, compare/military-retirement-vs-va-disability, and 3 military-retirement-calculator FAQs). Autocomplete mining surfaced two genuinely uncovered white-space angles this run, both grounded and shipped: compare/medical-retirement-vs-disability-severance-pay (Chapter 61 vs the <30%-rating one-time severance path, DFAS/10 U.S.C. §1212-sourced) and guides/is-military-disability-retirement-pay-taxable (the IRC §104(a)(4) combat-related exclusion + CRDP-vs-CRSC tax-treatment gap, IRS/26 U.S.C. §104-sourced). A third angle (a Chapter 61 Method-A/Method-B pay calculator — the strongest single demand signal in mining) was written as an asset spec only (reports/seo-pass/specs/chapter-61-disability-retirement-calculator-spec.md), not built, since it needs new calculation-engine code. See ledger.md 2026-08-17 rows for full KEPT/DROPPED disposition.
