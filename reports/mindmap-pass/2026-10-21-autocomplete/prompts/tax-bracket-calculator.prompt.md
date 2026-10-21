# ROW PROMPT (data only) — tax-bracket-calculator

route: /tax-bracket-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool   register: operator   page type: explainer / calculator page (intro ~140 words, howItWorks ~420 words, 8 FAQs)
primary keyword: tax bracket calculator (also: what tax bracket am i in, marginal tax rate calculator, effective tax rate calculator, 2026 tax bracket calculator)
intent: a taxpayer who wants to know in one step which 2026 federal bracket their income lands in, what they would owe, and what their effective rate is.
reader question: "What tax bracket am I in?" [PAA 3/6 how-to-calculate; ac 5/5 question]
answer: Your bracket is the rate on your last dollar of taxable income, which is income after the standard deduction. Example: a single filer with $85,000 of income has $68,900 of taxable income, lands in the 22% bracket, and owes about $9,870, an effective rate of 11.6%. Do not open with a definition.
answer placement: section 1 — introText paragraph one gives the bracket answer; paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: income before deductions (default $85,000); filing status (single, married filing jointly, head of household, married filing separately; default single); deduction (standard deduction by default, or a custom itemized/other total).
Outputs: your 2026 federal bracket as the headline, with taxable income and estimated tax; effective rate of income; room left in the current bracket; a table of tax by bracket.
Method the page may state: taxable income = income minus deduction (never below zero). Tax is computed band by band: only the dollars inside each band are taxed at that band's rate. Marginal rate = the rate of the highest band that holds any taxable dollar. Effective rate (shown) = total tax divided by income before deductions. Room left = the dollars of taxable income before the next bracket starts.
Assumptions the page must state: ordinary-income brackets only; no credits, capital gains rates, qualified business income deduction, payroll tax or state tax; the user enters income before deductions and the tool subtracts the deduction.

## CLOSED FACT LIST — every number or rule the page may state. Anything not on this list, you do not know. Never invent a price, limit, benchmark or URL.
Source: IRS Revenue Procedure 2025-32 (2026 inflation adjustments), tables 1 to 4, and the IRS newsroom release on the 2026 adjustments.
2026 standard deduction: $16,100 single; $16,100 married filing separately; $32,200 married filing jointly; $24,150 head of household.
2026 rates: 10%, 12%, 22%, 24%, 32%, 35%, 37%.
2026 single, taxable income thresholds: 10% up to $12,400; 12% over $12,400; 22% over $50,400; 24% over $105,700; 32% over $201,775; 35% over $256,225; 37% over $640,600.
2026 married filing jointly: 10% up to $24,800; 12% over $24,800; 22% over $100,800; 24% over $211,400; 32% over $403,550; 35% over $512,450; 37% over $768,700.
2026 head of household: 10% up to $17,700; 12% over $17,700; 22% over $67,450; 24% over $105,700; 32% over $201,750; 35% over $256,200; 37% over $640,600.
2026 married filing separately: same as single through the 35% band; 37% over $384,350.
Worked examples (computed by the calculator):
- Single, income $85,000, standard deduction: taxable income $68,900; 10% on $12,400 = $1,240; 12% on $38,000 = $4,560; 22% on $18,500 = $4,070; total tax $9,870; bracket 22%; effective rate 11.6% of income; $36,800 of room left before the 24% bracket starts at $105,700.
- Married filing jointly, income $150,000: taxable income $117,800; tax $15,340; bracket 22%; effective rate 10.2%.
- Head of household, income $60,000: taxable income $35,850; tax $3,948; bracket 12%; effective rate 6.6%.
- Single, income $250,000: taxable income $233,900; tax $51,304; bracket 32%; effective rate 20.5%.
- Single, income $40,000: taxable income $23,900; tax $2,620; bracket 12%; effective rate 6.6%.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/pub/irs-drop/rp-25-32.pdf (IRS Revenue Procedure 2025-32)
https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill (IRS 2026 adjustments)

## Internal routes it may link (real routes only)
/guides/2026-tax-brackets/ (the full 2026 bracket tables, ships in the same run), /guides/2027-tax-brackets-projected/ (projected 2027 brackets), /guides/how-much-tax-will-i-pay/ (how much tax you will owe), /compare/ordinary-income-vs-capital-gains-tax/ (capital gains rates), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) the inputs and the standard deduction; (2) band-by-band tax with the $85,000 single example; (3) marginal versus effective rate and the room-left figure; (4) the other filing-status examples; (5) what the tool leaves out and when the answer is wrong for you (credits, capital gains, QBI, state tax, payroll tax, income that is not wages).
Neutrality: explain; no personalized tax advice; a tax professional or the IRS can confirm a specific return.
Who this is not for: anyone who needs a full return, capital gains or self-employment tax.
What would change the answer: deductions beyond the standard deduction, credits, capital gains, and a change in filing status.

## FAQ questions (verbatim, in this order)
1. What tax bracket am I in?
2. How do you calculate your tax bracket?
3. What is the difference between a marginal and an effective tax rate?
4. Does moving into a higher bracket mean all my income is taxed more?
5. What are the 2026 federal tax brackets?
6. What is the standard deduction for 2026?
7. How do I lower my taxable income to drop a bracket?
8. Does this calculator include state tax?
