# ROW PROMPT (data only) — salary-inflation-calculator

route: /salary-inflation-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~150 words, howItWorks ~500 words, 8 FAQs)
primary keyword: salary inflation calculator (also: salary inflation calculator by year, how much should my salary go up with inflation, annual salary inflation calculator)
intent: an employee who knows an old salary and today's pay wants to know whether the pay kept up with prices, and how big a raise matches inflation now.
reader question: "How much should my salary go up with inflation?" [PAA 2/6 method/raise ("How to calculate inflation rate for salary?", "How much should my salary go up with inflation?"), 3/6 past-salary-worth-today; ac 12/16 on salary/raise calculators; head term 3,600/mo KD 43 measured, DataForSEO US 2026-10-28]
answer: A figure plus a verdict. Multiply the old salary by the consumer price index now and divide by the index for the year you earned it; pay at or above that figure kept up, pay below it lost buying power. $52,000 in 2010 equals about $80,350 in September 2026 dollars, so a $78,000 salary today is about 2.9% behind. To keep pace with the last 12 months of prices, a raise of about 3.7% is needed.
answer placement: section 1 — introText paragraph one gives the rule and the 3.7% figure; paragraph two is the $52,000-in-2010 worked case. Do not open with a definition of inflation.

## The calculator (describe only what it does)
Inputs: "Your salary back then" (dollars); "Year you earned it" (a list from 1913 to 2025); "Your salary now (optional)". Defaults: $52,000, 2010, $78,000.
Outputs: the old salary in September 2026 dollars and the price rise since that year; whether today's pay beat or fell behind inflation, by how many dollars and what percent; the average raise per year; the real change in pay per year after inflation; the raise that matches the last 12 months of prices (3.7%) and the salary after that raise.
Method the page may state: adjusted salary = old salary × CPI-U for September 2026 ÷ CPI-U annual average for the year earned. Gap = today's salary − adjusted salary. The average yearly figures treat an annual average as mid-year, so 2010 to September 2026 counts as about 16.2 years. The keep-pace raise = today's salary × the 12-month CPI-U change.
Assumptions the page must state: national CPI-U for all items, not seasonally adjusted; gross annual pay for both salaries; taxes, benefits and local cost of living are left out; a different index (for example CPI-W) gives slightly different figures; the latest index month is September 2026 and the figures move when the Bureau of Labor Statistics publishes a new month.
Provenance (calculated, internal calculation): "In our internal calculation, we applied the Bureau of Labor Statistics CPI-U annual averages for every year from 1913 to 2025 to sample salaries and checked each result in two separate programs." Both programs agreed on every scenario below. These are calculated scenarios, not survey data and not client cases. Tell the reader they can enter the same numbers in the calculator above to check them.
Takeaway (in howItWorks, near the end): compare today's pay with the CPI-adjusted figure; matching it means the same buying power, above it is a real raise, below it is a pay cut in real terms even if the paycheck grew; asking for at least the latest 12-month change (about 3.7%) keeps pace this year. Conditions that change it: your own costs or city may have risen faster or slower than the national index; a promotion or new job is not the same as an inflation raise; taxes take part of any raise. Not career or financial advice.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a price index value, wage statistic, raise survey, tax figure or URL. Do not cite average raise budgets or wage-growth data; you have none.
- Source: U.S. Bureau of Labor Statistics (BLS), Consumer Price Index for All Urban Consumers (CPI-U), U.S. city average, all items, not seasonally adjusted, 1982-84 = 100, series CUUR0000SA0, retrieved from the BLS Public Data API on October 28, 2026. Page: https://data.bls.gov/timeseries/CUUR0000SA0 . General CPI page: https://www.bls.gov/cpi/
- CPI-U values: September 2026 = 336.94 (the latest month in the data); September 2025 = 324.8; annual averages: 1990 = 130.7, 1996 = 156.9, 2000 = 172.2, 2010 = 218.056, 2020 = 258.811, 2025 = 321.943. The data runs from 1913 (annual average 9.9).
- The 12-month CPI-U change from September 2025 to September 2026 is about 3.7%.
- BLS did not publish an October 2025 index.
- Calculated scenarios (September 2026 dollars; both programs agree):
  1. $52,000 in 2010 = $80,350. Prices are up 54.5% since 2010. Against a $78,000 salary today: $2,350 behind, 2.9% less buying power. Average raise about 2.5% a year; real change about −0.2% a year (16.2 years). A 3.7% raise on $78,000 is $2,915.
  2. $100,000 in 2000 = $195,668 (prices up 95.7%).
  3. $50,000 in 1996 = $107,374.
  4. $80,000 in 1990 = $206,237 (prices up 157.8%).
  5. $50,000 in 2020 = $65,094 (prices up 30.2%).
  6. $50,000 in 2010 = $77,260; $50,000 in 2000 = $97,834; $50,000 in 1990 = $128,898.
  7. Counterexample: $60,000 in 2020 = $78,113. A $64,000 salary today is a 6.7% raise in dollars but 18.1% behind prices ($14,113 short).
  8. $1 in 1913 = $34.03.
  9. A $50,000 salary in earlier years, in September 2026 dollars: 1970 = $434,201; 1980 = $204,454; 1985 = $156,571; 1995 = $110,545; 2005 = $86,262; 2015 = $71,079; 2019 = $65,897; 2022 = $57,566; 2024 = $53,706.
  10. Year-over-year change in the CPI-U annual average (calculated from the same BLS data): 1979 11.3%; 1980 13.5%; 1981 10.3%; 2009 −0.4% (prices fell slightly, so pay held flat that year did not lose buying power); 2019 1.8%; 2020 1.2%; 2021 4.7%; 2022 8.0%; 2023 4.1%; 2024 2.9%; 2025 2.6%.
  11. Annual average CPI-U values: 1970 = 38.8; 1980 = 82.4; 1985 = 107.6; 1995 = 152.4; 2005 = 195.3; 2015 = 237.017; 2019 = 255.657; 2022 = 292.655; 2024 = 313.689.
- Do not state any other figure.

## CLOSED URL LIST — only external hrefs allowed
https://data.bls.gov/timeseries/CUUR0000SA0 (BLS CPI-U series). https://www.bls.gov/cpi/ (BLS Consumer Price Index). Nothing else.

## Internal routes it may link (real routes only)
/inflation-calculator/ (inflation calculator: what any amount from a past year is worth today, or what prices cost later), /tax-bracket-calculator/ (find your tax bracket), /budget/household-budget-calculator/ (household budget calculator), /investing/compound-interest-calculator/ (compound interest calculator). No other internal route.

## Coverage
Add to howItWorks paragraph (2) or (4) a short look at how fast prices moved in different years (scenario 10: the 1979 to 1981 run, the 2009 dip, and 2021 to 2023), so the reader sees why the start year matters, and use scenario 9 for a few more reference points.
introText: as in the contract. howItWorks (4-5 paragraphs): (1) the formula and the BLS series, with the visible internal-calculation attribution at the first finding (scenario 1); (2) reading the result: behind, even or ahead, average raise vs real change, with the counterexample (scenario 7) showing a dollar raise that still lost ground; (3) the keep-pace raise and how to use the figure in a raise conversation (3.7%, $2,915 on $78,000); (4) when the national index misleads: your own costs, city, a promotion vs an inflation raise, taxes; pick the /inflation-calculator/ for any amount that is not a salary; (5) the takeaway.
Who this is not for: someone comparing pay across two cities (a national index does not measure local costs), or someone who wants to know what a non-salary amount is worth today (use the inflation calculator).

## FAQ questions (verbatim, in this order)
1. How do I calculate my salary with inflation?
2. How much should my salary go up with inflation?
3. How much is a $100,000 salary in 2000 worth today?
4. How much is a $50,000 salary in 1996 worth today?
5. What is an $80,000 salary in 1990 worth today?
6. Did my salary keep up with inflation if I got a raise every year?
7. Which inflation measure does this calculator use?
8. Why do inflation calculators start in 1913?
For question 8 say the BLS CPI-U data used here begins in 1913; do not explain why BLS started then (you do not know).

# CORRECTIONS FROM THE PHASE 4 AUDIT (pre-audit depth check)
- depth: the previous draft had 1,102 body words (intro + howItWorks + FAQ answers) against the 1,200-word floor. Use the added facts 9 to 11 to answer more of the reader's question (which years moved prices most, more salary reference points); do not pad or restate. Target about 1,350 body words.
