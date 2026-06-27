# Phase 7 — Sitemap + IndexNow

## Worker
1. Add every Phase-3 route to the correct sitemap (per the discovered route→file routing) with today's `<lastmod>`.
2. Refresh `<lastmod>` to today **only for pages with a substantive change** — i.e. modified in Phase 2 (metadata), Phase 3 (new), or Phase 5 (body). **Do NOT bump `<lastmod>` for a page whose only change this run was a Phase 6 internal link** — a link-only touch is not a content change, and stamping lastmod on it trains Google to distrust your lastmod signal and deprioritize crawls. (If a page got both a substantive edit AND a link, it counts as substantive — refresh it.)
3. Consolidation is advisory-only now, so there are normally no removed routes. If `reports/keyword-pass/<date>.consolidation.txt` exists (legacy) remove those routes; otherwise skip this step.
4. **Prepare the IndexNow URL list — do NOT submit here.** Write the added + updated routes (full URLs, NOT removed losers) to `reports/keyword-pass/<date>.indexnow.txt`, one URL per line. The actual IndexNow POST now happens in **Phase 9, after push + deploy**, so we only ever ping search engines with URLs that are already live (submitting a not-yet-deployed URL makes crawlers hit 404s and wastes crawl budget). If no IndexNow key was discovered in Phase 0, note that submission will be skipped.
5. `git add`. Do not commit.

## Reviewer checklist
- ☐ each new route in exactly one correct sitemap, lastmod=today
- ☐ lastmod=today on every **substantively** changed page (Phase 2/3/5); **no lastmod bump on link-only (Phase 6) pages**
- ☐ no consolidation losers to remove (advisory-only), or any legacy `.consolidation.txt` routes removed
- ☐ IndexNow URL list written to `<date>.indexnow.txt` (added + updated only, no losers); **no submission made in this phase** — it is deferred to Phase 9 post-deploy

Reject with specifics on any failure.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/keyword-gap-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).
