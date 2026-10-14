# investing — /investing/high-yield-savings-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run (`gsc_search_analytics.py` fails: google-auth unavailable to the tool, no service-account credentials). Intent taken from the H1 "High Yield Savings Calculator" and the tool subhead "Enter your balance, deposits, and APY to see interest earned over time."
- STEP 1 numbers (30-day window, data_days = 6 — early data): people 72, uses 92, views 150, use_rate 0.613, people_7d 72 (ledger 2026-10-11: 32 → more than doubled, re-picked). Most-used tool on the site.

## Persona
- Who/where: a 30-something renter on a phone at lunch, moving a $25,000 emergency fund out of a big-bank savings account (0.4% APY) into an online HYSA advertising 4.1% APY, adding $500 a month.
- Job: "How much interest will I actually earn in 5 years, and is switching worth it?"
- Done = one trustworthy interest number — the one they keep after tax — to compare with what their bank pays now.

## Walkthrough
Desktop 1366px (`screenshots/investing-desktop.png`):
1. Page loads 200 (~3.5s), tool root `data-tool="investing"` 446px down, prefilled $10,000 / $300 / 4.5% / 10 yrs.
2. Typed Starting balance 25000, Monthly contribution 500, APY 4.1 (decimal now kept — last week's fix holds), Years 5, Compare 0.4.
3. Result: "Future value $63,911 after 5 years at 4.1% · You put in $55,000 · Interest earned $8,911" and "At 4.1% you earn $8,109 more interest over 5 years than at your current 0.4% ($802 interest)."
4. Looked for what they'd actually keep: no mention that HYSA interest is taxed as ordinary income (1099-INT); no way to enter a tax bracket.
Phone 390px (`screenshots/investing-mobile.png`):
1. No horizontal scroll (scrollWidth 390), tool 797px down, all controls ≥32px tall.
2. Same inputs → same result as desktop. No console errors at either width.

## Friction
- "So I earn $8,911 — but my bank sends a 1099-INT and I pay tax on that, right? How much do I really keep?" — the tool shows pre-tax interest only and never says interest is taxable. HYSA interest is ordinary income (IRS Topic 403). → tool fix: optional "Federal tax bracket" input; when set, show "After federal tax ≈ $X" under Interest earned. Worked example: $8,911 × (1 − 0.22) = $6,951.
- Nothing else blocked the job; last week's decimal + compare-APY fixes hold at both widths.

## Monetization
Verdict: fit
YMYL money tool → books only (owner rule 2026-10-12). Once this person has their number, their next move is setting up the account and deciding what the money is for (emergency fund vs. investing the extra). A book on that topic helps; a product does not. Ranked list (highest first):
1. Book — personal savings system / automating savings (completes the "where does this money go" job)
2. Book — financial independence / relationship with money (for those whose balance is growing past an emergency fund)
3. Book — beginner index investing (for money beyond the emergency fund)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Future value under $50,000 (building an emergency fund) | 1523505745 *I Will Teach You to Be Rich* (2nd ed., Ramit Sethi, Workman); 0143115766 *Your Money or Your Life* (Robin, Penguin) | Sets up automatic transfers into the HYSA you just priced |
| Future value $50,000 and up (cash beyond an emergency fund) | 1119847672 *The Bogleheads' Guide to Investing* (Wiley); 1119404509 *The Little Book of Common Sense Investing* (Bogle, Wiley); 0143115766 *Your Money or Your Life* | Explains what to do with savings past a 3–6 month cushion |
