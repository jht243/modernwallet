
<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 0 — Discover project facts + load chart

<!-- mindmap-visible-checks-v1 -->
**Approval chart: completed preparation only.** Follow `_workflow-checkpoints.md`, “Approval chart — completed preparation only.” Finish all applicable instruction reading, research, duplicate review, testing eligibility/evidence decisions, supported takeaway/attribution briefs and internal-link/technical/publication planning BEFORE showing the chart. Show exactly one **Preparation check** row: `✅ Passed` with a link to the complete readiness evidence. Keep the full read/application and per-page checklist in that linked report. On `❌ Failed`, show only the specific failures and fixes and block approval; do not expand passed items. Unfinished preparation blocks the ready approval chart. Keep the full action table and Phases 1–9 as the future execution plan, including writing, independent content audit, internal-link edits, sitemap and publication. Do not show pending cells or claim those execution steps already happened. Every new-page action must also have a complete, page-specific **New-page brief** shown inline in the saved chart AND on-screen approval output: identity, validated keyword/SERP evidence, existing-page/duplicate rationale, reader question and answer placement, concrete outline, inspected sources and contribution, testing/review decision, takeaway, inbound/outbound link placements, and technical/measurement scope. A title/URL row or link to a separate file is insufficient. Missing/mismatched briefs block the chart; never shorten them out. Approval remains the sole existing human gate.
<!-- /mindmap-visible-checks-v1 -->


<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Before presenting the manifest, read available `reports/content-evidence.jsonl` outcomes under `_decision-evidence.md`, even when reusing an existing chart. Use them to explain proposed priorities within the requested scope; do not silently expand or replace an approved chart.

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->

Auto-discover every project fact by inspecting the repo. Hardcode nothing; print what you find.

- **BASE_URL** — from sitemap `<loc>`, the canonical logic, or JsonLd builders.
- **Framework + deploy mode** — e.g. Next.js static export vs server. Static export = **no server-side 301s**; consolidation must use canonical, never `redirects()`.
- **Canonical mechanism** — where `<link rel="canonical">` is emitted (often a shared Layout/Head). Note whether it's auto self-referential and whether a prop overrides it. Note any auto title-branding or description truncation.
- **IndexNow key** — find `public/<32-hex>.txt` (filename = key, content = same key). If absent, note IndexNow will be skipped + flagged.
- **Sitemaps** — list `public/sitemap*.xml`. Infer the route→file routing from existing `<loc>` entries. Note the `<url><loc>…</loc><lastmod>…</lastmod></url>` format.
- **Page template + schema builders** — the strongest existing pillar page and the reusable SEO components / JsonLd builders it uses. New pages mirror these.
- **Depth checker** — does `package.json` expose a `check-depth` script (i.e. `scripts/check_depth.mjs`, installed by `/new-site`)? Record yes/no. Phase 4's depth gate runs it when present and falls back to source-level word counting when absent. Do NOT create it here if it's missing — that is `/new-site`'s job at build time.
- **CONTENT STANDARD** — read 2–3 of the highest-quality existing pages and extract voice, depth, claims discipline, structure, and CTA style. This derived profile is the quality bar Phases 3 and 5 must match. Print a short summary.
- **Business / brand name** — the site's own brand name (from the `<title>` branding suffix, logo alt text, footer, `package.json`, schema.org `Organization`/`publisher`, or the About page). This is the `{BUSINESS_NAME}` value: Phase 3 substitutes it into the content-writing prompt wherever `{BUSINESS_NAME}` appears, so internal-link guidance names the right brand. If genuinely undiscoverable, fall back to the bare domain.
- **Push target** — default to the repo's default branch unless conventions say otherwise.

## Load the chart

By the time Phase 0 runs, the chart already exists — Step 1 in the orchestrator (`phase-build-brief.md`) built it from the user's input brief (SEMRUSH-validated), OR the user passed an existing chart path. Phase 0 only needs to LOAD the right file. Selection rules, in order:

1. **Argument path wins.** If the user passed a chart path as an argument, use that file exactly.
2. **Today's chart.** Else use `reports/mindmap-pass/<TODAY>.md` (`<TODAY>` = `date +%Y-%m-%d`) — this is the file Step 1 just wrote.
3. **Newest by filename date.** Else, list all `reports/mindmap-pass/*.md`, parse the `YYYY-MM-DD` from each filename, and pick the latest date **in the filename** (NOT by mtime — re-saving an old chart bumps mtime misleadingly).
4. **Ambiguity → STOP and ask.** Tie on filename date, or a filename that doesn't parse as `YYYY-MM-DD.md` → STOP and list candidates. Do not guess.
5. **Nothing to load → STOP.** If no chart exists, Step 1 should have built it. If it didn't (no input brief was provided), STOP: "No chart to load. Paste the text / attach the image / drop the news article or link describing what you want added, then re-run — or pass `/mindmap-pass <path/to/chart.md>`."

After selecting:
- Print the selected chart path AND the date in its filename, so the user can verify.
- **Staleness check:** parse `mindmap_pass_date:` from the chart's frontmatter. If it is more than **7 days old** vs today, STOP and warn: "Chart is N days old — the brief and its SEMRUSH validation may have moved on. Run anyway, or rebuild from a fresh brief?" Wait for confirmation. (Old SEMRUSH/news data ⇒ stale recommendations.)
- Require frontmatter `status: ready-for-execution`. If missing, STOP — chart isn't ready.
- Parse each row → `problem`, `solution`, `bucket`, `target`. Classify `bucket` by intent (consolidation / metadata / new-content / body / internal-links), not literal string. Ambiguous rows → "Ambiguous / skipped."
- **Parse the `## Emerging search patterns (clusters)` block** (Lens 2 output). For each cluster capture: theme, member queries, lever (bucket), and target. If the block says `No emerging clusters detected this run.`, record zero clusters. Cross-check: every actionable cluster MUST have a matching row in the main action table (same bucket + target). If a cluster has no matching table row — or a cluster claims `create new content`/`update existing body text`/`update existing metadata` but no corresponding row exists in that bucket — treat it as a chart defect and STOP (the chart is internally inconsistent; the cluster would be silently dropped from execution).

## Pre-execution manifest gate (HARD HUMAN GATE)

After parsing the chart, verify coverage results and the independent duplicate-review report for every applicable content target, including the recorded existing-page intent decision and checked commits. A `lookup:` entry alone never passes the Duplicate check. Complete every applicable preparation check and link its independent review evidence before presenting the approval chart. Then **STOP and print the manifest table, then wait for the user's explicit approval before starting Phase 1.** Never auto-proceed past this gate.

The manifest mirrors the format of the Phase 8 end-of-run summary so the user sees the same shape going in and coming out. One table, three columns: **Phase / Rows / Plan**. No redundant bucket column — each phase maps to exactly one bucket.

### Manifest format

| Phase                  | Rows | Plan |
|------------------------|------|------|
| 1 — Cannibalization detection (advisory) | {N}  | Per-row plan: "FLAG /page-a vs /page-b (same cluster) — recommend manual-consolidate / differentiate; **no edits, detection only**" |
| 2 — Metadata           | {N}  | Per-row plan: "Rewrite metaTitle+desc on: {target 1}, {target 2}, ..." (or "skipped — no rows") |
| 3 — New content        | {N}  | Per-row plan: "Create /route-a [article, page type + its depth floor — e.g. `comparison, ≥1,500 words`] — **answers "{reader_question}" in {answer_placement}**; create /route-b [calculator — user inputs X → outputs Y, BUILT in Phase 3c] — answers "{reader_question}"; ..." — name format for each row, the floor from the `phase-3-new-content.md` table, AND the chart's `reader_question` + `answer_placement` (cols 10–12) so the user approves the *question each page answers*, not just its topic |
| 4 — Audit              | —    | "Adversarial review of {N} new pages from Phase 3" |
| 5 — Body text          | {N}  | Per-row plan: "{target}: {section description} — answers "{reader_question}" at {answer_placement}; ..." |
| 6 — Internal linking   | {N} + inbound | Per-row plan: "Add inbound to {target 1}, {target 2}; reinforce {N} Phase-3 pages with ≥3 inbound each" |
| 7 — Sitemap + IndexNow | —    | "Add {N} routes; refresh lastmod on {N}; remove {N} consolidation losers; submit to IndexNow" |
| 8 — Summary            | —    | "Print run summary, then auto-continue to Phase 9 (no approval stop)" |
| 9 — Commit + deliver   | —    | "Single commit; push to {branch}; verify every affected live route and canonical; report failures; submit only verified live URLs to IndexNow after deployment; report SHA. Local-only scope excludes these publication actions and leaves deployment fields empty" |

### Emerging search patterns detected this run (print directly above the phase table)

This block makes the Lens 2 findings visible so the user reviews the *new search demand* — not just per-page tweaks — before approving. Source it from the chart's `## Emerging search patterns (clusters)` block:

| Cluster (theme) | Member queries | Why emerging | Lever | Target | Format |
|---|---|---|---|---|---|
| {theme} | {q1; q2; q3} | {coverage gap / intent mismatch / rising} | {create new content / update existing body text / update existing metadata / flag→Phase 1} | {route or file} | {article / calculator / quiz/assessment / template / etc. — or n/a if lever isn't create-new-content} |

- If zero clusters were detected, print exactly: **"⚠️ No emerging search patterns detected this run."** — and call it out explicitly, because emerging-pattern detection is a core tenet. A run with zero clusters AND only literal-intent rows is a signal the brief was too narrow or Lens 2's SEMRUSH expansion underperformed; tell the user so they can decide whether to re-run with a richer brief.
- Each cluster's lever here must reconcile with the phase counts below (a `create new content` cluster is counted in Phase 3's rows, a `update existing body text` cluster in Phase 5, etc.).

### Rules
- **Rows column**: integer count of chart rows in that bucket, or `—` if the phase has no chart rows (audit, sitemap, summary, commit).
- **Reader question is part of the approval.** Every Phase-3 and Phase-5 row in the Plan column carries the chart's `reader_question` **with its evidence tag** (`[PAA n/m <pattern>; ac n/m]`) and `answer_placement` (cols 10–12). A create/body row whose chart entry lacks them, or whose col 10 has no evidence tag, is an **Ambiguous / skipped** row (HARD STOP below) — the pass does not write a page whose question was never decided from evidence.
- **Print the question-evidence flags above the phase table**, as their own short list, so the user sees them before approving: every row tagged `[verb-only — no PAA, no completions]` (the question is a guess, not a measurement) and every row tagged with half or more off-topic PAA (`[PAA 3/6 off-topic: lawyer salary]` — Google is not confident the phrase means what we think). Zero flags → print `Question evidence: every content row's question is PAA- or completion-backed.`
- **Plan column**: must list the **actual targets and actions per row** — never just row numbers. Sourced from each chart row's `solution` / `target` columns, restated in one short clause per row, joined with semicolons. If a phase has zero rows, write `skipped — no rows` instead of leaving the cell blank.
- **Omit rows whose count is 0** unless it's one of the always-present phases (4, 7, 8, 9). For 0-row buckets, write `skipped — no rows` in the Plan column instead of dropping the row.
- **Ambiguous / skipped rows**: if any chart rows could not be classified, append a final row to the table:

  | — | Ambiguous / skipped | {N} | "**HARD STOP** — list each ambiguous row + why it could not be classified. User must reclassify or remove before approving." |

  If `N > 0` here, the gate cannot be approved until the user resolves them.

### After printing the table

Prompt the user with **exactly this question** (or its functional equivalent):
> "Manifest above ({N} actionable rows across {M} phases, including {C} emerging search-pattern clusters). Approve to start Phase 1, or pause to revise the chart?"

Acceptable approvals: "approve", "go", "start", "yes", or any clear affirmative.

If the user declines or wants to revise: STOP cleanly. Do not start Phase 1. Wait for them to either edit the chart and re-run, or give new direction.

Only after explicit approval, begin Phase 1.
