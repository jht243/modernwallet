
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
<!-- /workflow-source-freshness-v1 -->

# Phase 8 — Summary + user approval (HARD HUMAN GATE)

After Phase 7's gate passes, **STOP all work and print a single summary table for the user**. Do not commit. Do not push. Do not start Phase 9. Wait for the user to explicitly approve.

Print exactly this table — one row per phase that ran (rows for any phase that didn't run because its chart bucket was empty MAY be omitted):

| Phase | Rows | Outcome |
|---|---|---|
| 1 — Cannibalization detection (advisory) | `{N}` | `{one-line outcome — N competing pairs flagged, 0 edits made; or "skipped — no rows"}` |
| 2 — Metadata | `{N}` | `{one-line outcome — count rewritten, reviewer flags + fixes}` |
| 3 — New content | `{N}` | `{one-line outcome — page slugs + word counts}` |
| 4 — Audit | `{N pages}` | `{one-line outcome — checklist results, any rework}` |
| 5 — Body text | `{N}` | `{one-line outcome — what sections were added, on which pages}` |
| 6 — Internal linking | `{N chart rows + inbound for new pages}` | `{one-line outcome — final inbound counts to chart targets; confirm homepage header untouched}` |
| 7 — Sitemap + IndexNow prep | — | `{one-line outcome — N routes added/refreshed/removed; IndexNow URL list prepared (submitted post-deploy in Phase 9, live URLs only)}` |

After the table, list briefly:
- **Files changed** (high-level count: N modified + N new + N sitemaps)
- **Diff size** (insertions / deletions)
- **Anything noteworthy** the user should know before approving (judgment calls made, reviewer false positives, anything skipped, etc.)
- **Branch state** (which branch the work is staged on; confirm nothing has been committed yet)

Then prompt the user with **exactly this question** (or its functional equivalent — direct push vs PR vs pause):
> "All work is staged on branch `{branch}`. Approve to commit + push, or pause for review?"

**Do NOT proceed to Phase 9 until the user explicitly approves.** Acceptable approvals: "approve", "push", "commit", "go", "yes — push", or any clear affirmative. Anything ambiguous → ask again, do not assume.

If the user declines (pause / hold / not yet), STOP cleanly: report the branch name and staged state so they can resume later. Do not delete the branch or unstage anything.
