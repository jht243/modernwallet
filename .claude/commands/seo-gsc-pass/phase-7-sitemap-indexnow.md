
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 7 — Sitemap + IndexNow

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


## Worker
1. Add every Phase-3 route to the correct sitemap (per the discovered route→file routing) with today's `<lastmod>`.
2. Refresh `<lastmod>` to today **only for pages with a substantive change** — i.e. modified in Phase 2 (metadata), Phase 3 (new), or Phase 5 (body). **Do NOT bump `<lastmod>` for a page whose only change this run was a Phase 6 internal link** — a link-only touch is not a content change, and stamping lastmod on it trains Google to distrust your lastmod signal and deprioritize crawls. (If a page got both a substantive edit AND a link, it counts as substantive — refresh it.)
3. Consolidation is advisory-only now, so there are normally no removed routes. If `reports/seo-pass/<date>.consolidation.txt` exists (legacy) remove those routes; otherwise skip this step.
4. **Prepare the IndexNow URL list — do NOT submit here.** Write the added + updated routes (full URLs, NOT removed losers) to `reports/seo-pass/<date>.indexnow.txt`, one URL per line. The actual IndexNow POST now happens in **Phase 9, after push + deploy**, so we only ever ping search engines with URLs that are already live (submitting a not-yet-deployed URL makes crawlers hit 404s and wastes crawl budget). If no IndexNow key was discovered in Phase 0, note that submission will be skipped.
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

The `/seo-gsc-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).
