
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 0 — Pull top GSC pages, then read each page's live SERP

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Two steps, both read-only. Step A finds the pages worth checking; Step B reads the actual Google result page for each so Phase 1 can see who the AI Overview cites. Nothing is judged here.

## Step A — top pages + each page's top query (GSC)
```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
  --base-url <BASE_URL_FROM_ROUTINE> \
  --top-pages 25 --json reports/ai-answer-citation-pass/<YYYY-MM-DD>.pages.json
```
Then, for each of those 25 routes, pull its own top query (the query the page actually ranks for — that is the query whose SERP we read):
```bash
GOOGLE_REPORTING_SA_JSON="$(echo '<BASE64_SA_FROM_ROUTINE>' | base64 -d)" \
python3 .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
  --base-url <BASE_URL_FROM_ROUTINE> --stdin --json reports/ai-answer-citation-pass/<YYYY-MM-DD>.pagequeries.json \
  < <one route URL per line>
```
(Same inline-SA-per-command pattern as every sibling pass — env vars do not persist across Bash calls.)

Build a `route<TAB>query` pairs file — one line per page, `query` = that page's highest-click `top_queries` entry. Skip a page whose top query is non-English or empty (the SERP read would be for the wrong intent) and note it under Skipped.

## Step B — read the live SERP for each page's query (DataForSEO)
```bash
DATAFORSEO_B64='<DATAFORSEO_B64_FROM_ROUTINE>' python3 scripts/lib/serp.py paa \
  --pairs-file reports/ai-answer-citation-pass/<YYYY-MM-DD>.pairs.tsv \
  --out reports/ai-answer-citation-pass/<YYYY-MM-DD>.serp.json --cap 25
```
Cost ≈ $0.004 per page (~$0.10 for 25). Each `pages` entry carries, per route: `query`, `verdict`, `ai_overview_present`, **`ai_overview_cited_domains`**, `top10_domains`, `forum_dominated`, `featured_snippet`, `paa`, `related_searches`, `recommended_shape`. `ai_overview_cited_domains` and `top10_domains` are the two fields Phase 1 buckets on.

## Validation
- GSC exit 2/3 (credentials / permission) → email failure per the orchestrator, exit 0.
- GSC returns 0 pages → digest "GSC window empty", `--status no-changes`, exit 0.
- `serp.py` reports no DataForSEO client / auth error for EVERY page → the SERP can't be read this run: digest "SERP read unavailable (DataForSEO)", `--status no-changes`, exit 0. Never guess citations. A per-page read that fails lands as `verdict: unread` for that route and is carried as Skipped, not fatal.

## Output
`reports/ai-answer-citation-pass/<YYYY-MM-DD>.serp.json` (+ the GSC pulls) → Phase 1. Do not judge citations here — bucketing is Phase 1.
