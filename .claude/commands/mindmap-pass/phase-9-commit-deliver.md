
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 9 — Commit + deliver

<!-- mindmap-visible-checks-v1 -->
**Approval chart: completed preparation only.** Follow `_workflow-checkpoints.md`, “Approval chart — completed preparation only.” Finish all applicable instruction reading, research, duplicate review, testing eligibility/evidence decisions, supported takeaway/attribution briefs and internal-link/technical/publication planning BEFORE showing the chart. Show exactly one **Preparation check** row: `✅ Passed` with a link to the complete readiness evidence. Keep the full read/application and per-page checklist in that linked report. On `❌ Failed`, show only the specific failures and fixes and block approval; do not expand passed items. Unfinished preparation blocks the ready approval chart. Keep the full action table and Phases 1–9 as the future execution plan, including writing, independent content audit, internal-link edits, sitemap and publication. Do not show pending cells or claim those execution steps already happened. Every new-page action must also have a complete, page-specific **New-page brief** shown inline in the saved chart AND on-screen approval output: identity, validated keyword/SERP evidence, existing-page/duplicate rationale, reader question and answer placement, concrete outline, inspected sources and contribution, testing/review decision, takeaway, inbound/outbound link placements, and technical/measurement scope. A title/URL row or link to a separate file is insufficient. Missing/mismatched briefs block the chart; never shorten them out. Approval remains the sole existing human gate.
<!-- /mindmap-visible-checks-v1 -->


<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


**Testing publication check:** Apply `_testing-labels.md` to every affected route. Verify its exact-content evidence decision and built title, metadata, byline, methods and schema with the active site's adapter. If a shared rendering change affects other routes, include them in validation. Missing/stale approval, mismatched labels or unsupported leftover testing claims block publication of the affected content. Missing adapters must be wired and verified before tested labels can be enabled; do not create permission or fabricate records. Preserve local medical/psychedelic and other exclusions. This is a publication condition, not permission to rewrite unrelated historical pages.

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

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
7. **IndexNow submission (post-deploy ONLY — this is the single point where IndexNow fires).** Read the URL list from `reports/mindmap-pass/<date>.indexnow.txt` and intersect with the verified-200 list from step 6 — **submit ONLY URLs that returned 200**. To submit, run `python3 .claude/scripts/indexnow-submit.py --urls-file <file of those verified-live URLs>` (write the list to a file first). The script picks the key Bing accepts for this host, tries api.indexnow.org, then www.bing.com, then yandex.com, and falls back to the fleet relay (layer3labs-web `/api/indexnow-relay`) if this sandbox can't reach them. Exit 0 means accepted; copy its `INDEXNOW …` line into the report. Never POST to `api.indexnow.com`: that host does not exist. **Never submit a URL that did not return 200.** List any URL that never went live (still non-200 after retries) in the final report so the user can investigate the deploy.
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
