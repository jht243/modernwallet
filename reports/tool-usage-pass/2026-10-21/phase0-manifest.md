# Phase 0 manifest — mindmap-pass 2026-10-21 (tool-usage)

Chart: `reports/mindmap-pass/2026-10-21-tool-usage.md` (filename date 2026-10-21; frontmatter `mindmap_pass_date: 2026-10-21`, `status: ready-for-execution`, 0 days old). Unattended run — manifest treated as approved per /tool-usage-mindmap-auto STEP 5.

Project facts: BASE_URL https://www.themodernwallet.com · Astro static build with React islands (via `CalculatorIsland.tsx`), deploys from `main` · canonical self-referential from the layout · IndexNow key `public/dc557f6bfced447aa1a71771d8a0d24a.txt` · sitemap generated at build by `@astrojs/sitemap` (no hand-edited XML) · calculator registry `src/data/calculators.ts` + `src/data/registry.ts` LIVE_IDS + `src/data/cross-links.ts`; spokes in `src/data/spokes-*.ts`; page date field `updated` · no `check-depth` script (source word count used) · brand ModernWallet · build `npm run build` (Node 20).

## Emerging search patterns detected this run
| Cluster (theme) | Member queries | Why emerging | Lever | Target | Format |
|---|---|---|---|---|---|
| Debt-to-income ratio | debt to income ratio calculator (22,200); what is debt to income ratio calculator; What is a good debt-to-income ratio? | coverage gap | create new content | /debt-to-income-ratio-calculator/ | calculator |
| Taxable Social Security benefits | social security taxable benefits calculator (1,900); how much of my social security is taxable calculator (110) | intent mismatch (guide only) | create new content | /social-security-taxable-benefits-calculator/ | calculator |
| Per diem interest / payoff amount | per diem interest calculator (480); payoff amount calculator (210) | intent mismatch | update existing body text | InterestPerDayCalculator.tsx (/interest-per-day/) | n/a |
| Car payment with tax and fees | auto loan calculator with tax (2,900); car payment calculator with tax and fees (720) | intent mismatch | update existing body text | AutoLoanCalculator.tsx | n/a |
| Rental sale tax | capital gains tax on rental property (880); rental property capital gains calculator (110) | intent mismatch | update existing body text | RentalCalculator.tsx + rental-sale-tax.ts (/real-estate/capital-gains-calculator/) | n/a |
| IRMAA | irmaa calculator (390) | coverage gap | create new content (spec) | /irmaa-calculator/ | calculator |
| Depreciation recapture | depreciation recapture calculator (480) | coverage gap | create new content (spec) | /real-estate/depreciation-recapture-calculator/ | calculator |
| 1031 exchange math | 1031 exchange calculator (480) | coverage gap | create new content (spec) | /real-estate/1031-exchange-calculator/ | calculator |

Question evidence flags: rows 4, 8, 9, 10, 11, 13 are `[verb-only]` (tool-fix/monetize rows backed by usage, not search); row 7 derived (no direct PAA). No off-topic PAA flag on any built row; `savings rate calculator` held for off-topic PAA (exclusions).

| Phase | Rows | Plan |
|---|---|---|
| Duplicate check | 5 checked | **passed** — every `create new content` row carries a `lookup:` entry from `scripts/mindmap/coverage_lookup.py` (3 matched an existing page with a different reader goal — rows 15, 18, 19; 2 no match — rows 14, 17). Gate attempt 1 reclassified row 16 (per diem → /interest-per-day/); attempt 2 narrowed row 18 to recapture-only (reviewer fix in place). |
| 1 — Cannibalization detection (advisory) | 0 | skipped — no rows; the new sale panel on /real-estate/capital-gains-calculator/ vs /real-estate/depreciation-calculator — different reader goals, no flag |
| 2 — Metadata | 0 | skipped — no rows (tool-fix guardrail: no title/meta/H1 changes) |
| 3 — New content | 5 | Create /debt-to-income-ratio-calculator/ [calculator, BUILT in 3c — income + monthly payments → back-end/front-end DTI, room to 36%/43%] — answers "How to calculate debt-to-income ratio?" in section 1; create /social-security-taxable-benefits-calculator/ [calculator, BUILT in 3c — status, benefits, other income, tax-exempt interest → provisional income, taxable benefits, % taxable] — answers "How do I figure the taxable amount of Social Security benefits?" in section 1; specs (next in line): /irmaa-calculator/, /real-estate/depreciation-recapture-calculator/, /real-estate/1031-exchange-calculator/ |
| 4 — Audit | — | Adversarial review of 2 new tool pages + 3 specs + every tool-fix / tool-monetize diff (rows 1–13, 16) |
| 5 — Body text | 14 | InterestPerDayCalculator: balance keeps decimals, per diem payoff section, book picks (rows 1, 16, 10). RentalCalculator: sale-tax panel + picks on the capital-gains page (rows 2, 12). Capital-gains spoke: 2026 thresholds + "maximum 25%" corrections (row 3). AutoLoanCalculator: sales tax/fees fields + auto picks (rows 4, 13). NetWorthCalculator: mortgage-excluded line + picks (rows 5, 11). SocialSecurityColaCalculator: deposit mode, projected Part B button, picks (rows 6, 7, 9). SiteFooter: 3-column calculator grid (row 8). Each changed page's `updated` bumped to 2026-10-21. |
| 6 — Internal linking | 0 + inbound | Inbound to the 2 new tools from their seed tools (COLA → taxable benefits; net-worth + auto-loan → DTI) + guides/cross-links |
| 7 — Sitemap + IndexNow | — | Sitemap regenerated at build (@astrojs/sitemap); IndexNow list → reports/mindmap-pass/2026-10-21-tool-usage.indexnow.txt (submitted post-deploy) |
| 8 — Summary | — | Print run summary, then auto-continue to Phase 9 (no approval stop) |
| 9 — Commit + deliver | — | Single commit; the run's deploy script lands it on main; report SHA; live 200 verify |

Manifest approved (unattended run rule).
