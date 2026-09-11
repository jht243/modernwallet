# Phase 9 — Commit + deliver

## Worker
After Phase 8 (Summary) is APPROVED by the user:
1. `git status` — confirm only intended SEO changes are staged. If anything unexpected, STOP and report.
2. Single commit:
   `Mindmap pass: {C} consolidations, {M} metadata, {N} new pages, {B} body, {L} link passes (chart: reports/mindmap-pass/<date>.md)`
   + blank line + short bullet list of routes touched + `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
3. Deliver per the discovered push target: push directly to the default branch, or push a branch and open a PR.
4. After push completes, run `git rev-parse HEAD` to capture the commit SHA. Then confirm `git fetch origin && git rev-parse origin/<branch>` matches — proving the commit actually reached the remote.
5. Verify clean tree (`git status`).
6. **‼️ VERIFY LIVE (200 check) — REQUIRED before IndexNow and before the final report.** Publishing is NOT "done" until the live pages actually load. Build the FULL list of URLs whose content this run created or modified (every new page + every body/metadata edit + every redirect destination you added) — NOT just the IndexNow list. Wait at least 3 minutes after push for the host to deploy (longer if the host builds slowly — Render / Vercel / Netlify cold builds routinely take 2–5 min; 60s is NOT enough), then for EACH URL: `curl -s -o /dev/null -w "%{http_code}\n" https://<BASE_URL>/<path>`. A page counts as shipped ONLY if it returns **200**. If any URL returns 404 / 500 / any non-200, the change is BROKEN — diagnose the root cause (bad template import/include, missing route, build error), fix it, commit, push, wait, re-verify. **Up to 2 fix attempts per URL.** If a newly-created page still isn't 200 after 2 attempts, **revert that page** (commit + push the revert) so a broken 500/404 is never left live, and mark it FAILED. Keep a running `{url → final status}` list for the final report. Do NOT proceed to step 7 or the final report until every URL has a final status.
7. **IndexNow submission (post-deploy ONLY — this is the single point where IndexNow fires).** Read the URL list from `reports/mindmap-pass/<date>.indexnow.txt` and intersect with the verified-200 list from step 6 — **submit ONLY URLs that returned 200**. If an IndexNow key was discovered in Phase 0, send one `curl` POST to `https://api.indexnow.com/indexnow` with JSON `{host, key, keyLocation, urlList}` where `urlList` = the verified-live URLs. Capture the HTTP status. If no key exists, skip and note it. **Never submit a URL that did not return 200.** List any URL that never went live (still non-200 after retries) in the final report so the user can investigate the deploy.
8. **‼️ FINAL STEP — Direct links to every newly created page (REQUIRED, always last).** After the 200 verification (step 6) and IndexNow (step 7), end the run by giving the user a clickable link list of EVERY newly created page from this run, so they can open each one directly in a browser and see it. Rules:
   - One page per line, as a full absolute URL (`https://<BASE_URL>/<path>`) — never a relative path, never a file path, never a route name.
   - Format each line as a markdown link whose text is the page's H1/title: `- [Page Title](https://<BASE_URL>/<path>)`.
   - Include ONLY pages verified 200 in step 6. Pages that were reverted/FAILED go in a separate `⚠️ Not live` list underneath with their final status code — never mixed into the clickable list.
   - This list is for NEW pages created this run. If existing pages were significantly enriched (body sections added), add a second, clearly separated `Updated pages` link list in the same format.
   - This must be the LAST section of the final response — nothing after it — so the links are immediately visible and clickable at the end of the run.

## Final response to the user (REQUIRED)
End the run with a short report that includes the **full commit SHA prominently** AND a **Live verification** subsection (one line per created/changed URL → `200 OK` or `FAILED <code>`). Never claim a page shipped without a 200 next to it. Use this exact shape:

```
✅ Pushed to {branch}

Commit SHA: {full 40-char SHA}
Short SHA:  {7-char short SHA}
Remote:     confirmed on origin/{branch}
Files:      {N} changed
Tree:       clean

GitHub: https://github.com/{owner}/{repo}/commit/{full SHA}

Live verification:
{one line per created/changed URL → 200 OK or FAILED <code>}

🔗 New pages — click to open:
- [{Page Title 1}](https://{BASE_URL}/{path-1})
- [{Page Title 2}](https://{BASE_URL}/{path-2})
- …one line for EVERY newly created page that verified 200

Updated pages (if any were enriched this run):
- [{Page Title}](https://{BASE_URL}/{path})

⚠️ Not live (only if any page failed verification and was reverted):
- https://{BASE_URL}/{path} — FAILED {code}, reverted
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
- ☐ EVERY created/changed URL was fetched live and confirmed 200 (or reverted), and the final report has a `Live verification` row for each one
- ☐ the final response ENDS with the `🔗 New pages` clickable-link list — one full absolute URL (markdown link, page title as text) per newly created 200-verified page; failed/reverted pages listed separately, never in the clickable list
