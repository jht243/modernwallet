---
description: AUTONOMOUS weekly keyword-gap routine. Refreshes the competitor set live, pulls the keywords competitors rank for and we don't, and hands them to /mindmap-pass as a brief. NO human gates.
argument-hint: "(no arguments — fully autonomous)"
---

<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
<!-- /workflow-source-freshness-v1 -->


# /keyword-gap-pass-auto — competitor keyword gap → /mindmap-pass

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
