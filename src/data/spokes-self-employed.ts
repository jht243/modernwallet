import type { SpokeEntry } from "./types";

// Self-employment tax spokes (2026-09-05). Powered by src/lib/self-employment-tax.ts through the
// "self-employment-tax" island; each spoke pre-configures the same engine for a different earner.
//
// Two facts carry this whole silo, both verified against IRS primary sources and both wrong on
// most competing pages, which still quote 2024 rules:
//   - For 2026 the Form 1099-NEC threshold rose from $600 to $2,000 (Instructions for Forms
//     1099-MISC and 1099-NEC, 12/2026), and the 1099-K threshold is over $20,000 AND more than
//     200 transactions.
//   - Neither threshold has anything to do with whether you owe tax. The IRS Gig Economy Tax
//     Center is explicit that gig income is reportable "even if the income is... not reported on
//     an information return form."
//
// CONTENT: keyword-gap-pass Phase 3 + Phase 4 per page. All dollar figures are engine output.

export const IRS_GIG = {
  label: "IRS — Gig Economy Tax Center",
  url: "https://www.irs.gov/businesses/gig-economy-tax-center",
};
export const IRS_SE_TAX = {
  label: "IRS — Topic no. 751, Social Security and Medicare withholding rates",
  url: "https://www.irs.gov/taxtopics/tc751",
};
export const IRS_1099K = {
  label: "IRS — Understanding your Form 1099-K",
  url: "https://www.irs.gov/businesses/understanding-your-form-1099-k",
};
export const IRS_1099NEC = {
  label: "IRS — Instructions for Forms 1099-MISC and 1099-NEC (2026)",
  url: "https://www.irs.gov/instructions/i1099mec",
};
export const IRS_MILEAGE = {
  label: "IRS — Standard mileage rates",
  url: "https://www.irs.gov/tax-professionals/standard-mileage-rates",
};
export const IRS_ES = {
  label: "IRS — Estimated taxes",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes",
};
export const IRS_SCHED_C = {
  label: "IRS — About Schedule C (Form 1040), Profit or Loss from Business",
  url: "https://www.irs.gov/forms-pubs/about-schedule-c-form-1040",
};

/** Every gig-platform page shares these three mistakes; the platform-specific ones come after. */
export const UNIVERSAL_MISTAKES = [
  "Assuming no 1099 means no tax. For 2026 a payer only files a 1099-NEC at $2,000 (up from $600) and a payment app only files a 1099-K above $20,000 and 200 transactions. Those are the payer's filing rules. Your own obligation starts at $400 of net self-employment earnings, and the IRS says to report gig income whether or not a form arrives.",
  "Paying nothing until April. Self-employment income has no withholding, so the IRS expects quarterly estimated payments. Waiting until you file can add an underpayment penalty on top of a bill you already were not expecting.",
  "Not tracking miles or expenses from day one. You are taxed on profit, not on what the platform paid you — but only for the expenses you can actually document. A mileage log reconstructed in April from memory is the single most commonly disallowed deduction.",
];

export const SELF_EMPLOYED_SPOKES: SpokeEntry[] = [
  // ---------------------------------------------------------------------------------------------
  // Core spokes
  // ---------------------------------------------------------------------------------------------
  {
    calculator: "self-employment-tax",
    slug: "1099-tax-calculator",
    updated: "2026-09-05",
    title: "1099 Tax Calculator: What You'll Owe in 2026",
    metaDescription:
      "Free 1099 tax calculator using 2026 IRS rates. Enter your contractor income and expenses to see your self-employment tax, income tax, and quarterly payment.",
    targetKeyword: "1099 tax calculator",
    estimatedVolume: 12100,
    estimatedKD: 30,
    h1: "1099 Tax Calculator: Self-Employment and Income Tax",
    introText:
      "A 1099 tax calculator estimates what you owe on contractor income, which is self-employment tax plus federal income tax on your profit after business expenses. The calculator above uses 2026 IRS figures and shows the number that matters most day to day: the share of each payment to move into a separate account the moment it lands.\n\nOn $50,000 of net profit, a single filer owes $7,064.78 in self-employment tax and $2,667.29 in federal income tax — $9,732.07 in total, about 19.5% of profit, or $2,433.02 per quarter.",
    howItWorks:
      "The starting point is not what the client paid you. It is your net profit: everything you invoiced, minus every legitimate business expense. That figure goes on Schedule C, and it is the number both taxes are calculated from.\n\nSelf-employment tax comes first. It is 15.3% — 12.4% Social Security plus 2.9% Medicare — applied to 92.35% of net profit rather than all of it, which makes the real rate 14.13% of profit. It is the tax that surprises people, because a W-2 employee only ever sees half of it on their payslip. The Social Security half stops once your combined wages and net earnings reach $184,500 in 2026; the Medicare half never stops.\n\nFederal income tax comes second, and it is calculated on a smaller number. Half your self-employment tax is deducted above the line, then the standard deduction ($16,100 single for 2026) comes off, then the 20% qualified business income deduction if you qualify. Only what is left runs through the ordinary brackets.\n\nThat stacking is why the effective rate is lower than most people fear at modest income, and why the advice to \"set aside 30%\" is wrong in both directions. On $50,000 of profit the true figure is about 19.5%. Below roughly $17,400 of profit for a single filer with no other income, the standard deduction absorbs everything and federal income tax is zero — leaving only the 14.1% self-employment tax.\n\nBut the same advice fails the other way for anyone with a job. Freelance income stacks on top of your salary, so it is taxed at your top marginal rate from the very first dollar, while your W-2 withholding already covers the salary. Someone earning $80,000 at a job plus $20,000 freelancing needs to set aside 30.5% of the freelance money, not 19.5%. Enter your W-2 wages above and the tool computes the tax your freelance income actually causes rather than dividing your household bill by your side income.\n\nNone of this is withheld for you, so you pay it in four instalments through the year using Form 1040-ES. Our [guide to budgeting with irregular income](/guides/how-to-budget-with-irregular-income/) covers the due dates and the safe-harbour rule that switches off the underpayment penalty, and the [self-employment tax calculator](/self-employment-tax/) explains the Schedule SE math in full.",
    commonMistakes: [
      "Calculating tax on gross receipts instead of profit. You are taxed on what is left after business expenses, and for many contractors that gap is thousands of dollars.",
      "Using a flat 30% set-aside for everything. At $50,000 of profit with no other income the real figure is about 19.5%; with a $80,000 day job on top of $20,000 of freelance income it is 30.5%. One rule of thumb cannot cover both.",
      "Forgetting the deduction for half of self-employment tax. It is automatic and above the line, and it lowers the income the brackets apply to.",
      "Skipping the 20% QBI deduction. Most Schedule C filers below the §199A threshold qualify, and it is one of the largest deductions available to a contractor.",
      "Ignoring state income tax. Every figure here is federal only. Depending on where you live, add anywhere from nothing to more than 10%.",
      "Assuming a client who sends no 1099 has reported nothing. The 2026 filing threshold is $2,000 for a 1099-NEC, but your obligation to report starts at $400 of net earnings regardless.",
    ],
    workedExample:
      "Take a freelance designer with $58,000 of invoices and $8,000 of business expenses — software, a laptop, insurance, and an accountant. Net profit is $50,000. Self-employment tax applies to 92.35% of that, or $46,175: 12.4% Social Security is $5,725.70 and 2.9% Medicare is $1,339.08, for $7,064.78 total. Half of that, $3,532.39, is deducted above the line, bringing income down to $46,467.61. The $16,100 standard deduction and a $6,073.52 QBI deduction come off, leaving $24,294.09 of taxable income — $2,667.29 of federal income tax at the 10% and 12% rates. Total federal tax is $9,732.07, which is 19.5% of profit and $2,433.02 due each quarter.",
    faqs: [
      {
        question: "How much tax do I pay on 1099 income?",
        answer:
          "Self-employment tax of 15.3% on 92.35% of your net profit (an effective 14.13%), plus federal income tax on what remains after the deduction for half your self-employment tax, the standard deduction, and the QBI deduction. On $50,000 of net profit a single filer pays about $9,732 — roughly 19.5% of profit. The percentage rises with income and rises sharply if you also have W-2 wages, because freelance income is taxed on top of your salary.",
      },
      {
        question: "How much should I set aside from each 1099 payment?",
        answer:
          "Between 20% and 25% of profit for a full-time freelancer with no other income, and closer to 30% to 35% if you have a day job, because side income stacks at your top marginal rate. Add your state's income tax rate on top. The most reliable approach is to move the percentage the calculator gives you into a separate savings account the day each payment clears, rather than trying to find the money in April.",
      },
      {
        question: "Do I have to file if I made less than $2,000 and got no 1099?",
        answer:
          "Yes, if your net earnings from self-employment were $400 or more — that threshold, not the 1099 threshold, is what triggers the self-employment tax filing requirement. The $2,000 figure for 2026 is only the point at which the payer must file a Form 1099-NEC, and it went up from $600 this year. The IRS states plainly that gig income is reportable even when no information return is issued.",
      },
      {
        question: "What expenses can I deduct from 1099 income?",
        answer:
          "Anything ordinary and necessary for the work: business mileage, a home office that is used regularly and exclusively for business, software subscriptions, equipment, professional insurance, accounting fees, business phone and internet at the business-use percentage, training, and supplies. Each deduction cuts self-employment tax and income tax at the same time, so for someone in the 12% bracket a deductible dollar is worth about 26 cents rather than 12.",
      },
      {
        question: "When are quarterly taxes due for 1099 income?",
        answer:
          "Estimated payments are generally due four times a year — in April, June, and September, and in January of the following year. Paying at least 90% of the current year's tax, or 100% of last year's (110% if your prior-year AGI was over $150,000), switches off the underpayment penalty even if you end up owing more at filing. That safe harbour is the practical target for anyone whose income varies month to month.",
      },
      {
        question: "Is a 1099 tax calculator accurate enough to pay from?",
        answer:
          "It is accurate enough to set aside from, which is its job. This one uses the real 2026 statutory figures and the actual Schedule SE method rather than a flat percentage, so the quarterly number is a sound basis for estimated payments. It does not model state or local tax, health-insurance or retirement deductions, or credits — all of which move the final figure — so treat the annual return, not the calculator, as the settlement.",
      },
    ],
    sources: [IRS_SE_TAX, IRS_SCHED_C, IRS_1099NEC, IRS_ES, IRS_GIG],
    toolHeading: "1099 tax calculator",
    toolSubheading: "Enter your net profit after business expenses",
    preset: {
      netProfit: 50000,
      filingStatus: "single",
      w2Wages: 0,
      otherIncome: 0,
      applyQbi: true,
      incomeLabel: "1099 income after business expenses",
    },
    relatedSlugs: ["how-much-to-set-aside-for-taxes", "doordash-taxes", "upwork-taxes"],
  },

  {
    calculator: "self-employment-tax",
    slug: "how-much-to-set-aside-for-taxes",
    updated: "2026-09-05",
    title: "How Much to Set Aside for Taxes (1099, 2026)",
    metaDescription:
      "How much should you set aside for taxes on 1099 income? See the real percentage for your income — it is not 30% — with 2026 IRS self-employment tax rates.",
    targetKeyword: "how much should i set aside for taxes 1099",
    estimatedVolume: 320,
    estimatedKD: 25,
    h1: "How Much Should I Set Aside for Taxes on 1099 Income?",
    introText:
      "Set aside 20% to 25% of your net profit if freelancing is your only income, and 30% to 35% if you also have a W-2 job — then add your state's income tax rate. The single figure everyone repeats, 30%, is too high for most full-time freelancers and too low for most side hustlers.\n\nOn $45,000 of net profit with no other income, a single filer owes $8,579.50 in federal tax — 19.1%. Move the same $45,000 alongside a salary and the right figure changes completely.",
    howItWorks:
      "The set-aside percentage is not one number because two different taxes stack in different ways.\n\nSelf-employment tax is the flat part. It is 15.3% of 92.35% of profit, an effective 14.13%, and it applies from the very first dollar of profit up to the $184,500 Social Security wage base. Nothing shelters it — not the standard deduction, not the QBI deduction. If you set aside nothing else, set aside this.\n\nFederal income tax is the variable part, and it is where the flat rules of thumb break. It applies only to what is left after half your self-employment tax, the standard deduction, and the QBI deduction come off. For a single filer with no other income, that means income tax is zero until profit reaches roughly $17,400. Between there and $50,000 it climbs slowly. A part-time freelancer earning $15,000 of profit needs 14.1%, not 30% — setting aside 30% would idle more than a thousand dollars for a year.\n\nThe direction reverses the moment you have a job. Your salary fills the low brackets first, so every dollar of freelance profit is taxed at your top marginal rate. Your W-2 withholding already covers your salary, so what you must fund yourself is only the extra tax the freelance income causes. Earn $80,000 at a job and $20,000 freelancing, and that extra tax is $6,097.23 on the $20,000 — 30.5%. The same $20,000 earned by someone with no job would cost 14.1%.\n\nThat is the calculation the tool above performs, and it is the reason its headline is a percentage rather than a bill. It computes your household tax with the self-employment income and without it, and reports the difference against your profit.\n\nTwo adjustments are yours to make. State income tax is not modelled here and ranges from zero to over 10%. And if your income is lumpy, set aside from every payment as it arrives rather than saving a quarterly lump — a percentage moved on the day money clears survives a slow month in a way a good intention does not.\n\nWhere the money goes matters less than that it leaves your spending account. A separate high-yield savings account is enough. Our [guide to budgeting with irregular income](/guides/how-to-budget-with-irregular-income/) covers the quarterly due dates and the safe-harbour rule, and the [1099 tax calculator](/self-employment-tax/1099-tax-calculator/) shows the full breakdown behind the percentage.",
    commonMistakes: [
      "Applying 30% to everything. It over-saves for a full-time freelancer under $50,000 of profit and under-saves for almost anyone with a day job.",
      "Setting aside a share of gross invoices rather than profit. If you have real expenses, the percentage applies to what is left after them — otherwise you are saving against money you already spent on the business.",
      "Forgetting state income tax. Every percentage here is federal. In a high-tax state the real figure can be five to ten points higher.",
      "Waiting to save until the quarterly due date. Income that arrives unevenly gets spent unevenly; moving the percentage the day each payment clears is what makes the quarterly payment possible.",
      "Ignoring the effect of a spouse's income. On a joint return your profit stacks on the household total, which can push the set-aside rate several points higher than a single-earner estimate.",
    ],
    workedExample:
      "Two people each earn $20,000 of freelance profit in 2026. The first has no other income: their self-employment tax is $2,825.91, the standard deduction wipes out nearly all their income tax, and their total federal bill is $3,024.87 — a 15.1% set-aside. The second already earns $80,000 in a salaried job. Their self-employment tax on the same $20,000 is identical at $2,825.91, but the profit stacks on top of their salary in the 22% bracket, so the freelance income adds $6,097.23 to the household bill once income tax is counted. That is a 30.5% set-aside on the same $20,000 of work — double the first person's rate, for identical income.",
    faqs: [
      {
        question: "Should I set aside 30% for 1099 taxes?",
        answer:
          "Only if you also have a W-2 job or earn well into six figures. For a full-time freelancer with no other income, 20% to 25% of net profit covers federal tax at typical earnings, and under about $17,400 of profit the real figure is just the 14.1% self-employment tax. With a day job, 30% to 35% is right, because freelance income is taxed at your top marginal rate on top of your salary. Add state tax to any of these.",
      },
      {
        question: "Do I set aside a percentage of gross income or profit?",
        answer:
          "Profit — gross income minus business expenses. Tax is calculated on Schedule C net profit, so saving a percentage of gross over-saves by exactly your expense ratio. The practical method is to estimate your expenses as a share of revenue, then apply the set-aside percentage to the remainder of each payment as it arrives.",
      },
      {
        question: "Where should I keep money set aside for taxes?",
        answer:
          "A separate savings account that is not your spending account, ideally one paying interest. The point is friction: money in your checking account gets spent, and the quarterly payment then has to come out of next month's income. Some freelancers use a dedicated business savings account and transfer the set-aside percentage the day each client payment clears.",
      },
      {
        question: "How much should I set aside if my income varies every month?",
        answer:
          "Set aside a fixed percentage of every payment rather than a fixed dollar amount per month. A percentage self-adjusts: a big month contributes more, a lean month contributes less, and you never have to predict the year in advance. Recheck the percentage mid-year — if income has run well above or below plan, the right rate has moved with it.",
      },
      {
        question: "What if I set aside too much?",
        answer:
          "You get it back, either as a refund or as a smaller final quarterly payment. Over-saving costs you only the interest on the surplus, which is why erring high is the safer mistake. Under-saving costs you the shortfall plus a possible underpayment penalty, at a moment when the money has already been spent.",
      },
    ],
    sources: [IRS_SE_TAX, IRS_ES, IRS_GIG],
    toolHeading: "How much to set aside",
    toolSubheading: "Add your W-2 wages to see the real rate for side income",
    preset: {
      netProfit: 45000,
      filingStatus: "single",
      w2Wages: 0,
      otherIncome: 0,
      applyQbi: true,
    },
    relatedSlugs: ["1099-tax-calculator", "doordash-taxes"],
  },
];
