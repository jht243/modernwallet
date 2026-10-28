---
mindmap_pass_date: 2026-10-28
source: competitor publishing monitor (10 newest of 8,336 candidates incl. a retry backlog), unattended; all 10 are NerdWallet pages
interpreted_brief: Ten NerdWallet personal-finance pages. Build original pages only where no existing page serves the same reader and primary-source facts support the page. Competitor outlines are topic evidence only.
generated_by: mindmap-pass build phase, keyword demand ladder (rung that answered: estimate, DataForSEO has no credentials in this run) + Autocomplete question sweep + coverage_lookup.py
demand_source: estimate (Google Autocomplete question sweep, NOT measured volume)
serp_reads: 0 heads read (DataForSEO unavailable; serp_verdict unread, PAA unavailable)
status: executed
---
Duplicate check: passed -- 3 new-page rows checked by an independent reviewer; 1 matched an existing page and was dropped (high-interest loans -> /guides/payday-loan-calculator-explained/); 2 kept (no prior commit touches either topic: only fea4fb5 candidate list and 3da3239 infrastructure)

## Preparation check
| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | reports/mindmap-pass/2026-10-28-competitor/readiness.md |

| # | problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Lens 1, NerdWallet "Average Retirement Savings by Age" (updated 2026-10-28). lookup: no match (/retirement/retirement-savings-calculator is a projection tool, /guides/average-hsa-balance-by-age is HSA). Cluster: average retirement savings by age; median retirement savings by age; average 401k savings by age (Autocomplete 20/20 on the head, estimate NOT measured). The Fed released the 2025 Survey of Consumer Finances on 2026-10-09 and no page on this site uses it. | Create /guides/average-retirement-savings-by-age/ using the Fed's 2025 means by age, the 2022 to 2025 change we calculated, and the all-ages mean-versus-median gap | create new content | /guides/average-retirement-savings-by-age/ | article (calculated evidence, table) | text | text | unread | DataForSEO unavailable | What is the average retirement savings by age? [ac 20/20 question-pattern; no PAA available] | Mean balance among savers rises from $48,400 under 35 to $670,200 at 55 to 64; the all-saver median is $106,000 (figure) | section 1 |
| 2 | Lens 1, NerdWallet "How to Get a Student Loan Deferment" and "Unemployment Deferment" (both updated 2026-10-27). lookup: no match (guides cover refinancing, forgiveness, repayment plans, not deferment). Cluster: student loan deferment; how does student loan deferment work; how long does student loan deferment last; how to get student loan deferment (Autocomplete). Rule change: 34 CFR 685.204 bars unemployment and economic hardship deferment for loans disbursed on or after 2027-07-01. | Create /guides/student-loan-deferment/ covering the request sequence, deferment types, interest on unsubsidized loans, the 2027 change and deferment versus forbearance | create new content | /guides/student-loan-deferment/ | article (calculated evidence, table) | text | text | unread | DataForSEO unavailable | How do I defer my student loans? [ac 6/6 how-pattern; no PAA available] | Ask your servicer, name the deferment type, keep paying until approved; interest still accrues on unsubsidized loans (mechanism) | section 1 |
| 3 | Inbound links | Add cross-links from existing related pages to the two new guides | add internal links | src/data/cross-links.ts | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| Retirement savings benchmarks | average retirement savings by age; median retirement savings by age; average 401k savings by age | new Fed 2025 data (2026-10-09) not on site | none | create new content | /guides/average-retirement-savings-by-age/ | article | text | text | unread | n/a |
| Student loan deferment | student loan deferment; how does student loan deferment work; how long does student loan deferment last | rule change for loans disbursed from 2027-07-01 | none | create new content | /guides/student-loan-deferment/ | article | text | text | unread | n/a |

## New-page briefs

### Row 1: /guides/average-retirement-savings-by-age/
- Identity: working H1 "Average Retirement Savings by Age"; page type explainer (floor 1,200 words); article, text; register operator.
- Reader and answer: US adults checking whether their balance is typical. Opening answer: families aged 55 to 64 who hold an IRA or workplace plan average $670,200, those under 35 average $48,400, and the typical (median) saver across all ages holds $106,000. Placement: section 1.
- Keyword evidence: "average retirement savings by age" and "median retirement savings by age", demand estimated from Autocomplete (20 completions, 2026-10-28, US), NOT measured; DataForSEO had no credentials. 
- SERP and question findings: not read (no provider). Autocomplete completions cover age 30, 40, 50, 60, 65, median, 401k, "in the us".
- Why a new page: strongest matches /guides/average-hsa-balance-by-age (HSA balances), /retirement/retirement-savings-calculator (projection tool), /guides/college-savings-by-age; none answers "what do other people have". Also /guides/how-much-do-i-need-to-retire-by-age/ (target multiples to aim for); different reader goal (peer benchmark versus savings target), the new page links to it and it links back. Commits checked: none touch this topic. Independent duplicate review below.
- Outline: 1 "Average Retirement Savings by Age in 2025" (table of means, medians where the Fed gives them); 2 "Mean Versus Median: Why Averages Overstate" (4.3 times gap); 3 "How the Averages Changed From 2022 to 2025" (our calculation); 4 "What Counts and What Is Left Out" (only families with an IRA or defined contribution plan; Fed reports ages under 65; Social Security and pensions excluded); 5 "What to Do If You Are Below the Average" (link to calculator and 401(k) guides); FAQ from Autocomplete questions.
- Contribution and evidence: calculated. Source: Federal Reserve, Changes in U.S. Family Finances from 2022 to 2025, Box 2 Table A and asset table, https://www.federalreserve.gov/publications/files/scf26.pdf (read 2026-10-28). Our calculation of percent changes and ratios: evidence/average-retirement-savings-by-age/calc.py. Provenance basis: calculated from reported data; the Fed does not publish medians by age in this release ("not shown"), the page says so.
- Tables/tools: table age group, 2022 mean, 2025 mean, change; link to existing calculator. No new tool.
- Testing and review: site `_experience.md` section G excludes financial services; no TESTED format; ordinary presentation; YMYL, byline template-rendered.
- Takeaway: your balance is "on track" relative to peers only if you compare to the median saver ($106,000 all ages), not the mean; the all-ages mean ($451,100) is 4.3 times the all-ages median ($106,000), so a by-age mean is not a typical balance; condition: the figures exclude people with no account, so they overstate the typical adult.
- Inbound links: /retirement/retirement-savings-calculator, /guides/average-hsa-balance-by-age, /guides/401k-contribution-limits-2026 (via cross-links.ts). Outbound: calculator, 401k and IRA limit guides.
- Technical: guides.ts record, sitemap, existing components; measurement: new route, not-yet-published, age-matched comparator, baseline unavailable.

### Row 2: /guides/student-loan-deferment/
- Identity: H1 "How to Get a Student Loan Deferment"; explainer (1,200); article, text; operator.
- Reader and answer: federal borrower who cannot pay. Opening: contact your servicer, request the specific deferment, keep paying until approved; on unsubsidized loans interest keeps accruing. Section 1.
- Keyword evidence: "student loan deferment", "how to get student loan deferment", "how long does student loan deferment last" (Autocomplete 61 completions, estimate NOT measured).
- SERP: not read.
- Why new: matches /guides/student-loan-standard-repayment-plan, /guides/student-loan-forgiveness-programs, /guides/should-you-refinance-student-loans, and /guides/what-happens-if-you-dont-pay-your-student-loans/ (default timeline); none covers pausing payments while in good standing. The new page links to the default guide. Commits: none.
- Outline: 1 "How to Request a Deferment" (sequence); 2 "Types of Federal Deferment" (in-school, unemployment, economic hardship, military, etc., with durations from 34 CFR 685.204); 3 "What Happens to Interest" (our calculation); 4 "The July 2027 Change" (loans disbursed on or after 2027-07-01 lose unemployment and economic hardship deferment; forbearance capped at nine months in 24); 5 "Deferment Versus Forbearance"; 6 "Private Loans"; FAQ.
- Contribution: calculated interest-accrual scenarios (hypothetical balances and rates); sources 34 CFR 685.204 and 685.205 via eCFR (read 2026-10-28), https://www.ecfr.gov/current/title-34/part-685/section-685.204 and /section-685.205. Studentaid.gov returned errors on fetch, so no claim rests on it.
- Testing/review: excluded (financial); ordinary presentation; YMYL.
- Takeaway: defer only when you cannot cover payments and an income-driven plan is not available; subsidized loans do not accrue interest during deferment, unsubsidized do; loans disbursed after 2027-07-01 lose two options.
- Links: inbound from /guides/what-happens-if-you-dont-pay-your-student-loans/, /guides/student-loan-standard-repayment-plan/, /guides/types-of-student-loans/; outbound to those plus /guides/student-loan-forgiveness-programs/ and /guides/should-you-refinance-student-loans/.
- Technical: guides.ts record in src/data/guides.ts, existing sitemap generation, cross-links.ts; measurement as row 1.

## Exclusions
- NerdWallet IRA and Roth IRA contribution limit pages: skipped-duplicate, /guides/ira-contribution-limits-2026/ (commits: none needed; covers 2026 limits and Roth income limits).
- NerdWallet Nibbles credit card: skipped-duplicate, /guides/should-you-get-the-nibbles-credit-card/.
- NerdWallet personal loans for non-U.S. citizens: skipped-low-value, vendor list needs verified lender terms and only 6 completions.
- NerdWallet loan to buy a business: HELD, SBA acquisition rules (equity injection, seller notes) are mid-revision (SOP 50 10 8.1 reported for 2026-10-01) and no SBA primary page could be read this run.
- NerdWallet business loan deferment: skipped-low-value, 1 completion, no verified primary source.
- NerdWallet high-interest loans: skipped-duplicate, /guides/payday-loan-calculator-explained/ (already has the 391% APR, the alternatives sequence, a 36% installment comparison and rollover steps; reviewer RECLASSIFY accepted; 3 of 30 completions on-topic). No enrichment queued: remaining gaps (credit-union PAL specifics) are thin-demand.
- Retry backlog (8,274 pending-retry items, mostly Calculator.net, Omni, SmartAsset and Bankrate tools): not sent this run, stays pending.
- Discovery coverage: Autocomplete question sweep only, 6 seeds, 20/61/62/47/6/1 completions (high-interest seed: 62 rows, 3 on-topic) saved in reports/mindmap-pass/2026-10-28-competitor.autocomplete.*.csv; no widening because no measured provider is available.

## Final results
- Published (pending live verification): /guides/average-retirement-savings-by-age/, /guides/student-loan-deferment/. Writer model: claude-opus-5-5 for both (no fallback; the first Claude pool key had no credit, the second key answered). Evidence basis: calculated from reported primary sources (Federal Reserve SCF 2025; 34 CFR 685.204/685.205). No tested labels (financial services excluded).
- Independent Phase 4: 5 rounds, final r5 PASS on both guides and the changed garnishment calculator route (audit/phase4-verdict-r5.md, audit/rendered-review-r5.json; rendered-audit.py check verified).
- Inbound links: /student-loan-wage-garnishment-calculator/ pill (date bumped to 2026-10-28), /guides/ index cards. Retirement guide: no narrow placement; a shared "retirement" pill would have touched 12 calculator routes, so it was not added.
- Advisories carried: ed.gov and peacecorps.gov unverified from sandbox (403); layout checked structurally only; inherited footer em-dash and neutrality sentence are site-wide, outside this run.
