---
description: AUTONOMOUS weekly keyword-gap routine. Refreshes the competitor set live, pulls the keywords competitors rank for and we don't, and hands them to /mindmap-pass as a brief. NO human gates.
argument-hint: "(no arguments — fully autonomous)"
---

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->


# /keyword-gap-pass-auto — competitor keyword gap → /mindmap-pass

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


> **‼️ AUTONOMOUS.** No human checkpoint. Never print "Approve?".
> Run `.claude/scripts/deploy-run-to-main.sh mark` FIRST, before any commit.

## STEP 1 — Harvest
Run **Step A** (refresh the competitor set live) and **Step B** (Lens 1 competitor gap + Lens 2 whitespace) of `.claude/commands/keyword-gap-pass/phase-build-keywords.md`, with its API-budget rules, every command in the FOREGROUND with a Bash timeout of 600000. Stop before Step C — mindmap does the classifying and dedup. Persist the refreshed competitor set as that file says, and save the raw opportunity table (keyword · volume · KD · competitors ranking · lens) to `reports/keyword-pass/<TODAY>.raw.md`.

Both keyword engines returned nothing → email `failure` naming the API error, exit 0.

## STEP 2 — Send them all
The raw opportunity table goes into the brief whole. No filtering, no judging.

## STEP 3 — Run /mindmap-pass with that brief
Start the brief with these lines, verbatim, then the table:

> Source: weekly competitor keyword-gap pull for <BASE_URL> (competitors: <list>). Every keyword carries measured volume/KD from the gap engine — use those figures, do not re-pull them. Low-difficulty on-intent `adjacent` terms are not deprioritized.
> Unattended run: save the chart to `reports/mindmap-pass/<YYYY-MM-DD>-keyword-gap.md` (this exact name, so it never collides with another mindmap run today), treat the Phase 0 manifest as approved, and continue to Phase 9 without stopping.

```
/mindmap-pass <the brief>
```

Mindmap does everything from here — research, dedup, writing, audit, build, commit, push, 200-verify, IndexNow, report. Afterwards, add every keyword it shipped to `reports/seo-research/target-keywords.md` (Step E of `phase-build-keywords.md`), commit, and `.claude/scripts/deploy-run-to-main.sh push`.
