# Phase 3/4 content records — 2026-09-23 run

standard-loaded: cs=99c49d6f aa=71a2ad6a exp=31d70e56 domain="The Modern Wallet (themodernwallet.com) is a personal-financ"
(receipt: `reports/standards-ledger.jsonl`, routine=competitor-monitor-auto, phase=phase-3-generate)

## Scope decision

Phase 2 dedup (`reports/competitor-monitor/phase2-dedup-2026-09-23.md`) cleared 10 SmartAsset
candidates as genuinely NEW and approved them to generate: 7 `page`→guide candidates and 3
`comparison` candidates. This phase generated and published all **10 of 10**. No candidate was
dropped, enriched, or merged.

## Pages generated

| Slug | File | route | medium | register | page type | body words | floor |
|---|---|---|---|---|---|---|---|
| rental-property-tax-deductions | guides.ts | /guides/rental-property-tax-deductions/ | text→text | operator | explainer | 1,753 | 1,200 |
| how-to-check-your-401k-balance | guides.ts | /guides/how-to-check-your-401k-balance/ | text→text | operator | explainer | 2,070 | 1,200 |
| can-you-retire-on-1-5-million-comfortably | guides.ts | /guides/can-you-retire-on-1-5-million-comfortably/ | text→text | operator | worth-it | 1,767 | 1,200 |
| how-long-will-150k-last-in-retirement | guides.ts | /guides/how-long-will-150k-last-in-retirement/ | text→text | operator | explainer | 1,834 | 1,200 |
| does-retirement-income-count-as-income-for-social-security | guides.ts | /guides/does-retirement-income-count-as-income-for-social-security/ | text→text | operator | explainer | 1,757 | 1,200 |
| how-much-will-i-need-to-retire-in-2050 | guides.ts | /guides/how-much-will-i-need-to-retire-in-2050/ | text→text | operator | explainer | 1,665 | 1,200 |
| is-10-million-enough-for-you-to-retire-at-50 | guides.ts | /guides/is-10-million-enough-for-you-to-retire-at-50/ | text→text | operator | worth-it | 1,339 | 1,200 |
| flat-fee-vs-aum-based-financial-advisors | comparisons.ts | /compare/flat-fee-vs-aum-based-financial-advisors/ | text→text | operator | comparison | 2,704 | 1,500 |
| simple-ira-vs-sep-ira | comparisons.ts | /compare/simple-ira-vs-sep-ira/ | text→text | operator | comparison | 2,247 | 1,500 |
| roth-403b-vs-roth-ira | comparisons.ts | /compare/roth-403b-vs-roth-ira/ | text→text | operator | comparison | 1,976 | 1,500 |

**Distribution:** guides passing 7/7, comparisons passing 3/3, median guide 1,753 words (46% above
floor), median comparison 2,247 words (50% above floor). No page ended up `draft: true` — all 10
cleared audit within a single fix-in-place round, no page needed a full rework.

**Model:** every page generated with `gemini-3.8-flash` (primary), thinking=`medium` (this repo's
own `.claude/content-gen.env` growing-site tier — a legitimate per-repo override synced by
`sync-content-gen.sh`, not a manual downgrade). **No fallback fired on any page** — `gpt-5.6-sol`
had no key configured in this sandbox, but the primary answered cleanly on every one of the 10
`write` calls, so the fallback was never invoked. Total generation cost ≈$0.24 across 10 calls
(see `.meta.json` beside each draft in `reports/competitor-monitor/2026-09-23/drafts/`).

## Phase 4 audit — findings and fixes

A direct read-through audit ran against all 10 drafts per `_content-standard.md` AUDITOR +
`_anti-ai-language.md` AUDITOR, immediately after generation, before staging (mechanical checks
scripted in `reports/competitor-monitor/2026-09-23/prompts/lint.py`; math/fact verification done
by hand against each row's closed fact list). Every finding below was fixed in place
(Rung 0/Rung 1 of the remediation ladder) — no page needed a Rung 2 rework.

**rental-property-tax-deductions**
- Headline tell: title `"Rental Property Tax Deductions: What Landlords Can Deduct"` matched the
  banned two-clause colon formula (`"X: What It Is and How to Choose"`) → rewritten to
  `"Rental Property Tax Deductions Landlords Can Claim"` (one clause, 50 chars).
- Brand repeated at a second "we" claim (VOICE: name the brand once only) → `"At ModernWallet, we
  see property owners…"` → `"We see property owners…"`.
- Mechanical rendering bug: a bulleted list was on the same paragraph line as its lead-in
  sentence (`"…include:\n- Mortgage interest…"`), which `richBody`'s block splitter (blank-line
  delimited) would NOT recognize as a list — it would have rendered as a raw paragraph with
  literal `-` characters. Fixed by inserting the blank line the renderer requires between the
  lead-in and the list, matching the pattern real existing guides use. Verified in the built HTML
  (`<ul class="prose-list">` renders correctly, not raw text).
- `Topic No. 414` (IRS citation number) and other IRS reference numbers were flagged by the
  numeric fact-scanner as "not on the closed fact list" — verified as legitimate citation
  numbers/statutory figures already in the row's CLOSED URL LIST, not fabrication. No action.

**how-to-check-your-401k-balance**
- Two "essential" hype-filler instances (`"making online verification essential"`,
  `"is an essential step in maintaining a healthy retirement strategy"`) → rewritten to state the
  concrete consequence instead of the filler adjective.
- Closing sentence was keyword-stuffed and grammatically broken (`"…verify how to check your
  401k balance on an annual schedule"`) → rewritten as a natural, concrete next action.

**can-you-retire-on-1-5-million-comfortably**
- Title too short (43 chars, below the 50–60 range) → expanded to `"Can You Retire on $1.5
  Million and Live Comfortably?"` (52 chars).
- "powerful" hype-filler (`"Another powerful tool is optimizing your Social Security…"`) →
  rewritten as a direct statement naming the actual lever.
- 20 numbers flagged by the fact-scanner as untraceable — hand-verified every one: all are
  internally consistent illustrative arithmetic ($52,500/$60,000 at 3.5%/4% of $1.5M; $84,850 ≈
  "nearly $85,000" combined with average Social Security; a hypothetical $45,000/$70,000/$85,000
  household-expense scenario with correctly computed withdrawal rates), not external fabricated
  facts. No page-content fix needed; this is the same "show the arithmetic" pattern the site's own
  existing `is-3-million-enough-to-retire-at-40` guide uses.

**how-long-will-150k-last-in-retirement**
- Weasel attribution: `"research suggests your savings could support you for roughly 30 years"`
  (no named source in that sentence, even though the Trinity Study is named two sentences later)
  → rewritten to name the source inline.
- Internal inconsistency: claimed spending $3,000–$4,000/month from $150,000 "evaporates in under
  four years even with generous market returns" — the math for the $3,000/month case (150,000 ÷
  36,000/yr ≈ 4.17 years) does not support "under four years," and "even with generous returns"
  contradicted the zero-growth assumption used to compute it → corrected to an accurate, hedged
  claim ("about three to four years… with no other income or growth").
- FAQ answer conflated the age-62 early-claim reduction with the age-70 delayed-retirement-credit
  rate (`"Delaying Social Security past age 62 increases your…payout by up to 8% per year"` — the
  8%/year credit applies to delay PAST full retirement age, not from 62) → corrected to state both
  rules accurately and separately.
- All four worked withdrawal-longevity scenarios (12.5 / 17.7 / 28 / ~30 years) and every
  dependent FAQ figure ($2,571, $2,821, the $1,400/$2,480 claiming-age examples) were independently
  recomputed by hand against the finite-annuity depletion formula and the real 2026 delayed-credit
  math — all correct, no other fix needed.

**does-retirement-income-count-as-income-for-social-security**
- Rhetorical self-answered question in the intro (`"Does retirement income count as income for
  Social Security? For benefit withholding, the answer is a clear no."`) — a banned "Question?
  Answer." pair → the restated question was deleted.
- Closing sentence was keyword-stuffed and grammatically broken (`"…review our calculators to
  determine does retirement income count as income for Social Security checks or tax brackets…"`)
  → rewritten as a natural next-action sentence.
- Two section headings duplicated the H1/keyword and one used the banned two-clause colon formula
  (`"…Social Security: What Counts vs What Does Not"`) → both rewritten as distinct, single-clause
  headings (`"How the Earnings Test Actually Treats Retirement Income"`,
  `"What Counts as Income Under the Earnings Test"`).
- Mechanical rendering bug (two instances): both bulleted lists used `*` markers, which this
  project's `richBody` renderer does NOT recognize as a list line (only `-` and `1.` are
  recognized) — would have rendered as two raw paragraphs of literal asterisked text. Converted to
  `-` markers and added the required blank line before each list. Verified in built HTML.

**how-much-will-i-need-to-retire-in-2050**
- Unsourced benchmark claim: `"A forty-year-old saver…generally aims to have roughly three times
  their annual income invested"` — a specific savings-multiple figure not on the row's closed fact
  list and not linked to a source → removed; replaced with a plain pointer to the site's own
  age-based-benchmark guide instead of asserting an unverified number.
- All inflation-compounding math independently recomputed by hand: 2.5%/3% inflation over 24 years
  (≈81%/≈103% cumulative increase), the $108,500/$122,000 inflated targets, the $2.71M/$3.05M/
  $3.58M/$4.03M savings-multiple targets, and the $337,500–$445,500 inflation-spread delta — every
  figure checks out exactly against the closed-fact-list formulas. The Social Security trust-fund
  depletion figures (2033 OASI/77%, 2034 combined/81%) match the SSA source given. No further
  fixes needed.

**is-10-million-enough-for-you-to-retire-at-50**
- Broken link-anchor grammar: `"our earlier guide on whether [is $3 million is enough to retire at
  40](…)"` (duplicated "is") → corrected to `"[$3 million is enough to retire at 40]"`.
- Confirmed this page is genuinely differentiated from its sibling `is-3-million-enough-to-retire-
  at-40` per the row's mandatory differentiation brief: different withdrawal-rate justification
  (3.5–4% for a 40–45-year horizon vs. the sibling's 3–3.5% for a 50-plus-year horizon), and an
  entirely different risk framing (federal estate-tax exemption status, concentration risk,
  lifestyle inflation) rather than the sibling's basic-affordability framing. The $15M/2026
  federal estate exclusion figure was verified directly against IRS Revenue Procedure 2025-32 via
  the newsroom page in the closed URL list.

**flat-fee-vs-aum-based-financial-advisors**
- Headline tell: both `title` and `h1` used `"…: How to Choose"` — a near-verbatim match to the
  standard's own named example of the banned two-clause colon formula
  (`"X: What It Is and How to Choose"`) → both rewritten to `"…Compared by Cost"` (single clause).
- 29 numbers flagged by the fact-scanner as untraceable — hand-verified every one: the crossover-
  point math ($6,815 ÷ 1% = $681,500), the tiered-fee blended-rate example (1.25%/1.00%/0.75% on a
  hypothetical $1.2M portfolio → $12,750 total, 1.06% effective — explicitly hedged as a "typical…
  might" illustration, not an asserted real schedule), and the 20-year compounding-drag example
  (1,000,000 × 1.07^20 = $3,869,684 exactly; × 1.06^20 = $3,207,135 exactly; difference $662,549)
  are all mathematically exact, internally consistent, and clearly framed as worked illustrations —
  not fabricated external facts. No content fix needed beyond the two headline fixes above.
- Verified the TCJA/OBBBA claim that investment advisory fees remain non-deductible in 2026
  (`"eliminated…under the Tax Cuts and Jobs Act"`) against a live web search of IRS/legal-industry
  coverage of the One Big Beautiful Bill Act — confirmed accurate (P.L. 119-21 §70114 made the
  suspension permanent).

**simple-ira-vs-sep-ira**
- Fabricated experience claim (GATE — Experience truth): `"At ModernWallet, we review retirement
  structures across hundreds of small-firm balance sheets…"` — `_experience.md` licenses only
  general editorial framing about this being a calculators-and-guides content property, never a
  claimed advisory client volume → rewritten to a claim `_experience.md` actually supports.
- "utilize" and "essential" (hype filler) → replaced with plain wording ("use", and a rewritten
  sentence without the filler adjective).
- Title 1 character short of the 50-char floor → `"…Which Fits Your Business?"` → `"…Which One
  Fits Your Business?"`.
- Confirmed genuine de-duplication against the four existing sibling comparisons
  (`sep-ira-vs-solo-401k`, `simple-ira-vs-401k`, `traditional-ira-vs-simple-ira`,
  `solo-401k-vs-simple-ira`) — this page's substance (the 25% two-year early-withdrawal penalty,
  the October 1 vs. tax-filing-deadline setup window) is the SIMPLE-vs-SEP pair specifically and
  does not restate any sibling's contribution-math argument; all four are cross-linked rather than
  re-explained.

**roth-403b-vs-roth-ira**
- Title/H1 were too short (40 chars) AND matched the competitor's own given title
  (`"Roth 403b vs. Roth IRA: Key Differences"`) almost verbatim → rewritten to `"Roth 403(b) vs.
  Roth IRA: Which Should You Fund First?"` (54 chars, meaningfully different phrasing).
- "utilize" (hype filler) → "use".
- Verified the RMD-elimination claim (SECURE 2.0 Section 325, effective 2024, for designated Roth
  employer-plan accounts) and the employer-Roth-match provision against a live web search —
  confirmed accurate.
- All contribution-math ($24,500+$8,000=$32,500; $24,500+$11,250=$35,750; $7,500+$1,100=$8,600;
  $24,500+$7,500=$32,000 combined) independently recomputed — correct.

## No-plagiarism confirmation

For each of the 10 pages, the competitor's `outline` (from `phase2-dedup-2026-09-23.md`) was used
only as a topic-coverage checklist — no competitor sentence or passage was pasted or paraphrased
sentence-by-sentence into any draft, and SmartAsset is never named on any of the 10 rendered pages
(`grep -c "smartasset\|SmartAsset"` against the built HTML for every new route returns 0). Every
page adds real information gain beyond the competitor's outline: worked arithmetic the outline
never shows (finite-annuity depletion math, exact 2050-dollar inflation targets, the AUM-vs-flat-
fee crossover-point and 20-year compounding-drag calculations), calculator cross-links, and at
least one non-obvious decision criterion the outline does not surface (the SIMPLE IRA's unique
25% two-year penalty; the 403(b)'s no-income-limit workaround for high earners; the $10M estate's
below-federal-exemption status). Two titles briefly converged on wording close to the competitor's
own title during generation (`roth-403b-vs-roth-ira`, and the near-miss two-clause-colon pattern on
`flat-fee-vs-aum-based-financial-advisors`) — both were caught and rewritten during audit before
staging, and neither reached the built site.

## Files touched

- `src/data/guides.ts` — 7 new entries appended (`rental-property-tax-deductions`,
  `how-to-check-your-401k-balance`, `can-you-retire-on-1-5-million-comfortably`,
  `how-long-will-150k-last-in-retirement`,
  `does-retirement-income-count-as-income-for-social-security`,
  `how-much-will-i-need-to-retire-in-2050`, `is-10-million-enough-for-you-to-retire-at-50`).
- `src/data/comparisons.ts` — 3 new entries appended (`flat-fee-vs-aum-based-financial-advisors`,
  `simple-ira-vs-sep-ira`, `roth-403b-vs-roth-ira`).
- `reports/competitor-monitor/2026-09-23/prompts/` — `system-guide.md`, `system-comparison.md`,
  `contract-guide.md`, `contract-comparison.md`, `voice-guide.json`, `voice-comparison.json`,
  10× `<slug>.prompt.md`, 10× `<slug>.allowed-urls.txt`, `lint.py`, `build_entries.py`.
- `reports/competitor-monitor/2026-09-23/drafts/` — 10× `<slug>.json` (verified, post-audit
  drafts) + 10× `<slug>.json.meta.json` (provenance: model, tokens, cost, repair/flag log).
- `reports/competitor-monitor/2026-09-23/ts-blocks/` — the exact TS object-literal text spliced
  into each data file (kept for the diff trail).
- `reports/standards-ledger.jsonl` — the `via":"load-script"` receipt for this run.
- `reports/competitor-monitor/run-2026-09-23-content-records.md` — this report.

Package installs (`node_modules/`) and the build output (`dist/`) used to verify the build are
both gitignored and untouched by `git add`.

Not committed, not pushed, no typecheck/build artifact staged (per instructions — the orchestrator
handles staging/push next). `npm run build` (880 pages) and `npx tsc --noEmit` were run locally
only to verify the 10 new entries compile and render; neither their invocation nor `node_modules`/
`dist` output is part of this commit's diff.
