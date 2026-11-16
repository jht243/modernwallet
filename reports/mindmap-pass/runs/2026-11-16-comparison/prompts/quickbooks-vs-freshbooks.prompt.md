# Approved Page Assignment: `/compare/quickbooks-vs-freshbooks` (`quickbooks-vs-freshbooks`)
- **Action ID:** `A1` (create new content)
- **Title:** QuickBooks vs FreshBooks: Price by Users and Clients
- **Page Type / Format / Medium:** comparison | comparison table/database | text + comparison table
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** QuickBooks or FreshBooks: which costs less for my small business or freelance work? [PAA 3/6 on-topic (comparable software, what FreshBooks is, leaving QuickBooks); 3/6 off-topic: old QuickBooks versions, CPAs, IRS; ac 4/25 which-is-better question completions]
- **Working Answer (Col 11):** At monthly list prices, FreshBooks costs less for 1 user with up to 5 billable clients, for 2 users at any client count, and for 4 or more users at any client count; QuickBooks Online costs less for 1 user with 6 or more clients and for exactly 3 users with 51 or more clients, and QuickBooks also has a Free plan (1 user, 2 invoices a month); shape: pick with its flip points.
- **Answer Placement (Col 12):** section 1: "QuickBooks vs FreshBooks at a Glance"

## Demand & Differentiation Context
- **Problem / Gap:** lookup: /alternatives/quickbooks - reader wants a list of alternatives, not this pairing. Lens 1 direct intent (brief candidate 2). "quickbooks vs freshbooks" 2,400/mo KD 28 SEMRUSH; no dedicated page on the site; SERP winnable.
- **Keyword Evidence:** "Primary \"quickbooks vs freshbooks\" 2,400/mo KD 28 (SEMRUSH phrase_these/phrase_kdi, us database, checked 2026-11-16). Supporting autocomplete completions (live Google, not volume-validated) \"what's better quickbooks or freshbooks\", \"is freshbooks better than quickbooks\", \"difference between freshbooks and quickbooks\", \"quickbooks vs freshbooks vs xero\", \"...for small business\" (Google Autocomplete question sweep saved to ac-quickbooks-vs-freshbooks.csv). Measured volume, not an estimate."
- **Why New Page / Angle:** lookup: /alternatives/quickbooks (published 2026-11-13) is the QuickBooks alternatives roundup (reader goal: what else could I use, five products) and /roundup/best-accounting-software-for-freelancers (reader goal: pick software from a ranked list); neither answers the head-to-head "which of these two costs less for my users and clients". Same-run overlap: xero-vs-quickbooks (deferred, different rival). No commits touch a quickbooks-vs-freshbooks route (git log -p on src/data/comparisons.ts shows no such slug; coverage-lookup "Commits naming the topic: none"). Independent duplicate review is the CHART-REVIEW stage.
- **Intent-Based Our Takeaway:** "This is a price answer, not a feature verdict. At monthly list prices FreshBooks is cheaper for 1 user with up to 5 clients, for 2 users at every client count and for 4 or more users at every client count; QuickBooks Online is cheaper for 1 user with 6 or more clients and for exactly 3 users with 51 or more clients; the QuickBooks Free plan ($0, 1 user, 2 invoices a month) beats both for a single user sending almost no invoices. The answer changes if promotions, FreshBooks seat add-on pricing or QuickBooks tiers change, or if the reader needs features the price model does not score. Attributed to our internal cost modeling, with vendor list prices as sourced inputs."

## Approved Section Outline
1. **QuickBooks vs FreshBooks at a Glance** — Opening answer with the break-even: who pays less at what user and client counts.
2. **Published Plans and Monthly List Prices Side by Side** — Table of QuickBooks Online (Free $0 with 1 user and 2 invoices a month, Simple Start $38, Essentials $85, Plus $140, Advanced $340) and FreshBooks (Lite $23, Plus $43, Premium $70, Select quote) with user and client limits; labelled "monthly list price, checked 2026-11-16", linked to quickbooks.intuit.com/pricing and freshbooks.com/pricing; promotions excluded.
3. **Monthly Cost by Number of Users and Clients** — Our modeled grid (users 1/2/3/4/5/10/25 by clients 3/5/6/20/50/51/100) from list prices, with the formula and every flip point.
4. **What the Price Comparison Leaves Out** — Price-only model: features are not scored. FreshBooks features cited only from its verbatim pricing capture (client-based billing, proposals, projects); no QuickBooks feature claims or quotes beyond price and user caps.
5. **Who Should Pick QuickBooks or FreshBooks** — Reader-situation guidance, who this is not for, what would change our answer.
6. **FAQs** — PAA/autocomplete questions answered from sources: comparable software, what FreshBooks is, accountant access.

## Approved Internal Outbound Links
- {"source": "/compare/quickbooks-vs-freshbooks", "target": "/alternatives/quickbooks", "section": "Who Should Pick QuickBooks or FreshBooks", "anchor": "other QuickBooks alternatives", "purpose": "Reader wants more than two options", "inspection": {"path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/link-inspections/alternatives__quickbooks.txt", "sha256": "74bca72feec19613a1d82889cfdaeaab08f72d4dd051a6bb4eab787481d38187"}}
- {"source": "/compare/quickbooks-vs-freshbooks", "target": "/roundup/best-invoicing-apps-for-freelancers", "section": "Who Should Pick QuickBooks or FreshBooks", "anchor": "invoicing apps for freelancers", "purpose": "Freelancers who only need invoicing", "inspection": {"path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/link-inspections/roundup__best-invoicing-apps-for-freelancers.txt", "sha256": "c0af77eb617cd4b470a35fec05b830ef00337912bc3ae2b277839e3f6628fd90"}}

## Reviewer Guardrails (Must Respect)
- F-A1-1: The A1 answer and takeaway misstate where the cheaper product flips, contradicting research/calc/qb_vs_fb.out.json.
- F-A2-1: HIGH-profile retirement page lacks primary-source capture for the 401(k) side beyond the contribution limit, and its core recommendation is not sourced.
- F-A2-2: Planned title 'Annuity vs 401(k): How They Differ and When Each Fits' is the banned spliced two-clause headline.
- F-A2-3: Duplicate ruling for annuity-vs-401k does not name or rule on the closest existing comparisons that the coverage lookup and the repo surface.
- F-A3-2: Planned inbound link has no relevant section: the inspection shows no mention of Freedom Flex or Unlimited on that guide.
- F-A1-3: Decision on the QuickBooks pricing capture: sufficient for list prices and user caps only, under stated limits.
- F-X-1: Two accuracy notes: the defended-pages file exists, and C10's deferral rationale mixes a weak reason with a valid one.
- F-A3-1: The $750-per-quarter break-even is presented as a general rule but only holds at $24,000 of annual spend; the takeaway drops that condition and the $1,500 cap boundary.
- G-1: Extend flex_vs_unlimited.py and its saved output with the 12.5 percent-of-spend rule and the roughly $48,000 boundary before the WRITE evidence packet is built.
- G-2: Stale wording in contributionAndEvidence: A1 says '20 user/client combinations' (grid now 49); A2 'Sources:' sentence names only Investor.gov and the IRS contributions page though tc558 and the 401(k) plans page are now used.
- G-3: Do not state 401(k) fees, RMD age or catch-up dollar amounts on A2 unless sourced; early-withdrawal wording must follow tc558 (10 percent additional tax, exceptions, IRA distinction) and not extend Investor.gov's annuity text to 401(k)s.

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Include honest visible attribution matching `basis` (internal testing, internal modeling with visible assumptions + counterexample, anonymized approved client experience when selected, durable reader-survey facts when matched, and `(Tested YYYY)` ONLY when `runs:[{testedAt}]` is executed & eligible):
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-write",
  "route": "/compare/quickbooks-vs-freshbooks",
  "readerQuestion": "QuickBooks or FreshBooks: which costs less for my small business or freelance work? [PAA 3/6 on-topic (comparable software, what FreshBooks is, leaving QuickBooks); 3/6 off-topic: old QuickBooks versions, CPAs, IRS; ac 4/25 which-is-better question completions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/approval-manifest.json",
      "sha256": "e0ffc7e439ee1f9b8516f8272096743ec98675e2d0931cc12efcb9f32c2ec7f4"
    },
    "review": {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/chart-review.json",
      "sha256": "edd5b6412602730c02214de23d8d69f06ee3782c19e0846e7744e6cf4a2dfb93"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "Existing comparison template: opening answer, then side-by-side table, then modeled/sourced analysis",
    "reason": "The reader's decision turns on finite, sourced thresholds; a scannable table plus a worked break-even answers it without a widget",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "The decision has a small number of discrete cases (plan tiers or scenario rows); a static grid shows every case and the break-even, whereas a calculator would only restate the same finite table"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "No sequence or changing assumption needs motion; static table is faster to scan"
    }
  },
  "basis": "calculated",
  "decisionGap": "Readers cannot see where the cheaper product flips as users and billable clients change; generic comparisons list plans but not the break-even by team size and client count.",
  "finding": "At monthly list prices, FreshBooks costs less for 1 user with up to 5 billable clients, for 2 users at any client count, for 3 users up to 50 clients and for 4 or more users at any client count. QuickBooks Online costs less for 1 user with 6 or more clients and for exactly 3 users with 51 or more clients. QuickBooks also has a Free plan (1 user, 2 invoices a month) that is $0.",
  "conditions": "Price-only model on monthly list prices checked 2026-11-16, promotions excluded, FreshBooks Select (quote-based) excluded, features not scored, FreshBooks Team Members add-on ($11 a month per user) assumed to apply to every user beyond the first, QuickBooks priced by its published user cap.",
  "whatWouldChange": "A change to QuickBooks tier prices or user caps, FreshBooks plan prices, client caps or the Team Members add-on price; promotions; or a reader who needs features the price model does not score.",
  "caseSelection": {
    "path": "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/quickbooks-vs-freshbooks/cases.json",
    "sha256": "e7f0de0df564378e5a3af86168f4b53810cd5931f9db73b9e7d0727827ea2748"
  },
  "caseDecisions": "cases.json returned 8 candidates, none relevant to a small-business accounting price comparison (no approved record about QuickBooks, FreshBooks or accounting software). None used; no client-conversation claim is made.",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/brief.md",
      "sha256": "40ad467d7a5d5e0635a93f783dc85563d18370711ba5416cb7716316dabd8af7"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/coverage-lookup.txt",
      "sha256": "f2a59427ff12ce1b7250c9468f60096b08f4f2a8102459de6464c23148ae4b57"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/keyword-volumes.json",
      "sha256": "c22e6fd475a66768608ab95050db5022698c857d1fb4f525b5a51b25f76f4de8"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/serp.json",
      "sha256": "db14f9e5ff96ddf172e40457aeffabc271d75228d3b647fe5e2793cca04fd28d"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/quickbooks-pricing.txt",
      "sha256": "a9a8cf2c4f854175ed1c68b1437905b6e9a18c2353b2665722386ae1bb155b9e"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/freshbooks-pricing.txt",
      "sha256": "5510f8965e07fdb6711893795d3cdd3702b4caae5903eed6a6746df92bfcdbfc"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/calc/qb_vs_fb.py",
      "sha256": "b1138243010b357936465a47ca5c5ae457857d64570a87b5a846cb55c9eb1a2f"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/calc/qb_vs_fb.out.json",
      "sha256": "70eada5621505957d2480c918699f64010d7c5b30d127026b18684a861b5ff42"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/ac-quickbooks-vs-freshbooks.csv",
      "sha256": "a259ee202623acd48889b77f358c34926aa785c5f69a0f864b59602380cbe1f2"
    },
    {
      "path": "src/data/alternatives.json",
      "sha256": "543061f27e627d0446ef6f20cdcb4516756ecbd2f6df80af0af0583e5f45eb59"
    }
  ],
  "method": "Python model (model.py): monthly list price of QuickBooks Online by user cap versus FreshBooks by billable-client cap plus $11 per extra user, over a 7 user-count by 7 client-count grid (49 combinations), plus a scan of all user counts 1 to 25 at tier edges. Attribution on page: internal cost modeling, with vendor list prices as sourced inputs.",
  "units": "USD per month (monthly list price, billed monthly)",
  "limitations": "Price-only. Promotions excluded. FreshBooks extra-user add-on assumption. QuickBooks pricing capture is a summary used only for list prices and user caps; the page cites the QuickBooks pricing page and quotes nothing from it. No feature, accuracy, support or integration comparison.",
  "counterexample": "At 3 users and 51 or more billable clients, QuickBooks Essentials ($85) beats FreshBooks Premium plus two Team Members ($92); at 1 user with 5 or fewer clients FreshBooks Lite ($23) beats QuickBooks Simple Start ($38), and QuickBooks Free ($0) beats both for a single user sending at most 2 invoices a month.",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/quickbooks-vs-freshbooks/model.py",
      "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/quickbooks-vs-freshbooks/output.json"
    ],
    "code": {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/quickbooks-vs-freshbooks/model.py",
      "sha256": "ac12d2c58efb6ad2925bf2e402ac994b3c91c38384dff6992062fa19e039296b"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/quickbooks-pricing.txt",
        "sha256": "a9a8cf2c4f854175ed1c68b1437905b6e9a18c2353b2665722386ae1bb155b9e"
      },
      {
        "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/freshbooks-pricing.txt",
        "sha256": "5510f8965e07fdb6711893795d3cdd3702b4caae5903eed6a6746df92bfcdbfc"
      },
      {
        "path": "src/data/alternatives.json",
        "sha256": "543061f27e627d0446ef6f20cdcb4516756ecbd2f6df80af0af0583e5f45eb59"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/quickbooks-vs-freshbooks/output.json",
      "sha256": "fe3d59680ef2aac673ade7a24968efcce7d4c1535a3f478d5436255bbd7a5b97"
    }
  },
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "evidence/quickbooks-vs-freshbooks/model.py",
      "evidence/quickbooks-vs-freshbooks/output.json"
    ],
    "scopeAndLimits": "List-price model over 49 user/client combinations; price only; QuickBooks inputs limited to list prices and user caps.",
    "publicMethod": "On-page formula and grid in 'Monthly Cost by Number of Users and Clients', with links to both pricing pages.",
    "placement": "introText second paragraph, the cost-grid section and the verdict"
  },
  "takeaway": {
    "conclusion": "Price answer, not a feature verdict: FreshBooks cheaper for 1 user up to 5 clients, 2 users at any count, 3 users up to 50 clients, 4+ users at any count; QuickBooks Online cheaper for 1 user with 6+ clients and 3 users with 51+ clients; QuickBooks Free beats both for 1 user sending at most 2 invoices a month.",
    "appliesTo": "Small businesses and freelancers choosing between the two on monthly list price",
    "recordIds": [
      "output.json"
    ],
    "basis": "calculated",
    "changeCondition": "A change to QuickBooks tier prices or user caps, FreshBooks plan prices, client caps or the Team Members add-on price; promotions; or a reader who needs features the price model does not score."
  }
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/mindmap-pass/runs/2026-11-16-comparison/brief.md`
```
Source: comparison candidate miner for https://www.themodernwallet.com. Each item is an X-vs-Y, alternatives, successor-vs-predecessor or objective roundup candidate mined from entities this site already covers, and already checked against the site's pages: NEW = no page covers it; PARTIAL = an existing page covers it in passing (enrich that page, never a duplicate). Comparison rows use the `comparison table/database` format; roundups are objective and the business is never a ranked option (`.claude/commands/_roundup-blend.md` §3).
Unattended run: save the chart to `reports/mindmap-pass/2026-11-16-comparison.md` (this exact name, so it never collides with another mindmap run today), treat the Phase 0 manifest as approved, and continue to Phase 9 without stopping.
Topic-selection priority: realistic organic-click growth; do not infer a lead-generation goal.

Candidates (format / A / B / segment / primary keyword / proposed slug / coverage):
1. versus | Chime | SoFi | general | chime vs sofi | chime-vs-sofi | NEW
2. versus | QuickBooks | FreshBooks | small business | quickbooks vs freshbooks | quickbooks-vs-freshbooks | NEW (FreshBooks only named in roundups-self-employed.ts)
3. versus | Acorns | Robinhood | general | acorns vs robinhood | acorns-vs-robinhood | NEW
4. versus | Webull | Fidelity | general | webull vs fidelity | webull-vs-fidelity | NEW (robinhood-vs-fidelity, robinhood-vs-webull exist)
5. versus | Wealthfront | Vanguard | general | wealthfront vs vanguard | wealthfront-vs-vanguard | NEW (betterment-vs-wealthfront exists)
6. versus | Annuity | 401(k) | retirement | annuity vs 401k | annuity-vs-401k | NEW
7. versus | Series I Bonds | High-Yield Savings Account | general | i bonds vs high yield savings | series-i-bonds-vs-hysa | NEW (i-bonds-vs-tips, i-bonds-vs-ee-bonds exist)
8. versus | Chase Freedom Flex | Chase Freedom Unlimited | general | chase freedom flex vs unlimited | chase-freedom-flex-vs-unlimited | NEW
9. versus | Capital One 360 | Ally Bank | general | capital one 360 vs ally | capital-one-360-vs-ally | NEW (ally-bank-vs-marcus dropped/cached)
10. versus | Xero | QuickBooks | small business | xero vs quickbooks | xero-vs-quickbooks | NEW
11. versus | Debt consolidation loan | Balance transfer card | general | debt consolidation vs balance transfer | debt-consolidation-vs-balance-transfer | PARTIAL (section "Debt consolidation loan vs. balance transfer credit card" in src/data/guides.ts; balance-transfer-vs-personal-loan was dropped in cache 2026-10-19 for lack of sourced facts)

```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/coverage-lookup.txt`
```
coverage_lookup: 11 candidate(s) vs 831 repo pages / 846 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1192 past-chart lines

### /comparisons/chime-vs-sofi  — row - · create new content
keyword: chime vs sofi
reader question (new page intent): Which is better, Chime or SoFi?
lookup terms: chime sofi   format cues: vs

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /compare/sofi-invest-vs-robinhood  [in sitemap · src/data/comparisons.ts · topic match 0.5 on sofi · same format: vs]
    title: SoFi Invest vs Robinhood: Which One Actually Fits You?
    desc:  SoFi Invest vs Robinhood compared: IRA match rates, crypto access, fractional shares, and support, so beginner investors pick the right app to start with.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-09-30-robinhood.md [table] | 9 | **Link row — wire the new pages into the shipped Robinhood/AI-trading family.** The 2026-09-09 family and existing Robinhood comparisons (incl. robinhood-vs-webull, 980ad23) are the natural referrers for rows 3–8. 
- 2026-09-30-robinhood.md [exclusions] - **Already shipped (f28f0e2, 2026-09-09):** "robinhood agentic trading" (2,900) → `/guides/robinhood-agentic-trading-explained` (enriched by row 1, not recreated); "robinhood ai alternatives" → `/roundup/robinhood-agent
- 2026-10-11-tool-usage.md [table] | 1 | Lens 1 (tool usage, investing — 32 people, top tool). Persona: renter moving a $25k emergency fund to a 4.1% APY HYSA, on a phone. Walkthrough: typed "4.1" → field showed 41, result "$282,876 after 5 years at 41%";
- 2026-10-14-tool-usage.md [table] | 4 | Lens 1 (tool usage, investing — 72 people, top tool). Persona: renter moving $25,000 to a 4.1% APY HYSA, $500/mo, 5 yrs. Result "$8,911 interest earned" — quote: "my bank sends a 1099-INT and I pay tax on that, rig
- 2026-10-15-trend-lane-c.md [table] | Lens 3 (vs, off the lender cluster of top-10 queries). `mortgage broker vs lender` 1,300/mo KD 13 (DataForSEO); `mortgage broker vs bank` 390 KD 8; `is a mortgage broker worth it` 140; `mortgage broker vs direct lender
- 2026-11-09-competitor-9031ce2b2c89.md [table] | Lens 1 direct intent (competitor monitor: NerdWallet what-is-a-robo-advisor). Head 'what is a robo advisor / robo advisor': autocomplete estimate only, NOT measured (no provider keys). lookup: /roundup/best-robo-adviso
Commits naming the topic: none
Same run overlap: none

### /comparisons/quickbooks-vs-freshbooks  — row - · create new content
keyword: quickbooks vs freshbooks
reader question (new page intent): QuickBooks or FreshBooks?
lookup terms: quickbook freshbook   format cues: vs

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /alternatives/quickbooks  [in sitemap · src/data/alternatives.json · topic match 0.5 on quickbook]
    title: QuickBooks Alternatives 2026: Prices and Plans Compared
    desc:  QuickBooks alternatives for small business accounting: FreshBooks, Xero, Zoho Books, Wave and Zoho Invoice, with published prices and limits.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-09-05.md [table] | **Lens 1 — "write off their whole life" is the brief's core claim and the site has no self-employed deduction page.** "tax deductions for self employed" 2,900/mo 
```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/keyword-volumes.json`
```
{
 "rows": [
  {
   "keyword": "chime vs sofi",
   "volume": 590,
   "volume_low": 590,
   "volume_high": 590,
   "kd": "27",
   "cpc": "8.54",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "quickbooks vs freshbooks",
   "volume": 2400,
   "volume_low": 2400,
   "volume_high": 2400,
   "kd": "28",
   "cpc": "10.03",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "acorns vs robinhood",
   "volume": 480,
   "volume_low": 480,
   "volume_high": 480,
   "kd": "22",
   "cpc": "2.73",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "webull vs fidelity",
   "volume": 480,
   "volume_low": 480,
   "volume_high": 480,
   "kd": "20",
   "cpc": "16.83",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "wealthfront vs vanguard",
   "volume": 210,
   "volume_low": 210,
   "volume_high": 210,
   "kd": "12",
   "cpc": "4.72",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "annuity vs 401k",
   "volume": 1600,
   "volume_low": 1600,
   "volume_high": 1600,
   "kd": "24",
   "cpc": "1.47",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "i bonds vs high yield savings",
   "volume": 20,
   "volume_low": 20,
   "volume_high": 20,
   "kd": "0",
   "cpc": "0",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "chase freedom flex vs unlimited",
   "volume": 720,
   "volume_low": 720,
   "volume_high": 720,
   "kd": "36",
   "cpc": "4",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "capital one 360 vs ally",
   "volume": 20,
   "volume_low": 20,
   "volume_high": 20,
   "kd": "0",
   "cpc": "8.29",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "xero vs quickbooks",
   "volume": 2400,
   "volume_low": 2400,
   "volume_high": 2400,
   "kd": "50",
   "cpc": "16.75",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "debt consolidation vs balance transfer",
   "volume": 210,
   "volume_low": 210,
   "volume_high": 210,
   "kd": "38",
   "cpc": "15.22",
   "source": "semrush",
   "confidence": "high",
   "kd_source": "semrush",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  }
 ],
 "notes": [
  "volume: using semrush (quality order semrush > dataforseo)",
  "semrush returned volume for 11/11 phrases",
  "kd: using semrush (quality order semrush > dataforseo)",
  "Autocomplete: 11/11 rows corroborated live"
 
```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/serp.json`
```
{
 "rows": [
  {
   "keyword": "quickbooks vs freshbooks",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.youtube.com",
    "www.freshbooks.com",
    "bookkeeping-services.com",
    "stephsbooks.com",
    "www.business.com",
    "www.nerdwallet.com"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "steemit.com",
    "hostmerchantservices.com",
    "vencru.com",
    "ikeepapp.com",
    "medium.com",
    "buildframe.co",
    "rosettadigital.com",
    "viralhomebasedpursuit.com",
    "fitsmallbusiness.com"
   ],
   "major_domains": [],
   "forum_domains": [
    "medium.com"
   ],
   "serp_feature_mix": {
    "ai_overview": 1,
    "organic": 9,
    "people_also_ask": 1
   },
   "paa": [
    "What's comparable to QuickBooks?",
    "What is FreshBooks accounting software?",
    "Do old versions of QuickBooks still work?",
    "Why do CPAS not like QuickBooks Online?",
    "Why are people leaving QuickBooks?",
    "Can the IRS see your QuickBooks Online?"
   ],
   "related_searches": [],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "AI Overview present, cites www.youtube.com, www.freshbooks.com, bookkeeping-services.com, stephsbooks.com",
   "se_results_count": 66
  },
  {
   "keyword": "annuity vs 401k",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.annuity.org",
    "www.northwesternmutual.com",
    "www.fidelity.com",
    "www.youtube.com",
    "www.employeefiduciary.com",
    "smartasset.com"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "www.employeefiduciary.com",
    "www.thrivent.com",
    "titanwealthinternational.com",
    "www.nerdwallet.com",
    "www.carboncollective.co"
   ],
   "major_domains": [],
   "forum_domains": [],
   "serp_feature_mix": {
    "ai_overview": 1,
    "discussions_and_forums": 1,
    "images": 1,
    "organic": 7,
    "people_also_ask": 1,
    "related_searches": 1
   },
   "paa": [
    "How much would I expect to receive per month from a $100,000 annuity?",
    "How is an annuity taxed?",
    "Can I hold an annuity in my IRA?",
    "What are the cons of an annuity?",
    "Why do people say not to buy an annuity?",
    "Has anyone ever lost money in an annuity?"
   ],
   "related_searches": [
    "Annuity vs 401k reddit",
    "Annuity vs 401k pros and cons",
    "Annuity vs 401k taxes",
    "Annuity vs 401k vs IRA",
    "Convert 401k to annuity calculator",
    "Is converting 401k to annuity a good idea",
    "Annuity vs pension",
    "Benefits of rolling over a 401k to an annuity"
   ],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "AI Overview present, cites www.annuity.org, www.northwesternmutual.com, www.fidelity.com, www.youtube.com",
   "se_results_count": 130
  },
  {
   "keyword": "chase freedom flex vs unlimited",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.chase.com",
    "creditcards.chase.com",
    "www.cnbc.com",
    "www.youtube.com"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "joingerald.com",
    "bestcreditcardcomparison.com",
    "www.reddit.com",
    "www.instagram.com",
    "www.mypointslife.com",
    "cardcritics.com"
   ],
   "major_domains": [],
   "forum_domains": [
    "www.reddit.com"
   ],
   "serp_feature_mix": {
    "ai_overview":
```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/quickbooks-pricing.txt`
```
SOURCE_URL: https://quickbooks.intuit.com/pricing/
RETRIEVED_UTC: 2026-11-16T00:00:00Z (approx; WebFetch tool call during BUILD)
CAPTURE_LIMITATION: Direct fetch (curl, fetch_page.py browser) failed with HTTP/2 INTERNAL_ERROR / 502. The text below is the WebFetch tool's SUMMARY of the page, NOT verbatim page text. Treat as secondary capture; independently corroborated by src/data/alternatives.json (quickbooks entry, checked 2026-11-13).
---
Five QuickBooks Online plans (list/regular price; 50% off first 3 months promo shown on page):
Free $0, 1 user, no accountant access; income/expense tracking, up to 2 invoices a month, top 3 reports, 1 connected bank account, chat support.
Simple Start $38/mo list ($19 promo 3 months), 1 user, 2 accountants; expense categorization, automated bookkeeping, invoice payments via QuickBooks Payments; bill pay via ACH carries per-transaction fee above monthly allotments.
Essentials $85/mo list ($42.50 promo), 3 users, 2 accountants; enhanced reports, custom dashboards, bulk invoice creation (beta), employee time on invoices.
Plus $140/mo list ($70 promo), 5 users, 2 accountants; bank reconciliation help, budget planning, project profitability, inventory management, classes and locations up to 40.
Advanced $340/mo list ($170 promo), 25 users, 3 accountants; unlimited classes/locations, custom KPIs, user permissions, automated workflows, Excel sync, batch invoices, free 1099 e-filing, priority support.
Several features marked beta/new/limited.

```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/freshbooks-pricing.txt`
```
SOURCE_URL: https://www.freshbooks.com/pricing
RETRIEVED_UTC: 2026-11-16T08:08:02Z
{"url": "https://www.freshbooks.com/pricing", "method": "plain", "status": 200, "chars": 20304, "errors": []}
FreshBooks Pricing, Lite, Plus and Premium Packages - FreshBooks
Products
Get Paid
Invoices
Estimates
Proposals
Online Payments
Instant Payouts
Buy Now, Pay Later
Deliver Work
Projects
Time Tracking
Clients
Team Management
Payroll
Manage Finances
Expenses and Receipts
Mileage Tracking
Accounting
Reports
Bookkeeping
Financing
NEW
Bill Pay
NEW
More
Easy Switch
Claude Connector
ChatGPT
Your FreshBooks data, now in ChatGPT
Ask ChatGPT questions about your invoices, clients, or cash flow and get instant answers.
Learn more
Who It’s For
By Business Stage
Freelancers
Solopreneurs
Businesses With Employees
Businesses With Contractors
Small Businesses
By Industry
Marketing & Agencies
Creatives
Construction & Trades
Consulting
IT & Technology
Legal
Business & Prof. Services
For Accountants
FreshBooks Partner Program
Advisor Directory
Partner Resources
Your FreshBooks data, now in ChatGPT
Ask ChatGPT questions about your invoices, clients, or cash flow and get instant answers.
Learn more
Resources
Learning
Blog
Glossary
Free Tools
Invoice Generator
Business Name Generator
Business Loan Calculator
Markup calculator
Compare FreshBooks
FreshBooks vs QuickBooks
FreshBooks vs Wave
FreshBooks vs Xero
FreshBooks vs Harvest
FreshBooks vs HoneyBook
Free Templates
Invoice Templates
Accounting Templates
Estimate Templates
Featured Articles
How to Make an Invoice
Small Business Bookkeeping Guide
Featured Articles
How to Make an Invoice
Small Business Bookkeeping Guide
Your FreshBooks data, now in ChatGPT
Ask ChatGPT questions about your invoices, clients, or cash flow and get instant answers.
Learn more
Pricing
Contact Us
Login
Login
Buy Now & Save
Try It Free
Try It Free
Log In
Log In
Buy Now & Save
Log In
Log In
LIMITED TIME OFFER
80% off + Free onboarding support*
Choose a plan
Risk Free. 30-Day Money Back Guarantee.
Risk Free. 30-Day Money Back Guarantee.
*Offer Details
Monthly
Monthly
Yearly
Extra 10% Off
Show All Plans
Freelancers
Self-Employed
Business With Contractors
Business With Employees
Show All Plans
Lite
$
4
.60
USD/mo
80% Off for 4 Months
Was
$23.00
| Save $73.60
$
23
.00
USD/mo
Buy Now
Buy Now & Save
or Try It Free
Send invoices to
5 clients
Track expenses in real time
Create and send estimates
Get paid with credit and debit cards, ACH bank transfer, Apple Pay, Google Pay, and Buy Now, Pay Later
Generate tax-time reports
See all Features
For extra value, add:
Team Members
($11/mo per user)
Advanced Payments
($20/mo)
FreshBooks Payroll
($40/mo plus $6/mo per user)
Buy Now
Buy Now & Save
or Try It Free
Plus
⭐ Most Popular
$
8
.60
USD/mo
80% Off for 4 Months
Was
$43.00
| Save $137.60
$
43
.00
USD/mo
Buy Now
Buy Now & Save
or Try It Free
Send invoices to
50 clients
Track expenses in real time
Create estimates, proposals, and client retainers
Get paid with credit and debit cards, ACH bank transfer, Apple Pay, Google Pay, and Buy Now, Pay Later
Generate tax-time reports
Run financial and accounting reports
Expense receipt scanning
Give your accountant access
See all Features
For extra value, add:
Team Members
($11/mo per user)
Advanced Payments
($20/mo)
FreshBooks Payroll
($40/mo plus $6/mo per user)
Buy Now
Buy Now & Save
or Try It Free
Premium
$
14
.00
USD/mo
80% Off for 4 Months
Was
$70.00
| Save $224.00
$
70
.00
USD/mo
Buy Now
Buy Now & Save
or Try It Fre
```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/calc/qb_vs_fb.py`
```
#!/usr/bin/env python3
"""Monthly list-price cost: QuickBooks Online vs FreshBooks. Prices from vendor pricing pages (2026-11-16; QB corroborated by 2026-11-13 capture).
QB tiers by users: Simple Start 1 user $38, Essentials 3 users $85, Plus 5 users $140, Advanced 25 users $340.
FB tiers by billable clients: Lite 5 $23, Plus 50 $43, Premium unlimited $70; each extra team member $11/mo (add-on, FB seats beyond the owner).
Promos excluded. Feature differences ignored: this is a price-only model. QB Free plan ($0, 1 user, 2 invoices/mo) noted separately."""
import json, sys
QB=[(1,38),(3,85),(5,140),(25,340)]
FB=[(5,23),(50,43),(10**9,70)]
def qb(users):
    for cap,p in QB:
        if users<=cap: return p
def fb(clients, users):
    for cap,p in FB:
        if clients<=cap: base=p;break
    return base + 11*max(users-1,0)
rows=[]
for users in (1,2,3,4,5,10,25):
    for clients in (3,5,6,20,50,51,100):
        rows.append({"users":users,"billable_clients":clients,"quickbooks":qb(users),"freshbooks":fb(clients,users),"freshbooks_minus_quickbooks":fb(clients,users)-qb(users)})
json.dump(rows,open(sys.argv[1],"w"),indent=1)
for r in rows: print(r)

```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/calc/qb_vs_fb.out.json`
```
[
 {
  "users": 1,
  "billable_clients": 3,
  "quickbooks": 38,
  "freshbooks": 23,
  "freshbooks_minus_quickbooks": -15
 },
 {
  "users": 1,
  "billable_clients": 5,
  "quickbooks": 38,
  "freshbooks": 23,
  "freshbooks_minus_quickbooks": -15
 },
 {
  "users": 1,
  "billable_clients": 6,
  "quickbooks": 38,
  "freshbooks": 43,
  "freshbooks_minus_quickbooks": 5
 },
 {
  "users": 1,
  "billable_clients": 20,
  "quickbooks": 38,
  "freshbooks": 43,
  "freshbooks_minus_quickbooks": 5
 },
 {
  "users": 1,
  "billable_clients": 50,
  "quickbooks": 38,
  "freshbooks": 43,
  "freshbooks_minus_quickbooks": 5
 },
 {
  "users": 1,
  "billable_clients": 51,
  "quickbooks": 38,
  "freshbooks": 70,
  "freshbooks_minus_quickbooks": 32
 },
 {
  "users": 1,
  "billable_clients": 100,
  "quickbooks": 38,
  "freshbooks": 70,
  "freshbooks_minus_quickbooks": 32
 },
 {
  "users": 2,
  "billable_clients": 3,
  "quickbooks": 85,
  "freshbooks": 34,
  "freshbooks_minus_quickbooks": -51
 },
 {
  "users": 2,
  "billable_clients": 5,
  "quickbooks": 85,
  "freshbooks": 34,
  "freshbooks_minus_quickbooks": -51
 },
 {
  "users": 2,
  "billable_clients": 6,
  "quickbooks": 85,
  "freshbooks": 54,
  "freshbooks_minus_quickbooks": -31
 },
 {
  "users": 2,
  "billable_clients": 20,
  "quickbooks": 85,
  "freshbooks": 54,
  "freshbooks_minus_quickbooks": -31
 },
 {
  "users": 2,
  "billable_clients": 50,
  "quickbooks": 85,
  "freshbooks": 54,
  "freshbooks_minus_quickbooks": -31
 },
 {
  "users": 2,
  "billable_clients": 51,
  "quickbooks": 85,
  "freshbooks": 81,
  "freshbooks_minus_quickbooks": -4
 },
 {
  "users": 2,
  "billable_clients": 100,
  "quickbooks": 85,
  "freshbooks": 81,
  "freshbooks_minus_quickbooks": -4
 },
 {
  "users": 3,
  "billable_clients": 3,
  "quickbooks": 85,
  "freshbooks": 45,
  "freshbooks_minus_quickbooks": -40
 },
 {
  "users": 3,
  "billable_clients": 5,
  "quickbooks": 85,
  "freshbooks": 45,
  "freshbooks_minus_quickbooks": -40
 },
 {
  "users": 3,
  "billable_clients": 6,
  "quickbooks": 85,
  "freshbooks": 65,
  "freshbooks_minus_quickbooks": -20
 },
 {
  "users": 3,
  "billable_clients": 20,
  "quickbooks": 85,
  "freshbooks": 65,
  "freshbooks_minus_quickbooks": -20
 },
 {
  "users": 3,
  "billable_clients": 50,
  "quickbooks": 85,
  "freshbooks": 65,
  "freshbooks_minus_quickbooks": -20
 },
 {
  "users": 3,
  "billable_clients": 51,
  "quickbooks": 85,
  "freshbooks": 92,
  "freshbooks_minus_quickbooks": 7
 },
 {
  "users": 3,
  "billable_clients": 100,
  "quickbooks": 85,
  "freshbooks": 92,
  "freshbooks_minus_quickbooks": 7
 },
 {
  "users": 4,
  "billable_clients": 3,
  "quickbooks": 140,
  "freshbooks": 56,
  "freshbooks_minus_quickbooks": -84
 },
 {
  "users": 4,
  "billable_clients": 5,
  "quickbooks": 140,
  "freshbooks": 56,
  "freshbooks_minus_quickbooks": -84
 },
 {
  "users": 4,
  "billable_clients": 6,
  "quickbooks": 140,
  "freshbooks": 76,
  "freshbooks_minus_quickbooks": -64
 },
 {
  "users": 4,
  "billable_clients": 20,
  "quickbooks": 140,
  "freshbooks": 76,
  "freshbooks_minus_quickbooks": -64
 },
 {
  "users": 4,
  "billable_clients": 50,
  "quickbooks": 140,
  "freshbooks": 76,
  "freshbooks_minus_quickbooks": -64
 },
 {
  "users": 4,
  "billable_clients": 51,
  "quickbooks": 140,
  "freshbooks": 103,
  "freshbooks_minus_quickbooks": -37
 },
 {
  "users": 4,
  "billable_clients": 100,
  "quickbooks": 140,
  "freshbooks": 103,
  "freshbooks_minus_quickbooks": -37
 },
 {
  "users": 5,
  "billable_clients": 
```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/ac-quickbooks-vs-freshbooks.csv`
```
seed,suggestion,via
quickbooks vs freshbooks,what quickbooks vs freshbooks reddit,question:what
quickbooks vs freshbooks,what quickbooks vs freshbooks is best,question:what
quickbooks vs freshbooks,what quickbooks vs freshbooks for small business,question:what
quickbooks vs freshbooks,what quickbooks vs freshbooks to use,question:what
quickbooks vs freshbooks,what's better quickbooks or freshbooks,question:what
quickbooks vs freshbooks,is freshbooks better than quickbooks,question:what
quickbooks vs freshbooks,difference between freshbooks and quickbooks,question:what
quickbooks vs freshbooks,what quickbooks vs freshbooks,question:what
quickbooks vs freshbooks,what quickbooks vs freshbooks vs xero,question:what
quickbooks vs freshbooks,how quickbooks vs freshbooks compare,question:how
quickbooks vs freshbooks,how quickbooks vs freshbooks works,question:how
quickbooks vs freshbooks,how quickbooks vs freshbooks comparison,question:how
quickbooks vs freshbooks,how quickbooks vs freshbooks work together,question:how
quickbooks vs freshbooks,how quickbooks vs freshbooks,question:how
quickbooks vs freshbooks,how quickbooks vs freshbooks vs xero,question:how
quickbooks vs freshbooks,why quickbooks vs freshbooks reddit,question:why
quickbooks vs freshbooks,why quickbooks vs freshbooks is better,question:why
quickbooks vs freshbooks,why quickbooks vs freshbooks vs quickbooks,question:why
quickbooks vs freshbooks,why quickbooks vs freshbooks for small business,question:why
quickbooks vs freshbooks,why quickbooks vs freshbooks,question:why
quickbooks vs freshbooks,why quickbooks vs freshbooks vs xero,question:why
quickbooks vs freshbooks,is quickbooks vs freshbooks worth it,question:is
quickbooks vs freshbooks,is quickbooks vs freshbooks better for small business,question:is
quickbooks vs freshbooks,is quickbooks vs freshbooks good,question:is
quickbooks vs freshbooks,is quickbooks or freshbooks better,question:is
quickbooks vs freshbooks,is quickbooks and freshbooks the same,question:is
quickbooks vs freshbooks,is quickbooks vs freshbooks,question:is
quickbooks vs freshbooks,is quickbooks vs freshbooks vs xero,question:is
quickbooks vs freshbooks,does quickbooks vs freshbooks cost more,question:does
quickbooks vs freshbooks,does quickbooks vs freshbooks work together,question:does
quickbooks vs freshbooks,does quickbooks vs freshbooks work,question:does
quickbooks vs freshbooks,does quickbooks vs freshbooks cost,question:does
quickbooks vs freshbooks,does quickbooks vs freshbooks have a difference,question:does
quickbooks vs freshbooks,does quickbooks vs freshbooks,question:does
quickbooks vs freshbooks,does quickbooks vs freshbooks vs xero,question:does
quickbooks vs freshbooks,can quickbooks vs freshbooks compare,question:can
quickbooks vs freshbooks,can quickbooks vs freshbooks work together,question:can
quickbooks vs freshbooks,can quickbooks vs freshbooks do payroll,question:can
quickbooks vs freshbooks,can quickbooks vs freshbooks be used together,question:can
quickbooks vs freshbooks,can quickbooks vs freshbooks,question:can
quickbooks vs freshbooks,can quickbooks vs freshbooks vs xero,question:can
quickbooks vs freshbooks,should quickbooks vs freshbooks be the same,question:should
quickbooks vs freshbooks,should quickbooks vs freshbooks be used,question:should
quickbooks vs freshbooks,should quickbooks vs freshbooks be the best,question:should
quickbooks vs freshbooks,should quickbooks vs freshbooks,question:should
quickbooks vs freshbook
```
### `src/data/alternatives.json`
```
[
  {
    "slug": "quickbooks",
    "product": "QuickBooks",
    "officialUrl": "https://quickbooks.intuit.com/",
    "title": "QuickBooks Alternatives 2026: Prices and Plans Compared",
    "h1": "QuickBooks Alternatives 2026: Prices, Plans and Limits Compared",
    "metaDescription": "QuickBooks alternatives for small business accounting: FreshBooks, Xero, Zoho Books, Wave and Zoho Invoice, with published prices and limits.",
    "published": "2026-11-13",
    "updated": "2026-11-13",
    "intro": "The main QuickBooks alternatives are FreshBooks, Xero, Zoho Books, Wave and Zoho Invoice, and the right pick depends on how many people need a login, how many clients or invoices you bill, and whether your accountant needs to work in the same file. This page covers QuickBooks alternatives for small businesses and freelancers, using each company's published prices.\n\nThe subject is [QuickBooks](https://quickbooks.intuit.com/) Online, which Intuit sells in five tiers, from a free plan to a $340 a month Advanced plan. The alternatives price differently: FreshBooks by billable clients, Xero and Zoho Books by plan tier, and Wave by card-payment fees on its free plan. The page lists what each provider publishes.\n\nFor context on the wider category, see our [roundup of accounting software for freelancers](/roundup/best-accounting-software-for-freelancers/) and the [side-by-side comparison hub](/compare/).",
    "tableTitle": "QuickBooks and alternatives: published prices",
    "tableNote": "Prices from each provider's own website, checked November 13, 2026. Regular prices are shown; first-months promotions are noted separately and change often.",
    "tableColumns": [
      "Product",
      "Fees and pricing",
      "Best fit"
    ],
    "rows": [
      {
        "product": "QuickBooks Online",
        "pricing": "Free plan ($0, 1 user, 2 invoices a month); Simple Start $38/mo (1 user); Essentials $85/mo (3 users); Plus $140/mo (5 users); Advanced $340/mo (25 users). Regular prices; 50% off for the first 3 months is advertised for new paid plans",
        "bestFit": "Fits businesses that want a widely used platform their accountant likely already knows, with tiers up to 25 users",
        "subject": true
      },
      {
        "product": "FreshBooks",
        "pricing": "Lite $23/mo (5 billable clients); Plus $43/mo (50 clients); Premium $70/mo (unlimited clients); Select is quote-based with no public price. Team members $11/mo each as an add-on. Regular prices; 80% off for the first 4 months is advertised",
        "bestFit": "Fits freelancers and service businesses whose cost should follow client count"
      },
      {
        "product": "Xero",
        "pricing": "Early $27/mo (20 invoices and quotes, 5 bills); Growing $59/mo; Established $97/mo. Regular prices; 80% off for the first 3 months is advertised for new US customers",
        "bestFit": "Fits small businesses that want bank reconciliation and forecasting on every plan"
      },
      {
        "product": "Zoho Books",
        "pricing": "Free $0 (1 user plus 1 accountant, 1,000 invoices a year); Standard $20/mo ($15 billed annually, 3 users); Professional $50/mo ($40 annually, 5 users); Premium $70/mo ($60 annually, 10 users); Elite $150/mo ($120 annually, 10 users); Ultimate $275/mo ($240 annually, 15 users)",
        "bestFit": "Fits small businesses that want a free entry plan and a long ladder of paid tiers"
      },
      {
        "product": "Wave",
        "pricing": "Star
```

## CLOSED FACT LIST (A1: QuickBooks vs FreshBooks). Check date for every price: 2026-11-16. Label prices "monthly list price, checked 2026-11-16".
Option names: optionA "QuickBooks Online", optionB "FreshBooks". Title (approved): "QuickBooks vs FreshBooks: Price by Users and Clients". Primary keyword: quickbooks vs freshbooks. Slug: quickbooks-vs-freshbooks.

QuickBooks Online (source: https://quickbooks.intuit.com/pricing/ ; list prices and user caps ONLY; quote nothing from QuickBooks; make NO QuickBooks feature, promotion, support or accountant-access claim; do not describe what QuickBooks plans include beyond price and user cap and the Free plan's 1 user and 2 invoices a month):
- Free: $0, 1 user, up to 2 invoices a month.
- Simple Start: $38 a month list price, 1 user.
- Essentials: $85 a month list price, up to 3 users.
- Plus: $140 a month list price, up to 5 users.
- Advanced: $340 a month list price, up to 25 users.
- Cite as "list price, checked 2026-11-16" and link https://quickbooks.intuit.com/pricing/ on the destination words "QuickBooks pricing page".

FreshBooks (source: https://www.freshbooks.com/pricing , captured verbatim 2026-11-16):
- Lite: $23 a month list price (shown as $23.00 USD/mo, "Was $23.00" before an advertised 80% off for 4 months). Send invoices to 5 clients; track expenses; create and send estimates; get paid by card, ACH bank transfer, Apple Pay, Google Pay and Buy Now, Pay Later; tax-time reports.
- Plus: $43 a month list price. Send invoices to 50 clients; adds proposals and client retainers, financial and accounting reports, expense receipt scanning, and accountant access.
- Premium: $70 a month list price. Unlimited clients; adds project profitability and customized email templates; bill receipt scanning with line items.
- Select: no public price ("Let's Talk"/talk to a consultant); unlimited clients; includes 2 Team Member accounts at no extra charge; Advanced Payments included; lower credit card transaction fees and capped ACH fees; dedicated phone support.
- Team Members add-on: $11 a month per user on Lite, Plus and Premium. Advanced Payments add-on: $20 a month on Lite, Plus and Premium. FreshBooks Payroll: $40 a month plus $6 a month per user.
- FreshBooks advertises a limited-time 80% off for 4 months and a 30-day free trial; every figure on this page excludes promotions. Say promotions are excluded; do not state any QuickBooks promotion.

MODEL (basis calculated; attribution wording: "In our internal cost modeling, we compared the monthly list prices of both products across 49 combinations of users and billable clients ..."; vendor prices are sourced inputs, not our measurements):
- Formula: QuickBooks cost = list price of the cheapest QuickBooks plan whose user cap covers the number of users (1 user: Simple Start $38; 2 to 3 users: Essentials $85; 4 to 5 users: Plus $140; 6 to 25 users: Advanced $340). FreshBooks cost = base plan for the client count (up to 5 clients: Lite $23; 6 to 50: Plus $43; 51 or more: Premium $70) plus $11 times (users minus 1).
- Assumption: each user beyond the first needs a paid FreshBooks Team Member seat at $11 a month. Price-only: features are not scored. QuickBooks Free and FreshBooks Select are not in the grid.
- 49 combinations: users 1, 2, 3, 4, 5, 10, 25 by billable clients 3, 5, 6, 20, 50, 51, 100. Cells show QB = QuickBooks Online, FB = FreshBooks, in dollars a month:
| Users | 3 clients | 5 clients | 6 clients | 20 clients | 50 clients | 51 clients | 100 clients |
|---|---|---|---|---|---|---|---|
| 1 | QB $38 / FB $23 | QB $38 / FB $23 | QB $38 / FB $43 | QB $38 / FB $43 | QB $38 / FB $43 | QB $38 / FB $70 | QB $38 / FB $70 |
| 2 | QB $85 / FB $34 | QB $85 / FB $34 | QB $85 / FB $54 | QB $85 / FB $54 | QB $85 / FB $54 | QB $85 / FB $81 | QB $85 / FB $81 |
| 3 | QB $85 / FB $45 | QB $85 / FB $45 | QB $85 / FB $65 | QB $85 / FB $65 | QB $85 / FB $65 | QB $85 / FB $92 | QB $85 / FB $92 |
| 4 | QB $140 / FB $56 | QB $140 / FB $56 | QB $140 / FB $76 | QB $140 / FB $76 | QB $140 / FB $76 | QB $140 / FB $103 | QB $140 / FB $103 |
| 5 | QB $140 / FB $67 | QB $140 / FB $67 | QB $140 / FB $87 | QB $140 / FB $87 | QB $140 / FB $87 | QB $140 / FB $114 | QB $140 / FB $114 |
| 10 | QB $340 / FB $122 | QB $340 / FB $122 | QB $340 / FB $142 | QB $340 / FB $142 | QB $340 / FB $142 | QB $340 / FB $169 | QB $340 / FB $169 |
| 25 | QB $340 / FB $287 | QB $340 / FB $287 | QB $340 / FB $307 | QB $340 / FB $307 | QB $340 / FB $307 | QB $340 / FB $334 | QB $340 / FB $334 |
- Results (verified by script over all user counts 1 to 25): FreshBooks costs less for 1 user with up to 5 billable clients ($23 vs $38). QuickBooks Online costs less for 1 user with 6 or more clients ($38 vs $43 at 6 to 50 clients; $38 vs $70 at 51 or more). FreshBooks costs less for 2 users at every client count ($34 to $81 vs $85). For exactly 3 users FreshBooks costs less up to 50 clients ($45 to $65 vs $85) and QuickBooks costs less at 51 or more clients ($85 vs $92). FreshBooks costs less for 4 to 25 users at every client count. The QuickBooks Free plan ($0, 1 user, at most 2 invoices a month) costs less than both for one user who sends two or fewer invoices a month.
- Counterexample: 3 users and 51 or more billable clients: QuickBooks Essentials $85 beats FreshBooks Premium plus two Team Members $92. Another: 1 user with 6 to 50 clients: QuickBooks Simple Start $38 beats FreshBooks Plus $43.
- The two products bill by different units: QuickBooks by plan tier and user cap, FreshBooks by billable-client cap plus per-user seats.
- Limits to state on the page: price-only; promotions excluded; FreshBooks seat price assumed for every extra user; features, support and integrations are not scored; prices can change, so verify on each pricing page. What would change our answer: a price or cap change at either vendor, promotions, or needing features the model does not score.
- Do not say either product is "better" overall. Do not state anything about QuickBooks Online features, accountant tools, or promotions.

FAQ questions to answer (answer from this fact list only): "Is QuickBooks or FreshBooks cheaper for a freelancer?" ; "What is comparable to QuickBooks?" (answer with the FreshBooks pairing and link /alternatives/quickbooks/ for the full list; do not name other products' prices) ; "What is FreshBooks accounting software?" (billing built around clients: invoices, estimates, proposals, time tracking, expenses, projects, reports per its pricing page; plans priced by client cap) ; "Is there a free QuickBooks plan?" (Free: $0, 1 user, up to 2 invoices a month) ; "How much does adding a team member cost?" (FreshBooks $11 a month per extra user; QuickBooks changes tier at 1, 3, 5 and 25 users: $38, $85, $140, $340) ; "Do promotions change the answer?" (excluded; both pages advertise or may advertise discounts; verify on the pricing pages).
Reviewer guardrails binding: price answer, not a feature verdict; the opening answer must state every flip point correctly (1 user: FreshBooks up to 5 clients, QuickBooks from 6; 2 users: FreshBooks at any count; 3 users: FreshBooks up to 50 clients, QuickBooks from 51; 4 or more users: FreshBooks at any count).

INTERNAL ROUTES (only these): /alternatives/quickbooks/ (anchor like "other QuickBooks alternatives", in the "Who Should Pick QuickBooks or FreshBooks" section) ; /roundup/best-invoicing-apps-for-freelancers/ (anchor like "invoicing apps for freelancers", same section) ; /roundup/best-accounting-software-for-freelancers/ ; /self-employment-tax/ (calculatorLinks label "Self-Employment Tax Calculator"). relatedComparisons: none.
Approved outline order: section "QuickBooks vs FreshBooks at a Glance" content = the opening answer lives in introText; put a short "QuickBooks vs FreshBooks at a Glance" section FIRST in sections only if it adds new facts (e.g. the flip points as a 4-item list), then "Published Plans and Monthly List Prices Side by Side" is the comparisonTable (tableHeading), then sections "Monthly Cost by Number of Users and Clients" (the 49-cell grid as a pipe table + formula + flip points), "What the Price Comparison Leaves Out", "Who Should Pick QuickBooks or FreshBooks" (who this is not for, what would change our answer, links). verdictHeading "Our Takeaway for QuickBooks vs FreshBooks". Final body sentence of the last section is a concrete next action.

## WRITER RULES FOR THIS PAGE (binding; override anything above that conflicts)
- Output contract: the comparison page object in the system prompt. Depth floor 1,500 body words (introText + verdict + sections + FAQ answers), no filler.
- register: operator. page type: comparison. medium: text + comparison table.
- Anything not on the CLOSED FACT LIST you do not know. Never invent a price, limit, date, benchmark, URL or testing result. If something is unpublished, say it is unpublished.
- No TESTED language. No "we tested". Original work is our internal cost/analysis modeling only where the packet says so.
- Internal links allowed: only the routes listed under INTERNAL ROUTES. External links: only the URLs in the allowed-urls file.
