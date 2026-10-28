
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 0 — Pull (GA4, minimal by design)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


**Exactly one list and its channel split, nothing more:** the top-10 most-visited pages over the freshest 24h of GA4 data, plus the per-page channel breakdown. GA4 is the ALL-traffic source — the list already includes direct, referral, and AI-assistant (Unassigned) traffic that GSC never reports. **Do not widen this pull.**

## Run

The routine message supplies this site's GA4 property id and the inline `GOOGLE_REPORTING_SA_JSON`. Pass the property id via `--property-id` and prefix the SA **on this same command** (env vars do NOT persist across separate commands, so never rely on an earlier `export`):

```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 scripts/trend_pass/ga4_pull_24h.py \
  --property-id <PROPERTY_ID_FROM_ROUTINE> \
  --with-channels \
  --json reports/trend-pass/$(date +%Y-%m-%d).ga4.pull.json
```

(The routine typically already ran this exact pull as its step 1 — if `reports/trend-pass/<date>.ga4.pull.json` already exists, reuse it instead of re-pulling.) Missing property id → pull exits 4; that's a hard blocker: email failure, exit 0.

The script probes the last 4 days and uses the freshest date with sessions. The JSON contains `data_date`, `source: "ga4"`, `top_pages[10]` (each with `views`, `sessions`, `active_users`, and a `clicks` alias = views), `top10_pages_total_views`, and `channel_split` (per-page sessions by default channel group).

> Distinct filename: `<date>.ga4.pull.json` (the GSC trend pass writes `<date>.pull.json`). Shared report dir; separate pulls.

## Failure handling
- Exit 2 (no credentials) or 3 (permission) → hard blocker: email failure, exit 0.
- Exit 5 (no data in 4 days) → email failure ("GA4 returned no data for the last 4 days"), exit 0.
- Low/zero views is NOT a failure — pages with even a handful of real visits are auditable; continue to Phase 1.

## Output
The GA4 pull JSON path → Phase 1. Do not fetch anything else from GA4 this run.
