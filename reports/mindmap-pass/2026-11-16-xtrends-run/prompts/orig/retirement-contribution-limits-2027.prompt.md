# Approved Page Assignment: `/guides/retirement-contribution-limits-2027` (`retirement-contribution-limits-2027`)
- **Action ID:** `A1` (create new content)
- **Title:** 2027 Retirement Contribution Limits: 401(k), IRA, TSP
- **Page Type / Format / Medium:** guide | article - the reader wants the figures and what changed from 2026; a comparison table carries them | text
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What are the 2027 401(k), IRA and TSP contribution limits? [ac: 3 question completions what-is/what-will/catch-up from 95 autocomplete suggestions; PAA unread - no DataForSEO key]
- **Working Answer (Col 11):** A 401(k), 403(b), governmental 457 or TSP participant can defer $25,500 in 2027, up $1,000 (figure: the 2027 limits by account type, with catch-ups of $8,500 at 50+, $34,000 total, and $11,750 at 60-63, $37,250 total by our calculation); the IRA limit stays $7,500 with a $1,100 catch-up.
- **Answer Placement (Col 12):** section 1: "2027 Contribution Limits at a Glance"

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent plus fresh news (IRS IR-2026-136, Nov 12 2026). lookup: /guides/401k-contribution-limits-2026 and /guides/ira-contribution-limits-2026 serve a 2026-limits reader, not a 2027 one; /compare/tsp-vs-401k is a plan comparison. Autocomplete (free, NOT measured volume) returns 'what is the 401k 2027 contribution limit', 'what will 401k contribution limit be in 2027', '2027 401k contribution limit catch up', '2027 roth 401k contribution limit'. No tool volume (no DataForSEO or SEMRUSH key in this worker); fresh-trend rule, demand estimate (autocomplete) NOT measured. Commits: no prior commits touch this route.
- **Keyword Evidence:** "Primary: '2027 401k contribution limit'; supporting: '2027 ira contribution limit', 'tsp contribution limit 2027', '401k catch up 2027', '2027 roth 401k contribution limit'. Demand: estimate from Google Autocomplete (95 suggestions, 2026-11-16), NOT measured; no SEMRUSH or DataForSEO key in this worker; us database. Fresh-trend rule: no volume veto."
- **Why New Page / Angle:** Closest routes: /guides/401k-contribution-limits-2026 (reader wants 2026 figures and Roth/Traditional split), /guides/ira-contribution-limits-2026 (2026 IRA limits and phase-outs), /compare/tsp-vs-401k (plan comparison). None answers a 2027 query; commits checked: no prior commits touch the proposed route; lookup flagged no same-run overlap and no redirects. Independent duplicate decision to be made by CHART-REVIEW. Year-titled pages are kept as the 2026 reference.
- **Intent-Based Our Takeaway:** "For most savers the answer is $25,500 plus catch-up by age, with the IRA unchanged at $7,500: applies to anyone setting 2027 elections; it changes for plans that cap deferrals below the legal limit, for ages 60-63, and for higher earners whose catch-up may have to be Roth. Check the plan's own limit."

## Approved Section Outline
1. **2027 Contribution Limits at a Glance** — Opening answer and table: 2026 vs 2027 for 401(k)/403(b)/457/TSP, catch-ups at 50+ and 60-63, IRA and IRA catch-up, SIMPLE
2. **401(k), 403(b), 457 and TSP Deferral Limits for 2027** — $25,500, $8,500 catch-up, $34,000 total at 50+ (IRS) and $37,250 total at ages 60-63 (our calculation: $25,500 + $11,750; the IRS publishes only the $11,750 catch-up), deltas vs 2026 of $1,000 (deferral), $500 (catch-up), $500 (60-63 catch-up), $11,750 for ages 60-63, $75,000 total limit and what it covers
3. **Roth Catch-Up Wage Threshold for 2027** — Quote Notice 2026-66 verbatim: 'The Roth catch-up wage threshold for 2026, which under section 414(v)(7)(A) is used to determine whether an individual's catch-up contributions to an applicable employer plan (other than a plan described in section 408(k) or (p)) for 2027 must be designated as Roth contributions, is increased from $150,000 to $155,000.' State only that: it is a threshold for the 2027 catch-up designation, it applies to catch-up contributions only, SIMPLE and SEP plans are excluded by the notice, and whether a plan offers Roth is plan-specific. FORBIDDEN: any FICA, same-employer or prior-year-wage detail not in the saved Notice text, and any 'if you earn over $155,000 in 2027' paraphrase
4. **IRA Limits and Income Phase-Outs for 2027** — $7,500 and $1,100 catch-up unchanged; traditional deduction and Roth phase-out ranges for 2027 vs 2026; Saver's Credit
5. **SIMPLE Plan Limits for 2027** — $17,500, $19,100 higher limit, catch-ups
6. **What Maxing Out 2027 Takes Per Paycheck** — Calculated arithmetic: $25,500 across 26 biweekly or 12 monthly pay periods, labelled as our calculation
7. **Common Questions About 2027 Limits** — FAQ from real completions: expected vs announced limit, Roth vs Traditional shared cap, TSP limit

## Approved Internal Outbound Links
- {"source": "/guides/retirement-contribution-limits-2027", "target": "/guides/401k-contribution-limits-2026", "section": "2027 Contribution Limits at a Glance", "anchor": "2026 401(k) limits guide", "purpose": "Reader comparing years", "inspection": {"path": "src/data/guides.ts", "sha256": "64c13373dc352f3c61f90a565df8192a7dd3cbdf32c57c40ba9bde3263ad202d"}}
- {"source": "/guides/retirement-contribution-limits-2027", "target": "/guides/ira-contribution-limits-2026", "section": "IRA Limits and Income Phase-Outs for 2027", "anchor": "2026 IRA limits guide", "purpose": "Reader comparing years", "inspection": {"path": "src/data/guides.ts", "sha256": "64c13373dc352f3c61f90a565df8192a7dd3cbdf32c57c40ba9bde3263ad202d"}}
- {"source": "/guides/retirement-contribution-limits-2027", "target": "/retirement/401k-calculator/", "section": "What Maxing Out 2027 Takes Per Paycheck", "anchor": "401(k) calculator", "purpose": "Next action: project growth", "inspection": {"path": "src/data/spokes-retirement.ts", "sha256": "b14325deb297c4e6cc569f3708076bd0483915ccbb255fdaaa4e6745b8048edb"}}
- {"source": "/guides/retirement-contribution-limits-2027", "target": "/compare/tsp-vs-401k", "section": "401(k), 403(b), 457 and TSP Deferral Limits for 2027", "anchor": "TSP vs 401(k) comparison", "purpose": "TSP reader choosing a plan", "inspection": {"path": "src/data/comparisons.ts", "sha256": "c7984fb8df0f2abe8107ea32a981c21e4ae4eaed8fd886aed13ca3c19ff6bd31"}}

## Reviewer Guardrails (Must Respect)
- F1
- F2
- F3
- F4
- F5
- F6
- F7
- G1

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Include honest visible attribution matching `basis` (internal testing, internal modeling with visible assumptions + counterexample, anonymized approved client experience when selected, durable reader-survey facts when matched, and `(Tested YYYY)` ONLY when `runs:[{testedAt}]` is executed & eligible):
```json
{
  "gateSchemaVersion": 1,
  "author": "writer-xtrends",
  "route": "/guides/retirement-contribution-limits-2027",
  "readerQuestion": "What are the 2027 401(k), IRA and TSP contribution limits? [ac: 3 question completions what-is/what-will/catch-up from 95 autocomplete suggestions; PAA unread - no DataForSEO key]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-16-xtrends-run/approval-manifest.json",
      "sha256": "c1d1cd47877d867e8979c0fcf4e22481a42a500e8bc7d4292a5007b2c1bac905"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-16-xtrends-run/chart-review.json",
      "sha256": "17177e8b5fb2a3ed118030ee4c64ecc46b097be15f06778fc22d55cacfde56de"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "text",
    "placement": "Section 1 opening answer then comparison table",
    "reason": "The reader needs a finite set of figures by account type and age, which a table answers faster than a tool",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "Limits are fixed IRS figures; a per-paycheck helper is a single sentence of arithmetic in the takeaway, not a tool"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static layout answers faster; no sequence or input changes to animate"
    }
  },
  "basis": "calculated",
  "decisionGap": "Readers choosing 2027 payroll elections during open enrollment cannot get the 2027 limits from our 2026 pages. Existing guides answer 2026 limits only, and the IRS announcement lists figures without a side-by-side 2026-vs-2027 table or the 60-63 total.",
  "finding": "The 2027 employee deferral limit for 401(k), 403(b), governmental 457 and TSP is $25,500 (up $1,000). Catch-up is $8,500 at 50+ (total $34,000) and $11,750 at ages 60-63 (total $37,250 by our calculation: $25,500 + $11,750). The IRA limit stays $7,500 with a $1,100 catch-up. Maxing $25,500 takes $980.77 per biweekly paycheck (26 pay periods) or $2,125.00 per month, by our calculation.",
  "conditions": "Figures are the IRS legal maximums; a plan can set a lower cap or not offer catch-up or Roth. Catch-up needs a plan that allows it. The 60-63 catch-up replaces (does not add to) the $8,500 catch-up. Per-paycheck amounts assume 26, 24 or 12 equal pay periods; some biweekly calendars have 27 paychecks.",
  "whatWouldChange": "A plan-specific deferral cap below the legal limit, a plan that does not offer the 60-63 catch-up or Roth catch-up, a pay calendar with 27 paychecks, or an IRS correction to Notice 2026-66 would change the figure a reader should use.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-16-xtrends-run/evidence/retirement-contribution-limits-2027/cases.json",
    "sha256": "32ce071e51711f513e343b5f9e6e62b39ffe9f9f231bbc698b6eec5acb3e826a"
  },
  "caseDecisions": "cases.json returned 8 low-relevance candidates (topic matches only on 'and/the/what'), all Layer3Labs owned-property records for unrelated products; none applies to retirement limits, so no case or client-conversation claim is used. No survey records exist for this site.",
  "sourceArtifacts": [
    {
      "path": "reports/x-trends/2026-11-16.md",
      "sha256": "ca24a823d3c1b30dc3bcbc58bd24252286b47479c69a6a179680164de983ca3e"
    },
    {
      "path": "reports/mindmap-pass/2026-11-16-xtrends-run/research/coverage-lookup.txt",
      "sha256": "7910f20cf01fd0b852addf3da132b0f2b4957949a8cba50e6d3400f7273ce0cc"
    },
    {
      "path": "reports/mindmap-pass/2026-11-16-xtrends-run/research/autocomplete-2027-limits.csv",
      "sha256": "8a48d0e90f78219536cc7c3817e98781ea530cd38b4cfd3df8c791aa0c7f102d"
    },
    {
      "path": "reports/mindmap-pass/2026-11-16-xtrends-run/research/sources/irs-ir-2026-136.txt",
      "sha256": "e0fe2ff6a5b6f00e3618c481d1eed2fd00a752e800053e7d115cf7834ef8369f"
    },
    {
      "path": "reports/mindmap-pass/2026-11-16-xtrends-run/research/sources/irs-notice-2026-66.txt",
      "sha256": "c30cdc5c7f589b8e679b039d7e868203206f4cf77e18688517337b8f5babfd5f"
    }
  ],
  "caseUses": [],
  "method": "Reported IRS figures (IR-2026-136 and Notice 2026-66, saved verbatim 2026-11-16) plus deterministic arithmetic: total = deferral limit + catch-up; per-period = total / pay periods.",
  "units": "US dollars per calendar year; US dollars per pay period",
  "limitations": "Arithmetic only. It uses IRS figures as inputs and does not model employer match, plan caps, tax savings or investment growth. Pay-period division is equal-split and ignores payroll calendars with 27 paychecks.",
  "counterexample": "A worker paid every other Friday can receive 27 paychecks in a calendar year; the 26-period figure ($980.77) then overshoots the $25,500 cap by one paycheck and the 27-period figure ($944.44) applies. Another counterexample: a plan that caps deferrals below $25,500 makes the legal limit irrelevant to that worker.",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/2026-11-16-xtrends-run/evidence/retirement-contribution-limits-2027/calc.py",
      "reports/mindmap-pass/2026-11-16-xtrends-run/evidence/retirement-contribution-limits-2027/inputs.json",
      "reports/mindmap-pass/2026-11-16-xtrends-run/evidence/retirement-contribution-limits-2027/calc-output.json"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-16-xtrends-run/evidence/retirement-contribution-limits-2027/calc.py",
      "sha256": "8c2efe805f8ceb8a2488594aecbe5b2d75edae438ffca2c10b285430ecdabc37"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/2026-11-16-xtrends-run/evidence/retirement-contribution-limits-2027/inputs.json",
        "sha256": "6744f18bb9802cfdd13c6089e331e56ac99f7c657e65f519749fecea8494b2ec"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-16-xtrends-run/evidence/retirement-contribution-limits-2027/calc-output.json",
      "sha256": "c20560a08282429e4e1032b9ffc54e00bf24590ddd29828f05cf3be40902f9ce"
    }
  },
  "sources": [
    {
      "url": "https://www.irs.gov/newsroom/401k-limit-increases-to-25500-for-2027-ira-limit-remains-7500",
      "checkedAt": "2026-11-16",
      "label": "IRS IR-2026-136"
    },
    {
      "url": "https://www.irs.gov/pub/irs-drop/n-26-66.pdf",
      "checkedAt": "2026-11-16",
      "label": "IRS Notice 2026-66"
    }
  ],
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "irs-ir-2026-136",
      "irs-notice-2026-66",
      "calc-output.json"
    ],
    "scopeAndLimits": "IRS figures are reported as IRS announcements. Only the $37,250 age 60-63 total and the per-paycheck amounts are our calculation. No product test, client record or survey is claimed.",
    "publicMethod": "Shown on the page beside the figures: the sum ($25,500 + $11,750) and the division by 26 biweekly or 12 monthly pay periods, with the 27-paycheck exception stated.",
    "placement": "Section 'What Maxing Out 2027 Takes Per Paycheck' and the age 60-63 row note in the limits table; takeaway section."
  },
  "findings": [
    {
      "label": "reported",
      "text": "401(k)/403(b)/457/TSP $25,500; catch-up $8,500 (50+) and $11,750 (60-63); IRA $7,500, IRA catch-up $1,100; SIMPLE $17,500 / $19,100; total limit $75,000; Roth catch-up wage threshold $155,000 per Notice 2026-66"
    },
    {
      "label": "calculated",
      "text": "$37,250 total at 60-63; $980.77 biweekly and $2,125.00 monthly to max $25,500; deltas $1,000, $500, $500"
    }
  ],
  "exclusions": "No TESTED labels, howWeTested or testing claims (financial content excluded under _experience section G). No FICA, same-employer or prior-year-wage detail for the Roth catch-up threshold beyond the quoted Notice text. No professional-review claim.",
  "unknowns": "Whether a given employer plan offers catch-up, the 60-63 catch-up or Roth catch-up; whether a given pay calendar has 26 or 27 paychecks; PAA text (unread: no DataForSEO key).",
  "selectedMedium": "text with two tables (limits 2026 vs 2027; IRA phase-outs); no tool because limits are fixed IRS figures"
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/x-trends/2026-11-16.md`
```
=== themodernwallet.com ===
- 401(k), IRA and TSP contribution limits for 2027: $25,500 deferral limit, $8,500 catch-up, $11,750 for ages 60–63, and the IRA limit staying at $7,500 — The IRS (IR-2026-136, Notice 2026-66) raised the 401(k)/403(b)/457/TSP limit by $1,000 and the total defined-contribution limit to $75,000. The Roth catch-up wage threshold rises to $155,000, and SIMPLE limits go to $17,500. The site has 2026 limit pages but no 2027 version. Why now: the IRS announced it on Nov 12, just as open-enrollment payroll elections are being made. Sources: https://www.irs.gov/newsroom/401k-limit-increases-to-25500-for-2027-ira-limit-remains-7500, https://news.bloomberglaw.com/employee-benefits/irs-raises-401k-contribution-limit-amount-by-1-000-for-2027, https://x.com/i/trending/2120991912354267289
- [FRUSTRATION] Amex India Membership Rewards chaos: were your clawed-back points restored, should you transfer to Marriott now, and what changes from today, Nov 15? — Amex India removed points on Nov 9, then reversed it after complaints, restoring balances to Nov 8 levels. Cardholders are rushing to transfer to Marriott Bonvoy (1:1), and some report errors when linking accounts. From Nov 15, points are reportedly held per card and can't be moved between cards. Why now: Amex points posts ran 56–87 a day around the Nov 9 clawback, and a second wave of transfer questions is building as the Nov 15 change takes effect. Sources: https://www.livemint.com/money/personal-finance/amex-credit-card-reward-points-deducted-restored-november-2026-11794376350635.html, https://cardpolo.com/news/amex-india-removes-membership-rewards-points-cancelled-cards-november-2026, https://x.com/ccg33k/status/2120927193362796584, https://x.com/DealsDhamaka/status/2121151917632229731
- [FRUSTRATION] [ENRICH /budget/aca-subsidy-calculator/] "My ACA premium doubled and my subsidy ended": what to do this open enrollment (deadline Jan 15 in most states) — Marketplace shoppers say premiums are up and the enhanced subsidies are gone. Posts cite a Wisconsin average hike of 22% and a doubled premium of $1,800 a month on an $8K-deductible plan. People are missing how to re-run the subsidy math, when bronze or catastrophic plans make sense, and the deadlines. Why now: X posts complaining about ACA premiums and subsidies hold steady at about 90–125 a day through open enrollment. Sources: https://x.com/FragenFrage/status/2120972027037147164, https://x.com/OpportunityWI/status/2121241676073308667, https://x.com/AIDSadvocacy/status/2120894586121826518, https://www.healthcare.gov/quick-guide/dates-and-deadlines/
- [RELEASE] Should you connect your bank accounts to Gemini? Google Wallet in Gemini explained: what it can see (read-only, linked through Plaid), what it can't do, how to switch it on or off, and the privacy trade-offs for budgeting — Since Nov 13, every US Gemini app user on Android, iOS and the web can connect Google Wallet under Personal Intelligence > Connected Apps, then tag @Google Wallet to review spending, find forgotten subscriptions and price increases, and set a holiday budget. Google says Gemini can only read the data and can't move, manage or invest money. The site has no page on AI budgeting assistants or Gemini. Why now: @GeminiApp shared the launch on Nov 15 (UTC), it's covered by 9to5Google and Engadget, and holiday budgeting is the headline use case. Sources: https://x.com/GeminiApp/status/2121765619318362255, https://blog.google/innovation-and-ai/products/
```
### `reports/mindmap-pass/2026-11-16-xtrends-run/research/coverage-lookup.txt`
```
coverage_lookup: 5 candidate(s) vs 834 repo pages / 849 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1205 past-chart lines

### /guides/401k-contribution-limits-2027  — row - · create new content
keyword: 2027 401k contribution limit; 2027 IRA limit; 2027 TSP limit
reader question (new page intent): What are the 2027 401(k), IRA and TSP contribution limits?
lookup terms: 401k contribution 2027 ira tsp   format cues: limits

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /guides/ira-contribution-limits-2026  [PARENT PAGE · in sitemap · src/data/guides.ts · topic match 0.4 on contribution ira · same format: limits]
    title: IRA Contribution Limits for 2026: The Complete Guide
    desc:  The 2026 IRA contribution limit is $7,500 ($8,600 if you're 50+). See Roth income limits, deduction rules, and what happens if you contribute too much.
- /guides/401k-contribution-limits-2026  [PARENT PAGE · in sitemap · src/data/guides.ts · topic match 0.4 on 401k contribution · same format: limits]
    title: 401(k) Contribution Limits for 2026: The Complete Guide
    desc:  The 2026 401(k) contribution limit is $24,500 ($32,500 if you're 50+, $35,750 if you're 60-63). See the Roth/Traditional combined cap and catch-up rules.
- /compare/tsp-vs-401k  [PARENT PAGE · in sitemap · src/data/comparisons.ts · topic match 0.4 on 401k tsp]
    title: TSP vs 401(k): Which Retirement Plan Wins in 2026?
    desc:  TSP vs 401(k) compared: agency/employer match, fund menu, fees, and the unique G Fund — see which is better for federal employees and military.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-11-04-podcast.md [table] | Lens 1 direct intent (podcast: How to Money 'Maxxing HSA Benefits'). 'hsa triple tax advantage' 2,400/mo KD 37 CPC $1.11 (SEMRUSH us 2026-11-04, measured); supporting 'hsa contribution limits 2026' 33,100 KD 44, 'hsa t
- 2026-11-04-tool-usage.md [exclusions] - Next in line (specs, cap of 3 builds, 2 built): depreciation-recapture-calculator, 1031-exchange-calculator (prior specs); Social Security withholding (W-4V) estimator; capital loss carryover calculator; Florida homest
- 2026-11-10-search-gap.md [table] | Lens 1 direct intent (visitor searches on /, 2026-11-09 19:20 UTC: 'differences between simple ira and' then 'differences between simple ira and 401k', same session). Autocomplete (9/9 question completions, not measure
- 2026-11-10-search-gap.md [exclusions] - Not created: any new page (exact-intent page /compare/simple-ira-vs-401k exists).
- 2026-11-13-trend-lane-c.md [exclusions] - roth or regular 401k: DROP, exists (/compare/roth-401k-vs-traditional-401k, /roth-vs-traditional-401k-calculator, /compare/401k-vs-roth-ira); wording-only gap.
- 2026-11-15-trend-lane-c.md [exclusions] - 401k contribution roth vs traditional / roth or regular 401k: DROP, exist (/compare/roth-401k-vs-traditional-401k, /roth-vs-traditional-401k-calculator, /compare/401k-vs-roth-ira).
Commits naming the topic: none
Same run overlap: none

### /guides/amex-india-membership-rewards-clawback  — row - · create new content
keyword: amex india membership rewards points restored
reader question (new page intent): Were my Amex India clawed-back points restored and should I transfer to Marriott?
lookup terms: amex india membership reward clawback point restored   format cues: -

Possible existing ho
```
### `reports/mindmap-pass/2026-11-16-xtrends-run/research/autocomplete-2027-limits.csv`
```
seed,suggestion,via
2027 401k contribution limit,what is the 401k 2027 contribution limit,question:what
2027 401k contribution limit,what is the 2027 roth 401k contribution limit,question:what
2027 401k contribution limit,what 2027 401k contribution limits 2018,question:what
2027 401k contribution limit,how 2027 401k contribution limits,question:how
2027 401k contribution limit,how 2027 401k contribution limits 2018,question:how
2027 401k contribution limit,why 2027 401k contribution limits,question:why
2027 401k contribution limit,why 2027 401k contribution limits 2018,question:why
2027 401k contribution limit,is 2027 401k contribution limits,question:is
2027 401k contribution limit,is 2027 401k contribution limits 2018,question:is
2027 401k contribution limit,does 2027 401k contribution limits,question:does
2027 401k contribution limit,does 2027 401k contribution limits 2018,question:does
2027 401k contribution limit,can 2027 401k contribution limits,question:can
2027 401k contribution limit,can 2027 401k contribution limits 2018,question:can
2027 401k contribution limit,should 2027 401k contribution limits,question:should
2027 401k contribution limit,should 2027 401k contribution limits 2018,question:should
2027 401k contribution limit,when 2027 401k contribution limits,question:when
2027 401k contribution limit,when 2027 401k contribution limits 2018,question:when
2027 401k contribution limit,where 2027 401k contribution limits,question:where
2027 401k contribution limit,where 2027 401k contribution limits 2018,question:where
2027 401k contribution limit,which 2027 401k contribution limits,question:which
2027 401k contribution limit,which 2027 401k contribution limits 2018,question:which
2027 401k contribution limit,2027 annual 401k contribution limit,alphabet:a
2027 401k contribution limit,401k and ira 2027 contribution limit irs,alphabet:a
2027 401k contribution limit,401k contribution limits 2025,alphabet:a
2027 401k contribution limit,2027 401k contribution limit age 50,alphabet:a
2027 401k contribution limit,2027 401k contribution limit after tax,alphabet:a
2027 401k contribution limit,2027 401k contribution limit after 50,alphabet:a
2027 401k contribution limit,what will 401k contribution limit be in 2027,alphabet:b
2027 401k contribution limit,2027 401k contribution limit by year,alphabet:b
2027 401k contribution limit,2027 401k contribution limit before or after tax,alphabet:b
2027 401k contribution limit,401k 2027 contribution limit irs catch up,alphabet:c
2027 401k contribution limit,2027 401k contribution limit catch up,alphabet:c
2027 401k contribution limit,2027 401k contribution limit calculator,alphabet:c
2027 401k contribution limit,2027 401k contribution limit company match,alphabet:c
2027 401k contribution limit,2027 401k contribution limit does not exist,alphabet:d
2027 401k contribution limit,2027 401k contribution limit does not exist gif,alphabet:d
2027 401k contribution limit,401k 2027 contribution limit estimate,alphabet:e
2027 401k contribution limit,2027 expected 401k contribution limits,alphabet:e
2027 401k contribution limit,2027 employee 401k contribution limits,alphabet:e
2027 401k contribution limit,2027 401k contribution limit employer match,alphabet:e
2027 401k contribution limit,2027 401k contribution limit exceeded,alphabet:e
2027 401k contribution limit,2027 401k contribution limit employee and employer,alphabet:e
2027 401k contribution limit,401k contribution limit for 2027,alphabet:f
2027 401k c
```
### `reports/mindmap-pass/2026-11-16-xtrends-run/research/sources/irs-ir-2026-136.txt`
```
URL: https://www.irs.gov/newsroom/401k-limit-increases-to-25500-for-2027-ira-limit-remains-7500
HTTP: 200 https://www.irs.gov/newsroom/401k-limit-increases-to-25500-for-2027-ira-limit-remains-7500
Retrieved UTC: 2026-11-16T16:51:03.406964Z

401(k) limit increases to $25,500 for 2027, IRA limit remains $7,500 | Internal Revenue Service
Skip to main content
An official website of the United States government
Here's how you know
Here's how you know
Official websites use .gov
A
.gov
website belongs to an official government organization in the United States.
Secure .gov websites use HTTPS
A
lock
(
)
or
https://
means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.
English
Español
中文 (简体)
中文 (繁體)
한국어
Русский
Tiếng Việt
Kreyòl ayisyen
Information Menu
Help
News
Tax Pros
Sign in
Individual
Business
Tax Pro
Access your tax information with an IRS account.
Refunds
Payments
Tax records
Create account
Search
Help Menu Mobile
Sign in
Individual
Business
Tax Pro
Access your tax information with an IRS account.
Refunds
Payments
Tax records
Create account
Menu
Main navigation
File
Overview
INFORMATION FOR…
Individuals
Business and self-employed
Charities and nonprofits
International filers
Retirement
Governments and tax-exempt bonds
Indian Tribal Governments
FILING FOR INDIVIDUALS
How to file
When to file
Where to file
Update your information
POPULAR
Tax record (transcript)
Apply for an Employer ID Number (EIN)
Amend return
Identity Protection PIN (IP PIN)
Pay
Overview
PAY BY
Bank Account (Direct Pay)
Payment Plan (Installment Agreement)
Electronic Federal Tax Payment System (EFTPS)
POPULAR
Your Online Account
Tax Withholding Estimator
Estimated Taxes
Penalties
Refunds
Overview
About refunds
Direct deposit
Reduced refunds
Where’s my amended return?
Credits & Deductions
Overview
INFORMATION FOR...
Individuals
For you and your family
Businesses & Self-Employed
Standard mileage and other information
POPULAR
Earned Income Credit (EITC)
Child Tax Credit
Clean Energy and Vehicle Credits
Standard Deduction
Retirement Plans
Forms
Overview
POPULAR FORMS & INSTRUCTIONS
Form 1040
Individual Income Tax Return
Form 1040 Instructions
Instructions for Form 1040
Form W-9
Request for Taxpayer Identification Number (TIN) and Certification
Form 4506-T
Request for Transcript of Tax Return
Form W-4
Employee's Withholding Certificate
Form 941
Employer's Quarterly Federal Tax Return
Form W-2
Wage and Tax Statement
Form 9465
Installment Agreement Request
POPULAR FOR TAX PROS
Form 1040-X
Amended Individual Income Tax Return
Form 2848
Power of Attorney
Form W-7
Apply for an ITIN
Circular 230
Regulations Governing Practice before the IRS
Report Fraud
Overview
Tax fraud and scams
Identity theft
Fake IRS email or message
Tax return preparer misconduct
Help for tax professionals
Search
Include Historical Content
- Any -
No
Include Historical Content
- Any -
No
Search
File
Overview
INFORMATION FOR…
Individuals
Business and self-employed
Charities and nonprofits
International filers
Retirement
Governments and tax-exempt bonds
Indian Tribal Governments
FILING FOR INDIVIDUALS
How to file
When to file
Where to file
Update your information
POPULAR
Tax record (transcript)
Apply for an Employer ID Number (EIN)
Amend return
Identity Protection PIN (IP PIN)
Pay
Overview
PAY BY
Bank Account (Direct Pay)
Payment Plan (Installment Agreement)
Electronic Federal Tax Payment System (EFTPS)
POPULAR
Your Online Account
Tax Withholding Esti
```
### `reports/mindmap-pass/2026-11-16-xtrends-run/research/sources/irs-notice-2026-66.txt`
```
URL: https://www.irs.gov/pub/irs-drop/n-26-66.pdf
Retrieved UTC: 2026-11-16T16:51:24Z

2027 Amounts Relating to Retirement Plans and IRAs, as Adjusted for Changes in
Cost-of-Living



Notice 2026-66

       Section 415 of the Internal Revenue Code (“Code”) provides for limitations on
benefits and contributions under qualified retirement plans. Section 415(d) requires that
the Secretary of the Treasury annually adjust these limitations for cost-of-living
increases. Under section 415(d), the adjustments are to be made under adjustment
procedures similar to those used to adjust benefit amounts under section 215(i)(2)(A) of
the Social Security Act. Other amounts applicable to deferred compensation plans are
also adjusted for cost-of-living increases using a variation of the methodology used for
the adjustments under section 415(d).

Cost-of-Living Adjusted Limitations for 2027

       Effective January 1, 2027, the limitation on the annual benefit under a defined
benefit plan under section 415(b)(1)(A) of the Code is increased from $290,000
to $300,000.

        For a participant who separated from service before January 1, 2027, the
participant’s limitation under a defined benefit plan under section 415(b)(1)(B) is
computed by multiplying the participant’s compensation limitation, as adjusted
through 2026, by 1.0350.

       The limitation for defined contribution plans under section 415(c)(1)(A) is
increased in 2027 from $72,000 to $75,000.

      The Code provides that various other amounts are to be adjusted at the same
time and in the same manner as the limitation of section 415(b)(1)(A). After taking into
account the applicable rounding rules, the amounts for 2027 are as follows:

       The limitation under section 402(g)(1) on the exclusion for elective deferrals
       described in section 402(g)(3), which includes elective deferrals made to the
       Thrift Savings Plan, is increased from $24,500 to $25,500.

       The limitation on deferrals under section 457(e)(15) concerning deferred
       compensation plans of state and local governments and tax-exempt
       organizations is increased from $24,500 to $25,500.

       The limitation under section 414(v)(2)(B)(i) for catch-up contributions to an
       applicable employer plan other than a plan described in section 401(k)(11) or
       section 408(p) that generally applies for individuals aged 50 or over is increased
       from $8,000 to $8,500. The limitation under section 414(v)(2)(E)(i) for catch-up
       contributions to an applicable employer plan other than a plan described in
       section 401(k)(11) or section 408(p) that applies for individuals who attain

                                             1
age 60, 61, 62, or 63 in 2027 increases from $11,250 to $11,750. The Roth
catch-up wage threshold for 2026, which under section 414(v)(7)(A) is used to
determine whether an individual’s catch-up contributions to an applicable
employer plan (other than a plan described in section 408(k) or (p)) for 2027
must be designated as Roth contributions, is increased from $150,000 to
$155,000.

The limitation under section 408(p)(2)(E)(i)(III) that generally applies to salary
reduction contributions under a SIMPLE retirement account or elective
contributions under a SIMPLE 401(k) plan is increased from $17,000 to $17,500.
The limitation under section 408(p)(2)(E)(i)(I) or (II) for employee elective
deferrals for SIMPLE retirement accounts maintained by certain eligible
emplo
```
### `reports/mindmap-pass/2026-11-16-xtrends-run/research/sources/kff-2026-what-we-know.txt`
```
URL: https://www.kff.org/affordable-care-act/what-we-know-so-far-about-2026-aca-marketplace-enrollment-premiums-and-deductibles/
HTTP: 200 https://www.kff.org/affordable-care-act/what-we-know-so-far-about-2026-aca-marketplace-enrollment-premiums-and-deductibles/
Retrieved UTC: 2026-11-16T16:53:11.395487Z

What We Know So Far About 2026 ACA Marketplace Enrollment, Premiums, and Deductibles | KFF
Skip to main content
The independent source for health policy research, polling, and news.
The independent source for health policy research, polling, and news.
Subscribe
Follow Us
Conference Centers
Donate
Search
Search for:
Topics
Back
Topics
Affordable Care Act
Elections
Global Health Policy
Health Costs
Health Information and Trust
HIV/AIDS
Immigrant Health
LGBTQ
Medicaid
Medicare
Mental Health
Patient and Consumer Protections
Public Opinion
Private Insurance
Racial Equity and Health Policy
State Health Policy and Data
Uninsured
Women's Health Policy
FEATURED CONTENT
Health in the 2026 Midterms
Explore all Topics
Policy Research
Back
Policy Research
KFF’s policy research provides facts and analysis on a wide range of policy issues and public programs.
Explore all Policy Research
Polling
Back
Polling
KFF designs, conducts and analyzes original public opinion and survey research on Americans’ attitudes, knowledge, and experiences with the health care system to help amplify the public’s voice in major national debates.
View all Poll Findings
Health News
Back
Health News
KFF Health News
is a national newsroom that produces in-depth journalism about health issues and is one of the organization’s core operating programs.
Explore KFF Health News
Data & Features
Back
Data & Features
FROM THE CEO
From Drew Altman
Beyond the Data
FEATURES
Quick Insights
The Monitor
Health Policy 101
The Business of Health Podcast with Chip Kahn
The Health Wonk Shop
ACA Health Insurance Marketplace Calculator
Employer Health Benefits Survey
Medicaid Budget Survey
POLLING
KFF Health Tracking Poll
Tracking the Public’s Views on the ACA
Polling on Health Information and Trust
Women's Health Survey
FAQS
Health Insurance Marketplace and the ACA
Medicare Open Enrollment
TRACKERS
ACA Preventive Services Tracker
Medicaid Waiver Tracker
Medicaid Work Requirements Tracker
Global Health Budget Tracker
Global COVID-19 Tracker
Peterson-KFF Health System Tracker
DASHBOARDS
Abortion in the U.S.
Key Data on Health Care by Race and Ethnicity
DATABASES
State Health Facts
Custom State Reports
STATE FACT SHEETS
Medicaid Fact Sheets
Mental Health and Substance
Use Fact Sheets
State Health Care Snapshots
STATE PROFILES
State Profiles of Dual-Eligible Individuals
State Profiles of Women’s Health
View all Features
For Media
Back
For Media
Media Contacts
Citations and Reprints
News Releases
Explore all Media Resources
About
Back
About
About Us
Our People
Our Work
Board of Trustees
Conference Centers
Events
Contact Us
Join Our Team
From CEO Drew Altman
President's Message
Our Standards & Practices
Beyond the Data Columns
View All
About KFF
Follow Us
Subscribe
Search
Search for:
Home
Topics
Affordable Care Act
What We Know So Far About 2026 ACA Marketplace Enrollment, Premiums, and Deductibles
Authors:
Matt McGough
, Jared Ortaliza,
Justin Lo
, and
Cynthia Cox
Published:
May 19, 2026
Print
Email
Copy Link
Add KFF on Google
News Release:
The Average Marketplace Deductible Grew by About $1,000 Per Person in 2026, With More Enrollees Shifting to Higher-Deductible Plans as Enhanced Tax Credits Expire
```
### `reports/mindmap-pass/2026-11-16-xtrends-run/research/sources/kff-2027-oe.txt`
```
URL: https://www.kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/
HTTP: 200 https://www.kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/
Retrieved UTC: 2026-11-16T16:52:02.637577Z

9 Things to Watch for the 2027 ACA Open Enrollment Period  | KFF
Skip to main content
The independent source for health policy research, polling, and news.
The independent source for health policy research, polling, and news.
Subscribe
Follow Us
Conference Centers
Donate
Search
Search for:
Topics
Back
Topics
Affordable Care Act
Elections
Global Health Policy
Health Costs
Health Information and Trust
HIV/AIDS
Immigrant Health
LGBTQ
Medicaid
Medicare
Mental Health
Patient and Consumer Protections
Public Opinion
Private Insurance
Racial Equity and Health Policy
State Health Policy and Data
Uninsured
Women's Health Policy
FEATURED CONTENT
Health in the 2026 Midterms
Explore all Topics
Policy Research
Back
Policy Research
KFF’s policy research provides facts and analysis on a wide range of policy issues and public programs.
Explore all Policy Research
Polling
Back
Polling
KFF designs, conducts and analyzes original public opinion and survey research on Americans’ attitudes, knowledge, and experiences with the health care system to help amplify the public’s voice in major national debates.
View all Poll Findings
Health News
Back
Health News
KFF Health News
is a national newsroom that produces in-depth journalism about health issues and is one of the organization’s core operating programs.
Explore KFF Health News
Data & Features
Back
Data & Features
FROM THE CEO
From Drew Altman
Beyond the Data
FEATURES
Quick Insights
The Monitor
Health Policy 101
The Business of Health Podcast with Chip Kahn
The Health Wonk Shop
ACA Health Insurance Marketplace Calculator
Employer Health Benefits Survey
Medicaid Budget Survey
POLLING
KFF Health Tracking Poll
Tracking the Public’s Views on the ACA
Polling on Health Information and Trust
Women's Health Survey
FAQS
Health Insurance Marketplace and the ACA
Medicare Open Enrollment
TRACKERS
ACA Preventive Services Tracker
Medicaid Waiver Tracker
Medicaid Work Requirements Tracker
Global Health Budget Tracker
Global COVID-19 Tracker
Peterson-KFF Health System Tracker
DASHBOARDS
Abortion in the U.S.
Key Data on Health Care by Race and Ethnicity
DATABASES
State Health Facts
Custom State Reports
STATE FACT SHEETS
Medicaid Fact Sheets
Mental Health and Substance
Use Fact Sheets
State Health Care Snapshots
STATE PROFILES
State Profiles of Dual-Eligible Individuals
State Profiles of Women’s Health
View all Features
For Media
Back
For Media
Media Contacts
Citations and Reprints
News Releases
Explore all Media Resources
About
Back
About
About Us
Our People
Our Work
Board of Trustees
Conference Centers
Events
Contact Us
Join Our Team
From CEO Drew Altman
President's Message
Our Standards & Practices
Beyond the Data Columns
View All
About KFF
Follow Us
Subscribe
Search
Search for:
Home
Topics
Affordable Care Act
9 Things to Watch for the 2027 ACA Open Enrollment Period
Authors:
Matt McGough
,
Rayna Wallace
,
Justin Lo
,
Kaye Pestaina
, and
Cynthia Cox
Published:
Nov 6, 2026
Print
Email
Copy Link
Add KFF on Google
Correction
Table 1 was corrected on November 6, 2026.
See note for details
.
The Affordable Care Act (ACA) Marketplace 2027 Open Enrollment period starts November 1, 2026, in most states. In 2026, the enhanced premium tax credits
expired
, provisions of the 2025 b
```
### `reports/mindmap-pass/2026-11-16-xtrends-run/research/sources/healthcare-gov-dates.txt`
```
URL: https://www.healthcare.gov/quick-guide/dates-and-deadlines/
HTTP: 200 https://www.healthcare.gov/quick-guide/dates-and-deadlines/
Retrieved UTC: 2026-11-16T16:51:05.178315Z

When can you get health insurance? | HealthCare.gov
Skip to main content
An official website of the United States government
Here's how you know
Here's how you know
Official websites use .gov
A
.gov
website belongs to an official government organization in the United States.
Secure .gov websites use HTTPS
A
lock
( )
or
https://
means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.
Search
Español
Log in
Menu
Español
Log in
A quick guide to the Health Insurance Marketplace
®
Email this page
Email
Print this page
Print
More info
Tips about the Health Insurance Marketplace
®
Getting a Health Insurance Marketplace
®
plan: 4 steps
Are you eligible to use the Marketplace?
When can you get health insurance?
More info
When can you get health insurance?
Warning:
Enroll for 2027 now
Fill out an application, compare plans, and enroll in 2027 health coverage. Enroll by December 15 for coverage that starts January 1.
Log in
or
create an account
to start your application.
November 1:
Open Enrollment starts — first day you can enroll in, renew, or change health plans through the Marketplace for the coming year. Coverage can start as soon as January 1.
December 15:
Last day to enroll in or change plans for coverage to start January 1.
January 1:
Coverage starts for those who enroll in or change plans by December 15 and pay their first premium.
January 15:
Open Enrollment ends — last day to enroll in or change Marketplace health plans for the year. After this date, you can enroll in or change plans only if you qualify for a Special Enrollment Period.
February 1:
Coverage starts for those who enroll in or change plans December 16 through January 15 and pay their first premium.
Get coverage between January 16 and October 31
if you qualify for a
Special Enrollment Period
Special Enrollment Period
A period of time outside of Open Enrollment when you can enroll in or change Marketplace plans
due to a
life event
Life change
Like getting married, new baby or dependent, moving, or losing health coverage
. You can apply for free or low-cost coverage through
Medicaid
A joint federal and state insurance program that provides free or low-cost health coverage to some low-income individuals, families, children, pregnant women, the elderly, and people with disabilities.
Refer to glossary for more details.
or the
Children’s Health Insurance Program (CHIP)
A joint federal and state insurance program that provides free or low-cost health coverage to children and pregnant women in families that earn too much to qualify for Medicaid.
Refer to glossary for more details.
at any time.
What do you want to do next?
Preview plans and prices.
Sign up for emails
to get reminders and never miss important information.
Download a checklist
(PDF, 251 KB) to gather everything you need to apply.
Learn more about:
Marketplace coverage
Medicaid and CHIP
Special Enrollment Periods
Email this page
Email
Print this page
Print
Back to top
Resources
About the Affordable Care Act
Regulatory and Policy Information
For Navigators, Assisters & Partners
For Agents and Brokers
For the Media
For Researchers
For States
Information in other languages
Connect with us
Questions? Call 1-800-318-2596
Find Local Help
Facebook HealthCare.gov
You are leaving HealthCare.gov.
Y
```
