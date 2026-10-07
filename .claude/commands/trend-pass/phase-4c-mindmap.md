# Phase 4c — Mindmap lane (Lane C — the ONLY builder, EVERY run)

**Owner design (layer3 2026-10-05, ported here 2026-10-06):** Lanes A and B research; mindmap builds. Every run, mindmap gets the top-10 queries (7-day window) plus the research pack from Phase 4 as its brief, and decides what ships. It runs even when the research pack is empty.

## Owner decisions — do not relitigate
- **Inline, same run.** No separate routine, no handoff file beyond the research pack.
- **Mindmap decides scope.** It may drop or reshape any Lane A/B finding (it usually won't). This pass adds no winner-protection filter of its own — mindmap's process handles it.
- **Cap: 25 new pages per run TOTAL** (one shared budget across all lanes).

## Still binding (run-wide guardrails)
- **No metadata rows** — drop any `update existing metadata` row from the chart; never run mindmap phase-2.
- **No consolidation/redirects** — mindmap phase-1 runs in its ADVISORY form only (writes no edits); drop any row that would 301/canonicalize.
- **Additive only** — `update existing body text` rows ADD a section via `content_gen.py section`; never rewrite existing copy. `add internal links` rows are allowed.
- **Format guard** — only `article` / `comparison table/database` rows are auto-built; tool/calculator/quiz/template rows go to the digest as flagged specs (`reports/mindmap-pass/specs/<slug>-spec.md`). **On this calculator site:** a new spoke page in a `src/data/spokes-*.ts` registry that reuses an EXISTING `src/lib/*` engine unmodified (the 2026-07-13 `retirement/ira-early-withdrawal-calculator` precedent) counts as an `article` row; any row that needs new or changed calculator code in `src/lib/*` / `src/components/*` is a spec, never built here.
- **Prose rule + audit invariant** — API writer only (`scripts/lib/content_gen.py`); every output audited before it ships.

## Finance / YMYL guardrails (BINDING — this is a personal-finance site)
These come from `CONTENT.md` and `_content-standard.md` and override any mindmap default that conflicts:
- **Numbers come from the engine, never the writer.** Every payment, interest, balance, rate-of-return or tax figure on a page MUST be computed ahead of time with the site's real `src/lib/*` calculator engine (Node runs the `.ts` directly) and handed to the writer in the closed fact list. The writer never invents or recomputes a figure; the audit checks every figure against that ground truth exactly.
- **Primary sources only** for rates, limits, statutes and rules — CFPB, Federal Reserve / FRED, IRS, FTC, SEC, BLS, Experian, or the regulator/vendor's own page — current-year, URL verified to load. Never an aggregator or SEO blog.
- **Never invent** a figure, rate, contribution limit, tax bracket, statute, fee, lender term or piece of advice. A fact that can't be grounded drops the row (ledger DROPPED, "non-groundable YMYL fact") — a relevant omission beats a guessed number.
- **No personalized advice.** Pages explain the math and the tradeoff; they don't tell a reader what to buy, sell or borrow.
- **Authorship + disclaimer:** byline and Person JSON-LD are template-rendered (`Byline.astro`, `src/lib/jsonld.ts`) from the record's date fields — never a "reviewed by" line in body prose. Any "not financial advice" disclaimer sits at the bottom of the page, never the top (`_content-standard.md`).
- **Comparisons and roundups stay objective** — no option is the automatic winner; affiliate/partner wiring (`src/data/partners.ts`) is handled by the templates, never by body prose.

## 1. Build the brief
Two parts, in this order:

1. **Top-10 queries** — `top_queries[10]` from the Phase 0 pull JSON (7-day window), verbatim, in click order, each with clicks/impressions/position and the `top_pages[10]` page it lands on (if known).
2. **Research from Lanes A/B** — paste the research pack (`reports/trend-pass/<YYYY-MM-DD>.research.md`) in full: the trend verdict, trend gap findings, and uncovered top-20 queries with their suggested angles.

Interpreted-brief line: *"Our 10 top-clicking Google queries for the 7 days ending <data_date>, plus our own research on what's trending and what's missing. Build what this demand implies the site lacks — new pages and missing sections on the pages these queries already land on. Treat the research findings as strong suggestions: they came from our own search data and passed an existence check, so drop one only for a real reason."*

## 2. Build the chart (mindmap BUILD-BRIEF, autonomous)
Read `.claude/commands/mindmap-pass/phase-0-discover.md` for its site-fact discovery and chart parsing only (content store = the `src/data/*.ts` registries; business name "The Modern Wallet"). **Its manifest gate is skipped** — the run is autonomous.

Read and follow `.claude/commands/mindmap-pass/phase-build-brief.md` with the brief above, with these overrides:
- **Chart filename:** `reports/mindmap-pass/<TODAY>-trend-lane-c.md` — NEVER the bare `<TODAY>.md` (another mindmap routine may own it). Cache files use the same `<TODAY>-trend-lane-c.` prefix.
- **No human gate**, and BUILD-BRIEF's "no input → STOP and ask" rule does not apply: the brief above is the input.
- **Lens 3b (model-launch overlay) is skipped** — this is not an AI-content repo.
- Tag every chart row with its source: `trend` (from a Lane A finding), `coverage` (from a Lane B finding) or `top-10` (from the queries directly). The digest groups by this tag.
- Keep mindmap's adversarial duplicate-suppression reviewer — it is the final dedup.

## 3. Ledger check + cap
- Drop any `create new content` row whose slug/intent is KEPT or DROPPED in `reports/trend-pass/ledger.md`.
- Rank surviving `create new content` rows in mindmap's own row order. Take the first **25**. Past 25 → digest "over cap — not built", **NOT ledgered** (re-competes next run). Enrichments and internal-link rows don't count against the cap.

## 4. Execute (mindmap phases)
Read each file; do not paraphrase:
- `.claude/commands/mindmap-pass/phase-1-consolidation.md` — advisory only; record flagged pairs for the digest.
- `.claude/commands/mindmap-pass/phase-3-new-content.md` — new pages (API generation via `content_gen.py`, `--format json` against the `src/data/*.ts` page shape; includes the monetization check). Compute engine ground truth BEFORE generating (guardrails above).
- `.claude/commands/mindmap-pass/phase-5-body.md` — additive section enrichments only (its own reviewer gate audits each addition).
- `.claude/commands/mindmap-pass/phase-6-internal-linking.md` — additive links only (markdown `[text](/path/)` inside content strings; `linkify()` renders them).
- `.claude/commands/mindmap-pass/phase-4-audit.md` — adversarial audit on every new page, including the number-accuracy check against engine ground truth. 2 failed reworks → revert that row, ledger it DROPPED ("failed audit"), move on.

Do **NOT** run mindmap's phase-2 (metadata), 7, 8 or 9 — Phase 5 of this pass does the build check, ledgers, the one commit, deploy, 200-verify, IndexNow and the digest.

## 5. Hand-off to Phase 5
Pass: pages shipped, enrichments, over-cap rows, flagged non-article rows (specs), cannibalization advisory, and every dropped row with its reason — each tagged with its source (`trend` / `coverage` / `top-10`). Also the keyword demand-ladder rung BUILD-BRIEF used.
