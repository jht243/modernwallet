# net-worth — /net-worth/liquid-net-worth-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials). Intent from the H1 "Liquid Net Worth Calculator" and the tool heading "Calculate your spendable wealth — Liquid assets only — minus every debt."
- STEP 1 numbers (data_days = 13, early): people 19, uses 21, views 58, use_rate 0.362, people_7d 13. Ledger: worked 2026-10-11 as `low-use` with people_7d 1 → now 13 (more than double, "it took off — look again", STEP 2).

## Persona
- Who/where: a 38-year-old homeowner on a laptop, bank and brokerage tabs open: $18,500 cash, $42,000 brokerage, $126,000 401(k), house worth $410,000 with $298,000 left on the mortgage, $14,500 car loan, $3,200 card balance.
- Job: "If I lost my job, how much could I actually get my hands on?"
- Done = a liquid-money figure they can compare with their monthly costs.

## Walkthrough
Desktop 1366px (`screenshots/net-worth-desktop.png`):
1. Page 200 in ~4.0s, `data-tool` root 446px down, 11 money fields + age. Entered all of the above, age 38; student loans left blank.
2. Result: "LIQUID NET WORTH **−$255,200** — Cash + taxable investments ($60,500) minus all debts ($315,700)". Net worth (everything) $302,800, debt-to-asset 51.0%, "Age 38 (35–44): median $135,600, you are above by $167,200" (SCF 2022, correct).
3. As the persona: "Minus $255,000? I have $60,000 I can reach. The mortgage isn't due tomorrow — the house covers it." The definition is stated and is a recognised one (liquid assets minus all liabilities), but a homeowner gets a large negative number with no figure that answers their actual question (what can I reach after the debts I'd have to pay off).
4. Same 18px horizontal page scroll (site footer).
Phone 390px (`screenshots/net-worth-mobile.png`):
1. Same numbers; no horizontal scroll at 390px; inputs ≥32px; no console errors.

## Friction
- "Why am I negative a quarter million? My house is worth more than the mortgage." — the headline subtracts the home-secured mortgage from liquid assets while the home itself is excluded, and nothing on the result explains that or shows the number without it. → tool fix (additive, liquid page only): when a mortgage is entered, add a line under the headline: "Excluding the mortgage (secured by your home, which isn't counted here): $X" = liquid assets − (all debts − mortgage), plus one sentence saying why the headline is negative. Headline figure and definition unchanged. Worked example: $60,500 − ($315,700 − $298,000) = $42,800.
- Footer horizontal scroll — covered by the site-wide footer row.

## Monetization
Verdict: fit
YMYL (household balance sheet) → books only. With a liquid figure and a benchmark against the SCF median, the next step is building the number. Ranked product-type list:
1. Book — research on how households build net worth (what above-median savers do)
2. Book — debt payoff plan (for a negative or below-median result)
3. Book — index-investing guide (turning the liquid money into long-term wealth)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Liquid net worth negative, or below the age median | 140034252X *The Total Money Makeover* (updated, Ramsey); 1589795474 *The Millionaire Next Door* (Stanley & Danko); 0143115766 *Your Money or Your Life* (Robin & Dominguez) | Clear the debts pulling the number below zero, then the habits that build it |
| At or above the age median | 1589795474 *The Millionaire Next Door* (Stanley & Danko); 1119847672 *The Bogleheads' Guide to Investing*; 1119404509 *The Little Book of Common Sense Investing* (Bogle) | The research on households like yours, then putting the liquid money to work |
