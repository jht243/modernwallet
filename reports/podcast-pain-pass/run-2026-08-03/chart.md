---
source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated
run: 2026-08-03
interpreted_brief: >
  This week's 56 episodes keep circling the same shape of problem: listeners can do the first
  step of a money decision but cannot do the arithmetic that tells them whether the decision is
  worth it. Dividend shows spend whole episodes on "how much can you actually earn" and "how do
  I build a portfolio out of that." Retirement shows frame it as a gap ("how big of a portfolio
  do I need to fill that gap consistently") plus a recurring tax-timing question ("should I be
  doing Roth conversions this year, or is this actually gonna cost me?"). Suze's callers ask
  457(b) vs Roth 401(k) after taxes, and whether advisor fees plus expense ratios are worth what
  they buy. Insurance segments circle a permanent policy the caller already owns: what the cash
  value is and how much can be borrowed against it. The rental show adds vacancy — gross rent is
  easy, downtime between tenants is the number that decides the deal.
semrush_floor: 70
lenses_run: [1 direct-intent, 2 adjacent-demand, 3 vs/alternatives/worth-it + roundup blend]
dedup_gate: passed (read-only Explore reviewer; 2 DROPs, 4 RECLASSIFYs applied)
status: ready-for-execution
---

# Chart — podcast-pain-pass run 2026-08-03

Evidence files backing every volume/KD figure below: `validated_terms.json` (Lens 1),
`expansion_validated.json` (Lens 2/3), `roundup_blend_validated.json` (Lens 3 roundup blend),
`autocomplete.*.csv` (12 seeds, 2,463 unique live completions), `pain_clusters.json` (hooks).

## Main action table — 23 approved rows

Build order = the `#` column (deferred-backlog first — none this run — then by effective demand).

| # | problem (lens · evidence · why unowned · podcast hook) | solution | bucket | target | format | resolved_hub |
|---|---|---|---|---|---|---|
| 1 | **L1/L2 · `roth conversion rules` 4,400/mo KD58** (+ `is roth conversion worth it` 70, `should i do roth conversion` 70). 30+ distinct roth-conversion autocomplete completions. No dedicated page. *Dedup reviewer narrowed the gap:* `/compare/rollover-ira-vs-roth-ira/` already covers Form 8606, the per-conversion 5-year clock and the IRMAA trap — so this page must own **pro-rata rule, bracket-filling/timing, the recharacterization ban, and the RMD-year restriction**, and link to that comparison rather than restate it. Hook: "should I be doing Roth conversions this year, or is this actually gonna cost me?" | Rules guide scoped to the 4 uncovered mechanics | Roth conversion | `/guides/roth-conversion-rules/` | guide | `/retirement/` |
| 2 | **L3 roundup · `best dividend etfs` 3,600/mo KD41**. No dividend-fund roundup. Same product-roundup pattern as the existing `best-index-funds`. Also the destination for the reclassified 74,000/mo stock-ranking intent (see exclusions). | Neutral fund roundup | Dividend ETFs | `/roundup/best-dividend-etfs/` | roundup | `/investing/` |
| 3 | **L2 · `roth conversion ladder` 2,400/mo KD30**. Autocomplete: `roth conversion ladder calculator`, `roth conversion ladder vs 72t`. Site mention is one FIRE-calculator FAQ sentence (`spokes-retirement.ts:259`) that links to a calculator which never explains it. | Ladder mechanics guide | Roth conversion | `/guides/roth-conversion-ladder/` | guide | `/retirement/` |
| 4 | **L3 · `457b vs 403b` 1,900/mo KD22**. Site has `457b-vs-401k` (`comparisons.ts:5884`) and `403b-vs-401k` (`:5624`) but not the 457(b)↔403(b) pairing public-sector employees actually face. | Head-to-head comparison | 457(b) | `/compare/457b-vs-403b/` | comparison | `/retirement/` |
| 5 | **L2/L3 · `borrowing against life insurance` 1,300/mo KD58**. Cash-value borrowing exists on-site only as table cells (`comparisons.ts:3767`, `:3814`, `:5278`); zero policy-loan mechanics. Hook: "If she had an emergency today, how much is available for loan?" | Policy-loan guide: interest accrual, death-benefit offset, lapse risk | Life insurance cash value | `/guides/borrowing-against-life-insurance/` | guide | `/estate-planning/` |
| 6 | **L3 roundup · `best target date funds` 1,300/mo KD46**. `grep -i "target.date fund"` across `src/` returns zero substantive hits — no coverage at all. | Neutral fund roundup | Target-date funds | `/roundup/best-target-date-funds/` | roundup | `/investing/` |
| 7 | **L3 roundup · `best robo advisors` 1,000/mo KD45** (+ `best robo advisors 2026` 110/mo KD42 — year variant, same page). Betterment + Wealthfront named in transcripts. **Hard differentiation mandate from the dedup reviewer:** `/roundup/best-ira-accounts/` already ranks Betterment, Wealthfront, Fidelity Go, Schwab Intelligent Portfolios and Merrill Guided Investing with a robo fee table — this page must be scoped to standalone taxable robo-advisory (fees, tax-loss harvesting, account minimums, human-advisor access) and cross-link, not restate. | Neutral service roundup | Robo-advisors | `/roundup/best-robo-advisors/` | roundup | `/investing/` |
| 8 | **L2 · `what is a good expense ratio` 720/mo KD55**. *Reviewer narrowed the gap:* the dollar-cost math is already published twice (`roundups.ts:465` $43k/30yr; `comparisons.ts:883` $98,600 vs $76,100). This page must own the uncovered slice — **what number counts as good, by fund type** (index vs active vs target-date vs bond vs sector) — and link out for the cost math. Hook: "are the advisors or the expense ratios worth it?" | Benchmark-by-fund-type guide | Fund fees | `/guides/what-is-a-good-expense-ratio/` | guide | `/investing/` |
| 9 | **L3 roundup blend (audience) · `best dividend etfs for retirement` 590/mo KD32** — cleared the 70-floor in `roundup_blend_validated.json`. Distinct audience: income-in-retirement, not accumulation. | Neutral fund roundup | Dividend ETFs | `/roundup/best-dividend-etfs-for-retirement/` | roundup | `/investing/` |
| 10 | **L3 roundup blend (attribute) · `best monthly dividend etfs` 480/mo KD46** — cleared the 70-floor in `roundup_blend_validated.json`. Distinct selection criterion: payout frequency. | Neutral fund roundup | Dividend ETFs | `/roundup/best-monthly-dividend-etfs/` | roundup | `/investing/` |
| 11 | **L3 · `i bonds vs ee bonds` 320/mo KD44**. Autocomplete: `series i bonds vs ee`, `which is better ee bonds or i bonds`. No savings-bond comparison on the site (I-bond content is incidental only). | Head-to-head comparison | Savings bonds | `/compare/i-bonds-vs-ee-bonds/` | comparison | `/investing/` |
| 12 | **L3 · `457b vs roth ira` 320/mo KD27**. Autocomplete: `457b or roth ira`, `which is better 457b or roth ira`, `457b plan vs roth ira`. No page. Hook: "Should I contribute to my 457(b) or should I contribute to my Roth 401k since it's after taxes?" | Head-to-head comparison | 457(b) | `/compare/457b-vs-roth-ira/` | comparison | `/retirement/` |
| 13 | **L3 · `i bonds vs tips` 260/mo KD47** (+ `tips vs i bonds` 140/mo KD38 — same intent, merged). No page. | Head-to-head comparison | Inflation-protected bonds | `/compare/i-bonds-vs-tips/` | comparison | `/investing/` |
| 14 | **L2 · `what target date fund should i choose` 210/mo KD41**. Autocomplete: `what target date fund year should i choose`, `what target date fund should i choose based on age`. No coverage. | Age/glide-path selection guide | Target-date funds | `/guides/what-target-date-fund-should-i-choose/` | guide | `/investing/` |
| 15 | **L1/L2 · `how to build a dividend portfolio` 110/mo KD47**, absorbing the reclassified `best dividend stocks for beginners` (74,000/mo KD67 — see exclusions). 11 mined hits, the strongest pain cluster this run; ranked here on absorbed intent, not the 110 head figure. Nearest existing content is one paragraph in `/guides/passive-income-ideas/`. Hook: "how should I build a dividend stock portfolio?" / "in the first year you would have received $522 in dividends" | Neutral how-to: screening criteria + yield math, NOT a stock ranking | Dividend investing | `/guides/how-to-build-a-dividend-portfolio/` | guide | `/investing/` |
| 16 | **L3 · `target date fund vs s&p 500` 140/mo KD18**. Autocomplete: `target date fund or s&p 500 for 401k`, `target date fund or voo`, `target date fund vs vti`. No coverage. | Head-to-head comparison | Target-date funds | `/compare/target-date-fund-vs-sp500/` | comparison | `/investing/` |
| 17 | **L2 · `how to calculate vacancy rate` 320/mo KD12** (+ `vacancy rate formula` 110/mo KD14). **RECLASSIFIED by the dedup reviewer from new page → body update:** `vacancyRatePct` is already a live input on three real-estate spokes and vacancy is explained in each `howItWorks`. The only true gap is *deriving* the rate (vacant days ÷ available days). Hook: "how much downtime do you typically have between tenants?" | Add a derivation FAQ to `/real-estate/rental-income-calculator/` + `/real-estate/cash-flow-calculator/` (additive) | Rental vacancy | existing spokes | body update | `/real-estate/` |
| 18 | **L1 · `roth conversion calculator` 6,600/mo KD36** (+ `roth conversion tax calculator` 1,300/mo KD27). Highest-volume genuinely-uncovered term this run. Needs a real engine, not prose. | Asset spec for a human to build | Roth conversion | `reports/podcast-pain-pass/specs/roth-conversion-calculator-spec.md` | calculator-spec | `/retirement/` |
| 19 | **L2 · `dividend yield calculator` 2,400/mo KD32**. `/investing/dividend-calculator/` targets `dividend reinvestment calculator` — a DRIP future-balance engine with a different input/output contract. | Asset spec | Dividend investing | `.../specs/dividend-yield-calculator-spec.md` | calculator-spec | `/investing/` |
| 20 | **L2 · `457b calculator` 1,900/mo KD17**. No 457(b) engine. | Asset spec | 457(b) | `.../specs/457b-calculator-spec.md` | calculator-spec | `/retirement/` |
| 21 | **L2 · `expense ratio calculator` 1,600/mo KD15**. No engine. | Asset spec | Fund fees | `.../specs/expense-ratio-calculator-spec.md` | calculator-spec | `/investing/` |
| 22 | **L2 · `cash value life insurance calculator` 1,000/mo KD27**. No engine (the only `cash value` hit is an unrelated Medicaid spend-down contract). | Asset spec | Life insurance cash value | `.../specs/cash-value-life-insurance-calculator-spec.md` | calculator-spec | `/estate-planning/` |
| 23 | **L2 · `target date fund calculator` 110/mo KD68**. No engine. | Asset spec | Target-date funds | `.../specs/target-date-fund-calculator-spec.md` | calculator-spec | `/investing/` |

**Approved: 23 rows** — 16 shippable pages (rows 1–16), 1 body update (row 17), 6 calculator specs
(rows 18–23). Under the 30-row circuit-breaker. **BUILD_CAP = 15**, so row 16
(`target-date-fund-vs-sp500`, lowest effective demand) carries to `deferred_rows` for next run.

## Emerging search patterns (clusters)

1. **Roth conversion (near-zero existing coverage).** 30+ distinct autocomplete completions; 6,600/mo on the calculator term alone. Rows 1, 3, 18 — the largest uncovered opportunity this run.
2. **Dividend income mechanics.** Strongest mined cluster (11 hits). Demand splits into how-to (row 15), fund selection (rows 2, 9, 10), and yield math (row 19).
3. **Target-date funds.** Named in 4 transcripts; a full autocomplete tree with literally zero site coverage. Rows 6, 14, 16, 23.
4. **457(b) public-sector account choice.** The site covers 457(b) only against 401(k); the decisions callers voice are vs 403(b) and vs Roth IRA. Rows 4, 12, 20.
5. **Fund-fee literacy.** "Is the expense ratio worth it" is the same question as "is the advisor worth it." Rows 8, 21.
6. **Savings bonds / inflation-protected fixed income.** I bonds vs EE vs TIPS is an unowned comparison triangle. Rows 11, 13.
7. **Life-insurance policy loans.** Rows 5, 22.
8. **Rental vacancy derivation.** Row 17 (body update).

## ⚠ Flagged for human review — NOT approved rows, nothing ships from this

The dedup reviewer found that the first draft of this chart wrongly listed 9 high-volume Lens-1
terms as "already owned." They are **not** owned by any spoke, hub, or `targetKeyword` — but they
also have **no live hub route** (`/tax/` and `/debt/` are not in `LIVE_IDS`), so the routine cannot
resolve a target for them and they are deliberately excluded from the approved set rather than
turned into orphan specs. Standing up `/debt/` and `/tax/` calculator hubs is a buildout decision
for a human, not a weekly content routine:

`paycheck tax calculator` 22,200 · `credit card payoff calculator` 22,200 · `debt payoff calculator`
14,800 · `capital gains tax calculator` 14,800 (only a real-estate-scoped spoke exists) ·
`tax bracket calculator` 6,600 · `emergency fund calculator` 6,600 · `student loan payoff calculator`
4,400 · `debt consolidation calculator` 3,600 · `paycheck budget calculator` 110.

Also flagged: `validated_terms.json`'s `THEME_HUB` map emits three dead hubs — `/tax/`, `/debt/`,
and `net worth calculator` → `/estate-planning/` (should be `/net-worth/`). Worth fixing in
`scripts/podcast_pain_pass/validate_terms.py` before the next run.

## Exclusions

- **`best dividend stocks for beginners` (74,000/mo KD67) — RECLASSIFIED, not shipped as searched.** A ranked list of individual securities is a securities recommendation, which this site does not publish (existing roundups rank *products and services* — brokerages, apps, funds — never individual stocks). The demand is served neutrally by row 15 (how to screen and build) and rows 2/9/10 (fund roundups, the established `best-index-funds` pattern).
- **`nominal vs real return` (260/mo KD44) — DROPPED by the dedup reviewer as covered.** `/investing/compound-interest-calculator/` carries a verbatim FAQ "What is the difference between nominal and real returns?" (`spokes-investing.ts:76`) plus a matching commonMistake, repeated on `/investing/sp500-calculator/`, `/net-worth/net-worth-projection-calculator/`, and `/guides/how-to-invest-100k-to-1-million/`. A reader does find the answer. Separately, every live `/compare/` page is a product/account pair — a concept explainer does not belong in that collection.
- **`best high dividend etfs` (390/mo KD39) — DROPPED for cannibalization.** Yield-maximizing selection is the core axis of row 2's parent roundup; a fourth near-sibling dividend-ETF page would split the same intent.
- **`cash value life insurance vs term` (90/mo KD15) — DROPPED as covered** by `/compare/whole-life-vs-term-life-insurance/`.
- **`dividend income calculator` (720/mo KD28) — DROPPED as covered** by `/investing/dividend-calculator/`.
- **Below the 70/mo floor, no autocomplete-repeat exception granted (22 phrases):** `target date fund vs index fund` (50), `expense ratio vs management fee` (50), `inflation adjusted return calculator` (50), `inflation adjusted rate of return calculator` (50), `best vanguard target date funds` (40), `best target date funds 2026` (40), `best treasury bond funds` (30), `roth conversion vs backdoor roth` (20), `roth conversion worth it` (20), `how much roth conversion should i do` (20), `i bonds vs cds` (20), `i bonds vs hysa` (20), `i bonds vs t bills` (20), `i bonds vs treasury bonds` (20), `i bonds vs high yield savings` (20), `is cash value life insurance worth it` (20), `cash value life insurance vs roth ira` (20), `how much difference does expense ratio make` (20), `expense ratio etf vs mutual fund` (20), `dividend income vs capital gains` (20), `how much to invest for dividend income` (20), `target date fund vs voo` (20), `are target date funds worth it` (20), `target date fund vs etf` (20), `best target date funds for retirement` (20), `best robo advisors for beginners` (20), plus 11 at 0/mo.
- **Lens-1 terms verified as already owned by live calculator hubs/spokes (32 of 42):** `compound interest calculator` (823,000), `401k calculator` (135,000), `roth ira calculator` (110,000), `how much house can i afford` (110,000), `rent vs buy calculator` (110,000), `refinance calculator` (49,500), `mortgage payoff calculator` (40,500), `dividend calculator` (27,100), `investment growth calculator` (22,200), `closing cost calculator` (22,200), `401k vs roth ira` (18,100), `net worth calculator` (14,800), `how much do i need to retire` (12,100), `retirement savings calculator` (12,100), `down payment calculator` (9,900), `how much life insurance do i need` (8,100), `term vs whole life insurance` (8,100), `index fund vs etf` (5,400), `social security break even calculator` (4,400), `how much to save for retirement` (3,600), `savings goal calculator` (2,400), `roth ira vs brokerage account` (1,900), `how much should i save each month` (1,900), `biweekly mortgage calculator` (1,900), `how long to pay off credit card` (1,300), `how much emergency fund` (1,300), `how much tax will i pay` (1,000), `debt snowball vs avalanche` (880), `estate tax calculator` (880), `50 30 20 budget calculator` (590), `pay off debt or invest` (480), `how much to invest per month` (170). *(The 9 terms wrongly included here in the first draft are now in the "Flagged for human review" section above; the 42nd, `roth conversion calculator`, is approved as row 18.)*
