# Phase 1 — Trend detection (CORE) + hard-stop ledger check

Work from the Phase 0 pull JSON only.

## 1. Filter query noise
Drop any query starting with `-` or containing `-site:` (audit-crawler operator strings, not human demand). Collapse obvious near-identical 0-click impression-spam variants to one representative. Pages are never noise.

## 2. Classify each surviving query AND each top-10 page on two axes
- **entity/topic** — the subject (product, brand, question, concept) the query/page is about.
- **content-format** — review / roundup / guide / comparison / how-to / explainer / tool / news, etc. (match the repo's own page types, discovered from the sitemap).

Print the classification table (lands in the transcript + digest).

## 3. Clear-trend rule (deterministic)
A theme qualifies when **≥3 of the surviving top-10 queries share it** (same entity/topic family — variants/misspellings count), OR **≥3 of the top-10 pages share it AND those pages hold ≥40% of the top-10 pages' clicks** (page-side trigger; the usual one on a low-traffic site). No qualifying theme → **NO CLEAR TREND**, a SUCCESS: digest + `--status no-changes`, exit 0.

## 4. Trend ledger check (BEFORE any mining)
Read `reports/trend-pass/trends.md`. Match semantically against the MINED rows (trends whose content already exists) and the EVERGREEN rows (steady site demand).
- **MATCH → ALL WORK STOPS.** No mining, no building, no queue, no backlog. Digest ("Trend already caught on <date>: <theme> — no work this run"), `--status no-changes`, exit 0.
- **Ownership by another engine is NOT a match/stop** — there is no RADAR-OWNED class; if the theme isn't a MINED/EVERGREEN row, it's a NO MATCH even if some other engine also covers that surface.
- **NO MATCH** → step 5.

## 5. Adversarial refutation (one shot, ledger-NEW trends only)
Spawn ONE subagent (that did NOT classify) with the pull JSON, your theme statement, and `trends.md`. It tries to (1) refute the ≥3 grouping as coincidence, and (2) map the theme onto a MINED/EVERGREEN row. Refuted (1) → NO CLEAR TREND (exit). Refuted (2) → MATCH → ALL WORK STOPS (exit). Survives → append the new trend row to `trends.md` (status `MINED`) and proceed to Phase 2.

## Output
Either an early-exit digest, or a confirmed NEW trend + entity list → Phase 2. There is no "drain" path.
