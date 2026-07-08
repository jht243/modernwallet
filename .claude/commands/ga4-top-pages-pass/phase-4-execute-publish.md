# Phase 4 — Execute (capped) + publish

Four action types ship from this phase: **new pages** (lanes A/B), **body/FAQ enrichments** (lane C), **metadata rewrites** (lane D), **on-page tools** (lane E). No trend ledger exists in this pass — the two ledgers are the shared candidate ledger and this pass's page-audit ledger.

## 1. Apply the cap (the only one — per source page)
- **≤10 new pieces of content per audited page** (new pages + tools spawned from that page's audit, combined): take that page's top 10 such survivors by evidence rank; anything beyond 10 for that page → append to `reports/trend-pass/ledger.md` as **DEFERRED** (tagged `source: ga4-top-pages`, with the source page's route), drained via Phase 1's deferred-drain path, still re-passing Phase 3 first.
- **No other cap.** Enrichments and metadata rewrites are edits to existing pages (not "new pieces of content"), so they are not bounded by the per-page 10 and have no run-wide ceiling — every enrichment/metadata/tool candidate that cleared Phase 3 ships. A metadata rewrite still requires that page's GSC `underperforming` + `rewrite_recommended` verdict (Lane D's trigger, quoted in the digest) — that is a correctness condition, not a numeric cap.

## 2. Write the content — EVERY action passes BOTH Stage 3 and Stage 4 (no exceptions)
Every action type below — **new pages, enrichment sections, metadata rewrites, AND tools/quizzes** — must go through both stages before it can reach the commit:
- **Stage 3 (write):** author it per the verbatim content-generation prompt guide in `.claude/commands/seo-gsc-pass/phase-3-new-content.md` **if that skill is present in this repo**; otherwise apply the equivalent standard inline — research-first, E-E-A-T, real answers, correct internal linking, the site's voice.
- **Stage 4 (audit):** it must then clear the adversarial audit in `.claude/commands/seo-gsc-pass/phase-4-audit.md` **if present**; otherwise run an equivalent adversarial review inline (a reviewer that did not write it tries to find thin/wrong/duplicate content and rejects on any hit).

Anything that fails Stage 4 after 2 retries is reverted + logged **DROPPED** ("failed audit"); a partial batch still ships. Nothing — not even a single metadata title or a tool — ships without passing both stages.

Per action type (how the two stages apply):
- **New pages** — Stage 3 writes the page: follow existing sibling structure exactly; include the site's standard inline CTA below the first body section if it has one; wire the page into the site's hub/sibling link structure the way its existing siblings do (e.g. a model-hub resolver like `src/utils/modelHub.ts` on sites that track models — hub-side links added additively); comparison/worth-it pages follow the site's comparison format. Stage 4 audits it.
- **Enrichments** — Stage 3 writes each new section (APPEND only — new FAQ entries / new H2 blocks; never rewrite, reorder, or delete existing copy; each section must actually ANSWER its sub-intent; add an internal link to any related dedicated page). Stage 4 audits every new section.
- **Metadata** — Stage 3 drafts the title/meta-description per the standard's metadata guidance, grounded in the page's real GSC `top_queries`. Stage 4 audits it — the new title must match the page's actual intent AND the `underperforming` evidence, or it's DROPPED. ‼️ `canonicalOverride` must NEVER be set to `undefined` anywhere (breaks the entire static export — every page 404s; tsc cannot catch it).
- **Tools / quizzes** — Stage 3 writes all on-page copy (intro, instructions, result text) per the content standard; the interactive logic follows `downloadable-asset-pass/phase-3c-tool-build.md` if present, else a clean client-side build (real working logic, no fake outputs; no new deps, no secrets; embedded on the winning page or its own route with a prominent link from the winner). Stage 4 = the adversarial copy audit PLUS a logic check (`downloadable-asset-pass/phase-4-audit.md` if present, else verify correct outputs on sample inputs + no console errors); failing EITHER → revert + DROPPED.

## 3. Sitemap + build check
Update the sitemap for new routes (follow the repo's generation — don't hand-edit if build-generated). Run typecheck AND `next build` (Node 20) — the undefined-serialization hazard makes tsc alone insufficient. Mechanical fixes only; otherwise revert the offending change (digest: "build revert").

## 4. Ledger writes (before the commit, so they ship in it)
- `reports/trend-pass/ledger.md`: one row per candidate touched — **KEPT** / **DROPPED** (+reason) / **DEFERRED** (over-cap only), all tagged `source: ga4-top-pages`.
- `reports/trend-pass/ga4-page-audits.md`: one row per page audited tonight — route, date, views-at-audit, per-lane action counts, deferred remaining. This is what enforces the 7-day cooldown next run.
- Run report `reports/trend-pass/<YYYY-MM-DD>.ga4.md`: per-page verdict table, lane outcomes, candidate dispositions.

## 5. Stale-base check → commit → push (concurrent-cron clobber hazard)
Radar crons commit to main mid-session. Before committing:
```bash
git fetch origin && git status
git diff --cached HEAD --numstat   # NO deletions you didn't make
```
Remote moved → rebase/re-stage so the commit contains ONLY this run's changes. Any staged deletion of an untouched file = stale base — fix first. Single commit:
`ga4-top-pages-pass <date>: N new pages, M enrichments, K metadata, T tools across P audited winners`, then deploy to the authorized branch: `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (see the launcher's Git model — `main` is this repo's authorized nightly deploy path). This runs only after the Phase 4 audit passed.

## 6. Verify 200s + IndexNow
After the deploy settles, `curl -s -o /dev/null -w "%{http_code}"` every new AND every edited URL — all must be 200 before IndexNow (an enrichment that 404s its page is a rollback, not a skip: revert that page's change, re-push). Submit new + changed URLs to IndexNow (fallback key block in the orchestrator). Other non-200s: digest + skip from IndexNow, do NOT roll back the whole run.

## 7. Digest
Assemble the details file and send per the orchestrator's Email section.


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.
