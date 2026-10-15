---
mindmap_pass_date: 2026-10-15
source: free-form input brief (top-10 GSC queries 2026-10-08→2026-10-15 + trend-pass research pack), demand-validated
interpreted_brief: Our 10 top Google queries for the 7 days ending 2026-10-15 (1 click total; the same Trump-account-scam, mortgage-lender, online-will and Roth-vs-Traditional 401(k) variants as the last weeks) plus research that finds no new trend and no uncovered top-20 query. Build what the demand implies the site lacks. Autocomplete off the lender cluster pointed to one gap: no page answers "mortgage broker vs lender" (1,300/mo), which the site only touches in one roundup FAQ.
generated_by: mindmap-pass build phase — keyword demand ladder (volume=dataforseo, kd=dataforseo; Ahrefs/SEMRUSH not configured) + Autocomplete miner (mortgage broker vs lender 46, free will online 187, trump account 341 suggestions) + live SERP reality check (2 heads read, $0.0083 of $2.00) + coverage_lookup + adversarial duplicate-suppression reviewer
demand_source: dataforseo
serp_reads: 2 heads, $0.0083 of $2.00
status: executed — 1 page built, 1 inbound link sentence
---

Keyword data: volume=dataforseo, kd=dataforseo (Ahrefs and SEMRUSH keys not configured). SERP: reports/mindmap-pass/2026-10-15-trend-lane-c.serp.json.

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lens 3 (vs, off the lender cluster of top-10 queries). `mortgage broker vs lender` 1,300/mo KD 13 (DataForSEO); `mortgage broker vs bank` 390 KD 8; `is a mortgage broker worth it` 140; `mortgage broker vs direct lender` 50; Autocomplete 46 on-topic completions. lookup: /roundup/best-mortgage-lenders (ranked lender list) and /guides/questions-to-ask-a-mortgage-lender (vetting a lender) serve different reader goals; broker vs lender only a single roundup FAQ; no prior commits touch the route. | Create /compare/mortgage-broker-vs-lender/ — who makes the loan vs who finds it, how each is paid, where roles overlap, questions to ask; situational verdict, no rate claims | create new content | /compare/mortgage-broker-vs-lender/ | comparison table/database — pick shape, two roles | text | text | winnable (AI Overview) | cfpb, reddit, chase, pnc, experian, bankrate, sofi, redfin; AIO cites cfpb, chase, redfin, bankrate, investopedia; not forum-dominated (2/10) | "Is it better to go through a mortgage broker or a lender?" [PAA 4/6 on-topic; 2/6 off-topic: commission on $500,000, what not to tell a lender; ac 10/10] | Pick with its boundary: a lender makes the loan, a broker finds lenders for a loan-specific fee; neither is automatically better, shop around either way | section 1: "Who Makes the Loan and Who Finds It" | top-10 (Lens 3 off lender queries) |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| mortgage broker vs lender | mortgage broker vs lender (1,300); mortgage broker vs bank (390); is a mortgage broker worth it (140); PAA: disadvantages of a mortgage broker; why use a broker instead of a bank | coverage gap at theme level: one roundup FAQ only | partial | create new content | /compare/mortgage-broker-vs-lender/ | comparison table/database | text | text | winnable (AI Overview) | cfpb, chase, bankrate; AIO cites cfpb, redfin, investopedia |

## Exclusions / candidates considered
- are trump accounts (for kids) a scam / trump accounts are a scam / is the trump account a scam — DROP: /guides/trump-account-worth-it/; trends.md row 3; ledger 2026-10-10 to 10-14.
- best home loan lenders / best lenders for mortgage / best mortgage lenders today / best company for mortgage loan / best lender for home loan — DROP: /roundup/best-mortgage-lenders/; trends.md row 8.
- last will online / make a will online / get a will online / can i make a will online / online last will — DROP: /roundup/best-online-will-makers/, /compare/online-will-vs-lawyer. free will online (1,900/mo KD 32), do it yourself will (1,900) — DROP: same pages; "are online wills legal" already answered (ledger 2026-10-12); "are free online wills legal" 20/mo.
- 401k roth versus traditional / roth vs traditional 401k — HELD unchanged (stale facts on existing page).
- custodial account vs savings account — DROP: exists. money market account wharton, nerdwallet budget calculator — DROP: ambiguous / navigational; /budget/ exists.
- is a mortgage broker worth it (140/mo), mortgage broker vs direct lender (50/mo) — folded into the new page.

## Reviewer and outcome
- Duplicate-suppression reviewer (Explore subagent): KEEP; no existing page serves the reader goal.
- Phase 3: closed fact list from two CFPB Ask pages; writer claude-opus-5-5 (key pool 2; key 1 out of credit), no fallback; claim check fixed/deleted 8 sentences. Phase 4 auditor: FAIL with 12 gate findings plus 5 cleanups, all applied with the auditor's exact replacements and verified mechanically (string-match each, 1,644 body words, build passes), not re-audited.
- Note: the existing FAQ on /roundup/best-mortgage-lenders says a broker "costs you nothing directly", which conflicts with CFPB ("you pay them a loan-specific fee ... paid by you or by the lender"). Not edited (additive-only); flagged.
