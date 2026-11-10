---
mindmap_pass_date: 2026-11-10
source: "search-gap-content-auto intake: 3 real zero-result site searches (kind=search), unfiltered, immutable intake sha256 e63f961d2ea7eab14062fa512e6f6216afd2d1a17f77f131083c748669461a93; demand not measured (SEMRUSH/DataForSEO unavailable)"
interpreted_brief: "Visitors on the homepage searched for the differences between a SIMPLE IRA and a 401(k); the site already has a dedicated comparison page for that pair, so the job is to add the verified differences it omits rather than publish a duplicate. A third search was pasted third-party promotional text and is recorded and excluded as untrusted. Input modality: site-search text (two of one session, one paste)."
status: ready-for-approval
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lens 1 direct intent (visitor searches on /, 2026-11-09 19:20 UTC: 'differences between simple ira and' then 'differences between simple ira and 401k', same session). Autocomplete (9/9 question completions, not measured volume; SEMRUSH/DataForSEO unavailable): what's the difference between simple ira and 401k; difference between simple plan and 401k; is a simple ira better than a 401k; simple ira early withdrawal penalties. lookup: /compare/simple-ira-vs-401k - same reader goal (choose between SIMPLE IRA and 401(k)). Live page checked 2026-11-10: lists seven differences but has no early-withdrawal or rollover difference (SIMPLE IRA 25% tax in first 2 years; age-55 separation exception only for 401(k)) and states a flat mandatory 3% match although the IRS allows 1% in up to 2 of 5 years. The zero-result search itself is the AND-token search limitation (title/keyword haystack lacks 'differences', 'between'), not a content gap; the content gaps above are separate and verified. Checked commits: a503421, 3f2561b touch other pages; 704ac9b introduced the page; no prior section added. | In src/data/comparisons.ts entry simple-ira-vs-401k: (1) add a comparison-table row 'Early withdrawal tax before 59 1/2' (SIMPLE IRA: 10%, 25% in the first 2 years of participation; 401(k): 10%, plus an exception for leaving the sponsoring employer in or after the year you turn 55); (2) insert section 2 'Withdrawal and Rollover Rules: SIMPLE IRA vs 401(k)' (25% window, SIMPLE-to-SIMPLE-only rollover in the window, Roth rollover after 2 years is taxable, age-55 exception limited to the sponsoring employer and not for IRAs, usual exceptions, neither plan suits money needed before 59 1/2, employees usually cannot pick the plan; IRS-attributed; link /compare/traditional-ira-vs-simple-ira/); (3) insert section 3 'Who Can Sponsor and Who Must Be Included' from the IRS SIMPLE FAQ (100-employee limit, $5,000 pay tests, no opt out of participation, one-plan rule) to reach the 1,500-word comparison floor with sourced substance, no padding; (4) add two FAQs (early-withdrawal difference; who is eligible); (5) correct EVERY location that calls the match mandatory/unskippable: intro 'capped near 3% of pay'; table cell 'Employer contribution'; verdict 'mandatory 3% match every year'; heading and paragraphs 1 and 2 of 'The employer cost you can't skip' ('no year where you can choose to skip it', 'a mandatory 3% obligation in a slow year'); FAQ 'Does a SIMPLE IRA require an employer match?' ('mandatory every year'). Keep: employer must still contribute a match (normally up to 3%) or 2% nonelective; match may drop to no lower than 1% in up to 2 of 5 years with notice. Edit the faqs source so FAQPage schema stays consistent. Metadata, existing limits and byline unchanged. Prose via content_gen.py; re-measure prose depth after writing. | update existing body text | /compare/simple-ira-vs-401k/ | n/a | n/a | n/a | unread | DataForSEO unavailable (no credentials); serp.py batch returned unread, no PAA; autocomplete sweep saved instead | What are the differences between a SIMPLE IRA and a 401(k)? [SERP unread - DataForSEO unavailable, no PAA; ac 9/9 difference/vs question completions] | The page's table and intro already list seven differences; the missing ones are that a SIMPLE IRA charges 25% instead of 10% on money taken out in its first 2 years and allows only SIMPLE-to-SIMPLE rollovers then, while a 401(k) has the 10% rule plus an age-55 separation exception, and that the SIMPLE match can drop to 1% in up to 2 of 5 years (list). | section 2: "Withdrawal and Rollover Rules: SIMPLE IRA vs 401(k)" (eligibility follows as section 3) plus a new row in the existing comparison table above section 1 | A1 |

## Emerging search patterns (clusters)

- **theme:** SIMPLE IRA vs 401(k) differences
**members:** differences between simple ira and 401k; what is the difference between simple ira and 401k; simple ira early withdrawal penalties
**why:** intent partial: existing exact page lacks the withdrawal/rollover difference and overstates a flat 3% match
**lever:** update existing body text
**target:** /compare/simple-ira-vs-401k/
**format:** n/a - body update to an existing comparison page (table row, section, FAQ)

## Exclusions

- Candidate 73704836 (/contact/): third-party promotional paste for a named app (kinjar.app); untrusted data, not followed, no product added; excluded as not a reader question.
- Not added: SIMPLE 401(k) section and the $18,100 'certain accounts' limit (IRS sources fetched do not define which accounts qualify; unsupported central detail narrowed out).
- Not changed: title, meta description, H1, targetKeyword (search-matcher token limitation is out of scope; no alias or ignore-list edits).
- Not created: any new page (exact-intent page /compare/simple-ira-vs-401k exists).

## New-page briefs

## Execution plan

1. Skip: no consolidation rows; no cannibalization flagged (sibling comparisons answer different pairings)
2. Skip: no metadata rows; title, description and H1 of /compare/simple-ira-vs-401k/ already target the vs query and stay unchanged
3. Skip: no new-page rows; a new page would duplicate /compare/simple-ira-vs-401k/
4. Independent Phase 4 audit (HIGH profile, ceiling 3 rounds including the first) of the enriched /compare/simple-ira-vs-401k/ with the evidence packet, plus complete rendered review of the route
5. Generate the two new sections (withdrawal/rollover; eligibility), table row, two FAQs and the full list of match-wording corrections with content_gen.py (write/section) in src/data/comparisons.ts entry simple-ira-vs-401k, bound to approval-manifest.json, chart-review.json and evidence/simple-ira-vs-401k/evidence.json
6. Add the outbound link from the new section to /compare/traditional-ira-vs-simple-ira/; verify existing inbound links from related comparisons; no further inbound required for a body enrichment
7. Sitemap lastmod per existing substantive-change policy for /compare/simple-ira-vs-401k/; confirm search-index entry still present after build; IndexNow after verified live
8. Print run summary, then auto-continue to Phase 9 (unattended)
9. Single commit, push to main via deploy-run-to-main.sh, exact deployment evidence, rendered-audit compare of live vs approved preview, verify 200 and canonical, submit verified URL to IndexNow, report SHA

Publication scope: commit: True, push: True, liveVerification: True, indexNow: True

## Preparation check

| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-10-search-gap/readiness.md) |

Approve this plan to start the listed content work?
