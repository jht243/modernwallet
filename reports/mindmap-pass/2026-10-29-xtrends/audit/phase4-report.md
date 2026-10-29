# Phase 4 independent audit, x-trends 2026-10-29

Auditor: phase4-auditor-1 (did not write the content). Run id 651890a4c73b4c11a556f8a37b8176d4 (cloud, startup current at 195331c).
Preflight bundle: audit/preflight-audit, all 31 parts read, `check` returned delivery-complete-sources-current.

## Verdicts

| Route | Verdict | Receipts |
|---|---|---|
| A1 /hidden-cost-of-owning-a-home-calculator/ | FAIL (rework by Rung 1 fix-in-place, findings 1 and 2) | none |
| A2 /guides/fed-rate-hike-savings-investments/ | FAIL (Rung 1 fix-in-place, findings 3 to 8) | none |
| A3 /rent-vs-buy-calculator/ pill | PASS on content and link, with one date-policy ruling needed (finding 9) | none |

No rendered-review.json, hidden-cost-analysis-review.json or fed-analysis-review.json was written, because the exact text will change.
Written evidence only: audit/hidden-cost-replay.py, audit/hidden-cost-replay.json (canonical digest d56b1b7a35d60fdf6f88d03878c148ef2b321a1f4f65ceff9485e4ab6367a76c, identical to evidence output.json; replaySha256 for later use). evidence.json canonicalJsonSha256 now 82de620c1098e6a21d5c6910a00be9a8122a7efe16f349c3ad6edb7acb431fc9 (it will change if the packet is edited for finding 1).

## Numbered findings (quote, defect, fix)

1. A1 attribution not beside the first original finding; takeaway does not name the modeling; packet disagrees with page. (Decision-evidence section 4; Tee-up gate record.)
   - The first computed finding is the intro worked example ("For example, take a newer home that needs $3,000 a year of maintenance. ... Its hidden cost comes to $8,395 a year"). The only "In our internal cost modeling" sentence is in howItWorks paragraph 1, after the calculator. evidence.json `provenance.placement` says "howItWorks first finding paragraph and the takeaway paragraph", but the takeaway paragraph has no attribution wording. No `teeup-exempt:` note is recorded for this operator page and the page has no tee-up sentence.
   - FIX intro: "For example, take a newer home that needs $3,000 a year of maintenance." -> "In our internal cost modeling, we ran a newer home that needs $3,000 a year of maintenance through the calculator."
   - FIX howItWorks takeaway: "A newer home or a condo whose association pays for exteriors can run well below the typical, as the $3,000-maintenance case at $8,395 a year shows." -> "In our internal cost modeling, a newer home or a condo whose association pays for exteriors ran well below the typical, as the $3,000-maintenance case at $8,395 a year shows."
   - Then record `teeup-exempt: calculator page, first paragraph reports a sourced figure and the attribution sits at the first modeled finding` in the row notes, and make provenance.placement match.
2. A1 metaTitle is 44 characters ("Hidden Cost of Owning a Home Calculator 2026"); the SEO standard asks 50 to 60 and the repo has no lint script, so this is a mechanical miss (the sibling car-loan title is 43, so low severity). FIX: "Hidden Cost of Owning a Home Calculator for 2026 Budgets" (56).
3. A2 monotone rhythm and overloaded sentences in the new section. Sentences 5 to 14 are all in the long band (lengths 22,21,33,20,18,33,30,30,20,31), and five sentences run 30 to 33 words with two or more chained clauses. FIX: apply the replacements in finding 4 to 8 (they also split the long sentences); re-measure afterwards (target: no 10-run in one band).
4. A2 mortgage claim is not supported by its evidence, and it clashes with an inherited sentence. Quote: "The hold is not a mortgage-rate event, and a fixed-rate loan you already have is unaffected by it. ... put the average 30-year fixed rate at 7.24% on October 29, down from 7.32% a week earlier, a move that came with no change in the Fed's target range."
   - Freddie Mac's own page says the release is "an average of loan rates offered the prior Thursday through Wednesday", so the 7.24% covers October 22 to 28 and ends on decision day. It cannot show how lenders reacted to the hold. "Moved without a change in the target range" does not show a hold has no effect, and the existing section says "Mortgage rates also respond to broader monetary policy and inflation expectations".
   - FIX: "A fixed-rate loan you already have is unaffected by the hold, and the Fed does not set mortgage rates directly. [Freddie Mac's weekly survey](https://www.freddiemac.com/pmms) put the average 30-year fixed rate at 7.24% on October 29, down from 7.32% a week earlier. Freddie Mac builds that average from rates offered Thursday through Wednesday, so the figure ends on October 28, the day of the decision. Your own quote can differ, so compare it using the [mortgage rates guide](/guides/current-mortgage-rates-guide/)." Also change the approved answer wording "is not a mortgage-rate event" in the manifest and packet takeaway to match.
5. A2 false statement about the page. Quote: "If you hold bonds or a mortgage rate lock, the sections below explain how a rate change affects each one." No section below covers mortgage rate locks. FIX: "If you hold bonds, the sections below explain how a rate change affects their price."
6. A2 misleading collocation. Quote: "so compare current quotes in the CD calculator or the high-yield savings account (HYSA) vs CD comparison". Neither page lists current bank quotes. FIX: "Each bank sets its own rates on new CDs and savings accounts. Enter a bank's quote in the [CD calculator](/cd-calculator/) or read the [high-yield savings account (HYSA) vs CD comparison](/compare/hysa-vs-cd/) before you pick one."
7. A2 restatement (third mention of the dissent and a repeat of "compare quotes"). Quote: "The two dissents show that 2 of the 12 voters wanted a quarter-point increase at this meeting, but the Federal Reserve statement gives no explicit guidance about the next meeting." FIX: "The statement gives no explicit guidance about the next meeting." Closing sentence FIX: "Compare current CD and savings quotes before you lock a term, then read ... Economic Projections." -> "Before you lock a CD term, compare current bank quotes. Then read the Federal Reserve statement after the [December 8-9, 2026 meeting](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm), which comes with a Summary of Economic Projections." and drop "before you pick one" from the CD sentence only if it reads as a repeat.
8. A2 first mention of an organisation unlinked (newly first on the page). Quote: "The Federal Open Market Committee (FOMC) held the federal funds target range at 3-3/4 to 4 percent on October 28, 2026, and that hold changes no rate you already have." The existing linked mention is now second. FIX: "The [Federal Open Market Committee](https://www.federalreserve.gov/monetarypolicy/fomc.htm) (FOMC) held the federal funds target range at 3-3/4 to 4 percent on October 28, 2026. That hold changes no rate you already have." (URL is already on the page; add it to the closed URL list.)
9. A3 date-policy ruling needed (not counted as a content defect). The Phase 4 date-bump rule lists "internal links" among edits that require bumping `updated` and calls a stale date a hard fail; phase-7 and `_rendered-page-audit.md` item 5 treat link-only touches as non-substantive and ask that exceptions be documented. The route keeps `updated` 2026-10-28 (visible "Updated October 28, 2026", JSON-LD dateModified 2026-10-28), matching `expectedUpdatedDate`. Decide: record the link-only exception in the rendered review, or bump to 2026-10-29 and update the manifest. I will record whichever you choose; I read the specific link-only rules as controlling.

After fixes, the changed fields must pass through `content_gen.py fix` (A1 findings 1 and 2 are source edits in calculators.ts, A2 in guides.ts), then rebuild, recapture the hydrated DOM and snapshot, and I will re-audit and write the three review receipts.

## Per-route check record

### A1 calculator page
| Check | Result | Evidence |
|---|---|---|
| Reader question in sections 1 and 2 | PASS | Intro paragraph 1 gives $16,566 a year, about $1,380 a month, two-thirds maintenance, and the instruction to replace with own quotes. Condition stated. |
| Numbers traceable | PASS | Every figure matches closed fact list R1 to R6 and C1 to C6; source figures re-verified live against the Zillow release (16,566; 11,171; 3,129; 2,266; 31.7%; 2.8%; 54/32/19%; 9% to 1%; Miami; six metros; 14,187; 25,111; method text). |
| Independent replay | PASS | audit/hidden-cost-replay.json digest equals output.json digest; engine, run.mts, inputs, output, sources, cases hashes match the packet. |
| Calculator defaults/boundaries | PASS | Default $1,381 / $16,566 / $931 / $87,951 / $18,645, 67/19/14%, "matches the typical" line (hydrated DOM). Empty gives $0 and prompts; negatives clamp to 0; NaN to 0; growth 0, years 1, 30, 0 and 99 clamp 1 to 30; huge values finite or shown as a dash, no NaN/undefined. Advisory: the UI strips "-" so negative growth cannot be typed; the engine mis-handles growth below -100 only if called directly. |
| Visible attribution | FAIL | Finding 1. Wording itself says "internal cost modeling", scenarios chosen by us, not measured, not client cases, checkable in the tool. |
| Takeaway | PASS content, finding 1 for naming | Conditional, alternative (own bills, rent vs buy) and consistent with opening, tool and FAQs. |
| Scenario inputs beside results | PASS | Each case states inputs. |
| HOA like-for-like | PASS | Prose says the comparison line leaves HOA out and gives $9,637 gap; engine and tool line name "maintenance, tax and insurance". |
| Links / off-list URLs | PASS | Only the Zillow release; Thumbtack is inside that linked first mention (advisory: no separate Thumbtack link, none on the closed list). Fox Business not named. Internal links all real routes. |
| Mechanical tells | PASS | Zero em-dashes, semicolons, "honest", cleft, tell-list hits in headings, meta, intro, how-it-works, FAQ questions and answers (separate scan); no neutrality claim. Em-dashes in dist are template boilerplate only. |
| Sentence rhythm | PASS | 107 sentences, bands L49/M42/S16, no 10-run single band, no 5-run within 3 words; max 32 words (two sentences at 30 and 32). |
| Depth | PASS | 1,535 words (intro 146, howItWorks 1,027, FAQ 362) with link URLs stripped, floor 1,000 (cost/pricing). Measured with a script plus `wc -w`. |
| TESTED residue | PASS | No "we tested" or "in our testing" in title, meta, body, FAQ, schema or dist; modeling label only; evidence testingDecision records the section G exclusion. |
| Dates and schema | PASS | Visible "Updated October 29, 2026"; Article datePublished and dateModified 2026-10-29; JSON-LD parses (Organization, WebSite, BreadcrumbList, WebApplication, FAQPage 8, Person, Article with citation). Canonical https://www.themodernwallet.com/hidden-cost-of-owning-a-home-calculator/. In sitemap-0.xml. |
| Disclaimer placement | PASS | "Not financial advice" sits in the last prose paragraph and the footer; the in-tool "Estimate only" note is a scope note with no advice wording. |
| Accessibility / mobile | PASS | 8 inputs inside labels, growth input has aria-label, data-tool root present, 390px screenshot shows no overflow or clipping, 1280px layout fine. |
| Provenance | PASS | meta: claude-opus-5-5 requested and used, fallback_used false, claim_check replaced "At ModernWallet, we ran..." with the current wording; final source text equals draft. |
| Title/meta | finding 2 | Description 148 characters. |

### A2 guide enrichment
| Check | Result | Evidence |
|---|---|---|
| Diff scope | PASS | `git diff src/data/guides.ts`: one new first section plus updated 2026-10-29; other sections and metadata unchanged. |
| Reader question answered in first section | PASS in substance | Hold, 10 to 2, two dissents for +0.25, no change to existing CD or fixed loan. Mortgage half fails evidence check (finding 4). |
| Facts | PASS except finding 4 | Federal Reserve statement, Freddie Mac PMMS (7.24 / 7.32) and FOMC calendar (Dec 8-9 with SEP) re-fetched live and match; no unsupported inflation or forecast claims. |
| Whole-page read for inherited contradictions | FAIL via finding 4 only | New lead vs existing "Mortgage rates also respond to broader monetary policy and inflation expectations". CD, bond and FAQ sections remain consistent with a hold. |
| Attribution / takeaway | PASS | Reported basis, Federal Reserve and Freddie Mac named and linked; no internal-testing claim; next action present. |
| Rhythm / overloaded | FAIL | Finding 3. |
| Links | FAIL | Finding 8. |
| Dates/schema | PASS | Visible and dateModified 2026-10-29; JSON-LD valid, FAQPage 6. |
| Mobile | PASS | See screenshots shots-_guides_*. |

### A3 pill
PASS: `src/data/cross-links.ts` adds one pill ("What does owning cost beyond the mortgage?" -> /hidden-cost-of-owning-a-home-calculator/) to the rent-vs-buy group; present in the built page; date policy see finding 9.

### Site-wide effect
Only src files changed: CalculatorIsland.tsx, calculators.ts, cross-links.ts, guides.ts, registry.ts. Built effects: nav and footer link on all 1,079 pages, a card on the home page (count "62" to "63" calculators), a block and ItemList entry on /calculators/, search-index.json entry, sitemap entry. Nothing else found; no baseline build was compared byte for byte.

## Advisory notes (do not block)
- Intro and howItWorks paragraphs run 5 to 10 sentences against the 3-sentence STYLE guideline; dense on mobile.
- Headline number shows $1,381 in the tool, "about $1,380" and "$1,380.50" in prose; consider "$1,380.50 (shown as $1,381)".
- "Your own quotes change the answer." reads as an aphoristic verdict; acceptable because the next sentences give the conditions.
- A2: existing paragraph "the 0.38 percent average sits well below the 3.7 percent CPI" is unexplained and unsourced (inherited, not tied to the hold). FAQ "How do I know if the Fed will keep raising rates?" assumes continued hikes; the answer still holds. The new section does not say whether to lock or wait on a CD given the dissents; the existing CD section covers the tradeoff.
- Template sets datePublished equal to `updated`, so the guide's September publish date is now overwritten (site-wide convention).
- /rent-vs-buy-calculator/ default mortgage rate is 7.32%, a week behind the new 7.24% (out of scope).
- Years field accepts 99 and silently uses 30; the result label shows the years used.

---

# Round 2 (current bytes: origin/main 3a75ab9, snapshot captured 2026-10-29T17:40:34Z)

Preflight: bundle reused from my fully read round-1 bundle (preflight-audit-r2, check passed, startup current).

## Round-1 findings status
- 1 attribution / teeup-exempt / takeaway: FIXED. Intro "In our internal cost modeling, we ran a newer home..." and takeaway "In our internal cost modeling, a newer home or a condo..." render in the snapshot; packet carries teeupNote and updated provenance.placement.
- 2 metaTitle: FIXED, 56 characters, rendered <title> matches.
- 3 rhythm / overloaded sentences: FIXED. A2 section now 17 real sentences, no 10-run in one band, no 5-run within 3 words, nothing at 30 or more words, no em-dash or semicolon.
- 4 mortgage claim: MOSTLY FIXED, see R2-1.
- 5 rate-lock claim: FIXED ("If you hold bonds, the sections below explain how a rate change affects their price.").
- 6 CD calculator collocation: FIXED.
- 7 dissent restatement: FIXED.
- 8 FOMC first mention: FIXED, linked to fomc.htm.
- 9 A3 date: ruling accepted (keep `updated` 2026-10-28; link-only exception to be recorded in the rendered review).

## Re-verified on the current bytes
- Replay digest unchanged: d56b1b7a35d60fdf6f88d03878c148ef2b321a1f4f65ceff9485e4ab6367a76c equals output.json. New evidence.json canonical digests: A1 2dc1b7afe5df2f9867d531e1e24609f3dc4afd495f37dcfb89fe19c0ce979d1d, A2 63cbf682ce09e2c1646ac6fb34bcf8f20a3d8093cb952e9f95c41bebe226f473.
- A1: depth 1,546 words (floor 1,000); 107 sentences, bands L50/M41/S16, no monotone run; zero em-dash, semicolon, "honest", testing claims; dates 2026-10-29 visible and JSON-LD; canonical and sitemap fine; source text equals the snapshot text; hydrated DOM equals dist byte for byte; snapshot file hashes match the manifest.
- A2: whole rendered guide re-read; no remaining contradiction with the hold; dates 2026-10-29; links match the closed list plus the already-present FOMC page.
- A3: pill present, date unchanged at 2026-10-28, fingerprint unchanged.

## Remaining finding
R2-1. A2 bare fact with no consequence (and the mortgage half of the reader question left implicit). Quote: "Freddie Mac builds that average from rates offered Thursday through Wednesday, so the figure ends on October 28, the day of the decision. Your own quote can differ, so compare it using the mortgage rates guide." The "so" clause states a date but not what it means for the reader; the packet says the figure "says nothing about lender reaction to the hold", the page does not. FIX: "Freddie Mac builds that average from rates offered Thursday through Wednesday, so the figure ends on October 28, the day of the decision, and cannot show how lenders reacted to it." (derived from F6b; no new fact). After this edit: rebuild, recapture hydrated DOM and snapshot, and I will write rendered-review.json, hidden-cost-analysis-review.json and fed-analysis-review.json and run both audit-analysis commands (no other changes expected; every other check passes).

Round-2 verdict: A1 PASS pending recapture (no change needed in its bytes), A2 FAIL (R2-1 only), A3 PASS. No PASS receipts written because the snapshot must cover the final A2 text.

---

# Round 3 (final): R2-1 verified, receipts written

Startup current (3a75ab9). Snapshot captured 2026-10-29T18:01:53Z, snapshotSha256 f61a63fee4706ef6f222e170dcefa35cb1043a59ca3748e0955f8a14d2abb441; hydrated DOM equals snapshot HTML for all three routes; dist rebuilt 18:00:53 after the 18:00:41 source edit.

- R2-1: FIXED. Rendered text: "Freddie Mac builds that average from rates offered Thursday through Wednesday, so the figure ends on October 28, the day of the decision, and cannot show how lenders reacted to it." Present in src/data/guides.ts, the draft and the snapshot. The paragraph keeps its other sentences, rhythm stays clean (no 10-run in one band, nothing 30 words or more).
- A1 bytes unchanged (fingerprint 14ca208b... as in round 2); A3 fingerprint unchanged.

## Final verdicts
| Route | Verdict |
|---|---|
| A1 /hidden-cost-of-owning-a-home-calculator/ | PASS |
| A2 /guides/fed-rate-hike-savings-investments/ | PASS |
| A3 /rent-vs-buy-calculator/ | PASS (link-only date exception recorded in the rendered review, per coordinator ruling and phase-7 / _rendered-page-audit item 5) |

## Receipts
- audit/rendered-review.json (reviewer phase4-auditor-1): `rendered-audit.py check` passed.
- audit/hidden-cost-analysis-review.json: packetSha256 2dc1b7afe5df2f9867d531e1e24609f3dc4afd495f37dcfb89fe19c0ce979d1d, replaySha256 d56b1b7a35d60fdf6f88d03878c148ef2b321a1f4f65ceff9485e4ab6367a76c; `mindmap-gates.py audit-analysis ... --replay-output` passed.
- audit/fed-analysis-review.json: packetSha256 63cbf682ce09e2c1646ac6fb34bcf8f20a3d8093cb952e9f95c41bebe226f473; `audit-analysis` passed.
- Evidence: audit/hidden-cost-replay.py and hidden-cost-replay.json.
Any later change to src, packets or the snapshot voids these receipts.

Advisory notes from rounds 1 and 2 stand (long paragraphs, $1,380 vs $1,381 display, inherited 0.38 percent / 3.7 percent CPI line in the guide, datePublished equals updated by template, stale 7.32% default on /rent-vs-buy-calculator/, years field clamps 99 to 30).
