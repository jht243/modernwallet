
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

# Phase 9 — Commit + deliver

<!-- mindmap-visible-checks-v1 -->
**Approval chart: completed preparation only.** Follow `_workflow-checkpoints.md`, “Approval chart — completed preparation only.” Finish all applicable instruction reading, research, duplicate review, testing eligibility/evidence decisions, supported takeaway/attribution briefs and internal-link/technical/publication planning BEFORE showing the chart. Show exactly one **Preparation check** row: `✅ Passed` with a link to the complete readiness evidence. Keep the full read/application and per-page checklist in that linked report. On `❌ Failed`, show only the specific failures and fixes and block approval; do not expand passed items. Unfinished preparation blocks the ready approval chart. Keep the full action table and Phases 1–9 as the future execution plan, including writing, independent content audit, internal-link edits, sitemap and publication. Do not show pending cells or claim those execution steps already happened. Every new-page action must also have a complete, page-specific **New-page brief** shown inline in the saved chart AND on-screen approval output: identity, validated keyword/SERP evidence, existing-page/duplicate rationale, reader question and answer placement, concrete outline, inspected sources and contribution, testing/review decision, takeaway, inbound/outbound link placements, and technical/measurement scope. A title/URL row or link to a separate file is insufficient. Missing/mismatched briefs block the chart; never shorten them out. Approval remains the sole existing human gate.
<!-- /mindmap-visible-checks-v1 -->


<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


**Testing publication check:** Apply `_testing-labels.md` to every affected route. Verify its exact-content evidence decision and built title, metadata, byline, methods and schema with the active site's adapter. If a shared rendering change affects other routes, include them in validation. Missing/stale approval, mismatched labels or unsupported leftover testing claims block publication of the affected content. Missing adapters must be wired and verified before tested labels can be enabled; do not create permission or fabricate records. Preserve local medical/psychedelic and other exclusions. This is a publication condition, not permission to rewrite unrelated historical pages.

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

## Worker
After the informational Phase 8 summary, continue automatically within the publication scope authorized at Phase 0, provided every required independent review and final rendered check passes. Phase 8 adds no human approval gate:
1. Inspect the working tree and staging. Commit only this run’s independently approved changes. Preserve unrelated edits and pre-existing staged work, using a separate index or an isolated reviewed publication checkout when needed. Unexpected changes require attribution and reconciliation, never a blanket add, stash or reset.
2. Single commit:
   `Mindmap pass: {C} consolidations, {M} metadata, {N} new pages, {B} body, {L} link passes (chart: reports/mindmap-pass/<date>.md)`
   + blank line + short bullet list of routes touched + `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
3. Deliver per the discovered push target: push directly to the default branch, or push a branch and open a PR.
4. Capture the actual publication commit SHA from the commit operation or isolated publication checkout. Fetch the intended remote branch and verify that this commit exists in its history and that the selected reviewed file blobs are unchanged. With a separate index or isolated publication checkout, the primary working checkout’s HEAD and pre-existing staging need not move. Record the publication SHA and remote proof.
5. Verify that the published commit contains only approved changes and that unrelated working files and pre-existing staging remain intact. Report the actual working-tree state; unrelated preserved work does not require cleanup.
6. **VERIFY THE EXACT REVIEWED OUTPUT LIVE — REQUIRED before IndexNow and the final report.** Follow `_rendered-page-audit.md` and use `rendered-audit.py` to capture every affected route after deployment, including routes affected by shared templates, injected copy, affiliate transformations and links. Confirm the reviewed source revision is deployed; HTTP 200 alone is not a PASS. Hydrate interactive content in a real browser, independently audit the complete final render, freshly recapture it and compare live output with the exact approved snapshot. Recheck changed output before claiming it shipped. Fix a failed route in place, rebuild, obtain the required affected-page review and verify again; after two failed rework attempts stop and escalate. If this run left a broken change live, restore its last verified version without reverting unrelated work. Keep the per-route status and exact comparison evidence in the final verification report. Do not proceed while required checks are unresolved.
7. **IndexNow submission, after exact live verification only.** Intersect the run’s IndexNow list with routes that returned HTTP 200, passed the exact reviewed-output comparison and are eligible canonical URLs. Exclude aliases, redirects and failed routes. Resolve the helper from the active project and verify it during preparation. If it is missing locally, restore that project’s current published `.claude/scripts/indexnow-submit.py` and dependencies. If the project has no published copy, install the published fleet-shared host-agnostic helper while preserving the project’s overrides and permissions. Global routines must resolve/install the helper into the active project before use. Preserve its host, key and site permissions; never borrow another project’s configuration. Run `python3 .claude/scripts/indexnow-submit.py --urls-file <verified-eligible-urls>` and record its result. Never submit a route merely because it returns 200.
8. **‼️ FINAL STEP — Direct links to every newly created page (REQUIRED, always last).** After the exact live verification (step 6) and IndexNow (step 7), end the run by giving the user a clickable link list of EVERY newly created page from this run, so they can open each one directly in a browser and see it. Rules:
   - One page per line, as a full absolute URL (`https://<BASE_URL>/<path>`) — never a relative path, never a file path, never a route name.
   - Format each line as a markdown link whose text is the page's H1/title: `- [Page Title](https://<BASE_URL>/<path>)`.
   - Include ONLY pages that returned 200 and passed exact reviewed-output verification in step 6. Pages that were reverted/FAILED go in a separate `⚠️ Not live` list underneath with their final status code — never mixed into the clickable list.
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
Tree:       {actual state; unrelated edits/staging preserved}

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
- ☐ approved publication scope verified; unrelated working files and pre-existing staging preserved
- ☐ commit message references the chart
- ☐ only intended files changed
- ☐ delivery matches the push target
- ☐ final response prominently displays the full commit SHA
- ☐ the actual publication commit exists on the intended remote history and its reviewed file blobs are unchanged
- ☐ IndexNow fired only after deployed-source and exact reviewed-output verification, for eligible canonical HTTP 200 routes
- ☐ every affected route, including shared-template changes, has an HTTP status and exact reviewed-output result in the linked final report; interactive output was hydrated and freshly recaptured
- ☐ the final response ENDS with the `🔗 New pages` clickable-link list — one full absolute URL (markdown link, page title as text) per newly created fully verified page; failed/reverted pages listed separately, never in the clickable list

<!-- mindmap-execution-v1 -->
Before this existing publication step, verify `_mindmap-execution.md` analysis checks and the actual unchanged rendered approvals for every applicable substantive action. Deliver the real approved assets and complete new-page link list; no spec-only asset completion. Preserve existing live verification, growth and IndexNow rules.
<!-- /mindmap-execution-v1 -->
