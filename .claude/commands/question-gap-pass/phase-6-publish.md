
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 6 — Stage + push the enriched pages

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


The user approved at the Phase 3 gate and Phase 5 confirmed quality, so this phase stages and ships in one pass — no second human stop. Only pages that survived Phase 5 are included.

## Steps

1. **Sitemap lastmod bump.** For each enriched page, update its existing `<lastmod>` in the discovered sitemap file(s) to today. **Do NOT add new `<url>` entries** — these pages already exist. If Phase 0 found a sitemap helper (e.g. `add_sitemap`/a regenerator), use it; otherwise edit the `<lastmod>` in place.

2. **Typecheck / build.** Run the discovered command (e.g. `npx tsc --noEmit` or `npm run build`). If it fails:
   - Fix it if the cause is an obvious mechanical slip in your edit (wrong field key, stray comma, unclosed tag).
   - If it still fails, **revert the offending page's edit** (restore byte-for-byte), re-run the check, and record the page as "reverted — typecheck." Never push a red tree.

3. **Commit.** Stage only the enriched source files + sitemap changes. Use the project's commit convention with a clear message, e.g.:
   ```
   feat(question-gap-pass): answer high-value follow-up questions on top <N> pages

   Added <A> FAQ/sections, strengthened <S>, linked <L> across <P> top-traffic pages.
   ```
   End with the project's `Co-Authored-By` line if it has one. Never commit secrets or `.env`. Never pass `--no-verify`.

4. **Push.** Push to the project's default branch (`main`) per its git flow. A manual local run may already be on `main`. **Autonomous variants (`/question-gap-pass-auto` and other `*-auto` cloud routines) deploy to `main` via `.claude/scripts/deploy-run-to-main.sh push`** per their launcher's Git model — never leave the enriched content on an unmerged ephemeral branch. Never force-push.

5. **IndexNow.** Ping IndexNow for the **enriched URLs only** (they changed; unchanged pages are not submitted). Reuse the discovered IndexNow helper/key; if no key exists, skip and flag it in the summary.

6. **Update cache.** Confirm `reports/question-gap-pass/cache.json` records every page analyzed + every section added this run, so future runs don't re-suggest them.

## Final report (print after pushing)
```
## /question-gap-pass — run complete
- Pages analyzed: <P> (top by GSC clicks)
- Follow-up questions generated: <G>
- Sections added: <A> · Strengthened: <S> · Internal links: <L> · Skipped: <K>
- Reverted (failed audit/typecheck): <list, or none>
- Per page: <route> → +<a> add / <s> strengthen / <l> link
- Commit: <SHA>
- IndexNow: <enriched URLs submitted, or "skipped — no key">
- cache.json: reports/question-gap-pass/cache.json
```

This phase ends the run. No further human stop.
