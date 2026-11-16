# Approved Page Assignment: `/compare/chase-freedom-flex-vs-unlimited` (`chase-freedom-flex-vs-unlimited`)
- **Action ID:** `A3` (create new content)
- **Title:** Chase Freedom Flex vs Unlimited: Which Earns More?
- **Page Type / Format / Medium:** comparison | comparison table/database | text + comparison table
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** Which earns more cash back, Chase Freedom Flex or Freedom Unlimited? [PAA 5/6 on-topic (which is better, both cards, perks); 1/6 off-topic: hardest Chase card; ac 4/14 "what's better"/"is ... better" completions]
- **Working Answer (Col 11):** Freedom Flex earns more cash back only when your spend in its activated 5% rotating category (up to $1,500 a quarter) is at least 12.5% of your total annual spend; otherwise Freedom Unlimited earns more because it pays 1.5% instead of 1% on everything else; at about $48,000 or more of total annual spend Flex cannot beat Unlimited even with the full $1,500 every quarter; both pay 5% on Chase Travel and 3% on dining and drugstores; shape: pick with break-even.
- **Answer Placement (Col 12):** section 1: "Chase Freedom Flex vs Unlimited in One Answer"

## Demand & Differentiation Context
- **Problem / Gap:** lookup: /roundup/best-cash-back-credit-cards - many-card list, not this pairing. Lens 1 direct intent (brief candidate 8). "chase freedom flex vs unlimited" 720/mo KD 36 SEMRUSH; no head-to-head page; SERP winnable.
- **Keyword Evidence:** "Primary \"chase freedom flex vs unlimited\" 720/mo KD 36 (SEMRUSH, us, 2026-11-16, measured). Supporting autocomplete: \"what's better chase freedom flex or unlimited\", \"is chase freedom flex or unlimited better\", \"is chase freedom flex or unlimited easier to get\" (ac-chase-freedom-flex-vs.csv)."
- **Why New Page / Angle:** lookup: /roundup/best-cash-back-credit-cards (ranked list of many cards), /guides/chase-travel-portal-guide (how portal redemptions work) and /compare/bilt-rewards-vs-chase-ultimate-rewards (points programs); none compares these two Chase cards head to head. No commits touch this route. Independent duplicate review is the CHART-REVIEW stage. Existing mentions of Freedom Flex/Unlimited are only in best-cash-back-credit-cards, chase-travel-portal-worth-it and best-student-credit-cards.
- **Intent-Based Our Takeaway:** "Choose Freedom Unlimited if your spend is spread across ordinary purchases, your total annual spend is about $48,000 or more, or you will not track quarterly categories. Choose Freedom Flex only if the activated 5% category is at least 12.5% of your total annual spend and within the $1,500 quarterly cap (for example $750 a quarter on $24,000 a year). The answer changes if Chase changes rates, quarterly categories or the 15-month 0% APR; check chase.com for current terms. Attributed to our internal cost modeling with Chase published rates as sourced inputs; no claim is made about holding both cards together."

## Approved Section Outline
1. **Chase Freedom Flex vs Unlimited in One Answer** — Opening answer with the $750-per-quarter break-even.
2. **Earn Rates and Fees Side by Side** — Table from chase.com captures: annual fee $0, $200 bonus after $500 in 3 months, 0% intro APR 15 months then 18.49%-27.99% variable on both, 5% travel, 3% dining and drugstores, 1% vs 1.5% base, Flex 5% rotating on up to $1,500 per quarter; Flex page states no foreign transaction fee, the Unlimited page text captured does not state one so the page will not claim it.
3. **Annual Cash Back by Spending Pattern** — Our modeled scenarios, the 12.5%-of-spend break-even rule and a table at $24,000 and $48,000 total spend, including the not-activated counterexample.
4. **Who Should Pick Flex or Unlimited** — Boundaries, who this is not for, what would change our answer (rate or category changes).
5. **FAQs** — PAA/autocomplete questions answered from Chase pages; unanswerable items stated as such.

## Approved Internal Outbound Links
- {"source": "/compare/chase-freedom-flex-vs-unlimited", "target": "/roundup/best-cash-back-credit-cards", "section": "Who Should Pick Flex or Unlimited", "anchor": "best cash back credit cards", "purpose": "Reader wants other cards", "inspection": {"path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/link-inspections/roundup__best-cash-back-credit-cards.txt", "sha256": "34df3dc66b2eed94cc1d4d5f79cd236206ade224809f3c9ebe9a5f72d8bfbc4f"}}
- {"source": "/compare/chase-freedom-flex-vs-unlimited", "target": "/guides/chase-travel-portal-guide", "section": "Earn Rates and Fees Side by Side", "anchor": "Chase Travel portal guide", "purpose": "Reader wants how the 5% travel earn and portal work", "inspection": {"path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/link-inspections/guides__chase-travel-portal-guide.txt", "sha256": "38a917adf7d71750888e28dbe06664c9dac894bf67456fb43c477cfea7324af0"}}

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
  "route": "/compare/chase-freedom-flex-vs-unlimited",
  "readerQuestion": "Which earns more cash back, Chase Freedom Flex or Freedom Unlimited? [PAA 5/6 on-topic (which is better, both cards, perks); 1/6 off-topic: hardest Chase card; ac 4/14 \"what's better\"/\"is ... better\" completions]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/approval-manifest.json",
      "sha256": "e0ffc7e439ee1f9b8516f8272096743ec98675e2d0931cc12efcb9f32c2ec7f4"
    },
    "review": {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/chart-review.json",
      "sha256": "edd5b6412602730c02214de23d8d69f06ee3782c19e0846e7744e6cf4a2dfb93"
    },
    "actionId": "A3"
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
  "decisionGap": "Readers need the share of annual spend that must land in Freedom Flex's activated 5% rotating category before it beats Freedom Unlimited's flat 1.5%, and the total spend above which it cannot.",
  "finding": "Freedom Flex earns more cash back than Freedom Unlimited only when annual spend in the activated 5% rotating category (up to $1,500 a quarter) is more than 12.5% of total annual spend. At $24,000 of total spend that is $750 a quarter. At $48,000 or more of total annual spend Flex cannot beat Unlimited even with the full $1,500 in the category every quarter. Both cards pay 5% on Chase Travel and 3% on dining and drugstores.",
  "conditions": "Best-case-for-Flex assumptions: category activated every quarter, category spend matches the quarter's category exactly, no sign-up bonus counted, $0 annual fees, travel/dining/drugstore spend assumed zero because both cards pay the same. Rates as published on creditcards.chase.com 2026-11-16.",
  "whatWouldChange": "Chase changing the Flex 5% cap or rate, the Unlimited 1.5% base rate, the 1% Flex base rate, or the quarterly categories; spend that overlaps the 3% dining or drugstore rate; or a reader who values features other than cash back.",
  "caseSelection": {
    "path": "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/chase-freedom-flex-vs-unlimited/cases.json",
    "sha256": "1bfe045386c912b9ba3d5edeca64d8fe528ce2079efff1e3d47f7429e9aaf21b"
  },
  "caseDecisions": "cases.json returned candidates, none about credit cards or Chase. None used; no client-conversation claim is made.",
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
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/chase-freedom-flex.txt",
      "sha256": "cc6760d70cd12f1be373afb6beadda1a739fafc624b0c67f6937d74166c764a3"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/chase-freedom-unlimited.txt",
      "sha256": "310fc09d13d3d4f14d05318d8f63f7a4e3074f7d32b3e7a76000db91ccc6a854"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/ac-chase-freedom-flex-vs.csv",
      "sha256": "3c2e7a4b52e00869c71152e8a0dad8ed05ccd91e10479be781de506c60cb6a49"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/calc/flex_vs_unlimited_v2.py",
      "sha256": "7536cb46a8e560c3c71b87a3bc2b6416b1d4c5736ae738f87c47514c24b3f729"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/calc/flex_vs_unlimited_v2.out.json",
      "sha256": "93738dd3e82c4d6f7f143b42d6e8fc2bd8d4e5ad3003d2524bfc3191b56979ae"
    }
  ],
  "method": "Python model (model.py v2): Flex minus Unlimited = 0.16B - 0.005S, where B is quarterly category spend (<= $1,500) and S is total annual spend; Flex wins iff 4B > 12.5% of S, so only when S < $48,000. Scenarios at $24,000 and a break-even table by quarterly category spend. Attribution on page: internal cost modeling, with Chase published rates as sourced inputs.",
  "units": "USD per year of cash back; spend in USD",
  "limitations": "Assumes category spend matches the rotating category exactly (best case for Flex). Sign-up bonus, intro APR, balance-transfer fees and annual-fee differences excluded. Bonus category assumed not to overlap dining/drugstore/travel. No claim about holding both cards.",
  "counterexample": "A Flex holder who does not activate the quarterly category earns $120 a year less than Unlimited on $24,000 of spend; at $48,000 of total spend Flex ties Unlimited even with the full cap, and at $60,000 it trails by $60.",
  "execution": {
    "command": [
      "python3",
      "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/chase-freedom-flex-vs-unlimited/model.py",
      "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/chase-freedom-flex-vs-unlimited/output.json"
    ],
    "code": {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/chase-freedom-flex-vs-unlimited/model.py",
      "sha256": "7536cb46a8e560c3c71b87a3bc2b6416b1d4c5736ae738f87c47514c24b3f729"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/chase-freedom-flex.txt",
        "sha256": "cc6760d70cd12f1be373afb6beadda1a739fafc624b0c67f6937d74166c764a3"
      },
      {
        "path": "reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/chase-freedom-unlimited.txt",
        "sha256": "310fc09d13d3d4f14d05318d8f63f7a4e3074f7d32b3e7a76000db91ccc6a854"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/runs/2026-11-16-comparison/evidence/chase-freedom-flex-vs-unlimited/output.json",
      "sha256": "93738dd3e82c4d6f7f143b42d6e8fc2bd8d4e5ad3003d2524bfc3191b56979ae"
    }
  },
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "evidence/chase-freedom-flex-vs-unlimited/model.py",
      "evidence/chase-freedom-flex-vs-unlimited/output.json"
    ],
    "scopeAndLimits": "Annual cash-back model from published earn rates; best case for Flex; bonus, APR and fees excluded.",
    "publicMethod": "On-page formula, 12.5% rule and break-even tables in 'Annual Cash Back by Spending Pattern'.",
    "placement": "introText second paragraph, the modeling section and the verdict"
  },
  "takeaway": {
    "conclusion": "Choose Freedom Unlimited if spend is spread across ordinary purchases, total annual spend is $48,000 or more, or you will not track quarterly categories; choose Freedom Flex only if activated 5% category spend is more than 12.5% of total annual spend and within $1,500 a quarter.",
    "appliesTo": "Readers choosing between the two Chase cards on cash back",
    "recordIds": [
      "output.json"
    ],
    "basis": "calculated",
    "changeCondition": "Chase changing the Flex 5% cap or rate, the Unlimited 1.5% base rate, the 1% Flex base rate, or the quarterly categories; spend that overlaps the 3% dining or drugstore rate; or a reader who values features other than cash back."
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
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/chase-freedom-flex.txt`
```
SOURCE_URL: https://creditcards.chase.com/cash-back-credit-cards/freedom/flex
RETRIEVED_UTC: 2026-11-16T08:08:03Z
{"url": "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex", "method": "plain", "status": 200, "chars": 36803, "errors": []}
Chase Freedom Flex Credit Card | Chase.com
Skip to main content
Skip Side Menu
Side menu ends
Side menu ends
Opens Marketplace homepage in the same window
Opens Marketplace homepage in the same window
Sign in
Opens Chase account sign in within a new window
close navigation
Home
Opens Chase.com in a new window
Sign In
Opens Chase.com sign-in in a new window
Free Credit Score
Opens in a new window
EXPLORE PRODUCTS
Credit Cards
Credit Cards Home
Opens Chase Credit Cards page in the same window
Check for Offers
Opens Check for Offers page in the same window
Refer Friends
Opens in the same window
Card Finder
Opens in the same window
Browse Credit Cards
Featured Cards (9)
Opens Featured Cards page in the same window.
All Cards (43)
Opens All Cards page in the same window.
Newest Offers (16)
Opens Newest Offers page in the same window.
Cash Back (10)
Opens Cash Back page in the same window.
Balance Transfer (3)
Opens Balance Transfer page in the same window.
Travel (33)
Opens Travel page in the same window.
Business (11)
Opens Business page in the same window.
Rewards (41)
Opens Rewards page in the same window.
Airline (15)
Opens Airline page in the same window.
Hotel (12)
Opens Hotel page in the same window.
Dining (20)
Opens Dining page in the same window.
Credit Building
Opens Credit Building category page in the same window.
No Annual Fee (15)
Opens No Annual Fee page in the same window.
No Foreign Transaction Fee (32)
Opens No Foreign Transaction Fee page in the same window.
0% Intro APR (6)
Opens 0% Intro APR page in the same window.
Visa (35)
Opens Visa page in the same window.
MasterCard (8)
Opens MasterCard page in the same window.
New to Credit
Opens New to Credit page in the same window.
Wholesale Club Visa Card Acceptance (17)
Opens Wholesale Club Visa Card Acceptance page in the same window.
EMV Cards with Chip (43)
Opens EMV Cards with Chip page in the same window.
Card Brands
Chase Sapphire (3)
Opens Chase Sapphire brands page in the same window.
Chase Freedom (3)
Opens Chase Freedom brands page in the same window.
Slate (2)
Opens Slate brands page in the same window
Southwest (5)
Opens Southwest brands page in the same window.
United (6)
Opens United brands page in the same window.
Marriott Bonvoy (3)
Opens Marriott Bonvoy brands page in the same window.
British Airways/Avios (3)
Opens Avios brands page in the same window.
Disney (3)
Opens Disney brands page in the same window.
IHG (4)
Opens IHG brands page in the same window.
World of Hyatt (2)
Opens World of Hyatt brands page in the same window.
Chase for Business (5)
Opens Chase for Business page in the same window.
Amazon (2)
Opens Amazon brands page in the same window.
Air Canada
Opens Air Canada page in the same window.
DoorDash
Opens DoorDash page in the same window.
Instacart
Opens DoorDash page in the same window.
Compare Cards
Opens in the same window
Credit Card Education
Opens in a new window
More Chase Products
Checking
Opens Chase.com checking in a new window
Savings
Opens Chase.com savings in a new window
CDs
Opens Chase.com CDs in a new window
Auto
Opens Chase.com auto loans in a new window
Mortgage
Opens Chase.com mortgage in a new window
Home equity
Opens Chase.com home equity in a new window
Investing
Opens C
```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/sources/chase-freedom-unlimited.txt`
```
SOURCE_URL: https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited
RETRIEVED_UTC: 2026-11-16T08:08:04Z
{"url": "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited", "method": "plain", "status": 200, "chars": 18864, "errors": []}
Chase Freedom Unlimited Credit Card | Chase.com
Skip to main content
Sign in
Opens Chase account sign in within a new window
Home
Sign in
Opens in a new window
Free Credit Score
EXPLORE PRODUCTS
Credit Cards
▾
Credit Cards Home
Check for Offers
Refer Friends
Card Finder
Browse Credit Cards
Featured Cards (9)
All Cards (42)
Newest Offers (11)
Cash Back (10)
Balance Transfer (3)
Travel (32)
Business (11)
Rewards (40)
Airline (15)
Hotel (11)
Dining (12)
Credit Building
No Annual Fee (15)
No Foreign Transaction Fee (30)
0% Intro APR (6)
Visa (35)
MasterCard (7)
New to Credit
Wholesale Club Visa Card Acceptance (17)
EMV Cards with Chip (42)
Card Brands
Chase Sapphire (3)
Chase Freedom (3)
Slate (2)
Southwest (5)
United (6)
Marriott Bonvoy (3)
Avios (3)
Disney (3)
IHG (3)
World of Hyatt (2)
Chase for Business (5)
Amazon (2)
Aeroplan
DoorDash
Instacart
Compare Cards
Credit Card Education
More Chase Products
▾
Checking
Savings
CDs
Auto
Mortgage
Home equity
Investing
Business banking
Commercial banking
CONNECT WITH CHASE
Find ATM & Branch
Opens in a new window
Customer Service
Opens in a new window
Give Feedback
Opens in a new window
Schedule a meeting
Opens in a new window
About Chase
Opens in a new window
J.P. Morgan
Opens in a new window
JPMorgan Chase & Co.
Opens in a new window
Careers
Opens in a new window
SAFE Act: Chase Mortgage Loan Originators
Opens in a new window
Fair Lending
Opens in a new window
Chase Freedom Unlimited
®
Credit Card
Apply Now
Apply now
*
Offer Details
†
Pricing & Terms
Credit Cards home
Credit Cards home
Chase Freedom Unlimited
®
Credit Card
$200
bonus
*
1.5%
or more on all purchases
*
$0
annual fee
†
NEW CARDMEMBER OFFER
Earn a $200 bonus
Earn a $200 bonus after you spend $500 on purchases in the first 3 months from account opening.
*
AT A GLANCE
Unlimited 1.5% cash back is just the beginning
Earn unlimited 1.5% cash back or more on all purchases,
*
with 3% cash back on dining and at drugstores,
*
and 5% on Chase Travel
SM
,
*
and 1.5% on all other purchases.
*
APR
0% intro APR for 15 months from account opening on purchases and balance transfers.
†
After the intro period, a variable APR of 18.49%–27.99%.
†
Balance transfer fee applies, see pricing and terms for more details.
†
ANNUAL FEE
$0
†
Apply Now
*
Offer Details
†
Pricing & Terms
Cash Back Rewards & Benefits
NEW CARDMEMBER OFFER
Earn a $200 bonus
Earn a $200 bonus after you spend $500 on purchases in the first 3 months from account opening.
*
This product is available to you if you do not have this card and have not received a new cardmember bonus for this card in the past 24 months.
EARN REWARDS
Unlimited 1.5% cash back is just the beginning
Earn 3% on dining at restaurants, including takeout and eligible delivery services.
*
Earn 3% on drugstore purchases.
*
Earn 5% on travel purchased through Chase Travel
SM
.
*
Earn 1.5% on all other purchases.
*
INTRO OFFERS
Low intro APR
0% intro APR for 15 months from account opening on purchases and balance transfers.
†
After the intro period, a variable APR of 18.49%–27.99%.
†
Balance transfer fee applies, see pricing and terms for more details.
†
ANNUAL FEE
No annual fee
You won't have to pay an annual fee
†
for all the great features that come with your
```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/calc/flex_vs_unlimited.py`
```
#!/usr/bin/env python3
"""Annual cash back: Chase Freedom Flex vs Freedom Unlimited, from published earn rates.
Inputs (chase.com captures, 2026-11-16): Flex 5% on first $1,500/quarter in activated bonus categories (4% on top of 1%),
5% Chase Travel, 3% dining+drugstores, 1% other. Unlimited 5% Chase Travel, 3% dining+drugstores, 1.5% other.
Bonus-category spend is assumed to fully match the rotating category (best case for Flex). Both annual fees $0."""
import json, sys
def flex(travel, dd, bonus_q, other, activate=True):
    bonus_total = 0.0
    if activate:
        capped = min(bonus_q, 1500) * 4  # per quarter
        bonus_total = capped * 0.05 + (bonus_q - capped / 1) * 0 if False else 0
    # per-year, bonus_q = spend per quarter in the rotating category
    cap = min(bonus_q, 1500.0)
    bonus = (cap * 0.05 + (bonus_q - cap) * 0.01) * 4 if activate else bonus_q * 4 * 0.01
    return travel*0.05 + dd*0.03 + bonus + other*0.01
def unlimited(travel, dd, bonus_q, other):
    return travel*0.05 + dd*0.03 + bonus_q*4*0.015 + other*0.015
scen = {
 "no_bonus_category_spend_all_other": dict(travel=0, dd=0, bonus_q=0, other=24000),
 "bonus_1500_per_quarter_activated": dict(travel=0, dd=0, bonus_q=1500, other=18000),
 "bonus_600_per_quarter_activated": dict(travel=0, dd=0, bonus_q=600, other=21600),
 "bonus_1500_per_quarter_NOT_activated": dict(travel=0, dd=0, bonus_q=1500, other=18000, activate=False),
 "dining_drugstore_heavy_no_bonus": dict(travel=0, dd=9000, bonus_q=0, other=15000),
}
out = {}
for k, v in scen.items():
    act = v.pop("activate", True)
    f = flex(activate=act, **v); u = unlimited(**v)
    out[k] = {"inputs": {**v, "activated": act}, "flex_usd": round(f, 2), "unlimited_usd": round(u, 2), "flex_minus_unlimited_usd": round(f - u, 2)}
# break-even: quarterly bonus spend B (<=1500, activated) with other spend O=S-4B: Flex-Unlimited = 4*B*(0.05-0.015) + O*(0.01-0.015)
S = 24000
be = {}
for B in (0, 250, 500, 750, 1000, 1250, 1500):
    O = S - 4*B
    be[str(B)] = round(4*B*0.035 - O*0.005, 2)
out["breakeven_total_24000_by_quarterly_bonus_spend"] = be
out["breakeven_quarterly_bonus_spend_usd"] = round((S*0.005)/(4*0.035+4*0.005), 2)  # 4B*.035 = (S-4B)*.005
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(json.dumps(out, indent=1))

```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/calc/flex_vs_unlimited.out.json`
```
{
 "no_bonus_category_spend_all_other": {
  "inputs": {
   "travel": 0,
   "dd": 0,
   "bonus_q": 0,
   "other": 24000,
   "activated": true
  },
  "flex_usd": 240.0,
  "unlimited_usd": 360.0,
  "flex_minus_unlimited_usd": -120.0
 },
 "bonus_1500_per_quarter_activated": {
  "inputs": {
   "travel": 0,
   "dd": 0,
   "bonus_q": 1500,
   "other": 18000,
   "activated": true
  },
  "flex_usd": 480.0,
  "unlimited_usd": 360.0,
  "flex_minus_unlimited_usd": 120.0
 },
 "bonus_600_per_quarter_activated": {
  "inputs": {
   "travel": 0,
   "dd": 0,
   "bonus_q": 600,
   "other": 21600,
   "activated": true
  },
  "flex_usd": 336.0,
  "unlimited_usd": 360.0,
  "flex_minus_unlimited_usd": -24.0
 },
 "bonus_1500_per_quarter_NOT_activated": {
  "inputs": {
   "travel": 0,
   "dd": 0,
   "bonus_q": 1500,
   "other": 18000,
   "activated": false
  },
  "flex_usd": 240.0,
  "unlimited_usd": 360.0,
  "flex_minus_unlimited_usd": -120.0
 },
 "dining_drugstore_heavy_no_bonus": {
  "inputs": {
   "travel": 0,
   "dd": 9000,
   "bonus_q": 0,
   "other": 15000,
   "activated": true
  },
  "flex_usd": 420.0,
  "unlimited_usd": 495.0,
  "flex_minus_unlimited_usd": -75.0
 },
 "breakeven_total_24000_by_quarterly_bonus_spend": {
  "0": -120.0,
  "250": -80.0,
  "500": -40.0,
  "750": 0.0,
  "1000": 40.0,
  "1250": 80.0,
  "1500": 120.0
 },
 "breakeven_quarterly_bonus_spend_usd": 750.0
}
```
### `reports/mindmap-pass/runs/2026-11-16-comparison/research/ac-chase-freedom-flex-vs.csv`
```
seed,suggestion,via
chase freedom flex vs,what's better chase freedom flex or unlimited,question:what
chase freedom flex vs,chase freedom flex vs unlimited,question:what
chase freedom flex vs,chase freedom flex vs unlimited reddit,question:what
chase freedom flex vs,chase freedom flex vs sapphire preferred,question:what
chase freedom flex vs,chase freedom flex vs discover it,question:what
chase freedom flex vs,chase freedom flex vs capital one savor,question:what
chase freedom flex vs,chase freedom flex vs rise,question:what
chase freedom flex vs,chase freedom flex vs amex blue cash everyday,question:what
chase freedom flex vs,chase freedom flex vs discover it cash back,question:what
chase freedom flex vs,chase freedom flex vs slate,question:what
chase freedom flex vs,is chase freedom flex or unlimited better,question:is
chase freedom flex vs,is chase freedom flex or unlimited easier to get,question:is
chase freedom flex vs,is chase freedom unlimited vs flex,question:is
chase freedom flex vs,is chase freedom flex visa or mastercard,question:is

```

## CLOSED FACT LIST (A3: Chase Freedom Flex vs Chase Freedom Unlimited). Sources: creditcards.chase.com pages captured verbatim 2026-11-16. basis calculated (our internal cost modeling; Chase published rates are sourced inputs).
Option names: optionA "Chase Freedom Flex", optionB "Chase Freedom Unlimited". Approved title: "Chase Freedom Flex vs Unlimited: Which Earns More?". Primary keyword: chase freedom flex vs unlimited. Slug: chase-freedom-flex-vs-unlimited. Link the first mention of Chase Freedom Flex to https://creditcards.chase.com/cash-back-credit-cards/freedom/flex and deep-link "Chase pages" to the Flex and Unlimited pages. "Chase Freedom Unlimited" and "Chase Travel" are auto-linked at render time (plain text in prose).

Published terms (Chase pages, 2026-11-16):
- Both cards: $0 annual fee. New cardmember bonus: $200 after spending $500 on purchases in the first 3 months from account opening (available if you do not have the card and have not received a new cardmember bonus for it in the past 24 months, per the Flex page). 0% intro APR for 15 months from account opening on purchases and balance transfers; after that a variable APR of 18.49% to 27.99% (balance transfer fee applies). Rates can change: verify on the card pages.
- Both cards: 5% on travel purchased through Chase Travel; 3% on dining at restaurants including takeout and eligible delivery services; 3% on drugstore purchases.
- Freedom Flex: 5% cash back on up to $1,500 in combined purchases in rotating categories each quarter you activate; 1% on all other purchases. The Flex page states no foreign transaction fee.
- Freedom Unlimited: 1.5% on all other purchases (unlimited 1.5% cash back or more on all purchases). Do NOT make any foreign transaction fee claim about Freedom Unlimited (the captured Unlimited page text does not state one in its terms).
- Do not name specific rotating categories or quarters (they change); say categories rotate each quarter and must be activated, and link the Flex page for the current list.

MODEL (basis calculated; attribution wording: "In our internal cost modeling, we compared annual cash back on both cards ... Using Chase's published earn rates, we found ..."; state assumptions beside results):
- Assumptions: the 5% category is activated every quarter; spend in the category matches the quarter's category exactly (best case for Flex); no sign-up bonus counted; $0 annual fee on both; travel, dining and drugstore spend is left out because both cards pay the same rate (5%, 3%, 3%); every other dollar of spend earns Flex 1% and Unlimited 1.5%.
- Formula: Flex minus Unlimited per year = 0.16 times B minus 0.005 times S, where B is spend in the 5% category per quarter (up to $1,500) and S is total annual spend outside Chase Travel, dining and drugstores (those three pay both cards the same rate, so the page's 'total annual spend' means spend on everything else; state this definition once beside the rule). Equivalently Flex beats Unlimited only if annual spend in the activated 5% category (4B) is more than 12.5% of total annual spend (S).
- Break-even by total spend S (category spend needed): $12,000: $1,500 a year ($375 a quarter); $24,000: $3,000 a year ($750 a quarter); $36,000: $4,500 a year ($1,125 a quarter); $48,000: $6,000 a year ($1,500 a quarter, the cap, where Flex only ties); $60,000: $7,500 a year ($1,875 a quarter, above the $1,500 cap, so Flex cannot win).
- At $48,000 or more of total annual spend Flex cannot beat Unlimited even with the full $1,500 in the 5% category every quarter. At $48,000 and the full cap Flex ties Unlimited (difference $0). At $60,000 with the full cap Flex trails by $60.
- Maximum Flex advantage at the full $1,500 cap: $180 at $12,000 of spend, $120 at $24,000, $60 at $36,000, $0 at $48,000.
- $24,000 scenarios (annual cash back, Flex vs Unlimited, difference): no category spend: $240 vs $360 (Flex -$120); $600 a quarter in the category: $336 vs $360 (Flex -$24); $750 a quarter: $360 vs $360 ($0, break-even); $1,500 a quarter in the category: $480 vs $360 (Flex +$120); $1,500 a quarter but the category NOT activated: $240 vs $360 (Flex -$120).
- Break-even table at $24,000 of total spend by quarterly category spend: $0: -$120; $250: -$80; $500: -$40; $750: $0; $1,000: +$40; $1,250: +$80; $1,500: +$120 (Flex minus Unlimited, dollars a year).
- The $750-a-quarter break-even holds only at $24,000 of annual spend; the general rule is 12.5% of total annual spend, within the $1,500 quarterly cap.
- Counterexample: a Flex holder who does not activate the category earns $120 less than Unlimited on $24,000 of spend.
- Limits: sign-up bonus, intro APR and balance-transfer fees are excluded; 3% dining or drugstore spend that overlaps a bonus category is not modeled; no claim about holding both cards together; no claim about points transfer or other Chase cards.
- Takeaway: choose Freedom Unlimited if spend is spread across ordinary purchases, total annual spend is $48,000 or more, or you will not track quarterly categories. Choose Freedom Flex only if the activated 5% category is more than 12.5% of total annual spend and within the $1,500 quarterly cap (for example $750 a quarter on $24,000 a year, the tie point). The answer changes if Chase changes rates, categories, the cap or the 15-month 0% APR; check the Chase pages for current terms. Who this is not for: someone who wants other cards (link /roundup/best-cash-back-credit-cards/), or who needs travel-portal detail (link /guides/chase-travel-portal-guide/).

FAQ questions to answer (from this fact list only): "Which is better, Chase Freedom Flex or Freedom Unlimited?" ; "Do Freedom Flex and Freedom Unlimited both have no annual fee?" ; "Can I have both Chase Freedom Flex and Freedom Unlimited?" (do NOT answer from outside knowledge: say this page makes no claim about holding both and tell the reader to check the Chase pages and terms) ; "Do both cards earn 5% on Chase Travel?" ; "What is the intro APR on Freedom Flex and Freedom Unlimited?" ; "Do I have to activate the Freedom Flex 5% categories?" (yes, per Chase: activate each quarter) ; "Does Freedom Flex have a foreign transaction fee?" (Flex page states no foreign transaction fee; say nothing about Unlimited beyond tell the reader to check its terms).

INTERNAL ROUTES (only these): /roundup/best-cash-back-credit-cards/ (anchor "best cash back credit cards", in "Who Should Pick Flex or Unlimited") ; /guides/chase-travel-portal-guide/ (anchor "Chase Travel portal guide", in the "Earn Rates and Fees Side by Side" section) ; /guides/chase-travel-portal-worth-it/ ; /compare/bilt-rewards-vs-chase-ultimate-rewards/. relatedComparisons: ["bilt-rewards-vs-chase-ultimate-rewards"]. calculatorLinks: [].
Approved outline order: introText = "Chase Freedom Flex vs Unlimited in One Answer" (answer first, with the 12.5% rule and the $48,000 ceiling, not just the $750 figure); tableHeading "Earn Rates and Fees Side by Side" (the comparisonTable); sections: "Annual Cash Back by Spending Pattern" (formula, the $24,000 and $48,000 cases, break-even table as pipe tables, the not-activated counterexample), "Who Should Pick Flex or Unlimited" (who this is not for, what would change our answer, links). verdictHeading "Our Takeaway on Chase Freedom Flex vs Unlimited". Last body sentence: a concrete next action (for example add up a year of spend in each category and check the current quarter's categories on the Flex page).

## WRITER RULES FOR THIS PAGE (binding; override anything above that conflicts)
- Output contract: the comparison page object in the system prompt. Depth floor 1,500 body words (introText + verdict + sections + FAQ answers), no filler.
- register: operator. page type: comparison. medium: text + comparison table.
- Anything not on the CLOSED FACT LIST you do not know. Never invent a price, limit, date, benchmark, URL or testing result. If something is unpublished, say it is unpublished.
- No TESTED language. No "we tested". Original work is our internal cost/analysis modeling only where the packet says so.
- Internal links allowed: only the routes listed under INTERNAL ROUTES. External links: only the URLs in the allowed-urls file.
