# ROW PROMPT (data only) - rule-of-78-calculator

route: /rule-of-78-calculator/   chart row: A1   (page is a NEW calculator hub entry; JSON keys per the output contract)
medium: interactive tool -> interactive tool   register: operator   page type: explainer / calculator page (floor 1,200 body words: intro + howItWorks + sections + 8 FAQs; tables count as data, not prose)
primary keyword: rule of 78 calculator (also: rule of 78, what is the rule of 78, rule of 78 loan, rule of 78 formula, rule of 78 example, rule of 78 vs actuarial)
intent: a borrower with a precomputed installment loan (or someone who read the term in a contract) who wants to know how the Rule of 78 splits interest and what paying off early costs against the actuarial method.
reader question: "How does the Rule of 78 split my loan interest, and how much more does it cost me to pay the loan off early?" [PAA 0/6 on-topic; ac question sweep: what-is / how-does-it-work / how-to-calculate / is-legal dominant]
answer: The Rule of 78 credits more of a loan's total interest to the early months by sum of the digits, so an early payoff refunds less unearned interest than the actuarial method. On $15,000 at 7% over 48 months paid off after 12 payments, the lender keeps $28.65 more. Federal law (15 U.S.C. 1615(b)) requires an actuarial-or-better refund on precomputed consumer loans longer than 61 months.
answer placement: section 1 - introText paragraph one opens with ONE short sentence defining the Rule of 78 (this serves the 'what is the rule of 78' search), then the answer sentences above; paragraph two is the worked example with the visible attribution. The calculator renders right after the intro, so do not describe the page layout.

## The calculator (describe only what it does)
Inputs: loan amount (starts at $15,000); APR, 0% to 30% (starts at 7%); term in months, 1 to 120 (starts at 48); paid off after payment number, 1 up to the term (starts at 12).
Outputs: the extra interest the Rule of 78 keeps (headline); the Rule of 78 refund and the actuarial refund of unearned interest; interest earned under each method; two bars comparing the refunds; a month-by-month table of the interest credited to each month under each method, with the payoff month marked.
When the term is over 61 months a visible notice says the result is a formula illustration and that 15 U.S.C. 1615(b) requires an actuarial-or-better refund on a precomputed consumer loan of that length.
Assumptions the page must state beside the result: fixed-rate precomputed loan, level monthly payments, whole months, payoff right after a scheduled payment, no fees, no state law or contract terms, no rebate-on-default rules. A lender's payoff statement is the figure that counts.

## CLOSED FACT LIST - every number or rule the page may state. Anything not on this list, you do not know. Never invent a price, limit, benchmark, statistic or URL; never say how a particular lender computes a refund.
Source: executed run of the shipped engine src/lib/rule-of-78.ts (basis: calculated, not tested, not measured), plus the statute and CFPB page quoted below. Every dollar figure below came from that engine run.
Method the page may state:
- A precomputed loan adds the total interest (the finance charge) at the start and spreads it over equal monthly payments. The level payment is payment = amount x r / (1 - (1 + r)^-n), where r is the APR divided by 12 and n is the number of monthly payments. Total finance charge = payment x n minus the amount borrowed.
- Rule of 78 (sum of the digits): month j of an n-month loan is credited (n - j + 1) / S of the finance charge, where S = n(n + 1) / 2. For a 12-month loan S = 12 + 11 + ... + 1 = 78, which is where the name comes from. For a 48-month loan S = 1,176. After k payments the lender has earned the finance charge x k(2n - k + 1) / (n(n + 1)). The refund of unearned interest is the finance charge minus the interest earned.
- Actuarial method (the interest in the first k payments of the standard amortization schedule): each month's interest is the remaining balance times r. The refund is the finance charge minus the interest in the first k payments.
- Extra interest the Rule of 78 keeps = Rule of 78 interest earned minus actuarial interest earned (the same as the actuarial refund minus the Rule of 78 refund). It is never negative for a payoff after payment 1 up to the term.
- At the last payment both methods have earned the whole finance charge, so the difference is $0. At 0% APR there is no finance charge to allocate: $12,000 at 0% over 24 months is $500.00 a month with nothing to allocate.
Worked example (the calculator's starting figures): $15,000 at 7% over 48 months. Payment $359.19 a month. Finance charge $2,241.30. Sum of the digits 1,176.
- Month 1: the Rule of 78 credits 48 / 1,176 of the finance charge, $91.48. The actuarial method credits $87.50 (the first month's balance of $15,000 x 7% / 12). Month 48: the Rule of 78 credits 1 / 1,176, $1.91; the actuarial method credits $2.08.
- After 12 payments (a quarter of the term, 25%): Rule of 78 interest earned $971.99 (43.37% of the finance charge); actuarial interest earned $943.34 (42.09%). Refund of unearned interest: $1,269.31 under the Rule of 78 and $1,297.96 under the actuarial method. The lender keeps $28.65 more under the Rule of 78.
- After 24 payments: the lender keeps $26.26 more under the Rule of 78 ($1,669.54 earned against $1,643.27).
- After 42 payments: the lender keeps $3.30 more ($2,201.27 earned against $2,197.97). After 48 payments: $0.00 more.
Larger-gap case inside the federal 61-month line: $25,000 at 8% over 60 months, paid off after 12 payments. Payment $506.91. Finance charge $5,414.59. Rule of 78 interest earned $1,935.05; actuarial $1,846.92; the lender keeps $88.13 more.
Small-gap cases: $5,000 at 6% over 24 months paid off after 12 payments: payment $221.60, finance charge $318.47, lender keeps $1.64 more. $15,000 at 3% over 48 months paid off after 12 payments: payment $332.01, finance charge $936.72, lender keeps $5.23 more.
FORMULA ILLUSTRATION ONLY (term over 61 months, which federal law restricts for precomputed consumer loans; never present it as a typical lender outcome or as a general "long loans cost more" claim): $30,000 at 9% over 72 months, paid off after 24 payments: payment $540.77, finance charge $8,935.16, lender keeps $227.82 more. Mention it at most once, labelled as a formula illustration.
Month-by-month table, the $15,000 / 7% / 48-month loan, first 12 months (INCLUDE THIS TABLE EXACTLY in the section "What Early Payoff Costs Under the Rule of 78", before the cases table):
| Month | Rule of 78 interest | Actuarial interest |
|---|---|---|
| 1 | $91.48 | $87.50 |
| 2 | $89.58 | $85.92 |
| 3 | $87.67 | $84.32 |
| 4 | $85.76 | $82.72 |
| 5 | $83.86 | $81.10 |
| 6 | $81.95 | $79.48 |
| 7 | $80.05 | $77.85 |
| 8 | $78.14 | $76.21 |
| 9 | $76.23 | $74.56 |
| 10 | $74.33 | $72.90 |
| 11 | $72.42 | $71.23 |
| 12 | $70.52 | $69.55 |
Cases table (INCLUDE THIS TABLE EXACTLY in the section "What Early Payoff Costs Under the Rule of 78"). Column 4 is the extra interest the Rule of 78 keeps:
| Loan | Total finance charge | Paid off after payment | Extra interest kept |
|---|---|---|---|
| $5,000 at 6% over 24 months | $318.47 | 12 | $1.64 |
| $15,000 at 3% over 48 months | $936.72 | 12 | $5.23 |
| $15,000 at 7% over 48 months | $2,241.30 | 12 | $28.65 |
| $15,000 at 7% over 48 months | $2,241.30 | 24 | $26.26 |
| $15,000 at 7% over 48 months | $2,241.30 | 42 | $3.30 |
| $15,000 at 7% over 48 months | $2,241.30 | 48 | $0.00 |
| $25,000 at 8% over 60 months | $5,414.59 | 12 | $88.13 |

Statute: 15 U.S.C. 1615 (Truth in Lending Act related provision, title "Prohibition on use of 'Rule of 78's' in connection with mortgage refinancings and other consumer loans"), official U.S. Government Publishing Office text checked 2026-11-23. Use these words and scope exactly:
- 1615(a)(1): if a consumer prepays in full the financed amount under any consumer credit transaction, the creditor shall promptly refund any unearned portion of the interest charge to the consumer. 1615(a)(2): no refund is required if the total refund would be less than $1. 1615(a) applies without regard to the manner or reason for the prepayment, including refinancing, consolidation, restructuring, or acceleration by the creditor.
- 1615(b): "For the purpose of calculating any refund of interest required under subsection (a) for any precomputed consumer credit transaction of a term exceeding 61 months which is consummated after September 30, 1993, the creditor shall compute the refund based on a method which is at least as favorable to the consumer as the actuarial method." So subsection (b) covers precomputed consumer credit transactions with a term longer than 61 months made after September 30, 1993. It does not address terms of 61 months or less, and it does not cover business loans (it is about consumer credit). The page must not say the Rule of 78 is legal at 61 months or less; the contract and state law decide, and this page takes no position on state law.
- 1615(c): within 5 days after a consumer's oral or written request, the creditor must give a statement of the amount needed to prepay a precomputed consumer credit account in full and, if that amount includes a required refund, the refund amount. If the request is in writing, the statement must be in writing. A consumer may get one such statement each year without charge; a creditor may charge a reasonable fee for additional statements if the fee is disclosed first.
- 1615(d)(1): the actuarial method is the method of allocating payments between the amount financed and the finance charge in which a payment is applied first to the accumulated finance charge and any remainder is subtracted from the unpaid balance of the amount financed (a deficiency is added to it).
- Never write "illegal" or "banned" without both conditions (precomputed consumer credit, term over 61 months, made after September 30, 1993).
CFPB (Consumer Financial Protection Bureau, page last reviewed Jan. 30, 2024): "Precomputed interest" means the total interest is calculated immediately and spread equally among monthly payments; it is an uncommon way of calculating interest on an auto loan, and simple interest (which charges interest on the actual outstanding balance daily or monthly) is far more common. With precomputed interest, more of each payment goes to interest in the first part of the loan, and paying off early means ultimately paying more interest, although you may get a refund of some "unearned" interest. The CFPB tells borrowers who plan to pay off early to make sure the lender uses simple interest. The CFPB page does not mention the Rule of 78 by name.
Provenance (calculated, not tested): "In our internal modeling, we compared the Rule of 78 with the actuarial method on the same loans to see what an early payoff costs." State this ONCE, in introText paragraph two beside the first finding, then give the finding, then say readers can check it by entering their own loan in the calculator or by reading the month-by-month table. Never say "testing" or "tested". Repeat the basis once in "Our Takeaway" ("Based on our internal modeling, ...").
Takeaway (intent: informational and worth-checking): the Rule of 78 pushes interest into the early months, so on a precomputed loan an early payoff refunds less than the actuarial method; the extra cost is a few dollars on a short or low-rate loan ($1.64 on the 24-month example), tens of dollars on the 48-month example ($28.65), $88.13 on the 60-month example, and it shrinks to $0 as the loan approaches its end. It applies only to precomputed loans; a simple-interest loan does not use it. What would change the answer: a simple-interest or actuarial contract, a precomputed term over 61 months, a different state or contract rule, or a payoff statement that shows a different refund. Next action: ask the lender for a payoff statement (one free a year under 1615(c)) and compare its refund with the calculator.
No other figures.

## CLOSED URL LIST - only external hrefs allowed
https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap41-subchapI-partA-sec1615.htm (the statute; link the FIRST mention of "15 U.S.C. 1615" in introText paragraph one with this URL)
https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/ (CFPB page; link the first mention of "Consumer Financial Protection Bureau (CFPB)" with this URL, and spell out the acronym on first use). Nothing else.

## Internal routes it may link (real routes only)
/loan-payment-calculator/ (anchor "loan payment calculator": the level payment and actuarial amortization for the same loan; link it once in howItWorks), /auto-loan/early-payoff-calculator/ (anchor "auto loan early payoff calculator": savings from extra payments on a simple-interest loan; link it once in the section "Who This Is Not For"). No other internal route.

## Sections (use these headings verbatim, in this order)
howItWorksHeading: "How the Rule of 78 Splits Your Interest"
1. "What Early Payoff Costs Under the Rule of 78": a short lead paragraph, then the cases table exactly, then two paragraphs: the gap is largest in the early and middle months and falls to $0 at the last payment (use the 48-month rows); and a larger gap needs a bigger loan, a higher rate or a longer term (60-month row), while the 24-month and 3% rows show it can be a few dollars. Mention the $227.82 formula illustration at most once, labelled as over 61 months.
2. "Is the Rule of 78 Legal?": answer in the first sentence with the exact scope (federal law requires an actuarial-or-better refund for a precomputed consumer loan longer than 61 months made after September 30, 1993; it is not a blanket ban); then 1615(a) (prompt refund of unearned interest when a consumer prepays in full, under $1 exempt); then that subsection (b) says nothing about terms of 61 months or less, so the contract and state law decide, and the page takes no position on state law; then the 1615(c) payoff statement and what to ask for.
3. "Who This Is Not For": simple-interest loans (the CFPB says simple interest is far more common on auto loans; link the auto loan early payoff calculator for those); business loans and loans outside the United States follow other rules this page does not cover; anyone who needs a legal opinion on a specific contract. Say what each should do instead.
4. "What Would Change Our Answer": a simple-interest or actuarial contract; a precomputed term over 61 months; state law or contract terms that set a different refund; a payoff statement showing a different refund.
5. "Our Takeaway": the takeaway above in one short paragraph with the evidence basis named, then the concrete next action as the LAST sentence of the section, using the primary keyword naturally ("run your own loan through the Rule of 78 calculator and compare it with your lender's payoff statement" or similar).
Both tables go in section 1. The month-by-month table comes first, with one lead sentence saying it shows the first 12 months of the $15,000 loan and that the calculator lists every month. The cases table follows it. The howItWorks string is paragraphs only (no tables).

## Coverage
introText: as in the contract (paragraph one: one-sentence definition, then the answer with the $28.65 figure and the 61-month scope with the linked 15 U.S.C. 1615 mention; paragraph two: the attribution sentence, then the $15,000 / 7% / 48-month, after-12-payments finding with both refunds, then a pointer that the calculator below takes the reader's own numbers).
howItWorks: (1) the precomputed finance charge and level payment (link "loan payment calculator"); (2) the sum-of-the-digits formula, the 78 origin and S = 1,176 for 48 months; (3) the worked 48-month loan: month 1 and month 48 credits under each method, and after 12 payments the interest earned under each; (4) the actuarial method and what the assumptions leave out (fees, state law, contract terms, rebate-on-default), and that the calculator shows a notice for terms over 61 months.
Neutrality: explain; no claims about any lender; no state-law position; no "illegal" or "banned" without the conditions.

## FAQ questions (verbatim, in this order)
1. What is the Rule of 78?
2. What is the Rule of 78 formula?
3. Can you show a Rule of 78 example?
4. Is the Rule of 78 legal?
5. Does the Rule of 78 apply to car loans?
6. How do I find out what my lender will refund if I pay off early?
7. How is the Rule of 78 different from simple interest?
8. Why does the Rule of 78 refund less when I pay off early?
