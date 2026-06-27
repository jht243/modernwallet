---
description: Mine the project's entities → generate "X vs Y" comparison ideas → dedup vs ALL existing content (before any keyword spend) → score on live SEO data → write/audit/publish the top pages. Self-contained and portable; auto-discovers project facts. Autonomous end-to-end.
argument-hint: "[optional N = how many pages to publish this run; default 5]"
---

# /comparison-content-creator — comparison-article ideation → dedup → live-data scoring → write → audit → publish

> **‼️ RUN-WIDE RULE — READ FIRST.** You trigger this manually. It runs autonomously through ideation, scoring, generation of new pages, **in-place enrichment of partially-covered pages**, audit, and **local staging** — auto-continuing at every phase boundary without asking — but there is **EXACTLY ONE human gate: the Phase 6 summary**. Phase 5 stages everything locally (commit to a working branch, NO push, NO IndexNow). Phase 6 prints the summary + the Candidate Chart and **STOPS for your explicit approval**; only after you approve does it push to main and ping IndexNow. The reviewer gate (Phase 4) is an automatic adversarial subagent, not a human checkpoint. Never print "Want me to proceed?" at any boundary **except** the Phase 6 gate. Also stop early on a **hard blocker** (no content system found, git not clean enough to stage safely, or zero connected SEO data sources — see below).

This file is only the orchestrator: it owns **ordering, gates, and rules**. The work for each step lives in its instruction file under `.claude/commands/comparison-content-creator/` — read and follow it when you reach that step. Do not restate or improvise step instructions here; the instruction file is the single source of truth.

## What this command does

SEO comparison ("X vs Y") content is a top driver of Google traffic AND LLM/answer-engine citations: it's commercial-intent, entity-dense, and easy to extract. This command mines the project's own entity universe, decides which head-to-heads will actually drive traffic/leads, and produces them — without ever duplicating content the site already has.

`$ARGUMENTS` (optional): an integer = how many comparison pages to publish this run. Default **5**. (e.g. `/comparison-content-creator 3`.)

## Hard blockers (the only reasons to STOP and ask the human)
- **No content system discovered** in Phase 0 (can't find where/how content is stored) → STOP, report what you looked for.
- **No SEO data source connected** (no Ahrefs MCP, no GSC MCP, no SEMrush export) → STOP: scoring would be guesswork. Tell the user to connect a data source or pass `--heuristic` to score on internal signals only (then proceed without external calls).
- **Working tree not safe to publish onto** (uncommitted unrelated changes that a commit/push would sweep up) → STOP, ask the user to stash/commit first.

Everything else degrades gracefully and keeps going.

## Execution graph (ordering)

```
Phase 0 — Discover project facts (content format, entities, publish path, connected SEO data)
        ▼
Phase 1 — Generate candidate "X vs Y [for segment]" pairs   (prune cross-run cache losers — FREE)
        ▼
Phase 1b — COVERAGE CHECK vs ALL existing content            (FREE, local only — anti-duplication)
        │   tags each NEW / PARTIAL / DUPLICATE; NEW → score+build, PARTIAL → enrich (3b), DUPLICATE → drop
        ▼   ‼️ HARD API-COST GATE: no keyword API call happens before this point
Phase 2 — Score the NEW survivors on live SEO data → rank → select top N
        ▼
Phase 3 — Generate the selected NEW pages   (REUSES seo-gsc-pass phase-3-new-content prompt verbatim)
Phase 3b — ENRICH existing pages for every PARTIAL (in-place spot-edits; REUSES keyword-gap-pass phase-5-body discipline; NO regeneration)
        ▼
Phase 4 — Adversarial audit (gates BOTH new + enriched pages; max 2 reworks → new→draft, enriched→revert)
        ▼
Phase 5 — STAGE: content store + inbound links + sitemap + typecheck + commit to working branch (NO push, NO IndexNow)
        ▼
Phase 6 — Summary + Candidate Chart → ‼️ HARD HUMAN GATE → on approval: push to main + IndexNow
```

## Non-negotiable global rules
1. **Dedup BEFORE keyword research — to cap API spend.** Phases 1 and 1b are FREE local operations (file parsing + string/embedding similarity, zero external calls) and run FIRST. **No Ahrefs / SEMrush / Brand-Radar call is ever made for a pair that is cached, already published, or already covered.** Only `NEW` survivors of Phase 1b reach Phase 2.
2. **Never duplicate or cannibalize existing content.** Phase 1b checks each suggestion against ALL content (comparisons, guides, verticals, landing pages, body text) three ways — exact/reverse-slug, entity-pair-covered-inside-a-page, and semantic keyword overlap. `DUPLICATE` is dropped; `PARTIAL` is **enriched in place by Phase 3b** (targeted spot-edits to the existing page), never turned into a new page.
2b. **PARTIAL means ENRICH, and enrichment actually runs.** A PARTIAL is not a to-do for later — Phase 3b executes it the same run. It adds the missing head-to-head treatment (sub-section + comparison table + verdict, optional FAQ) to the existing page via **targeted `Edit` operations only**, reusing the keyword-gap-pass body-enrichment discipline verbatim: *keep the same page, update it where needed, never recreate the page via script.* Everything not called out stays byte-for-byte unchanged.
3. **NET-NEW vs ENRICH are separate lanes.** Phase 3 creates brand-new routes — it must NEVER overwrite, regenerate, or replace an existing page. Editing existing pages is **Phase 3b's** job and is done only as in-place spot-edits (never a regeneration/script rebuild). If a pair selected as NEW turns out to map to an existing route, STOP that one in Phase 3 and route it to Phase 3b as an enrichment item instead.
3a. **Verbatim prompts — Phase 3 + Phase 4.** The generation instruction (Phase 3) and the audit instruction (Phase 4) MUST be passed to any worker/subagent as the **exact, full text** from `.claude/commands/seo-gsc-pass/phase-3-new-content.md` and `phase-4-audit.md` — copied character-for-character, never paraphrased, summarized, or "captured in substance." The only permitted change is swapping the literal "{BUSINESS_NAME}" token for the discovered business name. Per-pair facts, link targets, and output-schema instructions are appended around the verbatim block, not spliced into it.
4. **Data decides.** A pair ships only if connected SEO data (or, with `--heuristic`, internal signals) says it will draw traffic/leads. No invented volumes, KD, positions, or stats.
5. **Reviewer authority + retry limit.** Phase 4 is an adversarial Explore subagent that did NOT write the pages. On rejection, rework using its notes. **Max 2 rework attempts per page.** If the 2nd retry still fails, mark that page `draft: true` (noindex, excluded from sitemap/IndexNow) and flag it in the summary — one bad page never blocks the batch.
6. **Reuse when present, generic when not.** If Phase 0 finds project generator/audit/publish scripts (e.g. `scripts/model_radar/` helpers: `existing_slugs`, `insert_comparisons`, `add_inbound_link`, `add_sitemap`, `tsc_check`, `git_commit_push`, `indexnow`), reuse them. Otherwise operate directly on the project's content files in the discovered format.
7. **Match the discovered format exactly.** Emit pages in the project's own comparison shape (data-object array, MDX, CMS) with the same JsonLd/SEO scaffolding as existing pages. Hardcode nothing about any specific project.
8. **Report after every phase, then AUTO-CONTINUE — except the one gate.** Print the phase summary, then immediately begin the next phase in the same turn. The ONLY planned stop is the **Phase 6 human summary gate** (approve before push to main + IndexNow). The only other stops are the hard blockers above.
9. **Cross-run memory.** Phase 2 writes rejected/low-score pairs to `reports/comparison-content-creator/cache.json` so future runs explore fresh pairs and never re-score known losers.

## Phase map — every phase is its own file; READ that file when you reach the phase
Each phase's full instructions + reviewer checklist live in its own file. When you reach a phase, **read that file and follow it exactly.** No phase instructions are inline here — this table is the only index.

| Phase | Instruction file (read when you reach it) | Gate |
|---|---|---|
| 0 — Discover project facts | `.claude/commands/comparison-content-creator/phase-0-discover.md` | hard-blocker checks |
| 1 — Candidate generation | `.claude/commands/comparison-content-creator/phase-1-candidates.md` | — |
| 1b — Coverage check (anti-duplication) | `.claude/commands/comparison-content-creator/phase-1b-coverage-check.md` | **API-cost gate** — only NEW pass |
| 2 — Score on live data + select | `.claude/commands/comparison-content-creator/phase-2-score.md` | thresholds in file |
| 3 — Generate NEW pages | `.claude/commands/comparison-content-creator/phase-3-generate.md` | gated by Phase 4 |
| 3b — Enrich existing pages (PARTIAL) | `.claude/commands/comparison-content-creator/phase-3b-enrich.md` | gated by Phase 4 |
| 4 — Adversarial audit | `.claude/commands/comparison-content-creator/phase-4-audit.md` | this IS the gate for Phase 3 **and** 3b |
| 5 — Publish | `.claude/commands/comparison-content-creator/phase-5-publish.md` | typecheck/build must pass |
| 6 — Summary | `.claude/commands/comparison-content-creator/phase-6-summary.md` | — |

## ‼️ MANDATORY OUTPUT — the Candidate Chart (print EVERY run, no exceptions)
Every run MUST produce this single chart covering **ALL candidates** from Phase 1 — including the ones dropped as duplicate, flagged partial, or scored low. Never hide kicked-out or low-volume rows; the whole point is one auditable table of everything considered. Phase 1b fills the **Coverage** column; Phase 2 fills **Vol / KD / CPC / Verdict**. Print the assembled chart at the end of Phase 2 (and reprint it in the Phase 6 summary). Exact columns and order:

```
| # | Comparison | Vol | KD | CPC | Coverage | Verdict |
```
- **#** — rank by Verdict tier then Vol (highest first).
- **Comparison** — "X vs Y" (+ " for [segment]" if long-tail).
- **Vol / KD / CPC** — live SEMrush (or Ahrefs/GSC) numbers; `no data` if the source returned none; `—` if not queried because it was blocked pre-scoring.
- **Coverage** — `🟢 new` · `🟡 partial (existing-slug)` · `🔴 duplicate (existing-slug)`. Always name the conflicting slug for partial/duplicate.
- **Verdict** — one of: `Build — Tier 1` (high lead value) · `Build — Tier 2` (traffic/LLM) · `Tier 3` (easy/low) · `Enrich — partial` (spot-edited in Phase 3b this run) · `Drop — duplicate` · `Validate (Ahrefs/GSC)` for no-data long-tails.
- Footer legend line: `🟢 new (build) · 🟡 partial (enrich in-place, Phase 3b) · 🔴 duplicate (dropped) · default run builds Tier 1–2 and enriches every partial.`
- Keep it terse — a chart, not prose. Do not pad with paragraphs.

## Phase Summary template (print after every phase, then immediately continue)
```
### Phase <n> — <name> — <PASS | FAIL | ESCALATED>
- Candidates in / out: <n in> → <n out>   (new: <N>, enrich/partial → 3b: <P>, dropped: <cached X, duplicate Y>)
- API calls this phase: <n> (or "0 — local only")
- Files touched: <list, or "none">
- Continuing to Phase <n+1>...   ← then DO it; do not stop or ask
```
The "Continuing to Phase <n+1>" line is a statement of fact, NOT a question. After printing it, start the next phase in the same turn.

## Final report (after Phase 6)
Candidates evaluated, top scores with the live keyword data behind them, pages created vs drafted, **pages enriched in place (PARTIAL overlaps — what was added to each)**, plus any partial skipped ("already covered") or reverted (failed audit), commit SHA, IndexNow status (new + enriched URLs), and the path to the updated `cache.json`.
