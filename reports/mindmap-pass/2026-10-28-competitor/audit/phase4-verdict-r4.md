# Phase 4 verdict r4, 2026-10-28 competitor run (phase4-reviewer)

Startup `workflow-start.sh --cloud` exit 0 (7617515); bundle `check` ok. Dist HTML hash == new snapshot == served response for all 3 routes. Drafts == guides.ts. Snapshot canonical digest 5d51c201e864d43598dc8060729154e6af36d92ad704b386e622fc466396a099 (file sha256 7f7c007e0852deee62274f184be063f4b18ff3afd9f59e50e9b1acbc8eedd746). I re-read the full rendered text of both guides.

| Route | Verdict |
|---|---|
| /guides/student-loan-deferment/ | PASS |
| /student-loan-wage-garnishment-calculator/ | PASS |
| /guides/average-retirement-savings-by-age/ | FAIL (1 MUST-FIX, renderedLayout) |

Both r3 edits are verified: the duplicated Needs sentence is gone, and "until your servicer confirms approval" reads correctly. Every substance gate passes on both guides (sources, regulation text, arithmetic, attribution, testing exclusions, links, dates, schema, rhythm, depth 1,869 and 2,146 words).

## Residual MUST-FIX (retirement guide, one find I missed in earlier rounds)
Literal asterisks reach the reader. The six bullets in "What the Numbers Leave Out" are authored `**Label:**` but `src/lib/richtext.ts` renders only links, lists and tables, so dist shows `<li>**Ages 65 and older:** Table A stops at 64...</li>` (12 literal `**` on the page; the student loan page has none).
Exact replacement (remove the asterisks, keep the colon):
- `**Ages 65 and older:**` -> `Ages 65 and older:`
- `**Social Security and pensions:**` -> `Social Security and pensions:`
- `**Families instead of individuals:**` -> `Families instead of individuals:`
- `**Account holders only:**` -> `Account holders only:`
- `**Inflation:**` -> `Inflation:`
- `**Needs:**` -> `Needs:`
(`content_standard` asks for markdown bold labels only where the site renders them bold; here it does not.) After this Rung 1 edit, rebuild, recapture and re-review that route (the other two fingerprints are unaffected unless their output changes).

## Not blocking
ed.gov and peacecorps.gov unverified here (403); layout evidence structural, no device screenshot; the 35 to 44 dip is not mentioned; inherited footer (em-dash disclaimer, "never affects our rankings"); template sets datePublished from `updated`; the retirement guide's only inbound link is the /guides/ card (record "no narrow placement").

## Rendered review
audit/rendered-review-r4.json: 3 routes, fingerprints and canonical snapshotSha256 from the new snapshot; student loan and garnishment PASS, retirement FAIL on renderedLayout only.
