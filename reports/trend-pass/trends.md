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
| _(none yet)_ | | | | | | |
