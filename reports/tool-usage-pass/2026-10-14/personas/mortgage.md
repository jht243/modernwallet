# mortgage — /mortgage/payoff-calculator/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from the H1 "Mortgage Payoff Calculator" and tool subhead "Add an extra monthly payment to see your new payoff date and interest saved." Payoff searchers already have a mortgage.
- STEP 1 numbers (data_days = 6, early): people 7, uses 7, views 16, use_rate 0.438, people_7d 7. First time worked.

## Persona
- Who/where: a homeowner 4 years into a 30-year loan, on a laptop with the mortgage statement open: balance $238,000 at 6.875%, 26 years left, thinking about adding $300/month.
- Job: "If I pay $300 extra a month, when is my house paid off and how much interest do I save?"
- Done = a payoff date and an interest-saved number they can act on this month.

## Walkthrough
Desktop 1366px (`screenshots/mortgage-desktop.png`):
1. Page 200 (~4.4s), `data-tool="mortgage"` root 477px down. Inputs are for a NEW purchase: Home price, Down payment, rate, Loan term (10/15/20/30 yrs only).
2. No field for "current balance" or "years left" — typed the balance 238000 into Home price (shown 238,000), left down payment empty.
3. Typed the rate **6.875** → the field shows **6875**. The decimal point is dropped as it's typed.
4. Typed Extra 300. Result: "Total monthly payment **$1,363,661** + $300 extra … Total interest $6,096,763 · Payoff time 5 months … save **-$6,096,763** in interest and pay off 99 years 7 months sooner (vs. 100 years)". Nonsense from the 6875% rate.
5. Even with a whole-number rate, 26 years left can't be entered (only 10/15/20/30), and with $0 down the tool adds an estimated PMI to a loan whose PMI may already be gone.
Phone 390px (`screenshots/mortgage-mobile.png`):
1. No horizontal scroll, root 891px down, inputs ≥32px. Same 6875 / $1,363,661 result. No console errors.
- The same `AutoLoanCalculator` component renders /auto-loan/amortization-schedule/ (4 people this week) — same rate-field bug there.

## Friction
- "I typed 6.875 and it says $1.36 million a month. This thing is broken." — the APR field drops the decimal (raw `<input>` parsing each keystroke; "6." becomes "6"). Every mortgage rate has a decimal. → tool fix: route the APR field through the shared `useDraft` helper from `calc-ui.tsx` (the fix used on 6 tools last week). Worked example: 6.875% on $238,000 / 30 yrs → P&I $1,563.
- "I don't have a home price, I have a balance and 26 years left." — no way to model an existing loan. → tool fix (mortgage mode only, additive): "I already have this mortgage" toggle; when on, the price field reads "Current loan balance", down payment is hidden/0, a "Years left" + "months" input replaces the term select, and the PMI estimate is skipped (we don't know the home's value). Worked example: $238,000, 6.875%, 312 months left → P&I ≈ $1,639; +$300/month pays it off in 213 months instead of 312 (8 yrs 3 mo sooner), saving ≈ $99,200 interest.

## Monetization
Verdict: fit
YMYL (mortgage) → books only. With a payoff date and interest-saved number, the next job is deciding whether extra payments beat investing or other debts. Ranked list:
1. Book — debt payoff plan (paying the house off early)
2. Book — invest-vs-prepay / index-investing guide (the other side of the choice)
3. Book — homebuying guide (for visitors pricing a new purchase)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Extra payment entered (paying off early) | 140034252X *The Total Money Makeover* (updated, Ramsey, Thomas Nelson); 1119847672 *The Bogleheads' Guide to Investing* (Wiley) | The pay-it-off plan, and the case for investing the extra instead |
| No extra payment, new purchase | 1413332420 *Nolo's Essential Guide to Buying Your First Home* (Nolo); 140034252X *The Total Money Makeover* | Buying-process guide for someone pricing a new loan |
