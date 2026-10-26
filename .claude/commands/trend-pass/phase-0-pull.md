
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 0 — Pull (7-day window, minimal for the trend lane; +top-20 for coverage)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


**The TREND lane reads exactly two lists:** top 10 queries by clicks and top 10 pages by clicks over the last **7 days**. No baselines, no extra dimensions. The 7-day window clears the signal threshold on a low-traffic site while keeping the trend input tiny.

**One sanctioned addition — `coverage_queries` (top 20 queries).** The pull also returns the top **20** queries (same 7-day window) for the COVERAGE lane (Phase 1b), which asks *"are any top queries missing a dedicated page?"* Trend detection (Phase 1) ignores this field and still works only from `top_queries[10]`.

```bash
python3 scripts/trend_pass/gsc_pull_7d.py --base-url <BASE_URL> \
  --json reports/trend-pass/$(date +%Y-%m-%d).pull.json
```

## Failure handling
- Exit 2 (no creds) / 3 (permission) → hard blocker: email failure, exit 0.
- Exit 5 (no data in 7d) → email failure ("GSC returned no data for 7 days"), exit 0.
- A low/zero-click week is NOT a failure — it's a valid "no clear trend" input; continue to Phase 1.

## Output
The pull JSON (now with `top_queries[10]`, `coverage_queries[20]`, `top_pages[10]`) → Phase 1 (trend lane) **and** Phase 1b (coverage lane). Fetch nothing else from GSC this run. This pull is the ONLY external data call Lanes A/B make — keyword/SERP data is fetched later, and only by mindmap (Phase 4c).
