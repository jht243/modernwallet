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
    relatedSlugs: ["rental-income-calculator", "cap-rate-calculator", "cash-on-cash-return-calculator", "roi-calculator"],
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
    relatedSlugs: ["cash-flow-calculator", "cap-rate-calculator", "cash-on-cash-return-calculator", "roi-calculator"],
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
    relatedSlugs: ["cash-flow-calculator", "rental-income-calculator", "cash-on-cash-return-calculator", "roi-calculator"],
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
    relatedSlugs: ["cash-flow-calculator", "cap-rate-calculator", "rental-income-calculator", "roi-calculator"],
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
    ],
    sources: [
      { label: "IRS Publication 527, Residential Rental Property", url: "https://www.irs.gov/publications/p527" },
      { label: "Corporate Finance Institute — Internal Rate of Return (IRR)", url: "https://corporatefinanceinstitute.com/resources/valuation/internal-rate-return-irr/" },
    ],
    toolHeading: "Project your rental's total ROI",
    toolSubheading: "Combine cash flow, appreciation, and loan paydown into a 20-year return and IRR.",
    preset: { purchasePrice: 300000, downPaymentPct: 25, closingCostsPct: 3, interestRatePct: 7, loanTermYears: 30, monthlyRent: 2600, vacancyRatePct: 5, propertyTaxAnnual: 3500, insuranceAnnual: 1400, maintenancePctOfRent: 8, managementPctOfRent: 8, appreciationPct: 3, holdYears: 20 },
    relatedSlugs: ["cash-flow-calculator", "cap-rate-calculator", "cash-on-cash-return-calculator", "rental-income-calculator"],
  },
];
