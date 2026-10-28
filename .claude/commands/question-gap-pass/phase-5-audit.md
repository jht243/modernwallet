
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 5 — Adversarial audit of the enriched pages

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


An automatic quality gate, NOT a human checkpoint. A fresh **Explore subagent that did NOT write the sections** reviews every Phase 4 edit against the verbatim audit standard. This gate covers all enriched pages.

## How to run it
For each page touched in Phase 4, hand the reviewer subagent:
1. The **exact, full text** of `.claude/commands/seo-gsc-pass/phase-4-audit.md` as the audit standard — character-for-character, never paraphrased.
2. The page's diff (what was added/changed) plus the follow-up question + action each edit was meant to satisfy.

The reviewer returns the standard JSON contract: `{"ok": true|false, "issues": ["..."]}`.

## What the reviewer checks (in addition to the verbatim standard)
- **The added section actually answers the question** it was for — completely, not a vague gesture. A reader's follow-up is resolved.
- **AEO opener** — the section/FAQ answer leads with a complete, self-contained declarative statement, not a rhetorical restatement of the question.
- **No duplication** — the new answer doesn't repeat content already on this page or merely restate what another page says (the `Link` rows must be links, not re-answers).
- **In-place only** — the edit is a targeted insertion; the rest of the page is unchanged. Flag any wholesale rewrite or regeneration.
- **No fabricated facts** — any price/duration/stat/claim is sourced or hedged, never invented.
- **Hard-fail (set `ok:false`):** sales/marketing/hype language, hallucinated claims, the question still isn't answered, broken structure, or a wrong body-field key that renders the section empty.

## Rework loop + retry limit
- On `ok:false`, rework using the reviewer's notes, then re-audit. **Max 2 rework attempts per page.**
- If the 2nd retry still fails, **REVERT that page's edit** — restore the file byte-for-byte to its pre–Phase 4 state (`git checkout -- <file>` for that file, or undo the targeted Edits). Record it in the summary as "reverted — failed audit." One bad enrichment never ships and never blocks the rest of the batch.

Print the Phase Summary (X/Y pages passed; N reverted and why) and **auto-continue to Phase 6** with the surviving enriched pages.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
This is the automatic reviewer gate, not the human one. The human already approved at Phase 3. Continue to Phase 6 in the same turn.

## Content standard — audit gates

**Load `.claude/commands/_content-standard.md` and apply its `## AUDITOR` section in full.** It is the single source of truth for the content gates: register and voice, tee-up, experience truth, required page elements, byline-in-body, the proprietary anchor, neutrality, disclaimer placement, depth floors, first-mention links, and the row records.

**Also load `.claude/commands/_experience.md`** — every first-person experience claim on a page must be traceable to it; anything it does not license is an invented claim and fails.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **AUDITOR** section in full, including the meaning bar. It outranks the content standard on any conflict.

If any of those files is missing, FAIL the run and report it — never substitute your own gates.

---

## Remediation — how a finding gets fixed (MANDATORY)

**Load `.claude/commands/_remediation-ladder.md` and apply it IN FULL.** It is the single source of truth for what happens AFTER a gate fails: Rung 0 mechanical lint (never a rework attempt), Rung 1 FIX-IN-PLACE with the reviewer supplying the exact replacement text, Rung 2 REWORK by the writer for that page only — max 2 attempts **per page**, then drop that page and continue the run. It also defines per-page pass state: a page that passed is never re-audited because a sibling was fixed. It changes only the COST of fixing a finding, never the bar for passing one — every gate above applies exactly as written. If the file is missing, FAIL the run and report it; never improvise a remediation policy.

**This section supersedes any other retry, rework, or escalation wording in this file.** Where this file already reverts or drops a single page rather than stopping the run, that behaviour is correct and the ladder keeps it; what the ladder adds is the two cheaper rungs BEFORE a rework — the mechanical lint, and the reviewer-supplied fix applied without a writer round-trip.
