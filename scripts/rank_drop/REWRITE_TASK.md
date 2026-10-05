# Rank-drop L5 rewrite task — regenerate whole pages with the mindmap-pass system

> **Prices come ONLY from the ledger.** Every price in a CLOSED FACT LIST comes from `pricing_rows` (data/pricing.ts) or a vendor page fetched now — NEVER from `page.ts`/`page.md`, which may be the stale thing being fixed. `apply_sections.py` rejects any draft that states a price disagreeing with the ledger.
> **Current model = newest row of its family.** `pricing_rows` carries every row of each family the page names (e.g. "Claude Opus" → Opus 5.5, 5, 4.8…). A fact list presents the NEWEST row as the current pick; an older version the page names appears only as history ("was"), never as the model to buy. 2026-10-04: the writing page priced Fable 5 vs Opus 4.8 as current, two releases stale.


L5 pages are rewritten with **exactly the system `/mindmap-pass` uses for new content**. Do not invent a
parallel process. Read and follow, for the rows in your batch:

1. `.claude/commands/mindmap-pass/phase-3-new-content.md` — **Step 0** (`load-standards.sh` + `content_gen.py
   preflight`), **Step 1** (system.md once per page type, one DATA-ONLY `<slug>.prompt.md` per row,
   `allowed-urls.txt`), **Step 2** (`content_gen.py write … --schema guide|comparison`, check each draft's
   `meta.guards` before the next), **Step 3** (topic-residue grep, template, mechanical lint).
2. `.claude/commands/_content-generation.md` — the canonical generation contract it points to.

Phase 4 (the audit) is run by the orchestrator with `.claude/commands/mindmap-pass/phase-4-audit.md`, on
a separate auditor — you never audit your own page.

## The only differences from new content (everything else is identical)

| mindmap-pass (new page) | rank-drop L5 (existing page) |
|---|---|
| NET-NEW ONLY — never overwrite an existing route | **Explicit exception:** the route exists and is being replaced. Same slug, same URL, same `publishedDate`. |
| Row comes from the brief's chart | Row comes from `packets/<slug>/packet.json` + `diagnosis.json`: keywords + intent = the lost searches (best → now positions), **reader question / answer / answer placement** written by you from those searches the way build-brief Step 4.6 does it, the PAA/FAQ spec from `.claude/tools/autocomplete-paa` on the top lost searches |
| Facts from the brief's research | **CLOSED FACT LIST** = facts still true on the current `page.ts` + `pricing_rows` + vendor pages you fetch now. The stale facts the diagnosis found are corrected, never repeated. |
| Voice sample: a real published page of the same type, never the page being written | Same rule — **never the page being rewritten**; pick a sibling of the same type from `packets/routes.txt` |
| Insert as `_entries.push({...})` before `export const newGuides/newComparisons` | Do NOT insert. Save the draft to `packets/<slug>/page.json`; `apply_sections.py` replaces the existing entry's generated keys and keeps everything else (slug, publishedDate, inlineCta, existing relatedLinks when the draft's are empty) byte-for-byte |
| Files under `reports/mindmap-pass/<TODAY>/` | Files under `reports/rank-drop/<date>/rewrite/` (`prompts/`, `drafts/`) — same names, same `.meta.json` provenance |
| Depth floor from the row's page type | `max(the type's floor, the current page's word count)` — a rewrite never ships thinner |
| Lint on the inserted slug | Run `npx tsx scripts/content_lint.mts --slug <slug>` after `apply_sections.py` applies the rewrite (the orchestrator does this before the audit); Rung-0 fixes in place |

Phase 7b (intro humanize) is skipped for these pages, as for any generated page.

Write `packets/<slug>/plan.json` as `{"slug", "lane": "REWRITE", "action": "rewrite", "schema": "guide|comparison",
"floor": N, "system": "<path to the system.md you used>", "reader_question": "…", "answer": "…",
"answer_placement": "section 1|2 \"<heading>\"", "summary": "<one sentence>"}` — the auditor needs the
three reader fields.

Pages outside `data/guides*.ts` / `data/comparisons*.ts` (gear, open-weights) have no generator schema:
do not rewrite them — write an L4 plan with up to TWO sections instead and say so in `summary`.

Return one JSON line per page: `{"slug", "result": "drafted"|"downgraded-to-L4"|"failed", "words": N, "guards": [...]}`.
