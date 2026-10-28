
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 1 — Cannibalization detection (ADVISORY ONLY — writes no page edits)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


> ⚠️ **This phase no longer executes consolidation.** A backwards 301/canonical is the single most destructive action in SEO — a bot acting on partial GSC data can redirect the page Google actually ranks into a weaker one and crater a whole cluster. The *detection* (knowing two pages compete) is valuable; the *automated execution* is not. So this phase **only detects and flags** cannibalization for the human. It writes **no canonical, no 301, no body change, no link re-point, no sitemap removal.** If a real consolidation is warranted, the human does it deliberately, by hand, later.

For each consolidation/cannibalization row in the chart (or competing pair you detect):
1. **Confirm it's real:** both routes resolve AND they genuinely target the same query cluster (not merely adjacent topics). If they don't actually compete, drop it.
2. **Record an advisory entry** — do not act on it. Capture, per pair:
   - both routes with their impressions/clicks from the chart,
   - the shared query cluster,
   - a one-line recommendation based on dominance:
     - **winner ≥3× the other AND holds the clicks** → "clear dominance — a *manual* canonical loser→winner may be worth it; human decision."
     - **within ~3× (near-tie)** → "DO NOT consolidate — differentiate the two pages' angles or add internal links instead."
3. **Write the advisory** to `reports/mindmap-pass/<date>.cannibalization.md`, and surface every pair in the Phase 8 summary so the user sees it before approving.
4. **Touch no source files.** No canonical, no 301, no body thinning, no link re-pointing, no sitemap edit. (Softer, safe fixes — differentiating angles or adding internal links — only happen if the chart author classified them as **body** (Phase 5) or **internal-links** (Phase 6) rows; this phase never edits pages itself.)

## Reviewer gate (Explore subagent — did not do the work)
- ☐ **NO source file changed** — no canonical/301 written, no body edited, no internal link re-pointed, no sitemap entry removed
- ☐ each detected pair lists both routes' impressions/clicks and the shared query cluster
- ☐ each pair has a clear advisory recommendation (manual-consolidate vs differentiate vs leave alone)
- ☐ the advisory is recorded in `reports/mindmap-pass/<date>.cannibalization.md` and will appear in the Phase 8 summary
- ☐ no near-tie (within ~3×) is recommended for consolidation

Reject with specifics; retry rule 4 (2 attempts then STOP) applies.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/mindmap-pass` run has EXACTLY ONE human stop (the Phase 0 manifest approval), and this phase is NOT it:
- Stop 1: the Phase 0 manifest approval (before any edits).
- (Phase 8 is an informational summary that auto-continues to the Phase 9 push — NOT a stop.)

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going through Phase 8 and the Phase 9 push without stopping.
