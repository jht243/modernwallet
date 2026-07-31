# Phase 3 — Generate improved original content (+ enrich PARTIALs)

For every surviving candidate from Phase 2, produce an **original, improved** page for this project. The competitor's `outline` (and `tool_io` for tools, handled in Phase 3c) is the **minimum coverage/structure floor** — our page must cover everything they cover and beat it. `git add` your work but do NOT commit (Phase 5 stages). Phase 4 is the gate.

> **`tool` candidates are NOT handled here** — they go to Phase 3c. This phase handles `page` (→ guide) and `comparison` (→ comparison page) candidates only.

## Route each candidate to the reused generator

- **`page` (NEW)** → write a new **guide** using the VERBATIM content-generation prompt in `.claude/commands/keyword-gap-pass/phase-3-new-content.md` (the `<!-- CRON_PROMPT_START -->…<!-- CRON_PROMPT_END -->` block). Substitute `{BUSINESS_NAME}` with the business name discovered in Phase 0. Add the new page to the project's content store in its exact discovered format/schema.
- **`comparison` (NEW)** → write a new comparison/alternatives page using `.claude/commands/comparison-content-creator/phase-3-generate.md` (same verbatim prompt + the comparison-table/verdict/FAQ requirements). Add it to the project's comparison content store in its discovered format.
- **`PARTIAL` (either kind)** → do NOT create a new route. Enrich the existing page for this project in place using `.claude/commands/comparison-content-creator/phase-3b-enrich.md` → `.claude/commands/keyword-gap-pass/phase-5-body.md`, adding only what the competitor's `outline` covers that we're missing.

Follow the **medium-determination sub-step (3.0)** in those files first (text/chart/data; image/video → text).

## The competitor coverage floor (the one net-new generation input)

When you dispatch the verbatim content prompt for a candidate, append — as an ADDITIVE instruction, never a modification of the verbatim block — the following, filled from the candidate:

```
COVERAGE FLOOR — a competitor (<competitor_name>) published a page on this topic:
  Title: <title>
  Section outline (H2/H3): <outline as a bullet list>
Your page MUST cover every topic in this outline and beat its depth and usefulness.
Treat this outline only as a checklist of topics to exceed.
‼️ Write 100% ORIGINAL prose. Do NOT copy, paraphrase sentence-by-sentence, or mirror
the competitor's wording. Add information gain they do not have (a first-hand operational
detail, an SMB-specific failure mode, a non-obvious tradeoff, or a decision criterion).
Never reference or name the competitor on the page.
```

> **Never fetch-and-store competitor HTML into the repo.** Use only the `outline`/`title` already captured in the candidate. If you must look at the live competitor page to understand the topic, read it transiently — never paste its text into our content.

## Guardrails (from the reused files — do not skip)
- **NET-NEW only** for NEW candidates; never overwrite/regenerate an existing route. Re-check live slugs before insert (a page may have been added since Phase 0).
- Use the project's **exact data-file field keys** (grep an existing entry); a wrong key renders a section empty and `tsc` won't catch it.
- **Every emitted record MUST include an `inlineCta`** (`{ text, buttonLabel, buttonHref }`) — a tailored, two-sentence consultation nudge that NAMES the page's actual subject (model/tool/vertical/workflow); a generic line that fits any page is a spec violation. `buttonLabel` default `"Book a Consultation"`, `buttonHref` always `"/ai-workflow-audit"`. Missing it falls back to a generic default.
- Match the discovered page template + schema builders (JsonLd/FAQ/breadcrumb).

Record each item's intended `our_url` (route) for Phase 6's ledger `record`. **Auto-continue to Phase 3c, then Phase 4.**


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
1. **The client roster** (see `seo-content-guidelines` memory / the roster the skill loads): the updated roster adds our newer engagements — Multiple HOA & condo boards across the USA, The HOA Guide (thehoaguide.com), TheBotScout (humanoid-robotics research), DroneAndDefense (defense/drones investment journal) — plus **approved, resume-backed first-hand experience** you may cite as real operator experience: Dapper Labs (enterprise AI tooling & automation — AI video for NBA Top Shot & NFL All Day, internal AI assistants on OpenAI/Anthropic/Vertex, BigQuery integration, marketing automation via Retool/Zapier/n8n), Amazon (consumer-electronics email/SEO/paid search at $200M+ scale), Uber (product/pricing/growth), Horizen Labs (growth marketing & retention), and the founder track record (Layer 3 Labs — 1.5M users with no ad spend, 17+ games, two prior exits) — plus the existing roster. Additional gaming engagements PBA, MetaKing Studios, HeroMaker Studios: verify before citing specifics. Do NOT describe Dapper Labs as Web3/NFT work — it is enterprise AI tooling.
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
