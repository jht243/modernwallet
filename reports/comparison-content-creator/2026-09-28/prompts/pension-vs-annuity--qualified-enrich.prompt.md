# SECTION ENRICHMENT — pension-vs-annuity--qualified-enrich

target page: /compare/pension-vs-annuity/ (src/data/comparisons.ts)
task: Add ONE new section (## heading + prose) that gives a direct "Qualified Annuity vs Non-Qualified Annuity" head-to-head, going beyond the page's existing brief tax-only mention.
section heading to use: "Qualified Annuity vs Non-Qualified Annuity: The Full Difference"
page type: comparison (enrichment section)
register: operator (match the page's existing "we/you" voice)
primary keyword: qualified vs non-qualified annuity

## THE CLOSED FACT LIST — every number/date/limit this section may state

- A qualified annuity is purchased with pre-tax retirement money — inside an IRA, 401(k), or similar employer plan — and is itself treated as part of that retirement account for tax purposes.
- A non-qualified annuity is purchased with money that has already been taxed (money outside a retirement account), and is not part of any IRA or employer plan.
- Because a qualified annuity is funded with pre-tax money, every dollar of each payment is fully taxable as ordinary income when received — the same as a typical pension payment (already stated elsewhere on this page).
- Because a non-qualified annuity is funded with after-tax money, only the earnings portion of each payment is taxable; the IRS's exclusion ratio splits each payment into a tax-free return of the original principal and a taxable earnings portion (already stated elsewhere on this page).
- A qualified annuity held inside a Traditional IRA or 401(k) is subject to that account's required minimum distribution (RMD) rules, starting at age 73, the same as any other Traditional IRA or 401(k) asset (already stated for Traditional IRAs elsewhere on this site). A non-qualified annuity, since it is not part of a retirement account, is not subject to IRA or 401(k) RMD rules — though the insurance contract itself may set its own payout schedule under its terms.
- A qualified annuity's contribution is limited by whatever IRA or employer-plan contribution limit applies to the account it sits inside; a non-qualified annuity has no IRS contribution limit, since it is not a retirement account at all.
- Both qualified and non-qualified annuities generally apply the IRS's 10% early-withdrawal penalty on the taxable portion of a withdrawal taken before age 59½, in addition to any insurer surrender charge during the contract's surrender period (already stated elsewhere on this page for annuities generally).

Anything not on this list, you do not know. Never invent a specific insurer's surrender-charge schedule, a specific contribution limit dollar figure, or a specific exclusion-ratio percentage; direct the reader to IRS Topic 410 and their own IRA/401(k) plan documents for their exact numbers.

## THE CLOSED URL LIST — the only external hrefs allowed

- https://www.irs.gov/taxtopics/tc410
- https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs

## Internal links this section may use (real routes only)

- [Annuity vs CD](/compare/annuity-vs-cd/)
- [Retirement calculator](/retirement/)

## What the section must cover

1. Direct answer, first sentence: the difference is where the money that funds the annuity came from — pre-tax retirement money makes it "qualified," already-taxed money makes it "non-qualified" — and that single fact drives everything else about how it's taxed and regulated.
2. A short comparison, as an inline GFM markdown table (pipe table, at least 3 rows, a real value in both columns) covering: funding source (pre-tax retirement money vs. after-tax money), how payments are taxed (fully taxable vs. only the earnings portion via the exclusion ratio), and RMD applicability (subject to IRA/401(k) RMD rules at 73 vs. not subject to those rules).
3. Cover the contribution-limit difference (tied to the IRA/plan limit vs. no IRS limit) and the shared 10%-early-withdrawal-penalty-plus-surrender-charge risk before 59½.
4. A short verdict: a qualified annuity fits money already inside an IRA or 401(k) that a saver wants converted into guaranteed income; a non-qualified annuity fits money outside a retirement account that a saver wants to annuitize without the RMD and contribution-limit constraints of a qualified account.

Output: markdown only, one `## ` heading line followed by the prose (include the inline pipe table inside the section content). No H1. Do not repeat the page's existing pension-vs-annuity guarantee/backstop argument — reference the existing tax-treatment sentence in one line at most and move straight to the qualified-vs-non-qualified-specific material.
