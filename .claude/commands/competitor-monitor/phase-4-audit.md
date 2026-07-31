# Phase 4 — Adversarial audit (+ no-plagiarism + tool-logic)

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
