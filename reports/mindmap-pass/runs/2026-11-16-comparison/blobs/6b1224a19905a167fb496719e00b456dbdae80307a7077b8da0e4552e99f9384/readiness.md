# Readiness report: 2026-11-16-comparison (BUILD, jobId 2026-11-16-comparison)

Author: mindmap-build. runId d1389d3fc206449abad48c48a5fd46ff. Authorization: caller brief states unattended run, Phase 0 treated as approved, publicationScope per caller (commit/push/live/IndexNow). Preparation mode: full (unattended). Independent chart review is NOT done here (CHART-REVIEW stage).

## Preparation check
Preflight bundle: reports/mindmap-pass/runs/2026-11-16-comparison/preflight-build, 30 parts delivered and `workflow-preflight.py check` returned delivery-complete-sources-current. Delivery is not proof of understanding; application map below.

## Application map
| Rule (source) | Decision / artifact |
|---|---|
| Traffic-growth priority (mindmap-pass.md) | Ranked by measured SEMRUSH volume + winnable SERP; no lead-gen objective assumed. research/keyword-volumes.json, research/serp.json |
| Keyword ladder (_keyword-demand-ladder.md) | KEYWORD_PROVIDERS=semrush,dataforseo; volume and KD provider semrush for 11/11 phrases (measured, not estimate); SERP/PAA DataForSEO ($0.01075); autocomplete question sweeps saved. `expand` not run: the brief supplies the candidate pairs and each page head is a named pair, so adjacent-family discovery is recorded as clusters (autocomplete shows flex vs sapphire preferred / discover it / capital one savor, xero vs quickbooks vs freshbooks) and deferred. |
| Existing coverage first (_vendor-research.md, coverage_lookup) | research/coverage-lookup.txt (all 11): no page covers any pairing head-to-head; QB/FB covered only in /alternatives/quickbooks and roundups, annuity pairings differ, Chase cards only in roundups/guides. |
| Primary-source captures once | research/sources/: freshbooks-pricing, xero-pricing, chase-freedom-flex, chase-freedom-unlimited, irs-401k-contributions, investor-gov-annuities, sofi-banking, chime-home (403 gate, unreadable), quickbooks-pricing (WebFetch SUMMARY only; direct fetch fails; flagged non-verbatim and corroborated by src/data/alternatives.json captured 2026-11-13). |
| _decision-evidence.md | A1 and A3 basis calculated (scripts executed, outputs saved, counterexamples in briefs); A2 basis reported with reasoning (payout depends on insurer rates; no defensible model). Visible attribution wording planned: "In our internal cost modeling, we ..." for A1/A3; source-only naming Investor.gov and IRS for A2. Takeaways planned per page intent (pick with break-even / verdict with boundary). |
| _testing-labels.md + _experience.md section G | Software (QB/FB) licensed in principle but no executed test records: ordinary presentation, no tested label. Credit cards and annuities are financial products: excluded from testing claims. No TESTED format on any page. |
| Roundup blend / objectivity | Not roundups; neutral comparison; business not an option; no claims of neutrality or no-paid-placement. |
| Review profile (content-review-policy) | A1 STANDARD (2 audits), A2 HIGH (consequential retirement claims; ceiling per policy), A3 STANDARD with APR/rate figures flagged for auditor. Liability-block categories not engaged (no dosing/safety/defamation content). |
| Defended-page lock | No existing page edited by creation; inbound links touch /alternatives/quickbooks etc.; reports/ai-answer-citation-pass/defended-pages.json exists and lists none of the touched routes (checked), so no defend-lock applies. |
| Headline bans (_anti-ai-language) | Titles use no em dashes, no Conclusion/Summary headings; two-clause colon titles follow the existing site "X vs Y: Z" pattern (reviewer to confirm). |
| Model-launch rules | Not applicable (no AI model launch). |
| Hype angle gate | Not applicable (no frozen hype intake). |

## Candidate dispositions (all 11 original intake items; brief sha256 40ad467d...)
| ID | Candidate | Volume/KD (SEMRUSH us, 2026-11-16) | Disposition | Reason |
|---|---|---|---|---|
| C1 | chime vs sofi | 590 / 27 | DEFER | chime.com 403 anti-bot to all fetch methods; no primary Chime facts; not bypassed |
| C2 | quickbooks vs freshbooks | 2,400 / 28 | BUILD A1 | winnable SERP, sourced prices, calculated cost grid |
| C3 | acorns vs robinhood | 480 / 22 | DEFER | below 720 threshold, captures not obtained, overlaps robinhood family |
| C4 | webull vs fidelity | 480 / 20 | DEFER | below threshold, captures not obtained |
| C5 | wealthfront vs vanguard | 210 / 12 | DEFER | low volume |
| C6 | annuity vs 401k | 1,600 / 24 | BUILD A2 | winnable SERP, Investor.gov + IRS sources |
| C7 | i bonds vs high yield savings | 20 / 0 | DROP | negligible demand |
| C8 | chase freedom flex vs unlimited | 720 / 36 | BUILD A3 | winnable SERP, issuer pages captured, calculated break-even |
| C9 | capital one 360 vs ally | 20 / 0 | DROP | negligible demand |
| C10 | xero vs quickbooks | 2,400 / 50 | DEFER (high priority carry-forward) | contested SERP and higher effort than A1; distinct rival pairing (not an overlap); Xero pricing page already captured (sources/xero-pricing.txt) |
| C11 | debt consolidation vs balance transfer | 210 / 38 | DEFER | PARTIAL: existing guide section; enrichment lane; low volume |

## Per-page preparation checks
| Page | Duplicate check | Testing eligibility | Evidence and label decision | Takeaway brief | Evidence |
|---|---|---|---|---|---|
| /compare/quickbooks-vs-freshbooks | lookup: /alternatives/quickbooks different intent; no commits | Software licensed, no run records, so not tested | calculated, ordinary label | pick with break-even in brief | qb_vs_fb.py/out.json, pricing captures |
| /compare/annuity-vs-401k | adjacent annuity-vs-cd, pension-vs-annuity differ | financial product excluded | reported, source-only | verdict with boundary | investor-gov, irs captures |
| /compare/chase-freedom-flex-vs-unlimited | roundup/guide only | financial product excluded | calculated, ordinary | pick with $750/quarter break-even | flex_vs_unlimited.py/out.json, chase captures |

## Round-1 chart-review fixes applied (findings F-A1-1, F-A1-3, F-A2-1, F-A2-2, F-A2-3, F-A3-1, F-A3-2, F-X-1)
- A1: answer/takeaway rewritten to match qb_vs_fb.out.json (grid extended to users 1/2/3/4/5/10/25 x clients 3/5/6/20/50/51/100; QB cheaper only at 1 user with 6+ clients and 3 users with 51+); QuickBooks Free plan added; QB feature bullets removed; binding labels: "list price, checked 2026-11-16", link quickbooks.intuit.com/pricing, no verbatim QB quotes, no testing claim.
- A2: captured verbatim sources/irs-early-distribution-tax.txt (tax topic 558), irs-401k-plans.txt, irs-rmd.txt (RMD age text not used: the captured page text shows age 73 and may be outdated, so the page will state no RMD age); outline narrowed to rows both captures support (no 401(k) fee, RMD or catch-up-dollar rows); match step made conditional and sourced to the IRS contributions page; title replaced with single-claim "Annuity vs 401(k): They Solve Different Retirement Problems" (59 chars).
- A2 duplicate ruling: /compare/pension-vs-401k (employer pension vs 401(k)), /compare/iul-vs-401k (life-insurance policy vs 401(k)) and /annuity-calculator (payout tool) are distinct intents from annuity-contract vs 401(k)-plan; inbound sources now pension-vs-401k, iul-vs-401k, pension-vs-annuity (inspected).
- A3: break-even restated as annual bonus-category spend >= 12.5% of total annual spend within the ,500 quarterly cap; Flex cannot beat Unlimited at about 8,000+ annual spend; unsupported "complement Unlimited" advice removed; inbound credit-card-perks-worth-it replaced by /guides/chase-travel-portal-worth-it (names both cards).

## Known limits and open items for reviewers
- QuickBooks pricing source is a WebFetch summary (promo 50% off 3 months listed; list prices $38/$85/$140/$340). Corroborated by an independent 2026-11-13 capture in alternatives.json. CHART-REVIEW should decide whether this suffices; WRITE must say "list price" and avoid verbatim feature quotes.
- Chase Unlimited page text does not state a foreign transaction fee; page must not claim one.
- Chase Flex rotating categories change quarterly; the break-even assumes full category match.
- FreshBooks extra-seat add-on ($11/mo) assumed per user beyond the first.
- Evidence packets (evidence.json per slug), cases-batch retrieval and `content_gen.py` drafts are WRITE-stage outputs and are not produced here.
- Inbound link source routes were inspected through their data-file entries (research/link-inspections/*.txt); exact anchor sentences are chosen at Phase 6.
