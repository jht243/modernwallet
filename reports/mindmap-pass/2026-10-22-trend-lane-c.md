---
mindmap_pass_date: 2026-10-22
source: free-form input brief (top-10 GSC queries 2026-10-15→2026-10-22 + trend-pass research pack), demand-validated
interpreted_brief: Our 10 top Google queries for the 7 days ending 2026-10-22 (1 click total, on the home page; 5 are Roth-vs-Traditional 401(k) variants, 3 online-will variants, 1 "best mortgage lenders", 1 "nerdwallet calculator") plus research that finds no new trend (trends.md rows 4, 6, 8 already caught) and 20 of 20 top-20 queries covered. Build what the demand implies the site lacks. The one new signal in the wider top-20 is "financial calculators online" / "financial online calculators" (position 18 on the second), which points at the generic online financial-calculator (time value of money) intent.
generated_by: mindmap-pass build phase — keyword demand ladder (volume=dataforseo, kd=dataforseo; KEYWORD_PROVIDERS pinned to dataforseo) + Autocomplete miner (roth vs traditional 401k 158, online will 327, best mortgage lenders 257, financial calculators online 73 suggestions; first three identical to 2026-10-21) + live SERP reality check (4 heads read, $0.0160 of $2.00) + coverage_lookup (1 candidate run; reviewer re-searched by hand)
demand_source: dataforseo
serp_reads: 4 heads, $0.0160 of $2.00
status: ready-for-execution (zero actionable rows; duplicate-suppression reviewer returned RECLASSIFY on the one draft row, verified, row removed)
---

Keyword data: volume=dataforseo, kd=dataforseo (15 of 15 phrases measured). SERP: reports/mindmap-pass/2026-10-22-trend-lane-c.serp.json. Volumes: reports/mindmap-pass/2026-10-22-trend-lane-c.volumes.json.

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

No actionable rows this run.

## Emerging search patterns (clusters)
No emerging clusters detected this run.

## Exclusions / candidates considered
- **time value of money calculator 12,100/mo KD 11, financial calculator online 6,600/mo KD 54, financial calculators online free 880/mo, ba ii plus financial calculator online 90/mo (DataForSEO, measured; SERP winnable, AIO present, no forum except the BA II Plus head): DROP, not built.** The draft row (new /time-value-of-money-calculator/) was RECLASSIFIED by the reviewer and the reclassification checked: lookup: /annuity-calculator/ (src/lib/annuity.ts, modes payout / future / present, ordinary vs annuity-due, payment frequency) already solves PMT, FV and PV, the same reader goal for 3 of 5 TVM unknowns, and /investing/compound-interest-calculator/ has a goal view. A second page would cannibalise it. The real gap is solving for rate and number of periods plus the "time value of money / financial calculator" framing; closing it means new engine modes and a retitle on an existing calculator, which this pass forbids (additive only, no metadata rows, no rewrites). Recorded as an opportunity for the owner or a calculator-extension routine, not ledgered as HELD. The draft cited "no solver" and "annuity payout" wrongly; corrected here.
- regular/roth/traditional 401k variants, will online / last will online / online will / can i get a will online, best mortgage lenders and lender variants, 529 vs 401k, deposit vs custodial account, etf mutual funds, +medicare +medicaid +benefits +cost: DROP — pages exist (compare/roth-401k-vs-traditional-401k, roundup/best-online-will-makers, roundup/best-mortgage-lenders, compare/401k-vs-529, compare/custodial-account-vs-savings-account, compare/etf-vs-mutual-fund, compare/medicare-vs-medicaid, guides/medicare-savings-programs). trends.md rows 4, 6, 8. Autocomplete for roth-vs-traditional-401k, online-will and best-mortgage-lenders is identical to 2026-10-21 (0 new suggestions), so the 2026-10-21 exclusions stand: online living will, jumbo/second-home/senior lender roundups (HELD, needs verified lender terms, re-competes), custodial account vs joint account (weak demand, estimate).
- nerdwallet calculator, how long will my money last calculator nerdwallet: DROP — branded competitor queries; /calculators/, /retirement/ calculators and /guides/how-long-will-150k-last-in-retirement serve the generic intent.
- financial calculator online npv / irr / ytm (10/mo each, KD 62 to 65): DROP as separate pages — demand 10/mo; the TVM solver page and the existing /guides/investment-appraisal-methods-npv-irr/ carry them. An NPV/IRR cash-flow tool is not built this run (would need a separate engine; demand unmeasurable).
- best financial calculators online 10/mo, types of financial calculators 20/mo, financial calculator vs scientific calculator: DROP — demand 10 to 20/mo, roundup/best-retirement-calculators and the /calculators/ hub exist.
- ba ii plus financial calculator online 90/mo: not a separate page; SERP forum_dominated true (reddit, youtube, app stores). Folded into the TVM page as an FAQ ("Can this replace a BA II Plus?") only if the engine supports the same keys; otherwise omitted.
- Lens 3 (comparison / alternatives / pricing): brief entities are account types, programs and lender categories, not vendors with plan prices. No new Lens 3 row. LegalZoom vs Trust & Will remains HELD (2026-10-19).
- Lens 3b skipped (not an AI-content repo).

Dedup evidence: coverage_lookup on the draft route matched nothing (it searched only tvm/time/value terms, so it missed the annuity tool); the reviewer's hand search found /annuity-calculator/ (commit 48baafe) and reports/mindmap-pass/2026-10-14-autocomplete.md rows for present/future value of annuity. Slug inventory (776 routes) has no tvm/time-value route.
