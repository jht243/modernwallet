# Phase 5 — Execute (capped) + publish

## 1. Apply the cap (PER LANE — each lane gets its own 5)
The cap is **5 new pages per lane, not 5 total.** Rank each lane's survivors separately and take the first **5 of the trend lane** and the first **5 of the coverage lane** — up to **10 pages/run** when both are full. A lane never eats into the other's budget. Body-enrichment suggestions are flagged, not built (they don't count).

Everything past a lane's 5 is **flagged in the digest as "over cap — not built"**, and the two lanes differ on what that means:
- **Trend-lane over-cap → permanently dropped** (log DROPPED in the ledger). The trend is marked caught after this run; no backlog.
- **Coverage-lane over-cap → NOT ledgered, eligible again next run.** The query is still genuinely uncovered demand, so leave it out of `ledger.md` — Phase 1b re-surfaces it next run and a large cluster completes over several runs. The one sanctioned carry-over.

## 2. Write the content — additive, via the repo's own approach
Discover this repo's add-a-page mechanism (Phase 0 site-facts): an additive data file / markdown / content dir, or a bundled generator. Use `.claude/commands/seo-gsc-pass/phase-3-new-content.md` VERBATIM as the writing prompt, then audit via `phase-4-audit.md`. Constraints:
- **Additive only** — new routes only; never edit/rewrite an existing page.
- Match the site's existing page shape, voice, internal-link patterns, and any CTA/disclosure standard.
- **YMYL** (finance/legal/health): ground every factual claim in the repo's own sourced content; never invent figures/statutes/advice. If a claim can't be grounded, drop the page (flag it) rather than guess.
- Pages failing audit after 2 retries are reverted (flagged, "failed audit"); a partial batch still ships.

## 3. Sitemap + build check
Update the sitemap for new routes (follow the repo's existing generation — do NOT hand-edit if build-generated). Run the repo's typecheck/build if present; mechanical fixes only, else revert the offending page.

## 4. Ledger writes (before the commit)
- `reports/trend-pass/ledger.md`: append **KEPT** (built + shipped, either lane) and **DROPPED** (Phase 4 / audit-fail / **trend-lane** over-cap) rows. **Exception:** a **coverage-lane over-cap** candidate is NOT written here (see §1 — it stays eligible next run). NO other DEFERRED status.
- `reports/trend-pass/trends.md`: **only if a NEW trend fired this run** — the trend row was added in Phase 1 (status `MINED`); fill its "Coverage / pointers" with the pages shipped. On a coverage-only run (no new trend), do NOT touch `trends.md`.
- Save `reports/trend-pass/<YYYY-MM-DD>.md` (trend verdict, coverage verdict, classification, candidates + outcomes).

## 5. Stale-base check → commit → push
Other crons commit mid-run. `git fetch origin && git status`; after staging your files by explicit pathspec, `git diff --cached HEAD --numstat` must show NO deletions you didn't make. Single commit `trend-pass-auto <date>: <trend | coverage gap> — N pages (T trend / C coverage, cap 5/lane)`; push per the trigger (publish-to-main override).

## 6. Verify 200s + IndexNow
After deploy settles (poll a few min), curl each new URL — all 200 before IndexNow. Submit new URLs to IndexNow (fallback key in the orchestrator). Non-200 → report, skip from IndexNow, do NOT roll back.

## 7. Digest
Assemble the details file and send per the orchestrator's Email section.


