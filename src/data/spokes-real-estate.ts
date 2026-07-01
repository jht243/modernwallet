import type { SpokeEntry } from "./types";

// RealEstateIQ (real-estate) spokes. Powered by src/lib/rental.ts. CONTENT: keyword-gap system —
// guided research+write (IRS primary sources, engine ground-truth figures) + adversarial audit per
// page. See CONTENT.md.

export const REAL_ESTATE_SPOKES: SpokeEntry[] = [
  {
    calculator: "real-estate",
    slug: "cash-flow-calculator",
    title: "Rental Property Cash Flow Calculator",
    metaDescription:
      "Use our rental property cash flow calculator to see your monthly profit after the mortgage, taxes, insurance, vacancy, and management fees.",
    targetKeyword: "rental property cash flow calculator",
    estimatedVolume: 1600,
    estimatedKD: 33,
    h1: "Rental Property Cash Flow Calculator",
    intro:
      "This rental property cash flow calculator shows the money left over each month after rent pays your mortgage and every operating cost. Cash flow is rental income minus all operating expenses minus debt service. Enter your numbers in the calculator above to find out if a property turns a real monthly profit. The result tells you whether the deal feeds your bank account or drains it.",
    howItWorks:
      "The calculator above turns rent and costs into monthly cash flow using a simple formula. It starts with gross rent, then subtracts vacancy loss to get effective gross income. From there it removes operating expenses like taxes, insurance, maintenance, and management to reach net operating income (NOI). Finally it subtracts your loan payment to show monthly cash flow.\n\nYou enter the purchase price, down payment, loan terms, rent, and expense rates. The tool handles the math and returns cash flow, cap rate, cash-on-cash return, and DSCR. Each metric answers a different question about the deal.",
    commonMistakes: [
      "Skipping vacancy. No rental stays full every month. Budget around 5% of gross rent so a single empty month does not erase your profit.",
      "Forgetting maintenance and capital reserves. If you ignore repairs and big-ticket items like a roof or HVAC, your reported cash flow is fake. Set aside a percentage of rent every month.",
      "Leaving out management fees when you self-manage. Your time has value. Include a management line so the deal still works when you hand it off later.",
      "Counting only principal and interest. Taxes and insurance are real cash costs. Add them to your loan payment to see true monthly cash flow.",
      "Confusing cash flow with NOI. NOI ignores your mortgage. Cash flow is what lands in your pocket after debt service.",
    ],
    workedExample:
      "Consider a single-family rental priced at $240,000 with 25% down. The $180,000 loan at 6.75% over 30 years costs $1,167 a month in principal and interest. Rent is $2,300 a month, or $27,600 a year in gross rent. After 5% vacancy, effective gross income is $26,220. Operating expenses, including $2,800 in taxes, $1,300 in insurance, and 8% each for maintenance and management, total $8,516 a year. That leaves net operating income of $17,704. Subtract the annual debt service and cash flow is $308 a month, or $3,694 a year. With $67,200 invested, that is a 5.5% cash-on-cash return, a 7.38% cap rate, and a DSCR of 1.26.",
    faqs: [
      { question: "What is a rental property cash flow calculator?", answer: "A rental property cash flow calculator shows your monthly profit after rent pays the mortgage, taxes, insurance, vacancy, maintenance, and management. It tells you whether a property makes or loses money each month. The calculator above does this math for you." },
      { question: "How do you calculate rental cash flow?", answer: "Rental cash flow equals rental income minus all operating expenses minus your loan payment. Start with gross rent, subtract vacancy, then subtract operating costs to get NOI. Subtract debt service from NOI to reach cash flow. In our example, that comes to $308 a month." },
      { question: "What is a good monthly cash flow for a rental?", answer: "A good rental produces positive cash flow after every expense, including reserves for repairs and capital costs. Many investors aim for a comfortable cushion per unit. Our example deal returns $308 a month and a 5.5% cash-on-cash return." },
      { question: "Does cash flow include the mortgage payment?", answer: "Yes. Cash flow subtracts your full debt service, including principal and interest. This is the key difference from net operating income, which ignores the loan. NOI in our example is $17,704, but cash flow is $3,694 a year after the mortgage." },
      { question: "What DSCR do lenders want for a rental property?", answer: "Lenders typically want a debt service coverage ratio of at least 1.2, meaning NOI covers the loan payment with room to spare. Our example deal has a DSCR of 1.26, which clears that bar. A higher DSCR signals a safer loan. See the [cap rate calculator](/real-estate/cap-rate-calculator/) and [cash-on-cash return calculator](/real-estate/cash-on-cash-return-calculator/) for the other metrics." },
    ],
    sources: [
      { label: "IRS Topic No. 414, Rental Income and Expenses", url: "https://www.irs.gov/taxtopics/tc414" },
      { label: "IRS Publication 527, Residential Rental Property", url: "https://www.irs.gov/publications/p527" },
    ],
    toolHeading: "Calculate your rental's monthly cash flow",
    toolSubheading: "Enter price, rent, and expenses to see cash flow, cap rate, and cash-on-cash return.",
    preset: { purchasePrice: 240000, downPaymentPct: 25, closingCostsPct: 3, interestRatePct: 6.75, loanTermYears: 30, monthlyRent: 2300, vacancyRatePct: 5, propertyTaxAnnual: 2800, insuranceAnnual: 1300, maintenancePctOfRent: 8, managementPctOfRent: 8 },
    relatedSlugs: ["rental-income-calculator", "depreciation-calculator", "rental-income-tax-calculator", "airbnb-calculator"],
  },

  {
    calculator: "real-estate",
    slug: "rental-income-calculator",
    title: "Rental Income Calculator: Gross Rent to Net Income",
    metaDescription:
      "Use this rental income calculator to find gross rent, effective income after vacancy, and what's left after expenses on any rental property.",
    targetKeyword: "rental income calculator",
    estimatedVolume: 1900,
    estimatedKD: 42,
    h1: "Rental Income Calculator",
    intro:
      "This rental income calculator shows how much income a rental property really brings in. Enter your rent, vacancy rate, and expenses in the calculator above. It turns gross rent into effective income after vacancy, then into net operating income after costs. Gross rent is only the starting point, not your spendable or taxable income.",
    howItWorks:
      "The rental income calculator works in three steps. First, it finds gross annual rent by multiplying monthly rent by 12. Next, it subtracts a vacancy allowance to get effective gross income, the real top line. Finally, it subtracts operating expenses like taxes, insurance, maintenance, and management to reach net operating income (NOI).\n\nHere is the key insight. Gross rent is not what you keep or what you owe tax on. The IRS taxes rental income but lets you deduct expenses and depreciation. So your taxable income is usually far lower than the rent you collect.",
    commonMistakes: [
      "Treating gross rent as profit. Effective gross income after vacancy, then NOI after expenses, is what matters.",
      "Ignoring vacancy. Even a 6% vacancy rate cuts a $32,400 gross rent down to $30,456 in effective income.",
      "Forgetting management and maintenance. Budgeting 8% of rent for each keeps your numbers honest.",
      "Confusing rent collected with taxable income. The IRS lets you deduct operating expenses and depreciation.",
      "Leaving out depreciation. Residential rental property depreciates over 27.5 years, lowering your tax bill.",
    ],
    workedExample:
      "Take a single-family rental bought for $300,000 with 25% down. It rents for $2,700 a month, so gross annual rent is $32,400. After a 6% vacancy allowance, effective gross income drops to $30,456. Operating expenses (taxes, insurance, maintenance, and management) total $10,184 a year. That leaves net operating income of $20,272. After the $1,497 monthly mortgage payment, monthly cash flow is $192, or $2,309 a year.",
    faqs: [
      { question: "What does a rental income calculator tell you?", answer: "A rental income calculator tells you gross rent, effective income after vacancy, and net operating income after expenses. It separates the rent you collect from the income you actually keep. In the example above, $32,400 in gross rent becomes $20,272 in net operating income." },
      { question: "Is gross rent the same as taxable rental income?", answer: "No. Gross rent is not your taxable income. The IRS taxes rental income but lets you deduct operating expenses and depreciation. Because residential property depreciates over 27.5 years, your taxable income is often much lower than the rent you collect." },
      { question: "What counts as rental income to the IRS?", answer: "Rental income is any payment you receive for the use of property. This includes normal rent, advance rent, lease cancellation payments, and tenant-paid expenses. Security deposits count only if you keep them for a lease violation." },
      { question: "What expenses can I deduct from rental income?", answer: "You can deduct ordinary expenses like maintenance, insurance, property taxes, mortgage interest, and management fees. You can also deduct depreciation. These deductions reduce your taxable rental income below the rent you collect. To see the profit after the mortgage, use the [cash flow calculator](/real-estate/cash-flow-calculator/)." },
    ],
    sources: [
      { label: "IRS Topic No. 414, Rental Income and Expenses", url: "https://www.irs.gov/taxtopics/tc414" },
      { label: "IRS Publication 527, Residential Rental Property", url: "https://www.irs.gov/publications/p527" },
    ],
    toolHeading: "Calculate your rental income",
    toolSubheading: "See gross rent, effective income after vacancy, and net operating income.",
    preset: { purchasePrice: 300000, downPaymentPct: 25, closingCostsPct: 3, interestRatePct: 7, loanTermYears: 30, monthlyRent: 2700, vacancyRatePct: 6, propertyTaxAnnual: 3600, insuranceAnnual: 1400, maintenancePctOfRent: 8, managementPctOfRent: 8 },
    relatedSlugs: ["cash-flow-calculator", "depreciation-calculator", "airbnb-calculator", "rental-income-tax-calculator"],
  },

  {
    calculator: "real-estate",
    slug: "cap-rate-calculator",
    title: "Cap Rate Calculator: Find a Capitalization Rate",
    metaDescription:
      "Use this cap rate calculator to find a rental property's capitalization rate from its NOI and value, then compare deals fast and accurately.",
    targetKeyword: "cap rate calculator",
    estimatedVolume: 4400,
    estimatedKD: 40,
    h1: "Cap Rate Calculator",
    intro:
      "This cap rate calculator shows a property's capitalization rate by dividing its net operating income by its value. The calculator above turns rent, vacancy, and operating costs into a single percentage you can compare across deals. Cap rate ignores your mortgage entirely, so it measures the property itself, not your financing. Enter your numbers above to see a property's cap rate in seconds.",
    howItWorks:
      "The cap rate calculator above uses one core formula: cap rate = net operating income (NOI) / property value. NOI is your effective gross income minus operating expenses like property tax, insurance, maintenance, and management. NOI deliberately excludes mortgage payments, because loan terms are about you, not the property.\n\nFirst, the calculator finds gross rent, then subtracts vacancy to get effective gross income. Next, it subtracts operating expenses to reach NOI. Finally, it divides NOI by the property value to produce the cap rate. A higher cap rate means more income per dollar of value, but it often signals more risk too.",
    commonMistakes: [
      "Including mortgage principal and interest in expenses. Cap rate uses NOI, which excludes all debt service.",
      "Forgetting vacancy. Always reduce gross rent by a realistic vacancy rate before calculating NOI.",
      "Leaving out maintenance and management. These are real operating costs, even if you self-manage today.",
      "Judging a cap rate in isolation. A 'good' cap rate depends on the local market and the property's risk.",
      "Confusing cap rate with cash-on-cash return. Cap rate ignores your loan; cash-on-cash measures return on cash invested.",
    ],
    workedExample:
      "Consider a $400,000 rental that brings in $3,400 per month, or $40,800 in gross annual rent. After a 5% vacancy allowance, effective gross income is $38,760. Operating expenses (property tax, insurance, maintenance, and management) total $13,328 per year. That leaves a net operating income of $25,432. Divide NOI by the $400,000 value, and the cap rate is 6.36%. Notice this figure never touched the mortgage, so it compares the property to any other deal regardless of financing.",
    faqs: [
      { question: "What is a cap rate calculator?", answer: "A cap rate calculator finds a property's capitalization rate by dividing its net operating income by its value. It shows how much income a property generates per dollar of price. This lets you compare rental deals on equal footing, no matter how each is financed." },
      { question: "How do you calculate cap rate?", answer: "Cap rate = net operating income (NOI) / property value. NOI is your rental income after vacancy and operating expenses, but before any mortgage payments. For example, $25,432 in NOI on a $400,000 property gives a 6.36% cap rate." },
      { question: "Does cap rate include the mortgage?", answer: "No. Cap rate excludes mortgage payments entirely. It uses net operating income, which leaves out all debt service. This is why cap rate measures the property itself, not your loan, making it ideal for comparing deals." },
      { question: "What is a good cap rate?", answer: "A good cap rate depends on the market and the property's risk. Lower cap rates often appear in stable, high-demand areas, while higher cap rates can signal more risk or upside. Compare a property's cap rate to similar local properties, not a fixed target." },
      { question: "What is the difference between cap rate and cash-on-cash return?", answer: "Cap rate and cash-on-cash return answer different questions. Cap rate ignores financing and measures the property's income versus its value. Cash-on-cash return measures your annual cash flow against the cash you invested. Use the [cash-on-cash return calculator](/real-estate/cash-on-cash-return-calculator/) for the financing side." },
    ],
    sources: [
      { label: "IRS Topic No. 414, Rental Income and Expenses", url: "https://www.irs.gov/taxtopics/tc414" },
      { label: "IRS Publication 527, Residential Rental Property", url: "https://www.irs.gov/publications/p527" },
      { label: "J.P. Morgan — Calculating Net Operating Income and Cash Flow", url: "https://www.jpmorgan.com/insights/real-estate/commercial-term-lending/calculating-net-operating-income-and-cash-flow" },
    ],
    toolHeading: "Calculate a property's cap rate",
    toolSubheading: "Enter price, rent, and expenses — cap rate appears instantly in the results.",
    preset: { purchasePrice: 400000, downPaymentPct: 25, closingCostsPct: 3, interestRatePct: 7, loanTermYears: 30, monthlyRent: 3400, vacancyRatePct: 5, propertyTaxAnnual: 5000, insuranceAnnual: 1800, maintenancePctOfRent: 8, managementPctOfRent: 8 },
    relatedSlugs: ["cash-flow-calculator", "rental-income-calculator", "cash-on-cash-return-calculator", "rental-income-tax-calculator"],
  },

  {
    calculator: "real-estate",
    slug: "cash-on-cash-return-calculator",
    title: "Cash on Cash Return Calculator for Rentals",
    metaDescription:
      "Use our cash on cash return calculator to find the pre-tax yield on the actual cash you invest in a rental property. See a worked example.",
    targetKeyword: "cash on cash return calculator",
    estimatedVolume: 1300,
    estimatedKD: 38,
    h1: "Cash on Cash Return Calculator",
    intro:
      "This cash on cash return calculator shows the pre-tax yield you earn on the actual cash you put into a rental property. Cash-on-cash return equals annual pre-tax cash flow divided by total cash invested. Enter your numbers in the calculator above to see your percentage in seconds. It answers one question: how hard is my invested cash working this year?",
    howItWorks:
      "The cash on cash return calculator divides your annual pre-tax cash flow by the total cash you invested. Cash flow is your [rental income](/real-estate/rental-income-calculator/) minus operating expenses and your mortgage payment. Total cash invested is your down payment plus closing costs, not the full purchase price.\n\nHere is a non-obvious point. Cash-on-cash measures cash flow only. It ignores appreciation, loan paydown, and tax benefits, so it understates your total return. It is also a year-one snapshot. As rents rise over time, your cash-on-cash return usually climbs too. For the full picture, pair it with our [ROI calculator](/real-estate/roi-calculator/).",
    commonMistakes: [
      "Using the full purchase price as cash invested. Use only your down payment plus closing costs, not the financed amount.",
      "Forgetting vacancy. Always reduce gross rent for expected empty months before you calculate cash flow.",
      "Leaving out maintenance and management. These ongoing costs shrink cash flow and lower your true return.",
      "Confusing cash-on-cash with cap rate. Cap rate ignores your mortgage; cash-on-cash includes it.",
      "Treating it as total return. Cash-on-cash skips appreciation, loan paydown, and tax perks, so it understates lifetime gains.",
    ],
    workedExample:
      "Consider a $250,000 rental bought with 25% down and 3% closing costs. Your total cash invested is $70,000. The loan is $187,500 at 6.75% over 30 years, so monthly principal and interest is $1,216. Rent is $2,350 per month, or $28,200 a year. After 5% vacancy, effective gross income is $26,790. Operating expenses total $8,712, leaving net operating income of $18,078. Subtract the mortgage payments and annual cash flow is $3,485, or about $290 a month. Divide $3,485 by $70,000 and the cash-on-cash return is 4.98%. For comparison, the cap rate is 7.23% and the DSCR is 1.24.",
    faqs: [
      { question: "What is a cash on cash return calculator?", answer: "A cash on cash return calculator divides your annual pre-tax cash flow by the total cash you invested in a property. It returns a percentage that shows the yield on your actual money. The calculator above does this instantly once you enter rent, expenses, and your down payment. See our [cash flow calculator](/real-estate/cash-flow-calculator/) to build the cash flow figure." },
      { question: "What is a good cash-on-cash return?", answer: "Many investors target a cash-on-cash return of 8% to 12%, though good depends on your market and goals. In the example above, a 4.98% return is on the lower side. Compare it against other deals and safer options like bonds before you buy." },
      { question: "How is cash-on-cash return different from cap rate?", answer: "Cash-on-cash return includes your mortgage payments, while cap rate ignores financing entirely. Cap rate divides net operating income by property value. Cash-on-cash divides cash flow by the cash you invested. In the example, the cap rate is 7.23% and cash-on-cash is 4.98%. Our [cap rate calculator](/real-estate/cap-rate-calculator/) handles that metric." },
      { question: "Does cash-on-cash return include appreciation?", answer: "No. Cash-on-cash return measures cash flow only. It ignores appreciation, loan paydown, and tax benefits, so it understates your total return. Use it as a quick year-one screen, then layer in those other gains for the full picture." },
    ],
    sources: [
      { label: "Corporate Finance Institute — Cash on Cash Return", url: "https://corporatefinanceinstitute.com/resources/wealth-management/cash-on-cash-return/" },
      { label: "IRS Topic No. 414, Rental Income and Expenses", url: "https://www.irs.gov/taxtopics/tc414" },
    ],
    toolHeading: "Calculate your cash-on-cash return",
    toolSubheading: "See the pre-tax yield on the actual cash you invest.",
    preset: { purchasePrice: 250000, downPaymentPct: 25, closingCostsPct: 3, interestRatePct: 6.75, loanTermYears: 30, monthlyRent: 2350, vacancyRatePct: 5, propertyTaxAnnual: 2900, insuranceAnnual: 1300, maintenancePctOfRent: 8, managementPctOfRent: 8 },
    relatedSlugs: ["cash-flow-calculator", "cap-rate-calculator", "rental-income-calculator", "capital-gains-calculator"],
  },

  {
    calculator: "real-estate",
    slug: "roi-calculator",
    title: "Rental Property ROI Calculator: Total Return Tool",
    metaDescription:
      "Use our rental property ROI calculator to project total return over time, blending cash flow, appreciation, and loan paydown into one clear number.",
    targetKeyword: "rental property ROI calculator",
    estimatedVolume: 1000,
    estimatedKD: 41,
    h1: "Rental Property ROI Calculator",
    intro:
      "This rental property ROI calculator shows your total return on a rental over the years you own it. ROI for a rental is more than monthly cash flow. It combines four sources of return: cash flow, appreciation, loan paydown, and tax benefits. Enter your numbers in the calculator above to see your projected return and IRR across a 20-year hold.",
    howItWorks:
      "The rental property ROI calculator adds up every dollar a rental returns, then measures it against the cash you invested. It tracks your annual cash flow, the equity you build as the loan balance falls, and the gain from appreciation when you sell. The tool reports two return figures. ROI is your total profit divided by the cash you invested over the whole hold. IRR is the annualized rate that also accounts for when you receive each dollar.\n\nThat timing difference matters. ROI treats a dollar earned in year one the same as a dollar earned in year twenty. IRR does not. Because IRR weights early cash flows more heavily, it gives a truer picture of a long hold. A deal with a low cash-on-cash return can still post a strong IRR when appreciation and loan paydown build equity over time.",
    commonMistakes: [
      "Counting only cash flow. ROI on a rental also comes from appreciation, loan paydown, and tax benefits, not just the rent left over each month.",
      "Confusing ROI with IRR. ROI is total profit over cash invested, while IRR is the annualized rate that accounts for when you get the money.",
      "Forgetting all the cash invested. Cash-on-cash and ROI must include the down payment plus closing costs, not the down payment alone.",
      "Ignoring vacancy and management. Skipping a 5% vacancy allowance or 8% management fee inflates your return and hides the true number.",
      "Judging a deal on year-one cash flow alone. A thin cash-on-cash return can still produce a solid long-term IRR through appreciation and paydown.",
    ],
    workedExample:
      "Consider a $300,000 rental bought with 25% down and 3% closing costs, so $84,000 in cash invested. The $225,000 loan at 7% over 30 years costs $1,497 a month in principal and interest. Rent is $2,600 a month with 5% vacancy. After taxes, insurance, maintenance, and management, net operating income is $19,748 a year. That leaves $1,785 in annual cash flow, or $149 a month. Cash-on-cash return is just 2.12%, and the cap rate is 6.58%. The cash flow alone looks thin. But hold the property 20 years with 3% appreciation, and the picture changes. Net sale proceeds reach $374,980, total profit climbs to $411,541, and the annualized IRR is 10.87%. Appreciation and loan paydown, not monthly cash flow, drive most of that return.",
    faqs: [
      { question: "What is a rental property ROI calculator?", answer: "A rental property ROI calculator measures the total return on a rental over the years you own it. It combines cash flow, appreciation, loan paydown, and tax benefits, then divides that profit by the cash you invested. The calculator above also projects a 20-year IRR." },
      { question: "What is the difference between ROI and IRR?", answer: "ROI is your total profit divided by the cash you invested over the entire hold. IRR is the annualized rate of return that also accounts for when each dollar arrives. IRR weights early cash flows more heavily, so it better reflects a long hold." },
      { question: "Can a rental have low cash flow but still be a good investment?", answer: "Yes. A rental can post a low cash-on-cash return yet still deliver a strong IRR. Appreciation and loan paydown build equity over time. In the example above, a 2.12% cash-on-cash deal produces a 10.87% IRR over 20 years." },
      { question: "What counts as the cash invested in ROI?", answer: "Cash invested includes your down payment plus closing costs and any upfront repairs. On a $300,000 purchase with 25% down and 3% closing costs, that is $84,000. Using the down payment alone overstates your return." },
      { question: "What other calculators should I use with this one?", answer: "Pair this with the [cash flow calculator](/real-estate/cash-flow-calculator/) and the [cash-on-cash return calculator](/real-estate/cash-on-cash-return-calculator/) for year-one returns. Use the [cap rate calculator](/real-estate/cap-rate-calculator/) and [rental income calculator](/real-estate/rental-income-calculator/) to refine your inputs." },
      { question: "What is rental yield and how does it differ from cap rate and ROI?", answer: "Rental yield measures annual rent as a percentage of property value — a quick comparison metric popular in UK and international real estate markets. Gross rental yield = (annual rent ÷ property value) × 100. Net rental yield subtracts operating expenses first: net yield = ((annual rent − operating expenses) ÷ property value) × 100. Net rental yield is mathematically equivalent to cap rate; the difference is terminology, not formula. For the $300,000 property in the example above ($2,600/month rent, $31,200 annually), gross yield is 10.4% and net yield equals the cap rate shown in the results. ROI is broader than yield or cap rate — it adds appreciation and loan paydown to cash flow, and it measures return against your actual cash invested rather than the full property value. Use gross yield for fast cross-market comparisons; cap rate to evaluate a property independently of financing; ROI for full-hold total-return planning." },
    ],
    sources: [
      { label: "IRS Publication 527, Residential Rental Property", url: "https://www.irs.gov/publications/p527" },
      { label: "Corporate Finance Institute — Internal Rate of Return (IRR)", url: "https://corporatefinanceinstitute.com/resources/valuation/internal-rate-return-irr/" },
    ],
    toolHeading: "Project your rental's total ROI",
    toolSubheading: "Combine cash flow, appreciation, and loan paydown into a 20-year return and IRR.",
    preset: { purchasePrice: 300000, downPaymentPct: 25, closingCostsPct: 3, interestRatePct: 7, loanTermYears: 30, monthlyRent: 2600, vacancyRatePct: 5, propertyTaxAnnual: 3500, insuranceAnnual: 1400, maintenancePctOfRent: 8, managementPctOfRent: 8, appreciationPct: 3, holdYears: 20 },
    relatedSlugs: ["cash-flow-calculator", "capital-gains-calculator", "airbnb-calculator", "rental-income-tax-calculator"],
  },

  {
    calculator: "real-estate",
    slug: "depreciation-calculator",
    title: "Rental Property Depreciation Calculator",
    metaDescription:
      "Calculate IRS 27.5-year straight-line depreciation for your rental. Find your annual Schedule E deduction after separating land from structure value.",
    targetKeyword: "rental property depreciation calculator",
    estimatedVolume: 2900,
    estimatedKD: 35,
    h1: "Rental Property Depreciation Calculator",
    intro:
      "Rental property depreciation lets you deduct the cost of the building — not the land — over 27.5 years using straight-line depreciation, as required by IRS Publication 527. This deduction reduces your taxable rental income each year without any out-of-pocket cost, making it one of the most valuable tax advantages of owning residential rental property. Use the calculator above to model your property's cash flow, then read on to understand how the depreciation deduction layers on top.",
    howItWorks:
      "The IRS requires residential rental property to be depreciated over 27.5 years using straight-line depreciation (equal deductions each year). The depreciable basis is the purchase price plus acquisition costs minus the value allocated to land. Land is never depreciable — only the structure qualifies.\n\nFormula: Depreciable basis = (Purchase price + closing costs) × (1 − land value percentage). Annual depreciation = Depreciable basis ÷ 27.5.\n\nExample: a $300,000 property where land is 20% of value. Depreciable basis = $300,000 × 0.80 = $240,000. Annual depreciation deduction = $240,000 ÷ 27.5 = $8,727. That $8,727 deduction reduces your Schedule E taxable income each year for 27.5 years. The land-to-structure split is typically found in the county property tax assessment or a professional appraisal. IRS guidance allows you to use the assessed value ratio if a separate land appraisal is unavailable.",
    commonMistakes: [
      "Depreciating the land value. The IRS explicitly prohibits depreciating land — only the structure (building) qualifies. Failing to separate land from structure in your basis calculation is an audit risk.",
      "Starting depreciation before the property is placed in service. Depreciation begins the day the property is available for rent, not the purchase date. If you buy in October but spend two months renovating, depreciation starts in December.",
      "Forgetting to add closing costs to the depreciable basis. Acquisition costs like title insurance, legal fees, and recording charges increase the cost basis and therefore increase the annual deduction.",
      "Ignoring depreciation at sale. Many investors claim the deduction during ownership but are caught off guard by depreciation recapture tax at sale, which is a mandatory 25% rate on all accumulated depreciation under IRS Section 1250.",
      "Failing to claim depreciation assuming it saves tax at sale. The IRS taxes depreciation recapture on amounts 'allowed or allowable' — even if you never actually claimed the deduction, you will owe recapture tax when you sell. Always take the deduction.",
    ],
    workedExample:
      "A $300,000 rental property with 3% closing costs has a total cost basis of $309,000. The county assessment shows land at 20% of total value, so land value = $61,800 and the depreciable structure = $247,200. Annual depreciation = $247,200 ÷ 27.5 = $8,989. For an investor in the 24% marginal income tax bracket, this deduction saves approximately $2,157 in federal income tax per year — real cash savings with no out-of-pocket cost. Over the full 27.5-year depreciation schedule, total deductions equal $247,200. At sale, the IRS taxes all accumulated depreciation at a 25% recapture rate under Section 1250, not at the standard long-term capital gains rate. A 1031 exchange defers both the capital gains tax and the depreciation recapture into the replacement property.",
    faqs: [
      {
        question: "How is rental property depreciation calculated?",
        answer:
          "Rental property depreciation uses IRS straight-line depreciation over 27.5 years. Divide the depreciable basis (purchase price plus closing costs, minus land value) by 27.5 to find the annual deduction. For a $240,000 depreciable basis, the annual deduction is $8,727.",
      },
      {
        question: "Can I depreciate the land my rental property sits on?",
        answer:
          "No. The IRS explicitly prohibits depreciating land — only the building structure qualifies. You must separate the land value from the total purchase price to calculate your depreciable basis. Use the county property tax assessment ratio or a professional appraisal to make the split.",
      },
      {
        question: "What is depreciation recapture and when does it apply?",
        answer:
          "Depreciation recapture applies when you sell a rental property. The IRS recaptures all depreciation you deducted (or were allowed to deduct) during ownership and taxes that amount at a special 25% rate under Section 1250 — higher than the 0%, 15%, or 20% long-term capital gains rate that applies to the remaining profit. A 1031 like-kind exchange defers recapture into the replacement property.",
      },
      {
        question: "What if I never claimed depreciation on my rental?",
        answer:
          "You still owe recapture tax at sale. The IRS taxes depreciation that was 'allowed or allowable,' meaning the amount you could have deducted whether or not you actually did. Failing to claim depreciation during ownership means you paid more tax than necessary each year and will still owe recapture at sale. Always take the depreciation deduction.",
      },
      {
        question: "Does depreciation reduce my taxable rental income every year?",
        answer:
          "Yes. Depreciation is a non-cash deduction that reduces your Schedule E taxable rental income each year for 27.5 years. For a property with an $8,727 annual depreciation deduction and an investor in the 24% bracket, that saves approximately $2,094 in federal taxes per year — with no money leaving your pocket.",
      },
    ],
    sources: [
      {
        label: "IRS Publication 527 — Residential Rental Property",
        url: "https://www.irs.gov/publications/p527",
      },
      {
        label: "IRS Topic No. 704 — Depreciation",
        url: "https://www.irs.gov/taxtopics/tc704",
      },
    ],
    toolHeading: "Model your rental property's financials",
    toolSubheading: "Enter price and expenses — then use the depreciation formula above to find your annual deduction.",
    preset: {
      purchasePrice: 300000,
      downPaymentPct: 25,
      closingCostsPct: 3,
      interestRatePct: 6.75,
      loanTermYears: 30,
      monthlyRent: 2200,
      vacancyRatePct: 5,
      propertyTaxAnnual: 3000,
      insuranceAnnual: 1400,
      maintenancePctOfRent: 8,
      managementPctOfRent: 0,
    },
    relatedSlugs: ["cash-flow-calculator", "rental-income-tax-calculator", "roi-calculator"],
  },

  {
    calculator: "real-estate",
    slug: "rental-income-tax-calculator",
    title: "Rental Income Tax Calculator: Net Profit After Tax",
    metaDescription:
      "Calculate taxable rental income after Schedule E deductions — mortgage interest, depreciation, repairs, and property taxes. Find your after-tax profit.",
    targetKeyword: "rental income tax calculator",
    estimatedVolume: 2400,
    estimatedKD: 32,
    h1: "Rental Income Tax Calculator",
    intro:
      "Rental income is taxable, but Schedule E deductions can dramatically reduce your tax bill — often to the point where a cash-flowing property shows a tax loss on paper. This page explains how the IRS taxes rental income, which expenses you can deduct, and the non-obvious tax rules that catch many investors off guard. Use the cash flow calculator above to model your rental's income and expenses, then apply the tax framework below to estimate your true after-tax result. For deductions and strategies that apply beyond rental property, see our broader [tax tips guide](/guides/tax-tips/).",
    howItWorks:
      "Rental income is reported on IRS Schedule E and taxed as ordinary income at your marginal rate. But the IRS allows you to deduct all ordinary and necessary rental expenses before calculating taxable income.\n\nDeductible expenses under IRS Publication 527 include: mortgage interest (not principal), property taxes, landlord insurance premiums, depreciation (building only, over 27.5 years), repairs and maintenance costs, property management fees, utilities you pay as the landlord, advertising costs, and professional fees like accounting and legal.\n\nTaxable rental income = gross rent collected − allowable deductions − depreciation. Because depreciation is a non-cash deduction, many rentals show a taxable loss even when they generate positive monthly cash flow. That paper loss can offset other income up to $25,000 per year for active participants earning under $100,000 adjusted gross income (AGI), with a phase-out between $100,000 and $150,000 AGI, per IRS Publication 925.",
    commonMistakes: [
      "Deducting mortgage principal. Only the interest portion of your mortgage payment is deductible — not the principal repayment. Use your year-end Form 1098 from the lender to find the exact interest amount.",
      "Missing the depreciation deduction. Depreciation is one of the most valuable rental deductions, yet some owners skip it to simplify their returns. The IRS will tax recapture at sale whether or not you claimed it.",
      "Confusing repairs with capital improvements. Repairs (fixing a broken door) are fully deductible in the current year. Capital improvements (replacing the roof) must be depreciated over time under IRS rules.",
      "Forgetting the Net Investment Income Tax (NIIT). High-earning landlords owe an additional 3.8% NIIT on rental income above the threshold ($200,000 for single filers, $250,000 for married filing jointly), stacking on top of ordinary income tax.",
      "Assuming all rental losses are immediately deductible. Passive activity loss rules under IRS Section 469 limit how rental losses offset non-rental income. The $25,000 allowance applies only to active participants, and high-income investors may need to carry losses forward.",
    ],
    workedExample:
      "A $280,000 rental collects $2,100 in rent per month ($25,200 annually). After 5% vacancy, effective gross income is $23,940. The mortgage at 6.75% on a $210,000 loan generates approximately $14,100 in first-year interest. Property taxes are $2,800, insurance $1,200, maintenance $2,016 (8% of rent), and management $2,016 (8% of rent). The depreciable basis (80% of purchase + closing costs) is approximately $229,600, giving annual depreciation of $8,349. Total deductions: $14,100 + $2,800 + $1,200 + $2,016 + $2,016 + $8,349 = $30,481. Taxable rental income: $23,940 − $30,481 = −$6,541. This property generates a $6,541 paper loss even while producing positive cash flow, illustrating how depreciation creates a tax shelter. An investor in the 22% bracket and under the $100k AGI threshold could use this loss to offset $6,541 of ordinary income, saving approximately $1,439 in federal taxes.",
    faqs: [
      {
        question: "How is rental income taxed?",
        answer:
          "Rental income is taxed as ordinary income at your marginal federal income tax rate and reported on IRS Schedule E. After deducting allowable expenses and depreciation, your taxable rental income is often much lower than the rent you collect — and may even be a net loss on paper.",
      },
      {
        question: "What expenses can I deduct from rental income?",
        answer:
          "IRS Publication 527 allows deductions for mortgage interest, property taxes, landlord insurance, depreciation (27.5-year straight-line for residential property), repairs and maintenance, property management fees, utilities you pay, advertising, and professional fees. Capital improvements are not immediately deductible — they must be depreciated.",
      },
      {
        question: "What is the Net Investment Income Tax on rental income?",
        answer:
          "The Net Investment Income Tax (NIIT) is an additional 3.8% tax on rental income for individuals with AGI above $200,000 (single) or $250,000 (married filing jointly), per IRS rules. It stacks on top of your regular income tax rate. For a landlord in the 24% bracket who crosses the threshold, effective marginal tax on rental income is 27.8%.",
      },
      {
        question: "Can a rental property show a tax loss even when I profit each month?",
        answer:
          "Yes — and this is one of real estate investing's key tax advantages. Depreciation is a non-cash deduction that reduces taxable income without reducing cash flow. A property generating $300 per month in cash flow can simultaneously show a $6,000 annual tax loss on Schedule E. That paper loss may offset other income, subject to passive activity rules.",
      },
      {
        question: "Can I deduct rental losses against my regular income?",
        answer:
          "Active participants in rental activity can deduct up to $25,000 in rental losses against ordinary income per year, with a phase-out from $100,000 to $150,000 AGI (IRS Publication 925). Above $150,000 AGI, losses are generally suspended and carried forward to offset future rental income or gains at sale — unless you qualify as a real estate professional.",
      },
    ],
    sources: [
      {
        label: "IRS Topic No. 414 — Rental Income and Expenses",
        url: "https://www.irs.gov/taxtopics/tc414",
      },
      {
        label: "IRS Publication 527 — Residential Rental Property",
        url: "https://www.irs.gov/publications/p527",
      },
    ],
    toolHeading: "Model your rental property income and expenses",
    toolSubheading: "Enter rent and costs above — then apply the Schedule E framework below to estimate after-tax profit.",
    preset: {
      purchasePrice: 280000,
      downPaymentPct: 25,
      closingCostsPct: 3,
      interestRatePct: 6.75,
      loanTermYears: 30,
      monthlyRent: 2100,
      vacancyRatePct: 5,
      propertyTaxAnnual: 2800,
      insuranceAnnual: 1200,
      maintenancePctOfRent: 8,
      managementPctOfRent: 8,
    },
    relatedSlugs: ["cash-flow-calculator", "depreciation-calculator", "roi-calculator"],
  },

  {
    calculator: "real-estate",
    slug: "airbnb-calculator",
    title: "Airbnb Income Calculator: Project STR Revenue",
    metaDescription:
      "Calculate Airbnb short-term rental income by nightly rate and occupancy. Compare STR vs. long-term rental monthly net income before you buy.",
    targetKeyword: "Airbnb income calculator",
    estimatedVolume: 4400,
    estimatedKD: 42,
    h1: "Airbnb Income Calculator",
    intro:
      "Short-term rental (STR) income from platforms like Airbnb can significantly outpace long-term rental rates in the right market — but STR properties also carry higher vacancy, operating costs, and regulatory risk than traditional rentals. This calculator models your property's income using a monthly-equivalent rent figure. Use the inputs to simulate STR economics, then read the section below on how STR expenses and rules differ from long-term rentals.",
    howItWorks:
      "Short-term rental gross income equals your average nightly rate multiplied by the number of occupied nights per month. At $150 per night and 75% occupancy (approximately 22.5 nights in a 30-night month), monthly gross income is $3,375. To find an equivalent monthly rent for the calculator above, multiply nightly rate × occupied nights.\n\nSTR-specific costs that differ from long-term rentals: higher insurance premiums (standard homeowner or landlord policies typically exclude STR use — you need a commercial or vacation rental rider, which can run 2–3× a standard landlord policy), platform host fees (Airbnb's standard host fee is approximately 3% of each booking), professional cleaning between stays, higher maintenance and turnover costs, and higher effective vacancy than the 5% typically modeled for long-term rentals. A 25% vacancy assumption reflects roughly 22–23 occupied nights per month, which is a reasonable conservative baseline for many STR markets.\n\nFor the calculator above, enter the monthly-equivalent rent ($3,375 in the example), set vacancy to 25%, management fees to reflect platform fees plus any co-host costs (often 15–25% total), and use a higher maintenance and insurance estimate than you would for a long-term rental.",
    commonMistakes: [
      "Assuming STR income will always exceed long-term rental income. In many markets, after accounting for higher vacancy, turnover costs, platform fees, and STR-specific insurance, a long-term tenant produces more reliable net income.",
      "Using a standard landlord insurance policy for a short-term rental. Most landlord and homeowner policies exclude commercial STR activity. Operating without the right coverage could void a claim — get a vacation rental or commercial STR rider.",
      "Ignoring local STR regulations. Dozens of major U.S. cities require STR permits, restrict STR to owner-occupied units, or cap the number of STR nights per year. Operating without a permit or in violation of local rules can result in fines and forced closure.",
      "Forgetting platform fees. Airbnb charges hosts approximately 3% of each booking as a service fee. This, combined with cleaning fees and co-host management costs, can total 20–30% of gross revenue.",
      "Extrapolating peak-season occupancy to the full year. A beach house with 95% occupancy in July may sit at 20% in February. Annual projections should use an average or seasonally-weighted occupancy rate.",
    ],
    workedExample:
      "A $350,000 property targets $150 per night with 75% annual occupancy (approximately 22.5 nights per month). Monthly STR gross = $3,375. Annualized = $40,500. After a 25% effective vacancy/low-season adjustment, effective annual income = $30,375. Operating costs include $3,500 in property taxes, $2,000 in STR-specific insurance (vs. $1,200 for a standard landlord policy), 12% maintenance ($4,860), and 20% management/platform fees ($8,100), totaling $18,460. Net operating income: $11,915. With 25% down on a $350,000 property at 6.75%, the monthly mortgage is $1,710, or $20,516 annually. Annual cash flow: −$8,601. This negative cash flow illustrates how STR projections that look attractive on nightly rate alone often tighten sharply after vacancy, fees, and STR-specific costs. Seasonality adjustments and local permit compliance are critical before buying.",
    faqs: [
      {
        question: "How do I calculate Airbnb income?",
        answer:
          "Airbnb income equals your average nightly rate multiplied by the number of occupied nights. At $150 per night and 75% occupancy over 30 days, monthly gross is $3,375. To model this in the calculator above, enter $3,375 as the monthly rent, set vacancy to 25%, and adjust management and maintenance rates upward to reflect STR-specific costs.",
      },
      {
        question: "Is a short-term rental more profitable than a long-term rental?",
        answer:
          "It depends on the market and the property. STR gross revenue per night is typically higher, but effective vacancy, turnover costs, platform fees, STR-specific insurance, and local permit costs often narrow the gap significantly. In many markets, a reliable long-term tenant produces comparable or superior net income with far less management effort.",
      },
      {
        question: "Do I need special insurance for an Airbnb rental?",
        answer:
          "Yes. Standard homeowner and landlord insurance policies typically exclude commercial short-term rental activity. Operating an Airbnb without a vacation rental or commercial STR endorsement could void your coverage entirely in the event of a claim. Contact your insurer before your first STR booking.",
      },
      {
        question: "Are there legal risks to buying a property for Airbnb?",
        answer:
          "Yes — and this is a major non-obvious risk. Local STR regulations are tightening rapidly. Many U.S. cities require STR permits, restrict STRs to owner-occupied units, cap the number of STR nights per year, or ban STRs entirely in certain zones. A property that is legally permitted for STR today may face new restrictions within 1–3 years. Always verify local zoning and STR licensing rules before purchasing.",
      },
      {
        question: "What fees does Airbnb charge hosts?",
        answer:
          "Airbnb's standard host-only fee is approximately 3% of each booking subtotal. Some hosts using API-connected software may face different fee structures. Beyond the platform fee, factor in cleaning costs, co-host or management fees (often 15–25% of revenue for full-service STR management), and higher maintenance due to guest turnover. Total cost of managing and platforming an STR typically runs 20–30% of gross revenue.",
      },
    ],
    sources: [
      {
        label: "IRS Publication 527 — Residential Rental Property (vacation rental rules)",
        url: "https://www.irs.gov/publications/p527",
      },
      {
        label: "CFPB — Renting out your home",
        url: "https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-renting-out-a-room-or-my-home-en-2042/",
      },
    ],
    toolHeading: "Model your short-term rental income",
    toolSubheading: "Enter the monthly-equivalent rent and STR-adjusted costs to see projected cash flow.",
    preset: {
      purchasePrice: 350000,
      downPaymentPct: 25,
      closingCostsPct: 3,
      interestRatePct: 6.75,
      loanTermYears: 30,
      monthlyRent: 3600,
      vacancyRatePct: 25,
      propertyTaxAnnual: 3500,
      insuranceAnnual: 2000,
      maintenancePctOfRent: 12,
      managementPctOfRent: 20,
    },
    relatedSlugs: ["cash-flow-calculator", "rental-income-calculator", "rental-income-tax-calculator"],
  },

  {
    calculator: "real-estate",
    slug: "capital-gains-calculator",
    title: "Rental Property Capital Gains Calculator",
    metaDescription:
      "Calculate capital gains tax on a rental property sale — including 25% depreciation recapture and long-term CG rates. Find your net sale proceeds.",
    targetKeyword: "rental property capital gains calculator",
    estimatedVolume: 3600,
    estimatedKD: 40,
    h1: "Rental Property Capital Gains Calculator",
    intro:
      "Selling a rental property triggers capital gains tax on the profit, plus depreciation recapture tax on every dollar of depreciation you claimed during ownership. Understanding the full tax cost before you sell is essential — in some cases, a 1031 exchange or installment sale changes the math dramatically. This page explains how each component is calculated, using the property in the calculator above as a worked example.",
    howItWorks:
      "The taxable gain on a rental property sale is calculated in two layers, each taxed at a different rate.\n\nLayer 1 — Depreciation recapture: All accumulated depreciation deductions taken during ownership are recaptured and taxed at a flat 25% federal rate under IRS Section 1250 (Unrecaptured Section 1250 Gain). This applies regardless of how long you held the property.\n\nLayer 2 — Long-term capital gain: The remaining profit above the adjusted basis (after removing recaptured depreciation) is taxed at the long-term capital gains rate if you held the property for more than one year. For 2024, long-term CG rates are 0% (taxable income under ~$47,025 single / ~$94,050 married), 15% (most filers), or 20% (income above ~$518,900 single / ~$583,750 married), per IRS Publication 544.\n\nFormula: Adjusted basis = Original purchase price + capital improvements − accumulated depreciation. Gain = Sale price − selling costs − adjusted basis. Depreciation recapture = accumulated depreciation × 25%. Remaining long-term gain = (gain − accumulated depreciation) × long-term CG rate.\n\nThe non-obvious fact that catches investors off guard: depreciation recapture is unavoidable even if you never claimed the depreciation deduction. The IRS taxes depreciation that was 'allowed or allowable.' If you failed to claim it during ownership, you paid more tax than necessary each year and will still owe recapture at sale. A 1031 exchange defers all of this — both the capital gain and the depreciation recapture — into the replacement property.",
    commonMistakes: [
      "Forgetting that depreciation recapture is taxed at 25%, not at the long-term capital gains rate. Many investors plan for 15% on all of their gain and are surprised by the higher rate on the recaptured amount.",
      "Assuming you can avoid depreciation recapture by not claiming depreciation. The IRS taxes recapture on amounts 'allowed or allowable,' so even if you skipped the deduction during ownership, you owe the 25% recapture tax at sale.",
      "Leaving out selling costs from the gain calculation. Real estate commissions (typically 5–6%), title insurance, and closing costs reduce your net proceeds and therefore reduce the taxable gain. These are legitimate deductions from the sale price.",
      "Treating a 1031 exchange as tax elimination. A 1031 exchange defers capital gains and depreciation recapture into the replacement property — it does not eliminate them permanently unless you hold until death (when a step-up in basis may apply to heirs).",
      "Not accounting for state capital gains taxes. Many states impose their own capital gains tax on top of federal rates. California, for example, taxes capital gains as ordinary income at rates up to 13.3%.",
    ],
    workedExample:
      "A property purchased for $250,000 (with $7,500 in closing costs) is sold for $380,000 after 10 years. Selling costs are $22,800 (6% commission). The depreciable basis was $206,000 (82% of total cost basis of $257,500). Annual depreciation was $7,491 ($206,000 ÷ 27.5), and 10 years of deductions total $74,909. Adjusted basis at sale: $257,500 − $74,909 = $182,591. Net sale proceeds: $380,000 − $22,800 = $357,200. Total gain: $357,200 − $182,591 = $174,609. Of that, $74,909 is depreciation recapture taxed at 25% = $18,727. The remaining $99,700 is long-term capital gain taxed at 15% = $14,955. Total federal tax: $33,682 on a $174,609 gain — about 19.3% effective rate. Without a 1031 exchange, the investor nets $357,200 − $33,682 = approximately $323,500 after federal tax.",
    faqs: [
      {
        question: "What is the capital gains tax on a rental property sale?",
        answer:
          "Selling a rental property triggers two types of federal tax. First, accumulated depreciation is recaptured at a flat 25% rate (IRS Unrecaptured Section 1250 Gain). Second, the remaining profit is taxed at the long-term capital gains rate — 0%, 15%, or 20% depending on your income. Most sellers pay 15% on the non-recapture portion, for a blended effective rate around 18–22%.",
      },
      {
        question: "What is depreciation recapture and how is it taxed?",
        answer:
          "Depreciation recapture is the IRS mechanism for recovering the tax benefit of depreciation deductions when you sell the property. All accumulated depreciation is taxed at a flat 25% federal rate under Section 1250 — higher than the standard 15% long-term capital gains rate most sellers pay on the remaining gain.",
      },
      {
        question: "Can I avoid depreciation recapture tax?",
        answer:
          "You cannot eliminate depreciation recapture, but you can defer it with a 1031 like-kind exchange. A qualifying 1031 exchange rolls your gain and accumulated depreciation into the replacement property, deferring all taxes until you eventually sell without exchanging. If you hold replacement property until death, heirs may receive a stepped-up basis, potentially eliminating deferred gains.",
      },
      {
        question: "What is the adjusted basis of a rental property?",
        answer:
          "Adjusted basis equals your original purchase price plus closing costs and capital improvements, minus accumulated depreciation deducted over your ownership period. The lower your adjusted basis, the higher your taxable gain at sale. Depreciation reduces basis each year, which is why long-held properties often trigger larger gains.",
      },
      {
        question: "How do selling costs reduce my capital gains tax?",
        answer:
          "Selling costs — real estate commissions, title fees, attorney fees, and other closing costs — reduce your net sale proceeds and therefore reduce your taxable gain. On a $380,000 sale with 6% in selling costs, $22,800 is subtracted before calculating the gain. Always include selling costs in your net proceeds estimate.",
      },
    ],
    sources: [
      {
        label: "IRS Publication 544 — Sales and Other Dispositions of Assets",
        url: "https://www.irs.gov/publications/p544",
      },
      {
        label: "IRS Topic No. 409 — Capital Gains and Losses",
        url: "https://www.irs.gov/taxtopics/tc409",
      },
    ],
    toolHeading: "Model your rental property's financials",
    toolSubheading: "Enter your property details above — then use the gain formula below to estimate sale taxes.",
    preset: {
      purchasePrice: 250000,
      downPaymentPct: 25,
      closingCostsPct: 3,
      interestRatePct: 6.5,
      loanTermYears: 30,
      monthlyRent: 2000,
      vacancyRatePct: 5,
      propertyTaxAnnual: 2500,
      insuranceAnnual: 1100,
      maintenancePctOfRent: 8,
      managementPctOfRent: 0,
    },
    relatedSlugs: ["roi-calculator", "cash-flow-calculator", "depreciation-calculator"],
  },
];
