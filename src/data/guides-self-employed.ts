import type { Guide } from "./guides";

// Self-employed guides (2026-09-05). The article half of the 1099 silo: the deduction and
// owner-pay topics that are explained rather than calculated. Each links into the calculator
// pillars (/self-employment-tax/, /s-corp-tax/, /mileage-deduction/) rather than restating them.

const IRS_199A = {
  label: "IRS — Qualified business income deduction",
  url: "https://www.irs.gov/newsroom/qualified-business-income-deduction",
};
const IRS_SE_TAX = {
  label: "IRS — Topic no. 751, Social Security and Medicare withholding rates",
  url: "https://www.irs.gov/taxtopics/tc751",
};
const IRS_SCHED_C = {
  label: "IRS — About Schedule C (Form 1040), Profit or Loss from Business",
  url: "https://www.irs.gov/forms-pubs/about-schedule-c-form-1040",
};
const IRS_PUB535 = {
  label: "IRS — Publication 535, Business Expenses",
  url: "https://www.irs.gov/publications/p535",
};
const IRS_HOME_OFFICE = {
  label: "IRS — Home office deduction",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/home-office-deduction",
};
const IRS_HOME_SIMPLE = {
  label: "IRS — Simplified option for home office deduction",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/simplified-option-for-home-office-deduction",
};
const IRS_PUB587 = {
  label: "IRS — Publication 587, Business Use of Your Home",
  url: "https://www.irs.gov/publications/p587",
};
const IRS_LLC = {
  label: "IRS — Limited liability company (LLC)",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc",
};
const IRS_PAYING_YOURSELF = {
  label: "IRS — Paying yourself",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/paying-yourself",
};
const IRS_HOBBY = {
  label: "IRS — Hobby or business: here's what to know about that side hustle",
  url: "https://www.irs.gov/newsroom/hobby-or-business-heres-what-to-know-about-that-side-hustle",
};

export const SELF_EMPLOYED_GUIDES: Guide[] = [
  {
    slug: "qbi-deduction-explained",
    updated: "2026-09-05",
    title: "QBI Deduction Explained: Section 199A in 2026",
    metaDescription:
      "The QBI deduction is now permanent, with a new $400 minimum from 2026. What it is, who qualifies, why yours might be zero, and what it does not do.",
    h1: "The QBI Deduction, Explained",
    cardBlurb: "Section 199A after the OBBBA: permanence, the new $400 minimum, and why yours may be zero.",
    introText:
      "The qualified business income deduction lets most self-employed people deduct up to 20% of their business profit before income tax is calculated. It was due to expire after 2025; the One Big Beautiful Bill Act made it permanent and added a minimum deduction of $400 from 2026 for taxpayers with at least $1,000 of qualified business income from a business they materially participate in.\n\nOne clarification first, because the new minimum is being described online as though it were a payment: $400 is a deduction, not a refund. It reduces the income your tax is calculated on. In the 12% bracket it is worth about $48.",
    sections: [
      {
        heading: "What qualified business income actually is",
        body: "Qualified business income is the net profit from a qualifying US trade or business that passes through to your personal return — a sole proprietorship, a single-member LLC, a partnership, or an S corporation. If you file a Schedule C, your net profit is the starting point.\n\nSeveral things are not QBI, and the exclusions catch people out. W-2 wages are not qualified business income, which is why an S-corporation election shrinks the deduction: every dollar routed into salary leaves the §199A base. Capital gains, dividends, and interest income are excluded. So is income from a business conducted outside the United States. And the deduction is calculated after the above-the-line deduction for half of your self-employment tax, so the base is slightly smaller than your headline profit.",
      },
      {
        heading: "What the OBBBA changed",
        body: "Two things. The deduction was scheduled to expire at the end of 2025; it is now permanent, which removes the planning uncertainty that hung over every pass-through business for years.\n\nSecond, from 2026 there is a minimum deduction of $400 for taxpayers with at least $1,000 of qualified business income from one or more active trades or businesses in which they materially participate — regular, continuous, and substantial involvement, in the sense used by IRC §469(h). Both the $1,000 threshold and the $400 minimum are indexed for inflation for years after 2026.\n\nThe practical effect is narrow but real: it helps taxpayers whose ordinary 20% calculation would have produced less than $400, which generally means small side businesses. If your profit is $50,000, the minimum changes nothing — your ordinary QBI deduction is far larger.",
      },
      {
        heading: "Why your QBI deduction might be zero",
        body: "This is the most common question about §199A, and there are four usual causes.\n\nThe first is that the deduction is capped at 20% of your taxable income before the QBI deduction, not just 20% of business profit. If the standard deduction has already absorbed most of your income, there is little taxable income left for the cap to work against, and the deduction shrinks accordingly. A single filer with $20,000 of profit and no other income sees this immediately.\n\nThe second is a business loss. No profit, no qualified business income — and a loss carries forward to reduce next year's QBI.\n\nThe third is the income threshold. Above roughly $201,775 for single filers and $403,500 for joint filers in 2026, limits based on W-2 wages paid and property held begin to phase in. For a specified service trade or business — health, law, accounting, consulting, athletics, financial services, and similar fields where the principal asset is the reputation or skill of its employees — the deduction phases out entirely above the range rather than merely being limited.\n\nThe fourth is simply that the income was not QBI: wages, investment income, or gains do not qualify however the business is structured.",
      },
      {
        heading: "What the QBI deduction does not do",
        body: "It does not reduce self-employment tax. This trips people up constantly, and the reason is structural: self-employment tax is calculated on Schedule SE from your net earnings, before any income-tax deductions are applied. QBI is an income-tax deduction, taken further down the return. Your 15.3% is untouched.\n\nIt is also not a business expense and does not appear on Schedule C. It reduces taxable income on your Form 1040 after your business profit has already been determined. That means it cannot create a business loss, and it cannot be used to reduce the profit that self-employment tax or the QBI calculation itself is based on.\n\nAnd it is not a credit. A deduction reduces the income you are taxed on; a credit reduces the tax itself. A $10,000 QBI deduction saves $1,200 in the 12% bracket, not $10,000. Our [self-employment tax calculator](/self-employment-tax/) applies the deduction and shows both taxes side by side.",
      },
      {
        heading: "How the deduction interacts with an S-corp election",
        body: "Directly, and against you. An S-corporation election moves part of your profit into W-2 wages, and wages are not qualified business income. Every dollar of salary removes a dollar from the §199A base, so you give up a 20% deduction on that dollar in exchange for avoiding 15.3% of payroll tax on it.\n\nThis is the offset most S-corp calculators omit, and it materially changes the answer. At $120,000 of profit with a $60,000 salary, an election avoids $7,775 of payroll tax but forfeits $8,242 of QBI deduction. It still comes out ahead once the income-tax arithmetic is worked through, but by far less than the gross figure suggests — and at lower profit, or with a more conservative salary, it can tip negative. The [S corp tax calculator](/s-corp-tax/) prices both effects together.",
      },
      {
        heading: "Nothing to elect, but plenty to get wrong",
        body: "You do not elect the QBI deduction. It is claimed on Form 8995 for straightforward cases, or Form 8995-A where the income thresholds and limitations apply, and tax software generally handles it once your business income is entered correctly.\n\nWhat is worth checking is the input rather than the calculation. Overstated profit produces an overstated deduction and an overstated tax bill; understated deductions elsewhere on Schedule C do the same. And if you run more than one business, QBI is calculated per business and then combined, so a loss in one can offset profit in another.\n\nIf your income is near the phase-in threshold, this is one of the genuine cases where a preparer earns their fee — the interaction between the wage limitation, the property limitation, and specified service trade status is where the rules stop being intuitive.",
      },
    ],
    tools: [
      { href: "/self-employment-tax/", label: "Self-Employment Tax Calculator" },
      { href: "/s-corp-tax/", label: "S Corp Tax Calculator" },
      { href: "/self-employment-tax/1099-tax-calculator/", label: "1099 Tax Calculator" },
    ],
    faqs: [
      {
        question: "What is the QBI deduction?",
        answer:
          "A deduction of up to 20% of qualified business income from a pass-through business — a sole proprietorship, single-member LLC, partnership, or S corporation. It reduces the income your federal income tax is calculated on. The One Big Beautiful Bill Act made it permanent and, from 2026, added a minimum deduction of $400 for taxpayers with at least $1,000 of QBI from a business they materially participate in.",
      },
      {
        question: "Is the QBI deduction permanent?",
        answer:
          "Yes. Section 199A was scheduled to expire after 2025, and the One Big Beautiful Bill Act made it permanent. That removes a long-running planning uncertainty for pass-through businesses, and it is why an S-corp election decision made today does not need to price in the deduction disappearing.",
      },
      {
        question: "Does the $400 minimum QBI deduction mean I get $400 back?",
        answer:
          "No — it is a deduction, not a refund or a credit. It reduces the income your tax is calculated on, so its value is $400 times your marginal rate: about $48 in the 12% bracket and $88 in the 22% bracket. The minimum applies from 2026 to taxpayers with at least $1,000 of qualified business income from an active business they materially participate in.",
      },
      {
        question: "Why is my QBI deduction zero?",
        answer:
          "Usually one of four reasons: the deduction is capped at 20% of taxable income before the QBI deduction, and the standard deduction may have absorbed most of your income; your business made a loss; your income is above the §199A threshold and you are in a specified service trade or business; or the income was not QBI at all, such as wages, interest, or capital gains.",
      },
      {
        question: "Does the QBI deduction reduce self-employment tax?",
        answer:
          "No. Self-employment tax is calculated on Schedule SE from your net earnings, before income-tax deductions apply. The QBI deduction is an income-tax deduction taken further down your Form 1040, so it leaves the 15.3% completely untouched. Only reducing your net profit — through legitimate business deductions — reduces self-employment tax.",
      },
      {
        question: "Do I qualify for the QBI deduction as a freelancer?",
        answer:
          "Almost certainly, if you file a Schedule C and your taxable income is below the phase-in threshold — about $201,775 single or $403,500 married filing jointly for 2026. Below that, the wage and property limitations do not apply and specified service trade status does not matter. Above it, the rules tighten considerably and are worth taking to a preparer.",
      },
    ],
    sources: [IRS_199A, IRS_SCHED_C, IRS_SE_TAX],
  },

  {
    slug: "how-to-pay-yourself-llc",
    updated: "2026-09-05",
    title: "How to Pay Yourself From an LLC (2026)",
    metaDescription:
      "How to pay yourself from an LLC: why a single-member owner cannot be on payroll, how an owner's draw is taxed, and what changes with an S-corp election.",
    h1: "How to Pay Yourself From an LLC",
    cardBlurb: "Owner's draw vs payroll, why the draw is not what you are taxed on, and when that changes.",
    introText:
      "If you own a single-member LLC taxed the default way, you pay yourself by taking an owner's draw — moving money from the business account to your personal one. You cannot put yourself on payroll, and you do not need to.\n\nThe part that confuses people is that the draw is not what you are taxed on. You are taxed on the business's profit, whether you take it out or leave it in the account.",
    sections: [
      {
        heading: "Why a single-member LLC owner cannot be an employee",
        body: "A single-member LLC is a disregarded entity for federal tax purposes by default: the IRS does not see a separate taxpayer, it sees you. You cannot be an employee of yourself, so there is no W-2, no payroll withholding, and no employment tax filings for your own pay.\n\nThis is not a limitation to work around. Payroll exists to collect tax from a separate employer, and here there is no separate employer. You pay the equivalent tax directly through self-employment tax and quarterly estimated payments instead. If you have genuine employees, you run payroll for them — the rule applies to your own compensation, not to the business.",
      },
      {
        heading: "The draw is a transfer, not income",
        body: "An owner's draw has no tax consequence at the moment you take it. It is a movement of money between two accounts you own. There is no withholding, no payroll tax event, and it does not appear on your tax return as income.\n\nWhat you are taxed on is the business's net profit for the year: revenue minus deductible expenses, reported on Schedule C. Take out nothing and you still owe tax on the profit. Take out more than the profit and you do not owe more tax — you are drawing down capital rather than earning it.\n\nThe practical consequence is that leaving money in the business account is not tax deferral. Owners who assume it is get an unwelcome surprise in April, having reinvested profit they had already been taxed on but had not set aside for. The [self-employment tax calculator](/self-employment-tax/) shows what the profit itself costs regardless of what you withdrew.",
      },
      {
        heading: "How to actually do it",
        body: "Keep a dedicated business bank account and transfer to your personal account on a schedule — many owners pay themselves twice a month, mirroring a salary, because a rhythm is easier to budget around than ad-hoc withdrawals.\n\nDecide the amount from profit, not from balance. A bank balance includes money owed to taxes and money owed to suppliers, so drawing to the balance overdraws the business. A workable method: each month, calculate profit, move your tax set-aside percentage to a separate account, keep an operating buffer, then draw what remains.\n\nRecord every draw in your bookkeeping as an owner's draw rather than an expense. It is not deductible, and categorising it as one overstates expenses and understates profit — an error that surfaces at filing time.\n\nWhat you must not do is pay personal expenses directly from the business account. It muddies the bookkeeping and, more seriously, it undermines the separation the LLC's liability protection depends on. Draw the money first, then spend it.",
      },
      {
        heading: "How much can you take?",
        body: "Legally, up to your capital in the business. Practically, less than that, and the constraint is cash flow rather than tax.\n\nBefore drawing, three things need to be covered: the tax you have accrued on profit so far, any money owed to suppliers or subcontractors, and an operating buffer for the months when income does not arrive. For a business with lumpy income, a buffer of two to three months of fixed costs is a common target — see our [guide to budgeting with irregular income](/guides/how-to-budget-with-irregular-income/).\n\nThere is no requirement to draw a particular amount and no concept of reasonable compensation under default taxation. That requirement arrives only with an S-corporation election.",
      },
      {
        heading: "What changes if you elect S-corp status",
        body: "Everything about owner pay. Under an S election you become an employee of your own business, and you must run real payroll: a W-2 salary, withholding, employment tax filings, and a separate Form 1120-S for the business. Profit beyond the salary is taken as a distribution, which is not subject to payroll tax.\n\nThe salary is not yours to set freely. The IRS requires reasonable compensation for the services you provide before non-wage distributions are made, and it publishes no safe harbor and no percentage — the 60/40 and 2% rules found online are not IRS positions. What it examines is where the corporation's gross receipts come from: revenue generated by your own services belongs in wages.\n\nWhether the election is worth the additional machinery is an arithmetic question with a real answer, and the answer is often no at modest profit. The [S corp tax calculator](/s-corp-tax/) prices it, including the QBI deduction you give up and the payroll costs you take on.",
      },
      {
        heading: "Multi-member LLCs work differently",
        body: "A multi-member LLC is taxed as a partnership by default. Members take distributions rather than draws, and each member's share of profit is reported to them on a Schedule K-1, whether or not it was distributed.\n\nPartnerships can also make guaranteed payments — amounts paid to a member for services regardless of profit, which function somewhat like a salary and are deductible to the partnership. They are still not wages, and the recipient still pays self-employment tax on them.\n\nWhat matters most in a multi-member LLC is that the operating agreement says how profit is allocated and when distributions are made. Absent that, disputes are resolved by state default rules that may allocate profit in ways none of the members intended.",
      },
    ],
    tools: [
      { href: "/self-employment-tax/", label: "Self-Employment Tax Calculator" },
      { href: "/s-corp-tax/", label: "S Corp Tax Calculator" },
      { href: "/budget/", label: "Budget Calculator" },
    ],
    faqs: [
      {
        question: "How do you legally pay yourself from an LLC?",
        answer:
          "In a single-member LLC taxed the default way, by taking an owner's draw — transferring money from the business account to your personal account. There is no payroll and no withholding, because a disregarded entity has no separate employer to run it. You pay the tax separately through self-employment tax and quarterly estimated payments on the business's profit.",
      },
      {
        question: "Can I put myself on payroll as an LLC owner?",
        answer:
          "Not as the owner of a single-member LLC under default taxation — you cannot be your own employee when the IRS does not treat the entity as separate from you. You can if the LLC elects S-corporation treatment, and in that case you must, since an S-corp owner providing services has to take a reasonable W-2 salary before distributions.",
      },
      {
        question: "Is an owner's draw taxed?",
        answer:
          "Not at the moment you take it. The draw is a transfer between accounts you own and has no tax consequence of its own. You are taxed on the business's net profit for the year regardless of how much you withdrew, which means leaving money in the business account does not defer any tax.",
      },
      {
        question: "Can I take money out of my business account whenever I want?",
        answer:
          "Legally yes, up to your capital in the business, but it is a poor practice. The balance includes money already owed to taxes and to suppliers, so drawing against it overdraws the business. Set aside your tax percentage and an operating buffer first, then draw what remains — and never pay personal expenses directly from the business account, which undermines the liability separation.",
      },
      {
        question: "What happens if my LLC makes no money?",
        answer:
          "You owe no self-employment tax, because there is no profit to tax, and a loss can generally offset other income if the activity is genuinely a business rather than a hobby. You can still draw money out — you are drawing down capital you contributed rather than earnings — but doing so does not create a deduction, and repeated losses invite the question of whether the activity is being run with a profit motive.",
      },
      {
        question: "How much should I pay myself from my LLC?",
        answer:
          "Under default taxation there is no required amount and no reasonable compensation rule, so it is purely a cash-flow decision: cover accrued tax, cover payables, keep an operating buffer, then draw the rest. A regular schedule twice a month is easier to budget around than irregular withdrawals. Reasonable compensation only becomes a requirement if you elect S-corporation treatment.",
      },
    ],
    sources: [IRS_PAYING_YOURSELF, IRS_LLC, IRS_SE_TAX, IRS_SCHED_C],
  },

  {
    slug: "self-employed-tax-deductions",
    updated: "2026-09-05",
    title: "Self-Employed Tax Deductions: The Schedule C List",
    metaDescription:
      "A practical list of self-employed tax deductions by Schedule C category, the ordinary-and-necessary test, and an honest answer to 'write off everything'.",
    h1: "Self-Employed Tax Deductions That Actually Hold Up",
    cardBlurb: "Schedule C categories, the ordinary-and-necessary test, and why a deduction is worth ~26 cents.",
    introText:
      "A business deduction is worth more to a self-employed person than to an employee, because it reduces the profit that both income tax and self-employment tax are calculated on. In the 12% bracket a deducted dollar saves about 26 cents, not 12.\n\nThat is the real reason to track expenses properly. It is also why the advice circulating online to \"write off your whole life\" is worth addressing directly: the deductions below are the ones that survive scrutiny, and the test they have to pass is narrower than the advice suggests.",
    sections: [
      {
        heading: "The test every deduction has to pass",
        body: "A business expense is deductible if it is ordinary — common and accepted in your line of work — and necessary, meaning helpful and appropriate for it. That is the whole standard, and it is broader than nervous filers assume and narrower than confident ones claim.\n\nTwo qualifiers do most of the work in practice. An expense must be for the business rather than personal, and where something serves both, only the business share is deductible. And it has to be substantiated: a bank statement shows an amount and a vendor, not what was bought or why it was for the business.\n\nThe useful instinct is that if a deduction requires an elaborate justification, it probably does not hold. Deductions that survive are usually boring and obviously connected to how you earn money.",
      },
      {
        heading: "The deductions most self-employed people miss",
        body: "Business mileage is the largest for anyone who drives, and 2026 has two rates: 72.5 cents a mile through June 30 and 76 cents from July 1. Twelve thousand business miles is around $8,910, worth roughly $2,328 in tax in the 12% bracket. See the [mileage deduction calculator](/mileage-deduction/).\n\nThe business-use share of your phone and internet is routinely left off, because there is no invoice that says \"business\". Estimate the proportion honestly, record the reasoning, and deduct that share.\n\nHalf of your self-employment tax is deducted above the line automatically, and the qualified business income deduction takes up to 20% of profit — neither is a Schedule C expense, but both reduce what you finally pay.\n\nOthers frequently missed: professional and liability insurance; accounting and legal fees; bank and payment-processing fees, including the commission platforms deduct before paying you; software subscriptions; courses and books that maintain or improve the skills you already sell; and the self-employed health insurance deduction, which is taken on Form 1040 rather than Schedule C.",
      },
      {
        heading: "The Schedule C categories, in the form's own language",
        body: "Recording expenses against the form's own categories as you go turns the year-end total into a sum rather than a sorting project. The main ones: advertising; car and truck expenses; commissions and fees; contract labor; depreciation; insurance; interest; legal and professional services; office expense; rent or lease; repairs and maintenance; supplies; taxes and licences; travel; meals; utilities; wages; and other expenses.\n\nTwo categories carry rules worth knowing. Meals are deductible only where there is a business purpose and generally at a limited percentage, and the person you ate with matters — a meal alone at your desk is not a business meal. Travel must be primarily for business, and the cost of bringing a spouse who has no business role is not deductible.\n\nOur [expense report template](/templates/expense-report-template/) is laid out against these categories with a business-use percentage column.",
      },
      {
        heading: "An honest answer to 'write off everything'",
        body: "The claim circulating on social media is that being self-employed lets you deduct your car, your home, your phone, your holidays, and your meals. Each of those contains a real deduction wrapped in an overstatement.\n\nYour car: business miles are deductible, commuting is not, and personal driving is not. Your home: a space used regularly and exclusively for business qualifies, and the room you also watch television in does not. Your phone: the business share, not the whole bill. Travel: a trip that is primarily business, not a holiday with one client meeting attached. Meals: with a business purpose and a business contact, at the limited percentage.\n\nClothing is the clearest example of the gap. It is deductible only if it is unsuitable for everyday wear — a uniform or protective gear qualifies; a suit does not, however much you bought it for work.\n\nThe cost of getting this wrong is not just the disallowed deduction. It is interest, potential penalties, and an examination that then looks at everything else on the return.",
      },
      {
        heading: "Hobby or business, and why it decides everything",
        body: "None of the above applies if the IRS treats your activity as a hobby. Hobby income is reportable, but hobby expenses cannot be deducted against it, and a hobby loss cannot offset your other income.\n\nThe test is whether you conduct the activity with a genuine profit motive and in a businesslike manner: separate finances, records, an attempt to make it work, expertise, and whether it has ever been profitable. A side activity that loses money indefinitely with no attempt to change that is the profile that draws the question.\n\nThis matters most to newer and smaller businesses, where an early loss is both plausible and useful. The way to protect the position is to run the thing like a business from the start rather than to argue about it afterwards.",
      },
      {
        heading: "Records are what turn an expense into a deduction",
        body: "Photograph receipts as they arrive and file them by year. Keep a contemporaneous mileage log with dates, miles, destination, and purpose — 2026 additionally requires enough date detail to split miles across the two rates. Record the business-use percentage for anything shared, along with how you arrived at it, at the time rather than later.\n\nThe single highest-return habit is not a software choice: it is a separate business bank account. Mixed personal and business transactions make bookkeeping unpleasant enough to postpone, and postponed bookkeeping is how deductions get lost. Deductions are rarely denied because they were ineligible. They are denied because nothing was kept to show they happened.",
      },
    ],
    tools: [
      { href: "/self-employment-tax/", label: "Self-Employment Tax Calculator" },
      { href: "/mileage-deduction/", label: "Mileage Deduction Calculator" },
      { href: "/templates/expense-report-template/", label: "Expense Report Template" },
    ],
    faqs: [
      {
        question: "What can I write off as self-employed?",
        answer:
          "Anything ordinary and necessary for your trade or business: business mileage, a qualifying home office, software and subscriptions, equipment, supplies, professional insurance, accounting and legal fees, bank and platform fees, relevant training, and the business-use share of phone and internet. Each reduces income tax and self-employment tax together, so a deducted dollar is worth about 26 cents in the 12% bracket.",
      },
      {
        question: "How much is a business deduction worth?",
        answer:
          "Your marginal income-tax rate plus the 14.13% effective self-employment rate, because the deduction reduces the net profit both taxes are calculated on. That is 26.13% in the 12% bracket and 36.13% in the 22% bracket — roughly double what someone comparing it to their income-tax bracket alone would assume.",
      },
      {
        question: "What deduction can I claim without receipts?",
        answer:
          "The safer framing is that you should be able to substantiate everything you claim. Some deductions rely on a log rather than receipts — the standard mileage rate needs a contemporaneous mileage record, not fuel receipts. But a bank statement alone shows an amount and a vendor, not the business purpose, so for anything material a receipt is what makes the deduction defensible.",
      },
      {
        question: "Can I write off my car as self-employed?",
        answer:
          "You deduct business driving, not the car. Either take the standard mileage rate — 72.5 cents a mile through June 2026 and 76 cents after — or deduct the business-use share of actual vehicle costs. Commuting between home and a regular workplace never counts, and personal miles never count. You cannot claim the mileage rate and fuel and repairs, because the rate already includes them.",
      },
      {
        question: "Can I deduct clothing for my business?",
        answer:
          "Only if it is unsuitable for everyday wear. Uniforms, branded workwear, and protective gear qualify. A suit bought specifically for client meetings does not, because it can be worn in ordinary life — the test is objective rather than about your intentions. This is the clearest example of where 'I bought it for work' is not sufficient.",
      },
      {
        question: "What if my business made a loss?",
        answer:
          "If the activity is genuinely a business, expenses are deducted against income and a resulting loss can generally offset your other income, subject to the rules. If the IRS treats it as a hobby, the income is still reportable but the expenses cannot be deducted against it and the loss cannot offset your salary. The distinction turns on whether you run the activity with a real profit motive and in a businesslike way.",
      },
    ],
    sources: [IRS_SCHED_C, IRS_PUB535, IRS_HOBBY, IRS_SE_TAX],
  },

  {
    slug: "home-office-deduction",
    updated: "2026-09-05",
    title: "Home Office Deduction: Rules, Methods, and Myths",
    metaDescription:
      "The home office deduction explained: the exclusive-use test, simplified vs actual method, why yours may be zero, and whether it really triggers an audit.",
    h1: "The Home Office Deduction, Without the Myths",
    cardBlurb: "Exclusive use, $5 per square foot vs actual costs, and the audit red-flag question answered.",
    introText:
      "You can deduct the cost of a part of your home used regularly and exclusively for business. The simplified method deducts $5 per square foot up to 300 square feet — a maximum of $1,500 — and the actual expense method deducts the business share of your real housing costs.\n\nTwo things to settle up front. Employees generally cannot claim this deduction at all, whatever their working arrangement. And it is not an audit red flag in the way people believe — but a room that fails the exclusivity test is a genuine problem.",
    sections: [
      {
        heading: "Regular and exclusive use is the whole test",
        body: "The space must be used regularly for business and exclusively for business. Both words carry weight, and exclusivity is where most claims fail.\n\nExclusive means the space is not used for anything else. A spare bedroom converted into an office qualifies. The dining table you work at and eat at does not. A desk in the corner of a bedroom can qualify if the deduction is limited to that identifiable area and it genuinely is not used for personal purposes — but the room around it is not part of the claim.\n\nRegular means ongoing rather than occasional. Using the space a few times a year does not qualify, even if nothing else happens there.\n\nYour home must also be your principal place of business, or a place where you substantially and regularly conduct business. The IRS is explicit that working elsewhere does not automatically disqualify you: if you also use your home substantially and regularly for the business, it can still qualify.",
      },
      {
        heading: "Simplified or actual: which to use",
        body: "The simplified method multiplies $5 by the square footage used for business, capped at 300 square feet, for a maximum deduction of $1,500. It requires no allocation of household bills and no depreciation schedule.\n\nThe actual expense method deducts the business-use percentage of your real housing costs — mortgage interest or rent, utilities, insurance, repairs, and depreciation if you own. The percentage is usually the office's share of your home's square footage.\n\nThe arithmetic is straightforward: work out your business-use percentage, apply it to your annual housing costs, and compare against the simplified figure. If a 200 square foot office in a 2,000 square foot home is 10% of the space, and total housing costs are $30,000, the actual method yields $3,000 against the simplified method's $1,000. Where housing is expensive, the actual method usually wins by a wide margin, and the extra record-keeping is often the best-paid hour of the year.\n\nOne wrinkle for owners: the actual method includes depreciation, and depreciation claimed on a home office is subject to recapture when you sell. It is not a reason to avoid the method, but it is a reason to know it is coming.",
      },
      {
        heading: "Why your home office deduction might be zero",
        body: "The deduction cannot exceed the gross income from the business use of your home, less your other business expenses. In plain terms: it cannot create or deepen a business loss.\n\nIf your business broke even or lost money, the home office deduction is limited to zero for the year, whichever method you use. The two methods then differ in an important way. Under the actual expense method, the disallowed amount can be carried over to a future year. Under the simplified method, the excess may not be carried over — it is simply lost.\n\nThat asymmetry is a real argument for the actual method in a lean year, and it is the answer to the common question of why a deduction that seemed obviously available produced nothing.",
      },
      {
        heading: "Is it an audit red flag?",
        body: "This is the question that stops people claiming a deduction they are entitled to, and the honest answer is that the fear is dated. The home office deduction was once unusual and is now ordinary — remote and self-employed work made it common, and the simplified method exists precisely because the IRS wanted to reduce the burden of claiming it.\n\nWhat is genuinely risky is a claim that does not meet the test. A room that is also the guest room, an office that is most of the house, or a deduction claimed on a home where little business actually happens — those are weak positions, and a weak position is a problem whether or not it attracts attention.\n\nThe right response is to claim it if you qualify and document it properly: measure the space, photograph it, keep the bills you allocated, and record how you arrived at the percentage. A well-supported claim is not something to be afraid of. An unsupported one is, and no amount of not-claiming-other-things offsets that.",
      },
      {
        heading: "Employees generally cannot claim it",
        body: "Unreimbursed employee business expenses are not deductible for most employees under current law, and that includes a home office. Working from home full-time as a W-2 employee does not create a deduction, however much of your own space and electricity the arrangement consumes.\n\nThis catches people who read general advice about home offices without noticing it is written for the self-employed. If you receive a W-2, the practical route is an employer reimbursement under an accountable plan, which is not taxable to you, rather than a deduction on your return.\n\nSomeone with both a job and a side business can still claim a home office for the business, provided the space meets the exclusive and regular use test for that business — not for the employment.",
      },
      {
        heading: "What it is worth, and what else it unlocks",
        body: "As with every Schedule C deduction, a home office reduces the profit that both income tax and self-employment tax are calculated on, so it is worth your marginal rate plus about 14.13%. A $3,000 deduction saves roughly $784 in the 12% bracket.\n\nQualifying also has a second effect people miss: with a home office as your principal place of business, trips from home to a client or job site are business miles rather than commuting. For someone making frequent local trips, that reclassification can be worth more than the home office deduction itself — the [mileage deduction calculator](/mileage-deduction/) prices those miles at both 2026 rates.\n\nOur [self-employed deductions guide](/guides/self-employed-tax-deductions/) covers the rest of the Schedule C picture.",
      },
    ],
    tools: [
      { href: "/self-employment-tax/", label: "Self-Employment Tax Calculator" },
      { href: "/mileage-deduction/", label: "Mileage Deduction Calculator" },
      { href: "/templates/expense-report-template/", label: "Expense Report Template" },
    ],
    faqs: [
      {
        question: "What qualifies for the home office deduction?",
        answer:
          "A part of your home used both regularly and exclusively for business, where your home is your principal place of business or a place you substantially and regularly conduct business. Exclusivity is the strict part: a dedicated room qualifies, a dining table used for work and meals does not. Working elsewhere too does not automatically disqualify you.",
      },
      {
        question: "How much is the simplified home office deduction?",
        answer:
          "$5 per square foot of space used for business, capped at 300 square feet, so the maximum is $1,500 a year. It requires no allocation of household bills and no depreciation schedule. The trade-off is that any amount disallowed by the gross income limit cannot be carried forward, unlike under the actual expense method.",
      },
      {
        question: "Is the home office deduction an audit red flag?",
        answer:
          "Not in the way the folklore suggests. It is now a common deduction, and the IRS created the simplified method specifically to make claiming it easier. What creates real risk is a claim that fails the exclusive-use test — a room that doubles as a guest room, or an office that is implausibly large relative to the home. Claim it if you qualify, and document the space and the allocation.",
      },
      {
        question: "Why is my home office deduction zero?",
        answer:
          "Because it cannot exceed the gross income from the business use of your home less your other business expenses — it cannot create or deepen a loss. If the business broke even or lost money, the deduction is limited to zero. Under the actual expense method the disallowed amount carries over to a future year; under the simplified method it does not, and is lost.",
      },
      {
        question: "Can employees claim the home office deduction?",
        answer:
          "Generally no. Unreimbursed employee business expenses are not deductible for most employees under current law, so working from home on a W-2 does not create a deduction. The practical alternative is an employer reimbursement under an accountable plan. Someone with a side business can still claim a home office for that business if the space meets the test.",
      },
      {
        question: "Should I use the simplified or actual expense method?",
        answer:
          "Compare them. Work out your office's share of your home's square footage and apply it to your annual housing costs — mortgage interest or rent, utilities, insurance, repairs, and depreciation if you own. A 10% office in a home with $30,000 of costs yields $3,000 against the simplified method's $1,000 at that size. Where housing is expensive, actual usually wins comfortably.",
      },
    ],
    sources: [IRS_HOME_OFFICE, IRS_HOME_SIMPLE, IRS_PUB587, IRS_SCHED_C],
  },
];
