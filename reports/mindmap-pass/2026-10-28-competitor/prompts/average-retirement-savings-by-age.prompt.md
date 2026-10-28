# ROW 1 — average-retirement-savings-by-age

route: /guides/average-retirement-savings-by-age/
slug: average-retirement-savings-by-age
page type: explainer/guide (finance YMYL)
depth floor: 1200 body words
medium: text + one markdown table
register: operator
primary keyword: average retirement savings by age
secondary/semantic keywords: median retirement savings by age, average 401k savings by age, average retirement savings by age in the us, average retirement savings at 30 40 50 60
reader question: "What is the average retirement savings by age?" [ac 20/20 question-pattern (Autocomplete sweep, estimate, NOT measured); no PAA available (DataForSEO unavailable)]
answer: Among families with an IRA or workplace plan, the average balance runs from $48,400 for those under 35 to $670,200 for those 55 to 64 (Federal Reserve, 2025). Across all ages the typical (median) saver holds $106,000, far below the all-ages average of $451,100. (figure)
answer placement: section 1 "Average Retirement Savings by Age in 2025"
search intent: an adult comparing their own balance to peers; ends with what to do if below, and why the average is the wrong yardstick.

## THE CLOSED FACT LIST — every number/date/limit/name this page may state

### A. Reported (Federal Reserve, "Changes in U.S. Family Finances from 2022 to 2025: Evidence from the Survey of Consumer Finances", released October 9, 2026; Box 2, Table A)
- Table A, "Mean retirement savings among those with an individual retirement account or a defined contribution plan, by age group", thousands of dollars:
  - Less than 35: 2016 43.8; 2019 38.3; 2022 53.8; 2025 48.4
  - 35 to 44: 2016 135.2; 2019 167.5; 2022 154.8; 2025 182.4
  - 45 to 54: 2016 291.3; 2019 323.1; 2022 342.7; 2025 415.8
  - 55 to 64: 2016 504.8; 2019 518.2; 2022 588.5; 2025 670.2
- Box 2 discusses only families whose reference person is aged 64 or younger, to capture families who generally have not retired.
- The Fed says average combined balances increased between 2022 and 2025 for all age groups except the youngest, and that median values increased for all age groups, but the median values by age are "not shown" in this release.
- Asset table: retirement accounts were held by 54.3 percent of families in 2022 and 54.9 percent in 2025. Among families that hold them, the median balance rose from $95,200 to $106,000 (up 11 percent) and the mean from $365,700 to $451,100 (up 23 percent).
- Box 2: participation in any retirement plan (IRA, defined contribution plan or defined benefit pension) among families aged 64 or younger was 65.1 percent in 2025, up from 64.4 percent in 2022; about 70 percent of families aged 45 to 64 and 66 percent of those aged 35 to 44 participated. Around 50 percent of the youngest families had a DC or IRA plan, up from 42 percent in 2016, and around 65 percent of the oldest.
- Definitions the Fed gives: retirement accounts include IRAs and certain employer-sponsored accounts such as 401(k), 403(b) and thrift savings accounts. "Conditional" figures are for families that hold the asset.
- INFLATION (added after Phase 4): the report states "all dollar amounts from the SCF are adjusted to 2025 dollars" (scf26.pdf page 2 note 4 and Appendix A, Adjustment for Inflation). Table A earlier-year means (2016, 2019, 2022) are therefore in 2025 dollars, and the 2022 to 2025 percent changes are inflation-adjusted (real) changes.
- DATE: the report is dated October 2026. Do not give a day of the month.
- 2019 to 2022 the 35 to 44 mean also fell (167.5 to 154.8 thousand), so the under-35 group is not the only one that fell in a period.
### B. Calculated (our internal calculation; reproducible: reports/mindmap-pass/2026-10-28-competitor/evidence/average-retirement-savings-by-age/calc.py and output.txt). Provenance: basis = calculated from the Fed's published figures; scope = families aged 64 or younger with an IRA or DC plan; the percent changes compare Table A's 2022 and 2025 means; values are the Fed's 2025-dollar figures, so the changes are inflation-adjusted.
- Change in the mean, 2022 to 2025: under 35 down 10.0 percent; 35 to 44 up 17.8 percent; 45 to 54 up 21.3 percent; 55 to 64 up 13.9 percent.
- Each age group's 2025 mean as a multiple of the next-younger group: 35 to 44 is 3.77 times under 35; 45 to 54 is 2.28 times 35 to 44; 55 to 64 is 1.61 times 45 to 54.
- All-ages (families holding retirement accounts) 2025 mean is $451,100, which is 4.26 times the $106,000 median. This ratio is for all ages together; it is not a by-age figure and the by-age medians are not published in this release.
- What this shows: averages are pulled up by a few very large balances, so a person near the average is above the typical saver. It does not say what balance anyone needs.
### C. Unknown / do not state
Median balance for any age group; any figure for ages 65 and older from this release; Social Security or pension values; how much anyone should have saved; rates of return; any 2022 median by age; any figure from a source not listed here; the share of all adults (not families) with accounts.

Anything not on this list, you do not know. Never invent a price, limit, statistic or URL. Give no personalized advice. Do not claim we tested or surveyed anyone.

## THE CLOSED URL LIST — the only external hrefs allowed
- https://www.federalreserve.gov/publications/files/scf26.pdf
- https://www.federalreserve.gov/econres/scfindex.htm

## Internal links to use (real routes only — use at least 3)
- [retirement savings calculator](/retirement/retirement-savings-calculator/)
- [401(k) calculator](/retirement/401k-calculator/)
- [how much you need to retire by age](/guides/how-much-do-i-need-to-retire-by-age/)
- [retirement income calculator, for readers 65 and older](/retirement/retirement-income-calculator/)
- [average HSA balance by age](/guides/average-hsa-balance-by-age/)
- [2026 IRA contribution limits](/guides/ira-contribution-limits-2026/)
- [2026 401(k) contribution limits](/guides/401k-contribution-limits-2026/)

## What to cover, section by section
1. Intro: sentence 1 = the direct answer (the means by age and the all-ages median).
2. Average Retirement Savings by Age in 2025 (answering section, FIRST): markdown table of the four age groups, 2022 and 2025 means, change; say clearly who is counted (families with an IRA or DC plan, ages 64 or younger) and that medians by age are not published in this release.
3. Mean Versus Median: the $451,100 vs $106,000 all-ages gap (4.26 times), why the average overstates the typical saver; what percent of families hold accounts (54.9 percent).
4. How the Averages Changed From 2022 to 2025: our calculation, with attribution "In our internal calculation, we compared..." plus how readers can check (Table A in the Fed report; the arithmetic is simple division).
5. What the Numbers Leave Out: no ages 65+, no Social Security or pensions, families rather than individuals, balances not needs.
6. What to Do If You Are Below Average: use the calculator and contribution limit guides; no personalized advice.
7. Our Takeaway: answer, who it applies to, evidence basis = Fed reported figures plus our calculation (not a test), the condition that changes it (compare to the median or to your own target, not the mean), the next step (run the retirement savings calculator with your numbers).

## FAQ — write 5 questions
- What is the average retirement savings by age?
- What is the median retirement savings for all ages?
- Why is the average so much higher than the median?
- How many families have a retirement account?
- Does this include Social Security?

## Rules from the Phase 4 audit
- The by-age medians are unpublished. Never say a by-age average sits above the typical saver of that age; only the all-ages mean (4.26 times the median) supports that direction, and say so as an all-ages statement.
- The retirement savings calculator projects savings and a 4 percent rule income; it does not compare you to age averages. Describe it that way.
- Do not write "this page", "if you searched", or any sentence about the page or the reader's search.
