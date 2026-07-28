# Phase 4 — Confirm new + enriched content (dedicated adversarial review)

This phase IS the gate for Phase 3 **and** Phase 3b. It checks the net-new comparison pages created in Phase 3 **and the in-place enrichment edits made in Phase 3b**. Run as an **Agent tool, `subagent_type: Explore`, read-only** reviewer that did NOT write or edit those pages.

---

## Audit prompt — REUSED VERBATIM from `.claude/commands/seo-gsc-pass/phase-4-audit.md`

> **‼️ HARD RULE — PASS THIS INSTRUCTION VERBATIM.** Give the Explore reviewer the exact sentence below, character-for-character. Do not soften or rewrite it. The comparison-specific checks are *added after* it, not a replacement for it.

Make sure all new content meets metadata length requirements (title/description), follows FAQ JSON, schema.org, and has good internal linking.

**FAIL — byline/date in body prose.** Reviewer byline + review date belong in the header/byline area + JSON-LD schema, never in body content. If any prose field (intro, sections, verdict, callouts, FAQ answers) contains a reviewer/author attribution or review-date sentence — e.g. "Reviewed by …", "Last updated …", "on [date]", "We research using …", "[Name], Founder of …" — set fail with note "byline-in-body: [field/heading]". Fix: delete it from prose and rely on the record's date fields + the template/schema byline.

---

## Comparison-specific checks (add to the verbatim audit above)
Also confirm, for each new page:
- **Both entities named in the metaTitle**, and the metaTitle is 50–60 chars.
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

On any failure, hand specific notes back to the writer logic and re-run — **Phase-3 logic for a net-new page, Phase-3b logic for an enrichment edit.** **Max 2 rework attempts**, then STOP and escalate. In this autonomous workflow, "escalate" means: for a **net-new page**, mark it `draft: true` (noindex, excluded from sitemap + IndexNow), record the reason, and continue; for an **enrichment edit** that can't pass, **revert that page's edit** (`git checkout -- <file>` so the original stays intact), record the reason, and continue. One failing item never blocks the others. Auto-continue to Phase 5.


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.

## Successor vs predecessor coverage + accuracy (MANDATORY, added 2026-07-28)

**Coverage check — run once per run, against the whole candidate/page set.** If this run published or enriched pages for a subject that is a NEW VERSION of an existing, already-covered product line (a new AI model generation, model-year, or major version), verify the set contains the same-line **`{new} vs {prior version}`** comparison. Its absence is a **FAIL** for the run, not a per-page nit — this is the exact gap that let Claude Opus 5 ship a full page set with no `Opus 5 vs Opus 4.8` page (2026-07-28). Fix additively: add the missing comparison; never rewrite or drop the pages that did ship. Only waive it when the predecessor genuinely has no page on the site, or no predecessor exists (a first-generation product) — record which waiver applied.

**Per-page checks for any same-line successor page:**
- **Honest delta:** if the successor is worse on any buyer-relevant axis (higher price, smaller context, narrower availability), that trade-off appears in BOTH the comparison table and the verdict. A page that presents a mixed or negative upgrade as a straight win is a FAIL.
- **Price relationship stated:** both versions' prices appear side by side and the relationship is named in words (unchanged / higher / lower / intro window + end date). A same-price successor that does not say the price is unchanged is a FAIL.
- **Verdict shape:** the verdict tells the reader when to upgrade, when to stay on the prior version, and how to run both during migration — not a one-sided "upgrade now".
- **Grounded lineage:** the page never claims a version, release order, or predecessor relationship that cannot be traced to a real source. An invented lineage or version number is a **HARD FAIL**.
- **Reversed-order FAQ** (`{prior} vs {new}`) present; no thin alias-duplicate page for the same matchup.
