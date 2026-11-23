# Approved Page Assignment: `/compare/ssdi-vs-ssi` (`ssdi-vs-ssi`)
- **Action ID:** `A3` (create new content)
- **Title:** SSDI vs SSI: Eligibility, Work Credits and Limits
- **Page Type / Format / Medium:** comparison | comparison table/database - head-to-head comparison with finite rows, no sourced inputs for a calculator | text + comparison table
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What is the difference between SSDI and SSI? [PAA 0/0; ac 11/57 question completions: what is ssdi and ssi difference, which is better ssdi or ssi, is ssdi and ssi the same (difference/pick pattern)]
- **Working Answer (Col 11):** SSDI pays disabled workers who earned enough Social Security work credits and has no resource test; SSI is a needs-based program with income and resource limits (resources $2,000 individual, $3,000 couple per 20 CFR 416.1205) that also covers age 65+ and blind people; a person can qualify for both. Shape: pick with boundary.
- **Answer Placement (Col 12):** Section 1: SSDI vs SSI at a Glance

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent (brief candidate). 'ssdi vs ssi': 18,100/mo KD 6 (DataForSEO 2026-11-23, us); variant 'difference between ssdi and ssi' 4,400 KD 14. lookup: no same-intent page; Coverage lookup found only ssi-and-inheritance, 2027-ssdi-cola and ssi-increase-2027, each about a single program's amounts or inheritance, none the head-to-head eligibility comparison. SERP: Page one: hcplaw.com, rite4justice.com, niperlaw.com, ginsburglawgroup.com, blossomsca.com, all disability-law firms; no AI Overview; no PAA returned. No CFR-sourced comparison table.
- **Keyword Evidence:** "Primary 'ssdi vs ssi': 18,100/mo KD 6 (DataForSEO 2026-11-23, us); variant 'difference between ssdi and ssi' 4,400 KD 14. Provider: DataForSEO (SEMRUSH HTTP 403), source=dataforseo, kd_source=dataforseo (modeled KD, hint only), checked 2026-11-23, us. Autocomplete corroborated. Raw: research/keyword-volumes.json."
- **Why New Page / Angle:** Coverage lookup found only ssi-and-inheritance, 2027-ssdi-cola and ssi-increase-2027, each about a single program's amounts or inheritance, none the head-to-head eligibility comparison. No commits name the topic; past 2026-10-14 chart did not create it.
- **Intent-Based Our Takeaway:** "Apply for SSDI if you have enough recent work credits; apply for SSI if your income and resources are low regardless of work history; many applicants qualify for both. Condition that changes it: earnings above program limits or resources above $2,000 ($3,000 couple) remove SSI eligibility; amounts and rules change, so confirm with SSA."

## Approved Section Outline
1. **SSDI vs SSI at a Glance** — Opening answer, comparison table and the can-receive-both note
2. **Who Qualifies for SSDI** — Insured status, work credits, 5-month waiting period per 404.315 and 404.130
3. **Who Qualifies for SSI** — Age 65+, blind or disabled; income and resource tests per 416.202, 416.1100, 416.1205
4. **How Disability Is Defined** — 404.1505 and 416.905 definitions; same medical standard for adults
5. **Can You Get SSDI and SSI Together** — Concurrent eligibility, stated only as the rules support
6. **Who Should Apply for Which Program** — Who this is not for; what would change our answer
7. **FAQs** — Eligibility-focused questions

## Approved Internal Outbound Links
- {"source": "/compare/ssdi-vs-ssi", "target": "/guides/2027-ssdi-cola", "section": "SSDI vs SSI at a Glance", "anchor": "2027 SSDI COLA", "purpose": "Current SSDI amounts", "inspection": {"path": "src/data/guides.ts", "sha256": "3638adebd451ee9633720fca87a1ca10118dbc942f64d4139677d001c173d76f"}}
- {"source": "/compare/ssdi-vs-ssi", "target": "/guides/ssi-increase-2027", "section": "SSDI vs SSI at a Glance", "anchor": "2027 SSI amounts", "purpose": "Current SSI amounts", "inspection": {"path": "src/data/guides.ts", "sha256": "3638adebd451ee9633720fca87a1ca10118dbc942f64d4139677d001c173d76f"}}

## Reviewer Guardrails (Must Respect)
- CR1-A3-QTAG (substantive): Run autocomplete.py --mode questions for 'ssdi vs ssi' and 'difference between ssdi and ssi', retag as '[PAA 0/0; ac n/m question completions: what is ssdi and ssi difference ...]' (difference/pick pattern), keep action.reader_question and brief readerAndAnswer.question identical, and rerun cases-batch retrieval with the exact new string. Same sweep for A1 and A2 so 'ac corroborated' means the question sweep.
- CR1-OVERDEFER (substantive): Not a blocker for this run (unattended, no BUILD round 2). Keep the defers but reword the exclusions to say capturable statute/regulation primaries exist and the candidates carry forward with those URLs; 8 and 10 are next-run candidates with 1,000 and 390 per month demand.
- CR1-A1-BONDFUND-SOURCES (substantive): WRITE must restrict fund-side claims to what ig-mutual-funds.txt (bond fund definition sentence, NAV, fees) and finra-bonds.txt (bonds and bond funds diversify, prices fluctuate) literally state, or capture the FINRA bond-funds page (HTTP 200 at finra.org/investors/learn-to-invest/types-investments/bonds/bond-funds) before drafting. State that interest-rate price falls apply to both.
- CR1-A1-COUNTEREXAMPLE (substantive): Phrase 'most bond funds have no set maturity date', add call risk and secondary-market markup to the opener or table, and keep unsupported fund specifics out of the first answer. Also all PAA were off-topic (0/4), a keyword-intent flag: keep the FAQ to sourced on-topic questions only.
- CR1-A2-BASIS-OVERSTATE (substantive): Condition the opener, table and takeaway: spouse versus non-spouse, contribution rule, community-property exception under 1014(b)(6) only if sourced. Do not present either form as the tax winner.
- CR1-A2-STATE-LAW (substantive): Cite the Florida edition date, label Florida as one state's example, drop or flag as state-specific any creditor, partition, mortgage or property-tax claim without a captured source, include the tenancy-by-the-entirety note that 689.15 itself states, and keep the not-legal-advice disclaimer at the bottom only.
- CR1-A3-UNIVERSAL-NEGATIVE (substantive): Phrase as 'the SSDI eligibility rules in 20 CFR 404.315 and 404.130 contain no resource limit' or capture a sourced statement; support concurrent benefits with a captured section (for example 20 CFR 416.2 or 416.1100 context) or hedge it. Note SSA.gov was inaccessible and tell readers to confirm amounts with SSA. Keep dollar amounts limited to the linked existing pages.
- REQ-1 (requestCoverage): All 11 candidates are dispositioned with DataForSEO volume/KD in readiness.md and manifest exclusions; the 2 duplicate drops (3,4) and 3 weak-demand drops (5,7,11) verified legitimate. Defers 1, 8, 10 are not sound: capturable primaries exist (see CR1-OVERDEFER), so disposition is incomplete rather than wrong in direction.
- CR1-A3-QTAG: Question-evidence tag misstates the evidence: '[verb-only - no PAA, no completions]' while saved data shows 10 and 7 autocomplete completions and a question sweep returns on-intent completions.
- CR1-OVERDEFER: Deferrals of Visa vs Mastercard, Medicare Part A vs B and fixed vs variable student loans rest on failed vendor/agency URLs, while capturable primaries exist (LII 42 CFR 406/407, 20 USC 1087e, 34 CFR 685.202; federalreserve.gov Reg II, 12 CFR 1005.6/226.12, justice.gov Visa case).
- CR1-A1-BONDFUND-SOURCES: Bond-fund side has no real primary capture (glossary shell, bulletin 404, SEC 403, FINRA 404); readiness claims investor.gov and FINRA primaries inspected for the fund side.
- CR1-A1-COUNTEREXAMPLE: Opener states bond funds have no maturity date and bonds return par at maturity unless default; omits defined-maturity funds, call risk and dealer markup/liquidity, which finra-bonds.txt does state.
- CR1-A2-BASIS-OVERSTATE: Top answer says federal basis at death 'differs' between the two forms without conditions; for spouses 2040(b) includes one-half either way and 1014 steps up that half, so the difference mainly concerns non-spouse co-owners and contribution tracing (Pub 551 John and Jim example).
- CR1-A2-STATE-LAW: Florida 689.15 is captured from the 2024 edition and supports only the survivorship default; the section 'Selling, Borrowing and Creditors' and PAA 'Who pays taxes on joint tenancy?' have no captured source (CA 683 and NY RPP 240 returned 403, also on Justia).
- CR1-A3-UNIVERSAL-NEGATIVE: 'SSDI has no resource test' and 'can qualify for both' are stated from source silence; 20 CFR 404 text captured does not itself say there is no resource test, and concurrent eligibility is not in the captured sections. Resource limit table captured ends at Jan. 1, 1989 row ($2,000/$3,000).
- CR1-READINESS-ACCURACY: Readiness and A1 evidenceFiles list inspected sources that were failed captures (ig-bond-funds-*, sec-ib-bondfunds, finra-bond-funds) or omit them, and say 'primaries captured' for the fund side.

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"reported"` (no executed calculation/model/test in `evidence.json`): attribute all figures strictly to their published vendor/benchmark primary sources. NEVER write `"In our internal cost modeling"`, `"In our internal testing"`, `"we modeled"`, or `"we tested"` on a `"reported"` basis packet (only cite anonymized approved client `caseUses` or durable reader-survey facts when explicitly populated below).
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-write",
  "route": "/compare/ssdi-vs-ssi",
  "readerQuestion": "What is the difference between SSDI and SSI? [PAA 0/0; ac 11/57 question completions: what is ssdi and ssi difference, which is better ssdi or ssi, is ssdi and ssi the same (difference/pick pattern)]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/approval-manifest.json",
      "sha256": "742964215dddbcd4f15c21e1a45ee47aba86954b4c200f5a277badd9b1cfb2b7"
    },
    "review": {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/chart-review.json",
      "sha256": "49cd0e187872eaea82e7107ba5e17320b8eb87b69d4b54de03083f7ad38a65ff"
    },
    "actionId": "A3"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "Opening answer in section 1, comparison table directly after",
    "reason": "The reader needs a side-by-side on finite, sourced dimensions; a table lets them compare without interaction",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "Sourced facts are finite and state/year specific; no defensible adjustable-input model, so a static table answers faster"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static scannable layout answers faster without decorative motion"
    }
  },
  "basis": "reported",
  "decisionGap": "The top 10 are disability-law firm pages with no regulation-sourced table. A reader deciding which program to apply for cannot see, in one place, who qualifies for each, which tests apply (work credits vs income and resources), the waiting period and the shared disability definition.",
  "finding": "SSDI is for people who are disabled and insured for disability through enough work credits (20 CFR 404.315 and 404.130). SSI covers people aged 65 or older, blind or disabled who also meet income and resource limits (20 CFR 416.202), with resource limits listed in 20 CFR 416.1205. The SSDI eligibility rules in 404.315 and 404.130 contain no resource limit. Both programs use the same adult disability definition (404.1505 and 416.905). SSDI has a five-full-month waiting period in 404.315, unless an exception applies. A person can have both: SSI income rules (416.1121) list Social Security and disability benefits as unearned income, and SSA's COLA announcement covers people who receive both.",
  "conditions": "Descriptions are limited to what the cited eCFR sections contain as retrieved 2026-11-23 UTC. SSA.gov returned HTTP 403 to the capture tool, so no SSA-published current amounts are used here; dollar amounts live on the linked existing pages (/guides/2027-ssdi-cola/ and /guides/ssi-increase-2027/). Readers must confirm current amounts and their own eligibility with the Social Security Administration (SSA). The resource table in 416.1205(c) ends with the January 1, 1989 row ($2,000 individual, $3,000 individual and spouse); SSI eligibility also depends on citizenship/residence and other rules in 416.202.",
  "whatWouldChange": "A change to the cited regulations; SSA changing resource limits; a reader who has too few work credits for SSDI (SSI may still fit if income and resources are low); a reader whose countable income or resources exceed SSI limits (SSDI may be the only fit).",
  "caseSelection": {
    "path": "reports/mindmap-pass/runs/2026-11-23-comparison/evidence/ssdi-vs-ssi/cases.json",
    "sha256": "347cf08bd53c00837d321db59e682e30a650eabec436043fa6af1b1dd78365f9"
  },
  "caseDecisions": "Retrieved 8 (A2/A3) and 0 (A1) approved records via mindmap-gates cases with the exact approved reader_question. All retrieved records are other-business client/owned-property records (DIY repair, indoor air, bowling, blockchain, HOA boards, law-firm intake, Cuba briefings) with no honest topical overlap with this personal-finance/benefits/estate comparison; all rejected, none used. No client or experience claim is made on this page (anchor-exempt: source-only reported comparison, no honestly fitting proprietary record).",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/brief.md",
      "sha256": "93324e15e4df9c9c78137d371103cff8463eecba7702e674a4c8cca9221b8ac5"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/coverage-lookup.txt",
      "sha256": "be22c192a76f7f2114553495b537d81627904d206567bea7b4ec64118bd0a8dd"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/keyword-volumes.json",
      "sha256": "4f70395595f0341b4a880d938eca5e207e14ce2f5a695efa5a5eb0eb7e64780c"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/serp.json",
      "sha256": "c61106da76e5a9a44cb5fcfa9f5a7d33e5f17be49159d2a5fb196ca3f8e3cf66"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/kw-status.json",
      "sha256": "6ae183adb299df5fb3997cc3655d76db9cdb915668491376346adae263b9abee"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-404-315.txt",
      "sha256": "044d929b13ece3088d84e3d67d889f7db9701915518ef8c49c55641a0505a70d"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-404-130.txt",
      "sha256": "61a1fbc6be94c21e01d8dd5e439ae9fba3521a0ad41474f3620d1e8a43a0af88"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-404-1505.txt",
      "sha256": "96f5b40beba5a72f5028e65b0751d4adde36c9cee03340072f13fae810efed7e"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-202.txt",
      "sha256": "c75822ee0e8e5f52db9569f80cdaa1160d82a7a5c65735dd2e3d0c52db65b2a1"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-905.txt",
      "sha256": "9ff85c7604d9e2f1e900317d3c19a4aa396a3c916b0f60ffaca3efe5c60264a9"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-1100.txt",
      "sha256": "0d675c978022fa8e0929a1ee60582408deb4c500ce2dfbfc537a03ad6c52a444"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-1205.txt",
      "sha256": "b319ef98602e8b84b865347ce44d5cc52516d152cfd1b08a4ad74311eaa85f28"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-1121.txt",
      "sha256": "a77a1a8283d1f19d5a061d303d6704b98ed761155bc2018aecae2541d76fb364"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-1201.txt",
      "sha256": "23fe3773e8c3157930f0dc8905e5c1719ba9ddefe2048accfb8907568062eaaa"
    }
  ],
  "whyNoQuantitativeAnalysis": "The decision is a rules-and-structure comparison on finite attributes. The primary texts answer it directly and there are no defensible sourced inputs for a model (state, year and personal-facts dependent). Arbitrary arithmetic would not add value, so the source-only reported branch applies.",
  "reasoning": "20 CFR 404.315(a) lists the SSDI entitlement conditions: enough social security earnings to be insured for disability as described in 404.130, an application, a disability as defined in 404.1505 and five full consecutive months of disability unless no waiting period is required. None of these lists contains a resource test; 404.130 sets the quarters-of-coverage rules (for example 20 quarters of coverage in the 40-quarter period ending with the disability quarter, with age-based alternatives). 20 CFR 416.202 sets SSI eligibility: aged 65 or older, blind or disabled; US residency and citizenship or listed alien status; not more income than permitted; not more resources than permitted; no felony-flight or probation violations; an application. 416.1100 states SSI requires limited income and resources and that more income lowers the benefit. 416.1205 sets the resource limit. 404.1505 and 416.905 use the same words for the basic adult definition of disability. 416.1121(a) names social security benefits and disability benefits as unearned income for SSI. The existing site guides, which cite SSA's 2027 COLA announcement, say some people receive both SSI and Social Security. These support: SSDI is work-credit based with no resource limit in its eligibility sections; SSI is needs-based with income and resource tests and wider categories (65+, blind, disabled); both share the adult disability definition; both can be received by the same person subject to SSA's income rules.",
  "counterexample": "'SSDI is for workers and SSI is for people without work history' is too simple: SSI is open to people aged 65 or older, blind or disabled who pass the income and resource tests, but SSA also treats a Social Security disability benefit as unearned income, so a person with SSDI may still be tested for SSI and the SSDI amount counts against the income test (416.1121(a)). Concurrent eligibility is possible but not automatic.",
  "unknowns": [
    "No SSA.gov page could be captured (HTTP 403): do not cite SSA pages for amounts or rules; amounts come only from linked existing site pages.",
    "Whether any specific reader qualifies for both programs depends on their income and resources: say only that the rules allow both and that SSA decides.",
    "Medical standard differences for children, and appeals, are not covered."
  ],
  "selectedMedium": "text + comparison table (resolved from approved presentation: interaction not-useful, animation not-useful)",
  "method": "Reported: read 20 CFR 404.315, 404.130, 404.1505, 416.202, 416.905, 416.1100, 416.1121, 416.1201 and 416.1205 from eCFR (captured 2026-11-23 UTC) and the site's existing sourced SSDI/SSI guides, then map to comparison rows.",
  "findings": [
    {
      "label": "reported",
      "text": "SSDI entitlement requires disability insured status via work credits (20 CFR 404.315, 404.130) plus a five-full-month waiting period unless an exception applies."
    },
    {
      "label": "reported",
      "text": "SSI eligibility covers age 65+, blind or disabled people who meet income and resource limits (20 CFR 416.202); resource limits are in 416.1205."
    },
    {
      "label": "reported",
      "text": "Sections 404.315 and 404.130 contain no resource limit; the SSI resource test is in 416.202(d) and 416.1205."
    },
    {
      "label": "reported",
      "text": "Adult disability definition is worded the same in 404.1505 and 416.905."
    },
    {
      "label": "reported",
      "text": "SSI income rules treat social security and disability benefits as unearned income (416.1121(a)); existing site guides citing SSA note some people receive both."
    },
    {
      "label": "unknown",
      "text": "Current benefit amounts from SSA (not captured); a specific reader's eligibility."
    }
  ],
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [
      "research/sources/ecfr-20-404-315.txt",
      "research/sources/ecfr-20-404-130.txt",
      "research/sources/ecfr-20-404-1505.txt",
      "research/sources/ecfr-20-416-202.txt",
      "research/sources/ecfr-20-416-905.txt",
      "research/sources/ecfr-20-416-1100.txt",
      "research/sources/ecfr-20-416-1205.txt",
      "research/sources/ecfr-20-416-1121.txt"
    ],
    "scopeAndLimits": "Universal-negative phrased as what the cited sections contain; concurrent benefits stated from 416.1121(a) and existing site guides; no current amounts from SSA.",
    "publicMethod": "Each table cell and paragraph names the 20 CFR section beside the finding with a deep eCFR link.",
    "placement": "Opening answer, table cells, concurrent-benefits section and takeaway"
  },
  "takeaway": {
    "conclusion": "Apply for SSDI if you are disabled and have enough work credits; apply for SSI if you are 65 or older, blind or disabled and your income and resources are low, with or without work history. You may be eligible for both, and SSA decides after counting income and resources.",
    "appliesTo": "Adults deciding which disability-related program to apply for; general information, not a benefits determination.",
    "basis": "reported (20 CFR sections via eCFR; existing site guides citing SSA)",
    "changesIf": "Work credits fall short, income or resources exceed SSI limits (resource limits in 416.1205), regulations or SSA amounts change; confirm amounts with SSA."
  },
  "closedFacts": [
    {
      "id": "CFR404315",
      "source": "20 CFR 404.315, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-404.315",
      "text": "Who is entitled to disability benefits? You are entitled to disability benefits while disabled before attaining full retirement age as defined in 404.409 if (1) you have enough social security earnings to be insured for disability, as described in 404.130; (2) you apply; (3) you have a disability, as defined in 404.1505, or you are not disabled, but you had a disability that ended within the 12-month period before the month you applied; and (4) you have been disabled for 5 full consecutive months or no waiting period is required. The 5-month waiting period begins with a month in which you were both insured for disability and disabled and can begin no earlier than the 17th month before the month you apply. No waiting period is required if you were previously entitled to disability benefits within 5 years of the month you again became disabled, or you have been medically determined to have amyotrophic lateral sclerosis and your application for disability insurance benefits was approved on or after July 23, 2020."
    },
    {
      "id": "CFR404130",
      "source": "20 CFR 404.130, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-404.130",
      "text": "How we determine disability insured status. We have four different rules; to have disability insured status you must meet one of these rules and be fully insured. Rule I: the 20/40 requirement, at least 20 quarters of coverage (QCs) in the 40-quarter period ending with the quarter. Rule II: you become disabled before age 31 and have QCs in at least one-half of the quarters beginning with the quarter after you became age 21 (with a minimum of 6 QCs in the 12-quarter period if the period is short). Rule III: you had a period of disability before age 31 and are disabled again at age 31 or later. Rule IV: you are statutorily blind and fully insured."
    },
    {
      "id": "CFR4041505",
      "source": "20 CFR 404.1505, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-404.1505",
      "text": "Basic definition of disability. The law defines disability as the inability to do any substantial gainful activity by reason of any medically determinable physical or mental impairment which can be expected to result in death or which has lasted or can be expected to last for a continuous period of not less than 12 months. To meet this definition, you must have a severe impairment(s) that makes you unable to do your past relevant work or any other substantial gainful work that exists in the national economy. There are different rules for determining disability for individuals who are statutorily blind."
    },
    {
      "id": "CFR416202",
      "source": "20 CFR 416.202, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-416.202",
      "text": "Who may get SSI benefits. You are eligible for SSI benefits if you meet all of the following requirements: (a) you are aged 65 or older, blind or disabled; (b) you are a resident of the United States and a citizen or national of the United States, an alien lawfully admitted for permanent residence, an alien permanently residing in the United States under color of law, or a child of armed forces personnel living overseas; (c) you do not have more income than is permitted; (d) you do not have more resources than are permitted; (f) you are not fleeing to avoid prosecution or custody, or violating a condition of probation or parole; (g) you file an application for SSI benefits."
    },
    {
      "id": "CFR416905",
      "source": "20 CFR 416.905, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-416.905",
      "text": "Basic definition of disability for adults. The law defines disability as the inability to do any substantial gainful activity by reason of any medically determinable physical or mental impairment which can be expected to result in death or which has lasted or can be expected to last for a continuous period of not less than 12 months. To meet this definition, you must have a severe impairment(s) that makes you unable to do your past relevant work or any other substantial gainful work that exists in the national economy. There are different rules for determining disability for individuals who are statutorily blind."
    },
    {
      "id": "CFR4161100",
      "source": "20 CFR 416.1100, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-416.1100",
      "text": "Income and SSI eligibility. You are eligible for SSI benefits if you are an aged, blind, or disabled person who meets the requirements described in subpart B and who has limited income and resources. The amount of income you have is a major factor in deciding whether you are eligible for SSI benefits and the amount of your benefit. We count income on a monthly basis. Generally, the more income you have the less your benefit will be. If you have too much income, you are not eligible for a benefit."
    },
    {
      "id": "CFR4161205",
      "source": "20 CFR 416.1205, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-416.1205",
      "text": "Limitation on resources. Effective January 1, 1985 and later, the resources limits table in paragraph (c) lists the limit for an individual and for an individual and spouse by effective date, ending with the row effective January 1, 1989: $2,000 for an individual and $3,000 for an individual and spouse. An aged, blind, or disabled individual is eligible if his or her nonexcludable resources do not exceed the limit and all other eligibility requirements are met."
    },
    {
      "id": "CFR4161121",
      "source": "20 CFR 416.1121, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-416.1121",
      "text": "Types of unearned income. Some types of unearned income are annuities, pensions, and other periodic payments. This unearned income is usually related to prior work or service. It includes, for example, private pensions, social security benefits, disability benefits, veterans benefits, worker's compensation, railroad retirement annuities and unemployment insurance benefits."
    },
    {
      "id": "CFR4161201",
      "source": "20 CFR 416.1201, eCFR",
      "url": "https://www.ecfr.gov/current/title-20/section-416.1201",
      "text": "Resources; general. For purposes of subpart L, resources means cash or other liquid assets or any real or personal property that an individual (or spouse, if any) owns and could convert to cash to be used for his or her support and maintenance."
    },
    {
      "id": "SITE-1",
      "source": "Existing site guide /guides/2027-ssdi-cola/ (cites SSA's October 14, 2026 COLA announcement)",
      "url": "/guides/2027-ssdi-cola/",
      "text": "If you receive Supplemental Security Income (SSI) as well as SSDI, the SSI portion rises sooner. Some people receive both benefits, and SSA says the COLA applies to 76 million Americans in total."
    },
    {
      "id": "SITE-2",
      "source": "Existing site guide /guides/ssi-increase-2027/ (cites SSA 2027 COLA fact sheet)",
      "url": "/guides/ssi-increase-2027/",
      "text": "If you get both Social Security and SSI, both payments change. The Social Security payment rises beginning in January 2027. The SSI payment rises with the December 31, 2026 payment."
    },
    {
      "id": "INF-3",
      "source": "Reviewer-approved universal-negative phrasing (CR1-A3-UNIVERSAL-NEGATIVE)",
      "url": null,
      "text": "Phrase as: 'The SSDI eligibility rules in 20 CFR 404.315 and 404.130 contain no resource limit.' Never write that SSDI 'has no resource test' as an unqualified fact about the program. Tell readers to confirm amounts and eligibility with the Social Security Administration (SSA). SSA.gov could not be captured; do not cite SSA pages for rules or amounts."
    }
  ],
  "internalLinksAllowed": [
    "/guides/2027-ssdi-cola/",
    "/guides/ssi-increase-2027/",
    "/guides/ssi-and-inheritance/"
  ],
  "faqPlan": [
    "What is the main difference between SSDI and SSI?",
    "Can you get SSDI and SSI at the same time?",
    "Does SSDI have a resource limit?",
    "Who qualifies for SSI?",
    "How long is the SSDI waiting period?",
    "Do SSDI and SSI use the same definition of disability?"
  ],
  "faqNote": "No PAA were returned (0/0); the FAQ comes from autocomplete question completions on 'ssdi vs ssi' (e.g. what is ssdi and ssi difference, which is better ssdi or ssi, is ssdi and ssi the same, can ssdi vs ssi be combined). Keep dollar amounts out except by link to the two existing pages.",
  "caseUses": [],
  "exclusions": [
    "_experience.md section G excludes financial, legal and professional services from any 'we tested' claim: TESTED format disabled, no testing/howWeTested/tested schema or byline.",
    "Basis is reported: never write 'In our internal testing/modeling/analysis', 'we tested' or 'we modeled'. Attribute each finding to the named primary source ('Investor.gov says...', 'Section 689.15 provides...').",
    "Disclaimer (general information, not legal/tax/investment advice) goes at the bottom only. No named-reviewer or professional-review claim."
  ],
  "growth": {
    "path": "reports/mindmap-pass/runs/2026-11-23-comparison/evidence/ssdi-vs-ssi/growth.json"
  }
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/mindmap-pass/runs/2026-11-23-comparison/brief.md`
```
Source: comparison candidate miner for https://www.themodernwallet.com. Each item is an X-vs-Y, alternatives, successor-vs-predecessor or objective roundup candidate mined from entities this site already covers, and already checked against the site's pages: NEW = no page covers it; PARTIAL = an existing page covers it in passing (enrich that page, never a duplicate). Comparison rows use the `comparison table/database` format; roundups are objective and the business is never a ranked option (`.claude/commands/_roundup-blend.md` §3).
Unattended run: save the chart to `reports/mindmap-pass/2026-11-23-comparison.md` (this exact name, so it never collides with another mindmap run today), treat the Phase 0 manifest as approved, and continue to Phase 9 without stopping.
Topic-selection priority: realistic organic-click growth; do not infer a lead-generation goal.
Cache: candidates in reports/comparison-content-creator/cache.json (dropped/published) were excluded before this list; do not re-add them. Chime vs SoFi, Acorns vs Robinhood, Webull vs Fidelity etc. are cached.

Candidates (format / A / B / segment / primary keyword / proposed slug / coverage):
1. versus | Visa | Mastercard | general | visa vs mastercard | visa-vs-mastercard | NEW
2. versus | SSDI | SSI | benefits | ssdi vs ssi | ssdi-vs-ssi | NEW (SSDI/SSI named only in passing in src/data/guides.ts)
3. versus | Fidelity | Robinhood | general | fidelity vs robinhood | fidelity-vs-robinhood | NEW (robinhood-vs-webull, charles-schwab-vs-robinhood, sofi-invest-vs-robinhood exist)
4. versus | Money market fund | Money market account | general | money market fund vs money market account | money-market-fund-vs-money-market-account | PARTIAL (mentioned in guides.ts/roundups.ts/comparisons.ts hysa-vs-money-market, not head-to-head)
5. versus | Payday loan | Personal loan | general | payday loan vs personal loan | payday-loan-vs-personal-loan | PARTIAL (payday loans mentioned in src/data/guides.ts)
6. versus | Tenants in common | Joint tenancy | estate planning | tenants in common vs joint tenancy | tenants-in-common-vs-joint-tenancy | NEW
7. versus | YNAB | Copilot Money | budgeting | ynab vs copilot | ynab-vs-copilot | NEW (ynab-vs-monarch is cached)
8. versus | Medicare Part A | Medicare Part B | health | medicare part a vs part b | medicare-part-a-vs-part-b | NEW (medicare-vs-medicare-advantage, medicare-vs-medicaid, medicare-advantage-vs-medigap exist)
9. versus | Bonds | Bond funds | investing | bonds vs bond funds | bonds-vs-bond-funds | NEW
10. versus | Fixed-rate student loan | Variable-rate student loan | student loans | fixed vs variable rate student loans | fixed-vs-variable-rate-student-loans | NEW (federal-vs-private-student-loans is cached)
11. versus | Treasury bills | High-yield savings account | general | t-bills vs high yield savings | treasury-bills-vs-hysa | PARTIAL (cd-vs-treasury-bill, hysa-vs-cd exist)

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/coverage-lookup.txt`
```
coverage_lookup: 11 candidate(s) vs 875 repo pages / 891 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1244 past-chart lines

### /guides/visa-vs-mastercard  — row - · create new content
keyword: visa vs mastercard
reader question (new page intent): Which is better, Visa or Mastercard?
lookup terms: visa mastercard   format cues: vs

Possible existing homes: none found in the repo page data, the search index or the sitemaps.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms: none
Commits naming the topic: none
Same run overlap: none

### /guides/ssdi-vs-ssi  — row - · create new content
keyword: ssdi vs ssi
reader question (new page intent): What is the difference between SSDI and SSI?
lookup terms: ssdi ssi   format cues: vs

Possible existing homes (strongest first) — read title + description, state each page's reader intent, compare with the question above:
- /guides/ssi-and-inheritance  [in sitemap · src/data/guides.ts · topic match 0.5 on ssi]
    title: Will an Inheritance Affect Your SSI Benefits in 2026?
    desc:  Find out how SSI and inheritance rules interact in 2026: the resource limit, the 10-day reporting rule, special needs trusts, and ABLE accounts explained.
- /guides/2027-ssdi-cola  [in sitemap · src/data/guides.ts · topic match 0.5 on ssdi]
    title: Social Security COLA 2027 for Disability: SSDI Up 3.6%
    desc:  The Social Security COLA 2027 for disability is a 3.6% cost-of-living adjustment. The average disabled-worker check rises from $1,642 to $1,701 in January.
- /guides/ssi-increase-2027  [in sitemap · src/data/guides.ts · topic match 0.5 on ssi]
    title: SSI Increase 2027 Sets the Federal Maximum at $1,029
    desc:  The SSI increase 2027 raises the Supplemental Security Income maximum to $1,029 a month. Couples get $1,544, starting December 31, 2026.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-10-14.md [table] | Lens 2, cluster "2027 Social Security changes (beyond the COLA)". Phrases: `social security changes 2027` 3,600/mo; `social security changes for 2027` 210; `social security earnings limit 2027` 210 KD 28; `social secur
- 2026-10-14.md [table] | COLA for SSDI | social security cola 2027 disability (3,600, KD 7); ssdi cola 2027 (320); ssdi increase 2027 (210); PAA: How much will my disability go up in 2027? | coverage gap at theme level | none | create new cont
- 2026-10-14.md [table] | SSI 2027 increase | ssi increase 2027 (1,300); ssi cola 2027 (1,000); how much will ssi checks be in 2027 (390) | coverage gap; separate program and payment date | none | create new content | /guides/ssi-increase-2027/
- 2026-10-14.md [exclusions] - **social security payment schedule 2027 (110/mo), ssi payment schedule 2027 (70):** HOLD. Low demand, and the SSA 2027 calendar was not read this run. Do not publish dates from memory.
- 2026-10-14.md [exclusions] - **fers cola 2026, va cola 2026, ssi increase 2026, social security cola 2026:** DROP. They are previous-year terms, and the 2027 rows above take their place.
- 2026-10-14.md [exclusions] - **Lens 3 (comparison / alternatives / pricing):** the brief's entities are federal benefit programs (Social Security, SSI, SSDI, FERS/CSRS, military retired pay, VA compensation), with no vendor, plan price or rival pr
Commits naming the topic: none
Same run overlap: none

### /comparisons/fidelity-vs-robinhood  — row - · create new content
keyword
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/keyword-volumes.json`
```
{
 "rows": [
  {
   "keyword": "bond funds vs individual bonds",
   "volume": 320,
   "volume_low": 320,
   "volume_high": 320,
   "kd": 4,
   "cpc": 3.07,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "bonds vs bond funds",
   "volume": 480,
   "volume_low": 480,
   "volume_high": 480,
   "kd": 6,
   "cpc": 4.19,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "copilot money vs ynab",
   "volume": 90,
   "volume_low": 90,
   "volume_high": 90,
   "kd": 0,
   "cpc": "",
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 6,
    "corroborates": true
   }
  },
  {
   "keyword": "difference between ssdi and ssi",
   "volume": 4400,
   "volume_low": 4400,
   "volume_high": 4400,
   "kd": 14,
   "cpc": 3.4,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 7,
    "corroborates": true
   }
  },
  {
   "keyword": "fidelity vs robinhood",
   "volume": 5400,
   "volume_low": 5400,
   "volume_high": 5400,
   "kd": 0,
   "cpc": 22.07,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "fixed vs variable rate student loans",
   "volume": 390,
   "volume_low": 390,
   "volume_high": 390,
   "kd": 17,
   "cpc": 61.02,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 6,
    "corroborates": true
   }
  },
  {
   "keyword": "fixed vs variable student loan",
   "volume": 390,
   "volume_low": 390,
   "volume_high": 390,
   "kd": 17,
   "cpc": 61.02,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "medicare part a vs part b",
   "volume": 1000,
   "volume_low": 1000,
   "volume_high": 1000,
   "kd": 33,
   "cpc": 2.93,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "money market account vs money market fund",
   "volume": 880,
   "volume_low": 880,
   "volume_high": 880,
   "kd": 8,
   "cpc": 10.59,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 7,
    "corroborates": true
   }
  },
  {
   "keyword": "money market fund vs money market account",
   "volume": 880,
   "volume_low": 880,
   "volume_high": 880,
   "kd": 14,
   "cpc": 10.59,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 6,
    "corroborates": true
   }
  },
  {
   "keyword": "payday loan vs personal loan",
   "volume": 110,
   "volume_low": 110,
   "volume_high": 110,
   "kd": 0,
   "cpc": 3.86,
   "source": "dataforseo",
   "confidence": "high",
   "kd_source": "dataforseo",
   "autocomplete": {
    "completions": 4,
    "corroborates": true
   }
  },
  {
   "keyword": "ssdi vs ssi",
   "volume": 18100,
   "volume_low": 18100,
   "volume_high": 18100,
   "kd": 6,
   "cpc": 4.03,
   "source": 
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/serp.json`
```
{
 "rows": [
  {
   "keyword": "visa vs mastercard",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.reddit.com",
    "creditcards.wellsfargo.com",
    "www.investopedia.com",
    "www.cnbc.com",
    "www.experian.com",
    "www.youtube.com",
    "www.revolut.com"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "diff.wiki",
    "joingerald.com",
    "businessupturn.com",
    "diff.wiki",
    "fazilpay.com",
    "www.bild.de",
    "joingerald.com",
    "www.instagram.com"
   ],
   "major_domains": [],
   "forum_domains": [],
   "serp_feature_mix": {
    "ai_overview": 1,
    "organic": 9,
    "people_also_ask": 1,
    "related_searches": 1
   },
   "paa": [
    "Which is most used, Visa or Mastercard?",
    "Which card is powerful, Visa or Mastercard?",
    "Who owns Visa and Mastercard?",
    "How do Visa and Mastercard make money?",
    "Who is better, Visa or Mastercard?",
    "Why is everyone switching from Mastercard to Visa?"
   ],
   "related_searches": [
    "Visa vs mastercard credit card",
    "Visa vs mastercard cost"
   ],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "AI Overview present, cites www.reddit.com, creditcards.wellsfargo.com, www.investopedia.com, www.cnbc.com",
   "se_results_count": 79
  },
  {
   "keyword": "ssdi vs ssi",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": false,
   "ai_overview_cited_domains": [],
   "featured_snippet": null,
   "top10_domains": [
    "www.hcplaw.com",
    "www.rite4justice.com",
    "www.niperlaw.com",
    "ginsburglawgroup.com",
    "blossomsca.com",
    "retirable.com",
    "jandils.com",
    "www.brockandstout.com"
   ],
   "major_domains": [],
   "forum_domains": [],
   "serp_feature_mix": {
    "images": 1,
    "organic": 9
   },
   "paa": [],
   "related_searches": [],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "no entrenched incumbents or SERP features detected",
   "se_results_count": 72
  },
  {
   "keyword": "fidelity vs robinhood",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": true,
   "ai_overview_cited_domains": [
    "www.reddit.com",
    "www.investopedia.com",
    "www.youtube.com",
    "www.grifin.com",
    "wise.com"
   ],
   "featured_snippet": null,
   "top10_domains": [
    "financialwolves.com",
    "investingbrokers.com",
    "www.reddit.com",
    "www.brokeragecomparison.com",
    "www.youtube.com",
    "marketrealist.com",
    "www.topconsumerreviews.com",
    "rockwellforbes.com"
   ],
   "major_domains": [],
   "forum_domains": [
    "www.reddit.com",
    "www.youtube.com"
   ],
   "serp_feature_mix": {
    "ai_overview": 1,
    "organic": 8,
    "people_also_ask": 1,
    "perspectives": 1
   },
   "paa": [
    "What are the top 3 brokerage accounts?",
    "Why stay away from Robinhood?",
    "What is the 4% rule for Fidelity?",
    "What is the downside to Fidelity?",
    "Is Fidelity safer than Robinhood?",
    "What does Dave Ramsey say about Fidelity?"
   ],
   "related_searches": [],
   "recommended_shape": "standard article/guide is viable",
   "evidence": "AI Overview present, cites www.reddit.com, www.investopedia.com, www.youtube.com, www.grifin.com",
   "se_results_count": 84
  },
  {
   "keyword": "money market fund vs money market account",
   "verdict": "winnable",
   "forum_dominated": false,
   "ai_overview_present": 
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/kw-status.json`
```
{
 "dataforseo": "ok (balance $40.25663799999995)",
 "semrush": "unavailable: HTTP 403",
 "ahrefs": "off: excluded by KEYWORD_PROVIDERS",
 "autocomplete": "ok",
 "selected": {
  "volume": "dataforseo",
  "kd": "dataforseo",
  "expand": "dataforseo"
 }
}

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-404-315.txt`
```
URL: https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-20?part=404&section=404.315
Retrieved (UTC): 2026-11-23T08:08:29Z
HTTP: 200

§ 404.315 Who is entitled to disability benefits?
(a) General. You are entitled to disability benefits while disabled before attaining full retirement age as defined in § 404.409 if—
(1) You have enough social security earnings to be insured for disability, as described in § 404.130;
(2) You apply;
(3) You have a disability, as defined in § 404.1505, or you are not disabled, but you had a disability that ended within the 12-month period before the month you applied; and
(4) You have been disabled for 5 full consecutive months or no waiting period is required. The 5-month waiting period begins with a month in which you were both insured for disability and disabled. Your waiting period can begin no earlier than the 17th month before the month you apply—no matter how long you were disabled before then. No waiting period is required if:
(i) You were previously entitled to disability benefits or to a period of disability under § 404.320 any time within 5 years of the month you again became disabled; or
(ii) You have been medically determined to have amyotrophic lateral sclerosis, and we approved your application for disability insurance benefits on or after July 23, 2020.
(b) [Reserved]
[44 FR 34481, June 15, 1979, as amended at 48 FR 21930, May 16, 1983; 51 FR 10616, Mar. 28, 1986; 51 FR 16166, May 1, 1986; 53 FR 43681, Oct. 28, 1988; 57 FR 30119, July 8, 1992; 60 FR 8145, Feb. 10, 1995; 68 FR 4704, Jan. 30, 2003; 86 FR 48021, Aug. 27, 2021; 91 FR 16829, Apr. 3, 2026]

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-404-130.txt`
```
URL: https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-20?part=404&section=404.130
Retrieved (UTC): 2026-11-23T08:08:47Z
HTTP: 200

§ 404.130 How we determine disability insured status.
(a) General. We have four different rules for determining if you are insured for purposes of establishing a period of disability or becoming entitled to disability insurance benefits. To have disability insured status, you must meet one of these rules and you must be fully insured (see § 404.132 which tells when the period ends for determining the number of quarters of coverage (QCs) you need to be fully insured).
(b) Rule I—You must meet the 20/40 requirement. You are insured in a quarter for purposes of establishing a period of disability or becoming entitled to disability insurance benefits if in that quarter—
(1) You are fully insured; and
(2) You have at least 20 QCs in the 40-quarter period (see paragraph (f) of this section) ending with that quarter.
(c) Rule II—You become disabled before age 31. You are insured in a quarter for purposes of establishing a period of disability or becoming entitled to disability insurance benefits if in that quarter—
(1) You have not become (or would not become) age 31;
(2) You are fully insured; and
(3) You have QCs in at least one-half of the quarters during the period ending with that quarter and beginning with the quarter after the quarter you became age 21; however—
(i) If the number of quarters during this period is an odd number, we reduce the number by one; and
(ii) If the period has less than 12 quarters, you must have at least 6 QCs in the 12-quarter period ending with that quarter.
(d) Rule III—You had a period of disability before age 31. You are insured in a quarter for purposes of establishing a period of disability or becoming entitled to disability insurance benefits if in that quarter—
(1) You are disabled again at age 31 or later after having had a prior period of disability established which began before age 31 and for which you were only insured under paragraph (c) of this section; and
(2) You are fully insured and have QCs in at least one-half the calendar quarters in the period beginning with the quarter after the quarter you became age 21 and through the quarter in which the later period of disability begins, up to a maximum of 20 QCs out of 40 calendar quarters; however—
(i) If the number of quarters during this period is an odd number, we reduce the number by one;
(ii) If the period has less than 12 quarters, you must have at least 6 QCs in the 12-quarter period ending with that quarter; and
(iii) No monthly benefits may be paid or increased under Rule III before May 1983.
(e) Rule IV—You are statutorily blind. You are insured in a quarter for purposes of establishing a period of disability or becoming entitled to disability insurance benefits if in that quarter—
(1) You are disabled by blindness as defined in § 404.1581; and
(2) You are fully insured.
(f) How we determine the 40-quarter or other period. In determining the 40-quarter period or other period in paragraph (b), (c), or (d) of this section, we do not count any quarter all or part of which is in a prior period of disability established for you, unless the quarter is the first or last quarter of this period and the quarter is a QC. However, we will count all the quarters in the prior period of disability established for you if by doing so you would be entitled to benefits or the amount of the benefit would be larg
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-404-1505.txt`
```
URL: https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-20?part=404&section=404.1505
Retrieved (UTC): 2026-11-23T08:08:47Z
HTTP: 200

§ 404.1505 Basic definition of disability.
(a) The law defines disability as the inability to do any substantial gainful activity by reason of any medically determinable physical or mental impairment which can be expected to result in death or which has lasted or can be expected to last for a continuous period of not less than 12 months. To meet this definition, you must have a severe impairment(s) that makes you unable to do your past relevant work (see § 404.1560(b)) or any other substantial gainful work that exists in the national economy. If your severe impairment(s) does not meet or medically equal a listing in appendix 1, we will assess your residual functional capacity as provided in §§ 404.1520(e) and 404.1545. (See §§ 404.1520(g)(2) and 404.1562 for an exception to this rule.) We will use this residual functional capacity assessment to determine if you can do your past relevant work. If we find that you cannot do your past relevant work, we will use the same residual functional capacity assessment and your vocational factors of age, education, and work experience to determine if you can do other work. (See § 404.1520(h) for an exception to this rule.) We will use this definition of disability if you are applying for a period of disability, or disability insurance benefits as a disabled worker, or child's insurance benefits based on disability before age 22 or, with respect to disability benefits payable for months after December 1990, as a widow, widower, or surviving divorced spouse.
(b) There are different rules for determining disability for individuals who are statutorily blind. We discuss these in §§ 404.1581 through 404.1587. There are also different rules for determining disability for widows, widowers, and surviving divorced spouses for monthly benefits for months prior to January 1991. We discuss these rules in §§ 404.1577, 404.1578, and 404.1579.
[45 FR 55584, Aug. 20, 1980, as amended at 51 FR 10616, Mar. 28, 1986; 57 FR 30120, July 8, 1992; 68 FR 51161, Aug. 26, 2003; 77 FR 43494, July 25, 2012]

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-202.txt`
```
URL: https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-20?part=416&section=416.202
Retrieved (UTC): 2026-11-23T08:08:29Z
HTTP: 200

Editorial Note on Part 416
Editorial Note:
Nomenclature changes to part 416 appear at 68 FR 53509, Sept. 11, 2003.
§ 416.202 Who may get SSI benefits.
You are eligible for SSI benefits if you meet all of the following requirements:
(a) You are—
(1) Aged 65 or older (subpart H);
(2) Blind (subpart I); or
(3) Disabled (subpart I).
(b) You are a resident of the United States (§ 416.1603), and—
(1) A citizen or a national of the United States (§ 416.1610);
(2) An alien lawfully admitted for permanent residence in the United States (§ 416.1615);
(3) An alien permanently residing in the United States under color of law (§ 416.1618); or
(4) A child of armed forces personnel living overseas as described in § 416.216.
(c) You do not have more income than is permitted (subparts K and D).
(d) You do not have more resources than are permitted (subpart L).
(e) [Reserved]
(f) You are not—
(1) Fleeing to avoid prosecution for a crime, or an attempt to commit a crime, which is a felony under the laws of the place from which you flee (or which, in the case of the State of New Jersey, is a high misdemeanor under the laws of that State);
(2) Fleeing to avoid custody or confinement after conviction for a crime, or an attempt to commit a crime, which is a felony under the laws of the place from which you flee (or which, in the case of the State of New Jersey, is a high misdemeanor under the laws of that State); or
(3) Violating a condition of probation or parole imposed under Federal or State law.
(g) You file an application for SSI benefits (subpart C).
[47 FR 3103, Jan. 22, 1982, as amended at 58 FR 4897, Jan. 19, 1993; 60 FR 8149, Feb. 10, 1995; 61 FR 10277, Mar. 13, 1996; 65 FR 40495, June 30, 2000; 91 FR 16830, Apr. 3, 2026]

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-905.txt`
```
URL: https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-20?part=416&section=416.905
Retrieved (UTC): 2026-11-23T08:08:48Z
HTTP: 200

Editorial Note on Part 416
Editorial Note:
Nomenclature changes to part 416 appear at 68 FR 53509, Sept. 11, 2003.
§ 416.905 Basic definition of disability for adults.
(a) The law defines disability as the inability to do any substantial gainful activity by reason of any medically determinable physical or mental impairment which can be expected to result in death or which has lasted or can be expected to last for a continuous period of not less than 12 months. To meet this definition, you must have a severe impairment(s) that makes you unable to do your past relevant work (see § 416.960(b)) or any other substantial gainful work that exists in the national economy. If your severe impairment(s) does not meet or medically equal a listing in appendix 1 to subpart P of part 404 of this chapter, we will assess your residual functional capacity as provided in §§ 416.920(e) and 416.945. (See § 416.920(g)(2) and 416.962 for an exception to this rule.) We will use this residual functional capacity assessment to determine if you can do your past relevant work. If we find that you cannot do your past relevant work, we will use the same residual functional capacity assessment and your vocational factors of age, education, and work experience to determine if you can do other work. (See § 416.920(h) for an exception to this rule.)
(b) There are different rules for determining disability for individuals who are statutorily blind. We discuss these in §§ 416.981 through 416.985.
[45 FR 55621, Aug. 20, 1980, as amended at 56 FR 5553, Feb. 11, 1991; 68 FR 51164, Aug. 26, 2003; 77 FR 43495, July 25, 2012]

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-1100.txt`
```
URL: https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-20?part=416&section=416.1100
Retrieved (UTC): 2026-11-23T08:08:48Z
HTTP: 200

Editorial Note on Part 416
Editorial Note:
Nomenclature changes to part 416 appear at 68 FR 53509, Sept. 11, 2003.
§ 416.1100 Income and SSI eligibility.
You are eligible for supplemental security income (SSI) benefits if you are an aged, blind, or disabled person who meets the requirements described in subpart B and who has limited income and resources. Thus, the amount of income you have is a major factor in deciding whether you are eligible for SSI benefits and the amount of your benefit. We count income on a monthly basis. Generally, the more income you have the less your benefit will be. If you have too much income, you are not eligible for a benefit. However, we do not count all of your income to determine your eligibility and benefit amount. We explain in the following sections how we treat your income for the SSI program. These rules apply to the Federal benefit and to any optional State supplement paid by us on behalf of a State (§ 416.2025) except as noted in subpart T and in the Federal-State agreements with individual States. While this subpart explains how we count income, subpart D of these regulations explains how we determine your benefits, including the provision that we generally use countable income in a prior month to determine how much your benefit amount will be for a month in which you are eligible (§ 416.420).
[50 FR 48573, Nov. 26, 1985]

```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/ecfr-20-416-1205.txt`
```
URL: https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-20?part=416&section=416.1205
Retrieved (UTC): 2026-11-23T08:08:46Z
HTTP: 200

Editorial Note on Part 416
Editorial Note:
Nomenclature changes to part 416 appear at 68 FR 53509, Sept. 11, 2003.
§ 416.1205 Limitation on resources.
(a) Individual with no eligible spouse. An aged, blind, or disabled individual with no spouse is eligible for benefits under title XVI of the Act if his or her nonexcludable resources do not exceed $1,500 prior to January 1, 1985, and all other eligibility requirements are met. An individual who is living with an ineligible spouse is eligible for benefits under title XVI of the Act if his or her nonexcludable resources, including the resources of the spouse, do not exceed $2,250 prior to January 1, 1985, and all other eligibility requirements are met.
(b) Individual with an eligible spouse. An aged, blind, or disabled individual who has an eligible spouse is eligible for benefits under title XVI of the Act if their nonexcludable resources do not exceed $2,250 prior to January 1, 1985, and all other eligibility requirements are met.
(c) Effective January 1, 1985 and later. The resources limits and effective dates for January 1, 1985 and later are as follows:
Effective date
Individual
Individual and spouse
Jan. 1, 1985
$1,600
$2,400
Jan. 1, 1986
1,700
$2,550
Jan. 1, 1987
1,800
$2,700
Jan. 1, 1988
1,900
$2,850
Jan. 1, 1989
2,000
$3,000
[50 FR 38982, Sept. 26, 1985]

```

## WRITER TASK ADDENDUM (data only; copied from the approved plan, reviewer guardrails and evidence packet)
- register: operator. page type: comparison (body floor 1,500 words; table cells, title, meta, headings do not count). medium: text + comparison table. teeup-exempt: source-only reported comparison, no honest first-hand experience to tee up. anchor-exempt: no approved case record fits (all 8 retrieved records rejected).
- Reader question (plain text, NO bracket tag on the page): "What is the difference between SSDI and SSI?"
- Basis is reported. Name the primary source beside every finding ("Investor.gov says...", "Section ... provides...") with a deep markdown link on its first mention. Never write 'we tested', 'in our testing', 'we modeled' or 'our analysis' as if we ran something. No client or experience claim.
- Output ONE JSON object, comparison schema. Keys: slug "ssdi-vs-ssi", title (50 to 60 characters, carries "ssdi vs ssi", ONE clause: no colon or comma splice, no 'and why'), metaDescription (150 to 160 characters, no 'We tested'), targetKeyword "ssdi vs ssi", optionA "SSDI", optionB "SSI", segment "Benefits", h1 (Title Case, one clause, keyword inside), introText (direct answer first, short sentence 1; paragraphs separated by blank lines; second paragraph may state the condition that changes the answer), comparisonTable.rows (7 to 9 objects {dimension, a, b}; each cell a sourced fact with a markdown link on the first mention of the source, no 'check the site' cells, no raw HTML; if a fact is not in the closed list put 'Not covered by the sources here' instead of a guess), tableHeading "SSDI vs SSI at a Glance", verdictHeading (Title Case, e.g. 'Our Takeaway for SSDI vs SSI'), verdict (fuller takeaway: answer, evidence basis named, the exception, then ends with a concrete next-action sentence carrying the primary keyword), disclaimerText (ONE sentence, general information not advice, bottom-of-page slot), sections (see below), faqs, sources, relatedComparisons ["medicare-vs-medicaid", "special-needs-trust-vs-able-account", "social-security-at-62-vs-70"], calculatorLinks [].
- Layout rule: because disclaimerText is set, sections[0].heading MUST equal tableHeading exactly; sections[0].content is the opening-answer section that renders above the table (it must add facts the introText did not say, not restate it). sections[1..] follow the approved outline order below. verdict renders after the sections. FAQs: sentence-case questions from faqPlan, each answer opens with the direct answer.
- Approved outline headings (Title Case exactly): see 'Approved Section Outline' above. Table rows to cover: funded by / program basis (do not state funding source unless in closed facts: omit); who qualifies; work credits; income test; resource test; waiting period; age range; medical standard; can you get both.
- Internal links allowed (markdown with trailing slash, only these): /guides/2027-ssdi-cola/ (anchor '2027 SSDI COLA') and /guides/ssi-increase-2027/ (anchor '2027 SSI amounts'), both in 'SSDI vs SSI at a Glance' as the only places for current dollar amounts. Also /guides/ssi-and-inheritance/ may be linked in a resources sentence.
- External links: ONLY the closed URL list for this page; first mention of every organisation linked: Social Security Administration (SSA), eCFR (Electronic Code of Federal Regulations, Title 20 Code of Federal Regulations, CFR).
- Who this is not for: someone whose income or resources exceed SSI limits and who lacks enough work credits (neither program may fit; SSA decides); children (medical standard not covered). Say what they should do: confirm with SSA via the linked pages; do not give personalized advice. Also include 'What would change our answer' using the evidence packet whatWouldChange.
- Reviewer guardrails specific to this page:
  - CR1-A3-UNIVERSAL-NEGATIVE: write 'The SSDI eligibility rules in 20 CFR 404.315 and 404.130 contain no resource limit.' Never write an unqualified 'SSDI has no resource test'. Support both-programs claims only through 20 CFR 416.1121(a) (CFR4161121) and the existing guides (SITE-1, SITE-2) and hedge: the rules allow both and SSA decides after counting income and resources.
  - SSA.gov could not be captured; tell readers to confirm current amounts and their eligibility with the Social Security Administration and link https://www.ssa.gov/benefits/disability/ and https://www.ssa.gov/ssi/. Do not cite any SSA page for a fact. No dollar amounts except the resource limits in CFR4161205 ($2,000 individual, $3,000 individual and spouse, effective January 1, 1989) and by link to the two existing pages. Never state a benefit amount.
  - Phrase eligibility as what the cited CFR sections contain, with the section number beside each finding and a deep link.
  - Disclaimer (general information, not a benefits determination; SSA decides eligibility) goes ONLY in disclaimerText.
- Depth: 1,500+ body words by answering the sub-questions in the evidence packet (conditions, counterexample, unknowns), not by padding. Headings Title Case; every acronym defined on first use; no em dashes; no Conclusion or Summary heading; no 'honest', no 'the vendor/platform/tool'.
- sources: one object per source actually used: {"label","url"} using ONLY the closed URL list.
- Anything not on the evidence packet's closedFacts list, you do not know. Never invent a price, limit, statute, date, number or URL; leave it out.
