---
description: From a free-form input brief (text / image / chart / news article / random thought) → SEMRUSH-validate the demand → build the content chart → execute it through ordered, gated phases → push. Self-contained and portable; auto-discovers project facts.
argument-hint: "[optional path to an existing chart .md — skips brief-building]"
---

# /mindmap-pass — input brief → SEMRUSH validation → content chart → gated execution → push

> **‼️ RUN-WIDE RULE — READ FIRST.** This command runs autonomously end-to-end. There is **EXACTLY ONE** point where you stop and wait for the human: the **Phase 0 manifest approval**. At EVERY other phase boundary — including Phase 8 → Phase 9 (push) — you **auto-continue in the same turn without asking**. The reviewer gates between phases are automatic adversarial subagents — NOT human checkpoints. Never print "Want me to proceed?", "Should I continue?", or "Next: Phase X" as a question anywhere except that one stop. If you find yourself about to ask the user whether to continue and you are not at the Phase 0 manifest gate, the answer is: don't ask — keep going.

This command is the sibling of `/seo-gsc-pass`. It runs the **same execution engine** (build a chart → human-gate it → create/enrich content → adversarial audit → sitemap → IndexNow → 200-verify → push), but the **input is different**: instead of 5 GSC keyword screenshots, the input is **whatever the user hands you about what they want added to the site** — free text, an image, a chart/data screenshot, a pasted news article or link, or a half-formed idea. Step 1 interprets that brief, **validates and expands the demand through the keyword demand ladder (the ladder picks the best usable provider per field (volume: ahrefs > dataforseo > semrush; kd: ahrefs > semrush > dataforseo), then public-source estimate; see `.claude/commands/_keyword-demand-ladder.md`)**, and produces the identical machine-readable chart the rest of the phases consume.

This file is only the orchestrator: it owns **ordering, gates, and rules**. The work for each step lives in its instruction file under `.claude/commands/mindmap-pass/` — read and follow it when you reach that step. Do not restate or improvise step instructions here; the instruction file is the single source of truth.

## ► STEP 1 (ALWAYS FIRST): Build the chart from the user's input brief

**The very first thing you do is build the chart.** Follow `.claude/commands/mindmap-pass/phase-build-brief.md` verbatim — it contains the full interpret-brief → SEMRUSH-validate → chart-generation prompt. Chart-building analyzes the brief through **three mandatory lenses**: **Lens 1 — direct intent** shapes what the user *explicitly* asked to add into validated rows (each SEMRUSH-checked for real volume/difficulty/competition); **Lens 2 — adjacent-demand discovery is a core tenet** that expands around the brief's seeds with SEMRUSH (`phrase_related` / `phrase_fullsearch` / `phrase_questions`) + the Autocomplete miner to surface real demand *clusters the user didn't name but that belong with their idea*, deciding per cluster whether each warrants new content, an enriched existing page, or a metadata update; and **Lens 3 — comparison / alternatives / pricing is a core tenet** that, for every primary entity the brief names or implies, systematically mines and SEMRUSH-validates `{entity} vs {rival}`, `{entity} alternatives`, and `{entity} pricing` bottom-funnel demand. All three lenses check git history, produce rows in the table, and the chart is SAVED to `reports/mindmap-pass/<TODAY>.md` (with a dedicated emerging-clusters block).

Run Step 1 UNLESS one of these is true:
- The user passed a chart path as an argument → skip building, use that chart.
- A chart for today already exists at `reports/mindmap-pass/<TODAY>.md` → skip building, use it (do not overwrite).
- No input brief was provided AND no chart exists → STOP and ask the user to paste the text / attach the image / drop the news article or link describing what they want added (do not invent a brief).

Once the chart file exists, continue to Phase 0, which loads it, discovers project facts, and presents the manifest gate. **Do not skip ahead to any edit phase until the chart is built/loaded and the manifest is approved.**

The user does NOT inspect output. Every worker phase is gated by an **adversarial reviewer subagent** (Agent tool, `subagent_type: Explore`, read-only) that did NOT do the work and must pass the phase's checklist before the next phase begins.

## Execution graph (ordering)
Phases run by **dependency**, not a single straight line. Independent work runs in parallel; dependent work waits.

```
STEP 1 — BUILD CHART from the input brief (interpret → SEMRUSH-validate → cluster)  →  saves reports/mindmap-pass/<TODAY>.md
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
            Phase 8 — SUMMARY  (informational; auto-continues to Phase 9)
                     ▼
            Phase 9 — commit + deliver + 200-verify + IndexNow submit (last; runs automatically; pushes, verifies each URL is live (HTTP 200), then pings IndexNow with live URLs only)
```

- **Track A and Track B run in parallel.** Track A only creates new files; Track B only edits existing files — disjoint file sets, so they cannot collide.
- **Track B order** (1 → 2 → 5). Phase 1 is **advisory-only** (detects/flags cannibalization, edits nothing). Phases 2 and 5 both edit existing pages and may touch the same file, so never run those two at once — that would cause lost edits.
- **Phase 6 waits for both tracks**: it links *to* the new pages (needs Track A done) and it edits existing pages (must not collide with Track B).
- **Phase 7 waits for everything before it** (needs every final URL + lastmod). It only *prepares* the IndexNow URL list — the actual IndexNow POST is deferred to Phase 9, after push + deploy + 200-verify, so search engines are only pinged with URLs that are already live (never not-yet-deployed 404s).
- **Phase 8 is informational.** Print the summary table, then auto-continue to Phase 9 in the same turn — no approval, no stop.
- **Phase 9 is always last** and runs automatically after Phase 8. It pushes, then **fetches every created/changed URL and confirms HTTP 200** before submitting only the live URLs to IndexNow.
- A phase may start only once **every phase it depends on has PASSED its gate.** Within a track, that's the previous phase; for Phase 6/7/8/9, that's all upstream phases shown above.

## Non-negotiable global rules
1. **Dependency ordering (above).** Never start a phase until every phase it depends on has PASSED its gate. Never run two existing-page-editing phases (2, 5, 6) at the same time. (Phase 1 is advisory-only — it edits nothing — so it carries no collision risk.)
2. **Classify by intent, not literal string.** Map each chart row to one bucket: consolidation (now **advisory/flag-only** — Phase 1 never executes it) / metadata / new-content / body / internal-links. Ambiguous rows → "Ambiguous / skipped"; never guess or silently drop.
2a. **Adjacent-demand discovery is a CORE TENET — never skip it.** Chart-building must run ALL THREE lenses (see Step 1): direct-intent shaping of what the user asked for AND SEMRUSH-driven discovery of the demand clusters *around* the brief. Lens 2 reads the demand space around the user's seeds, clusters it by theme/intent/modifier, finds clusters pulling real SEMRUSH/Autocomplete/news demand that no page is the dedicated answer for, and decides the right lever PER CLUSTER — `create new content` (no good home), `update existing body text` (right page, missing the angle), or `update existing metadata` (covered + ranking, wrong framing); two pages competing for one cluster is flagged to Phase 1. These cluster-driven rows are first-class chart rows and the primary engine for net-new content. A run that produced only the literal terms the user typed, with no SEMRUSH-driven adjacent clusters, has failed this rule. The detected clusters are surfaced in the Phase 0 manifest so the user sees the discovered demand every run.
2b. **Comparison / Alternatives / Pricing coverage is a CORE TENET — never skip it (Lens 3).** For every primary entity the brief names or implies (product, tool, vendor, model, platform, service), chart-building must systematically mine and SEMRUSH-validate the three bottom-funnel, high-commercial-intent formats: **`{entity} vs {rival}` comparisons**, **`{entity} alternatives`**, and **`{entity} pricing / cost / worth-it`** — surfacing only real, demand-backed rivals/phrases (never invented matchups or fabricated prices), deduped against shipped work like any other row. vs/alternatives rows use `format: comparison table/database`; pricing rows use `comparison table/database` (multi-plan/vendor) or `article`. Each must appear in BOTH the main table and the emerging-clusters block, and must stay objective (the business is never the auto-winner) while honoring the repo's affiliate/referral wiring. A pass that ships topical/how-to rows but no vs/alternatives/pricing coverage for the brief's comparable entities has failed this rule. (Genuinely no comparable entity in the brief → note it under exclusions; do not force empty rows.)
2c. **New AI model launch → the Tier 0 Launch Core is MANDATORY (CORE TENET, conditional).** This rule applies **only when BOTH** are true: (i) this repo publishes AI-model / AI-tool content, and (ii) the brief is — or the lenses surfaced — a **new model release** the site has no page family for. For every other repo on this fleet and every non-launch brief, skip this rule outright; it costs nothing. When it does apply, chart-building must emit a `create new content` row for each **missing** member of the Tier 0 Launch Core, slugged from the model name (`Claude Opus 5` → `claude-opus-5`): `{model}-explained`, `{model}-pricing`, `{model}-limits`, `{model}-review`, `{model}-benchmarks`, `how-to-use-{model}`, `{model}-alternatives`, and `is-{model}-worth-it` (flagship releases only) — plus **three DISTINCT comparison kinds**, which generic Lens-3 `{entity} vs {rival}` mining does NOT cover on its own: **(1) same-line predecessor** `{model}-vs-{prev}` — the prior generation of the SAME product line, the "is the upgrade worth it" query, never a sibling and never a rival; **(2) cross-vendor flagship** `{model}-vs-{rival}` — another vendor's current flagship; **(3) same-vendor different-line sibling** `{model}-vs-{sibling}` (e.g. Claude Opus 5 vs Claude Mythos 5) — a *routing* question ("which of theirs do I use"), not an upgrade question. Then access rows (`{model}-api-pricing` where the vendor ships an API, `is-{model}-free` where a free/trial tier exists) and the launch verticals (`{model}-for-coding`, `-for-writing`, `-for-education`, `-for-research`, `-for-data-analysis`). **These rows are exempt from the thin-volume filter.** A model released this week has no SEMRUSH history, so missing volume is *expected* and is NEVER grounds to drop a Tier 0 row — label it `demand inferred — launch, no tool volume yet`, cite the launch as the signal, and sort it above every other row in the chart. Only genuine dedup (that exact page already shipped) removes one; record those under exclusions. **Never fabricate a price, rate limit, context window, or benchmark score** — copy the vendor's published page or omit the number and tell the reader to verify, because these change without notice. If `docs/model-launch-page-family.md` exists in this repo, follow it as the source of truth (it supersedes this list); otherwise apply the list above verbatim.
3. **Stage, don't commit, until Phase 9.** Each phase `git add`s its work; only Phase 9 commits/pushes. The pass stays atomic until the end.
4. **Reviewer authority + remediation ladder.** On rejection, fix at the cheapest rung that can fix it — see `.claude/commands/_remediation-ladder.md`, which is mandatory and governs every gate in this workflow: mechanical lint → reviewer-supplied FIX-IN-PLACE applied without a writer round-trip → REWORK by the writer for that page only. Only a REWORK counts as an attempt. **Max 2 rework attempts per PAGE**; a page that fails its 2nd rework is dropped from the run and reported under "Ambiguous / skipped", and the run continues with the pages that passed. Pages that already passed are never re-audited because a sibling was fixed. STOP the whole command only when every page is dropped, or a rung cannot run at all.
5. **Verify targets exist** before acting; otherwise flag under "Ambiguous / skipped."
6. **No invented data** — no fabricated volumes, positions, difficulty, backlinks, or stats. SEMRUSH figures are real or the row is labeled `no tool volume` / `demand inferred — no tool volume yet` with its signal cited.
6a. **Update & add — NEVER regenerate or delete. This is a hard rule and a quality safeguard.** Existing pages are improved by **targeted, in-place edits** (precise `Edit` operations) that add or change only what a chart row calls for. **Never** rewrite, overwrite, or "rebuild" a whole existing page, and **never** run a script/generator that regenerates page content wholesale. Preserve all existing body copy, sections, schema, and internal links not named by the chart. Consolidation is **not executed** by this workflow — Phase 1 only *detects and flags* cannibalization for a human; it writes no canonical, 301, or page edit. New content (Phase 3) only creates **net-new** routes — it never touches or replaces an existing page. If acting on a row would require regenerating or deleting a page, STOP and flag it instead.
7. **Report after every phase, then AUTO-CONTINUE. Do not ask the user for permission to proceed.** There is EXACTLY ONE human stop in the entire run — nowhere else:
   - **Stop 1 — end of Phase 0:** print the chart manifest, wait for approval before starting Phase 1.
   At every other phase boundary (1→2, 2→5, 3→4, 4→6, 5→6, 6→7, 7→8, **and 8→9 push**), immediately begin the next phase. The reviewer gates between phases are AUTOMATIC adversarial subagents, not human gates — passing one means proceed on your own. **Never** print "Want me to proceed?", "Should I continue?", or any equivalent at a non-stop boundary. The only time you wait for the human is Stop 1.

## Phase map — every phase is its own file; READ that file when you reach the phase
Each phase's full instructions + reviewer checklist live in its own file. When you reach a phase, **read that file and follow it exactly.** No phase instructions are inline in this orchestrator — this table is the only index.

| Phase | Instruction file (read this when you reach the phase) | Gate |
|---|---|---|
| STEP 1 — Build chart from the input brief | `.claude/commands/mindmap-pass/phase-build-brief.md` | **Duplicate-suppression gate** (adversarial reviewer drops already-shipped rows) + Phase 0 manifest gate |
| 0 — Load chart + discover + manifest | `.claude/commands/mindmap-pass/phase-0-discover.md` | **HARD HUMAN GATE** — manifest approval |
| 1 — Cannibalization detection (**advisory only**, no edits) | `.claude/commands/mindmap-pass/phase-1-consolidation.md` | reviewer checklist in file |
| 2 — Metadata fixes | `.claude/commands/mindmap-pass/phase-2-metadata.md` | reviewer checklist in file |
| 3 — New content | `.claude/commands/mindmap-pass/phase-3-new-content.md` | gated by Phase 4 |
| 4 — New-content audit | `.claude/commands/mindmap-pass/phase-4-audit.md` | this IS the gate for Phase 3 |
| 5 — Body text | `.claude/commands/mindmap-pass/phase-5-body.md` | reviewer checklist in file |
| 6 — Internal linking | `.claude/commands/mindmap-pass/phase-6-internal-linking.md` | reviewer checklist in file |
| 7 — Sitemap + IndexNow **prep** (no submit) | `.claude/commands/mindmap-pass/phase-7-sitemap-indexnow.md` | reviewer checklist in file |
| 8 — Summary (informational) | `.claude/commands/mindmap-pass/phase-8-summary.md` | none — auto-continues to Phase 9 |
| 9 — Commit + deliver + 200-verify + IndexNow submit (live URLs) | `.claude/commands/mindmap-pass/phase-9-commit-deliver.md` | reviewer checklist in file |

## Phase Summary template (print after every phase, then immediately continue)
```
### Phase <n> — <name> — <PASS | FAIL | ESCALATED>
- Rows actioned: <n>   Files touched: <list>
- Reviewer verdict: <pass / rejected-then-fixed / hard-fail>
- Ambiguous / skipped: <rows + why, or "none">
- Continuing to Phase <n+1>...   ← then DO it; do not stop or ask
```
The "Continuing to Phase <n+1>" line is a statement of fact, NOT a question. After printing it, start the next phase in the same turn. The only exception is Stop 1 (Phase 0 manifest), where the line instead reads "Waiting for your approval before starting Phase 1." Phase 8 → Phase 9 is NOT an exception — print the summary and continue straight to the push.

## Final report (after Phase 9)
Totals by bucket, files created/modified, **the interpreted brief + the adjacent-demand clusters SEMRUSH surfaced and how each was actioned (new content / enriched page / metadata / flagged)**, consolidation losers, **Live verification (each created/changed URL → 200 OK or FAILED)**, IndexNow status, commit SHA / PR URL, and every "Ambiguous / skipped" row for the user to resolve manually.

**The report MUST end with a `🔗 New pages` section**: a clickable markdown link (page title as text, full absolute `https://` URL as target) for EVERY newly created page that verified 200, so the user can open each page directly from the chat. Enriched existing pages get a separate `Updated pages` link list; failed/reverted pages a separate `⚠️ Not live` list. Nothing comes after this section. (Details in `phase-9-commit-deliver.md` step 8.)

## IndexNow Fallback Key (workflow-wide)

If any phase in this workflow hits an IndexNow error — the site's `public/<32-hex>.txt` challenge file is missing, the key can't be discovered, or the IndexNow API returns a key-verification error (403/422) — **fall back to this project-wide key**:

- **env var name:** `INDEXNOW_KEY`
- **key value (default):** `dc557f6bfced447aa1a71771d8a0d24a`

When falling back:
1. Create `public/dc557f6bfced447aa1a71771d8a0d24a.txt` with the content `dc557f6bfced447aa1a71771d8a0d24a` (filename = key = content) so search engines can verify.
2. Commit + push it as part of the run (before the IndexNow POST fires) so the challenge file is live.
3. After the deploy is verified, retry the IndexNow POST using this key.
4. If retry still fails, note the HTTP status in the final report but do NOT block the rest of the run.

This applies to **every phase that discovers or submits to IndexNow** in this workflow — Phase 0 (discovery), any prep phase that stages the IndexNow URL list, and the final submission phase. Prefer the env var if set; otherwise use the hard-coded default above.
