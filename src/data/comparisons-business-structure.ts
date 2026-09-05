import type { ComparisonEntry } from "./comparisons";

// Business-structure comparisons (2026-09-05). These sit in /compare/ by site convention, and link
// up to the /s-corp-tax/ pillar for the arithmetic. Two decisions every one-person business faces
// and the site had no page for: whether to form an LLC at all, and whether to elect S-corp status.

const IRS_SCORP = {
  label: "IRS — S corporations",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/s-corporations",
};
const IRS_SCORP_COMP = {
  label: "IRS — S corporation compensation and medical insurance issues",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/s-corporation-compensation-and-medical-insurance-issues",
};
const IRS_2553 = {
  label: "IRS — Instructions for Form 2553",
  url: "https://www.irs.gov/instructions/i2553",
};
const IRS_LLC = {
  label: "IRS — Limited liability company (LLC)",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc",
};
const IRS_SOLE_PROP = {
  label: "IRS — Sole proprietorships",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/sole-proprietorships",
};
const IRS_SE_TAX = {
  label: "IRS — Topic no. 751, Social Security and Medicare withholding rates",
  url: "https://www.irs.gov/taxtopics/tc751",
};

export const BUSINESS_STRUCTURE_COMPARISONS: ComparisonEntry[] = [
  {
    slug: "llc-vs-s-corp",
    updated: "2026-09-05",
    title: "LLC vs S Corp: Which Should a Small Business Pick?",
    metaDescription:
      "LLC vs S corp compared: they are not competing entity types. See what an S election changes, what it costs, and the profit level where it starts to pay.",
    targetKeyword: "llc vs s corp",
    optionA: "LLC (default taxation)",
    optionB: "S corporation election",
    h1: "LLC vs S Corp: What Actually Changes",
    introText:
      "LLC and S corp are not competing entity types, and the comparison confuses people because it is usually framed as though they were. An LLC is a legal structure; an S corporation is a tax election that an LLC can make while remaining an LLC. The real question is not which to choose but whether to elect.\n\nWhat the election changes is how profit is taxed. What it does not change is your liability protection, your operating agreement, or your state registration.",
    comparisonTable: {
      rows: [
        { dimension: "What it is", a: "A legal entity formed with the state", b: "A tax election made with the IRS on Form 2553" },
        { dimension: "Liability protection", a: "Yes, from the LLC itself", b: "Unchanged — it comes from the LLC, not the election" },
        { dimension: "How profit is taxed", a: "All net profit subject to 15.3% self-employment tax (on 92.35%)", b: "Payroll tax on the salary only; distributions escape it" },
        { dimension: "Owner pay", a: "Owner's draw — no payroll needed", b: "W-2 salary that must be 'reasonable', plus distributions" },
        { dimension: "QBI deduction", a: "Full profit is qualified business income", b: "Reduced — wages are not QBI, so salary shrinks the §199A base" },
        { dimension: "Tax return", a: "Schedule C with your personal return", b: "Separate Form 1120-S plus a K-1 to yourself" },
        { dimension: "Ongoing cost", a: "None beyond your usual return", b: "Payroll service + extra return, typically several hundred to $2,000/yr" },
        { dimension: "Social Security credits", a: "Based on all net earnings", b: "Based on salary only — a lower salary lowers your benefit base" },
        { dimension: "Audit exposure", a: "Standard", b: "Reasonable compensation is an examined issue with case law behind it" },
        { dimension: "Where it pays", a: "Lower profit, or where a defensible salary is close to all profit", b: "Higher profit with room between a defensible salary and total profit" },
      ],
    },
    verdict:
      "Stay with default LLC taxation until the numbers clearly justify the election, and judge them on the net saving rather than the payroll tax avoided. Holding salary at half of profit, an S election clears $1,000 a year of net benefit at around $35,000 of profit; at a more conservative 60% salary the threshold rises to roughly $52,000. At $120,000 of profit with a $60,000 salary it saves about $4,171 a year.\n\nElect when there is genuine room between a defensible salary and your total profit — which usually means the business earns meaningfully more than the market rate for the work you personally do. If your revenue is entirely your own billable hours, that room may never open, and the election can cost money: at $90,000 of profit with a $70,000 salary it runs $1,530 a year in the wrong direction.",
    sections: [
      {
        heading: "They are not alternatives — one sits inside the other",
        content:
          "An LLC is formed with your state and gives you a legal entity separate from yourself, which is where liability protection comes from. S-corp status is an election made with the IRS that changes how that entity's profit is taxed. An LLC can elect it and stay an LLC in every legal respect.\n\nThis matters practically because the choice is not exclusive and not permanent in the way people assume. You do not give up an LLC to become an S-corp, and you do not need to form a corporation. Most one-person businesses that elect S-corp status are LLCs that filed Form 2553 — the operating agreement, the state filing, and the liability shield are untouched.",
      },
      {
        heading: "What the election actually saves, and what it costs",
        content:
          "Under default taxation, all of an LLC's profit is subject to self-employment tax. Under an S election, only the salary is subject to payroll tax; the distribution is not. That is the saving, and it is real.\n\nTwo costs come off it. The qualified business income deduction applies to pass-through profit, and wages are not qualified business income — so every dollar routed into salary removes a dollar from the §199A base. At $120,000 of profit with a $60,000 salary, the election avoids $7,775 of payroll tax but forfeits $8,242 of QBI deduction. And payroll is not free: a payroll service plus the separate Form 1120-S recurs every year, in lean years as well as good ones.\n\nThe net figure at that profit is $4,171 — worth having, but 46% below the gross payroll tax saved. Run your own numbers in the [LLC vs S corp tax calculator](/s-corp-tax/llc-vs-s-corp-tax-calculator/).",
      },
      {
        heading: "The salary is the constraint, not the profit",
        content:
          "The election's benefit is the gap between your total profit and the salary you can defend, so the salary decides everything. The IRS requires reasonable compensation for services before non-wage distributions are made, and it publishes no safe harbor and no percentage. The 60/40 and 2% rules circulating online are not IRS positions.\n\nWhat the IRS examines is where the corporation's gross receipts come from. Receipts generated by the shareholder's own services should be paid as wages. That is why a consultant billing their own time has little room, while an owner whose revenue is produced by employees and equipment has considerably more. Judge the election against a salary you would be comfortable defending, not the lowest one a calculator will accept — see the [reasonable salary calculator](/s-corp-tax/s-corp-reasonable-salary-calculator/).",
      },
      {
        heading: "The costs that are not on the tax return",
        content:
          "Three consequences get left out of most comparisons. Social Security benefits are computed from your earnings record, and only wages count — a lower salary lowers the earnings on record and eventually the benefit. Personal borrowing can get easier, since lenders underwrite a W-2 more readily than a Schedule C. And several states tax S corporations directly or charge franchise fees, which can erase a modest federal saving outright.\n\nThere is also an administrative floor. Payroll means real deadlines: withholding, remitting, and filing employment tax returns on time, every quarter, whether or not the business is having a good month. For some owners the recurring obligation is a larger cost than the dollar figure suggests.",
      },
      {
        heading: "How to make the election if the numbers work",
        content:
          "The election is made on Form 2553, and the timing is strict: no more than two months and 15 days after the beginning of the tax year it is to take effect, or at any point in the preceding tax year. Miss it and the election applies to the following year instead.\n\nLate-election relief exists under Rev. Proc. 2013-30 where the failure was due to reasonable cause, the corporation intended S status from the effective date, and Form 2553 is filed within three years and 75 days of it, with \"FILED PURSUANT TO REV. PROC. 2013-30\" written at the top. It is available, but it is not a plan.",
      },
    ],
    faqs: [
      {
        question: "Is an LLC or S corp better?",
        answer:
          "The question is slightly wrong, because an S corp is a tax election an LLC can make rather than a competing entity. Default LLC taxation is better at lower profit: it costs nothing extra and preserves the full QBI deduction. An S election is better once there is real room between a defensible salary and total profit — roughly from $35,000 of profit at a 50% salary, or $52,000 at a 60% salary.",
      },
      {
        question: "Who pays more taxes, an LLC or an S corp?",
        answer:
          "At the same profit, an S corp usually pays less overall, but by less than the headline suggests. At $120,000 of profit with a $60,000 salary, default LLC taxation costs $28,462 in federal tax while the S-corp route costs $24,291 including payroll costs — a $4,171 difference. Set the salary conservatively enough and the S corp pays more: at $90,000 of profit with a $70,000 salary it costs $1,530 extra.",
      },
      {
        question: "At what income should I switch from LLC to S corp?",
        answer:
          "There is no universal number, because it depends on the salary you can defend rather than on revenue. Holding salary at half of profit, the net saving clears $1,000 a year at around $35,000 of profit; at 60% it takes about $52,000. Add state franchise or S-corp taxes and the practical threshold rises further. If your revenue is entirely your own billable time, the election may never pay.",
      },
      {
        question: "Does an S corp give more liability protection than an LLC?",
        answer:
          "No. Liability protection comes from the legal entity — the LLC or corporation — not from the tax election. An LLC that elects S-corp treatment has exactly the protection it had before. Anyone selling an S election on the basis of stronger liability protection is describing something the election does not do.",
      },
      {
        question: "Can I undo an S corp election?",
        answer:
          "You can revoke it, but not casually. A revocation generally takes effect at the start of a tax year if filed early enough, and after terminating an election a corporation usually must wait five years before electing again without IRS consent. Because the decision is sticky, it is worth being confident the saving is durable rather than a one-off good year.",
      },
      {
        question: "Do I need an LLC to elect S corp status?",
        answer:
          "You need an eligible entity, which in practice means an LLC or a corporation — you cannot elect S-corp status as a sole proprietor. For a one-person business the usual path is to form an LLC and then file Form 2553, which keeps the simpler LLC formalities while changing the tax treatment.",
      },
    ],
    sources: [IRS_SCORP, IRS_SCORP_COMP, IRS_2553, IRS_LLC, IRS_SE_TAX],
    relatedComparisons: ["sole-proprietorship-vs-llc", "1099-vs-w2"],
    calculatorLinks: [
      { label: "S Corp Tax Calculator", href: "/s-corp-tax/" },
      { label: "LLC vs S Corp Tax Calculator", href: "/s-corp-tax/llc-vs-s-corp-tax-calculator/" },
      { label: "Reasonable Salary Calculator", href: "/s-corp-tax/s-corp-reasonable-salary-calculator/" },
    ],
  },

  {
    slug: "sole-proprietorship-vs-llc",
    updated: "2026-09-05",
    title: "Sole Proprietorship vs LLC: Which Do You Need?",
    metaDescription:
      "Sole proprietorship vs LLC compared. The tax treatment is identical by default — the real difference is liability, and that is what should decide it.",
    targetKeyword: "sole proprietorship vs llc",
    optionA: "Sole proprietorship",
    optionB: "LLC",
    h1: "Sole Proprietorship vs LLC: What the Choice Really Buys",
    introText:
      "By default, a sole proprietorship and a single-member LLC are taxed identically. Both report business profit on Schedule C, both pay self-employment tax on all of it, and both qualify for the same QBI deduction. Most pages bury this, because \"tax advantages\" is a more compelling reason to form an LLC than the truth.\n\nThe real difference is liability. An LLC separates your business obligations from your personal assets; a sole proprietorship does not. That, not tax, is what the decision should turn on.",
    comparisonTable: {
      rows: [
        { dimension: "How it is created", a: "Automatically, by doing business", b: "Filed with your state, with a fee" },
        { dimension: "Default federal tax treatment", a: "Schedule C on your personal return", b: "Identical — a single-member LLC is a disregarded entity" },
        { dimension: "Self-employment tax", a: "15.3% on 92.35% of net profit", b: "The same, unless you later elect S-corp treatment" },
        { dimension: "QBI deduction", a: "Available", b: "Available — no difference" },
        { dimension: "Personal liability", a: "Unlimited — business debts reach personal assets", b: "Limited to the business, if formalities are respected" },
        { dimension: "Setup cost", a: "$0", b: "State filing fee, commonly $50–$500" },
        { dimension: "Ongoing cost", a: "None", b: "Annual report or franchise fee in many states" },
        { dimension: "Business bank account", a: "Possible, not required", b: "Effectively required to preserve the liability shield" },
        { dimension: "Route to an S-corp election", a: "Not available directly", b: "Available — file Form 2553" },
        { dimension: "How clients perceive it", a: "Trading under your own name", b: "A registered entity, which some clients require" },
      ],
    },
    verdict:
      "Form an LLC for the liability protection, not for a tax benefit that does not exist by default. If your work could plausibly result in a claim — you enter client premises, handle their data, produce work that could cause financial loss, hold inventory, or sign leases and contracts — the separation is worth a few hundred dollars a year.\n\nStay a sole proprietor if the risk is genuinely minimal and the income is small: freelance writing for a handful of clients with no employees, no premises, and no inventory is a reasonable case for not bothering yet. Two thresholds should change your mind regardless of risk appetite: profit reaching the level where an S-corp election becomes worthwhile, which requires an entity, and any client who will not contract with an unregistered individual.",
    sections: [
      {
        heading: "The tax treatment is identical, and that is the headline",
        content:
          "A single-member LLC is a disregarded entity for federal tax purposes by default. Its profit goes on Schedule C exactly as a sole proprietor's does, self-employment tax applies to all of it at 15.3% of 92.35%, and the qualified business income deduction is available on the same terms. There is no default tax saving, no separate business return, and no different set of deductible expenses.\n\nAn LLC does not unlock deductions a sole proprietor cannot take. Business expenses are deductible because they are ordinary and necessary for a trade or business, and a sole proprietor has a trade or business. Anyone suggesting an LLC lets you deduct things you otherwise could not is describing tax fraud, not a structure.",
      },
      {
        heading: "Liability is what you are actually buying",
        content:
          "Without an entity, there is no legal distinction between you and the business. A judgment against the business is a judgment against you, and it can reach your savings, your car, and in many circumstances your home. An LLC creates that separation: creditors of the business generally reach business assets rather than personal ones.\n\nThe protection is real but conditional. It depends on respecting the separation — a dedicated business bank account, no paying personal expenses from business funds, contracts signed in the LLC's name, and whatever annual filings your state requires. Where owners fail those basics, courts can disregard the entity, and the term for it, piercing the veil, describes exactly what happens to the protection.\n\nIt also does not cover everything. An LLC does not shield you from liability for your own professional negligence, and lenders routinely require a personal guarantee on small-business credit, which puts your personal assets back on the line by contract.",
      },
      {
        heading: "At what income is an LLC worth it?",
        content:
          "There is no income threshold for the liability question — a first client can generate a claim as easily as a fiftieth, and risk is about what the work involves rather than what it pays. If the work carries real exposure, the entity is worth forming early, when it costs a filing fee rather than a lawsuit.\n\nIncome does matter for one specific reason: an S-corp election requires an eligible entity, and a sole proprietor cannot make one. Once profit approaches the level where the election starts to pay — roughly $35,000 at a 50% salary, more if your defensible salary is higher — you need an LLC or corporation in place to take advantage. That makes rising profit a practical trigger even for someone unconvinced by the liability argument. Our [S corp tax calculator](/s-corp-tax/) shows where that point falls for your numbers.",
      },
      {
        heading: "What forming an LLC actually involves",
        content:
          "Filing articles of organisation with your state and paying the fee, which commonly runs between $50 and $500. Most states also require an annual report or franchise fee, and a few charge substantially more — worth checking yours before assuming the cost is trivial.\n\nBeyond the filing: get an EIN from the IRS, which is free and lets you avoid giving clients your Social Security number; open a business bank account and route all business income and expenses through it; and write an operating agreement even as a single member, since several states expect one and it documents the separation you are relying on. Registered-agent services are optional unless you want to keep your home address off the public record.",
      },
      {
        heading: "What does not change when you form an LLC",
        content:
          "Your tax return, unless you make a further election. Your self-employment tax. Your deductions. Your obligation to pay quarterly estimated taxes. The requirement to report all business income whether or not a 1099 arrives — and note that for 2026 the Form 1099-NEC threshold rose to $2,000, so more genuine income now arrives with no form at all.\n\nWhat does change is the legal boundary around the business, the paperwork that maintains it, and the availability of an S-corp election later. Setting the expectation correctly matters, because owners who form an LLC expecting a tax cut are frequently disappointed by their first return.",
      },
    ],
    faqs: [
      {
        question: "Do you pay more taxes as a sole proprietor than an LLC?",
        answer:
          "No — by default they are taxed identically. A single-member LLC is a disregarded entity, so its profit goes on Schedule C and pays self-employment tax exactly as a sole proprietor's does, with the same QBI deduction available. A difference only appears if the LLC later elects S-corporation treatment, which is a separate decision with its own costs.",
      },
      {
        question: "At what income is an LLC worth it?",
        answer:
          "For liability, there is no income threshold — the question is whether the work could generate a claim, and that is true from the first client. For tax, the relevant trigger is that an S-corp election requires an entity, so once profit approaches roughly $35,000 to $52,000, depending on the salary you could defend, you need an LLC or corporation in place to benefit.",
      },
      {
        question: "Does an LLC protect my personal assets?",
        answer:
          "Generally yes, provided you maintain the separation. That means a dedicated business bank account, not paying personal costs from business funds, signing contracts in the LLC's name, and keeping up your state filings. Fail those and a court can disregard the entity. It also will not shield you from your own professional negligence, and lenders often require a personal guarantee that contractually restores your exposure.",
      },
      {
        question: "Can I deduct more expenses with an LLC?",
        answer:
          "No. Business expenses are deductible because they are ordinary and necessary for a trade or business, and a sole proprietor has one. An LLC changes the legal wrapper, not the deduction rules. Advice suggesting otherwise usually describes deducting personal expenses, which is not a benefit of any structure.",
      },
      {
        question: "How much does an LLC cost to maintain?",
        answer:
          "The state filing fee to form it, commonly $50 to $500, plus an annual report or franchise fee in many states. A handful of states charge considerably more, so check yours specifically rather than relying on a national average. Beyond that, the running cost is the discipline of keeping business and personal finances separate — which costs nothing but has to actually happen.",
      },
      {
        question: "Should I form an LLC before I have clients?",
        answer:
          "If the work carries meaningful liability, forming early is cheaper than forming after a problem. If you are testing whether the business works at all, starting as a sole proprietor and forming later is a reasonable sequence — you can move the activity into an LLC once it has revenue. What is not sensible is delaying because you expect a tax benefit, since there is not one by default.",
      },
    ],
    sources: [IRS_LLC, IRS_SOLE_PROP, IRS_SE_TAX, IRS_2553],
    relatedComparisons: ["llc-vs-s-corp", "1099-vs-w2"],
    calculatorLinks: [
      { label: "Self-Employment Tax Calculator", href: "/self-employment-tax/" },
      { label: "S Corp Tax Calculator", href: "/s-corp-tax/" },
    ],
  },
];
