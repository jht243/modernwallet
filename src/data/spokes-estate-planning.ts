import type { SpokeEntry } from "./types";

// Estate Planning spokes. Legal pillar (attorney-reviewer byline + LegalDisclaimer).
// Powered by src/lib/estate-planning-hub.ts + per-spoke engines (will-cost, living-trust-cost,
// estate-tax, prenup-cost). Grounded in IRS Rev. Proc. estate/gift tax figures, state DOR pages,
// state statute compilations (probate + prenup), and Uniform Law Commission adoption data.
// Per-page keyword-gap-pass Phase 3 authoring + Phase 4 audit.

export const ESTATE_PLANNING_SPOKES: SpokeEntry[] = [
  {
    calculator: "estate-planning",
    slug: "will-cost-calculator",
    islandId: "will-cost",
    title: "Estate Planning & Will Cost Calculator — 2026 State Prices",
    metaDescription:
      "See the real cost of estate planning and an estate planner: wills run $300 to $7,500+ attorney-drafted, or as low as $99 online. Free state calculator.",
    targetKeyword: "will cost calculator",
    estimatedVolume: 6400,
    estimatedKD: 38,
    h1: "Will Cost Calculator: Attorney vs Online, by State",
    introText:
      "A will cost calculator shows how much a last will and testament actually costs based on your state, the complexity of your situation, and whether you use an attorney or an online service. The calculator above applies a state cost multiplier to the 2026 national attorney benchmark from the Legaltemplates 909-firm study: $300 to $800 for a simple will, $750 to $2,500 for a moderate will, and $2,500 to $7,500+ for a complex will. In Texas, a moderate-complexity will with a durable power of attorney and healthcare directive costs roughly $1,000 to $3,200 when attorney-drafted, or $199 to $299 through Trust & Will's couple plan.",
    howItWorks:
      "Will costs move on three dimensions: state cost of living, complexity of your situation, and whether you use an attorney or an online service.\n\nState cost matters because attorney rates track local hourly rates. California, New York, Hawaii, and Massachusetts run 1.20 to 1.35 times the national baseline; the Deep South and Plains states run 0.85 to 0.95 times. The calculator above applies a specific multiplier for every state so you're not looking at a national average that doesn't match your zip code.\n\nComplexity has three tiers grounded in the Legaltemplates 2026 study of 909 estate-planning firms. A simple will (single, standard heirs, one state) runs $300 to $800 attorney-drafted. A moderate will (married with kids, guardian nomination, some specific bequests) runs $750 to $2,500. A complex will (blended family, business interests, out-of-state property, testamentary trust for kids) runs $2,500 to $7,500+. Roughly 94% of estate-planning firms bill flat fees for wills; hourly billing ($150 to $450/hr) shows up mostly for complex cases and specialists in major metros.\n\nOnline is meaningfully cheaper. FreeWill is $0 (monetized via nonprofit partnerships). LegalZoom Basic Will is $129 individual / $229 couple. Trust & Will is $199 individual / $299 couple, or $499/$599 with a revocable living trust. Nolo Quicken WillMaker & Trust is $99 Starter / $139 Plus / $209 All Access, and Mama Bear Legal Forms is $159 individual / $249 couple with POA and HIPAA release included. Online tools handle simple and moderate cases with clear facts; attorney-drafted becomes worth it for blended families, business interests, cross-state real estate, or anything requiring a testamentary trust with age-based distributions.\n\nOne state-specific trap most articles miss: Louisiana requires a notarial testament — 2 witnesses AND a notary at execution under La. Civ. Code art. 1577. Online tools that skip the notary won't produce a valid Louisiana will. Colorado and North Dakota are the only two states where notarization can substitute for witnesses (C.R.S. §15-11-502(2); N.D.C.C. §30.1-08-02); everywhere else requires two witnesses regardless. About 27 states also recognize holographic (handwritten, unwitnessed) wills as a fallback, but attorney-drafted or online wills with two witnesses plus a self-proving affidavit remain the standard for enforceability. Once you have your will priced, run through the full plan tier with our [estate planning calculator](/estate-planning/) — a will is one piece; the powers of attorney and healthcare directives are the other three.",
    commonMistakes: [
      "Assuming national-average pricing applies in your state. California, New York, and Massachusetts attorneys charge 20-35% above the national baseline; low-cost states run 5-15% below. Use a state-specific number when budgeting.",
      "Skipping the durable power of attorney and healthcare directive. These are $250 to $700 additional attorney-drafted, or bundled free with most online will packages — and without them, incapacity (not death) triggers a court-appointed guardianship instead of your named agent.",
      "Trying to DIY a will with a testamentary trust for minor kids. Online tools handle basic guardian nominations well, but a trust with age-based distributions and a named trustee benefits from attorney review.",
      "Executing a Louisiana will without a notary. Louisiana requires a notarial testament (2 witnesses + notary); online-only signing won't produce a valid Louisiana will.",
      "Skipping the self-proving affidavit. Available in 48 states + DC, it lets the will be probated without calling the witnesses to court — a real time and cost savings your executor will thank you for.",
      "Not updating after major life events. A will after marriage/divorce/birth/death should be revised, not just filed away. Revisions cost far less than the original ($150 to $500 attorney-drafted).",
    ],
    workedExample:
      "Take the calculator's default: a Texas married couple with kids wanting a moderate-complexity will plus a durable power of attorney and an advance healthcare directive. Texas's cost multiplier is 1.00 (national baseline). Attorney-drafted moderate will: $750 to $2,500. Durable power of attorney: $150 to $400. Healthcare directive with HIPAA release: $100 to $300. Total range: $1,000 to $3,200. The online alternative for the same package: Trust & Will's couple plan at $299 (includes POA and healthcare directive), LegalZoom Basic couple at $229, or Nolo WillMaker Plus at $139. Texas follows the standard two-witness execution rule and offers a self-proving affidavit, so any of these attorney-drafted or online paths produces a valid, probate-ready will if the witnesses sign at the same time.",
    faqs: [
      {
        question: "What is a will cost calculator?",
        answer:
          "A will cost calculator estimates the price of a last will and testament based on your state, the complexity of your situation, and whether you use an attorney or an online service. The calculator above applies a state-specific cost multiplier to national attorney benchmarks and lists the online alternatives that fit your complexity tier. It also flags state-specific execution rules — like Louisiana's notarial testament requirement or Colorado's notarization-instead-of-witnesses option — that affect which path is even valid in your state.",
      },
      {
        question: "How much does a simple will cost?",
        answer:
          "A simple will (single person, standard beneficiaries, one state) costs $300 to $800 attorney-drafted at national-baseline rates, per the 2026 Legaltemplates study of 909 estate-planning firms. Online, FreeWill is $0, LegalZoom Basic is $129, Nolo Quicken WillMaker Starter is $99, and Trust & Will individual is $199. In high-cost states (California, New York, Massachusetts) the attorney range shifts to $400 to $1,100 with the state multiplier.",
      },
      {
        question: "How much does a will with a lawyer cost?",
        answer:
          "Attorney-drafted wills run $300 to $7,500+ depending on complexity: simple $300 to $800, moderate (married with kids, guardian nomination, specific bequests) $750 to $2,500, and complex (blended family, business interests, testamentary trust) $2,500 to $7,500+. About 94% of estate-planning firms use flat fees for wills. Hourly rates run $150 to $450/hr — reserved mostly for complex cases and specialists in major metros. State cost of living shifts the range 15-35% up or down.",
      },
      {
        question: "Are online wills legally binding?",
        answer:
          "Yes, if executed correctly. An online will produced by a service like Trust & Will, LegalZoom, or Nolo is legally binding when signed with the state's required formalities — typically two witnesses present at execution, and (for a self-proving affidavit) a notary. FreeWill is a fully valid last will and testament for simple and moderate cases in every state. The trap is execution: printing the document and signing without witnesses in the required manner voids the will. Follow the state-specific instructions the service provides at signing.",
      },
      {
        question: "How much does a will cost in California, Texas, or New York?",
        answer:
          "State cost multipliers: California and New York run 1.35× the national baseline (moderate will attorney-drafted: $1,000 to $3,400), Texas runs 1.00× ($750 to $2,500), Florida 1.00× ($750 to $2,500), Massachusetts 1.25× ($935 to $3,125), and low-cost states like Mississippi and Alabama run 0.85× ($640 to $2,125). Online pricing is the same everywhere — Trust & Will $199/$299, LegalZoom Basic $129/$229. For a will in California specifically, keep the state's independent-counsel rules and holographic-will recognition in mind.",
      },
      {
        question: "Do I need a power of attorney and healthcare directive with my will?",
        answer:
          "Yes. A will only takes effect at death — a durable power of attorney handles finances and a healthcare directive handles medical decisions during any incapacity BEFORE death. Attorney-drafted, they add $250 to $700 to a will package ($150 to $400 for the POA, $100 to $300 for the healthcare directive with HIPAA release). Most online will services (Trust & Will, LegalZoom, Nolo, FreeWill, Mama Bear) include both in their base package at no additional cost. Skipping them means a court-appointed guardian instead of your named agent if incapacity strikes.",
      },
      {
        question: "How does a will's cost compare to a living trust?",
        answer:
          "A will is cheaper upfront: $300 to $7,500+ attorney-drafted (or as low as $99 online), versus $1,500 to $5,000+ for a revocable living trust ($499–$599 online). The tradeoff is what happens at death — a will goes through public probate court, while a trust's assets bypass probate entirely. Our [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) breaks down trust pricing, and [living trust vs will](/compare/living-trust-vs-will/) covers the full probate-cost, privacy, and multi-state-property tradeoffs side by side.",
      },
    ],
    sources: [
      { label: "Legaltemplates 2026 — 909-firm estate planning cost study", url: "https://legaltemplates.net/resources/estate-planning/cost-of-estate-planning/" },
      { label: "Nolo — How Much Will a Lawyer Charge to Write Your Will?", url: "https://www.nolo.com/legal-encyclopedia/how-much-will-lawyer-charge-write-your-will.html" },
      { label: "National Council on Aging — Estate Planning Cost Guide", url: "https://www.ncoa.org/article/how-much-does-estate-planning-cost-understanding-legal-fees-and-expenses/" },
      { label: "Uniform Law Commission — Uniform Probate Code", url: "https://www.uniformlaws.org/committees/community-home?CommunityKey=a539920d-c477-44b8-84fe-b0d7b1a4cca8" },
      { label: "Cornell Legal Information Institute — Holographic will", url: "https://www.law.cornell.edu/wex/holographic_will" },
      { label: "Florida Bar — Consumer Pamphlet: Your Legal Rights and Responsibilities", url: "https://www.floridabar.org/public/consumer/pamphlet003/" },
    ],
    toolHeading: "Estimate your will cost",
    toolSubheading: "Pick your state and complexity — see attorney and online cost ranges side by side.",
    preset: {
      state: "texas",
      complexity: "moderate",
      useAttorney: true,
      includePOA: true,
      includeHealthcareDirective: true,
    },
    relatedSlugs: ["living-trust-cost-calculator"],
    // 50 state subpages populated in follow-on slice via src/data/state-overrides.ts
    stateVariants: [
      "alabama", "alaska", "arizona", "arkansas", "california",
      "colorado", "connecticut", "delaware", "florida", "georgia",
      "hawaii", "idaho", "illinois", "indiana", "iowa",
      "kansas", "kentucky", "louisiana", "maine", "maryland",
      "massachusetts", "michigan", "minnesota", "mississippi", "missouri",
      "montana", "nebraska", "nevada", "new-hampshire", "new-jersey",
      "new-mexico", "new-york", "north-carolina", "north-dakota", "ohio",
      "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
      "south-dakota", "tennessee", "texas", "utah", "vermont",
      "virginia", "washington", "west-virginia", "wisconsin", "wyoming",
    ],
  },

  {
    calculator: "estate-planning",
    slug: "living-trust-cost-calculator",
    islandId: "living-trust-cost",
    title: "Living Trust Cost Calculator: RLT, ILIT & Dynasty Trusts",
    metaDescription:
      "Free calculator: revocable living trust, ILIT, MAPT, and dynasty trust setup costs by state — plus attorney vs. online pricing.",
    targetKeyword: "living trust cost calculator",
    estimatedVolume: 4900,
    estimatedKD: 36,
    h1: "Living Trust Cost Calculator: RLT, ILIT, and Irrevocable Trusts",
    introText:
      "A living trust cost calculator breaks down what a revocable living trust, ILIT, Medicaid Asset Protection Trust, or dynasty trust actually costs, including attorney fees, online alternatives, and trust funding. The calculator above applies a state cost multiplier to the 2026 national benchmarks: $1,500 to $5,000 typical for an attorney-drafted revocable living trust, or $5,000 to $10,000+ in California/for HNW; $2,500 to $4,000 for an ILIT; $3,000 to $6,000 for a MAPT; and $5,000 to $10,000+ for a dynasty trust. For a moderate California revocable living trust with one property to retitle, the range lands at roughly $3,375 to $6,750 attorney-drafted, or $599 through Trust & Will's couple plan.",
    howItWorks:
      "Living trust costs depend on the type of trust, the state cost of living, and whether you include trust funding (retitling deeds and accounts).\n\nRevocable living trusts are the standard probate-avoidance tool. Attorney cost: $1,500–$3,000 simple, $2,500–$5,000 moderate, $4,000–$8,000+ complex — with California, New York, and other high-cost metros running 20–35% above the national baseline. Online: Nolo Quicken WillMaker Plus $139 (includes an RLT template), LegalZoom Living Trust ~$279, Trust & Will $499 individual / $599 couple. A revocable living trust does NOT reduce estate tax and does NOT protect assets from creditors — it purely avoids probate.\n\nIrrevocable trusts serve tax or asset-protection goals. An ILIT (Irrevocable Life Insurance Trust) removes a life insurance policy's death benefit from the taxable estate — $2,500–$4,000 attorney-drafted; DIY is not appropriate. A Medicaid Asset Protection Trust (MAPT) shields assets from a future long-term-care spend-down — $3,000–$6,000 typical; requires the 5-year Medicaid lookback (transfers within 5 years of applying for Medicaid disqualify you for a penalty period). Dynasty trusts move wealth across generations and skip generation-skipping tax — $5,000–$10,000+ and require specific state law (Delaware, South Dakota, Nevada, and Wyoming lead here because they abolished the rule against perpetuities).\n\nTrust funding is the step everyone forgets. A trust doesn't work until you retitle assets into it: deed recording $50–$150 per property (attorney costs $200–$500 per deed with the state multiplier), retitle brokerage/bank accounts $300–$1,500, and update beneficiary designations on retirement accounts and life insurance. Fund the trust or it's just a piece of paper. See the full plan tier with our [estate planning calculator](/estate-planning/) — and if your net worth includes retirement accounts, the [401(k) calculator](/retirement/401k-calculator/) shows how beneficiary designations override the trust for those assets.\n\nHow much does a living trust avoid in probate cost? A lot. Compare the trust setup to what probate would cost the estate at death: California's Cal. Prob. Code §10810 statutory schedule alone (before adding executor commission under §10800) charges $18,000 in attorney fees on a $750,000 estate. Both the attorney AND executor each get the same percentage, roughly doubling the total. The [probate fee calculator](/probate/fee-calculator/) shows the exact numbers for your state and estate value — for any middle-class-or-larger estate, the trust math wins by tens of thousands of dollars plus 12+ months of settlement time.\n\nMedicaid Asset Protection Trusts specifically need coordination with elder-care projections. The [Medicaid spend-down calculator](/elder-care/medicaid-spend-down-calculator/) shows your state's actual asset limits, CSRA thresholds, and home equity cap so you can size the MAPT to the gap that would otherwise be spent down. The [long-term care cost calculator](/elder-care/long-term-care-cost-calculator/) projects the shortfall the MAPT is trying to protect against. Both should be run before drafting an irrevocable trust — the 5-year lookback under 42 U.S.C. §1396p(c) means the timing decision is as important as the trust structure.",
    commonMistakes: [
      "Skipping trust funding. A revocable living trust that hasn't been funded (deed recorded, accounts retitled) provides zero probate protection at death — the trust just sits empty. Fund it now or it's decorative.",
      "Assuming a revocable trust saves estate tax. It doesn't. A revocable trust is a probate-avoidance tool; the assets remain in your taxable estate. Only irrevocable trusts move assets out of the taxable estate.",
      "Missing the Medicaid 5-year lookback. Transfers into a MAPT within 5 years of applying for Medicaid trigger a penalty period. Plan MAPT funding at least 5 years before any anticipated long-term-care need.",
      "Trying to DIY an irrevocable trust. ILIT, MAPT, and dynasty trusts require attorney-drafted documents — the wrong language can void the tax or asset-protection benefit or unintentionally trigger a taxable gift.",
      "Forgetting community property funding. In community property states (AZ, CA, ID, LA, NV, NM, TX, WA, WI), a joint trust preserves community-property basis-adjustment status for both halves at the first spouse's death (IRC §1014(b)(6)) — separate trusts lose that benefit. In common-law states, or for blended families with separate beneficiaries, couples often choose two separate trusts instead, for cleaner control over each spouse's own property.",
      "Not updating beneficiary designations. 401(k), IRA, and life-insurance beneficiary forms override BOTH your will and your trust. Retitling accounts into the trust isn't enough — update the beneficiary form too.",
    ],
    workedExample:
      "Take the calculator's default: a California married couple wanting a moderate-complexity revocable living trust with attorney drafting, including funding of one property. California's 1.35 multiplier applies. Attorney moderate RLT: $2,500 × 1.35 to $5,000 × 1.35 = $3,375 to $6,750. Deed recording × 1: $200 × 1.35 to $500 × 1.35 = $270 to $675. Retitle brokerage/bank accounts: $300 × 1.35 to $1,500 × 1.35 = $405 to $2,025. Total: about $4,050 to $9,450. The Trust & Will couple plan online alternative is $599, but requires you to handle the deed recording and account retitling yourself. Because California is a community property state, the attorney will structure this as a joint trust to preserve the double basis step-up on both spouses' halves at the first death under IRC §1014(b)(6).",
    faqs: [
      {
        question: "How much does a living trust cost?",
        answer:
          "A revocable living trust costs $1,500 to $5,000 attorney-drafted for typical facts, $5,000 to $10,000+ in California and other high-cost metros, or $499–$599 through Trust & Will online (or $139 through Nolo WillMaker Plus). Irrevocable trusts run higher because they're more technical: ILIT $2,500 to $4,000, Medicaid Asset Protection Trust $3,000 to $6,000, dynasty trust $5,000 to $10,000+. Add $500 to $2,000 for trust funding (deed recording, retitling accounts).",
      },
      {
        question: "Living trust vs will — which do I need?",
        answer:
          "A will is enough for most households. You need a revocable living trust when at least one of three facts applies: you own real estate in more than one state (a trust avoids ancillary probate in each state), you want to avoid probate entirely for privacy or speed, or you have a special-needs dependent (paired with a Third-Party Special Needs Trust). A living trust does NOT reduce estate tax — that requires an irrevocable trust. See our [estate planning calculator](/estate-planning/) for a specific recommendation.",
      },
      {
        question: "What is a revocable vs irrevocable trust?",
        answer:
          "A revocable living trust (RLT) can be changed or dissolved by you at any time; you retain full control. Its only purpose is probate avoidance — the assets stay in your taxable estate. An irrevocable trust transfers ownership out of your control (mostly) and can serve tax or asset-protection goals: an ILIT removes life insurance from the taxable estate, a Medicaid Asset Protection Trust shields assets from a future spend-down (5-year lookback applies), and a dynasty trust transfers wealth across generations without generation-skipping tax. Irrevocable trusts require attorney-drafted documents.",
      },
      {
        question: "What's the step-by-step process to set up a living trust?",
        answer:
          "Setting up a living trust follows five steps: (1) consult an estate planning attorney, or choose a DIY/online service, and gather a full list of your assets; (2) draft the trust document and name your successor trustee; (3) sign and notarize the trust, since witness requirements vary by state; (4) fund the trust by retitling deeds and financial accounts into the trust's name; and (5) update beneficiary designations on retirement accounts and life insurance, which pass outside the trust regardless of funding. A pour-over will (see [living trust vs. will](/compare/living-trust-vs-will/)) catches any asset you forget to retitle in step 4, but it still goes through probate before reaching the trust. Funding it correctly the first time is what actually avoids probate.",
      },
      {
        question: "How long does it take to set up a living trust, from consultation to signing?",
        answer:
          "Timeline depends on complexity and whether you use an attorney or an online service. Attorney-drafted trusts take longer: plan on several weeks of back-and-forth as you gather your asset list, review drafts, and schedule signing. Online DIY services can produce a signed-ready trust document in a single sitting. Either path still requires funding afterward (retitling deeds and financial accounts), which takes additional time and isn't included in either estimate.",
      },
      {
        question: "How much does it cost to fund a living trust?",
        answer:
          "Trust funding — retitling deeds and accounts into the trust — costs $500 to $2,000 additional on top of drafting. Each real-estate deed runs $200 to $500 attorney-recorded (or $50 to $150 DIY), and retitling brokerage/bank accounts runs $300 to $1,500 depending on how many institutions are involved. Trust funding is where most DIY living trusts fail — an unfunded trust provides zero probate protection because the assets are still in your name at death. Not every asset belongs in the trust either; our [best estate planning software](/roundup/best-estate-planning-software/) roundup lists the specific assets that should stay out.",
      },
      {
        question: "Does a living trust protect assets from Medicaid?",
        answer:
          "A revocable living trust does NOT protect assets from Medicaid because you still control them — they count as your assets for the spend-down analysis. Only a Medicaid Asset Protection Trust (MAPT) — a specific type of irrevocable trust — can shield assets, and only if you funded it more than 5 years before applying for Medicaid (the federal 5-year lookback under 42 U.S.C. §1396p). Attorney cost is $3,000 to $6,000. DIY is not appropriate for MAPTs.",
      },
      {
        question: "Can I set up a living trust online?",
        answer:
          "Yes, for a revocable living trust with straightforward facts. Trust & Will ($499 individual, $599 couple), LegalZoom Living Trust (~$279), and Nolo Quicken WillMaker Plus ($139, includes RLT template) all produce valid RLTs. These packages draft the trust document itself; funding it (retitling deeds and financial accounts into the trust's name) is typically left to you afterward, regardless of price tier, unless the service explicitly advertises funding assistance. Online is not appropriate for irrevocable trusts (ILIT, MAPT, dynasty), Medicaid planning, blended families with complex distributions, business interests, or cross-state property. Attorney-drafted becomes worth it when the facts stop fitting a fill-in-the-blank template. See [what's bundled in each online trust package](/roundup/best-living-trust-services/) before choosing one.",
      },
      {
        question: "How much does it cost to maintain a living trust after it's set up?",
        answer:
          "A revocable living trust has no mandatory annual fee and needs no separate tax return while you're alive — it's a grantor trust, so it uses your own Social Security number and is reported on your personal Form 1040, unlike an irrevocable trust, which must file its own Form 1041. Ongoing costs are occasional rather than annual: retitling any asset you acquire after the trust is signed (a new house, a refinanced property, a new brokerage account) costs the same $200–$500 per deed or $300–$1,500 per account as the original funding step. An amendment to update beneficiaries or add a provision typically runs $300–$1,000 with an attorney. If you name a corporate trustee instead of a family member, expect an annual fee of roughly 0.5%–1.5% of trust assets — a cost most families avoid by serving as their own trustee while they're able.",
      },
      {
        question: "Who should I name as successor trustee?",
        answer:
          "Your successor trustee should be someone, or an institution, you trust to manage the trust competently and carry out your instructions after you're gone or incapacitated. Most people name an adult child or another trusted family member or friend as their first choice. For complex estates, contentious family situations, or when no individual is a good fit, a corporate or professional trustee is the alternative, at the roughly 0.5%–1.5% annual fee noted above. Whoever you choose, confirm they're willing to serve before you sign the trust.",
      },
      {
        question: "Is a living trust worth the cost?",
        answer:
          "It depends on what probate would otherwise cost your estate. In California, a $750,000 estate faces roughly $36,000 in combined attorney and executor probate fees under Cal. Prob. Code §10810/§10800 — a $1,500–$5,000 trust (or $599 online) pays for itself many times over. For a smaller estate that would qualify for a state's simplified small-estate probate procedure, the trust's main benefit disappears and a will is the better spend. See [is a living trust worth it](/guides/is-a-living-trust-worth-it/) for the full break-even math by state.",
      },
      {
        question: "What is the downside of having a living trust?",
        answer:
          "The main downside is that a revocable living trust does nothing for estate tax or creditor protection, since the assets stay legally yours and remain in your taxable estate while you're alive. The second downside is the funding burden: the trust provides zero probate benefit until you actually retitle deeds and financial accounts into it, a $500–$2,000 step people routinely skip after paying for the document itself. It also adds an upfront cost, $1,500–$10,000+ depending on complexity and state, that a will-only plan doesn't carry. None of these apply to an irrevocable trust, which trades your control for the tax or asset-protection benefit a revocable trust can't provide.",
      },
      {
        question: "What is the \"7-year rule\" for trusts?",
        answer:
          "There is no U.S. federal or state \"7-year rule\" that applies to a revocable or irrevocable living trust the way this question sometimes assumes. The phrase comes from UK inheritance-tax law, where a gift outside a trust generally falls out of the estate after 7 years, and it doesn't carry over to U.S. trust or estate-tax rules. The lookback period that does apply here is Medicaid's 5-year lookback on transfers into a Medicaid Asset Protection Trust, covered above, which is a different rule for a different purpose.",
      },
    ],
    sources: [
      { label: "LegalZoom — Cost to Set Up a Living Trust (2026)", url: "https://www.legalzoom.com/articles/cost-to-set-up-a-living-trust" },
      { label: "Medicaid.gov — Estate Recovery", url: "https://www.medicaid.gov/medicaid/eligibility-policy/estate-recovery/index.html" },
      { label: "IRC §1014(b)(6) — Double basis step-up in community property states", url: "https://www.law.cornell.edu/uscode/text/26/1014" },
      { label: "IRS — Estate Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" },
      { label: "42 U.S.C. §1396p — Medicaid 5-year lookback", url: "https://www.law.cornell.edu/uscode/text/42/1396p" },
      { label: "American College of Trust and Estate Counsel (ACTEC)", url: "https://www.actec.org/" },
    ],
    toolHeading: "Estimate your living trust cost",
    toolSubheading: "Pick your state and trust type — attorney and online costs plus funding, side by side.",
    preset: {
      state: "california",
      trustType: "revocable",
      complexity: "moderate",
      useAttorney: true,
      includeFunding: true,
      numberOfProperties: 1,
    },
    relatedSlugs: ["will-cost-calculator"],
    // 50 state subpages authored in a follow-on session slice.
  },

  {
    calculator: "estate-planning",
    slug: "estate-tax-calculator",
    islandId: "estate-tax",
    title: "Federal + State Estate Tax Calculator: All 50 States, 2026",
    metaDescription:
      "Free estate tax calculator: federal ($15M) + all 12 state + 5 inheritance-tax exposure for 2026, with the exact formula, NY's 105% cliff, and penalty math.",
    targetKeyword: "estate tax calculator",
    estimatedVolume: 8100,
    estimatedKD: 42,
    h1: "Estate Tax Calculator: Federal + State Exposure for 2026",
    introText:
      "This estate tax calculator estimates your federal and state estate tax exposure using the 2026 numbers: a $15,000,000 federal exemption per individual (permanent and indexed under the One Big Beautiful Bill Act, IRC §2010(c)(3)) a flat 40% rate on the excess, and up to $30,000,000 shielded for a married couple through portability.\n\nThe calculator above also includes the 12 state estate taxes and 5 state inheritance taxes still on the books in 2026. For example, an $8.5M estate in New York filing married would owe $0 in federal tax because it falls under the $30M combined exemption. But New York's $7.35M threshold and unique 105% cliff mean the ENTIRE $8.5M is taxed from dollar one at up to 16%, a critical trap most planning tools miss.",
    howItWorks:
      "Estate tax has three layers in 2026: federal, state estate tax, and state inheritance tax.\n\nFederal estate tax is 40% flat on any amount above the exemption. The 2026 exemption is $15M per individual, made permanent and indexed under the One Big Beautiful Bill Act (P.L. 119-21, signed July 2025), which amended IRC §2010(c)(3). Married couples can shield up to $30M by combining exemptions via portability — the surviving spouse elects the deceased spouse's unused exemption on a timely-filed [Form 706](https://www.irs.gov/forms-pubs/about-form-706). The GST tax exemption mirrors at $15M, and the annual gift tax exclusion is $19,000 per donee (non-citizen spouse $194,000).\n\nState estate tax hits at much lower thresholds. Twelve states plus DC impose one in 2026: Oregon starts at $1M (the lowest), Rhode Island at $1.84M (indexed), Massachusetts at $2M, Minnesota and Washington at $3M (Washington's rate resets from 35% to 20% on July 1, 2026), Illinois at $4M, DC at $4.99M, Maryland at $5M (also has inheritance tax), Vermont at $5M, Hawaii at $5.49M, Maine at $7M, New York at $7.35M, and Connecticut at $15M (tied to federal). Rates run 10–20%. New York uniquely applies a 105% cliff: estates over 105% of the exemption are taxed from dollar one, not just the excess — the calculator above flags this explicitly.\n\nNaming the state makes the exposure concrete instead of abstract. California, Texas, and Florida impose no state estate tax at all, so an estate that clears only the federal $15M exemption owes $0 state estate tax in those states no matter how large it is — the federal calculation is the whole story there. Massachusetts and Oregon have the lowest state exemption thresholds in the country: a $3M single-filer estate in Massachusetts (the $2M exemption) has $1M of taxable excess, and the same $3M estate in Oregon (the $1M exemption) has $2M of taxable excess. Washington and Minnesota share a $3M threshold, so a $4M estate in either state has $1M of taxable excess (Washington's rate is also scheduled to reset from 35% to 20% on July 1, 2026, as noted above). Illinois's $4M exemption means a $5M Illinois estate has $1M of taxable excess. Maryland's $5M estate-tax exemption means a $6M Maryland estate has $1M of taxable excess before its separate inheritance tax on non-exempt beneficiaries is even factored in. New York's $7.35M exemption comes with the 105% cliff described above: a $9M New York estate is well past the $7.72M cliff line (105% of $7.35M), so the entire $9M — not just the amount above the exemption — gets taxed from dollar one. The takeaway: run your actual state through the calculator above rather than assuming the federal $15M figure is the only ceiling that applies to you.\n\nState inheritance tax hits beneficiaries directly and depends on relationship, not estate size. Five states impose one in 2026 (Iowa repealed 2025): Kentucky (Class A exempt, Class B exempt in 2026, Class C 6–16%), Maryland (10% flat on non-exempt), Nebraska (1%/11%/15% by class), New Jersey (Class A exempt, Class C 11–16%, Class D 15–16%), and Pennsylvania (0% spouse/minor, 4.5% lineal, 12% sibling, 15% other). Non-lineal beneficiaries (siblings, nieces/nephews, friends, unmarried partners) pay the most.\n\nEstate tax vs inheritance tax, compared directly: estate tax is owed BY the estate itself, calculated on the total value before any distribution, and depends on the size of the estate — the beneficiary's relationship to the decedent doesn't matter. Inheritance tax is owed BY each beneficiary individually, calculated on what that person actually receives, and depends entirely on their relationship to the decedent — a spouse or child often pays 0% while a friend or distant relative can pay 15% or more on the identical inheritance. Maryland is the only state that imposes both. The practical takeaway: if you're the one drafting the estate plan, estate tax is the number that determines whether you need portability and gifting strategies; if you're a named beneficiary in Kentucky, Maryland, Nebraska, New Jersey, or Pennsylvania, inheritance tax is the number that determines what you personally keep, and it can apply even to estates far too small to owe any estate tax at all.\n\nEstate tax planning combines three tools: portability (Form 706 election), lifetime gifting to use the $19,000 annual exclusion, and irrevocable trusts (ILIT for life insurance, dynasty trusts for generational transfers). See the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) for irrevocable trust costs, and the [estate planning hub](/estate-planning/) for the specific plan tier your net worth calls for.\n\nHow estate tax is actually calculated and filed: the taxable estate is gross estate minus allowable deductions, not simply net worth. The marital deduction (IRC §2056) is unlimited for assets passing to a surviving spouse who is a US citizen, which is why many married couples owe $0 federal estate tax at the first death regardless of size. The charitable deduction (IRC §2055) removes the value of any bequest to a qualifying charity from the taxable estate dollar-for-dollar. Administration expenses — executor and attorney fees, court costs, and the decedent's enforceable debts — are deductible under IRC §2053. These deductions, not the exemption alone, are why the taxable estate reported on Form 706 is often well below gross estate value.\n\nForm 706 itself is due 9 months after death, with a 6-month extension available on Form 4768. Filing late without an approved extension triggers a failure-to-file penalty under IRC §6651 of 5% of the unpaid tax per month or part of a month the return is late, capped at 25%, plus a separate failure-to-pay penalty of 0.5% per month (also capped at 25%) and interest that accrues from the original due date. Missing the deadline can also permanently forfeit elections available only on a timely-filed return — including the portability election described above, the alternate-valuation election, and QTIP elections.\n\nIf an error or new information surfaces after Form 706 has already been filed — a late-discovered asset, a corrected appraisal, additional administration expenses — the fix isn't a separate amended-return form. The executor instead files a supplemental Form 706, marked \"Supplemental Information\" at the top with copies of the first four pages of the original return attached, and — if the correction produces an overpayment — requests the refund on Form 843 (Claim for Refund and Request for Abatement) rather than through Form 706 itself.",
    commonMistakes: [
      "Assuming the $15M federal exemption is permanent for you. It is permanent under OBBBA, but portability requires a timely Form 706 filing at the first spouse's death. Missing the deadline (9 months from death, plus 6-month extension) loses the DSUE amount forever.",
      "Ignoring state estate tax. Oregon $1M and Massachusetts $2M thresholds mean many homeowners with retirement accounts and life insurance are exposed even at moderate net worths, while their federal exposure is $0.",
      "Not planning around the New York 105% cliff. Estates just over 105% of the $7.35M exemption owe tax on the entire estate, not just the excess. Bringing the taxable estate below the cliff via gifting can save hundreds of thousands.",
      "Confusing estate tax with inheritance tax. Estate tax is paid BY the estate before distribution; inheritance tax is paid BY beneficiaries based on their relationship. Maryland is the only state with both.",
      "Forgetting life insurance is in the taxable estate. Life insurance death benefits are includable if the decedent held any 'incidents of ownership' (right to change beneficiary, cash out, etc.). An ILIT removes them.",
      "Missing the 3-year rule on ILIT transfers. If you transfer an existing life insurance policy to an ILIT and die within 3 years (IRC §2035(a)), the proceeds are still in your taxable estate. New policies issued directly to the ILIT are cleaner.",
    ],
    workedExample:
      "Take the calculator's default: an $8,500,000 net worth for a married couple in New York. Federal analysis: combined exemption is $15M × 2 = $30M via portability. Taxable estate = max(0, $8.5M − $30M) = $0. Federal tax = $0. State analysis: New York exemption is $7.35M. $8.5M ÷ $7.35M = 1.156 = 115.6% — well above the 105% cliff threshold ($7.35M × 1.05 = $7.72M). Because the estate exceeds 105% of the exemption, the ENTIRE $8.5M is taxed from dollar one at rates up to 16%: roughly $8.5M × 0.16 = $1,360,000 New York estate tax. Total tax: $1.36M. To heirs: $7.14M. The lesson: New York residents just over the cliff should model lifetime gifting or a Qualified Personal Residence Trust (QPRT) to bring the taxable estate below $7.72M.",
    faqs: [
      {
        question: "What is the 2026 federal estate tax exemption?",
        answer:
          "The 2026 federal estate tax exemption is $15,000,000 per individual, made permanent and indexed to inflation by the One Big Beautiful Bill Act (P.L. 119-21, signed July 2025), which amended IRC §2010(c)(3). The rate on the excess is a flat 40%. Married couples can shield up to $30 million by combining exemptions via portability (Form 706 election at the first spouse's death). The GST tax exemption mirrors at $15 million, and the annual gift tax exclusion for 2026 is $19,000 per donee.",
      },
      {
        question: "Which states have their own estate tax in 2026?",
        answer:
          "Twelve states plus DC impose an estate tax in 2026, with exemptions far below the federal $15M: Oregon ($1M — the lowest), Rhode Island ($1.84M, indexed), Massachusetts ($2M), Minnesota ($3M), Washington ($3M with a rate reset from 35% to 20% effective 7/1/2026), Illinois ($4M), DC ($4.99M), Maryland ($5M — also has inheritance tax), Vermont ($5M), Hawaii ($5.49M), Maine ($7M), New York ($7.35M with a 105% cliff), and Connecticut ($15M, tied to federal).",
      },
      {
        question: "What is the New York estate tax cliff?",
        answer:
          "New York's unique 105% cliff means that if your taxable estate exceeds 105% of the state exemption ($7.35M × 1.05 = $7.72M in 2026), the ENTIRE estate is taxed from dollar one at rates up to 16% — not just the excess. This is unlike every other state, where only the excess above the exemption is taxed. New York residents whose estates land just over the cliff can face marginal tax rates above 100% on the amount above the exemption; planning to stay below the cliff (via gifting, QPRTs, or charitable transfers) is often the highest-value estate move for New Yorkers.",
      },
      {
        question: "Which states have inheritance tax in 2026?",
        answer:
          "Five states impose an inheritance tax in 2026 (Iowa fully repealed effective 1/1/2025): Kentucky (Class A exempt, Class B exempt in 2026, Class C 6–16% after $500), Maryland (10% flat on non-exempt beneficiaries), Nebraska (Class 1 immediate family 1% over $100k; Class 2 aunts/uncles 11% over $40k; Class 3 all others 15% over $25k), New Jersey (Class A exempt, Class C 11–16% over $25k, Class D 15–16%), and Pennsylvania (0% spouse/minor, 4.5% lineal, 12% sibling, 15% all other). Non-lineal beneficiaries — siblings, nieces/nephews, friends, unmarried partners — pay the most.",
      },
      {
        question: "How does portability work for married couples?",
        answer:
          "Portability lets a surviving spouse claim the deceased spouse's unused exemption amount (DSUE), effectively combining both spouses' $15M exemptions to shield up to $30M. To claim it, the surviving spouse must file Form 706 (Estate Tax Return) within 9 months of the first spouse's death (with a 6-month extension available), even if no tax is owed. Missing the deadline forfeits the DSUE forever. Portability applies only to the federal exemption — most state estate tax exemptions are NOT portable, so state-level credit-shelter trust planning is still needed.",
      },
      {
        question: "Can I reduce my estate tax?",
        answer:
          "Yes, through five main strategies: (1) portability election on Form 706 to combine spouses' exemptions; (2) the $19,000 annual gift tax exclusion per donee, unlimited donees per year — $228,000/year for a family of 6 donees between two spouses; (3) irrevocable trusts (ILIT for life insurance, dynasty trust for generational transfers, gifting trusts to remove appreciating assets); (4) charitable planning (charitable remainder trusts, private foundations); (5) valuation discounts for closely-held business interests. Above the state exemption threshold, moving to a no-estate-tax state before death is another lever. The [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) shows attorney costs for the irrevocable structures.",
      },
      {
        question: "What deductions reduce a taxable estate on Form 706?",
        answer:
          "The taxable estate is gross estate minus allowable deductions, not net worth. The marital deduction (IRC §2056) is unlimited for property passing to a surviving spouse who is a US citizen. The charitable deduction (IRC §2055) removes charitable bequests dollar-for-dollar. Administration expenses — executor and attorney fees, court costs, and the decedent's enforceable debts — are deductible under IRC §2053. Together these deductions are why a Form 706 taxable estate often runs well below gross asset value, even before the $15M exemption is applied. That unlimited marital deduction doesn't apply when the surviving spouse isn't a US citizen — see [US estate tax for non-citizens](/estate-planning/us-estate-tax-for-non-citizens/) for the $60,000 exemption a nonresident alien gets instead.",
      },
      {
        question: "What is the penalty for filing Form 706 late?",
        answer:
          "Filing Form 706 late without an approved extension (Form 4768, which grants 6 additional months) triggers a failure-to-file penalty under IRC §6651 of 5% of the unpaid tax per month or part of a month late, capped at 25%, plus a separate failure-to-pay penalty of 0.5% per month (also capped at 25%) and interest accruing from the original 9-month due date. Missing the deadline can also permanently forfeit time-sensitive elections — including the portability (DSUE) election, the alternate-valuation election, and QTIP elections — that are only available on a timely-filed return.",
      },
      {
        question: "How do you correct or get a refund on a filed Form 706?",
        answer:
          "There's no separate amended-return form for estate tax. If new information or an error surfaces after Form 706 has been filed, the executor files a supplemental Form 706 — marked \"Supplemental Information\" at the top, with the first four pages of the original return attached — and, if the correction produces an overpayment, requests the refund on Form 843 (Claim for Refund and Request for Abatement) rather than through the 706 itself. Claims tied to items that won't be finalized for years (an ongoing lawsuit, an unresolved administration expense) can instead be preserved with a protective claim on Schedule PC of Form 706.",
      },
      {
        question: "Estate tax vs inheritance tax — what's the actual difference?",
        answer:
          "Estate tax is paid by the estate before any assets are distributed, based on the size of the entire estate, and applies regardless of who inherits. Inheritance tax is paid by each individual beneficiary, based on what they personally receive and their relationship to the decedent — spouses and children are often exempt while more distant heirs pay more. Only Maryland imposes both. A $2M estate in Massachusetts can owe state estate tax with zero inheritance tax involved, while a $50,000 gift to a niece in Nebraska can trigger inheritance tax even though the estate itself is far too small for any estate tax.",
      },
    ],
    sources: [
      { label: "IRS Rev. Proc. 2025-32 — 2026 inflation adjustments (OBBBA)", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" },
      { label: "IRS — Estate Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" },
      { label: "IRS — 2026 inflation adjustments (OBBBA)", url: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" },
      { label: "IRS — Form 706 Instructions", url: "https://www.irs.gov/forms-pubs/about-form-706" },
      { label: "IRS — Portability of the Deceased Spouse's Unused Exemption", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-and-gift-taxes" },
      { label: "IRC §2010(c) — Applicable Credit Amount", url: "https://www.law.cornell.edu/uscode/text/26/2010" },
      { label: "IRC §7345 (Seriously Delinquent Tax Debt) + §2035 (3-year rule for ILIT)", url: "https://www.law.cornell.edu/uscode/text/26/2035" },
    ],
    toolHeading: "Estimate your estate tax exposure",
    toolSubheading: "Enter net worth, filing status, and state — see federal and state exposure with cliff/portability logic.",
    preset: {
      netWorth: 8_500_000,
      state: "new-york",
      filingStatus: "married",
    },
    relatedSlugs: ["will-cost-calculator", "living-trust-cost-calculator"],
    // No state subpages — state selector is inside the tool.
  },

  {
    calculator: "estate-planning",
    slug: "prenup-cost-calculator",
    islandId: "prenup-cost",
    title: "Prenup Cost Calculator: What a Prenup Costs by State",
    metaDescription:
      "Free prenup cost calculator: attorney fees by state for simple, moderate, and complex prenups, plus enforceability rules and independent counsel requirements.",
    targetKeyword: "prenup cost calculator",
    estimatedVolume: 3600,
    estimatedKD: 34,
    h1: "Prenup Cost Calculator: Attorney Fees by State",
    introText:
      "A prenup cost calculator shows what a prenuptial agreement actually costs in your state. It factors in whether both parties have their own attorneys (usually required for enforceability) the complexity of your assets, and state-specific rules like California's mandatory 7-day waiting period.\n\nThe calculator above uses published attorney fee data: $2,500 to $10,000+ per party in NYC, $3,000 to $10,000+ in California, $1,500 to $5,000 in Florida and Texas, and a national baseline of $1,500 to $8,000. It also accounts for each state's UPAA / UPMAA adoption status and independent-counsel requirement.\n\nFor a moderate California prenup with both parties represented, which is functionally required under Cal. Fam. Code §1615(c), expect a total cost of $9,000 to $16,000.",
    howItWorks:
      "Prenup costs move on three axes: state cost of living, complexity of assets, and whether each party retains their own attorney.\n\nState cost matters because attorney rates in high-cost metros dominate. New York City and California high-net-worth prenups regularly hit $5,000–$10,000+ per party for straightforward drafting, and international assets or business interests push complex prenups above $10,000 per party. Florida, Texas, and mid-tier metros run 40–60% below NY/CA prices at each complexity tier. The national baseline (from ContractsCounsel and TheKnot survey data) is $1,500–$3,500 per party simple, $2,500–$5,000 moderate, $4,000–$8,000 complex.\n\nBoth-parties-attorney is the biggest cost lever — and often functionally required. California's Cal. Fam. Code §1615(c) makes waivers of spousal-support or property rights unenforceable without independent counsel, so a prenup drafted by one party's attorney and signed by the other without counsel is largely worthless in California. New Jersey requires a written waiver of the opportunity to consult counsel if a party lacks one, and courts everywhere weight independent counsel heavily in enforceability review. Total cost when both parties retain separate attorneys is roughly 2× the per-party number.\n\nUPAA adoption (Uniform Premarital Agreement Act, 1983) simplifies enforceability in ~28 states plus DC. UPMAA (2012) — a stricter version with more procedural safeguards — has been confirmed adopted only in Colorado and North Dakota so far, though more states have introduced legislation. Non-UPAA states include Ohio (Gross v. Gross test), Georgia (Scherer v. Scherer three-part test), and Louisiana (civil-law authentic-act requirement with notary and two witnesses).\n\nCalifornia's other trap: the 7-day waiting period under §1615(c)(2)(B) — 7 calendar days minimum between presentation of the final agreement and signing. It cannot be waived. A prenup signed before that 7-day window is unenforceable, regardless of whether both parties agree to skip it. Combined with the independent-counsel rule, California is the strictest state to enforce a prenup in and requires the most lead time before the wedding.\n\nUniversal requirements across all states: written form, voluntary execution, full financial disclosure of assets/income/debts, and terms not unconscionable at execution. Prenups cannot bind child custody or child support decisions — those are always reviewed under the court's best-interest standard.",
    commonMistakes: [
      "Signing a California prenup within 7 days of the wedding. Cal. Fam. Code §1615(c)(2)(B) requires 7 calendar days minimum between final agreement presentation and signing — no exceptions. Signing sooner voids the agreement.",
      "Using one attorney for both parties. In California, waivers of spousal-support/property rights are unenforceable without independent counsel. Everywhere else, courts weight the absence of independent counsel heavily against enforceability under the unconscionability analysis.",
      "Skipping full financial disclosure. UPAA and all case-law states require full disclosure of assets, income, and debts. Hiding assets is the fastest way to get a prenup thrown out at enforcement.",
      "Including child-custody or child-support terms. Universally unenforceable — these are the child's rights, not the parents', and the court applies a best-interest standard regardless of what parents agreed to.",
      "Waiting until the week of the wedding. Even in non-California states, last-minute signing is a factor in duress/voluntariness analysis. Aim for 30+ days before the wedding as a floor.",
      "Signing an oral prenup. No state recognizes oral prenups. Written form is required in every jurisdiction.",
    ],
    workedExample:
      "Take the calculator's default: a moderate-complexity California prenup with both parties retaining their own attorneys. California per-party base: $4,500–$8,000 moderate. Two attorneys × 2 = total $9,000–$16,000. California-specific rules apply: Cal. Fam. Code §1615(c) makes independent counsel functionally required (already factored in via the both-parties-attorney selection), and §1615(c)(2)(B) requires a mandatory 7-day waiting period between final agreement presentation and signing — non-waivable. California is a community property state, so the prenup essentially opts out of the default 50/50 marital property regime for assets defined in the agreement. Result: $9,000–$16,000 total, with a hard 7-day timeline requirement before signing.",
    faqs: [
      {
        question: "How much does a prenup cost?",
        answer:
          "Prenup costs run $1,500 to $10,000+ per party depending on state and complexity. National baseline: simple $1,500–$3,500 per party, moderate $2,500–$5,000, complex $4,000–$8,000. High-cost metros run 60–80% above that: NYC $2,500–$12,000+ per party, California $3,000–$12,500+. Because independent counsel is functionally required for enforceability in most cases (and mandatory in California for waivers under Cal. Fam. Code §1615(c)), plan on both parties retaining attorneys — double the per-party number for the total.",
      },
      {
        question: "How much does a prenup cost in NYC, California, Texas, or Florida?",
        answer:
          "State-by-state per-party attorney fees for a moderate prenup: New York City $4,000–$7,500 per party, California $4,500–$8,000, Texas and Florida $2,500–$4,500, Washington $3,500–$6,000, New Jersey $3,500–$6,000, Illinois $3,000–$5,500. With both parties represented (typical), total cost is 2× the per-party number — a moderate NYC prenup runs $8,000–$15,000 total. High-net-worth cases with business interests, international assets, or blended families push complex prenups above $10,000 per party.",
      },
      {
        question: "Do I need my own attorney for a prenup?",
        answer:
          "In California, yes — Cal. Fam. Code §1615(c) makes waivers of spousal-support or property rights unenforceable without independent counsel. Everywhere else, independent counsel is not statutorily required but is strongly recommended and heavily weighted by courts in the unconscionability analysis. New Jersey requires a written waiver of the opportunity to consult counsel if a party lacks one. Practically, retaining separate attorneys is the single strongest step toward an enforceable prenup and is worth the added cost.",
      },
      {
        question: "How long before the wedding do we need to sign a prenup?",
        answer:
          "In California, there is a mandatory 7-day waiting period between the final agreement being presented and signing (Cal. Fam. Code §1615(c)(2)(B)) — non-waivable. Everywhere else, there's no statutory waiting period, but last-minute signing (days before the wedding) is a factor in the duress/voluntariness analysis at enforcement. Aim for 30+ days before the wedding as a floor everywhere; 60+ days is safer. In California, start the process at least 2 months before the wedding to allow for drafting, review, and the 7-day final window.",
      },
      {
        question: "What states have adopted the Uniform Premarital Agreement Act?",
        answer:
          "About 28 states plus DC have adopted the Uniform Premarital Agreement Act (UPAA, 1983) or its 2012 successor, the Uniform Premarital and Marital Agreements Act (UPMAA). UPAA states include Arizona, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Maine, Montana, Nebraska, Nevada, New Jersey, New Mexico, North Carolina, North Dakota, Oregon, Rhode Island, South Dakota, Texas, Utah, Virginia, and Wisconsin. Colorado and North Dakota have confirmed adoption of UPMAA (2012). Notable non-UPAA states: Ohio, Georgia, Louisiana (civil-law regime), and New York.",
      },
      {
        question: "What can and can't a prenup enforce?",
        answer:
          "A prenup can enforce: property division at divorce or death, spousal support waivers or caps (subject to state limits), business protection provisions, debt allocation, and inheritance rights. A prenup CANNOT enforce: child custody or child support (always subject to court's best-interest review — universally unenforceable), terms that encourage divorce (void in most jurisdictions), or terms unconscionable at execution (UPAA) or at enforcement (many states). Personal or lifestyle clauses — weight loss, chores, sexual frequency — are generally unenforceable, though non-financial breach penalties are sometimes upheld.",
      },
    ],
    sources: [
      { label: "Uniform Law Commission — Premarital Agreement Act (UPAA)", url: "https://www.uniformlaws.org/committees/community-home?CommunityKey=2e456584-938e-4008-ba0c-bb6a1a544400" },
      { label: "Cornell LII — Uniform Premarital Agreement Act", url: "https://www.law.cornell.edu/wex/uniform_premarital_agreement_act" },
      { label: "Cal. Fam. Code §1615 — Enforceability", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=1615." },
      { label: "ContractsCounsel — Prenuptial Agreement Cost 2026", url: "https://www.contractscounsel.com/b/prenuptial-agreement-cost" },
      { label: "Ohio Supreme Court — Prenuptial Agreements Bench Card (PDF)", url: "https://www.supremecourt.ohio.gov/docs/JCS/CFC/resources/DRBenchCards/10_prenuptialAgreements.pdf" },
      { label: "Community property in the United States (Wikipedia)", url: "https://en.wikipedia.org/wiki/Community_property_in_the_United_States" },
    ],
    toolHeading: "Estimate your prenup cost",
    toolSubheading: "State, complexity, and whether both parties have counsel — see total cost + state enforceability rules.",
    preset: {
      state: "california",
      complexity: "moderate",
      bothPartiesAttorney: true,
    },
    relatedSlugs: ["will-cost-calculator", "living-trust-cost-calculator"],
    // 50 state subpages authored in a follow-on session slice.
  },

  // keyword-gap-pass 2026-09-02, batch D. register: operator · teeup-exempt: dense YMYL legal
  // topic where a "we've done this a lot" tee-up would read as filler ahead of the exemption
  // figures — the sourced facts carry the trust here, not first-person framing. medium: text →
  // text · page type: explainer (1200-word floor). The embedded calculator above still runs the
  // US-citizen $15M/$30M exemption; it does NOT model the $60,000 NRA exemption — the body is
  // explicit about that gap and does the real NRA math in prose instead. Every figure below is
  // hand-computed against the standard IRC §2001(c) graduated rate table (18%–40%, unchanged in
  // structure for decades) and clearly labeled as an illustrative worked example.
  {
    calculator: "estate-planning",
    slug: "us-estate-tax-for-non-citizens",
    islandId: "estate-tax",
    title: "US Estate Tax for Non-Citizens: The $60,000 Exemption",
    metaDescription:
      "Nonresident aliens get a $60,000 US estate tax exemption, not the $15M citizen exemption. See the US-situs asset rules and US-Canada treaty relief.",
    targetKeyword: "US estate tax for non-citizens",
    estimatedVolume: 320,
    estimatedKD: 22,
    h1: "US Estate Tax for Non-Citizens: The $60,000 Exemption",
    introText:
      "A nonresident alien (someone who is neither a US citizen nor a US resident) receives a US estate tax exemption of just $60,000 on US-situs assets, meaning property located in or connected to the United States. That is only a small fraction of the $15,000,000 exemption available to a US citizen or resident. The difference catches many Canadian retirees and snowbirds by surprise because it applies even to a single Florida condo or a US brokerage account holding ordinary US stocks.\n\nThe [Internal Revenue Service (IRS)](https://www.irs.gov/instructions/i706na) requires an estate representative to file Form 706-NA once a nonresident alien's US-situs assets exceed the $60,000 threshold. Through a mechanism covered below, the US-Canada tax treaty can raise the effective exemption for a Canadian resident's estate, but it does not eliminate the gap on its own.\n\nThe [estate tax calculator](/estate-planning/estate-tax-calculator/) built into this hub still uses the $15,000,000 citizen exemption rather than the $60,000 NRA figure. It is the wrong tool for an NRA's real number, which the sections below calculate instead.",
    howItWorks:
      "US-situs assets are the only assets counted in a nonresident alien's (NRA's) US taxable estate, and the situs rules often catch people off guard. US real estate counts, including a vacation condo or rental property. Tangible personal property physically located in the United States counts too, a car, a boat, art hanging in a US home. Stock in a US corporation counts as US-situs even if the shares sit in a Canadian brokerage account and were never physically in the United States, a rule that surprises many Canadian investors holding ordinary US blue-chip stocks through their home-country broker.\n\nSome common holdings are excluded. US bank deposit accounts not connected to a US trade or business are generally excluded from an NRA's US gross estate under Internal Revenue Code (IRC) §2105(b). Life insurance proceeds on the life of a nonresident alien are also excluded under IRC §2105(a), regardless of which insurer issued the policy. A US brokerage account holding US-company stock is the single most common trap, since many Canadian snowbirds don't realize simply owning shares of an ordinary US company through a US or Canadian brokerage pulls that value into their US taxable estate.\n\nThe $60,000 exemption works through a fixed $13,000 unified credit under IRC §2102(b)(1), an amount that has not been adjusted for inflation since 1988 and applies no matter how large a US citizen's own exemption grows. That credit shields the practical equivalent of the first $60,000 of US-situs assets from tax. The full US-situs gross estate is taxed using the same graduated rate table that applies to a US citizen's estate under IRC §2001(c), starting at 18% and reaching a top rate of 40% on US-situs assets above $1,000,000, before the $13,000 credit is subtracted from the tentative tax.\n\nA Canadian resident owns a $700,000 Florida condo and nothing else in the US. That gives a $700,000 US-situs gross estate. Running that amount through the IRC §2001(c) rate table produces a tentative tax of $229,800. Subtracting the $13,000 unified credit leaves a US federal estate tax bill of $216,800, before any treaty relief. The identical condo owned by a US citizen would trigger no federal estate tax at all, since $700,000 sits far under the $15,000,000 citizen exemption.\n\nThe [United States-Canada Income Tax Convention](https://www.irs.gov/pub/irs-trty/canada.pdf), specifically Article XXIX B, lets a Canadian resident's estate claim a larger unified credit than the flat $60,000 exemption allows, calculated as a proportion of the full US citizen exemption based on how much of the worldwide estate sits in the United States. In broad terms, if half of a Canadian resident's worldwide estate is US-situs property, the treaty can prorate roughly half of the full $15,000,000 citizen-level credit to that estate instead of the bare $13,000 NRA credit, a meaningfully larger shield for anyone whose US property is a small slice of a larger worldwide estate. Article XXIX B also provides an additional marital credit when US-situs property passes to a surviving spouse.\n\nThe exact computation depends on the full worldwide estate value, which the treaty requires the estate to disclose even though only the US-situs portion gets taxed, and it is not something to work out without a cross-border estate attorney. Claiming the treaty benefit requires filing Form 706-NA. It means attaching the treaty computation, not just checking a box. If you hold US property as a Canadian resident, treat this as a reason to call an attorney who handles cross-border estates specifically, not as a formula to run yourself.\n\nAn estate must file Form 706-NA, United States Estate (and Generation-Skipping Transfer) Tax Return, Estate of a Nonresident Not a Citizen of the United States, whenever the decedent's US-situs gross estate exceeds $60,000, even if the treaty ultimately reduces the tax owed to zero. The [IRS instructions for Form 706-NA](https://www.irs.gov/instructions/i706na) set the filing deadline at nine months after death, the same window that applies to a citizen's Form 706, with a six-month extension available on Form 4768.\n\nMissing the deadline exposes the estate to the same failure-to-file and failure-to-pay penalties that apply to a citizen's estate, plus interest accruing from the original due date. Because the US-situs asset rules and the treaty computation both take real time to work out, especially for an estate holding US brokerage stock alongside real estate, start gathering the US asset list well before the nine-month clock runs out rather than waiting for a final appraisal.\n\nThe [estate tax calculator](/estate-planning/estate-tax-calculator/) linked above and embedded on this page runs the math for a US citizen or resident, applying the $15,000,000 individual exemption and up to $30,000,000 for a married couple through portability. It does not model the $60,000 NRA exemption, the US-situs asset rules, or the treaty proration described above, since those are a different calculation entirely, not a variation on the citizen formula the tool already runs. Use the calculator above only as a point of comparison. It shows what the identical US-situs value would owe a US citizen or resident. For an NRA's actual number, work through the $60,000 exemption and the graduated rate table above, or better, run the full picture past a cross-border estate attorney who can apply the treaty proration correctly for your specific worldwide estate value.\n\nThis entire calculation applies only to someone who is neither a US citizen nor a US resident for estate tax purposes, a status the IRS determines by domicile, meaning where you live with the intent to stay indefinitely, not by immigration status or how many days you spend in the country each year. A green card holder, or someone who has established US domicile even without a green card, is generally taxed under the citizen rules instead, with the full $15,000,000 exemption, not the $60,000 NRA figure.\n\nTwo changes would raise an NRA's effective exemption above the bare $60,000: qualifying for the US-Canada treaty proration described above, or restructuring US holdings before death, moving US brokerage stock into a non-US holding company, for example, so it's no longer US-situs property, though that kind of restructuring carries its own tax consequences and needs to happen well before death with professional guidance, not as a last-minute move. Selling US real estate outright removes it from the US-situs estate too, but triggers its own US capital gains exposure under the [Foreign Investment in Real Property Tax Act (FIRPTA)](https://www.irs.gov/individuals/international-taxpayers/firpta-withholding) withholding rules on the sale itself. Talk to a cross-border estate attorney before making any of these moves, since the timing and the paperwork both affect whether they reduce the final bill.",
    commonMistakes: [
      "Assuming the $15,000,000 citizen exemption applies just because you're a longtime snowbird. Only US citizens and US domiciliaries get that exemption. An NRA's exemption is $60,000 regardless of how many winters were spent in Florida.",
      "Not realizing US-company stock is US-situs even when held through a Canadian brokerage account. A $400,000 US-stock position, purchased and held entirely from Canada, still counts as US-situs and erodes the $60,000 exemption just like a Florida condo does.",
      "Skipping Form 706-NA because the treaty reduced the tax to zero. Filing is required once the gross US-situs estate exceeds $60,000, regardless of the final tax bill after treaty relief.",
      "Running personal net worth through the citizen-focused estate tax calculator above and treating the output as an NRA's real number. It shows only the citizen-exemption comparison, not an NRA's actual exposure.",
      "Waiting until near death to restructure US holdings. A move into a non-US holding company or a sale of US real estate both carry their own tax consequences and need lead time and professional structuring, not a last-minute scramble.",
    ],
    workedExample:
      "Take a Canadian resident who owns a $700,000 Florida condo and a $150,000 US brokerage account holding shares of US companies, and nothing else in the United States. The US-situs gross estate is $850,000: the real estate counts under the situs rules, and the US-company stock counts too, even though the brokerage account is Canadian. Running $850,000 through the IRC §2001(c) graduated rate table produces a tentative tax of $155,800 (the tax on the first $500,000) plus 37% of the remaining $350,000 ($129,500), for $285,300 total. Subtracting the $13,000 unified credit leaves $272,300 in US federal estate tax. That is before any US-Canada treaty relief is applied. An identical $850,000 in US assets owned by a US citizen would owe $0 federal estate tax, since it sits far under the $15,000,000 citizen exemption. The treaty computation described above could meaningfully lower that $272,300 figure depending on the estate's full worldwide value, which is exactly the calculation a cross-border estate attorney should run before the estate settles, not after.",
    faqs: [
      {
        question: "What is the US estate tax exemption for non-citizens?",
        answer:
          "A nonresident alien's US estate tax exemption is $60,000, delivered through a fixed $13,000 unified credit under IRC §2102(b)(1) that has not been adjusted for inflation since 1988. That is a fraction of the $15,000,000 exemption a US citizen or resident receives, and it applies only to US-situs assets, property located in or connected to the United States.",
      },
      {
        question: "What counts as a US-situs asset for a nonresident alien?",
        answer:
          "US real estate, tangible personal property physically located in the United States, and stock in a US corporation, even if held through a foreign brokerage account, all count as US-situs assets. US bank deposit accounts not connected to a US trade or business, and life insurance proceeds on the life of a nonresident alien, are generally excluded under IRC §2105.",
      },
      {
        question: "Does the US-Canada tax treaty increase the $60,000 exemption?",
        answer:
          "Yes, potentially. Article XXIX B of the United States-Canada Income Tax Convention lets a Canadian resident's estate claim a larger, prorated unified credit based on how much of the worldwide estate sits in the United States, plus an additional marital credit for property passing to a surviving spouse. The exact computation depends on the full worldwide estate value and needs a cross-border estate attorney, not a DIY calculation.",
      },
      {
        question: "Do I need to file Form 706-NA if my US assets are under $60,000?",
        answer:
          "No. Form 706-NA is required only once the US-situs gross estate exceeds $60,000. Below that threshold, no return is required, though keeping documentation of asset values is still smart in case of an IRS inquiry.",
      },
      {
        question: "What's the difference between an NRA's exemption and a green card holder's exemption?",
        answer:
          "A green card holder is generally taxed under the citizen rules, with the full $15,000,000 exemption, because US estate tax residency turns on domicile, where you live with the intent to stay indefinitely, not on immigration status alone. A nonresident alien who has never established US domicile gets the $60,000 exemption regardless of how much time is spent in the country each year.",
      },
      {
        question: "Can a Canadian avoid this tax by owning US property through a corporation?",
        answer:
          "Sometimes, since shares of a non-US holding company generally aren't US-situs property themselves, but this needs to be structured correctly and well in advance, and it carries real tradeoffs, including losing certain US tax benefits and creating its own compliance requirements. It is a strategy to discuss with a cross-border estate attorney before buying US property, not a fix to apply after the fact.",
      },
      {
        question: "How much does US estate tax cost a Canadian owning a $500,000 Florida condo?",
        answer:
          "Running $500,000 through the IRC §2001(c) graduated rate table produces a tentative tax of $155,800. Subtracting the $13,000 unified credit leaves $142,800 in US federal estate tax before any treaty relief, a bill that would be $0 for a US citizen owning the identical condo, since $500,000 sits far under the $15,000,000 citizen exemption.",
      },
    ],
    sources: [
      { label: "IRS — Instructions for Form 706-NA", url: "https://www.irs.gov/instructions/i706na" },
      { label: "IRS — Some Nonresidents With US Assets Must File Estate Tax Returns", url: "https://www.irs.gov/individuals/international-taxpayers/some-nonresidents-with-us-assets-must-file-estate-tax-returns" },
      { label: "IRS — United States-Canada Income Tax Convention", url: "https://www.irs.gov/pub/irs-trty/canada.pdf" },
      { label: "IRC §2102 — Credits Against Tax", url: "https://www.law.cornell.edu/uscode/text/26/2102" },
      { label: "IRC §2105 — Property Without the United States", url: "https://www.law.cornell.edu/uscode/text/26/2105" },
      { label: "IRS — FIRPTA Withholding", url: "https://www.irs.gov/individuals/international-taxpayers/firpta-withholding" },
    ],
    toolHeading: "See the Citizen Exemption for Comparison",
    toolSubheading: "This tool applies the $15 million citizen exemption. See your actual $60,000 NRA exemption math below.",
    preset: {
      netWorth: 850_000,
      state: "florida",
      filingStatus: "single",
    },
    relatedSlugs: ["estate-tax-calculator", "will-cost-calculator", "living-trust-cost-calculator"],
    // No state subpages — US-situs rules apply uniformly; state only affects the citizen-benchmark comparison above.
  },
];
