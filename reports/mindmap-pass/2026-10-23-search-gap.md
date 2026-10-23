---
mindmap_pass_date: 2026-10-23
source: search-gap-content-auto — 1 zero-result site search (last 24h), passed through unfiltered
interpreted_brief: A visitor on /guides/what-to-do-with-an-inheritance/ searched "donor assisted funds" and got zero results. Almost certainly a variant of "donor-advised fund" (the IRS term). The site mentions DAFs only inside other pages and in one DAF-vs-private-foundation comparison; no page explains what one is, how it works, or what can go into it.
generated_by: mindmap-pass build phase — DataForSEO volume/KD (KEYWORD_PROVIDERS=dataforseo) + live SERP read (1 head, $0.004) + coverage_lookup.py
demand_source: dataforseo
serp_reads: 1 head read
status: ready-for-execution
---

# Brief (raw, verbatim)
- `donor assisted funds` — kind: search, count 1, paths: /guides/what-to-do-with-an-inheritance/ (1)

| problem | solution | bucket | target | format | best_medium | resolved_deliverable | serp_verdict | serp_evidence | reader_question | answer | answer_placement |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Lens 1 (direct intent). `donor assisted funds` 210/mo KD n/a; head `donor advised fund` 22,200/KD 38 (dataforseo); `what is a donor advised fund` 4,400/KD 38. No page explains the product; only a DAF-vs-foundation comparison and passing mentions. lookup: /compare/donor-advised-fund-vs-private-foundation — reader choosing DAF vs foundation (narrower, assumes the reader already knows what a DAF is). | Create /guides/donor-advised-funds-explained/ targeting "donor advised fund" [article: how a DAF works, what you can put in, deduction limits, costs, downsides] | create new content | /guides/donor-advised-funds-explained/ | article — mechanism explainer | text | text | winnable (AI Overview) | AI Overview cites fidelitycharitable.org, nptrust.org, irs.gov, edwardjones.com; top10 morganstanley, freewill, vanguardcharitable, nyu law, vanguard | "How does a donor-advised fund work and how much can you put in one?" [PAA 3/6 how-much / can-I-donate-X / downside; ac 4/4 question] | A DAF is a charitable account at a public-charity sponsor: you give an irrevocable gift, take the deduction that year, and recommend grants later; cash is deductible up to 60% of AGI and long-term appreciated stock up to 30%. (mechanism) | section 1: "How a Donor-Advised Fund Works" |
| Lens 1 (the asker's own page). The visitor was on /guides/what-to-do-with-an-inheritance/ when they searched; the guide never mentions charitable giving or DAFs as an inheritance option. lookup: that page itself — what to do with inherited money (same reader goal, missing the giving-some-away angle). | Add a "Giving Part of an Inheritance to Charity" section to /guides/what-to-do-with-an-inheritance/ linking the new DAF guide | update existing body text | src/data/guides.ts → slug what-to-do-with-an-inheritance | n/a | n/a | n/a | unread | n/a | "Can I put some of an inheritance into a donor-advised fund?" [verb-only — no PAA, no completions; asker context] | Yes, inherited cash or stock can be donated to a DAF; inherited assets usually get a step-up in basis so the capital-gains saving on donating shares is smaller, and the deduction depends on itemizing. (verdict) | section after Step 7: "Giving Part of an Inheritance to Charity" |

## Emerging search patterns (clusters)
| Cluster (theme) | Member queries | Why emerging / under-served | Current coverage | Lever | Target | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| Donor-advised funds | donor advised fund (22,200); what is a donor advised fund (4,400); donor assisted funds (210) | coverage gap at theme level | partial (comparison only) | create new content | /guides/donor-advised-funds-explained/ | article | text | text | winnable (AI Overview) | fidelitycharitable, irs.gov cited |
| Inheritance + charity | donor assisted funds (from inheritance guide) | right page, missing angle | partial | update existing body text | src/data/guides.ts → what-to-do-with-an-inheritance | n/a | n/a | n/a | unread | n/a |

## Exclusions
Lens 3: no comparable named entity in the brief; sponsor-specific pages (Fidelity Charitable, Vanguard Charitable) would be separate demand and are not in the brief.
Duplicate check: passed (coverage_lookup run; no commit touches /guides/donor-advised-funds-explained; the inheritance guide has no charity section).
