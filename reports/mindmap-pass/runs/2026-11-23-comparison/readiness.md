# Readiness report, job 2026-11-23-comparison (comparison-content-auto, unattended)

Preparation status: PASS pending independent CHART-REVIEW. Actor mindmap-build, run-id ab343106cdb14889996b2ffe6f1a7acd, context 2026-11-23-comparison-build epoch 1. Preflight bundle (32 parts) read in full, check = delivery-complete-sources-current.

## Keyword data
SEMRUSH returned HTTP 403 (key unusable); ladder demoted to DataForSEO (volume, KD, expand). source=dataforseo, kd_source=dataforseo (modeled KD, treat as hint). Raw: research/keyword-volumes.json, research/kw-status.json. SERP/PAA: research/serp.json (11 heads, $0.0235). Coverage: research/coverage-lookup.txt (875 repo pages / 891 sitemap routes).

## Per-candidate disposition (all 11)
| ID | Candidate | Volume/KD | Disposition | Reason |
|---|---|---|---|---|
| 1 | visa vs mastercard | 8,100 / 11 | DEFER | No page exists. Primary sources (usa.visa.com 404, mastercard.us 403) could not be captured verbatim; no CFPB/Fed primary captured for network-vs-issuer and fee claims. Not written from memory. Carry forward. |
| 2 | ssdi vs ssi | 18,100 / 6 | CREATE (A3) | No dedicated page. eCFR primary text captured (404.315, 404.130, 404.1505, 416.202, 416.905, 416.1100, 416.1205). SSA.gov is anti-bot (403) so no current-year dollar figures from SSA; scope narrowed to eligibility structure and the statutory $2,000/$3,000 resource limits. |
| 3 | fidelity vs robinhood | 5,400 / 0 | DROP (duplicate) | /compare/robinhood-vs-fidelity already covers this exact pair (same reader intent). No-addition. |
| 4 | money market fund vs money market account | 880 / 14 | DROP (duplicate) | /compare/money-market-account-vs-money-market-fund exists, same intent. |
| 5 | payday loan vs personal loan | 110 / 0 | DROP (weak demand) | 110/mo; SERP spam-dominated but too small to justify a HIGH-risk consumer-credit page now. |
| 6 | tenants in common vs joint tenancy | 9,900 / 5 | CREATE (A2) | No page. Primaries captured: IRC 1014, IRC 2040, IRS Pub 551, IRS Topic 701/409, Florida Stat. 689.15. CA and NY statutes were anti-bot blocked; page states state law varies and uses Florida only as a worked example. |
| 7 | ynab vs copilot | 140 / 0 | DROP (weak demand) | 140/mo, vendor pricing primaries not captured. Existing /alternatives/ynab partly serves. |
| 8 | medicare part a vs part b | 1,000 / 33 | DEFER | HIGH-claim page; medicare.gov blocks verbatim capture (curl 404; WebFetch only returns summaries), 2027 Part B premium not announced (site guides state this). No verbatim primary, so deferred. |
| 9 | bonds vs bond funds | 480 / 6 | CREATE (A1) | No page. Primaries captured: investor.gov bonds, investor.gov mutual funds, FINRA bonds. |
| 10 | fixed vs variable rate student loans | 390 / 17 | DEFER | studentaid.gov is a JS shell (31 chars), CFPB rates page 404. Federal rate figures unsourceable verbatim. |
| 11 | t-bills vs hysa | 140 / 0 | DROP (weak demand) | 140/mo; cd-vs-treasury-bill and hysa-vs-cd exist. |

Routes to create: 3 (all /compare/ routes, comparison table/database).

## Application map
- Testing (_testing-labels.md, _experience.md G): G excludes financial/legal/professional services; none of the 3 pages tests a product. Ordinary presentation, basis reported/calculated-none. No TESTED label, no howWeTested.
- Decision evidence (_decision-evidence.md): basis=reported for all three (primary statutes/regulators); source-only branch, no numeric model, no fake test. Visible attribution names the source (SEC/FINRA/IRS/eCFR/Florida Statutes). Takeaway planned per page intent (purchase/comparison and informational).
- Risk floor: A1 investment claims, A2 legal/tax, A3 federal benefits eligibility => HIGH profile (finance/legal). No medical dosing; no liabilityBlock expected. professionalReviewRequired not set (educational overview, general information, not advice).
- Vendor research: no vendor-addition; n/a.
- Mindmap chart obligations: titles 50-60 chars Title Case, no Conclusion/Summary headings, FAQ from on-topic PAA, who-this-is-not-for and what-would-change-our-answer sections, disclaimers at bottom, concrete next-action final sentence, 3 inbound links per page.
- Anti-suppression/dedupe: coverage lookup shows no same-intent page for A1-A3; candidate 3 and 4 dropped on exact matches.
- Growth: growth.json planned per route under evidence/<slug>/, status not-yet-published; baseline unavailable (not zero).

## Per-page preparation checks
| Page | Duplicate check | Testing eligibility | Evidence and label decision | Takeaway brief | Evidence |
|---|---|---|---|---|---|
| /compare/bonds-vs-bond-funds | no same-intent page (coverage-lookup) | excluded (financial) | reported, ordinary | conditional pick | investor.gov, FINRA captures |
| /compare/tenants-in-common-vs-joint-tenancy | no page | excluded (legal) | reported, ordinary | conditional pick, state-law caveat | IRC/IRS/FL captures |
| /compare/ssdi-vs-ssi | no page | excluded (benefits/legal) | reported, ordinary | which program fits whom, can receive both | eCFR captures |

Known limits: SSA, medicare.gov, Visa, Mastercard, studentaid.gov, CA/NY statute sites are anti-bot blocked from this environment; those claims are excluded rather than recalled from memory. Single-page capture text is HTML-stripped verbatim; source boilerplate retained.
