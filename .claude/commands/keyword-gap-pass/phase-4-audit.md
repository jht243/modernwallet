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

**FAIL — byline/date in body prose.** Reviewer byline + review date belong in the header/byline area + JSON-LD schema, never in body content. If any prose field (intro, sections, verdict, callouts, FAQ answers) contains a reviewer/author attribution or review-date sentence — e.g. "Reviewed by …", "Last updated …", "on [date]", "We research using …", "[Name], Founder of …" — set fail with note "byline-in-body: [field/heading]". Fix: delete it from prose and rely on the record's date fields + the template/schema byline.

---

## Advisory notes (record, do NOT block publication)

These are NON-BLOCKING observations the reviewer records for the run summary. Do NOT set fail for any of them. The reviewer continues to auto-continue exactly as today.

- **Low Information Gain** — if a section reads like conventional wisdom with no original example, case-specific insight, or non-obvious implication, note: "low information gain: [section heading]".
- **AEO gap** — if a major section's opening sentence is a rhetorical question or transition phrase ("In this section…") rather than a self-contained declarative claim, note: "AEO: [section heading] does not open with a direct claim".
- **Missed long-tail opportunity** (NOT a quota) — only if the page targeted broad head terms while ignoring a clearly relevant question-format query that had no stronger alternative and would have fit naturally, note: "missed long-tail: [topic]". Do NOT note this merely because a page lacks question-format headings/FAQs — a page already well-targeted to stronger keywords is correct as-is.
- **Authorship missing** — if a YMYL page (compliance, finance, medical, legal) has Organization-only author, no Person JSON-LD, or no `reviewer`/`lastReviewed` in schema, note: "authorship: [missing element]". (The visible byline belongs in the header + schema — do NOT expect or reward a "reviewed by" line in body prose; that is a FAIL, see above.)
- **Missing external link** — if the page names a clickable external entity that this project does NOT auto-link (a niche/newer tool, a specific company, a named law/standard, a cited study/dataset, or the source behind a statistic) without a link to its official primary source on first mention, note: "external link: [entity/source]". Do NOT flag entities the project auto-links at render time (common models/IDEs/AI-labs/benchmarks) — those stay plain text in the source.
- **Not task-complete** — if the page redirects out (or thin-wraps an external link) without first answering the reader's intent on-page, or cites an aggregator instead of the first-party source, note: "task-complete: [issue]".

A page with any/all of these notes and no hard-fail issues still passes audit.

---

## ‼️ DEPTH GATE — deterministic, blocks the phase (MANDATORY — added 2026-08-17, ported from `/new-site` via mindmap-pass)

**This is not a reviewer judgment call and no subagent opinion overrides it.** Run it as the FIRST action of this phase and again as the last. It applies to `article` format rows only — spec-only (non-article) rows are exempt, since their deliverable is a spec, not prose.

**Measurement — use the first rung that applies:**
1. **If Phase 0 found a `check-depth` script in this repo** (`npm run check-depth`, installed by `/new-site`): run it. A non-zero exit **blocks this phase**. This is authoritative — it measures the built output, so it catches thinness the source view can miss.
2. **Otherwise, measure from source.** For each new page record, concatenate every reader-facing prose field (intro + section bodies + FAQ answers + verdict) — excluding title, meta description, schema, `inlineCta`, CTA boilerplate, and code blocks — and word-count it. Do this with an actual command (e.g. pipe the extracted text through `wc -w`), never by eyeballing length.

**Verdict:** compare each page against the floors table in `phase-3-new-content.md` (comparison/review 1,500 · persona 1,400 · hub/worth-it/explainer 1,200 · cost 1,000 · editorial 600; **explainer 1,200 is the default** for anything that doesn't clearly match another type). Any page under its floor is a **HARD FAIL** — hand it back to Phase 3 for expansion with real substance, and re-measure. It is not fixable by padding: a page that clears the floor but trips the AI-filler gate below fails anyway, so expansion must add actual information.

**Report the distribution, not per-page verdicts.** Print `passing / failing / median` across all article pages this run. Page-by-page review is structurally blind to run-wide thinness — a 300-word page reads as concise and on-intent in isolation, and only the distribution shows that every page is one. On runs of 3+ article pages, a median sitting within 10% of the floor is itself a finding: record it as `depth: median {N} barely clears floor {F}` in the summary even when every page individually passes.

---

On any failure, hand specific notes back to Phase-3 logic and re-run. Max 2 rework attempts, then STOP and escalate.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/seo-gsc-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).


