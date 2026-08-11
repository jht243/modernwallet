# Phase 4 — Enrich pages in place (approved actions only)

Execute the actions the user approved at the Phase 3 gate — and **only** those rows. `git add` your work but do NOT commit (Phase 6 stages). Phase 5 is the gate for this phase.

> **‼️ NOT NET-NEW, NOT A REGENERATION.** This phase never creates a route and never rebuilds a page. It edits each existing top page in place, adding only the approved missing answer. Everything else on the page stays byte-for-byte unchanged.

## What you act on
The approved action list from `reports/question-gap-pass/gap-chart.md`, each carrying: the page route + source file, the follow-up question, the action (`Add section` / `Strengthen` / `Link`), and — for `Link` — the target route that already answers it.

## Writing standard — REUSED VERBATIM
Any prose you write for an `Add section` or `Strengthen` action MUST follow the **exact, full text** of `.claude/commands/seo-gsc-pass/phase-3-new-content.md`. Load that file and apply it character-for-character. The only permitted change is swapping the literal `{BUSINESS_NAME}` token for the business name discovered in Phase 0. Append the per-question gap description around the verbatim block; never paraphrase the standard. (Key consequences you must honor: plain-factual voice, no hype, AEO opener — the first sentence of the new section is a complete, self-contained declarative answer; E-E-A-T and first-party sourcing; no fabricated facts.)

## Enrichment discipline — REUSED VERBATIM from `.claude/commands/keyword-gap-pass/phase-5-body.md`
> **‼️ HARD RULE — the operating discipline for the edit. Follow it character-for-character; do not loosen it into "regenerate the section."**

Update the body text now, but I don't want you to totally recreate the page using scripts. I'd like you to keep the same page, but update it with your suggestions you identified prior. DO NOT recreate the page via script, only make updates where needed.

Make the edits in place (targeted `Edit` operations on the existing file), preserving everything not called out by the action item.

## What each action means

**`Add section`** — add a focused answer to the missing question:
- Prefer the page's **existing FAQ block** if it has one: append a new Q/A entry using the question as the heading, answer in 1–3 tight sentences (AEO opener first). If the page emits **FAQPage JsonLd**, add the entry to the schema too — don't leave the visible Q/A out of the structured data.
- If there's no FAQ block, add a short **H2/H3 sub-section** titled as the question, with a complete answer in 2–4 sentences. Place it where it flows (e.g. a "cost"/"how it works"/"risks" question near related content).
- Keep it tight — one question, one answer. Do not balloon the page.

**`Strengthen`** — the page partially answers it: tighten the **existing** passage in place so the answer is now complete and extractable (lead with the direct answer). Do not add a duplicate section; edit the sentence(s) that were vague.

**`Link`** — another page already answers it: add a single in-context internal link from this page to that page (natural anchor text near the relevant content). **Do not re-answer the question here.** If a suitable link already exists, record "already linked — skipped."

## Discipline / guardrails (check before handing to Phase 5)
- **Targeted `Edit` only.** Insert into the existing object/MDX/CMS field in place. Never overwrite the file wholesale, never invoke a generator/script that rebuilds the page.
- **Use the project's REAL body field key** (Phase 0 recorded it — e.g. `content:`, not an invented `body:`). A wrong key renders the section empty and `tsc` won't catch it in a loosely-typed store. Grep the surrounding objects and match.
- **Re-check coverage LIVE first.** The page may have improved since Phase 3 (or a prior run filled it — check `cache.json`). If it now already answers the question, **skip** that item and record "already covered — skipped." Don't double-add.
- **Match the page's existing structure + schema + voice.** Mirror its heading style, FAQ shape, and JsonLd conventions.
- **No fabricated facts** — prices, durations, certifications, security claims, stats are accurate or hedged with a range pointing to the primary source, never invented to complete an answer.
- **No new route, no sitemap `<url>` add** — the page already exists. Phase 6 only bumps its `lastmod`.

`git add` your edits. Do not commit. Auto-continue to Phase 5 (the gate covers every enriched page).

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The user already approved at the Phase 3 gate. The moment Phase 5's reviewer gate PASSES, continue in the SAME turn. Do not print "Want me to proceed?" or any question that waits for a human reply.


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** entities the project auto-links must stay PLAIN TEXT to avoid double-linking. In layer3 that is the `ENTITY_LINKS` registry in `src/utils/sectionContent.tsx` (AI models/IDEs/labs/benchmarks + registered vendors incl. legal-AI tools). **CHECK the registry before writing — never assume a vendor is in it.** If the entity is NOT in the registry, hand-link it inline; if it will recur across many pages, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

> <!-- monetization-check-v3 -->
> **‼️ MONETIZATION CHECK — run on every page you create or materially expand here (no-op unless the affiliate engine is installed).** Skip this entire check unless BOTH `src/utils/affiliateInject.ts` and `data/affiliate/catalog.ts` exist in this repo — they exist only where the inline-affiliate engine is installed (layer3labs); absent → do nothing, never create them. Where it IS installed, a fit page that ships un-monetized is a defect — but a section forced onto a page it does not naturally fit is an EQUAL defect. The affiliate section, its `sponsored nofollow` rels, the FTC disclosure, and the "Last updated" bump are ALL automatic — your ONLY action is adding ONE line to the `AFFILIATE_INJECTIONS` map in `src/utils/affiliateInject.ts` (a normal repo file; editing it is allowed — it is APPEND-only and never rewrites body prose). Dedup: skip if the slug is already in the map or the page already carries an affiliate / `sponsored` link — never double-monetize.
> **Natural fit is the gate — never force it.** Add a section ONLY where it genuinely serves THIS article's reader and topic. If a "what you need to run / use this" block would read as bolted-on, off-topic, or salesy for the page's real intent, SKIP it and log no-fit — a relevant omission beats a forced link every time; reader trust and editorial fit outrank a marginal referral.
> **Where the affiliate links come from — you NEVER type or invent one.** Every destination is centralized in code: the catalog `data/affiliate/catalog.ts` holds the products/tiers per profile, and the real referral codes live in `src/utils/affiliate.ts` — `amazonSearchLink()` appends the Amazon tag (`AMAZON_AFFILIATE_TAG`), plus first-party `CURSOR_ / RUNPOD_ / APOLLO_ / PINECONE_ / MURF_ / NUTSHELL_ / ELEVENLABS_ / …_REFERRAL_URL` constants. Common tools (Cursor, Apollo, Pinecone, Murf, Nutshell, …) are ALSO auto-linked from their plain name by `ENTITY_LINKS` in `src/utils/sectionContent.tsx`. So for hardware/how-to-use you only point a slug at a `profileKey`/`kind` and the catalog supplies the links; for a referral tool you just write its plain name. If a genuinely-fit product/tool is NOT wired: if `src/utils/affiliate.ts` already exports a constant for it, add a catalog entry using that constant; otherwise link its official site as PLAIN text and flag it as an affiliate-program candidate in your summary — NEVER fabricate a referral code (the catalog is the only source).
> Classify the page (only after it clears the natural-fit gate above):
> - **Open-weights model with a stated size** (weights downloadable; parameter / MoE count given on the page) → hardware entry `'<slug>': { modelName: '<Model>', profileKey: '<key>' }`. Pick `profileKey` from the size the PAGE states (never guess): `small-local` (≤~14B), `mid-large` (~15–150B), `frontier-moe` (>~150B / large MoE), or `general-spectrum` for a multi-model "best open-weights to run" page (skip general-spectrum if the page already has a "what runs where" section). Closed models (GPT, Claude, Gemini, Grok) are NEVER hardware-eligible; a model page with no stated size → skip.
> - **Closed / hosted model, model-vs-model comparison, or coding roundup** → how-to-use entry. Guide: `'<slug>': { kind: 'how-to-use', subject: '<model or "these models">', models: [{ name, vendor }] }`. Comparison (keyed by the comparison slug): `'<slug>': { kind: 'how-to-use' }` — the two models auto-derive from `optionAName` / `optionBName`. Fit: the reader must plausibly use the model through an AI IDE/tool (dev / coding / general-model audience).
> - **Non-model page that prominently uses a tool with a referral program** → no map entry; just write the tool's plain name and render auto-links it to its referral URL when it is in `ENTITY_LINKS` / `src/utils/affiliate.ts`. Never hand-write the URL; if the tool has no wired referral, link its official site plainly.
> - **`/{model}-for-{industry}` vertical page** → AUTO-covered at build; do NOTHING (already monetized).
> - **Genuine non-fit** — a pure conversion / nav / pricing page, a conceptual / definitional / news / opinion / policy-or-compliance piece with no real "run it or use it" need, or an image / video / robotics model with no product or tool to recommend → log "no monetization fit" and move on. When a page IS genuinely about running/using a model or tool and you are only unsure of the classification (hardware vs how-to-use), lean to adding the how-to-use section; but if you are unsure whether an affiliate section belongs on the page AT ALL, that is a no-fit — do not force it.
>
> `git add src/utils/affiliateInject.ts` explicitly. Before hand-off confirm the model is genuinely open-weights, the `profileKey` matches the size the page states, and (post-build) the live section carries `rel="sponsored nofollow"` + the bottom disclosure — any miss → remove the entry before push. The routine's existing build gate + 200-verify catch a broken injection.
> **Engine reference (layer3labs only):** catalog + profiles `data/affiliate/catalog.ts`; referral codes/constants `src/utils/affiliate.ts`; section builder `src/utils/affiliateSection.ts`; injection map + guardrails `src/utils/affiliateInject.ts`; detector `pageHasAffiliateLinks` in `src/utils/affiliate.ts`; auto-link registry `ENTITY_LINKS` in `src/utils/sectionContent.tsx`. Full design: memory `inline-affiliate-section-engine`.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by the project's auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.


## Feb 2026 Core Update — proprietary anchor + anti-AI-filler (MANDATORY — workflow-wide, added 2026-07-31)

Google's February 2026 core update (Discover-focused) demoted sites mass-producing unedited ChatGPT content and rewarded pages with **proprietary data** — first-hand numbers, real client cases, a defensible point of view. Every article/prose page you write here must clear two bars, and Phase 4 now enforces both.

**BAR 1 — Do not write like an unedited LLM.** Before you finalize, strip these tells (Phase 4 hard-fails a page carrying two or more):
- Throat-clearing openers ("When it comes to…", "In today's fast-paced world…", "In the ever-evolving landscape of…").
- The "it's not just X, it's Y" cadence; empty tricolons ("efficient, effective, and scalable"); hedged non-conclusions ("ultimately, the right choice depends on your needs").
- Filler verbs/phrases: "delve into", "leverage" (verb), "navigate the complexities of", "unlock the power of", "it's worth noting that", "a testament to".
- Never call software, a model, a tool, pricing, or a verdict "honest"/"honestly" ("an honest read", "the honest caveat", "the honest answer", "to be honest") — software has no honesty. Say the point directly ("the caveat is…", "the short answer is…", "a straight read").
- Em-dash cap: at most **2 em-dashes per page, and never two in the same section**. The em-dash-interrupted sentence shape repeating paragraph after paragraph is one of the loudest AI tells. Use commas, colons, periods, or parentheses instead, and vary sentence shape. Same-shape listicle padding is a separate tell — avoid it too.
- Anthropomorphic "death" language for software/tech — never write that a demo, feature, product, tool, model, or technology "died", "is dead", was "killed", is "on life support", or "flatlined". Software does not die: say what literally happened — it never shipped, was abandoned, stopped being used, or lost support.
- Vague abstractions — do not reach for an impressive-sounding phrase in place of the concrete thing ("clever one-off demos", "seamless synergy", "strategic inflection point", "holistic solution"). If a phrase cannot survive a "what does this literally mean?" test, replace it with the specific noun, number, or example.
Write with concrete specifics, commit to a conclusion, and vary sentence shape.

**BAR 2 — Give the page a proprietary anchor (do this FIRST, before drafting).** Walk two lists against your topic:
1. **The client roster** (see `seo-content-guidelines` memory / the roster the skill loads): the updated roster adds our newer engagements — Multiple HOA & condo boards across the USA, The HOA Guide (thehoaguide.com), TheBotScout (humanoid-robotics research), DroneAndDefense (defense/drones investment journal) — plus **approved, resume-backed first-hand experience** you may cite as real operator experience: Amazon (consumer-electronics email/SEO/paid search at $200M+ scale), Uber (product/pricing/growth), Horizen Labs (growth marketing & retention), and the founder track record (Layer 3 Labs — 1.5M users with no ad spend, 17+ games, two prior exits) — plus the existing roster. Also approved (cite freely): PBA (Professional Bowlers Association) — same digital-ownership, rewards & gamification program we built for Bowlero; and MetaKing Studios & HeroMaker Studios — game studios where we used AI to boost marketing, retention & analytics (reasonable extrapolation OK, never invent hard numbers).
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
