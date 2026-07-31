# Phase 3b — Enrich existing pages (PARTIAL candidates)

This phase **executes** every `PARTIAL` from Phase 1b instead of leaving it as a recommendation. A PARTIAL is a pair the site already covers *in passing* inside an existing page (a guide, vertical, or another comparison) but without a real head-to-head treatment. Phase 3 creates net-new pages; **this phase makes targeted spot-edits to the existing page** so the pair is covered properly. `git add` your work but do NOT commit — Phase 5 stages. Phase 4 is the gate for this phase too.

> **‼️ NOT NET-NEW, NOT A REGENERATION.** This phase never creates a route and never rebuilds a page. It edits an existing file in place, adding only the missing comparison coverage the Phase 1b work-item called out. Everything else on the page stays byte-for-byte unchanged.

## What you act on
The **enrichment work-list handed forward from Phase 1b** — one item per PARTIAL, each carrying: the exact existing page/route + file, the entity pair, and *what's missing* (e.g. "pair named in a sentence but no comparison table", "no verdict on which to pick", "covered for a different segment"). These are NOT scored in Phase 2 (the API-cost gate keeps paid scoring to NEW pairs), so you work from the gap description, not from fresh keyword data.

---

## Enrichment guideline — REUSED VERBATIM from `.claude/commands/keyword-gap-pass/phase-5-body.md`

> **‼️ HARD RULE — this is the operating discipline for the edit.** Follow it character-for-character; do not loosen it into "regenerate the section."

Update the body text now, but I don't want you to totally recreate the page using scripts. I'd like you to keep the same page, but update it with your suggestions you identified prior. DO NOT recreate the page via script, only make updates where needed.

Make the edits in place (targeted Edit operations on the existing file), preserving everything not called out by the work-item.

---

## Comparison-specific — what "enrich" means for a PARTIAL pair
For each work-item, add a **focused head-to-head treatment** of the pair to the existing page (not a whole new article):
- A short **comparison sub-section** introduced with an H2/H3 that names both entities ("X vs Y").
- A **comparison table of ≥3 rows** (price/setup/integrations/compliance/etc., a value for each side) — the snippet/answer-engine-extractable core.
- A **one- or two-line verdict** ("pick X when…, pick Y when…").
- Optionally **1–2 FAQ entries** if the page already has an FAQ block — append to it, don't restructure it.
- If the page is keyword-targeted, work the pair's `primaryKeyword` in naturally; no stuffing.

## Discipline / guardrails (check before handing to Phase 4)
- **Targeted `Edit` only.** Insert the new sub-section/table into the existing object/MDX in place. Never overwrite the file wholesale and never invoke a generator/script that rebuilds the page.
- **Re-check coverage LIVE first.** The page may have been improved since Phase 1b ran. Re-open the file; if it now already covers the pair adequately (real table + verdict), **skip** that work-item and record "already covered — skipped." Don't double-enrich a section a prior run already added.
- **Use the project's REAL content-array field keys** (e.g. `content:`, not an invented `body:`). A wrong key renders the section empty and `tsc` won't catch it in a loosely-typed store. Grep the surrounding objects for the actual keys and match them.
- **Match the page's existing structure + schema.** If the page emits FAQ/comparison JsonLd, extend it consistently; don't leave the new table out of the schema if the page schematizes its tables.
- **No fabricated facts** — pricing, certifications, feature claims, stats are accurate or hedged, never invented.
- **No new route, no sitemap add** — the page already exists. Phase 5 only bumps its `lastmod`.

`git add` your edits. Do not commit. Auto-continue to Phase 4 (the gate covers both new and enriched pages).

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment Phase 4's reviewer gate PASSES for the enriched pages, continue in the SAME turn. This workflow has EXACTLY ONE human stop — the Phase 6 summary gate. This phase is NOT it. Do not print "Want me to proceed?" or any question that waits for a human reply.


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.


## Feb 2026 Core Update — proprietary anchor + anti-AI-filler (MANDATORY — workflow-wide, added 2026-07-31)

Google's February 2026 core update (Discover-focused) demoted sites mass-producing unedited ChatGPT content and rewarded pages with **proprietary data** — first-hand numbers, real client cases, a defensible point of view. Every article/prose page you write here must clear two bars, and Phase 4 now enforces both.

**BAR 1 — Do not write like an unedited LLM.** Before you finalize, strip these tells (Phase 4 hard-fails a page carrying two or more):
- Throat-clearing openers ("When it comes to…", "In today's fast-paced world…", "In the ever-evolving landscape of…").
- The "it's not just X, it's Y" cadence; empty tricolons ("efficient, effective, and scalable"); hedged non-conclusions ("ultimately, the right choice depends on your needs").
- Filler verbs/phrases: "delve into", "leverage" (verb), "navigate the complexities of", "unlock the power of", "it's worth noting that", "a testament to".
- Monotonous em-dash rhythm and same-shape listicle padding.
Write with concrete specifics, commit to a conclusion, and vary sentence shape.

**BAR 2 — Give the page a proprietary anchor (do this FIRST, before drafting).** Walk two lists against your topic:
1. **The client roster** (see `seo-content-guidelines` memory / the roster the skill loads): the updated roster includes our newer engagements — Multiple HOA & condo boards across the USA, The HOA Guide (thehoaguide.com), TheBotScout (humanoid-robotics research), DroneAndDefense (defense/drones investment journal) — plus the existing roster and LinkedIn engagements (Dapper Labs, PBA, MetaKing Studios, HeroMaker Studios; verify before citing specifics).
2. **Our own routine-automation portfolio** — real systems we build and operate, and a legitimate first-hand source when the page touches SEO, growth, analytics, or content automation:
   - Technical SEO auditing & indexing at scale (ahrefs-site-audit, bing-webmaster, indexing-issues, download-promise-audit)
   - Keyword-driven content generation & gap-filling (keyword-gap, mindmap, autocomplete, seo-gsc, question-gap, search-gap)
   - Growth-page engine on live traffic (ga4-top-pages, page-quality, trend-pass)
   - Competitor & creator reverse-engineering (competitor-monitor, youtube-video, comparison, roundup)
   - AI-model & vertical launch families (new-ai-model-pass, new-site)
   - Monetization & distribution (monetization-pass, downloadable-asset, amazon-gear-radar, pdf-for-sale, podcast-pain, linkedin-gsc-post)

If **any** client or routine has honest topical overlap, weave ONE observation into the relevant section (never a standalone "Case study" sidebar). Use **grounded attribution** so an AI/Google extractor understands this is real first-hand data, not a hypothetical:
- "In our engagement with [Client], we observed [specific qualitative observation]…"
- "When we ran [routine] across [rough N] sites in our portfolio, the pattern was…"
- "From the [Client] rollout, the failure mode was [X] — we solved it by [Y]."
- "Our own [routine] flags [pattern] on roughly [rough proportion] of the pages we audit."

Voice rules (unchanged, non-negotiable): proof not promotion; **max 2 named-client references per page**; topic must genuinely overlap — **never force-fit** (a shoehorned client mention is a Phase-4 fail, same as having none); **never invent** specifics (numbers, percentages, durations, headcounts, dates, quotes) — reference only the real qualitative observation; no inline CTAs from a client sentence.

**If no client and no routine honestly fits**, anchor the page another way: an original number/benchmark you actually produced, an original artifact, a non-obvious tradeoff, or a defensible POV with reasoning. Only if none of that honestly applies may the page ship without an anchor — and you must leave a one-line note for the auditor: `anchor-exempt: [why no client, no routine, and no first-hand angle honestly fit this topic]`. The default is to include an anchor; the exemption bar is high.
