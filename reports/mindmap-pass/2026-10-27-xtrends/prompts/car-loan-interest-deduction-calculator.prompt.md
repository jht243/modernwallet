# ROW PROMPT (data only) — car-loan-interest-deduction-calculator

route: /car-loan-interest-deduction-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~140 words, howItWorks ~420 words, 8 FAQs)
primary keyword: car loan interest deduction calculator (also: car loan interest deduction, auto loan interest deduction, no tax on car loan interest calculator)
intent: a person with a loan on a new vehicle wants to know how much of the interest they can deduct on their federal return and what it saves, given their income.
reader question: "How much of my car loan interest can I deduct?" [PAA 0 returned; related searches on income limit, phase out, who qualifies; head term "car loan interest deduction" 12,100/mo KD 6 measured]
answer: A figure plus a condition. Up to $10,000 of interest a year, then $200 off for every $1,000 (or part of $1,000) of modified adjusted gross income (MAGI) above $100,000 ($200,000 married filing jointly). A single filer with $95,000 of MAGI and $4,200 of interest deducts all $4,200, which saves about $924 of federal tax at 22%. The same $4,200 of interest earns $0 at $120,001 of MAGI.
answer placement: section 1 — introText paragraph one gives the answer and what the tool returns; paragraph two is the $95,000 worked example. Do not open with the history of the law or a definition of interest.

## The calculator (describe only what it does)
Inputs: filing status (Single; Married filing jointly; Head of household; Married filing separately); MAGI; how to enter the interest (I know the interest I paid this year, or estimate it from my loan: balance at the start of the year, APR, months left on the loan, payments made during the tax year); the reader's federal marginal tax rate (a percent; 22 is the placeholder).
Outputs: the deduction; the interest counted up to the cap; the amount cut by the income phase-out; federal tax saved at the entered rate; interest that earns no deduction; the number of phase-out steps; the MAGI at which the deduction reaches $0 for that interest.
Method the page may state (the arithmetic of Schedule 1-A, Part IV, lines 24 to 30): take the smaller of the interest paid or $10,000; subtract $100,000 ($200,000 married filing jointly) from MAGI; if that is zero or less there is no cut; otherwise divide by $1,000, round up to the next whole number, multiply by $200, and subtract the result from the capped interest, not below zero.
Assumptions the page must state: the tool assumes the vehicle and loan qualify and does not check it; it leaves out state tax and any interest already deducted on Schedule C, E or F; MAGI is defined in the Schedule 1-A instructions, so confirm it with tax software or a preparer; the lender's year-end statement has the exact interest.
Provenance (calculated, internal modeling): "In our internal modeling, we re-implemented the Schedule 1-A arithmetic in two separate programs and ran the scenarios below through both to see how income and the size of the loan interest change the deduction." The two programs agreed on every scenario. These are modeled scenarios, not tests of any product and not client cases. Tell the reader they can enter the same numbers in the calculator above to check them.
Takeaway (in howItWorks, near the end): for filers at or under $100,000 of MAGI ($200,000 joint) the deduction is the interest up to $10,000, worth that amount times the marginal rate; inside the phase-out every extra $1,000 of MAGI costs $200 of deduction, about $44 of tax at 22%; a smaller interest bill is phased out sooner because the cut is a flat $200 a step (a $4,200 interest bill reaches $0 at $120,001 single, a $10,000 bill at $149,001). Conditions that reverse it: the vehicle or loan does not qualify (then the deduction is $0 whatever the calculator shows), or MAGI is above the zero point. Informational, not tax advice; a preparer settles the individual case.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a tax rate, bracket, state rule, statistic, vehicle list or URL. Do not state any income tax bracket.
- IRS Publication 6126 (1-2026): if you bought a new, personal vehicle in 2025 to 2028 you may be able to deduct interest paid on the vehicle loan. A qualified vehicle includes a car, minivan, van, SUV, pickup truck or motorcycle with a gross vehicle weight rating of less than 14,000 pounds that has undergone final assembly in the United States. The deduction is available to both itemizing and non-itemizing taxpayers. The vehicle identification number (VIN) must be on the tax return for any year the deduction is claimed. The maximum annual deduction is $10,000 and it phases out for MAGI over $100,000 ($200,000 for joint filers). The interest must be paid on a loan for a vehicle that is new, for personal use and purchased after December 31, 2024. If a qualifying vehicle loan is later refinanced, interest paid on the refinanced amount is generally eligible. To check final assembly in the U.S., use the information label attached to the vehicle on a dealer's premises, the VIN, or the National Highway Traffic Safety Administration (NHTSA) VIN decoder.
- Schedule 1-A (Form 1040), 2025, Part IV "No Tax on Car Loan Interest": line 22 lists each vehicle's VIN and the interest for that loan, net of amounts deducted on Schedule C, E or F; line 24 is the smaller of the interest or $10,000; line 26 is $100,000 ($200,000 if married filing jointly); line 27 is MAGI (from line 3) minus line 26; line 28 divides by $1,000 and rounds any partial number up to the next whole number (1.5 becomes 2, 0.05 becomes 1); line 29 multiplies by $200; line 30 is line 24 minus line 29, not below zero.
- Tax years: 2025 through 2028 (Publication 6126). The 2025 form is the one cited here.
- Modeled scenarios (computed by the calculator's code and cross-checked by an independent re-implementation; saved in the run folder; each entered at the stated filing status, 22% rate where tax is stated):
  1. Single, MAGI $95,000, interest $4,200: no phase-out, deduction $4,200, tax saved $924.
  2. Married filing jointly, MAGI $215,000, interest $4,200: MAGI is $15,000 over $200,000, so 15 steps and a $3,000 cut; deduction $1,200; tax saved $264.
  3. Single, interest $12,000 (counted only up to $10,000): MAGI $100,000 gives $10,000; MAGI $100,001 gives $9,800 (one dollar over costs a full $200 step); MAGI $125,000 gives $5,000; MAGI $149,000 gives $200; MAGI $149,001 gives $0. The $2,000 above the cap never earns a deduction.
  4. Married filing jointly, interest $12,000: MAGI $249,000 gives $200; MAGI $249,001 gives $0.
  5. Single, interest $4,200, by MAGI: $100,000 gives $4,200; $105,000 gives $3,200; $110,000 gives $2,200; $120,000 gives $200; $120,001 gives $0.
  6. Estimating the interest: a $45,000 balance at 9% APR with 72 months left, first 12 payments, has about $3,809.58 of interest.
  7. Each extra $1,000 of MAGI inside the phase-out removes $200 of deduction, which is $44 of tax at 22% (200 x 0.22).
- Do not state any other figure, and do not claim anyone saves any particular amount except as the scenarios above.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/pub/irs-pdf/p6126.pdf (IRS Publication 6126). https://www.irs.gov/pub/irs-pdf/f1040s1a.pdf (Schedule 1-A, Form 1040). Nothing else.

## Internal routes it may link (real routes only)
/auto-loan/interest-calculator/ (total interest on a car loan by rate and term), /auto-loan/car-affordability-calculator/ (how much car can you afford), /tax-bracket-calculator/ (find your marginal rate), /compare/standard-vs-itemized-deduction/ (standard vs itemized deduction), /guides/car-loan-mistakes/ (car loan mistakes), /compare/auto-loan-vs-lease/ (auto loan vs lease). No other internal route.

## Coverage
introText: as in the contract. howItWorks (4-5 paragraphs): (1) who qualifies per Publication 6126 (new, personal use, bought after 2024, final assembly in the U.S., under 14,000 pounds, VIN on the return, itemizers and non-itemizers); (2) the Schedule 1-A arithmetic step by step with scenario 1 and the $4,200 sweep (scenario 5), with the visible internal-modeling attribution at the first finding; (3) the cap and the cliff cases: scenario 3 and 4, and the counterexample that a smaller loan is phased out sooner; (4) what the tool leaves out and how to find the interest figure (lender statement; scenario 6); (5) the takeaway.
Who this is not for: someone with a used vehicle, a vehicle assembled outside the U.S., or a business-use loan (interest deducted on Schedule C, E or F is excluded from line 22).

## FAQ questions (verbatim, in this order)
1. How much car loan interest can I deduct?
2. What is the income limit for the car loan interest deduction?
3. Does my car qualify for the car loan interest deduction?
4. Do I need to itemize to deduct car loan interest?
5. Can I deduct interest on a used car?
6. How do I claim the car loan interest deduction?
7. Which tax years does the car loan interest deduction cover?
8. What if I refinance my car loan?
For question 5 say Publication 6126 requires a new vehicle, so a used car does not qualify. For question 6 say Part IV of Schedule 1-A with the VIN. Question 2 must say the deduction falls to $0 at $149,001 of MAGI for $10,000 of interest and at $120,001 for $4,200.
