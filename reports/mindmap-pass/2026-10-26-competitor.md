---
mindmap_pass_date: 2026-10-26
source: competitor publishing monitor (10 newest new/updated candidates of 8,284 detected), unattended
interpreted_brief: Ten competitor personal-finance pages/tools; build original pages only where no existing page serves the same reader and primary-source facts support them.
demand_source: estimate (DataForSEO unavailable; Autocomplete question sweep only; no measured volume)
status: executed
---
Duplicate check: passed -- 2 new-page rows checked, 0 matched an existing page (scripts/mindmap/coverage_lookup.py --site-url https://www.themodernwallet.com)

| # | problem | solution | bucket | target | format | reader_question | answer | answer_placement |
|---|---|---|---|---|---|---|---|---|
| 1 | Bankrate "credit card companies want you in debt". lookup: no match [verb-only on SERP; ac 11/11 question] | Guide: who pays the issuer (interest, interchange, fees), our calculated $5,300 balance model | create new content | /guides/how-credit-card-companies-make-money/ | article (calculated evidence, table) | How do credit card companies make money if you pay in full? | Mostly interest from revolvers; interchange from merchants on every purchase (mechanism) | section 1 |
| 2 | SmartAsset "build wealth in high inflation". lookup: no match (/compare/i-bonds-vs-tips/ is narrower) [verb-only on SERP; ac 11/11 question] | Guide: match each dollar to a time horizon; our calculated $10,000 one-year model | create new content | /guides/build-wealth-during-high-inflation/ | article (calculated evidence, table) | How can I protect my savings from inflation? | Cash short term, I bonds/TIPS 12+ months, tax-advantaged long term (mechanism) | section 1 |
| 3 | Inbound links | Added cross-links from credit-card-payoff, credit-card-interest-calculator, inflation-calculator | add internal links | src/data/cross-links.ts | n/a | n/a | n/a | n/a |

Exclusions: nerdwallet 800-credit-score skipped-duplicate (/guides/what-is-a-good-credit-score/); bankrate personal-loan-calculator skipped-duplicate (/personal-loan); bankrate banking hub skipped-duplicate (/bank/savings-accounts/); financialmentor best-financial-advice skipped-duplicate (/guides/how-to-choose-a-financial-advisor/); financial coaching vs advice comparison HELD (primary sources did not verify coach regulation status or fee models); Ally/Synchrony/Peak bank reviews skipped-low-value (rate-dependent vendor reviews need verified terms).
Evidence: calculated (reports/mindmap-pass/2026-10-26-competitor/evidence/*/calc.py). Prose writer: gemini-3.8-flash (FALLBACK; claude-opus-5-5 keys returned "credit balance too low"). Audit: independent subagent, 2 must-fix each, applied.
