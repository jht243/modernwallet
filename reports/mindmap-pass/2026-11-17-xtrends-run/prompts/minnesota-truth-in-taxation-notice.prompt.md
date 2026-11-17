# Approved Page Assignment: `/guides/minnesota-truth-in-taxation-notice` (`minnesota-truth-in-taxation-notice`)
- **Action ID:** `A3` (create new content)
- **Title:** Minnesota Truth-in-Taxation Notice: Read Your 2027 Proposed Tax
- **Page Type / Format / Medium:** guide (explainer/how-to, 1,200-word floor) | article - the reader wants to interpret a notice and know what to do before the hearing | text
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** Why did my Minnesota proposed 2027 property tax go up, how do I read the Truth-in-Taxation notice and what can I do before final levies are set? [PAA 0/0 unread; ac 10/47 question completions, what/how/is-it-legit family]
- **Working Answer (Col 11), SEE CORRECTION BLOCK BELOW (the original wording that treats the figure as a ceiling is superseded):** The notice is a proposal built from preliminary local levies (statewide up to $949 million, 6.5% higher); read the current-versus-proposed columns per taxing authority, attend a local hearing, and remember final levies, due Dec 28 2026, can be lower but not higher. Shape: how-to-read plus next step.
- **Answer Placement (Col 12):** Section 1: 'What Your Truth-in-Taxation Notice Is and What You Can Do'

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent plus seasonal news (Minnesota DOR press release 2026-11-12; notices mailed Nov 11-24). lookup: no match (no property-tax-notice page anywhere on the site). Autocomplete bands (estimate, NOT measured): truth in taxation notice 20-200/mo; minnesota truth in taxation and minnesota property tax increase 2027 are low-signal bands. Fresh-trend rule applies.
- **Keyword Evidence:** "Provider ladder pinned semrush,dataforseo; SEMRUSH has no key and DataForSEO unavailable on 2026-11-17, so every figure is 'source: estimate (Google Autocomplete), NOT measured', US, checked 2026-11-17 (research/keyword-volumes.json). Primary: 'truth in taxation notice' (20-200 band, 5 completions) with 'minnesota' modifier. Supporting: 'minnesota truth in taxation', 'minnesota property tax increase 2027', 'proposed property tax notice' (see JSON). Seasonal: notices arrive Nov 11-24 2026."
- **Why New Page / Angle:** Closest existing: none (coverage_lookup 0 repo/0 sitemap). /guides/tax-deductions-for-homeowners/ covers federal deductions, not a Minnesota notice. Independent duplicate review: required of CHART-REVIEW.
- **Intent-Based Our Takeaway (corrected, supersedes the brief wording):** "For Minnesota homeowners with a proposed-tax notice: the notice is a proposal; each authority's final levy is generally capped at its proposed levy (Department of Revenue) but your bill can still differ because of items the notice excludes (special assessments, later voter-approved levies and others in subd. 3(e)) and your own valuation and classification. Compare current versus proposed by authority and attend the hearing of the body driving the change. Never call the figure a ceiling. Changes with final levies (Dec 28 2026; Department of Revenue releases final data in February). Attributed to the Department of Revenue, Minn. Stat. 275.065 and CBS Minnesota."

## Approved Section Outline
1. **What Your Truth-in-Taxation Notice Is and What You Can Do** — Section 1 answer: a proposal from preliminary levies; read it, attend the hearing, final levies set by Dec 28 2026 can be lower but not higher; statewide preliminary levies up to $949 million (6.5%) over 2026
2. **Why Proposed Taxes Are Rising in 2027** — DOR figures by taxing type: cities 8.1%, counties 8.1%, townships 4.9%, schools 5.0%, special districts 3.7%; last year final levy was $74 million below preliminary (6.4% final)
3. **How to Read the Notice, Column by Column** — Per Minn. Stat. 275.065 subd. 3: current year taxes, proposed taxes, percent change, taxing authority meeting times, market value shown; statute-only reading, no invented layout
4. **How to Use the Hearing** — Which bodies must hold meetings (cities over 500 people, counties, school districts, regional library authorities, metropolitan taxing districts), window late Nov to late Dec, what to prepare; start times not stated (unverified)
5. **What the Hearing Can and Cannot Change** — Final levy cannot exceed proposed; town and state general tax proposed equals final; the page does not cover valuation appeals (unverified, separate process)
6. **Our Takeaway** — Planned takeaway below
7. **Frequently Asked Questions** — Is the notice a bill, is the notice legitimate, can my tax go up after the notice, when are final levies set, who must hold a hearing

## Approved Internal Outbound Links
- {"source": "/guides/minnesota-truth-in-taxation-notice/", "target": "/guides/tax-deductions-for-homeowners/", "section": "Our Takeaway", "anchor": "homeowner tax deductions", "purpose": "Readers who pay property tax see what can be deducted", "inspection": {"path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/homeowner-deductions.txt", "sha256": "e0cf0753e000d2977ce6886b7c5832bfc368860a294a9b7ac3df15ccc8dc8e35"}}
- {"source": "/guides/minnesota-truth-in-taxation-notice/", "target": "/mortgage/home-affordability-calculator/", "section": "Our Takeaway", "anchor": "home affordability calculator", "purpose": "Readers re-test affordability with the proposed tax", "inspection": {"path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/home-afford.txt", "sha256": "cf96363f699cfbeb816daebaaa1fce353fc9b829086daa440fc0cc22816d8302"}}

## Reviewer Guardrails (Must Respect)
- F-A3-CEILING (substantive): Rewrite the A3 takeaway, answer sentence and REQ-3 acceptance as: the notice is a proposal; each authority's final levy is generally capped at its proposed levy (DOR) but your bill can still differ because of items the notice excludes and your own valuation/classification; compare current vs proposed by authority, attend the hearing of the body driving the change. Put the exclusions list (subd. 3(e)) and 'could be more or less' in the first answer, FAQ and takeaway. Never write 'ceiling' for the parcel figure.
- F-A3-LEVY-EXCEPTIONS (substantive): Attribute 'can be set lower, not higher' to the Minnesota DOR press release (2026-11-12), add 'with limited statutory exceptions' and name the main exceptions from subd. 6(a); state the town and state general tax rule with its special-town-meeting exception; keep Dec 28, 2026 as DOR's stated date.
- F-A3-HEARING-TIME (minor): Optional: WRITE may state 'after November 24, not before 6:00 p.m.' attributed to Minn. Stat. 275.065 subd. 3(c) and tell readers to use the date/time printed on their own notice. Keep specific start times for any given body, and the valuation-appeal path, excluded.
- F-A2-DATES (substantive): Section 1, FAQ and takeaway state both dates with attribution (Treasury SB-0690 for the final regulations; the statute for the enactment date), say the sources do not tell a worker which date governs a given plan, and never say or imply a current plan is exempt or has until 2028. Do not print 'TD 10061' or any Federal Register number.
- F-A2-SCHEDULE (substantive): Label the table 'minimum path under the rule, our illustrative arithmetic': start 3, +1 per completed year of participation, 10 after seven steps, plan may start higher (up to 10) or step faster up to 15. Worked example ($60,000: $1,800 at 3%, $6,000 at 10%) must say pre-tax salary-only arithmetic, not a prediction.
- F-A2-EXEMPTIONS (substantive): State exemptions at statute precision, attribute detail changes to the regulations only as 'Treasury says the final rules clarify them', do not describe regulation-level definitions. Takeaway: check whether the plan is exempt or voluntarily auto-enrolls with another default.
- F-A2-BASIS (minor): Choose one: basis 'reported' with the table described as the rule's schedule shown for illustration (no 'internal analysis' wording), or basis 'calculated' with an executed script and full execution record. Either way, the page's main answer rests on Treasury/IRC, not on our arithmetic.
- F-A2-ANCHOR (minor): Use an anchor that matches the destination reader question, for example 'how 401(k) automatic enrollment defaults work', or add sourced content; do not claim Roth/traditional default rules.
- F-A1-REGE (substantive): State Reg E only as: if you believe an electronic transfer was unauthorized, incorrect or omitted, notice of error within 60 days of the statement and the 10-business-day / 45-day investigation clock apply (cite 1005.11). Say plainly that sources checked do not say whether outage-related fees or delays count as errors; keep the fee-reversal ask as a request to Chase. Quote Zelle's statement directly ('An issue at the financial institutions may be delaying Zelle payments').
- F-A1-NBC630 (minor): Writer may say: a Chase spokesperson told NBC News around 6:30 p.m. that transactions were posting normally (time zone as printed by NBC, article stamped EST); do not say service was fully restored or give 'ET' as an independent fact. Correct the readiness wording in the run record when convenient; no re-research needed.
- F-A1-LATEFEE (minor): Quote only the sourced overdraft figures ($34, max 3/day, $102, $5 or less none, <=$50 EOD none, 11 pm ET rule); state that the checked sources do not list NSF or late-fee amounts; present the 2010 refund as precedent only; no guaranteed outcome language; no blanket-waiver claim either way.
- F-LINK-PLACEMENT (minor): WRITE must locate or create a legitimate prose location (existing spoke body/FAQ field in src/data/spokes-mortgage.ts) and record it; if none exists, substitute another relevant inbound source from the inspected set or meet the required 2 inbound count with /guides/tax-deductions-for-homeowners plus another inspected page. Link-only edits must not bump updatedDate/dateModified.
- F-CASES (minor): In each evidence.json: caseSelection references evidence/<slug>/cases.json, caseDecisions rejects every returned candidate with a specific reason (unrelated owned property, wrong owner, no outcome relevance), caseUses is [], and no client or first-party testing claim appears. Keep the exact approved reader_question string (with its PAA/ac tag) as packet.readerQuestion.
- REQ-3 (requestCoverage): Plan delivers the 6.5%/$949M figure, notice window, columns and Dec 28 date accurately, but the acceptance text and planned takeaway frame the notice figure as a ceiling and final levies as never higher; sources show the parcel bill can exceed the notice and the levy cap has statutory exceptions (F-A3-CEILING, F-A3-LEVY-EXCEPTIONS). REQ-3 passes only when those conditions are in the first answer, FAQ and takeaway.
- F-A3-CEILING
- F-A3-LEVY-EXCEPTIONS
- F-A3-HEARING-TIME
- F-A2-DATES
- F-A2-SCHEDULE
- F-A2-EXEMPTIONS
- F-A2-BASIS
- F-A2-ANCHOR
- F-A1-REGE
- F-A1-NBC630
- F-A1-LATEFEE
- F-TITLES-HEADINGS
- F-LINK-PLACEMENT
- F-CASES

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Include honest visible attribution matching `basis` (internal testing, internal modeling with visible assumptions + counterexample, anonymized approved client experience when selected, durable reader-survey facts when matched, and `(Tested YYYY)` ONLY when `runs:[{testedAt}]` is executed & eligible):
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-write",
  "route": "/guides/minnesota-truth-in-taxation-notice",
  "readerQuestion": "Why did my Minnesota proposed 2027 property tax go up, how do I read the Truth-in-Taxation notice and what can I do before final levies are set? [PAA 0/0 unread; ac 10/47 question completions, what/how/is-it-legit family]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/approval-manifest.json",
      "sha256": "3dd52934ab7a91fb51a94adc61570099e1da83b2a952dccea015ada9cd0f8725"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/chart-review.json",
      "sha256": "7fdd250069bbed26a7eaab3f87b587ea3a63653440ddc2b87e3505d7635f4354"
    },
    "actionId": "A3"
  },
  "presentation": {
    "medium": "text + finite table",
    "placement": "Section 1 opening answer, then a table of what each notice column shows",
    "reason": "Notice columns and dates are finite and parcel-specific numbers come from the reader's own notice",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "The reader's own notice carries the parcel numbers; no site-side input changes the answer"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static scannable layout answers faster without decorative motion"
    }
  },
  "basis": "reported",
  "decisionGap": "Minnesotans receive a Truth-in-Taxation notice of proposed 2027 property taxes without knowing what it is, why it rose, what its columns mean, what the notice leaves out, which body to attend, or what the hearing can and cannot change.",
  "finding": "The notice is a proposal, not a bill. Each taxing authority's final levy is generally capped at its proposed levy (Minnesota Department of Revenue says final levies can be set lower, but not higher, with limited statutory exceptions) but your own bill can still differ, because the notice excludes items such as special assessments and later voter-approved levies and because your valuation and classification are separate. Compare current and proposed taxes by taxing authority and attend the hearing of the body driving the change.",
  "conditions": "Statewide preliminary levies could rise by a maximum of $949 million (6.5%) over 2026 per the Department of Revenue; your parcel can be higher or lower. The levy cap has statutory exceptions (subdivision 6) and towns and the state general tax follow different rules. The figure on your notice is not a ceiling on your final bill.",
  "whatWouldChange": "Final levy information (Department of Revenue says it releases it in February); your taxing authorities' final levies set by Dec 28 2026; a voter-approved referendum or other statutory exception; a change in your parcel's valuation or classification.",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-17-xtrends-run/evidence/minnesota-truth-in-taxation-notice/cases.json",
    "sha256": "fcbc3fbb9d0a735f13bc7df1e1ef9213c6ef36e86d4c7097f6d4ea38616f558b"
  },
  "caseDecisions": [
    {
      "recordId": "owned-property-drones-defense",
      "decision": "rejected",
      "reason": "Rejected: owned drone/defense-stock research property, no relevance to bank fees, retirement-plan rules or property-tax notices."
    },
    {
      "recordId": "owned-property-diy-repair-guide",
      "decision": "rejected",
      "reason": "Rejected: owned DIY repair property, unrelated."
    },
    {
      "recordId": "owned-property-the-indoor-report",
      "decision": "rejected",
      "reason": "Rejected: owned indoor-air property, unrelated."
    },
    {
      "recordId": "owned-property-new-parent-picks",
      "decision": "rejected",
      "reason": "Rejected: owned parenting-products property, unrelated."
    },
    {
      "recordId": "client-bowlero-corporation",
      "decision": "rejected",
      "reason": "Rejected: unrelated client (bowling entertainment); no documented observation on this topic."
    },
    {
      "recordId": "client-professional-bowlers-association-pba",
      "decision": "rejected",
      "reason": "Rejected: unrelated client; no documented observation on this topic."
    },
    {
      "recordId": "client-horizen-labs",
      "decision": "rejected",
      "reason": "Rejected: unrelated crypto client; no documented observation on this topic."
    },
    {
      "recordId": "client-multiple-hoa-and-condo-boards-across-the-usa",
      "decision": "rejected",
      "reason": "Rejected: HOA board clients; no documented observation on this topic."
    }
  ],
  "sourceArtifacts": [
    {
      "path": "reports/x-trends/2026-11-17.md",
      "sha256": "d9f882c05879337fbf220215fee5bf2473cf05a02fb2d54441ea21aa0b4423af"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/coverage-lookup.txt",
      "sha256": "9457e49f6fcb2ae9e41f63f028eabc7d2ca573994189964e6881c4ab390b3ee8"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/keyword-volumes.json",
      "sha256": "1d75689e8fd36fa3cab29db121bca43ea61f97bf10218ec029a65dbeb8db012d"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/serp.json",
      "sha256": "6d66f798e507b663ecb79f2a8f923b236d7dfdf54c0483e60a9790570fbf8a61"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/sources/mn-revenue-prelim-levies.txt",
      "sha256": "e17a5a905e8e59fec31387a0b20ff76ec14256531604796898fe9bd614bb6208"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/sources/mn-statute-275-065.txt",
      "sha256": "3efff715177a3b7a7a7e21525d7d98790f9142788c1d6b6bfaa9e397418f2093"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/sources/mn-revenue-truth-in-taxation.txt",
      "sha256": "bce89d01190eab9631c144134318aedb8958f299de05fb1d56d0bc68439f6850"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/sources/cbs-mn-levies.txt",
      "sha256": "a16600461669df917a114b41d1e6f6621957b369d2def6124c11c9e2420ccd3b"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/autocomplete.truth-in-taxation-notice-minnesota.csv",
      "sha256": "3b6f3eafcd9fcc1601c05f1d747d927639a651b823b6dfc19560222c27438b6f"
    }
  ],
  "whyNoQuantitativeAnalysis": "The finding is statutory and published government data. Parcel numbers come from the reader's own notice; no defensible model of any reader's final bill exists from public inputs.",
  "reasoning": "Minnesota Department of Revenue press release (2026-11-12) gives the $949 million / 6.5% figure, the by-type percentages, last year's final-versus-preliminary gap, the meeting window, the Dec 28 2026 date and the \"lower, but not higher\" statement. Minn. Stat. 275.065 gives the notice mailing window, notice contents, the exclusions list (subd. 3(e)), the meeting rules (subd. 3(c)) and the levy-adoption cap with its exceptions (subd. 6(a)). CBS Minnesota adds that the levy does not necessarily equal a homeowner's final bill and quotes the League of Minnesota Cities and the Minnesota Association of Counties on drivers.",
  "caseUses": [],
  "sourceUrls": [
    {
      "url": "https://www.revenue.state.mn.us/press-release/2026-11-12/preliminary-property-tax-levies-2027",
      "checked": "2026-11-17",
      "label": "Minnesota Department of Revenue press release, Nov 12 2026"
    },
    {
      "url": "https://www.revisor.mn.gov/statutes/cite/275.065",
      "checked": "2026-11-17",
      "label": "Minnesota Statutes 275.065"
    },
    {
      "url": "https://www.revenue.state.mn.us/truth-taxation",
      "checked": "2026-11-17",
      "label": "Department of Revenue Truth-in-Taxation page"
    },
    {
      "url": "https://www.cbsnews.com/minnesota/news/minnesota-pay-property-taxes-bills-levies/",
      "checked": "2026-11-17",
      "label": "CBS Minnesota"
    }
  ],
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [],
    "scopeAndLimits": "External primary-source reporting and law text only. We ran no product test, no executed model and have no client record behind any statement on this page. Reader-facing wording names the actual source of each fact.",
    "publicMethod": "Each fact is attributed inline to its linked source.",
    "placement": "Opening section, column table and takeaway attribute figures to the Department of Revenue, the statute and CBS Minnesota."
  },
  "closedFacts": [
    "Minnesota Department of Revenue press release (2026-11-12, \"Preliminary Property Tax Levies for 2027\"): the department annually releases preliminary maximum property tax levies reported by local governments and levies passed by local school referenda on November 3, 2026. Preliminary figures for 2027 show property taxes statewide could increase by a maximum of $949 million over 2026, a 6.5% increase. Last year the final statewide levy increase was $74 million lower than the preliminary levies, resulting in a 6.4% increase.",
    "Department of Revenue by taxing type (2027 preliminary vs 2026 final): cities about $4.309 billion vs $3.985 billion, an 8.1% increase; counties about $4.887 billion vs $4.520 billion, 8.1%; townships about $367 million vs $350 million, 4.9%; schools about $4.599 billion vs $4.378 billion, 5.0%; special taxing districts about $564 million vs $544 million, 3.7%.",
    "Department of Revenue: Truth-in-Taxation notices do not include the results of levy referenda for operations or capital projects by 63 of Minnesota's school districts; the results are included in the summarized data. Statewide 26 of the 63 referenda at least partially passed.",
    "Department of Revenue: the preliminary amounts are used by counties to compute parcel-specific property tax estimates for 2027, mailed to property owners in November as Truth-in-Taxation notices, which also list meeting times and locations. The meetings take place between late November and late December and are required for cities with populations over 500, counties, school districts, regional library authorities and metropolitan taxing districts. After input from citizens, local governments must set final 2027 levies by December 28, 2026. \"The final levies can be set lower, but not higher, than preliminary levies.\" Attribute this to the Department of Revenue press release (2026-11-12) and add \"with limited statutory exceptions\". The department will release final property tax levy information in February. Dec. 28 2026 is the Department of Revenue's stated date.",
    "Minn. Stat. 275.065 subd. 3(a): the county treasurer delivers the notice by first class mail after November 10 and on or before November 24 each year to each taxpayer at the address on the county's current-year assessment roll; electronic delivery on written request. Subd. 3(c): the notice states the time and place of a meeting for each city over 500 population, county, school district, regional library authority and metropolitan taxing district at which the budget and levy will be discussed and public input allowed before the final budget and levy; the public must be allowed to speak, and the meeting must occur after November 24 and must not be held before 6:00 p.m. Tell readers to use the date and time printed on their own notice. The notice also gives a website address and phone number for each taxing authority and an address for mailed comments. Do NOT state specific start times for any body.",
    "Minn. Stat. 275.065 subd. 3(d): for each parcel the notice states the market value used for next year's taxes and for current-year taxes as in the county assessor's records on November 1, whether residential property is classified homestead or nonhomestead, and that the values are final values. It shows, separately, county, city or town, state general tax, agricultural homestead credit, school building bond agricultural credit, voter-approved school levy, other local school levy and the sum of special taxing districts, and a total: the actual tax for taxes payable in the current year and the proposed tax amount, plus the increase or decrease between the total current taxes and total proposed taxes as a percentage. Where a school referendum is pending the notice notes the tax amount may be higher than shown if voters approve. Where tax increment or the fiscal disparities areawide tax applies, those amounts are stated separately.",
    "Minn. Stat. 275.065 subd. 3(e): the notice must clearly state that the proposed or final taxes do NOT include: (1) special assessments; (2) levies approved by the voters after the date the proposed taxes are certified, including bond referenda and school district levy referenda; (3) a levy limit increase approved by the voters by the first Tuesday after the first Monday in November of the levy year; (4) amounts to pay cleanup or other costs of a natural disaster occurring after the proposed taxes are certified; (5) amounts to pay tort judgments against the taxing authority that become final after the proposed taxes are certified; and (6) the contamination tax on properties that received market value reductions for contamination. Put this in the first answer, FAQ and takeaway: your bill could be more or less than the notice shows.",
    "Minn. Stat. 275.065 subd. 3(c)-(d): for a town or the state general tax the final tax amount will be its proposed tax (a town can change its levy at a special town meeting under section 365.52). Subd. 3(g): if the notice lists the property as nonhomestead and satisfactory documentation is provided to the county assessor by the applicable deadline and the property qualifies for homestead in that assessment year, the assessor shall reclassify it to homestead for taxes payable the following year. Subd. 3(h): a landlord of class 4 residential rental property must mail, deliver or post a copy of the notice for tenants by November 27 or within three days of receipt, whichever is later.",
    "Minn. Stat. 275.065 subd. 6(a): the levy certified by a city of any population, county, metropolitan special taxing district, regional library district or school district must not exceed the proposed levy, except by up to the sum of: (1) a school district levy whose voters approved a referendum after the proposed levy was certified; (2) a city or county levy approved by voters after the proposed levy was certified; (3) a levy for principal and interest on voter-approved bonds; (4) natural-disaster costs approved by the commissioner of revenue; (5) tort judgments that become final after the proposed levy was certified, if approved by the commissioner; (6) an increase in levy limits certified after the proposed levy was certified; (7) the amount required under section 126C.55; (8) emergency debt certificates under section 475.755; and (9) unallotment under section 16A.152. Subd. 6(b): this cap does not apply to towns and special taxing districts other than regional library districts and metropolitan special taxing districts. Name the main exceptions (voter-approved referenda and bonds, natural disaster costs, tort judgments, changed levy limits) and the town/state general tax rule.",
    "Department of Revenue Truth-in-Taxation page: authorities required to hold a Truth-in-Taxation meeting must do so between November 25 and December 28, and must certify their compliance to the Department of Revenue by December 28, 2026.",
    "CBS Minnesota (reporter Caroline Cummings): property taxes could rise by nearly $1 billion statewide, but the proposals are not final and how much homeowners will pay depends on where they live and how much their home is worth. Hennepin County is pitching an 8.1% levy increase and Dakota County 18.5%. John McCarthy (chief financial officer, League of Minnesota Cities) said cities are down to \"bread-and-butter basic services\" and property taxes are \"really the only tool that cities have left\". Matt Hilgart (Minnesota Association of Counties) cited changes to Medicaid and food assistance under the federal law taking effect, which shift costs to counties. Both said proposed levies are not yet final and could be a less steep increase by the final proposals, and the levy \"doesn't necessarily mean that is what will be reflected in the homeowners' final bill; it could be more or it could be less than that rate.\" The Minnesota Legislature provided one-time property tax relief of $125 million earlier this year.",
    "NOT VERIFIED, DO NOT STATE: start times for any specific body's hearing; any valuation-appeal path or deadline (do not describe how to appeal a valuation; say only that valuation and classification are separate from this notice); that the figure on a notice is a ceiling on a bill; any predicted outcome for any reader."
  ],
  "takeawayPlan": "For Minnesota homeowners with a proposed-tax notice: the notice is a proposal; each authority's final levy is generally capped at its proposed levy (Department of Revenue) but your bill can still differ because of items the notice excludes (special assessments, later voter-approved levies and others in subd. 3(e)) and your own valuation and classification. Compare current versus proposed by authority and attend the hearing of the body driving the change. Never call the figure a ceiling. Changes with final levies (Dec 28 2026; Department of Revenue releases final data in February). Attributed to the Department of Revenue, Minn. Stat. 275.065 and CBS Minnesota."
}
```

## ROW RECORDS FOR THE AUDITOR (do not print on the page)
- medium: text -> text
- register: operator
- page type: explainer (floor 1200 words)
- teeup-exempt: source-reported page, no site experience fits; sentence 1 is the answer, no tee-up, no company-claim "we".
- basis: reported (external primary sources only). No "we tested", no internal testing, internal analysis or modeling wording. TESTED format is OFF.
- Title ideas (50 to 60 chars, one clause): "Minnesota Truth-in-Taxation Notice for 2027 Property Tax". Primary keyword: minnesota truth in taxation notice. Supporting: minnesota property tax increase 2027, proposed property tax notice.

## CLOSED FACT LIST
Every number, date, quote and claim the page may state is below or in the evidence packet above. Anything not on this list, you do not know. Never invent a price, limit, benchmark, date, quote or URL; if a figure is not on the list, say it is not published in the sources checked.
- Minnesota Department of Revenue press release (2026-11-12, "Preliminary Property Tax Levies for 2027"): the department annually releases preliminary maximum property tax levies reported by local governments and levies passed by local school referenda on November 3, 2026. Preliminary figures for 2027 show property taxes statewide could increase by a maximum of $949 million over 2026, a 6.5% increase. Last year the final statewide levy increase was $74 million lower than the preliminary levies, resulting in a 6.4% increase.
- Department of Revenue by taxing type (2027 preliminary vs 2026 final): cities about $4.309 billion vs $3.985 billion, an 8.1% increase; counties about $4.887 billion vs $4.520 billion, 8.1%; townships about $367 million vs $350 million, 4.9%; schools about $4.599 billion vs $4.378 billion, 5.0%; special taxing districts about $564 million vs $544 million, 3.7%.
- Department of Revenue: Truth-in-Taxation notices do not include the results of levy referenda for operations or capital projects by 63 of Minnesota's school districts; the results are included in the summarized data. Statewide 26 of the 63 referenda at least partially passed.
- Department of Revenue: the preliminary amounts are used by counties to compute parcel-specific property tax estimates for 2027, mailed to property owners in November as Truth-in-Taxation notices, which also list meeting times and locations. The meetings take place between late November and late December and are required for cities with populations over 500, counties, school districts, regional library authorities and metropolitan taxing districts. After input from citizens, local governments must set final 2027 levies by December 28, 2026. "The final levies can be set lower, but not higher, than preliminary levies." Attribute this to the Department of Revenue press release (2026-11-12) and add "with limited statutory exceptions". The department will release final property tax levy information in February. Dec. 28 2026 is the Department of Revenue's stated date.
- Minn. Stat. 275.065 subd. 3(a): the county treasurer delivers the notice by first class mail after November 10 and on or before November 24 each year to each taxpayer at the address on the county's current-year assessment roll; electronic delivery on written request. Subd. 3(c): the notice states the time and place of a meeting for each city over 500 population, county, school district, regional library authority and metropolitan taxing district at which the budget and levy will be discussed and public input allowed before the final budget and levy; the public must be allowed to speak, and the meeting must occur after November 24 and must not be held before 6:00 p.m. Tell readers to use the date and time printed on their own notice. The notice also gives a website address and phone number for each taxing authority and an address for mailed comments. Do NOT state specific start times for any body.
- Minn. Stat. 275.065 subd. 3(d): for each parcel the notice states the market value used for next year's taxes and for current-year taxes as in the county assessor's records on November 1, whether residential property is classified homestead or nonhomestead, and that the values are final values. It shows, separately, county, city or town, state general tax, agricultural homestead credit, school building bond agricultural credit, voter-approved school levy, other local school levy and the sum of special taxing districts, and a total: the actual tax for taxes payable in the current year and the proposed tax amount, plus the increase or decrease between the total current taxes and total proposed taxes as a percentage. Where a school referendum is pending the notice notes the tax amount may be higher than shown if voters approve. Where tax increment or the fiscal disparities areawide tax applies, those amounts are stated separately.
- Minn. Stat. 275.065 subd. 3(e): the notice must clearly state that the proposed or final taxes do NOT include: (1) special assessments; (2) levies approved by the voters after the date the proposed taxes are certified, including bond referenda and school district levy referenda; (3) a levy limit increase approved by the voters by the first Tuesday after the first Monday in November of the levy year; (4) amounts to pay cleanup or other costs of a natural disaster occurring after the proposed taxes are certified; (5) amounts to pay tort judgments against the taxing authority that become final after the proposed taxes are certified; and (6) the contamination tax on properties that received market value reductions for contamination. Put this in the first answer, FAQ and takeaway: your bill could be more or less than the notice shows.
- Minn. Stat. 275.065 subd. 3(c)-(d): for a town or the state general tax the final tax amount will be its proposed tax (a town can change its levy at a special town meeting under section 365.52). Subd. 3(g): if the notice lists the property as nonhomestead and satisfactory documentation is provided to the county assessor by the applicable deadline and the property qualifies for homestead in that assessment year, the assessor shall reclassify it to homestead for taxes payable the following year. Subd. 3(h): a landlord of class 4 residential rental property must mail, deliver or post a copy of the notice for tenants by November 27 or within three days of receipt, whichever is later.
- Minn. Stat. 275.065 subd. 6(a): the levy certified by a city of any population, county, metropolitan special taxing district, regional library district or school district must not exceed the proposed levy, except by up to the sum of: (1) a school district levy whose voters approved a referendum after the proposed levy was certified; (2) a city or county levy approved by voters after the proposed levy was certified; (3) a levy for principal and interest on voter-approved bonds; (4) natural-disaster costs approved by the commissioner of revenue; (5) tort judgments that become final after the proposed levy was certified, if approved by the commissioner; (6) an increase in levy limits certified after the proposed levy was certified; (7) the amount required under section 126C.55; (8) emergency debt certificates under section 475.755; and (9) unallotment under section 16A.152. Subd. 6(b): this cap does not apply to towns and special taxing districts other than regional library districts and metropolitan special taxing districts. Name the main exceptions (voter-approved referenda and bonds, natural disaster costs, tort judgments, changed levy limits) and the town/state general tax rule.
- Department of Revenue Truth-in-Taxation page: authorities required to hold a Truth-in-Taxation meeting must do so between November 25 and December 28, and must certify their compliance to the Department of Revenue by December 28, 2026.
- CBS Minnesota (reporter Caroline Cummings): property taxes could rise by nearly $1 billion statewide, but the proposals are not final and how much homeowners will pay depends on where they live and how much their home is worth. Hennepin County is pitching an 8.1% levy increase and Dakota County 18.5%. John McCarthy (chief financial officer, League of Minnesota Cities) said cities are down to "bread-and-butter basic services" and property taxes are "really the only tool that cities have left". Matt Hilgart (Minnesota Association of Counties) cited changes to Medicaid and food assistance under the federal law taking effect, which shift costs to counties. Both said proposed levies are not yet final and could be a less steep increase by the final proposals, and the levy "doesn't necessarily mean that is what will be reflected in the homeowners' final bill; it could be more or it could be less than that rate." The Minnesota Legislature provided one-time property tax relief of $125 million earlier this year.
- NOT VERIFIED, DO NOT STATE: start times for any specific body's hearing; any valuation-appeal path or deadline (do not describe how to appeal a valuation; say only that valuation and classification are separate from this notice); that the figure on a notice is a ceiling on a bill; any predicted outcome for any reader.

## CLOSED URL LIST (the only external links allowed; link the first mention of each organization)
- https://www.revenue.state.mn.us/press-release/2026-11-12/preliminary-property-tax-levies-2027
- https://www.revisor.mn.gov/statutes/cite/275.065
- https://www.revenue.state.mn.us/truth-taxation
- https://www.cbsnews.com/minnesota/news/minnesota-pay-property-taxes-bills-levies/
- https://www.revenue.state.mn.us/

## INTERNAL ROUTES YOU MAY LINK (markdown, trailing slash; use descriptive anchors)
- /guides/tax-deductions-for-homeowners/
- /mortgage/home-affordability-calculator/
Use 1 to 3 of them where they genuinely help; never "click here".

## FAQ SPEC
FAQ topics (sentence-case): Is a Truth-in-Taxation notice a bill? Can my property tax go up after the notice? When are final levies set? Which governments must hold a hearing? What does the notice leave out? What if my notice lists my home as nonhomestead? Do not answer valuation appeals.

## PAGE-SPECIFIC DIRECTIVES AND CORRECTIONS (these supersede any conflicting text above, including the brief's takeaway and outline wording)
- CORRECTION (supersedes the approved takeaway, answer sentence and any outline text that calls the figure a ceiling): the notice is a proposal; each taxing authority's final levy is generally capped at its proposed levy (Minnesota Department of Revenue says final levies can be set lower, but not higher, with limited statutory exceptions) but your bill can still differ because of items the notice excludes and your own valuation and classification. Compare current versus proposed by taxing authority and attend the hearing of the body driving the change. NEVER write "ceiling" for the parcel figure.
- Put the exclusions list (special assessments; levies approved by voters after the proposed taxes are certified, including bond and school referenda; a voter-approved levy limit increase; natural-disaster cleanup costs; final tort judgments; the contamination tax) and "your bill could be more or less" in the first answer (briefly), in the FAQ and in the takeaway.
- Attribute "can be set lower, but not higher" to the Department of Revenue press release (2026-11-12), add "with limited statutory exceptions", and name the main exceptions from Minn. Stat. 275.065 subd. 6(a) (voter-approved referenda and bonds after certification, natural disaster costs approved by the commissioner, final tort judgments, changed levy limits). State the town and state general tax rule: the final amount is the proposed amount, except a town can change its levy at a special town meeting. Keep Dec. 28 2026 as the Department of Revenue's stated date.
- Corrected heading: rename "What the Hearing Cannot Change" to "What the Hearing Can and Cannot Change". It explains that the hearing is input to local officials before final levies; it does not set your valuation or classification, and the notice excludes the listed items. Do not describe a valuation-appeal path or deadline.
- Hearing timing: you may say the statute requires meetings after November 24 and not before 6:00 p.m. (Minn. Stat. 275.065 subd. 3(c)) and tell readers to use the date, time and place printed on their own notice. Never state a start time or date for a particular body.
- Notice-column table (GFM pipe table) follows the statute subd. 3(d): market value and homestead status; current-year tax and proposed tax by county, city or town, state general tax, school levies, special taxing districts and total; percent change; meeting time and place per authority; website, phone and mailing address for comments. Add a short dates list: mailed after Nov. 10 and on or before Nov. 24; meetings after Nov. 24 (Department of Revenue: Nov. 25 to Dec. 28); final levies set by Dec. 28 2026; Department of Revenue final data in February.
- Our Takeaway links once to [homeowner tax deductions](/guides/tax-deductions-for-homeowners/) and once to the [home affordability calculator](/mortgage/home-affordability-calculator/).

## REVIEWER GUARDRAILS SUMMARY (all must hold)
- Exclude: TD 10061 and any Federal Register number, the 6:30 pm "service restored" claim as an independent fact, any fee-waiver status assertion, any X post count, any good-faith interim compliance claim, any Minnesota hearing start time or valuation-appeal path.
- Financial YMYL: factual, neutral, primary sources, no guaranteed outcomes, no investment or legal advice.
