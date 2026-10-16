---
mindmap_pass_date: 2026-10-16
source: free-form input brief (top-10 GSC queries 2026-10-09→2026-10-16 + trend-pass research pack), demand-validated
interpreted_brief: Our 10 top Google queries for the 7 days ending 2026-10-16 (1 click total; the same Trump-account-scam, mortgage-lender, online-will and Roth-vs-Traditional 401(k) variants as recent weeks) plus research that finds no new trend and one uncovered top-20 query, "401k vs 529". Build what the demand implies the site lacks. Autocomplete off that query plus the 529/401k comparison family showed 401(k)-vs-529 as the one pairing with a live query and no page.
generated_by: mindmap-pass build phase — keyword demand ladder (volume=dataforseo, kd=dataforseo; Ahrefs/SEMRUSH not configured) + Autocomplete miner (401k vs 529 13, make a will online 167, best mortgage lenders 257 suggestions) + live SERP reality check (2 heads read, $0.0083 of $2.00) + coverage_lookup + adversarial duplicate-suppression reviewer
demand_source: dataforseo
serp_reads: 2 heads, $0.0083 of $2.00
status: executed — 1 page built
---

Keyword data: volume=dataforseo, kd=dataforseo (Ahrefs and SEMRUSH keys not configured). SERP: reports/mindmap-pass/2026-10-16-trend-lane-c.serp.json.

## Main action table

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lens 3 (vs) off a Lane B coverage finding: top-20 query `401k vs 529` (1 impression, pos 70). `401k vs 529` 70/mo KD 0 and `529 vs 401k` 70/mo (DataForSEO, measured); `401k or 529` 10; `401k vs 529 for college` ~75 (estimate, NOT measured); Autocomplete 13 completions incl. "can you roll a 401k into a 529 plan", "transfer 401k to 529 plan", "529 vs maxing out 401k", "roth 401k vs 529". lookup: no match for the pair; the 529 family (529-vs-roth-ira, 529-vs-brokerage-account, 529-vs-utma, is-a-529-plan-worth-it) serves other reader goals; no prior commits touch the route. | Create /compare/401k-vs-529/ targeting "401k vs 529" — what each account is for, how each is taxed, what happens when the money is used for the wrong thing (incl. why a 401(k) does not roll into a 529 and the sourced 529-to-Roth-IRA rollover), 2026 limits; situational verdict | create new content | /compare/401k-vs-529/ | comparison table/database — pick shape, two accounts | text | text | winnable (forum-dominated, AI Overview) | reddit #1, experian, bogleheads, fidelity, 401kspecialistmag, militarybenefit, schwabfamilylaw; AIO cites youtube, fidelity, 401kspecialistmag, investopedia, reddit, schwab, experian; not ownable by vendor voice alone, so the page leads with the account-purpose answer and the rule-based "what happens" content | "Should I put money in a 401(k) or a 529 plan?" [PAA 0/6 on-topic (wandered into 401k balances); related searches on-topic: 401k vs 529 taxes, Retirement vs 529, 529 vs maxing out 401k; ac 9/9] | Pick with its boundary: different jobs, not interchangeable, no direct 401(k)-to-529 transfer; next dollar depends on which goal is closer, tax fit and access | section 1: "What Each Account Is For" | coverage (Lane B) |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 401(k) vs 529 | 401k vs 529 (70); 529 vs 401k (70); 401k or 529 (10); can you roll a 401k into a 529 plan; transfer 401k to 529 plan; 529 vs maxing out 401k | coverage gap at theme level: 529 siblings exist, the 401(k) pairing does not | none | create new content | /compare/401k-vs-529/ | comparison table/database | text | text | winnable (forum-dominated, AI Overview) | reddit, fidelity, 401kspecialistmag; AIO cites youtube, fidelity, investopedia |

## Exclusions / candidates considered
- are trump accounts (for kids) a scam — DROP: /guides/trump-account-worth-it/; trends.md row 3; ledger 2026-10-10 to 10-15.
- best home loan lenders / best mortgage lenders (+ variants) — DROP: /roundup/best-mortgage-lenders/; trends.md row 8.
- last will online / make a will online / can i get a will online / complete will online — DROP: /roundup/best-online-will-makers, /compare/online-will-vs-lawyer. will vs trust (18,100/mo KD 1) — DROP: /compare/living-trust-vs-will exists (coverage_lookup). online will vs trust (500, estimate) — same page.
- regular/roth/traditional 401k variants (6 of top-10) — HELD unchanged (existing /compare/roth-401k-vs-traditional-401k carries stale facts; ledger 2026-10-10 to 10-15).
- mortgage lender vs bank (390/mo KD 0) — DROP: overlaps the page shipped 2026-10-15 (/compare/mortgage-broker-vs-lender) on the same two CFPB sources and reader goal; SERP forum-dominated with AIO; a second page on the same CFPB facts would duplicate it.
- "+medicare +medicaid +benefits +cost" — DROP: crawler-style operator string; /compare/medicare-vs-medicaid exists.

## Reviewer and outcome
- Duplicate-suppression reviewer (Explore subagent): KEEP; coverage_lookup shows no existing home, no commits touch the route, no prior ledger decision. Caveats noted: DataForSEO volumes have no saved artifact; "529 vs maxing out 401k" is an autocomplete completion, not a SERP related search.
- Phase 3: closed fact list from IRS Topic 313/558/424, the IRS 2026 limits release, IRS 401(k) plans page, Pub 970 and SEC Investor.gov. Writer: claude-opus-5-5 UNUSABLE (both Anthropic keys: credit balance too low), so the run fell back to gemini-3.8-flash (meta says fallback_used). Round 1 draft regenerated once with an expanded fact list and corrections block; claim check deleted/fixed 17 sentences in round 2.
- Phase 4 auditor (fresh Explore subagent): FAIL with 38 findings (unsupported match/ceiling claims, directive verdict and FAQ, "Not published" table cells, overloaded sentences, rhythm). All applied with the auditor's exact replacements (apply_fixes.py), verified mechanically (string-match each, no banned phrases, 1,658 body words, long sentences split, astro build passes, route rendered), not re-audited.
- Not done: no inbound link sentence added to a sibling page this run.
