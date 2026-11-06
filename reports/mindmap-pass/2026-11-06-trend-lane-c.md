---
mindmap_pass_date: 2026-11-06
source: free-form input brief (trend-pass top queries + research pack), SEMRUSH-validated
interpreted_brief: Top queries for the 7 days ending 2026-11-06 (5 queries, 0 clicks, 1-3 impressions each; same family as 2026-11-05) plus Lane A/B research (no clear trend; 5/5 covered). Lane C re-competes the HELD candidate: a living-trust definition/mechanism section on the existing family-trust guide.
generated_by: mindmap-pass build phase (trend-pass Lane C) - demand ladder volume=semrush kd=semrush (dataforseo ok, balance $35.02, used only for SERP) + Autocomplete question sweep (84 rows) + live SERP (6 heads read, $0.0126)
demand_source: semrush (measured, us database, 2026-11-06)
serp_reads: 6 heads, DataForSEO $0.0126
status: no-changes (row held, not executed)
---
## Demand (SEMRUSH us, measured 2026-11-06; reports/mindmap-pass/2026-11-06-trend-lane-c.volumes.json)
what is a living trust 14,800/mo KD40; how does a living trust work 1,000 KD34; living trust vs will 8,100 KD52 (page exists); living trust services 110 KD30; best trust services 70 KD58; nerdwallet auto loan calculator 40,500 KD72 (branded); nerdwallet retirement calculator 18,100 KD72 (branded).
Expand "living trust": reports/mindmap-pass/2026-11-06-trend-lane-c.expand.living-trust.json (limit 20/source). Autocomplete questions: ...autocomplete.living-trust.csv (84 rows).
SERP (serp.json): all 6 heads `locked` (verdict from helper); AI Overview present on 5/6 (nerdwallet.com cited for the branded two; how-does-a-living-trust-work AIO cites drexel, metlife, estateplanning.com, youtube, consumerfinance.gov, titushillis). PAA for "what is/how does a living trust": legal entity?, trust vs will, who is best trustee, who cannot be trustee, disadvantage of a living trust, taxes on trust inheritance, cost to set up.

## Action chart
| # | problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement | source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Lens 2 adjacent demand off top-10 "living trust services": "what is a living trust" 14,800 KD40, "how does a living trust work" 1,000 KD34. lookup: /guides/what-is-a-family-trust (exact-slug sibling; covers revocable vs irrevocable, trust vs will, pour-over will, who doesn't need one, FAQs "same as a living trust?", "what happens at death", "can it be changed"); /guides/is-a-living-trust-worth-it (cost/break-even); /compare/living-trust-vs-will; /guides/how-to-fund-a-trust. No page titled/targeted on "what is a living trust". Commits: git log -S "what-is-a-living-trust" none. | Add a section "How a Living Trust Works, Step by Step" to the family-trust guide (create, name successor trustee, fund, manage, incapacity, death), 2 PAA FAQs (who can be trustee; is a living trust a legal entity) | update existing body text | /guides/what-is-a-family-trust | n/a | n/a | n/a | locked (AI Overview) | Google page one locked for all heads; AIO cites drexel/metlife/estateplanning.com/consumerfinance.gov | How does a living trust work? [PAA 6/6 on-topic; ac how-questions] | A living trust works by retitling your assets into a trust you control as trustee, with a named successor who takes over at incapacity or death, skipping probate (mechanism) | section 1 | top-10 |

## Emerging search patterns (clusters)
No emerging clusters detected this run.

## Exclusions
- best trust services, living trust services (and best online trust services): DROP, /roundup/best-living-trust-services/ exists (2026-11-03/04 charts, ledger rows).
- nerdwallet auto loan / retirement calculator: DROP, branded competitor queries; generic /auto-loan/ and /retirement/ calculators and /roundup/best-retirement-calculators/ exist; nerdwallet holds SERP (ledger 2026-10-19, 2026-10-29).
- trust and will vs legalzoom: HELD (LegalZoom living-trust price not groundable unattended; ledger 2026-11-03).
- living trust vs will: exists /compare/living-trust-vs-will/.

## Duplicate check
passed -- 1 row checked, 1 matched an existing page (/guides/what-is-a-family-trust, reclassified from new page to body enrichment). Independent Explore reviewer (distinct from author) verdict: KEEP as narrow body enrichment (~250-word create→successor→fund→manage→incapacity→death sequence + 2 FAQs: who can be trustee, is a living trust a legal entity); gap "real but small", no new URL justified. Reviewer noted `coverage_lookup.py --chart` returned "no candidates" on the draft format; builder ran `--candidate` form (1 candidate, no same-run overlap, no redirects, no commits naming the topic).

## Outcome
Not executed this run. The existing page already carries each step of the mechanism across separate sections (legal terms/retitling, incapacity under "non-tax goals", FAQ on death, pour-over will); the missing piece is only a consolidated sequence plus two PAA FAQs. Executing needs the full gated path (reviewed manifest + readiness report + evidence packet + writer + independent Phase 4 + rendered audit) for ~250 words on an AI-Overview-locked SERP with a 0-click site. Ledgered HELD (re-competes), no content touched. Third consecutive day this row is held; owner decision suggested: execute once as a one-off, or ledger DROPPED as no-addition.
