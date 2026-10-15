# ROW PROMPT (data only) — social-security-cola-calculator

route: /social-security-cola-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → calculator
register: operator
depth floor: intro ~140 words, howItWorks ~420 words, 8 FAQs
primary keyword: social security cola calculator (also: social security 2027 cola increase chart, cola calculator, social security cost of living calculator, social security cola 2027 estimate calculator)
intent: a Social Security beneficiary who saw the 3.6% COLA headline wants their own 2027 monthly amount and a chart of what common benefit amounts become.
reader question: "How do I calculate my COLA increase for 2027?" [PAA cola calculator 3/6 calc-pattern (How do I calculate my COLA?, How do I calculate my COLA increase for 2026?, What is the COLA increase for 2027?); ac 3/8 how-figured]
answer: Figure: multiply your current monthly benefit by 1.036, round down to the dime, then subtract any Medicare Part B premium and round the payment down to the dollar; a $2,000 benefit becomes $2,072.
answer placement: section 1 — introText paragraph one gives the method in its first sentence; paragraph two is the worked example. Do not open with background on what a COLA is.

## The calculator (describe only what it does)
Inputs: "Your monthly Social Security benefit now" (default $2,000; the amount before any Medicare deduction, from the 2026 COLA notice or my Social Security), and "Medicare Part B premium deducted in 2027 (optional)" (default 0, because the 2027 premium has not been announced).
Outputs: estimated 2027 monthly benefit (to the cent), monthly increase, increase over 12 months; when a Part B premium is entered, the payment after Part B (whole dollars) and the Part B amount. Below the calculator, a "2027 COLA increase chart" table: benefit now from $500 to $4,000 in $250 steps, the 2027 benefit and the monthly increase, before any Medicare deduction.
Method the page may state: the 3.6% COLA is applied to the amount entered; the result is rounded down to the next lower dime; if a Part B premium is entered it is subtracted and the payment is rounded down to the next lower whole dollar (SSA POMS RS 00601.020).
Assumptions the page must state: SSA applies the COLA to the primary insurance amount (the benefit at full retirement age) and recomputes the benefit from it, so an early-claim or family benefit can differ from this estimate by cents; the COLA notice is the exact figure; the 2027 Part B premium is not announced; taxes are not modeled.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a premium, a payment date, or a tax figure.
- SSA announced the 3.6% COLA for 2027 on October 14, 2026. It is based on the CPI-W increase from the third quarter of 2025 through the third quarter of 2026.
- Social Security benefits rise starting with the January 2027 payment; SSI payments rise starting December 31, 2026.
- On average, retirement benefits rise $75 a month. Estimated averages before vs after: all retired workers $2,095 → $2,170; aged couple both receiving $3,238 → $3,355; all disabled workers $1,642 → $1,701; aged widow(er) alone $1,936 → $2,005.
- The 2026 COLA was 2.8%. The 2023 COLA was 8.7%.
- COLA notice: online in my Social Security starting late November (enroll in paperless by November 18); by mail in December; a one-page notice with exact dates and dollar amounts of the new benefit and any deductions.
- The 2027 Medicare Part B premium has not been announced; enrollees see it in the my Social Security Message Center starting late November.
- Rounding (SSA POMS RS 00601.020): a monthly benefit amount that is not a multiple of $0.10 is rounded down to the next lower dime; after deductions such as the Part B premium, the payment is rounded down to the next lower whole dollar.
Worked examples (computed by the calculator):
- $2,000 now → $2,072.00 in 2027; +$72.00 a month; +$864.00 over 12 months.
- $1,642 now → $1,701.10; +$59.10 a month. (SSA's estimated average for all disabled workers after the COLA is $1,701.)
- $2,095 now → $2,170.40; +$75.40 a month.
- $1,642 now with a $200 Part B premium entered (an illustration, not the 2027 premium) → payment $1,501.
- Chart rows include: $500 → $518.00 (+$18.00); $1,000 → $1,036.00 (+$36.00); $1,500 → $1,554.00 (+$54.00); $2,500 → $2,590.00 (+$90.00); $3,000 → $3,108.00 (+$108.00); $4,000 → $4,144.00 (+$144.00).
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.ssa.gov/news/en/press/releases/2026-10-14.html (SSA press release, 2027 COLA)
https://www.ssa.gov/news/en/cola/factsheets/2027.html (SSA 2027 COLA fact sheet)
https://secure.ssa.gov/poms.nsf/lnx/0300601020 (SSA POMS RS 00601.020, rounding of benefits)
https://www.ssa.gov/myaccount/ (my Social Security)
https://www.ssa.gov/cola/ (SSA COLA page)

## Internal routes it may link (real routes only)
/guides/2027-social-security-cola/, /guides/social-security-changes-2027/, /guides/2027-ssdi-cola/, /guides/ssi-increase-2027/, /guides/is-social-security-taxable/, /social-security-break-even-calculator/

## Coverage
introText: as in the contract. howItWorks: (1) the three steps (multiply by 1.036, round down to the dime, subtract Part B and round the payment down to the dollar) with the $2,000 example, (2) the chart and how to read it, citing two chart rows, (3) why the estimate can differ by cents (PIA, reduced or family benefits) and that the notice is final, (4) the Part B field — premium not announced, where it will appear, (5) when the raise arrives and where the notice shows up; SSI and SSDI readers pointed to their pages. Link /guides/2027-social-security-cola/ once.

## FAQ questions (verbatim, in this order)
1. How do I calculate my COLA increase for 2027?
2. What is the COLA increase for 2027?
3. How much will a $2,000 Social Security check be in 2027?
4. When will I see the 2027 COLA in my check?
5. Why is my COLA notice a few cents different from the calculator?
6. Does the calculator include the 2027 Medicare Part B premium?
7. Does the COLA apply to SSI and disability benefits?
8. Is my COLA taxable?
For question 8 state no figures and link /guides/is-social-security-taxable/.
