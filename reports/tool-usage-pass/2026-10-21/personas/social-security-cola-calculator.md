# social-security-cola-calculator — /social-security-cola-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials; `gsc_search_analytics.py` exits with no credentials). Intent from the H1 "Social Security COLA Calculator for 2027" and the field labels; the page went live 2026-10-14, the day SSA announced the 3.6% COLA, and 165 of its 165 people came in the last 7 days.
- STEP 1 numbers (data_days = 13, early): people 165, uses 172, views 307, use_rate 0.56, people_7d 165. First time worked (no ledger line).

## Persona
- Who/where: a 71-year-old retiree on a phone, bank app open in another tab, just read the 3.6% headline. Knows the deposit that hits the bank each month ($1,644), not the "benefit before Medicare".
- Job: "How much more will I actually get in January?"
- Done = the new monthly deposit, in dollars, they can plan the 2027 budget around.

## Walkthrough
Desktop 1366px (`screenshots/social-security-cola-calculator-desktop.png`):
1. Page 200 in ~2.8s, `data-tool` root 565px down, two inputs, defaults show $2,000 → $2,072.00.
2. Typed 1847.30 into "Your monthly Social Security benefit now" (the gross amount from the 2026 notice, for the record) → field kept 1,847.3. Result $1,913.80, +$66.50/month, +$798.00/year. Correct: 1,847.30 × 1.036 = 1,913.80 (rounded down to the dime).
3. Typed 202.90 into "Medicare Part B premium deducted in 2027 (optional)" → "Payment after Part B $1,710". But the hint under it says the 2027 premium "has not been announced" — the persona has no 2027 number to type, and only knows the 2026 one.
4. As the persona: they only know the $1,644 deposit. The hint says "Use the benefit amount before any Medicare deduction" — typing $1,644 there gives $1,703.10, which is neither their gross benefit nor their deposit.
5. The page sits 18px wider than the window at 1366px (horizontal scrollbar). Cause: the site footer's calculator link grid (`.ftr-navs` right edge 1384px) — site-wide, every page.
Phone 390px (`screenshots/social-security-cola-calculator-mobile.png`):
1. No horizontal scroll at 390px, inputs ≥32px tall, same results, no console errors.

## Friction
- "I don't know my benefit 'before Medicare'. I know what lands in my bank: $1,644." — the tool only accepts the gross benefit. → tool fix (additive): an "I only know my monthly deposit" checkbox. When on, the first field reads "Your 2026 monthly deposit" and a second field holds the 2026 Part B premium taken out (prefilled with the 2026 standard premium $202.90, CMS); the tool rebuilds the gross benefit as deposit + premium (within $1, because SSA rounds the payment down to the dollar), then applies the COLA exactly as today. Worked example: $1,644 + $202.90 = $1,846.90 → × 1.036 = $1,913.30 (dime-rounded), +$66.40/month.
- "What's my 2027 premium? It says it hasn't been announced." — no figure to type. → tool fix (additive): a one-tap "Use the projected $209.50" button under the Part B field, citing the 2026 Medicare Trustees Report projection the site already quotes (guides.ts), labelled "projection — CMS sets the final premium in the fall". Worked example: $1,913.30 − $209.50 = $1,703.80 → $1,703 deposit.
- Desktop horizontal scroll from the footer (site-wide). → tool fix to `SiteFooter.astro` CSS only: keep the calculator link grid at 3 columns by flowing rows instead of adding a column per link.

## Monetization
Verdict: fit
YMYL (Social Security) → books only. With a 2027 deposit figure in hand, this retiree's next questions are "am I getting everything I'm owed?" and "what is Medicare taking?" — books on exactly those. Ranked product-type list:
1. Book — Social Security benefits guide (how the benefit, COLA and spousal/survivor rules work)
2. Book — Medicare guide (the Part B deduction, IRMAA, Medigap choices behind the deposit)
3. Book — retirement-income guide (making the deposit plus savings last)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Part B entered or deposit mode (Medicare is coming out of the check) | 1668031914 *Get What's Yours for Medicare — Revised and Updated* (Moeller, Simon & Schuster); 1950967190 *Social Security Made Simple* (Piper); 1982115831 *How to Make Your Money Last* (Quinn) | The premium is what shrinks the raise; then the benefit rules; then the budget |
| Gross benefit only (no Medicare deduction entered) | 1950967190 *Social Security Made Simple* (Piper); 1501144766 *Get What's Yours* (revised; Kotlikoff, Moeller, Solman); 1982115831 *How to Make Your Money Last* (Quinn) | Understanding the benefit the COLA just raised, then the retirement budget |
