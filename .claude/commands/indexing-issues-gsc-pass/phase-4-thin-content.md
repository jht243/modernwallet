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
5. Authorship + first-party sourcing (May 2026 core update): if the page lacks a named, credentialed human author with visible byline + Person JSON-LD, add one — mandatory on YMYL topics (compliance, finance, medical, legal). The reviewer byline + date belong in the header/byline + schema, never a body-prose sentence — if the template renders the byline from date fields (e.g. layer3) set the record's `publishedDate`/`updatedDate`, otherwise add it to the header/metadata + JSON-LD. Replace aggregator citations with first-party sources (the vendor's own page, the regulator's own page). On-page task completion: the page must answer the reader's intent on-page — never thin-wrap an external link.

## Mode B — create net-new content (same guide as /seo-gsc-pass)
For each net-new page the run calls for, create the page following the guidance below, then wire its route (a new page file, or a new entry in the relevant data/CMS record for templated routes). `git add` but do NOT commit.

---

Create all new content using the following guidance:

## Content standard

> **HOW TO LOAD (MANDATORY — this is the only sanctioned way).** Run:
> `bash .claude/tools/load-standards.sh "<routine-name>" "<this-phase>"`
> and treat its ENTIRE output as the standard. The script prints `_content-standard.md`, `_anti-ai-language.md`, and `_experience.md` in full and appends the load receipt to `reports/standards-ledger.jsonl` in the same action — reading and proving-you-read are one step, so never open the files another way. `git add reports/standards-ledger.jsonl` with the run. If the script or any file is missing, STOP and report it.

**Load `.claude/commands/_content-standard.md` and apply it IN FULL.** It is the single source of truth for the medium gate, SEO and required page elements, depth floors, quality and sourcing, readability, voice and register, comparison, linking, the proprietary anchor, and neutrality. Start with its `## PREFLIGHT` section. There is no cherry-picking and no substituting your own standard.

**Also load `.claude/commands/_experience.md`** — it defines who "we" are on this site and is the ONLY source a first-person experience claim may draw on. If it is missing or its `## DOMAIN` is empty, STOP.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its WRITER section; it outranks the content standard on any conflict.

Anything inline below this block is superseded by the canonical files above.

## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
When Track A (this phase) and Track B (Phases 1–3) have both completed, immediately begin Phase 5 (Audit) in the SAME turn. Do NOT stop or ask. The only human stops are Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8 summary).


