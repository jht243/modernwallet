# Approved Page Assignment: `/credit-card-interest-calculator/` (`credit-card-interest-calculator`)
- **Action ID:** `A2` (update existing body text)
- **Title:** Add a '10% APR cap scenario' section to /credit-card-interest-calculator/ (calculators.ts entry credit-card-interest-calculator): 24% vs 10% one-cycle interest on the page's $5,000 example, bill status and Jan 2031 sunset, CRS-cited tradeoffs, and a note that the cap is not law.
- **Page Type / Format / Medium:** guide | article section with comparison table - finite scenarios | text + comparison table
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What would a 10% credit card interest cap save me, and is it law? [verb-only - no PAA read; ac: 'credit card interest cap when does it start']
- **Working Answer (Col 11):** Not law: S.381 and H.R.1944 are proposals that would cap APRs at 10% until January 2031; on the page's $5,000 example, one 30-day cycle drops from $98.63 at 24% to $41.10 at 10%, a $57.53 difference, if the card stayed available at that rate (shape: figure with condition).
- **Answer Placement (Col 12):** section 1: the added '10% APR Cap Scenario' block placed directly under the intro answer

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent + news-driven (brief bullet 2). Autocomplete (estimate, NOT measured): 'credit card interest cap trump', 'credit card interest cap when does it start' (31 completions). lookup: EXACT SLUG /credit-card-interest-calculator/ (same tool intent, no cap scenario). Commits naming topic: none.
- **Keyword Evidence:** "SERP not read: DataForSEO credentials unavailable; demand is autocomplete estimate only."
- **Why New Page / Angle:** Add a '10% APR cap scenario' section to /credit-card-interest-calculator/ (calculators.ts entry credit-card-interest-calculator): 24% vs 10% one-cycle interest on the page's $5,000 example, bill status and Jan 2031 sunset, CRS-cited tradeoffs, and a note that the cap is not law.
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
  "route": "/credit-card-interest-calculator/",
  "readerQuestion": "What would a 10% credit card interest cap save me, and is it law? [verb-only - no PAA read; ac: 'credit card interest cap when does it start']",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/approval-manifest.json",
      "sha256": "02c32814e11e646262f0ead0c37b0c69c7ae9173aa85f04a8c83cfa20c6610b8"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/chart-review.json",
      "sha256": "3e0acbe97d69445d7dc37879c46749b029d291441e0fd8d496f75736e894c9fa"
    },
    "actionId": "A2"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "Added block directly after the intro and before the how-it-works section",
    "reason": "Two rows (24% vs 10%) answer the figure question; the existing calculator lets readers enter their own APR",
    "readerInputs": [
      "APR (existing calculator input)",
      "Balance (existing calculator input)"
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
  "decisionGap": "The credit card interest calculator page explains one billing cycle's interest but says nothing about the proposed 10% APR cap in the news. A reader asking whether a cap would save money, and whether it is law, gets no on-page answer.",
  "finding": "S.381 and H.R.1944 are bills in the 119th Congress that would cap credit card APRs at 10% until January 2031. S.381 was introduced February 4, 2025 and referred to the Senate Banking Committee. Congressional Research Service IF12861 (updated 2026-03-10) lists them as proposals and names tradeoffs: reduced access to credit, risk-based pricing changes and added fees. On the page's $5,000 example, one 30-day cycle costs $98.63 at 24% and $41.10 at 10%, a $57.53 difference, if the card stayed available at that rate with no new fees. A flat-year simple-interest view is $1,200 versus $500.",
  "conditions": "Not law. Status is as of the cited records (CRS 2026-03-10, govinfo as introduced); current committee status past those dates is not primary-verified. $57.53 is one 30-day cycle of simple interest on a flat $5,000 balance, 365-day basis, no payment in the cycle, no new fees, card stays available at 10%.",
  "whatWouldChange": "Enactment (not proposed), a different effective date, issuers adding fees or cutting access, or a different balance or cycle length each change the saving. A new fee of $57.53 or more per cycle would erase the one-cycle saving on this example.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/credit-card-interest-calculator/cases.json",
    "sha256": "a785672e5a0db44b6becbfaa4f7b662d289ec59a797f17a5e2a2cacd73587c6a"
  },
  "caseDecisions": "cases.json holds only Layer3Labs client and law-firm records, none about credit cards or this site. No client or conversation claim is used. No reader-survey records exist for this site.",
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
  "method": "Exact decimal arithmetic in model.py: interest = balance x APR / 365 x 30 for 24% and 10% on $5,000, difference of the two, flat-year simple interest = balance x APR. Output saved to output.json. Bill facts come from CRS IF12861 and govinfo S.381 as introduced.",
  "units": "USD, percent, years",
  "limitations": "Simple interest only, one cycle, no compounding within the cycle, no payments, no fees, no behavior change by issuers. Bill status is as of the cited records. H.R.1944 sponsor and current committee action are not primary-verified and are not stated.",
  "counterexample": "If an issuer responds with a new fee of $57.53 or more per cycle, or closes or reduces the card so the reader must borrow elsewhere at a higher rate, the $57.53 saving disappears or reverses (CRS names fees and reduced access as possible responses).",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/credit-card-interest-calculator/model.py"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/credit-card-interest-calculator/model.py",
      "sha256": "c9dd70ec069a8390adecf4a15cee8d4449784469942af81e853db80fb16c0991"
    },
    "inputs": [
      {
        "path": "reports/x-trends/2026-11-23.md",
        "sha256": "bcde17e2bb1f25c632a646338396796729541cdde9032d79d239da7911d7f963"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-23-xtrends-run/evidence/credit-card-interest-calculator/output.json",
      "sha256": "c035ad58248c5f4ccad436aaf82813d713ba72805243117d8fcd3680644d8902"
    }
  },
  "sources": [
    {
      "label": "Congressional Research Service IF12861 (version dated 2026-03-10)",
      "url": "https://www.everycrsreport.com/reports/IF12861.html",
      "checked": "2026-11-23"
    },
    {
      "label": "S.381 as introduced, govinfo",
      "url": "https://www.govinfo.gov/content/pkg/BILLS-119s381is/html/BILLS-119s381is.htm",
      "checked": "2026-11-23"
    }
  ],
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "evidence/credit-card-interest-calculator/model.py",
      "evidence/credit-card-interest-calculator/output.json"
    ],
    "scopeAndLimits": "Calculated on the page's own $5,000 / 30-day / 365-day example; bill facts and tradeoffs are reported from CRS and govinfo only.",
    "publicMethod": "On-page two-row table with the assumptions stated beside it and the existing calculator for the reader's own inputs",
    "placement": "Added section 2 '10% APR Cap Scenario', directly after the existing how-it-works section"
  },
  "takeaway": {
    "conclusion": "A 10% cap is a proposal, not law. If it passed and your card stayed available at 10% with no new fees, the $5,000 example would save $57.53 per 30-day cycle; fees or reduced access could erase that.",
    "appliesTo": "Consumer card borrowers carrying a balance",
    "basis": "calculated table plus CRS and govinfo reported facts",
    "conditionThatChangesIt": "Enactment details, issuer fee or access response, or a different balance"
  },
  "firstFindingAttribution": "In our internal modeling, we compared one 30-day cycle at 24% and 10% on the page's $5,000 example.",
  "guardrails": [
    "Hedge bill status: proposals introduced in the 119th Congress, referred to committee, as-of date, link CRS and govinfo.",
    "Do not name H.R.1944 sponsors, do not mention any presidential remark, do not imply passage.",
    "Conditions beside numbers; state fees/lost access counterexample.",
    "No TESTED claims; calculated label only."
  ],
  "caseUses": [],
  "growth": {
    "originRoutine": "mindmap-pass x-trends 2026-11-23",
    "queryFamily": "What would a 10% credit card interest cap save me, and is it law?",
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
