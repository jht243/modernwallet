
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 4 — Content: thin-page improvement + net-new pages

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


> **‼️ PROSE IS API-GENERATED — `.claude/commands/_content-generation.md` governs this step (migrated 2026-09-06). Scope here: Mode B net-new pages via `write`; Mode A thin-page enrichment via `section` (every addition >1 sentence).** The running agent does NOT write the prose. Follow the contract: `python3 scripts/lib/content_gen.py preflight` once per run; assemble `system.md` (a real published page of the SAME type as the voice sample → the output contract for its exact fields → `_anti-ai-language.md` WRITER → `_experience.md` → `_content-standard.md` LAST, scoped to structure) and a DATA-ONLY row prompt carrying a CLOSED fact list + CLOSED URL list, the real internal routes it may link, and **everything this file requires the page to cover** (coverage floors, required sections, schema fields, matchup rules) as INPUT; run `content_gen.py write --format json --schema guide --allowed-urls … --facts …`; read `meta.guards` (repairs/flags); template exactly as this file already specifies — every required field including `inlineCta` — lint, then the audit this file names, with the fact list + URL list handed to the auditor. Findings follow `_remediation-ladder.md` (mechanical in place; regenerate with a CORRECTIONS block; never hand-write generated prose). `git add` each `.meta.json`. Caps, ledgers, lanes, dedup, publish steps, are unchanged; enrichment-of-existing-page work in this file (>1 sentence) runs through `content_gen.py section` — see the Enrichment chapter of the contract. The INTRO HUMANIZE step is SKIPPED for pages generated here.

> **‼️ GOVERNING RULE — ENRICHMENT PROSE IS GENERATED BY THE API WRITER (2026-09-06).** This phase
> adds to or rewrites parts of EXISTING pages. **Any reader-facing addition longer than ONE
> sentence — an FAQ answer, a new section, body paragraphs, an answer block, an expansion, a
> rewritten section or intro — is generated with `scripts/lib/content_gen.py section` per the
> "Enrichment" chapter of `.claude/commands/_content-generation.md`, never written in-context.**
> You still choose WHAT to add and WHERE, assemble the closed fact list + closed URL list, hand
> the writer the page's CURRENT text, run the generator, then splice the verified draft in with a
> targeted `Edit` (TS/JSON stores: one paragraph → one `content[]` string / the FAQ `answer`
> field, no re-wording). Commit the `<slug>--<section-id>.md.meta.json` beside the draft. The
> reviewer gate below audits the addition with the fact list beside it, exactly as before.
> **Exempt (write in-context, `_anti-ai-language.md` still applies):** titles, descriptions, a
> single clarifying sentence, an internal-link sentence, a number/date correction, alt text,
> schema fields. Every instruction below that says "write", "draft", "add a section/answer" means
> "generate it through the section command"; the prose rules below are the writer's system
> prompt, not a licence to write the prose yourself.

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


