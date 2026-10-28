
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

# Phase 1 — Select the top N pages by GSC clicks → map each to its source file

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


This is the **only paid/data call in the skill**. Pick the project's most-visited pages from Google Search Console clicks, then resolve each live URL back to the editable source file Phase 0 mapped. Default **N = 20** (or `$ARGUMENTS`, or the explicit `--pages` list).

## Pull the top pages

Use the GSC source Phase 0 confirmed. **Primary = the direct Google Search Console API** (no Ahrefs) — it returns the complete, real click/impression data (Ahrefs only samples a subset of GSC).

- **Direct GSC (preferred):** run the repo helper
  ```
  python3 .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
    --base-url <BASE_URL> --top-pages <N> --days 90
  ```
  It derives the `sc-domain:<host>` property, ranks pages by clicks then impressions, and returns JSON `{ "top_pages": [ {page, clicks, impressions, ctr, position}, ... ] }`. Parse `top_pages`.
  - **Credentials:** the helper reads `GOOGLE_REPORTING_SA_JSON` (inline JSON), `GOOGLE_REPORTING_SA_FILE`, or `~/.claude/secrets/gsc-service-account.json`. In a cloud routine the service account is passed **inline** — prefix the command with `GOOGLE_REPORTING_SA_JSON="$(echo '<base64>' | base64 -d)"`. Install deps once if needed: `python3 -m pip install --quiet google-auth requests`.
  - Exit 2 = no creds; exit 3 = the SA lacks permission on the property → STOP, report it (don't fabricate pages).
- **Ahrefs MCP `gsc-pages` (fallback only)** — use *only* if the direct GSC helper has no credentials available (e.g. a local run with no SA). Same idea: pages sorted by clicks, top N.
- If `--pages "<url>,<url>,..."` was passed, skip the call and use that list verbatim (clicks/impressions = `n/a`).

If GSC returns nothing for the property, do not fabricate pages — STOP per the hard blocker and report that the GSC source returned no rows.

## Filter the list

Drop pages that this skill can't or shouldn't enrich:
- **Homepage / pure navigation / category index pages** with no article body — there's nothing to answer-enrich. Note them as skipped.
- **Non-content routes** (login, pricing-app, legal boilerplate) unless they genuinely host answerable content.
- Anything whose URL Phase 0's mapping **cannot resolve to a source file** — record it as `unmapped` and skip; do not guess a file.

Keep going until you have up to N **mapped, enrichable** content pages, ranked by clicks.

## Map URL → source file

For each surviving page, resolve the live URL to its exact editable file using Phase 0's URL→file rule (strip BASE_URL, match slug to the data-object entry / MDX path / CMS id). Record for each:
- `url`, `clicks`, `impressions`
- `source_file` (exact path) + the body field key (for data-object stores)
- `title` / `H1`

Read each selected page's source in full now (or note it for Phase 2/3 to read) so question generation and scoring work from real content, not the URL.

Write the selected set to `reports/question-gap-pass/pages.json`. Print the Phase Summary (list the N pages with their click counts) and **auto-continue to Phase 2**.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The one human stop is the Phase 3 Gap Chart gate. This phase is NOT it. Start Phase 2 in the same turn.
