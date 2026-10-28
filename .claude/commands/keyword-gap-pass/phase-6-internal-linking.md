
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

# Phase 6 — Internal linking

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Execute the internal-linking rows from the chart, AND add inbound internal links to every page created in Phase 3 (**target ~3 links each** from relevant existing pages).

**The ~3 is a target, not a quota — relevance wins over the count.** Only add a link where it is genuinely contextually relevant and reads naturally. If a new page has fewer than 3 *logical* placements, add the ones that fit and STOP — do not manufacture a forced, marginal, or over-optimized exact-match link just to hit the number, and never repeat the same anchor across unrelated pages. A page with 1–2 strong, relevant inbound links is better than 3 where one is a stretch. When you land below the target, note in the phase report which page and why (no more relevant placements exist) — that is an accepted outcome, not a failure.

Guidance:
- Use the framework `<Link>` with descriptive anchor text — never "click here".
- **If linking from the homepage, do NOT update the header/nav.** Add links in the footer or within the body of the homepage instead.
- Any update must maintain the existing UX/UI — do not break the page, clutter it, or make it look ugly. Match the surrounding design, spacing, and styling.
- Only add links that are genuinely relevant in context; don't force them.
- `git add`. Do not commit.

## Reviewer gate (Explore subagent)
- ☐ all chart internal-link rows actioned
- ☐ every Phase-3 page has inbound links up to the ~3 target where relevant; any page below 3 has a noted reason (no more logical placements) — a relevant 1–2 is acceptable, a forced/marginal link to hit 3 is NOT
- ☐ homepage header/nav untouched (links only in footer/body)
- ☐ links use framework `<Link>` + descriptive anchors
- ☐ no layout/UX breakage or visual clutter
- ☐ links are contextually relevant

Reject with specifics; retry rule 4 (2 attempts then STOP) applies.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/keyword-gap-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).
