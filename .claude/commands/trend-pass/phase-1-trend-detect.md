# Phase 1 — Trend detection (CORE) + trend ledger check

Work from the Phase 0 pull JSON only.

> **⚠️ Two-lane model — READ FIRST.** This phase decides ONLY the trend lane; it no longer ends the run. Every outcome below that says "exit 0 / ALL WORK STOPS" now means only **"the trend lane produces no candidates this run"** — control **always** continues to **Phase 1b (coverage lane)**, which runs every run regardless. The run only fully early-exits when BOTH lanes come up empty (decided downstream, not here). Never `exit 0` from this phase; "stop" means *stop the trend lane and go to Phase 1b*, carrying the digest note forward.

## 1. Filter query noise
Drop any query starting with `-` or containing `-site:` (audit-crawler operator strings, not human demand). Collapse obvious near-identical 0-click impression-spam variants to one representative. Pages are never noise.

## 2. Classify each surviving query AND each top-10 page on two axes
- **entity/topic** — the subject (product, brand, question, concept) the query/page is about.
- **content-format** — review / roundup / guide / comparison / how-to / explainer / tool / news, etc. (match the repo's own page types, discovered from the sitemap).

Print the classification table (lands in the transcript + digest).

## 3. Clear-trend rule (deterministic)
A theme qualifies when **≥3 of the surviving top-10 queries share it** (same entity/topic family — variants/misspellings count), OR **≥3 of the top-10 pages share it AND those pages hold ≥40% of the top-10 pages' clicks** (page-side trigger; the usual one on a low-traffic site). No qualifying theme → **NO CLEAR TREND** (record the verdict for the digest), then **go to Phase 1b** — do NOT exit. A trendless run still runs the coverage lane.

## 4. Trend ledger check (BEFORE any mining)
Read `reports/trend-pass/trends.md`. Match semantically against the MINED rows (trends whose content already exists) and the EVERGREEN rows (steady site demand).
- **MATCH → the TREND lane stops.** No trend mining, no trend building, no queue, no backlog for the trend. Record the verdict ("Trend already caught on <date>: <theme> — no trend work this run") for the digest, then **go to Phase 1b** (the coverage lane still runs). Do NOT exit the run.
- **Ownership by another engine is NOT a match/stop** — there is no RADAR-OWNED class; if the theme isn't a MINED/EVERGREEN row, it's a NO MATCH even if some other engine also covers that surface.
- **NO MATCH** → step 5.

## 5. Adversarial refutation (one shot, ledger-NEW trends only)
Spawn ONE subagent (that did NOT classify) with the pull JSON, your theme statement, and `trends.md`. It tries to (1) refute the ≥3 grouping as coincidence, and (2) map the theme onto a MINED/EVERGREEN row. Refuted (1) → NO CLEAR TREND → **go to Phase 1b**. Refuted (2) → MATCH → the trend lane stops → **go to Phase 1b**. Survives → append the new trend row to `trends.md` (status `MINED`) and proceed to Phase 2 (Phase 1b still also runs).

## Output
Always hand off to **Phase 1b (coverage lane)**, plus either (a) a confirmed NEW trend + entity list → Phase 2, or (b) a "no clear trend" / "already caught" verdict → the trend lane contributes nothing. The run does NOT exit here; there is no "drain" path and no `exit 0` in this phase.
