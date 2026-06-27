# Phase 4 — Confirm new content (dedicated adversarial review)

This phase IS the gate for Phase 3. It checks **only the net-new pages created in Phase 3** — not metadata changes, not body-text updates. Run as an Explore subagent that did NOT write those pages.

**Check the `format` column of each Phase 3 row before applying the checklist.** Article rows and non-article rows have different review criteria:

**For non-article format rows (`interactive tool`, `calculator`, `quiz/assessment`, `template`, `comparison table/database`, `glossary/reference`, `data report`):** Phase 3 produced a spec file, not prose. Audit the spec — not the placeholder route — against this checklist:
- Spec file exists at `reports/seo-pass/specs/<slug>-spec.md` ✓/✗
- Target route is named ✓/✗
- Format is named with a rationale tied to the cluster's query signals ✓/✗
- What the asset does is described in enough detail to build it (inputs→outputs for tools; question flow for quizzes; column schema for tables; data sources for reports) ✓/✗
- Primary and secondary keywords are listed ✓/✗
- Technical dependencies are noted (components needed, data required, etc.) ✓/✗
- A placeholder exists at the target route (if the framework expects a route file) ✓/✗
A spec that passes all seven points is a **PASS** — the human builds the asset in a follow-up; that is by design. Missing items are hard-fail rework.

**For `article` format rows:** apply the standard checklist below.

---

Make sure all article pages meet metadata length requirements (title/description), follow FAQ JSON, schema.org, and have good internal linking.

---

## Advisory notes (record, do NOT block publication)

These are NON-BLOCKING observations the reviewer records for the run summary. Do NOT set fail for any of them. The reviewer continues to auto-continue exactly as today.

- **Low Information Gain** — if a section reads like conventional wisdom with no original example, case-specific insight, or non-obvious implication, note: "low information gain: [section heading]".
- **AEO gap** — if a major section's opening sentence is a rhetorical question or transition phrase ("In this section…") rather than a self-contained declarative claim, note: "AEO: [section heading] does not open with a direct claim".
- **Missed long-tail opportunity** (NOT a quota) — only if the page targeted broad head terms while ignoring a clearly relevant question-format query that had no stronger alternative and would have fit naturally, note: "missed long-tail: [topic]". Do NOT note this merely because a page lacks question-format headings/FAQs — a page already well-targeted to stronger keywords is correct as-is.
- **Authorship missing** — if a YMYL page (compliance, finance, medical, legal) has Organization-only author, no visible byline, no Person JSON-LD, or no "reviewed by" line, note: "authorship: [missing element]".
- **Not task-complete** — if the page redirects out (or thin-wraps an external link) without first answering the reader's intent on-page, or cites an aggregator instead of the first-party source, note: "task-complete: [issue]".

A page with any/all of these notes and no hard-fail issues still passes audit.

---

On any failure, hand specific notes back to Phase-3 logic and re-run. Max 2 rework attempts, then STOP and escalate.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/seo-gsc-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).
