# Phase 0 — Discover project facts + load chart

Auto-discover every project fact by inspecting the repo. Hardcode nothing; print what you find.

- **BASE_URL** — from sitemap `<loc>`, the canonical logic, or JsonLd builders.
- **Framework + deploy mode** — e.g. Next.js static export vs server. Static export = **no server-side 301s**; consolidation must use canonical, never `redirects()`.
- **Canonical mechanism** — where `<link rel="canonical">` is emitted (often a shared Layout/Head). Note whether it's auto self-referential and whether a prop overrides it. Note any auto title-branding or description truncation.
- **IndexNow key** — find `public/<32-hex>.txt` (filename = key, content = same key). If absent, note IndexNow will be skipped + flagged.
- **Sitemaps** — list `public/sitemap*.xml`. Infer the route→file routing from existing `<loc>` entries. Note the `<url><loc>…</loc><lastmod>…</lastmod></url>` format.
- **Page template + schema builders** — the strongest existing pillar page and the reusable SEO components / JsonLd builders it uses. New pages mirror these.
- **CONTENT STANDARD** — read 2–3 of the highest-quality existing pages and extract voice, depth, claims discipline, structure, and CTA style. This derived profile is the quality bar Phases 3 and 5 must match. Print a short summary.
- **Business / brand name** — the site's own brand name (from the `<title>` branding suffix, logo alt text, footer, `package.json`, schema.org `Organization`/`publisher`, or the About page). This is the `{BUSINESS_NAME}` value: Phase 3 substitutes it into the content-writing prompt wherever `{BUSINESS_NAME}` appears, so internal-link guidance names the right brand. If genuinely undiscoverable, fall back to the bare domain.
- **Push target** — default to the repo's default branch unless conventions say otherwise.

## Load the chart

By the time Phase 0 runs, the chart already exists — Step 1 in the orchestrator (`phase-build-keywords.md`) built it from the SEMRUSH keyword-gap analysis, OR the user passed an existing chart path. Phase 0 only needs to LOAD the right file. Selection rules, in order:

1. **Argument path wins.** If the user passed a chart path as an argument, use that file exactly.
2. **Today's chart.** Else use `reports/keyword-pass/<TODAY>.md` (`<TODAY>` = `date +%Y-%m-%d`) — this is the file Step 1 just wrote.
3. **Newest by filename date.** Else, list all `reports/keyword-pass/*.md`, parse the `YYYY-MM-DD` from each filename, and pick the latest date **in the filename** (NOT by mtime — re-saving an old chart bumps mtime misleadingly).
4. **Ambiguity → STOP and ask.** Tie on filename date, or a filename that doesn't parse as `YYYY-MM-DD.md` → STOP and list candidates. Do not guess.
5. **Nothing to load → STOP.** If no chart exists, Step 1 should have built it. If it didn't (e.g. `SEMRUSH_API_KEY` unset or the gap script failed), STOP: "No chart to load. Set `SEMRUSH_API_KEY` in `.env` and re-run, or pass `/keyword-gap-pass <path/to/chart.md>`."

After selecting:
- Print the selected chart path AND the date in its filename, so the user can verify.
- **Staleness check:** parse `keyword_pass_date:` from the chart's frontmatter. If it is more than **7 days old** vs today, STOP and warn: "Chart is N days old. Run anyway, or build a fresh one?" Wait for confirmation. (Stale gap data ⇒ stale recommendations.)
- Require frontmatter `status: ready-for-execution`. If missing, STOP — chart isn't ready.
- Parse each row → `problem`, `solution`, `bucket`, `target`. Classify `bucket` by intent (consolidation / metadata / new-content / body / internal-links), not literal string. Ambiguous rows → "Ambiguous / skipped."

## Pre-execution manifest gate (HARD HUMAN GATE)

**Precondition:** the build phase's per-keyword export (Step D2 — every keyword identified this run, including drops, in the keyword / proposed-action / target format) MUST already have been shown to the user. If it hasn't, show it before doing anything else — the manifest's phase-level view is not a substitute for the granular keyword list.

After parsing the chart, **STOP and print the manifest table, then wait for the user's explicit approval before starting Phase 1.** Never auto-proceed past this gate. Remember nothing has been executed yet — this is a plan of **proposed** actions, not work done.

The manifest mirrors the format of the Phase 8 end-of-run summary so the user sees the same shape going in and coming out. One table, three columns: **Phase / Rows / Plan**. No redundant bucket column — each phase maps to exactly one bucket.

### Manifest format

| Phase                  | Rows | Plan |
|------------------------|------|------|
| 1 — Cannibalization detection (advisory) | {N}  | Per-row plan: "FLAG /page-a vs /page-b (same cluster) — recommend manual-consolidate / differentiate; **no edits, detection only**" |
| 2 — Metadata           | {N}  | Per-row plan: "Rewrite metaTitle+desc on: {target 1}, {target 2}, ..." (or "skipped — no rows") |
| 3 — New content        | {N}  | Per-row plan: "Create /route-a (≥1,200 words); create /route-b (≥1,200 words)" |
| 4 — Audit              | —    | "Adversarial review of {N} new pages from Phase 3" |
| 5 — Body text          | {N}  | Per-row plan: "{target}: {section description}; {target}: {section description}; ..." |
| 6 — Internal linking   | {N} + inbound | Per-row plan: "Add inbound to {target 1}, {target 2}; reinforce {N} Phase-3 pages with ≥3 inbound each" |
| 7 — Sitemap + IndexNow | —    | "Add {N} routes; refresh lastmod on {N}; remove {N} consolidation losers; submit to IndexNow" |
| 8 — Summary            | —    | "Print run summary; pause for approval before push" |
| 9 — Commit + deliver   | —    | "Single commit; push to {branch}; report SHA" |

### Rules
- **Rows column**: integer count of chart rows in that bucket, or `—` if the phase has no chart rows (audit, sitemap, summary, commit).
- **Plan column**: must list the **actual targets and actions per row** — never just row numbers. Sourced from each chart row's `solution` / `target` columns, restated in one short clause per row, joined with semicolons. If a phase has zero rows, write `skipped — no rows` instead of leaving the cell blank.
- **Omit rows whose count is 0** unless it's one of the always-present phases (4, 7, 8, 9). For 0-row buckets, write `skipped — no rows` in the Plan column instead of dropping the row.
- **Ambiguous / skipped rows**: if any chart rows could not be classified, append a final row to the table:

  | — | Ambiguous / skipped | {N} | "**HARD STOP** — list each ambiguous row + why it could not be classified. User must reclassify or remove before approving." |

  If `N > 0` here, the gate cannot be approved until the user resolves them.

### After printing the table

Prompt the user with **exactly this question** (or its functional equivalent):
> "Manifest above ({N} actionable rows across {M} phases). Approve to start Phase 1, or pause to revise the chart?"

Acceptable approvals: "approve", "go", "start", "yes", or any clear affirmative.

If the user declines or wants to revise: STOP cleanly. Do not start Phase 1. Wait for them to either edit the chart and re-run, or give new direction.

Only after explicit approval, begin Phase 1.
