
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 3c — Study + auto-build improved tools (NET-NEW)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


For every `tool` candidate (NEW) from Phase 2, build a real, improved interactive tool for this project — not a guide stub. `git add` your work; do NOT commit. Phase 4 (with its tool-logic check) is the gate.

## 1. Study the competitor's tool

From the candidate's `title`, `outline`, and `tool_io` (captured inputs/labels/selects), infer:
- **Purpose / job-to-be-done** (e.g. ROI calculator, savings estimator, readiness quiz, lead-value calculator).
- **Inputs** (fields, units, sensible ranges/defaults) and **outputs** (the metric(s) it computes).
- **The formula / logic** connecting them. `tool_io` is best-effort (some inputs are JS-rendered or are just a contact form) — if the captured inputs look like a generic lead form rather than the tool's real inputs, reconstruct the tool's real inputs/outputs from the topic + your own domain knowledge. If you genuinely cannot determine a defensible formula, **fall back to a guide page** (Phase 3 `page` path) on the same topic and record disposition `published` with that guide route — never ship a calculator with invented math.

## 2. Build it, mirroring the existing tool scaffolding

Study an existing tool/interactive in the project before writing (the route + component pattern Phase 0 found), and mirror it exactly. **If the project has NO interactive-tool mechanism, do NOT invent one — fall back to a guide page (Phase 3 `page` path) on the same topic.** When a tool pattern exists:
- New tool page at the project's tool-route location — same layout/imports/sections and SoftwareApplication JSON-LD as the project's existing tools.
- New component in the project's component location — input state, computed outputs, accessible labels, and clear formula constants (named, commented).
- Intro / explanation / FAQ copy written with the verbatim content prompt from `keyword-gap-pass/phase-3-new-content.md` (substitute `{BUSINESS_NAME}` with the business name discovered in Phase 0).
- **"Improved" = better than the competitor's:** clearer inputs, a more accurate/defensible formula with stated assumptions, a worked example, and an explanation section the competitor lacks. Never name the competitor.

## 3. Wire it up
- Add the route to the project's tools sitemap (Phase 5 confirms; add with today's `lastmod`).
- Add inbound links from the most relevant existing pages (handled in Phase 5).

## Guardrails
- **Formula correctness is mandatory** — Phase 4's tool-logic check will fetch nothing but will read your component, verify the math is sound and assumptions are stated, and `tsc` compiles. Fail → `draft: true`, route excluded.
- 100% original — no copied copy or code from the competitor; only the *idea* of the tool carries over.

Record each tool's intended `our_url` (`/tools/<slug>`) for Phase 6. **Auto-continue to Phase 4.**


