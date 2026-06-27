# Phase 4 — Content: thin-page improvement + net-new pages

This phase produces/edits CONTENT (Track A). It runs in parallel with the Track B code phases (1–3) and edits content (the CMS/DB record or content template behind a URL) — NOT app code, NOT canonical/redirect/robots logic. Keep its file/record set disjoint from Track B.

It has two modes; do whichever the report calls for:

- **Mode A — improve thin existing pages:** for URLs in `improve thin content` (GSC `Crawled – currently not indexed`). Google crawled them and declined to index — a content-quality/uniqueness judgment.
- **Mode B — create net-new pages:** when the run calls for a brand-new page — most commonly a **consolidation hub/pillar** that absorbs a set of thin/duplicative pages (e.g. the "consolidate vs keep" decision approved at the Phase 0 manifest), or a genuinely missing page. **Net-new pages follow the same standard as the `/seo-gsc-pass` new-content phase** (prompt → check → summary approval before push), reproduced below.

**Honest framing (state it in the summary):** improving/creating content is a *best-effort* indexing lever — it makes a page deserve indexing; Google still decides on its own schedule. Never promise indexing.

---

**Already-shipped guard (both modes):** skip any row the build phase bucketed `already-fixed — awaiting recrawl`, and before expanding/creating, scan the last 30 commits (`git log -p -30 -- <page/data file>`) + the working tree — if a recent commit already added the content/section for that URL, do NOT redo it (re-submit only). Re-writing content that just shipped is duplicate work and risks clobbering it.

## Mode A — improve thin existing content
**‼️ HARD RULE — "expand" means EDIT THE EXISTING PAGE IN PLACE, ADDITIVELY. It does NOT mean regenerate the page.**
- You are **augmenting** the current page — keeping its existing copy, headings, structure, URL, metadata, and any content Google has already crawled — and **adding** the missing depth around it. You are not producing a replacement.
- **NEVER wholesale-rewrite or script-regenerate the page** (no "delete the body and generate a fresh article," no template re-render that overwrites the human-written content, no find-and-replace of the whole `<main>`). Blowing away existing content discards copy Google already assessed and any equity/nuance it carries, and risks regressing a page that was merely under-developed.
- Make **targeted, surgical edits**: append new H2/H3 sections, extend thin paragraphs, insert examples/data/citations, tighten weak intro/CTA — each as a discrete diff against the current file. The reviewer should see *additions and small in-place edits*, not a from-scratch rewrite.
- Preserve existing good content verbatim unless a specific line is factually wrong or clearly low-quality; improving thin ≠ replacing acceptable.

1. Read the current page; identify why it's thin (too short, templated/duplicative, no original analysis, weak intent match, no E-E-A-T) and exactly **which sections are missing or under-developed**.
2. **Add** the missing depth in place, matching the Phase-0 content standard (voice, depth, claims discipline, structure, CTA): substantive original analysis (specifics, examples, data, citations), stronger E-E-A-T, differentiation from near-duplicates, clear H2/H3 — layered onto the existing page, not replacing it. **No keyword stuffing, no spun filler** — thin fixed with filler stays unindexed.
3. If a page genuinely shouldn't exist (no unique purpose, true duplicate), do NOT pad it — flag for consolidation/removal as `ambiguous — needs human`.
4. Prioritize information gain when adding depth: the added content must contribute something genuinely novel to the page — a specific example, original data, a non-obvious implication, or a concrete decision criterion the reader couldn't find on competing pages — woven into the page's existing sections rather than bolted on as a self-promotional block. Thin pages fixed with filler (more words covering the same ground) remain unindexed. Thin pages fixed with substantive, differentiated content send a genuine signal upgrade.
5. Authorship + first-party sourcing (May 2026 core update): if the page lacks a named, credentialed human author with visible byline + Person JSON-LD, add one — mandatory on YMYL topics (compliance, finance, medical, legal). Add a short "how we research / reviewed by [name] on [date]" line. Replace aggregator citations with first-party sources (the vendor's own page, the regulator's own page). On-page task completion: the page must answer the reader's intent on-page — never thin-wrap an external link.

## Mode B — create net-new content (same guide as /seo-gsc-pass)
For each net-new page the run calls for, create the page following the guidance below, then wire its route (a new page file, or a new entry in the relevant data/CMS record for templated routes). `git add` but do NOT commit.

---

Create all new content using the following guidance:

You are an expert SEO content writer creating high-ranking, helpful articles.

Before writing, research the topic using search tools. Gather current statistics, recent trends, competitor insights, expert quotes, authoritative citations, and real-world examples. Prioritize industry reports, government data, academic research, reputable publications, official company sources, and recent case studies.

**SEO Requirements:**
- Use the primary keyword in the SEO title, H1, first paragraph, conclusion, and 2–3 H2/H3 headings.
- Use secondary and semantic keywords naturally throughout. Avoid keyword stuffing.
- Create an SEO title of 50–60 characters that is compelling and includes the primary keyword.
- Use a clear structure: H1, H2, H3. Add a table of contents for articles over 2,000 words.
- Use bullet points, numbered lists, FAQs, concise definitions, and comparison tables where useful.
- Optimize for featured snippets.
- Include relevant internal links to related hub/spoke/cluster/blog pages (obey the Phase 6 HARD RULE: any related-links module shows ≤3 visible, overflow behind "See more").
- Include trusted external links where appropriate.
- Ensure the page is properly linked within the correct hub/spoke structure.

**Content Quality:**
- Match search intent fully. Write accurate, original, useful content with practical advice.
- Include current-year references, recent data, statistics, trends, examples.
- Demonstrate E-E-A-T with citations, expert sources, detailed explanations, credibility indicators.
- Add specific examples, use cases, tips, actionable takeaways. End with a clear conclusion and CTA.
- Information gain: raise the bar on the examples rule above — at least one example must contribute information NOT already on top-ranking pages (first-hand operational detail, an industry-specific failure mode, a non-obvious tradeoff, or a decision criterion competitors don't surface). Woven into the relevant section, never a standalone self-promotional section.
- AEO: the FIRST sentence of each major section must be a self-contained declarative statement that AI assistants (ChatGPT, Perplexity, Gemini) can extract verbatim. Applies only to section openers; transitions within/between paragraphs continue per the style guide. Each FAQ answer leads with the direct answer.
- Authorship (mandatory on YMYL — compliance, finance, medical, legal): named, credentialed human author + visible byline + Person JSON-LD + "how we research / reviewed by [name] on [date]" line. Organization-only author is not acceptable on YMYL.
- First-party sourcing: cite primary sources directly (vendor's own page, regulator's own page, official trust center) — never aggregators. Link is for verification; article carries the substantive answer on-page.
- Task completion: page must answer the reader's intent on-page. No thin wrappers around an external link, no empty templates.

**Writing Style:**
- Simple everyday language at a 7th–8th grade reading level. Sentences under 20 words. Active voice.
- One main idea per sentence. Paragraphs ≤3 sentences. Subheadings every 200–300 words.
- Common words ("help" not "facilitate," "use" not "utilize," "show" not "demonstrate"). Avoid jargon. Use transitions. Helpful, clear, professional tone.

**Comparison angle (NET ADD — do not remove or shrink any existing section):**
- After the page structure is fully planned, ask: does this topic have a natural "X vs Y," "X vs alternatives," or "which approach/tool is better for [use case]" question a reader would also want answered?
- If yes, add a comparison table (3–5 criteria rows, one column per option, a verdict row) and a brief "when to choose X" paragraph as an EXTRA section on top of the already-planned outline. This is additive only — it must not replace, shorten, or merge with any section that was already planned.
- Applicable on: tool/platform pages, methodology pages, regulatory/compliance option pages, any page where two or more approaches, products, or frameworks are meaningfully in scope. Skip if the page is definitional or reference content with no real comparison axis.
- Do NOT force a comparison where none exists — one well-executed table beats a hollow one.

**Before finalizing, confirm the article** addresses search intent; uses primary/secondary keywords correctly; includes current research/data/sources; provides actionable value; uses clear examples; follows the structure + readability rules; includes proper internal links; ends with a strong CTA.

Then: match the discovered page template + schema builders (so the new page carries the same JsonLd/SEO scaffolding as existing pages), `git add`, do not commit.

**If Mode B is a consolidation hub:** after the new hub is created and audited, the absorbed thin/duplicate pages are handled by the technical phases — canonical/301 into the hub (Phase 1/2) and removal from the sitemap (Phase 7) — exactly as the manifest specified. Record the absorbed routes so Phase 7 drops them.

---

## Gate, approval, and ordering
- **Check:** this phase is gated by the **Phase 5 audit**, which applies the `/seo-gsc-pass` new-content checks to every net-new page — metadata length (title/description), FAQ JSON + schema.org correctness, and good internal linking — plus the thin-content quality bar. It also verifies **Mode A edits were additive, not regenerative**:
  - ☐ each Mode A page shows an **in-place additive diff** (new sections / extended paragraphs / surgical edits) — **auto-REJECT any page that was wholesale-rewritten or script-regenerated** (existing crawled content deleted and replaced from scratch).
  - ☐ existing acceptable copy, headings, URL, and metadata are **preserved**; the page's prior content still substantially present (diff is mostly additions, not a near-total replacement).
  Reject-with-specifics; max 2 rework attempts then STOP.
- **Approval before push:** all content here is **staged only**. It is listed in the **Phase 8 summary**, and nothing is committed, added to the sitemap, or submitted to IndexNow/Google Indexing until **you approve at Stop 2**. (Sitemap + re-submission run only after approval — Phases 7→9.)

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
When Track A (this phase) and Track B (Phases 1–3) have both completed, immediately begin Phase 5 (Audit) in the SAME turn. Do NOT stop or ask. The only human stops are Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8 summary).
