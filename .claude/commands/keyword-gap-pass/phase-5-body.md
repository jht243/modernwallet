# Phase 5 — Body text updates

Act on every **body** row in the chart. Do NOT touch titles, meta descriptions, or H1s (that was Phase 2). Internal linking is handled separately in Phase 6 — do not add links here beyond what a body section naturally contains. `git add` your work but do NOT commit.

---

Update the body text now, but I don't want you to totally recreate the page using scripts. I'd like you to keep the same page, but update it with your suggestions you identified prior. DO NOT recreate the page via script, only make updates where needed.

---

Make the edits in place (targeted Edit operations on the existing file), preserving everything not called out by the chart. Then `git add`, and do not commit.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/keyword-gap-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).


## Anti-AI language — applies to every sentence you ADD here (MANDATORY — added 2026-08-17)

Body-text updates are additive prose, held to the **same** anti-AI-language bar as net-new pages. The Phase 4 audit only re-reviews net-new pages — it does **not** re-scan body edits — so a tell you introduce here ships unaudited. Before finalizing any added section/sentence, strip these:
- Throat-clearing openers ("When it comes to…", "In today's fast-paced world…", "In the ever-evolving landscape of…").
- The "it's not just X, it's Y" cadence; empty tricolons ("efficient, effective, and scalable"); hedged non-conclusions ("ultimately, the right choice depends on your needs").
- Filler verbs/phrases: "delve into", "leverage" (verb), "navigate the complexities of", "unlock the power of", "it's worth noting that", "a testament to".
- Never call software, a model, a tool, pricing, or a verdict "honest"/"honestly" — software has no honesty. Say the point directly ("the caveat is…", "the short answer is…"). `grep -inE "\bhonest"` your added text and cut every tech-context hit.
- Em-dash cap: at most **2 em-dashes per page, never two in the same section**. COUNT them in your added prose (`grep -o "—" | wc -l`); recast with commas, colons, periods, or parentheses and vary sentence shape.
- Anthropomorphic "death" language for software/tech — never write that a demo, feature, product, tool, model, or technology "died", "is dead", was "killed", is "on life support", or "flatlined". Say what literally happened — it never shipped, was abandoned, stopped being used, or lost support.
- Search-intent / answer-scaffold narration — never write about the reader's own search or about the page itself: "which is the reason this search exists", "that's why you're here", "if you're (still) reading this", "the short answer (is)", "here's the thing/catch/reality", "you might be wondering". State the fact directly instead (e.g. "Figure 03 isn't sold to the public; it ships to enterprise partners under private agreements."). A single instance is enough to strike.
- Vague abstractions — if a phrase cannot survive a "what does this literally mean?" test, replace it with the specific noun, number, or example.
Write with concrete specifics and vary sentence shape.

## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.
