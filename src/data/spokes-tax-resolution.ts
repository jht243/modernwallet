import type { SpokeEntry } from "./types";

// Tax Resolution spokes. Powered by src/lib/tax-resolution-hub.ts (RCP formula, IA thresholds,
// CNC criteria) plus per-spoke engines added under src/lib/ (oic.ts, irs-payment-plan.ts,
// penalty-abatement.ts, back-taxes-impact.ts). CONTENT: keyword-gap-pass Phase 3 + Phase 4
// individually per page. See CONTENT.md + /keyword-gap-pass:phase-3-new-content and phase-4-audit.

export const TAX_RESOLUTION_SPOKES: SpokeEntry[] = [
  {
    calculator: "tax-resolution",
    slug: "offer-in-compromise-calculator",
    islandId: "oic",
    title: "Offer in Compromise Calculator: Estimate Your IRS Offer",
    metaDescription:
      "Free offer in compromise calculator. Enter your debt, assets, and income to see your IRS Reasonable Collection Potential — the minimum viable OIC amount.",
    targetKeyword: "offer in compromise calculator",
    estimatedVolume: 5400,
    estimatedKD: 42,
    h1: "Offer in Compromise Calculator: See Your IRS OIC Floor",
    intro:
      "An offer in compromise calculator applies the IRS's own math — Reasonable Collection Potential (RCP) — to show the minimum offer amount the IRS is likely to accept on your tax debt. The calculator above works the same way as IRS Form 656-B: Net Realizable Equity in your assets plus 12 months of remaining monthly income for a Lump-Sum Cash Offer, or 24 months for a Periodic Payment Offer. For someone owing $55,000 with $37,990 of Net Realizable Equity and $500 of remaining monthly income, the lump-sum RCP is $43,990 — about $11,010 below the debt, and a mathematically viable Offer in Compromise.",
    howItWorks:
      "The Reasonable Collection Potential is the IRS's core measure of what you can actually pay. Form 656-B splits it into two parts: Net Realizable Equity (NRE) in your assets plus your Remaining Monthly Income (RMI) times a multiplier. For a Lump-Sum Cash Offer, the multiplier is 12 — you're saying you'll pay in 5 or fewer installments within 5 months. For a Periodic Payment Offer, the multiplier is 24, spread over 6 to 24 months. If RCP is less than your tax debt, the IRS has a mathematical reason to accept less than the balance.\n\nThe asset-side numbers are not fair market value. Under IRM 5.8.5, the IRS discounts every asset class. Real estate is valued at 80% of its FMV (the 'quick-sale value') minus your mortgage. Vehicles are valued at 80% of FMV, and you get a $3,450 statutory exemption per vehicle for up to two vehicles. Retirement accounts are discounted to about 72% of balance to reflect income tax plus the 10% early-withdrawal penalty. Bank accounts count in full, minus one month of allowable living expenses set aside as a reserve. Taxable investments count at 100%. The calculator above applies these rules line by line — the asset breakdown card shows every step.\n\nThe income side is where most amateur OIC filings go wrong. The IRS does not compare your income to what you actually spend — it compares your income to what the IRS Collection Financial Standards say you're allowed to spend for housing, food, transportation, healthcare, and taxes based on your county and family size. If your actual spending exceeds those tables, the excess doesn't count. An OIC prepared without the Collection Financial Standards in hand routinely overestimates disposable income and undershoots the offer.\n\nThe $205 application fee is waived if your income is at or below 250% of the federal poverty guidelines (Low Income Certification on Form 656, Section 1). Low-income filers also skip the 20% lump-sum down payment and the monthly payments the IRS otherwise requires during processing. The IRS accepted 7,199 of 33,591 offers in FY2025 — a 21.4% acceptance rate — so offers built to this floor are a real path. The [tax resolution hub](/tax-resolution/) shows how OIC fits alongside installment agreements, hardship (CNC) status, and penalty abatement.",
    commonMistakes: [
      "Using your actual monthly expenses instead of the IRS Collection Financial Standards. The IRS overrides your actual with the allowed amount for your county and family size, so ignoring the standards inflates your remaining income and pushes the offer floor higher than it needs to be.",
      "Reporting fair-market value for real estate and vehicles. The IRS uses 80% quick-sale value; your NRE (and thus your offer floor) drops when you calculate it correctly.",
      "Forgetting the $3,450 vehicle exemption per vehicle (up to two vehicles) — a common $6,900 miss.",
      "Skipping Low Income Certification when you qualify. The $205 fee, the 20% down payment on lump-sum offers, and the monthly payments during processing all disappear if your AGI is ≤ 250% of federal poverty guidelines.",
      "Making the offer higher than the RCP floor to 'seem generous.' The IRS accepts the RCP — offers meaningfully above it just leave money on the table.",
      "Skipping the Form 656 pre-qualifier. It's free at irs.gov/oic and rejects some cases before you spend the $205 — the IRS itself tells you if you're not eligible.",
    ],
    workedExample:
      "Take the calculator's default: a $55,000 tax debt with $3,000 in checking, $4,000 in a brokerage, $22,000 in a 401(k), $12,000 of home equity, one $15,000 vehicle, and $5,200/month household income against $4,700/month of IRS-allowable expenses for a 3-person household. NRE breaks down to $0 in cash (after the 1-month expense reserve), $4,000 in investments, $15,840 in retirement (72% of $22,000), $9,600 in real estate (80% of $12,000 equity), and $8,550 in vehicle equity ($12,000 quick-sale value minus the $3,450 exemption). Total NRE is $37,990. Remaining monthly income is $500 ($5,200 − $4,700), so the lump-sum RCP is $37,990 + 12 × $500 = $43,990. That's $11,010 below the $55,000 debt — a viable OIC. And because this household's $62,400 AGI is below 250% of the 3-person federal poverty line ($64,550), the $205 application fee is waived.",
    faqs: [
      {
        question: "What is an offer in compromise calculator?",
        answer:
          "An offer in compromise calculator applies the IRS Form 656-B Reasonable Collection Potential worksheet to your financials and returns the minimum offer amount the IRS is likely to accept. The calculator above breaks down your Net Realizable Equity by asset class using IRM 5.8.5 discount rules, adds your remaining monthly income times the correct multiplier (12 for lump-sum, 24 for periodic), and flags whether an OIC is mathematically viable versus your balance.",
      },
      {
        question: "How does the IRS calculate an offer in compromise?",
        answer:
          "The IRS calculates an offer in compromise using Reasonable Collection Potential: net asset equity plus future remaining income times a multiplier. Assets are valued after IRS discounts — real estate at 80% quick-sale value minus mortgage, vehicles at 80% with a $3,450 exemption per vehicle (up to two), retirement accounts at about 72% after tax and early-withdrawal penalty, cash minus one month of allowable expenses, and taxable investments at 100%. The multiplier is 12 for a Lump-Sum Cash Offer (paid in ≤ 5 installments within 5 months) or 24 for a Periodic Payment Offer (6–24 months).",
      },
      {
        question: "What is the acceptance rate for an offer in compromise?",
        answer:
          "The IRS accepted 7,199 of 33,591 Offers in Compromise in FY2025 — a 21.4% acceptance rate — per the FY2025 IRS Data Book. FY2024 was 5,464 of 38,797 (14.1%). Acceptance is not random: offers built to the RCP floor (or slightly above) using the Form 656-B worksheet are the ones that get approved. Offers that ignore Collection Financial Standards or lowball the NRE calculation are the ones that get rejected.",
      },
      {
        question: "What is the $205 application fee for an offer in compromise?",
        answer:
          "The $205 Offer in Compromise application fee is required on every Form 656 unless you qualify for Low Income Certification, which waives it. Low Income Certification applies when your adjusted gross income is at or below 250% of the federal poverty guidelines for your household size. Low-income filers also skip the 20% lump-sum down payment (required with non-low-income lump-sum offers) and the monthly payments the IRS otherwise requires during processing.",
      },
      {
        question: "Can I do an offer in compromise myself?",
        answer:
          "Yes. Form 656 and Form 433-A(OIC) are public, the Reasonable Collection Potential worksheet in Form 656-B is the same math the calculator above applies, and the IRS provides a pre-qualifier tool at irs.gov/oic. DIY makes the most sense for straightforward W-2 income with simple assets. Professional help (Enrolled Agent, CPA, or tax attorney; typically $3,500–$7,500 for OIC prep) becomes worth it when you have self-employment income, complex assets, multiple tax years, or the IRS is already actively collecting.",
      },
      {
        question: "What happens if my offer in compromise is rejected?",
        answer:
          "A rejected offer in compromise leaves you with three next steps. You can appeal within 30 days via Form 13711 (Request for Appeal of Offer in Compromise) — many offers succeed on appeal because the IRS re-runs the RCP math with your correction. You can submit a revised offer if the reason was an incorrect asset or income figure. Or you can switch to an Installment Agreement — a streamlined online IA is available if your combined debt is ≤ $50,000. While the OIC is pending, the 10-year Collection Statute Expiration Date is tolled, plus 30 days after rejection.",
      },
    ],
    sources: [
      { label: "IRS — Offer in Compromise", url: "https://www.irs.gov/payments/offer-in-compromise" },
      { label: "IRS — Form 656 Booklet (RCP worksheet)", url: "https://www.irs.gov/pub/irs-pdf/f656b.pdf" },
      { label: "IRS — IRM 5.8.5 Financial Analysis", url: "https://www.irs.gov/irm/part5/irm_05-008-005" },
      { label: "IRS — Collection Financial Standards", url: "https://www.irs.gov/businesses/small-businesses-self-employed/collection-financial-standards" },
      { label: "IRS Data Book FY2025 — Publication 55B", url: "https://www.irs.gov/pub/irs-pdf/p55b.pdf" },
      { label: "IRS — Form 433-A(OIC)", url: "https://www.irs.gov/forms-pubs/about-form-433-a-oic" },
    ],
    toolHeading: "Estimate your IRS Offer in Compromise",
    toolSubheading: "Enter your debt, assets, income, and IRS allowable expenses to see the minimum offer floor.",
    preset: {
      totalDebt: 55000,
      cashOnHand: 3000,
      investments: 4000,
      retirementAccounts: 22000,
      realEstateEquity: 12000,
      vehicles: 15000,
      numberOfVehicles: 1,
      otherAssetsFMV: 0,
      loansAgainstAssets: 0,
      monthlyIncome: 5200,
      monthlyAllowableExpenses: 4700,
      householdSize: 3,
      region: "contiguous48",
    },
    // 50 state subpages — bespoke Phase-3 content per state lives in src/data/state-overrides.ts.
    // Each state's title/meta/H1/intro/lawContext is unique (community property, state OIC program,
    // state income tax, homestead exemption). State pages generate via [category]/[slug]/[state].astro.
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
    calculator: "tax-resolution",
    slug: "irs-payment-plan-calculator",
    islandId: "irs-payment-plan",
    title: "IRS Payment Plan Calculator: See Your Monthly Payment",
    metaDescription:
      "Free IRS payment plan calculator. Enter your balance and capacity to compare setup fees, monthly payments, and total cost across the 3 tiers.",
    targetKeyword: "irs payment plan calculator",
    estimatedVolume: 4800,
    estimatedKD: 35,
    h1: "IRS Payment Plan Calculator: See Your Real Monthly Payment",
    intro:
      "An IRS payment plan calculator shows the true monthly payment and total cost of settling your tax debt in installments across the three tiers the IRS actually offers: a short-term payment plan (up to 180 days, no setup fee), a streamlined online installment agreement (balances of $50,000 or less, 72 months), and a non-streamlined agreement (Form 433-F required for balances over $50,000). The calculator above uses the current 7% annual underpayment interest rate for the third quarter of 2026 and the reduced 0.25% monthly failure-to-pay penalty that applies once an installment agreement is approved. For a $32,000 balance repaid over 72 months, the monthly payment lands at about $445, with roughly $6,720 in interest and $2,880 in penalties over the life of the plan — a total of about $41,622 including the $22 online direct-debit setup fee.",
    howItWorks:
      "The IRS offers three payment plan tiers, and the calculator above shows all three side by side because the right choice depends on what you can afford each month. A short-term payment plan gives you up to 180 days to pay in full and costs nothing to set up, but the failure-to-pay penalty stays at 0.5% per month because a short-term plan is not a formal installment agreement. It works if your balance is under $100,000 and your monthly capacity can knock the debt out in six payments — for a $32,000 balance, that means paying roughly $5,333 a month, which is out of reach for most households.\n\nA streamlined installment agreement is the workhorse tier: individuals owing $50,000 or less can apply entirely online. The IRS accepts a monthly direct-debit plan up to 72 months at a $22 online setup fee. Two things change the moment the agreement is approved. First, the failure-to-pay penalty drops from 0.5% to 0.25% per month (Internal Revenue Code §6651(a)(2)) — a real reduction that shows up on every remaining month of the plan. Second, active collection stops: no more Notices of Intent to Levy, no wage garnishment, no bank account seizures, as long as you don't miss a payment or fall behind on future returns.\n\nA non-streamlined installment agreement covers balances over $50,000 or situations where the streamlined online path isn't available. It requires Form 433-F (Collection Information Statement) so the IRS can see your full financial picture, and the setup fee is $178 by mail (or $107 by phone with direct debit). The term can extend up to 120 months, capped by the Collection Statute Expiration Date under IRC §6502(a)(1). If your income and IRS Collection Financial Standards leave you unable to full-pay the balance inside the CSED, the calculator will surface a Partial Pay Installment Agreement — you pay what you can, and whatever remains when the CSED expires disappears.\n\nOne mechanic most people miss: if your income is at or below 250% of the federal poverty guidelines for your household size (Low Income Certification), the setup fee drops to $43 and may even be reimbursed. The [tax resolution hub](/tax-resolution/) shows how a payment plan fits alongside an [Offer in Compromise](/tax-resolution/offer-in-compromise-calculator/), Currently Not Collectible status, and penalty abatement — pick the right combination and you cut both time and cost.",
    commonMistakes: [
      "Choosing a short-term plan for a balance you can't actually clear in 180 days. The 0.5% monthly penalty keeps accruing at the full rate — that's why it's cheaper to switch to a formal installment agreement and get the 0.25% reduction.",
      "Ignoring the streamlined online option. If your balance is ≤ $50,000, you don't need a professional — the IRS's Online Payment Agreement takes minutes and costs $22 with direct debit.",
      "Skipping direct debit to save fees. Non-DDIA setup is $47 more online ($69 vs $22) and $71 more by phone ($178 vs $107), and skipping direct debit is the top reason plans default (missed manual payments).",
      "Forgetting the Low Income Certification fee waiver. AGI ≤ 250% of federal poverty guidelines drops setup to $43 or gets it reimbursed.",
      "Overlooking Partial Pay Installment Agreements. If your monthly capacity won't cover the balance inside the 10-year Collection Statute Expiration Date, a PPIA lets you pay less than the full amount and have the remainder expire with the CSED.",
    ],
    workedExample:
      "Take the calculator's default: a $32,000 balance with $450/month of payment capacity, a 2-person household, and $58,000 annual income (above 250% of the 2-person federal poverty guideline of $20,440 × 2.5 = $51,100 — so no Low Income Certification). Because the balance is under $50,000, the streamlined online agreement is the best fit. At 72 months, the monthly payment is $444.44. Over the life of the plan, you'll pay about $6,720 in underpayment interest (7% APR on the average outstanding balance) and $2,880 in reduced FTP penalty (0.25% × 72 months × average balance, well under the 25% penalty cap). Total repaid: about $41,622 including the $22 online direct-debit setup fee. Note that the same 72-month term via the non-streamlined route would cost $178 to set up by mail — but it isn't needed here because the balance is under the $50,000 online threshold.",
    faqs: [
      {
        question: "How does the IRS payment plan calculator work?",
        answer:
          "The IRS payment plan calculator compares the three plan tiers the IRS offers — short-term (up to 180 days), streamlined online (up to $50,000 balance, 72 months), and non-streamlined (over $50,000, Form 433-F required) — for the balance and monthly capacity you enter. It shows each tier's monthly payment, setup fee, total underpayment interest at the current 7% annual rate, total failure-to-pay penalty (0.5% per month standard, 0.25% per month on an approved installment agreement), and total dollars repaid over the plan life.",
      },
      {
        question: "What is the IRS installment agreement setup fee?",
        answer:
          "The IRS setup fee depends on the plan tier and how you apply. Short-term payment plans (≤ 180 days) have no setup fee. A streamlined long-term installment agreement is $22 online with direct debit, $69 online without direct debit, $107 by phone or mail with direct debit, or $178 by phone or mail without direct debit. Low Income Certification (adjusted gross income ≤ 250% of federal poverty guidelines for your household size) reduces the fee to $43 and may qualify for reimbursement.",
      },
      {
        question: "How does an installment agreement reduce IRS penalties?",
        answer:
          "An approved installment agreement drops the failure-to-pay penalty from 0.5% per month to 0.25% per month under Internal Revenue Code §6651(a)(2), on every remaining month of the plan. On a $32,000 balance over 72 months, that's the difference between roughly $5,760 in penalties (at 0.5% × avg balance) and $2,880 (at 0.25%) — a real reduction of about $2,880 that shows up on your final payoff.",
      },
      {
        question: "What is the current IRS interest rate on unpaid taxes?",
        answer:
          "The IRS underpayment interest rate is 7% per year for the third quarter of 2026 (July through September), per the IRS quarterly interest rates schedule. Rates are set each quarter as the federal short-term rate plus 3% and compound daily on the unpaid balance. Interest accrues on both tax and any accrued penalties, and it does not drop when your installment agreement is approved — only the failure-to-pay penalty does.",
      },
      {
        question: "Can I apply for an IRS payment plan online?",
        answer:
          "Yes, for individuals owing $50,000 or less combined tax, penalties, and interest, and for businesses owing $25,000 or less. The IRS's Online Payment Agreement application at irs.gov/payments takes minutes if you have your latest tax return, a photo ID, and a bank account for direct debit. Balances above $50,000 for individuals require Form 9465 (Installment Agreement Request) and Form 433-F (Collection Information Statement) by mail or through a tax professional.",
      },
      {
        question: "What is a partial pay installment agreement?",
        answer:
          "A partial pay installment agreement (PPIA) lets you pay less than the full tax debt over the remaining Collection Statute Expiration Date, which is 10 years from assessment under IRC §6502(a)(1). PPIAs require Form 433-F financial disclosures and a mandatory two-year review. If your monthly capacity cannot cover the full balance before the CSED expires, the unpaid remainder is written off when the statute runs — a real forgiveness path the IRS doesn't advertise.",
      },
    ],
    sources: [
      { label: "IRS — Payment plans (installment agreements)", url: "https://www.irs.gov/payments/payment-plans-installment-agreements" },
      { label: "IRS — Online Payment Agreement application", url: "https://www.irs.gov/payments/online-payment-agreement-application" },
      { label: "IRS — Failure to Pay Penalty (§6651(a)(2))", url: "https://www.irs.gov/payments/failure-to-pay-penalty" },
      { label: "IRS — Quarterly interest rates on underpayments", url: "https://www.irs.gov/payments/quarterly-interest-rates" },
      { label: "IRS — Form 9465 instructions (Installment Agreement Request)", url: "https://www.irs.gov/instructions/i9465" },
      { label: "Taxpayer Advocate Service — Partial Payment Installment Agreement", url: "https://www.taxpayeradvocate.irs.gov/notices/partial-payment-installment-agreement/" },
    ],
    toolHeading: "Estimate your IRS payment plan",
    toolSubheading: "Enter your balance and monthly capacity to see all three tiers side by side.",
    preset: {
      balance: 32000,
      monthlyCapacity: 450,
      householdSize: 2,
      region: "contiguous48",
      annualIncome: 58000,
    },
    relatedSlugs: ["offer-in-compromise-calculator"],
  },

  {
    calculator: "tax-resolution",
    slug: "penalty-abatement-calculator",
    islandId: "penalty-abatement",
    title: "IRS Penalty Abatement Calculator: FTA vs Reasonable Cause",
    metaDescription:
      "Free IRS penalty abatement calculator. Check First Time Abate eligibility vs reasonable cause and see the exact dollars you can wipe off your balance.",
    targetKeyword: "irs penalty abatement calculator",
    estimatedVolume: 2400,
    estimatedKD: 28,
    h1: "IRS Penalty Abatement Calculator: FTA + Reasonable Cause",
    intro:
      "An IRS penalty abatement calculator routes your penalty to the right relief mechanism — First Time Abate (an administrative waiver that's essentially automatic when you meet three criteria) or Reasonable Cause (a case-by-case request that covers a broader set of penalties). The calculator above applies IRS rules: First Time Abate covers failure-to-file (§6651(a)(1)), failure-to-pay (§6651(a)(2)), and failure-to-deposit (§6656) penalties, but not the accuracy-related penalty under §6662. For a $2,400 failure-to-file penalty where you've been penalty-free for the prior 3 tax years, all required returns are filed, and the tax is paid or under an installment agreement, First Time Abate wipes out the full $2,400 — with high likelihood, because FTA is granted almost automatically when the criteria are met.",
    howItWorks:
      "Penalty abatement means the IRS erases a penalty (and the interest that accrued on it) from your balance. Two paths lead there. The first is First Time Abate, an administrative waiver. If you were penalty-free in the three prior tax years, all your required returns are filed (or you're on a valid extension), and the tax is paid or under an installment agreement, the IRS grants FTA on request. There's no hardship to prove, no documentation to attach — for eligible penalty types, it's essentially automatic. Call the toll-free number on your notice and ask.\n\nThe second path is Reasonable Cause. Reasonable Cause applies case by case under the 'ordinary business care and prudence' standard, and it covers a broader set of penalties — including the accuracy-related penalty (§6662), which First Time Abate cannot touch. Common grounds that get granted: death or serious illness in the household, natural disaster in your area, records destroyed by fire or flood, and reliance on written advice from the IRS. Reasonable Cause requests need Form 843 and supporting evidence (medical records, disaster declaration, IRS written advice, etc.). Grant rates are lower than FTA — the calculator above estimates a conservative 70% abatement for a documented Reasonable Cause event because partial grants are common.\n\nA few points most abatement guides skip. First, if you have FTA available, use it on the year with the biggest penalty — you only get FTA once every three years, so it should land on your largest failure-to-file / failure-to-pay balance. Second, FTA can be stacked with a Reasonable Cause request in the same year for different penalty types (FTA on failure-to-pay, Reasonable Cause on accuracy-related). Third, the estimated-tax penalty under §6654 is not administratively abatable — Form 2210 with an annualized income calculation is your remedy if income was uneven, or the narrow casualty/disaster exception in §6654(e)(3)(A). Fourth, penalty abatement doesn't touch interest on the underlying tax — the underpayment interest (7% per year for the third quarter of 2026) keeps running on the tax portion. The [tax resolution hub](/tax-resolution/) shows how penalty abatement fits alongside an [Offer in Compromise](/tax-resolution/offer-in-compromise-calculator/) and an [IRS payment plan](/tax-resolution/irs-payment-plan-calculator/).",
    commonMistakes: [
      "Requesting FTA on your smallest penalty year and burning the opportunity. You can only use FTA once every 3 years — use it on the year with the largest failure-to-file / failure-to-pay penalty.",
      "Trying to abate the accuracy-related penalty (§6662) with FTA. It's not FTA-eligible — Reasonable Cause is the only path.",
      "Skipping Form 843 for Reasonable Cause. Verbal requests over the phone often get denied because there's no written record to review.",
      "Not documenting the causal link. Reasonable Cause requires that the event actually caused the failure — 'I was hospitalized on the due date' works; 'I was hospitalized 8 months before the due date' rarely does.",
      "Forgetting to request abatement of the interest that accrued on the penalty (IRC §6404(a)(1)) once the penalty is abated. Interest on an erased penalty is also erased, but the IRS doesn't always do it automatically.",
      "Assuming FTA covers the estimated-tax penalty. It doesn't — §6654 is not administratively abatable.",
    ],
    workedExample:
      "Take the calculator's default: a $2,400 failure-to-file penalty, with three prior clean tax years, all required returns filed, and the tax paid (or an installment agreement in place). All three First Time Abate criteria are met and failure-to-file is FTA-eligible, so the route is FTA and the estimated abatement is $2,400 — the full penalty — with high likelihood. To request it, call the toll-free number on the penalty notice and ask for First Time Abate. If the IRS representative denies over the phone (rare when criteria are clearly met), file Form 843 (Claim for Refund and Request for Abatement) with a one-page cover letter confirming the criteria.",
    faqs: [
      {
        question: "What is an IRS penalty abatement calculator?",
        answer:
          "An IRS penalty abatement calculator routes your penalty to the correct relief mechanism — First Time Abate or Reasonable Cause — and estimates how much the IRS is likely to wipe off. The calculator above applies IRS rules for FTA eligibility (three prior clean years, returns filed, tax paid or arranged) and identifies whether your penalty type qualifies for the administrative waiver or requires case-by-case Reasonable Cause under §6404.",
      },
      {
        question: "What is First Time Abate?",
        answer:
          "First Time Abate (FTA) is an administrative waiver the IRS grants for a single tax period when you meet three criteria: no penalties in the prior 3 tax years (other than the estimated-tax penalty), all required returns filed or on a valid extension, and the tax owed paid or under an installment agreement. It's essentially automatic — no hardship to prove — for eligible penalty types (failure-to-file, failure-to-pay, and failure-to-deposit). The accuracy-related penalty under §6662 is not FTA-eligible.",
      },
      {
        question: "What qualifies as reasonable cause for penalty abatement?",
        answer:
          "Reasonable cause requires that you exercised ordinary business care and prudence but still failed to file or pay on time. Common grounds the IRS accepts: death or serious illness of the taxpayer or immediate family, a natural disaster or fire, destruction of records, and reliance on written advice from the IRS. Verbal advice or general reliance on a tax preparer usually doesn't qualify. Every request needs documentation — medical records, disaster declaration, an IRS written response — attached to Form 843.",
      },
      {
        question: "Can I abate the failure-to-file and failure-to-pay penalty at the same time?",
        answer:
          "Yes. Failure-to-file (§6651(a)(1)) and failure-to-pay (§6651(a)(2)) are both eligible for First Time Abate. A single call or Form 843 can request FTA on both penalties for the same tax period, provided the three criteria are met. When both apply in the same month, the IRS reduces the failure-to-file rate by the failure-to-pay rate (so the combined charge is 5% per month rather than 5.5%).",
      },
      {
        question: "Does penalty abatement remove the interest too?",
        answer:
          "Interest on the abated penalty is also refunded — that's the IRS's own rule under IRC §6404(a)(1). But interest on the underlying tax keeps running (7% per year for the third quarter of 2026, per the IRS quarterly interest rates). If the IRS abates a penalty but doesn't automatically credit the associated interest, request it in writing — it's not always done automatically.",
      },
      {
        question: "How do I request First Time Abate?",
        answer:
          "The fastest path is to call the toll-free number on your IRS penalty notice, tell the representative you'd like to request First Time Abate for the specified tax period, and confirm the three criteria (no penalties in the prior 3 tax years, all returns filed, tax paid or arranged). If FTA is granted over the phone, you'll receive a notice within 4 to 6 weeks. If denied, file Form 843 (Claim for Refund and Request for Abatement) with a one-page statement showing the criteria are met and attach a copy of the original notice.",
      },
    ],
    sources: [
      { label: "IRS — First Time Abate (administrative waiver)", url: "https://www.irs.gov/payments/penalty-relief-due-to-first-time-abate-or-other-administrative-waiver" },
      { label: "IRS — Penalty Relief for Reasonable Cause", url: "https://www.irs.gov/payments/penalty-relief-for-reasonable-cause" },
      { label: "IRS — Failure to File Penalty (§6651(a)(1))", url: "https://www.irs.gov/payments/failure-to-file-penalty" },
      { label: "IRS — Failure to Pay Penalty (§6651(a)(2))", url: "https://www.irs.gov/payments/failure-to-pay-penalty" },
      { label: "IRS — About Form 843", url: "https://www.irs.gov/forms-pubs/about-form-843" },
      { label: "IRS — Quarterly interest rates on underpayments", url: "https://www.irs.gov/payments/quarterly-interest-rates" },
    ],
    toolHeading: "Estimate your IRS penalty abatement",
    toolSubheading: "Pick your penalty type and check FTA + Reasonable Cause eligibility.",
    preset: {
      penaltyType: "failure-to-file",
      penaltyAmount: 2400,
      cleanPriorThreeYears: true,
      filingCurrent: true,
      taxPaidOrArranged: true,
      reasonableCauseEvent: false,
    },
    relatedSlugs: ["offer-in-compromise-calculator", "irs-payment-plan-calculator"],
  },

  {
    calculator: "tax-resolution",
    slug: "back-taxes-impact-calculator",
    islandId: "back-taxes-impact",
    title: "Back Taxes Impact Calculator: Mortgage, Passport, Credit",
    metaDescription:
      "Free back taxes impact calculator. See how IRS debt affects mortgage approval, passport, credit report, and CSED expiration in plain English.",
    targetKeyword: "back taxes impact calculator",
    estimatedVolume: 1800,
    estimatedKD: 26,
    h1: "Back Taxes Impact Calculator: What Happens to Your Life",
    intro:
      "A back taxes impact calculator shows the concrete downstream effects of IRS debt — mortgage approval, passport eligibility, credit report visibility, wage garnishment risk, professional license status, and years remaining on the 10-year Collection Statute Expiration Date. The calculator above applies IRS rules to your situation and returns a plain-English impact grid. For a $45,000 balance assessed 3 years ago with no tax lien filed and no installment agreement in place, the CSED runs out in about 7 years, your credit report is clean (the 3 credit bureaus stopped showing tax liens in April 2018), but a mortgage application would be flagged until you set up a formal installment agreement and make 3 on-time monthly payments.",
    howItWorks:
      "Back taxes affect more than just what you owe the IRS. Six downstream areas move based on your specific situation, and the calculator above surfaces each one.\n\nMortgage approval. Fannie Mae, Freddie Mac, and FHA (Handbook 4000.1) will not underwrite a mortgage while there's unaddressed IRS debt. The fix is a formal long-term installment agreement AND at least 3 monthly payments made on time — bring the acceptance letter and the 3 bank statements to underwriting. A short-term payment plan (< 180 days) does not count. If a Notice of Federal Tax Lien has been filed against you or the property, approval is blocked entirely until the lien is released, discharged (Form 14135), or subordinated to the new mortgage (Form 14134). This is the single most common way back taxes derail home buying.\n\nCredit score. Since April 2018, Equifax, Experian, and TransUnion have removed all public-record tax liens from consumer credit reports under the National Consumer Assistance Plan. Your back-tax balance and any Notice of Federal Tax Lien no longer appear in your FICO score. But — and this is the trap most articles miss — the NFTL is still recorded at the county courthouse and shows up in lender title searches, professional-license background checks, and public-records databases that manual underwriters pull. So mortgage lenders, licensing boards, and some employers see the lien even though it's off your credit report.\n\nPassport. Under IRC §7345, the IRS certifies debts over $65,000 in 2026 (the $50,000 threshold indexed for inflation) to the State Department as 'Seriously Delinquent Tax Debt.' Once certified, the State Department can deny new passport applications and revoke existing ones. The fix is fast: enter an installment agreement, get an OIC accepted, request Currently Not Collectible status, or bring the balance below the threshold — certification is reversed within 30 days.\n\nWage garnishment and bank levy. The IRS's collection escalation is predictable: CP14 (initial notice), CP501/CP503 (reminders), CP504 (Intent to Levy state tax refund), then Letter 1058 or LT11 (Final Notice of Intent to Levy). Once Letter 1058 is issued and the 30-day Collection Due Process window elapses without a CDP appeal (Form 12153), the IRS can garnish wages under IRC §6331 — typically 25% or more of disposable income — or levy bank accounts. An installment agreement pauses the escalation immediately.\n\nCollection Statute Expiration Date (CSED). IRC §6502(a)(1) gives the IRS 10 years from the date of assessment to collect. If the balance isn't paid before the CSED, the debt is written off — a real forgiveness path the IRS doesn't advertise. Pending OIC, IA request, bankruptcy, CDP appeal, being out of the country over 6 months, and Innocent Spouse claims all toll (pause) the CSED. Plan the sequence carefully: a Partial Pay Installment Agreement over the last few years of the CSED can leave a real balance unpaid at expiration.\n\nOnce you know your impact profile, the [tax resolution hub](/tax-resolution/) shows the specific relief programs — [Offer in Compromise](/tax-resolution/offer-in-compromise-calculator/), [IRS payment plan](/tax-resolution/irs-payment-plan-calculator/), and [penalty abatement](/tax-resolution/penalty-abatement-calculator/) — that clear each impact fastest. If back taxes are blocking a home purchase, the [home affordability calculator](/mortgage/home-affordability-calculator/) shows what a mortgage looks like once the IRS gate opens.",
    commonMistakes: [
      "Assuming an IRS balance kills your credit score. Since April 2018 the 3 bureaus don't report tax liens — but lenders, licensing boards, and background-check services still see them at the county courthouse.",
      "Trying to buy a home with a short-term payment plan. Fannie Mae, Freddie Mac, and FHA all require a formal long-term installment agreement AND 3 on-time monthly payments. Short-term plans don't count.",
      "Not filing Form 14134 when refinancing. A recorded tax lien blocks a new mortgage until it's subordinated. Form 14134 (Application for Certificate of Subordination) is the fix — the IRS agrees to let the new mortgage take priority.",
      "Missing the 30-day CDP window on Letter 1058. Once it expires, wage garnishment starts. Form 12153 (Request for a CDP Hearing) within 30 days stops the levy — a hard deadline most articles bury.",
      "Ignoring the CSED. If the IRS has 3 years or less left to collect, a Partial Pay Installment Agreement can leave real dollars uncollected when the CSED expires.",
      "Not addressing the passport risk fast. Certification to the State Department under §7345 is reversed within 30 days once you're in an installment agreement — but only after you're actually in the plan, not just requesting one.",
    ],
    workedExample:
      "Take the calculator's default: a $45,000 IRS balance assessed 3 years ago, no Notice of Federal Tax Lien filed, no installment agreement in place, and no Notice of Intent to Levy received. The 10-year Collection Statute Expiration Date runs out in about 7 years. Because the $45,000 balance is below the 2026 Seriously Delinquent Tax Debt threshold of $65,000, your passport is safe. Your FICO score is unaffected — the IRS stopped reporting to the bureaus in April 2018. But mortgage approval is flagged: Fannie/Freddie/FHA won't underwrite until you're on a formal long-term installment agreement with 3 on-time payments made. And with the balance above the $10,000 NFTL threshold, you're on the collection escalation track — an installment agreement now, before Letter 1058 arrives, is the difference between a controlled monthly payment and a 25%+ wage garnishment.",
    faqs: [
      {
        question: "What is a back taxes impact calculator?",
        answer:
          "A back taxes impact calculator surfaces the concrete downstream effects of IRS debt in one place: mortgage approval status, passport eligibility, credit report visibility, wage garnishment risk, professional license risk, and years remaining on the 10-year Collection Statute Expiration Date. The calculator above applies IRS rules — Fannie/Freddie/FHA mortgage guidelines, IRC §7345 for passport certification, IRC §6502(a)(1) for the CSED — to your specific inputs and returns a plain-English impact grid.",
      },
      {
        question: "Do back taxes affect mortgage approval?",
        answer:
          "Yes. Fannie Mae, Freddie Mac, and FHA (Handbook 4000.1) will not underwrite a mortgage while IRS back taxes are unaddressed. The standard fix is a formal long-term installment agreement AND at least 3 monthly payments made on time; bring the acceptance letter and the 3 bank statements to underwriting. Short-term payment plans (up to 180 days) do not count. If a Notice of Federal Tax Lien has been filed, approval is blocked entirely until the lien is released, discharged (Form 14135), or subordinated to the new mortgage (Form 14134).",
      },
      {
        question: "Do back taxes show on my credit report?",
        answer:
          "No, since April 2018. Equifax, Experian, and TransUnion removed all public-record tax liens from consumer credit reports under the National Consumer Assistance Plan. Your IRS back-tax balance and any Notice of Federal Tax Lien do not appear in your FICO score. But the NFTL is still recorded at the county courthouse — it shows up on lender title searches, professional-license background checks, and public-records databases that manual underwriters pull. So mortgage lenders and licensing boards still see it.",
      },
      {
        question: "Can back taxes affect my passport?",
        answer:
          "Yes if your total balance is $65,000 or more in 2026. Under IRC §7345, the IRS certifies 'Seriously Delinquent Tax Debt' — currently $65,000 (the $50,000 threshold from 2015 indexed for inflation) — to the State Department, which can then deny new passport applications and revoke existing ones. Certification is reversed within 30 days once you enter an installment agreement, get an OIC accepted, request Currently Not Collectible status, or bring the balance below the threshold.",
      },
      {
        question: "How long can the IRS collect on back taxes?",
        answer:
          "10 years from the date of assessment, per IRC §6502(a)(1). That period — the Collection Statute Expiration Date (CSED) — pauses (tolls) during a pending Offer in Compromise, installment agreement request, bankruptcy, Collection Due Process appeal, or Innocent Spouse claim, and while you're outside the U.S. for 6+ months. If the CSED expires before the balance is paid, the debt is written off — a real forgiveness path the IRS doesn't advertise.",
      },
      {
        question: "Can back taxes be forgiven?",
        answer:
          "Yes, in three specific ways. An accepted Offer in Compromise settles the debt for less than the balance owed. A Partial Pay Installment Agreement pays less than the full amount over the remaining CSED — whatever is unpaid when the 10-year statute expires disappears. And Currently Not Collectible status suspends active collection; if your finances don't recover before the CSED expires, the debt expires with it. Blanket 'IRS forgiveness programs' pitched in ads are usually one of these three routes in disguise.",
      },
    ],
    sources: [
      { label: "IRC §6502(a)(1) — Collection Statute Expiration Date", url: "https://www.law.cornell.edu/uscode/text/26/6502" },
      { label: "IRS — Understanding a Federal Tax Lien", url: "https://www.irs.gov/businesses/small-businesses-self-employed/understanding-a-federal-tax-lien" },
      { label: "IRS — Revocation or Denial of Passport (§7345)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/revocation-or-denial-of-passport-in-case-of-certain-unpaid-taxes" },
      { label: "FHA Single Family Housing Policy Handbook 4000.1", url: "https://www.hud.gov/hudprograms/sfh/handbook_4000-1" },
      { label: "IRS — Notice of Intent to Levy (Letter 1058 / LT11)", url: "https://www.irs.gov/individuals/understanding-your-lt11-notice-or-letter-1058" },
      { label: "IRS — Form 12153 Request for a CDP Hearing", url: "https://www.irs.gov/forms-pubs/about-form-12153" },
    ],
    toolHeading: "Estimate your back-taxes impact",
    toolSubheading: "See the concrete downstream effects across mortgage, passport, credit, and CSED.",
    preset: {
      balance: 45000,
      yearsSinceAssessment: 3,
      hasFederalTaxLien: false,
      onInstallmentAgreementWith3Payments: false,
      receivedIntentToLevy: false,
    },
    relatedSlugs: ["offer-in-compromise-calculator", "irs-payment-plan-calculator", "penalty-abatement-calculator"],
  },
];
