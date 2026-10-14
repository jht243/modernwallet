---
mindmap_pass_date: 2026-10-14
source: free-form input brief (top-10 GSC queries 2026-10-07→2026-10-14 + trend-pass research pack), demand-validated
interpreted_brief: Our 10 top Google queries for the 7 days ending 2026-10-14 (1 click total; the same Trump-account-scam, mortgage-lender and online-will variants as the last two weeks, plus Roth-vs-Traditional 401(k)) plus research that finds no new trend and no uncovered top-20 query. Build what the demand implies the site lacks. Autocomplete off the stray top-20 query "money market account wharton" pointed to one adjacent gap: the site has HYSA-vs-MMA, CD-vs-MMA and a "worth it" guide, but no page answering "money market account vs money market fund", a 720/mo confusion the site only answers as FAQs on three other pages.
generated_by: mindmap-pass build phase — keyword demand ladder (volume=dataforseo, kd=dataforseo; Ahrefs/SEMRUSH not configured) + Autocomplete miner (money market account 338, budget calculator 275, trump account scam 10 suggestions) + live SERP reality check (2 heads read, $0.0083 of $2.00) + coverage_lookup + adversarial duplicate-suppression reviewer
demand_source: dataforseo
serp_reads: 2 heads, $0.0083 of $2.00
status: executed — 1 page built, 3 inbound link sentences
---

Keyword data: volume=dataforseo, kd=dataforseo (Ahrefs and SEMRUSH keys not configured). Raw: reports/mindmap-pass/cache/2026-10-14-trend-lane-c.volumes.txt; reports/mindmap-pass/2026-10-14-trend-lane-c.serp.json.

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lens 2 (adjacent to top-20 query "money market account wharton", 1 impr, and the site's money-market cluster). Cluster: `money market account vs money market fund` 720/mo KD 6 (DataForSEO measured, Autocomplete corroborated 7 completions); `money market fund vs money market account` 720/mo KD 6; related searches "money market account vs money market fund vs savings account", "...vs fidelity", "...vs vanguard". Site has hysa-vs-money-market, cd-vs-money-market, is-a-money-market-account-worth-it and a roundup, but the bank-deposit-vs-mutual-fund confusion is answered only as an FAQ on three pages (comparisons.ts:3802, guides.ts:6213, guides.ts:11359). lookup: /guides/money-market-account — reader learning how an MMA works vs HYSA/CD (narrower, MMA-only; no fund comparison); /compare/hysa-vs-money-market — reader choosing between two bank deposit accounts (different pair); no match for the proposed route. No prior commits touch the route. | Create /compare/money-market-account-vs-money-market-fund/ — the bank deposit account vs the mutual fund that shares its name: FDIC insurance vs none, what each holds, how the yield is set, access and who offers each; verdict by situation | create new content | /compare/money-market-account-vs-money-market-fund/ | comparison table/database — pick shape, two products, situation-dependent verdict | text | text | winnable (AI Overview) | experian, citizensbank, ccu, whitakerwealth, bankrate, ally, etrade, reddit, youtube; AI Overview cites fidelity, zynlobank, bankrate, investopedia, vanguard, chase, cnbc; not forum-dominated (2/10) | "What is the difference between a money market account and a money market fund?" [PAA 3/6 on-topic (disadvantages of an MMA, why MMFs are not FDIC insured, is an MMA 100% safe); 3/6 off-topic: Suze Orman, money market vs financial market, where millionaires keep money; ac 7/7 on-topic] | Pick with its boundary: an MMA is an FDIC-insured bank deposit account; an MMF is a mutual fund with no deposit insurance; choose the account for insured cash, the fund when the cash sits at a brokerage and the investor accepts no insurance | section 1: "Money Market Account vs Money Market Fund: The Short Answer" | top-10 (Lens 2) |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries (from demand ladder / Autocomplete / SERP PAA) | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| money market account vs money market fund | money market account vs money market fund (720); money market fund vs money market account (720); PAA: Why are money market funds not FDIC insured?; Is a money market account 100% safe? | coverage gap at theme level: only FAQ answers on three other pages | partial | create new content | /compare/money-market-account-vs-money-market-fund/ | comparison table/database | text | text | winnable (AI Overview) | bankrate, fidelity, ally, etrade; AIO cites fidelity, bankrate, investopedia, vanguard |

## Exclusions / candidates considered
Volumes DataForSEO measured unless marked estimate.
- are trump accounts (for kids) a scam / trump accounts are a scam / is the trump account a scam — DROP: /guides/trump-account-worth-it/ (carries an explicit "scam" FAQ) and trump-account-app/eligibility siblings; trends.md row 3, ledger 2026-10-10/12/13. Autocomplete (10) is scam-call noise.
- best home loan lenders / best mortgage lenders today / best company for mortgage loan / best home mortgage lenders / best lender for home loan — DROP: /roundup/best-mortgage-lenders/ is the dedicated page; ledger 2026-10-10 to 10-13 stand.
- last will online / make a will online / get a will online (590/mo KD 38) / can i make a will online / last will and testament online — DROP: /roundup/best-online-will-makers/, /compare/online-will-vs-lawyer (ledger 2026-10-09/10/12/13).
- 401k roth versus traditional / 401k roth vs 401k traditional — HELD, unchanged: /compare/roth-401k-vs-traditional-401k/ exists but carries stale facts (ledger 2026-10-10/12/13).
- custodial account vs savings account — DROP: /compare/custodial-account-vs-savings-account exists. custodial account vs trust — HELD, unchanged (UTMA structure sources unreachable; ledger 2026-10-13).
- money market account vs savings account (1,600/mo KD 0) — DROP: same reader goal as /compare/hysa-vs-money-market (deposit account vs deposit account) and /guides/is-a-money-market-account-worth-it.
- money market account vs checking account (170/mo), vs brokerage account (90/mo KD 21), vs roth ira (70/mo) — DROP: weak demand; MMA debit access answered by /guides/money-market-account-debit-card.
- nerdwallet budget calculator — DROP: brand-navigational; /budget/ and five budget calculators exist. budget calculator for couples (10/mo KD 47) — DROP: weak demand, /budget/household-budget-calculator exists.
- money market account wharton — DROP: ambiguous single impression, no measurable intent.

## Reviewer and outcome
- Duplicate-suppression reviewer (Explore subagent): KEEP, conditions met (fresh prose, cross-links to hysa-vs-money-market, guides/money-market-account, is-a-money-market-account-worth-it, reverse links from the three FAQ homes, no hard-coded yields). Agreed with all exclusions; noted hysa-vs-money-market metadata still says "in 2024" (metadata is out of scope for this pass).
- Phase 3: closed fact list from FDIC and SEC Investor.gov; writer claude-opus-5-5, no fallback; claim check fixed 4 sentences. Phase 4 auditor: 5 gate failures, fixed with exact replacements; mechanical re-verification, build passes.
