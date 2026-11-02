# Phase 4 audit, /guides/medicare-part-d-2027-premiums/ (reviewer: phase4-reviewer)

Verdict: FAIL on 13 hard findings (all fix-in-place, Rung 1). No rendered review and no analysis review written.
Findings with quotes and replacements: medicare-part-d-2027-premiums.findings.txt

Instruction bundle: preflight-audit, 33 parts read, check = delivery-complete-sources-current.

## Mechanical results
- Depth: source measurement 1,903 words (intro + sections + FAQ answers, tables stripped, link URLs removed) against the 1,200 explainer floor. No check-depth script in package.json. PASS.
- Rhythm: 115 sentences, 67 long / 35 medium / 13 short. One 5-in-a-row run (sentences 7-11, lengths 9,10,9,9,10, includes three list items). No 10-run in one band. Longest: 32 and 31 words.
- Greps over title, metaDescription, h1, cardBlurb, headings, FAQ questions and body: no em-dash, no "honest", no we/our/I, no neutrality claims, no "the vendor/platform", no hype words, no "X, not Y". "still" appears once in body ("can still be the cheaper choice"), not in a headline. Title is 50 characters, metaDescription 153.
- Built HTML: canonical correct, FAQPage and Article JSON-LD present, dateModified = datePublished = 2026-11-02, visible "Updated November 2, 2026", GFM table renders as a real table, disclaimer only in the footer, zero "we tested" / testing / howWeTested residue, TESTED off (no testing-evidence record, ordinary presentation), tools[] route exists.
- Links in built HTML: only hand-written markdown links render; there is no auto-link registry effect, so every unlinked organization name stays unlinked.

## Number trace (F1-F16)
Everything else traces to F1-F16 and was re-verified against the live KFF release, CMS fact sheet and both Medicare.gov pages. Generator-flagged numbers:
- 0.7 (6.50-5.80), 1.06 (38.99 x 1.06 = 41.3294 = 41.33), 2376 (2,454-78), 300 (2,400-2,100): correct, labeled arithmetic. 0.70 and 300 add value; 1.06 shows the 6 percent cap binding; 2376 adds little (advisory).
- 496 (700-204): correct subtraction, no meaning. Compares a deductible ceiling to an average premium change. Hard fail, delete.
- 12: only in "multiplied by 12" instruction, fine.

## Hard fails in brief
1. Opening sentence is 32 words.
2. Rhythm run of 5 (fix bullet 3).
3. "Enrollees who paid no plan premium in 2026 will owe one if they keep a stand-alone plan": unsupported and contradicted by Extra Help $0 premium (F13) and KFF's "not receiving extra subsidies" wording.
4. "KFF's release does not give a cause for the 2027 premium increase" (section 2 and FAQ 3): the live release does give a reason for the zero-premium group ("This is because there are no zero premium PDPs available in 2027"), which section 1 itself repeats. What KFF does not give is why plans raised premiums.
5. The $496 sentence.
6. "KFF's cost-sharing figures show why comparing premiums alone can mislead": inference credited to KFF.
7. "Both plans ... can be compared in Medicare Plan Finder": availability not on F16.
8. Takeaway sentences 1 and 3: redundant wording, states the increase as certain, illogical "since" clause about Extra Help recipients.
9. Takeaway "lower total in Plan Finder": Plan Finder feature claim beyond F16.
10. FAQ 2 "none reports the program ending": absence overclaim, no direct answer first.
11. CMS first mention in section 1 unexpanded and unlinked; section 2 name not linked.
12. Unlinked first mentions: Centene, Wellcare, United, AARP, Social Security (apply URL typed, not linked).
13. H1 drops "stand-alone" (decision-evidence section 4: headline omits a condition that reverses the answer for MA-PD and Extra Help readers).

## Checks that pass
- Reader question: sentence 1 gives the figure and its condition; section 1 delivers it; action and December 7 in intro and section 5. Evidence tag present on the row.
- No cause is asserted for the increase or for zero-premium plans disappearing. The CMS demonstration is reported as CMS's own announcement, and the page states that neither CMS nor KFF links it to zero-premium plans (verified true against both documents).
- Extra Help and MA-PD statements agree with F2, F12, F13 except the one contradiction in hard fail 3.
- Intro and Takeaway agree on the figure and its conditions, apart from hard fail 8 wording and hard fail 13.
- Reporter register held: no we/our, no tee-up, "you" only in the final action sentence.
- Provenance: KFF, CMS and Medicare.gov named beside each finding, arithmetic labeled "by arithmetic", basis reported, no testing or modeling claim.
- Inbound edits: /guides/2027-social-security-cola/ link "a Part D premium" and /guides/medicare-savings-programs/ added sentence both render and resolve. Their dates are unchanged (October 23 and October 20, 2026 in visible byline and JSON-LD; the only "updated" line in the git diff is the new entry). The phase-4-audit.md date-bump rule lists link edits as a bump trigger; the orchestrator's instruction and _rendered-page-audit.md ("document legitimate link-only differences") govern, so record this exception in the rendered review once the page passes.

## Not written
review.json and medicare-part-d-2027-premiums-analysis.json were not written because hard fails exist. After the fixer runs, the page must be rebuilt, rendered-snapshot.json recaptured (current snapshotSha256 793e51b2...), and re-audited. The Centene/United/AARP/Social Security links need their URLs added to the allowed list; uhc.com and ssa.gov return 403 to scripted fetches and need a browser check.

## Method note
Evidence sources were originally page summaries (sources.md). The auditor fetched all four primary pages directly on 2026-11-02 and checked the quotes above against full text; Plan Finder returned 403 to scripted fetch and was not independently read.

## Round 2 (after fix round 1)
Re-measured on the exact current entry: body 1,736 words (floor 1,200); 109 sentences, no 5-run, no 10-run; zero em-dashes; no we/our/honest. Round-1 hard fails 1-13 verified resolved in source and built HTML (links to Centene, Wellcare, UHC, AARP, CMS name, Social Security render, FAQ link renders and JSON-LD text is clean, H1 now "Stand-Alone Plan", FAQ 2 starts "No."). Dates: new page 2026-11-02 visible and JSON-LD; edited pages still Oct 23 and Oct 20, 2026.
Two hard fails remain, both backward pronouns created by the fix round (see findings file). No review.json or analysis JSON written. Fix both, rebuild, recapture, and request round 3.

## Round 3: PASS
Exact current text re-measured: 1,739 body words, 109 sentences, no 5-run or 10-run, zero em-dashes. Both round-2 backward-pronoun fixes verified in source and dist. Zero hard fails. Wrote audit/review.json (check --recapture passed: "Rendered review evidence verified") and audit/medicare-part-d-2027-premiums-analysis.json (audit-analysis PASS). Link-only date-policy exception documented in the datesAndSchema evidence of both edited routes. Advisories remain (see round 1 notes).
