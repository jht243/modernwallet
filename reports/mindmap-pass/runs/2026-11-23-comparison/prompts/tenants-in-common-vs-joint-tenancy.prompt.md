# Approved Page Assignment: `/compare/tenants-in-common-vs-joint-tenancy` (`tenants-in-common-vs-joint-tenancy`)
- **Action ID:** `A2` (create new content)
- **Title:** Tenants in Common vs Joint Tenancy: Death, Taxes, Control
- **Page Type / Format / Medium:** comparison | comparison table/database - head-to-head comparison with finite rows, no sourced inputs for a calculator | text + comparison table
- **Minimum Visible Depth Floor:** 1500+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What is the difference between tenants in common and joint tenancy? [PAA 4/4 on-topic: death of a tenant, taxes, disadvantages, which is better; ac 3/12 question completions: what is tenants in common vs joint tenancy, which is better tenants in common or joint tenancy (difference/pick pattern)]
- **Working Answer (Col 11):** Mechanism and pick: joint tenancy with right of survivorship passes a dead owner's share automatically to the surviving owners, while tenants in common each own a transferable share that goes to heirs; federal tax basis at death differs (IRC 2040 and 1014). State law varies and sets the default, so check your state. Shape: pick with boundary.
- **Answer Placement (Col 12):** Section 1: What Happens to Each Owner's Share at Death

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent (brief candidate). 'tenants in common vs joint tenancy': 9,900/mo KD 5 (DataForSEO 2026-11-23, us); variant 'tenants in common vs joint tenants' 9,900 KD 7. lookup: no same-intent page; No existing page; coverage lookup found no home. SERP: Page one: landregistry-online.org, fraxioned.com, generisonline.com, avvo.com; AI Overview present. Results are mostly UK or vendor/law-firm; no US federal-tax plus statute-sourced comparison.
- **Keyword Evidence:** "Primary 'tenants in common vs joint tenancy': 9,900/mo KD 5 (DataForSEO 2026-11-23, us); variant 'tenants in common vs joint tenants' 9,900 KD 7. Provider: DataForSEO (SEMRUSH HTTP 403), source=dataforseo, kd_source=dataforseo (modeled KD, hint only), checked 2026-11-23, us. Autocomplete corroborated. Raw: research/keyword-volumes.json."
- **Why New Page / Angle:** No existing page; coverage lookup found no home. Nearest: /guides/how-to-fund-a-trust (retitling), /compare/living-trust-vs-will (different intent). No commits name the topic.
- **Intent-Based Our Takeaway:** "Joint tenancy fits owners who want the property to pass automatically to the survivor; tenants in common fits owners who want their share to go to chosen heirs or hold unequal stakes. Not legal advice; the deed language and state law decide, and a lawyer should confirm before retitling. Would change if the state default or the owners' marital/estate plan differs."

## Approved Section Outline
1. **What Happens to Each Owner's Share at Death** — Survivorship vs inheritable share in the opener, with state-law caveat
2. **How Tenancy in Common Works** — Separate, unequal, transferable shares; no survivorship
3. **How Joint Tenancy Works** — Equal shares, right of survivorship, state default (Florida 689.15 as example)
4. **Tax Basis When an Owner Dies** — IRC 2040 and 1014: spouse one-half vs non-spouse inclusion rules; Pub 551
5. **Selling, Borrowing and Creditors** — Only as sources support; otherwise flagged as state-specific
6. **Who Should Choose Each Option** — Who this is not for (unmarried partners with unequal contributions, blended families); what would change our answer
7. **FAQs** — The four on-topic PAA questions

## Approved Internal Outbound Links
- {"source": "/compare/tenants-in-common-vs-joint-tenancy", "target": "/guides/how-to-fund-a-trust", "section": "Who Should Choose Each Option", "anchor": "how to fund a trust", "purpose": "Alternative to co-titling", "inspection": {"path": "src/data/guides.ts", "sha256": "3638adebd451ee9633720fca87a1ca10118dbc942f64d4139677d001c173d76f"}}
- {"source": "/compare/tenants-in-common-vs-joint-tenancy", "target": "/compare/living-trust-vs-will", "section": "Who Should Choose Each Option", "anchor": "living trust vs will", "purpose": "Alternative to co-titling", "inspection": {"path": "src/data/comparisons.ts", "sha256": "5fbfddf76c7e6113bc68a502f95238e4533005b3c528ca1454730da13235ea0c"}}

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
  "route": "/compare/tenants-in-common-vs-joint-tenancy",
  "readerQuestion": "What is the difference between tenants in common and joint tenancy? [PAA 4/4 on-topic: death of a tenant, taxes, disadvantages, which is better; ac 3/12 question completions: what is tenants in common vs joint tenancy, which is better tenants in common or joint tenancy (difference/pick pattern)]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/approval-manifest.json",
      "sha256": "742964215dddbcd4f15c21e1a45ee47aba86954b4c200f5a277badd9b1cfb2b7"
    },
    "review": {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/chart-review.json",
      "sha256": "49cd0e187872eaea82e7107ba5e17320b8eb87b69d4b54de03083f7ad38a65ff"
    },
    "actionId": "A2"
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
  "decisionGap": "Page one is UK land-registry, vendor and law-firm pages. A US reader cannot find a neutral side-by-side that separates what the deed does (survivorship) from what federal tax law does at death, and that shows state law can change the default.",
  "finding": "Joint tenancy with right of survivorship passes a deceased owner's interest to the surviving owner(s) by the deed, while a tenancy in common has no survivorship: the deceased owner's share goes through that owner's estate. State law sets the default: Florida (Fla. Stat. 689.15, 2024 edition) treats a conveyance to two or more as a tenancy in common unless the instrument expressly provides for survivorship, except for tenancy by the entirety. For federal tax at death, a married couple's qualified joint interest includes one-half in the decedent's gross estate whatever each spouse paid, while non-spouse joint tenants face a full-value inclusion minus what the survivor can show was originally theirs. Neither form is a tax winner: the outcome depends on whether the owners are spouses, who paid, and whether community property rules apply.",
  "conditions": "Federal rules cited are 26 U.S.C. 2040, 26 U.S.C. 1014 and IRS Publication 551 (12/2025). Florida is one state's example of a state-law default (2024 edition including 2025C); other states differ and are not covered by captured sources (CA and NY statute sites returned 403). Tenancy-by-the-entirety is for spouses and 689.15 says entirety tenants become tenants in common on dissolution of marriage. Spouse vs non-spouse, who paid the purchase price, the survivorship language in the deed and community-property status all change the result.",
  "whatWouldChange": "A state with a different survivorship default; spouses holding as tenants by the entirety; unmarried co-owners with unequal contributions; a community property state (1014(b)(6)); owners who add a trust or beneficiary-style transfer instead of co-titling; any change to the cited statutes.",
  "caseSelection": {
    "path": "reports/mindmap-pass/runs/2026-11-23-comparison/evidence/tenants-in-common-vs-joint-tenancy/cases.json",
    "sha256": "ce2bf6e1018f8410789293722d2a55c5583e63c6e82592d386d80d07cf58564d"
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
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/lii-26-1014.txt",
      "sha256": "14ca71d3caddb1b684b1beecfc8b2508de9a898ffa2e62adbdacad4bf1675b2e"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/lii-26-2040.txt",
      "sha256": "1617e9902ff63bcb1829b7c50976b6451c967780241340740f6303a77c2d0f18"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/irs-p551.txt",
      "sha256": "8d3cb9d9d515f43907873adbf5bad971478e8ee0c27dc29f3ed35654adbf8031"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/irs-tc409.txt",
      "sha256": "d97888eed4326fc07a2342979cd7470715e9a5d1155ac43abb69b9b026327a09"
    },
    {
      "path": "reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/fl-689-15.txt",
      "sha256": "42fb32bc8b862c439afd8324378e3a528774aa21ec1d48dc4c59bdbb0f6cc1bb"
    }
  ],
  "whyNoQuantitativeAnalysis": "The decision is a rules-and-structure comparison on finite attributes. The primary texts answer it directly and there are no defensible sourced inputs for a model (state, year and personal-facts dependent). Arbitrary arithmetic would not add value, so the source-only reported branch applies.",
  "reasoning": "Fla. Stat. 689.15 reverses the common-law survivorship presumption: 'a devise, transfer or conveyance ... to two or more shall create a tenancy in common, unless the instrument creating the estate shall expressly provide for the right of survivorship; and in cases of estates by entirety, the tenants, upon dissolution of marriage, shall become tenants in common.' This one state example shows (a) survivorship comes from the instrument, (b) default rules are state law, and (c) spouses' tenancy by the entirety is separate. 26 U.S.C. 2040(a) includes the decedent's interest held as joint tenants with right of survivorship in the gross estate except what originally belonged to the survivor; 2040(b) includes one-half of a qualified joint interest (spouses as tenants by the entirety, or joint tenants with right of survivorship if the spouses are the only joint tenants). 26 U.S.C. 1014(a)(1) sets basis at fair market value at the date of death, 1014(b)(1) covers property acquired by bequest, devise or inheritance, 1014(b)(9) covers property required to be included in the gross estate by reason of death or form of ownership, and 1014(b)(6) covers a surviving spouse's half of community property. Pub. 551 gives the worked survivor-basis example and the community property state list. These support: survivorship is the main structural difference; tax basis differs by spouse status and contribution; there is no tax winner.",
  "counterexample": "The common belief that joint tenancy always gives the survivor a better tax result fails: for spouses, only one-half is included and stepped up as a qualified joint interest, whereas a non-spouse survivor's basis depends on contribution (Pub. 551 example: Jim's basis is $44,000 where he contributed one-third, $54,000 had he contributed nothing). In a community property state the surviving spouse's half also gets a new basis under 1014(b)(6) if at least half of the community interest was includible. So neither form wins on tax across the board.",
  "unknowns": [
    "Share-size rules (equal vs unequal), partition rights, mortgage, creditor and property-tax treatment, and state defaults other than Florida are NOT in captured sources: the page must not state them as facts. Say they are state-specific and not covered here.",
    "Whether a tenancy-in-common share is 'included in the gross estate' is not in the captured text (26 U.S.C. 2033 not captured): state only that inherited property takes a fair-market-value basis under 1014(a)(1) and (b)(1).",
    "Estate tax thresholds are not in the captured sources: do not state any exemption amount or whether tax is owed."
  ],
  "selectedMedium": "text + comparison table (resolved from approved presentation: interaction not-useful, animation not-useful)",
  "method": "Reported: read 26 U.S.C. 2040 and 1014 (Cornell LII), IRS Publication 551 (12/2025) and Fla. Stat. 689.15 (2024 edition including 2025C) captured 2026-11-23 UTC, quote the operative text, and map to comparison rows with the state-law caveat.",
  "findings": [
    {
      "label": "reported",
      "text": "Survivorship exists only if the instrument expressly provides it in Florida's default (Fla. Stat. 689.15, 2024 ed.)."
    },
    {
      "label": "reported",
      "text": "Spouses' qualified joint interest: one-half included in the decedent's gross estate regardless of contribution (26 U.S.C. 2040(b); Pub. 551)."
    },
    {
      "label": "reported",
      "text": "Non-spouse JTWROS: full value included except what the survivor originally owned (26 U.S.C. 2040(a)); Pub. 551 example shows survivor basis depends on contribution."
    },
    {
      "label": "reported",
      "text": "Property inherited or required to be included in the gross estate generally takes fair market value basis at death (26 U.S.C. 1014(a)(1), (b)(1), (b)(9)); community property surviving-spouse half exception 1014(b)(6)."
    },
    {
      "label": "unknown",
      "text": "Partition, creditors, mortgages, property tax and non-Florida defaults are state-specific and not sourced here."
    }
  ],
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [
      "research/sources/fl-689-15.txt",
      "research/sources/lii-26-2040.txt",
      "research/sources/lii-26-1014.txt",
      "research/sources/irs-p551.txt"
    ],
    "scopeAndLimits": "Federal tax statements limited to 26 U.S.C. 2040 and 1014 and Pub. 551; state-law statements limited to Florida's 2024 edition of 689.15 as one state's example.",
    "publicMethod": "Each finding names the statute or IRS publication beside it with a deep link; Florida labelled as one state's example with edition date.",
    "placement": "Opening answer, table cells, tax-basis section and takeaway"
  },
  "takeaway": {
    "conclusion": "Joint tenancy with survivorship fits co-owners who want the property to pass automatically to the survivor; tenancy in common fits co-owners who want a share to pass through their own estate to chosen heirs. Neither is a tax winner: spouse status, who paid, and community property rules decide the basis result.",
    "appliesTo": "Co-owners of US real estate (spouses, partners, relatives); general information, not legal advice.",
    "basis": "reported (statutes, IRS Publication 551, Florida statute as one state's example)",
    "changesIf": "Your state's survivorship default differs, you hold by the entirety as spouses, you live in a community property state, or contributions are unequal."
  },
  "closedFacts": [
    {
      "id": "FL-1",
      "source": "Fla. Stat. 689.15 (2024 Florida Statutes, including 2025C), The Florida Senate",
      "url": "https://www.flsenate.gov/Laws/Statutes/2024/689.15",
      "text": "689.15 Estates by survivorship.The doctrine of the right of survivorship in cases of real estate and personal property held by joint tenants shall not prevail in this state; that is to say, except in cases of estates by entirety, a devise, transfer or conveyance heretofore or hereafter made to two or more shall create a tenancy in common, unless the instrument creating the estate shall expressly provide for the right of survivorship; and in cases of estates by entirety, the tenants, upon dissolution of marriage, shall become tenants in common."
    },
    {
      "id": "USC2040-a",
      "source": "26 U.S.C. 2040(a), Cornell LII",
      "url": "https://www.law.cornell.edu/uscode/text/26/2040",
      "text": "The value of the gross estate shall include the value of all property to the extent of the interest therein held as joint tenants with right of survivorship by the decedent and any other person, or as tenants by the entirety by the decedent and spouse, or deposited, with any person carrying on the banking business, in their joint names and payable to either or the survivor, except such part thereof as may be shown to have originally belonged to such other person and never to have been received or acquired by the latter from the decedent for less than an adequate and full consideration in money or money's worth."
    },
    {
      "id": "USC2040-b",
      "source": "26 U.S.C. 2040(b), Cornell LII",
      "url": "https://www.law.cornell.edu/uscode/text/26/2040",
      "text": "In the case of any qualified joint interest, the value included in the gross estate with respect to such interest by reason of this section is one-half of the value of such qualified joint interest. The term qualified joint interest means any interest in property held by the decedent and the decedent's spouse as (A) tenants by the entirety, or (B) joint tenants with right of survivorship, but only if the decedent and the spouse of the decedent are the only joint tenants."
    },
    {
      "id": "USC1014-a",
      "source": "26 U.S.C. 1014(a)(1), Cornell LII",
      "url": "https://www.law.cornell.edu/uscode/text/26/1014",
      "text": "Except as otherwise provided in this section, the basis of property in the hands of a person acquiring the property from a decedent or to whom the property passed from a decedent shall, if not sold, exchanged, or otherwise disposed of before the decedent's death by such person, be the fair market value of the property at the date of the decedent's death (with the alternate valuation and special use valuation elections in (a)(2) and (a)(3))."
    },
    {
      "id": "USC1014-b1",
      "source": "26 U.S.C. 1014(b)(1), Cornell LII",
      "url": "https://www.law.cornell.edu/uscode/text/26/1014",
      "text": "Property considered acquired from or passed from the decedent includes property acquired by bequest, devise, or inheritance, or by the decedent's estate from the decedent."
    },
    {
      "id": "USC1014-b9",
      "source": "26 U.S.C. 1014(b)(9), Cornell LII",
      "url": "https://www.law.cornell.edu/uscode/text/26/1014",
      "text": "In the case of decedents dying after December 31, 1953, property acquired from the decedent by reason of death, form of ownership, or other conditions, if by reason thereof the property is required to be included in determining the value of the decedent's gross estate under chapter 11 of subtitle B, is also considered acquired from the decedent (with a basis reduction for deductions allowed to the taxpayer if the property was acquired before the decedent's death)."
    },
    {
      "id": "USC1014-b6",
      "source": "26 U.S.C. 1014(b)(6), Cornell LII",
      "url": "https://www.law.cornell.edu/uscode/text/26/1014",
      "text": "In the case of decedents dying after December 31, 1947, property which represents the surviving spouse's one-half share of community property held by the decedent and the surviving spouse under the community property laws of any State, or possession of the United States or any foreign country, is considered acquired from the decedent if at least one-half of the whole of the community interest in such property was includible in determining the value of the decedent's gross estate."
    },
    {
      "id": "P551-1",
      "source": "IRS Publication 551 (12/2025), Property Held by Surviving Tenant",
      "url": "https://www.irs.gov/publications/p551",
      "text": "Example: John and Jim owned, as joint tenants with right of survivorship, business property purchased for $30,000. John furnished two-thirds of the purchase price and Jim furnished one-third. Depreciation deductions allowed before John's death were $12,000. Under local law, each had a half interest in the income from the property. At the date of John's death, the property had an FMV of $60,000, two-thirds of which is includible in John's estate. Jim's basis at the date of John's death is $44,000. If Jim hadn't contributed any part of the purchase price, Jim's basis at the date of John's death would be $54,000. If under local law Jim had no interest in the income from the property and contributed no part of the purchase price, Jim's basis at John's death would be $60,000, the FMV of the property."
    },
    {
      "id": "P551-2",
      "source": "IRS Publication 551 (12/2025), Qualified Joint Interest",
      "url": "https://www.irs.gov/publications/p551",
      "text": "Include one-half of the value of a qualified joint interest in the decedent's gross estate. It doesn't matter how much each spouse contributed to the purchase price. Also, it doesn't matter which spouse dies first. A qualified joint interest is any interest in property held by married individuals as either tenants by the entirety, or joint tenants with right of survivorship if the married couple are the only joint tenants. As the surviving spouse, your basis in property you owned with your spouse as a qualified joint interest is the cost of your half of the property with certain adjustments. Decrease the cost by any deductions allowed to you for depreciation and depletion. Increase the cost by your basis in the half you inherited."
    },
    {
      "id": "P551-3",
      "source": "IRS Publication 551 (12/2025), Community Property",
      "url": "https://www.irs.gov/publications/p551",
      "text": "In community property states (Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, and Wisconsin), married individuals are each usually considered to own half the community property. When either spouse dies, the total value of the community property, even the part belonging to the surviving spouse, generally becomes the basis of the entire property. For this rule to apply, at least half the value of the community property interest must be includible in the decedent's gross estate, whether or not the estate must file a return."
    },
    {
      "id": "TC409",
      "source": "IRS Topic no. 409, Capital gains and losses",
      "url": "https://www.irs.gov/taxtopics/tc409",
      "text": "Generally, an asset's basis is its cost to the owner, but if you received the asset as a gift or inheritance, refer to Publication 551, Basis of Assets for information about your basis."
    },
    {
      "id": "INF-2",
      "source": "Inference from FL-1 and USC1014-b1 (flag as inference)",
      "url": null,
      "text": "Tenancy in common has no survivorship: under Florida's default, a conveyance to two or more creates a tenancy in common unless the instrument expressly provides for survivorship, so a tenant in common's share does not pass to the co-owner by survivorship and instead passes through that owner's estate; property acquired by bequest, devise or inheritance is covered by 1014(b)(1). Do not state share sizes, partition, creditor, mortgage or property-tax rules."
    }
  ],
  "internalLinksAllowed": [
    "/guides/how-to-fund-a-trust/",
    "/compare/living-trust-vs-will/"
  ],
  "faqPlan": [
    "What happens to a tenant in common when they die?",
    "What happens to a joint tenant when they die?",
    "Which is better for taxes, tenants in common or joint tenancy?",
    "What are the disadvantages of joint tenancy?",
    "Which is better, tenants in common or joint tenancy?"
  ],
  "faqNote": "PAA 4/4 on-topic (death of a tenant, taxes, disadvantages, which is better). Disadvantages answer must stay within sources: survivorship removes the ability to leave your share to chosen heirs through a will (inference from FL-1/USC2040), non-spouse inclusion rules and state defaults; do not add creditor, partition or mortgage claims.",
  "stateLawNote": "Florida 2024 edition (including 2025C) is ONE state's example. Include the entirety note from 689.15. Keep a not-legal-advice disclaimer at the bottom only.",
  "caseUses": [],
  "exclusions": [
    "_experience.md section G excludes financial, legal and professional services from any 'we tested' claim: TESTED format disabled, no testing/howWeTested/tested schema or byline.",
    "Basis is reported: never write 'In our internal testing/modeling/analysis', 'we tested' or 'we modeled'. Attribute each finding to the named primary source ('Investor.gov says...', 'Section 689.15 provides...').",
    "Disclaimer (general information, not legal/tax/investment advice) goes at the bottom only. No named-reviewer or professional-review claim."
  ],
  "growth": {
    "path": "reports/mindmap-pass/runs/2026-11-23-comparison/evidence/tenants-in-common-vs-joint-tenancy/growth.json"
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
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/lii-26-1014.txt`
```
URL: https://www.law.cornell.edu/uscode/text/26/1014
Retrieved (UTC): 2026-11-23T08:07:18Z
HTTP: 200

Subtitle A > CHAPTER 1 > Subchapter O > PART II > § 1014" />
 26 U.S. Code § 1014 - Basis of property acquired from a decedent | U.S. Code | US Law | LII / Legal Information Institute
 Please help us improve our site!
 ×
 No thank you
Quick search by citation:
 Title
 Section
 Go!
 26 U.S. Code § 1014 - Basis of property acquired from a decedent 
 U.S. Code 
 Notes 
prev | next
(a) In generalExcept as otherwise provided in this section, the basis of property in the hands of a person acquiring the property from a decedent or to whom the property passed from a decedent shall, if not sold, exchanged, or otherwise disposed of before the decedent’s death by such person, be—
(1)
 the fair market value of the property at the date of the decedent’s death,
(2)
 in the case of an election under section 2032, its value at the applicable valuation date prescribed by such section,
(3)
 in the case of an election under section 2032A, its value determined under such section, or
(4)
 to the extent of the applicability of the exclusion described in section 2031(c), the basis in the hands of the decedent.
(b) Property acquired from the decedentFor purposes of subsection (a), the following property shall be considered to have been acquired from or to have passed from the decedent:
(1)
 Property acquired by bequest, devise, or inheritance, or by the decedent’s estate from the decedent;
(2)
 Property transferred by the decedent during his lifetime in trust to pay the income for life to or on the order or direction of the decedent, with the right reserved to the decedent at all times before his death to revoke the trust;
(3)
 In the case of decedents dying after December 31, 1951, property transferred by the decedent during his lifetime in trust to pay the income for life to or on the order or direction of the decedent with the right reserved to the decedent at all times before his death to make any change in the enjoyment thereof through the exercise of a power to alter, amend, or terminate the trust;
(4)
 Property passing without full and adequate consideration under a general power of appointment exercised by the decedent by will;
(5)
 In the case of decedents dying after August 26, 1937, and before January 1, 2005, property acquired by bequest, devise, or inheritance or by the decedent’s estate from the decedent, if the property consists of stock or securities of a foreign corporation, which with respect to its taxable year next preceding the date of the decedent’s death was, under the law applicable to such year, a foreign personal holding company. In such case, the basis shall be the fair market value of such property at the date of the decedent’s death or the basis in the hands of the decedent, whichever is lower;
(6)
 In the case of decedents dying after December 31, 1947, property which represents the surviving spouse’s one-half share of community property held by the decedent and the surviving spouse under the community property laws of any State, or possession of the United States or any foreign country, if at least one-half of the whole of the community interest in such property was includible in determining the value of the decedent’s gross estate under chapter 11 of subtitle B (section 2001 and following, relating to estate tax) or section 811 of the Internal Revenue Code of 1939;
[(7)
, (8) Repealed. Pub. L. 113–295, div. A, title II, § 221(a)
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/lii-26-2040.txt`
```
URL: https://www.law.cornell.edu/uscode/text/26/2040
Retrieved (UTC): 2026-11-23T08:07:18Z
HTTP: 200

Subtitle B > CHAPTER 11 > Subchapter A > PART III > § 2040" />
 26 U.S. Code § 2040 - Joint interests | U.S. Code | US Law | LII / Legal Information Institute
 Please help us improve our site!
 ×
 No thank you
Quick search by citation:
 Title
 Section
 Go!
 26 U.S. Code § 2040 - Joint interests 
 U.S. Code 
 Notes 
prev | next
(a) General rule
The value of the gross estate shall include the value of all property to the extent of the interest therein held as joint tenants with right of survivorship by the decedent and any other person, or as tenants by the entirety by the decedent and spouse, or deposited, with any person carrying on the banking business, in their joint names and payable to either or the survivor, except such part thereof as may be shown to have originally belonged to such other person and never to have been received or acquired by the latter from the decedent for less than an adequate and full consideration in money or money’s worth: Provided, That where such property or any part thereof, or part of the consideration with which such property was acquired, is shown to have been at any time acquired by such other person from the decedent for less than an adequate and full consideration in money or money’s worth, there shall be excepted only such part of the value of such property as is proportionate to the consideration furnished by such other person: Provided further, That where any property has been acquired by gift, bequest, devise, or inheritance, as a tenancy by the entirety by the decedent and spouse, then to the extent of one-half of the value thereof, or, where so acquired by the decedent and any other person as joint tenants with right of survivorship and their interests are not otherwise specified or fixed by law, then to the extent of the value of a fractional part to be determined by dividing the value of the property by the number of joint tenants with right of survivorship.
(b) Certain joint interests of husband and wife
(1) Interests of spouse excluded from gross estate
Notwithstanding subsection (a), in the case of any qualified joint interest, the value included in the gross estate with respect to such interest by reason of this section is one-half of the value of such qualified joint interest.
(2) Qualified joint interest definedFor purposes of paragraph (1), the term “qualified joint interest” means any interest in property held by the decedent and the decedent’s spouse as—
(A)
 tenants by the entirety, or
(B)
 joint tenants with right of survivorship, but only if the decedent and the spouse of the decedent are the only joint tenants.
(Aug. 16, 1954, ch. 736, 68A Stat. 385; Pub. L. 87–834, § 18(a)(2)(G), Oct. 16, 1962, 76 Stat. 1052; Pub. L. 94–455, title XX, § 2002(c)(1), (3), Oct. 4, 1976, 90 Stat. 1855, 1856; Pub. L. 95–600, title V, § 511(a), title VII, § 702(k)(2), Nov. 6, 1978, 92 Stat. 2881, 2932; Pub. L. 96–222, title I, § 105(a)(3), Apr. 1, 1980, 94 Stat. 218; Pub. L. 97–34, title IV, § 403(c)(1)–(3)(A), Aug. 13, 1981, 95 Stat. 301, 302.)
Editorial Notes
Amendments
1981—Subsec. (a). Pub. L. 97–34, § 403(c)(2), substituted “joint tenants with right of survivorship” for “joint tenants” in three places.
Subsec. (b)(2). Pub. L. 97–34, § 403(c)(1), in redefining “qualified joint interest” substituted provision defining term as meaning any interest in property held by the decedent and the decedent’s 
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/irs-p551.txt`
```
URL: https://www.irs.gov/publications/p551
Retrieved (UTC): 2026-11-23T08:07:19Z
HTTP: 200

Publication 551 (12/2025), Basis of Assets | Internal Revenue Service
 Skip to main content
 Official websites use .gov
 A .gov website belongs to an official government organization in the United States.
 Secure .gov websites use HTTPS
 A lock
 ()
 or https:// means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.
 Search IRS tasks, forms, and answers
 Suggestions
 English
 Español
中文 (简体)
中文 (繁體)
한국어
Русский
Tiếng Việt
Kreyòl ayisyen
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
Businesses & Self-Employed
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
Form 1040 Instructions
Form W-9
Form 4506-T
Form W-4
Form 941
Form W-2
Form 9465
POPULAR FOR TAX PROS
Form 1040-X
Form 2848
Form W-7
Circular 230
 Report Fraud
 Overview
Tax fraud and scams
Identity theft
Fake IRS email or message
Tax return preparer misconduct
Help for tax professionals
 Search
 Include Historical Content
 - Any -No
 Include Historical Content
 - Any -No
Search
 Publication 551 - Introductory Material
 Future Developments
 What’s New
 Reminder
 Introduction
 Comments and suggestions.
 Getting answers to your tax questions.
 Getting tax forms, instructions, and publications.
 Ordering tax forms, instructions, and publications.
 Useful Items - You may want to see:
 Publication 551 - Main Contents
 Cost Basis
 Loans with low or no interest.
 Purchase of a business.
 Stocks and Bonds
 Identifying stock or bonds sold.
 Mutual fund shares.
 Real Property
 Real estate taxes.
 Settlement costs.
 Points.
 Points on home mortgage.
 Assumption of mortgage.
 Constructing assets.
 Business Assets
 Uniform Capitalization Rules
 Activities subject to the rules.
 More information.
 Exceptions.
 Intangible Assets
 Patents.
 Copyrights.
 Franchises, trademarks, and trade names.
 Allocating the Basis
 Group of Assets Acquired
 Trade or Business Acquired
 Agreement.
 Reporting requirement.
 More information.
 Land and Buildings
 Demolition of building.
 Modification of building.
 Subdivided lots.
 Future improvement costs.
 Use of erroneous cost basis.
 Adjusted Basis
 Increases to Basis
 Assessments for Local Improvements
 Deducting vs. Capitalizing Costs
 Table 1. Examples of Increases and Decreases to Basis
 Decreases to Basis
 Casualties and Thefts
 Easements
 Vehicle Credits
 Residential Energy Credits
 Gas-Guzzler Tax
 Section 179 Deduction
 Exclusion of Subsidies for Energy Conservation Measures
 Depreciation
 Canceled Debt Excluded From Income
 Postponed Gain From Sale of Home
 Adoption Tax Benefits
 Employer-
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/irs-tc409.txt`
```
URL: https://www.irs.gov/taxtopics/tc409
Retrieved (UTC): 2026-11-23T08:07:19Z
HTTP: 200

Topic no. 409, Capital gains and losses | Internal Revenue Service
 Skip to main content
 Official websites use .gov
 A .gov website belongs to an official government organization in the United States.
 Secure .gov websites use HTTPS
 A lock
 ()
 or https:// means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.
 Search IRS tasks, forms, and answers
 Suggestions
 English
 Español
中文 (简体)
中文 (繁體)
한국어
Русский
Tiếng Việt
Kreyòl ayisyen
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
Businesses & Self-Employed
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
Form 1040 Instructions
Form W-9
Form 4506-T
Form W-4
Form 941
Form W-2
Form 9465
POPULAR FOR TAX PROS
Form 1040-X
Form 2848
Form W-7
Circular 230
 Report Fraud
 Overview
Tax fraud and scams
Identity theft
Fake IRS email or message
Tax return preparer misconduct
Help for tax professionals
 Search
 Include Historical Content
 - Any -No
 Include Historical Content
 - Any -No
Search
 Topic no. 409, Capital gains and losses
 English
Español
中文 (繁體)
한국어
Русский
Tiếng Việt
 More In Help
 Interactive Tax Assistant
 Tools
 Report fraud
 Tax scams
 Identity theft
 Notices and letters
 Appeals
 Frequently asked questions
 Accessibility
 Contact your local IRS office
 Contact an international IRS office
 Tax topics
 Other languages
 Almost everything you own and use for personal or investment purposes is a capital asset. Examples of capital assets include a home, personal-use items like household furnishings, and stocks or bonds held as investments. When you sell a capital asset, the difference between the adjusted basis in the asset and the amount you realized from the sale is a capital gain or a capital loss. Generally, an asset's basis is its cost to the owner, but if you received the asset as a gift or inheritance, refer to Publication 551, Basis of Assets for information about your basis. You have a capital gain if you sell the asset for more than your adjusted basis. You have a capital loss if you sell the asset for less than your adjusted basis. Losses from the sale of personal-use property, such as your home or car, aren't tax deductible.
Short-term or long-term
To correctly arrive at your net capital gain or loss, capital gains and losses are classified as long-term or short-term. Generally, if you hold the asset for more than one year before you dispose of it, your capital gain or loss is long-term. If you hold it one year or less, your capital gain or loss is short-term. For exceptions to this rule, such as property acqui
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/irs-tc701.txt`
```
URL: https://www.irs.gov/taxtopics/tc701
Retrieved (UTC): 2026-11-23T08:08:16Z
HTTP: 200

Topic no. 701, Sale of your home | Internal Revenue Service
 Skip to main content
 Official websites use .gov
 A .gov website belongs to an official government organization in the United States.
 Secure .gov websites use HTTPS
 A lock
 ()
 or https:// means you've safely connected to the .gov website. Share sensitive information only on official, secure websites.
 Search IRS tasks, forms, and answers
 Suggestions
 English
 Español
中文 (简体)
中文 (繁體)
한국어
Русский
Tiếng Việt
Kreyòl ayisyen
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
Businesses & Self-Employed
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
Form 1040 Instructions
Form W-9
Form 4506-T
Form W-4
Form 941
Form W-2
Form 9465
POPULAR FOR TAX PROS
Form 1040-X
Form 2848
Form W-7
Circular 230
 Report Fraud
 Overview
Tax fraud and scams
Identity theft
Fake IRS email or message
Tax return preparer misconduct
Help for tax professionals
 Search
 Include Historical Content
 - Any -No
 Include Historical Content
 - Any -No
Search
 Topic no. 701, Sale of your home
 English
Español
中文 (繁體)
한국어
Русский
Tiếng Việt
 More In Help
 Interactive Tax Assistant
 Tools
 Report fraud
 Tax scams
 Identity theft
 Notices and letters
 Appeals
 Frequently asked questions
 Accessibility
 Contact your local IRS office
 Contact an international IRS office
 Tax topics
 Other languages
 The $250,000/$500,000 home sale tax exclusion - If you have a capital gain from the sale of your main home, you may qualify to exclude up to $250,000 of that gain from your income, or up to $500,000 of that gain if you file a joint return with your spouse. Publication 523, Selling Your Home provides rules and worksheets. Topic no. 409 covers general capital gain and loss information.
Qualifying for the exclusion
In general, to qualify for this exclusion, you must meet both the ownership test and the use test. If you are filing jointly with your spouse, either you or your spouse must meet the ownership test while both you and your spouse must meet the use test individually.
If you or your spouse owned the home for at least 24 months (2 years) out of the last 5 years leading up to the date of the sale, you meet the ownership test. If you and your spouse used the home as a residence for at least 24 months (2 years) of the previous 5 years, you meet the use test. You can meet the ownership and use tests during different 2-year periods. However, you must meet both tests during the 5-year period ending on the date of the sale. Generally, you're not eligible for the exclusion if you excluded the gain from the sale of another
```
### `reports/mindmap-pass/runs/2026-11-23-comparison/research/sources/fl-689-15.txt`
```
URL: https://www.flsenate.gov/Laws/Statutes/2024/689.15
Retrieved (UTC): 2026-11-23T08:08:16Z
HTTP: 200

Chapter 689 Section 15 - 2024 Florida Statutes - The Florida Senate
 Skip to Navigation | Skip to Main Content | Skip to Site Map
 FLHouse.gov | Mobile Site
 Senate Tracker: Sign Up | Login 
 Go to Bill:
 Session:
 2027
 2026 Org.
 2026F
 2026E
 2026D
 2026
 2025
 2025C
 2025B
 2025A
 2024 Org.
 2024
 2023C
 2023
 2023B
 2022A
 2022 Org.
 2022D
 2022C
 2022
 2021B
 2021A
 2021
 2020 Org.
 2020
 2019 I
 2019
 2018 Org.
 2018
 2017A
 2017
 2016 Org.
 2016
 2015C
 2015B
 2015A
 2015
 2014 Org.
 2014A
 2014
 2013
 2012 Org.
 2012B
 2012
 2011
 2010A
 2010 Org.
 2010C
 2010
 2009B
 2009
 2009A
 2008 Org.
 2008
 2007D
 2007C
 2007B
 2007
 2007A
 2006 Org.
 2006
 2005B
 2005
 2004A
 2004 Org.
 2004
 2003E
 2003D
 2003C
 2003B
 2003A
 2003
 2002 Org.
 2002E
 2002D
 2002
 2001C
 2001B
 2001
 2000A (Dec.)
 2000 Org.
 2000
 2000A (Jan.)
 1999
 1998 Org
 1998
 Find Statutes:
 2026
 2025
 2024
 2023
 2022
 2021
 2020
 2019
 2018
 2017
 2016
 2015
 2014
 2013
 2012
 2011
 2010
 2009
 2008
 2007
 2006
 2005
 2004
 2003
 2002
 2001
 2000
 1999
 1998
 1997
 Search
 Home > Laws > 2024 Florida Statutes > Title XL > 
 Chapter 689 > Section 15 
 Quick Links
 General Laws Conversion Table (2026) (PDF)
 Florida Statutes Definitions Index (2026) (PDF)
 Table of Section Changes (2026) (PDF)
 Preface to the Florida Statutes (2026) (PDF)
 Table Tracing Session Laws to Florida Statutes (2026) (PDF)
 Index to Special and Local Laws (1971-2026) (PDF)
 Index to Special and Local Laws (1845-1970) (PDF)
 Statute Search Tips
 2024 Florida Statutes (Including 2025C) 
 Title XL REAL AND PERSONAL PROPERTY
 Chapter 689
 CONVEYANCES OF LAND AND DECLARATIONS OF TRUST 
 Entire Chapter
 SECTION 15 
 Estates by survivorship.
F.S. 689.15
689.000000000000
Conveyances of land and declarations of trust
2024.00000000000
0689.15
15
689.15 Estates by survivorship.—The doctrine of the right of survivorship in cases of real estate and personal property held by joint tenants shall not prevail in this state; that is to say, except in cases of estates by entirety, a devise, transfer or conveyance heretofore or hereafter made to two or more shall create a tenancy in common, unless the instrument creating the estate shall expressly provide for the right of survivorship; and in cases of estates by entirety, the tenants, upon dissolution of marriage, shall become tenants in common.History.—s. 20, Nov. 17, 1829; RS 1819; GS 2294; RGS 3617; CGL 5482; s. 3, ch. 20954, 1941; s. 1, ch. 73-300.

```

## WRITER TASK ADDENDUM (data only; copied from the approved plan, reviewer guardrails and evidence packet)
- register: operator. page type: comparison (body floor 1,500 words; table cells, title, meta, headings do not count). medium: text + comparison table. teeup-exempt: source-only reported comparison, no honest first-hand experience to tee up. anchor-exempt: no approved case record fits (all 8 retrieved records rejected).
- Reader question (plain text, NO bracket tag on the page): "What is the difference between tenants in common and joint tenancy?"
- Basis is reported. Name the primary source beside every finding ("Investor.gov says...", "Section ... provides...") with a deep markdown link on its first mention. Never write 'we tested', 'in our testing', 'we modeled' or 'our analysis' as if we ran something. No client or experience claim.
- Output ONE JSON object, comparison schema. Keys: slug "tenants-in-common-vs-joint-tenancy", title (50 to 60 characters, carries "tenants in common vs joint tenancy", ONE clause: no colon or comma splice, no 'and why'), metaDescription (150 to 160 characters, no 'We tested'), targetKeyword "tenants in common vs joint tenancy", optionA "Tenants in Common", optionB "Joint Tenancy", segment "Estate Planning", h1 (Title Case, one clause, keyword inside), introText (direct answer first, short sentence 1; paragraphs separated by blank lines; second paragraph may state the condition that changes the answer), comparisonTable.rows (7 to 9 objects {dimension, a, b}; each cell a sourced fact with a markdown link on the first mention of the source, no 'check the site' cells, no raw HTML; if a fact is not in the closed list put 'Not covered by the sources here' instead of a guess), tableHeading "What Happens to Each Owner's Share at Death", verdictHeading (Title Case, e.g. 'Our Takeaway for Tenants in Common vs Joint Tenancy'), verdict (fuller takeaway: answer, evidence basis named, the exception, then ends with a concrete next-action sentence carrying the primary keyword), disclaimerText (ONE sentence, general information not advice, bottom-of-page slot), sections (see below), faqs, sources, relatedComparisons ["living-trust-vs-will", "probate-vs-trust", "power-of-attorney-vs-will", "living-trust-vs-lady-bird-deed"], calculatorLinks [].
- Layout rule: because disclaimerText is set, sections[0].heading MUST equal tableHeading exactly; sections[0].content is the opening-answer section that renders above the table (it must add facts the introText did not say, not restate it). sections[1..] follow the approved outline order below. verdict renders after the sections. FAQs: sentence-case questions from faqPlan, each answer opens with the direct answer.
- Approved outline headings (Title Case exactly): see 'Approved Section Outline' above. Table rows to cover: survivorship at death; where a deceased owner's share goes; Florida default under 689.15 (one state's example, 2024 edition); tenancy by the entirety note; federal estate inclusion for spouses vs non-spouses (26 U.S.C. 2040); basis at death (26 U.S.C. 1014 and IRS Publication 551); community property states.
- Internal links allowed (markdown with trailing slash, only these): /guides/how-to-fund-a-trust/ (anchor 'how to fund a trust', in 'Who Should Choose Each Option'); /compare/living-trust-vs-will/ (anchor 'living trust vs will', in 'Who Should Choose Each Option').
- External links: ONLY the closed URL list for this page; first mention of every organisation linked: The Florida Senate, Legal Information Institute at Cornell Law School (LII), Internal Revenue Service (IRS).
- Who this is not for: unmarried partners with unequal contributions, blended families, and anyone whose state default differs from Florida's. Say what they should do instead: read how the deed language and their state's statute treat survivorship, and consider the estate-planning alternatives linked in the outbound placements (trust funding, living trust vs will); do not give personalized advice. Also include 'What would change our answer' using the evidence packet whatWouldChange.
- Reviewer guardrails specific to this page:
  - CR1-A2-BASIS-OVERSTATE: condition the opening answer, table and takeaway: spouse versus non-spouse, who paid (contribution), and the community-property exception in 26 U.S.C. 1014(b)(6) (P551-3, USC1014-b6). Never present either form as the tax winner.
  - CR1-A2-STATE-LAW: cite 'Florida Statutes, 2024 edition' (including 2025C) and label Florida as ONE state's example. Include the entirety note that 689.15 itself states (FL-1). Creditor, partition, mortgage, property-tax, share-size and non-Florida default claims are NOT sourced: do not state them; say they are state-specific and not covered here. The opening answer must say state law sets the default.
  - Disclaimer (general information, not legal or tax advice; a lawyer licensed in the state can confirm) goes ONLY in disclaimerText, never in title, intro or first section.
  - Use only the closed facts. Do not state estate tax exemption amounts, probate timelines or costs, or any figure not listed.
- Depth: 1,500+ body words by answering the sub-questions in the evidence packet (conditions, counterexample, unknowns), not by padding. Headings Title Case; every acronym defined on first use; no em dashes; no Conclusion or Summary heading; no 'honest', no 'the vendor/platform/tool'.
- sources: one object per source actually used: {"label","url"} using ONLY the closed URL list.
- Anything not on the evidence packet's closedFacts list, you do not know. Never invent a price, limit, statute, date, number or URL; leave it out.

## ROUND-2 ADDED CLOSED FACTS
- USC2033: "The value of the gross estate shall include the value of all property to the extent of the interest therein of the decedent at the time of his death." (26 U.S.C. 2033, https://www.law.cornell.edu/uscode/text/26/2033). A tenant in common's own share, owned at death, is included in the gross estate.
- FL-2025: the 2025 edition of Fla. Stat. 689.15 (https://www.flsenate.gov/Laws/Statutes/2025/689.15) reads the same as the 2024 edition. Cite the 2025 Florida Statutes.
