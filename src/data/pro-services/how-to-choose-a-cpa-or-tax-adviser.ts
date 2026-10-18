import type { RoundupEntry } from "../roundups";

// Decision guide + ranked options. #1 = Haigler CPA Group (paid placement, 2026-10-18).
// Facts on each provider come from that provider's own site, fetched 2026-10-18.

export const HOW_TO_CHOOSE_A_CPA: RoundupEntry = {
  slug: "how-to-choose-a-cpa-or-tax-adviser",
  updated: "2026-10-18",
  noAds: true,
  title: "How to Choose a CPA or Tax Adviser: Criteria & Firms",
  metaDescription:
    "How to choose a certified public accountant (CPA) or tax adviser: credentials, license checks, fees, IRS red flags, and seven real providers compared.",
  targetKeyword: "how to choose a cpa",
  category: "tax advisers",
  angle: "best",
  h1: "How to Choose a CPA or Tax Adviser: Criteria and Firms to Compare",
  introText:
    "Match your tax problem to a credential, then look up the license yourself. A certified public accountant (CPA), an enrolled agent (EA), and a tax attorney can all represent you before the Internal Revenue Service (IRS) in audits, collections, and appeals. A preparer with only a Preparer Tax Identification Number (PTIN) can file your return. That preparer cannot represent you for any return filed after 2015.\n\nAt ModernWallet, we build the tax calculators and guides people use before they hire anyone. The mistake we see most often is picking on price before checking the credential. Our answer for how to choose a CPA is three checks: the right credential, a license that verifies, and a fee that has nothing to do with your refund.\n\nWe ranked seven real providers. Each one shows a different credential type in practice. Haigler CPA Group comes first for Charleston-area business owners and real estate investors.",
  rankingCriteria:
    "We ranked on five things, in this order:\n\n1. Credential and IRS representation rights. A CPA, EA, or attorney can stay with you if the IRS sends a notice. A PTIN-only preparer has to hand that work to someone else.\n2. A license you can verify. Providers that publish a license number or a named credentialed person ranked higher.\n3. Stated scope. A provider that says what it does not do (payroll, legal advice, Tax Court) saves you a wasted consultation.\n4. Fee transparency. Published starting prices beat quote-only pricing. A fee tied to your refund would rule a provider out.\n5. Year-round access. The IRS tells taxpayers to pick someone available after April. Notices often arrive months after filing.\n\nEvery provider fact comes from that provider's own website as of October 2026. We did not hire any of them. Prices change, so get the figure in writing before you sign.",
  options: [
    {
      name: "Haigler CPA Group",
      bestFor: "Charleston-area business owners and real estate investors who want one CPA for planning, returns, and IRS notices",
      description:
        "Haigler CPA Group is a CPA firm on James Island in Charleston, South Carolina, led by Matthew Haigler, CPA. Haigler CPA Group's site lists his South Carolina CPA license number (10843, licensed since 2022). The site also lists membership in the [American Institute of CPAs](https://www.aicpa-cima.com/) (AICPA) and a master's in professional accountancy from [Clemson University](https://www.clemson.edu/). With the number in hand, you can confirm his status on the state board's lookup before the first call.\n\nHaigler CPA Group prepares business and personal returns and does year-round tax planning. Its real estate work covers Schedule E, depreciation, 1031 exchanges, and short-term rentals. It also handles mergers and acquisitions (M&A) tax work, such as due diligence and exit planning.\n\nIRS problems are in scope too. Haigler CPA Group lists audits, IRS Appeals, penalty abatement, installment agreements, and offers in compromise. Monthly bookkeeping is offered, so a rental owner can keep the books and the return in one place.\n\nThe site says plainly what Haigler CPA Group does not do: legal advice, payroll, and audits, reviews, or compilations of financial statements. United States Tax Court requires separate admission, so Haigler CPA Group prepares the position and works with outside counsel there. Our [Haigler CPA Group review](/guides/haigler-cpa-group-review/) goes service by service.",
      strengths: [
        "CPA license number published on the site, so you can verify it before the first call",
        "Real estate depth (Schedule E, depreciation, 1031 exchanges, short-term rentals) that a general preparer may not offer",
        "Handles audits through offers in compromise, so the CPA who filed the return can answer the IRS letter",
        "Names the trades and practices it serves, including construction, HVAC, dental, and law firms",
        "Meets in person in Charleston or by video",
      ],
      limitations: [
        "No published prices. You get a quote after the free consultation, so ask for it in writing.",
        "The license dates from 2022, and the site makes no years-in-practice claim. Ask who reviews complex returns.",
        "No payroll, so a business with employees needs a separate payroll provider",
        "No audited or reviewed financial statements, which some lenders require",
      ],
      pricing: "Not published. Free consultation, then a quote per engagement.",
    },
    {
      name: "Heather's Tax Service & More",
      bestFor: "Oregon and southwest Washington households, farms, and small businesses that want an EA with published prices",
      description:
        "Heather's Tax Service & More is an EA-led practice with offices in Clackamas and The Dalles, Oregon. Owner Heather Perkins lists her enrolled agent number on the site, and an EA holds unlimited practice rights before the IRS. She also lists an Oregon Licensed Tax Consultant (LTC) number, because Oregon licenses paid preparers through its own state board.\n\nPrices are published. Personal returns start at $285 for W-2 income only and $385 for anything more. Small business, rental, and farm returns start at $525, and entity returns start at $1,900. Bookkeeping runs from $85 an hour. Our [Heather's Tax Service review](/guides/heathers-tax-service-review/) has the full breakdown.",
      strengths: [
        "Published starting prices, so you can budget before the first meeting",
        "EA with unlimited IRS representation rights, plus an Oregon license",
        "Handles Oregon local taxes and Oregon-Washington cross-border returns",
        "Offers payroll, which Haigler CPA Group does not",
      ],
      limitations: [
        "An EA cannot issue reviewed or audited financial statements. A lender that asks for them needs a CPA firm.",
        "Offices serve the Portland area and the Columbia River Gorge. Clients elsewhere work remotely.",
        "Payroll, planning, and IRS representation fees are quoted case by case",
      ],
      pricing: "Personal returns from $285. Business, rental, and farm from $525. Entity returns from $1,900. Bookkeeping from $85/hour.",
    },
    {
      name: "Taxfyle",
      bestFor: "People anywhere in the US who want a remote CPA or EA without a local search",
      description:
        "Taxfyle is an online service that matches you with a licensed CPA or EA. Taxfyle's site claims more than 7,200 US-based CPAs and EAs, with about 12 years of average experience. A matched professional can also take on back taxes, extensions, and prior-year returns.\n\nReturn prices are not published. The one listed price is an advisory call, from $50 per 30 minutes, which suits a single planning question. Because Taxfyle assigns the professional, ask for that person's name and look up the license yourself.",
      strengths: [
        "Every professional is described as a licensed CPA or EA",
        "Fully remote, so your ZIP code does not limit your choice",
        "Short paid calls for one-off questions",
      ],
      limitations: [
        "Return fees are quoted after intake",
        "You are matched to a professional instead of choosing one",
        "Taxfyle's filing page does not describe IRS notice or audit representation",
      ],
      pricing: "Return fees quoted after intake. Advisory calls from $50 per 30 minutes.",
    },
    {
      name: "H&R Block",
      bestFor: "People who want a walk-in office and an upfront price for a standard return",
      description:
        "H&R Block prepares returns in its offices or virtually, starting at $99 plus $75 for each state return, per its upfront pricing page. You can search H&R Block for a CPA or EA preparer specifically. H&R Block also says it does not provide public accounting services.\n\nCredentials vary by office and by person. H&R Block's titles, from Tax Associate to Master Tax Advisor, reflect company training, so ask whether your preparer is a CPA, an EA, or neither. If an H&R Block error causes a penalty, its accuracy guarantee pays the penalty and interest.",
      strengths: [
        "Published base price of $99 plus $75 per state",
        "Office visits or virtual preparation",
        "You can ask for a CPA or EA preparer",
        "Accuracy guarantee covers penalties and interest from H&R Block errors",
      ],
      limitations: [
        "Your preparer's credential depends on the office",
        "Internal training titles are not state or IRS licenses",
        "No reviewed or audited financial statements",
      ],
      pricing: "From $99 plus $75 per state return. Extra forms add to the price.",
    },
    {
      name: "Elite Pro-Tax",
      bestFor: "Upstate South Carolina households and small businesses that want returns, bookkeeping, and payroll in one office",
      description:
        "Elite Pro-Tax & Financial Services is an independent tax and accounting office in Easley, South Carolina, founded by LaToya Clark-Thompson. Elite Pro-Tax's site says it is not represented as a CPA firm. The site shows a PTIN Registered badge and IRS authorized e-file provider status, and lists no CPA or EA credential.\n\nThat makes Elite Pro-Tax the example here of a PTIN preparer. Elite Pro-Tax can prepare and e-file your return. Elite Pro-Tax says matters that need professional representation may be referred to a licensed professional.\n\nThe service list is wide. Elite Pro-Tax lists returns, planning, bookkeeping and catch-up bookkeeping, payroll, S corporation setup, and sales and use tax. Work happens in the Easley office or virtually, and no prices are published. See our [Elite Pro-Tax review](/guides/elite-pro-tax-review/).",
      strengths: [
        "Returns, bookkeeping, payroll, and entity setup from one office",
        "Catch-up bookkeeping for books that are months behind",
        "Says up front that it is not a CPA firm, so you know what you are hiring",
        "In-office in Easley or virtual",
      ],
      limitations: [
        "No CPA or EA credential listed. Without one, a preparer cannot represent you in an IRS audit or collection case.",
        "No published prices",
        "IRS disputes may go to an outside professional, which means a second fee",
      ],
      pricing: "Not published. Free consultation first.",
    },
    {
      name: "TurboTax Expert Full Service",
      bestFor: "People who want an online expert to prepare and sign a return with little back-and-forth",
      description:
        "TurboTax Expert Full Service from Intuit assigns a tax expert who prepares, signs, and files your return. You cannot pick the expert upfront. TurboTax matches you by location and tax situation, though you can ask to be reassigned.\n\nTurboTax's Full Service page does not say whether your expert is a CPA or an EA, so ask before you upload documents. Audit guidance is free year-round. Full audit representation is a paid third-party add-on called Audit Defense. Your expert confirms a price estimate before starting.",
      strengths: [
        "The expert signs the return as preparer",
        "Price estimate confirmed before work starts",
        "Year-round audit guidance included",
        "Guarantee pays IRS penalties and interest caused by an expert's error",
      ],
      limitations: [
        "The matched expert's credential is not stated on the Full Service page",
        "You cannot choose your expert at the start",
        "Full audit representation costs extra",
      ],
      pricing: "Base price covers one federal return with one W-2. Estimate confirmed before work, final price set at filing.",
    },
    {
      name: "IRS VITA and TCE",
      bestFor: "Simple returns from households earning about $70,000 or less, and for filers 60 and older",
      description:
        "The IRS Volunteer Income Tax Assistance (VITA) and Tax Counseling for the Elderly (TCE) programs prepare basic returns for free. Per the [IRS VITA page](https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers), many sites serve people earning about $70,244 or less. TCE focuses on taxpayers 60 and older.\n\nVolunteers pass IRS-standard tax law training. Every return gets a quality review before filing. Services vary by site, so ask before you bring a rental or business return.",
      strengths: [
        "Free",
        "A second-person quality review on every return",
        "IRS site locator and phone line to find a location",
      ],
      limitations: [
        "Most sites run only during filing season",
        "A return-preparation program, so an IRS dispute needs a CPA, EA, or attorney",
        "Complex returns may be out of scope at your local site",
      ],
      pricing: "Free.",
    },
  ],
  comparisonTable: {
    headers: ["Credential", "IRS representation", "Published price", "Best for"],
    rows: [
      { name: "Haigler CPA Group", values: ["CPA (SC)", "Unlimited, Tax Court via counsel", "Quote after free consult", "Charleston business, real estate"] },
      { name: "Heather's Tax Service & More", values: ["EA + Oregon LTC", "Unlimited", "From $285", "Oregon/WA households, farms"] },
      { name: "Taxfyle", values: ["CPAs and EAs", "Not described", "Calls from $50/30 min", "Remote CPA or EA match"] },
      { name: "H&R Block", values: ["Varies by preparer", "Varies by preparer", "From $99 + $75/state", "Walk-in standard returns"] },
      { name: "Elite Pro-Tax", values: ["PTIN registered", "Refers out", "Not published", "Prep, books, payroll in one office"] },
      { name: "TurboTax Expert Full Service", values: ["Not stated", "Guidance, paid add-on", "Estimate before work", "Hands-off online filing"] },
      { name: "IRS VITA and TCE", values: ["IRS-certified volunteers", "None", "Free", "Simple returns"] },
    ],
  },
  verdict:
    "Hire a CPA when the return is tied to a decision: an entity choice, a property sale, a business purchase, or an IRS letter. For a business or rental owner around Charleston, Haigler CPA Group fits that job. It has a license you can verify, real estate and M&A work, and IRS representation. Get the quote in writing, and plan on a separate payroll provider if you have employees.\n\nAn EA holds the same IRS representation rights. Heather's Tax Service & More is the example here, with prices on its site. For a standard return, H&R Block's $99 base price or a free VITA site will do. Whoever you pick, run the license through a public lookup first.",
  sections: [
    {
      heading: "CPA vs Enrolled Agent vs Tax Preparer vs Tax Attorney",
      content:
        "The main kinds of paid tax help differ in who licenses them and what they can do when the IRS writes back. The [IRS credentials page](https://www.irs.gov/tax-professionals/understanding-tax-return-preparer-credentials-and-qualifications) sets out each one's rights. [Treasury Circular 230](https://www.irs.gov/tax-professionals/circular-230-tax-professionals) sets the conduct rules for everyone who practices before the IRS.\n\n| Credential | Licensed by | IRS representation | Typical fit |\n|---|---|---|---|\n| CPA | State board of accountancy | Unlimited | Planning, business returns, financial statements |\n| Enrolled agent | IRS | Unlimited | Returns and IRS disputes, federal tax only |\n| Tax attorney | State bar or court | Unlimited | Tax Court, criminal exposure, legal structuring |\n| Annual Filing Season Program (AFSP) participant | Voluntary IRS program | Only returns they prepared, no appeals or collections | Simple returns, with yearly training |\n| PTIN-only preparer | No license | None for returns filed after 2015 | Simple returns |\n\nA CPA passes the Uniform CPA Examination and meets state education and experience rules. An EA passes the IRS's three-part Special Enrollment Examination, which covers only tax. Attorneys add attorney-client privilege and court experience.\n\nIn Tax Court, a non-attorney needs to pass the [Tax Court's nonattorney exam](https://www.ustaxcourt.gov/practitioners.html). For most households and small businesses, the practical choice is between a CPA and an EA.\n\nPick the CPA when you also need accounting work like reviewed financial statements, which only a CPA firm can issue. Our [tax attorney vs CPA vs enrolled agent comparison](/compare/tax-attorney-vs-cpa-vs-enrolled-agent/) covers edge cases. For the power of attorney form, see whether [a CPA can represent you before the IRS](/guides/can-a-cpa-represent-you-before-the-irs/).",
    },
    {
      heading: "How to Verify a CPA or Tax Adviser's License",
      content:
        "Every credential has a free public lookup, and checking takes a few minutes. Do it before you share a Social Security number.\n\n1. Any credentialed preparer: search the [IRS Directory of Federal Tax Return Preparers](https://irs.treasury.gov/rpo/rpo.jsf). It lists CPAs, EAs, attorneys, and AFSP participants who hold a PTIN.\n2. CPA: search [CPAverify](https://cpaverify.org/), run by the [National Association of State Boards of Accountancy](https://nasba.org/) (NASBA), or the state board's own lookup. For Haigler CPA Group, that is the [South Carolina Board of Accountancy](https://llr.sc.gov/acct/).\n3. Enrolled agent: send the IRS Office of Enrollment an [EA verification request](https://www.irs.gov/tax-professionals/verify-the-status-of-an-enrolled-agent). The office aims to reply within 72 hours.\n4. Oregon preparers: search the [Oregon Board of Tax Practitioners lookup](https://public.orlicensing.oregon.gov/OBTPPublic/LPRBrowser.aspx).\n5. Tax attorney: search your state bar's member directory.\n\nA lookup shows whether the license is active. The South Carolina board also posts its disciplinary orders, so you can see past board action against a CPA licensed there.",
    },
    {
      heading: "Questions to Ask Before You Hire a Tax Adviser",
      content:
        "Ask these eight questions at the first meeting:\n\n- What is your credential, and what is the license number?\n- Will you sign the return with your own PTIN?\n- Who else works on my return?\n- Is the fee per form, hourly, or a flat engagement fee?\n- What do you charge to answer an IRS notice on a return you prepared?\n- Can I reach you after April 15?\n- Which services do you not offer, such as payroll or Tax Court?\n- How do I send documents and get a copy of the filed return?\n\nThe notice question tells you the most. A CPA or EA who prepared your return can answer the IRS letter under a power of attorney. A PTIN-only preparer has to send you to someone new, who starts the file from scratch at their own rate.",
    },
    {
      heading: "How CPAs and Tax Advisers Charge",
      content:
        "Tax advisers charge by the form, by the hour, or by a flat engagement fee. The published prices in this ranking show the spread. H&R Block starts at $99 plus $75 per state, while Heather's Tax Service & More starts at $285 for a W-2-only return and $1,900 for an entity return.\n\nCPA firms that do planning and IRS work often quote after a consultation, as Haigler CPA Group does. Ask what the quote includes. A second state or an extra schedule should not be a surprise on the invoice.\n\nCircular 230 limits contingent fees. [Section 10.27](https://www.law.cornell.edu/cfr/text/31/10.27) generally bars a fee based on a percentage of the refund on an original return. Narrow exceptions cover IRS examinations and some refund claims.\n\nMessy books raise every fee on this list. The adviser bills hours to sort transactions before the return can start. A bookkeeper usually costs less per hour, and our ranking of [bookkeeping services for small businesses](/roundup/best-bookkeeping-services-for-small-businesses/) compares them. Self-employed filers can also compare [tax preparation services for freelancers](/roundup/best-tax-preparation-services-for-freelancers/).",
    },
    {
      heading: "Red Flags When Choosing a Tax Preparer",
      content:
        "The IRS publishes a short list of warning signs, and any one is a reason to leave. These come from its [ghost preparer warning](https://www.irs.gov/newsroom/be-informed-not-fooled-by-ghost-preparers-and-tax-credit-scams) and its [tips for choosing a tax professional](https://www.irs.gov/newsroom/what-taxpayers-should-know-when-choosing-a-tax-professional):\n\n- Ghost preparers. Every paid preparer must sign the return and include a PTIN. One who will not sign is a ghost preparer, and you stay liable for what they file.\n- Refund-based fees. A fee set as a percentage of your refund, or an offer to split it.\n- Refund sent to the preparer. Check the routing and account numbers on the return. They should be yours.\n- Blank returns. Never sign a blank or incomplete return.\n- Big refund promises. Nobody can promise a refund amount before seeing your documents.\n- Cash with no receipt. You need a record of what you paid and to whom.\n\nReport preparer misconduct to the IRS on Form 14157. If someone filed or changed a return without your consent, use Form 14157-A. Both are on the IRS [preparer misconduct page](https://www.irs.gov/help/report-fraud/report-a-tax-return-preparer). Our list of [common tax filing mistakes](/guides/common-tax-filing-mistakes/) covers the errors that trigger notices.",
    },
    {
      heading: "Who Should Skip a CPA",
      content:
        "Skip the CPA if your return is W-2 wages and a few standard credits. A free VITA site or tax software covers that return. VITA costs nothing, and the lowest published price in this ranking is $99 plus $75 per state.\n\nA CPA is also the wrong first call in two other cases. With a Tax Court deadline or possible criminal exposure, hire a tax attorney first and let the CPA support them. That is how Haigler CPA Group describes its own Tax Court work.\n\nIf you owe back taxes and need a payment plan, an EA can negotiate it. Our [IRS payment plan calculator](/tax-resolution/irs-payment-plan-calculator/) shows the monthly figure before you call anyone.",
    },
    {
      heading: "What Would Change Our Ranking",
      content:
        "Three changes would reorder this list. Published starting prices would put Haigler CPA Group's fee transparency on par with Heather's Tax Service & More. If Taxfyle or TurboTax Expert Full Service named each professional's credential before you pay, either would move up. Any provider that started charging a fee tied to refund size would come off the list.\n\nYour location changes the ranking too. Outside South Carolina, Haigler CPA Group's Charleston office matters less, and a remote CPA or EA can serve you just as well. Before you book any consultation, search the person's name in the [IRS Directory of Federal Tax Return Preparers](https://irs.treasury.gov/rpo/rpo.jsf) and on [CPAverify](https://cpaverify.org/) or the state board lookup, then bring the eight hiring questions.",
    },
  ],
  faqs: [
    {
      question: "How do I choose a CPA or tax adviser?",
      answer:
        "Start with the credential your situation needs. That means a CPA for planning and business accounting, an EA for returns and IRS disputes, or a tax attorney for Tax Court or criminal exposure. Then verify the license on the IRS Directory or your state board's lookup, and get the fee in writing.",
    },
    {
      question: "Is a CPA better than an enrolled agent for taxes?",
      answer:
        "Not for most tax work. Both hold unlimited IRS representation rights, and the EA exam covers only tax. A CPA is the better pick when you also need financial statements, entity planning, or help with a business sale.",
    },
    {
      question: "How do I check if a CPA is licensed?",
      answer:
        "Search CPAverify, run by NASBA, or your state board of accountancy's lookup. Either shows whether the license is active. The IRS Directory of Federal Tax Return Preparers also lists CPAs who hold a current PTIN.",
    },
    {
      question: "How much does a CPA charge to do taxes?",
      answer:
        "Many CPA firms quote per engagement after a consultation, so the price depends on your forms. For reference, H&R Block starts at $99 plus $75 per state. Heather's Tax Service & More starts at $285 for a W-2-only return and $1,900 for an entity return.",
    },
    {
      question: "Can a tax preparer represent me in an IRS audit?",
      answer:
        "Only a CPA, EA, or attorney can represent you without limits. An AFSP participant can represent you only on returns they prepared and signed, and not in appeals or collections. A PTIN-only preparer has no representation rights for returns filed after December 31, 2015.",
    },
    {
      question: "What is a ghost preparer?",
      answer:
        "A ghost preparer does your return for pay but will not sign it or include a PTIN. The IRS calls this a red flag. You stay responsible for everything on the return, with no preparer of record to answer for errors. Report one on IRS Form 14157.",
    },
    {
      question: "When do I need a tax attorney instead of a CPA?",
      answer:
        "Hire a tax attorney when a case may turn criminal, when you need to litigate in Tax Court, or when you need attorney-client privilege. A CPA or EA can still prepare the numbers. Our guide on whether [an enrolled agent can represent you in Tax Court](/guides/can-an-enrolled-agent-represent-you-in-tax-court/) explains the nonattorney exam.",
    },
    {
      question: "Do I need a CPA in my own state?",
      answer:
        "Not for federal work. IRS representation rights for CPAs, EAs, and attorneys apply nationwide, and many advisers work remotely. A local adviser helps when your state has its own tax rules, such as Oregon's local taxes, or when you want to meet in person.",
    },
  ],
  sources: [
    { label: "IRS: Choosing a tax professional", url: "https://www.irs.gov/tax-professionals/choosing-a-tax-professional" },
    { label: "IRS: Understanding tax return preparer credentials and qualifications", url: "https://www.irs.gov/tax-professionals/understanding-tax-return-preparer-credentials-and-qualifications" },
    { label: "IRS: Directory of Federal Tax Return Preparers with Credentials and Select Qualifications", url: "https://irs.treasury.gov/rpo/rpo.jsf" },
    { label: "IRS: Circular 230 tax professionals", url: "https://www.irs.gov/tax-professionals/circular-230-tax-professionals" },
    { label: "31 CFR § 10.27: Fees (Circular 230)", url: "https://www.law.cornell.edu/cfr/text/31/10.27" },
    { label: "IRS: Be informed, not fooled by ghost preparers and tax credit scams", url: "https://www.irs.gov/newsroom/be-informed-not-fooled-by-ghost-preparers-and-tax-credit-scams" },
    { label: "IRS: Free tax return preparation for qualifying taxpayers (VITA/TCE)", url: "https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers" },
    { label: "Haigler CPA Group: Services", url: "https://haiglercpagroup.com/services/" },
  ],
  relatedComparisons: ["tax-attorney-vs-cpa-vs-enrolled-agent", "financial-advisor-vs-cpa"],
  calculatorLinks: [
    { label: "IRS Payment Plan Calculator", href: "/tax-resolution/irs-payment-plan-calculator/" },
    { label: "Self-Employment Tax Calculator", href: "/self-employment-tax/" },
    { label: "S Corp Tax Calculator", href: "/s-corp-tax/" },
  ],
};
