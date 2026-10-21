---
mindmap_pass_date: 2026-10-21
source: free-form input brief (top-10 GSC queries 2026-10-14→2026-10-21 + trend-pass research pack), demand-validated
interpreted_brief: Our 10 top Google queries for the 7 days ending 2026-10-21 (1 click total, on the home page; 5 are Roth-vs-Traditional 401(k) variants, 3 online-will variants, 1 "best mortgage lenders", 1 "nerdwallet calculator") plus research that finds no new trend (trends.md rows 4, 6, 8 already caught) and 20 of 20 top-20 queries covered. Build what the demand implies the site lacks.
generated_by: mindmap-pass build phase — keyword demand ladder (volume=dataforseo, kd=dataforseo; KEYWORD_PROVIDERS pinned to dataforseo) + Autocomplete miner (roth vs traditional 401k 158, online will 327, best mortgage lenders 257, custodial account vs 53 suggestions) + live SERP reality check (4 heads read, $0.0166 of $2.00) + coverage_lookup (4 candidates)
demand_source: dataforseo
serp_reads: 4 heads, $0.0166 of $2.00
status: ready-for-execution (zero actionable rows; duplicate-suppression reviewer: KEEP, 1 pass; it corrected one claim — the joint-account leg is a gap, recorded below)
---

Keyword data: volume=dataforseo, kd=dataforseo (6 of 15 phrases measured; 9 had no provider volume and carry an autocomplete band labelled estimate, NOT measured). SERP: reports/mindmap-pass/2026-10-21-trend-lane-c.serp.json. Volumes: reports/mindmap-pass/2026-10-21-trend-lane-c.volumes.json.

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

No actionable rows this run.

## Emerging search patterns (clusters)
No emerging clusters detected this run.

## Exclusions / candidates considered
- online living will 480/mo KD 29 (DataForSEO, measured), AIO present, SERP winnable: DROP — lookup: /roundup/best-healthcare-directive-services/ (built in the 2026-10-19 upsell pass, commit 0d769e0) already is the dedicated page for "living will online / advance directive online". The coverage tool's top matches (will-cost-calculator, best-online-will-makers) are a different reader goal, but the directive roundup is the same one.
- best jumbo mortgage lenders 110/mo KD 17, best mortgage lenders for second home 90/mo KD 0, for seniors 70/mo KD 0 (measured): HELD, not built. A vendor roundup needs verified lender terms (jumbo limits, minimum credit scores, fees) that cannot be grounded unattended; /roundup/best-mortgage-lenders/ is the parent (trends.md row 8) and vendor-roundup-auto owns vendor verification. SERP winnable with AI Overview, no forum dominance. Re-competes every run.
- custodial account vs joint account for child (estimate 75 to 750/mo band, NOT measured; DataForSEO returned no volume): DROP (weak demand) — the duplicate-suppression reviewer found no page for this leg (nearest: /compare/custodial-account-vs-savings-account/, /compare/trump-account-vs-custodial-account/), so it is a genuine small gap, not a duplicate. Not built: no measured demand, and the shot at page one is unread. Left un-HELD and unledgered as KEPT so it re-competes if its volume is ever measured.
- custodial account vs roth ira for kids (estimate 250 to 2,500/mo band, NOT measured), custodial account vs joint account for child, custodial account vs 529 vs trump account (estimate): DROP — lookup: /compare/custodial-roth-ira-vs-brokerage-account/, /compare/custodial-roth-ira-vs-utma/, /compare/trump-account-vs-529-vs-utma/ and the wider custodial-roth-ira-vs-* family serve the same reader goal. SERP is forum-dominated (reddit, experian), which favours an operator-voice page, but a duplicate vs page would cannibalise.
- do online wills hold up in court 30/mo KD 0, do online wills need to be notarized 10/mo, how safe are online wills (estimate): DROP — /compare/online-will-vs-lawyer/ ("cost, validity, state execution rules") and /roundup/best-online-will-makers/ cover validity; demand too thin (10 to 30/mo) for a standalone page.
- roth vs traditional 401k take home pay / early withdrawal / employer match / for 30 year old / after tax (all estimate bands, NOT measured, 10 to 750/mo): DROP — /compare/roth-401k-vs-traditional-401k/ and /roth-vs-traditional-401k-calculator/ (built 2026-10-17) serve the intent; trends.md row 4. The pages' low position (about 85) is a ranking problem for page-quality and rank-drop routines, not a coverage gap.
- best mortgage lenders / online will / last will online variants, 401k vs 529 / 529 vs 401k, +medicare +medicaid +benefits +cost, deposit vs custodial account: DROP — pages exist (see research pack).
- nerdwallet calculator: DROP — branded query for a competitor's tools; /calculators/ hub serves the generic intent (2026-10-19 ledger row).
- Lens 3 (comparison / alternatives / pricing): the brief's entities are account types, programs and lender categories, not vendors with plan prices. LegalZoom vs Trust & Will remains HELD (2026-10-19). No new Lens 3 row.
- Lens 3b skipped (not an AI-content repo).

Dedup evidence: `git log -S "healthcare-directive"` shows 0d769e0 (page built); slug inventory (767 routes) has no route for jumbo, second-home or senior lender roundups; no prior commits touch them.
