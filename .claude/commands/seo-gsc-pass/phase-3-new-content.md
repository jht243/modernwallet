# Phase 3 — New content creation

Act on every **new-content** row in the chart. For each, check the row's `format` column first — it determines what this phase produces:

- **`article` (or no format column / `n/a`)** → write the full article following the content guidance below. This is the only format Phase 3 builds end-to-end.
- **`interactive tool`, `calculator`, `quiz/assessment`, `template`, `comparison table/database`, `glossary/reference`, `data report`** → this phase does **NOT** build the asset. Instead, write a **one-page asset spec** at the route (e.g. `reports/seo-pass/specs/<slug>-spec.md`) containing: (1) the target route/URL, (2) recommended format + rationale from the chart, (3) what the asset does (inputs → outputs for tools/calculators; question flow for quizzes; column schema for databases; data sources for reports), (4) the primary and secondary keywords it targets, (5) word count / scope estimate, and (6) any technical dependencies (e.g. "requires a React component at /components/Calculator.tsx"). `git add` the spec. Phase 4 reviews the spec for completeness; the spec is what ships in this commit so the human can build the asset in a follow-up session. Never write stub/placeholder page content for non-article formats — the spec IS the deliverable.

Wire the route for all rows — article pages get full page files; non-article rows get the spec file at `reports/seo-pass/specs/<slug>-spec.md` plus a `// TODO: implement <format> asset — see spec` placeholder at the target route if a route file is expected by the framework. `git add` your work but do NOT commit — inbound links FROM existing pages are added in Phase 5, and Phase 4 is the gate for this phase.

> **NET-NEW ONLY.** This phase creates brand-new routes. It must NEVER overwrite, regenerate, or replace an existing page, and never run a generator that rebuilds existing content. If a "new-content" row actually points at a route that already exists, do not recreate it — STOP and flag it (it likely belongs in body/metadata, or it was already shipped). Each page here is written by hand to the content standard, not stamped out by a script.

---

**For `article` format rows:** create the full page using the following guidance:

> **Project-agnostic placeholder.** The guidance below contains the token `{BUSINESS_NAME}`. Before writing (or before handing the prompt to a subagent), substitute it with the business/brand name discovered in Phase 0. **Never emit the literal `{BUSINESS_NAME}` into any page.**

You are an expert SEO content writer creating high-ranking, helpful articles.

Before writing, research the topic using search tools. Gather current statistics, recent trends, competitor insights, expert quotes, authoritative citations, and real-world examples. Prioritize industry reports, government data, academic research, reputable publications, official company sources, and recent case studies.

**SEO Requirements:**
- Use the primary keyword in the SEO title, H1, first paragraph, conclusion, and 2–3 H2/H3 headings.
- Use secondary and semantic keywords naturally throughout the article. Avoid keyword stuffing.
- Create an SEO title of 50–60 characters that is compelling and includes the primary keyword.
- Improve the provided title if needed while keeping the core meaning.
- Use a clear structure: H1, H2, and H3.
- Add a table of contents for articles over 2,000 words.
- Use bullet points, numbered lists, FAQs, concise definitions, and comparison tables where useful.
- Optimize for featured snippets.
- Include relevant internal links to related {BUSINESS_NAME} hub, spoke, cluster, and blog pages.
- **External linking (first mention → official source).** The FIRST time you name any external product, model, tool, company, benchmark, standard, law/regulation, dataset, or study a reader might click to act on your advice, link it to its OFFICIAL primary source (the vendor's/lab's/regulator's own page, or the benchmark's own repo — never an aggregator). Link only the first mention of each. **Exception — projects that auto-link at render time:** if THIS project turns common entities into links automatically (e.g. a render-time registry like layer3's `ENTITY_LINKS` in `sectionContent.tsx`), write those common names (major AI models, coding IDEs, AI labs, well-known benchmarks) in plain text so the page isn't double-linked, and never hand-write a referral URL. If the project has no such auto-linker, hand-link those too. When unsure, hand-link — one correct link on first mention is the goal.
- Make sure all new pages are properly linked within the correct hub/spoke structure.
- Don't dismiss a keyword just because tools show zero monthly searches — real demand often appears in GSC impressions weeks before search-volume tools register it. When a question-format zero-volume variant is genuinely the best fit for a heading or FAQ — i.e. no stronger, more-relevant keyword belongs in that slot — use it as the H2/H3 or FAQ question to capture long-tail demand. Sources: Google Autocomplete, People Also Ask, and the natural language customers use (e.g. "Can [tool] handle HIPAA compliance for small clinics?"). This is an OPTION to widen long-tail coverage, NOT a quota: never force a zero-volume keyword into a slot a better-targeted keyword belongs in. The 2–3 primary-keyword heading slots above remain non-negotiable.

**Depth floors (MANDATORY — added 2026-08-17, ported from `/new-site` via mindmap-pass):**
- Every article page has a **minimum body word count** by page type. These are **floors, not targets** — a page under its floor does not compete, and Phase 4 hard-fails it. Body words = reader-facing prose only (intro + section bodies + FAQ answers + verdict); title, meta, nav/header/footer, schema, CTA boilerplate, and code blocks do NOT count.

  | Page type | Floor (body words) |
  |---|---|
  | comparison (`X vs Y`) | 1,500 |
  | review | 1,500 |
  | persona / audience page (`for [audience]`) | 1,400 |
  | hub / section index | 1,200 |
  | worth-it | 1,200 |
  | explainer / how-to / spoke (**the default for anything else**) | 1,200 |
  | cost / pricing | 1,000 |
  | editorial (about / methodology) | 600 |

- Hitting the floor with padding is a **worse** failure than missing it — the anti-AI-filler bar and the proprietary-anchor bar still apply in full, and Phase 4 checks them on the same pass. If you cannot reach the floor without filler, the topic is too thin for its own page: STOP and flag the row for merging into a related page rather than shipping a padded one.
- Record the final body word count for each page you write and hand it to Phase 4 with the page.

**Content Quality:**
- Match search intent fully.
- Write accurate, original, useful content with practical advice.
- Include current-year references, recent data, statistics, trends, and examples.
- Demonstrate E-E-A-T with citations, expert sources, detailed explanations, and credibility indicators where relevant.
- Add specific examples, use cases, tips, and actionable takeaways.
- End with a clear conclusion and call-to-action.
- Information gain: raise the bar on the "specific examples" rule above — at least one example must contribute information NOT already present on the top-ranking pages for this topic (first-hand operational detail, an industry-specific failure mode, a non-obvious tradeoff, or a decision criterion competitors don't surface). Weave it INTO the relevant existing section as a supporting sentence or bullet — never split it into a standalone self-promotional section. Reframing the same ideas as competitors in different words does NOT satisfy this rule.
- Answer-engine optimization (AEO): the FIRST sentence of each major section's content must be a complete, self-contained declarative statement that answers the section's question directly, without requiring context from surrounding paragraphs. AI assistants (ChatGPT, Perplexity, Gemini) extract passages, not full articles — each passage must stand alone. This applies ONLY to section openers; the "use transition words naturally" rule above continues to apply within and between paragraphs. Each FAQ answer also leads with the direct answer; nuance and caveats follow.
- Authorship (mandatory on YMYL — compliance, finance, medical, legal): a named, credentialed human reviewer in a visible byline + a Person entry in JSON-LD. **Reviewer name and review date belong in the page's header/byline area and in structured schema (`reviewer` / `lastReviewed`), NOT in body prose — do NOT write any "Reviewed by [name] on [date]", "Last updated…", author, or research-method sentence into the body/intro/sections/verdict/FAQ or any prose field.** If this project's template renders the byline from the record's date fields (e.g. layer3), just set the structured `publishedDate` / `updatedDate` field and let the template render it; if the template has no byline slot yet, put the byline in the header/metadata + JSON-LD — still never as a body paragraph. Organization-only author is not acceptable on YMYL.
- First-party sourcing: cite primary sources directly — the vendor's own page, the regulator's own page, the official trust center — never aggregators. The link is for verification; the article still carries the substantive answer on-page.
- Task completion: the article must answer the reader's intent on-page. No thin wrappers around an external link, no empty templates. If the page points to a primary source, the on-page version still leads with the substantive answer.

**Writing Style:**
- Use simple, everyday language at a 7th–8th grade reading level.
- Keep sentences under 20 words.
- Use active voice.
- Write one main idea per sentence.
- Keep paragraphs to 3 sentences max.
- Add subheadings every 200–300 words.
- Use common words: "help" instead of "facilitate," "use" instead of "utilize," and "show" instead of "demonstrate."
- Avoid jargon unless necessary.
- Use transition words naturally.
- Keep the tone helpful, clear, and professional.

**Comparison angle (NET ADD — do not remove or shrink any existing section):**
- After the page structure is fully planned, ask: does this topic have a natural "X vs Y," "X vs alternatives," or "which approach/tool is better for [use case]" question a reader would also want answered?
- If yes, add a comparison table (3–5 criteria rows, one column per option, a verdict row) and a brief "when to choose X" paragraph as an EXTRA section on top of the already-planned outline. This is additive only — it must not replace, shorten, or merge with any section that was already planned.
- Applicable on: tool/platform pages, methodology pages, regulatory/compliance option pages, any page where two or more approaches, products, or frameworks are meaningfully in scope. Skip if the page is definitional or reference content with no real comparison axis.
- Do NOT force a comparison where none exists — one well-executed table beats a hollow one.

**Before finalizing, confirm the article:**
- Addresses search intent.
- Uses the primary and secondary keywords correctly.
- Includes current research, data, and sources.
- Provides actionable value.
- Uses clear examples and use cases.
- Follows the required structure and readability rules.
- Includes proper internal links to related hubs, clusters, and pages.
- Ends with a strong CTA.

---

Then: match the discovered page template + schema builders (so the new page carries the same JsonLd/SEO scaffolding as existing pages), `git add`, and do not commit.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/seo-gsc-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.


## Feb 2026 Core Update — proprietary anchor + anti-AI-filler (MANDATORY — workflow-wide, added 2026-07-31)

Google's February 2026 core update (Discover-focused) demoted sites mass-producing unedited ChatGPT content and rewarded pages with **proprietary data** — first-hand numbers, real client cases, a defensible point of view. Every article/prose page you write here must clear two bars, and Phase 4 now enforces both.

**BAR 1 — Do not write like an unedited LLM.** Before you finalize, strip these tells (Phase 4 hard-fails a page carrying two or more):
- Throat-clearing openers ("When it comes to…", "In today's fast-paced world…", "In the ever-evolving landscape of…").
- The "it's not just X, it's Y" cadence; empty tricolons ("efficient, effective, and scalable"); hedged non-conclusions ("ultimately, the right choice depends on your needs").
- Filler verbs/phrases: "delve into", "leverage" (verb), "navigate the complexities of", "unlock the power of", "it's worth noting that", "a testament to".
- Never call software, a model, a tool, pricing, or a verdict "honest"/"honestly" ("an honest read", "the honest caveat", "the honest answer", "to be honest") — software has no honesty. Say the point directly ("the caveat is…", "the short answer is…", "a straight read").
- Em-dash cap: at most **2 em-dashes per page, and never two in the same section**. The em-dash-interrupted sentence shape repeating paragraph after paragraph is one of the loudest AI tells. Use commas, colons, periods, or parentheses instead, and vary sentence shape. Same-shape listicle padding is a separate tell — avoid it too.
- Anthropomorphic "death" language for software/tech — never write that a demo, feature, product, tool, model, or technology "died", "is dead", was "killed", is "on life support", or "flatlined". Software does not die: say what literally happened — it never shipped, was abandoned, stopped being used, or lost support.
- Search-intent / answer-scaffold narration — never write about the reader's own search or about the page itself: "which is the reason this search exists", "that's why you're here", "if you're (still) reading this", "the short answer (is)", "here's the thing/catch/reality", "you might be wondering". State the fact directly instead (e.g. "Figure 03 isn't sold to the public; it ships to enterprise partners under private agreements."). A single instance is enough to strike.
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
