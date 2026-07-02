import type { SpokeEntry } from "./types";

// Probate spokes. Legal pillar (attorney-reviewer byline + LegalDisclaimer).
// Powered by src/lib/probate-hub.ts + per-spoke engines (probate-fee, probate-timeline,
// probate-vs-trust). Grounded in state probate codes (Cal. Prob. Code §10810 statutory fee,
// Fla. Stat. §733.6171, Iowa Code §633.197, Mo. Rev. Stat. §473.153, plus reasonable-fee
// jurisdictions), Uniform Probate Code adoption data, and state small-estate thresholds.
// Per-page keyword-gap-pass Phase 3 authoring + Phase 4 audit.

export const PROBATE_SPOKES: SpokeEntry[] = [
  {
    calculator: "probate",
    slug: "fee-calculator",
    islandId: "probate",
    title: "Probate Fee Calculator: Attorney + Executor + Court Costs",
    metaDescription:
      "Free probate fee calculator. See attorney fees (statutory in 9 states) plus executor commission and court costs by state, with living-trust savings.",
    targetKeyword: "probate fee calculator",
    estimatedVolume: 3200,
    estimatedKD: 30,
    h1: "Probate Fee Calculator: What Probate Actually Costs by State",
    intro:
      "A probate fee calculator shows the actual attorney and executor fees your estate will owe based on where you live. Nine states set fees by statute: California's Cal. Prob. Code §10810 tiered schedule (4%/3%/2%/1%/0.5%), Florida's Fla. Stat. §733.6171 stepped-base plus percentages, and 7 others including Iowa, Missouri, Montana, New York (executor only), Wyoming, Arkansas, Oklahoma, and New Jersey (executor only). The remaining ~41 states use a reasonable-fee model at roughly 2-4% of gross estate. For a $750,000 California moderate probate, statutory fees alone come to about $18,000 in attorney fees plus another $18,000 for the executor — a $36,000 total that a $2,000-$6,750 revocable living trust would have avoided entirely.",
    howItWorks:
      "Probate fees have four components. First, attorney fees. California, Florida, Iowa, Missouri, Montana, New York (executor only under SCPA §2307), Wyoming, Arkansas, Oklahoma, and New Jersey (executor only under N.J.S.A. §3B:18-14) set statutory percentage schedules — the calculator applies them precisely. The other ~41 states use a reasonable-fee model at 2-4% of gross estate for uncontested probate. Second, executor commission — California, Iowa, and Wyoming let the executor and attorney EACH claim the same statutory percentage, roughly doubling the total statutory bill. Third, court filing fees plus publication of notice to creditors plus certified copies, running $400-$1,500 uncontested. Fourth, ancillary probate for out-of-state real property, running $2,000-$8,000 per additional state.\n\nOne detail most probate fee tools miss: the fee base is GROSS estate value, not net of debts. A $750,000 house with a $500,000 mortgage still counts as $750,000 for California statutory fee purposes — that's why probate fees can consume such a large share of what heirs actually inherit. The calculator above computes both the fee and the corresponding [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) comparison so you can see whether trust planning would have paid off.\n\nEvery state has a small-estate procedure that lets estates under a threshold skip full probate. California's threshold is $208,850 (indexed 2025); Arizona expanded to $200,000 personal / $300,000 real in September 2025; Oregon's is $275,000 combined. The calculator flags when your estate qualifies for these simplified procedures — fees drop to under $1,000 and timeline shortens to weeks.",
    commonMistakes: [
      "Assuming statutory percentages apply only to net estate. California's Cal. Prob. Code §10810 fee is based on GROSS estate inventory + gains − losses, NOT net of debts. A house with a large mortgage still counts at full value for the fee schedule.",
      "Forgetting the executor gets the same percentage. In California (§10800), Iowa (§633.197), and Wyoming (§2-7-803), the executor is entitled to the SAME statutory schedule as the attorney — total statutory bill roughly doubles.",
      "Missing the small-estate procedure. Estates under the state threshold (CA $208,850, TX $75k, NY $50k personal property, OR $275k combined) can skip full probate for a fraction of the cost.",
      "Ignoring extraordinary services. Cal. Prob. Code §10811 and every state's equivalent allow additional court-approved fees for sale of real estate, tax proceedings, will contests, and other non-routine work — often adding $5,000-$25,000+.",
      "Forgetting ancillary probate. Real estate in a state other than the decedent's domicile triggers a separate probate in that state ($2,000-$8,000 extra per state) — a revocable trust avoids this entirely.",
      "Treating the fee as inevitable. A revocable living trust drafted during life ($1,500-$5,000, $5,000-$10,000+ in California/HNW) sidesteps the whole attorney-executor-court stack.",
    ],
    workedExample:
      "Take the calculator's default: a $750,000 California moderate probate (uncontested, one property). Under Cal. Prob. Code §10810 statutory schedule: 4% of first $100k ($4,000) + 3% of next $100k ($3,000) + 2% of next $550k ($11,000) = $18,000 in attorney fees. Under §10800, the executor is entitled to the same $18,000. Court filing plus publication plus certified copies: about $600-$1,500. Total: roughly $36,600-$37,500 in statutory + court costs, running over 12-24 months due to California's 4-month creditor claim period (§9100) and urban court backlogs. Compare to a California revocable living trust: $2,025-$6,750 setup cost using our state cost multiplier. Net savings if the trust had been in place: $30,000-$35,000 plus 12+ months of estate settlement time.",
    faqs: [
      {
        question: "What is a probate fee calculator?",
        answer:
          "A probate fee calculator estimates the attorney fees, executor commission, court costs, and any ancillary probate fees your estate will owe. It applies actual state statutory schedules where they exist (9 states) and market-typical percentages for reasonable-fee states (the other ~41). Inputs: state, gross estate value, complexity, and additional states with real property. Output: total cost breakdown plus a comparison to a revocable living trust that would have avoided probate.",
      },
      {
        question: "How much are probate fees in California?",
        answer:
          "California statutory probate fees follow Cal. Prob. Code §10810: 4% of the first $100,000, 3% of the next $100,000, 2% of the next $800,000, 1% of the next $9 million, 0.5% of the next $15 million. Both the attorney (§10810) and executor (§10800) are entitled to the SAME schedule, so total statutory fees roughly double. On a $500,000 gross estate: attorney $13,000, executor $13,000, total statutory $26,000 plus court costs. On a $1M estate: $23,000 each = $46,000. Extraordinary services (sale of real estate, will contests, tax proceedings) add more under §10811.",
      },
      {
        question: "What are Florida probate fees?",
        answer:
          "Florida attorney fees are presumed reasonable under Fla. Stat. §733.6171 with a stepped schedule: $1,500 for estates up to $40,000, plus $750 at $70,000, plus $750 at $100,000, then 3% of the excess over $100,000 up to $1M, 2.5% next $2M, 2% next $2M, 1.5% next $5M, 1% over $10M. Personal representative commission is separate under §733.617: 3% first $1M, 2.5% next $4M, 2% next $5M, 1.5% over $10M. Summary administration under §735.201 (estate ≤ $75,000 or death 2+ years old) is a fast, low-fee alternative.",
      },
      {
        question: "Are probate fees based on net or gross estate?",
        answer:
          "GROSS estate value in statutory-fee states — not net of debts. California's Cal. Prob. Code §10810 uses inventory appraisal plus gains on sales minus losses; it does NOT deduct the mortgage on real property. So a $500,000 house with a $400,000 mortgage still counts as $500,000 for the fee schedule. This is why probate can consume such a large share of what heirs actually inherit, and why the living-trust math wins so decisively for real-estate-heavy estates.",
      },
      {
        question: "Do all states have statutory probate fees?",
        answer:
          "No — only 9 states set statutory schedules: California (Cal. Prob. Code §10810), Florida (Fla. Stat. §733.6171 + §733.617), Iowa (Iowa Code §633.197/198), Missouri (§473.153), Montana (§72-3-631), New York (SCPA §2307 executor only), Wyoming (§2-7-803/804), Arkansas (§28-48-108), Oklahoma (tit. 58 §527), and New Jersey (§3B:18-14 executor only). The other ~41 states use a 'reasonable fee' model with court approval on contested cases and market-typical rates (2-4% of gross estate) on uncontested cases.",
      },
      {
        question: "How can I reduce probate fees?",
        answer:
          "Five ways: (1) A revocable living trust set up during life — assets in the trust bypass probate entirely, saving the full attorney + executor + court stack; (2) Transfer-on-death deeds for real estate (available in ~30 states) avoid ancillary probate on out-of-state property; (3) Pay-on-death designations on bank/brokerage accounts pass directly to beneficiaries; (4) Joint tenancy with rights of survivorship on real estate passes automatically at first death; (5) If already in probate, qualify for the state's small-estate procedure (threshold varies by state) to bypass full formal probate. See our [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) for the trust setup cost by state.",
      },
    ],
    sources: [
      { label: "Cal. Prob. Code §10810 — attorney statutory schedule", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=10810&lawCode=PROB" },
      { label: "Fla. Stat. §733.6171 — attorney presumed reasonable", url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0733/Sections/0733.6171.html" },
      { label: "Iowa Code §633.197 — executor commission", url: "https://www.legis.iowa.gov/docs/code/633.197.pdf" },
      { label: "Mo. Rev. Stat. §473.153 — statutory fee", url: "https://revisor.mo.gov/main/OneSection.aspx?section=473.153" },
      { label: "NY SCPA §2307 — executor commissions", url: "https://www.nysenate.gov/legislation/laws/SCP/2307" },
      { label: "American College of Trust and Estate Counsel (ACTEC)", url: "https://www.actec.org/" },
    ],
    toolHeading: "Estimate your probate fees",
    toolSubheading: "State + estate value + complexity → attorney + executor + court fees, plus what a living trust would have saved.",
    preset: {
      state: "california",
      estateValue: 750_000,
      complexity: "moderate",
      ancillaryStates: 0,
    },
    relatedSlugs: ["timeline-calculator", "cost-vs-trust-calculator"],
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
    calculator: "probate",
    slug: "timeline-calculator",
    islandId: "probate",
    title: "Probate Timeline Calculator: Months to Close by State",
    metaDescription:
      "Free probate timeline calculator. See how many months probate takes by state — CA 12-24, TX 3-6, UPC states 4-8, plus ancillary probate impact.",
    targetKeyword: "probate timeline calculator",
    estimatedVolume: 2600,
    estimatedKD: 28,
    h1: "Probate Timeline Calculator: How Long Probate Takes by State",
    intro:
      "A probate timeline calculator shows how many months an uncontested estate takes to close in your state. Texas independent administration under Tex. Est. Code §401.001 closes fastest (3-6 months). Uniform Probate Code informal states — Utah, Colorado, Arizona, Minnesota, Idaho — close in 4-8 months. California takes 12-24 months because Cal. Prob. Code §9100 sets a 4-month creditor claim period plus urban court backlogs. New York Surrogate's Court runs 12-24 months for anything beyond voluntary administration (SCPA Article 13, personal property under $50,000). Contested probate runs 2-5 years everywhere. For a moderate California estate with one property to probate, expect 15-30 months to close.",
    howItWorks:
      "Probate timeline has three main drivers. First, the state's creditor claim window — 2 months in Texas independent administration, 4 months in California (§9100) and most UPC states, 7 months in New York with published notice, and up to 12 months in states with longer unknown-creditor tails. Second, court backlog — urban California (LA, San Francisco, Orange County), New York City boroughs, and Chicago move slowly; rural counties in most states move faster. Third, complexity — real estate adds 3-6 months (title search, appraisal, sale); contested probate stretches to 2-5 years.\n\nSmall-estate procedures skip almost all of this. California's affidavit under Cal. Prob. Code §13100 (for estates ≤ $208,850, indexed 2025) processes in weeks. Texas small-estate affidavit closes in 30-45 days. Every state has some form of simplified procedure, with thresholds ranging from $15,000 (Rhode Island) to $275,000 (Oregon) to $200,000 (Arizona, Iowa, Wyoming).\n\nAncillary probate — a separate proceeding in each state where the decedent owned real property outside their domicile — adds 6-12 months per additional state. A revocable living trust holds title to all real property in the trust's name, so nothing dies with the grantor and no ancillary probate is triggered. That's why cross-state real estate owners disproportionately use living trusts.\n\nOne timing detail most timeline tools miss: the creditor claim window doesn't start until notice is properly published and mailed. In California, if the personal representative delays publication by 3 months, the entire timeline shifts by 3 months. Get a lawyer moving on the initial paperwork within 30 days of death and the process runs on the state's schedule; delay and it stretches.",
    commonMistakes: [
      "Assuming probate can be rushed. Statutory creditor claim windows (2-12 months by state) are hard floors — a court can't shorten them even with fast filing.",
      "Waiting to publish creditor notice. In California, the 4-month §9100 window doesn't start until notice is published; a 3-month delay adds 3 months to timeline.",
      "Not applying for a small-estate procedure. California's §13100 affidavit processes in weeks for estates ≤ $208,850 — but you have to apply; the court won't offer it.",
      "Underestimating ancillary probate. Each additional state with real property adds 6-12 months. Two states of ancillary can add over a year.",
      "Forgetting Texas independent administration. Tex. Est. Code §401.001 makes independent administration the default in most Texas estates, and it closes in 3-6 months — a major advantage over states without the option.",
      "Not planning for contested cases. Once probate is contested, the timeline stretches to 2-5 years and costs escalate 5-10×. Preventive drafting (clear will, no-contest clause) is much cheaper than post-death litigation.",
    ],
    workedExample:
      "Take the calculator's default: a $750,000 California moderate estate with one property, uncontested. Base California timeline: 12-24 months from Cal. Prob. Code §9100's 4-month creditor claim period plus urban court backlog. Moderate complexity (real estate) adds 3-6 months. Total: 15-30 months to close. Compare to Texas independent administration on the same estate: 3-6 months base + 3-6 months for real estate = 6-12 months total. Compare to Colorado UPC informal probate: 4-8 months base + 3-6 months = 7-14 months total. The 3× timeline gap between California and Texas on identical estates is why cross-state estate planning often defaults to a revocable living trust — same $2,000-$6,750 setup cost, no probate timeline in either state.",
    faqs: [
      {
        question: "How long does probate take?",
        answer:
          "Uncontested probate takes 6-12 months in most states, 9-18 months with real estate, 12-24 months in California and New York, and 3-6 months in Texas (independent administration under Tex. Est. Code §401.001). Uniform Probate Code informal states (Utah, Colorado, Arizona, Minnesota, Idaho) close in 4-8 months typically. Contested probate — will contests, creditor litigation, fiduciary disputes — takes 2-5 years everywhere. Small-estate procedures bypass full probate and close in weeks.",
      },
      {
        question: "Why does probate take so long in California?",
        answer:
          "Two reasons. First, Cal. Prob. Code §9100 sets a 4-month creditor claim period after published notice is required for every California probate — a hard floor. Second, urban California courts (Los Angeles, San Francisco, Orange County, San Diego) run 3-6 month backlogs on hearings, and complex cases queue behind them. Simple California estates close in 12-15 months; anything with real estate stretches to 15-24 months; contested cases run 3-5 years. Small-estate affidavit under §13100 (for estates ≤ $208,850) processes in weeks instead.",
      },
      {
        question: "How can I speed up probate?",
        answer:
          "Six ways: (1) File the petition within 30 days of death — don't sit on paperwork; (2) Publish creditor notice immediately — the statutory window doesn't start until notice runs; (3) Apply for a small-estate procedure if the estate qualifies (thresholds vary by state); (4) Use independent administration where available (Texas, Ohio some cases) — no court oversight of routine acts; (5) Use informal probate under the Uniform Probate Code if in a UPC state (UT, CO, AZ, MN, ID, others); (6) Move probate to a rural county if the decedent had residence flexibility.",
      },
      {
        question: "What is the fastest state for probate?",
        answer:
          "Texas independent administration is the fastest at 3-6 months uncontested. Utah UPC informal probate follows at 4-8 months. Colorado, Minnesota, Arizona, and Idaho (all UPC states) run 4-8 months. Small-estate procedures across every state process in weeks for qualifying estates. The slowest states are California and New York, both 12-24 months for standard cases.",
      },
      {
        question: "How much time does ancillary probate add?",
        answer:
          "Ancillary probate — a separate proceeding in each state where the decedent owned real property outside their domicile — adds 6-12 months per additional state, plus $2,000-$8,000 per state. Two states of ancillary probate can add over a year. Florida (Fla. Stat. §734.102) and California (Prob. Code §12500 et seq.) have simplified ancillary procedures for out-of-state domiciled decedents. A revocable living trust holds all real property in the trust's name so nothing triggers ancillary probate at death.",
      },
      {
        question: "How long does contested probate take?",
        answer:
          "Contested probate — will contests, creditor litigation, fiduciary breach disputes — takes 2-5 years virtually everywhere. Costs escalate 5-10× the uncontested baseline: $50,000-$500,000+ in attorney fees is common on contested estates. Preventive drafting is much cheaper than post-death litigation: a no-contest clause (in-terrorem provision) in a will or trust reduces contest incentive because contesting beneficiaries forfeit their bequest.",
      },
    ],
    sources: [
      { label: "Cal. Prob. Code §9100 — creditor claim period", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=9100&lawCode=PROB" },
      { label: "Cal. Prob. Code §13100 — small-estate affidavit", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=13100&lawCode=PROB" },
      { label: "Tex. Est. Code §401.001 — independent administration", url: "https://statutes.capitol.texas.gov/Docs/ES/htm/ES.401.htm" },
      { label: "NY SCPA Article 13 — voluntary administration", url: "https://www.nysenate.gov/legislation/laws/SCP/A13" },
      { label: "Uniform Law Commission — Uniform Probate Code", url: "https://www.uniformlaws.org/" },
    ],
    toolHeading: "Estimate your probate timeline",
    toolSubheading: "State + estate value + complexity → months to close, plus small-estate flag and ancillary impact.",
    preset: {
      state: "california",
      estateValue: 750_000,
      complexity: "moderate",
      ancillaryStates: 0,
    },
    relatedSlugs: ["fee-calculator", "cost-vs-trust-calculator"],
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
    calculator: "probate",
    slug: "cost-vs-trust-calculator",
    islandId: "probate",
    title: "Probate vs Living Trust Cost Calculator: The Real Math",
    metaDescription:
      "Probate vs living trust cost calculator. See what probate would cost your estate now versus setting up a revocable living trust today.",
    targetKeyword: "probate vs living trust calculator",
    estimatedVolume: 1800,
    estimatedKD: 26,
    h1: "Probate vs Living Trust: What It Actually Costs to Skip Probate",
    intro:
      "A probate-vs-living-trust calculator shows the exact tradeoff: what probate will cost your estate at death (attorney fees, executor commission, court costs, ancillary probate) versus what a revocable living trust would cost to set up during life ($1,500-$5,000 attorney, $499-$599 online). The calculator above computes both sides for your specific state and estate value. For a $750,000 California moderate estate, probate runs $36,000-$42,000 over 15-30 months; a California revocable living trust runs $2,025-$6,750 today. Net savings by setting up the trust now: $30,000-$40,000 plus 12+ months of estate settlement time.",
    howItWorks:
      "The math almost always favors the trust once you're above the state's small-estate threshold. Attorney-drafted revocable living trust runs $1,500-$5,000 in most states, $5,000-$10,000+ in California and other high-cost/HNW metros; online tools like Trust & Will ($499 individual / $599 couple) work for straightforward cases. Add $500-$2,000 for trust funding (retitling deeds and accounts). Total trust setup: $2,000-$8,000 most cases.\n\nProbate cost varies by state statute. California under Cal. Prob. Code §10810 charges attorney AND executor each the same tiered percentage (4%/3%/2%/1%/0.5%) — a $750,000 estate faces $36,000 in statutory fees alone. Florida under Fla. Stat. §733.6171 charges a stepped attorney fee ($1,500 base + tiered percentages) plus a separate personal-representative commission under §733.617. New York charges statutory executor commission under SCPA §2307 (5%/4%/3%/2.5%/2%) plus reasonable attorney fees at 2-4% of gross estate. The other ~41 states use a reasonable-fee model at roughly 2-4% for both attorney and executor.\n\nOne pattern the calculator surfaces cleanly: for real-estate-heavy estates, the trust math wins by wider margins than most people expect. Probate fees are based on GROSS estate (Cal. Prob. Code §10810 uses inventory before deducting the mortgage), so a $500,000 house with a $400,000 mortgage still counts as $500,000 for the fee schedule. A trust with the house properly titled avoids that entirely.\n\nWhat the trust doesn't save: estate tax. A revocable living trust doesn't reduce estate tax because you retained control. The 2026 federal exemption is $15M per individual (permanent under OBBBA P.L. 119-21) — see the [estate tax calculator](/estate-planning/estate-tax-calculator/) for federal + state exposure. For that you need irrevocable structures.",
    commonMistakes: [
      "Comparing trust setup to zero. The baseline is probate cost, not $0. In California, waiting to plan means paying $36,000+ at death instead of $2,025-$6,750 during life.",
      "Skipping trust funding. An unfunded trust provides zero probate protection — assets not titled to the trust still go through probate. Fund the trust immediately after drafting.",
      "Assuming a trust saves estate tax. It doesn't. A revocable trust is a probate-avoidance tool; estate tax planning requires irrevocable trusts (ILIT, dynasty, gifting trusts).",
      "Ignoring the timeline savings. Probate takes 6-24 months on top of dollar cost; a trust distributes in weeks. For heirs waiting on the estate to close, that timing matters.",
      "Assuming the small-estate procedure is 'free' probate. Small-estate affidavits still take weeks and $200-$1,000 in fees — but yes, if the estate qualifies (CA $208,850, AZ $200k, OR $275k), it's dramatically cheaper than full probate.",
      "Forgetting ancillary probate savings. Real property in multiple states triggers separate probate in each state at $2,000-$8,000 apiece — a trust holds all properties and eliminates that entirely.",
    ],
    workedExample:
      "Take the calculator's default: a $750,000 California moderate estate. Probate math: attorney statutory fee $18,000 (Cal. Prob. Code §10810: 4% × $100k + 3% × $100k + 2% × $550k), executor same $18,000 (§10800), court + publication $600-$1,500, total $36,600-$37,500 over 15-30 months. Trust math: California revocable living trust $2,025-$6,750 (attorney-drafted using state cost multiplier) + funding $500-$2,000, total $2,525-$8,750 done now. Net savings if the trust is in place at death: $28,000-$35,000 plus 12+ months of settlement time. Do the trust math for anything above the state's small-estate threshold (CA $208,850) and it wins virtually every time.",
    faqs: [
      {
        question: "Which is cheaper, probate or a living trust?",
        answer:
          "A living trust is dramatically cheaper for any estate above the state's small-estate threshold. Trust setup: $1,500-$5,000 attorney or $499-$599 online, done during life. Probate at death: 3-8% of gross estate (California statutory: attorney + executor each get the §10810 percentage schedule — total $36,000+ on a $750K estate; other states: 2-4% for each). For real-estate-heavy estates the gap widens because probate fees are on gross value, not net of mortgages. The trust also saves 6-24 months of estate settlement time.",
      },
      {
        question: "How much does a living trust save on probate?",
        answer:
          "For a $500,000 California estate, a $1,690-$6,750 trust saves roughly $26,000-$29,000 in probate fees (California statutory attorney + executor combined) plus 12-24 months of settlement time. For a $1M California estate, the savings jump to $40,000-$46,000. In Texas and other reasonable-fee states, the fee delta is smaller (2-4% vs trust setup cost) but timeline savings (Texas 3-6 months probate vs weeks for trust distribution) remain material.",
      },
      {
        question: "Does a living trust cost less than probate?",
        answer:
          "Almost always, if the estate is above the state's small-estate threshold. Trust setup cost is fixed ($1,500-$5,000 typical, $5,000-$10,000+ in California/HNW), paid once, during life. Probate cost is percentage-based on gross estate, paid at death. The break-even point is roughly the small-estate threshold in each state — below that, a small-estate affidavit is cheaper than a trust; above that, the trust wins.",
      },
      {
        question: "Should I do a living trust or just a will?",
        answer:
          "A will is enough if your estate is below the state's small-estate threshold (CA $208,850, AZ $200k, TX $75k, most other states $25k-$100k) and you don't own real property in multiple states. Above the threshold or with cross-state real estate, a revocable living trust is worth the $1,500-$5,000 setup cost. Both tools also need a durable POA and healthcare directive (bundled in most online packages). See the [living trust vs will comparison](/compare/living-trust-vs-will/) for the specific decision framework.",
      },
      {
        question: "Does a living trust save on estate tax too?",
        answer:
          "No — a revocable living trust does NOT reduce estate tax. Assets in a revocable trust remain in your taxable estate because you retained control. The 2026 federal exemption is $15M per individual (permanent under OBBBA P.L. 119-21) regardless of trust structure. Only irrevocable trusts move assets out of the taxable estate — see the [living trust cost calculator](/estate-planning/living-trust-cost-calculator/) for ILIT, MAPT, and dynasty trust costs. For estate tax exposure, use the [estate tax calculator](/estate-planning/estate-tax-calculator/).",
      },
      {
        question: "What about small estates?",
        answer:
          "Every state has a small-estate procedure that lets estates under a threshold skip full probate for a fraction of the cost. California's affidavit under §13100 works for estates ≤ $208,850 (indexed 2025). Arizona expanded to $200,000 personal / $300,000 real in September 2025. Oregon's threshold is $275,000 combined. Below those thresholds, a small-estate procedure processes in weeks for under $1,000 — cheaper than trust setup. Above them, the trust wins.",
      },
    ],
    sources: [
      { label: "Cal. Prob. Code §10810 — attorney statutory schedule", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=10810&lawCode=PROB" },
      { label: "LegalZoom — Cost to Set Up a Living Trust (2026)", url: "https://www.legalzoom.com/articles/cost-to-set-up-a-living-trust" },
      { label: "IRS — Estate Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" },
      { label: "American College of Trust and Estate Counsel (ACTEC)", url: "https://www.actec.org/" },
    ],
    toolHeading: "Estimate the probate vs trust tradeoff",
    toolSubheading: "State + estate value → probate cost now vs living trust cost today.",
    preset: {
      state: "california",
      estateValue: 750_000,
      complexity: "moderate",
      ancillaryStates: 0,
    },
    relatedSlugs: ["fee-calculator", "timeline-calculator"],
    // No state subpages — state selector is inside the tool (same as estate-tax-calculator pattern).
  },
];
