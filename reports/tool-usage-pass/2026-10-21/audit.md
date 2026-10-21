# Phase 4 independent audit — tool-usage mindmap pass 2026-10-21 (themodernwallet.com)

Auditor: read-only Explore subagent that did not write the work. Inputs: chart rows 1–19, full git diff + untracked files, local build at dist/ (served on :4321), closed fact lists + allowed URLs for the two generated pages.

Guardrails (all rows): src/pages unchanged (data-tool={calc.id} untouched); package.json/lockfile unchanged; no metaTitle/metaDescription/title/H1 changed (curl of the 5 edited tool pages shows originals); every tool client-side, no paid API.

Row 1 — PASS — InterestPerDay MoneyInput now uses useDraft (inputMode decimal); 6,430.55 × 0.2499 ÷ 365 = $4.40/day; × 30 = $132.08; nothing removed.
Row 2 — PASS — RentalSaleTaxPanel only with preset saleTax: true (capital-gains spoke only); constants RECAPTURE_MAX_RATE 0.25 (Topic 409), RECOVERY_YEARS 27.5 (Pub 527), LTCG_TOPS_2026 single 49,450/545,500, MFJ 98,900/613,700 (Rev. Proc. 2025-32), NIIT 3.8% at 200k/250k (Topic 559); hand check basis 143,520, realized 291,400, gain 147,880, recapture 60,480 → 15,120, remaining 87,400 at 15% = 13,110, total 28,230; helper (189,000 × 0.8) ÷ 27.5 × 11 = 60,480.
Row 3 — PASS — 2024 thresholds replaced with 2026 (Topic 409 link); "a flat 25%" → "a maximum 25%" in howItWorks + both FAQs; updated 2026-10-21; no new paragraphs.
Row 4 — PASS — auto mode only: sales tax %, fees, roll-in checkbox, Sales tax stat, trade-in hint; engine unchanged; 7% × 29,495 = 2,064.65; loan 34,609.65 → $586.58/mo; hub + 5 AutoLoanCalculator spokes bumped, other-island spokes correctly not bumped.
Row 5 — PASS — "Excluding the mortgage" line in liquidFocus branch only when a mortgage is entered; headline unchanged; 60,500 − (315,700 − 298,000) = 42,800; net-worth hub + 7 spokes bumped.
Row 6 — PASS — deposit mode; PART_B_2026_STANDARD 202.9 (CMS, matches guides.ts); 1,644 + 202.90 = 1,846.90 × 1.036 → $1,913.30 (+$66.40); non-deposit path unchanged.
Row 7 — PASS — button fills PART_B_2027_PROJECTED 209.5 (2026 Trustees Report, matches guides.ts), labelled projection, editable; 1,913.30 − 209.50 → $1,703.
Row 8 — PASS — CSS only; ≥1101px calculator grid row flow with 3 max-content columns; ≤1100/≤560 rules unchanged; no link removed.
Row 9 — PASS — COLA picks after r.newBenefit > 0, below disclaimer; tiers per chart; ToolPicks: data-tool-picks, rel sponsored nofollow noopener noreferrer, _blank, disclosure, tag soulcircle01-20; books only, no price/rating.
Row 10 — PASS — interest-per-day picks when principal > 0 and APR > 0; DEBT_APR_PCT = 10 split; headings match chart.
Row 11 — PASS — net-worth picks when totalAssets > 0; below-median/negative vs at/above-median tiers; 1589795474 matches persona card.
Row 12 — PASS — real-estate picks under the sale panel, capital-gains page only; new ASINs match Han & MacFarland titles; after the tax estimate and disclaimer.
Row 13 — PASS — auto-loan picks auto mode only; extra vs no-extra tiers; mortgage picks untouched.
Row 14 — PASS — /debt-to-income-ratio-calculator/: Fannie Mae B3-6-02 constants 36/45/50 + CFPB definition; hand checks 38.0% / 25.4% / $0, $455, $780; 31.1% / $320; CFPB 33.3%; $3,000/$10,000 → 30.0%; edge inputs → "—", no NaN; wiring mirrors mortgage-recast (calculators.ts + sources + updated, CalculatorIsland, LIVE_IDS, cross-links, sitemap); data-tool present in dist; prose answers the reader question in intro paragraph one, all figures on the fact list, only allowed links; metaTitle 53 / desc 156; no neutrality claim, no byline.
Row 15 — PASS — /social-security-taxable-benefits-calculator/: Pub 915 Worksheet 1 constants; hand checks $51,000 → $11,950 (28.5%), +$5k tax-exempt → $16,200 (38.6%), single $32,000 → $3,500, single $75,000 → $25,500 cap, MFS-together rule; edge inputs safe; wiring + data-tool OK; prose figures on fact list; metaTitle 48 / desc 150.
Row 16 — PASS — "Paying it off on a date?" box (days or two dates, 365/360); 4.4027 × 18 = 79.25; payoff $6,509.80; days capped 0–3660; no new route; updated bumped.
Row 17 — PASS — irmaa-calculator-spec.md complete (route, format+rationale, function, keywords, dependencies, placeholder note).
Row 18 — PASS — depreciation-recapture-calculator-spec.md complete, recapture-only scope.
Row 19 — PASS — 1031-exchange-calculator-spec.md complete.

Advisory (non-blocking) and disposition:
1. Real-estate picks showed before a sale was entered → FIXED: picks now render only when a sale with a gain is entered.
2. Leftover un-hedged "25%" wording in the capital-gains spoke's formula line / commonMistakes, and the frozen metaDescription ("the 25% depreciation recapture the IRS always collects") → left for a future metadata/body pass (meta is frozen by the tool-fix guardrail); reported in the email.
3. NIIT literals in RentalSaleTaxPanel → FIXED (uses NIIT_THRESHOLD); starting values commented as editable.
4. Interest-per-day disclaimer said "Assumes a 365-day year" next to the new 360 option → FIXED (one-clause note).
5. DTI 36.04% shows "36.0%" next to "Above 36%" band — cosmetic, left.
6. SS taxable status label omits "qualifying surviving spouse" — cosmetic, left (prose names it).
7–8. Link-only edits (break-even FAQ, is-social-security-taxable guide, home affordability spoke) correctly not date-bumped; capital-gains toolSubheading updated to point at the new panel (in scope for row 2).
9. Footer width checked at 1366 and 390 → re-check at 1101–1280 in the live verification.
10. ASINs trusted from persona cards (amazon_pick output); all four new ASINs/titles match ToolPicks BOOKS.

depth: 2 passing / 0 failing / median 1030 (floor 600) — debt-to-income-ratio-calculator 955, social-security-taxable-benefits-calculator 1,104.


## Row → target map (the targets the auditor checked above, as written in the chart)
- Row 1 (tool fix): src/components/InterestPerDayCalculator.tsx (/interest-per-day/) — PASS (see Row 1 above)
- Row 2 (tool fix): src/components/RentalCalculator.tsx + src/lib/rental-sale-tax.ts + src/data/spokes-real-estate.ts preset (/real-estate/capital-gains-calculator/) — PASS (see Row 2 above)
- Row 3 (article): src/data/spokes-real-estate.ts (slug capital-gains-calculator) — PASS (see Row 3 above)
- Row 4 (tool fix): src/components/AutoLoanCalculator.tsx (/auto-loan/amortization-schedule/ and every auto-loan page) — PASS (see Row 4 above)
- Row 5 (tool fix): src/components/NetWorthCalculator.tsx (/net-worth/liquid-net-worth-calculator/) — PASS (see Row 5 above)
- Row 6 (tool fix): src/components/SocialSecurityColaCalculator.tsx (/social-security-cola-calculator/) — PASS (see Row 6 above)
- Row 7 (tool fix): src/components/SocialSecurityColaCalculator.tsx (/social-security-cola-calculator/) — PASS (see Row 7 above)
- Row 8 (tool fix): src/components/SiteFooter.astro (every page) — PASS (see Row 8 above)
- Row 9 (tool monetize): src/components/SocialSecurityColaCalculator.tsx + src/components/ToolPicks.tsx (/social-security-cola-calculator/) — PASS (see Row 9 above)
- Row 10 (tool monetize): src/components/InterestPerDayCalculator.tsx (/interest-per-day/) — PASS (see Row 10 above)
- Row 11 (tool monetize): src/components/NetWorthCalculator.tsx + src/components/ToolPicks.tsx (/net-worth/ pages) — PASS (see Row 11 above)
- Row 12 (tool monetize): src/components/RentalCalculator.tsx + src/components/ToolPicks.tsx (/real-estate/capital-gains-calculator/) — PASS (see Row 12 above)
- Row 13 (tool monetize): src/components/AutoLoanCalculator.tsx (/auto-loan/ pages) — PASS (see Row 13 above)
- Row 14 (calculator): /debt-to-income-ratio-calculator/ — PASS (see Row 14 above)
- Row 15 (calculator): /social-security-taxable-benefits-calculator/ — PASS (see Row 15 above)
- Row 16 (tool fix): src/components/InterestPerDayCalculator.tsx + src/lib/per-diem-interest.ts (/interest-per-day/) — PASS (see Row 16 above)
- Row Cluster (theme) (Target): Lever — PASS (see Row Cluster (theme) above)
- Row --- (---): --- — PASS (see Row --- above)
- Row Debt-to-income ratio (/debt-to-income-ratio-calculator/): create new content — PASS (see Row Debt-to-income ratio above)
- Row Taxable Social Security benefits (/social-security-taxable-benefits-calculator/): create new content — PASS (see Row Taxable Social Security benefits above)
- Row Per diem interest / payoff amount (src/components/InterestPerDayCalculator.tsx + src/lib/per-diem-interest.ts (/interest-per-day/)): update existing body text — PASS (see Row Per diem interest / payoff amount above)
- Row Car payment with tax and fees (src/components/AutoLoanCalculator.tsx (/auto-loan/amortization-schedule/ and every auto-loan page)): update existing body text — PASS (see Row Car payment with tax and fees above)
- Row Rental sale tax (capital gains + recapture) (src/components/RentalCalculator.tsx + src/lib/rental-sale-tax.ts + src/data/spokes-real-estate.ts preset (/real-estate/capital-gains-calculator/)): update existing body text — PASS (see Row Rental sale tax (capital gains + recapture) above)
- Row # (format): target — PASS (see Row # above)
- Row --- (---): --- — PASS (see Row --- above)
- Row 17 (calculator): /irmaa-calculator/ — PASS (see Row 17 above)
- Row 18 (calculator): /real-estate/depreciation-recapture-calculator/ — PASS (see Row 18 above)
- Row 19 (calculator): /real-estate/1031-exchange-calculator/ — PASS (see Row 19 above)
- Row Cluster (theme) (Target): Lever — PASS (see Row Cluster (theme) above)
- Row --- (---): --- — PASS (see Row --- above)
- Row IRMAA (/irmaa-calculator/): spec (next in line) — PASS (see Row IRMAA above)
- Row Depreciation recapture (/real-estate/depreciation-recapture-calculator/): spec (next in line) — PASS (see Row Depreciation recapture above)
- Row 1031 exchange math (/real-estate/1031-exchange-calculator/): spec (next in line) — PASS (see Row 1031 exchange math above)
- Rows 17–19 moved from the main table to the chart's "Next in line" section after this audit (they are specs, not pages — routine STEP 5); their spec audits above still stand.

VERDICT: PASS
