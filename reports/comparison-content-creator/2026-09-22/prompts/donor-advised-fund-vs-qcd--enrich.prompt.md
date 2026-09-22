# ENRICHMENT — donor-advised-fund-vs-qcd

Target page: src/data/comparisons.ts, slug "donor-advised-fund-vs-private-foundation"
route: /compare/donor-advised-fund-vs-private-foundation/
Task: add ONE new section to the existing `sections` array — a focused head-to-head
"Donor-Advised Fund vs. QCD" sub-section with a comparison table and a short verdict. This
page already compares DAFs against private foundations in depth, and the site's own guide on
charitable bunching mentions DAFs and QCDs side by side, but no page gives QCD (qualified
charitable distribution) a direct head-to-head table against a donor-advised fund. Add that
missing comparison as its own section, positioned right before the closing "Which structure
fits your giving?" section.

register: operator
page type: comparison (this is an ADDITION to an existing comparison page, not a new page)

## THE CLOSED FACT LIST — every number/claim this addition may state

- A donor-advised fund (DAF) can be funded by a donor of any age, with cash or appreciated
  assets, and the donor claims an itemized charitable deduction (up to 60% of AGI for cash,
  per IRS Publication 526 — already cited elsewhere on this page).
- A qualified charitable distribution (QCD) is available only to IRA owners age 70½ or older.
  A QCD sends money directly from a traditional IRA to a qualifying charity, up to $111,000 in
  2026 per donor, and the amount is excluded from the donor's taxable income entirely — it is
  not a deduction, it simply never counts as income in the first place.
- A QCD counts toward the donor's required minimum distribution (RMD) for the year, if the
  donor is subject to one.
- A QCD cannot be sent to a donor-advised fund, a private foundation, or a supporting
  organization — the IRS excludes those recipient types from QCD eligibility. A QCD must go
  directly to an operating public charity.
- A DAF contribution does NOT reduce a required minimum distribution and does NOT come with the
  income-exclusion QCDs offer — it works through the itemized-deduction system instead, which
  only helps a donor who itemizes.
- Do NOT invent a new dollar limit, age threshold, or AGI percentage beyond what is listed above
  or already stated elsewhere on this page (the 60%/30% AGI deduction limits are already on the
  page for the DAF-vs-foundation comparison and may be reused for the DAF side only).

## THE CLOSED URL LIST — no new external links needed for this addition (internal links only)

## Internal links to use (real routes only)

- [RMD vs QCD](/compare/rmd-vs-qcd/) (an existing comparison on this site — use it for the deeper RMD/QCD mechanics rather than re-explaining them here)

## The page's CURRENT text (for voice-matching and to avoid repeating what's already said)

See attached --page file: the full "donor-advised-fund-vs-private-foundation" comparison entry.

## Output

ONE new section: a `## ` heading "Donor-Advised Fund vs. QCD for Charitable Giving" (Title
Case, no colon-drama), followed by 2-3 short paragraphs that:
1. State plainly that these solve different problems: a DAF is a giving vehicle you contribute
   to and grant from over time; a QCD is a one-time, age-gated transfer straight from an IRA
   that shrinks taxable income and can satisfy an RMD.
2. Add a comparison table (markdown GFM pipe table) with at least 4 rows: minimum donor age,
   tax mechanism (deduction vs. income exclusion), whether it counts toward an RMD, and eligible
   funding source.
3. Close with a one- or two-sentence verdict: a donor under 70½, or one funding a gift with
   appreciated stock rather than IRA assets, should use a DAF; an IRA owner 70½ or older who
   wants to lower taxable income and can send the gift straight to an operating charity (not a
   DAF) should use a QCD instead, and link to the RMD vs QCD comparison for the RMD mechanics.
Do not restate the "Deduction limits: 60% vs. 30% of AGI" section's exact wording. Do not add a
new FAQ entry.
