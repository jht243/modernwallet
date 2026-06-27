# Phase 9 — Commit + deliver

## Worker
After Phase 8 (Summary) is APPROVED by the user:
1. `git status` — confirm only intended indexing changes are staged. If anything unexpected, STOP and report.
2. Single commit:
   `Indexing pass: {C} canonical, {R} redirect/error, {I} unblock, {T} thin, {L} link passes, sitemap + re-submit (report: reports/indexing-pass/<date>.md)`
   + blank line + short bullet list of URLs/routes touched + every redirect/status/canonical change + `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
3. Deliver per the discovered push target: push directly to the default branch, or push a branch and open a PR.
4. After push completes, run `git rev-parse HEAD` to capture the commit SHA. Then confirm `git fetch origin && git rev-parse origin/<branch>` matches — proving the commit actually reached the remote.
5. **Now (and only now) fire the re-submissions.** The user approved at Phase 8 and the URLs are live on the remote, so submit the prepared list — read `reports/indexing-pass/<date>.resubmit.txt` and submit each URL via the project's **IndexNow** client and **Google Indexing API** client (discovered in Phase 0), reusing their existing code/cooldown/logging. Capture each channel's HTTP status. If a channel/credential is absent, skip and flag. This is the first and only point in the run where IndexNow/Indexing calls are made.
6. **Update the persistent submission ledger.** For every URL that was **actually submitted** in step 5 (succeeded on at least one channel), upsert its entry in `reports/indexing-pass/submission-ledger.json` → `{ last_submitted: <today>, channels: [<channels that accepted>] }`. This rolling state file (kept across runs, not dated) powers Phase 7's submit-once/30-day suppression so the same unchanged URL is not re-pinged weekly. Do NOT record URLs that were skipped or failed on every channel. Because submissions fire *after* the main commit (step 2), commit the updated ledger as a tiny **follow-up commit** and push it: `chore(indexing): update submission ledger ({K} URLs submitted <date>)` + the `Co-Authored-By` trailer. (If nothing was successfully submitted, the ledger is unchanged — skip this commit.)
7. Verify clean tree (`git status`).

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

Then add a short **re-indexing note**: indexing changes only take effect when Google re-crawls (days–weeks). The fixed/added URLs were re-submitted via the discovered re-submit channels in Phase 7 to speed that up. To measure progress later, run a fresh `/indexing-issues-gsc-pass` (or diff two sweeps: `.claude/tools/indexing-issues-gsc-pass/.venv/bin/python .claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py --verify reports/indexing-pass/<this-date>.inspection.json reports/indexing-pass/<future-date>.inspection.json`) and see how many flagged URLs moved to "Submitted and indexed." Also surface any remaining "Ambiguous / needs human" rows for the user to resolve manually.

If the push failed, STOP and report the failure with the error, the staged-but-unpushed commit SHA, and what the user should do next.

## Reviewer checklist
- ☐ working tree clean post-delivery
- ☐ commit message references the report
- ☐ only intended files changed
- ☐ delivery matches the push target
- ☐ final response prominently displays the full commit SHA
- ☐ remote-confirmation step ran and matched (local HEAD == origin/branch)
- ☐ re-indexing / verify note included; ambiguous rows surfaced
- ☐ submission ledger updated with today's date for every successfully-submitted URL (and committed/pushed as the follow-up commit); skipped/failed URLs not recorded
