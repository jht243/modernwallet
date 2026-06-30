# Phase 2 — Coverage / dedup check FIRST (the API-cost gate)

**This is the credit-saving gate. No AI generation call may happen until a candidate clears this phase.** Dedup every scraped candidate against **ALL existing this project's content** from Phase 0 — guides, comparisons, verticals, landing pages, tools — so we never spend credits writing a page the Phase 4 audit would reject as a duplicate. Pure local work; zero AI/API spend.

## Reuse the comparison coverage check

Apply `.claude/commands/comparison-content-creator/phase-1b-coverage-check.md` to the candidate list, mapping each competitor candidate to a this project **topic/slug** to dedup:
- For a `page` candidate, derive the topic from its `title` + `outline` (e.g. "AI for ecommerce", "invoice matching automation").
- For a `comparison` candidate, derive the entity pair / "X alternatives" topic.
- For a `tool` candidate, derive the tool's job (e.g. "ROI calculator", "readiness assessment").

Run the three checks from that file (exact/reverse slug, entity/topic already covered inside a page, semantic keyword overlap) against the full inventory.

## Tag every candidate
- **`NEW`** — no meaningful existing coverage → proceeds to Phase 3 (or 3c for tools).
- **`PARTIAL`** — we cover it in passing → build an enrichment work-item (existing route + file + exactly what's missing vs the competitor's `outline`) → Phase 3 enrichment.
- **`DUPLICATE`** — already well covered → **drop now**. Record disposition `skipped-duplicate` (with our conflicting URL) for Phase 6's ledger `record`. **Do not generate.**

## Output
- A coverage tag for **every** candidate (nothing silently dropped). DUPLICATE rows carry the conflicting this project's URL and are queued for `record` as `skipped-duplicate`.
- State explicitly: `AI generation calls so far: 0 — dedup ran first`, `NEW → generate: <n>`, `PARTIAL → enrich: <p>`, `DUPLICATE → dropped: <d>`.
- If **0 NEW + 0 PARTIAL** survive → hand to Phase 6 to record the `skipped-duplicate` dispositions + commit ledger, then email **Success Without Changes**. Otherwise **auto-continue to Phase 3.**
