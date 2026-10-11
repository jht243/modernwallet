# ROW PROMPT (data only) — social-security-break-even-calculator

route: /social-security-break-even-calculator/   page type: calculator hub entry (JSON keys per the output contract)
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: social security break even calculator (also: social security break even age, when to take social security calculator, social security claiming age calculator)
secondary keywords: social security break even calculator by age, 62 vs 67 vs 70, social security break even 65 vs 67
intent: a person near retirement wants to know at what age claiming Social Security later, instead of earlier, pays more in total, using their own benefit from their SSA statement.
reader question: "At what age does waiting to claim Social Security pay off?"
answer: A verdict with the break-even: with a full retirement age of 67, claiming at 67 instead of 62 catches up at age 78 and 8 months, and claiming at 70 instead of 67 at age 82 and 6 months; the calculator works it out for the reader's own benefit and ages.
answer placement: section 1 — introText paragraph one gives the answer in its first sentence (what the break-even age is and that it is the age past which the later claim pays more in total); paragraph two is the worked example. Do not open with background on what Social Security is.

## The calculator (describe only what it does)
Inputs: monthly benefit at full retirement age (from the reader's Social Security statement), year born, an earlier and a later claiming age (dropdowns, whole years 62 to 70), and an optional yearly cost-of-living increase (default 0, meaning today's dollars).
Outputs: the break-even age; the monthly benefit at each of the two claiming ages; each as a share of the full-retirement-age benefit; the reader's full retirement age; a table of total benefits received by ages 70, 75, 80, 85, 90 and 95 for each claim.
Method the page may state: the benefit is reduced 5/9 of 1% per month for the first 36 months before full retirement age and 5/12 of 1% per month for each month beyond 36; delayed retirement credits add 2/3 of 1% per month, which is 8% a year, after full retirement age up to age 70; no credits accrue after 70. Totals start at each claiming age and add one monthly payment per month. The break-even age is the first age at which the later claim's running total reaches the earlier claim's. A cost-of-living increase, when entered, raises both claims by the same percentage each year.
Assumptions the page must state: claiming ages are whole years; the benefit typed is the full-retirement-age amount from the reader's statement and the calculator does not estimate it; the earnings test, income taxes, and spousal and survivor benefits are not modeled; the break-even age is only one input to the decision, alongside health, other income and a spouse's benefits.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a benefit amount, a life expectancy, an average benefit, a COLA percentage, or a trust-fund date. Say it is unpublished here and tell the reader to check ssa.gov.
SSA rules:
- Earliest claiming age: 62. Delayed retirement credits stop at 70.
- Full retirement age: 66 for people born 1943 through 1954; 66 and 2 months (1955), 66 and 4 months (1956), 66 and 6 months (1957), 66 and 8 months (1958), 66 and 10 months (1959); 67 for people born 1960 or later.
- Early reduction: 5/9 of 1% per month for up to 36 months before full retirement age, plus 5/12 of 1% for each additional month.
- With a full retirement age of 67, claiming at 62 pays 70% of the full benefit (a 30% reduction); claiming at 65 pays about 86.7%.
- Delayed retirement credits: 2/3 of 1% per month (8% a year) after full retirement age until 70; with a full retirement age of 67, claiming at 70 pays 124% of the full benefit.
- 2026 earnings test: if you claim before full retirement age and keep working, SSA withholds $1 for every $2 earned above $24,480; in the year you reach full retirement age, $1 for every $3 above $65,160. Withheld benefits are not lost; the monthly benefit is raised at full retirement age to account for them.
Worked example (computed by the calculator; benefit at full retirement age $2,000, born 1962, so full retirement age 67, no cost-of-living increase):
- Claim at 62: $1,400 a month. Claim at 67: $2,000 a month. Claim at 70: $2,480 a month.
- 62 versus 67: break-even at age 78 and 8 months.
- 67 versus 70: break-even at age 82 and 6 months.
- 62 versus 70: break-even at age 80 and 5 months.
- 65 versus 67: claiming at 65 pays $1,733 a month; break-even at age 80.
- Totals received by age 80: $302,400 claiming at 62, $312,000 claiming at 67.
- Totals received by age 85: $386,400 claiming at 62, $432,000 claiming at 67.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.ssa.gov/benefits/retirement/planner/agereduction.html (SSA: retirement age and benefit reduction)
https://www.ssa.gov/benefits/retirement/planner/delayret.html (SSA: delayed retirement credits)
https://www.ssa.gov/benefits/retirement/planner/ageincrease.html (SSA: full retirement age by birth year)
https://www.ssa.gov/myaccount/ (my Social Security account, where the statement is)
https://www.ssa.gov/oact/cola/rtea.html (SSA: earnings test exempt amounts)

## Internal routes it may link (real routes only)
/retirement/social-security-retirement-calculator/ (add the benefit to a savings projection), /guides/is-social-security-taxable/, /guides/does-retirement-income-count-as-income-for-social-security/, /retirement/, /coast-fire/

## Coverage
introText: as in the contract. howItWorks: (1) how the early reduction is applied, with the 62 = 70% example, (2) how delayed credits are applied, with the 70 = 124% example, (3) how the running totals and break-even age are found, with the 62 vs 67 and 67 vs 70 results and the age-80/85 totals, (4) what the cost-of-living input does (scales both claims alike, so it changes totals more than the break-even age) in plain words, no figures, (5) assumptions and what is not modeled, and a line that the break-even age is one input to the decision. Link /retirement/social-security-retirement-calculator/ once as the place to add the benefit to a savings projection.

## FAQ questions (verbatim, in this order)
1. What is a Social Security break-even calculator?
2. What is the break-even age for claiming at 62 vs 67?
3. Should I take Social Security at 65 or 67?
4. How much more do I get by waiting until 70?
5. Where do I find my benefit at full retirement age?
6. Does working before full retirement age change the math?
7. Does this calculator include spousal or survivor benefits?
8. Is Social Security taxable?
For question 3 give the 65 vs 67 figures and say the answer depends on health, other income and a spouse; no recommendation. For question 5 point to the statement in a my Social Security account and link https://www.ssa.gov/myaccount/. For question 6 use the 2026 earnings-test figures and link https://www.ssa.gov/oact/cola/rtea.html. For question 7 say no and that SSA's rules for those differ. For question 8 state no figures and link /guides/is-social-security-taxable/.
