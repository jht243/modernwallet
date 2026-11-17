# Approved Page Assignment: `/guides/401k-auto-enrollment-final-rules` (`401k-auto-enrollment-final-rules`)
- **Action ID:** `A2` (create new content)
- **Title:** 401(k) Auto-Enrollment Final Rules: 3% Default, 10% Target
- **Page Type / Format / Medium:** guide (explainer, 1,200-word floor) | article - the reader wants the rule's mechanics and their options; a finite schedule table fits | text
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** What do the final 401(k) auto-enrollment rules mean for my paycheck, and can I opt out? [PAA 0/0 unread; ac 12/66 question completions, required/mandatory/can-change/opt-out family]
- **Working Answer (Col 11):** Covered new 401(k) and 403(b) plans must enroll eligible employees at 3% or more, rising at least 1 point a year to at least 10% (max 15%); you can opt out or choose another rate; pre-2022-enactment plans, small and new businesses, governmental, church and SIMPLE plans are exempt. Shape: the rule with its boundaries.
- **Answer Placement (Col 12):** Section 1: 'What the Final Auto-Enrollment Rules Require'

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent plus news-driven (Treasury/IRS final regulations, Nov 17 2026, press release SB-0690). lookup: no match; existing mentions are one-sentence FAQ lines in roundups/comparisons; /guides/retirement-contribution-limits-2027 serves a limits reader (checked, enrich-vs-new decided new). Autocomplete bands (estimate, NOT measured): 401k automatic enrollment 500-5000/mo, secure 2.0 automatic enrollment 500-5000/mo, 401k auto enrollment rules 150-1500/mo.
- **Keyword Evidence:** "Provider ladder pinned semrush,dataforseo; SEMRUSH has no key and DataForSEO unavailable on 2026-11-17, so every figure is 'source: estimate (Google Autocomplete), NOT measured', US, checked 2026-11-17 (research/keyword-volumes.json). Primary: '401k automatic enrollment' (500-5000 band, 10 completions) and 'secure 2.0 automatic enrollment' (500-5000, 10). Supporting: '401k auto enrollment rules' (150-1500, 6). 'can i opt out of 401k auto enrollment' 0-25 (no completions; covered as an FAQ)."
- **Why New Page / Angle:** Closest existing: /guides/retirement-contribution-limits-2027/ (2026-11-16): dollar limits only, headings inspected, no auto-enrollment; roundups.ts and comparisons.ts carry one-sentence mentions (auto-enrollment required for plans established after Dec 29, 2022 and starting 2025). coverage_lookup: no home. Enrich-vs-new: different reader goal, so new page with inbound links. Independent duplicate review: required of CHART-REVIEW.
- **Intent-Based Our Takeaway (corrected, supersedes the brief wording):** "For workers at a covered new 401(k) or 403(b) plan: expect enrollment at 3% or more (first-year range 3% to 10%), raised 1 point a year to at least 10% (max 15%), and you can opt out or choose another rate; check your plan notice for whether the plan is exempt or voluntarily auto-enrolls with another default. Both dates (statute after Dec 31 2024, Treasury final regulations after Dec 31 2027) are stated with attribution and the sources do not say which governs a plan. Attributed to Treasury and 26 U.S.C. 414A; schedule is the rule's minimum path shown for illustration."

## Approved Section Outline
1. **What the Final Auto-Enrollment Rules Require** — Section 1 answer: 3% default, +1 point per year to at least 10% (max 15%), opt out or choose another rate, final regulations generally apply to plan years beginning after Dec 31, 2027 (Treasury, Nov 17 2026)
2. **Which Plans Are Exempt** — Statutory exemptions per IRC 414A(c): plans established before Dec 29 2022, employers under 3 years old, small employers (10 or fewer employees), governmental, church, SIMPLE 401(k); Treasury says final regs clarify these
3. **How the Default Rate Rises Year by Year** — Table of a 3% start with +1 per year to 10% (seven steps), labeled our illustrative arithmetic from the rule, plus one worked paycheck example at a stated salary
4. **How to Opt Out or Change Your Rate** — Participants may elect no contributions or another rate (414A); notices: Treasury says final regs let certain notices be combined; what to check in the plan's notice; sourced limits only
5. **What the Final Regulations Changed for Employers** — Timing and amount flexibility, notice simplification, mergers: one-sentence each from Treasury, no legal advice
6. **Our Takeaway** — Planned takeaway below
7. **Frequently Asked Questions** — Is auto-enrollment mandatory, can I opt out, does my current plan have to change, what rate will I start at, what about my match

## Approved Internal Outbound Links
- {"source": "/guides/401k-auto-enrollment-final-rules/", "target": "/guides/retirement-contribution-limits-2027/", "section": "Our Takeaway", "anchor": "2027 401(k) contribution limits", "purpose": "Readers needing the dollar cap move to the limits guide", "inspection": {"path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/limits-2027.txt", "sha256": "a6352c2d9ef1bbf9ebfcd3a17c8fb51bcc540c97c2c8fda9cb5aa94a51e5d144"}}
- {"source": "/guides/401k-auto-enrollment-final-rules/", "target": "/retirement/401k-calculator/", "section": "Our Takeaway", "anchor": "401(k) calculator", "purpose": "Readers test a 3% to 10% path with their own pay", "inspection": {"path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/401k-calc.txt", "sha256": "52ec9c36abecf86fa77e32e8a63472d00d0b0a39b695c26f4bcbac57245855b6"}}

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
  "route": "/guides/401k-auto-enrollment-final-rules",
  "readerQuestion": "What do the final 401(k) auto-enrollment rules mean for my paycheck, and can I opt out? [PAA 0/0 unread; ac 12/66 question completions, required/mandatory/can-change/opt-out family]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/approval-manifest.json",
      "sha256": "3dd52934ab7a91fb51a94adc61570099e1da83b2a952dccea015ada9cd0f8725"
    },
    "review": {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/chart-review.json",
      "sha256": "7fdd250069bbed26a7eaab3f87b587ea3a63653440ddc2b87e3505d7635f4354"
    },
    "actionId": "A2"
  },
  "presentation": {
    "medium": "text + finite table",
    "placement": "Section 1 opening answer, then a year-by-year default-rate table",
    "reason": "The default schedule is a finite 3% to 10% ladder, so a table shows it without interaction",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "Rate steps are fixed by rule; the only reader variable is salary and one worked example covers it"
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static scannable layout answers faster without decorative motion"
    }
  },
  "basis": "reported",
  "decisionGap": "Workers know automatic enrollment exists but not the default numbers, the two dates (statute for plan years after Dec 31 2024, Treasury final regulations for plan years after Dec 31 2027), who is exempt, or that they can opt out or choose another rate.",
  "finding": "Covered 401(k) and 403(b) plans must generally enroll eligible employees at 3% to 10% of pay in the first year and raise the rate by 1 percentage point each year to at least 10% and at most 15%, unless the participant elects out or another rate. Treasury says employees may opt out or choose a different contribution rate. Exemptions are SIMPLE 401(k) plans, plans established before Dec 29 2022, governmental and church plans, employers in existence under 3 years and small employers (those that have not normally employed more than 10 employees). The sources checked do not say which date governs a given plan.",
  "conditions": "A worker's plan may be exempt, may already auto-enroll voluntarily with a different compliant default, or may start higher than 3% (up to 10%). The page does not say a current plan is exempt or has until 2028. Schedule arithmetic is pre-tax and salary-only, shows the minimum path, and is not a prediction of balances or an employer match.",
  "whatWouldChange": "A plan notice showing a different default or an exemption; Treasury or IRS guidance on how the two dates apply to existing plans; a plan that starts above 3% or steps up faster (up to 15%).",
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-17-xtrends-run/evidence/401k-auto-enrollment-final-rules/cases.json",
    "sha256": "fe6881c09534b54d3d8689008326ad2befdafed03032f4c0164bbad153afae89"
  },
  "caseDecisions": [
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
      "recordId": "owned-property-the-hoa-guide",
      "decision": "rejected",
      "reason": "Rejected: owned HOA guide property, no outcome relevance to the reader question."
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
      "recordId": "client-multiple-law-firms",
      "decision": "rejected",
      "reason": "Rejected: law-firm clients; no documented observation on this topic, and legal services are an excluded testing scope."
    },
    {
      "recordId": "owned-property-the-psychedelic-journal",
      "decision": "rejected",
      "reason": "Rejected: psychedelic topic is an excluded scope and unrelated."
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
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/sources/treasury-sb0690.txt",
      "sha256": "1b442cc258b0732698945e8983edac69ed11b508913fc3ba97452dd159474ad9"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/sources/usc-26-414A.txt",
      "sha256": "3f7930edb05aa931d07a2fc73ee2cca5bffb3ec2e9eb653c6b7f3819ff3c4f41"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/sources/fr-td10061-unverified.txt",
      "sha256": "21b78f7cfb0f301d4b8ab21633140a9f3b74823421217c966a15a555dd805943"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/autocomplete.401k-auto-enrollment.csv",
      "sha256": "a13394bb139ab2a4eff138edaf30bf845392ace75f7320ffa502e53759a0b500"
    },
    {
      "path": "reports/mindmap-pass/2026-11-17-xtrends-run/research/link-inspections/limits-2027.txt",
      "sha256": "a6352c2d9ef1bbf9ebfcd3a17c8fb51bcc540c97c2c8fda9cb5aa94a51e5d144"
    }
  ],
  "whyNoQuantitativeAnalysis": "The finding is a statutory and regulatory rule. The one finite schedule table and the $60,000 example are plain arithmetic restating the rule; the page labels them as the rule's schedule shown for illustration and does not call them internal analysis or modeling.",
  "reasoning": "Treasury press release SB-0690 (Nov 17 2026) states the 3% default, +1 point per year to at least 10% (15% maximum), opt-out right, applicability to plan years beginning after Dec 31 2027, and what the final regulations clarify. 26 U.S.C. 414A(b)(3) gives the statutory 3% to 10% first-year range and the 1-point annual steps to at least 10% and at most 15%. 414A(c) gives the exceptions. Pub. L. 117-328 section 101(c) makes the statute apply to plan years beginning after Dec 31 2024. The two dates are both reported with attribution; the sources do not reconcile them for a given plan.",
  "caseUses": [],
  "sourceUrls": [
    {
      "url": "https://home.treasury.gov/news/press-releases/sb0690",
      "checked": "2026-11-17",
      "label": "U.S. Department of the Treasury press release, Nov 17 2026"
    },
    {
      "url": "https://www.law.cornell.edu/uscode/text/26/414A",
      "checked": "2026-11-17",
      "label": "26 U.S. Code 414A (Legal Information Institute)"
    }
  ],
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [],
    "scopeAndLimits": "External primary-source reporting and law text only. We ran no product test, no executed model and have no client record behind any statement on this page. Reader-facing wording names the actual source of each fact.",
    "publicMethod": "Each rule is attributed inline to Treasury or the statute text; the arithmetic is shown in the table and example.",
    "placement": "Opening section and takeaway attribute the rule to Treasury and 26 U.S.C. 414A; the schedule table is described as the rule's minimum path shown for illustration."
  },
  "closedFacts": [
    "Treasury press release SB-0690 (U.S. Department of the Treasury and the Internal Revenue Service, Nov. 17 2026): Treasury and the IRS issued final regulations implementing a provision of the SECURE 2.0 Act on automatic enrollment for certain 401(k) and 403(b) plans. Treasury estimates the provision will increase retirement savings by an average of $4.2 billion annually over the 2023-2032 period.",
    "Treasury: \"Covered retirement plans generally must automatically enroll eligible employees at a contribution rate of three percent. After an initial participation period, the default contribution rate must generally increase by at least one percentage point each year until it reaches at least ten percent, subject to a fifteen percent maximum. Employees may opt out or choose a different contribution rate.\"",
    "Treasury: \"The final regulations generally apply to retirement plan years beginning after December 31, 2027, giving employers time to make necessary administrative changes.\"",
    "Treasury says the final regulations: clarify statutory exceptions for qualifying small and new businesses, governmental plans, church plans and SIMPLE 401(k) plans; give employers flexibility in the timing and amount of automatic contribution increases within statutory limits; simplify plan communications by allowing certain required notices to be combined and reducing annual notice requirements for qualifying employees who are not participating, provided they receive annual reminders and any plan documents they are entitled to request; and explain how automatic enrollment requirements apply following plan mergers. Describe the exemptions at statute precision and say only that Treasury says the final rules clarify them. Do not describe regulation-level definitions.",
    "26 U.S.C. 414A(a)-(b) (statute): a section 401(k) arrangement or a 403(b) salary-reduction annuity contract is not treated as such unless it meets the automatic enrollment requirements. In the first year of participation the uniform percentage of compensation contributed must be not less than 3 percent and not more than 10 percent, unless the participant specifically elects not to have contributions made or to have them made at a different percentage. On the first day of each plan year starting after each completed year of participation the percentage must increase by 1 percentage point, to at least 10 percent but not more than 15 percent, unless the participant elects out or another percentage. Contributions with no participant investment election must be invested in accordance with 29 CFR 2550.404c-5 (the default-investment rules).",
    "26 U.S.C. 414A(c) exceptions: SIMPLE plans (section 401(k)(11)); any cash or deferred arrangement or 403(b) contract established before the date of enactment (Dec. 29 2022, Pub. L. 117-328); governmental plans and church plans; an employer in existence (with any predecessor) for less than 3 years; and a small employer, which is exempt until the date 1 year after the close of the first taxable year in which the employer normally employed more than 10 employees (the small-business test is more than 10 employees, so 10 or fewer is exempt).",
    "Pub. L. 117-328, div. T, title I, section 101(c) (Dec. 29 2022): the statutory amendments apply to plan years beginning after Dec. 31 2024. So the statute date is plan years beginning after Dec. 31 2024 and Treasury's date for the final regulations is plan years beginning after Dec. 31 2027. The sources checked do not tell a worker which date governs a given plan. Never say or imply a current plan is exempt or has until 2028. State both dates with attribution.",
    "ILLUSTRATIVE ARITHMETIC (the rule's minimum path, pre-tax, salary-only, not a prediction, no match or investment growth): start 3% in year 1, then +1 point per completed year of participation: 3, 4, 5, 6, 7, 8, 9, 10 percent, so 10% is reached after seven steps (year 8). A plan may start higher (up to 10%) or step faster, up to 15%. At a $60,000 salary 3% is $1,800 a year and 10% is $6,000 a year.",
    "NOT VERIFIED, DO NOT STATE: any Federal Register or TD number for the final regulations (do not print \"TD 10061\"); a good-faith interim compliance period; how Roth versus traditional default rules apply; that any existing plan is exempt or has until 2028; employer match rules."
  ],
  "takeawayPlan": "For workers at a covered new 401(k) or 403(b) plan: expect enrollment at 3% or more (first-year range 3% to 10%), raised 1 point a year to at least 10% (max 15%), and you can opt out or choose another rate; check your plan notice for whether the plan is exempt or voluntarily auto-enrolls with another default. Both dates (statute after Dec 31 2024, Treasury final regulations after Dec 31 2027) are stated with attribution and the sources do not say which governs a plan. Attributed to Treasury and 26 U.S.C. 414A; schedule is the rule's minimum path shown for illustration."
}
```

## ROW RECORDS FOR THE AUDITOR (do not print on the page)
- medium: text -> text
- register: operator
- page type: explainer (floor 1200 words)
- teeup-exempt: source-reported page, no site experience fits; sentence 1 is the answer, no tee-up, no company-claim "we".
- basis: reported (external primary sources only). No "we tested", no internal testing, internal analysis or modeling wording. TESTED format is OFF.
- Title ideas (50 to 60 chars, one clause): "New 401(k) Auto-Enrollment Rules Start Workers at 3%". Do NOT write "10% Target": the rule sets a first-year range of 3% to 10% and steps up to at least 10% (max 15%). Primary keyword: 401k automatic enrollment rules (write 401(k) in prose). Supporting: secure 2.0 automatic enrollment, 401k auto enrollment rules.

## CLOSED FACT LIST
Every number, date, quote and claim the page may state is below or in the evidence packet above. Anything not on this list, you do not know. Never invent a price, limit, benchmark, date, quote or URL; if a figure is not on the list, say it is not published in the sources checked.
- Treasury press release SB-0690 (U.S. Department of the Treasury and the Internal Revenue Service, Nov. 17 2026): Treasury and the IRS issued final regulations implementing a provision of the SECURE 2.0 Act on automatic enrollment for certain 401(k) and 403(b) plans. Treasury estimates the provision will increase retirement savings by an average of $4.2 billion annually over the 2023-2032 period.
- Treasury: "Covered retirement plans generally must automatically enroll eligible employees at a contribution rate of three percent. After an initial participation period, the default contribution rate must generally increase by at least one percentage point each year until it reaches at least ten percent, subject to a fifteen percent maximum. Employees may opt out or choose a different contribution rate."
- Treasury: "The final regulations generally apply to retirement plan years beginning after December 31, 2027, giving employers time to make necessary administrative changes."
- Treasury says the final regulations: clarify statutory exceptions for qualifying small and new businesses, governmental plans, church plans and SIMPLE 401(k) plans; give employers flexibility in the timing and amount of automatic contribution increases within statutory limits; simplify plan communications by allowing certain required notices to be combined and reducing annual notice requirements for qualifying employees who are not participating, provided they receive annual reminders and any plan documents they are entitled to request; and explain how automatic enrollment requirements apply following plan mergers. Describe the exemptions at statute precision and say only that Treasury says the final rules clarify them. Do not describe regulation-level definitions.
- 26 U.S.C. 414A(a)-(b) (statute): a section 401(k) arrangement or a 403(b) salary-reduction annuity contract is not treated as such unless it meets the automatic enrollment requirements. In the first year of participation the uniform percentage of compensation contributed must be not less than 3 percent and not more than 10 percent, unless the participant specifically elects not to have contributions made or to have them made at a different percentage. On the first day of each plan year starting after each completed year of participation the percentage must increase by 1 percentage point, to at least 10 percent but not more than 15 percent, unless the participant elects out or another percentage. Contributions with no participant investment election must be invested in accordance with 29 CFR 2550.404c-5 (the default-investment rules).
- 26 U.S.C. 414A(c) exceptions: SIMPLE plans (section 401(k)(11)); any cash or deferred arrangement or 403(b) contract established before the date of enactment (Dec. 29 2022, Pub. L. 117-328); governmental plans and church plans; an employer in existence (with any predecessor) for less than 3 years; and a small employer, which is exempt until the date 1 year after the close of the first taxable year in which the employer normally employed more than 10 employees (the small-business test is more than 10 employees, so 10 or fewer is exempt).
- Pub. L. 117-328, div. T, title I, section 101(c) (Dec. 29 2022): the statutory amendments apply to plan years beginning after Dec. 31 2024. So the statute date is plan years beginning after Dec. 31 2024 and Treasury's date for the final regulations is plan years beginning after Dec. 31 2027. The sources checked do not tell a worker which date governs a given plan. Never say or imply a current plan is exempt or has until 2028. State both dates with attribution.
- ILLUSTRATIVE ARITHMETIC (the rule's minimum path, pre-tax, salary-only, not a prediction, no match or investment growth): start 3% in year 1, then +1 point per completed year of participation: 3, 4, 5, 6, 7, 8, 9, 10 percent, so 10% is reached after seven steps (year 8). A plan may start higher (up to 10%) or step faster, up to 15%. At a $60,000 salary 3% is $1,800 a year and 10% is $6,000 a year.
- NOT VERIFIED, DO NOT STATE: any Federal Register or TD number for the final regulations (do not print "TD 10061"); a good-faith interim compliance period; how Roth versus traditional default rules apply; that any existing plan is exempt or has until 2028; employer match rules.

## CLOSED URL LIST (the only external links allowed; link the first mention of each organization)
- https://home.treasury.gov/news/press-releases/sb0690
- https://www.law.cornell.edu/uscode/text/26/414A
- https://www.irs.gov/

## INTERNAL ROUTES YOU MAY LINK (markdown, trailing slash; use descriptive anchors)
- /guides/retirement-contribution-limits-2027/
- /retirement/401k-calculator/
- /compare/roth-401k-vs-traditional-401k/
- /guides/401k-contribution-limits-2026/
Use 1 to 3 of them where they genuinely help; never "click here".

## FAQ SPEC
FAQ topics (sentence-case): Is 401(k) auto-enrollment mandatory? Can I opt out of automatic enrollment? Does my current plan have to change? What rate will I start at? When do the final regulations apply? Which plans are exempt? Do not answer anything about employer match, Roth versus traditional defaults, or what a specific plan must do today.

## PAGE-SPECIFIC DIRECTIVES AND CORRECTIONS (these supersede any conflicting text above, including the brief's takeaway and outline wording)
- Section 1 states both dates with attribution: the statute applies to plan years beginning after Dec. 31 2024 (Pub. L. 117-328), and Treasury says the final regulations generally apply to plan years beginning after Dec. 31 2027. Say the sources checked do not tell a worker which date governs a given plan. Never say or imply a current plan is exempt or has until 2028. Same two dates, attributed, in the FAQ and the takeaway.
- Heading for the table section: use "How the Default Rate Rises Year by Year". Label the table (in a sentence before it) as the minimum path under the rule, shown as our illustrative arithmetic: starts at 3%, +1 point per completed year of participation, 10% after seven steps; a plan may start higher (up to 10%) or step faster up to 15%. The $60,000 example ($1,800 at 3%, $6,000 at 10%) must say it is pre-tax, salary-only arithmetic and not a prediction.
- Exemptions: state at statute precision from the closed fact list (SIMPLE 401(k) plans, plans established before Dec. 29 2022, governmental and church plans, employers in existence under 3 years, small employers: the test is more than 10 employees). For anything the final regulations changed, write only "Treasury says the final rules clarify them". Do not describe regulation-level definitions.
- Do not print "TD 10061" or any Federal Register number. Do not mention good-faith interim compliance. Do not state Roth or traditional default rules.
- No "internal analysis", "internal modeling" or "we modeled" wording. The rule rests on Treasury and the statute; the arithmetic is "our illustrative arithmetic" only.
- Our Takeaway: check whether your plan is exempt or voluntarily auto-enrolls with another default, and read the plan notice for the rate and the opt-out steps. Link [2027 401(k) contribution limits](/guides/retirement-contribution-limits-2027/) and the [401(k) calculator](/retirement/401k-calculator/) once each there. Anchor for the compare link elsewhere: [how 401(k) automatic enrollment defaults work].

## REVIEWER GUARDRAILS SUMMARY (all must hold)
- Exclude: TD 10061 and any Federal Register number, the 6:30 pm "service restored" claim as an independent fact, any fee-waiver status assertion, any X post count, any good-faith interim compliance claim, any Minnesota hearing start time or valuation-appeal path.
- Financial YMYL: factual, neutral, primary sources, no guaranteed outcomes, no investment or legal advice.
