# portfolio — /portfolio/60-40-portfolio-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from the H1 "60/40 Portfolio Calculator" and tool heading "Analyze the classic 60/40 portfolio".
- STEP 1 numbers (data_days = 6, early): people 13, uses 13, views 59, use_rate 0.22, people_7d 13 (ledger: 6 → more than doubled, re-picked).

## Persona
- Who/where: a 45-year-old with a 401(k) and IRA, on a laptop at home after a market run-up: $180,000 in stock funds, $70,000 in bonds, $20,000 cash, adding $1,000/month, 20 years to go.
- Job: "I'm supposed to be 60/40 — how far off am I, and what do I move?"
- Done = the dollar amounts to sell and buy to get back to 60/40.

## Walkthrough
Desktop 1366px (`screenshots/portfolio-desktop.png`):
1. Page 200 (~3.7s), `data-tool="portfolio"` root 491px down.
2. Typed Stocks 180000, Bonds 70000, Cash 20000, Monthly 1000, Years 20.
3. Result: "Expected return 7.89% · Volatility 10.88% · Stocks 67% / Bonds 26% / Cash 7% · Sharpe 0.50 · A 60/40 split of your $270,000 is $162,000 stocks / $108,000 bonds. You hold $180,000 / $70,000, plus $20,000 in real estate and cash. · Projected in 20 years $1,775,247".
4. To get "what do I move" they must subtract themselves: $180,000 − $162,000 = $18,000 too much in stocks; $108,000 − $70,000 = $38,000 short in bonds.
Phone 390px (`screenshots/portfolio-mobile.png`):
1. No horizontal scroll, root 857px down, inputs ≥32px. Same result. No console errors.

## Friction
- "OK, $162,000 vs $180,000… so I sell $18,000 of stocks? And the bonds need $38,000 — where does the other $20,000 come from?" — the gap is shown as two pairs of numbers, not as moves. → tool fix: add one line "To reach 60/40: stocks $18,000 over target · bonds $38,000 under target (the $20,000 in cash/real estate can cover part of it)" plus a link to /portfolio-rebalancing-calculator/ to plan trades. Pure subtraction, no new math.
- Nothing else blocked the job.

## Monetization
Verdict: fit
YMYL (investing) → books only. Having seen their mix drift, the next job is a rebalancing rule they can stick to. Ranked list:
1. Book — asset allocation / portfolio construction
2. Book — index-fund investing guide
3. Book — market history and risk (to hold through drops)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Stocks above 65% of holdings (drifted aggressive) | 1264715919 *The Four Pillars of Investing* (2nd ed., Bernstein, McGraw-Hill); 1324035439 *A Random Walk Down Wall Street* (Malkiel, Norton); 1119847672 *The Bogleheads' Guide to Investing* | Risk and why rebalancing back to target matters |
| Stocks 55–65% (near 60/40) | 1119847672 *The Bogleheads' Guide to Investing* (Wiley); 1119404509 *The Little Book of Common Sense Investing* (Bogle, Wiley); 1264715919 *Four Pillars* | Keeping a simple index allocation on autopilot |
| Stocks below 55% (conservative) | 1264715919 *Four Pillars*; 1324035439 *A Random Walk Down Wall Street*; 1119404509 *Little Book of Common Sense Investing* | What a lower stock share costs in expected growth |
