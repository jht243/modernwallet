# SECTION ENRICHMENT — sole-proprietorship-vs-llc--s-corp-enrich

target page: /compare/sole-proprietorship-vs-llc/ (src/data/comparisons-business-structure.ts)
task: Add ONE new section (## heading + prose) that gives a direct "Sole Proprietorship vs S Corp" head-to-head. This is an ADDITION — do not repeat what the page already says about the LLC-vs-sole-proprietorship tax equivalence; build on it toward the S-corp-specific question.
section heading to use: "Sole Proprietorship vs S Corp: Why You Can't Go Straight There"
page type: comparison (enrichment section)
register: operator (match the page's existing "we/you" voice)
primary keyword: sole proprietorship vs s corp

## THE CLOSED FACT LIST — every number/date/limit this section may state

- An S corporation is a federal tax election, not a business entity type. To elect S-corp tax treatment, a business must first exist as an eligible entity — in practice, an LLC or a state-law corporation — and then file IRS Form 2553. A sole proprietor cannot elect S-corp status directly, because a sole proprietorship has no separate legal entity to make the election with.
- A sole proprietorship pays 15.3% self-employment tax (Social Security and Medicare) on 100% of net profit, with profit reported on Schedule C.
- An S corporation requires the owner to pay themselves a "reasonable salary" as a W-2 employee; only that salary is subject to Social Security and Medicare payroll tax. Any remaining profit distributed to the owner as a shareholder distribution is not subject to self-employment tax, which is the mechanism behind the S-corp tax saving.
- Per this site's own S-corp election math (already published on this page and on the site's LLC vs S Corp comparison), the S-corp election starts to produce a net saving once profit reaches roughly $35,000 (holding salary at 50% of profit) to around $52,000 (at a 60% salary) — below that level, the extra payroll administration and compliance cost of an S corp can outweigh the self-employment tax saved.
- Running payroll for an S-corp election adds ongoing cost and complexity a sole proprietorship does not have: payroll processing, quarterly payroll tax filings, and often a separate business tax return (Form 1120-S) with the profit passed through to the owner's personal return via Schedule K-1.
- The practical path from sole proprietor to S-corp taxation is two steps, not one: form an LLC (or corporation) with the state first, then file IRS Form 2553 to elect S-corp tax treatment for that entity. Skipping the entity-formation step is not an option under IRS rules.

Anything not on this list, you do not know. Never invent a specific state's LLC filing fee, payroll-processing cost, or a specific reasonable-salary percentage beyond the 50%-60% range already given; direct the reader to the site's own S-corp tax calculator for their own numbers.

## THE CLOSED URL LIST — the only external hrefs allowed

- https://www.irs.gov/instructions/i2553
- https://www.irs.gov/businesses/small-businesses-self-employed/s-corporations

## Internal links this section may use (real routes only)

- [LLC vs S Corp](/compare/llc-vs-s-corp/)
- [S Corp Tax Calculator](/s-corp-tax/)

## What the section must cover

1. Direct answer, first sentence: a sole proprietor cannot elect S-corp status directly — the S-corp election is a tax choice an LLC or corporation makes, not a business type you can pick from day one.
2. A short comparison, as an inline GFM markdown table (pipe table, at least 3 rows, a real value in both columns) covering: self-employment tax treatment (100% of profit vs. only the reasonable salary portion), what has to exist first (nothing vs. an LLC or corporation), and ongoing compliance (none beyond Schedule C vs. payroll + Form 1120-S).
3. Explain the two-step path (form the entity, then file Form 2553) and the profit threshold (~$35,000-$52,000) where the trade pays off.
4. A short verdict: stay a sole proprietor below that profit threshold; form an LLC and elect S-corp status once profit clears it and payroll administration is worth the tax saved. Name who this doesn't serve well: a sole proprietor with genuinely minimal, unpredictable profit, for whom the extra payroll and filing cost of an S-corp election isn't worth it yet.

Output: markdown only, one `## ` heading line followed by the prose (include the inline pipe table inside the section content). No H1. Do not restate the page's existing "sole proprietorship vs LLC" tax-equivalence argument at length — reference it in one sentence at most and move straight to the S-corp-specific material.
