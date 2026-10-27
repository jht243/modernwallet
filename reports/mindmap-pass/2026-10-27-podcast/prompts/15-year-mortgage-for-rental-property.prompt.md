# ROW PROMPT — 15-year-mortgage-for-rental-property (guide page, ModernWallet)

## PAGE
- route: /guides/15-year-mortgage-for-rental-property/
- slug: 15-year-mortgage-for-rental-property
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1,200 words minimum. A shorter page of listed facts beats padding.
- register: operator
- updated date: 2026-10-27

## KEYWORDS + INTENT
- primary keyword: 15 year mortgage for rental property (about 250/mo, DataForSEO ESTIMATE band 250 to 2,500, NOT measured; autocomplete corroborates; also the topic of a recent Rental Income Podcast episode; do not quote a volume on the page)
- secondary keywords (Google Autocomplete completions observed 2026-10-27, no tool volume): 15 year mortgage for investment property; 15 year investment property mortgage rates
- intent: A small landlord or first-time rental buyer choosing a loan term wants to know whether the 15-year term makes sense on a rental, and what it does to cash flow.
- SERP: winnable but forum-dominated (Reddit is result #1, plus YouTube), AI Overview present; page one also has Bankrate, Forbes and lender blogs.
- reader question: "Does a 15-year mortgage make sense for a rental property?" [PAA 3/6 on-topic (monthly payment for a 15-year loan on $100,000, how hard it is to qualify for a 15-year mortgage, what percent of people take a 15-year loan); 3/6 off-topic or unverifiable (the 7% rule, two Dave Ramsey questions); ac 2/2 investment-property forms]
- answer: It makes sense only when the rent clears the higher payment with room to spare: in the model, a $300,000 loan costs $2,643 a month over 15 years against $2,061 over 30, so the rent needed to break even rises from about $3,222 to about $3,835 a month, in exchange for about $266,000 less lifetime interest. (shape: verdict with the break-even)
- answer placement: section 1 "What a 15-Year Loan Does to Rental Cash Flow": introText answers in its first two sentences; section 1 has the comparison table (GFM pipe table; rows = the measures, columns = 30-year and 15-year) and the break-even.

## SECTION COVERAGE (in this order)
1. What a 15-Year Loan Does to Rental Cash Flow: the attribution, the table (monthly payment, total interest, balance after 5 and 10 years, break-even rent), and the break-even sentence.
2. The Alternative: A 30-Year Loan Paid Like a 15-Year Loan: the same $2,643 payment on the 30-year loan pays it off in about 16.2 years with about $36,590 more interest than the true 15-year loan, and it lets you drop back to $2,061 in a vacancy. This is the counterexample that shows what the 15-year term mainly buys (a lower rate). Include "what would change our answer".
3. How Much Rent You Need: the break-even rent table with the hypothetical rate-premium sensitivity (label the 0.5 and 1.0 point premiums as hypothetical examples, NOT quotes), and the worked cash-flow example at $3,300 rent.
4. Where the Rate Numbers Come From and What They Leave Out: Freddie Mac's survey is for owner-occupied purchase loans, so it does not describe investment-property loans; tell the reader to get investment-property quotes and link the Freddie Mac page. Name the other inputs that are the author's assumptions ($1,000 monthly non-mortgage costs, 5% vacancy), and that the model ignores taxes, depreciation, closing costs, reserves, rent growth, and the lender's qualification rules.
5. Qualifying for a Shorter Term: the higher payment raises the monthly obligation a lender weighs against income; say only that, no thresholds; link /mortgage/home-affordability-calculator/. (No numbers: none on the fact list.)
6. Who This Is Not For: a landlord with thin margins, one with big near-term repairs, or one who wants maximum monthly cash flow; and who it fits: a landlord with rent well above the break-even who values faster equity and less interest.
7. Our Takeaway.
FAQ (answers from the fact list only): What is the monthly payment on a $100,000 15-year loan? (answer: about $881 at 6.68%, vs about $687 on a 30-year at 7.32%, with the Freddie Mac date and the caveat) / Is it harder to qualify for a 15-year mortgage? / Is a 15-year mortgage good for an investment property? / How fast does a 15-year loan build equity compared with a 30-year? (balance table) / Can I pay a 30-year mortgage off in 15 years? (the 16.2-year result) / What are rates for investment-property loans? (answer: not on this page's fact list; Freddie Mac's survey does not cover them; ask lenders for quotes). Do NOT answer the "7% rule" or any Dave Ramsey question.

## ATTRIBUTION (required, per the evidence contract)
Basis: CALCULATED (modeled scenario with stated assumptions). Beside the first table, one or two natural sentences: "In our internal modeling, we compared a 15-year and a 30-year loan on the same $300,000 rental purchase loan to see how much rent each needs. Using the Freddie Mac averages for the week of October 22, 2026 and our assumed $1,000 a month in other costs and 5% vacancy, ..." then the result, then how a reader can check it (the inputs are listed and the standard amortization formula reproduces every row; the site's calculators can rerun it). The Freddie Mac averages are Freddie Mac's, not ours: name and link Freddie Mac on first mention. The assumptions ($1,000, 5%) are ours and must be labelled assumptions, not data. Never say "we tested", "testing", or imply a lender quote, a client case, a survey or a measured outcome. Do not repeat the attribution cue except once in Our Takeaway.
## TAKEAWAY (the last substantive section, named "Our Takeaway", before FAQs; informational, not advice)
A 15-year loan fits a landlord whose rent sits well above the higher break-even and who wants less lifetime interest and faster equity: in the model it saves about $266,127 in interest and leaves a $134,505 balance after 10 years against $259,342. It does not fit a landlord with thin margins or likely vacancies, because the payment is $582 a month higher and the break-even rent rises by about $613; and a 30-year loan paid at the 15-year payment retires in about 16.2 years for about $36,590 more interest while keeping the lower required payment. The answer changes with the investment-property rate each lender actually quotes, your reserves, and how reliably the unit rents. Basis: our internal modeling (calculated) using Freddie Mac's published averages (reported).

## INTERNAL LINKS YOU MAY USE (exact paths, first mention only)
- /compare/15-year-vs-30-year-mortgage/
- /real-estate/cash-flow-calculator/
- /real-estate/rental-income-calculator/
- /mortgage/payoff-calculator/
- /mortgage/home-affordability-calculator/
- /guides/rental-property-tax-deductions/
- /guides/can-i-retire-on-rental-income/
- /compare/reit-vs-rental-property/
- /real-estate/roi-calculator/

## `tools` FIELD
Pick 2-3 from: /real-estate/cash-flow-calculator/ (label "Rental cash flow"), /real-estate/rental-income-calculator/ (label "Rental income"), /mortgage/payoff-calculator/ (label "Mortgage payoff").

## SOURCES
Populate `sources` ONLY from the closed URL list (Freddie Mac PMMS page).

## Hard prohibitions
- No fabricated statistics, rates, dates, limits or thresholds. Only figures on the closed fact list. Do NOT state any investment-property rate, any down-payment minimum, any debt-to-income threshold, any credit-score threshold, any property-tax or insurance figure, or any share of borrowers.
- No individualized investment, tax or lending advice; point to a licensed mortgage professional, financial advisor or CPA for the reader's own situation. Disclaimer text, if any, only as the last element.
- Never link the page to itself. Do not name any lender, bank or broker. Do not mention the 7% rule or Dave Ramsey.
- Do not call anything "tested" or "testing".
- Do not claim neutrality, independence or lack of a financial interest.

# CLOSED FACT LIST
**Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the source.**

Source: Freddie Mac, Primary Mortgage Market Survey (PMMS) (https://www.freddiemac.com/pmms), read 2026-10-27. REPORTED.
- U.S. weekly averages as of October 22, 2026: 30-year fixed-rate mortgage 7.32%; 15-year fixed-rate mortgage 6.68%. A week earlier the 30-year averaged 7.40% and the 15-year 6.71%. A year earlier the 30-year averaged 6.19% and the 15-year 5.44%.
- The PMMS is based on rates from loan applications that lenders submit to Freddie Mac for weekly conventional, single-family originations with conforming loan limits; its borrower profile is good or excellent credit, 20% loans (the survey's wording), home purchase loans on owner-occupied one-unit single-family properties. It therefore does not describe investment-property loans, and a landlord's quote may differ. Fees and points are not published in the survey.

Source: our own modeling (reproduce with reports/mindmap-pass/2026-10-27-podcast/evidence/calc.py; output in evidence/15-year-mortgage-for-rental-property/calc-output.json; the standard fixed-rate amortization payment formula, checked against a month-by-month schedule). CALCULATED / MODELED, not a lender quote and not a forecast.
- Scenario inputs: purchase price $400,000; 25% down; loan $300,000. The 30-year uses 7.32% and the 15-year uses 6.68% (the Freddie Mac averages above, used as an illustration only). ASSUMPTIONS made by the author, not data: $1,000 a month for property tax, insurance, repairs and management combined; 5% of rent lost to vacancy and non-payment.
- Monthly principal and interest: 30-year $2,060.79; 15-year $2,643.10; the 15-year payment is $582.31 a month higher.
- Total interest over the full term: 30-year $441,885.07; 15-year $175,757.86; the 15-year saves $266,127.21.
- Loan balance after 5 years: 30-year $283,339.36; 15-year $230,907.00. After 10 years: 30-year $259,342.16; 15-year $134,504.96.
- Break-even monthly rent (rent x 0.95 = payment + $1,000): 30-year $3,221.89; 15-year $3,834.84; the difference is $612.95 a month.
- Worked example at $3,300 monthly rent: cash flow after vacancy, the $1,000 of other costs and the loan payment is +$74.21 a month on the 30-year loan and -$508.10 a month on the 15-year loan.
- A 30-year loan at 7.32% paid at the 15-year payment of $2,643.10 a month is paid off in about 193.8 months (16.15 years), with total interest of $212,347.96, which is $36,590.10 more than the true 15-year loan's $175,757.86. Paying that way is voluntary: the required payment stays $2,060.79. Whether a loan has a prepayment penalty is unknown to this page: the reader should ask the lender.
- HYPOTHETICAL rate premiums on the 15-year loan (NOT quotes, only to show sensitivity): at 7.18% (0.5 point higher) the payment is $2,726.76 and the break-even rent $3,922.91; at 7.68% (1.0 point higher) the payment is $2,811.81 and the break-even rent $4,012.43.
- Per $100,000 borrowed: 15-year at 6.68% = $881.03 a month; 30-year at 7.32% = $686.93 a month.
- What the model leaves out: income tax, depreciation, closing costs, cash reserves, rent growth, loan fees and points, mortgage insurance, and the lender's rules for counting rent and measuring the borrower's debt against income.
