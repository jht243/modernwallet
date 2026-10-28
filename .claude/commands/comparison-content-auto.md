---
description: AUTONOMOUS comparison candidate miner. Mines the site's own entities for X-vs-Y, alternatives, successor-vs-predecessor and objective roundup candidates, drops everything already covered, and hands the rest to /mindmap-pass as a brief. NO human gates.
argument-hint: "[optional N = max candidates to send this run; default = all NEW + PARTIAL]"
---

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->


# /comparison-content-auto — comparison candidates → /mindmap-pass

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


**Topic-selection priority:** Relevant organic-click growth is the default; do not infer a lead-generation goal from services, commercial intent, CPC, or audience segments. Commercial value only breaks close ties unless the user explicitly requests lead generation. Carry this priority into the mindmap brief when this routine delegates selection; do not add a separate scoring or filtering step to a candidate-only miner. This applies to scheduled runs as well as manual runs.


> **‼️ AUTONOMOUS.** No human checkpoint. Never print "Approve?". Nothing new → email a Success Without Changes report, exit 0.
> Run `.claude/scripts/deploy-run-to-main.sh mark` FIRST, before any commit.

## STEP 1 — Harvest
Read and follow, in order (free, local only — no paid keyword calls in this step):
1. `.claude/commands/comparison-content-creator/phase-0-discover.md` — entities, categories, segments, slug conventions. A hard blocker → email a failure report, exit 0.
2. `.claude/commands/comparison-content-creator/phase-1-candidates.md` — every lane: versus pairs, `X vs Y for <segment>`, successor-vs-predecessor, and roundups expanded into angle × audience variants per `.claude/commands/_roundup-blend.md`. Prune cache losers (`reports/comparison-content-creator/cache.json`) as that file says.
3. `.claude/commands/comparison-content-creator/phase-1b-coverage-check.md` — tag every candidate NEW / PARTIAL / DUPLICATE against the site's existing pages.

0 NEW + 0 PARTIAL → send the Success Without Changes email (below), exit 0.

Keep the first N (`$ARGUMENTS`, default all); the rest re-surface next run.

## STEP 2 — Send them all
Every NEW and PARTIAL candidate goes into the brief as returned: format (`versus` / `alternatives` / `roundup`), option A / option B or category + angle, segment, primary keyword, proposed slug, and — for PARTIAL — the existing route that covers it in passing. No filtering, no scoring, no judging.

## STEP 3 — Run /mindmap-pass with that brief
Start the brief with these lines, verbatim, then the candidates:

> Source: comparison candidate miner for <BASE_URL>. Each item is an X-vs-Y, alternatives, successor-vs-predecessor or objective roundup candidate mined from entities this site already covers, and already checked against the site's pages: NEW = no page covers it; PARTIAL = an existing page covers it in passing (enrich that page, never a duplicate). Comparison rows use the `comparison table/database` format; roundups are objective and the business is never a ranked option (`.claude/commands/_roundup-blend.md` §3).
> Unattended run: save the chart to `reports/mindmap-pass/<YYYY-MM-DD>-comparison.md` (this exact name, so it never collides with another mindmap run today), treat the Phase 0 manifest as approved, and continue to Phase 9 without stopping.

```
/mindmap-pass <the brief>
```
Mindmap validates demand, builds, audits, publishes and emails the report — this routine does not score or write anything.

## STEP 4 — Cache
From the finished chart, add every candidate mindmap dropped (weak demand, duplicate, off-mission, failed audit) to `reports/comparison-content-creator/cache.json` (its `dropped` list, with the reason and today's date) so the next run skips it. Commit the cache and deploy with `.claude/scripts/deploy-run-to-main.sh push`.

## Success Without Changes email
```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
.claude/scripts/send-routine-email.py --status no-changes --skill comparison-content-auto \
  --site "<BASE_URL>" --repo "$REPO" --branch "$(git rev-parse --abbrev-ref HEAD)" \
  --summary "All <M> candidates already covered or cached; nothing sent to mindmap." \
  --commit-sha "" --commit-url ""
```
Best-effort: a failed email never fails the run.
