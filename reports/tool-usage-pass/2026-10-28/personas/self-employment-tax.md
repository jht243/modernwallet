# self-employment-tax — /self-employment-tax/how-much-to-set-aside-for-taxes/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials on the runner). Intent from the H1 "How Much Should I Set Aside for Taxes on 1099 Income?" (spoke of /self-employment-tax/).
- STEP 1 numbers (data_days = 20, early): people 24, uses 26, views 84, use_rate 0.31, people_7d 14. First time worked.
- Live page text check: the page names "quarterly due dates" only as a link to another guide; the dates themselves ("April 15", "June 15", "January 15") appear nowhere on the page.

## Persona
- Who/where: a first-year freelance UX designer on a laptop, married, spouse earns $71,500 on a W-2; expects $62,400 of net profit this year and just got a $6,000 client payment.
- Job: "What percent of this $6,000 do I move to the tax account, and what do I send the IRS each quarter — and when?"
- Done = a set-aside percentage, a quarterly amount, and the next date it is due.

## Walkthrough
Desktop 1366px (`screenshots/self-employment-tax-desktop.png`):
1. Page 200 in ~2.2s, `data-tool` root 453px down. Inputs: Net profit ($45,000), Filing status buttons (Single / Married / Head of hh), W-2 wages, Other household income, QBI checkbox (on).
2. Typed 62400 into Net profit, clicked Married, typed 71500 into Other household income (spouse's wages).
3. Result: "Set aside from every payment 23.1% — $14,384 of federal tax on $62,400 of net profit". SE tax $8,817, federal income tax on this income $5,567, Quarterly payment (1040-ES) $3,596, breakdown lines (92.35% net earnings $57,626, SS 12.4% $7,146, Medicare 2.9% $1,671, half-SE deduction −$4,408, QBI −$11,598). Re-computed with 2026 MFJ figures (Rev. Proc. 2025-32: $32,200 standard deduction, 10% to $24,800, 12% to $100,800): tax with the business $9,787 − without $4,220 = $5,567. Correct.
4. The persona now has "$3,596 a quarter" but no date. The tool says "Quarterly payment (1040-ES)" and stops; the page never lists the deadlines. A first-year freelancer in late October does not know the next one is January 15.
5. No picks block under the result.
Phone 390px (`screenshots/self-employment-tax-mobile.png`):
1. Same result; root 829px down; scrollWidth 390 (no horizontal scroll); no console errors. The QBI checkbox itself is under 24px tall, but its whole label row is clickable, so it is usable.

## Friction
- "$3,596 a quarter — due when? I've never paid estimated tax." — the quarterly figure has no due dates. → tool fix: under the quarterly stat, list the four 2026 Form 1040-ES due dates from IRS Form 1040-ES (2026) and highlight the next one from today's date. No math change.
- "Do I have to pay exactly this or get a penalty?" — the safe-harbor rule (100% / 110% of last year's tax) is not on the page or the tool. → next-tool row (estimated-tax safe-harbor / penalty calculator, STEP 4).

## Monetization
Verdict: fit
YMYL (tax) → books only. The result is a set-aside percentage and a quarterly payment for a new self-employed person; the next thing they do is learn the rules of running taxes as a freelancer. Ranked product-type list:
1. Book — self-employed tax primer (SE tax, quarterly payments, deductions in one place): 1950967174 *Independent Contractor, Sole Proprietor, and LLC Taxes Explained in 100 Pages or Less* (Mike Piper)
2. Book — freelancer law & tax handbook (Nolo): 141333217X *Working for Yourself* (Stephen Fishman)
3. Book — small-business deductions (lowering the profit the percentage is applied to): 1413333052 *Deduct It!* (Stephen Fishman, Nolo)
4. Book — annual tax guide for filing this year's return: 1394461577 *J.K. Lasser's Your Income Tax 2027*

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Net profit under $400 (no SE tax owed) | nothing to buy | No self-employment tax at this profit; no picks shown |
| Net profit $400 or more | 1950967174 Piper; 141333217X Fishman; 1413333052 Deduct It!; 1394461577 Lasser 2027 | How SE tax and quarterly payments work; the freelancer rules around them; deductions that cut the profit this percentage applies to; filing the year's return |
