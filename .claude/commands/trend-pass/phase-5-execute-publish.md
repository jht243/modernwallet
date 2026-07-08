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


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.
