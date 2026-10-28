# Phase 4 verdict r3, 2026-10-28 competitor run (phase4-reviewer)

Startup exit 0 (7617515); bundle check ok. Audited bytes: dist HTML hash == new snapshot == served response for all 3 routes; drafts == guides.ts entries. Snapshot canonical digest 27e2b4f963b178548ddad2ff4a93a9ac5219fa1231ded36ae2f91e56189fcaaa (file sha256 59900c11e73f6f6eebdb6f73f2a3af9da4abcedad20f1eb70d5876176ee2f470).

| Route | Verdict | Remaining |
|---|---|---|
| /guides/average-retirement-savings-by-age/ | FAIL (1 MUST-FIX) | restatement of the Needs limit |
| /guides/student-loan-deferment/ | FAIL (1 MUST-FIX) | backward pronoun "it" in intro S3 |
| /student-loan-wage-garnishment-calculator/ | PASS | none |

Both guide findings are one-line Rung 1 edits. All round-1 and round-2 findings are verified fixed. Substance (sources, regulatory statements, arithmetic, attribution, testing exclusions, links, schema, dates) PASSES on both guides.

## Exact remaining fixes
1. Retirement guide, "What the Numbers Leave Out": delete the sentence "If you are comparing your balance to peers, the Needs limit applies most: the table says nothing about what balance you need." (it repeats the Needs bullet word for word). The paragraph then starts "For age-based savings targets, see our guide on [how much you need to retire by age](/guides/how-much-do-i-need-to-retire-by-age/)."
2. Student loan guide, intro S3: "Keep making scheduled payments if you can until it confirms approval." -> "Keep making scheduled payments if you can until your servicer confirms approval."

## Scope notes
- Removing the shared "retirement" pill returned the 12 retirement routes and /guides/ cards to their prior state, so the retirement date-policy and route-inventory items from r2 are closed. The only remaining inbound links are the /guides/ index cards (both guides) and the garnishment calculator pill. The retirement guide has no calculator-page inbound link; record "no narrow placement" in the run summary.
- Garnishment route: label "Not in default yet? How to defer your student loans" matches the guide; date bump and link ship together; PASS.
- Not blocking: ed.gov and peacecorps.gov unverified here (403); layout evidence structural only; inherited footer em-dash and "never affects our rankings" sentence; template sets datePublished from `updated`.

## Rendered review
audit/rendered-review-r3.json: reviewer phase4-reviewer, 3 routes, fingerprints from the new snapshot, snapshotSha256 = canonical digest above, snapshotFileSha256 = raw file hash. Guides FAIL (wholePageCoherence), garnishment PASS. After the two edits, rebuild, recapture and re-review; any change voids the fingerprints. Per the ladder these are Rung 1 fixes, not a further rework attempt.
