# ROW — pmi-cancellation-housing-order

route: /guides/pmi-cancellation-housing-order/
slug: pmi-cancellation-housing-order
page type: explainer (news-driven, reporter register: describe what the order says; it is not law that changes any loan today)
depth floor: 1100 body words
medium: text + one markdown table
register: operator
primary keyword: automatic PMI cancellation
secondary/semantic keywords: when does PMI go away, cancel PMI, PMI removal, mortgage insurance executive order, title insurance waiver refinance, remove PMI based on current home value
reader question: "Does the new housing executive order cancel my PMI automatically?" [fresh trend, no measured volume; demand unmeasured, estimate]
answer: No, not today and not for loans already made. The Oct 22, 2026 order only lets the FHFA Director direct Fannie Mae and Freddie Mac to set up a pilot that applies only to mortgages made after the pilot is established; until then the existing rules (cancel on request at 80% of original value, automatic termination at 78%, or the midpoint of the loan term) are what apply (pick with boundary)
answer placement: section 1 "What the Order Changes and What It Does Not"
search intent: a homeowner with PMI (or a buyer putting under 20% down) who saw the headline and wants to know if their PMI ends sooner and whether the refinance title-insurance change helps them.
SCOUT CORRECTION (must be reflected): the scout said the order "tells" FHFA to pilot cancellation and "makes the title-acceptance pilot permanent". The order text says the FHFA Director "may direct" the Enterprises, only if the Director makes public-interest and safety-and-soundness determinations. Present both sections as conditional, not as done.

## THE CLOSED FACT LIST — every number/date/limit/name this page may state

### A. Reported (the order itself, whitehouse.gov, "Decreasing Housing Costs for the American People", signed October 22, 2026, read 2026-10-26)
- Section 2(a): the FHFA Director may direct Fannie Mae and Freddie Mac to "establish a pilot program, applicable only to mortgages made after the establishment of the pilot program," if the Director determines it is in the public and Enterprise interest. It covers single-family mortgage loans they own, guarantee or securitize.
- Section 2(b)(i): the borrower satisfies "applicable equity requirements based on the property's current market value" (may be determined through an automated valuation model or other approved means).
- Section 2(b)(ii): cancellation must be consistent with financial safety and soundness and with the Enterprise's contractual obligations.
- Section 2(b)(iii): the borrower must satisfy all other applicable statutory, contractual, regulatory and Enterprise requirements.
- The order does NOT state a specific equity percentage and (in the text we read) does not state a payment-history test beyond "all other applicable ... requirements".
- Section 4(a): the FHFA Director may direct the Enterprises to "expand the title acceptance pilot into an ongoing program, available nationwide through both Enterprises", if the Director makes the same public-interest and safety-and-soundness determinations. An Enterprise "may accept an automated title review or other title-risk assessment approved by the FHFA" in place of a lender's title insurance policy, for "eligible refinance transactions".
- Section 4(b)(i): the Director should consider "extending eligibility to refinance transactions with loan-to-value ratios above the current 80 percent limit where title risk remains low."
- Section 4(c): the Director must require that savings "be passed through to borrowers", and lenders must inform borrowers of them.
- Both sections are conditional on the Director acting. Eligibility details, start date and the list of eligible refinances are not published in the order. Unknown.

### B. Reported (existing rules, CFPB "When can I remove private mortgage insurance (PMI) from my loan?", read 2026-10-26)
- You can ask your servicer to cancel PMI on the date the principal balance is scheduled to fall to 80 percent of the original value of the home; you can ask earlier if extra payments bring the balance to 80%.
- The servicer must grant a request if you make it in writing, have a good payment history and are current, certify there are no junior liens, and show the home's value has not dropped below its original value (for example with an appraisal).
- "Original value" is the lower of the contract sales price or the appraised value at purchase. After a refinance it is the appraised value at the refinance.
- Servicers generally must end PMI automatically when the principal balance is scheduled to reach 78 percent of the original value, if you are current on payments (otherwise it is delayed until shortly after you are current).
- The servicer must end PMI the month after you reach the midpoint of the amortization schedule (after 15 years on a 30-year loan) even if the balance has not hit 78%, if you are current.
- Investor loans (Fannie Mae / Freddie Mac): investor guidelines can allow earlier cancellation but cannot be less favorable to the borrower than those rules.
- The CFPB page covers single-family principal residences closed on or after July 29, 1999. FHA and VA loans have different rules.
- CFPB (what-is-PMI page): PMI is generally required on a conventional loan when the down payment is under 20 percent, and it protects the lender, not the borrower.

### C. Calculated (our internal modeling; reproducible: `reports/mindmap-pass/2026-10-26-xtrends/evidence/pmi-cancellation-housing-order/calc.py`, output.txt). Provenance: basis = calculated; scope = $400,000 purchase price, 30-year fixed, scheduled payments only, original value = price, no extra payments; rates 5.5%, 6.5%, 7.5% are scenario inputs we chose, not quotes.
Months until the SCHEDULED balance reaches 80% / 78% of original value:
| down payment | rate | loan | 80% (months, years) | 78% (months, years) |
| 3% | 5.5% | $388,000 | 121 (10.1) | 131 (10.9) |
| 3% | 6.5% | $388,000 | 133 (11.1) | 144 (12.0) |
| 3% | 7.5% | $388,000 | 146 (12.2) | 157 (13.1) |
| 5% | 5.5% | $380,000 | 111 (9.2) | 123 (10.2) |
| 5% | 6.5% | $380,000 | 124 (10.3) | 135 (11.2) |
| 5% | 7.5% | $380,000 | 136 (11.3) | 148 (12.3) |
| 10% | 5.5% | $360,000 | 84 (7.0) | 98 (8.2) |
| 10% | 6.5% | $360,000 | 95 (7.9) | 109 (9.1) |
| 10% | 7.5% | $360,000 | 107 (8.9) | 121 (10.1) |
| 15% | 5.5% | $340,000 | 49 (4.1) | 65 (5.4) |
| 15% | 6.5% | $340,000 | 56 (4.7) | 75 (6.2) |
| 15% | 7.5% | $340,000 | 65 (5.4) | 85 (7.1) |
In every row the 78% date falls before the 180-month midpoint, so on these 30-year inputs the 78% rule is what ends PMI automatically, not the midpoint.
Current-value illustration (the order's pilot refers to current market value but names no percentage; we used an ILLUSTRATIVE 80% for the arithmetic only): $400,000 home, 5% down ($380,000 loan), 6.5%, 30-year fixed. Scheduled balance and the home value at which that balance equals 80% of current value:
- after 2 years: balance $371,221; value $464,026 (+16.0% vs price)
- after 3 years: balance $366,386; value $457,982 (+14.5%)
- after 5 years: balance $355,722; value $444,652 (+11.2%)
- after 7 years: balance $343,582; value $429,477 (+7.4%)
Compare: under today's original-value rule the same borrower waits about 10.3 years (124 months) for the 80% request date and 11.2 years (135 months) for the 78% automatic date.
Counterexample: a buyer who put 20% down has an 80% loan-to-value on day one and has no PMI to cancel, so the order changes nothing for them.
Arithmetic with no assumed premium rate: each 0.1 percentage point of annual PMI rate costs $25.00 a month on a $300,000 loan and $31.67 a month on a $380,000 loan (loan x 0.001 / 12). We do not know any actual PMI rate; the reader must read their own statement.
What this shows and does not show: the model shows how much earlier a current-value test could end PMI if a pilot ever used something like 80%, and that it depends on how much the home has gained. It does not show what the FHFA will adopt, and it is not a measured result.

### D. Unknown / do not state
The pilot's start date, equity percentage, payment-history test, valuation method details, fees for the valuation, which lenders or servicers take part, whether it will ever apply to existing loans, FHA/VA/USDA treatment, actual PMI premium rates, the dollar value of title-insurance savings, the number of eligible refinances, any reaction from lenders or the FHFA Director, and anything about the title pilot's current terms other than the quotes above. Do not state that the order is law that changes any existing loan.

Anything not on this list, you do not know. Never invent a price, limit, statistic or URL; tell the reader to check their servicer statement and the CFPB page. Give no personalized advice.

## THE CLOSED URL LIST — the only external hrefs allowed
- https://www.whitehouse.gov/presidential-actions/2026/10/decreasing-housing-costs-for-the-american-people/
- https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/
- https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/

## Internal links to use (real routes only — use at least 3)
- [mortgage refinance closing costs](/guides/mortgage-refinance-closing-costs/)
- [current mortgage rates guide](/guides/current-mortgage-rates-guide/)
- [mortgage amortization schedule](/mortgage/amortization-schedule/)
- [mortgage refinance calculator](/mortgage/refinance-calculator/)
- [mortgage extra payment calculator](/mortgage/extra-payment-calculator/)

## What to cover, section by section
1. Intro: sentence 1 = the direct answer (No: the order only authorizes a pilot, for loans made after it starts).
2. What the Order Changes and What It Does Not (answering section, FIRST): Section 2 pilot, conditional, after-pilot loans only, current market value equity test, no percentage published; Section 4 title acceptance expansion, "may", eligible refinances, savings pass-through. Include a short bulleted or sentence-form statement of what it does not do (no change to existing loans today).
3. How PMI Ends Today: the 80% request, 78% automatic, midpoint rules with the CFPB conditions; link the CFPB page.
4. Our Internal Modeling of the Timeline: the table in C (we modeled... what we found... how to check: calc inputs stated on the page; reader can run their own loan in the amortization schedule). Attribute to our calculation, not a test. Say the rates are scenario inputs.
5. What a Current-Value Test Could Change: the illustration table/list with +% appreciation needed; the 80% is illustrative; the counterexample (20% down); conditions.
6. The Refinance Title-Insurance Change: what Section 4 says; savings must be passed through; unknown amount; link the refinance closing-cost guide and refinance calculator.
7. Our Takeaway: who benefits now (nobody automatically today; buyers of loans made after a pilot starts, if the FHFA acts), who doesn't (existing borrowers, 20%-down buyers), what to do now (check your statement for the 80% request date, ask your servicer in writing, consider extra payments), condition that changes this (the FHFA publishing pilot terms). Evidence basis: our internal modeling plus the order's text and CFPB, not a test.

## FAQ — write 5 questions
- Does the housing executive order cancel my PMI automatically?
- How do I get PMI removed on my mortgage today?
- At what loan-to-value does PMI automatically end?
- Does the title insurance waiver apply to my refinance?
- Will the new PMI pilot apply to loans I already have?
