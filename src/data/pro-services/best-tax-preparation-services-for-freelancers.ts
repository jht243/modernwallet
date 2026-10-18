import type { RoundupEntry } from "../roundups";

// Paid placement (eseospace order, 2026-10-18). #1 = Elite Pro-Tax & Financial Services (client order
// changed by the client on 2026-10-18). Every firm fact below was checked on the firm's own site that
// day: eliteprotaxgvl.com (/, /about-us/, /self-employed-tax-services/, /locations/, /tax-preparation/,
// /irs-audit-defense/, /faq/). National prices were read on each provider's
// own pricing pages the same day (2025 returns filed in 2026). Tax figures: IRS pages in `sources`;
// the $50,000 worked example is output of src/lib/self-employment-tax.ts (see the 1099 tax spoke).
//
// comparisonTable: the roundup template already renders the "Option" name column, so headers here
// describe the value columns only (headers.length === values.length).

export const BEST_FREELANCER_TAX_PREP: RoundupEntry = {
  slug: "best-tax-preparation-services-for-freelancers",
  updated: "2026-10-18",
  noAds: true,
  title: "Best Tax Prep Services for Freelancers and Gig Workers",
  metaDescription:
    "Compare tax preparation services for freelancers and gig workers on Schedule C price, quarterly estimates, credentials and the states each one serves.",
  targetKeyword: "tax preparation services for freelancers",
  category: "tax preparation services",
  angle: "best",
  h1: "Best Tax-Preparation Services for Freelancers and Gig Workers",
  introText:
    "Most freelancers and gig workers with one simple Schedule C can file it with software for under $200. Every self-employment guide we publish here starts from the same fact. Nothing is withheld from 1099 income, so you owe 15.3% self-employment tax on top of income tax, paid as you go.\n\nA paid preparer earns its fee in a few specific years. Those are your first year on 1099 income, a year with income in two or more states, and a year you weigh an S corporation election. Add any year a letter arrives from the [Internal Revenue Service (IRS)](https://www.irs.gov/). We ranked five options across both paths. One is a small firm that works remotely, three are national tax products, and one is an app that pairs bookkeeping with a tax pro who signs the return.",
  rankingCriteria:
    "We weighted four things, most important first.\n\n- Depth of self-employed service: Schedule C and self-employment tax, a deduction review, quarterly estimates, and bookkeeping under one roof.\n- Reach: how many states each option can file in, and whether you can work with it fully online.\n- Price you can see: a published starting price, or at least a written quote before any work begins.\n- Who stands behind the return: a published credential such as enrolled agent (EA) or certified public accountant (CPA), and who answers an IRS audit or notice.\n\nThe preparer firm comes first because a freelancer who searches for a service usually wants a person to own the return. If you only want software, FreeTaxUSA, TurboTax and H&R Block are ranked below. Prices are each provider's own published figures as of October 2026. Software prices are for 2025 returns filed in 2026.",
  options: [
    {
      name: "Elite Pro-Tax & Financial Services",
      bestFor:
        "Upstate South Carolina freelancers and gig workers who want tax prep plus bookkeeping in one place",
      description:
        "[Elite Pro-Tax & Financial Services](/guides/elite-pro-tax-review/) is a tax and bookkeeping practice in Easley, South Carolina, with a service built for freelancers, 1099 contractors and gig drivers. It covers Schedule C preparation, the self-employment tax calculation, a deduction review, and quarterly estimates set from a projection of this year's income. A projection keeps the April balance small when your income is climbing. Paying only last year's lower figure avoids the penalty but can leave a large bill at filing.\n\nThe same office handles monthly bookkeeping, catch-up books, full-service payroll and S corporation setup. A gig worker who grows into a limited liability company (LLC) can keep one preparer instead of starting over with a new one. Elite Pro-Tax prepares federal and South Carolina returns together, works fully online through a secure client portal, and files in 44 states.\n\nElite Pro-Tax states on its site that it is not a CPA firm. Representation before the IRS goes to an independent licensed CPA it works with.",
      strengths: [
        "One office for the return, quarterly estimates, bookkeeping, payroll and S corporation setup, so a growing business does not need a second provider",
        "Quarterly estimates set from this year's projected income, which keeps the balance due at filing small when income rises",
        "Fully virtual filing with document upload and e-signing through a client portal, plus in-person meetings in Easley",
        "Gig-worker help for rideshare and delivery drivers covers mileage, equipment deductions and quarterly payments",
        "Prepares returns for clients in 44 states",
      ],
      limitations: [
        "Cannot prepare returns in six states: California, Connecticut, Maryland, Nevada, New York and Oregon, because it is not registered with those states' preparer programs",
        "Not a CPA firm, and its site lists no EA or CPA credential for its own preparers",
        "IRS audit representation goes to an outside CPA, so a notice brings a second professional into the file",
        "No published prices. You get a quote after a consultation",
      ],
      pricing:
        "Quote-based. Elite Pro-Tax's site cites profession-wide going rates of $500 to $1,500 or more for self-employed returns, but it publishes no fee of its own.",
    },
    {
      name: "Keeper",
      bestFor: "1099 contractors who want deductions tracked all year and a tax pro to sign the return",
      description:
        "Keeper connects to your bank and card accounts, sorts expenses into deductions through the year, and then files your return. On the Standard plan, a tax pro reviews and signs your federal return and up to two state returns. For a gig driver with hundreds of small charges, automatic sorting means the deductions are already listed in April.\n\nThe Premium plan adds quarterly tax payments, audit protection, returns for three or more states, and a meeting with a tax pro. Keeper's pricing page shows a CPA and an EA among its tax pros but does not say which one reviews a given return, so ask which credential your reviewer holds before a notice arrives.",
      strengths: [
        "Bookkeeping and filing together for $199 a year on the Standard plan",
        "A tax pro reviews and signs the return, so you are not filing alone",
        "Automatic expense tracking across unlimited connected accounts catches small gig costs as they post",
        "Premium adds quarterly tax payments and audit protection",
      ],
      limitations: [
        "Quarterly payments, audit protection and three or more state returns require the $399 Premium plan",
        "An annual subscription, so the fee repeats every year even when your return does not change",
        "S corporation filing needs the $1,199 Business plan",
      ],
      pricing: "Bookkeeping Only $20/month (no filing). Standard $199/year. Premium $399/year. Business $1,199/year.",
    },
    {
      name: "H&R Block",
      bestFor: "Freelancers who want to start in software and switch to a tax pro if the return gets hard",
      description:
        "H&R Block sells both paths under one account. Its Self-Employed online product handles 1099 income with expenses for $130 plus $49 per state. If the return gets complicated partway through, you can add Tax Pro Review to any do-it-yourself product. You can also hand the whole return to an H&R Block tax pro online or in an office.\n\nTax pro filing starts at $99 plus a state fee. That is a floor, and H&R Block's tax pro page lists no separate Schedule C price, so ask for the total before you hand over documents.",
      strengths: [
        "Do-it-yourself and full-service options under one account, so you can switch midway without starting over",
        "Tax Pro Review can be added to any do-it-yourself product at any point in the return",
        "Local offices plus virtual tax pros, for in-person or remote help",
        "The Self-Employed online product covers 1099 income with business expenses",
      ],
      limitations: [
        "$49 per state return on paid online products adds up for multi-state filers",
        "Tax pro pricing is a starting figure with no published Schedule C price",
        "The online Self-Employed product costs $130 more at the federal level than FreeTaxUSA for the same Schedule C",
      ],
      pricing: "Online Self-Employed $130 + $49 per state. Tax pro, virtual or in office, from $99 + state fee.",
    },
    {
      name: "TurboTax",
      bestFor: "Freelancers who want guided software with on-demand expert help",
      description:
        "TurboTax Do It Yourself Premium is Intuit's product for self-employed filers and investors. It includes Schedule C, a 1099-NEC photo import in the mobile app, and a year-round tax estimator once you have filed. TurboTax lists Premium at $139 for the federal return, with state returns extra.\n\nIf you want a person, TurboTax Expert Assist adds on-demand expert help at $59 to $209 across its tiers. Expert Full Service starts at $129, but TurboTax says that price covers a W-2 and Form 1040 only, and it lists no Schedule C price.",
      strengths: [
        "Interview-style questions written for Schedule C income and expenses",
        "1099-NEC photo import in the mobile app saves typing each form",
        "The year-round tax estimator after filing helps you size next year's quarterly payments",
        "Expert Assist lets you ask a tax expert questions without handing over the whole return",
      ],
      limitations: [
        "$139 federal before state fees, the highest do-it-yourself price here",
        "Expert Assist reaches $209 at the top of its range",
        "The $129 Full Service starting price excludes Schedule C returns",
      ],
      pricing:
        "Do It Yourself Premium $139 federal + state. Expert Assist $59 to $209 + state. Expert Full Service from $129 (W-2 and Form 1040 only) + state.",
    },
    {
      name: "FreeTaxUSA",
      bestFor: "Freelancers with a clean Schedule C who are comfortable filing alone",
      description:
        "FreeTaxUSA files a federal return with business income for $0 and charges $15.99 per state. Its free federal return covers every tax situation, including its Self-Employed tier for freelancers and contractors, so you pay no upgrade fee for a Schedule C.\n\nIf you want help, Deluxe Support costs $7.99 and adds live chat, priority support and unlimited amendments. Pro Support costs $64.99 and adds a final review, personal tax advice and phone support. Audit Defense is a $19.99 add-on.",
      strengths: [
        "$0 federal return, including self-employed returns",
        "$15.99 per state, the lowest state fee here",
        "Imports a prior-year return from TurboTax, H&R Block or other software",
        "Pro Support at $64.99 buys a final review and phone advice for less than H&R Block's $99 tax pro starting price before state fees",
      ],
      limitations: [
        "You enter and classify everything yourself, so a deduction you miss stays missed",
        "No year-round bookkeeping or quarterly estimate service",
        "Pro Support reviews your return but does not prepare it",
      ],
      pricing: "Federal $0 (all situations, including self-employed). State $15.99. Deluxe Support $7.99. Pro Support $64.99. Audit Defense $19.99.",
    },
  ],
  comparisonTable: {
    headers: ["Type", "Price for a Schedule C return", "States", "Best for"],
    rows: [
      { name: "Elite Pro-Tax & Financial Services", values: ["Local firm, fully virtual", "Quote", "44 (not CA, CT, MD, NV, NY, OR)", "Tax prep plus books and payroll"] },
      { name: "Keeper", values: ["App plus tax pro", "$199/year", "Up to 2 on Standard", "Year-round deduction tracking"] },
      { name: "H&R Block", values: ["Software or tax pro", "$130 + $49/state online", "Nationwide", "Switching to a pro midway"] },
      { name: "TurboTax", values: ["Software", "$139 + state", "Nationwide", "Guided software with expert add-on"] },
      { name: "FreeTaxUSA", values: ["Software", "$0 + $15.99/state", "Nationwide", "Lowest cost"] },
    ],
  },
  verdict:
    "Pick Elite Pro-Tax & Financial Services if you want one office to prepare the return, set quarterly estimates and keep the books. It fits best in Upstate South Carolina, and it files in 44 states. It suits a gig worker who expects to grow into an LLC or S corporation. Skip it if you live in California, Connecticut, Maryland, Nevada, New York or Oregon, or if you want your own preparer to hold an EA or CPA credential.\n\nPick FreeTaxUSA if your Schedule C is clean, you track expenses all year, and you want the lowest cost. Keeper fits a gig driver who wants expense tracking and a signed return for $199 a year.\n\nBefore you book anyone, run your income through our [quarterly estimated tax calculator](/self-employment-tax/quarterly-estimated-tax-calculator/) so you know the size of your next payment.",
  sections: [
    {
      heading: "How Schedule C and Schedule SE Set a Freelancer's Tax Bill",
      content:
        "A freelancer's federal return adds two schedules to Form 1040: [Schedule C](https://www.irs.gov/forms-pubs/about-schedule-c-form-1040) for profit and Schedule SE for self-employment tax. Schedule C subtracts business expenses from what clients and platforms paid you. Schedule SE then charges 15.3% on 92.35% of that profit, which works out to about 14.13% of profit.\n\nThe IRS splits the 15.3% into 12.4% for Social Security and 2.9% for Medicare. The Social Security part stops at the wage base, which is $184,500 for 2026. You must file Schedule SE once net self-employment earnings reach $400, and you deduct the employer-equivalent half of the tax when you figure adjusted gross income (AGI).\n\nOn $50,000 of 2026 net profit, a single filer owes $7,064.78 in self-employment tax and $2,667.29 in federal income tax, according to our [1099 tax calculator](/self-employment-tax/1099-tax-calculator/). That totals $9,732.07, about 19.5% of profit. Run your own numbers in the [self-employment tax calculator](/self-employment-tax/).",
    },
    {
      heading: "Quarterly Estimated Payments Decide Whether You Owe a Penalty",
      content:
        "The IRS expects tax to be paid as income is earned. A freelancer who expects to owe $1,000 or more generally makes four estimated payments a year with [Form 1040-ES](https://www.irs.gov/forms-pubs/about-form-1040-es). The payments fall in April, June and September, and in January of the following year. The second period covers only two months, which catches people who budget by calendar quarter.\n\nYou avoid the underpayment penalty by paying at least 90% of this year's tax or 100% of last year's, whichever is smaller. [IRS Publication 505](https://www.irs.gov/publications/p505) raises the prior-year figure to 110% if last year's AGI was over $150,000. The prior-year route is the easiest target to hit, because last year's number is already on your old return.\n\nPreparers handle estimates in different ways. Elite Pro-Tax sets estimates from projected income, and Keeper adds quarterly tax payments on its Premium plan. Do-it-yourself software leaves the math to you. Our [quarterly estimated tax calculator](/self-employment-tax/quarterly-estimated-tax-calculator/) splits the annual bill into payments. Our guide to [how much to set aside for taxes](/self-employment-tax/how-much-to-set-aside-for-taxes/) turns it into a share of each deposit.",
    },
    {
      heading: "Gig Workers Owe Tax with or without a 1099",
      content:
        "Gig income is taxable whether or not a tax form arrives. For payments made in 2026, a client files a Form 1099-NEC only once it pays you $2,000 or more, up from $600. Payment apps and delivery or rideshare platforms file a [Form 1099-K](https://www.irs.gov/businesses/understanding-your-form-1099-k) only above $20,000 and 200 transactions.\n\nThose thresholds are the payers' filing rules. Your own duty to file Schedule SE starts at $400 of net earnings, and you report every dollar a platform paid you, with or without a form.\n\nFor a delivery or rideshare driver, the car is usually the largest deduction, and the IRS expects a mileage log kept as you drive. Elite Pro-Tax's gig-worker service covers mileage, equipment and quarterly payments, and Keeper tracks expenses from your bank feed. Our [DoorDash tax guide](/self-employment-tax/doordash-taxes/) and [Uber driver tax guide](/self-employment-tax/uber-driver-taxes/) show the numbers by platform, and the [mileage deduction calculator](/mileage-deduction/) prices your miles.",
    },
    {
      heading: "The Break-Even Point for Hiring a Tax Preparer",
      content:
        "A preparer pays for itself when the tax it saves you is larger than the extra fee. Each dollar of Schedule C deduction cuts both taxes. In the 12% bracket, it saves about 14 cents of self-employment tax. It also saves about 9 cents of income tax after the qualified business income (QBI) deduction, so roughly 23 cents in all.\n\nApply that to real prices. Keeper Standard costs $199 a year with a tax pro signing the return, and FreeTaxUSA charges $15.99 for one state return. The $183 gap breaks even if the tax pro finds about $800 of deductions you would have missed, or saves you a penalty and the hours of doing it yourself.\n\n| Path | Price for one Schedule C and one state | Missed deductions needed to break even |\n|---|---|---|\n| FreeTaxUSA | $15.99 | Baseline |\n| Keeper Standard | $199/year | About $800 |\n\nMost freelancers cross that line in four situations.\n\n- Your first year on 1099 income, when estimates and deductions are new to you\n- A year you weigh an S corporation election, which brings payroll and a reasonable salary\n- Income earned in more than one state\n- Any IRS notice about a past return\n\nIf none of those apply, keep your books in a free or cheap tool from our [accounting software roundup](/roundup/best-accounting-software-for-freelancers/) and file the return yourself. Our list of [self-employed tax deductions](/guides/self-employed-tax-deductions/) covers what to track.",
    },
    {
      heading: "Credentials Decide Who Can Speak for You Before the IRS",
      content:
        "Every paid preparer needs a preparer tax identification number (PTIN), but a PTIN alone carries no right to represent you before the IRS. Enrolled agents, CPAs and attorneys hold unlimited representation rights, according to the IRS [guide to preparer credentials](https://www.irs.gov/tax-professionals/understanding-tax-return-preparer-credentials-and-qualifications). Preparers who complete the IRS Annual Filing Season Program can represent you only on returns they prepared, and only before certain IRS staff.\n\nThat difference matters on the day a letter arrives. A preparer who is an EA or CPA can answer an audit letter about the return they prepared. Elite Pro-Tax brings in an independent licensed CPA for representation. Keeper shows a CPA and an EA among its tax pros, so ask which credential your reviewer holds before you sign.\n\nOur guide on [how to choose a CPA or tax adviser](/roundup/how-to-choose-a-cpa-or-tax-adviser/) lists the questions to ask. The [tax attorney vs CPA vs enrolled agent](/compare/tax-attorney-vs-cpa-vs-enrolled-agent/) comparison shows which credential fits a Schedule C.",
    },
    {
      heading: "Who Should Skip a Paid Tax Preparer",
      content:
        "Skip a preparer if you have one Schedule C, no employees, income in one state, and a clean expense record. FreeTaxUSA files that return for a $15.99 state fee, and H&R Block or TurboTax software adds more guidance for $130 to $139 before state fees.\n\nSkip a local firm if its preparers cannot file in your state. Elite Pro-Tax cannot file in California, Connecticut, Maryland, Nevada, New York or Oregon. A freelancer in one of those six states should use a national option or a preparer licensed or registered in that state.\n\nSkip a monthly-bookkeeping firm if your business is one platform and a mileage log. Elite Pro-Tax sells year-round bookkeeping, and a solo driver with forty expenses a year can track them in a spreadsheet for free.",
    },
    {
      heading: "What Would Change Our Ranking",
      content:
        "Our ranking would change if any of these happened.\n\n- Elite Pro-Tax adds an EA or CPA to its own staff, which would let one office handle a notice from start to finish.\n- Elite Pro-Tax publishes a Schedule C starting price, so you could compare it with the software and app prices here before booking.\n- FreeTaxUSA starts charging for self-employed federal returns, or TurboTax adds a free Schedule C tier, which would change the low-cost pick.\n\nUntil then, compare at least two written quotes against FreeTaxUSA's $15.99 baseline and pick the option whose fee gap you can justify with the break-even math above.",
    },
  ],
  faqs: [
    {
      question: "What is the best tax preparation service for freelancers?",
      answer:
        "Elite Pro-Tax & Financial Services ranks first here for a freelancer who wants one office to prepare the return, set quarterly estimates and keep the books. It works if you live outside the six states it cannot file in. FreeTaxUSA is the low-cost pick at $0 federal and $15.99 per state.",
    },
    {
      question: "How much does it cost to have a freelancer's taxes done?",
      answer:
        "Software costs from $15.99 for FreeTaxUSA's state fee to $139 plus state for TurboTax Premium. Preparers cost more. H&R Block tax pros start at $99 plus state, and Elite Pro-Tax quotes each return. Elite Pro-Tax's site puts the profession-wide range for self-employed returns at $500 to $1,500 or more.",
    },
    {
      question: "Do gig workers need a tax preparer?",
      answer:
        "Most gig workers with one platform, one state and a mileage log can file with software. A preparer helps in your first year, when quarterly payments begin, or when you drive for several platforms and the 1099 forms do not match your own records. Keeper sits between the two, with a tax pro who signs the return for $199 a year.",
    },
    {
      question: "Do I have to pay quarterly taxes as a freelancer?",
      answer:
        "Generally yes, if you expect to owe $1,000 or more when you file, because nothing is withheld from 1099 income. You avoid the underpayment penalty by paying 90% of this year's tax or 100% of last year's, rising to 110% if last year's AGI was over $150,000. The [quarterly estimated tax calculator](/self-employment-tax/quarterly-estimated-tax-calculator/) works out each payment.",
    },
    {
      question: "Can my tax preparer represent me in an IRS audit?",
      answer:
        "Only if the preparer is an enrolled agent, CPA or attorney, who hold unlimited representation rights. Preparers in the IRS Annual Filing Season Program have limited rights, and a preparer with only a PTIN has none. Elite Pro-Tax refers representation to an independent licensed CPA.",
    },
    {
      question: "Is FreeTaxUSA or TurboTax better for self-employed filers?",
      answer:
        "FreeTaxUSA costs less: $0 federal and $15.99 per state, against $139 federal plus state for TurboTax Do It Yourself Premium. TurboTax adds more guided questions, a 1099-NEC photo import and paid Expert Assist. Our [FreeTaxUSA vs TurboTax](/compare/freetaxusa-vs-turbotax/) comparison goes through the differences line by line.",
    },
    {
      question: "Does Elite Pro-Tax prepare returns outside South Carolina?",
      answer:
        "Yes, Elite Pro-Tax prepares returns for clients in 44 states through virtual appointments and a client portal. It cannot file in California, Connecticut, Maryland, Nevada, New York or Oregon. Each of those states licenses or registers tax preparers separately from the IRS, and Elite Pro-Tax says it is not currently registered in them.",
    },
  ],
  sources: [
    {
      label: "IRS: Self-employment tax (Social Security and Medicare taxes)",
      url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes",
    },
    { label: "IRS: Estimated taxes", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes" },
    { label: "IRS: Publication 505, Tax withholding and estimated tax", url: "https://www.irs.gov/publications/p505" },
    { label: "IRS: Understanding your Form 1099-K", url: "https://www.irs.gov/businesses/understanding-your-form-1099-k" },
    {
      label: "IRS: Understanding tax return preparer credentials and qualifications",
      url: "https://www.irs.gov/tax-professionals/understanding-tax-return-preparer-credentials-and-qualifications",
    },
    { label: "Elite Pro-Tax & Financial Services: Locations and states served", url: "https://eliteprotaxgvl.com/locations/" },
  ],
  relatedComparisons: [
    "tax-attorney-vs-cpa-vs-enrolled-agent",
    "freetaxusa-vs-turbotax",
    "turbotax-vs-hr-block",
    "1099-vs-w2",
  ],
  calculatorLinks: [
    { label: "Self-Employment Tax Calculator", href: "/self-employment-tax/" },
    { label: "Quarterly Estimated Tax Calculator", href: "/self-employment-tax/quarterly-estimated-tax-calculator/" },
    { label: "1099 Tax Calculator", href: "/self-employment-tax/1099-tax-calculator/" },
    { label: "How Much to Set Aside for Taxes", href: "/self-employment-tax/how-much-to-set-aside-for-taxes/" },
    { label: "Mileage Deduction Calculator", href: "/mileage-deduction/" },
  ],
};
