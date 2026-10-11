---
mindmap_pass_date: 2026-10-11
source: free-form input brief (top-10 GSC queries 2026-10-04→2026-10-11 + trend-pass research pack), demand-validated
interpreted_brief: Our 10 top Google queries for the 7 days ending 2026-10-11 (all 0 clicks; mortgage-lender and online-will variants dominate) plus research that finds no new trend and no uncovered top-20 query. Build what the demand implies the site lacks. The live SERP and PAA for the "best home loan" / "best mortgage lenders" heads pointed at an adjacent gap: the site has pairwise mortgage-type comparisons but no overview of the types.
generated_by: mindmap-pass build phase — keyword demand ladder (volume=dataforseo, kd=dataforseo; Ahrefs/SEMRUSH not configured) + Autocomplete miner (types-of-mortgage-loans 34 suggestions, 400000 mortgage 6) + live SERP reality check (12 heads read, ~$0.05) + adversarial duplicate-suppression reviewer
demand_source: dataforseo
serp_reads: 12 heads, ~$0.05 of $2.00
status: ready-for-execution
---

Keyword data: volume=dataforseo, kd=dataforseo. Raw: reports/mindmap-pass/cache/2026-10-11-trend-lane-c.volumes.json, 2026-10-11-trend-lane-c.serp.json.

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lens 2 (adjacent to "best home loan", 880/mo KD 34, PAA "What is the best type of home mortgage loan?"). `types of mortgage loans` 8,100/mo KD 15 (measured), `best type of mortgage loan` 260, `best type of home loan` 260; 34 Autocomplete suggestions. Site has only pairwise pages (fha-vs-conventional, fixed-vs-arm, va-vs-conventional, usda-vs-fha) and no overview. No prior commits touch the route. | Create /guides/types-of-mortgage-loans/ — one-table overview (conventional/conforming, jumbo, FHA, VA, USDA, state/local programs), the three CFPB choices (type, term, rate type), links to the pairwise pages | create new content | /guides/types-of-mortgage-loans/ | article — list shape with a pick rule | text | text | winnable (AI Overview) | fidelity-bank.com, investopedia.com, credit unions, ally.com, amerisave.com; no forum lock | "What are the main types of mortgage loans, and which one fits me?" [PAA 5/6 on-topic; ac 34] | List: three choices (type, term, rate type); compare Loan Estimates | section 1: "The Main Types of Mortgage Loans at a Glance" | top-10 |
| `payment on 400000 mortgage` 1,900/mo; PAA "What salary do I need for a $400,000 mortgage?" | Guide on income needed for a $400k mortgage | create new content | /guides/how-much-income-to-afford-a-400k-house/ | article | text | text | winnable (AI Overview) | rocketmortgage.com, zillow.com, usbank.com | "What salary do I need for a $400,000 mortgage?" | Figure | section 1 | top-10 — HELD (needs a rate assumption; no current rate can be grounded unattended) |
| `mortgage lender vs bank` 390/mo KD 0; PAA "bank or mortgage company?" | Comparison /compare/mortgage-lender-vs-bank/ | create new content | /compare/mortgage-lender-vs-bank/ | comparison table/database | text | text | winnable | n/a | "Is it better to get a mortgage through a bank or a mortgage company?" | Pick | section 1 | top-10 — HELD (thin; no primary source read this run) |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| Mortgage loan types overview | types of mortgage loans (8,100); best type of mortgage loan (260); best type of home loan (260); best home loan (880) | coverage gap at theme level — only pairwise pages | partial | create new content | /guides/types-of-mortgage-loans/ | article | text | text | winnable (AI Overview) | fidelity-bank.com, investopedia.com |

## Exclusions / candidates considered
Volumes DataForSEO measured unless marked estimate.
- best mortgage lenders / best home mortgage lenders (12,100/mo) / best home loan lenders / best lenders for home loans — DROP: /roundup/best-mortgage-lenders/ is the dedicated page (pos ~77-82; ranking job for page-quality/page-1-2 passes). Ledger 2026-10-10 stands.
- will online / last will online (6,600/mo) — DROP: /roundup/best-online-will-makers/, online-will-vs-lawyer.
- roth 401k versus traditional 401k (12,100/mo) — HELD, unchanged: existing compare page carries stale facts; correct first.
- 529 vs brokerage account (210/mo), custodial account vs savings account (20/mo), chase ultimate rewards points to dollars (10/mo), are trump accounts a scam — DROP: dedicated pages exist.
- living trusts usa reviews — DROP: single-company review intent, ungroundable.
- Reviewer (Explore subagent): all three proposed rows KEEP, no prior commits touch any route.

## Row records
- types-of-mortgage-loans — page type: explainer (1,200 floor) · register: operator · medium: text → text · writer: claude-opus-5-5 (no fallback) · teeup-exempt: closed CFPB/VA/FHFA fact page, no licensed first-person claim · anchor-exempt: reference explainer built only from CFPB, VA and FHFA text · PASS after 4 fix-in-place rounds (one beyond the usual 3, each driven by a fresh auditor's findings; final round applied the last auditor's three findings and was mechanically verified rather than re-audited).
