import type { SpokeEntry } from "./types";
import { STATES } from "./states";

// Elder Care spokes. Legal pillar (attorney-reviewer byline + LegalDisclaimer).
// Powered by src/lib/elder-care-hub.ts + per-spoke engines (medicaid-spend-down,
// special-needs-trust, long-term-care-cost). Grounded in 42 U.S.C. §1396p (Medicaid transfers,
// home equity, estate recovery), POMS SI 01120.199-.204 (SNT rules), and Genworth 2024
// Cost of Care Survey projected forward to 2026. Per-page keyword-gap-pass Phase 3 authoring +
// Phase 4 audit.

const ALL_STATE_SLUGS = STATES.map((s) => s.slug);

export const ELDER_CARE_SPOKES: SpokeEntry[] = [
  {
    calculator: "elder-care",
    slug: "medicaid-spend-down-calculator",
    islandId: "medicaid-spend-down",
    title: "Medicaid Spend-Down Calculator: State + Assets + Income",
    metaDescription:
      "Free Medicaid spend-down calculator. See countable assets, spend-down target, CSRA + MMMNA for community spouse, home equity limit, and income cap check by state.",
    targetKeyword: "medicaid spend down calculator",
    estimatedVolume: 5400,
    estimatedKD: 32,
    h1: "Medicaid Spend-Down Calculator: Do You Qualify for Long-Term-Care Medicaid?",
    intro:
      "A Medicaid spend-down calculator shows how much of your countable assets must be spent (on care, exempt purchases, or protected transfers) before institutional Medicaid will pay for a nursing home. The federal asset limit is $2,000 for the applicant, but every state has its own overlay. California re-added an asset test on January 1, 2026 at $130,000 individual / $195,000 couple; New York uses $33,038; Illinois $17,500. Twelve states plus D.C. use the maximum home-equity limit ($1,130,000 in 2026), the other 38 use the federal minimum ($752,000). About twenty states are 'income-cap' states that require a Qualified Income Trust (Miller Trust under 42 U.S.C. §1396p(d)(4)(B)) if your monthly income exceeds $2,982. The calculator applies your state's actual figures and shows the exact spend-down target — the dollar amount you need to spend before Medicaid pays.",
    howItWorks:
      "The engine separates your assets into countable and exempt buckets. Exempt: primary residence (subject to state home equity limit), one vehicle, household goods, term life insurance, permanent life with face value ≤ $1,500, and an irrevocable burial trust (state cap $1,500-$15,000). Countable: cash + investments + a second vehicle + cash-value life insurance above $1,500 + non-residence real estate + retirement accounts in states that count them (retirement is countable in California, Pennsylvania, and Illinois; exempt in payout status in Florida, Texas, Georgia, Kentucky, Mississippi, New York, and Ohio; treated variably elsewhere).\n\nFrom total countable assets we subtract the applicant asset limit (state-specific) and, if married, the Community Spouse Resource Allowance (CSRA) — half of countable assets bounded by 2026 federal min $32,532 and max $162,660 under 42 U.S.C. §1924(f)(2). The remainder is the spend-down target: what you must legally spend before Medicaid pays. Not on gifts (5-year lookback penalty under §1396p(c)) — on care itself, on exempt purchases (home repairs, prepaid burial, new car, dental work), or on protected transfers to a disabled child, a caretaker child, or a Medicaid Asset Protection Trust funded before the 60-month lookback window.\n\nIncome cap: 20 states cap institutional Medicaid income at 300% of the SSI federal benefit rate ($994 × 3 = $2,982 in 2026). If income exceeds the cap in an income-cap state, the applicant funds a Miller Trust each month to redirect excess income; the trust pays the nursing home. If the state is medically-needy (spend-down), the applicant instead spends the excess on medical costs monthly until they hit the state's Medically Needy Income Level (MNIL), which ranges from $100 in Louisiana to $1,842 in New York.\n\nCommunity spouse income: the well spouse keeps at least the Minimum Monthly Maintenance Needs Allowance (MMMNA — 2026 federal minimum $2,643.75/mo, Alaska $3,381.25, Hawaii $3,111.25) and may claim up to the federal maximum $4,066.50 if shelter costs are high. Any income above what the well spouse needs goes to nursing home care (with a Personal Needs Allowance $50-$180/mo depending on state kept by the institutionalized spouse).",
    commonMistakes: [
      "Assuming the federal $2,000 asset limit applies in your state. California's 2026 Medi-Cal test is $130,000/$195,000; New York $33,038; Illinois $17,500. Twelve states plus DC use the maximum $1,130,000 home equity limit versus the federal minimum $752,000 elsewhere. Always start with your state's actual figures.",
      "Counting retirement accounts as countable when they may be exempt. Florida, Texas, Georgia, Kentucky, Mississippi, New York, and Ohio treat retirement in payout status as exempt (income only, not asset). California, Pennsylvania, and Illinois count them fully.",
      "Gifting assets to family to 'spend down.' Any transfer for less than fair market value within 60 months of application triggers a penalty period under 42 U.S.C. §1396p(c). Penalty divisor is state-specific (California $14,440, Texas $7,900, Florida $10,645 per month of ineligibility).",
      "Ignoring the community spouse. If married, up to $162,660 in assets is protected by CSRA before spend-down applies. Never spend-down before running the CSRA calculation — you can lose $100k+ that was fully protected.",
      "Missing the income cap trap. In income-cap states, being $10 over $2,982/month blocks Medicaid entirely unless a Miller Trust is set up under 42 U.S.C. §1396p(d)(4)(B). This is set up BEFORE application, not after.",
      "Forgetting estate recovery. Medicaid recovers benefits paid from the estate after death under 42 U.S.C. §1396p(b). Most states limit recovery to probate estate; some (New York, others) expand to non-probate. Estate planning to shift assets out of probate can preserve inheritance.",
    ],
    workedExample:
      "Married couple, one spouse needing nursing home care in California. Countable assets: $45,000 cash + $180,000 taxable investments + $220,000 in the well spouse's IRA = $445,000. California counts retirement, so full $445,000 is countable. Home equity $450,000 (under CA's $1,130,000 limit — exempt). Well spouse's income $1,800/mo, applicant $2,400/mo. Under California's 2026 asset test, the applicant limit is $130,000; CSRA is bounded at $162,660 (half of $445k = $222,500, capped at max). Protected total = $130,000 + $162,660 = $292,660. Spend-down target = $445,000 − $292,660 = $152,340. That $152,340 must be spent on care, exempt purchases, or a properly-structured Medicaid Asset Protection Trust funded before the 60-month lookback window. The well spouse keeps at least $2,643.75/mo MMMNA plus can claim more if shelter is high. Applicant income $2,400 is under the $2,982 cap — no Miller Trust needed in CA (CA uses medically-needy pathway anyway).",
    faqs: [
      {
        question: "What is a Medicaid spend-down calculator?",
        answer:
          "A Medicaid spend-down calculator estimates how much of your countable assets must be spent before institutional (long-term care) Medicaid begins paying for a nursing home. It applies your state's actual 2026 asset limit (federal default $2,000; California $130,000; New York $33,038; Illinois $17,500; others vary), the Community Spouse Resource Allowance ($32,532-$162,660 under 42 U.S.C. §1924(f)(2)), your state's home equity limit ($752,000 federal minimum, $1,130,000 maximum), and the institutional income cap ($2,982/month in 2026) to show the exact spend-down target.",
      },
      {
        question: "How does Medicaid spend-down work in 2026?",
        answer:
          "Medicaid separates your assets into countable (cash, investments, second home, non-residence real estate, cash-value life insurance above $1,500, retirement accounts in most states) and exempt (primary residence up to state equity limit, one vehicle, household goods, term life, irrevocable burial trust). Countable assets above your state's applicant limit (plus CSRA if married) must be spent before Medicaid pays. Money can be spent on care, exempt purchases (home repairs, dental, new car, prepaid burial), or protected transfers to a disabled child, caretaker child, or Medicaid Asset Protection Trust funded 5+ years before application.",
      },
      {
        question: "What is the CSRA and how much can my spouse keep?",
        answer:
          "The Community Spouse Resource Allowance (CSRA) protects the well spouse's share of countable assets. In 2026, CSRA is half of the couple's total countable assets, bounded by federal minimum $32,532 and maximum $162,660 (42 U.S.C. §1924(f)(2)). A few states use only the maximum ($162,660) — Illinois, Massachusetts, New York use the max as the floor. The well spouse keeps their share fully; only the applicant's share above their state-specific asset limit ($2,000-$130,000 depending on state) must be spent.",
      },
      {
        question: "What is the Medicaid 5-year lookback?",
        answer:
          "The 60-month lookback under 42 U.S.C. §1396p(c) reviews every asset transfer in the 5 years before Medicaid application. Any gift, below-market sale, or funding of an irrevocable trust triggers a penalty period during which Medicaid will not pay. Penalty period = transferred value ÷ state's monthly divisor (California $14,440/mo, Texas $7,900, Florida $10,645, New York $16,229). Exceptions: transfers to a spouse, disabled child, caretaker child living in the home 2+ years, or a sibling with equity interest living in the home 1+ year.",
      },
      {
        question: "What is a Miller Trust (Qualified Income Trust)?",
        answer:
          "A Qualified Income Trust (Miller Trust) under 42 U.S.C. §1396p(d)(4)(B) is required in the ~20 income-cap states (Alabama, Alaska, Arizona, Colorado, Delaware, Florida, Georgia, Idaho, Indiana, Iowa, Louisiana, Mississippi, Nevada, New Mexico, Oklahoma, Oregon, South Carolina, South Dakota, Texas, Wyoming) when the applicant's monthly income exceeds $2,982 (300% of the 2026 SSI FBR $994). Each month, income above the cap flows into the trust, then out to the nursing home. Miller Trusts are drafted before application, funded monthly, and terminate at death with any remainder subject to Medicaid payback.",
      },
      {
        question: "Can I keep my home on Medicaid?",
        answer:
          "Generally yes if you intend to return home or a spouse/dependent lives there. The home is exempt regardless of value if a community spouse resides. If single, home equity is exempt up to your state's limit — $752,000 in 38 states (federal minimum), $1,130,000 in the 12 max-limit states (Alabama, California, Colorado, Connecticut, Hawaii, Maine, Massachusetts, New Jersey, New York, Tennessee, Washington, plus D.C.). Equity above the limit blocks Medicaid unless a HELOC or spousal transfer reduces it. After death, Medicaid Estate Recovery under 42 U.S.C. §1396p(b) can claim against the home unless a protected transfer (life estate deed 5+ years before, ladybird deed in eligible states, or transfer to caretaker child) applies.",
      },
    ],
    sources: [
      { label: "42 U.S.C. §1396p — Medicaid transfers, home equity, estate recovery", url: "https://www.ssa.gov/OP_Home/ssact/title19/1917.htm" },
      { label: "42 U.S.C. §1924 — CSRA, MMMNA, spousal impoverishment", url: "https://www.ssa.gov/OP_Home/ssact/title19/1924.htm" },
      { label: "CMS 2026 Spousal Impoverishment Standards (CIB 12/9/2025)", url: "https://www.medicaid.gov/federal-policy-guidance/downloads/cib12092025.pdf" },
      { label: "SSA POMS SI 01730.045 — Miller/QIT trusts", url: "https://secure.ssa.gov/poms.nsf/lnx/0501730045" },
      { label: "Medicaid.gov — Long-Term Services and Supports", url: "https://www.medicaid.gov/medicaid/long-term-services-supports/index.html" },
    ],
    toolHeading: "Estimate your Medicaid spend-down",
    toolSubheading: "State + assets by class + marital status + income → countable assets, spend-down target, CSRA, home equity check, income cap check.",
    preset: {
      state: "california",
      maritalStatus: "married-spouse-needs-care",
      cashAndSavings: 45_000,
      investments: 180_000,
      retirement: 220_000,
      otherRealEstate: 0,
      extraVehicles: 0,
      lifeInsuranceCashValue: 0,
      applicantMonthlyIncome: 2_400,
      spouseMonthlyIncome: 1_800,
      homeEquity: 450_000,
    },
    stateVariants: ALL_STATE_SLUGS,
    relatedSlugs: ["special-needs-trust-calculator", "long-term-care-cost-calculator"],
  },

  {
    calculator: "elder-care",
    slug: "special-needs-trust-calculator",
    islandId: "special-needs-trust",
    title: "Special Needs Trust Calculator: Type + Setup Cost + Benefits",
    metaDescription:
      "Free special needs trust calculator. See recommended SNT type (first-party, third-party, pooled), setup cost, Medicaid payback, and effect on SSI/Medicaid.",
    targetKeyword: "special needs trust calculator",
    estimatedVolume: 1900,
    estimatedKD: 25,
    h1: "Special Needs Trust Calculator: First-Party vs Third-Party vs Pooled",
    intro:
      "A special needs trust calculator helps you pick between the three SNT types authorized by federal law and estimate what setup will cost. A first-party (self-settled) SNT under 42 U.S.C. §1396p(d)(4)(A) holds the beneficiary's own money (personal injury settlement, back SSDI, inheritance) but requires that the beneficiary be under 65 at establishment and that any remainder at death repay Medicaid. A third-party SNT (funded by parents or other family) has no age limit and no Medicaid payback — remainder passes to family. A pooled SNT under 42 U.S.C. §1396p(d)(4)(C), run by nonprofits, is the fallback for beneficiaries 65+ funding their own money and for modest funding amounts under about $100,000. Assets in a properly drafted SNT are not countable resources for SSI or Medicaid under POMS SI 01120.200. Setup ranges from $500-$1,500 (pooled) to $3,000-$5,000 (standalone first-party or third-party).",
    howItWorks:
      "The calculator matches the beneficiary's age, the funding source, current benefit status, and funding amount against the three SNT categories. The critical fork: is the money the beneficiary's own or someone else's? If the money is the beneficiary's (personal injury settlement, back SSDI award, direct inheritance), federal law requires either a first-party (d)(4)(A) SNT or a pooled (d)(4)(C) SNT. First-party requires the beneficiary to be under 65 at establishment — after 65, only pooled is available, and in most states 65+ funding of a pooled SNT triggers a Medicaid transfer penalty. Both require Medicaid payback: any remaining trust assets at the beneficiary's death repay state Medicaid for benefits paid, up to the trust balance.\n\nIf the money is a family member's, a third-party SNT is the tool. Third-party SNTs have no age limit, no Medicaid payback, and remainder can pass to siblings or other family. Third-party SNTs can be established during the funder's life (inter vivos) or created inside a parent's will (testamentary).\n\nWhat SNTs can pay for changed materially in 2024. Under 89 FR 21199 effective September 30, 2024, food no longer counts as in-kind support and maintenance (ISM) for SSI. That means SNT distributions for food no longer reduce SSI. Shelter (rent, mortgage, utilities, property taxes) still triggers the Presumed Maximum Value reduction — up to one-third of SSI FBR ($994 × 1/3 = $331) plus $20 general income exclusion, so a shelter distribution reduces SSI by up to $311/month. Cash distributions directly to the beneficiary are unearned income and reduce SSI dollar-for-dollar. Everything else — medical care not covered by Medicaid, therapy, transportation, education, vacations, personal care, electronics, hobbies — is safe.\n\nCost ranges reflect 2026 national attorney fee surveys and vary materially by state and complexity. Pooled SNT setup is $500-$1,500 (nonprofit administrator handles most drafting). Standalone first-party or third-party SNT setup is $2,500-$5,000. Add professional trustee fees of roughly 1% of assets/year for ongoing administration.",
    commonMistakes: [
      "Using a first-party SNT for a beneficiary over 65. First-party (d)(4)(A) SNTs are only for beneficiaries under 65 at establishment. After 65, only a pooled (d)(4)(C) SNT is available — and in most states, 65+ funding triggers a Medicaid transfer penalty under 42 U.S.C. §1396p(c).",
      "Funding a third-party SNT with the beneficiary's own money. This makes it a first-party SNT by operation of law, triggering the Medicaid payback and (if over 65) the age problem. Third-party SNTs must be funded exclusively with the funder's own assets — never commingle.",
      "Distributing cash to the beneficiary. Cash directly to the beneficiary is unearned income and reduces SSI dollar-for-dollar. Pay third parties directly for goods and services — grocery store, pharmacy, landlord — never write a check to the beneficiary.",
      "Paying rent or utilities from the SNT. Shelter distributions trigger the PMV reduction of up to one-third SSI FBR ($331 in 2026) plus $20 general income exclusion. Total SSI reduction can be ~$311/month. Non-shelter housing costs (repairs, homeowners insurance, HOA fees) are safer than rent/mortgage.",
      "Self-drafting an SNT. SSI and Medicaid regulators routinely reject self-drafted SNTs, disqualifying the beneficiary from benefits. Every SNT must be drafted by an attorney experienced in special-needs planning — the state Medicaid agency and Social Security review the trust document.",
      "Forgetting food is no longer ISM. Under 89 FR 21199 effective September 30, 2024, food no longer counts as in-kind support and maintenance. SNTs can now pay for groceries and restaurant meals without reducing SSI — this is still novel and many older SNT operating manuals have not been updated.",
    ],
    workedExample:
      "Consider a 12-year-old child with autism receiving SSI and Medicaid whose grandparent wants to leave $250,000 for the child's benefit. The recommended trust is a third-party SNT because the grandparent is funding with her own money, not the child's. There is no age limit and no Medicaid payback — remainder at the child's death passes to whomever the grandparent names (typically siblings). Setup cost: $2,500-$5,000 for a standalone third-party SNT drafted by a special-needs attorney. The trust can pay for therapy not covered by Medicaid, private-school tuition, adaptive equipment, vacations, and (as of 9/30/2024) food. It cannot pay cash to the beneficiary or pay rent/utilities without triggering the PMV reduction. If the grandparent instead planned to fund only $50,000, a pooled third-party SNT would be more cost-effective at $500-$1,500 setup.",
    faqs: [
      {
        question: "What is a special needs trust calculator?",
        answer:
          "A special needs trust calculator helps identify which of the three federally-authorized SNT types (first-party under 42 U.S.C. §1396p(d)(4)(A), third-party under POMS SI 01120.200, pooled under §1396p(d)(4)(C)) fits your situation based on the beneficiary's age, funding source, current benefits, and funding amount. It estimates typical setup costs ($500-$5,000 depending on type), shows whether Medicaid payback applies, and lists what the trust can and cannot pay for.",
      },
      {
        question: "First-party vs third-party SNT — what's the difference?",
        answer:
          "A first-party SNT under 42 U.S.C. §1396p(d)(4)(A) holds the beneficiary's own money (personal injury settlement, back SSDI, direct inheritance). The beneficiary must be under 65 at establishment, and Medicaid payback is required at death. A third-party SNT is funded by someone else (parents, grandparents, siblings) with their own assets — no age limit, no Medicaid payback, remainder passes to family beneficiaries you name. Third-party is the preferred vehicle when family is doing the planning.",
      },
      {
        question: "What is a pooled special needs trust?",
        answer:
          "A pooled SNT under 42 U.S.C. §1396p(d)(4)(C) is run by a nonprofit that pools multiple beneficiaries' sub-accounts for investment purposes while keeping each account separate for distribution. Setup ranges $500-$1,500 versus $2,500-$5,000 for standalone trusts. Pooled is common when funding is modest (under $100,000), when the beneficiary is 65+ using their own money (the only option available), or when the family has no natural trustee. In most states, funding a pooled SNT after age 65 triggers a Medicaid transfer penalty.",
      },
      {
        question: "How much does it cost to set up a special needs trust?",
        answer:
          "Standalone first-party or third-party SNTs run $2,500-$5,000 in setup fees drafted by an attorney experienced in special-needs planning, with higher fees in high-cost markets (Manhattan, San Francisco, Boston). Pooled SNTs run $500-$1,500 for the joinder agreement plus a nonprofit enrollment fee. Ongoing administration adds a professional trustee fee of roughly 1% of assets per year plus tax preparation ($500-$1,500/year). Self-drafting is not viable — Medicaid and SSA routinely reject self-drafted SNTs.",
      },
      {
        question: "Does an SNT affect SSI or Medicaid?",
        answer:
          "No, if properly drafted. Assets in an SNT are not countable resources under POMS SI 01120.200 for SSI or under equivalent state Medicaid rules. Distributions are treated per SSI ISM (in-kind support and maintenance) rules: food distributions no longer count (89 FR 21199, effective 9/30/2024); shelter distributions trigger PMV reduction of up to one-third SSI FBR ($331 in 2026) plus $20 general income exclusion; cash to the beneficiary is unearned income and reduces SSI dollar-for-dollar. Third-party payments for medical care, therapy, transportation, education, vacations, and non-shelter expenses are safe.",
      },
      {
        question: "What can a special needs trust pay for?",
        answer:
          "SNTs can pay third parties directly for: medical care not covered by Medicaid, therapy (physical, occupational, speech), transportation and adaptive vehicles, education and tutoring, vacations and entertainment, personal care attendants beyond what Medicaid covers, electronics and internet, pets and hobbies, and (as of 9/30/2024) food. SNTs cannot: give cash to the beneficiary (reduces SSI dollar-for-dollar); pay rent, mortgage, utilities, or property taxes without triggering PMV (up to ~$311/mo SSI reduction). Structure distributions through third-party payment, never through the beneficiary.",
      },
    ],
    sources: [
      { label: "42 U.S.C. §1396p(d)(4) — SNT authorization statute", url: "https://www.ssa.gov/OP_Home/ssact/title19/1917.htm" },
      { label: "SSA POMS SI 01120.200 — Trusts (third-party SNT)", url: "https://secure.ssa.gov/poms.nsf/lnx/0501120200" },
      { label: "SSA POMS SI 01120.199 — Special Needs Trusts (self-settled)", url: "https://secure.ssa.gov/poms.nsf/lnx/0501120199" },
      { label: "89 FR 21199 — Food removed from ISM (effective 9/30/2024)", url: "https://www.federalregister.gov/documents/2024/03/27/2024-06464" },
      { label: "Academy of Special Needs Planners (ASNP)", url: "https://www.specialneedsplanners.com/" },
    ],
    toolHeading: "Recommend a special needs trust type",
    toolSubheading: "Beneficiary age + funding source + current benefits + funding amount → recommended SNT type, setup cost, and benefits impact.",
    preset: {
      beneficiaryAge: 12,
      fundingSource: "family-member",
      benefitStatus: "ssi",
      fundingAmount: 250_000,
    },
    relatedSlugs: ["medicaid-spend-down-calculator", "long-term-care-cost-calculator"],
  },

  {
    calculator: "elder-care",
    slug: "long-term-care-cost-calculator",
    islandId: "long-term-care-cost",
    title: "Long-Term Care Cost Calculator: Nursing Home, Assisted Living, Home Care",
    metaDescription:
      "Free long-term care cost calculator. Projected nursing home, assisted living, and home aide cost by state + inflation + Medicare gap + Medicaid likelihood.",
    targetKeyword: "long term care cost calculator",
    estimatedVolume: 6600,
    estimatedKD: 28,
    h1: "Long-Term Care Cost Calculator: What It Costs and Who Pays",
    intro:
      "A long-term care cost calculator projects what nursing home, assisted living, or home health aide care will cost when you actually need it — not today. 2024 Genworth Cost of Care Survey medians, projected forward at 4.5% annual inflation (LTC's historical rate), put 2026 US-median nursing home private room at $132,000/year, assisted living at $68,000/year, and a home health aide (44 hr/wk) at $76,000/year. Alaska is the highest at 2.19× national median; Mississippi and Louisiana are the lowest at ~0.71×. Because most people need care 10-20 years from now and LTC inflates faster than general CPI, the projected cost at start age is often 50-100% higher than today's price. Medicare covers exactly zero custodial care; its Skilled Nursing Facility benefit maxes out at 100 days after a qualifying 3-night hospital stay. Everything else — assisted living, home aide, and nursing home stays past day 100 — comes from personal savings, LTC insurance, or Medicaid after spend-down.",
    howItWorks:
      "The calculator starts with the Genworth 2024 national median for your care type (nursing home private $118,000, semi-private $103,000, assisted living $61,000, home health aide $68,000, adult day care $23,000 in 2024 dollars) and projects to 2026 at 4.5% annual inflation. It then applies a state cost factor from the Genworth state-median table — Alaska 2.19×, Massachusetts 1.51×, New York 1.48×, Connecticut 1.42×, Minnesota 1.36×, Hawaii 1.35× at the high end; Mississippi 0.71×, Louisiana 0.72×, Arkansas 0.73×, Alabama 0.75×, Oklahoma 0.78% at the low end. From today's cost, we project forward to the start-of-care age using the same 4.5% inflation rate, then sum inflated annual costs over the expected care duration.\n\nFunding-gap analysis compares projected monthly cost against your monthly income (Social Security + pension) and LTC insurance benefit (if any). LTC insurance daily benefits typically pay $150-$300/day, capped at policy limits; the calculator applies the smaller of the actual monthly cost or the LTC daily benefit × 30.42. Monthly shortfall × 12 × care years = total shortfall. Then we ask whether your liquid assets cover that shortfall — years of coverage = assets ÷ annual shortfall. If assets cover less than half the care period, Medicaid planning is likely required — start the 5-year Medicaid Asset Protection window now.\n\nMedicare coverage is a common blind spot. Medicare Part A pays 100% of a Skilled Nursing Facility stay for days 1-20 after a qualifying 3-night hospital admission, then $209.50/day copay (2026 projected) for days 21-100. Day 101: $0 Medicare coverage. Medicare does not cover assisted living, home aide, or custodial nursing home care ever. LTC insurance triggers on 2-of-6 ADLs (bathing, dressing, transferring, toileting, continence, eating) or cognitive impairment per HIPAA §7702B(c). Medicaid pays for nursing home care after spend-down under 42 U.S.C. §1396a; it pays for assisted living and home care in states with Home and Community-Based Services (HCBS) waivers.",
    commonMistakes: [
      "Using today's cost instead of inflated future cost. LTC inflates at ~4.5%/year — a $68,000/year assisted living today will cost $132,000/year in 15 years. Planning based on today's price undershoots by 50-100%.",
      "Assuming Medicare covers long-term care. Medicare Part A covers Skilled Nursing Facility ONLY, up to 100 days, only after a qualifying 3-night hospital stay. Medicare covers zero assisted living, zero long-term home aide, and zero custodial nursing home care past day 100.",
      "Ignoring state cost differences. Same nursing home service costs $290,000/year in Alaska and $87,000/year in Mississippi. National-median planning is misleading — use your actual state.",
      "Overestimating LTC insurance coverage. Policies typically pay $150-$300/day (median $200), capped at 3-5 years total or $150k-$300k lifetime max. If cost is $360/day and policy pays $200/day, the $160/day gap is out-of-pocket for the entire care period.",
      "Waiting too long to start Medicaid planning. Any transfer within 60 months of application triggers a penalty under 42 U.S.C. §1396p(c). If projected shortfall is high, a Medicaid Asset Protection Trust or protected transfers should be funded 5+ years before care is needed.",
      "Ignoring Home and Community-Based Services waivers. Many states pay for assisted living or home care through HCBS waivers — Medicaid can pay for these settings, not just nursing home, but eligibility and waitlists vary widely.",
    ],
    workedExample:
      "A 62-year-old in Florida planning for assisted living in 15 years for a projected 4 years of care. Genworth 2024 Florida assisted living median: $58,100/year. Project to 2026 at 4.5%: $63,500/year today (Florida factor 0.95). Project forward 15 years to age 77: $63,500 × 1.045^15 = $122,900/year. Sum 4 years at continued 4.5% inflation: $528,000 total projected cost. Monthly cost at year 1: $10,240. Monthly income (Social Security $2,400 + pension $800 = $3,200) leaves a $7,040/mo shortfall — $84,500/year. Over 4 years, total shortfall projects to $360,000. With $400,000 in liquid assets, coverage is 4.7 years — barely enough. Medicaid likelihood: LOW-to-MEDIUM. Recommendation: consider LTC insurance now (age 62 premiums are still affordable) or a hybrid life insurance with LTC rider to hedge the shortfall risk.",
    faqs: [
      {
        question: "What is a long-term care cost calculator?",
        answer:
          "A long-term care cost calculator projects the total cost of nursing home, assisted living, home health aide, or adult day care over your expected care period. It uses Genworth 2024 Cost of Care Survey state medians, applies your state's cost factor (Alaska 2.19× to Mississippi 0.71×), projects forward using 4.5% annual inflation (LTC's historical rate), and compares projected cost to your income, LTC insurance benefit, and liquid assets to identify the funding gap and Medicaid likelihood.",
      },
      {
        question: "How much does long-term care cost in 2026?",
        answer:
          "US-median projected costs for 2026: nursing home private room $132,000/year ($361/day), nursing home semi-private $115,000/year, assisted living $68,000/year ($5,668/month), home health aide 44 hr/wk $76,000/year ($33/hour), adult day care $25,000/year ($95/day). These are projected from the 2024 Genworth Cost of Care Survey at 4.5% annual inflation. State variation is dramatic — Alaska runs 2.19× national median, Mississippi 0.71×.",
      },
      {
        question: "Does Medicare pay for long-term care?",
        answer:
          "Essentially no. Medicare Part A covers Skilled Nursing Facility (SNF) care ONLY, up to 100 days, and only after a qualifying 3-night hospital admission. Days 1-20 are fully covered; days 21-100 have a $209.50/day copay (2026 projected from CMS Part A deductible). Day 101 onward: $0 Medicare coverage. Medicare does not cover assisted living, long-term home aide, or custodial nursing home care at any point. For those, funding comes from personal savings, LTC insurance, Medicaid (after spend-down), or Home and Community-Based Services waivers.",
      },
      {
        question: "How much long-term care insurance do I need?",
        answer:
          "Enough daily benefit to bridge the gap between projected monthly cost and monthly income + Social Security + pension, over your expected care duration. Median 2026 assisted living cost is $186/day; nursing home private $361/day. If income covers half, the LTC policy should pay at least $100-$200/day for assisted living or $200-$300/day for nursing home. Policies typically max at 3-5 years or $150k-$300k lifetime. Check the ADL trigger: HIPAA §7702B(c) requires 2 of 6 ADLs (bathing, dressing, transferring, toileting, continence, eating) or cognitive impairment.",
      },
      {
        question: "Should I self-fund or buy LTC insurance?",
        answer:
          "Depends on projected shortfall vs assets. If assets cover less than 50% of projected shortfall, you're likely headed for Medicaid — LTC insurance makes sense to avoid or delay spend-down. If assets cover 50-100%, hybrid strategies (LTC rider on life insurance, partnership LTC policy) may fit — partnership policies add asset protection above the policy benefit paid under Deficit Reduction Act §6021. If assets fully cover, self-funding with proper investment planning is usually cheaper. Long-term care insurance premiums have risen sharply since 2018; obtain quotes before assuming coverage.",
      },
      {
        question: "How does Medicaid pay for long-term care?",
        answer:
          "Medicaid pays for nursing home care after spend-down under 42 U.S.C. §1396a — you must be below the state asset limit ($2,000 federal, $130,000 CA, $33,038 NY) and below the institutional income cap ($2,982/mo in 2026 income-cap states, or spend-down income to the state's MNIL in medically-needy states). Home and Community-Based Services (HCBS) waivers pay for assisted living or home care in many states, but eligibility rules, service caps, and waitlists vary. The 5-year lookback under 42 U.S.C. §1396p(c) reviews transfers before application.",
      },
    ],
    sources: [
      { label: "Genworth 2024 Cost of Care Survey", url: "https://www.genworth.com/aging-and-you/finances/cost-of-care.html" },
      { label: "42 U.S.C. §1396a — Medicaid state plan requirements", url: "https://www.ssa.gov/OP_Home/ssact/title19/1902.htm" },
      { label: "CMS Medicare Skilled Nursing Facility coverage", url: "https://www.medicare.gov/coverage/skilled-nursing-facility-snf-care" },
      { label: "IRS §7702B — Qualified long-term care insurance", url: "https://www.law.cornell.edu/uscode/text/26/7702B" },
      { label: "Deficit Reduction Act §6021 — Partnership LTC policies", url: "https://www.medicaid.gov/medicaid/long-term-services-supports/long-term-services-supports-partnerships-for-long-term-care/index.html" },
    ],
    toolHeading: "Project your long-term care cost",
    toolSubheading: "Care type + state + years until care + duration + income + LTC insurance + assets → projected cost, funding gap, Medicaid likelihood.",
    preset: {
      careType: "assisted-living",
      state: "florida",
      currentAge: 62,
      yearsUntilCare: 15,
      expectedYearsOfCare: 4,
      monthlySocialSecurity: 2_400,
      monthlyPension: 800,
      hasLTCInsurance: false,
      ltcInsuranceDailyBenefit: 0,
      otherLiquidAssets: 400_000,
    },
    relatedSlugs: ["medicaid-spend-down-calculator", "special-needs-trust-calculator"],
  },
];
