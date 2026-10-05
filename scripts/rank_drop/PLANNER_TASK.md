# Rank-drop planner task — a BATCH of pages, files only

> **Prices come ONLY from the ledger.** Every price in a CLOSED FACT LIST comes from `pricing_rows` (data/pricing.ts) or a vendor page fetched now — NEVER from `page.ts`/`page.md`, which may be the stale thing being fixed. `apply_sections.py` rejects any draft that states a price disagreeing with the ledger.
> **Current model = newest row of its family.** `pricing_rows` carries every row of each family the page names (e.g. "Claude Opus" → Opus 5.5, 5, 4.8…). A fact list presents the NEWEST row as the current pick; an older version the page names appears only as history ("was"), never as the model to buy. 2026-10-04: the writing page priced Fable 5 vs Opus 4.8 as current, two releases stale.


> **New content follows the mindmap-pass system — no exceptions.** Any reader-facing addition longer
> than ONE sentence (a section, FAQ answer, paragraphs) is generated exactly as mindmap-pass Phase 5
> does it: the **Enrichment** chapter of `.claude/commands/_content-generation.md` +
> `.claude/commands/mindmap-pass/phase-5-body.md` (reader-question placement, monetization check,
> date bump). Only these are written by you in-context: a title or description, a single clarifying
> sentence, an internal-link sentence, a number/date correction (the Enrichment chapter's exemption
> list). Whole-page rewrites (L5) are not yours — `REWRITE_TASK.md` runs mindmap-pass Phase 3.

You plan fixes for the pages listed in your batch. You **do not edit the repo's data files, do not
write prose, do not commit**. You write three small files per page; code does the rest
(`generate_all.sh` writes the prose through content_gen in parallel, `apply_sections.py` splices and
commits). This is the mindmap-pass model: prompts are DATA ONLY, generation is batched.

P = `reports/rank-drop/<date>/packets`. Read ONCE for the whole batch: `$P/writer-rules.md` (skim the
INTENT, LINKS, ANCHOR and anti-AI WRITER parts — the generator already carries the rest) and
`$P/routes.txt` (grep it; don't print it).

For each slug S in your batch:

0. Read `$P/S/diagnosis.json` FIRST. Its `level` decides your scope: **L3 → `meta_only`** (rewrite
   `metaTitle`/`metaDescription` so they carry the lost searches' wording and this page's distinct
   angle versus any taker page; no competitor study, no section); **L4 → one section** (below). Its
   `evidence` already lists the missing searches, takers, and outranked searches — use it, don't
   re-derive it. Escalate above the diagnosed level only with a one-line reason in `summary`.
   **L5 → not yours.** L5 pages go to the rewrite subagents (`REWRITE_TASK.md`, the mindmap-pass system); skip them.
1. Read `$P/S/packet.json` (headings, lost searches with best → now position, lane_hint,
   successor_routes, taker_routes, pricing_rows). Open `$P/S/page.ts` only to check what the page
   already says about the lost searches.
2. **Decide the lane** (one line of reasoning in `summary`):
   - **REFRESH** — the page's model/product has a successor we cover (successor_routes). Plan ONE
     section pointing readers to the newer model, with current prices only from pricing_rows.
   - **DIFFERENTIATE** — another of our pages (taker_routes) now holds the searches. Usually
     `meta_only`: sharpen `metaTitle`/`metaDescription` to this page's distinct angle (one sentence
     each, written by you), plus `flag-merge` in notes if the two pages are near-duplicates.
   - **RECOVER** — real ranking loss. Run
     `DATAFORSEO_B64=… python3 scripts/rank_drop/competitor_serp.py --detect <detect.json> --page <path> --out $P/S/serp.json`,
     WebFetch the top 2 non-forum competitor pages, and name the concrete gap (direct answer up
     top, comparison table data, current numbers, subtopic the lost searches name). If forums or
     vendor docs hold most of the top 5, write `action: "flag-intent-shift"` and stop for this page.
     No concrete gap → `action: "no-fix"`.
3. **Write** (skip for no-fix / flags):
   - `$P/S/plan.json` — `{"slug", "lane", "action": "add_section"|"meta_only"|"no-fix"|"flag-intent-shift"|"flag-merge",
     "section_id": "<new kebab id, not in packet.sections>", "insert_before": "<an id from packet.sections>" | null,
     "meta": {"metaTitle": "…", "metaDescription": "…"} (optional), "summary": "<one sentence>"}`
   - `$P/S/section.prompt.md` (add_section only), DATA ONLY, in the Enrichment chapter's shape: one
     task line (what the section must answer, which lost searches, 150–250 words, paragraphs only);
     the row's **reader question / answer / answer placement** (as mindmap-pass phase-5 requires —
     when the section IS the answer to the page's reader question it goes in **section 1 or 2**, so
     set `insert_before` to the id of the current first or second section, never the bottom; copy
     all three into plan.json as `reader_question`, `answer`, `answer_placement` for the auditor); a **CLOSED FACT LIST** (only facts from pricing_rows, the page itself,
     or a vendor page you fetched — with the sentence "anything not on this list, you do not
     know"); a **CLOSED URL LIST**; 2–3 internal links from routes.txt with anchor text.
   - `$P/S/allowed-urls.txt` — the external URL prefixes from the CLOSED URL LIST, one per line
     (an empty file is fine).
4. Monetization check (mindmap-pass phase-5's block, layer3labs only) for every page you add a
   section to: natural fit only; if it fits, add the `src/utils/affiliateInject.ts` entry and note it
   in `summary`.
5. Never copy competitor sentences or claims. Never invent a number. Never plan a deletion, slug
   change, or redirect.

Return one JSON line per page and nothing else: `{"slug": S, "lane": "...", "action": "...", "summary": "..."}`.
Budget: about 1–2 minutes per page. Work through the whole batch; do not stop early.
