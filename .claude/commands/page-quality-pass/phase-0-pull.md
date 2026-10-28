
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 0 — Pull (GA4 engagement, 28-day window)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


One pull, wide window, engagement metrics on. This is deliberately different from the 24h passes: engagement RATES need sample size, and this pass diagnoses quality, not momentum.

```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 scripts/trend_pass/ga4_pull_24h.py \
  --property-id <GA4_PROPERTY_ID_FROM_ROUTINE> \
  --with-engagement --with-channels --days 28 --top 25 \
  --json reports/page-quality-pass/<YYYY-MM-DD>.pull.json
```

(Same inline-SA-per-command pattern as every sibling pass — env vars do not persist across Bash calls.)

Each `top_pages` row carries: `views`, `sessions`, `active_users`, `avg_eng_s` (userEngagementDuration ÷ activeUsers — the number the GA4 UI shows as "Average engagement time per active user"), `engagement_rate`, `bounce_rate`, and — on properties with enhanced-measurement scroll tracking — `scrolled_users` / `scrolled_pct` (share of users who scrolled 90%). The script auto-retries without the scroll metric on properties that lack it; when `scrolled_pct` is absent, every downstream rule that reads it is simply skipped.

## Validation
- Exit 2/3 (credentials / permission) → email failure per the orchestrator, exit 0.
- Exit 5 (no data) → digest "GA4 window empty", `--status no-changes`, exit 0.
- Fewer than 8 rows or total sessions < 100 across the window → the site is too small for stable engagement diagnosis this window: digest "insufficient traffic for quality diagnosis", `--status no-changes`, exit 0. (Do NOT lower the floors to force findings.)

## Output
`reports/page-quality-pass/<YYYY-MM-DD>.pull.json` → Phase 1. Do not widen the pull, add dimensions, or re-rank by anything other than views — selection logic lives in Phase 1.
