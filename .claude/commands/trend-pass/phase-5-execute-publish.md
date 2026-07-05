# Phase 5 — Execute (capped) + publish

## 1. Apply the cap
Take the first **5** surviving candidates by evidence rank. Everything past 5 is **flagged in the digest as "over cap — not built" and dropped** — NOT queued (the trend is marked caught after this run; no backlog). Body-enrichment suggestions are flagged, not built.

## 2. Write the content — additive, via the repo's own approach
Discover this repo's add-a-page mechanism (Phase 0 site-facts): an additive data file / markdown / content dir, or a bundled generator. Use `.claude/commands/seo-gsc-pass/phase-3-new-content.md` VERBATIM as the writing prompt, then audit via `phase-4-audit.md`. Constraints:
- **Additive only** — new routes only; never edit/rewrite an existing page.
- Match the site's existing page shape, voice, internal-link patterns, and any CTA/disclosure standard.
- **YMYL** (finance/legal/health): ground every factual claim in the repo's own sourced content; never invent figures/statutes/advice. If a claim can't be grounded, drop the page (flag it) rather than guess.
- Pages failing audit after 2 retries are reverted (flagged, "failed audit"); a partial batch still ships.

## 3. Sitemap + build check
Update the sitemap for new routes (follow the repo's existing generation — do NOT hand-edit if build-generated). Run the repo's typecheck/build if present; mechanical fixes only, else revert the offending page.

## 4. Ledger writes (before the commit)
- `reports/trend-pass/ledger.md`: append **KEPT** (built + shipped) and **DROPPED** (Phase 4 / over-cap / audit-fail) rows. NO DEFERRED status.
- `reports/trend-pass/trends.md`: the new trend row was added in Phase 1 (status `MINED`) — fill its "Coverage / pointers" with the pages shipped.
- Save `reports/trend-pass/<YYYY-MM-DD>.md` (trend verdict, classification, candidates + outcomes).

## 5. Stale-base check → commit → push
Other crons commit mid-run. `git fetch origin && git status`; after staging your files by explicit pathspec, `git diff --cached HEAD --numstat` must show NO deletions you didn't make. Single commit `trend-pass-auto <date>: <trend> — N pages (cap 5)`; push per the trigger (publish-to-main override).

## 6. Verify 200s + IndexNow
After deploy settles (poll a few min), curl each new URL — all 200 before IndexNow. Submit new URLs to IndexNow (fallback key in the orchestrator). Non-200 → report, skip from IndexNow, do NOT roll back.

## 7. Digest
Assemble the details file and send per the orchestrator's Email section.
