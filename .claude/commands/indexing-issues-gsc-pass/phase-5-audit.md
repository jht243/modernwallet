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
- A real **client observation** from the roster (see the writer standard / `seo-content-guidelines` roster), phrased with explicit grounded attribution (e.g. "In our engagement with [Client], we observed…", "From the [Client] rollout, the failure mode was…").
- A real **routine-work observation** from our own automation portfolio (e.g. "When we run our GA4 top-pages routine across dozens of sites in our portfolio, the pattern is…").
- Another genuine first-hand element: an original number/benchmark we actually produced, an original artifact/screenshot, a non-obvious operational tradeoff we've hit, or a defensible contrarian POV with reasoning.

Procedure:
1. Read the page topic. Ask: does any client on the roster, or any routine in our portfolio, have **honest topical overlap** with this page?
2. If yes and the page carries no such anchor → **HARD FAIL**, note `no-proprietary-anchor: [which client/routine fit was available and skipped]`. Hand back to the writer to weave one in (using the grounded attribution templates, max 2 client references, never invented).
3. If a client/routine anchor genuinely does not fit, check for any other first-hand anchor (own number, artifact, tradeoff, defensible POV). If one is present → PASS.
4. Only if **none** of the above honestly applies may the page ship without an anchor — and the reviewer MUST record a one-sentence justification: `anchor-exempt: [why no client, no routine, and no first-hand angle honestly fit this topic]`. A boilerplate or generic exemption sentence is itself a fail — the exemption must be specific to this page's topic. Silent absence of an anchor (no anchor and no exemption sentence) is always a fail.

**Never fabricate to satisfy Gate 2.** A forced, off-topic client mention (e.g. an HOA reference shoehorned into an AI-model launch page) is an EQUAL defect to having no anchor — fail it as `forced-anchor: [detail]`. The bar is "honest topical fit," not "mention a client somewhere."

**This UPGRADES the "Low Information Gain" advisory note elsewhere in this file from advisory to HARD FAIL** for article/prose rows: a section that reads like conventional wisdom with no original example, case-specific insight, or non-obvious implication now blocks publication rather than merely being recorded.
