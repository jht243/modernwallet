# Asset spec — Target-Date Fund Calculator

**Status:** spec only. A human builds the tool.
**Source:** podcast-pain-pass run 2026-08-03, chart row 23.

## Demand
| term | volume/mo | KD |
|---|---|---|
| `target date fund calculator` | 110 | 68 |

Lowest-priority of the six specs — modest volume and the highest difficulty in the run. Build the
other five first. Autocomplete also returns `target date fund growth calculator`.

## Podcast hook
Target-date funds are named in 4 of the 56 transcripts, and the site had **zero** coverage before
this run. The demand cluster is real (`vs index fund`, `vs s&p 500`, `vs voo`, `which year should
I choose`), but it is mostly informational — which is why three content pages shipped this week
and the tool is deferred.

## Route
`/investing/target-date-fund-calculator/` — new spoke in `src/data/spokes-investing.ts` under the
live `investing` hub.

## Inputs
- Current balance and annual contribution
- Current age and target retirement year
- Fund's stock/bond allocation today (user-entered from the fund's fact sheet)
- Glide path type: **to** or **through**
- Stock allocation at the target date (from the fund's published glide path)
- Expected stock and bond returns, entered separately
- Expense ratio, with a second field for a comparison fund

## Outputs
1. **Projected balance at the target year**, using an allocation that shifts along the entered
   glide path rather than a single blended return. That shifting-allocation projection is the
   whole reason this tool differs from the existing
   [investment growth calculator](/investing/investment-growth-calculator/).
2. **Allocation table by year** — stock/bond split at each age along the path.
3. **To vs through divergence** — the same inputs under both glide-path types, showing how
   differently two funds labeled with the same year can behave at and after retirement.
4. **Fee drag** — ending balance at the fund's expense ratio vs the comparison fund's. The index
   vs active spread within a single brand can exceed 0.5 percentage points.
5. **Post-retirement view** for `through` funds, since they keep shifting for years past the
   target date.

## Dependencies
- Needs a year-by-year variable-allocation projection. Check whether
  `src/lib/portfolio.ts` or `src/lib/investment.ts` can be extended before writing a new module.
- **Do not hardcode any fund's glide path or expense ratio.** Issuers change both. Every
  fund-specific number must be a user input, sourced by the reader from the fund's own fact sheet.

## Primary sources
- SEC target-date funds investor bulletin (to vs through definitions; same-year funds differ):
  https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/target-date-funds-investor-bulletin
- DOL, Target Date Retirement Funds — Tips for ERISA Plan Fiduciaries:
  https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/fact-sheets/target-date-retirement-funds-tips-for-erisa-plan-fiduciaries
  (403s to automated clients; loads normally in a browser)
- FINRA, Save the Date: Target-Date Funds Explained:
  https://www.finra.org/investors/insights/save-date-target-date-funds-explained

## Related pages shipped this run
`/guides/what-target-date-fund-should-i-choose/` (selection method),
`/roundup/best-target-date-funds/` (family-by-family cost ranking),
`/compare/target-date-fund-vs-sp500/` (deferred to next run — beyond this run's BUILD_CAP).
Link the tool from all of them once built.
