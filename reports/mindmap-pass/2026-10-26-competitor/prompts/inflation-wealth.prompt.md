# ROW — inflation-wealth

route: /guides/build-wealth-during-high-inflation/
slug: build-wealth-during-high-inflation
page type: guide (finance YMYL; operator register, no personalized advice)
depth floor: 1100 body words
medium: text + one markdown table
register: operator
primary keyword: build wealth during high inflation
secondary/semantic keywords: how to protect money from inflation, protect savings from inflation, inflation hedge, I bonds vs savings account, TIPS inflation protection
reader question: "How can I protect my savings from inflation?" [verb-only on SERP (DataForSEO unavailable this run); Autocomplete question sweep: 9/11 completions are how-to ("how to protect savings/cash/wealth/assets/money from inflation"), 2/11 "what is the best way"; ac 11/11 question; dominant pattern = method]
answer: Keep cash only for near-term needs, because a savings account at the 0.38% FDIC national average loses purchasing power when CPI runs 3.7%; put money you will not touch for 12+ months into inflation-linked Treasuries (I bonds up to $10,000 a year, or TIPS), and use tax-advantaged accounts (401(k) up to $24,500, IRA up to $7,500 in 2026) for long horizons, accepting that the last is not an inflation guarantee. (mechanism: a sequence of moves ordered by time horizon)
answer placement: section 1 "How to Match Each Dollar to Its Time Horizon"
search intent: a saver worried that rising prices are eroding their money, wanting concrete steps and the cost of each.

## THE CLOSED FACT LIST — every number/date/limit/name this page may state

### A. Reported (primary sources, read 2026-10-26)
- BLS CPI (https://www.bls.gov/news.release/cpi.nr0.htm): "Over the last 12 months, the all items index increased 3.7 percent before seasonal adjustment." Reference month September 2026, released Oct 14, 2026. The October CPI was not yet out.
- Federal Reserve (Sept 16, 2026 FOMC statement): "The Committee decided to raise the target range for the federal funds rate by 1/4 percentage point to 3-3/4 to 4 percent."
- FDIC national average savings rate: 0.38 percent (national deposit rates, as of Oct 19, 2026; based on a $2,500 product tier).
- TreasuryDirect I bonds: composite rate 4.26 percent for I bonds issued May 1, 2026 to October 31, 2026; "This includes a fixed rate of 0.90%." The inflation component for that period is 1.67 percent (semiannual). A new rate is due Nov 1, 2026 (not published when we checked; do not state it). Limit: up to $10,000 in electronic I bonds per person per calendar year. You cannot redeem until you have held the bond 12 months; if cashed before 5 years you forfeit the last 3 months of interest.
- TreasuryDirect TIPS: "The principal (called par value or face value) of a TIPS goes up with inflation and down with deflation." Sold in terms of 5, 10 or 30 years; interest every six months at a fixed rate set at auction, never less than 0.125 percent; at maturity "You never get less than the original principal."
- IRS (IR-2025-111): 2026 401(k) employee deferral limit $24,500 (up from $23,500); IRA limit $7,500 (up from $7,000); 401(k) catch-up for age 50+ $8,000; IRA catch-up $1,100.
### B. Calculated (our internal modeling; reproducible: reports/mindmap-pass/2026-10-26-competitor/evidence/inflation-wealth/calc.py, output.txt). Provenance: basis = calculated; scope = $10,000 for one year; CPI assumed to stay at 3.7%; the I bond composite assumed to stay 4.26% (it really resets every six months); annual compounding for simplicity. Scenario inputs, not a forecast.
- $10,000 at the FDIC average 0.38% grows to $10,038 nominal, worth $9,679.85 in today's dollars: a purchasing-power change of -$320.15.
- $10,000 in cash at 0% is worth $9,643.20 in today's dollars (-$356.80).
- $10,000 in an I bond held at 4.26%: nominal $10,426, worth $10,054.00 in today's dollars (+$54.00).
- Break-even nominal rate to keep purchasing power at 3.7% inflation: 3.70 percent.
- The 0.90% fixed rate alone is worth about $90 a year on $10,000 above inflation (the composite is built from the fixed rate and the inflation rate).
- Early-exit cost (simple monthly accrual approximation at 4.26%): redeeming at month 13 accrues about $461.50 of interest and the 3-month penalty removes about $106.50, leaving about $355.00.
- Counterexample: if inflation fell to 2.0%, the 0.38% savings account would still lose about 1.6% in purchasing power a year while the I bond still adds its 0.90% fixed rate above inflation; but the I bond's value then depends on a lower composite rate. The benefit disappears if you need the money inside 12 months (it is locked) or have already used the $10,000 limit.
- What this shows: the gap between the average savings rate and inflation under these inputs. It does not show future inflation, future I bond rates, or stock/real-estate returns, which we did not model.
### C. Unknown / do not state
The Nov 1, 2026 I bond rate, any TIPS auction yield, any stock, gold, real estate or commodity inflation-hedge claim or historical return, any HYSA or CD rate above the FDIC average (the FDIC figure is an average; say rates at online banks vary and to check current offers), the October CPI, tax treatment details of I bond/TIPS interest beyond saying to check TreasuryDirect and IRS, anything personalized.

Anything not on this list, you do not know. Never invent a price, limit, statistic or URL. Give no personalized advice.

## THE CLOSED URL LIST — the only external hrefs allowed
- https://www.bls.gov/news.release/cpi.nr0.htm
- https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm
- https://www.fdic.gov/national-rates-and-rate-caps
- https://www.treasurydirect.gov/savings-bonds/i-bonds/
- https://www.treasurydirect.gov/savings-bonds/i-bonds/i-bonds-interest-rates/
- https://www.treasurydirect.gov/marketable-securities/tips/
- https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500

## Internal links to use (real routes only — use at least 3)
- [I bonds vs TIPS](/compare/i-bonds-vs-tips/)
- [inflation calculator](/inflation-calculator/)
- [HYSA vs CD](/compare/hysa-vs-cd/)
- [high-yield savings calculator](/investing/high-yield-savings-calculator/)
- [HYSA vs Roth IRA vs brokerage account](/guides/hysa-vs-roth-ira-vs-brokerage-account/)

## What to cover, section by section
1. Intro: sentence 1 = the direct answer (cash loses purchasing power; match each dollar to its time horizon).
2. How to Match Each Dollar to Its Time Horizon (answering section, FIRST): near-term cash (emergency fund, savings; shop rates, FDIC average is only an average), 12+ months (I bonds, TIPS), long-term (401(k)/IRA limits, tax-advantaged; no inflation guarantee).
3. What the Inflation Numbers Look Like Now: CPI 3.7%, fed funds range, FDIC 0.38%.
4. Our Internal Modeling of $10,000 for One Year: the table from B; attribute to our calculation; how to check (inflation calculator, your own rates); counterexample.
5. I Bonds and TIPS Rules That Change the Answer: limits, 12-month lock, penalty, TIPS floor; link the comparison.
6. What This Guide Does Not Cover: stocks, gold, real estate — we did not model them; unknown.
7. Our Takeaway: for whom (savers with money they will not need for 12+ months), basis = our internal modeling plus Treasury/BLS/FDIC/IRS figures, not a test; condition that changes it (need money inside a year, limit used, inflation falls); next step.

## FAQ — write 5 questions
- How can I protect my savings from inflation?
- Are I bonds worth it when inflation is high?
- Do TIPS protect against inflation?
- Is a savings account losing money to inflation?
- What are the 2026 401(k) and IRA contribution limits?
