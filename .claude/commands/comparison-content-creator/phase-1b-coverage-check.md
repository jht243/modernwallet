# Phase 1b — Coverage check (anti-duplication) — FREE, local only

**This is the API-cost gate.** No keyword API call has happened yet, and none may happen until a candidate clears this phase. Check every candidate from Phase 1 against **ALL existing content** discovered in Phase 0 — not just comparison slugs — so the workflow never reproduces or cannibalizes content the site already has. This is pure local work (file/string/semantic comparison); zero external calls.

## Sources to check against
The full content inventory from Phase 0: existing comparison pages, guides, vertical/industry pages, landing pages, and their **target keywords + H1s + section headings + body text** where available. Do not limit the check to the comparisons collection.

## Three checks per candidate

1. **Exact / reverse slug match.** Candidate slug — or its reverse (`a-vs-b` ≡ `b-vs-a`), with/without the `-for-segment` suffix — already exists as a route → **DUPLICATE**.
2. **Entity-pair already covered inside a page.** Both entities are already compared head-to-head *within* an existing page — e.g. a guide section literally titled "X vs Y", or a 3-way comparison (`X vs Y vs Z`) that already subsumes this pair, or a vertical page with an "X vs Y for [this segment]" block → **DUPLICATE** (subsumed) or **PARTIAL** (covered only in passing).
3. **Semantic keyword overlap (cannibalization).** The candidate's `primaryKeyword`/topic substantially matches an existing page's target keyword or H1 (string similarity + meaning, the same cannibalization logic as `seo-gsc-pass`/`keyword-gap-pass` Phase 1). Two pages chasing the same query split each other's ranking → **DUPLICATE** or **PARTIAL** depending on how complete the existing coverage is.

## Tag every candidate
- **`NEW`** — no meaningful existing coverage. Proceeds to Phase 2.
- **`PARTIAL`** — covered in passing inside another page. Do NOT create a new page; instead build an **actionable enrichment work-item** — the exact existing route + file, the entity pair, and *what's missing* (no head-to-head table, no verdict, only named in a sentence, covered for a different segment, etc.) — and hand it forward to **Phase 3b**, which spot-edits that page in place. (It still appears in the Phase 6 summary, but it is now executed, not merely suggested.)
- **`DUPLICATE`** — already covered. Drop. Record the conflicting URL.

## Output
- Record the Coverage tag + conflicting slug for **every** candidate (NEW/PARTIAL/DUPLICATE) — this is the **Coverage** column of the mandatory Candidate Chart (see launcher). **Nothing is silently dropped**: PARTIAL and DUPLICATE rows stay in the chart with their conflicting slug. PARTIAL rows are NOT published as new pages — they are **enriched in place by Phase 3b**; DUPLICATE rows are neither published nor enriched.
- Pass **only `NEW` candidates** to Phase 2 for scoring. **`PARTIAL` candidates are NOT scored** (the API-cost gate keeps paid scoring to NEW pairs) but their enrichment work-items are carried forward to **Phase 3b** for execution. `DUPLICATE` rows are display-only. You may still show any already-known Vol/KD for PARTIAL/DUPLICATE rows in the chart.
- In the phase summary, state explicitly: `API calls this phase: 0 — local only`, `Reached scoring: <N NEW> of <M candidates>`, and `Enrichment work-items → Phase 3b: <P PARTIAL>`. Auto-continue.
