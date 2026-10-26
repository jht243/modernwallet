
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 9 — Commit + deliver

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


## Worker
After Phase 8 (Summary) is APPROVED by the user:
1. `git status` — confirm only intended SEO changes are staged. If anything unexpected, STOP and report.
2. Single commit:
   `SEO pass: {C} consolidations, {M} metadata, {N} new pages, {B} body, {L} link passes (chart: reports/seo-pass/<date>.md)`
   + blank line + short bullet list of routes touched + `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
3. Deliver per the discovered push target: push directly to the default branch, or push a branch and open a PR.
4. After push completes, run `git rev-parse HEAD` to capture the commit SHA. Then confirm `git fetch origin && git rev-parse origin/<branch>` matches — proving the commit actually reached the remote.
5. Verify clean tree (`git status`).
6. **IndexNow submission (post-deploy ONLY — this is the single point where IndexNow fires).** Read the URL list from `reports/seo-pass/<date>.indexnow.txt`. For each URL, confirm it is actually live on production first: `curl -s -o /dev/null -w "%{http_code}" <url>`. Auto-deploy can lag the push by a minute or two — if a URL still returns 404/3xx, wait briefly and re-check (a few attempts) before giving up on it. **Submit ONLY the URLs that returned 200.** Then run `python3 .claude/scripts/indexnow-submit.py --urls-file <file of those verified-live URLs>` (write the list to a file first). The script picks the key Bing accepts for this host, tries api.indexnow.org, then www.bing.com, then yandex.com, and falls back to the fleet relay (layer3labs-web `/api/indexnow-relay`) if this sandbox can't reach them. Exit 0 means accepted; copy its `INDEXNOW …` line into the report. Never POST to `api.indexnow.com`: that host does not exist. **Never submit a URL that did not return 200** — that is the whole reason this step lives in Phase 9 and not Phase 7. List any URL that never went live (still 404 after retries) in the final report so the user can investigate the deploy.

## Final response to the user (REQUIRED)
End the run with a short report that includes the **full commit SHA prominently**. Use this exact shape:

```
✅ Pushed to {branch}

Commit SHA: {full 40-char SHA}
Short SHA:  {7-char short SHA}
Remote:     confirmed on origin/{branch}
Files:      {N} changed
Tree:       clean

GitHub: https://github.com/{owner}/{repo}/commit/{full SHA}
```

(Skip the GitHub URL line only if the remote is not GitHub, or if `gh` / git config cannot resolve `{owner}/{repo}`. Never omit the SHA itself.)

If the push failed, STOP and report the failure with the error, the staged-but-unpushed commit SHA, and what the user should do next.

## Reviewer checklist
- ☐ working tree clean post-delivery
- ☐ commit message references the chart
- ☐ only intended files changed
- ☐ delivery matches the push target
- ☐ final response prominently displays the full commit SHA
- ☐ remote-confirmation step ran and matched (local HEAD == origin/branch)
- ☐ IndexNow fired only AFTER push, and only for URLs verified live (HTTP 200); no 404/3xx URL was submitted (or skipped cleanly if no key)
