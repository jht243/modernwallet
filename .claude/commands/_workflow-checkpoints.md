# Workflow checkpoints — complete instructions and evidence of application

These are substeps of the existing workflow, not new phases or human gates. Preserve scope, professional review, local exclusions, schedules and the Phase 0 approval. A delivery log proves only that text was emitted; it does not prove comprehension, correct application, independent review or permission to publish.

## Startup and complete reading

Run `bash .claude/tools/workflow-start.sh` directly as a standalone command (add `--cloud` in cloud). Inspect its actual exit status. Never pipe it through `tail`, `head`, `tee` or another command, chain past failure, or treat a checkbox as proof. The wrapper's internal pipefail cannot protect its caller's pipeline.

Before chart research/planning, substantive writing/enrichment, independent audit and publication, prepare the applicable instruction bundle:

```bash
python3 .claude/tools/workflow-preflight.py prepare --phase build --instruction .claude/commands/mindmap-pass/phase-build-brief.md --run-dir reports/mindmap-pass/<run-id>/preflight-build
python3 .claude/tools/workflow-preflight.py next --run-dir reports/mindmap-pass/<run-id>/preflight-build
python3 .claude/tools/workflow-preflight.py check --run-dir reports/mindmap-pass/<run-id>/preflight-build
```

Use `write`, `audit` or `publish` and the actual current phase file at the corresponding existing checkpoint. Other content routines supply their own phase instruction; repeat `--instruction` for additional caller rules. Cloud prepare also takes `--cloud`. Use a unique directory per run, actor and phase. Preparation runs startup verification internally and stops on its real return code. Missing required files block the affected work; global routines must first install the sibling shared contracts/helper into the active project while preserving its local standards and permissions.

Run `next` **once per tool call**, read that complete chunk, then repeat until all chunks are read. Do not batch outputs, pipe/truncate them, use byte counts/head excerpts as reading, or summarize an unread source. If the tool itself truncates a result, reread that part with `--part N` before advancing. `check` must succeed before dependent work; it rejects incomplete delivery, changed chunks, changed source files and newly added local overrides. If rules change, prepare/read a fresh bundle and reconcile already prepared artifacts. The independent reviewer loads its own audit bundle; it cannot inherit the writer's reading claim. This complete-reading protocol supersedes older directions to use only `load-standards.sh`. Its legacy ledger receipt is still allowed for compatibility, but is not a substitute for these checks and does not require a second reading of unchanged rules.

Record a concise application map in the existing run notes: exact source hashes from the bundle, this site's permissions/exclusions/review obligations, applicable reader/evidence/takeaway/label rules, and the artifact or concrete decision that implements each. Use an explicit reason for genuinely inapplicable rules. A list of rule names or yes/no ticks without evidence does not pass review. Do not fabricate evidence merely to fill a field.

## Chart gate: discovery coverage and relevance

The existing independent chart reviewer verifies the build bundle check and application map, then checks saved raw keyword results, not only the author's conclusions:
- `expand --limit N` bounds each source separately: up to N provider ideas plus N unique autocomplete ideas, at most 2N. Default N is 20. Sixty is a caller-selected batch size, not a provider requirement, page quota, coverage guarantee or SEO threshold. Existing provider pins and spending caps still apply.
- Record chosen limits, returned counts by source, deduplication, on-topic accepted/rejected counts, omitted families and the reason to stop or widen. Never claim exhaustive coverage from a capped response. Autocomplete remains estimated until exact-phrase metrics are obtained; preserve provenance on duplicates.
- Reject off-topic broad matches even if they have high volume. Judge relevance against the brief's entity, jurisdiction, audience and reader decision. Do not silently use a global lexical filter that discards valid synonyms or adjacent intent.
- If the cap is reached and a plausible on-topic question family remains unexplored, use cached results, the free question-prefix sweep or a narrower seed first. Increase the per-source limit only where a specific missing family justifies the cost. Stop when additional sampling adds no actionable intent, coverage is sufficient, or the authorized budget is reached; record remaining uncertainty. Do not keep widening merely to hit a count or force a new page.
- Verify exact candidate metrics where available, the required SERP/PAA/question sweep, correct existing-page home, and duplicate/no-addition decisions. Missing paid-provider data follows the existing fallback rules, not a new failure gate.

Own background processes by their task ID/PID and wait/cancel only that task. Never use broad `pkill -f keyword_data.py` or terminate another routine's research. A command moved to background is still running; inspect its status before restarting work.

## Phase 4: audit rules against the actual result

Keep the existing independent reviewer and two-rework limit. For each affected route, record PASS, FAIL or justified N/A with artifact path/section and concrete evidence for:
1. Complete, current reviewer instructions and the writer's application map; site permission, stricter local exclusions and required professional review are preserved.
2. Reader question, exact-intent deduplication and no-addition branch. Do not force an experiment, conclusion or tool onto already sufficient content.
3. Source-to-claim traceability and actual basis: measured, calculated, modeled, client record, reported or unknown. Reproduce numerical claims and check counterexamples/conditions where applicable; retain a reasoning trail for non-numerical work.
4. Visible attribution beside the finding: what we did, the supported result, scope and a publishable way to inspect the method. Source-only work names the external source; private records remain private. No exact wording quota.
5. Intent-based takeaway (or existing sufficient verdict), agreement with the opening answer, table/tool and FAQs, and the condition or alternative that changes the recommendation. An honestly inconclusive answer may pass.
6. Testing eligibility separately from executed evidence; complete item coverage, real test dates, raw records and independent approval of the exact final content. Check title, metadata, byline, methods, picks and schema use one decision; inspect residual testing claims even when the badge is off. An unchanged migration snapshot is not a new test approval.
7. Selected visuals/tools match source outputs; test defaults/boundaries, accessibility and mobile readability. No mandatory calculator, screenshot or exact heading; no videos under the evidence contract.
8. Growth record and baseline/comparator status where the contribution requires them; unknown/unavailable is not zero and publishing is not proven uplift. Respect the terminal no-addition exemption.

Missing evidence for an applicable check is FAIL, not N/A. Recheck any changed reviewed artifact before publishing. At the existing publication gate, verify the audit's exact content/artifact hashes, current rules and required deployed source files; check built output, then verify live URLs after deployment. Never replace independent judgment with hashes or a fabricated PASS. Existing unchanged pages outside this run remain out of scope.
