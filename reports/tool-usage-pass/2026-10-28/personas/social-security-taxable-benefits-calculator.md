# social-security-taxable-benefits-calculator — /social-security-taxable-benefits-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials on the runner). Intent from the H1 "Social Security Taxable Benefits Calculator" (built 2026-10-21 from the COLA persona's "is my raise taxed?" question; target keyword family "how much of my social security is taxable").
- STEP 1 numbers (data_days = 20, early): people 30, uses 32, views 59, use_rate 0.542, people_7d 30 (all in its first week). First time worked.

## Persona
- Who/where: a 68-year-old married retiree on a desktop in January, Form SSA-1099s for both spouses on the desk (combined box 5 $38,412.80), $42,000 of IRA withdrawals + pension, $1,850 of muni-bond interest.
- Job: "How much of our Social Security will be taxed — and roughly what will we owe on it, so we can set withholding?"
- Done = the taxable dollar amount, then a federal tax figure and a W-4V withholding choice (7%, 10%, 12% or 22%).

## Walkthrough
Desktop 1366px (`screenshots/social-security-taxable-benefits-calculator-desktop.png`):
1. Page 200 in ~2.5s, `data-tool` root 502px down. Inputs: Filing status (select), SS benefits ($42,000 placeholder), All other income ($30,000), Tax-exempt interest (blank). Hint points to SSA-1099 box 5.
2. Selected Married filing jointly; typed 38412.80 → field kept the cents ("38,412.8"); other income 42000; tax-exempt 1850.
3. Result: "Taxable part of your benefits $22,198 — provisional income is above $44,000, so up to 85% of your benefits can be taxed." Provisional income $63,056, share taxable 57.8%, not taxed $16,215, half of benefits $19,206. Re-computed by hand with IRS Pub 915 Worksheet 1: 42,000 + 1,850 + 19,206.40 = 63,056.40; 0.85 × 19,056.40 + 6,000 = 22,197.94; cap 0.85 × 38,412.80 = 32,650.88 → $22,198. Correct.
4. Disclaimer: "this tool does not compute that tax". The persona's real next question — the tax and the W-4V percentage — has no answer here and no link to where it would be.
5. No picks block under the result.
Phone 390px (`screenshots/social-security-taxable-benefits-calculator-mobile.png`):
1. Same result; root 965px down (below a long intro); scrollWidth 390; no small targets; no console errors.

## Friction
- "OK, $22,198 is taxable. So what do we owe, and should I check 10% or 12% on the W-4V?" — the tool stops at the taxable amount and never points to the next step. → next-tool row (W-4V / tax-on-benefits withholding calculator, STEP 4) and, now, a one-line "next step" link under the result to the site's tax-bracket calculator so the taxable figure can be carried over. No math change.
- Long intro pushes the tool 965px down on a phone — accepted (the page is new; intro length is set by the content standard), not a fix row.

## Monetization
Verdict: fit
YMYL (tax) → books only. The result is "this much of your benefit is taxed"; the person acting on it needs to understand how benefits are taxed and how to plan withdrawals around the thresholds. Ranked product-type list:
1. Book — Social Security guide that covers taxation of benefits: 1950967190 *Social Security Made Simple* (Mike Piper)
2. Book — plain-English income-tax primer (how the taxable part meets the brackets): 1950967204 *Taxes Made Simple* (Mike Piper)
3. Book — annual tax guide for filing this year's return: 1394461577 *J.K. Lasser's Your Income Tax 2027* (for 2026 returns)
4. Book — retirement-income / withdrawal planning (managing provisional income): 1945640154 *Retirement Planning Guidebook* (Wade Pfau)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Taxable part = $0 (below the base amount) | 1945640154 Pfau; 1950967190 Piper | Stay under the threshold as withdrawals change; how benefits work |
| Some benefits taxable (50% or 85% band) | 1950967190 Piper; 1950967204 Taxes Made Simple; 1394461577 Lasser 2027; 1945640154 Pfau | How the taxable part is computed, how it meets the brackets, filing this year's return, and planning withdrawals to lower it |
