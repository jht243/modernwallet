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
    title: "Will Cost Calculator: What a Will Actually Costs by State",
    metaDescription:
      "Free will cost calculator. See what an attorney-drafted or online will costs in your state, plus power of attorney and healthcare directive.",
    targetKeyword: "will cost calculator",
    estimatedVolume: 6400,
    estimatedKD: 38,
    h1: "Will Cost Calculator: Attorney vs Online, by State",
    intro:
      "A will cost calculator shows what a last will and testament actually costs based on your state, the complexity of your situation, and whether you use an attorney or an online service. The calculator above applies a state cost multiplier to the 2026 national attorney benchmark (Legaltemplates 909-firm study): simple will $300 to $800, moderate $750 to $2,500, complex $2,500 to $7,500+. For a moderate-complexity will in Texas with a durable power of attorney and healthcare directive, the range lands at roughly $1,000 to $3,200 attorney-drafted, or $199 to $299 through Trust & Will's couple plan.",
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
    relatedSlugs: [],
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
    title: "Living Trust Cost Calculator: RLT + Irrevocable Trusts",
    metaDescription:
      "Free living trust cost calculator. See revocable, ILIT, MAPT, and dynasty trust costs plus trust funding — attorney and online options compared.",
    targetKeyword: "living trust cost calculator",
    estimatedVolume: 4900,
    estimatedKD: 36,
    h1: "Living Trust Cost Calculator: RLT, ILIT, and Irrevocable Trusts",
    intro:
      "A living trust cost calculator shows what a revocable living trust, ILIT, Medicaid Asset Protection Trust, or dynasty trust actually costs — with attorney fees, online alternatives, and trust funding broken out. The calculator above applies a state cost multiplier to the 2026 national benchmarks: attorney revocable living trust $1,500–$5,000 typical (California/HNW $5,000–$10,000+); ILIT $2,500–$4,000; MAPT $3,000–$6,000; dynasty trust $5,000–$10,000+. For a moderate California revocable living trust with one property to retitle, the range lands at roughly $3,375–$6,750 attorney-drafted, or $599 through Trust & Will's couple plan.",
    howItWorks:
      "Living trust costs depend on the type of trust, the state cost of living, and whether you include trust funding (retitling deeds and accounts).\n\nRevocable living trusts are the standard probate-avoidance tool. Attorney cost: $1,500–$3,000 simple, $2,500–$5,000 moderate, $4,000–$8,000+ complex — with California, New York, and other high-cost metros running 20–35% above the national baseline. Online: Nolo Quicken WillMaker Plus $139 (includes an RLT template), LegalZoom Living Trust ~$279, Trust & Will $499 individual / $599 couple. A revocable living trust does NOT reduce estate tax and does NOT protect assets from creditors — it purely avoids probate.\n\nIrrevocable trusts serve tax or asset-protection goals. An ILIT (Irrevocable Life Insurance Trust) removes a life insurance policy's death benefit from the taxable estate — $2,500–$4,000 attorney-drafted; DIY is not appropriate. A Medicaid Asset Protection Trust (MAPT) shields assets from a future long-term-care spend-down — $3,000–$6,000 typical; requires the 5-year Medicaid lookback (transfers within 5 years of applying for Medicaid disqualify you for a penalty period). Dynasty trusts move wealth across generations and skip generation-skipping tax — $5,000–$10,000+ and require specific state law (Delaware, South Dakota, Nevada, and Wyoming lead here because they abolished the rule against perpetuities).\n\nTrust funding is the step everyone forgets. A trust doesn't work until you retitle assets into it: deed recording $50–$150 per property (attorney costs $200–$500 per deed with the state multiplier), retitle brokerage/bank accounts $300–$1,500, and update beneficiary designations on retirement accounts and life insurance. Fund the trust or it's just a piece of paper. See the full plan tier with our [estate planning calculator](/estate-planning/) — and if your net worth includes retirement accounts, the [401(k) calculator](/retirement/401k-calculator/) shows how beneficiary designations override the trust for those assets.\n\nHow much does a living trust avoid in probate cost? A lot. Compare the trust setup to what probate would cost the estate at death: California's Cal. Prob. Code §10810 statutory schedule alone (before adding executor commission under §10800) charges $18,000 in attorney fees on a $750,000 estate. Both the attorney AND executor each get the same percentage, roughly doubling the total. The [probate fee calculator](/probate/fee-calculator/) shows the exact numbers for your state and estate value — for any middle-class-or-larger estate, the trust math wins by tens of thousands of dollars plus 12+ months of settlement time.\n\nMedicaid Asset Protection Trusts specifically need coordination with elder-care projections. The [Medicaid spend-down calculator](/elder-care/medicaid-spend-down-calculator/) shows your state's actual asset limits, CSRA thresholds, and home equity cap so you can size the MAPT to the gap that would otherwise be spent down. The [long-term care cost calculator](/elder-care/long-term-care-cost-calculator/) projects the shortfall the MAPT is trying to protect against. Both should be run before drafting an irrevocable trust — the 5-year lookback under 42 U.S.C. §1396p(c) means the timing decision is as important as the trust structure.",
    commonMistakes: [
      "Skipping trust funding. A revocable living trust that hasn't been funded (deed recorded, accounts retitled) provides zero probate protection at death — the trust just sits empty. Fund it now or it's decorative.",
      "Assuming a revocable trust saves estate tax. It doesn't. A revocable trust is a probate-avoidance tool; the assets remain in your taxable estate. Only irrevocable trusts move assets out of the taxable estate.",
      "Missing the Medicaid 5-year lookback. Transfers into a MAPT within 5 years of applying for Medicaid trigger a penalty period. Plan MAPT funding at least 5 years before any anticipated long-term-care need.",
      "Trying to DIY an irrevocable trust. ILIT, MAPT, and dynasty trusts require attorney-drafted documents — the wrong language can void the tax or asset-protection benefit or unintentionally trigger a taxable gift.",
      "Forgetting community property funding. In community property states (AZ, CA, ID, LA, NV, NM, TX, WA, WI), a joint trust preserves community-property basis-adjustment status for both halves at the first spouse's death (IRC §1014(b)(6)) — separate trusts lose that benefit.",
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
        question: "How much does it cost to fund a living trust?",
        answer:
          "Trust funding — retitling deeds and accounts into the trust — costs $500 to $2,000 additional on top of drafting. Each real-estate deed runs $200 to $500 attorney-recorded (or $50 to $150 DIY), and retitling brokerage/bank accounts runs $300 to $1,500 depending on how many institutions are involved. Trust funding is where most DIY living trusts fail — an unfunded trust provides zero probate protection because the assets are still in your name at death.",
      },
      {
        question: "Does a living trust protect assets from Medicaid?",
        answer:
          "A revocable living trust does NOT protect assets from Medicaid because you still control them — they count as your assets for the spend-down analysis. Only a Medicaid Asset Protection Trust (MAPT) — a specific type of irrevocable trust — can shield assets, and only if you funded it more than 5 years before applying for Medicaid (the federal 5-year lookback under 42 U.S.C. §1396p). Attorney cost is $3,000 to $6,000. DIY is not appropriate for MAPTs.",
      },
      {
        question: "Can I set up a living trust online?",
        answer:
          "Yes, for a revocable living trust with straightforward facts. Trust & Will ($499 individual, $599 couple), LegalZoom Living Trust (~$279), and Nolo Quicken WillMaker Plus ($139, includes RLT template) all produce valid RLTs. Online is not appropriate for irrevocable trusts (ILIT, MAPT, dynasty), Medicaid planning, blended families with complex distributions, business interests, or cross-state property. Attorney-drafted becomes worth it when the facts stop fitting a fill-in-the-blank template.",
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
    title: "Estate Tax Calculator 2026: Federal + State Exposure",
    metaDescription:
      "Free estate tax calculator. See your federal ($15M) and state estate tax exposure for 2026, including the NY 105% cliff and 5 inheritance-tax states.",
    targetKeyword: "estate tax calculator",
    estimatedVolume: 8100,
    estimatedKD: 42,
    h1: "Estate Tax Calculator: Federal + State Exposure for 2026",
    intro:
      "An estate tax calculator shows your federal and state estate tax exposure using the 2026 numbers — a $15,000,000 federal exemption per individual (permanent and indexed under the One Big Beautiful Bill Act, IRC §2010(c)(3)), a 40% flat rate on the excess, and up to $30,000,000 shielded for a married couple via portability. The calculator above adds the 12 state estate taxes and 5 state inheritance taxes still on the books in 2026. For an $8.5M estate in New York filing married, the federal tax is $0 (under the $30M combined exemption), but New York's $7.35M threshold and unique 105% cliff mean the ENTIRE $8.5M is taxed from dollar one at up to 16% — a critical trap most planning tools miss.",
    howItWorks:
      "Estate tax has three layers in 2026: federal, state estate tax, and state inheritance tax.\n\nFederal estate tax is 40% flat on any amount above the exemption. The 2026 exemption is $15M per individual, made permanent and indexed under the One Big Beautiful Bill Act (P.L. 119-21, signed July 2025), which amended IRC §2010(c)(3). Married couples can shield up to $30M by combining exemptions via portability — the surviving spouse elects the deceased spouse's unused exemption on a timely-filed Form 706. The GST tax exemption mirrors at $15M, and the annual gift tax exclusion is $19,000 per donee (non-citizen spouse $194,000).\n\nState estate tax hits at much lower thresholds. Twelve states plus DC impose one in 2026: Oregon starts at $1M (the lowest), Rhode Island at $1.84M (indexed), Massachusetts at $2M, Minnesota and Washington at $3M (Washington's rate resets from 35% to 20% on July 1, 2026), Illinois at $4M, DC at $4.99M, Maryland at $5M (also has inheritance tax), Vermont at $5M, Hawaii at $5.49M, Maine at $7M, New York at $7.35M, and Connecticut at $15M (tied to federal). Rates run 10–20%. New York uniquely applies a 105% cliff: estates over 105% of the exemption are taxed from dollar one, not just the excess — the calculator above flags this explicitly.\n\nState inheritance tax hits beneficiaries directly and depends on relationship, not estate size. Five states impose one in 2026 (Iowa repealed 2025): Kentucky (Class A exempt, Class B exempt in 2026, Class C 6–16%), Maryland (10% flat on non-exempt), Nebraska (1%/11%/15% by class), New Jersey (Class A exempt, Class C 11–16%, Class D 15–16%), and Pennsylvania (0% spouse/minor, 4.5% lineal, 12% sibling, 15% other). Non-lineal beneficiaries (siblings, nieces/nephews, friends, unmarried partners) pay the most.\n\nEstate tax planning combines three tools: portability (Form 706 election), lifetime gifting to use the $19,000 annual exclusion, and irrevocable trusts (ILIT for life insurance, dynasty trusts for generational transfers). See the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) for irrevocable trust costs, and the [estate planning hub](/estate-planning/) for the specific plan tier your net worth calls for.",
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
      "Free prenup cost calculator. See attorney fees by state for simple, moderate, and complex prenups plus state enforceability rules and independent counsel requirements.",
    targetKeyword: "prenup cost calculator",
    estimatedVolume: 3600,
    estimatedKD: 34,
    h1: "Prenup Cost Calculator: Attorney Fees by State",
    intro:
      "A prenup cost calculator shows what a prenuptial agreement actually costs in your state, factoring in whether both parties have their own attorneys (usually required for enforceability), the complexity of your assets, and state-specific rules like California's mandatory 7-day waiting period. The calculator above applies published attorney fee data — NYC $2,500–$10,000+ per party, California $3,000–$10,000+, Florida and Texas $1,500–$5,000, national baseline $1,500–$8,000 — and adds each state's UPAA / UPMAA adoption status and independent-counsel requirement. For a moderate California prenup with both parties represented (functionally required under Cal. Fam. Code §1615(c)), expect $9,000 to $16,000 total.",
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
];
