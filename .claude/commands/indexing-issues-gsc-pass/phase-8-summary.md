
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

# Phase 8 — Summary + user approval (HARD HUMAN GATE)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


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
