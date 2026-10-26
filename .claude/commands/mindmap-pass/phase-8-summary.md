
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
<!-- /workflow-source-freshness-v1 -->

# Phase 8 — Summary (auto-continues to Phase 9 push)

<!-- decision-evidence-v1 -->
## Evidence and growth hand-off

Follow `_decision-evidence.md`, section 5. For each substantive contribution, report the decision improved, evidence type, packet path, hypothesis and outcome status. Register its `growth.json` in `reports/content-evidence.jsonl` with a stable run/route id, route, origin routine, packet path, growth path and status. Update the same id on deployment/outcome review; do not duplicate it. Local-only work has no deployed date or traffic uplift. Publication permissions and this phase's existing gates are unchanged.
<!-- /decision-evidence-v1 -->

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

> **Report question coverage.** For every page created or enriched this run, print one line:
> `<route> — asked "<reader_question>" <evidence tag> → answered in <answer_placement>`. Then the
> run-wide counts: how many rows were PAA/completion-backed versus `verb-only`, and any row flagged
> for off-topic PAA. This is what tells the user the pass answered real questions rather than
> well-formed guesses, and it is the only place the evidence quality of the whole run is visible.

After Phase 7's gate passes, **print a single summary table for the user, then auto-continue to Phase 9**. This is NOT a human gate — do not stop, do not wait for approval. The summary is informational; the push happens automatically in the next step. (The only human stop in this run is the Phase 0 manifest gate.)

Print exactly this table — one row per phase that ran (rows for any phase that didn't run because its chart bucket was empty MAY be omitted):

| Phase | Rows | Outcome |
|---|---|---|
| 1 — Cannibalization detection (advisory) | `{N}` | `{one-line outcome — N competing pairs flagged, 0 edits made}` |

**Cannibalization advisory (REQUIRED if any pairs were detected).** Phase 1 writes NO redirects/canonicals — it only flags. For every detected pair, list one line as `page-a ({imp}/{clicks}) vs page-b ({imp}/{clicks}) — cluster "<query>" → <recommendation>` (manual-consolidate / differentiate / leave alone). This is purely informational for the user to act on **by hand** later; it does not gate the push and nothing was redirected. Confirm explicitly that no canonical or 301 was written by this run.

| 2 — Metadata | `{N}` | `{one-line outcome — count rewritten, reviewer flags + fixes}` |
| 3 — New content | `{N}` | `{one-line outcome — page slugs + word counts}` |
| 4 — Audit | `{N pages}` | `{one-line outcome — checklist results, any rework}` + `depth: {passing}/{failing} passing, median {N} words` (REQUIRED — from the Phase 4 depth gate; include the `median barely clears floor` note if it fired) |
| 5 — Body text | `{N}` | `{one-line outcome — what sections were added, on which pages}` |
| 6 — Internal linking | `{N chart rows + inbound for new pages}` | `{one-line outcome — final inbound counts to chart targets; confirm homepage header untouched}` |
| 7 — Sitemap + IndexNow prep | — | `{one-line outcome — N routes added/refreshed/removed; IndexNow URL list prepared (submitted post-deploy in Phase 9, live URLs only)}` |

**Emerging search patterns actioned (REQUIRED — mirrors the Phase 0 manifest).** List each emerging cluster from the chart's `## Emerging search patterns (clusters)` block and how this run acted on it: `cluster "<theme>" → <lever> → [<format>] → <route/file> (<done | built | spec written | flagged>)`. Tool rows (`interactive tool`/`calculator`/`quiz/assessment`) are built — give the live route. For the remaining non-article formats, confirm the spec was written and note the target route so the user knows what to build next. If zero clusters were detected this run, state that explicitly so the user knows Lens 2 ran and found nothing actionable (not that it was skipped).

After the table, list briefly:
- **Files changed** (high-level count: N modified + N new + N sitemaps)
- **Diff size** (insertions / deletions)
- **Anything noteworthy** the user should know (judgment calls made, reviewer false positives, anything skipped, etc.)
- **Branch state** (which branch the work is staged on)

Then print a one-line continuation notice — `All work is staged on branch {branch}. Continuing to Phase 9 (commit + push)...` — and **immediately proceed to Phase 9 in the same turn**. Do not ask for approval; the push is automatic.
