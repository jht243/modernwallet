---
description: From a SEMRUSH competitor keyword-gap analysis → build the keyword chart → execute it through ordered, gated phases → push. Self-contained and portable; auto-discovers project facts.
argument-hint: "[optional path to an existing chart .md — skips the gap analysis]"
---

# /keyword-gap-pass — SEMRUSH keyword gap → keyword chart → gated execution → push

> **‼️ RUN-WIDE RULE — READ FIRST.** This command runs autonomously end-to-end. There are **EXACTLY TWO** points where you stop and wait for the human: **(1)** the Phase 0 manifest approval, and **(2)** the Phase 8 push approval. At EVERY other phase boundary you **auto-continue in the same turn without asking**. The reviewer gates between phases are automatic adversarial subagents — NOT human checkpoints. Never print "Want me to proceed?", "Should I continue?", or "Next: Phase X" as a question anywhere except those two stops. If you find yourself about to ask the user whether to continue and you are not at Stop 1 or Stop 2, the answer is: don't ask — keep going.

This command runs end-to-end from a competitor keyword-gap analysis. This file is only the orchestrator: it owns **ordering, gates, and rules**. The work for each step lives in its instruction file under `.claude/commands/keyword-gap-pass/` — read and follow it when you reach that step. Do not restate or improvise step instructions here; the instruction file is the single source of truth.

## ► STEP 1 (ALWAYS FIRST): Build the chart from a SEMRUSH keyword-gap analysis

**The very first thing you do is build the chart.** Follow `.claude/commands/keyword-gap-pass/phase-build-keywords.md` verbatim — it runs the SEMRUSH keyword-gap analysis (competitor organic keywords minus what we rank for minus what we already track), classifies each gap keyword into a bucket + target page, SAVES the chart to `reports/keyword-pass/<TODAY>.md`, AND appends every new gap keyword to the target-keyword document.

Run Step 1 UNLESS one of these is true:
- The user passed a chart path as an argument → skip building, use that chart.
- A chart for today already exists at `reports/keyword-pass/<TODAY>.md` → skip building, use it (do not overwrite).
- `SEMRUSH_API_KEY` is unset AND no chart exists → STOP and ask the user to set `SEMRUSH_API_KEY` in `.env` (do not invent a chart).

Once the chart file exists, continue to Phase 0, which loads it, discovers project facts, and presents the manifest gate. **Do not skip ahead to any edit phase until the chart is built/loaded and the manifest is approved.**

The user does NOT inspect output. Every worker phase is gated by an **adversarial reviewer subagent** (Agent tool, `subagent_type: Explore`, read-only) that did NOT do the work and must pass the phase's checklist before the next phase begins.

## Execution graph (ordering)
Phases run by **dependency**, not a single straight line. Independent work runs in parallel; dependent work waits.

```
STEP 1 — BUILD CHART from the SEMRUSH keyword gap  →  saves reports/keyword-pass/<TODAY>.md
        │   (also appends new gap keywords to target-keyword-inventory.md)
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
- **Bucket scope for `/keyword-gap-pass`.** A keyword-gap chart only emits three buckets — `update existing metadata`, `update existing body text`, `create new content`. So **Phase 1 (cannibalization detection) almost always has 0 rows** and is skipped; when it does run it is **advisory-only** (flags competing pages, executes nothing). Phase 6 still runs to add inbound internal links to any new Phase-3 pages even when the chart has no internal-link rows. Phases with 0 chart rows are reported as "skipped — no rows", never invented.

## Non-negotiable global rules
1. **Dependency ordering (above).** Never start a phase until every phase it depends on has PASSED its gate. Never run two existing-page-editing phases (2, 5, 6) at the same time. (Phase 1 is advisory-only — it edits nothing — so it carries no collision risk.)
2. **Classify by intent, not literal string.** Map each chart row to one bucket. A `/keyword-gap-pass` chart uses three: metadata / new-content / body. (The engine still understands consolidation / internal-links if a row ever needs them.) Ambiguous rows → "Ambiguous / skipped"; never guess or silently drop.
3. **Stage, don't commit, until Phase 9.** Each phase `git add`s its work; only Phase 9 commits/pushes. The pass stays atomic until the end.
4. **Reviewer authority + retry limit.** On rejection, re-do using the reviewer's notes. **Max 2 rework attempts per gate.** If the 2nd retry still fails, STOP the whole command, report the failing phase + outstanding notes, and wait.
5. **Verify targets exist** before acting; otherwise flag under "Ambiguous / skipped."
6. **No invented data** — no fabricated positions, backlinks, metrics, or stats.
6c. **Update & add — NEVER regenerate or delete. This is a hard rule and a quality safeguard.** Existing pages are improved by **targeted, in-place edits** (precise `Edit` operations) that add or change only what a chart row calls for. **Never** rewrite, overwrite, or "rebuild" a whole existing page, and **never** run a script/generator that regenerates page content wholesale — that is exactly how good pages get flattened into thin, templated content and how the site risks a sitewide quality demotion. Preserve all existing body copy, sections, schema, and internal links not named by the chart. New content (Phase 3) only creates **net-new** routes — it never touches or replaces an existing page. If acting on a row would require regenerating or deleting a page, STOP and flag it instead.
6a. **Use the SEMRUSH API moderately.** Credits cost money — one pull per domain/seed, batch lookups, tight competitor/seed sets, reuse cached results, and prefer free signals (web/codebase) for judgment calls. A good chart at modest cost beats exhaustive coverage. (Full discipline list in `phase-build-keywords.md`.)
6b. **Keyword chart = actionable only.** Never list "drop" / "not needed" / off-mission keywords as rows in the chart or per-keyword export; exclude them silently (a one-line count is fine). The per-keyword export (actionable keywords, "proposed action" language) is shown to the user BEFORE the manifest.
6d. **Include adjacent keywords — relevance is a tier, not a gate.** Keep keywords squarely in our niche (`core`) AND topics one step out that we could credibly own (`adjacent`); only genuinely off-mission/unwinnable keywords are dropped. "Adjacent rather than core" is never grounds to exclude. Each chart/export row carries a `tier` (`core` | `adjacent`) so the human weighs them on equal footing at the manifest gate. (Full tier policy in `phase-build-keywords.md`, Lens 1.)
7. **Report after every phase, then AUTO-CONTINUE. Do not ask the user for permission to proceed.** There are EXACTLY TWO human stops in the entire run — nowhere else:
   - **Stop 1 — end of Phase 0:** print the chart manifest, wait for approval before starting Phase 1.
   - **Stop 2 — Phase 8:** print the run summary, wait for approval before push.
   At every other phase boundary (1→2, 2→5, 3→4, 4→6, 5→6, 6→7, 7→8), immediately begin the next phase. The reviewer gates between phases are AUTOMATIC adversarial subagents, not human gates — passing one means proceed on your own. **Never** print "Want me to proceed?", "Should I continue?", or any equivalent at a non-stop boundary. The only time you wait for the human is Stop 1 and Stop 2.

## Phase map — every phase is its own file; READ that file when you reach the phase
Each phase's full instructions + reviewer checklist live in its own file. When you reach a phase, **read that file and follow it exactly.** No phase instructions are inline in this orchestrator — this table is the only index.

| Phase | Instruction file (read this when you reach the phase) | Gate |
|---|---|---|
| STEP 1 — Build chart from SEMRUSH keyword gap | `.claude/commands/keyword-gap-pass/phase-build-keywords.md` | **Duplicate-suppression gate** (adversarial reviewer drops already-shipped rows) + Phase 0 manifest gate |
| 0 — Load chart + discover + manifest | `.claude/commands/keyword-gap-pass/phase-0-discover.md` | **HARD HUMAN GATE** — manifest approval |
| 1 — Cannibalization detection (**advisory only**, no edits) | `.claude/commands/keyword-gap-pass/phase-1-consolidation.md` | reviewer checklist in file |
| 2 — Metadata fixes | `.claude/commands/keyword-gap-pass/phase-2-metadata.md` | reviewer checklist in file |
| 3 — New content | `.claude/commands/keyword-gap-pass/phase-3-new-content.md` | gated by Phase 4 |
| 4 — New-content audit | `.claude/commands/keyword-gap-pass/phase-4-audit.md` | this IS the gate for Phase 3 |
| 5 — Body text | `.claude/commands/keyword-gap-pass/phase-5-body.md` | reviewer checklist in file |
| 6 — Internal linking | `.claude/commands/keyword-gap-pass/phase-6-internal-linking.md` | reviewer checklist in file |
| 7 — Sitemap + IndexNow **prep** (no submit) | `.claude/commands/keyword-gap-pass/phase-7-sitemap-indexnow.md` | reviewer checklist in file |
| 8 — Summary + user approval | `.claude/commands/keyword-gap-pass/phase-8-summary.md` | **HARD HUMAN GATE** — push approval |
| 9 — Commit + deliver + IndexNow submit (live URLs) | `.claude/commands/keyword-gap-pass/phase-9-commit-deliver.md` | reviewer checklist in file |

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
Totals by bucket, files created/modified, consolidation losers, IndexNow status, commit SHA / PR URL, and every "Ambiguous / skipped" row for the user to resolve manually.
