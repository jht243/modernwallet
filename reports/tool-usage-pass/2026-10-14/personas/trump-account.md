# trump-account — /trump-account/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from the H1 "Trump Account Calculator".
- STEP 1 numbers (data_days = 6, early): people 21, uses 21, views 47, use_rate 0.447, people_7d 21 (ledger 2026-10-11: 12 — not doubled). Lane `monetize` (catch-up: 3+ people, no monetize verdict in the ledger).

## Persona
- Who/where: a new parent on a phone at night, baby born 2026 (eligible for the $1,000 federal seed), planning $200/month ($2,400/yr) plus a $500/yr employer contribution.
- Job: "How much will my kid's Trump Account be worth at 18?"
- Done = the age-18 number, and a sense of whether to put money here or in a 529.

## Walkthrough
Desktop 1366px (`screenshots/trump-account-desktop.png`):
1. Page 200 (~3.7s), `data-tool="trump-account"` root 440px down.
2. Typed Child's age 0, Yearly family 2400, Yearly employer 500 (seed left $1,000, return 7%).
3. Result: "Value at age 18 $107,603 in 18 years at 7% · 2.02× what you put in · You put in $53,200 · Tax-deferred growth $54,403" + "Estimate only…" note.
Phone 390px (`screenshots/trump-account-mobile.png`):
1. No horizontal scroll, root 775px down. Same result. No console errors.

## Friction
Monetization catch-up — friction worked 2026-10-11, not re-worked.

## Monetization
Verdict: fit
YMYL → books only. With a $107k-at-18 number, the parent's next job is teaching the kid what to do with it and investing it sensibly. Ranked list:
1. Book — raising money-smart kids (the account becomes theirs at 18)
2. Book — index-fund investing guide (the account must hold a U.S. equity index fund)
3. Book — family/couples money planning

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Child age 0–9 | 1476766819 *Make Your Kid a Money Genius (Even If You're Not)* (Kobliner, Simon & Schuster); 1119404509 *The Little Book of Common Sense Investing* (Bogle, Wiley); 1523523689 *Money for Couples* (Sethi, Workman) | Long horizon: money habits from the start + the index-fund logic the account uses |
| Child age 10–17 | 1476766819 *Make Your Kid a Money Genius*; 1119847672 *The Bogleheads' Guide to Investing* (Wiley) | The child will control this money soon — teach them now |
