# portfolio — /portfolio/60-40-portfolio-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from title/H1 "60/40 Portfolio Calculator".
- STEP 1 numbers: people 6, uses 6, views 25, use_rate 0.24, people_7d 6 (data_days = 3).

## Persona
- Who/where: a 45-year-old DIY investor on a laptop with their brokerage statement open: $168k stock funds, $72k bond funds, $15k cash.
- Job: "Is my mix close to 60/40, what return and risk should I expect, and where will it be in 20 years if I add $800/month?"
- Done = their current split vs 60/40 and a projected value they can plan on.

## Walkthrough
Desktop 1366px (screenshot `screenshots/portfolio-desktop.png`):
1. Loads 200 in ~2.4s, tool at 491px, defaults $60k/$40k → 7.60% return, 10.00% volatility, Sharpe 0.51.
2. Typed stocks 168000, bonds 72000, cash 15000, monthly 800, years 20 → split shown "Stocks 66% / Bonds 28% / Cash 6%", expected return 7.86%, volatility 10.78%, projected $1,591,904.
3. Opened year-by-year projection → table renders.
4. Looked for what return each asset class is assumed to earn — not shown anywhere in the tool.
5. Typing "1500.50" into Stocks became 150,050 (decimal dropped).
Phone 390px (screenshot `screenshots/portfolio-mobile.png`): same results; no horizontal scroll, tool at 857px, no console errors.

## Friction
- "7.86% — based on what? What does it assume stocks and bonds return?" — the per-asset return and volatility assumptions behind the headline are invisible.
- "It doesn't tell me how far I am from 60/40 or what I'd move to get there." — no rebalance gap shown.
- Shared decimal bug on every dollar field.
