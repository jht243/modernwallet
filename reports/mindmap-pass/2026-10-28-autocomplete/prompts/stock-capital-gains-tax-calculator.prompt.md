# ROW PROMPT (data only) — stock-capital-gains-tax-calculator

route: /stock-capital-gains-tax-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~150 words, howItWorks ~500 words, 8 FAQs)
primary keyword: stock capital gains tax calculator (also: capital gains tax calculator stocks, capital gains tax rate 2026, capital gains tax on stock sale)
intent: an investor who sold, or plans to sell, stock, ETF or fund shares in a taxable account wants to know how much federal tax the sale will cost and how holding period and other income change it.
reader question: "How much tax will I owe when I sell stock?" [PAA 0 returned; related searches: shares bought at different times, held 10 years; head term 480/mo KD 18 measured, DataForSEO US 2026-10-28]
answer: A figure with conditions. A gain on stock held more than one year is taxed at 0%, 15% or 20% depending on where it lands on top of your other taxable income, and a gain held one year or less is taxed as ordinary income. A single filer with $85,000 of other taxable income who sells stock bought for $30,000 for $50,000 owes $3,000 on the $20,000 long-term gain, or $4,400 if the stock was held a year or less. High earners add the 3.8% Net Investment Income Tax.
answer placement: section 1 — introText paragraph one gives the rates and the condition; paragraph two is the $85,000 worked case. Do not open with a definition of capital gains.

## The calculator (describe only what it does)
Inputs: filing status (Single; Married filing jointly; Head of household; Married filing separately); taxable income before this sale (after deductions); cost basis; sale proceeds; holding period (more than one year, or one year or less).
Outputs: the gain or loss; federal income tax on the gain; Net Investment Income Tax; total tax; share of the gain paid as tax; proceeds after tax; room left in the 0% long-term bracket.
Method the page may state: Gain = proceeds − basis. Long-term gains are stacked on top of your other taxable income: the part of the gain that lands at or below the 0% limit is taxed at 0%, the part between the 0% limit and the 15% limit at 15%, and anything above at 20%. Short-term gains are taxed as ordinary income: the tax is the ordinary-income tax on (other taxable income + gain) minus the ordinary-income tax on the other taxable income, using the 2026 brackets. The Net Investment Income Tax is 3.8% of the smaller of the gain or the amount by which modified adjusted gross income (MAGI) is over the threshold; the tool estimates MAGI as taxable income + the 2026 standard deduction + the gain. A loss owes no capital gains tax.
Assumptions the page must state: federal tax only, tax year 2026; no state tax; the gain is the only investment income; no loss carryovers, wash sales or qualified dividends; cost basis is what the reader paid plus commissions and fees (IRS Topic 703); the tool does not check basis; informational, not tax advice, a preparer settles the individual case.
Provenance (calculated, internal calculation): "In our internal calculation, we re-implemented the 2026 stacking rule in two separate programs and ran the scenarios below through both to see how income and holding period change the tax." The two programs agreed on every scenario. These are calculated scenarios, not tests of any product and not client cases. Tell the reader they can enter the same numbers in the calculator above to check them.
Takeaway (in howItWorks, near the end): hold a winning position for more than a year when you can, because the same $20,000 gain costs $3,000 long-term but $4,400 short-term at $85,000 of other taxable income; with other taxable income under the 0% limit, long-term gains up to the room left are tax-free; the 3.8% surtax adds to high earners only; conditions that reverse it: state income tax, wash-sale or loss-carryover rules, or other investment income not entered. Informational, not tax advice.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a tax rate, bracket, state rule, statistic or URL. Do not state any ordinary income tax bracket other than the ones listed here.
- IRS Revenue Procedure 2025-32, section 4.03, tax year 2026 maximum zero-rate and 15% amounts (taxable income): single and all other individuals: 0% up to $49,450, 15% up to $545,500, 20% above; married filing jointly and surviving spouses: 0% up to $98,900, 15% up to $613,700, 20% above; heads of household: 0% up to $66,200, 15% up to $579,600, 20% above; married filing separately: 0% up to $49,450, 15% up to $306,850, 20% above. Source: https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
- IRS Topic 409: more than one year held is long-term; net short-term capital gains are taxed as ordinary income at graduated rates; the net capital loss deduction is limited to $3,000 ($1,500 if married filing separately) a year and any excess carries forward; report sales on Form 8949 and summarize on Schedule D (Form 1040). Source: https://www.irs.gov/taxtopics/tc409
- IRS Topic 559: the Net Investment Income Tax is 3.8%, applied to the lesser of net investment income or the MAGI above $250,000 (married filing jointly), $125,000 (married filing separately) or $200,000 (single or head of household). Source: https://www.irs.gov/taxtopics/tc559
- IRS Topic 703: when you buy stock your basis is the purchase price plus commissions and recording or transfer fees; basis is usually cost. Source: https://www.irs.gov/taxtopics/tc703
- 2026 standard deduction (Rev. Proc. 2025-32, section 4): single $16,100; married filing jointly $32,200; head of household $24,150; married filing separately $16,100.
- 2026 ordinary-income brackets used for short-term gains (Rev. Proc. 2025-32, section 4.01, single): 10% to $12,400; 12% to $50,400; 22% to $105,700; 24% to $201,775.
- Calculated scenarios (federal, 2026; both programs agree):
  1. Single, $85,000 other taxable income, basis $30,000, proceeds $50,000 (gain $20,000), held over a year: all $20,000 at 15%, tax $3,000, no Net Investment Income Tax. Held a year or less: tax $4,400 (all in the 22% bracket, since $85,000 + $20,000 = $105,000 is under $105,700). Holding past one year saves $1,400.
  2. Single, $20,000 other taxable income, basis $10,000, proceeds $15,000 (gain $5,000), long-term: all inside the 0% bracket, tax $0.
  3. Single, $40,000 other taxable income, basis $10,000, proceeds $30,000 (gain $20,000), long-term: $9,450 taxed at 0% and $10,550 at 15%, tax $1,582.50.
  4. Single, $540,000 other taxable income, basis $10,000, proceeds $40,000 (gain $30,000), long-term: $5,500 at 15% and $24,500 at 20% = $5,725, plus $1,140 Net Investment Income Tax, total $6,865.
  5. Single, $190,000 other taxable income, basis $20,000, proceeds $60,000 (gain $40,000), long-term: $6,000 of tax at 15% plus $1,520 Net Investment Income Tax, total $7,520.
  6. Single, $100,000 other taxable income, basis $10,000, proceeds $20,000 (gain $10,000), short-term: $5,700 at 22% and $4,300 at 24%, tax $2,286.
  7. Married filing jointly, $650,000 other taxable income, basis $100,000, proceeds $300,000 (gain $200,000), long-term: all at 20% = $40,000, plus $7,600 Net Investment Income Tax, total $47,600.
  8. Single, basis $30,000, proceeds $20,000: a $10,000 loss, no capital gains tax.
- Do not state any other figure.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/pub/irs-drop/rp-25-32.pdf (Revenue Procedure 2025-32). https://www.irs.gov/taxtopics/tc409 (IRS Topic 409). https://www.irs.gov/taxtopics/tc559 (IRS Topic 559). https://www.irs.gov/taxtopics/tc703 (IRS Topic 703). Nothing else.

## Internal routes it may link (real routes only)
/tax-bracket-calculator/ (find your tax bracket), /compare/ordinary-income-vs-capital-gains-tax/ (ordinary income vs capital gains tax), /real-estate/capital-gains-calculator/ (rental property capital gains calculator), /investing/stock-profit-calculator/ (stock profit calculator), /compare/realized-vs-unrealized-gains/ (realized vs unrealized gains). No other internal route.

## Coverage
introText: as in the contract. howItWorks (4-5 paragraphs): (1) gain, basis and holding period, with the visible internal-calculation attribution at the first finding; (2) the stacking rule step by step with scenarios 1, 3 and 4 and the 2026 thresholds by filing status; (3) short-term vs long-term (scenario 1 and 6) and the Net Investment Income Tax (scenario 5 and 7); (4) what the tool leaves out (state tax, other investment income, loss carryovers, wash sales; losses per Topic 409; scenario 8) and where to report (Form 8949, Schedule D); (5) the takeaway.
Who this is not for: someone selling in a retirement account such as an IRA or 401(k) (sales inside them are not taxed this way), someone selling real estate (use the rental property capital gains calculator), or someone in a state with its own income tax who needs the state figure.

## FAQ questions (verbatim, in this order)
1. How is capital gains tax on stock calculated?
2. What are the long-term capital gains tax rates for 2026?
3. How long do I have to hold a stock to get the long-term rate?
4. Are short-term stock gains taxed at a higher rate?
5. What is the Net Investment Income Tax on a stock sale?
6. Can I owe no tax when I sell stock?
7. What happens if I sell stock at a loss?
8. How do I find my cost basis?
For question 7 use Topic 409 ($3,000 a year, $1,500 if married filing separately, carryforward). For question 8 say the basis is usually the purchase price plus commissions and fees (Topic 703) and the reader should check the brokerage records; do not mention Form 1099-B.
