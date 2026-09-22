# ROW PROMPT — gift-tax-limit-2026 (guide page, ModernWallet / themodernwallet.com)

## PAGE
- route: /guides/gift-tax-limit-2026/
- slug: gift-tax-limit-2026
- page type: guide (JSON object for `src/data/guides.ts`)
- depth floor: 1200 words minimum across introText + sections + faqs
- updated date to use where the schema needs one: 2026-09-22

## KEYWORDS + INTENT
- primary keyword: gift tax limit 2026
- secondary keywords (DataForSEO volume, US): gift tax (14,800/mo); gift tax limit 2026 (9,900); 2026 gift tax exemption (6,600); annual gift tax exclusion 2026 (6,600); lifetime gift tax exemption (5,400); how much can you gift tax free (3,600); max gift tax (2,900); gift tax exclusion 2026 (5,400)
- intent: Lookup intent - the reader wants the actual 2026 numbers and whether a specific gift they are considering triggers tax. Every real PAA below is a scenario question, so the page must answer in dollars, not abstractions.

## SERP EVIDENCE (live read, DataForSEO)
Live SERP (DataForSEO, 2026-09-21): verdict winnable. Page one = irs.gov (x2), jacksonhewitt.com, fidelity.com, nelsonmullins.com, adamsbrowncpa.com, farmoffice.osu.edu, schwab.com, merceradvisors.com, westernunion.com. AI Overview present, citing irs.gov, fidelity.com, adamsbrowncpa.com, farmoffice.osu.edu, westernunion.com, nepwealth.com, merceradvisors.com. Related searches: gift tax limit 2026 lifetime; gift tax limit 2026 married; gift tax rate 2026; how to avoid gift tax; lifetime gift tax exemption sunset. AEO REQUIREMENT: the first sentence of introText must state the 2026 annual exclusion and the lifetime exemption together, extractably.

## FAQ SPEC — use these REAL People-Also-Ask questions, verbatim as the `faqs[].question` values
  1. Do I have to worry about the gift tax if I give my son $75,000 toward a down payment?
  2. Can I give my daughter $50,000 tax-free?
  3. Can you gift someone $100,000 tax-free?
  4. How does the IRS know if you give a gift?
  5. How to gift money to a child without paying taxes?
  6. Can I transfer $50,000 to a family member?
Answer each in 2-4 sentences, concretely, from the fact list only. Do not invent additional FAQ questions.

## SECTION COVERAGE (each becomes one `sections[]` entry; noun-phrase Title Case headings; at most ONE heading may open with the primary keyword)
1. The 2026 numbers up front: $19,000 annual exclusion per donee, $38,000 for a married couple splitting gifts, $15,000,000 lifetime exemption per person ($30M per couple), 40% top rate above it, $194,000 for a non-citizen spouse, unlimited to a US-citizen spouse.
2. Exclusion vs exemption - the single most-confused distinction. Annual exclusion resets every year and does not touch the exemption; anything above it draws down the lifetime exemption and is tracked on Form 709.
3. Worked scenarios answering the real PAA questions in dollars: the $75,000 down-payment gift to a son, $50,000 to a daughter, $100,000 to one person, and the married-couple split-gift version of each. Show exactly how much (if any) exemption is consumed and that the tax owed is almost always $0.
4. When you actually OWE gift tax (only after $15M of lifetime taxable gifts) versus when you merely FILE. Link /guides/form-709-gift-tax-return/.
5. Gifts that are never taxable at all: direct tuition and medical payments made to the institution, gifts to a US-citizen spouse, gifts to qualifying charities.
6. How the IRS finds out (Form 709 filings, the cumulative running total, estate tax return reconciliation at death, third-party reporting on large transfers) - factual, no speculation.
7. 2025 vs 2026 in one short paragraph (the exemption rose to $15M for 2026; the annual exclusion stayed at $19,000) and what "permanent and indexed" under OBBBA means.
8. Why the wealthy use GRATs to move money without spending the exemption - short, links /guides/what-is-a-grat-trust/ and /guides/slat-trust-explained/, and notes the WSJ-reported IRS challenge (attributed, hedged, pending).
9. Estate tax connection and pointer to /estate-planning/estate-tax-calculator/.

## INTERNAL LINKS YOU MAY USE (exact paths — no others, never invent one)
- /guides/advanced-estate-planning-strategies/ — the site's advanced estate planning pillar (QPRT, FLP, GRAT, IDGT, ILIT)
- /guides/first-time-estate-planning/ — estate planning basics (will, living trust, beneficiary forms)
- /guides/trust-tax-rates-explained/ — how trusts are taxed, grantor vs non-grantor
- /compare/revocable-vs-irrevocable-trust/ — revocable vs irrevocable comparison
- /compare/living-trust-vs-will/ — living trust vs will comparison
- /compare/irrevocable-trust-vs-llc/ — irrevocable trust vs LLC comparison
- /estate-planning/ — the estate planning hub + calculator
- /estate-planning/estate-tax-calculator/ — federal + state estate tax exposure calculator
- /estate-planning/living-trust-cost-calculator/ — trust cost calculator
SIBLING PAGES SHIPPING IN THIS SAME RUN (safe to link):
- /guides/what-is-a-grat-trust/ — what a GRAT is and how it works
- /guides/rolling-grat-strategy/ — rolling and zeroed-out GRATs
- /guides/gift-tax-limit-2026/ — 2026 gift tax limits and the lifetime exemption
- /guides/form-709-gift-tax-return/ — filing the gift tax return
- /guides/intentionally-defective-grantor-trust-idgt/ — IDGT explainer
- /guides/slat-trust-explained/ — SLAT explainer
- /compare/grat-vs-idgt/ — GRAT vs IDGT comparison
- /compare/grat-vs-slat/ — GRAT vs SLAT comparison
(Do NOT link a page to itself.)

## `tools` FIELD (guide pages only)
Pick 2-3 from: /estate-planning/, /estate-planning/estate-tax-calculator/, /estate-planning/living-trust-cost-calculator/, plus at most one sibling guide route from the list above. Use the exact href and a short human label.

## SOURCES
Populate `sources` with 3-5 entries drawn ONLY from the closed URL list below. Label them plainly (e.g. "IRS — Section 7520 interest rates"). The Wall Street Journal report is named in prose and is NEVER added to `sources` (no URL is on the allowed list).

# CLOSED FACT LIST — shared core (2026 figures, verified 2026-09-22)

**Anything not on this list (or on the page-specific list in your row prompt), you do not know.** Do not add a statistic, rate, dollar figure, deadline, case name, or quote that is not written here. If a number would help but is not listed, describe the mechanic in words and tell the reader to check the linked primary source.

## 2026 federal transfer-tax figures
- Annual gift tax exclusion 2026: **$19,000 per donee**. A married couple who elect to split gifts can give **$38,000** per donee. Gifts at or under the annual exclusion do not use lifetime exemption and generally require no gift tax return.
- Annual exclusion for gifts to a **non-US-citizen spouse** in 2026: **$194,000**.
- Lifetime gift and estate tax exemption 2026: **$15,000,000 per individual** ($30,000,000 for a married couple using portability). Made permanent and indexed to inflation by the **One Big Beautiful Bill Act (P.L. 119-21, signed July 2025)**, which amended **IRC §2010(c)(3)**.
- Federal estate tax rate on amounts above the exemption: **flat 40%**. The gift tax rate schedule also tops out at **40%**.
- Gifts to a **US-citizen spouse** are unlimited and tax-free (unlimited marital deduction, IRC §2523).
- Form 706 (estate tax return) is due **9 months after death**, with a 6-month extension available.

## Section 7520 rate
- The **Section 7520 rate** (the "hurdle rate") is published **monthly** by the IRS and equals **120% of the applicable federal midterm rate, compounded annually**.
- The Section 7520 rate for **September 2026 is 5.40%**.
- Because it changes every month, a GRAT is locked to the rate for the month it is funded. **Never state a 7520 rate without naming its month**, and always tell the reader to check the current IRS table.
- Statutory basis: **IRC §7520**.

## GRAT mechanics (statutory)
- A **grantor retained annuity trust (GRAT)** is an irrevocable trust into which the grantor transfers assets and retains the right to a fixed **annuity** payment for a set **term of years**. Whatever remains in the trust at the end of the term passes to the remainder beneficiaries.
- The annuity must be paid **at least annually**. Governing rules: **IRC §2702** and **Treas. Reg. §25.2702-3** (qualified interests).
- The taxable gift at funding equals the value transferred **minus** the actuarial value of the retained annuity, computed using the Section 7520 rate for the funding month.
- A **"zeroed-out" GRAT** sets the annuity so the remainder interest's actuarial value is at or near zero, producing a taxable gift at or near **$0** and using little or no lifetime exemption.
- If the trust assets grow **faster** than the Section 7520 rate over the term, the excess growth passes to the beneficiaries outside the gift and estate tax system. If they grow **slower**, the assets simply return to the grantor through the annuity payments and the strategy produces no transfer — the loss is the legal and administrative cost, not the principal.
- **Mortality risk:** if the grantor dies **during** the GRAT term, some or all of the trust assets are pulled back into the grantor's taxable estate under **IRC §2036**, and the strategy produces no estate tax benefit.
- A GRAT is a **grantor trust** for income tax purposes: the **grantor** pays the income tax on the trust's income during the term.
- GRAT terms commonly run **two to ten years**.

## Rolling / zeroed-out GRAT practice
- A **rolling GRAT** strategy uses a series of short (commonly two-year) GRATs, with each annuity payment received back from one GRAT re-funding a new one, rather than one long GRAT.
- Rationale: a short term reduces mortality exposure per trust, and a losing period only wastes that one GRAT rather than the whole plan.

## The 2026 IRS enforcement story (source: The Wall Street Journal, "The IRS Is Cracking Down on a Favorite Way the Ultrawealthy Pass On Money," Ashlea Ebeling, September 21, 2026)
**⚠️ ATTRIBUTION AND HEDGING ARE MANDATORY FOR EVERY ITEM IN THIS SECTION.** Attribute in the text as "as reported by The Wall Street Journal" or "according to a September 2026 Wall Street Journal report". There is **no linkable URL** for this source on the allowed list, so it is named in prose and is **never** added to `sources`.
- The IRS is asserting a **$736 million gift tax bill** against **Chuck and Trisha Elcan of Nashville, Tennessee**, over GRATs that held shares of **HCA Healthcare**.
- The couple are **disputing** the assessment in **U.S. Tax Court**. The case is **pending and unresolved**.
- **YOU MAY NOT WRITE** that the IRS "won", that a court has ruled, that GRATs are illegal or disallowed, or that this case changes the law. The only accurate framing is: the IRS is challenging how these particular GRATs were operated, and the taxpayers dispute it.
- The IRS's claim is that the couple "made missteps" with the GRATs. The couple say the tactics are valid and routinely used by others.
- Their lawyer, **John Porter**, said the IRS position "produces a draconian result".
- Trisha Elcan's father and grandfather helped co-found HCA in **1968**.
- **Mike Kaercher**, deputy director of the **Tax Law Center at New York University**, described GRATs as "largely no-regrets planning": "If your GRAT doesn't work, you just throw your assets into a new GRAT and try again."
- **Lauren Wagner**, a tax partner at **Armanino Advisory**, on repeated GRATs: "you're going to have winning years and losing years, and you hope you come out ahead."
- The **Biden administration** proposed cracking down on trust maneuvers including GRATs, estimating **$84 billion** of savings over a decade. **Those legislative efforts did not pass**; interest in GRATs has since increased.
- **Louis Laski**, a former private-wealth lawyer and co-founder of **GRATtrack**, estimated that **$1 million of Amazon.com stock placed in two-year rolling GRATs ten years ago would have pushed about $4.5 million to beneficiaries** free of gift and estate tax, despite Amazon's 2022 decline. **This is one practitioner's estimate reported by the WSJ, not a measured or guaranteed result** — say so whenever you use it, or omit it.
- The $15 million lifetime exemption is the figure the WSJ story cites as what GRAT users are trying to avoid spending.

## IDGT mechanics
- An **intentionally defective grantor trust (IDGT)** is an irrevocable trust drafted so that it is **outside** the grantor's estate for estate tax purposes but **is** a grantor trust for income tax purposes under the grantor trust rules at **IRC §§671–679** — hence "defective".
- The typical transaction is an **installment sale** of assets to the trust in exchange for a **promissory note**, rather than an outright gift.
- The trust is usually funded first with a **seed gift** so it has assets of its own; a seed of roughly **10% of the value sold** is a common planning convention, **not a statutory requirement** — always label it as convention.
- Because the trust is a grantor trust, the **sale itself is not an income-taxable event** (Rev. Rul. 85-13), and the **grantor's payment of the trust's income tax is not treated as an additional gift** (Rev. Rul. 2004-64) — an additional transfer of value that does not consume exemption.
- Assets in an IDGT do **not** receive a step-up in basis at the grantor's death, because they are outside the estate.
- An IDGT works over a **long** horizon and carries no fixed term; a GRAT works over a **short, fixed** term.

## SLAT mechanics
- A **spousal lifetime access trust (SLAT)** is an irrevocable trust one spouse (the donor) creates for the benefit of the other spouse, often with children as additional beneficiaries.
- Funding a SLAT **uses the donor's lifetime exemption** (it is a completed gift). The point is to lock in exemption while keeping **indirect** access through the beneficiary spouse.
- A SLAT is typically a **grantor trust**: the donor spouse pays the income tax on the trust's income.
- **Risks:** divorce (access runs through the spouse), the death of the beneficiary spouse (access ends), and the **reciprocal trust doctrine**, under which two nearly identical SLATs created by each spouse for the other can be unwound and pulled back into the estates.

## Form 709
- **Form 709** is the **United States Gift (and Generation-Skipping Transfer) Tax Return**.
- A return is generally required when a person gives **more than the annual exclusion** to any one donee in a year, when spouses elect to **split gifts**, or when a gift is of a **future interest** (which does not qualify for the annual exclusion at all).
- Form 709 is generally due **April 15 of the year following the gift**, and an extension of the income tax return generally extends the Form 709 deadline as well.
- Filing a Form 709 usually results in **no tax owed** — the gift instead draws down the lifetime exemption, which the return tracks cumulatively year over year.
- Gifts of a **present interest** at or under the annual exclusion generally do not require a return.
- Funding a GRAT or a SLAT is a reportable transfer that requires a Form 709 for the year of funding.

## Cost and professional-help framing
- Attorney fees for a single irrevocable trust commonly run **$2,500 to $10,000 or more**; a multi-trust or entity plan runs higher. This is a **range** drawn from this site's existing advanced estate planning guide — always present it as a range and as typical, never as a quote.
- None of these structures are DIY. Every one requires an estate planning attorney to draft, and most require a CPA (irrevocable trusts file their own returns) and a financial advisor.

## Hard prohibitions
- **No fabricated numbers.** No invented volumes, growth rates presented as expected returns, case outcomes, state-specific rules, or dates.
- **No legal or tax advice.** Present general information and tell the reader to work with a licensed estate planning attorney and CPA.
- **No claim that a strategy is guaranteed, risk-free, or IRS-proof.**
- Any illustration you build (e.g. "a $5 million transfer at a 5.4% hurdle over 2 years") must be explicitly labelled a **hypothetical illustration**, use the September 2026 rate with its month named, and state that real results depend on the rate for the funding month and actual asset performance.

