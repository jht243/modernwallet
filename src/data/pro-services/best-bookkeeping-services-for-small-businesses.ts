import type { RoundupEntry } from "../roundups";

// Paid placement (eseospace, 2026-10-18). #1 is the client. Every firm fact below comes from that
// firm's own website, checked 2026-10-18. register: operator. page type: roundup (review floor).
// medium: text -> text.

export const BEST_BOOKKEEPING_SERVICES: RoundupEntry = {
  slug: "best-bookkeeping-services-for-small-businesses",
  updated: "2026-10-18",
  noAds: true,
  title: "Best Bookkeeping Services for Small Businesses (2026)",
  metaDescription:
    "Five bookkeeping services compared on monthly price, catch-up fees and tax help, from a $250 flat fee to a local firm that quotes in writing.",
  targetKeyword: "bookkeeping services for small businesses",
  category: "bookkeeping services",
  angle: "best",
  segment: "small business owners",
  h1: "Best Bookkeeping Services for Small Businesses",
  introText:
    "Danielson Bookkeeping & Consulting is our top pick among bookkeeping services for small businesses and churches that want one named bookkeeper and a written quote. At ModernWallet, we publish free calculators and plain-language money guides for owners who need an accurate number before they sign anything.\n\nWe compared five services, from a local firm in Idaho to national online teams. Published prices start at a flat $250 a month. Danielson, the one local firm, quotes after it reviews your books.",
  rankingCriteria:
    "We ranked each service on what it publishes about its own work. We did not hire any of them.\n\n- A named person on your books. You should know who reconciles your accounts and answers your questions.\n- Scope and price in writing before work starts. A written scope lists what is included and what is not, so the first invoice matches the quote.\n- Clear catch-up pricing. Many small businesses arrive months behind, so the backlog price matters.\n- A clean handoff at tax time. The books must support a return, whether the service files it or your certified public accountant (CPA) does.\n\nPrices below are the figures each service lists on its own pricing page.",
  options: [
    {
      name: "Danielson Bookkeeping & Consulting",
      bestFor: "Churches and small businesses that want one named bookkeeper and a written scope",
      description:
        "Danielson Bookkeeping & Consulting is a Kuna, Idaho practice run by Carey Danielson. Carey holds a master of business administration (MBA) and the QuickBooks Online Advanced ProAdvisor certification issued by Intuit. Danielson lists more than 20 years of bookkeeping work, much of it with churches.\n\nThe monthly service records every transaction and reconciles each bank, card, and loan account. You get a profit and loss (P&L) statement and a balance sheet on an agreed date each month. Church clients also get fund accounting, giving records, year-end contribution statements, and pastoral payroll.\n\nDanielson does not prepare tax returns. Carey keeps the books organized so your CPA can file from them. Our [Danielson Bookkeeping review](/guides/danielson-bookkeeping-review/) covers the church services and the onboarding steps in more detail.",
      strengths: [
        "Church fund accounting ties each gift to its fund, so leadership gets a monthly fund balance report",
        "QuickBooks setup, cleanup, catch-up, and migration from QuickBooks Desktop or spreadsheets, so the person who fixes the file also runs it each month",
        "A written scope with inclusions, exclusions, schedule, and fee before any work starts, so the price is settled before the first invoice",
        "Named user logins and secure file sharing in place of shared passwords, with access removed when the engagement ends",
        "In-person meetings across Idaho's Treasure Valley, from Boise to Caldwell, and remote service elsewhere",
      ],
      limitations: [
        "No published prices, so request the written quote early and compare it with Merritt's $250 flat fee",
        "No tax preparation or tax planning, so you still need a CPA or enrolled agent at filing time",
        "The site names only Carey Danielson, so ask who covers your books during a vacation or illness",
        "Services are built around QuickBooks Online. If you use other accounting software, confirm Danielson will work in it",
      ],
      pricing:
        "Quote-based. Danielson sends a written scope and fee after a consultation and records review. Cost depends on transaction volume, number of accounts and funds, payroll, and how current the books are.",
    },
    {
      name: "Merritt Bookkeeping",
      bestFor: "Small businesses that want one flat monthly fee with no tiers",
      description:
        "Merritt Bookkeeping charges a flat $250 a month with no pricing tiers and no contracts. A bookkeeper enters every transaction in QuickBooks and sends you a spreadsheet to review the work, so you do not have to learn QuickBooks yourself. Each month also includes ten plain-English reports and standard financial statements for your accountant.\n\nCatch-up costs $200 for each month behind, or $100 for a month with fewer than 20 transactions to enter. Merritt does not prepare tax returns or run payroll.",
      strengths: [
        "$250 a month flat, so a busy month does not raise your bill",
        "Per-month catch-up pricing, so you can work out a backlog cost before you call",
        "A review spreadsheet lets you check every entry without a QuickBooks login",
        "Full refund if you are not satisfied within the first three months",
      ],
      limitations: [
        "No tax preparation or payroll, so plan on a separate CPA and payroll provider",
        "A small client roster by design, so you may need to submit a form and wait for an opening",
        "One plan for every client. If you want weekly bookkeeping, look at Xendoo or Bookkeeper.com instead",
      ],
      pricing:
        "$250/month flat, no contracts. Catch-up $200 per month behind ($100 for light months).",
    },
    {
      name: "Bookkeeper360",
      bestFor: "Businesses that want bookkeeping, payroll, and tax filing from one online provider",
      description:
        "Bookkeeper360 starts bookkeeping at $400 a month, with a U.S.-based team closing the books monthly or weekly. Books can be kept on a cash or accrual basis. The team works in QuickBooks or [Xero](https://www.xero.com/us/), connects to [Gusto](https://gusto.com/) payroll, and every plan includes Bookkeeper360's own reporting software.\n\nBookkeeper360 also sells tax, payroll, and sales tax work, so one provider can cover all three.",
      strengths: [
        "Monthly or weekly close on a cash or accrual basis, so a growing business can move to accrual books without changing providers",
        "If you already use QuickBooks or Xero, Bookkeeper360 works in either one",
        "Month-to-month or annual plans with no long-term commitment",
      ],
      limitations: [
        "$400 a month is a starting price, and Bookkeeper360 says pricing scales with size and complexity. Get the quote for your transaction volume in writing",
        "Catch-up starts at $1,000, which costs more than Merritt's per-month rate for a backlog under five months",
        "Bundle discounts are mentioned but not quantified, so ask for the bundled figure before you sign",
      ],
      pricing:
        "Bookkeeping from $400/month. Catch-up from $1,000. Business returns from $1,200/year. Payroll from $200/month. Sales tax from $125/month.",
    },
    {
      name: "Xendoo",
      bestFor: "Xero users who want weekly bookkeeping at a published price",
      description:
        "Xendoo's Essential plan costs $395 a month, or $355 a month billed annually, for businesses with up to $50,000 in monthly expenses. It covers four bank or credit card accounts, weekly bookkeeping, a dedicated team, and cash-basis books. Growth and Scale raise the expense ceiling to $75,000 and $125,000 a month.\n\nXendoo displays a Xero Partner of the Year award and offers a service that moves books from QuickBooks Online to Xero. Business tax returns, handled by CPAs, start at $1,295 a year.",
      strengths: [
        "Weekly bookkeeping on every plan, so the cash balance in your books is never more than a week old",
        "No onboarding or setup fees",
        "Annual billing saves 10%, which is $480 a year on the Essential plan",
      ],
      limitations: [
        "Essential is limited to four bank or card accounts and cash-basis books. Modified accrual starts on Growth, and full accrual needs a Custom quote",
        "The pricing page does not say whether ongoing bookkeeping runs in QuickBooks Online, so QuickBooks users should ask before signing",
      ],
      pricing:
        "Essential $395/month ($355 billed annually). Growth $695 ($625). Scale $995 ($895). Catch-up from $295/month. Business tax returns from $1,295/year.",
    },
    {
      name: "Bookkeeper.com",
      bestFor: "Businesses that want a cash flow statement and class or location tracking",
      description:
        "Bookkeeper.com, based in Waynesboro, Virginia, sells three plans priced by annual revenue and monthly transactions. The $399 plan covers up to $500,000 and 100 transactions with a monthly close, and the $799 plan reaches $1,000,000 and 300 transactions with a weekly close.\n\nEvery plan includes a dedicated bookkeeper and account manager, a month-end close, a balance sheet, a P&L, and a statement of cash flows. Books can be cash or accrual, with transactions split by class, location, or department.",
      strengths: [
        "A statement of cash flows on every plan, so you can see why cash fell in a month that showed a profit",
        "Class, location, and department tracking, so a business with two locations can see each one's profit",
      ],
      limitations: [
        "The $399 plan allows 100 transactions a month. Count last month's bank and card lines before you pick a tier",
        "Catch-up, payroll, and tax prices are not published, so ask for each in writing with the bookkeeping quote",
        "The site lists no CPA credential for its staff, so ask who prepares tax returns if you add that service",
      ],
      pricing:
        "Small Business $399/month, Plus $599/month (200 transactions, twice-monthly close), Advanced $799/month. Custom above $1,000,000 revenue.",
    },
  ],
  comparisonTable: {
    headers: ["Starting price", "Catch-up pricing", "Tax returns", "Best for"],
    rows: [
      {
        name: "Danielson Bookkeeping & Consulting",
        values: ["Written quote", "Quoted after file review", "No (works with your CPA)", "Churches, Treasure Valley businesses"],
      },
      { name: "Merritt Bookkeeping", values: ["$250/mo flat", "$200 per month behind", "No", "Flat monthly fee"] },
      { name: "Bookkeeper360", values: ["$400/mo", "From $1,000", "From $1,200/yr", "Books, payroll, and tax"] },
      { name: "Xendoo", values: ["$355/mo (annual)", "From $295/mo", "From $1,295/yr", "Weekly books in Xero"] },
      { name: "Bookkeeper.com", values: ["$399/mo", "Quote", "Quote", "Cash flow and class tracking"] },
    ],
  },
  verdict:
    "Choose Danielson Bookkeeping & Consulting if you run a church or a small business in Idaho's Treasure Valley and want one bookkeeper who sets up QuickBooks around how you operate. Plan on a separate CPA, because Danielson does not file returns.\n\nIf a published price matters more than a local relationship, Merritt Bookkeeping's $250 flat fee is the lowest monthly figure on this list. Bookkeeper360 suits owners who want payroll and tax from the same provider.",
  sections: [
    {
      heading: "Bookkeeper vs Accountant vs CPA",
      content:
        "A bookkeeper records and reconciles your transactions each month. An accountant uses those books to prepare tax returns and give tax advice, and only a licensed CPA firm can audit or review financial statements.\n\nBookkeepers do not need a CPA license. The [U.S. Bureau of Labor Statistics (BLS)](https://www.bls.gov/ooh/office-and-administrative-support/bookkeeping-accounting-and-auditing-clerks.htm) says certification is not usually required, and most bookkeepers learn on the job. A QuickBooks ProAdvisor certification shows a person passed Intuit's QuickBooks exam, and you can search certified ProAdvisors by ZIP code in [Intuit's ProAdvisor directory](https://quickbooks.intuit.com/find-an-accountant/).\n\nA CPA holds a state license, which you can confirm in the [CPAverify lookup](https://cpaverify.org/) run by the National Association of State Boards of Accountancy (NASBA). An enrolled agent (EA) is licensed by the [Internal Revenue Service (IRS)](https://www.irs.gov/tax-professionals/enrolled-agents) to represent taxpayers. Anyone paid to prepare federal returns must hold a [Preparer Tax Identification Number (PTIN)](https://www.irs.gov/tax-professionals/ptin-requirements-for-tax-return-preparers).\n\nMost small businesses need both roles. Danielson and Merritt stop at the books, while Bookkeeper360 and Xendoo also prepare returns. Our guide on [how to choose a CPA or tax adviser](/roundup/how-to-choose-a-cpa-or-tax-adviser/) covers the tax side of that decision.",
    },
    {
      heading: "What Bookkeeping Services Cost for a Small Business",
      content:
        "Monthly bookkeeping on this list starts at $250 to $400 a month, or $3,000 to $4,800 a year at the entry tier. The table converts each published entry price to a yearly cost.\n\n| Service | Entry monthly price | Yearly cost |\n|---|---|---|\n| Merritt Bookkeeping | $250 | $3,000 |\n| Xendoo Essential (annual billing) | $355 | $4,260 |\n| Bookkeeper.com Small Business | $399 | $4,788 |\n| Bookkeeper360 | From $400 | From $4,800 |\n| Danielson | Quote | Quote |\n\nHiring in-house costs more. The BLS puts median pay for bookkeeping, accounting, and auditing clerks at $50,670 a year as of May 2025, before payroll taxes and benefits. That salary alone is nearly 17 times Merritt's $3,000 yearly fee.\n\nSoftware is a separate line. [QuickBooks Online list prices](https://quickbooks.intuit.com/pricing/) are $38 a month for Simple Start, $85 for Essentials, and $140 for Plus, before promotions. None of the five services says on its website that a QuickBooks subscription is included, so ask each service who pays for it.\n\nBefore you compare quotes, run last year's figures through our [operating cash flow calculator](/operating-cash-flow/) to see what a $300 monthly fee takes out of your cash.",
    },
    {
      heading: "Catch-Up vs Cleanup Bookkeeping",
      content:
        "Catch-up bookkeeping records months where nothing was entered, and cleanup fixes records that exist but are wrong. Danielson defines cleanup as correcting duplicates, miscategorized transactions, and unreconciled accounts. Many files need both, so expect a records review before any quote.\n\nThe services price a backlog four ways:\n\n- Per month behind. Merritt charges $200 for each missing month, or $100 for a month with fewer than 20 transactions. A 12-month backlog with four light months costs 8 × $200 plus 4 × $100, which is $2,000.\n- Flat project minimum. Bookkeeper360 starts catch-up and prior-period cleanup at $1,000.\n- Monthly catch-up plan. Xendoo starts catch-up bookkeeping at $295 a month.\n- Scoped project. Danielson reviews the file first and quotes the backlog separately from monthly work.\n\nBring bank statements for every month in the gap to that records review.\n\nA backlog that includes an unfiled tax year is a tax problem as well as a bookkeeping one. The [IRS record-keeping guidance](https://www.irs.gov/businesses/small-businesses-self-employed/how-long-should-i-keep-records) says to keep records indefinitely for any year you did not file. Our [tax resolution calculator](/tax-resolution/) shows your IRS relief options if the catch-up work turns up a balance due.",
    },
    {
      heading: "Questions to Ask a Bookkeeping Service Before You Sign",
      content:
        "Ask every bookkeeping service the same eight questions, and get the answers in writing.\n\n- Who is my named bookkeeper, and who covers my books when that person is out?\n- How many accounts and transactions does the monthly fee include?\n- Will you keep my books on a cash or accrual basis?\n- On what day each month will I get my P&L and balance sheet?\n- Does the fee include the QuickBooks or Xero subscription?\n- Who owns the books file, and do I keep access if I leave?\n- How is catch-up work priced, and is it separate from the monthly fee?\n- Do you prepare tax returns, and if so, who holds the PTIN?",
    },
    {
      heading: "Red Flags When Hiring a Bookkeeper",
      content:
        "Walk away from a bookkeeper who shows any of these warning signs.\n\n- Asks for your bank password. A bookkeeper should get a named user account or read-only access.\n- Starts work without a written scope. Every service on this list puts the price in writing first, so ask for it before you send records.\n- Promises a lower tax bill. Tax savings come from a CPA or EA, so ask who on the team holds that license.\n- Prepares returns without a PTIN. The IRS requires one for anyone paid to prepare federal returns.\n- Keeps the books in a file you cannot open. Ask for your own login to the accounting software from day one.\n- Quotes a catch-up price without seeing your statements. Ask what records any quote assumes before you accept it.",
    },
    {
      heading: "Who Should Skip These Bookkeeping Services",
      content:
        "A solo freelancer with a few dozen transactions a month can skip a paid bookkeeper. Free software plus a separate business bank account covers that volume, and our [best accounting software for freelancers](/roundup/best-accounting-software-for-freelancers/) roundup lists two free options.\n\nA business that needs audited or reviewed financial statements for a lender or investor should hire a CPA firm. Danielson excludes audit and review work. A business that already has clean books and only needs a tax return should compare a CPA, an EA, and a tax attorney in our [tax attorney vs CPA vs enrolled agent](/compare/tax-attorney-vs-cpa-vs-enrolled-agent/) comparison.",
    },
    {
      heading: "What Would Change Our Ranking",
      content:
        "Two changes would move the order of this list.\n\n- If Danielson's written quotes for a typical small business came in well above $400 a month, Bookkeeper360's published plan would offer more services for a business outside church work.\n- If Merritt Bookkeeping closed its roster to new clients, Xendoo would become our pick for a published price.\n\nPull your last three months of bank and card statements, count the transactions, and ask two of these bookkeeping services for a written quote on the same numbers.",
    },
  ],
  faqs: [
    {
      question: "How much does a bookkeeping service cost for a small business?",
      answer:
        "The services on this list start at $250 to $400 a month, or $3,000 to $4,800 a year. Merritt Bookkeeping is the lowest at a flat $250. Danielson Bookkeeping & Consulting quotes after reviewing your records.",
    },
    {
      question: "What is the difference between a bookkeeper and a CPA?",
      answer:
        "A bookkeeper records and reconciles your transactions, while a CPA is state-licensed to prepare returns, give tax advice, and issue reviewed or audited statements. Bookkeepers do not need a CPA license. Many small businesses use both: a bookkeeper keeps the books monthly, and a CPA files the return from them once a year.",
    },
    {
      question: "What is catch-up bookkeeping?",
      answer:
        "Catch-up bookkeeping enters the months or years where no records were kept. Cleanup is different: it corrects records that exist but are wrong, such as duplicates or unreconciled accounts.",
    },
    {
      question: "Can my bookkeeper do my taxes?",
      answer:
        "Only if the bookkeeper also prepares returns and holds a PTIN, which the IRS requires of anyone paid to prepare federal returns. Danielson Bookkeeping & Consulting and Merritt Bookkeeping do not prepare taxes. Bookkeeper360 and Xendoo do, and Bookkeeper.com lists tax returns as an add-on.",
    },
    {
      question: "Does a church need a bookkeeper if it already has a treasurer?",
      answer:
        "Often yes, because the two jobs differ. Danielson's FAQ explains that the treasurer oversees finances while the bookkeeper records, reconciles, and reports. Splitting those roles gives leadership a second set of eyes on the money. That split is separation of duties, though it is not an audit.",
    },
    {
      question: "How long should a small business keep bookkeeping records?",
      answer:
        "The IRS default is three years from filing. Keep records six years if you left out income above 25% of the gross income on your return, and indefinitely if you did not file. Employment tax records must be kept at least four years after the tax is due or paid.",
    },
  ],
  sources: [
    { label: "Danielson Bookkeeping & Consulting: How We Work", url: "https://danielsonservices.com/how-we-work/" },
    { label: "Merritt Bookkeeping: Pricing", url: "https://merrittbookkeeping.com/pricing/" },
    { label: "Bookkeeper360: Pricing", url: "https://www.bookkeeper360.com/pricing" },
    { label: "Xendoo: Pricing", url: "https://www.xendoo.com/pricing" },
    { label: "Bookkeeper.com: Pricing", url: "https://www.bookkeeper.com/pricing" },
    {
      label: "U.S. Bureau of Labor Statistics: Bookkeeping, Accounting, and Auditing Clerks",
      url: "https://www.bls.gov/ooh/office-and-administrative-support/bookkeeping-accounting-and-auditing-clerks.htm",
    },
    {
      label: "IRS: How long should I keep records?",
      url: "https://www.irs.gov/businesses/small-businesses-self-employed/how-long-should-i-keep-records",
    },
  ],
  relatedComparisons: ["tax-attorney-vs-cpa-vs-enrolled-agent", "financial-advisor-vs-cpa", "llc-vs-s-corp"],
  calculatorLinks: [
    { label: "Operating Cash Flow Calculator", href: "/operating-cash-flow/" },
    { label: "Self-Employment Tax Calculator", href: "/self-employment-tax/" },
    { label: "S-Corp Tax Calculator", href: "/s-corp-tax/" },
    { label: "Tax Resolution Calculator", href: "/tax-resolution/" },
  ],
};
