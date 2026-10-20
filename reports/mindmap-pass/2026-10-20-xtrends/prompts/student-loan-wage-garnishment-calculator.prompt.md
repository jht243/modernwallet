# ROW PROMPT (data only) — student-loan-wage-garnishment-calculator

route: /student-loan-wage-garnishment-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~140 words, howItWorks ~420 words, 8 FAQs)
primary keyword: student loan wage garnishment calculator (also: how much can be garnished for student loans, student loan default garnishment 15%)
intent: a borrower in default, or close to it, who has read that collections may expand and wants to know in dollars what the government could take from their pay, tax refund and Social Security.
reader question: "How much of my paycheck could be garnished for defaulted student loans?"
answer: Up to 15% of your disposable pay per paycheck, which is the pay left after legally required deductions. On $2,000 of disposable pay every two weeks that is $300 per paycheck, about $650 a month and $7,800 a year. Do not open with a definition.
answer placement: section 1 — introText paragraph one gives the 15% rule and the $300 figure; paragraph two is the worked example with the tax refund added.

## The calculator (describe only what it does)
Inputs: defaulted federal student loan balance (default $30,000); disposable pay per paycheck (default $2,000); pay frequency (default every two weeks); expected federal tax refund (default $3,000); monthly Social Security benefit (default $0).
Outputs: the most a wage garnishment could take per paycheck as the headline, with the monthly and yearly amounts; the tax refund that could be taken; the Social Security offset per month; total exposure over the first 12 months; and months of garnishment alone to clear the balance.
Method the page may state: wage garnishment = 15% of disposable pay per paycheck. Refund offset = the refund, up to the balance. Social Security offset = the lesser of 15% of the monthly benefit or the amount of the benefit above $750. First-year total = 12 months of wage garnishment + refund + 12 months of Social Security offset, never more than the balance. Monthly wage garnishment = 15% of disposable pay x paychecks per year / 12.
Assumptions the page must state: the tool does not add interest or collection costs to the balance; it does not model other garnishments, state rules, or a hardship hearing; disposable pay is entered by the reader, so voluntary deductions such as 401(k) contributions or health premiums must be left in; the Education Department has not announced when expanded collections will start.

## CLOSED FACT LIST — every number or rule the page may state. Anything not on this list, you do not know. Never invent a price, limit, benchmark or URL.
Rules:
- An administrative wage garnishment for a defaulted federal student loan may not take more than 15 percent of disposable pay in any pay period, unless the borrower agrees in writing to more (20 U.S.C. 1095a(a)(1)).
- Disposable pay is the part of pay that remains after legally required withholdings are subtracted (20 U.S.C. 1095a(e)).
- The borrower must get written notice at least 30 days before garnishment proceedings start, and gets a hearing if they file a petition within 15 days of the notice's mailing (20 U.S.C. 1095a(a)(2), (b)).
- The Treasury can use part or all of a federal tax refund to pay certain unpaid debts and sends the remainder to the filer (IRS). The Treasury offset notice says offset is scheduled to begin in 65 days; a repayment agreement with the first payment made within 65 days of the notice avoids offset, and a hearing request must be postmarked within 65 days of receiving the notice (studentaid.gov).
- A Social Security offset takes the lesser of 15 percent of the monthly benefit or the amount by which the monthly benefit exceeds $750 (31 CFR 285.4). Example from the rule: an $850 benefit has a $100 cap.
- Federal student loans enter default after 270 days without a payment (studentaid.gov default page).
- Rehabilitation requires nine on-time agreed payments over roughly 10 months and removes the default record; Direct Consolidation can resolve the default in weeks but leaves the default record (already stated on /guides/what-happens-if-you-dont-pay-your-student-loans/).
Reported news (present as reporting, not as announced policy):
- The Washington Sun reported on Oct 19, 2026, that the administration is preparing to penalize roughly 10 million borrowers in default, likely starting next year, using wage garnishment and offsets of tax refunds and Social Security. Treasury is moving to hire private debt collectors, possibly as soon as November. An announcement is unlikely before the midterm elections, and some officials want garnishment to begin for the 2027 tax year. The Education Department has not confirmed these plans.
Worked examples (computed by the calculator):
- Disposable pay $2,000 every two weeks (26 paychecks), balance $30,000, refund $3,000, no Social Security: wage garnishment $300 per paycheck, $650 a month, $7,800 a year; refund taken $3,000; first-year total $10,800; about 47 months of garnishment alone to clear the balance (46.15 months rounds up to 47).
- Same pay, balance $5,000: the first-year total is capped at the $5,000 balance, and garnishment alone clears it in about 8 months (7.69 rounds up to 8).
- Disposable pay $1,500 every two weeks, balance $20,000, no refund, Social Security $1,800 a month: wage garnishment $225 per paycheck, $487.50 a month, $5,850 a year; Social Security offset $270 a month; first-year total $9,090.
- Social Security benefit $800 a month: 15% is $120 but only $50 sits above $750, so the offset is $50.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.law.cornell.edu/uscode/text/20/1095a (20 U.S.C. 1095a)
https://www.law.cornell.edu/cfr/text/31/285.4 (31 CFR 285.4)
https://www.irs.gov/newsroom/tax-refunds-may-be-applied-to-offset-certain-debts (IRS)
https://studentaid.gov/articles/default/ (Federal Student Aid)

## Internal routes it may link (real routes only)
/guides/what-happens-if-you-dont-pay-your-student-loans/ (the 270-day timeline and the two ways out), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) the 15% rule and what disposable pay is; (2) the refund and Social Security offset rules with the $850 example; (3) the notice and hearing windows (30 days, 15 days, 65 days); (4) the three worked examples; (5) what the tool leaves out and who should not rely on it: private student loan holders (private lenders cannot use these tools), borrowers not in default, anyone with other garnishments or a hardship claim; say the expanded-collections timing is reported, not announced. Link the default guide once where getting out of default is discussed.
Neutrality: report the plans as reporting; do not predict dates or urge any action beyond contacting the servicer and checking studentaid.gov.
Who this is not for: private loan borrowers, borrowers who are current.
What would change the answer: other garnishments, collection costs, a hearing outcome, and the Education Department's announcement.

## FAQ questions (verbatim, in this order)
1. How much can the government garnish from my paycheck for defaulted student loans?
2. What counts as disposable pay?
3. Can my tax refund be taken for a defaulted student loan?
4. Can Social Security be garnished for student loans?
5. Do I get notice before wage garnishment starts?
6. Are student loan collections really coming back after the midterms?
7. Does this apply to private student loans?
8. How do I stop garnishment or offset?
