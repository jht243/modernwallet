---
source: podcast transcripts (podcast-pain-pass), SEMRUSH/DataForSEO-validated
interpreted_brief: >
  36 new episodes across 6 transcript-ready personal-finance podcasts surface listeners
  second-guessing plans they already have: retirement spend-down anxiety, whether they're
  over-saving, pension/advisor decisions, sinking funds as a budgeting tactic, and how everyday
  landlords price and find rental deals.
status: ready-for-execution
floor: 70/mo (DataForSEO; estimate rows scored at band midpoint per keyword-demand-ladder)
circuit_breaker: 4 survivors (well under 20) -> AUTO-APPROVE, proceed to Phase 2
---

# Podcast Pain Pass — chart — run 2026-09-22

| problem | solution | bucket | target | format | best_medium | resolved_deliverable |
|---|---|---|---|---|---|---|
| Lens 2 cluster: "what is a sinking fund" / "how does a sinking fund work" / "sinking fund meaning" — 5,400/mo measured (DataForSEO), 10/10 autocomplete completions corroborate. Budget-podcast episode this week ("Discussing Sinking Funds With Connor Tyson") anchors intent. Site has no dedicated page (dedup: no coverage). | New explainer guide defining sinking funds, how they differ from a plain savings account, how to size one, and worked examples for common uses (car repair, holiday spending, annual insurance premium). | budget | `/guides/what-is-a-sinking-fund/` | article | text | text |
| Lens 3 cluster: "sinking fund vs emergency fund" — 110/mo measured, 9/9 corroborated. Natural companion confusion to the sinking-fund guide; site has no vs-comparison. | New comparison page: sinking fund vs emergency fund — when each applies, can you use one for the other, how much of each to hold. | budget | `/compare/sinking-fund-vs-emergency-fund/` | comparison table/database | text | text |
| Lens 2 cluster: "am i saving too much for retirement" / "how much is too much to save for retirement" — 210/mo measured, corroborated. This week's Catching Up to FI episode ("The Biggest Retirement Mistake: Over Saving and Under Living") anchors intent directly. Dedup: site's over-saving content is limited to 529/life-insurance overfunding — different topic, no coverage of retirement-account over-saving. | New guide: signs you may be over-saving for retirement, the under-living tradeoff, and a framework (not personalized advice) for checking your savings rate against your timeline. | retirement | `/guides/am-i-saving-too-much-for-retirement/` | article | text | text |
| Lens 2 cluster: "can i retire on rental income" / "how much rental income to retire" / "how is rental income taxed in retirement" (~75/mo estimate, band-midpoint scored, corroborated) + folded FAQs from "how to find investment property deals" and "can you negotiate the price of a rental property" (both ~75/mo estimate). This week's Rental Income Podcast ran 6 new episodes on retiring off rentals, finding deals, and pricing. Dedup: existing rental content is calculator/ROI-math only; nothing addresses "can this replace my job/retirement income" directly, and dedup flagged existing content as actively steering away from rentals for this exact question — a genuine underserved angle. | New guide answering whether/how rental income can fund retirement, with worked cash-flow math, tax treatment of rental income in retirement, and FAQ sections folding in deal-finding and price-negotiation (kept as FAQs, not separate pages, per the reclassify verdict). | real-estate | `/guides/can-i-retire-on-rental-income/` | article | text | text |

## Emerging search patterns (clusters)

- **Sinking funds** (budget): "what is a sinking fund" (5,400/mo) + "how does a sinking fund work" + "sinking fund meaning" + "sinking fund vs emergency fund" (110/mo) — a real, currently-unserved cluster on this site, evidenced by both measured DataForSEO volume and 9-10x autocomplete corroboration per seed. Two pages ship: the definitional guide and the vs-comparison.
- **Retirement over-saving** (retirement): "am i saving too much for retirement" + "how much is too much to save for retirement" + "can you over save for retirement" — a distinct cluster from the site's existing "how much do I need to retire" content, which answers the opposite question (am I saving enough). One guide ships.
- **Retiring on rental income** (real-estate): "can i retire on rental income" + "how much rental income to retire" + "is rental income good for retirement" + "how is rental income taxed in retirement", plus the adjacent "how to find investment property deals" / "can you negotiate the price of a rental property" phrases folded in as FAQs rather than separate thin pages. One guide ships.

## Dropped (dedup gate — 25 DROP, 1 RECLASSIFY, out of 30 candidates)

All 22 Lens-1 direct-intent head terms (mortgage payoff calculator, roth vs traditional ira, coast fire calculator, 50/30/20 rule, index funds vs etf, trust vs will, how to calculate net worth, how much do i need to retire, how to make a budget, average net worth by age, how to start investing, when to take social security, how does probate work, portfolio rebalancing, emergency fund amount, debt payoff strategy, should i refinance, estate planning basics, rental property roi, dividend investing strategy, closing costs explained, net worth milestones) are already covered by an existing calculator hub, spoke page, guide, or comparison — see the dedup subagent's per-row evidence in the run log. "Financial advisor cost / worth it" (Lens 2, 6,600/mo) and "robo advisor vs financial advisor" (Lens 3, 110/mo) are also DROP — already covered in `guides.ts:829-855` and an embedded side-by-side section at `guides.ts:843`. "Is roth conversion worth it" (Lens 3, 90/mo) is DROP — same intent as shipped `roth-conversion-rules` / `roth-conversion-ladder`. "How to find investment property deals" and "can you negotiate the price of a rental property" are RECLASSIFY — folded as FAQs onto the new rental-income guide rather than shipped as standalone thin pages.

## Deferred backlog drained

`reports/podcast-pain-pass/ledger.json` `deferred_rows` was empty at the start of this run — nothing to drain.
