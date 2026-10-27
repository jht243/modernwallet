# Workflow checkpoints — complete instructions and evidence of application

These are substeps of the existing workflow, not new phases or human gates. Preserve scope, professional review, local exclusions, schedules and the Phase 0 approval. A delivery log proves only that text was emitted; it does not prove comprehension, correct application, independent review or permission to publish.

## Startup and complete reading

Run `bash .claude/tools/workflow-start.sh` directly as a standalone command (add `--cloud` in cloud). Inspect its actual exit status. Never pipe it through `tail`, `head`, `tee` or another command, chain past failure, or treat a checkbox as proof. The wrapper's internal pipefail cannot protect its caller's pipeline.

Before chart research/planning, substantive writing/enrichment, independent audit and publication, prepare the applicable instruction bundle:

```bash
python3 .claude/tools/workflow-preflight.py prepare --phase build --actor <agent-id> --instruction .claude/commands/mindmap-pass/phase-build-brief.md --run-dir reports/mindmap-pass/<run-id>/preflight-build
python3 .claude/tools/workflow-preflight.py next --run-dir reports/mindmap-pass/<run-id>/preflight-build
python3 .claude/tools/workflow-preflight.py check --run-dir reports/mindmap-pass/<run-id>/preflight-build
```

Use `write`, `audit` or `publish` and the actual current phase file at the corresponding existing checkpoint. Other content routines supply their own phase instruction; repeat `--instruction` for additional caller rules. Cloud prepare also takes `--cloud`. Use a unique directory per run, actor and phase. Preparation runs startup verification internally and stops on its real return code. Missing required files block the affected work; global routines must first install the sibling shared contracts/helper into the active project while preserving its local standards and permissions.

Run `next` **once per tool call**, read that complete chunk, then repeat until all chunks are read. Do not batch outputs, pipe/truncate them, use byte counts/head excerpts as reading, or summarize an unread source. If the tool itself truncates a result, reread that part with `--part N` before advancing. `check` must succeed before dependent work; it rejects incomplete delivery, changed chunks, changed source files and newly added local overrides. If rules change, prepare/read a fresh bundle and reconcile already prepared artifacts. The independent reviewer loads its own audit bundle; it cannot inherit the writer's reading claim. To avoid repeatedly loading unchanged rules, the same actor in the same run may pass `--reuse <completed-earlier-bundle>` to prepare the next phase. The helper validates the earlier delivery and source hashes, then emits only new files (normally the next phase instructions). Use your actual distinct agent identity in `--actor`; independent reviewers start their own bundle and never reuse the writer’s. Reuse is not valid across a new chat or lost reading context. If context no longer contains the rules, reread them. This complete-reading protocol supersedes older directions to use only `load-standards.sh`. Its legacy ledger receipt is still allowed for compatibility, but is not a substitute for these checks and does not require a second reading of unchanged rules.

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

## Approval chart — completed preparation only

The approval chart is the gate to START content work. Present it only after all applicable preparation is complete and independently checked. Never show an incomplete approval chart with “pending”, “not yet”, unchecked boxes, failed rows or missing evidence. If a prerequisite is unfinished, finish it before presenting the chart. If blocked, report the specific blocker without presenting a ready-for-approval chart. This does not authorize content generation, content edits or publication before Phase 0 approval.

Separate completed preparation from the execution plan:
- **Preparation checklist:** only completed, evidenced checks and justified N/A decisions. Show **Instruction / Read / Preparation verified / Evidence**. `✅ Read` requires the worker's complete/current instruction bundle; `✅ Verified` requires the corresponding preparation artifact and the appropriate independent reviewer. N/A must state why the requirement does not apply. No automatic green rows and no omission of an unfinished applicable prerequisite.
- **Execution plan:** retain the full original action table and Phases 1–9, including metadata, substantive writing, independent content audit, body updates, internal links, sitemap/IndexNow and commit/deploy/live verification. Use future action verbs and exact targets. These are the actions being approved, not completed-work checkboxes. Do not add a “pending” status column or label them passed.
- **Final results:** report actual completed execution/review/publication results after they occur. A blocked or failed run reports its actual issue; it does not display a partially complete approval chart or fabricate success.

Before showing the chart, read ALL applicable workflow instructions, including downstream writing, audit, linking and publication requirements. Use repeated `--instruction` arguments with `workflow-preflight.py prepare` to include those phase files in the build bundle; reuse already completed same-actor reading only when valid. The independent chart reviewer uses its own current instructions and verifies the preparation, not a fictitious Phase 4 content PASS.

Complete and evidence these preparation checks before the approval presentation:

| Preparation requirement | What must already be finished |
|---|---|
| Workflow freshness and full instruction reading | Verified startup; complete/current contracts, local rules and applicable phase instructions |
| Brief, scope and reader questions | Interpreted brief, exact reader questions, answer placement, formats and actionable targets |
| Keyword demand, relevance and discovery coverage | Saved real discovery results, correct provider/provenance, exact candidate checks, required SERP/PAA/question sweep and stop/widen rationale |
| Duplication and existing-page intent | Coverage lookup, checked commits, same-run overlap and independent duplicate-review decisions for every applicable target |
| Local testing eligibility and exclusions | Resolved per-page permission/exclusion decisions, including required professional-review obligations |
| Evidence and attribution preparation | Sources/reusable records inspected, actual evidence basis classified and a supported findings/attribution brief; no invented tests or benefits |
| Takeaway preparation | Planned intent-answering conclusion grounded in the research, material conditions and existing sufficient-verdict/no-addition decisions |
| Testing presentation preparation | Determine from actual available records whether TESTED can be proposed or the ordinary/excluded format is required; do not promise an unsupported label |
| Content standard and audit preparation | Required elements, depth/voice rules, source requirements and independent Phase 4 acceptance criteria incorporated in the brief |
| Tool/visual preparation | Useful medium chosen, inputs/sources/logic and feasibility assessed where applicable; actual implementation/audit remains in the approved execution plan |
| Internal-link preparation | Inspect source pages and relevant sections, specify inbound/outbound placements and targets, and confirm the required link coverage can be achieved |
| Technical SEO and publication preparation | Inspect applicable metadata/schema/canonical/sitemap/deployment wiring; define exact actions and live checks |
| Growth preparation | Read available outcomes; identify the applicable baseline/comparator/data status and hypothesis without claiming uplift; respect no-addition exemptions |
| Independent chart review | Final proposed rows, exclusions, research, readiness evidence and checklist verified by a distinct reviewer |
| Approval scope prepared | Explicit planned commit, push, live verification and IndexNow actions disclosed, or an explicit local-only scope; approval itself is the next user action, not a completed checklist row |

Show the completed preparation checklist in both the saved chart and on-screen presentation, after preserving the original action table, emerging clusters and exclusions. Display it before the existing Phase 0 approval question. Keep the original action-table schema; the checklist has its own `## Instruction checks` heading and cannot become action rows.

Include **Per-page preparation checks**: **Page / Duplicate check / Testing eligibility / Evidence and label decision / Takeaway brief / Evidence**. Every applicable preparation cell must have a verified decision and linked proof. Testing exclusions can pass preparation with the ordinary presentation explicitly selected; this never means a product test was performed. Do not include actual content-audit, implementation or live-deployment checkboxes in this pre-content table.

A preparatory testing decision does not approve final testing labels. After approval, Phase 3/4 still checks real run records, exact final content, independent approval, rendered methods/title/byline/schema and professional review as required. Likewise a planned takeaway is reviewed again against the actual generated page. No content is described as written, audited, built or live before those events occur.

Changed rules, targets or research invalidate the affected readiness decisions. Recheck them before presenting a revised approval chart. Imported charts must have their current preparation evidence revalidated. The independent chart reviewer rejects any missing preparation evidence, unsupported check mark or future execution result misrepresented as already complete. Preserve the sole Phase 0 human gate and all existing scope/exclusion/publication rules. This section supersedes older instructions to display unfinished status cells in an approval chart.
