# SECTION ENRICHMENT — roth-ira-vs-traditional-ira--backdoor-enrich

target page: /compare/roth-ira-vs-traditional-ira/ (src/data/comparisons.ts)
task: Add ONE new section (## heading + prose) that gives a direct "Backdoor Roth IRA vs Traditional IRA" head-to-head, going beyond the page's existing one-paragraph FAQ mention.
section heading to use: "Backdoor Roth IRA vs Traditional IRA: The Mechanics"
page type: comparison (enrichment section)
register: operator (match the page's existing "we/you" voice)
primary keyword: backdoor roth vs traditional ira

## THE CLOSED FACT LIST — every number/date/limit this section may state

- A backdoor Roth IRA is not a separate account type. It is a two-step strategy: contribute to a Traditional IRA (which has no income limit to contribute), then convert that Traditional IRA balance to a Roth IRA. High earners use this because they are otherwise blocked from contributing to a Roth IRA directly once their income exceeds the Roth income phase-out (already stated elsewhere on this page as $150,000-$165,000 single / $236,000-$246,000 married filing jointly for 2025).
- A plain Traditional IRA contribution, by contrast, is simply funding the account and, if eligible, taking a deduction — there is no second conversion step, and no income limit blocks the contribution itself (though the deduction can phase out based on income and workplace-plan coverage, as already stated elsewhere on this page).
- The backdoor Roth conversion is only "tax-free" on the amount that was already after-tax (non-deductible) when contributed. If the saver holds ANY other pre-tax Traditional IRA, SEP-IRA, or SIMPLE IRA money, the IRS's pro-rata rule requires the conversion to be taxed proportionally across ALL of the saver's IRA balances combined, not just the new contribution — meaning the conversion can become partially taxable even though the new contribution itself was non-deductible.
- Because of the pro-rata rule, a saver with an existing pre-tax Traditional IRA balance (for example, an old 401(k) rolled into a Traditional IRA) often cannot execute a clean, fully tax-free backdoor Roth conversion without first addressing that pre-tax balance (such as rolling it into an employer 401(k) plan that accepts incoming rollovers, if the saver has one).
- A backdoor Roth conversion is reported to the IRS on Form 8606, which tracks the saver's non-deductible IRA basis; filing this form correctly is what keeps the after-tax portion of the conversion from being taxed twice.
- This site's own [Rollover IRA vs Traditional IRA](/compare/rollover-ira-vs-traditional-ira/) comparison already covers how the pro-rata rule treats a rollover IRA balance the same as any other pre-tax IRA money — link to it rather than re-deriving that mechanic here.

Anything not on this list, you do not know. Never invent a specific IRS contribution deadline, a specific tax-filing software feature, or a specific dollar example of tax owed; tell the reader the pro-rata math depends on their own IRA balances and to consult a tax professional or IRS Form 8606 instructions for their own numbers.

## THE CLOSED URL LIST — the only external hrefs allowed

- https://www.irs.gov/publications/p590a
- https://www.irs.gov/forms-pubs/about-form-8606

## Internal links this section may use (real routes only)

- [Rollover IRA vs Traditional IRA](/compare/rollover-ira-vs-traditional-ira/)
- [401(k) vs Roth IRA](/compare/401k-vs-roth-ira/)

## What the section must cover

1. Direct answer, first sentence: a backdoor Roth IRA is not a different account than a Traditional IRA, it's a two-step strategy of contributing to a Traditional IRA and then converting it to a Roth, used specifically by high earners the direct Roth income limit locks out.
2. A short comparison, as an inline GFM markdown table (pipe table, at least 3 rows, a real value in both columns) covering: who it's for (anyone eligible vs. high earners over the Roth income limit), the extra step required (none vs. a conversion), and the main risk (none vs. the pro-rata rule taxing part of the conversion if other pre-tax IRA money exists).
3. Explain the pro-rata rule trap plainly, with the Form 8606 reporting mechanic, and link to the Rollover IRA vs Traditional IRA page for the deeper pro-rata mechanic.
4. A short verdict: a straightforward Traditional IRA contribution is enough for most savers; the backdoor conversion is worth the extra step only for high earners over the Roth limit, and only after checking for other pre-tax IRA balances that would trigger the pro-rata rule.

Output: markdown only, one `## ` heading line followed by the prose (include the inline pipe table inside the section content). No H1. Do not repeat the page's existing Roth-vs-Traditional tax-timing argument at length — reference it in one sentence at most and move straight to the backdoor-specific mechanics.
