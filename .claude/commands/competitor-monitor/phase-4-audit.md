
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 4 — Adversarial audit (+ no-plagiarism + tool-logic)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


This phase IS the gate for Phase 3, 3b-enrich, and 3c. Run as an **Agent tool, `subagent_type: Explore`, read-only** reviewer that did NOT write the content.

## 1. Reuse the comparison/keyword audit VERBATIM

Apply `.claude/commands/comparison-content-creator/phase-4-audit.md` in full — the verbatim audit sentence plus its comparison-specific, enrichment-specific, and advisory checks (metadata length, FAQ JSON, schema.org, internal links resolve, no fabricated facts, net-new only, correct content-array key).

## 2. ADD: competitor no-plagiarism / must-improve check (this skill's highest risk)

For each generated/enriched page, the reviewer must also confirm:
- **No reproduced text.** The reviewer transiently reads the competitor source URL (from the candidate) and confirms **no sentence or passage is copied or near-paraphrased** from it. Any reproduced passage → **FAIL**.
- **Information gain present.** Our page adds ≥1 element the competitor's `outline` does not have (first-hand operational detail, SMB-specific failure mode, non-obvious tradeoff, or decision criterion). If it merely restates the competitor's coverage in different words → **FAIL**.
- **Coverage floor met.** Our page covers every topic in the competitor's `outline` (or better). Material gaps → **FAIL** (rework to add the missing topic).
- **Competitor not named** on the page → if named, **FAIL**.
- Competitor HTML/text was **not** committed into the repo → if present, **FAIL**.

## 3. ADD: tool-logic correctness check (for Phase 3c tools)

For each built tool, the reviewer reads the tool page + its component and confirms:
- **The formula is mathematically sound** and produces sensible outputs across the input range (spot-check 2–3 input sets by hand).
- **Assumptions are stated** on-page (no hidden magic constants; named, commented formula constants).
- **`npx tsc --noEmit` compiles** and the component has no obvious runtime error (undefined state, division-by-zero on default inputs, NaN outputs).
- Uses `buildSoftwareApplicationSchema` JsonLd like the existing tools.
Any failure → **FAIL** (rework, or fall back to a guide page per Phase 3c).

## Rework + escalation
On failure, hand specific notes back to the relevant writer logic (Phase 3 for a page, 3b for an enrichment, 3c for a tool) and re-run. **Max 2 rework attempts**, then escalate:
- **net-new page/tool** → mark `draft: true` (noindex, excluded from sitemap + IndexNow), record the reason, continue.
- **enrichment edit** → revert that file (`git checkout -- <file>`), record the reason, continue.

One failing item never blocks the others. Record the pass/draft outcome per item for the email. **Auto-continue to Phase 5.**

## Content standard — audit gates

**Load `.claude/commands/_content-standard.md` and apply its `## AUDITOR` section in full.** It is the single source of truth for the content gates: register and voice, tee-up, experience truth, required page elements, byline-in-body, the proprietary anchor, neutrality, disclaimer placement, depth floors, first-mention links, and the row records.

**Also load `.claude/commands/_experience.md`** — every first-person experience claim on a page must be traceable to it; anything it does not license is an invented claim and fails.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **AUDITOR** section in full, including the meaning bar. It outranks the content standard on any conflict.

If any of those files is missing, FAIL the run and report it — never substitute your own gates.

---

## Remediation — how a finding gets fixed (MANDATORY)

**Load `.claude/commands/_remediation-ladder.md` and apply it IN FULL.** It is the single source of truth for what happens AFTER a gate fails: Rung 0 mechanical lint (never a rework attempt), Rung 1 FIX-IN-PLACE with the reviewer supplying the exact replacement text, Rung 2 REWORK by the writer for that page only — max 2 attempts **per page**, then drop that page and continue the run. It also defines per-page pass state: a page that passed is never re-audited because a sibling was fixed. It changes only the COST of fixing a finding, never the bar for passing one — every gate above applies exactly as written. If the file is missing, FAIL the run and report it; never improvise a remediation policy.

**This section supersedes any other retry, rework, or escalation wording in this file.** Where this file already reverts or drops a single page rather than stopping the run, that behaviour is correct and the ladder keeps it; what the ladder adds is the two cheaper rungs BEFORE a rework — the mechanical lint, and the reviewer-supplied fix applied without a writer round-trip.
