# Asset spec — Cash Value Life Insurance Calculator

**Status:** spec only. A human builds the tool.
**Source:** podcast-pain-pass run 2026-08-03, chart row 22.

## Demand
| term | volume/mo | KD |
|---|---|---|
| `cash value life insurance calculator` | 1,000 | 27 |

Autocomplete adds `cash value life insurance growth calculator`,
`cash value life insurance policy calculator`, `how much cash value life insurance calculator`,
`how much can you borrow against life insurance cash value`.

## Podcast hook
"If she had an emergency today, how much is available for loan?" and "What's her monthly payment
and how much total has she put into the policy so far?" — the caller already owns a permanent
policy and cannot get a number out of it.

## Route
`/estate-planning/cash-value-life-insurance-calculator/` — new spoke in
`src/data/spokes-estate-planning.ts` under the live `estate-planning` hub. The only existing
`cash value` reference on the site is the Medicaid spend-down calculator, an unrelated contract.

## Inputs
- Current cash value (from the policy's annual statement)
- Current death benefit
- Total premiums paid to date (this is cost basis)
- Loan amount requested
- Policy loan interest rate, from the contract (the tool must NOT guess a rate)
- Whether interest will be paid annually or allowed to accrue
- Years to project
- Assumed annual cash-value growth rate (user-entered, clearly labeled an assumption)
- Marginal tax rate (for the lapse scenario)
- Is the policy a modified endowment contract (MEC)? yes / no / unsure
- Owner age (for the MEC 10% additional tax check)

## Outputs
1. **Maximum available to borrow** — most insurers cap below full cash value; make the cap an
   input with a clearly labeled default rather than a hardcoded assumption.
2. **Loan balance over time** with interest accruing and compounding.
3. **Net death benefit** = death benefit minus outstanding loan and accrued interest. The single
   most important output.
4. **Lapse projection** — the year the loan plus interest overtakes cash value, if it does.
5. **Tax on lapse or surrender** — gain over cost basis taxed as ordinary income, with the amount
   and the estimated tax. Flag the trap: a policy that lapses with a large loan can produce a tax
   bill with no cash to pay it.
6. **MEC branch** — if MEC, loans are taxed income-first and may carry a 10% additional tax before
   59 1/2 (exceptions: 59 1/2, disability, substantially equal periodic payments).

## Basis subtlety flagged by the audit — get this right in the engine
IRS Pub 525 defines cost as premiums paid less refunded premiums, rebates, dividends, and
**unrepaid loans that were not included in income**. But on lapse or surrender the loan discharge
is itself included in the amount realized. The two adjustments interact, and stating only one of
them produces a wildly different tax number. Model the full mechanism and show the reader both
components, rather than a single-line "cash value minus premiums" subtraction.

## Dependencies
- No shared engine exists for this; new `src/lib/` module.
- **Never ship a default loan interest rate as if it were market data.** Rates are contract-specific.
- No insurer names, no product names, no lead-gen. This topic is saturated with lead-gen content;
  the tool must stay neutral and cite only regulators.

## Primary sources
- IRS Pub 525 (surrender of policy for cash, cost basis): https://www.irs.gov/publications/p525
- IRS Form 5329 instructions (10% additional tax, MECs): https://www.irs.gov/instructions/i5329
- NAIC consumer guide to life insurance (loans subtracted from death benefit): https://content.naic.org/consumer/life-insurance.htm

## Related pages shipped this run
`/guides/borrowing-against-life-insurance/` — link the tool from it once built.
