# Asset spec — 457(b) Calculator

**Status:** spec only. A human builds the tool.
**Source:** podcast-pain-pass run 2026-08-03, chart row 20.

## Demand
| term | volume/mo | KD |
|---|---|---|
| `457b calculator` | 1,900 | 17 |

KD 17 is the lowest-difficulty term of any row in this run. Autocomplete also returns
`457b growth calculator`, `457b future value calculator`, `457b withdrawal calculator`,
`457b withdrawal tax calculator`, `457b loan calculator`, `457b how much should i contribute`.

## Podcast hook
"Should I contribute to my 457(b) or should I contribute to my Roth 401k since it's after taxes?"
— Suze Orman's Women & Money, week of 2026-08-03.

## Route
`/retirement/457b-calculator/` — new spoke in `src/data/spokes-retirement.ts` under the live
`retirement` hub. The site has no 457(b) engine today.

## Inputs
- Current 457(b) balance
- Annual salary
- Contribution (percent of salary or flat dollar)
- Employer contribution, if any — **note the asymmetry: in a 457(b) employer money counts against
  the same annual limit, unlike a 403(b)/401(k) match**
- Current age and planned separation age
- Expected annual return
- Plan type: **governmental vs non-governmental (top-hat)** — this is the switch that changes the
  whole output, not a cosmetic field
- Tax treatment: pre-tax or designated Roth (governmental plans may offer Roth)
- Years of service (for the special three-year catch-up eligibility check)

## Outputs
1. **Projected balance** at separation and at 59 1/2.
2. **Contribution-limit check** against the current-year elective deferral limit, with the
   age-50 catch-up, the ages 60–63 catch-up, and the special three-year catch-up
   (up to 2x the annual limit, capped by prior unused room, not combinable with age-50).
   **The age-50 catch-up must be disabled when plan type = non-governmental.**
3. **Early-access view** — for a governmental plan, show withdrawals after separation with **no
   10% additional tax at any age**, taxed as ordinary income. This is the feature no other
   retirement calculator on the site models and the reason the tool is worth building.
4. **Rolled-in balance warning** — money rolled in from a 401(a)/403(a)/403(b)/IRA keeps its 10%
   early-withdrawal exposure. Track it as a separate source bucket if the user enters one.
5. **Non-governmental warning** — assets remain employer property and are available to its general
   creditors; surface this whenever that plan type is selected.

## Dependencies
- Current-year elective deferral + catch-up limits; needs a dated constants block.
- 2026 mandatory-Roth catch-up rule: a participant whose prior-year FICA wages from the sponsor
  exceeded the threshold must make catch-up contributions as Roth. Verify the threshold and its
  indexing before encoding it.
- Growth math can reuse the compounding approach in `src/lib/investment.ts`.

## Primary sources
- IRS IRC 457(b) plans: https://www.irs.gov/retirement-plans/irc-457b-deferred-compensation-plans
- IRS non-governmental 457(b): https://www.irs.gov/retirement-plans/non-governmental-457b-deferred-compensation-plans
- IRS Topic 558 (10% additional tax and the 457 exemption + rollover carve-out): https://www.irs.gov/taxtopics/tc558
- IRS multi-plan deferral limits: https://www.irs.gov/retirement-plans/how-much-salary-can-you-defer-if-youre-eligible-for-more-than-one-retirement-plan
- IRS Roth catch-up final regs: https://www.irs.gov/newsroom/treasury-irs-issue-final-regulations-on-new-roth-catch-up-rule-other-secure-2point0-act-provisions

## Related pages shipped this run
`/compare/457b-vs-403b/` and `/compare/457b-vs-roth-ira/`. Both should link the tool once built.
