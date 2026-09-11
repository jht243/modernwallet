# Phase 4 — Confirm new content (dedicated adversarial review)

This phase IS the gate for Phase 3. It checks **only the net-new pages created in Phase 3** — not metadata changes, not body-text updates. Run as an Explore subagent that did NOT write those pages.

**Check the `format` column of each Phase 3 row before applying the checklist.** Article rows and non-article rows have different review criteria:

**For non-article format rows (`interactive tool`, `calculator`, `quiz/assessment`, `template`, `comparison table/database`, `glossary/reference`, `data report`):** Phase 3 produced a spec file, not prose. Audit the spec — not the placeholder route — against this checklist:
- Spec file exists at `reports/mindmap-pass/specs/<slug>-spec.md` ✓/✗
- Target route is named ✓/✗
- Format is named with a rationale tied to the cluster's query signals ✓/✗
- What the asset does is described in enough detail to build it (inputs→outputs for tools; question flow for quizzes; column schema for tables; data sources for reports) ✓/✗
- Primary and secondary keywords are listed ✓/✗
- Technical dependencies are noted (components needed, data required, etc.) ✓/✗
- A placeholder exists at the target route (if the framework expects a route file) ✓/✗
A spec that passes all seven points is a **PASS** — the human builds the asset in a follow-up; that is by design. Missing items are hard-fail rework.

**For `article` format rows — and for `comparison table/database` rows that Phase 3 generated as REAL pages (a `<slug>.meta.json` exists):** apply the standard checklist below. A generated comparison is a page, not a spec.

**API-generated pages (the normal case — see `_content-generation.md`):** hand the auditor the run's **closed fact list(s)** (`reports/mindmap-pass/<TODAY>/prompts/<slug>.prompt.md`) and **`allowed-urls.txt`** alongside the drafts, plus each draft's `meta.guards`. An auditor working from a trimmed fact set will flag TRUE sourced facts as fabrication. Before acting on any "unsupported claim" finding, verify it against the source; keep confirmed facts, cut only what no source supports. Findings are actionable only with the exact quoted text; fixes follow the remediation ladder (mechanical in place first).

---

<!-- CRON_PROMPT_START -->
Make sure all article pages meet metadata length requirements (title/description), follow FAQ JSON, schema.org, and have good internal linking.

**FAIL — heading not in Title Case.** Every H1 and section heading (H2/H3) must use Title Case: the first letter of each major word is capitalized. If any heading has a major word starting lowercase — e.g. `"Who Spark fits, and who should look elsewhere"`, `"Spark pros and cons"` — set fail with note `heading-case: [the heading]`. The fix is a one-field capitalization (capitalize the major words; keep minor words a/an/the/and/or/nor/but/for/to/of/in/on/at/by/with/from/vs/via/per lowercase unless first or last; preserve acronyms and brand casing like AI, API, SEO, GPT-5, iOS exactly — never lowercase them). FAQ `question` fields are exempt (they are questions, keep sentence casing).

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

---

## ‼️ SELF-SERVING DISCLAIMER GATE — blocks the phase (MANDATORY — added 2026-08-21)

**Never write a sentence asserting our own neutrality, independence, or lack of a financial interest.** This is a hard fail, not a style note. Strip every instance before the page ships.

Banned constructions (non-exhaustive — judge by intent, not exact wording):
- "Layer3 Labs does not resell / resells none of / does not refer / does not partner with…"
- "We take no referral fee / no commission / no kickback from…"
- "This ranking is independent." / "A note on objectivity:" / "Layer3 Labs is vendor-neutral."
- "We run our own repositories on this stack, so this is written from the position of someone who has to live with the choice."
- Any variant that asks the reader to trust our motives rather than showing our reasoning.

**Why this is a hard fail, on two independent grounds:**

1. **It is frequently FALSE.** This repo auto-inserts `rel="sponsored"` affiliate links via the `ENTITY_LINKS` registry in `src/utils/sectionContent.tsx`. Any entity there with `sponsored: true` (Cursor, ElevenLabs, Murf, Apollo.io, Instantly.ai, Dext, Nutshell, Pinecone, Netlify, RunPod, Carepatron, Prezi, ZoomInfo — re-read the registry, it grows) earns us a referral fee **on that very page**. A page that autolinks Cursor and also says "we take no referral fee from Cursor" is publishing a false statement about a material financial relationship. On 2026-08-21 two such sentences shipped and had to be removed.
2. **It does not work even when true.** Objectivity is demonstrated by the analysis: naming who should NOT pick our preferred option, stating what would change the verdict, and citing what each vendor actually publishes. Asserting neutrality adds nothing a skeptical reader will credit, and reads as protesting too much.

**Auditor procedure — run this on every page in the phase:**
```bash
grep -inE "does not resell|do not resell|resells? none|takes? no (referral|commission|kickback)|no commission on|does not (refer|partner)|vendor.neutral|this (ranking|comparison|page) is independent|note on objectivity|we are not (paid|sponsored)|no financial (interest|stake)" <the new/edited entries>
```
Any hit → **FAIL the page** and require removal. Delete the claim outright; do not soften it. Where the sentence also carried real methodology ("we weighed what each vendor publishes about X"), keep only the methodology half and drop the financial/neutrality assertion.

**What to do instead:** nothing. Say what the page found and why. If a genuine affiliate relationship exists, that is handled by the site's affiliate-disclosure mechanism, **not** by prose in the body — and never by a sentence claiming the relationship does not exist.

**Scope note:** this gate covers the pages THIS pass creates or edits. If the auditor notices the pattern on pre-existing pages, record it as an advisory finding for the human, do not mass-edit other pages inside this run.

---

## ‼️ DEPTH GATE — deterministic, blocks the phase (MANDATORY — added 2026-08-11, ported from `/new-site`)

**This is not a reviewer judgment call and no subagent opinion overrides it.** Run it as the FIRST action of this phase and again as the last. It applies to `article` format rows only — spec-only (non-article) rows are exempt, since their deliverable is a spec, not prose.

**Measurement — use the first rung that applies:**
1. **If Phase 0 found a `check-depth` script in this repo** (`npm run check-depth`, installed by `/new-site`): run it. A non-zero exit **blocks this phase**. This is authoritative — it measures the built output, so it catches thinness the source view can miss.
2. **Otherwise, measure from source.** For each new page record, concatenate every reader-facing prose field (intro + section bodies + FAQ answers + verdict) — excluding title, meta description, schema, `inlineCta`, CTA boilerplate, and code blocks — and word-count it. Do this with an actual command (e.g. pipe the extracted text through `wc -w`), never by eyeballing length.

**Verdict:** compare each page against the floors table in `phase-3-new-content.md` (comparison/review 1,500 · persona 1,400 · hub/worth-it/explainer 1,200 · cost 1,000 · editorial 600; **explainer 1,200 is the default** for anything that doesn't clearly match another type). Any page under its floor is a **HARD FAIL** — hand it back to Phase 3 for expansion with real substance, and re-measure. It is not fixable by padding: a page that clears the floor but trips BAR 1 (AI filler) fails anyway, so expansion must add actual information.

**Report the distribution, not per-page verdicts.** Print `passing / failing / median` across all article pages this run. Page-by-page review is structurally blind to run-wide thinness — a 300-word page reads as concise and on-intent in isolation, and only the distribution shows that every page is one. On runs of 3+ article pages, a median sitting within 10% of the floor is itself a finding: record it as `depth: median {N} barely clears floor {F}` in the summary even when every page individually passes.

---

**Remediation — load `.claude/commands/_remediation-ladder.md` and apply it IN FULL.** It is the single source of truth for what happens AFTER a gate fails: Rung 0 mechanical lint (never a rework attempt), Rung 1 FIX-IN-PLACE with the reviewer supplying the exact replacement text, Rung 2 REWORK by the writer for that page only — max 2 attempts **per page**, then drop that page and continue the run. It also defines per-page pass state: a page that passed is never re-audited because a sibling was fixed. It changes only the COST of fixing a finding, never the bar for passing one — every gate above applies exactly as written. If the file is missing, FAIL the run and report it; never improvise a remediation policy.
<!-- CRON_PROMPT_END -->

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/mindmap-pass` run has EXACTLY ONE human stop (the Phase 0 manifest approval), and this phase is NOT it:
- Stop 1: the Phase 0 manifest approval (before any edits).
- (Phase 8 is an informational summary that auto-continues to the Phase 9 push — NOT a stop.)

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going through Phase 8 and the Phase 9 push without stopping.


## Updated-page date-bump rule (MANDATORY — workflow-wide, added 2026-07-12)

**Editors (any step that changes what an EXISTING page renders — metadata/title, body or enrich sections, FAQs, internal links, embedded tools, thin-content rework, link fixes):** every existing page you update MUST have its "last updated" date bumped to the run date **in the SAME change** — the content edit and the date bump ship together, never separately. Discover how THIS project surfaces the date (record it as a Phase 0 project fact) and bump the field the template ACTUALLY renders:
- **DB-backed pages** (e.g. ban_the_bots: `landing_pages.last_generated_at` renders both the visible "Last updated" byline and JSON-LD `dateModified`; `blog_posts.updated_at` for posts): any script/SQL that edits content columns MUST also set the date column to now (e.g. `page.last_generated_at = datetime.utcnow()`). Never ship an enrichment/edit script that touches content but not the date column.
- **File-backed pages**: bump the frontmatter/date field the template renders (`last_updated`, `updated`, `dateModified`, …) and re-render if the project pre-renders static HTML.

Also refresh every surface derived from that date: JSON-LD `dateModified`, and the sitemap `<lastmod>` when the generator does not derive it from the same field. **New pages created this run are exempt** (their date fields already default to now). **Purely non-rendering technical fixes are exempt** (robots.txt, redirects, canonical tags, sitemap-only hygiene) — do NOT bump dates for those.

**Auditors / reviewer gates (adversarial review):** for EVERY existing page this run edited, verify the rendered "Last updated" date (and JSON-LD `dateModified`) now equals the run date. A stale date on an updated page is a **HARD FAIL** — the page does not pass until the date is bumped. The fix is a one-field update; never rewrite the page. Conversely, a bumped date on a page whose rendered content did NOT change is also a fail (date churn fakes freshness) — revert it.

## Content standard — audit gates

**Load `.claude/commands/_content-standard.md` and apply its `## AUDITOR` section in full.** It is the single source of truth for the content gates: register and voice, tee-up, experience truth, required page elements, byline-in-body, the proprietary anchor, neutrality, disclaimer placement, depth floors, first-mention links, and the row records.

**Also load `.claude/commands/_experience.md`** — every first-person experience claim on a page must be traceable to it; anything it does not license is an invented claim and fails.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **AUDITOR** section in full, including the meaning bar. It outranks the content standard on any conflict.

If any of those files is missing, FAIL the run and report it — never substitute your own gates.
