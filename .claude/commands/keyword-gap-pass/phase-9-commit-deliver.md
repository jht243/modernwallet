# Phase 9 — Commit + deliver

## Worker
After Phase 8 (Summary) is APPROVED by the user:
1. `git status` — confirm only intended keyword-gap-pass changes are staged, INCLUDING the updated `target-keyword-inventory.md`. If anything unexpected, STOP and report.
2. Single commit:
   `Keyword pass: {M} metadata, {N} new pages, {B} body, {G} gap keywords tracked (chart: reports/keyword-pass/<date>.md)`
   + blank line + short bullet list of routes touched + a note that new gap keywords were added to `target-keyword-inventory.md` + `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
3. Deliver per the discovered push target: push directly to the default branch, or push a branch and open a PR.
4. After push completes, run `git rev-parse HEAD` to capture the commit SHA. Then confirm `git fetch origin && git rev-parse origin/<branch>` matches — proving the commit actually reached the remote.
5. Verify clean tree (`git status`).
6. **IndexNow submission (post-deploy ONLY — this is the single point where IndexNow fires).** Read the URL list from `reports/keyword-pass/<date>.indexnow.txt`. For each URL, confirm it is actually live on production first: `curl -s -o /dev/null -w "%{http_code}" <url>`. Auto-deploy can lag the push by a minute or two — if a URL still returns 404/3xx, wait briefly and re-check (a few attempts) before giving up on it. **Submit ONLY the URLs that returned 200.** Then, if an IndexNow key was discovered in Phase 0, send one `curl` POST to `https://api.indexnow.org/indexnow` with JSON `{host, key, keyLocation, urlList}` where `urlList` = the verified-live URLs. Capture the HTTP status. If no key exists, skip and note it. **Never submit a URL that did not return 200** — that is the whole reason this step lives in Phase 9 and not Phase 7. List any URL that never went live (still 404 after retries) in the final report so the user can investigate the deploy.

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
- ☐ `target-keyword-inventory.md` is part of the commit (new gap keywords tracked)
- ☐ only intended files changed
- ☐ delivery matches the push target
- ☐ final response prominently displays the full commit SHA
- ☐ remote-confirmation step ran and matched (local HEAD == origin/branch)
- ☐ IndexNow fired only AFTER push, and only for URLs verified live (HTTP 200); no 404/3xx URL was submitted (or skipped cleanly if no key)
