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


## Writer rules specific to this run (read with the system contract)
- Operator register, page type guide. Sentence 1 of `introText` is the direct answer. The brand first-"we" rule: the first company claim reads "At ModernWallet, we ...". The brand name is ModernWallet.
- Evidence basis and visible attribution are fixed below under PROVENANCE. Use exactly the attribution the basis supports. Do not claim any product test, hands-on trial, client conversation or survey. No TESTED labels, no "How We Tested" section, no "we tested".
- Anything not on the CLOSED FACT LIST, you do not know. Never invent a number, date, price, limit, benchmark or URL. If a fact is unpublished or not answered by the sources, say so plainly instead of guessing.
- External links come only from the CLOSED URL LIST (markdown links, first mention of each organization). Internal links come only from the INTERNAL LINKS list.
- Do not mention these workflow notes, reviewer notes, run files or internal evidence labels in the page.
- Never write about the page itself ("this guide", "this page"). Zero em-dashes. Number ranges use "to".

## PROVENANCE (copy into the page as visible attribution)
- Basis: reported plus calculated. IRS figures are attributed to the IRS (announcement IR-2026-136 and Notice 2026-66). Only the age 60 to 63 TOTAL ($37,250) and the per-paycheck amounts are OUR calculation.
- Beside the first per-paycheck figure, write one or two natural connected sentences: what we did (In our internal calculation, we divided each 2027 limit across common pay schedules to see what maxing out takes from every paycheck), what we found, and how readers can check it (inputs are the IRS limits; equal pay periods; the sum or division is shown). Label the $37,250 total "by our calculation" at its first appearance (the IRS publishes only the $11,750 catch-up).
- No testing claim. No survey or client claim.

## PLANNED TAKEAWAY (place after the per-paycheck section and before the FAQ, as a section headed "Our Takeaway for 2027 Elections"; do not repeat the opening paragraph)
- Conclusion: for most savers the 2027 answer is $25,500 plus catch-up by age, with the IRA unchanged at $7,500. Applies to anyone setting 2027 payroll elections. Basis: IRS announcement plus our per-paycheck calculation. What changes it: a plan that caps deferrals below the legal limit, a plan that does not offer the catch-up or Roth catch-up, ages 60 to 63 (higher catch-up), higher earners whose catch-up may have to be designated Roth, and a 27-paycheck calendar. Next action: check the plan's own limit and update the election.
- Who this is not for: someone whose plan caps deferrals below the legal limit, or who is not in a plan covered by these limits (for example, a self-employed saver using a different plan type); they should read their plan document.

## CLOSED FACT LIST (every number the page may state)
Anything not on this list, you do not know.

IRS source: Internal Revenue Service (IRS) announcement IR-2026-136, dated Nov. 12, 2026, "401(k) limit increases to $25,500 for 2027, IRA limit remains $7,500", and IRS Notice 2026-66 (2027 Amounts Relating to Retirement Plans and IRAs, as Adjusted for Changes in Cost-of-Living).

Employee deferrals
- The annual contribution limit for employees in 401(k), 403(b), governmental 457 plans and the federal government's Thrift Savings Plan (TSP) is $25,500 for 2027, up from $24,500 for 2026 (up $1,000).
- Catch-up limit that generally applies at age 50 and over in most of those plans: $8,500 for 2027, up from $8,000 for 2026 (up $500). Participants 50 and older generally can contribute up to $34,000 a year starting in 2027 (IRS), up from $32,500 in 2026.
- Higher catch-up for employees aged 60, 61, 62 and 63 in those plans: $11,750 for 2027, "instead of the $8,500" (IRS), up from $11,250 for 2026 (up $500). The IRS does not publish a total for this group. $25,500 + $11,750 = $37,250 is OUR calculation. The 2026 equivalent is $35,750 ($24,500 + $11,250), so the total rises $1,500.
- Roth catch-up wage threshold, quote this sentence from Notice 2026-66 verbatim in a blockquote with the notice named: "The Roth catch-up wage threshold for 2026, which under section 414(v)(7)(A) is used to determine whether an individual's catch-up contributions to an applicable employer plan (other than a plan described in section 408(k) or (p)) for 2027 must be designated as Roth contributions, is increased from $150,000 to $155,000."
  After the quote you may state ONLY: it is a threshold used to decide whether 2027 catch-up contributions must be designated as Roth contributions; it applies to catch-up contributions only; plans described in section 408(k) or (p) (SIMPLE and simplified employee pension plans) are excluded by the notice; whether a plan offers Roth contributions is plan-specific, so check the plan. FORBIDDEN: any FICA wage, same-employer, prior-year-wage or "if you earn over $155,000 in 2027" paraphrase; any statement about which wages are measured.
- Limit for defined contribution plans under section 415(c)(1)(A): $75,000 for 2027, up from $72,000 for 2026. Explain what it covers by linking our 2026 guide: our 2026 401(k) guide describes it as the combined cap on your own deferrals and employer contributions (match and profit sharing).
- Starter 401(k) deferral-only arrangement limit: $6,500 for 2027, up from $6,000; increased by $1,100 for individuals who attain age 50 before the end of the taxable year. (optional)
- A plan can set a lower cap than the legal limit and a plan decides whether to offer catch-up contributions (we say: check your plan).
- Roth and Traditional 401(k) contributions share one deferral limit: this is stated on our existing 2026 guide (link it); do not cite a new source for it.

IRA
- IRA contribution limit: $7,500 for 2027, unchanged from 2026. IRA catch-up limit for age 50 and over: $1,100, unchanged (a total of $8,600 with the catch-up is the sum of those two figures).
- Traditional IRA deduction phase-out ranges when covered by a workplace retirement plan, 2027 vs 2026: single taxpayers $83,000 to $93,000 (2026: $81,000 to $91,000); married filing jointly, spouse making the contribution is covered: $133,000 to $153,000 (2026: $129,000 to $149,000); IRA contributor not covered but married to someone who is covered: $250,000 to $260,000 (2026: $242,000 to $252,000); married filing separately and covered: $0 to $10,000, not adjusted for cost of living, unchanged. If neither the taxpayer nor the spouse is covered by a retirement plan at work, the phase-outs of the deduction do not apply (IRS).
- Roth IRA contribution income phase-out ranges, 2027 vs 2026: singles and heads of household $158,000 to $173,000 (2026: $153,000 to $168,000); married filing jointly $250,000 to $260,000 (2026: $242,000 to $252,000); married filing separately $0 to $10,000, unchanged.
- Saver's Credit income limits (IRS says these now apply to contributions to ABLE accounts made after Dec. 31, 2026, because Saver's Match contributions under section 6433 replace the Saver's Credit for elective contributions to qualifying retirement plans and IRAs, per a footnote in Notice 2026-66): $83,000 married filing jointly (2026: $80,500); $62,250 head of household (2026: $60,375); $41,500 singles and married filing separately (2026: $40,250). State this carefully and briefly; do not describe how Saver's Match works.

SIMPLE plans
- Amount individuals can generally contribute to a SIMPLE retirement account: $17,500 for 2027, up from $17,000. Higher amount for certain applicable SIMPLE accounts: $19,100, up from $18,100.
- SIMPLE catch-up at age 50 and over: $4,000 (unchanged). Different catch-up for certain applicable SIMPLE plans: $3,850 (unchanged). Higher catch-up at ages 60 to 63 in SIMPLE plans: $5,250 (unchanged).

OUR CALCULATION (label every item below "our calculation"; inputs are the IRS limits above; equal pay periods)
- $25,500 per year: $980.77 per biweekly paycheck (26 pay periods), $2,125.00 per month (12), $1,062.50 per semimonthly paycheck (24), $490.38 per weekly paycheck (52).
- $34,000 (age 50 and over): $1,307.69 biweekly (26), $2,833.33 monthly (12), $1,416.67 semimonthly (24), $653.85 weekly (52).
- $37,250 (ages 60 to 63): $1,432.69 biweekly (26), $3,104.17 monthly (12), $1,552.08 semimonthly (24), $716.35 weekly (52).
- Counterexample to state: some biweekly pay calendars have 27 paychecks in a calendar year; then $25,500 is $944.44 per paycheck, $34,000 is $1,259.26 and $37,250 is $1,379.63. The 26-paycheck figure would overshoot the cap by one paycheck.

## CLOSED URL LIST (external links allowed; first mention of each, markdown links)
- https://www.irs.gov/newsroom/401k-limit-increases-to-25500-for-2027-ira-limit-remains-7500  (IRS announcement; link the first mention of the IRS)
- https://www.irs.gov/pub/irs-drop/n-26-66.pdf  (Notice 2026-66)
- https://www.tsp.gov/  (Thrift Savings Plan, link the first mention of the TSP)

## INTERNAL LINKS (the only internal routes allowed; use these anchors where natural)
- /guides/401k-contribution-limits-2026/  anchor "2026 401(k) limits guide" (in section 1 or 2, for readers comparing years)
- /guides/ira-contribution-limits-2026/  anchor "2026 IRA limits guide" (in the IRA section)
- /retirement/401k-calculator/  anchor "401(k) calculator" (next action, in the per-paycheck section)
- /compare/tsp-vs-401k/  anchor "TSP vs 401(k) comparison" (in the deferral limits section)

## FAQ SPEC (4 to 6 questions, sentence case, direct answer first)
- What is the 401(k) contribution limit for 2027? ($25,500; catch-up amounts)
- Is the 2027 401(k) limit final or expected? (The IRS announced it on Nov. 12, 2026; it is the announced limit for 2027, not an estimate. Do not discuss what the limit will be in later years.)
- What is the 2027 Roth 401(k) contribution limit? (Roth and Traditional share one limit; see our 2026 guide; Roth catch-up wage threshold applies to catch-up contributions only)
- Is the TSP limit the same as the 401(k) limit for 2027? (Yes, the IRS lists them together at $25,500, with the same catch-up amounts)
- Does the 2027 IRA limit change? (No, $7,500 and $1,100 catch-up unchanged; phase-out ranges rose)
- What is the catch-up limit for ages 60 to 63 in 2027? ($11,750 instead of $8,500; total $37,250 by our calculation)

## SECTION COVERAGE
Follow the approved outline exactly (headings above, Title Case). Section 1 opens with the answer and holds a GFM comparison table in `body`: columns Limit | 2026 | 2027 | Change, rows for employee deferral (401(k), 403(b), governmental 457, TSP), catch-up age 50+, total age 50+, catch-up ages 60 to 63, total ages 60 to 63 (our calculation), IRA limit, IRA catch-up, SIMPLE general limit, defined contribution plan limit (section 415(c)), Roth catch-up wage threshold. A second table in the IRA section holds the phase-out ranges (2026 vs 2027). Add the "Our Takeaway for 2027 Elections" section described above after the per-paycheck section. The last body sentence before the FAQ is a concrete next action carrying the phrase "2027 401(k) contribution limit".
Title for `title`: 2027 Retirement Contribution Limits: 401(k), IRA, TSP. `h1`: Title Case, one clause, not repeating the title verbatim. Do not claim a date of publication or "updated" line.
