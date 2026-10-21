# auto-loan — /auto-loan/amortization-schedule/

## Evidence
- GSC queries: no GSC access in this cloud run (no service-account credentials). Intent from the H1 "Auto Loan Amortization Calculator" and the tool heading "Generate your amortization schedule — Enter your loan to see the full month-by-month principal and interest breakdown."
- STEP 1 numbers (data_days = 13, early): people 12, uses 12, views 34, use_rate 0.353, people_7d 8. First time worked as its own tool (the shared `AutoLoanCalculator` rate-field decimal bug was fixed 2026-10-14 via the mortgage row; confirmed fixed today — 6.79 stays 6.79).

## Persona
- Who/where: a 29-year-old at the kitchen table with a dealer's buyer's order on the phone: $38,995 SUV, $4,000 down, $9,500 trade-in still owing $6,200, 6.79% for 72 months, 7% sales tax and $850 in title, registration and doc fees.
- Job: "What will my payment really be, and what does $100 extra a month save?"
- Done = a monthly payment that matches the dealer's paperwork, plus a schedule to keep.

## Walkthrough
Desktop 1366px (`screenshots/auto-loan-desktop.png`):
1. Page 200 in ~2.8s, `data-tool` root 491px down. Fields: vehicle price, down payment, trade-in value, still owed on trade-in, APR, term select (24–84 months), extra payment.
2. Entered all of the above, 72 months, $100 extra → "Monthly payment $537 + $100 extra", loan amount $31,695, total interest $5,632, payoff 4 yrs 11 mo, "save $1,350 in interest and pay off 1 year 1 month sooner". Math checks for a $31,695 loan.
3. As the persona: the dealer's paper says about $587 a month. There is no field for sales tax or fees, so the tool's loan is ~$2,900 smaller than the one they're signing. The engine (`src/lib/auto-loan.ts`) already supports `salesTaxPct`, `titleFees` and `includeTaxesFees`; the form just never shows them.
4. "Show amortization schedule" and "Download full schedule (CSV)" both work.
5. Same 18px horizontal page scroll (site footer).
Phone 390px (`screenshots/auto-loan-mobile.png`):
1. Same numbers; no horizontal scroll at 390px; inputs ≥32px; no console errors.

## Friction
- "The dealer says $587, you say $537. Where's the sales tax?" — no tax/fee inputs, so the payment is understated for almost every real purchase. → tool fix (auto mode only, additive): "Sales tax %" and "Title, registration & dealer fees" fields plus a "Roll tax and fees into the loan" checkbox (on by default only once a tax or fee is entered; blank fields leave today's result unchanged), wired to the engine's existing `salesTaxPct` / `titleFees` / `includeTaxesFees`; a "Sales tax" stat appears when tax > 0; a hint says most states tax the price after the trade-in (the engine's method) and a few tax the full price — check your state. No new math. Worked example: tax 7% × ($38,995 − $9,500) = $2,064.65; loan $38,995 − $4,000 − $9,500 + $6,200 + $2,064.65 + $850 = $34,609.65 → $586.58/month at 6.79% for 72 months.
- Footer horizontal scroll — covered by the site-wide footer row.

## Monetization
Verdict: fit
YMYL (auto debt) → books only. With a real payment and the interest an extra $100 saves, the next step is either paying the loan down or questioning the purchase. Ranked product-type list:
1. Book — debt payoff plan (paying the car off early with the extra payment)
2. Book — personal-finance system with a car-buying chapter (negotiate / how much car to buy)
3. Book — spending-values book (whether the payment fits the life they want)

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Extra payment entered | 140034252X *The Total Money Makeover* (updated, Ramsey); 1523505745 *I Will Teach You to Be Rich* (2nd ed., Sethi) | A plan for putting the extra toward the loan; then the system around it |
| No extra payment (pricing a purchase) | 1523505745 *I Will Teach You to Be Rich* (2nd ed., Sethi); 0143115766 *Your Money or Your Life* (Robin & Dominguez) | Covers buying a car and big purchases; then whether this payment is worth the hours it costs |
