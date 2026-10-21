# ROW PROMPT (data only) — social-security-taxable-benefits-calculator

route: /social-security-taxable-benefits-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; intro ~140 words, howItWorks ~420 words, 8 FAQs)
primary keyword: social security taxable benefits calculator (also: how much of my social security is taxable calculator, taxable social security calculator 2026, provisional income)
intent: a retiree (often just after checking the 2027 COLA) wants to know how much of their Social Security will be counted as taxable income on their return.
reader question: "How do I figure the taxable amount of Social Security benefits?" [PAA 3/6 how-to "How do I figure the taxable amount of Social Security benefits?", "How do I calculate my taxable Social Security benefits for 2026?"; ac 10/10]
answer: A figure: add half your benefits to all your other income and any tax-exempt interest; above $25,000 (single) or $32,000 (married filing jointly) up to 50% of benefits becomes taxable, and above $34,000 or $44,000 up to 85%. A joint couple with $42,000 of benefits and $30,000 of other income has $11,950 of taxable benefits.
answer placement: section 1 — introText paragraph one gives the rule in one or two sentences and says what the tool returns; paragraph two is the $42,000 worked example. Do not open with a definition of Social Security or a history of the tax.

## The calculator (describe only what it does)
Inputs: filing status (three options: "Single, head of household, or married filing separately (lived apart all year)"; "Married filing jointly"; "Married filing separately (lived with spouse)"); Social Security benefits for the year (box 5 of Form SSA-1099, both spouses' if filing jointly, or 12 × the monthly benefit before Medicare); all other income (pensions, IRA withdrawals, wages, interest, dividends); tax-exempt interest (municipal bonds).
Outputs: taxable part of the benefits; one line saying which tier applies; provisional income; share of benefits taxable (%); benefits not taxed; half of the benefits.
Method the page may state (IRS Publication 915, Worksheet 1): provisional income = all other income + tax-exempt interest + half of the benefits. At or below the base amount ($25,000 single etc.; $32,000 married filing jointly; $0 married filing separately and lived with spouse) nothing is taxable. Between the base amount and $34,000 ($44,000 joint) the taxable part is the smaller of half the benefits or half the income above the base amount. Above $34,000 ($44,000 joint) the taxable part is the smaller of 85% of the benefits, or 85% of the income above $34,000 ($44,000) plus the smaller of half the benefits or $4,500 ($6,000 joint).
Assumptions the page must state: the taxable part is added to other income and taxed at the reader's normal rates — the tool does not compute that tax; adjustments such as student loan interest, the foreign earned income exclusion and lump-sum back payments are left out; the IRS worksheet in tax software is the exact figure; the $25,000/$32,000 and $34,000/$44,000 amounts are set by law and not adjusted for inflation.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a tax rate, a bracket, a state rule, a statistic or a URL. Do not state any income tax bracket or the tax owed.
- IRS Publication 915 (2025 edition, for 2025 returns): base amount $25,000 if single, head of household, or qualifying surviving spouse (and married filing separately if you lived apart from your spouse all year); $32,000 married filing jointly; $0 married filing separately and lived with your spouse at any time during the year. Up to 50% of benefits taxable generally; up to 85% taxable when half the benefits plus all other income (including tax-exempt interest) is more than $34,000 ($44,000 married filing jointly). Source: https://www.irs.gov/publications/p915
- These dollar amounts come from the tax code (26 U.S.C. §86) and are not indexed to inflation.
- Worked examples (computed by the calculator):
  - Married filing jointly, $42,000 benefits, $30,000 other income, $0 tax-exempt interest: provisional income $51,000; taxable benefits $11,950; 28.5% of benefits taxable.
  - Same couple with $5,000 of tax-exempt municipal bond interest added: provisional income $56,000; taxable benefits $16,200; 38.6%.
  - Single, $24,000 benefits, $20,000 other income: provisional income $32,000; taxable $3,500; 14.6%.
  - Single, $24,000 benefits, $10,000 other income: provisional income $22,000; $0 taxable.
  - Single, $30,000 benefits, $60,000 other income: provisional income $75,000; taxable $25,500, the 85% maximum.
- The separate deduction for people 65 and older (up to $6,000 per person, tax years 2025 through 2028) lowers taxable income but does not change how much of the benefits counts as taxable; ModernWallet's guide covers it at /guides/senior-deduction-social-security/.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/publications/p915 (IRS Publication 915). Nothing else.

## Internal routes it may link (real routes only)
/guides/is-social-security-taxable/ (is Social Security taxable — the explainer), /guides/senior-deduction-social-security/ (senior deduction), /guides/states-that-tax-social-security/ (states that tax Social Security), /social-security-cola-calculator/ (2027 COLA calculator), /tax-bracket-calculator/ (tax bracket calculator), /retirement/social-security-retirement-calculator/ (Social Security retirement calculator), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) provisional income and what goes into it (including tax-exempt interest — the $5,000 municipal-bond example); (2) the three tiers with the base and adjusted amounts per filing status; (3) the joint worked example step by step; (4) why the thresholds aren't indexed and what that means as benefits rise with each COLA (link /social-security-cola-calculator/), state tax is separate (link /guides/states-that-tax-social-security/), the senior deduction is separate (link /guides/senior-deduction-social-security/); (5) limits: no tax computed — use /tax-bracket-calculator/ to see the rate on the taxable amount; worksheet adjustments left out; the IRS worksheet is exact. Link /guides/is-social-security-taxable/ as the full explainer.
Who this is not for: someone who wants their total federal tax bill — the tool stops at the taxable amount.
What would change the answer: married filing separately while living together (taxable from the first dollar of provisional income), lump-sum back benefits for earlier years.

## FAQ questions (verbatim, in this order)
1. How do I figure the taxable amount of Social Security benefits?
2. How do I calculate my taxable Social Security benefits for 2026?
3. What is the formula for calculating the Social Security tax deduction?
4. Where can I find the worksheet for calculating taxable Social Security benefits?
5. What is the new $6000 tax break for seniors?
6. Does tax-exempt interest count toward provisional income?
7. Can more than 85% of my Social Security be taxed?
8. Will my 2027 COLA make more of my benefits taxable?
For question 3 explain that the formula is for the taxable part of benefits (provisional income), and point to the senior-deduction guide for the deduction. For question 4 name IRS Publication 915, Worksheet 1. For question 5 use only the senior-deduction fact above and link /guides/senior-deduction-social-security/. For question 8 explain the thresholds don't rise with COLAs, so a raise can push provisional income over a threshold; use no new numbers.
