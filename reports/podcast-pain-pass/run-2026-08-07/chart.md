---
source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated
interpreted_brief: >
  90 new episodes across 8 transcript-ready personal-finance podcasts skew toward
  investing mechanics, tax/estate confusion, and basic account-mechanics questions
  (Traditional vs Roth IRA, net worth tracking). All 21 Lens-1 direct-intent terms
  came back COVERED by this site's existing 95 guides / 80+ comparisons / 9 calculator
  hubs — the site is unusually mature. The real opportunity is Lens-2 adjacent-demand
  (age/income-specific "how much do I need to retire" variants, demographic net-worth
  breakdowns, a mortgage-payoff-vs-balance confusion cluster, teen/college budgeting)
  and Lens-3 entity gaps named directly in the transcripts but never covered on-site
  (credit score, VOO vs SPY, Vanguard vs Fidelity, mega-backdoor Roth, DAF vs private
  foundation, REIT vs rental property).
status: ready-for-execution
---

## Action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable |
|---|---|---|---|---|---|---|
| Lens-3 entity gap: "credit score" named repeatedly in transcripts (35 credit-score mentions); site has only 2 narrow credit-card-eligibility spokes, no pillar guide. SEMRUSH: 60,500/mo, KD72. | create new content | credit-basics | `/guides/what-is-a-good-credit-score/` | article | text | text |
| Lens-3 entity gap: VOO and SPY each named/implied ~29× as "the S&P 500 ETF" but never compared ticker-to-ticker. SEMRUSH: 6,600/mo, KD32. | create new content | investing-comparison | `/compare/voo-vs-spy/` | comparison table | text | text |
| Lens-3 entity gap: Vanguard and Fidelity each named 40-70+ times across guides/roundups, never head-to-head. SEMRUSH: 3,600/mo, KD37. | create new content | investing-comparison | `/compare/vanguard-vs-fidelity/` | comparison table | text | text |
| Lens-2 cluster: "how much do i need to retire at 50/55/60/62/65" (5 member phrases, mined pain: "how much money you'll have a retirement"). Site has age-40 and age-67 guides + a 60s catch-up guide but no age-band retirement-number tool. SEMRUSH (age 55 representative): 1,000/mo, KD43; other ages no-tool-volume — autocomplete evidence (repeated completions). | create new content | retirement-number-by-age | `/guides/how-much-do-i-need-to-retire-by-age/` | article (age-band table, ties to retirement-savings-calculator) | text | text |
| Lens-3 entity gap: mega-backdoor Roth named in transcripts as a non-standard-plan mechanism distinct from the regular backdoor Roth (which is already covered on 5+ pages). SEMRUSH: 390/mo, KD15. | create new content | retirement-account-mechanics | `/guides/mega-backdoor-roth-401k/` | article | text | text |
| Lens-3 entity gap: donor-advised fund named once in transcripts, no dedicated page; real "vs private foundation" comparison shape, ties to estate-planning pillar. SEMRUSH: 390/mo, KD14. | create new content | estate-giving-comparison | `/compare/donor-advised-fund-vs-private-foundation/` | comparison table | text | text |
| Lens-2 cluster: budgeting for teens/college students (6 member phrases: "50 30 20 rule for teens", "how to make a budget as a college student", etc.) — distinct audience with no mortgage/401k line items; site's budget content assumes an adult household. No tool volume — autocomplete evidence (repeated completions across 2 seeds). | create new content | budget-teens-college | `/guides/how-to-budget-for-teens-college-students/` | article | text | text |
| Lens-2 cluster: net worth for FAFSA / accredited-investor eligibility tests use different definitions (FAFSA excludes primary residence + retirement accounts; accredited-investor SEC test excludes primary residence, has its own $1M threshold) — genuinely distinct from the site's general net-worth benchmarking. No tool volume — autocomplete evidence. | create new content | net-worth-eligibility-tests | `/guides/net-worth-for-fafsa-and-accredited-investor/` | article | text | text |
| Lens-2 cluster: net worth demographic breakdowns (by income/race/education/gender/generation — 6 member phrases; Fed SCF publishes these cross-tabs). Existing spoke only benchmarks by age bracket. No tool volume — autocomplete evidence. | update existing body text | net-worth-demographics | `/net-worth/net-worth-by-age-calculator/` | body/FAQ enrichment | text | text |
| Lens-2 cluster: Coast FIRE number under tax/inflation adjustments (3 member phrases) — existing FAQ (shipped 2026-07-29) covers pension/SS/rental/mortgage offsets but not how taxable-vs-tax-deferred growth or inflation change the coast number. No tool volume — autocomplete evidence. | update existing body text | coast-fire-tax-inflation | `/coast-fire/` | body/FAQ enrichment | text | text |
| Lens-2 cluster: mortgage payoff amount ≠ current balance confusion (4 member phrases: "why is my mortgage payoff higher than my balance", etc.) — real, common confusion from per-diem interest/fees/escrow shortages; same gap-shape already fixed for business-loan-payoff in a prior pass, never done for mortgage. No tool volume — autocomplete evidence. | update existing body text | mortgage-payoff-vs-balance | `/mortgage/payoff-calculator/` | body/FAQ enrichment | text | text |
| Lens-2 cluster: starting to invest with little/no money (6 member phrases: "how to start investing with no money", "is $100 enough to start investing", etc.) — investing hub's starter framework assumes a lump sum, no FAQ answers the near-zero-capital objection. No tool volume — autocomplete evidence. | update existing body text | investing-no-money | `/investing/` | body/FAQ enrichment | text | text |

## Emerging search patterns (clusters)

- **Age-anchored "how much do I need to retire"** — "at 50", "at 55", "at 60", "at 62", "at 65" — a real pattern distinct from the site's existing age-40/age-67 guides; consolidated into one age-band article rather than five thin pages.
- **Income-anchored "how much do I need to retire on $X/year"** — reverse-4%-rule math ($50k/$80k/$100k/$150k a year); folded into the same age-band guide as a secondary framing (income → nest-egg table) rather than a separate page, since it's the same underlying math with a different input.
- **Net-worth demographic cross-tabs** (age×income, age×race, age×education, age×gender, generation labels "gen x"/"gen z") — real Fed SCF data exists to ground this; handled as an FAQ enrichment, not a new page, since the existing net-worth-by-age spoke is the right home.
- **Mortgage payoff ≠ balance confusion** — "higher than my balance", "same as the balance", "what is included in a mortgage payoff amount" — a well-evidenced misconception cluster; FAQ enrichment on the existing payoff calculator.
- **Near-zero-capital investing objection** — "with no money", "with little money", "$100 enough", "$500 enough", "$1000 enough" — FAQ enrichment on the investing hub.
- **Teen/college budgeting** — a genuinely different audience persona (no mortgage, no 401k, first paycheck/first apartment) the current budget content doesn't address; standalone guide.

## Exclusions

Dropped by the independent adversarial dedup gate: `reit-vs-rental-property` — the `/guides/real-estate-investment-options/` guide already has a dedicated "Option 4: REITs" section, a "how the 5 options compare" section explicitly contrasting REIT liquidity/no-landlord-duties against direct-rental control/leverage/depreciation, and an FAQ answering REIT-vs-landlording head-to-head; `passive-income-ideas` covers the same ground again. A dedicated comparison page would cannibalize existing content for a 90/mo term.

Dropped as noise or already covered: all 21 Lens-1 direct-intent terms (covered by existing guides/spokes/comparisons — see Phase-0/Phase-1 validation logs). ~4,000+ raw autocomplete suggestions across the 10 pulled CSVs were discarded as geo-suffix noise (UK/India/Canada/Australia/Kenya/Malaysia/Singapore/Philippines/US-state variants), competitor-navigational queries (Dave Ramsey, NerdWallet, Bankrate, WalletBurst, BiggerPockets, Financial Mentor, Credit Karma, Zillow, Rocket Mortgage, Dinkytown, Clark Howard, Money Guy, Andy Hill, Martin Lewis, DQYDJ, Kiplinger, Investopedia), downloadable-spreadsheet requests (Excel/Google Sheets — consistent with prior runs' precedent of not building downloadable files), "Trust & Will" brand-vs-competitor queries (vendor comparison, not concept comparison — out of scope), and off-domain autocomplete-prefix pollution ("net income" accounting queries polluting the "net worth" seed, "Cal Fire"/wildfire results polluting the "coast fire" seed, DIY-craft and gaming/TikTok noise polluting the "how to make a budget" seed). Also excluded: clusters already shipped by the 2026-07-29 and 2026-08-05 keyword-pass runs (coast-fire-for-couples, coast-fire-vs-barista-fire, net-worth-with-mortgage-or-pension body updates).
