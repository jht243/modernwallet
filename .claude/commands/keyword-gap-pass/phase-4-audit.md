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

On any failure, hand specific notes back to Phase-3 logic and re-run. Max 2 rework attempts, then STOP and escalate.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/keyword-gap-pass` (and `/autocomplete-pass`, which shares this phase file) run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.


## Feb 2026 Core Update — originality + anti-AI-filler gate (MANDATORY — workflow-wide, added 2026-07-31)

Google's February 2026 core update (Discover-focused) demoted sites mass-producing unedited ChatGPT content and rewarded pages carrying **proprietary data** — first-hand numbers, real client cases, and a defensible point of view. This gate enforces that on every net-new or materially-rewritten **article/prose** page. (Spec-only rows, pure technical/indexability fixes, and non-prose asset specs are exempt — this applies to reader-facing prose.)

**GATE 1 — Reads like unedited ChatGPT → HARD FAIL (objective, no exemption).**
Scan the prose. If **two or more** of these tells appear, set fail with note `chatgpt-tells: [list which]`. The fix is a targeted rewrite of the offending sentences — never a full-page rewrite.
- Throat-clearing section openers: "When it comes to…", "In today's fast-paced world…", "In the ever-evolving landscape of…", "In an age where…".
- The "it's not just X, it's Y" / "isn't just about X — it's about Y" cadence.
- Empty tricolons that add no information ("efficient, effective, and scalable", "powerful, flexible, and easy to use").
- Hedged non-conclusions that refuse to commit ("ultimately, the right choice depends on your specific needs and goals", "there's no one-size-fits-all answer").
- LLM-signature verbs/phrases used as filler: "delve into", "leverage" (as a verb), "navigate the complexities of", "unlock the power of", "in the realm of", "a testament to", "it's worth noting that", "that being said".
- Uniform em-dash rhythm — the same em-dash-interrupted sentence shape repeating paragraph after paragraph.
- Symmetrical listicle padding where every bullet is the same length and shape with no concrete specifics.
- Anthropomorphic "death" language for software/tech — "died", "is dead", "killed", "kill it", "death of [X]", "on life support", "flatlined", "RIP [product]" applied to a demo, feature, product, tool, model, or technology. A classic AI tell — software does not die. Flag it; the fix is literal ("never shipped", "was abandoned", "stopped being used", "lost support"). This one counts on its own — a single unmistakable death-metaphor for tech is enough to flag.
- Vague abstractions that sound insightful but name nothing concrete — impressive adjective-noun combos with no real referent ("clever one-off demos", "seamless synergy", "strategic inflection point", "holistic approach", "next-level solution", "digital transformation journey"). Flag any phrase that fails a "what does this literally mean?" test; the fix is to name the actual thing (who, what, what happened, or a number).
A page can carry one isolated tell and still pass; two or more is the fail line.

**GATE 2 — No proprietary anchor → FAIL unless the reviewer earns an exemption (high bar).**
Default assumption: **this page needs at least one proprietary anchor.** An anchor is something a generic LLM could not have produced:
- A real **client observation** from the roster, phrased with explicit grounded attribution.
- A real **routine-work observation** from our own automation portfolio.
- Another genuine first-hand element: an original number/benchmark we actually produced, an original artifact/screenshot, a non-obvious operational tradeoff we've hit, or a defensible contrarian POV with reasoning. **For ModernWallet calculator-explainer content, a hand-verified worked numeric example computed with the page's own formulas counts as this anchor** — check the arithmetic is actually correct, not just plausible-looking.

Procedure:
1. Read the page topic. Ask: does any client on the roster, or any routine in our portfolio, have **honest topical overlap** with this page?
2. If yes and the page carries no such anchor → **HARD FAIL**, note `no-proprietary-anchor: [which client/routine fit was available and skipped]`. Hand back to the writer to weave one in (using the grounded attribution templates, max 2 client references, never invented).
3. If a client/routine anchor genuinely does not fit (the normal case for ModernWallet's personal-finance content), check for any other first-hand anchor (own number, artifact, tradeoff, defensible POV — including a verified worked example). If one is present → PASS.
4. Only if **none** of the above honestly applies may the page ship without an anchor — and the reviewer MUST record a one-sentence justification: `anchor-exempt: [why no client, no routine, and no first-hand angle honestly fit this topic]`. A boilerplate or generic exemption sentence is itself a fail — the exemption must be specific to this page's topic. Silent absence of an anchor (no anchor and no exemption sentence) is always a fail.

**Never fabricate to satisfy Gate 2.** A forced, off-topic client mention (e.g. an HOA reference shoehorned into a mortgage-calculator page) is an EQUAL defect to having no anchor — fail it as `forced-anchor: [detail]`. The bar is "honest topical fit," not "mention a client somewhere." Also verify any worked-example arithmetic by recomputing it — a wrong number is worse than no anchor.

**This UPGRADES the "Low Information Gain" advisory note elsewhere in this file from advisory to HARD FAIL** for article/prose rows: a section that reads like conventional wisdom with no original example, case-specific insight, or non-obvious implication now blocks publication rather than merely being recorded.
