# interest-per-day — /interest-per-day/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials). Intent from the H1 "Interest Per Day Calculator" and the hint "a savings/HYSA/CD balance earning interest, or a loan/credit card balance accruing it".
- STEP 1 numbers (data_days = 13, early): people 23, uses 23, views 40, use_rate 0.575, people_7d 17. First time worked.

## Persona
- Who/where: a 34-year-old on a laptop with a credit-card statement open: balance $6,430.55 at 24.99% APR, deciding whether to pay it off this week or next.
- Job: "How much is this card costing me every day I wait?"
- Done = a per-day and per-month dollar figure for THEIR balance.

## Walkthrough
Desktop 1366px (`screenshots/interest-per-day-desktop.png`):
1. Page 200 in ~3.6s, `data-tool` root 440px down, two inputs (Balance or loan amount, Annual interest rate (APR)), defaults $10,000 at 4.5% → $1.23/day.
2. Typed "6430.55" into Balance, key by key, as copied from the statement → the field shows **643,055**. The decimal point disappears the moment it is typed ("6430." re-renders as "6,430"), so ".55" lands as "55" on the end.
3. Typed 24.99 into APR → kept 24.99 (that field already uses the shared draft helper).
4. Result: "Interest per day **$440.27** on $643,055 at 24.99%", per month $13,208.17. For their real balance it should be $4.40/day, $132.08 per 30 days. A 100× wrong answer with no visible error.
5. Same 18px horizontal page scroll as every page (site footer).
Phone 390px (`screenshots/interest-per-day-mobile.png`):
1. Same 643,055 / $440.27 result. No horizontal scroll at 390px, inputs ≥32px, no console errors.

## Friction
- "I typed my balance exactly — $6,430.55 — and it says $440 a day. That can't be right." — the balance field drops the decimal (its local `MoneyInput` re-renders the parsed number on every keystroke). Every statement balance has cents. → tool fix: route the balance field through the shared `useDraft` helper in `calc-ui.tsx` (the fix already used on its APR field and on 6 tools on 2026-10-11). No math change. Worked example: $6,430.55 × 24.99% ÷ 365 = $4.40/day; × 30 = $132.08.
- Footer horizontal scroll — covered by the site-wide footer row (see social-security-cola-calculator).

## Monetization
Verdict: fit
YMYL (debt / savings) → books only. The result is either "what my debt costs per day" or "what my savings earn per day". The tool can't know which, but the rate is a strong tell: 10%+ APRs are cards and loans, lower rates are savings accounts. Ranked product-type list:
1. Book — debt payoff plan (for a high-APR balance: stop the daily interest)
2. Book — automated saving / banking system (for a savings balance: where to keep it, how to automate)
3. Book — index-investing basics (for money that has outgrown a savings account)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| APR 10% or higher (debt) | 140034252X *The Total Money Makeover* (updated, Ramsey); 1523505745 *I Will Teach You to Be Rich* (2nd ed., Sethi) | A step-by-step plan to clear the balance that's costing $X a day; then the system that keeps it cleared |
| APR under 10% (savings) | 1523505745 *I Will Teach You to Be Rich* (2nd ed., Sethi); 1119404509 *The Little Book of Common Sense Investing* (Bogle) | Where the balance should sit and how to automate it; then the investing step past savings |
