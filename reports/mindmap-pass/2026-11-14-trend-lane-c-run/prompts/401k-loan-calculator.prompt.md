# ROW PROMPT (data only) — 401k-loan-calculator

route: /retirement/401k-loan-calculator/   chart row: MW-TL-01
medium: interactive tool → interactive tool   register: operator   page type: cost-pricing / spoke tool (depth floor 1,000 body words; write at least 1,150 words across introText, section bodies, commonMistakes items and FAQ answers)
primary keyword: 401k loan calculator (write it "401(k) loan calculator"). Also: solo 401k loan calculator, 401k loan payment calculator, 401k loan repayment calculator.
page name (h1): 401(k) Loan Calculator
title (50 to 60 chars, one clause, contains the primary keyword): suggested "401(k) Loan Calculator for Your Maximum Loan and Payment"
intent: a U.S. saver with an employer or owner-only 401(k) wants the largest plan loan they can take and the payment on the amount they want.
reader question: "How much can I borrow from my 401(k), and what will my loan payments be? [PAA 2/6 on-topic (how much loan can I get from my 401k; $10,000 over 5 years per month), 4/6 off-topic: retirement age, contribution percentage, balance growth; ac 6/44 question completions incl. how much 401k loan can i take, how are 401k loans paid back]"
answer: Your new loan, added to loans you already owe the plan, cannot exceed the lesser of $50,000 reduced by how much your highest plan-loan balance in the past 12 months exceeded your balance today, or the greater of half your vested balance or $10,000; the calculator subtracts what you already owe and returns the largest new loan and the payment for the amount you enter (figure).
answer placement: section 1 "Calculate Your 401(k) Loan Limit and Payment". The calculator itself is section 1 and sits directly under introText, so introText carries the answer first. The answer comes before any rule or background. Sentence 1 of introText must be short and easy: with no earlier plan loans you can borrow up to half your vested balance, capped at $50,000, and at least $10,000 even when half is less. Sentence 2 says that loans you already owe and your highest balance in the past 12 months can lower that figure and the calculator does the subtraction. teeup-exempt: the attribution sentence sits beside the first finding in paragraph two.

## The calculator (describe only what it does; labels exactly as built)
Section heading above the tool: "Calculate Your 401(k) Loan Limit and Payment".
Inputs: Vested account balance; Plan loans you owe now; Highest plan-loan balance, last 12 months; Loan amount you want; Interest rate (APR); Term (years); Payments per year (4 quarterly, 12 monthly, 24 twice a month, 26 every two weeks, 52 weekly); Loan purpose (General purpose or Buy a main home).
Outputs: Largest new loan allowed; the limit on all plan loans together; the "$50,000 prong" and "Vested-balance prong"; the payment per period; total interest; total repaid; a warning when the amount is over the limit, when a general-purpose term is over 5 years, or when payments are less often than quarterly; a green note when the loan fits the federal cap, term and frequency rules; payments by year; the first 5 and last 5 payments; a Copy results button.
Starting figures in the tool are examples: $60,000 vested, no loans owed, $10,000 loan, 8% APR, 5 years, monthly payments. The 8% rate is an example input, not a plan or market rate.

## Evidence and attribution (evidence/401k-loan-calculator/evidence.json, basis: calculated)
We ran the 26 U.S.C. 72(p)(2) formula and level-payment arithmetic on example inputs. Ask for ONE natural attribution beside the first worked-example finding in paragraph two of introText, e.g. "In our internal modeling, we applied the formula to a $60,000 vested balance...", then what we found, then that readers can check it by changing the inputs. Do not say "tested". No other first-person claim.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a price, limit, rate, benchmark, statistic, plan feature or URL; never state a market or plan interest rate; never say what a provider offers.
- Statute (26 U.S.C. 72(p)(2)(A), https://www.law.cornell.edu/uscode/text/26/72): a loan, added to the outstanding balance of all other loans from the plan, is not a distribution to the extent it does not exceed the lesser of (i) $50,000 reduced by the excess, if any, of the highest outstanding balance of plan loans during the 1-year period ending the day before the loan over the outstanding balance on the day the loan is made, or (ii) the greater of one-half of the present value of the participant's nonforfeitable (vested) accrued benefit, or $10,000.
- Under 72(p)(1), the part of a loan that is not covered by 72(p)(2) is treated as a distribution to the participant.
- 72(p)(2)(B): the loan must by its terms be repayable within 5 years, except a loan used to acquire a dwelling unit that, within a reasonable time, is to be used as the participant's principal residence. 72(p)(2)(C): substantially level amortization with payments not less frequently than quarterly. 72(p)(2)(D): a loan made through a credit card or similar arrangement does not qualify.
- 72(p)(2)(A) counts every outstanding plan loan toward the limit. The text states no maximum number of loans. The plan document decides whether loans are offered at all, the interest rate, fees and any limit on how many loans the plan allows; the calculator cannot tell whether your plan allows loans.
- Limit cases (all engine-computed; "limit" is the cap on all plan loans together, "room" is the largest new loan after subtracting loans owed):
  - vested $15,000, nothing owed, no 12-month peak: limit $10,000, room $10,000 (half of $15,000 is $7,500, so the $10,000 floor applies).
  - vested $60,000, nothing owed: limit $30,000, room $30,000.
  - vested exactly $100,000, nothing owed: limit $50,000, room $50,000 (half is $50,000).
  - vested $200,000, nothing owed: limit $50,000, room $50,000 (half is $100,000, so the $50,000 prong sets the limit).
  - vested $200,000, $10,000 owed, highest balance in the past 12 months $20,000: the $50,000 prong becomes $40,000 (the $20,000 peak is $10,000 above the $10,000 owed today), the vested prong is $100,000, so the limit is $40,000 and room is $30,000. Subtracting the $10,000 owed a second time from the $50,000 prong would wrongly give $20,000.
  - vested $200,000, $20,000 owed, highest balance in the past 12 months $50,000: the $50,000 prong falls to $20,000, so the limit is $20,000 and room is $0.
- Payment cases (example rates, not plan or market rates), $10,000 over 5 years paid monthly: 6% gives $193.33 a month and $1,599.68 total interest; 8% gives $202.76 a month, $2,165.84 total interest and $12,165.84 repaid; 10% gives $212.47 a month and $2,748.23 total interest. The 6%, 8% and 10% rates are examples a reader can replace.
- Same $10,000 loan at 8% over 5 years: paid quarterly, 20 payments of $611.57 with $2,231.34 total interest; paid every two weeks (26 a year, 130 payments), $93.45 each with $2,148.15 total interest.
- $30,000 at 8% over 5 years paid monthly: $608.29 a month and $6,497.51 total interest. $30,000 at 8% over 15 years paid monthly, allowed only for a main-home purchase: $286.70 a month and $21,605.21 total interest.
- Payment formula: payment = P x r / (1 - (1 + r)^-n), with r = APR divided by payments per year and n = years times payments per year. Each payment covers that period's interest and the rest repays principal.
- Solo 401(k) pointer facts (the guide owns the full answer, https://www.law.cornell.edu/uscode/text/26/4975 and /416): the 72(p) limits apply the same way to an owner-only 401(k), so the calculator needs no separate solo setting. The plan document must provide for loans. The conditions for a participant loan to avoid being a prohibited transaction under 26 U.S.C. 4975(d)(1) include more than a plan provision (do not list the conditions here; the guide lists all five). An owner is generally a key employee (a 5-percent owner is one, 26 U.S.C. 416(i)(1)(A)(ii), https://www.law.cornell.edu/uscode/text/26/416), so interest on the owner's own plan loan is not deductible under 72(p)(3).
- Not modelled: plan fees, income tax or additional tax on a loan treated as a distribution (use the early-withdrawal calculator for a tax estimate), and what the borrowed money would have earned in the market while it is out of the plan. Whether interest you repay is credited to your own account depends on the plan document; check it. A tax professional should confirm the consequences of a missed payment.
No other figures.

## CLOSED URL LIST — only external hrefs allowed (link the first mention of each; anchor words, never a bare URL)
https://www.law.cornell.edu/uscode/text/26/72 (26 U.S.C. 72(p)); https://www.law.cornell.edu/uscode/text/26/4975 (26 U.S.C. 4975); https://www.law.cornell.edu/uscode/text/26/416 (26 U.S.C. 416(i)). Nothing else.

## Internal routes it may link (real routes only)
/guides/401k-loan-rules/ (401(k) loan rules guide), /retirement/401k-early-withdrawal-calculator/ (401(k) early withdrawal calculator), /compare/401k-loan-vs-heloc/ (401(k) loan vs HELOC), /compare/sep-ira-vs-solo-401k/ (SEP IRA vs solo 401(k)). No other internal route.

## Sections (exactly these headings, this order; the tool sits above them; "What the Calculator Does Not Include" is the commonMistakes list, FAQs follow)
1. "How the Loan Limit Is Calculated": walk the 72(p)(2)(A) formula in plain words, then ONE pipe table of the six limit cases (columns: Vested balance, Owed now, 12-month peak, Limit on all loans, Room for a new loan), then one paragraph on the prior-loan case and the double-count mistake.
2. "Repayment Rules the Calculator Checks": 5 years and the main-home exception; level payments at least quarterly; what the warnings mean and that the part above the limit is treated as a distribution under 72(p)(1) (link the early-withdrawal calculator for the tax estimate); then ONE small pipe table of the $10,000, 5-year payments at 6%, 8% and 10%; then a short takeaway paragraph: run your own numbers first, the limit and the term rules decide whether a loan counts as a loan or a distribution, the plan document decides whether you can borrow at all, and who this is not for (anyone whose plan document has no loan provision, because no calculator can add one).
3. "Borrowing From a Solo 401(k)": two to three sentences only, from the solo pointer facts; link /guides/401k-loan-rules/ with anchor "401(k) loan rules guide". End the section, and the "sections" array, on a concrete next action: read that guide's solo section, then enter your balance in the calculator above.
commonMistakes (heading shown on the page: "What the Calculator Does Not Include"): exactly 4 items: (a) plan fees and the plan's own rate and loan limits; (b) tax on a loan treated as a distribution, with the early-withdrawal calculator link; (c) the borrowed money is out of the market meanwhile and the calculator asserts no return, and check your plan document on where repayments are credited; (d) a different borrowing source: link [401(k) loan vs HELOC](/compare/401k-loan-vs-heloc/).

## FAQ questions (verbatim, in this order; answer 1 uses the formula in words and the $60,000 case; answer 2 uses the $10,000 payment cases and says the rates are examples; answer 3 uses "How many loans" facts; answer 4 is two to three sentences pointing to the guide and linking it; answer 5 uses the distribution and plan-document facts)
1. How are 401k loan amounts calculated?
2. How much would a $10,000 401(k) loan cost per month over 5 years?
3. How many 401(k) loans can you have at once?
4. Can I take a loan from a solo 401(k)?
5. What happens if I do not repay a 401(k) loan?
