# ROW PROMPT (data only) — paycheck-calculator

route: /paycheck-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / calculator page (floor 1,200 body words: intro + howItWorks + sections + 8 FAQs, tables count as data not prose)
primary keyword: paycheck calculator (also: paycheck tax calculator, take home pay calculator, salary take home calculator, after tax income calculator)
intent: a US W-2 employee who wants to know what they keep from their pay after federal income tax and payroll tax.
reader question: "How much of my paycheck will I keep after federal income tax and payroll tax?" [PAA unread - DataForSEO unavailable; ac 2/12 how-much and accuracy pattern: how much will i net on my paycheck, is paycheck calculator accurate]
answer: At $60,000 single filing, 2026 federal income tax is $5,020 and payroll tax is $4,590, leaving $50,390 a year ($1,938.08 per biweekly check) before any state tax, credits or other withholding. Do not open with a definition and do not make a tax-owed example the headline (the site's bracket calculator does that).
answer placement: section 1 — introText paragraph one is the answer sentence; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: gross pay (default $60,000); whether that amount is per year or per paycheck (default per year); how often you are paid (weekly 52, every two weeks 26, twice a month 24, monthly 12; default every two weeks); filing status (single, married filing jointly, head of household; default single; married filing separately is not offered); pre-tax retirement contribution per year (default $0).
Outputs: take-home pay per paycheck as the headline, with a table of gross pay, pre-tax retirement, federal income tax, Social Security, Medicare and take-home pay per paycheck and per year; federal bracket and taxable income.
Method the page may state: taxable income = gross - pre-tax retirement - standard deduction (never below zero). Federal income tax is computed band by band on 2026 brackets. Social Security = 6.2% of gross up to the wage base. Medicare = 1.45% of gross plus 0.9% of gross above $200,000. Take-home = gross - pre-tax retirement - federal - Social Security - Medicare. Pre-tax retirement lowers income tax only; Social Security and Medicare still apply to full gross.
Assumptions the page must state: annual-liability estimate with the standard deduction, not IRS Publication 15-T withholding; no state or local income tax; no credits; no itemized deductions; no health premiums, HSA or other pre-tax items; no extra W-4 withholding; tips, overtime, senior and qualified business income (QBI) deductions and the child tax credit are not modeled.

## CLOSED FACT LIST — every number or rule the page may state. Anything not on this list, you do not know. Never invent a price, limit, benchmark or URL.
Sources (all IRS, checked 2026-11-15): IRS Revenue Procedure 2025-32 (2026 brackets, https://www.irs.gov/pub/irs-drop/rp-25-32.pdf); IRS release on the 2026 adjustments (standard deduction); IRS Topic no. 751, Social Security and Medicare withholding rates (https://www.irs.gov/taxtopics/tc751); IRS Topic no. 560, Additional Medicare Tax (https://www.irs.gov/taxtopics/tc560).
2026 standard deduction: $16,100 single; $32,200 married filing jointly; $24,150 head of household.
2026 rates: 10%, 12%, 22%, 24%, 32%, 35%, 37%.
2026 single, taxable income thresholds: 10% up to $12,400; 12% over $12,400; 22% over $50,400; 24% over $105,700; 32% over $201,775; 35% over $256,225; 37% over $640,600.
2026 married filing jointly: 10% up to $24,800; 12% over $24,800; 22% over $100,800; 24% over $211,400; 32% over $403,550; 35% over $512,450; 37% over $768,700.
2026 head of household: 10% up to $17,700; 12% over $17,700; 22% over $67,450; 24% over $105,700; 32% over $201,750; 35% over $256,200; 37% over $640,600.
Payroll tax (IRS Topic 751): Social Security 6.2% of wages up to $184,500 in 2026; Medicare 1.45% of all wages; employers withhold an extra 0.9% Additional Medicare Tax on wages above $200,000, whatever the filing status. IRS Topic 560: the final Additional Medicare liability uses $250,000 for married filing jointly, $125,000 for married filing separately and $200,000 for other statuses, so a married couple's final bill can differ from what the calculator withholds.
Worked cases (calculated by the reference model, annual, 26 biweekly checks unless noted):
- Single, $60,000: taxable income $43,900; federal tax $5,020 (10% on $12,400 = $1,240; 12% on $31,500 = $3,780); Social Security $3,720; Medicare $870; payroll tax $4,590; take-home $50,390 a year = $1,938.08 per biweekly check = 84.0% of gross; weekly 52 checks: $969.04.
- Married filing jointly, $60,000: taxable $27,800; federal $2,840; take-home $52,570 (87.6%); $2,021.92 per biweekly check.
- Head of household, $60,000: taxable $35,850; federal $3,948; take-home $51,462 (85.8%); $1,979.31 per biweekly check.
- Single, $100,000 with $10,000 pre-tax retirement: federal $10,970 (instead of $13,170 with no contribution); Social Security $6,200 and Medicare $1,450 unchanged; take-home $71,380 versus $79,180 with no contribution, so a $10,000 contribution lowers take-home by $7,800, not $10,000, because federal tax falls by $2,200.
- Single, $300,000: Social Security stops at $11,439 (the $184,500 wage base times 6.2%); Medicare $5,250.
- Single, $250,000: federal $51,304; Social Security $11,439; Medicare $4,075 (includes $450 Additional Medicare); take-home $183,182 (73.3%).
- Single, $16,100 (equal to the standard deduction): federal tax $0; take-home $14,868.35 (92.3%).
Modeled salary table (INCLUDE THIS TABLE EXACTLY in the "Take-Home Pay at Different Salaries" section), single filer, standard deduction, 26 biweekly checks:
| Gross salary | Federal income tax | Social Security | Medicare | Take-home per year | Take-home per biweekly check | Share of gross |
|---|---|---|---|---|---|---|
| $40,000 | $2,620 | $2,480 | $580 | $34,320 | $1,320.00 | 85.8% |
| $60,000 | $5,020 | $3,720 | $870 | $50,390 | $1,938.08 | 84.0% |
| $100,000 | $13,170 | $6,200 | $1,450 | $79,180 | $3,045.38 | 79.2% |
| $150,000 | $24,734 | $9,300 | $2,175 | $113,791 | $4,376.58 | 75.9% |
Constants table (INCLUDE THIS TABLE EXACTLY in the "2026 Federal Figures Used" section):
| Item | 2026 figure | Source |
|---|---|---|
| Standard deduction, single | $16,100 | [IRS 2026 adjustments](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill) |
| Standard deduction, married filing jointly | $32,200 | [IRS 2026 adjustments](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill) |
| Standard deduction, head of household | $24,150 | [IRS 2026 adjustments](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill) |
| Income tax rates | 10%, 12%, 22%, 24%, 32%, 35%, 37% | [IRS Rev. Proc. 2025-32](https://www.irs.gov/pub/irs-drop/rp-25-32.pdf) |
| Single, top of the 10% and 12% brackets | $12,400 and $50,400 of taxable income | [IRS Rev. Proc. 2025-32](https://www.irs.gov/pub/irs-drop/rp-25-32.pdf) |
| Social Security tax | 6.2% up to $184,500 of wages | [IRS Topic 751](https://www.irs.gov/taxtopics/tc751) |
| Medicare tax | 1.45% of all wages | [IRS Topic 751](https://www.irs.gov/taxtopics/tc751) |
| Additional Medicare withholding | 0.9% of wages above $200,000 | [IRS Topic 751](https://www.irs.gov/taxtopics/tc751) |
Provenance (calculated, not tested): "In our internal modeling, we ran 2026 federal brackets and payroll tax across salaries from $40,000 to $150,000 to estimate take-home pay." State this once beside the salary table, with the assumption (single filer, standard deduction, no state tax) beside it. Never say "testing" or "tested". The sourced inputs are IRS figures; do not imply we measured them.
Takeaway (intent: informational estimate with a conditional answer): A single filer at $60,000 keeps about $50,390 a year before state tax, about 84% of gross. It applies to W-2 employees on the standard deduction. The answer changes with state tax, credits, itemizing, extra W-4 withholding or health premiums. It is an estimate, not withholding advice.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/pub/irs-drop/rp-25-32.pdf (IRS Revenue Procedure 2025-32)
https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill (IRS 2026 adjustments)
https://www.irs.gov/taxtopics/tc751 (IRS Topic no. 751)
https://www.irs.gov/taxtopics/tc560 (IRS Topic no. 560)
Link the first mention of the Internal Revenue Service (IRS) sources with these deep links.

## Internal routes it may link (real routes only)
/tax-bracket-calculator/ (anchor "federal tax bracket calculator"), /salary-calculator/ (anchor "salary calculator"), /budget/ (budget calculator), /guides/how-much-tax-will-i-pay/ (federal tax owed), /pto-cashout/ (PTO cash-out), /calculators/ (all calculators). No other internal route.

## Sections (use these headings verbatim, in this order)
1. "2026 Federal Figures Used": one lead sentence, then the Constants table above exactly, then one sentence linking "federal tax bracket calculator" for bracket detail and stating the figures were checked on the IRS pages on 2026-11-15.
2. "Take-Home Pay at Different Salaries": a short lead paragraph carrying the internal-modeling attribution and the assumption, then the salary table exactly, then one paragraph: take-home share falls from 85.8% to 75.9% as pay rises because income tax rises with the bracket while Social Security stops at $184,500; also give the pre-tax $10,000 example (take-home down $7,800 not $10,000) and the married filing jointly and head of household $60,000 cases.
3. "What This Estimate Leaves Out": list (use a bulleted list, one item per line starting "- ") of: state and local income tax; credits (including the child tax credit); itemized deductions; health premiums, HSA and other pre-tax items; extra W-4 withholding; tips, overtime, senior and qualified business income deductions. Then a paragraph: this is an annual-liability estimate, not IRS Publication 15-T withholding, so an employer's actual check can differ; the 0.9% Additional Medicare withholding is modeled for all statuses above $200,000 while a married couple's final liability uses the Topic 560 thresholds. Then one sentence on who this is not for (self-employed or 1099 income, multiple jobs, anyone who itemizes) and one on what would change the answer (state tax, extra withholding, credits). Close with the next action sentence: enter your own gross pay and filing status in the paycheck calculator above, then compare the result with your pay stub.
Also: howItWorks heading is "How Take-Home Pay Is Calculated". Add key "howItWorksHeading": "How Take-Home Pay Is Calculated" to the JSON in addition to the contract keys. NOTE: place the sections in this order; the sections key follows howItWorks on the page.

## Coverage
introText: as in the contract. howItWorks: (1) the formula with the $60,000 single numbers (link "salary calculator" for converting pay periods); (2) how federal tax is figured band by band on the standard deduction; (3) Social Security cap and Medicare; (4) pre-tax retirement lowers income tax only.
Neutrality: explain; no personalized tax advice; link only IRS pages; for exact withholding the reader can check their pay stub and Form W-4 with their employer (do not tell them to "check" without the linked IRS page — if you send them to the IRS withholding estimator, only link a URL on the closed list, otherwise omit).
Who this is not for / what would change the answer: as in the sections.

## FAQ questions (verbatim, in this order)
1. How much of my paycheck will I keep after taxes?
2. Is a paycheck calculator accurate?
3. How do I calculate my paycheck manually?
4. Does this paycheck calculator include state tax?
5. Why is my real paycheck different from this estimate?
6. How does a 401(k) contribution change my take-home pay?
7. Why does Social Security tax stop on high salaries?
8. Does a paycheck calculator include Medicare tax?
