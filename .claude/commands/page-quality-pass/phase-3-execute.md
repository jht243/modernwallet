# Phase 3 — Execute: apply the prescriptions, then prove the build

Apply every prescription from Phase 2, one page at a time. Every word of new prose is written to the Stage-3 standard: `.claude/commands/seo-gsc-pass/phase-3-new-content.md` **if present** (research-first, E-E-A-T, answer-first, readability, internal linking); otherwise apply that standard inline. Nothing in this phase publishes — Phase 4 audits first.

## Mechanics per prescription type

### `REWRITE_SECTION`
- Replace ONLY the prose inside that one section, in place, in the page's source (data-file entry / markdown / template — wherever Phase 2 found it). Heading stays; position stays; every other section stays byte-identical.
- The new prose must deliver the content brief: specific, verified facts — numbers, names, steps, dates, trade-offs. Answer within the first two sentences; no filler openers ("In today's fast-moving world of…" is an instant Phase 4 kill).
- **Fact discipline:** every claim traces to the brief's verification. An old claim you could not verify does NOT survive into the rewrite.
- Length: whatever delivering the answer takes — a rewrite may be shorter than the filler it replaces, but the page's total information content must go UP, never down (Phase 4 checks this).

### `APPEND_SECTION`
Append after the last body section (before any FAQ block, matching the site's section order conventions), one section per prescription, answering its sub-intent completely. Same write standard.

### `ADD_LINKS`
Weave each link into an existing sentence where the reader's next question naturally arises — or add ONE short transitional sentence where no anchor point exists. Use the site's internal-link syntax/component exactly as sibling pages do. Verify every target route exists in the inventory AND returns content in the repo (a route in the inventory that was reverted upstream is a 404 waiting to ship).

### `EMBED_TOOL`
Build per the Phase 2 spec: working client-side logic (no fake outputs, no new dependencies, no secrets), placed where the prescription says, styled like the site's existing interactive components. All on-page copy (intro, labels, result text) meets the write standard.

### `REWRITE_METADATA`
Edit title/meta-description in the page's data record only. ‼️ NEVER emit `canonicalOverride: undefined` — omit the key entirely (it silently 404s the whole static export; tsc cannot catch it).

## Formatting hazards (all mandatory)
- **Apostrophes:** escape (`\'`) or double-quote every apostrophe inside single-quoted generated strings — one unescaped apostrophe fails the whole build and every deploy after it.
- **Byline:** never in body prose — it renders from the header + JSON-LD.
- **First-mention links:** first mention of any external company/product/model links to its official site UNLESS the project's auto-link registry covers it (layer3: `ENTITY_LINKS` in `src/utils/sectionContent.tsx` — CHECK the registry, never assume). Recurring new entity → note "registry candidate" in the digest; hand-link for now. Never hand-write a referral URL.
- **Inline CTA:** the site's standard CTA component below the first body section stays exactly where it is.

## Build gate (before Phase 4)
Typecheck AND full `next build` (or the repo's build command) — **Node 20** (`export PATH="/opt/homebrew/opt/node@20/bin:$PATH"` locally; cloud images default correctly). tsc alone is insufficient (undefined-serialization + apostrophe hazards only surface in the build). Build failure → fix mechanically if trivial (an escape, a missing comma); otherwise REVERT the offending page's edits entirely, log DROPPED ("build revert"), continue with the rest.

## Output
The edited working tree + per-page change manifest (files touched, sections rewritten/appended with before/after word counts, links added with targets, tools built, metadata diffs) → `phase-4-audit-publish.md`. **No commit yet.**


## Feb 2026 Core Update — proprietary anchor + anti-AI-filler (MANDATORY — workflow-wide, added 2026-07-31)

Google's February 2026 core update (Discover-focused) demoted sites mass-producing unedited ChatGPT content and rewarded pages with **proprietary data** — first-hand numbers, real client cases, a defensible point of view. Every article/prose page you write here must clear two bars, and Phase 4 now enforces both.

**BAR 1 — Do not write like an unedited LLM.** Before you finalize, strip these tells (Phase 4 hard-fails a page carrying two or more):
- Throat-clearing openers ("When it comes to…", "In today's fast-paced world…", "In the ever-evolving landscape of…").
- The "it's not just X, it's Y" cadence; empty tricolons ("efficient, effective, and scalable"); hedged non-conclusions ("ultimately, the right choice depends on your needs").
- Filler verbs/phrases: "delve into", "leverage" (verb), "navigate the complexities of", "unlock the power of", "it's worth noting that", "a testament to".
- Monotonous em-dash rhythm and same-shape listicle padding.
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
