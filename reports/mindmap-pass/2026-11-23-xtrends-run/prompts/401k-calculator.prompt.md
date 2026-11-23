# Approved Page Assignment: `/retirement/401k-calculator/` (`401k-calculator`)
- **Action ID:** `A1` (update existing body text)
- **Title:** Add a market-drop section to /retirement/401k-calculator/ (existing spoke 401k-calculator in src/data/spokes-retirement.ts): drop/recovery table at 10/20/30% plus FINRA-sourced process guidance; link to portfolio rebalancing calculator.
- **Page Type / Format / Medium:** guide | article section with comparison table - finite scenarios | text + comparison table
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What does a 10% to 20% market drop do to my 401(k), and should I sell? [verb-only - no PAA read; ac: 'should i sell my 401k now' completion]
- **Working Answer (Col 11):** A 10-20% drop leaves 90-80% of the balance and needs an 11.11-25.00% gain to recover; FINRA's turbulent-market guidance stresses goals, diversification and avoiding impulsive moves, and the sell-or-hold choice depends on time horizon, which the page cannot judge (shape: verdict with condition).
- **Answer Placement (Col 12):** section 1: the added 'What a Market Drop Does to Your 401(k) Balance' block placed ahead of existing explanatory sections

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent + news-driven (brief bullet 1; X posts about 401(k) drops rose after the Nov 20 market close, per brief, unverified). Autocomplete (estimate, NOT measured, no provider keys): 'should i sell my 401k now', 'should i sell my 401k stocks now', '401k down 10' 66 completions. lookup: no exact page; nearest /retirement/401k-calculator/ (growth projection, no drawdown section) and /portfolio-rebalancing-calculator/ (separate rebalancing intent). Commits naming topic: none.
- **Keyword Evidence:** "SERP not read: DataForSEO credentials unavailable in this run; demand is autocomplete estimate only."
- **Why New Page / Angle:** Add a market-drop section to /retirement/401k-calculator/ (existing spoke 401k-calculator in src/data/spokes-retirement.ts): drop/recovery table at 10/20/30% plus FINRA-sourced process guidance; link to portfolio rebalancing calculator.
- **Intent-Based Our Takeaway:** ""

## Reviewer Guardrails (Must Respect)
- F1: Saved research/sources/*.txt for FINRA, CRS and govinfo are WebFetch summaries, not verbatim page text, contrary to the Full-Verbatim capture rule. I re-fetched all three and the quoted facts hold.
- F2: Current legislative status of S.381 and H.R.1944 is not primary-verified past CRS 2026-03-10 and govinfo as-introduced; H.R.1944 sponsor is secondary only; Trump remark is excluded.
- F3: Calculated results need conditions stated beside them: $57.53 is one 30-day cycle of simple interest on a flat $5,000, 365-day basis, assuming the card stays available at 10% with no new fees; the drop table uses a hypothetical $100,000 balance and symmetric arithmetic ignoring ongoing contributions and time to recover.
- F4: 401(k) takeaway must not become personal sell/hold advice or attribute 'selling locks in losses' or rebalancing rules to FINRA (the page does not say that).
- F5: Raw autocomplete output behind the demand claims (66 and 31 completions) was not saved in the run directory, and no provider volume or SERP/PAA was read (no keys), so reader_question tags are verb-only.
- F6: Rendered-page checks: inherited text on both calculator pages (e.g. the credit card page FAQ on no grace period, any 'tested' bylines) must stay consistent with the new sections; sitemap lastmod, dateModified and the 'updated' field bump are required.

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"calculated"`: include honest visible internal calculation/modeling attribution matching `execution` output with explicit visible assumptions + counterexample (never claim hands-on product testing or `(Tested YYYY)` unless `basis` is `"measured"` with executed `runs:[{testedAt}]`).
```json
{
  "gateSchemaVersion": 1,
  "author": "writer-xtrends",
  "route": "/retirement/401k-calculator/",
  "readerQuestion": "What does a 10% to 20% market drop do to my 401(k), and should I sell? [verb-only - no PAA read; ac: 'should i sell my 401k now' completion]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/approval-manifest.json",
      "sha256": "02c32814e11e646262f0ead0c37b0c69c7ae9173aa85f04a8c83cfa20c6610b8"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/chart-review.json",
      "sha256": "3e0acbe97d69445d7dc37879c46749b029d291441e0fd8d496f75736e894c9fa"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "Added block in the first two sections of the calculator page, before existing how-it-works prose",
    "reason": "A finite set of drop sizes answers the question; the existing calculator lets the reader enter their own balance",
    "readerInputs": [
      "Starting balance (existing calculator)",
      "Drop size (table rows 10/20/30%)"
    ],
    "interaction": {
      "decision": "not-useful",
      "reason": "The page's existing calculator already takes the reader's own balance/APR; the added static table covers the finite scenarios and a second tool would duplicate it"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "A three-row table is clearer without motion"
    }
  },
  "basis": "calculated",
  "decisionGap": "The existing 401k calculator page projects growth but never shows a reader what a 10% to 30% market drop does to a balance, how large a rebound is needed, or what a regulator's investor-education page says about acting during turbulence. The reader typing 'should i sell my 401k now' has no on-page answer.",
  "finding": "On a hypothetical $100,000 balance a 10%, 20% and 30% drop leaves $90,000, $80,000 and $70,000 and needs gains of 11.11%, 25.00% and 42.86% to get back to $100,000. At a constant 7% yearly return with no contributions that takes about 1.6, 3.3 and 5.3 years. FINRA's turbulent-market tips tie decisions to goals and a long-term plan, diversification, avoiding impulsive moves and dollar-cost averaging. Whether to sell depends on the reader's time horizon and goals, which the page cannot judge.",
  "conditions": "Hypothetical $100,000 balance. Symmetric percentage arithmetic. Years-to-recover assumes a constant 7% annual return (the calculator preset) and ignores contributions, fees, taxes and inflation. Real returns vary year to year. Not personalized advice.",
  "whatWouldChange": "A short time horizon (retiring or withdrawing within a few years), a goal change, a concentrated holding, or ongoing contributions that buy at lower prices each change the sell-or-hold answer; the arithmetic itself does not change.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/401k-calculator/cases.json",
    "sha256": "e3f73b4b4e946c8124d2022a3bfd77d6be980733ad1bae37636d9ee301907496"
  },
  "caseDecisions": "cases.json holds only Layer3Labs client and law-firm records. None concern retirement accounts or this site, so no client or conversation claim is used. No reader-survey records exist for this site.",
  "sourceArtifacts": [
    {
      "path": "reports/x-trends/2026-11-23.md",
      "sha256": "bcde17e2bb1f25c632a646338396796729541cdde9032d79d239da7911d7f963"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/research/coverage-lookup.txt",
      "sha256": "a210c69def93fcff21504ac54e808747ea9748f8d35e24d9bd21fe368ec55e62"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/calc.py",
      "sha256": "4931614599dc7abf43967c49287952a6e33fa0f1f1cc65489e188eb8bd569403"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/calc-output.json",
      "sha256": "40d2c4d3db0bf14ca34cd72138f9ba8577dbfb5e8438218cdc0fb0e85abe0131"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/crs-if12861-credit-card-rate-caps.txt",
      "sha256": "4ba1b3cb9fe73afe549d711ec4e85de1566c302793f862a373f9b5be32d2ca49"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/dol-esg-duty-of-loyalty-UNVERIFIED.txt",
      "sha256": "f4884e57506f41a98d5e35aeeab847a8b68206c1a57f900f2e602a9d2db3e3be"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/finra-tips-turbulent-market.txt",
      "sha256": "292bbb21a1f06b00359a8c85bd67a0826f15660fd006c60fdc57f4ea9a9108d1"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/govinfo-s381-introduced.txt",
      "sha256": "97b60d74d12fdaaa7ffe8932a3ecc8e7336b53c0b2d2017b7353e5ad6c307aab"
    },
    {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/playstation-store-cancellation-policy.txt",
      "sha256": "12dfa8aa422469c2521f8a823e77d9510111c7ac63944e8b6830187563c727d3"
    }
  ],
  "method": "Exact decimal arithmetic in model.py: balance_after = start x (1 - d); gain_needed = d / (1 - d); years = ln(1 / (1 - d)) / ln(1 + r) with r = 7%. Output saved to output.json.",
  "units": "USD, percent, years",
  "limitations": "Single hypothetical balance, constant return, no contributions, fees, taxes, inflation or sequence-of-returns effects. Says nothing about any individual's account or the right action for them.",
  "counterexample": "A saver who must withdraw within one or two years cannot wait 3.3 years for a 20% drop to recover at 7%, so a 'wait it out' reading fails for them. A saver still contributing buys more shares at lower prices, which shortens recovery. Either case reverses a simple wait-or-sell rule.",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/401k-calculator/model.py"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/401k-calculator/model.py",
      "sha256": "237463430e75dfd09c4138cd23b56a50ccd157a27cde0b884618052dae4b7403"
    },
    "inputs": [
      {
        "path": "reports/x-trends/2026-11-23.md",
        "sha256": "bcde17e2bb1f25c632a646338396796729541cdde9032d79d239da7911d7f963"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/401k-calculator/output.json",
      "sha256": "d143ccf17fc8be6e90067bc46ab6f4850bfabf04ac91203ffacbed5091361151"
    }
  },
  "sources": [
    {
      "label": "FINRA, Investor Tips for Turbulent Markets",
      "url": "https://www.finra.org/investors/insights/tips-turbulent-market",
      "checked": "2026-11-23"
    }
  ],
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "evidence/401k-calculator/model.py",
      "evidence/401k-calculator/output.json"
    ],
    "scopeAndLimits": "Calculated from a hypothetical $100,000 balance; FINRA guidance is reported evidence, attributed to FINRA only for goals, diversification, avoiding impulsive moves and dollar-cost averaging.",
    "publicMethod": "On-page table with the stated hypothetical balance and formula note beside it",
    "placement": "Added section 1 'What a Market Drop Does to Your 401(k) Balance', directly under the calculator"
  },
  "takeaway": {
    "conclusion": "A 10% to 20% drop is recoverable arithmetically but needs an 11.11% to 25.00% gain; whether to sell turns on time horizon and goals. FINRA's process points favor a plan over a reaction.",
    "appliesTo": "401(k) savers deciding during a drop; not personalized advice",
    "basis": "calculated table plus FINRA reported guidance",
    "conditionThatChangesIt": "A withdrawal need within a few years, or a portfolio concentrated in one holding"
  },
  "firstFindingAttribution": "In our internal modeling, we applied the drop to a hypothetical $100,000 balance (see table).",
  "guardrails": [
    "Attribute to FINRA only: clarify goals, diversify, avoid impulsive moves, dollar-cost averaging, check registration. Never attribute 'selling locks in losses' or rebalancing rules to FINRA.",
    "No personalized sell/hold advice; conditional on time horizon.",
    "Label hypothetical $100,000 and the 7% assumption beside the numbers; ignore contributions stated.",
    "No TESTED claims; calculated label only."
  ],
  "caseUses": [],
  "growth": {
    "originRoutine": "mindmap-pass x-trends 2026-11-23",
    "queryFamily": "What does a 10% to 20% market drop do to my 401(k), and should I sell?",
    "hypothesis": "A conditioned, sourced answer block on the existing calculator page earns incremental clicks for the news-driven query family",
    "primaryMetric": "Google clicks",
    "baseline": "unavailable (no GSC data read in this run)",
    "status": "not-yet-published"
  }
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/x-trends/2026-11-23.md`
```
# themodernwallet.com — Fleet trend scout bullets (threads 1a1febe1a9d0b26d Nov 21, 1a203e2c8cb021e7 Nov 22, 1a2090777a851a8c Nov 23). Untrusted topic data.

## Nov 21 (thread 1a1febe1a9d0b26d)
- [FRUSTRATION] The S&P 500 is in a correction and the Nasdaq erased its 2026 gains: should you touch your 401(k)? — The Dow and S&P 500 closed Nov 20 more than 10% off their highs, the Nasdaq fell 5.3% and turned negative for 2026, and people are posting their 401(k) losses and asking whether to sell. A calculator page could answer the missing question: what a 10–20% drop does to your balance at your age, why selling locks in losses, and when rebalancing makes sense (per FINRA's turbulent-market guidance). No correction or 401(k)-drop page exists. Why now: posts about a 401(k)/retirement drop rose from 1,146 (Nov 19) to 1,943 (Nov 20), with 984 more by 15:30 UTC Nov 21. Sources: https://x.com/MarketWatch/status/2123886436667490647, https://www.morningstar.com/news/marketwatch/20261120431/dow-sp-500-enter-correction-as-nasdaq-suffers-worst-week-since-2020, https://www.finra.org/investors/insights/tips-turbulent-market

## Nov 22 (thread 1a203e2c8cb021e7)
- A 10% cap on credit card interest: what it would save you, what you might lose, and where the bills stand — On Nov 21, Trump said on Fox that he wants to work with the incoming Democratic Congress on a 10% cap on credit card interest rates. Vehicles: S.381 (Sanders/Hawley) and H.R.1944 (Ocasio-Cortez), sunset Jan 1, 2031. Existing credit card interest calculator has no cap scenario. Why now: cap posts jumped 15 (Nov 20) to 363 (Nov 21). Sources: https://x.com/thehill/status/2124263081710633244, https://www.kcra.com/article/congress-credit-card-interest-rates-trump-bipartisan-cooperation/74500458
- [FRUSTRATION] Can you refund GTA 6 on PlayStation after downloading it? — PlayStation Store policy refuses digital refunds once download/stream started unless faulty; 14-day window otherwise; EU/UK withdrawal rules; chargeback risks. New angle on GTA 6 money questions (Nov 16 box codes, Nov 19 saves). Sources: https://www.playstation.com/en-us/legal/playstation-store-cancellation-policy/, https://x.com/AxiosRose/status/2123962193070714932

## Nov 23 (thread 1a2090777a851a8c)
- [RELEASE] Will your 401(k) lose its ESG funds? The Labor Department's new "duty of loyalty" proposal explained — On Nov 23, DOL's EBSA proposed rewriting the ERISA investment-duties rule: fiduciaries select investments/vote proxies "solely" on financial factors, ESG/DEI terminology removed, tiebreaker test and participant-preference rule go. Publishes in Federal Register Nov 24, comments due 60 days later. Site's fiduciary page covers advisers, not ERISA plans. Sources: https://x.com/USDOL/status/2124878226652553474, https://www.nationaldossier.com/labor-department-proposes-fiduciary-rule-134555/, https://news.bloomberglaw.com/employee-benefits/401k-esg-investing-proposed-rule-issued-by-us-labor-department

```
### `reports/mindmap-pass/2026-11-23-xtrends-run/research/coverage-lookup.txt`
```
coverage_lookup: 4 candidate(s) vs 878 repo pages / 894 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1258 past-chart lines

### /calculators/401k-market-drop-calculator  — row - · create new content
keyword: 401k correction calculator; should i sell my 401k in a correction; 401k down 10%
reader question (new page intent): How much does a 10-20% market drop reduce my 401(k) and should I sell?
lookup terms: 401k market drop correction sell down v10   format cues: calculator

Possible existing homes: none found in the repo page data, the search index or the sitemaps.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-11-10-search-gap.md [table] | Lens 1 direct intent (visitor searches on /, 2026-11-09 19:20 UTC: 'differences between simple ira and' then 'differences between simple ira and 401k', same session). Autocomplete (9/9 question completions, not measure
- 2026-11-13-trend-lane-c.md [exclusions] - roth or regular 401k: DROP, exists (/compare/roth-401k-vs-traditional-401k, /roth-vs-traditional-401k-calculator, /compare/401k-vs-roth-ira); wording-only gap.
- 2026-11-13-trend-lane-c.md [exclusions] - what is tax-deferred growth: DROP, 10/mo KD37, too thin; calculator FAQs answer it.
- 2026-11-15-trend-lane-c.md [exclusions] - solo 401k loan calculator: DROP, exists; /retirement/401k-loan-calculator/ has a solo section and FAQ on the same engine; dedicated slug solo-401k-loan-calculator would near-duplicate a 20/mo intent.
- 2026-11-15-trend-lane-c.md [exclusions] - 401k contribution roth vs traditional / roth or regular 401k: DROP, exist (/compare/roth-401k-vs-traditional-401k, /roth-vs-traditional-401k-calculator, /compare/401k-vs-roth-ira).
- 2026-11-23-comparison.md [exclusions] - Candidate 4 money market fund vs money market account (880/mo KD 14): DROP duplicate; /compare/money-market-account-vs-money-market-fund exists.
Commits naming the topic: none
Same run overlap: none

### /calculators/credit-card-interest-calculator  — row - · create new content
keyword: 10% credit card interest cap; credit card interest rate cap 10%
reader question (new page intent): What would a 10% credit card APR cap save me?
lookup terms: credit card interest v10 cap rate   format cues: calculator

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /credit-card-interest-calculator  [EXACT SLUG · in sitemap · (sitemap only) · title fetched live · topic match 0.5 on credit card interest · same format: calculator]
    title: Credit Card Interest Calculator: Monthly Interest Cost
    desc:  Free credit card interest calculator. See one billing cycle

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-11-15-keyword-gap.md [exclusions] - Insurance (car, home, health, life, renters, travel, disability), credit cards, rates, Social Security, celebrity net worth, brand-navigational queries: adjacent-not-pursued or covered-partial per ledger; high KD, per-
- 2026-11-16-comparison.md [table] | lookup: /roundup/best-cash-back-credit-cards - many-card list, not this pairing. Lens 1 direct intent (brief candidate 8). "chase freedom flex vs unlimited" 720/mo KD 36 SEMRUSH; no head-to-head page; SERP winnable. | 
- 2026-11-16-xtrends.md [table] | Inbound path: /retirement/401k-calculator/ shows contribution rates but not the 2027 cap IRS announced Nov 12 2
```
### `reports/mindmap-pass/2026-11-23-xtrends-run/evidence/calc.py`
```
import json
from decimal import Decimal as D, ROUND_HALF_UP
q=lambda x: str(D(x).quantize(D("0.01"),ROUND_HALF_UP))
out={"inputs":{"hypothetical_balance":100000,"drops_pct":[10,20,30],"cc_balance":5000,"cc_apr_pct":[24,10],"cycle_days":30,"year_days":365}}
rows=[]
for d in (10,20,30):
    bal=D(100000)*(100-d)/100
    rows.append({"drop_pct":d,"balance_after":q(bal),"gain_needed_to_recover_pct":q(D(d)/(100-d)*100)})
out["drop_table"]=rows
cc=[]
for a in (24,10):
    cc.append({"apr_pct":a,"cycle_interest":q(D(5000)*a/100/365*30),"flat_year_simple_interest":q(D(5000)*a/100)})
out["cc_table"]=cc
out["cc_cycle_saving"]=q(D(cc[0]["cycle_interest"])-D(cc[1]["cycle_interest"]))
out["cc_year_saving_flat"]=q(D(cc[0]["flat_year_simple_interest"])-D(cc[1]["flat_year_simple_interest"]))
json.dump(out,open("evidence/calc-output.json","w"),indent=1)
print(json.dumps(out))

```
### `reports/mindmap-pass/2026-11-23-xtrends-run/evidence/calc-output.json`
```
{
 "inputs": {
  "hypothetical_balance": 100000,
  "drops_pct": [
   10,
   20,
   30
  ],
  "cc_balance": 5000,
  "cc_apr_pct": [
   24,
   10
  ],
  "cycle_days": 30,
  "year_days": 365
 },
 "drop_table": [
  {
   "drop_pct": 10,
   "balance_after": "90000.00",
   "gain_needed_to_recover_pct": "11.11"
  },
  {
   "drop_pct": 20,
   "balance_after": "80000.00",
   "gain_needed_to_recover_pct": "25.00"
  },
  {
   "drop_pct": 30,
   "balance_after": "70000.00",
   "gain_needed_to_recover_pct": "42.86"
  }
 ],
 "cc_table": [
  {
   "apr_pct": 24,
   "cycle_interest": "98.63",
   "flat_year_simple_interest": "1200.00"
  },
  {
   "apr_pct": 10,
   "cycle_interest": "41.10",
   "flat_year_simple_interest": "500.00"
  }
 ],
 "cc_cycle_saving": "57.53",
 "cc_year_saving_flat": "700.00"
}
```
### `reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/crs-if12861-credit-card-rate-caps.txt`
```
URL: https://www.everycrsreport.com/reports/IF12861.html (CRS In Focus IF12861, current version dated 2026-03-10 per everycrsreport change log)
Retrieved: 2026-11-23T16:51:56Z (WebFetch summary, not verbatim)
Bills "would cap credit card annual percentage rates (APRs) at 10% until January 2031 (S. 381, H.R. 1944)"; apply generally to consumer cards, generally not business credit. Tradeoffs: "imposing a cap could affect access to credit from traditional sources"; "banks may also choose to limit credit products or add auxiliary fees"; borrowers may shift to higher-APR sources outside banking; some economists say reduced availability could benefit some consumers; a Vanderbilt Policy Accelerator paper argues 10-15% caps would not reduce access, contrary to most literature.

```
### `reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/dol-esg-duty-of-loyalty-UNVERIFIED.txt`
```
Retrieved: 2026-11-23T16:51:56Z
RESULT: NO primary source retrievable for the claimed Nov 23 2026 EBSA "duty of loyalty" proposal. dol.gov newsroom HTTP 403; Federal Register publication not before Nov 24 per brief; X post and secondary links not fetched/verified. Web search found only: (a) EBSA Mar 31 2026 proposed rule "Fiduciary Duties in Selecting Designated Investment Alternatives", 91 FR 16088, doc 2026-06178 (comments closed Jun 1 2026) - a different rule; (b) 2021/2022 ESG rule history; (c) a Minerva item that a "Prudence and Loyalty" proposal went to OIRA (secondary, status unclear). Disposition: DEFER pending Federal Register text.

```
### `reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/finra-tips-turbulent-market.txt`
```
URL: https://www.finra.org/investors/insights/tips-turbulent-market
Retrieved: 2026-11-23T16:51:56Z (WebFetch; tool returned a SUMMARY, not verbatim page text - fetch tool limitation, recorded honestly)
Title: Investor Tips for Turbulent Markets
Five tips: (1) Clarify your financial goals (prioritized goals with cost, time frame, steps; tied to long-term plan). (2) Diversify your assets (avoid too much in one investment/asset class/sector; spread across stocks, bonds, cash and within each). (3) Focus on your future: avoid impulsive moves in volatile markets; dollar-cost averaging can reduce emotional decision-making. (4) Understand changing interest rates (bond prices generally fall when rates rise; duration). (5) Protect your money (scammers pitch risk-free returns in volatile periods; check registration with FINRA BrokerCheck). Closing: you cannot control market swings; focus on asset allocation and diversification.
NOTE: page does NOT (per this extract) say "selling locks in losses" or give rebalancing rules; do not attribute those phrases to FINRA.

```
### `reports/mindmap-pass/2026-11-23-xtrends-run/research/sources/govinfo-s381-introduced.txt`
```
URL: https://www.govinfo.gov/content/pkg/BILLS-119s381is/html/BILLS-119s381is.htm
Retrieved: 2026-11-23T16:51:56Z (WebFetch summary, not verbatim)
S.381 "10 Percent Credit Card Interest Rate Cap Act": Mr. Sanders for himself and Mr. Hawley, Feb 4 2025, referred to Senate Banking. Adds TILA sec. 107(f) capping credit card APR at 10 percent inclusive of finance charges; bars non-finance-charge fees used to evade; overpayment recoverable within 2 years; state-law savings clause; subsection struck effective Jan 1, 2031 (sunset).
UNVERIFIED: current committee status (congress.gov returned HTTP 403). H.R.1944 sponsor/text not primary-verified (secondary: AOC/Luna; introduced 2025-03-06 per BillTrack50).

```
