---
mindmap_pass_date: 2026-11-25
source: "reports/mindmap-pass/2026-11-25-search-gap-brief.md"
interpreted_brief: "Six keystroke-progression search events from one visitor on /investing/ asking for the difference between a dividend stock and an S&P 500 (index) stock. One reader goal: understand how the two differ and which fits. No existing page compares them (calculator hub, DRIP calculator, S&P 500 calculator, dividend how-to guide and index-fund explainer all answer adjacent goals), so one net-new /compare/ page plus inbound links from the asker's page and its neighbours. Source-only (IRS, SEC Investor.gov, issuer fact page); no testing claims; HIGH review profile (investment)."
status: ready-for-approval
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Direct intent (6 search events from /investing/, one visitor refining one question). Cluster: dividend stock vs S&P 500 index stock; members 'dividend stocks vs s&p 500', 'dividend stock vs index fund', 'are dividend stocks better than index funds', 'do dividend stocks outperform the s&p 500', 'dividend growth stocks vs s&p 500' (autocomplete estimates 250-2,500/mo, source: estimate (autocomplete), NOT measured; SEMRUSH/DataForSEO unavailable). Existing /investing/ is a growth calculator and the dividend guide is a how-to; neither compares the two. lookup: /guides/how-to-build-a-dividend-portfolio - reader goal is building a dividend income portfolio (different goal, no S&P 500 comparison); /investing - calculator, no match. Commits naming the topic: none. | Create /compare/dividend-stocks-vs-sp500 [comparison table/database] opening with the answer that the two are not opposites, then a sourced side-by-side (what it is, income, concentration, taxes, effort, total return), who it fits, who it is not for, what would change the answer. | create new content | /compare/dividend-stocks-vs-sp500 | comparison table/database - vs query with finite sourced dimensions | text + comparison table | text + comparison table | unread (DataForSEO unavailable) | SERP not read: no DataForSEO credentials in the BUILD environment, so no claim about who ranks; autocomplete shows live on-intent completions for the sibling phrases. | What is the difference between a dividend stock and an S&P 500 index stock? [verb-only - no PAA, no completions for the literal phrase; sibling completions 'are dividend stocks better than index funds', 'do dividend stocks outperform the s&p 500' ac 2/10 on-intent] | Verdict and overlap: they are not opposites. A dividend stock is one company chosen because it pays out cash; the S&P 500 is a list of 500 large U.S. companies and an index fund owns all of them, paying a small dividend itself (about 1.17% index yield on 2026-11-23). So the choice is a concentrated high-yield or dividend-growth selection versus owning the whole index; judge both on total return, and pick dividend stocks only for a stated income need. | Section 1 'The Short Answer: They Are Not Opposites' | A1 |
| The asker was on /investing/ (investment calculator) when the search returned zero results, and no page on the site links a dividend-vs-index answer from it; its body already mentions index funds and dividend-paying funds in passing. | Add a natural internal link to /compare/dividend-stocks-vs-sp500 in the 'Investment strategies worth knowing' paragraph of /investing/; the other inbound placements are listed in A1's brief. | add internal links | /investing/ | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | A2 |

## Original request and acceptance

Turn the visitor's repeated zero-result search on /investing/ into a page that actually answers the dividend-stock-vs-S&P-500 question, without a near-duplicate and without filtering any of the six observations.

- **id:** REQ-1
**description:** Account for every one of the six intake candidates (verbatim, unfiltered) with a disposition and reason.
**acceptance:** reports/search-gap/build-decisions-2026-11-25.json has one decision per candidate id with a specific reason; chart exclusions state none were dropped.
**actionIds:** - A1
- A2
- **id:** REQ-2
**description:** Answer 'what is the difference between a dividend stock and an S&P 500 (index) stock' on the site, preferring the page the asker was on if it should have answered, never a near-duplicate.
**acceptance:** A /compare/ page opens with the direct answer in section 1 and has a comparison table, sourced facts, who-this-is-not-for and what-would-change-our-answer; /investing/ links to it; coverage evidence shows no existing page answers it.
**actionIds:** - A1
- A2

### Presentation — A1

**medium:** text + comparison table
**placement:** Direct answer in section 1, comparison table directly after
**reason:** The reader needs the term disambiguated and a side-by-side on finite sourced dimensions; a table lets them compare without interaction.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** The comparison is finite and sourced; an adjustable-input model would need an assumed return for dividend stocks that no saved source supports. Readers who want adjustable numbers are linked to the existing dividend (DRIP) and S&P 500 calculators instead of a new tool.
**animation:** **decision:** not-useful
**reason:** Static scannable layout answers faster without decorative motion

## Emerging search patterns (clusters)

- Dividend stock vs S&P 500 index (theme: dividend stock vs index): 'dividend stocks vs s&p 500'; 'dividend stock vs index fund'; 'are dividend stocks better than index funds'; 'do dividend stocks outperform the s&p 500' | coverage gap at theme level (no page compares them) | create new content | /compare/dividend-stocks-vs-sp500 | comparison table/database | text + comparison table | SERP unread. Sibling variants not turned into pages: 'dividend stock vs etf' (est. 500-5,000/mo, same reader goal, covered by A1's ETF/fund framing and /compare/index-fund-vs-etf/ link).

## Exclusions

- No candidate dropped: all six intake events are keystroke variants of one question and are answered by A1 (see reports/search-gap/build-decisions-2026-11-25.json).
- Not enriching /investing/ with a comparison section: it is a calculator page; the answer lives on a /compare/ page (sibling: target-date-fund-vs-sp500) and /investing/ links to it (A2).
- Not enriching /guides/how-to-build-a-dividend-portfolio/: its reader goal is how to build a dividend portfolio, not which approach to pick; it receives an inbound link only.
- Separate 'dividend stock vs etf', 'high dividend yield vs s&p 500' and dividend ETF picks pages: same reader goal or served by /roundup/best-dividend-etfs/; no second URL for the same intent.
- Claims not supportable from saved primary sources and excluded from the brief: share of S&P 500 companies that pay dividends, Dividend Aristocrat rules, any historical dividend-stock vs S&P 500 return comparison (S&P DJI pages returned 403 and no sourced dataset was captured). WRITE must not state them.
- TESTED/howWeTested presentation OFF (financial topic, no executed runs); no 'we tested' wording.

## New-page briefs

### A1 — /compare/dividend-stocks-vs-sp500

**Identity**

**title:** Dividend Stocks vs. S&P 500 Index Fund: Compared
**pageType:** comparison
**format:** comparison table/database - vs query with finite sourced dimensions
**medium:** text + comparison table
**plannedMetadata:** **metaTitle:** Dividend Stocks vs. S&P 500 Index Fund: Compared (<=60 chars)
**metaDescription:** Dividend stocks vs. an S&P 500 index fund: how they overlap, how each pays you, and which fits an income goal or long-term growth.

**Reader and answer**

**question:** What is the difference between a dividend stock and an S&P 500 index stock? [verb-only - no PAA, no completions for the literal phrase; sibling completions 'are dividend stocks better than index funds', 'do dividend stocks outperform the s&p 500' ac 2/10 on-intent]
**answer:** Verdict and overlap: they are not opposites. A dividend stock is one company chosen because it pays out cash; the S&P 500 is a list of 500 large U.S. companies and an index fund owns all of them, paying a small dividend itself (about 1.17% index yield on 2026-11-23). So the choice is a concentrated high-yield or dividend-growth selection versus owning the whole index; judge both on total return, and pick dividend stocks only for a stated income need.
**placement:** Section 1 'The Short Answer: They Are Not Opposites'

**Keyword evidence**

Primary: 'dividend stocks vs s&p 500' (est. 250-2,500/mo). Supporting: 'dividend stock vs index fund' (est. 250-2,500/mo), 'dividend stock vs etf' (est. 500-5,000/mo), 'are dividend stocks better than index funds', 'do dividend stocks outperform the s&p 500'. Literal visitor phrase 'difference between dividend stock and s&p 500 stock' 0-25/mo (no completions). Provider: Google Autocomplete band only (SEMRUSH key absent, DataForSEO off), source: estimate (autocomplete), NOT measured; us; checked 2026-11-25; raw research/keyword-volumes.json. Six real visitor events count as demand.

**SERP and questions**

SERP unread (no DataForSEO credentials), so no claim about competing pages. Question evidence = autocomplete only (research/autocomplete.dividend-vs-sp500.csv, 192 suggestions): on-intent 'are dividend stocks better than index funds', 'do dividend stocks outperform the s&p 500', 'dividend growth stocks vs s&p 500', 'high dividend yield vs s&p 500', 'dividend stocks or s&p 500'. FAQ spec: those on-intent questions (tidied), plus 'Are S&P 500 index funds dividend stocks?' and 'Are dividends taxed differently in an index fund?' derived from the IRS source. No PAA available; labelled.

**Why a new page**

Strongest existing matches: /guides/how-to-build-a-dividend-portfolio (goal: build a dividend income portfolio; Step 5 says fund route, 'part most guides leave out' says judge on total return; no S&P 500 comparison), /investing (growth calculator), /investing/dividend-calculator and /investing/sp500-calculator (DRIP and index return projections), /guides/what-is-an-index-fund (definition), /roundup/best-dividend-etfs (fund picks), /compare/target-date-fund-vs-sp500, /compare/index-fund-vs-etf, /compare/stocks-vs-bonds (different pairs). None answers 'how does a dividend stock differ from an S&P 500 stock and which fits'. Checked commits: git log shows no prior commits creating a dividend-vs-S&P page and coverage_lookup reports none naming the topic. Independent duplicate review is the CHART-REVIEW decision; reclassify to enrich of the dividend guide only if the reviewer judges that the right home.

**Planned outline**

- **heading:** The Short Answer: They Are Not Opposites
**purpose:** Section 1 delivers the working answer: dividend stock = a company chosen for its payout; S&P 500 = a 500-company index an index fund owns whole and which also pays a dividend (index yield 1.17% at 2026-11-23, SSGA page); the real choice is a hand-picked income set vs the whole index; judge on total return. Disambiguate 'S&P index stock' (a member company vs an index fund).
- **heading:** Dividend Stocks vs. S&P 500 Index Fund Side by Side
**purpose:** Comparison table: what you own, how you are paid, concentration, effort, cost, taxes (IRS Topic 404: funds pass dividends through; qualified vs ordinary), what a payout does to price (Investor.gov ex-dividend).
- **heading:** Yield Is Not Total Return
**purpose:** Explain price drop on ex-dividend date (SEC) and total return = price change plus dividends; no invented return comparison.
- **heading:** How Each One Is Taxed
**purpose:** IRS Topic 404 / 409: ordinary vs qualified, 0/15/20% long-term rates (thresholds labelled tax year 2025), Form 1099-DIV, Schedule B above $1,500, fund capital gain distributions; same dividend tax rules apply to both.
- **heading:** Who Each Approach Fits
**purpose:** Income-need and tolerance cases: dividend stocks for a stated income need with tolerance for concentration and cuts; the index fund for default long-term growth with automatic breadth; combining both.
- **heading:** Who This Is Not For and What Would Change Our Answer
**purpose:** Not for traders, readers wanting a stock tip or a return forecast; conditions that reverse the verdict (need for current cash flow, tax-advantaged vs taxable account, high-yield payout cut risk, fund yield changes).
- **heading:** Our Takeaway
**purpose:** Conditional conclusion: for most long-term savers the index fund is the sensible default and dividend stocks are a deliberate income choice; next action = check the fund's current yield and holdings and size any dividend position; link to calculators.
- **heading:** FAQ
**purpose:** Sentence-case questions from autocomplete and sources: Are S&P 500 index funds dividend stocks? Are dividend stocks better than index funds? Do dividend stocks outperform the S&P 500? Are dividends taxed differently in an index fund? Can I live off an S&P 500 fund?

**Contribution and evidence**

Decision gap: the reader cannot tell that 'dividend stock' and 'S&P 500 stock' are different kinds of category (a payout feature vs index membership/fund) and that the S&P 500 fund already pays a dividend. Basis: reported (no internal test, no model); whyNoQuantitativeAnalysis: any return projection would be arbitrary arithmetic and no sourced return series was captured. Original contribution = disambiguation and decision rules grounded in sources. Sources and check dates (all saved in research/sources, retrieved 2026-11-25): IRS Topic 404 https://www.irs.gov/taxtopics/tc404 ; IRS Topic 409 https://www.irs.gov/taxtopics/tc409 ; SEC Investor.gov dividend https://www.investor.gov/introduction-investing/investing-basics/glossary/dividend ; ex-dividend https://www.investor.gov/introduction-investing/investing-basics/glossary/ex-dividend-dates-when-are-you-entitled-stock-and ; index fund https://www.investor.gov/introduction-investing/investing-basics/glossary/index-fund ; SPDR S&P 500 ETF page https://www.ssga.com/us/en/intermediary/etfs/state-street-spdr-sp-500-etf-trust-spy (index dividend yield 1.17% as of Nov 23 2026, expense ratio 0.0945%). Counterexample tested: an income-seeking retiree may reasonably prefer dividend payers; the page states that and the ex-dividend caveat. cases-batch retrieval saved under evidence/. Page must name these sources visibly at first use.

**Tables, tools or visuals**

Comparison table (finite, sourced): dimension | Dividend stock(s) | S&P 500 index fund; rows: what you own; how you get paid (dividend yield example sourced to the issuer page, labelled as an example and dated); concentration/diversification; effort; cost (fund expense ratio example 0.0945% issuer-sourced; individual stocks have none); tax treatment (IRS); effect of payout on price (SEC). No new calculator: link the existing DRIP and S&P 500 calculators (interaction: reuse). No chart; no screenshots.

**Testing and review**

TESTED off: financial topic, section G does not license testing and no executed runs exist; no 'we tested', no howWeTested, no Tested YYYY title/byline/schema. Reported-basis attribution names IRS, SEC Investor.gov and the issuer page. Review profile HIGH (investment comparison on a finance site; two independent content audits max; no genuine medical/legal claim so no third). Author = site default ModernWallet Research Desk; reviewer note via register-reviewer-note in WRITE (grounded in reviewer-voice-profile.json). Standard educational disclaimer at the bottom only. No professionalReviewRequired flag; no liabilityBlock candidate.

**Planned takeaway**

For most long-term savers the S&P 500 index fund is the default because it already owns the dividend payers inside the index along with the rest of the market; dividend stocks fit a reader with a stated cash-income need, tolerance for concentration and cut risk, and a willingness to judge holdings on total return. Applies to individual U.S. investors choosing between the two approaches; basis: reported sources. Would change if the reader needs current income without selling shares, holds the position in a taxable vs tax-advantaged account, a company cuts its payout, or the index yield changes materially.

**Inbound internal links**

**required:** 3
**placements:** - **source:** /investing/
**target:** /compare/dividend-stocks-vs-sp500
**section:** Investment strategies worth knowing
**anchor:** dividend stocks vs. an S&P 500 index fund
**purpose:** Sends the asker's own page to the answer to the question they searched
**inspection:** **path:** src/data/calculators.ts
**sha256:** 913a5b5c26291a8f83382f6830602104ee4bac2b996223a465fd435c8be2c4f1
- **source:** /guides/how-to-build-a-dividend-portfolio/
**target:** /compare/dividend-stocks-vs-sp500
**section:** The part most dividend guides leave out
**anchor:** how dividend stocks compare with an S&P 500 index fund
**purpose:** Next step for a reader weighing a dividend portfolio against the index
**inspection:** **path:** src/data/guides.ts
**sha256:** 8e6d4874ae5556b900f3ce3f40c9703171de0545606d70f3a6090a6b653f1bf2
- **source:** /investing/sp500-calculator/
**target:** /compare/dividend-stocks-vs-sp500
**section:** FAQ / How it works
**anchor:** dividend stocks vs. the S&P 500
**purpose:** Reader who modelled index returns asks whether dividend stocks do better
**inspection:** **path:** src/data/spokes-investing.ts
**sha256:** 45be9a10603e41ee82cbe0ca272985c15bceae83136261a3fec91f5dc0bd3641
- **source:** /investing/dividend-calculator/
**target:** /compare/dividend-stocks-vs-sp500
**section:** Common mistakes
**anchor:** compared with an S&P 500 index fund
**purpose:** Reader modelling DRIP may be choosing between dividend stocks and the index
**inspection:** **path:** src/data/spokes-investing.ts
**sha256:** 45be9a10603e41ee82cbe0ca272985c15bceae83136261a3fec91f5dc0bd3641

**Outbound internal links**

**placements:** - **source:** /compare/dividend-stocks-vs-sp500
**target:** /investing/dividend-calculator/
**section:** Who each approach fits
**anchor:** dividend reinvestment calculator
**purpose:** Model reinvested dividends
**inspection:** **path:** src/data/spokes-investing.ts
**sha256:** 45be9a10603e41ee82cbe0ca272985c15bceae83136261a3fec91f5dc0bd3641
- **source:** /compare/dividend-stocks-vs-sp500
**target:** /investing/sp500-calculator/
**section:** Who each approach fits
**anchor:** S&P 500 calculator
**purpose:** Model index growth
**inspection:** **path:** src/data/spokes-investing.ts
**sha256:** 45be9a10603e41ee82cbe0ca272985c15bceae83136261a3fec91f5dc0bd3641
- **source:** /compare/dividend-stocks-vs-sp500
**target:** /guides/how-to-build-a-dividend-portfolio/
**section:** Who each approach fits
**anchor:** how to build a dividend portfolio
**purpose:** Next step if choosing dividend stocks
**inspection:** **path:** src/data/guides.ts
**sha256:** 8e6d4874ae5556b900f3ce3f40c9703171de0545606d70f3a6090a6b653f1bf2
- **source:** /compare/dividend-stocks-vs-sp500
**target:** /guides/what-is-an-index-fund/
**section:** The short answer
**anchor:** what an index fund is
**purpose:** Definition for readers new to index funds
**inspection:** **path:** src/data/guides.ts
**sha256:** 8e6d4874ae5556b900f3ce3f40c9703171de0545606d70f3a6090a6b653f1bf2
- **source:** /compare/dividend-stocks-vs-sp500
**target:** /compare/index-fund-vs-etf/
**section:** Side by side
**anchor:** index fund vs ETF
**purpose:** Wrapper question that follows
**inspection:** **path:** src/data/comparisons.ts
**sha256:** fbdf4fc22c902d09c66f19220d4ec5bd145df5e0e95844c604b5b9c07dd67460
- **source:** /compare/dividend-stocks-vs-sp500
**target:** /roundup/best-dividend-etfs/
**section:** Who each approach fits
**anchor:** best dividend ETFs
**purpose:** Fund route for income seekers
**inspection:** **path:** src/data/roundups.ts
**sha256:** ff65f6a76626b15c448b96c94f6d096ed4c577f757a7623ed17ee4b75fcef88f

**Technical and measurement scope**

New entry in src/data/comparisons.ts mirroring target-date-fund-vs-sp500 (slug dividend-stocks-vs-sp500, optionA 'Dividend Stocks', optionB 'S&P 500 Index Fund', sources[], relatedComparisons, calculatorLinks); the compare template emits canonical, schema and sitemap entry; search-index.json picked up at build; IndexNow after live 200. updatedDate set to today on the new entry only; existing pages edited for links only keep their dates and sitemap lastmod. Measurement: growth.json hypothesis = captures the 'dividend stocks vs s&p 500' query family; baseline not-yet-published; GSC comparator unavailable in this environment (recorded unavailable, not zero); no uplift claimed. Day-28/56 review windows.

## Execution plan

1. Record advisory cannibalization check (no destructive merges).
2. Apply any approved metadata updates (or N/A when none in chart).
3. Generate net-new approved routes with verified evidence packets.
4. Run independent Phase 4 rendered-page audit on all changed routes.
5. Apply any approved existing-page body enrichments (or N/A when none).
6. Add approved inbound and outbound internal links across inspected routes.
7. Update sitemaps and prepare IndexNow URL list without pre-deploy ping.
8. Compile Phase 8 execution and cluster summary.
9. Commit, deploy to main, verify HTTP 200 live renders, and submit IndexNow.

Publication scope: commit: True, push: True, liveVerification: True, indexNow: True

## Preparation check

| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-25-search-gap-run/readiness.md) |

Approve this plan to start the listed content work?
