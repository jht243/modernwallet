# Phase 4 audit — independent auditor (Explore subagent, did not write the work)

Scope: 3 new tool pages (Phase 3c) + 6 tool-fix diffs + 1 body row (Phase 5) + Phase 6 links. Inputs: chart, closed fact lists, allowed-urls.txt, drafts + meta.guards, git diff, built dist/, local preview walk.

## Round 1 (summary) — 7 PASS, 3 FAIL, all Rung 1 fix-in-place
- /retirement/social-security-retirement-calculator/ (src/data/spokes-retirement.ts, earnings-test sentence): run-on 42-word sentence → replaced with auditor's two-sentence text. Math of 82½ break-even and $2,728/$7,285 verified.
- /portfolio/60-40-portfolio-calculator/ (src/components/PortfolioCalculator.tsx, src/data/spokes-portfolio.ts preset): assumptions line rendered on every portfolio page without date bumps → gated behind `show6040Gap` (60/40 page only).
- /social-security-break-even-calculator/: $0 benefit reported a false break-even (67 and 1 month) → engine requires base > 0, shows "enter your benefit"; result subline keyed on breakEvenMonths.
Hand checks passed: break-even 78y8m / 82y6m / 80y5m, 65v67 $1,733 → 80, born 1957 72.5%/128%; reimbursement $1,630, $1,760/$130, $1,320/$310, $1,802.50; rebalancing $10k/$10k, $9,642.86/$357.14, $30k exact; HYSA $63,910 / $8,150 gap; SS total $4,568. Wiring mirrors /expense-ratio-calculator/; data-tool = slug; client-side; titles ≤60, descriptions ≤160; no self-serving disclaimers; no first-person claims.

## Round 2 (full report)
### /investing/high-yield-savings-calculator/ (src/components/InvestmentCalculator.tsx, src/components/calc-ui.tsx, src/data/spokes-investing.ts preset)
PASS (unchanged from round 1)
### /trump-account/ (src/components/TrumpAccountCalculator.tsx)
PASS (unchanged from round 1); seed note now from age 1.
### /retirement/social-security-retirement-calculator/ (src/components/RetirementCalculator.tsx, src/data/spokes-retirement.ts preset)
PASS (unchanged from round 1)
### /retirement/social-security-retirement-calculator/ (src/data/spokes-retirement.ts, earnings-test sentence)
PASS — two-sentence replacement verbatim; figures and SSA rtea link correct.
### /portfolio/60-40-portfolio-calculator/ (src/components/PortfolioCalculator.tsx, src/data/spokes-portfolio.ts preset)
PASS — assumptions line gated behind show6040Gap (only the 60/40 preset sets it); other portfolio pages render identical text; 60/40 page dated 2026-10-11.
### /mileage-deduction/irs-mileage-rate-2026/ (src/components/MileageDeductionCalculator.tsx)
PASS (unchanged from round 1)
### /net-worth/liquid-net-worth-calculator/ (src/components/NetWorthCalculator.tsx, src/data/spokes-net-worth.ts preset)
PASS (unchanged from round 1); definition line now names other assets.
### /social-security-break-even-calculator/
PASS — base > 0 guard; $0 → "enter your benefit", $2,000 → "78 and 8 months"; EARLY_TIER_MONTHS named constant; hint links ssa.gov/myaccount (allowed list); FAQ says "the calculator's first field".
### /mileage-reimbursement-calculator/
PASS (unchanged from round 1)
### /portfolio-rebalancing-calculator/
PASS (unchanged from round 1)

### Advisory (non-blocking)
- New CrossLinks entries add a related-calculator link on ~22 category pages with no date bump (treated as site navigation).
- Break-even calculator has no inbound link from a guide yet (inbound: SS retirement page sentence + retirement category cross-links on every retirement page + site calculator nav).
- Two pre-existing em dashes remain in edited sentences on the SS retirement page.
- Depth: 3/3 tool pages pass the mirrored tool-page depth (1,056 / 1,033 / 994 words vs 1,019 on /expense-ratio-calculator/); depth gate's article floors do not apply to calculator rows.

VERDICT: PASS
