# Phase 4 Audit, Batch 1 (audit-b1), job 2026-11-25-tool-usage

Snapshot: reports/mindmap-pass/2026-11-25-tool-usage/audit/preview-snapshot.json (8 routes). Review: reports/mindmap-pass/2026-11-25-tool-usage/audit/review.json. Round 1 of max 2 (roundsRemaining 1 per route). Disposition for every route: rework-and-reaudit. No liabilityBlock candidates.

Verified: preflight check passed; scripts/test-tool-usage-1125.mjs passes 135 checks; CR-1 ($1,916.60 gross, $1,707 net), CR-2 (17 tax years, $3,000 x 16 then $2,000), CR-3 (W-4V labeled 2026), CR-4 (wage base labeled, but see SEP-3) checked; CMS $209.40/+$6.50/$292 matches saved capture; IRS 2027 limits match Notice 2026-66; islands hydrate (headless Chrome on dist) with one data-tool root each; CR-6 picks block renders once on the COLA calculator. SSA figures on the guides are inherited and no SSA capture is saved (SSA returned HTTP 403 to me), so they are unverified against a primary capture.

## Findings

### /sep-ira-solo-401k-contribution-calculator/  verdict FAIL
- **SEP-1 (FAIL)** quote: "Employee deferrals for a solo 401(k) must be elected by the end of the tax year."
  - problem: Contradicts the sentence before it and IRS Publication 560 (saved source, line 521 and 1469): a sole proprietor with no employees who adopts a new 401(k) after year end can still make first-year elective deferrals until the tax filing deadline (no extensions). The Publisher's Take also says 'check the plan setup deadline before the year closes'.
  - fix: State the end-of-year rule as the general rule and add the Pub 560 first-plan-year exception for sole proprietors with no employees (deferrals paid before the filing deadline, without extensions).
  - liabilityBlock candidate: no
- **SEP-2 (FAIL)** quote: "Official guidance in IRS Publication 560 does not address maintaining both plans at the same time."
  - problem: Incorrect and a non-answer. Pub 560 (saved) does address it: the elective deferral limit is shared between a SEP and 401(k) plans, and 'you can have more than one qualified plan, but your contributions to all the plans must not total more than the overall limits'. Source silence is claimed where the source speaks, and the reader is left with no answer.
  - fix: Answer directly: yes you can have both, but the employee deferral limit and the overall 415(c) limit are shared, and employer contributions to both plans count against one 20% / $75,000 ceiling. Cite Pub 560 sections.
  - liabilityBlock candidate: no
- **SEP-3 (FAIL)** quote: "For tax year 2027, calculations use the 2026 Social Security wage base of $184,500."
  - problem: CR-4 is met literally (the base is labeled) but the same release publishes the 2027 taxable maximum of $192,300 (SSA fact sheet, on /guides/social-security-changes-2027/). The calculator knowingly uses a stale input where the official 2027 figure is already published on the site; profit above about $199,800 is affected and the displayed SE tax and net earnings for 2027 at those profits are slightly off.
  - fix: Use $192,300 for 2027 with an SSA source link and add a boundary test above it, or keep the labeled note but cite why the SSA figure is not used.
  - liabilityBlock candidate: no
- **SEP-4 (nit)** quote: "a sole proprietor ... in either plan"
  - problem: FAQ 'You can still make the full employer contribution of up to 20% ... in either plan' reads as if each plan gives a separate 20%; with both plans the employer limit is shared.
  - fix: Say 'in one plan, or split across both within one 20% / $75,000 limit'.
  - liabilityBlock candidate: no
- **SEP-5 (nit)** quote: "Enter your Schedule C profit into the sep ira contribution calculator above"
  - problem: Lowercase 'sep ira' in the closing sentence; acronym casing.
  - fix: Write 'SEP IRA contribution calculator'.
  - liabilityBlock candidate: no

### /social-security-withholding-calculator/  verdict FAIL
- **W4V-1 (FAIL)** quote: "Social Security Withholding Calculator 2026 (SEO title, 43 characters)"
  - problem: SEO title is 43 characters; the content standard requires 50 to 60 characters carrying the primary keyword.
  - fix: Lengthen to 50 to 60 characters, for example 'Social Security Withholding Calculator: Best W-4V Rate'.
  - liabilityBlock candidate: no
- **W4V-2 (FAIL)** quote: "A married couple filing jointly, both 65 or older, with a $3,800 monthly benefit and $50,000 of other income owes an estimated $4,902 in tax. ... Choosing 12% withholds $5,472, which covers the bill with $570 over."
  - problem: The worked example is for two filers 65 or older with income under the senior-deduction phase-out, yet it omits the $6,000 per person senior deduction (2025 to 2028). With it, estimated tax is about $3,462 and the lowest covering rate is 10% ($4,560), not 12%. The omission is disclosed in the method note and the tool says the estimate 'can run high', but the page's headline example and the default single-filer example ($2,775 tax; 10% vs 7% is unchanged) present a rate that over-withholds for most 65+ readers.
  - fix: Either model the senior deduction with its MAGI phase-out or state beside each worked example that the senior deduction would lower the tax and may allow the next lower rate; recompute the MFJ example both ways.
  - liabilityBlock candidate: no
- **W4V-3 (nit)** quote: "The brackets and standard deduction are the 2026 figures from IRS Revenue Procedure 2025-32"
  - problem: Rev. Proc. 2025-32 was not saved to research/sources. I recomputed both worked examples against the 2026 brackets ($2,775 and $4,902 match) so the figures are consistent, but the source file is missing from the evidence set.
  - fix: Save the Rev. Proc. 2025-32 capture to research/sources.
  - liabilityBlock candidate: no

### /capital-loss-carryover-calculator/  verdict FAIL
- **CL-1 (FAIL)** quote: "Capital Loss Carryover Calculator (SEO title, 33 characters)"
  - problem: SEO title is 33 characters; the content standard requires 50 to 60 characters carrying the primary keyword.
  - fix: Lengthen to 50 to 60 characters, for example 'Capital Loss Carryover Calculator: Years to Use a Loss'.
  - liabilityBlock candidate: no

### /social-security-cola-calculator/  verdict FAIL
- **COLA-1 (FAIL)** quote: "The deadline to enroll in paperless delivery is November 18."
  - problem: The deadline of November 18 had passed 7 days before the page's Updated date (November 25, 2026); the reader is told to act by a past date and the instruction is a dead end.
  - fix: Replace with a date-neutral instruction (for example: 'If you missed the paperless cut-off, the notice is mailed in December') or remove the deadline.
  - liabilityBlock candidate: no
- **COLA-2 (nit)** quote: "The guide is Social Security taxable covers when benefits are taxed."
  - problem: FAQ sentence is unparseable on first read (a link label used as a sentence subject).
  - fix: Rewrite: 'Our guide to whether Social Security is taxable covers when benefits are taxed.'
  - liabilityBlock candidate: no

### /guides/2027-social-security-cola/  verdict FAIL
- **G1-1 (FAIL)** quote: "For 2027, the projected Part B increase is $6.60, which takes a smaller share of a larger raise."
  - problem: Stale Trustees projection contradicts the final CMS figures stated elsewhere on the same page ($209.40, up $6.50).
  - fix: Replace $6.60 with the final $6.50 increase.
  - liabilityBlock candidate: no
- **G1-2 (FAIL)** quote: "Subtract the Part B increase. Use the $6.60 Trustees projection until CMS sets the final 2027 premium."
  - problem: CMS set the final premium on November 17, 2026 (page says so). Instruction directs the reader to a superseded number. Also 'The $65.40 example' in the same section contradicts the $65.50 net gain computed earlier.
  - fix: Use $6.50 and $65.50; delete 'until CMS sets the final premium'.
  - liabilityBlock candidate: no
- **G1-3 (FAIL)** quote: "In 2026, the surcharge starts above $109,000 of modified adjusted gross income (MAGI) for individuals, or $218,000 ... About 8% of beneficiaries pay these amounts. ... compare your MAGI to those 2026 thresholds"
  - problem: The cited CMS 2027 fact sheet (saved) gives 2027 IRMAA thresholds of $112,000 / $224,000, applied to 2025 income for 2027 premiums, and says roughly 9% of enrollees pay. The guide sends readers to the wrong-year thresholds and cites a lower share; FAQ repeats $109,000.
  - fix: Use $112,000 / $224,000 and about 9% with the CMS 2027 fact sheet table; update the FAQ.
  - liabilityBlock candidate: no
- **G1-4 (FAIL)** quote: "enroll in paperless notices by November 18, 2026"
  - problem: The deadline of November 18 had passed 7 days before the page's Updated date (November 25, 2026); the reader is told to act by a past date and the instruction is a dead end.
  - fix: Replace with a date-neutral instruction (for example: 'If you missed the paperless cut-off, the notice is mailed in December') or remove the deadline.
  - liabilityBlock candidate: no
- **G1-5 (nit)** quote: "enter your new benefit in our Social Security retirement calculator"
  - problem: Guide steers readers to the retirement calculator for the COLA estimate in two places instead of the new COLA calculator that is linked under Tools.
  - fix: Point to the Social Security COLA calculator.
  - liabilityBlock candidate: no

### /guides/2027-ssdi-cola/  verdict FAIL
- **SSDI-1 (FAIL)** quote: "Without an account, you need to create one and enroll in paperless notices by November 18 to see the notice online."
  - problem: The deadline of November 18 had passed 7 days before the page's Updated date (November 25, 2026); the reader is told to act by a past date and the instruction is a dead end.
  - fix: Replace with a date-neutral instruction (for example: 'If you missed the paperless cut-off, the notice is mailed in December') or remove the deadline.
  - liabilityBlock candidate: no

### /guides/ssi-increase-2027/  verdict FAIL
- **SSI-1 (FAIL)** quote: "Before November 18, sign in or create an account at my Social Security and turn on paperless notices"
  - problem: The deadline of November 18 had passed 7 days before the page's Updated date (November 25, 2026); the reader is told to act by a past date and the instruction is a dead end.
  - fix: Replace with a date-neutral instruction (for example: 'If you missed the paperless cut-off, the notice is mailed in December') or remove the deadline.
  - liabilityBlock candidate: no
- **SSI-2 (nit)** quote: "**The federal payment standard.** It is $1,029"
  - problem: Literal markdown asterisks render as visible text in three list items on the page (pre-existing defect in the list field).
  - fix: Remove the ** markers or use the list/bold syntax the renderer supports.
  - liabilityBlock candidate: no

### /guides/social-security-changes-2027/  verdict FAIL
- **CH-1 (FAIL)** quote: "enroll in paperless notices by November 18 to see the notice online"
  - problem: The deadline of November 18 had passed 7 days before the page's Updated date (November 25, 2026); the reader is told to act by a past date and the instruction is a dead end.
  - fix: Replace with a date-neutral instruction (for example: 'If you missed the paperless cut-off, the notice is mailed in December') or remove the deadline.
  - liabilityBlock candidate: no

## Writer's disclosed doubts
- SEP deferral cap reading: engine correct (deferral limited by earnings; total capped at net earnings). Timing sentence wrong (SEP-1).
- Additional Medicare Tax omission: acceptable. It is not part of SE tax or the half-SE deduction, so contribution caps are unaffected.
- W-4V Rev. Proc. 2025-32 unsaved and age-65 extra deduction: figures verified by hand against 2026 brackets; senior deduction omission changes the MFJ example (W4V-2).
- SEP FAQ 'in either plan': nit SEP-4.
- Guide stitching: confirmed leftovers ($6.60, $65.40, 2026 IRMAA) in the main COLA guide.
- Publisher's Takes in-context: present on SEP, W-4V, capital-loss pages; no em-dashes or fabricated stories seen; acceptable. Generator gemini fallback: no output-quality defect attributable beyond the above.

VERDICT: FAIL