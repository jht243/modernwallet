---
description: From GSC URL Inspection (true per-URL index status) → build the indexing-error report → execute fixes through ordered, gated phases → push. Self-contained and portable; auto-discovers project facts.
argument-hint: "[optional path to an existing report .md — skips the inspection sweep]"
---

# /indexing-issues-gsc-pass — GSC URL Inspection → indexing-error report → gated fixes → push

> **‼️ RUN-WIDE RULE — READ FIRST.** This command runs autonomously end-to-end. There are **EXACTLY TWO** points where you stop and wait for the human: **(1)** the Phase 0 manifest approval, and **(2)** the Phase 8 push approval. At EVERY other phase boundary you **auto-continue in the same turn without asking**. The reviewer gates between phases are automatic adversarial subagents — NOT human checkpoints. Never print "Want me to proceed?", "Should I continue?", or "Next: Phase X" as a question anywhere except those two stops. If you find yourself about to ask the user whether to continue and you are not at Stop 1 or Stop 2, the answer is: don't ask — keep going.

This command runs end-to-end from real Google Search Console indexing data. This file is only the orchestrator: it owns **ordering, gates, and rules**. The work for each step lives in its instruction file under `.claude/commands/indexing-issues-gsc-pass/` — read and follow it when you reach that step. Do not restate or improvise step instructions here; the instruction file is the single source of truth.

## ► STEP 1 (ALWAYS FIRST): Build the report from the URL Inspection sweep

**The very first thing you do is build the report.** Follow `.claude/commands/indexing-issues-gsc-pass/phase-build-report.md` verbatim — it authenticates to GSC and runs the URL Inspection API across the site's URLs (skipping pages already indexed in the prior sweep, and stopping after 200 non-indexed pages are found per pass — so it scales to large sites; any uninspected URLs are recorded as `deferred` for a later `--resume` pass), classifies each URL by its real `coverageState`, diagnoses the root cause against the codebase, and SAVES the report to `reports/indexing-pass/<TODAY>.md` (plus the raw `<TODAY>.inspection.json` and a per-URL `<TODAY>.urls.csv`).

Run Step 1 UNLESS one of these is true:
- The user passed a report path as an argument → skip the sweep, use that report.
- A report for today already exists at `reports/indexing-pass/<TODAY>.md` → skip the sweep, use it (do not overwrite).

If the sweep cannot authenticate (the API returns 403 on the first call), the service account is not a **Full/Owner** user of the GSC property → STOP and tell the user to add it in GSC → Settings → Users and permissions, then re-run. Do not fabricate an indexing report.

Once the report file exists, continue to Phase 0, which loads it, discovers project facts, and presents the manifest gate. **Do not skip ahead to any fix phase until the report is built/loaded and the manifest is approved.**

The user does NOT inspect output. Every worker phase is gated by an **adversarial reviewer subagent** (Agent tool, `subagent_type: Explore`, read-only) that did NOT do the work and must pass the phase's checklist before the next phase begins.

## Execution graph (ordering)
Phases run by **dependency**, not a single straight line. Independent work runs in parallel; dependent work waits.

```
STEP 1 — BUILD REPORT from the URL Inspection sweep  →  saves reports/indexing-pass/<TODAY>.md
        │   (skip only if a report path arg was passed, or today's report already exists)
        │   builds the already-shipped LEDGER (last ~30 commits) + diagnoses rows against it
        ▼
GATE A — adversarial duplicate / wrongful-drop review (read-only subagent; automatic)
        │   PASS criteria: 0 duplicates survive AND 0 wrongful "already-fixed" drops
        ▼
Phase 0 — load that report, discover project facts, MANIFEST GATE (user approves)
        │  (blocks everything until report loaded AND user approves the manifest)
        ├────────────────────────────┬───────────────────────────────
        ▼                            ▼
  TRACK A — content                TRACK B — technical / code edits
  Phase 4 (thin content)           Phase 1 → Phase 2 → Phase 3
  (creates/expands content)        (canonical → redirect/error → indexability)
        └────────────┬───────────────┘
                     ▼
            Phase 5 — Audit            (adversarial review of ALL fixes 1–4; waits for both tracks)
                     ▼
            Phase 6 — Internal linking (discovery boost; waits for 1–5)
                     ▼
            Phase 7 — Sitemap hygiene + PREPARE re-submit list  (waits for 1–6; no external calls)
                     ▼
            Phase 8 — SUMMARY + USER APPROVAL  (hard human gate)
                     ▼
            Phase 9 — commit + deliver + FIRE re-submissions  (last; only after user approves Phase 8)
```

- **Track A and Track B run in parallel.** Track A only expands/creates content (DB rows + content templates); Track B edits app code (`server.py`, `src/config.py`, base template canonical/robots logic) — keep their file sets disjoint, and if a fix would touch a file the other track owns, serialize it.
- **Track B is sequential inside itself** (1 → 2 → 3). All three may touch the same code files (`server.py`, `src/config.py`), so never run two at once — that would cause lost edits.
- **Phase 5 (Audit) waits for both tracks.** Technical indexing changes are the highest-risk edits in this workflow (a wrong canonical or 301 can de-index a live page), so a dedicated adversarial subagent re-verifies every change from Phases 1–4 before anything downstream runs.
- **Phase 6 waits for the audit** (it links *to* the pages that the inspection flagged as "Discovered/Crawled – currently not indexed" or orphaned, which must already be fixed).
- **Phase 7 waits for everything before it** (needs every final URL + status to decide what to add/remove from the sitemap and to prepare the re-submit list). It makes **no external calls** — the live IndexNow / Google Indexing submissions are deferred to Phase 9, after your approval.
- **Phase 8 is a hard human gate.** Print the summary table; STOP; wait for the user's explicit approval. Never auto-proceed past Phase 8.
- **Phase 9 is always last** and only runs after the user approves Phase 8.

## Non-negotiable global rules
1. **Dependency ordering (above).** Never start a phase until every phase it depends on has PASSED its gate. Never run two code-editing phases (1, 2, 3) at the same time.
2. **Classify by intent, not literal string.** Map each report row to one bucket: `fix canonical / duplicate` / `fix redirect / error page` / `unblock indexability` / `improve thin content` / `add internal links` / `sitemap hygiene`. Ambiguous rows → "Ambiguous / needs human"; never guess or silently drop.
2a. **Don't re-ship a landed fix.** Build-report Step D.1 scans the last 30 commits (and the working tree) for each proposed fix; any row whose fix already shipped is bucketed `already-fixed — awaiting recrawl` and is **excluded from the edit phases (1–4, 6) AND from Phase 7's `lastmod`/re-submit sets** — it is informational only (recorded so the fix isn't redone), and we simply wait for Google to recrawl. It gets NO `lastmod` bump and NO re-submission because the page did not change this run (re-stamping/re-pinging an unchanged URL erodes the `lastmod` signal and edges toward spam). The edit phases must re-confirm the guard and refuse to re-apply a shipped fix.
3. **Separate real errors from intentional exclusions.** Many GSC "exclusions" are correct (e.g. `Alternate page with proper canonical`, an intentional `noindex` on `/admin`, a deliberate redirect). These are NOT errors — record them as "working as intended" in the report's exclusions note and do NOT change them. Only act on genuine indexing defects.
4. **Stage, don't commit, until Phase 9.** Each phase `git add`s its work; only Phase 9 commits/pushes. The pass stays atomic until the end.
5. **Reviewer authority + retry limit.** On rejection, re-do using the reviewer's notes. **Max 2 rework attempts per gate.** If the 2nd retry still fails, STOP the whole command, report the failing phase + outstanding notes, and wait.
6. **Verify targets exist** before acting; otherwise flag under "Ambiguous / needs human."
7. **No invented data** — every report row traces to a real `coverageState` returned by the URL Inspection API in `<TODAY>.inspection.json`. Never fabricate an index status, canonical, or crawl date.
8. **Conservative on destructive technical fixes.** A backwards 301 or a wrong canonical is the single most destructive action here. Never redirect/canonicalize a higher-traffic URL into a lower one, never add `noindex` to a page that is or should be indexed, and never remove a `noindex`/robots rule that is intentional. When unsure, flag for the human — do not act.
8a. **PER-PAGE / PER-ROUTE ONLY — NO config-level or site-wide changes (applies to every code phase 1, 2, 3).** Every fix must be scoped to the exact URL(s)/route(s) flagged in the report. Do NOT edit base-URL/site-URL config, shared canonical or redirect helpers, global redirect/rewrite rules, or any setting/template logic that changes behavior for pages *not* in the report — a single such edit has site-wide blast radius (one wrong value can mis-canonicalize or de-index every page in one commit), which this automated pass must never do unsupervised. If the genuine root cause is site-wide, **flag it `ambiguous — needs human`** so a person makes that high-blast-radius change deliberately, outside this pass. A defect spanning N pages → N discrete per-page edits, never one shared change. Reviewers auto-REJECT any change that touches unaffected pages.
9. **Report after every phase, then AUTO-CONTINUE. Do not ask the user for permission to proceed.** There are EXACTLY TWO human stops in the entire run — nowhere else:
   - **Stop 1 — end of Phase 0:** print the report manifest, wait for approval before starting the fix phases.
   - **Stop 2 — Phase 8:** print the run summary, wait for approval before push.
   At every other phase boundary, immediately begin the next phase. The reviewer gates between phases are AUTOMATIC adversarial subagents, not human gates — passing one means proceed on your own. **Never** print "Want me to proceed?", "Should I continue?", or any equivalent at a non-stop boundary.

## Phase map — every phase is its own file; READ that file when you reach the phase
Each phase's full instructions + reviewer checklist live in its own file. When you reach a phase, **read that file and follow it exactly.** No phase instructions are inline in this orchestrator — this table is the only index.

| Phase | Instruction file (read this when you reach the phase) | Gate |
|---|---|---|
| STEP 1 — Build report from URL Inspection (+ already-shipped ledger) | `.claude/commands/indexing-issues-gsc-pass/phase-build-report.md` | **Gate A** — adversarial duplicate / wrongful-drop reviewer (in file, Step F) |
| 0 — Load report + discover + manifest | `.claude/commands/indexing-issues-gsc-pass/phase-0-discover.md` | **HARD HUMAN GATE** — manifest approval |
| 1 — Canonical / duplicate fixes | `.claude/commands/indexing-issues-gsc-pass/phase-1-canonical.md` | reviewer checklist in file |
| 2 — Redirect / error-page fixes | `.claude/commands/indexing-issues-gsc-pass/phase-2-redirect-error.md` | reviewer checklist in file |
| 3 — Indexability unblocks | `.claude/commands/indexing-issues-gsc-pass/phase-3-indexability.md` | reviewer checklist in file |
| 4 — Content (thin-page improvement + net-new pages) | `.claude/commands/indexing-issues-gsc-pass/phase-4-thin-content.md` | gated by Phase 5 |
| 5 — Audit (all fixes) | `.claude/commands/indexing-issues-gsc-pass/phase-5-audit.md` | this IS the consolidated gate for Phases 1–4 |
| 6 — Internal linking (≤3 visible per related module) | `.claude/commands/indexing-issues-gsc-pass/phase-6-internal-linking.md` | reviewer checklist in file |
| 7 — Sitemap hygiene + prepare re-submit list (no submission yet) | `.claude/commands/indexing-issues-gsc-pass/phase-7-sitemap-resubmit.md` | reviewer checklist in file |
| 8 — Summary + user approval | `.claude/commands/indexing-issues-gsc-pass/phase-8-summary.md` | **HARD HUMAN GATE** — approve commit + push + submit |
| 9 — Commit + deliver + fire re-submissions | `.claude/commands/indexing-issues-gsc-pass/phase-9-commit-deliver.md` | reviewer checklist in file |

## Phase Summary template (print after every phase, then immediately continue)
```
### Phase <n> — <name> — <PASS | FAIL | ESCALATED>
- URLs actioned: <n>   Files touched: <list>
- Reviewer verdict: <pass / rejected-then-fixed / hard-fail>
- Ambiguous / skipped: <rows + why, or "none">
- Continuing to Phase <n+1>...   ← then DO it; do not stop or ask
```
The "Continuing to Phase <n+1>" line is a statement of fact, NOT a question. After printing it, start the next phase in the same turn. The only exceptions are Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8), where the line instead reads "Waiting for your approval before <starting Phase 1 / pushing>."

## Final report (after Phase 9)
Totals by bucket, files created/modified, every redirect/canonical/status change made, sitemap adds/removes, IndexNow + Google Indexing re-submit status, commit SHA / PR URL, and every "Ambiguous / needs human" + "working as intended" row for the user to review. Remind the user that re-indexing is on Google's schedule (days–weeks) and that a future `/indexing-issues-gsc-pass` run (or `python scripts/gsc_url_inspection.py --verify <old> <new>`) will measure how many flagged URLs moved to "Submitted and indexed."
