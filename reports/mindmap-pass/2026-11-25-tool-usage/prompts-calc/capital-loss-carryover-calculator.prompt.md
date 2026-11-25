# ROW PROMPT (data only) — capital-loss-carryover-calculator

route: /capital-loss-carryover-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; introText ~140 words, howItWorks ~500 words, 8 FAQs)
primary keyword: capital loss carryover calculator (also: capital loss carryover, capital loss carryforward, how is capital loss carryover calculated)
intent: a DIY investor with a large realized stock loss wants to know how much to deduct this year, what carries forward and how many years it will last.
reader question: "How much of my stock losses can I deduct this year and carry forward?" [PAA 2/6 on-topic: 'How do I find out if I have capital loss carryover?', 'What are the rules for carry forward of losses?'; ac 14 how/what questions; 4/6 PAA tax-rate off-topic]
answer: Losses first cancel gains; a net loss deducts at most $3,000 ($1,500 married filing separately) against other income and the rest carries forward with no expiry (IRS Topic 409). A $50,000 net loss with no gains deducts $3,000 this year and then over 16 more tax years, with the final deduction $2,000.
answer placement: section 1 — introText paragraph one gives the rule; paragraph two is the $50,000 worked example. Do not open with a definition of capital gains.
provenance (calculated): at the first finding say naturally what we did: "In our internal calculation, we ran the IRS carryover worksheet rules year by year for ...", then what we found. Never "we tested".

## The calculator (describe only what it does)
Inputs: filing status (single, head of household or qualifying surviving spouse; married filing jointly; married filing separately); short-term gains and short-term losses for the year; long-term gains and long-term losses for the year (each a positive amount); short-term and long-term carryover from earlier years; optional net long-term gain expected in each later year.
Outputs: the deduction against other income this year as the big figure; the amount that carries to next year, split short-term and long-term; the number of years with a deduction; a sentence on how the schedule ends; a year-by-year schedule table (year, net result, deduction, carries forward); a "Copy result" button.
Method the page may state (IRS Topic 409 and Publication 550): losses first offset gains; the allowable deduction is the lesser of $3,000 ($1,500 if married filing separately) or the total net loss; the unused part carries forward to later years until used up and stays short-term or long-term; short-term losses are used first; Worksheet 4-1 figures the carryover; the carryover is figured after taking the current year's allowable deduction into account.
Assumptions the page must state: taxable income is assumed large enough to absorb the deduction every year (a low-income year carries more forward under Worksheet 4-1); later gains are entered as one net long-term gain per year; wash-sale disallowed losses, the alternative minimum tax and state rules are not modeled; the $3,000 and $1,500 limits are set by law and the schedule does not depend on a tax year.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a rate, a state rule, a statistic or a URL. Do not state any capital gains tax rate or the tax saved.
- IRS Topic no. 409 and IRS Publication 550: if capital losses exceed capital gains, the excess loss you can claim to lower your income is the lesser of $3,000 ($1,500 if married filing separately) or your total net loss; you can use the total net loss to reduce your income dollar for dollar, up to the $3,000 limit; a net loss above the yearly limit carries over to the next year as if incurred then, and to later years until completely used up; a carried-over loss remains short-term or long-term; "use your short-term capital losses first, even if you incurred them after a long-term capital loss"; a long-term carryover reduces that year's long-term gains before its short-term gains; use Worksheet 4-1 (Capital Loss Carryover Worksheet); when you figure the carryover you must take the current year's allowable deduction into account, whether or not you claimed it; a decedent's capital loss can be deducted only on the final return and the estate cannot carry it over; if you and your spouse once filed a joint return and now file separately, a joint-return carryover can be deducted only on the return of the spouse who actually had the loss; if you once filed separately and now file jointly, combine your separate carryovers.
- IRS Publication 550 example: Bob and Shelly sold securities with a $7,000 capital loss and no other capital transactions; they deduct $3,000 on the joint return and carry $4,000 over to the next year; if the loss had been $2,000 they would deduct $2,000 and have no carryover.
- Worked examples (computed by the calculator):
  - Single, $30,000 short-term loss and $20,000 long-term loss (a $50,000 net loss), no gains, no later gains: deduct $3,000 this year; carry $47,000 ($27,000 short-term and $20,000 long-term). Deductions run $3,000 a year for 16 tax years in total and then $2,000 in the 17th tax year: 17 tax years in all, $50,000 deducted in total. The short-term carryover is gone in year 10 and the long-term carryover then shrinks.
  - Same loss, married filing separately: $1,500 a year, 34 tax years in all, the last deduction $500; this year's carryover $48,500.
  - Same $50,000 loss with $10,000 of net long-term gain in each later year: deductions of $3,000 a year for 4 tax years ($12,000 in total) and the loss is used up in the 5th year, when a $2,000 net gain remains. With $100,000 of net long-term gain in each later year the carryover is absorbed in year 2 with no further deduction.
  - Single, $10,000 short-term loss and $4,000 long-term gain: net loss $6,000; deduct $3,000; carry $3,000 short-term.
  - Single, $2,000 short-term loss only: deduct $2,000, no carryover.
  - Gains at least as large as losses: no deduction and nothing carries forward.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/taxtopics/tc409 (IRS Topic no. 409, Capital gains and losses); https://www.irs.gov/publications/p550 (IRS Publication 550). Nothing else.

## Internal routes it may link (real routes only)
/guides/tax-loss-harvesting/ (how tax loss harvesting works), /guides/wash-sale-rule-explained/ (wash sale rule), /stock-capital-gains-tax-calculator/ (stock capital gains tax calculator), /tax-bracket-calculator/ (tax bracket calculator), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as above. howItWorks: (1) the netting order: short-term and long-term gains and losses, then the net; (2) the $3,000 and $1,500 limit and the carryforward with no expiry (link /guides/tax-loss-harvesting/ with anchor "how tax loss harvesting works"); (3) short-term used first and character preserved, with the $50,000 example in a short sentence set (do not put a table in the text); (4) the filing-status and prior-carryover inputs, married filing separately and the Worksheet 4-1 step; (5) what later gains do (the $10,000 and $100,000 examples) and what the calculator leaves out; (6) last paragraph is the takeaway.
Takeaway (planned): a net loss never disappears: it offsets gains dollar for dollar, then up to $3,000 a year of other income, and the rest carries forward until used; with no gains a large loss can take well over a decade, so realizing gains in a low-income year can use it faster. Who it is not for: someone whose loss was disallowed by the wash sale rule (link /guides/wash-sale-rule-explained/ with anchor "wash sale rule") or who needs AMT or state results. What would change it: low taxable income, later gains, a wash sale. Closing sentence: a next action, such as entering this year's totals and last year's Worksheet 4-1 carryover above.

## FAQ questions (verbatim, in this order)
1. How do I find out if I have a capital loss carryover?
2. What are the rules for carry forward of losses?
3. How is capital loss carryover calculated?
4. How much capital loss carryover can I use each year?
5. Which capital loss carryover is used first?
6. Does a capital loss carryover expire?
7. What happens to a capital loss carryover at death?
8. How does a wash sale affect my capital loss carryover?
For question 1 name last year's Schedule D and the Capital Loss Carryover Worksheet in Publication 550. For question 7 use only the decedent facts above. For question 8 say a loss disallowed under the wash sale rule is not part of the loss this calculator counts, link /guides/wash-sale-rule-explained/ with anchor "wash sale rule", and give no figure. Use no figure outside the fact list.
