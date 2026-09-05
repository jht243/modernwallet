import type { RoundupEntry } from "./roundups";

// Self-employed / 1099 roundups (2026-09-05). Neutral tool comparisons for the silo built alongside
// /self-employment-tax/, /mileage-deduction/, and /freelance-rate/.
//
// The framing that makes these more useful than the usual affiliate listicle: every recommendation
// is checked against the tax arithmetic from src/lib/. A mileage app is not "worth it" because it
// has good reviews — it is worth it if the extra miles it captures save more tax than it costs, and
// that break-even is computable. At the 2026 blended business rate of about 74.4 cents and a
// combined 26.13% income-plus-self-employment saving in the 12% bracket, each captured mile is
// worth roughly 19.4 cents in tax, so a $69.99 subscription pays for itself at about 360 miles.
//
// Prices are as listed on each vendor's own pricing page at the time of writing and change often;
// promotional rates are excluded in favour of regular list prices.

export const SELF_EMPLOYED_ROUNDUPS: RoundupEntry[] = [
  {
    slug: "best-mileage-tracker-apps",
    updated: "2026-09-05",
    title: "Best Mileage Tracker Apps for 2026",
    metaDescription:
      "Compare the best mileage tracker apps for 2026 on free-tier limits, automatic tracking, and price — plus the break-even math on whether paying is worth it.",
    targetKeyword: "best mileage tracker app",
    category: "mileage tracker apps",
    angle: "best",
    h1: "Best Mileage Tracker Apps for Self-Employed Drivers",
    introText:
      "A mileage tracker earns its keep by capturing the miles you would otherwise forget — the drive to a pickup, the repositioning between jobs, the supply run. Those miles are deductible, and at 2026 rates each one is worth about 19 cents in tax to a self-employed driver in the 12% bracket.\n\nThat makes the decision arithmetic rather than opinion. A $69.99 annual subscription pays for itself at roughly 360 extra miles captured. We compared six apps on their free-tier limits, automatic tracking, and what they actually cost.",
    rankingCriteria:
      "We scored each app on four things that decide whether it produces a deduction that survives scrutiny. First, does it track automatically? A tracker you have to remember to start is a tracker that misses trips. Second, what does the free tier actually allow — a 30 or 40 trip monthly cap is generous for a weekend side hustle and useless for a full-time driver. Third, does it export an IRS-compliant report with the date, mileage, destination, and purpose the IRS requires? Fourth, price against the break-even mileage that justifies it.\n\nWe did not weight app-store ratings or the headline \"average savings\" figures vendors publish, which are marketing rather than measurement. We did penalise apps whose free tier is tight enough that a real driver hits the cap in the first week of the month, since that turns a free plan into a trial.\n\nPrices below are the regular list prices published on each vendor's own pricing page at the time of writing, not promotional or first-year rates. Software pricing changes frequently, so check the current figure before subscribing.",
    options: [
      {
        name: "TripLog",
        bestFor: "Drivers who want unlimited automatic tracking without paying",
        description:
          "TripLog's free Basic plan includes unlimited automatic GPS mileage tracking, which is unusual — most competitors cap the free tier by trip count. For a full-time delivery or rideshare driver that alone makes it the default starting point, since the thing that costs money elsewhere is exactly the thing a high-mileage driver needs most.",
        strengths: [
          "Unlimited automatic mileage tracking on the free plan, where rivals cap at 30 to 40 trips a month",
          "Free tier also covers expense tracking, parking and tolls, and tax-compliant reports",
          "Premium adds OCR receipt capture, bank integration, and QuickBooks Online sync",
          "Optional hardware (a GPS device or Bluetooth beacon) for drivers who want tracking independent of the phone",
        ],
        limitations: [
          "The free plan's reporting is more limited than Premium's, which matters at filing time",
          "The interface is denser than the simplest competitors, with more settings to work through",
          "Hardware add-ons are a separate one-off cost",
        ],
        pricing: "Free plan with unlimited auto-tracking. Premium $59.99/year (about $4.99/month). Hardware add-ons $19.99–$79.99.",
      },
      {
        name: "MileIQ",
        bestFor: "Drivers who want the simplest possible experience",
        description:
          "MileIQ is the most stripped-back of the major trackers: it logs drives in the background and you classify each one as business or personal with a swipe. That simplicity is the product. It does less than the others by design, which for someone who only wants a defensible mileage log is a feature rather than a gap.",
        strengths: [
          "Automatic background tracking with a one-swipe business or personal classification",
          "Free tier covers 40 drives a month, enough for a light side hustle",
          "Auto-generated reports suitable for tax filing and reimbursement claims",
          "Long track record and a stable, uncluttered app",
        ],
        limitations: [
          "The 40-drive free cap is consumed in days by a full-time delivery driver",
          "Does not track expenses or income, so it is a mileage tool only",
          "The most expensive per-month option here on monthly billing",
        ],
        pricing: "Free for 40 drives a month. Unlimited $13.99/month, or $11.66/month billed annually.",
      },
      {
        name: "Everlance",
        bestFor: "Drivers who want mileage, expenses, and filing in one place",
        description:
          "Everlance sits between a mileage tracker and a full tax product. The Starter plan covers unlimited automatic tracking; the Professional tier adds automatic expense categorisation and 1099 tax filing, which folds a separate annual purchase into the subscription for drivers who would otherwise pay for both.",
        strengths: [
          "Unlimited automatic tracking plus expense tracking with receipt uploads",
          "Professional tier bundles 1099 tax filing, which is otherwise a separate cost",
          "Custom IRS-compliant reporting",
          "Free tier includes unlimited manual trips alongside the 30 automatic ones",
        ],
        limitations: [
          "The free plan caps automatic detection at 30 trips per month — the tightest cap here",
          "Bundled filing is only worth paying for if you would have paid to file anyway",
          "Two paid tiers means the cheaper one omits the expense automation many people are buying it for",
        ],
        pricing: "Free for 30 auto-detected trips a month. Starter $69.99/year ($8.99/month). Professional $99.99/year.",
      },
      {
        name: "Hurdlr",
        bestFor: "Gig workers who want real-time tax estimates alongside mileage",
        description:
          "Hurdlr's distinguishing feature is that it estimates your tax liability as you earn rather than only tracking the inputs. For a gig worker whose main failure mode is reaching April with nothing set aside, a running estimate of what is owed is arguably more valuable than a marginally better mileage log.",
        strengths: [
          "Real-time tax estimates as income and expenses are recorded",
          "Free tier covers mileage, expense, and income tracking",
          "Integrates with common gig platforms and payment accounts",
          "Pro tier adds invoicing and fuller accounting reports",
        ],
        limitations: [
          "Paid pricing is not published on the pricing page, so you have to start a signup to see it",
          "Tax estimates are approximations and should be checked against a proper calculation",
          "The free tier's automatic tracking is more limited than TripLog's",
        ],
        pricing: "Free tier available. Premium and Pro pricing is not published on the public pricing page.",
      },
      {
        name: "QuickBooks Solopreneur",
        bestFor: "Freelancers who want bookkeeping and mileage together",
        description:
          "QuickBooks Solopreneur is a bookkeeping product with mileage tracking built in, rather than a mileage app with extras. That makes it the wrong purchase for a driver who only needs a log, and the right one for a freelancer who was going to pay for bookkeeping regardless and would rather not run two subscriptions.",
        strengths: [
          "Mileage tracking bundled into an actual bookkeeping product",
          "Expense capture and categorisation with deduction tracking",
          "Connects to the wider Intuit ecosystem, including tax filing",
          "One subscription instead of separate bookkeeping and mileage tools",
        ],
        limitations: [
          "Listed at $20/month, the most expensive option here for someone who only needs mileage",
          "Bookkeeping features are overkill for a driver with one income source and few expenses",
          "Migrating out of the Intuit ecosystem later is more work than leaving a standalone tracker",
        ],
        pricing: "Listed at $20/month, or $120/year.",
      },
      {
        name: "Stride",
        bestFor: "Occasional gig workers who want something free",
        description:
          "Stride is a free app aimed squarely at gig workers, covering mileage and expense tracking without a paid tier. For someone earning a few thousand dollars a year on a platform, where the whole deduction might be a few hundred dollars of tax, paying a subscription is hard to justify and free is the correct answer.",
        strengths: [
          "Free, with no paid tier to upgrade to",
          "Built specifically around gig-platform work",
          "Covers expense tracking as well as mileage",
        ],
        limitations: [
          "Fewer features than the paid competitors, as you would expect",
          "No bank integration or advanced reporting",
          "Best suited to lower-mileage, part-time work",
        ],
        pricing: "Free.",
      },
    ],
    comparisonTable: {
      headers: ["App", "Free tier", "Paid price", "Automatic tracking", "Beyond mileage"],
      rows: [
        { name: "TripLog", values: ["Unlimited auto-tracking", "$59.99/yr", "Yes", "Expenses, tolls, fuel"] },
        { name: "MileIQ", values: ["40 drives/month", "$11.66–$13.99/mo", "Yes", "Mileage only"] },
        { name: "Everlance", values: ["30 auto trips/month", "$69.99–$99.99/yr", "Yes", "Expenses, 1099 filing"] },
        { name: "Hurdlr", values: ["Yes, limited", "Not published", "Yes", "Tax estimates, invoicing"] },
        { name: "QuickBooks Solopreneur", values: ["30-day trial", "$20/mo", "Yes", "Full bookkeeping"] },
        { name: "Stride", values: ["Entirely free", "None", "Yes", "Expenses"] },
      ],
    },
    verdict:
      "For a full-time delivery or rideshare driver, TripLog's free plan is the strongest starting point, because unlimited automatic tracking is the one feature that actually determines the size of your deduction and it is the feature everyone else charges for. Upgrade only when you want the reporting and receipt capture.\n\nFor a light side hustle, Stride or a free tier is enough — at a few thousand miles a year the tax saved does not justify a subscription. For a freelancer already paying for bookkeeping, QuickBooks Solopreneur avoids a second subscription. And for anyone weighing a paid plan, run the break-even: at roughly 19 cents of tax saved per captured mile, a $60 subscription needs to find about 310 extra miles a year to pay for itself, and a $70 one about 360.",
    sections: [
      {
        heading: "How much is a tracked mile actually worth?",
        content:
          "About 19 cents in tax for a self-employed driver in the 12% bracket, and about 27 cents in the 22% bracket. The arithmetic: the 2026 business standard mileage rate blends to roughly 74.4 cents per mile across the year's two rates, and a Schedule C deduction reduces both income tax and self-employment tax, for a combined saving of 26.13% in the 12% bracket.\n\nThat number is what turns \"should I pay for a mileage app\" into a calculation. A $59.99 subscription needs to capture roughly 310 miles a year that you would otherwise have missed. Anyone driving daily will clear that in a fortnight of forgotten repositioning miles. Anyone driving occasionally may not clear it at all, which is the honest case for staying on a free tier. Our [mileage deduction calculator](/mileage-deduction/) prices your own miles at both 2026 rates.",
      },
      {
        heading: "Why 2026 makes automatic tracking more valuable",
        content:
          "The IRS changed the business standard mileage rate mid-year in 2026: 72.5 cents through June 30, then 76 cents from July 1. That means a deduction can no longer be computed from an annual odometer difference — miles have to be assigned to the half of the year they were driven in.\n\nAn app that logs trips with dates handles this automatically. A notebook total, or a reconstruction at filing time, does not, and the difference is real money: 12,000 miles deducted at the correct split rates is $8,910 rather than the $8,700 a flat January-rate calculation produces. See [the 2026 IRS mileage rate](/mileage-deduction/irs-mileage-rate-2026/) for the full breakdown.",
      },
      {
        heading: "What the IRS actually requires from a mileage log",
        content:
          "A contemporaneous record showing the date, the business miles, the destination, and the business purpose of each trip, plus the vehicle's total annual mileage. \"Contemporaneous\" is the operative word — a log recorded at or near the time of the trip. A figure assembled in April from memory and bank statements is the classic disallowed deduction.\n\nThis is the real argument for an automatic tracker over a spreadsheet, and it is about evidence rather than convenience. Every app here produces an exportable report that meets the requirement; what varies is whether the free tier lets you capture all your trips in the first place.",
      },
      {
        heading: "Do you still need one if your platform reports mileage?",
        content:
          "Usually yes, because platform figures are a floor rather than a ceiling. Uber's driver tax summary reports online miles, and DoorDash shows an in-app estimate, but these generally reflect the paid or on-trip legs and omit miles you are equally entitled to claim — driving to a first pickup, repositioning between jobs while available, waiting in a delivery zone.\n\nUse the platform figure as a cross-check on your own log rather than as the log itself. If your tracker consistently reports fewer miles than the platform, something is switched off; if it reports more, that is the expected result and the reason it is worth running.",
      },
    ],
    faqs: [
      {
        question: "What is the best free mileage tracker app?",
        answer:
          "TripLog, because its free Basic plan includes unlimited automatic GPS tracking, where MileIQ caps the free tier at 40 drives a month and Everlance at 30 auto-detected trips. For a full-time driver that distinction matters more than any other feature, since a cap reached mid-month means untracked miles. Stride is a reasonable alternative for lighter gig work.",
      },
      {
        question: "Is a paid mileage tracker worth it?",
        answer:
          "It depends on how many extra miles it captures. Each tracked mile is worth roughly 19 cents in tax to a self-employed driver in the 12% bracket, so a $59.99 annual subscription breaks even at about 310 additional miles a year and a $69.99 one at about 360. A daily driver clears that easily on forgotten repositioning miles alone. An occasional gig worker may not, and should stay on a free tier.",
      },
      {
        question: "Do mileage tracker apps work automatically?",
        answer:
          "All the apps here offer automatic background tracking, which detects drives without you starting a timer. That matters because the most common cause of an undersized deduction is simply forgetting to log trips. Where they differ is whether automatic tracking is available on the free tier: TripLog and Stride include it without a cap, while MileIQ and Everlance limit free automatic tracking by trip count.",
      },
      {
        question: "Can I use a spreadsheet instead of an app?",
        answer:
          "Yes, if you fill it in contemporaneously with the date, miles, destination, and business purpose of each trip. The IRS does not require an app. The practical problem is that spreadsheets get updated in batches or at filing time, which is exactly the reconstruction that gets disallowed. For 2026 there is an extra wrinkle: the mid-year rate change means your records must be dated well enough to split miles between the 72.5-cent and 76-cent periods.",
      },
      {
        question: "Does a mileage deduction reduce self-employment tax?",
        answer:
          "Yes, and this is where most of its value comes from. A business mileage deduction reduces Schedule C net profit, which is the base for both income tax and self-employment tax. So the deduction saves your marginal income-tax rate plus the 14.13% effective self-employment rate — 26.13% combined in the 12% bracket, roughly double what an income-tax-only estimate suggests.",
      },
    ],
    sources: [
      { label: "IRS — Standard mileage rates", url: "https://www.irs.gov/tax-professionals/standard-mileage-rates" },
      { label: "IRS — Publication 463, Travel, Gift, and Car Expenses", url: "https://www.irs.gov/publications/p463" },
      { label: "TripLog — Pricing", url: "https://www.triplog.net/pricing" },
      { label: "MileIQ — Pricing", url: "https://mileiq.com/pricing" },
      { label: "Everlance — Pricing", url: "https://www.everlance.com/pricing" },
    ],
    calculatorLinks: [
      { label: "Mileage Deduction Calculator", href: "/mileage-deduction/" },
      { label: "2026 IRS Mileage Rate", href: "/mileage-deduction/irs-mileage-rate-2026/" },
      { label: "Self-Employment Tax Calculator", href: "/self-employment-tax/" },
    ],
  },

  {
    slug: "best-accounting-software-for-freelancers",
    updated: "2026-09-05",
    title: "Best Accounting Software for Freelancers (2026)",
    metaDescription:
      "Compare the best accounting software for freelancers in 2026 on price, invoicing, and tax features — including two genuinely capable free options.",
    targetKeyword: "accounting software for freelancers",
    category: "accounting software for freelancers",
    angle: "best",
    h1: "Best Accounting Software for Freelancers",
    introText:
      "Most freelancers need less accounting software than they are sold. If you invoice a handful of clients, track expenses, and hand a summary to a preparer once a year, a free tool does the job — and two of the options here are genuinely free rather than free-trial free.\n\nWe compared five tools on what a solo business actually needs: getting invoices out, capturing deductions, and producing a Schedule C at the end of the year.",
    rankingCriteria:
      "We weighted four things. First, whether the free or entry tier is usable for a real freelance business rather than a demo — a five-client cap is a real constraint. Second, invoicing quality, since getting paid is the function freelancers use daily. Third, expense and deduction capture, because for a Schedule C filer every captured deduction saves income tax and self-employment tax together. Fourth, transparent list pricing.\n\nWe deliberately did not reward feature breadth for its own sake. Inventory, multi-user permissions, and project profitability dashboards are why solo users end up paying for accounting software they use 5% of, and a tool that does less for free frequently beats one that does more for $43 a month.\n\nPrices below are the regular list prices published on each vendor's own pricing page at the time of writing, not promotional or first-year rates. Software pricing changes frequently, so check the current figure before subscribing.",
    options: [
      {
        name: "Wave",
        bestFor: "Freelancers who want real accounting for free",
        description:
          "Wave's free Starter plan covers unlimited invoices, estimates, bills, and bookkeeping records — the full loop of a solo business, without a client cap or an invoice cap. It is the strongest free offering here, and for a large share of freelancers it is simply sufficient. Wave makes its money on payment processing rather than by crippling the free tier.",
        strengths: [
          "Unlimited invoices, estimates, bills, and bookkeeping records at no cost",
          "No client or invoice caps on the free plan",
          "Accepts card payments at 2.9% + $0.60 per transaction",
          "Pro tier adds automatic bank imports and receipt digitisation if you want them",
        ],
        limitations: [
          "Automatic bank transaction imports require the paid Pro plan",
          "Receipt digitisation is a paid add-on or part of Pro",
          "Fewer integrations than the larger ecosystems",
        ],
        pricing: "Free Starter plan. Pro $19/month or $190/year. Payments 2.9% + $0.60 per card transaction.",
      },
      {
        name: "Zoho Invoice",
        bestFor: "Freelancers who only need invoicing and expenses",
        description:
          "Zoho Invoice is free for up to 500 invoices a year with two users, and it is a full invoicing product rather than a stripped one: recurring invoices, payment reminders, quotes, expense tracking, time logging, and a client portal. Five hundred invoices a year is well beyond what most solo freelancers issue.",
        strengths: [
          "Free for up to 500 invoices per year — a cap most freelancers will never reach",
          "Recurring invoices, automatic payment reminders, and a client portal included",
          "Time logging and expense tracking built in",
          "Upgrades cleanly into the wider Zoho ecosystem if the business grows",
        ],
        limitations: [
          "Free plan carries Zoho branding on invoices",
          "Capped at two users and three projects",
          "It is an invoicing tool, not full double-entry accounting",
        ],
        pricing: "Free for up to 500 invoices/year, 2 users, 3 projects.",
      },
      {
        name: "QuickBooks Solopreneur",
        bestFor: "Freelancers who want bookkeeping, mileage, and tax in one place",
        description:
          "QuickBooks Solopreneur is Intuit's product for the one-person business: expense capture, mileage tracking, and deduction tracking aimed at producing a Schedule C. Its real advantage is the path into tax filing and the accountant ecosystem — most US preparers can work with QuickBooks data without conversion.",
        strengths: [
          "Mileage tracking bundled with bookkeeping, replacing a second subscription",
          "Expense categorisation oriented toward Schedule C deductions",
          "Most accountants and preparers already work with QuickBooks",
          "Clear path into Intuit's tax filing products",
        ],
        limitations: [
          "$20/month is real money against two capable free options",
          "Solopreneur is deliberately limited compared with QuickBooks Online proper",
          "Upgrading later means moving to a materially more expensive tier",
        ],
        pricing: "Listed at $20/month or $120/year. QuickBooks Online Simple Start starts at $38/month.",
      },
      {
        name: "FreshBooks",
        bestFor: "Client-facing freelancers who bill by time",
        description:
          "FreshBooks is built around the client relationship rather than the ledger: time tracking, project-level billing, proposals, and invoices that chase themselves. For a freelancer who bills hourly across several clients, that focus is worth paying for in a way general accounting software is not.",
        strengths: [
          "Strong time tracking tied directly to billable invoices",
          "Proposals, estimates, and retainers alongside invoicing",
          "Automatic late payment reminders and recurring billing",
          "Polished client-facing experience",
        ],
        limitations: [
          "The entry Lite plan caps you at 5 billable clients",
          "Reaching unlimited clients means the $70/month Premium tier",
          "More expensive than the alternatives for functionality many solo users will not use",
        ],
        pricing: "Lite $23/month (5 clients), Plus $43/month (50 clients), Premium $70/month (unlimited).",
      },
      {
        name: "Bonsai",
        bestFor: "Freelancers who want contracts and proposals in the same tool",
        description:
          "Bonsai bundles the paperwork around the work — contracts, proposals, and a client CRM — with invoicing and time tracking. For freelancers who currently assemble contracts from templates and chase signatures by email, having them in the same system as the invoice is the argument.",
        strengths: [
          "Contracts, proposals, and e-signature alongside invoicing",
          "Client CRM and project management included",
          "Time tracking and task management on the entry plan",
          "Scales into team features if you subcontract",
        ],
        limitations: [
          "Invoicing, proposals, and contracts require the Essentials tier, not Basic",
          "Priced per user, which adds up if you bring in collaborators",
          "More product than a freelancer with two long-term clients needs",
        ],
        pricing: "Basic $15/user/month, Essentials $25, Premium $39, Elite $59 (billed monthly). Annual billing is cheaper.",
      },
    ],
    comparisonTable: {
      headers: ["Tool", "Entry price", "Client limit", "Invoicing", "Best for"],
      rows: [
        { name: "Wave", values: ["Free", "Unlimited", "Unlimited", "Free full bookkeeping"] },
        { name: "Zoho Invoice", values: ["Free", "Unlimited", "500/year", "Invoicing only"] },
        { name: "QuickBooks Solopreneur", values: ["$20/mo", "Unlimited", "Yes", "Bookkeeping + mileage"] },
        { name: "FreshBooks", values: ["$23/mo", "5 on Lite", "Yes", "Hourly client work"] },
        { name: "Bonsai", values: ["$15/user/mo", "Unlimited", "Essentials tier+", "Contracts + proposals"] },
      ],
    },
    verdict:
      "Start with Wave. Its free plan covers unlimited invoicing and bookkeeping with no client cap, which is more than most solo freelancers need, and paying for software before you have hit a limit is the most common unnecessary expense in a new freelance business. If you only need to send invoices, Zoho Invoice's free tier is equally capable within its 500-invoice ceiling.\n\nPay when a specific constraint costs you something. FreshBooks is worth its price if you bill hourly across many clients and its time tracking directly produces your invoices. QuickBooks Solopreneur is worth it if bundling mileage tracking replaces a separate subscription, or if your preparer works in QuickBooks. Bonsai is worth it if contracts and proposals currently live in a folder of Word documents. None of them is worth it simply because a business \"should\" have accounting software.",
    sections: [
      {
        heading: "What a freelancer actually needs from accounting software",
        content:
          "Three things: send invoices and know which are unpaid, capture expenses so deductions are not lost, and produce a total at year end that fills in a Schedule C. Everything beyond that is either convenience or scale.\n\nThis is why free tools compete so well here. The features that justify a $43-a-month subscription — multi-user permissions, project profitability, inventory, class tracking — are features of a small company, not a one-person business. A freelancer with six clients and forty expenses a year is not constrained by software capability. They are constrained by whether they enter the data at all, which is an argument for the tool with the least friction rather than the most features.",
      },
      {
        heading: "Why deduction capture matters more than it looks",
        content:
          "For a Schedule C filer, an expense you fail to record costs you more than the same expense would cost an employee. A business deduction reduces net profit, and net profit is the base for both income tax and self-employment tax, so a deducted dollar saves your marginal rate plus the 14.13% effective self-employment rate — about 26 cents in the 12% bracket.\n\nThat changes the value of the software's dullest feature. A tool that reliably captures $2,000 of small expenses you would otherwise forget is worth roughly $520 in tax at that rate, which pays for any option on this list several times over. It is also the argument for connecting a bank feed rather than relying on memory. Our [self-employment tax calculator](/self-employment-tax/) shows how profit translates into the bill.",
      },
      {
        heading: "Separate business banking beats better software",
        content:
          "The single highest-return bookkeeping decision for a freelancer is not which software to buy — it is opening a separate account for business income and expenses. Mixed personal and business transactions are what make bookkeeping unpleasant enough to postpone, and postponed bookkeeping is how deductions get lost.\n\nWith a dedicated account, categorisation becomes a short weekly task in any of these tools, free ones included. Without one, no amount of software fixes the underlying problem, because every statement line still has to be adjudicated by hand. Do this before you evaluate a single feature list.",
      },
      {
        heading: "When to stop doing it yourself",
        content:
          "Software handles the recording. It does not handle judgement, and there are a few points where judgement is worth paying a person for: your first year filing as self-employed, the year you consider an S-corporation election, any year with multi-state income, and any year you receive a notice from the IRS.\n\nA reasonable division is to keep the bookkeeping in a free or cheap tool all year and buy a preparer's time once. That is usually cheaper than the software tier that promises to make the return automatic, and it produces a better return. See our comparison of [tax attorney vs CPA vs enrolled agent](/compare/tax-attorney-vs-cpa-vs-enrolled-agent/) for which one fits a straightforward self-employment return.",
      },
    ],
    faqs: [
      {
        question: "What is the best free accounting software for freelancers?",
        answer:
          "Wave, whose free Starter plan includes unlimited invoices, estimates, bills, and bookkeeping records with no client cap. Zoho Invoice is the better free choice if you only need invoicing, covering up to 500 invoices a year for two users. Both are genuinely free products rather than time-limited trials, and between them they cover what most solo freelancers need.",
      },
      {
        question: "Do freelancers need accounting software at all?",
        answer:
          "You need a reliable record of income and expenses; software is one way to get it. A freelancer with a handful of clients can manage with a spreadsheet and a separate business bank account. The case for software is friction: invoices that chase themselves, and expenses categorised as they arrive rather than reconstructed in April. Start free and pay only when a specific limit costs you something.",
      },
      {
        question: "Is QuickBooks worth it for a freelancer?",
        answer:
          "It is worth its $20 monthly Solopreneur price in two situations: when the bundled mileage tracking replaces a separate subscription you were paying for anyway, or when your accountant works in QuickBooks and receiving your data in it saves billable hours. Otherwise, the free alternatives cover a solo business adequately, and the full QuickBooks Online tiers start at $38 a month for features a one-person business rarely uses.",
      },
      {
        question: "What accounting software works best with a tax preparer?",
        answer:
          "QuickBooks has the widest support among US preparers, so handing over a QuickBooks file usually means less reformatting than an export from a smaller tool. That said, any of these can produce the summary a preparer actually needs — total income, categorised expenses, and mileage. Ask your preparer what they want before choosing software on this basis alone; many are happy with a clean spreadsheet.",
      },
      {
        question: "Does accounting software file my taxes?",
        answer:
          "Generally no. These tools produce the figures that go on a Schedule C; filing is a separate product, and where a tool advertises filing it is usually a bundled add-on or a partner service. Keep the two decisions apart: choose bookkeeping software on how reliably you will use it through the year, and choose filing separately once you know how complicated your return is.",
      },
    ],
    sources: [
      { label: "IRS — About Schedule C (Form 1040)", url: "https://www.irs.gov/forms-pubs/about-schedule-c-form-1040" },
      { label: "Wave — Pricing", url: "https://www.waveapps.com/pricing" },
      { label: "Zoho Invoice — Pricing", url: "https://www.zoho.com/us/invoice/pricing/" },
      { label: "FreshBooks — Pricing", url: "https://www.freshbooks.com/pricing" },
      { label: "Bonsai — Pricing", url: "https://www.hellobonsai.com/pricing" },
    ],
    calculatorLinks: [
      { label: "Self-Employment Tax Calculator", href: "/self-employment-tax/" },
      { label: "Freelance Rate Calculator", href: "/freelance-rate/" },
      { label: "Mileage Deduction Calculator", href: "/mileage-deduction/" },
    ],
  },

  {
    slug: "best-invoicing-apps-for-freelancers",
    updated: "2026-09-05",
    title: "Best Invoicing Apps for Freelancers in 2026",
    metaDescription:
      "The best invoicing apps for freelancers in 2026, compared on price, payment fees, and automatic reminders — with two capable free options.",
    targetKeyword: "best invoicing app for freelancers",
    category: "invoicing apps for freelancers",
    angle: "best",
    h1: "Best Invoicing Apps for Freelancers",
    introText:
      "The best invoicing app is the one that gets you paid soonest, which usually means the one that chases late invoices without you having to. Two of the options here do that for free.\n\nWe compared five tools on price, payment processing fees, automatic reminders, and how quickly a client can actually pay — because the fee you pay to accept a card is often larger than the software subscription.",
    rankingCriteria:
      "We scored on four criteria. First, cost of the plan that a solo freelancer can actually use, not a headline entry tier with a five-client cap. Second, payment processing fees, which for most freelancers exceed the subscription: 2.9% on $60,000 of invoices is $1,740 a year, dwarfing any price difference on this list. Third, whether the tool sends automatic late payment reminders, since chasing invoices is the least pleasant part of freelancing and the most valuable thing to automate. Fourth, how fast a client can pay from the invoice itself.\n\nWe did not weight invoice template design. It has no measurable effect on payment speed, and it is the feature vendors market hardest.\n\nPrices below are the regular list prices published on each vendor's own pricing page at the time of writing, not promotional or first-year rates. Software pricing changes frequently, so check the current figure before subscribing.",
    options: [
      {
        name: "Zoho Invoice",
        bestFor: "Freelancers who want full invoicing at no cost",
        description:
          "Zoho Invoice gives away what most competitors charge for: recurring invoices, automatic payment reminders, quotes, a client portal, time logging, and expense tracking, free for up to 500 invoices a year. For a solo freelancer that ceiling is effectively unlimited, and the automatic reminders are the feature most likely to shorten how long you wait to get paid.",
        strengths: [
          "Free for up to 500 invoices a year — beyond what most freelancers issue",
          "Automatic payment reminders included at no cost",
          "Recurring invoices, quotes, and a client portal",
          "Time logging so billable hours flow into invoices",
        ],
        limitations: [
          "Zoho branding appears on free-plan invoices",
          "Limited to two users and three projects",
          "Payment processing depends on the gateway you connect",
        ],
        pricing: "Free for up to 500 invoices/year, 2 users, 3 projects.",
      },
      {
        name: "Wave",
        bestFor: "Freelancers who want invoicing plus bookkeeping free",
        description:
          "Wave's free plan covers unlimited invoices with no client cap, and pairs them with actual bookkeeping, so income recorded on an invoice flows into the records you will need at tax time. Card payments run at 2.9% + $0.60, in line with standard processing rates.",
        strengths: [
          "Unlimited invoices and estimates on the free plan, no client cap",
          "Bookkeeping included, so invoices feed year-end records",
          "Card payments at 2.9% + $0.60 per transaction",
          "Pro plan adds branded invoices and automated late payment reminders",
        ],
        limitations: [
          "Automated late payment reminders require the paid Pro plan",
          "Invoice branding is a Pro feature",
          "Bank transaction imports are paid-only",
        ],
        pricing: "Free plan. Pro $19/month or $190/year. Payments 2.9% + $0.60; Pro discounts the fixed fee on the first 10 transactions monthly.",
      },
      {
        name: "FreshBooks",
        bestFor: "Freelancers billing hourly across several clients",
        description:
          "FreshBooks turns tracked time into invoices with the least friction of anything here, and its reminder and recurring-billing automation is mature. If you bill hourly, the time-to-invoice pipeline is the product and it is worth the subscription; if you bill by project, much of what you are paying for goes unused.",
        strengths: [
          "Time tracking that converts directly into billable invoices",
          "Mature automatic late payment reminders and recurring billing",
          "Retainers, proposals, and estimates included",
          "Well-regarded client-facing payment experience",
        ],
        limitations: [
          "Lite plan caps you at 5 billable clients",
          "Unlimited clients requires the $70/month Premium tier",
          "Overkill for a freelancer sending a few invoices a month",
        ],
        pricing: "Lite $23/month (5 clients), Plus $43/month (50 clients), Premium $70/month (unlimited clients).",
      },
      {
        name: "Bonsai",
        bestFor: "Freelancers who send a contract with every invoice",
        description:
          "Bonsai's case is that an invoice is the last step of a chain that starts with a proposal and a signed contract, and it keeps all three in one place. For freelancers who currently assemble contracts by hand, that consolidation is worth more than any invoicing feature — but note that invoicing sits on the Essentials tier, not the cheapest one.",
        strengths: [
          "Proposals, contracts, and e-signature in the same tool as invoices",
          "Client CRM keeps invoice history against the relationship",
          "Time tracking and project management included",
          "Scales to collaborators if you subcontract",
        ],
        limitations: [
          "Invoicing requires Essentials at $25/user/month, not the $15 Basic tier",
          "Per-user pricing raises the cost as soon as you add anyone",
          "More product than a simple invoicing need justifies",
        ],
        pricing: "Basic $15/user/month; invoicing from Essentials at $25/user/month. Annual billing is cheaper.",
      },
      {
        name: "QuickBooks Solopreneur",
        bestFor: "Freelancers who want invoices inside their bookkeeping",
        description:
          "Invoicing here is one function of a bookkeeping product rather than the point of it. That is the right trade if you were going to pay for bookkeeping and mileage tracking anyway, and the wrong one if you simply need to send invoices — a job two free tools on this list do well.",
        strengths: [
          "Invoices recorded directly into your books",
          "Mileage tracking and expense capture bundled",
          "Familiar to most US accountants and preparers",
          "Clear path into tax filing",
        ],
        limitations: [
          "$20/month for invoicing alone is poor value against free options",
          "Invoicing features are simpler than the dedicated tools here",
          "Solopreneur is limited compared with full QuickBooks Online",
        ],
        pricing: "Listed at $20/month or $120/year.",
      },
    ],
    comparisonTable: {
      headers: ["App", "Price", "Auto reminders", "Card fees", "Best for"],
      rows: [
        { name: "Zoho Invoice", values: ["Free (500/yr)", "Yes, free", "Gateway-dependent", "Free full invoicing"] },
        { name: "Wave", values: ["Free; Pro $19/mo", "Pro only", "2.9% + $0.60", "Invoicing + bookkeeping"] },
        { name: "FreshBooks", values: ["$23–$70/mo", "Yes", "Gateway-dependent", "Hourly billing"] },
        { name: "Bonsai", values: ["$25/user/mo", "Yes", "Gateway-dependent", "Contracts + invoices"] },
        { name: "QuickBooks Solopreneur", values: ["$20/mo", "Yes", "Gateway-dependent", "Books-first invoicing"] },
      ],
    },
    verdict:
      "Zoho Invoice is the best free choice, and for most solo freelancers the best choice outright: automatic payment reminders — the feature that most directly shortens how long you wait to be paid — are included at no cost, where Wave puts them behind the $19 Pro tier. Wave is the better free pick if you want invoicing and bookkeeping in one place and can chase late payers yourself.\n\nPay only for a specific job. FreshBooks earns its price when tracked time becomes invoices automatically. Bonsai earns its price when proposals and contracts live in the same place as the invoice. And keep the fees in perspective: at 2.9%, processing $60,000 of invoices costs about $1,740 a year, which is several times any subscription on this list. Getting paid by bank transfer where a client will accept it saves more than any software decision here.",
    sections: [
      {
        heading: "Processing fees usually cost more than the software",
        content:
          "A freelancer invoicing $60,000 a year and accepting all of it by card pays roughly $1,740 in processing at 2.9%, plus the per-transaction fixed fee. The most expensive subscription on this list is $840 a year, and the cheapest is nothing. The fee, not the software, is the larger line.\n\nThat suggests two practical moves. Offer bank transfer or ACH as the default for larger invoices, where the fee is typically a flat amount rather than a percentage, and reserve card payment for smaller or international clients where convenience genuinely wins the sale. And do not choose an invoicing tool on a $10 monthly price difference while ignoring how it processes payments.",
      },
      {
        heading: "Automatic reminders are the feature that actually pays",
        content:
          "Late payment is the most common cash-flow problem in freelancing, and chasing it is the task most likely to be postponed — because it is uncomfortable, not because it is difficult. Automating the reminder removes the discomfort entirely: the client hears from the system, not from you, and the first nudge arrives on time rather than three weeks late.\n\nThis is the main reason Zoho Invoice's free tier ranks so highly here. Including reminders at no cost, where Wave gates them behind a paid plan, matters more for getting paid than any difference in templates or dashboards.",
      },
      {
        heading: "What to put on an invoice so it gets paid",
        content:
          "An invoice number, the date issued, a clear due date rather than \"net 30\" alone, an itemised description of what was delivered, the total, and the payment methods you accept with the details needed to use them. Ambiguity is what delays payment: an invoice that says \"net 30\" without a date makes the client do arithmetic, and clients who have to do arithmetic pay later.\n\nAgree payment terms in the contract rather than discovering them on the first invoice, and for larger projects take a deposit up front. The best invoicing software cannot fix terms that were never set.",
      },
      {
        heading: "Invoices are also your tax records",
        content:
          "The invoices you issue are the primary record of the income you report on Schedule C, and they need to reconcile with what platforms and clients report to the IRS. That matters more in 2026 than it used to: the Form 1099-NEC threshold rose to $2,000, so plenty of genuine client income will now arrive with no form at all — and it is fully reportable regardless.\n\nKeeping invoices in a tool that also records income means the year-end total is a report rather than a reconstruction. It also lets you see what remains unpaid at the year end, which is a different figure from what you were paid, and the one your bookkeeping should distinguish. Our [1099 tax calculator](/self-employment-tax/1099-tax-calculator/) turns that profit figure into what you owe.",
      },
    ],
    faqs: [
      {
        question: "What is the best free invoicing app for freelancers?",
        answer:
          "Zoho Invoice, which is free for up to 500 invoices a year and includes automatic payment reminders, recurring invoices, quotes, and a client portal. Wave is the other genuinely free option and adds bookkeeping, but it puts automated late payment reminders behind its $19 monthly Pro plan. For getting paid on time without paying for software, Zoho Invoice is the stronger free tier.",
      },
      {
        question: "How much does it cost to accept card payments on an invoice?",
        answer:
          "Around 2.9% plus a fixed per-transaction fee is standard, and Wave publishes 2.9% + $0.60. On $60,000 of annual invoicing that is roughly $1,740 — considerably more than any subscription on this list. Offering bank transfer or ACH for larger invoices, where fees are usually a small flat amount, saves more than any choice of software.",
      },
      {
        question: "Should freelancers charge late fees?",
        answer:
          "A late fee is only enforceable if it was agreed in the contract before the work started, so the decision belongs at the contract stage rather than the invoice stage. In practice the automatic reminder does more work than the fee: most late payments are administrative rather than deliberate, and a polite nudge on the due date resolves them faster than a penalty clause.",
      },
      {
        question: "Do I need invoicing software or is a template enough?",
        answer:
          "A template is fine if you send a few invoices a month and are willing to track what is unpaid yourself. Software earns its place through the follow-up — knowing at a glance which invoices are outstanding, and sending reminders automatically. Since two capable options here are free, the practical answer is to use one rather than maintain a spreadsheet of who owes you what.",
      },
      {
        question: "What should be on a freelance invoice?",
        answer:
          "An invoice number, the issue date, an explicit due date, an itemised description of the work, the total amount, and the payment methods you accept with the details required to use them. Include your business name and address, and the client's. If you agreed a deposit or milestone schedule in the contract, reference it, so the invoice matches what the client is expecting to pay.",
      },
    ],
    sources: [
      { label: "IRS — Instructions for Forms 1099-MISC and 1099-NEC (2026)", url: "https://www.irs.gov/instructions/i1099mec" },
      { label: "Wave — Pricing", url: "https://www.waveapps.com/pricing" },
      { label: "Zoho Invoice — Pricing", url: "https://www.zoho.com/us/invoice/pricing/" },
      { label: "FreshBooks — Pricing", url: "https://www.freshbooks.com/pricing" },
    ],
    calculatorLinks: [
      { label: "Freelance Rate Calculator", href: "/freelance-rate/" },
      { label: "1099 Tax Calculator", href: "/self-employment-tax/1099-tax-calculator/" },
      { label: "Billable Hours Calculator", href: "/freelance-rate/billable-hours-calculator/" },
    ],
  },
];
