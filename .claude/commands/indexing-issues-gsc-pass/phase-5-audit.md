# Phase 5 — Audit (consolidated adversarial review of all fixes)

**This phase IS the gate for Phases 1–4.** Technical indexing fixes are the highest-risk edits in this workflow — a wrong canonical, a backwards 301, or an over-broad `noindex`/robots change can *de-index a working page*. So a single dedicated adversarial reviewer re-verifies every change from Phases 1–4 before any downstream phase runs.

Run as an Agent (`subagent_type: Explore`, read-only) that did NOT make any of the changes. Give it the report (`reports/indexing-pass/<date>.md`), the inspection JSON, the status-changes log, and the staged diff.

## What the auditor must verify
- **Traceability:** every change maps to a real report row backed by a real `coverageState` in the inspection JSON. No speculative edits.
- **No de-indexing (the cardinal check):** no live/indexed URL was given `noindex`, 301'd, 410'd, or canonicalized into another page without explicit report evidence it should be. Cross-check against the set of "Submitted and indexed" URLs in the inspection JSON — none of them should have been demoted.
- **No site-wide / config-level blast radius (global rule 8a) — auto-REJECT on violation:** every change is scoped to the specific reported URL(s)/route(s). The diff must NOT touch base-URL/site-URL config, shared canonical/redirect helpers, global redirect/rewrite rules or middleware, whole templates covering unaffected pages, or robots.txt beyond narrowing the one reported rule. If any edit changes behavior for pages not in the report, reject it — the correct handling for a site-wide root cause is an `ambiguous — needs human` flag, not an automated config change.
- **Canonical integrity (Phase 1):** one canonical per page, correct direction, exact host/protocol/trailing-slash, and **no canonical loop** and no canonical pointing at a redirecting/404 URL.
- **Redirect/error integrity (Phase 2):** soft 404s are now real `200` or proper `404`/`410`; chains collapsed to one hop; no loops; 5xx actually fixed; every change logged in `<date>.status-changes.txt`.
- **Indexability (Phase 3):** only unintended blocks removed; intentional blocks (`/admin`, `/api`, `/health`, utility endpoints) intact; robots.txt still references both sitemaps.
- **Thin content (Phase 4, Mode A):** added content is substantive and original — not filler or keyword stuffing; matches the Phase-0 content standard; pages that shouldn't exist were flagged, not padded.
- **Byline/date in body prose (FAIL):** reviewer byline + review date belong in the header/byline + JSON-LD schema, never in body content. If any added or net-new prose (intro, sections, verdict, callouts, FAQ answers) contains a reviewer/author attribution or review-date sentence — e.g. "Reviewed by …", "Last updated …", "on [date]", "We research using …", "[Name], Founder of …" — set fail with note "byline-in-body: [field/heading]". Fix: delete it and rely on the record's date fields + the template/schema byline.
- **Net-new content (Phase 4, Mode B) — apply the `/seo-gsc-pass` new-content checks:** each net-new page meets metadata length requirements (title 50–60 chars, description within limit); FAQ JSON + schema.org are present and correct; the page carries the same template/JsonLd scaffolding as existing pages; internal linking is good AND obeys the Phase 6 HARD RULE (no related module >3 visible). For a consolidation hub: it's genuinely deeper than the pages it absorbs, and those absorbed routes are recorded for canonical/301 + sitemap removal.
- **Internal-link cap (Phase 6):** re-confirm no related/recommendation module exceeds 3 visible links (overflow behind "See more").
- **Internal-link naturalness (Phase 6):** every added link is topically relevant and editorially natural; no forced/irrelevant links and no page cluttered to hit a quota; anchor text is varied (no repeated exact-match keyword anchor across sources). A target left with <3 links because more weren't natural is fine; one padded with forced links is an auto-REJECT.
- **Scope:** only intended files/rows changed; nothing unrelated touched.

## Advisory notes (record, do NOT block publication)

These are NON-BLOCKING observations the reviewer records for the run summary. Do NOT set fail for any of them. The reviewer continues to auto-continue exactly as today.

- **Low Information Gain** — if a Mode A added section or a Mode B net-new page reads like conventional wisdom with no original example, case-specific insight, or non-obvious implication, note: "low information gain: [section/page]".
- **AEO gap** — if a major section's opening sentence is a rhetorical question or transition phrase ("In this section…") rather than a self-contained declarative claim, note: "AEO: [section heading] does not open with a direct claim".
- **Authorship missing** — if a YMYL page (compliance, finance, medical, legal) has Organization-only author, no Person JSON-LD, or no `reviewer`/`lastReviewed` in schema, note: "authorship: [missing element]". (The visible byline belongs in the header + schema — do NOT expect or reward a "reviewed by" line in body prose; that is a FAIL, see above.)
- **Missing external link** — if the page names a clickable external entity that this project does NOT auto-link (a niche/newer tool, a specific company, a named law/standard, a cited study/dataset, or the source behind a statistic) without a link to its official primary source on first mention, note: "external link: [entity/source]". Do NOT flag entities the project auto-links at render time (common models/IDEs/AI-labs/benchmarks) — those stay plain text in the source.
- **Not task-complete** — if the page redirects out (or thin-wraps an external link) without first answering the reader's intent on-page, or cites an aggregator instead of the first-party source, note: "task-complete: [issue]".

A page with any/all of these notes and no hard-fail issues still passes audit.

## Outcome
- **Pass** → print the phase summary and AUTO-CONTINUE to Phase 6.
- **Reject** → return specific notes to the responsible phase's logic and re-run only that work. **Max 2 rework attempts** across the audited phases; if the 2nd retry still fails, STOP the whole command, report the failing phase + outstanding notes, and wait.

---
## ▶ WHEN THIS PHASE PASSES — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment the audit PASSES, immediately begin Phase 6 in the SAME turn. Do NOT stop or ask. The only human stops are Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8 summary).

## Content standard — audit gates

**Load `.claude/commands/_content-standard.md` and apply its `## AUDITOR` section in full.** It is the single source of truth for the content gates: register and voice, tee-up, experience truth, required page elements, byline-in-body, the proprietary anchor, neutrality, disclaimer placement, depth floors, first-mention links, and the row records.

**Also load `.claude/commands/_experience.md`** — every first-person experience claim on a page must be traceable to it; anything it does not license is an invented claim and fails.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **AUDITOR** section in full, including the meaning bar. It outranks the content standard on any conflict.

If any of those files is missing, FAIL the run and report it — never substitute your own gates.

---

## Remediation — how a finding gets fixed (MANDATORY)

**Load `.claude/commands/_remediation-ladder.md` and apply it IN FULL.** It is the single source of truth for what happens AFTER a gate fails: Rung 0 mechanical lint (never a rework attempt), Rung 1 FIX-IN-PLACE with the reviewer supplying the exact replacement text, Rung 2 REWORK by the writer for that page only — max 2 attempts **per page**, then drop that page and continue the run. It also defines per-page pass state: a page that passed is never re-audited because a sibling was fixed. It changes only the COST of fixing a finding, never the bar for passing one — every gate above applies exactly as written. If the file is missing, FAIL the run and report it; never improvise a remediation policy.

**This section supersedes any other retry, rework, or escalation wording in this file.** Where this file already reverts or drops a single page rather than stopping the run, that behaviour is correct and the ladder keeps it; what the ladder adds is the two cheaper rungs BEFORE a rework — the mechanical lint, and the reviewer-supplied fix applied without a writer round-trip.
