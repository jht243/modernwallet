
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 2 — Coverage / dedup check FIRST (the API-cost gate)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


**This is the credit-saving gate. No AI generation call may happen until a candidate clears this phase.** Dedup every scraped candidate against **ALL existing this project's content** from Phase 0 — guides, comparisons, verticals, landing pages, tools — so we never spend credits writing a page the Phase 4 audit would reject as a duplicate. Pure local work; zero AI/API spend.

## Reuse the comparison coverage check

Apply `.claude/commands/comparison-content-creator/phase-1b-coverage-check.md` to the candidate list, mapping each competitor candidate to a this project **topic/slug** to dedup:
- For a `page` candidate, derive the topic from its `title` + `outline` (e.g. "AI for ecommerce", "invoice matching automation").
- For a `comparison` candidate, derive the entity pair / "X alternatives" topic.
- For a `tool` candidate, derive the tool's job (e.g. "ROI calculator", "readiness assessment").

Run the three checks from that file (exact/reverse slug, entity/topic already covered inside a page, semantic keyword overlap) against the full inventory.

## Tag every candidate
- **`NEW`** — no meaningful existing coverage → proceeds to Phase 3 (or 3c for tools).
- **`PARTIAL`** — we cover it in passing → build an enrichment work-item (existing route + file + exactly what's missing vs the competitor's `outline`) → Phase 3 enrichment.
- **`DUPLICATE`** — already well covered → **drop now**. Record disposition `skipped-duplicate` (with our conflicting URL) for Phase 6's ledger `record`. **Do not generate.**

## Output
- A coverage tag for **every** candidate (nothing silently dropped). DUPLICATE rows carry the conflicting this project's URL and are queued for `record` as `skipped-duplicate`.
- State explicitly: `AI generation calls so far: 0 — dedup ran first`, `NEW → generate: <n>`, `PARTIAL → enrich: <p>`, `DUPLICATE → dropped: <d>`.
- If **0 NEW + 0 PARTIAL** survive → hand to Phase 6 to record the `skipped-duplicate` dispositions + commit ledger, then email **Success Without Changes**. Otherwise **auto-continue to Phase 3.**
