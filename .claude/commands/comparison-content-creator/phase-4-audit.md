# Phase 4 — Confirm new + enriched content (dedicated adversarial review)

<!-- intent-takeaway-v1 -->
**Intent-based takeaway audit:** Read `_decision-evidence.md` in the active project's `.claude/commands/`, including its takeaway requirements and section 4. Verify the conclusion answers the approved question, matches actual evidence and retains important conditions; compare the opening answer, tables, calculator and FAQs. An existing sufficient verdict or a supported inconclusive answer can pass. Never require a canned heading or unsupported testing language. For global commands, resolve/install the sibling shared contract in the active project while preserving local rules.
<!-- /intent-takeaway-v1 -->

<!-- decision-evidence-v1 -->
## Decision-evidence gate

Read `.claude/commands/_decision-evidence.md`, section 4, and independently audit its evidence packet against the exact rendered contribution. This includes new substantive content/tools embedded in an existing page. Verify visible attribution states what we did, what we found and how readers can check it; naming published inputs alone is insufficient. Match explicit “internal testing,” “internal modeling” or “internal analysis” wording to the saved evidence, without requiring an exact phrase: calculations, hypothetical models, actual tests and documented client observations must remain distinct. Require reproducible findings, important conditions and a counterexample; reject fabricated testing and unsupported benefit assumptions. Audit an optional calculator as a planning aid when that is all it establishes. Verify the growth record exists, but never treat its hypothesis as proven uplift. After two failed rework attempts, stop this workflow and escalate; do not continue to commit, push or publish.
<!-- /decision-evidence-v1 -->

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

This phase IS the gate for Phase 3 **and** Phase 3b. It checks the net-new comparison pages created in Phase 3 **and the in-place enrichment edits made in Phase 3b**. Run as an **Agent tool, `subagent_type: Explore`, read-only** reviewer that did NOT write or edit those pages.

---

## Audit prompt — REUSED VERBATIM from `.claude/commands/seo-gsc-pass/phase-4-audit.md`

> **‼️ HARD RULE — PASS THIS INSTRUCTION VERBATIM.** Give the Explore reviewer the exact sentence below, character-for-character. Do not soften or rewrite it. The comparison-specific checks are *added after* it, not a replacement for it.

Make sure all new content meets metadata length requirements (title/description), follows FAQ JSON, schema.org, and has good internal linking.

**FAIL — byline/date in body prose.** Reviewer byline + review date belong in the header/byline area + JSON-LD schema, never in body content. If any prose field (intro, sections, verdict, callouts, FAQ answers) contains a reviewer/author attribution or review-date sentence — e.g. "Reviewed by …", "Last updated …", "on [date]", "We research using …", "[Name], Founder of …" — set fail with note "byline-in-body: [field/heading]". Fix: delete it from prose and rely on the record's date fields + the template/schema byline.

---

## Comparison-specific checks (add to the verbatim audit above)
Also confirm, for each new page:
- **Both entities named in the metaTitle**, and the metaTitle is 50–60 chars. On a TESTED page (a `/roundup/` entry) the rule applies to the title Google shows: `metaTitle` (the entry's `title`) has no year and is 36–46 chars, because the template appends ` (Tested 2026)`.
- **Comparison table has ≥5 rows**, each a real buyer dimension with a value for both sides (no empty/placeholder cells).
- **Every section uses the project's real content-array key** (e.g. `content:`), NOT an invented one like `body:` — a wrong key renders the section empty and `tsc` will not catch it in a loosely-typed store.
- **A verdict/recommendation** block is present and concrete.
- **≥4 FAQs**, each answering a real query variant.
- **≥3 internal related links**, every `href` resolving to a real existing route (no dead links). **Verify each href against EVERY content source file before declaring it broken** — e.g. a guide may live in `guides.ts` OR `guides-new.ts`; check both. (Adversarial reviewers frequently false-flag a link by checking only the primary file. Confirm the slug truly exists in none of them before failing it.)
- **No fabricated facts** — pricing, certifications, feature claims, and stats are accurate or hedged, never invented. (Flag any unverifiable comparative claim.)
- **Net-new only** — confirm the page did not overwrite or regenerate an existing route.

## Enrichment-specific checks (for each Phase 3b PARTIAL edit)
Enriched pages are existing routes that got spot-edits, NOT new pages — judge them on edit discipline, not net-new structure:
- **Spot-edit only.** The diff touches ONLY the new head-to-head sub-section (and, if present, an appended FAQ entry / extended schema). Everything else on the page is byte-for-byte unchanged. Flag any sign the page was regenerated or rewritten wholesale.
- **The pair is now genuinely covered** — a real comparison table (≥3 rows, a value per side) plus a concrete verdict, not just another passing mention.
- **Correct content-array key** — the inserted section uses the project's real field key (e.g. `content:`), so it actually renders.
- **Schema consistency** — if the page schematizes its tables/FAQs, the new block is reflected; no orphaned content.
- **No fabricated facts**, and any internal links added resolve to real routes (verify against every content source file before failing).
- **No new route, no sitemap addition** for an enriched page (Phase 5 only bumps its `lastmod`).

> **On reviewer false-positives:** before reworking a page on a reviewer's say-so, spot-check the specific claim (re-grep the flagged link across all content files; re-confirm a "cannibalization" pair really shares the *same* primary keyword, not just a naming pattern). Fix only genuine defects; record dismissed false-flags in the Phase 6 summary so the decision is auditable.

## TESTED format — draft review, then registered output

The reviewer first checks local eligibility and the draft's raw executed runs, independently of the final template flag. A first-time or changed draft has no current approval yet, so `tested: false` from the render checker alone MUST NOT force a legitimate tested draft into the ordinary branch.

- **Eligible draft with complete relevant executed tests:** audit its existing tested format, item count, three methods, all pick fields and every first-person claim against the actual runs. Category wording is acceptable only when true for every item. Reject invented specifics, unsupported features and partial coverage. No content or record is approved just because the writer passed `--tested yes`.
- **Excluded or unsubstantiated draft:** use ordinary presentation; reject a tested title, testing byline/schema, `howWeTested`, testing pick fields or unsupported testing claims. Permit accurate calculated/modeled/reported attribution where useful and locally allowed.
- **After the exact draft passes all gates:** write the independent approval and register the exact normalized page and artifacts under `_testing-labels.md`. Re-run the live adapter/checker, build, and check rendered consistency. Only now must `tested` match the approved format. If registration or rendering fails, fix and revalidate; any prose change requires another independent content audit. A record never overrides local exclusions.

**Existing local exclusion checks (preserved):**
- Also FAIL if a roundup ranks accounts/cards/loans/services/concepts, the switch still says `tested: true`, and its slug is not in `EXCLUDED_SLUGS` (`src/lib/testedPage.ts`), note `tested-switch-missing` (the template would show a tested byline).


## Fix-step hand-off (added 2026-10-22, ported from layer3)
- `content_gen.py fix` applies the auditor's findings and never re-edits on its own. Its meta lists `claim_check.remaining` = sentences it doubts in the units it just changed. Hand that list to the next audit round as extra findings to check; it is not a verdict.
- Findings the fixer returns as not fixable in place with id `NEW` ask for something that does not exist yet (a missing FAQ entry, a section, a table row). Generate each with `content_gen.py section` (enrichment, same fact list), splice it in, and re-audit. Never drop one silently, and never hand-write it.

## Advisory notes (record, do NOT block publication)

These are NON-BLOCKING observations the reviewer records for the run summary. Do NOT set fail for any of them. The reviewer continues to auto-continue exactly as today.

- **Low Information Gain** — if a section reads like conventional wisdom with no original example, case-specific insight, or non-obvious implication, note: "low information gain: [section heading]".
- **AEO gap** — if a major section's opening sentence is a rhetorical question or transition phrase ("In this section…") rather than a self-contained declarative claim, note: "AEO: [section heading] does not open with a direct claim".
- **Missed long-tail opportunity** (NOT a quota) — only if the page targeted broad head terms while ignoring a clearly relevant question-format query that had no stronger alternative and would have fit naturally, note: "missed long-tail: [topic]".
- **Authorship missing** — if a YMYL comparison (compliance, finance, medical, legal) has Organization-only author, no Person JSON-LD, or no `reviewer`/`lastReviewed` in schema, note: "authorship: [missing element]". (The visible byline belongs in the header + schema — do NOT expect or reward a "reviewed by" line in body prose; that is a FAIL, see above.)
- **Missing external link** — if the page names a clickable external entity that this project does NOT auto-link (a niche/newer tool, a specific company, a named law/standard, a cited study/dataset, or the source behind a statistic) without a link to its official primary source on first mention, note: "external link: [entity/source]". Do NOT flag entities the project auto-links at render time (common models/IDEs/AI-labs/benchmarks) — those stay plain text in the source.
- **Not task-complete** — if the page redirects out (or thin-wraps an external link) without first answering the comparison on-page, or cites an aggregator instead of first-party sources for either side, note: "task-complete: [issue]".

A page with any/all of these notes and no hard-fail issues still passes audit.

---

## ‼️ DEPTH GATE — deterministic, blocks the phase (MANDATORY — added 2026-08-17, ported from `/new-site` via seo-gsc-pass)

**Not a reviewer judgment call — no subagent opinion overrides it.** Applies to **net-new `article`-format pages** created in Phase 3 only; in-place **Phase 3b enrichment edits are additive by rule and judged on edit discipline, never against a whole-page floor.**

**Measure from source** (or run `npm run check-depth` if Phase 0 found it — a non-zero exit blocks this phase): for each net-new page, concatenate the reader-facing prose (intro + section bodies + FAQ answers + verdict), excluding title, meta description, schema, `inlineCta`/CTA boilerplate, and code blocks, and word-count it with an actual command (`wc -w`), never by eye.

**Floors** (from `.claude/commands/seo-gsc-pass/phase-3-new-content.md`): comparison/review 1,500 · persona 1,400 · hub/worth-it/explainer 1,200 · cost 1,000 · editorial 600; **explainer 1,200 is the default**. A comparison / alternatives / roundup page is a **comparison-type page → 1,500 floor.** Any net-new page under its floor is a **HARD FAIL** — hand back to Phase 3 for expansion with real substance and re-measure. Not fixable by padding: the anti-AI-filler and proprietary-anchor bars still apply on the same pass, so expansion must add real information. On runs of 3+ net-new article pages, also print `passing / failing / median`.

---

On any failure, apply specific notes through Phase 3 (new page) or Phase 3b (enrichment) and re-audit. After the second failed rework, STOP this workflow and escalate with unresolved findings; do not continue to commit, push or publish. Higher-priority user/project gate rules override older drop-and-continue instructions. Preserve unrelated changes; never use a whole-file checkout to revert one page in a shared data file.


## Successor vs predecessor coverage + accuracy (MANDATORY, added 2026-07-28)

**Coverage check — run once per run, against the whole candidate/page set.** If this run published or enriched pages for a subject that is a NEW VERSION of an existing, already-covered product line (a new AI model generation, model-year, or major version), verify the set contains the same-line **`{new} vs {prior version}`** comparison. Its absence is a **FAIL** for the run, not a per-page nit — this is the exact gap that let Claude Opus 5 ship a full page set with no `Opus 5 vs Opus 4.8` page (2026-07-28). Fix additively: add the missing comparison; never rewrite or drop the pages that did ship. Only waive it when the predecessor genuinely has no page on the site, or no predecessor exists (a first-generation product) — record which waiver applied.

**Per-page checks for any same-line successor page:**
- **Honest delta:** if the successor is worse on any buyer-relevant axis (higher price, smaller context, narrower availability), that trade-off appears in BOTH the comparison table and the verdict. A page that presents a mixed or negative upgrade as a straight win is a FAIL.
- **Price relationship stated:** both versions' prices appear side by side and the relationship is named in words (unchanged / higher / lower / intro window + end date). A same-price successor that does not say the price is unchanged is a FAIL.
- **Verdict shape:** the verdict tells the reader when to upgrade, when to stay on the prior version, and how to run both during migration — not a one-sided "upgrade now".
- **Grounded lineage:** the page never claims a version, release order, or predecessor relationship that cannot be traced to a real source. An invented lineage or version number is a **HARD FAIL**.
- **Reversed-order FAQ** (`{prior} vs {new}`) present; no thin alias-duplicate page for the same matchup.

## Content standard — audit gates

**Load `.claude/commands/_content-standard.md` and apply its `## AUDITOR` section in full.** It is the single source of truth for the content gates: register and voice, tee-up, experience truth, required page elements, byline-in-body, the proprietary anchor, neutrality, disclaimer placement, depth floors, first-mention links, and the row records.

**Also load `.claude/commands/_experience.md`** — every first-person experience claim on a page must be traceable to it; anything it does not license is an invented claim and fails.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **AUDITOR** section in full, including the meaning bar. It outranks the content standard on any conflict.

If any of those files is missing, FAIL the run and report it — never substitute your own gates.

---

## Remediation — how a finding gets fixed (MANDATORY)

**Load `.claude/commands/_remediation-ladder.md` and apply it IN FULL.** It is the single source of truth for what happens AFTER a gate fails: Rung 0 mechanical lint (never a rework attempt), Rung 1 FIX-IN-PLACE with the reviewer supplying the exact replacement text, Rung 2 REWORK by the writer for that page only — max 2 attempts **per page**, then drop that page and continue the run. It also defines per-page pass state: a page that passed is never re-audited because a sibling was fixed. It changes only the COST of fixing a finding, never the bar for passing one — every gate above applies exactly as written. If the file is missing, FAIL the run and report it; never improvise a remediation policy.

**This section supersedes any other retry, rework, or escalation wording in this file.** Higher-priority user/project rules require stopping and escalating after two failed rework attempts. The ladder supplies cheaper repair methods; it cannot override that stop condition.
