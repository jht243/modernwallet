# Phase 4 re-audit, 2026-10-28 (reviewer: phase4-reviewer, independent of writer)

Bundle: preflight-audit (28/28 delivered; not re-prepared per coordinator note). New snapshot sha256 e1b9c347d47421ba88b963ecbca47455c3e6dbfcc89bf34e4697821de75aee31.
`rendered-audit.py check` (no --recapture) on review.json: "Rendered review evidence verified".

## OVERALL: PASS (both routes)

Fix verification in built HTML:
1. Treasury: `<a href="https://home.treasury.gov/">U.S. Department of the Treasury</a>` present. PASS
2. Takeaway S1 split into "...the IRS adjusts the account of a 2025 filer with a 2020 to 2024 carryforward. That filer claimed or was eligible for the adoption credit and needs no amended return." PASS
3. Intro S2 split ("adjust your account itself. Any adoption tax credit refund comes without an amended return.") PASS
4. Cleft removed: "The IRS notice shows the amount for a specific account." PASS
5. Restatement sentence deleted. PASS
6. H2 "Will the IRS Refund an Unused Adoption Credit Carryforward?" (Title Case, no ownership assumption). PASS
7. Tax-brackets sentence split; diff for that entry is only the sentence and updated 2026-10-21 -> 2026-10-28. PASS
Advisory edits landed: "line 8 of the carryforward worksheet", "points to three groups of filers".

Re-run gates: depth 1,820 prose words vs 1,200 floor (explainer); rhythm 115 sentences S15/M36/L64, no 10-sentence single-band run, no 5 within 3 words, one 30-word list bullet (advisory); 0 we/our/us in entry; no em-dash in entry (3 in global footer chrome only); no self-serving or testing text; JSON-LD dateModified 2026-10-28 >= datePublished 2026-10-28 and visible Updated October 28, 2026 on both routes; FAQs, table, opening and Takeaway agree and keep conditions; load receipt hashes unchanged (0e00ec2e / ed445917 / 1969dcd5).

## Advisory (non-blocking)
- /guides/2026-tax-brackets/: the paragraph now holds 4 sentences (STYLE max 3). Optional fix: insert a paragraph break before "Credits sit outside the brackets."
- Earlier advisories stand: meta description omits "generally"/2025; unlinked forms/tool names (1040-X, 843, Schedule 3-A, Where's My Refund?); 6 empty placeholder props on the entry; evidence.json lists 3 of 5 sources; datePublished is derived from `updated` by the template.
