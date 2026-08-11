# Phase 5 — Adversarial audit of the enriched pages

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


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** entities the project auto-links must stay PLAIN TEXT to avoid double-linking. In layer3 that is the `ENTITY_LINKS` registry in `src/utils/sectionContent.tsx` (AI models/IDEs/labs/benchmarks + registered vendors incl. legal-AI tools). **CHECK the registry before writing — never assume a vendor is in it.** If the entity is NOT in the registry, hand-link it inline; if it will recur across many pages, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by the project's auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.


## Feb 2026 Core Update — originality + anti-AI-filler gate (MANDATORY — workflow-wide, added 2026-07-31)

Google's February 2026 core update (Discover-focused) demoted sites mass-producing unedited ChatGPT content and rewarded pages carrying **proprietary data** — first-hand numbers, real client cases, and a defensible point of view. This gate enforces that on every net-new or materially-rewritten **article/prose** page. (Spec-only rows, pure technical/indexability fixes, and non-prose asset specs are exempt — this applies to reader-facing prose.)

**GATE 1 — Reads like unedited ChatGPT → HARD FAIL (objective, no exemption).**
Scan the prose. If **two or more** of these tells appear, set fail with note `chatgpt-tells: [list which]`. The fix is a targeted rewrite of the offending sentences — never a full-page rewrite.
- Throat-clearing section openers: "When it comes to…", "In today's fast-paced world…", "In the ever-evolving landscape of…", "In an age where…".
- The "it's not just X, it's Y" / "isn't just about X — it's about Y" cadence.
- Empty tricolons that add no information ("efficient, effective, and scalable", "powerful, flexible, and easy to use").
- Hedged non-conclusions that refuse to commit ("ultimately, the right choice depends on your specific needs and goals", "there's no one-size-fits-all answer").
- LLM-signature verbs/phrases used as filler: "delve into", "leverage" (as a verb), "navigate the complexities of", "unlock the power of", "in the realm of", "a testament to", "it's worth noting that", "that being said".
- "honest"/"honestly" applied to anything non-human — software, a model, tool, pricing, an assessment, or a verdict ("honest read/answer/caveat/verdict", "to be honest", "honestly" as filler). `grep -inE "\bhonest"` the changed content and cut every tech-context hit ("the honest caveat is" → "the caveat is"). Counts on its own — one tech-context "honest" is enough to flag.
- Em-dash overuse — **more than 2 em-dashes on the page, or two in the same section**, is a fail on its own. COUNT them (`grep -o "—" <file> | wc -l`) rather than eyeballing; the em-dash-interrupted sentence shape repeating paragraph after paragraph is one of the loudest AI tells. The fix is to recast those sentences with commas, colons, periods, or parentheses — never to delete the content. Same-shape listicle padding is a separate tell (below).
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
