---
description: For the top GSC-traffic pages, generate the real follow-up questions a visitor asks next → score whether each is answered clearly on the page → dedup against the rest of the site → enrich pages in place with ONLY the high-value missing sections. Self-contained and portable; auto-discovers project facts. One human gate — approve the Gap Chart before any page is edited.
argument-hint: "[optional N = how many top pages to analyze this run; default 20]"
---

# /question-gap-pass — follow-up-question coverage gaps → score → dedup → enrich top pages in place

> **‼️ RUN-WIDE RULE — READ FIRST.** You trigger this manually. It runs autonomously through page selection, question generation, coverage scoring, and the Gap Chart — auto-continuing at every phase boundary without asking — but there is **EXACTLY ONE human gate: the Phase 3 Gap Chart**. Phase 3 prints the Gap Chart and **STOPS for your explicit approval of which sections to add**. Only after you approve does it enrich the pages, audit, stage, push, and ping IndexNow. The reviewer gate (Phase 5) is an automatic adversarial subagent, not a human checkpoint. Never print "Want me to proceed?" at any boundary **except** the Phase 3 gate. Also stop early on a **hard blocker** (no content system found, no GSC data source, or git not clean enough to stage safely — see below).

This file is only the orchestrator: it owns **ordering, gates, and rules**. The work for each step lives in its instruction file under `.claude/commands/question-gap-pass/` — read and follow it when you reach that step. Do not restate or improvise step instructions here; the instruction file is the single source of truth.

## What this command does

Your highest-traffic pages already rank — but a visitor who lands on one immediately has *follow-up* questions ("how much does it cost?", "how long does it take?", "what can go wrong?"). Every one those pages **don't** answer clearly is a bounce, a lost conversion, and a passage an answer engine can't extract. This command, for each top page, generates 20–30 of those realistic follow-up questions, checks the page for a clear answer to each, and **enriches the page in place** with only the high-value answers it's missing — without duplicating anything the site already says elsewhere.

`$ARGUMENTS` (optional): an integer = how many top pages to analyze this run. Default **20**. (e.g. `/question-gap-pass 10`.)

## Hard blockers (the only reasons to STOP and ask the human)
- **No content system discovered** in Phase 0 (can't find where/how the top pages' source files live, so in-place edits are impossible) → STOP, report what you looked for.
- **No GSC data source available** (no service account for the direct GSC API and no `gsc-pages` Ahrefs fallback) → STOP: "most visited pages" is the whole input. Tell the user to provide GSC service-account access, or pass `--pages "<url>,<url>,..."` to analyze an explicit list instead (then proceed without the GSC call).
- **Working tree not safe to publish onto** (uncommitted unrelated changes a commit/push would sweep up) → STOP, ask the user to stash/commit first.

Everything else degrades gracefully and keeps going.

## Execution graph (ordering)

```
Phase 0 — Discover project facts (content format, in-place edit path, GSC source, business name, publish path)
        ▼
Phase 1 — Select top N pages by GSC clicks → map each URL to its source file   (one GSC pull)
        ▼
Phase 2 — Generate 20–30 realistic follow-up questions per page                 (FREE, local only)
        ▼
Phase 3 — Coverage scoring: per question → Answered / Partial / Missing, + cross-page dedup → GAP CHART
        ▼   ‼️ HARD HUMAN GATE: approve which sections to add before ANY page is edited
Phase 4 — Enrich pages in place: add ONLY approved high-value missing sections (targeted Edits, never regenerate)
        ▼
Phase 5 — Adversarial audit (gates the enriched pages; max 2 reworks → revert that page's edit)
        ▼
Phase 6 — STAGE + push: sitemap lastmod bump + typecheck + commit + push + IndexNow (enriched URLs)
```

## Non-negotiable global rules
1. **Question generation is FREE and runs BEFORE any scoring spend.** Phase 2 invents the follow-up questions from each page's own topic/intent — zero external calls. The only paid/data call in the whole skill is the single Phase 1 GSC pull to pick the pages.
2. **Score against the ACTUAL page, never assume.** Phase 3 re-reads each page's rendered content/source and decides per question: `✅ answered clearly`, `🟡 partial` (mentioned but no real answer), or `🔴 missing`. No guessing from the title — open the content.
3. **Never duplicate an answer the site already gives elsewhere.** Phase 3 also checks every `missing` question against the REST of the site (other guides, pages, FAQs). If another page already answers it well, the action is **LINK, not write** — ensure an internal link to that page exists; do not re-answer it on this page. Duplicating answers across pages cannibalizes and dilutes; linking concentrates authority.
4. **Add ONLY high-value missing sections.** Not every gap is worth filling. A question earns a section only if it is (a) `🔴 missing` or a weak `🟡 partial`, (b) genuinely high-value (real decision/commercial/"what can go wrong" intent a visitor acts on — not trivia), and (c) not already answered elsewhere on the site. Everything else is recorded in the chart and skipped. Quality of additions over quantity, always.
5. **Enrich in place — never regenerate.** Phase 4 makes targeted `Edit` operations on the existing source file, adding the missing answer as a focused sub-section / FAQ entry. It NEVER overwrites the page wholesale, never invokes a generator/script that rebuilds the page, and leaves everything not called out byte-for-byte unchanged. This is the keyword-gap-pass body-enrichment discipline, verbatim.
6. **Verbatim content standard.** The writing standard for any new section (Phase 4) and the audit standard (Phase 5) MUST be the **exact, full text** of `.claude/commands/seo-gsc-pass/phase-3-new-content.md` and `.claude/commands/seo-gsc-pass/phase-4-audit.md` — copied character-for-character, never paraphrased. The only permitted change is swapping the literal "{BUSINESS_NAME}" token for the discovered business name. Per-page facts and the gap description are appended around the verbatim block, not spliced into it.
7. **No fabricated facts.** Prices, durations, certifications, stats, feature claims are accurate or hedged with a range pointing to the primary source — never invented to fill an answer.
8. **Reviewer authority + retry limit.** Phase 5 is an adversarial Explore subagent that did NOT write the sections. On rejection, rework using its notes. **Max 2 rework attempts per page.** If the 2nd retry still fails, **revert that page's edit** (restore byte-for-byte) and flag it in the summary — one bad enrichment never blocks the batch and never ships.
9. **Report after every phase, then AUTO-CONTINUE — except the one gate.** Print the phase summary, then immediately begin the next phase in the same turn. The ONLY planned stop is the **Phase 3 Gap Chart gate**. The only other stops are the hard blockers above.
10. **Cross-run memory.** Phase 3 writes pages already analyzed + the gaps it filled to `reports/question-gap-pass/cache.json`, so re-runs don't re-suggest sections a prior run already added.

## Phase map — every phase is its own file; READ that file when you reach the phase
Each phase's full instructions live in its own file. When you reach a phase, **read that file and follow it exactly.** No phase instructions are inline here — this table is the only index.

| Phase | Instruction file (read when you reach it) | Gate |
|---|---|---|
| 0 — Discover project facts | `.claude/commands/question-gap-pass/phase-0-discover.md` | hard-blocker checks |
| 1 — Select top pages (GSC clicks) | `.claude/commands/question-gap-pass/phase-1-select-pages.md` | one data pull |
| 2 — Generate follow-up questions | `.claude/commands/question-gap-pass/phase-2-questions.md` | — (FREE, local) |
| 3 — Coverage scoring + dedup → Gap Chart | `.claude/commands/question-gap-pass/phase-3-coverage.md` | **‼️ HARD HUMAN GATE** |
| 4 — Enrich pages in place | `.claude/commands/question-gap-pass/phase-4-enrich.md` | gated by Phase 5 |
| 5 — Adversarial audit | `.claude/commands/question-gap-pass/phase-5-audit.md` | this IS the gate for Phase 4 |
| 6 — Stage + push | `.claude/commands/question-gap-pass/phase-6-publish.md` | typecheck must pass |

## ‼️ MANDATORY OUTPUT — the Gap Chart (print at the end of Phase 3, before the gate)
Every run MUST produce this chart covering **every follow-up question generated** — including the ones already answered and the ones judged low-value. Never hide rows; the whole point is one auditable table of everything considered. One block per page, in page-rank order. Exact columns:

```
### <Page title> — <route>   (GSC: <clicks> clicks / <impressions> impr, last <window>)
| # | Follow-up question | Coverage | Answered elsewhere? | Value | Action |
```
- **Coverage** — `✅ clear` · `🟡 partial` · `🔴 missing`.
- **Answered elsewhere?** — `—` (no) · `<route>` (yes — name the page that already answers it).
- **Value** — `High` · `Med` · `Low` (decision/commercial/"what-can-go-wrong" intent ranks High; trivia ranks Low).
- **Action** — one of: `Add section` (missing/weak-partial + High value + not elsewhere) · `Strengthen` (partial + High, tighten in place) · `Link` (answered elsewhere → add internal link, do not re-answer) · `Skip — already clear` · `Skip — low value`.
- Per-page footer: `→ Add: <n> · Strengthen: <n> · Link: <n> · Skip: <n>`.
- Keep it terse — a chart, not prose.

## ‼️ THE ONE HUMAN GATE (end of Phase 3)
After printing the Gap Chart, STOP and ask the user to approve the set of `Add section` / `Strengthen` / `Link` actions (they may strike any row). Do **not** edit a single page until they reply. This is the only place editorial judgment is cheap — before any writing. On approval, run Phases 4→6 end-to-end with no further stops.

## Phase Summary template (print after every phase, then immediately continue — except the Phase 3 gate)
```
### Phase <n> — <name> — <PASS | FAIL | ESCALATED>
- Pages in / out: <n in> → <n out>
- Questions / actions: <generated G; add A, strengthen S, link L, skip K>
- API calls this phase: <n> (or "0 — local only")
- Files touched: <list, or "none">
- Continuing to Phase <n+1>...   ← then DO it; do not stop or ask   (OMIT this line at the Phase 3 gate)
```

## Final report (after Phase 6)
Pages analyzed, total follow-up questions generated, sections added vs strengthened vs linked vs skipped (with the page each touched), any enrichment reverted (failed audit), commit SHA, IndexNow status (enriched URLs), and the path to the updated `cache.json`.

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
