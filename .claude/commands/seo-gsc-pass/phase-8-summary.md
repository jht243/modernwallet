# Phase 8 — Summary + user approval (HARD HUMAN GATE)

After Phase 7's gate passes, **STOP all work and print a single summary table for the user**. Do not commit. Do not push. Do not start Phase 9. Wait for the user to explicitly approve.

Print exactly this table — one row per phase that ran (rows for any phase that didn't run because its chart bucket was empty MAY be omitted):

| Phase | Rows | Outcome |
|---|---|---|
| 1 — Cannibalization detection (advisory) | `{N}` | `{one-line outcome — N competing pairs flagged, 0 edits made}` |

**Cannibalization advisory (REQUIRED if any pairs were detected).** Phase 1 writes NO redirects/canonicals — it only flags. For every detected pair, list one line as `page-a ({imp}/{clicks}) vs page-b ({imp}/{clicks}) — cluster "<query>" → <recommendation>` (manual-consolidate / differentiate / leave alone). This is purely informational for the user to act on **by hand** later; it does not gate the push and nothing was redirected. Confirm explicitly that no canonical or 301 was written by this run.

| 2 — Metadata | `{N}` | `{one-line outcome — count rewritten, reviewer flags + fixes}` |
| 3 — New content | `{N}` | `{one-line outcome — page slugs + word counts}` |
| 4 — Audit | `{N pages}` | `{one-line outcome — checklist results, any rework}` |
| 5 — Body text | `{N}` | `{one-line outcome — what sections were added, on which pages}` |
| 6 — Internal linking | `{N chart rows + inbound for new pages}` | `{one-line outcome — final inbound counts to chart targets; confirm homepage header untouched}` |
| 7 — Sitemap + IndexNow prep | — | `{one-line outcome — N routes added/refreshed/removed; IndexNow URL list prepared (submitted post-deploy in Phase 9, live URLs only)}` |

**Emerging search patterns actioned (REQUIRED — mirrors the Phase 0 manifest).** List each emerging cluster from the chart's `## Emerging search patterns (clusters)` block and how this run acted on it: `cluster "<theme>" → <lever> → [<format>] → <route/file> (<done | spec written | flagged>)`. For non-article formats, confirm the spec was written and note the target route so the user knows what to build next. If zero clusters were detected this run, state that explicitly so the user knows Lens 2 ran and found nothing actionable (not that it was skipped).

After the table, list briefly:
- **Files changed** (high-level count: N modified + N new + N sitemaps)
- **Diff size** (insertions / deletions)
- **Anything noteworthy** the user should know before approving (judgment calls made, reviewer false positives, anything skipped, etc.)
- **Branch state** (which branch the work is staged on; confirm nothing has been committed yet)

Then prompt the user with **exactly this question** (or its functional equivalent — direct push vs PR vs pause):
> "All work is staged on branch `{branch}`. Approve to commit + push, or pause for review?"

**Do NOT proceed to Phase 9 until the user explicitly approves.** Acceptable approvals: "approve", "push", "commit", "go", "yes — push", or any clear affirmative. Anything ambiguous → ask again, do not assume.

If the user declines (pause / hold / not yet), STOP cleanly: report the branch name and staged state so they can resume later. Do not delete the branch or unstage anything.
