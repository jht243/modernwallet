
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
<!-- /workflow-source-freshness-v1 -->

# Phase 8 — Summary + user approval (HARD HUMAN GATE)

After Phase 7's gate passes, **STOP all work and print a single summary table for the user**. Do not commit. Do not push. Do not start Phase 9. Wait for the user to explicitly approve.

Print the summary **keyed to the GSC coverage states** — the same **two-column `Issue | Solution` shape** as the Phase 0 manifest, so the user sees the same framing coming out as going in. The Solution column is now past-tense ("what we did"), with the count folded into the Issue cell. One row per coverage state that had actionable URLs.

| Issue | Solution (what we did) |
|---|---|
| 🟡 Discovered – currently not indexed ({N}) | `{one-line — e.g. added inbound links to N, refreshed sitemap, re-submitted N; thin ones flagged}` |
| 🔴 URL is unknown to Google ({N}) | `{one-line — confirmed in sitemap, linked, re-submitted; statuses}` |
| 🟠 Crawled – currently not indexed ({N}) | `{one-line — pages expanded (best-effort), linked, re-submitted}` |
| Duplicate (canonical) ({N}) | `{one-line — canonicals set/aligned}` |
| Soft 404 / 404 / 5xx / redirect ({N}) | `{one-line — statuses fixed, chains collapsed, dropped from sitemap}` |
| Excluded by noindex / robots — unintended ({N}) | `{one-line — blocks removed; intentional ones left}` |

Then a short **delivery line** for the cross-cutting work: Audit verdict, final sitemap adds/removes/lastmod, and the **pending re-submit list** — N URLs that *will* be sent to IndexNow + Google Indexing **after you approve** (the submissions fire in Phase 9, post-push; nothing external has been sent yet). State which channels are available.

**Technical-change detail (REQUIRED if any redirect / status / canonical / noindex change was written).** List every one explicitly, one line each, so the human can catch a destructive edit before it ships:
- Canonicals: `{url}` user-canonical `{old}` → `{new}` (Google chose `{google_canonical}`)
- Redirects/status: `{url}` `{old status}` → `{new status/target}`
- Indexability: `{url}` removed `{noindex | robots Disallow}`

Cross-check: **no URL that was `Submitted and indexed` in the inspection JSON appears in this list as newly noindex'd / 410'd / redirected / canonicalized-away.** If one does, STOP — it's a de-indexing risk — and do not present the approval prompt until it's resolved.

After the table, list briefly:
- **Files changed** (high-level count: N code + N content + N sitemap)
- **Diff size** (insertions / deletions)
- **Working-as-intended** (count of inspected URLs deliberately left alone, e.g. intentional noindex / proper-canonical alternates)
- **Anything noteworthy** before approving (judgment calls, ambiguous rows left for the user, channels skipped for missing creds)
- **Branch state** (which branch the work is staged on; confirm nothing committed yet)

Then prompt the user with **exactly this question** (or its functional equivalent — direct push vs PR vs pause):
> "All work is staged on branch `{branch}`. Approve to commit, push, and submit {N} URLs to IndexNow + Google Indexing — or pause for review?"

(The IndexNow / Google Indexing submissions fire only after this approval, in Phase 9 — nothing external has been sent yet.)

**Do NOT proceed to Phase 9 until the user explicitly approves.** Acceptable approvals: "approve", "push", "commit", "go", "yes — push", or any clear affirmative. Anything ambiguous → ask again, do not assume.

If the user declines (pause / hold / not yet), STOP cleanly: report the branch name and staged state so they can resume later. Do not delete the branch or unstage anything.
