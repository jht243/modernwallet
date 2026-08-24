# Phase 2 — Enrich: rewrite our answer block to out-answer the cited competitor

For EACH STEAL page from Phase 1: open its real source, find the block that answers the page's top query, compare it against the answer Google is currently quoting from the competitor, and rewrite OUR block to be the cleaner, more directly-extractable answer. One page at a time. Nothing publishes here — Phase 3 audits first.

> **Portable — discover, don't assume.** Locate the page's body wherever this site keeps it (a data-file entry, markdown/MDX, a template). Find it by slug (`grep -rn "<slug>" data/ src/ content/` — mind quoting styles). Read the WHOLE entry before editing anything.

## Why AI Overviews cite what they cite
Google's AI Overview quotes a **short, self-contained, directly-extractable passage** that answers the sub-question plainly — definition or number first, no burying it three paragraphs down, no marketing wind-up. To take the citation from the competitor, our answer must beat theirs on exactly that: more complete, more literal, more current, easier to lift as a standalone quote.

## Per STEAL page — the one prescription type: `REWRITE_ANSWER_BLOCK`
1. **Identify the target block.** The section (or FAQ answer) on our page that *should* be the source for the query. If a fitting block exists, rewrite it in place. If none exists but the topic belongs on the page, APPEND one focused answer section (never regenerate the page).
2. **Read the competitor's cited answer.** From Phase 1 you have the cited competitor domain and (where present) its ranking URL. Read what Google is quoting from them — that is the bar. Do NOT copy it; out-answer it.
3. **Write the replacement to the extractable-answer shape:** lead with the direct answer in the first one or two sentences (definition, number, or verdict), then the supporting specifics — names, figures, dates, trade-offs — every one verified (research-first; an unverifiable old claim does not survive the rewrite). No filler opener ("In today's fast-moving world of…" is an instant Phase 3 kill).
4. **Fact discipline (this is a live-answer block — extra strict):** every claim traces to a verifiable source. On a YMYL site, never invent a dose, price, statistic, or range; ground each in the page's existing cited evidence or drop it.
5. **Consistency sweep (MANDATORY):** if the rewrite changes a fact's status (future→shipped, price unknown→stated, etc.), grep the WHOLE page entry for other statements of that same fact and make the minimal edits so nothing contradicts the new block. A page that answers one way in the block and another way in its FAQ fails its reader and the audit.

Only the answering block is touched. Page slug, route, section count, heading order, every other section, the CTA, and the FAQ block (except the swept fact) stay byte-identical. Never delete a section. Never edit a DEFEND page here.

## Mechanics

### The rewrite / append
- Replace ONLY the prose inside the one target block, in place, in the page's source. Heading stays; position stays; everything else stays byte-identical. An APPEND goes after the last body section (before any FAQ block), one section, answering the query completely.
- Length: whatever delivering the answer takes — the rewrite may be shorter than the filler it replaces, but the page's total information content must go UP, never down (Phase 3 checks this).

## Formatting hazards (all mandatory)
- **Apostrophes:** escape (`\'`) or double-quote every apostrophe inside single-quoted generated strings — one unescaped apostrophe fails the whole build and every deploy after it.
- **Byline:** never in body prose — it renders from the header + JSON-LD.
- **First-mention links:** first mention of any external company/product/model links to its official site UNLESS the project's auto-link registry covers it (layer3: `ENTITY_LINKS` in `src/utils/sectionContent.tsx` — CHECK the registry, never assume). Recurring new entity → note "registry candidate" in the digest; hand-link for now. Never hand-write a referral URL.
- **Inline CTA:** the site's standard CTA component below the first body section stays exactly where it is.

## Build gate (before Phase 3)
Typecheck AND full `next build` (or the repo's build command) — **Node 20** (`export PATH="/opt/homebrew/opt/node@20/bin:$PATH"` locally; cloud images default correctly). tsc alone is insufficient (undefined-serialization + apostrophe hazards only surface in the build). Build failure → fix mechanically if trivial (an escape, a missing comma); otherwise REVERT the offending page's edits entirely, log DROPPED ("build revert"), continue with the rest.

## Output
The edited working tree + per-page change manifest (files touched, sections rewritten/appended with before/after word counts, links added with targets, tools built, metadata diffs) → `phase-3-audit-publish.md`. **No commit yet.**


## Content standard
> **‼️ HARD SEQUENCING RULE — do not skip.** Do NOT treat this phase as complete, and do NOT show, serve, publish, or hand off anything you write here, until the Phase 3 audit has run on THIS exact output and PASSED. Any rewrite (including fixing an audit finding) voids a prior pass and requires re-auditing. See the PHASE 4 IS NOT OPTIONAL rule at the top of `.claude/commands/_content-standard.md`.


> **HOW TO LOAD (MANDATORY — this is the only sanctioned way).** Run:
> `bash .claude/tools/load-standards.sh "<routine-name>" "<this-phase>"`
> and treat its ENTIRE output as the standard. The script prints `_content-standard.md`, `_anti-ai-language.md`, and `_experience.md` in full and appends the load receipt to `reports/standards-ledger.jsonl` in the same action — reading and proving-you-read are one step, so never open the files another way. `git add reports/standards-ledger.jsonl` with the run. If the script or any file is missing, STOP and report it.

**Load `.claude/commands/_content-standard.md` and apply it IN FULL. **Start with its `## PREFLIGHT` section** — it lists the twelve failure modes that most often reach the audit, arranged by the moment they happen, with wrong/right pairs.** It is the single source of truth for the medium gate, SEO requirements and required page elements, depth floors, the quality and sourcing bar, readability, voice and register, comparison, linking, the proprietary anchor, and the neutrality rule. There is no cherry-picking and no substituting your own standard.

**Also load `.claude/commands/_experience.md`.** It defines who "we" are on this site and is the ONLY source a first-person experience claim may draw on.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **WRITER** section in full. It outranks the content standard on any conflict.

If any of those three files is missing, or `_experience.md` has an empty `## DOMAIN` section, **STOP and report it** — never proceed from memory. If `.claude/commands/_content-standard.local.md` exists in this repo, its sections override the same-named sections of the standard; see PRECEDENCE at the top of the standard.

