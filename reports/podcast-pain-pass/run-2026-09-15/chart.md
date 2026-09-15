---
source: podcast transcripts (podcast-pain-pass), SEMRUSH/DataForSEO-validated
interpreted_brief: >
  36 new episodes across 6 transcript-ready personal-finance shows surfaced
  pre-retirement/near-retirement readers unsure how much they can spend once
  the paycheck stops, when to file for Social Security, whether to do a Roth
  conversion before RMDs hit, and how a 72(t) plan or rental property pencils
  out; plus everyday budgeting/debt-payoff readers and a smaller tax/estate
  strand asking about the new "Trump account" vs a 529.
status: no-changes (0 survivors — independently verified)
---

## Lens 1 — Direct intent (SEMRUSH/DataForSEO validated, floor 70)

| problem (evidence) | candidate phrase | vol/mo | KD | theme | proposed lever | evidence of existing coverage |
|---|---|---|---|---|---|---|
| readers unsure how much to save/spend | mortgage payoff calculator | 60,500 | 12 | real-estate | DROP — covered | `src/data/spokes-mortgage.ts` slug `payoff-calculator`, targetKeyword "mortgage payoff calculator" |
| Roth-vs-traditional confusion voiced repeatedly | roth vs traditional ira | 40,500 | 15 | retirement | DROP — covered | `src/data/comparisons.ts` slug `roth-ira-vs-traditional-ira` |
| listener asked about early-retirement number | coast fire calculator | 40,500 | 0 | retirement | DROP — covered (cluster) | `fire-calculator` (spokes-retirement), `coast-fire-guide`, `coast-fire-number-by-age`, `coast-fire-vs-fire`, `coast-fire-for-couples`, roundup `best-coast-fire-calculators` |
| "3 ways you're messing up your budget" | 50 30 20 rule | 40,500 | 40 | budget | DROP — covered | `src/data/spokes-budget.ts` slug `50-30-20-budget-calculator`, targetKeyword "50 30 20 budget calculator" |
| "sucky stock pickers" / portfolio confusion | index funds vs etf | 18,100 | 32 | investing | DROP — covered | `comparisons.ts` slug `index-fund-vs-etf` |
| trust/will confusion in estate episodes | trust vs will | 18,100 | 0 | tax-estate | DROP — covered | `comparisons.ts` slug `living-trust-vs-will`, `probate-vs-trust`, `revocable-vs-irrevocable-trust` |
| "$2.2M net worth" listener share | how to calculate net worth | 14,800 | 22 | net-worth | DROP — exact match | `spokes-net-worth.ts` slug `how-to-calculate-net-worth`, targetKeyword identical |
| "how much do I need to retire" pain | how much do i need to retire | 12,100 | 51 | retirement | DROP — covered | `guides.ts` slug `how-much-do-i-need-to-retire-by-age` + age-specific guides (`how-to-retire-at-40`, `-at-67`, `catch-up-on-retirement-savings-in-your-60s`, `financial-planning-for-30-year-olds`) |
| budgeting-mistakes episode | how to make a budget | 12,100 | 51 | budget | DROP — covered | `monthly-budget-calculator`, `zero-based-budget-calculator`, `household-budget-calculator`, `how-to-budget-with-irregular-income` |
| "49% on track for early retirement" | average net worth by age | 9,900 | 10 | net-worth | DROP — covered | `net-worth-by-age-calculator`, `net-worth-percentile-calculator` |
| listener new to investing | how to start investing | 8,100 | 23 | investing | DROP — exact match | `guides.ts` slug `how-to-start-investing`, exact title match |
| "file for Social Security at 62" episode | when to take social security | 1,600 | 24 | retirement | DROP — covered | `social-security-retirement-calculator`, `how-to-retire-at-67` (Social Security & Medicare plan), `is-social-security-taxable` |
| estate episode listener question | how does probate work | 1,600 | 35 | tax-estate | DROP — near-exact | `guides.ts` slug `probate-process-guide` ("What Happens After Someone Dies") |
| "define how much comes from your portfolio" | portfolio rebalancing | 1,000 | 36 | investing | DROP — exact match | `guides.ts` slug `portfolio-rebalancing`, exact title match |
| budget struggle episodes | emergency fund amount | 720 | 46 | budget | DROP — covered | `guides.ts` slug `how-much-emergency-fund` ("3-6 Months Rule") |
| debt-payoff struggle episodes | debt payoff strategy | 720 | 38 | budget | DROP — covered | `how-to-pay-off-debt`, `debt-snowball-vs-avalanche` |
| mortgage-payoff-vs-refinance framing | should i refinance | 590 | 14 | real-estate | DROP — covered | `refinance-calculator`, `mortgage-refinance-lessons-learned` |
| estate-planning-basics episode framing | estate planning basics | 480 | 33 | tax-estate | DROP — covered | `guides.ts` slug `first-time-estate-planning` |
| rental listener ROI question | rental property roi | 390 | 15 | real-estate | DROP — exact match | `spokes-real-estate.ts` slug `roi-calculator`, targetKeyword "rental property ROI calculator" |
| dividend-investing episodes | dividend investing strategy | 260 | 38 | investing | DROP — covered | `guides.ts` slug `how-to-build-a-dividend-portfolio` |
| rental/HELOC episode | closing costs explained | 140 | 25 | real-estate | DROP — covered | `closing-cost-calculator`, `mortgage-refinance-closing-costs` |
| net-worth milestone framing | net worth milestones | 70 | 3 | net-worth | DROP — covered | `net-worth-by-age-calculator`, `net-worth-percentile-calculator` |

## Lens 2 — Adjacent-demand (Autocomplete mined on the 6 highest-volume seeds)

Mined `how much do i need to retire`, `50 30 20 rule`, `coast fire calculator`,
`trust vs will`, `roth vs traditional ira`, `average net worth by age` (all
modes, ~1,200 raw completions). After removing off-market international
variants (UK/India/Kenya/Philippines/EU/etc. — this is a US-only primary-source
site), template/app/PDF noise, and third-party-brand queries (e.g. "Trust &
Will vs LegalZoom" — the online-service company, not the legal-instrument
comparison; no podcast episode named this company, and the site's
`online-will-vs-lawyer` page already serves the DIY-vs-attorney intent) —
every remaining cluster is a by-age, by-decade, or by-scenario variant of a
pillar topic the site already answers with a dedicated page (e.g.
"...at 50/55/60/65" → `how-much-do-i-need-to-retire-by-age`,
`catch-up-on-retirement-savings-in-your-60s`, `how-to-retire-at-67`). No
emerging, under-served cluster survives.

## Lens 3 — Comparison / Alternatives / Pricing (entities named in episodes)

| entity | mined query | existing coverage |
|---|---|---|
| Roth conversion / RMD | roth conversion before rmd | `guides.ts` `roth-conversion-rules` ("Pro-Rata, Timing, and RMD Traps"), `roth-conversion-ladder` |
| 72(t) plan (SEPP) | 72t plan rules | present in `comparisons.ts`, `guides.ts`, `roundups.ts`, `spokes-retirement.ts` |
| Trump account | trump account vs 529 | `comparisons.ts` has `trump-account-vs-529`, `-vs-baby-bonds`, `-vs-custodial-account`, `-vs-brokerage-account`, `-vs-roth-ira`, `-vs-savings-account`, `-vs-529-vs-utma`; `guides.ts` has 8 dedicated Trump-account guides |
| HELOC (rental funding) | heloc for rental property | `comparisons.ts` `heloc-vs-home-equity-loan`, `cash-out-refinance-vs-heloc`, `heloc-vs-personal-loan`, `bridge-loan-vs-heloc`; `guides.ts` `heloc-calculator-explained` |
| Vanguard Digital Advisor | vanguard digital advisor review | `comparisons.ts` `vanguard-vs-fidelity`, `-vs-schwab`, `-vs-fidelity-vs-schwab`; `roundups.ts` covers robo-advisor comparisons |

All Lens-3 entities are already covered by dedicated comparison and guide
pages. No new comparison/alternatives page is warranted this week.

## Emerging search patterns (clusters)

No emerging clusters detected this run.

## Exclusions

Every candidate this week — 22 direct-intent terms, 6 seeds' worth of
adjacent-demand mining, and all 5 named entities — maps to a route this site
already ships. This is expected: the site has been built out extensively by
prior `keyword-gap-pass` / `mindmap-pass` / `trend-pass` runs across exactly
these six themes (retirement, investing, budget, real-estate, tax-estate,
net-worth). This week's podcast episodes reinforced existing pillar topics
(early retirement math, Roth vs traditional, 50/30/20, net worth by age,
Trump accounts vs 529) rather than surfacing a genuinely new angle.
