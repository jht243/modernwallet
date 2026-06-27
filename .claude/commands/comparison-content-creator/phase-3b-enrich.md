# Phase 3b — Enrich existing pages (PARTIAL candidates)

This phase **executes** every `PARTIAL` from Phase 1b instead of leaving it as a recommendation. A PARTIAL is a pair the site already covers *in passing* inside an existing page (a guide, vertical, or another comparison) but without a real head-to-head treatment. Phase 3 creates net-new pages; **this phase makes targeted spot-edits to the existing page** so the pair is covered properly. `git add` your work but do NOT commit — Phase 5 stages. Phase 4 is the gate for this phase too.

> **‼️ NOT NET-NEW, NOT A REGENERATION.** This phase never creates a route and never rebuilds a page. It edits an existing file in place, adding only the missing comparison coverage the Phase 1b work-item called out. Everything else on the page stays byte-for-byte unchanged.

## What you act on
The **enrichment work-list handed forward from Phase 1b** — one item per PARTIAL, each carrying: the exact existing page/route + file, the entity pair, and *what's missing* (e.g. "pair named in a sentence but no comparison table", "no verdict on which to pick", "covered for a different segment"). These are NOT scored in Phase 2 (the API-cost gate keeps paid scoring to NEW pairs), so you work from the gap description, not from fresh keyword data.

---

## Enrichment guideline — REUSED VERBATIM from `.claude/commands/keyword-gap-pass/phase-5-body.md`

> **‼️ HARD RULE — this is the operating discipline for the edit.** Follow it character-for-character; do not loosen it into "regenerate the section."

Update the body text now, but I don't want you to totally recreate the page using scripts. I'd like you to keep the same page, but update it with your suggestions you identified prior. DO NOT recreate the page via script, only make updates where needed.

Make the edits in place (targeted Edit operations on the existing file), preserving everything not called out by the work-item.

---

## Comparison-specific — what "enrich" means for a PARTIAL pair
For each work-item, add a **focused head-to-head treatment** of the pair to the existing page (not a whole new article):
- A short **comparison sub-section** introduced with an H2/H3 that names both entities ("X vs Y").
- A **comparison table of ≥3 rows** (price/setup/integrations/compliance/etc., a value for each side) — the snippet/answer-engine-extractable core.
- A **one- or two-line verdict** ("pick X when…, pick Y when…").
- Optionally **1–2 FAQ entries** if the page already has an FAQ block — append to it, don't restructure it.
- If the page is keyword-targeted, work the pair's `primaryKeyword` in naturally; no stuffing.

## Discipline / guardrails (check before handing to Phase 4)
- **Targeted `Edit` only.** Insert the new sub-section/table into the existing object/MDX in place. Never overwrite the file wholesale and never invoke a generator/script that rebuilds the page.
- **Re-check coverage LIVE first.** The page may have been improved since Phase 1b ran. Re-open the file; if it now already covers the pair adequately (real table + verdict), **skip** that work-item and record "already covered — skipped." Don't double-enrich a section a prior run already added.
- **Use the project's REAL content-array field keys** (e.g. `content:`, not an invented `body:`). A wrong key renders the section empty and `tsc` won't catch it in a loosely-typed store. Grep the surrounding objects for the actual keys and match them.
- **Match the page's existing structure + schema.** If the page emits FAQ/comparison JsonLd, extend it consistently; don't leave the new table out of the schema if the page schematizes its tables.
- **No fabricated facts** — pricing, certifications, feature claims, stats are accurate or hedged, never invented.
- **No new route, no sitemap add** — the page already exists. Phase 5 only bumps its `lastmod`.

`git add` your edits. Do not commit. Auto-continue to Phase 4 (the gate covers both new and enriched pages).

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment Phase 4's reviewer gate PASSES for the enriched pages, continue in the SAME turn. This workflow has EXACTLY ONE human stop — the Phase 6 summary gate. This phase is NOT it. Do not print "Want me to proceed?" or any question that waits for a human reply.
