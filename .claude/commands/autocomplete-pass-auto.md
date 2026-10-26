---
description: AUTONOMOUS weekly Autocomplete routine. Mines Google Autocomplete from fresh seeds and hands the completions to /mindmap-pass as a brief. NO human gates.
argument-hint: "[optional: comma-separated seed phrases to mine]"
---

<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
<!-- /workflow-source-freshness-v1 -->


# /autocomplete-pass-auto — Google Autocomplete → /mindmap-pass

> **‼️ AUTONOMOUS.** No human checkpoint. Never print "Approve?". No fresh seeds → exit 0 silently.
> Run `.claude/scripts/deploy-run-to-main.sh mark` FIRST, before any commit.

## STEP 1 — Harvest
Run STEPs 1–3 of `.claude/commands/autocomplete-pass.md` exactly: discover the project, pick 3–6 seeds (or `$ARGUMENTS`) not mined in the last 14 days, and run the miner per seed (FOREGROUND, Bash timeout 600000):
```bash
python3 .claude/tools/autocomplete-paa/autocomplete.py --seed "<seed>" --mode all \
  --inventory <target-keyword inventory> --csv reports/keyword-pass/<TODAY>.autocomplete.<seed-slug>.csv
```
0 fresh seeds → exit 0.

## STEP 2 — Send them all
Every completion from every seed's CSV goes into the brief as returned (seed, completion, how it was found). No filtering, no judging.

## STEP 3 — Run /mindmap-pass with that brief
Start the brief with these lines, verbatim, then the completions:

> Source: Google Autocomplete mining for <BASE_URL> (seeds: <list>). Completions are real live searches; keyword tools lag them, so zero measured volume does not veto a completion on its own.
> Unattended run: save the chart to `reports/mindmap-pass/<YYYY-MM-DD>-autocomplete.md` (this exact name, so it never collides with another mindmap run today), treat the Phase 0 manifest as approved, and continue to Phase 9 without stopping.

```
/mindmap-pass <the brief>
```

Mindmap does everything from here — research, dedup, writing, audit, build, commit, push, 200-verify, IndexNow, report. Nothing after it.
