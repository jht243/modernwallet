---
description: From 5 GSC screenshots → build the SEO chart → execute it through ordered, gated phases → push. Self-contained and portable; auto-discovers project facts.
argument-hint: "[optional path to an existing chart .md — skips chart-building]"
---

# /seo-gsc-pass — GSC screenshots → SEO chart → gated execution → push

> **‼️ RUN-WIDE RULE — READ FIRST.** This command runs autonomously end-to-end. There are **EXACTLY TWO** points where you stop and wait for the human: **(1)** the Phase 0 manifest approval, and **(2)** the Phase 8 push approval. At EVERY other phase boundary you **auto-continue in the same turn without asking**. The reviewer gates between phases are automatic adversarial subagents — NOT human checkpoints. Never print "Want me to proceed?", "Should I continue?", or "Next: Phase X" as a question anywhere except those two stops. If you find yourself about to ask the user whether to continue and you are not at Stop 1 or Stop 2, the answer is: don't ask — keep going.

This command runs end-to-end from GSC screenshots. This file is only the orchestrator: it owns **ordering, gates, and rules**. The work for each step lives in its instruction file under `.claude/commands/seo-gsc-pass/` — read and follow it when you reach that step. Do not restate or improvise step instructions here; the instruction file is the single source of truth.

## ► STEP 1 (ALWAYS FIRST): Build the chart from the uploaded GSC screenshots

**The very first thing you do is build the chart.** Follow `.claude/commands/seo-gsc-pass/phase-build-chart.md` verbatim — it contains the full chart-generation prompt. Chart-building analyzes the GSC data through **two mandatory lenses**: **Lens 1** diagnoses each existing page/keyword (snippet vs. ranking vs. cannibalization vs. coverage gap), and **Lens 2 — emerging search-pattern & cluster detection — is a core tenet** that finds new query *themes* the site has no dedicated answer for and decides, per cluster, whether each warrants new content, an enriched existing page, or just a metadata update. Both lenses check git history, produce rows in the table, and the chart is SAVED to `reports/seo-pass/<TODAY>.md` (with a dedicated emerging-clusters block).

Run Step 1 UNLESS one of these is true:
- The user passed a chart path as an argument → skip building, use that chart.
- A chart for today already exists at `reports/seo-pass/<TODAY>.md` → skip building, use it (do not overwrite).
- No images were uploaded AND no chart exists → STOP and ask the user to upload 5 GSC screenshots (do not invent a chart).

Once the chart file exists, continue to Phase 0, which loads it, discovers project facts, and presents the manifest gate. **Do not skip ahead to any edit phase until the chart is built/loaded and the manifest is approved.**

The user does NOT inspect output. Every worker phase is gated by an **adversarial reviewer subagent** (Agent tool, `subagent_type: Explore`, read-only) that did NOT do the work and must pass the phase's checklist before the next phase begins.

## Execution graph (ordering)
Phases run by **dependency**, not a single straight line. Independent work runs in parallel; dependent work waits.

```
STEP 1 — BUILD CHART from the 5 GSC screenshots  →  saves reports/seo-pass/<TODAY>.md
        │   (skip only if a chart path arg was passed, or today's chart already exists)
        ▼
Phase 0 — load that chart, discover project facts, MANIFEST GATE (user approves)
        │  (blocks everything until chart loaded AND user approves the manifest)
        ├────────────────────────────┬───────────────────────────────
        ▼                            ▼
  TRACK A — new content        TRACK B — existing-page edits
  Phase 3  →  Phase 4          Phase 1 (advisory) → Phase 2 → Phase 5
  (4 gates 3)                  (Phase 1 flags only; 2 & 5 edit, sequential)
        └────────────┬───────────────┘
                     ▼
            Phase 6 — internal linking      (waits for BOTH tracks)
                     ▼
            Phase 7 — sitemap + IndexNow PREP (waits for 1,2,3,5,6; prepares URL list, does NOT submit)
                     ▼
            Phase 8 — SUMMARY + USER APPROVAL  (hard human gate)
                     ▼
            Phase 9 — commit + deliver + IndexNow submit (last; pushes, then pings IndexNow with live URLs only)
```

- **Track A and Track B run in parallel.** Track A only creates new files; Track B only edits existing files — disjoint file sets, so they cannot collide.
- **Track B order** (1 → 2 → 5). Phase 1 is **advisory-only** (detects/flags cannibalization, edits nothing). Phases 2 and 5 both edit existing pages and may touch the same file, so never run those two at once — that would cause lost edits.
- **Phase 6 waits for both tracks**: it links *to* the new pages (needs Track A done) and it edits existing pages (must not collide with Track B).
- **Phase 7 waits for everything before it** (needs every final URL + lastmod). It only *prepares* the IndexNow URL list — the actual IndexNow POST is deferred to Phase 9, after push + deploy, so search engines are only pinged with URLs that are already live (never not-yet-deployed 404s).
- **Phase 8 is a hard human gate.** Print the summary table; STOP; wait for the user's explicit approval. Never auto-proceed past Phase 8.
- **Phase 9 is always last** and only runs after the user approves Phase 8.
- A phase may start only once **every phase it depends on has PASSED its gate.** Within a track, that's the previous phase; for Phase 6/7/8/9, that's all upstream phases shown above.

## Non-negotiable global rules
1. **Dependency ordering (above).** Never start a phase until every phase it depends on has PASSED its gate. Never run two existing-page-editing phases (2, 5, 6) at the same time. (Phase 1 is advisory-only — it edits nothing — so it carries no collision risk.)
2. **Classify by intent, not literal string.** Map each chart row to one bucket: consolidation (now **advisory/flag-only** — Phase 1 never executes it) / metadata / new-content / body / internal-links. Ambiguous rows → "Ambiguous / skipped"; never guess or silently drop.
2a. **Emerging search-pattern detection is a CORE TENET — never skip it.** Chart-building must run BOTH lenses (see Step 1): per-page diagnosis AND emerging search-pattern/cluster analysis. Lens 2 reads the whole query set, clusters it by theme/intent/modifier, finds clusters pulling impressions that no page is the dedicated answer for, and decides the right lever PER CLUSTER — `create new content` (no good home), `update existing body text` (right page, missing the angle), or `update existing metadata` (covered + ranking, wrong framing); two pages competing for one cluster is flagged to Phase 1. These cluster-driven rows are first-class chart rows and the primary engine for net-new content. A run that produced only per-page metadata/CTR tweaks and no cluster analysis has failed this rule. The detected clusters are surfaced in the Phase 0 manifest so the user sees the new search patterns every run.
3. **Stage, don't commit, until Phase 9.** Each phase `git add`s its work; only Phase 9 commits/pushes. The pass stays atomic until the end.
4. **Reviewer authority + retry limit.** On rejection, re-do using the reviewer's notes. **Max 2 rework attempts per gate.** If the 2nd retry still fails, STOP the whole command, report the failing phase + outstanding notes, and wait.
5. **Verify targets exist** before acting; otherwise flag under "Ambiguous / skipped."
6. **No invented data** — no fabricated positions, backlinks, metrics, or stats.
6a. **Update & add — NEVER regenerate or delete. This is a hard rule and a quality safeguard.** Existing pages are improved by **targeted, in-place edits** (precise `Edit` operations) that add or change only what a chart row calls for. **Never** rewrite, overwrite, or "rebuild" a whole existing page, and **never** run a script/generator that regenerates page content wholesale — that is exactly how good pages get flattened into thin, templated content and how the site risks a sitewide quality demotion. Preserve all existing body copy, sections, schema, and internal links not named by the chart. Consolidation is **not executed** by this workflow — Phase 1 only *detects and flags* cannibalization for a human to act on; it writes no canonical, 301, or page edit. New content (Phase 3) only creates **net-new** routes — it never touches or replaces an existing page. If acting on a row would require regenerating or deleting a page, STOP and flag it instead.
7. **Report after every phase, then AUTO-CONTINUE. Do not ask the user for permission to proceed.** There are EXACTLY TWO human stops in the entire run — nowhere else:
   - **Stop 1 — end of Phase 0:** print the chart manifest, wait for approval before starting Phase 1.
   - **Stop 2 — Phase 8:** print the run summary, wait for approval before push.
   At every other phase boundary (1→2, 2→5, 3→4, 4→6, 5→6, 6→7, 7→8), immediately begin the next phase. The reviewer gates between phases are AUTOMATIC adversarial subagents, not human gates — passing one means proceed on your own. **Never** print "Want me to proceed?", "Should I continue?", or any equivalent at a non-stop boundary. The only time you wait for the human is Stop 1 and Stop 2.

## Phase map — every phase is its own file; READ that file when you reach the phase
Each phase's full instructions + reviewer checklist live in its own file. When you reach a phase, **read that file and follow it exactly.** No phase instructions are inline in this orchestrator — this table is the only index.

| Phase | Instruction file (read this when you reach the phase) | Gate |
|---|---|---|
| STEP 1 — Build chart from images | `.claude/commands/seo-gsc-pass/phase-build-chart.md` | **Duplicate-suppression gate** (adversarial reviewer drops already-shipped rows) + Phase 0 manifest gate |
| 0 — Load chart + discover + manifest | `.claude/commands/seo-gsc-pass/phase-0-discover.md` | **HARD HUMAN GATE** — manifest approval |
| 1 — Cannibalization detection (**advisory only**, no edits) | `.claude/commands/seo-gsc-pass/phase-1-consolidation.md` | reviewer checklist in file |
| 2 — Metadata fixes | `.claude/commands/seo-gsc-pass/phase-2-metadata.md` | reviewer checklist in file |
| 3 — New content | `.claude/commands/seo-gsc-pass/phase-3-new-content.md` | gated by Phase 4 |
| 4 — New-content audit | `.claude/commands/seo-gsc-pass/phase-4-audit.md` | this IS the gate for Phase 3 |
| 5 — Body text | `.claude/commands/seo-gsc-pass/phase-5-body.md` | reviewer checklist in file |
| 6 — Internal linking | `.claude/commands/seo-gsc-pass/phase-6-internal-linking.md` | reviewer checklist in file |
| 7 — Sitemap + IndexNow **prep** (no submit) | `.claude/commands/seo-gsc-pass/phase-7-sitemap-indexnow.md` | reviewer checklist in file |
| 8 — Summary + user approval | `.claude/commands/seo-gsc-pass/phase-8-summary.md` | **HARD HUMAN GATE** — push approval |
| 9 — Commit + deliver + IndexNow submit (live URLs) | `.claude/commands/seo-gsc-pass/phase-9-commit-deliver.md` | reviewer checklist in file |

## Phase Summary template (print after every phase, then immediately continue)
```
### Phase <n> — <name> — <PASS | FAIL | ESCALATED>
- Rows actioned: <n>   Files touched: <list>
- Reviewer verdict: <pass / rejected-then-fixed / hard-fail>
- Ambiguous / skipped: <rows + why, or "none">
- Continuing to Phase <n+1>...   ← then DO it; do not stop or ask
```
The "Continuing to Phase <n+1>" line is a statement of fact, NOT a question. After printing it, start the next phase in the same turn. The only exceptions are Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8), where the line instead reads "Waiting for your approval before <starting Phase 1 / pushing>."

## Final report (after Phase 9)
Totals by bucket, files created/modified, **emerging search-pattern clusters detected and how each was actioned (new content / enriched page / metadata / flagged)**, consolidation losers, IndexNow status, commit SHA / PR URL, and every "Ambiguous / skipped" row for the user to resolve manually.
