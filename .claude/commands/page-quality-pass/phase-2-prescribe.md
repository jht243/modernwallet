# Phase 2 — Prescribe: read the actual page, then say exactly what changes

For EACH page on the diagnosis roster: open its real source, judge each section against what the diagnosis says readers needed and didn't get, and emit a concrete **prescription list**. Nothing is written here — Phase 3 executes, Phase 4 audits.

> **Portable — discover, don't assume.** Locate the page's body wherever this site keeps it (a data-file entry, a markdown/MDX file, a template). Find it by slug (`grep -rn "<slug>" data/ src/ content/` — mind quoting styles). Read the WHOLE entry, including metadata and FAQ blocks, before judging anything.

Once per run:
```bash
python3 scripts/trend_pass/slug_inventory.py --json > /tmp/page-quality-inventory.json
```
Per page, mine autocomplete around its head term (+ its top-3 GSC queries when available):
```bash
python3 scripts/trend_pass/mine_trend_autocomplete.py --seeds "<head term>" "<gsc q1>" "<gsc q2>" "<gsc q3>"
```

## Section scoring (for THIN_UNDERDELIVERY and INTENT_MISMATCH)
Score every existing section 0–2 against its own heading's promise:
- **2 — delivers:** specific, verifiable substance a reader could act on (numbers, names, steps, dates, trade-offs).
- **1 — half-delivers:** on-topic but generic; the reader learns little they couldn't guess from the heading.
- **0 — fails:** filler that name-drops the topic, restates the heading, or answers a different question.

Sections scoring 0–1 on a `THIN_UNDERDELIVERY` page → **REWRITE** prescriptions. For `INTENT_MISMATCH`, additionally map each GSC top query to the section that *should* answer it; no section answers it → the mapped section gets a REWRITE (or an APPEND if none is close). Sections scoring 2 are LEFT ALONE — never churn what works. Record each section's score + one-line justification; the digest and the Phase 4 auditor both use them.

## Prescription types (the only five)
1. **`REWRITE_SECTION`** — route, section heading, score, why it fails, and a content brief: the specific facts/answers the new prose must contain (research-first — verify every fact before Phase 3 writes it; the brief cites where each fact comes from).
2. **`APPEND_SECTION`** — a missing high-value sub-intent (autocomplete/GSC-backed, question-gap method: `question-gap-pass/phase-2-questions.md` + `phase-3-coverage.md` if present, else judge directly). If another page on the site already owns that sub-intent as its dedicated topic → this becomes an `ADD_LINKS` prescription pointing there instead.
3. **`ADD_LINKS`** (the `DEAD_END` medicine) — 2–5 contextual next-step internal links woven into existing prose where the reader's journey actually continues, plus a "read next" pathway if the site's templates support one. Every target must EXIST in the slug inventory. Choose targets by journey logic (comparison → pricing/worth-it → how-to-start), not keyword similarity. Never stuff links.
4. **`EMBED_TOOL`** (`TOOL_INTENT`) — what the tool computes, its inputs/outputs, where on the page it sits. Follow `downloadable-asset-pass/phase-3c-tool-build.md` if present, else a clean client-side build: real working logic, no fake outputs, no new deps, no secrets. Dedup: shared ledger + existing interactive components — never rebuild a shipped or dropped tool.
5. **`REWRITE_METADATA`** — ONLY with the GSC gate (`underperforming` + `rewrite_recommended`) AND no metadata rewrite for this page KEPT in the shared ledger within 28 days. Grounded in the page's real `top_queries`.

## Consistency sweep (MANDATORY follow-on to every `REWRITE_SECTION` — learned from the 2026-07-08 dry run)
When a rewrite changes a fact's STATUS — future→shipped, scheduled→released, add-on→bundled, price unknown→price stated — grep the ENTIRE page entry (every unchanged section, bullet, callout, FAQ answer, and the intro) for other statements of that same fact and emit a minimal-edit prescription for each stale mention. A page that says "weights are live" in one section and "once available" three sections later fails its reader worse than the original staleness did. These sweep edits are surgical (a verb tense, a clause) and count as part of the parent rewrite, not separate prescriptions. The Phase 4 auditor rejects on any internal contradiction, so an unswept page bounces back anyway — sweep it here, once.

## Dedup (before emitting)
Check every prescription against: the shared ledger `reports/trend-pass/ledger.md` (KEPT/DROPPED by any pass — never re-emit), the slug inventory, and the other prescriptions this run (one prescription per section max; `ADD_LINKS` targets unique per page).

## Output
Per page: diagnosis, section scores, and its prescription list (each: type, target, evidence, content brief). → `phase-3-execute.md`.
