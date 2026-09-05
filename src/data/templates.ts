import type { FAQ, Source } from "./types";

// Downloadable templates (2026-09-05). Each entry pairs a real generated file in
// public/downloads/ with a page that explains how to use it. The files are produced by
// scripts/build_templates.py (standard library only) — edit the script, never the artefacts.
//
// Editorial rule for this route: the download is not the page. A template page that is a
// paragraph and a button is thin content, and it also fails the reader, because the hard part of
// using a contract template is knowing which blanks matter. Every page here explains the clauses
// that actually decide outcomes.
//
// The three legal documents (contract, SOW, retainer) carry a disclaimer at the BOTTOM of the
// page, per the site's convention for YMYL content.

export interface TemplateFile {
  /** Filename in public/downloads/. */
  filename: string;
  /** "DOCX" | "CSV" — shown on the download button. */
  format: string;
  /** Short description of what the file contains. */
  contains: string;
}

export interface TemplateSection {
  heading: string;
  body: string;
}

export interface TemplateEntry {
  updated?: string;
  slug: string;
  title: string;
  metaDescription: string;
  targetKeyword: string;
  estimatedVolume?: number;
  estimatedKD?: number;
  h1: string;
  /** Short blurb for the index cards. */
  cardBlurb: string;
  introText: string;
  file: TemplateFile;
  /** Bulleted list of what the template includes. */
  includes: string[];
  sections: TemplateSection[];
  faqs: FAQ[];
  sources?: Source[];
  /** Related calculators, shown as pills. */
  tools?: Array<{ label: string; href: string }>;
  /** Rendered at the very bottom of the page. Used for the legal documents. */
  disclaimer?: string;
}

const LEGAL_DISCLAIMER =
  "This template is provided for general informational purposes only and is not legal or tax advice. It is a starting point, not a finished agreement. Contract law differs by state and by industry, and a clause that is standard in one context may be unenforceable in another. Have a licensed attorney review any agreement before you rely on it.";

const IRS_SCHED_C: Source = {
  label: "IRS — About Schedule C (Form 1040), Profit or Loss from Business",
  url: "https://www.irs.gov/forms-pubs/about-schedule-c-form-1040",
};
const IRS_1099NEC: Source = {
  label: "IRS — Instructions for Forms 1099-MISC and 1099-NEC (2026)",
  url: "https://www.irs.gov/instructions/i1099mec",
};
const IRS_MILEAGE: Source = {
  label: "IRS — Standard mileage rates",
  url: "https://www.irs.gov/tax-professionals/standard-mileage-rates",
};
const IRS_PUB463: Source = {
  label: "IRS — Publication 463, Travel, Gift, and Car Expenses",
  url: "https://www.irs.gov/publications/p463",
};
const IRS_PUB535: Source = {
  label: "IRS — Publication 535, Business Expenses",
  url: "https://www.irs.gov/publications/p535",
};
const IRS_CONTRACTOR: Source = {
  label: "IRS — Independent contractor (self-employed) or employee?",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee",
};

export const TEMPLATES: TemplateEntry[] = [
  {
    slug: "freelance-invoice-template",
    updated: "2026-09-05",
    title: "Free Freelance Invoice Template (Word)",
    metaDescription:
      "A free freelance invoice template in Word format, plus what to put on an invoice so it gets paid on time — and why 'Net 30' is the wrong due date.",
    targetKeyword: "freelance invoice template",
    estimatedVolume: 1600,
    estimatedKD: 48,
    h1: "Freelance Invoice Template",
    cardBlurb: "An editable Word invoice, plus the fields that actually get you paid faster.",
    introText:
      "A free, editable invoice template for freelancers and independent contractors, in Word format so you can put your own details on it in a minute.\n\nThe template is the easy part. What decides whether you get paid on time is a small number of fields most invoices get wrong — chiefly the due date, which should be an actual date rather than \"Net 30\".",
    file: {
      filename: "freelance-invoice-template.docx",
      format: "DOCX",
      contains: "Editable invoice with header, from/bill-to blocks, an itemised work table with subtotal and deposit lines, payment instructions, and notes.",
    },
    includes: [
      "Invoice number, issue date, and an explicit payment due date",
      "From and Bill-to blocks, including a line for the accounts payable contact",
      "Itemised work table with quantity, rate, amount, subtotal, deposit, and total due",
      "Payment instructions for bank transfer, card, and check",
      "A notes section covering the 2026 1099-NEC reporting threshold",
    ],
    sections: [
      {
        heading: "Put a real due date on it",
        body: "The single most effective change you can make to an invoice is replacing \"Net 30\" with a date. \"Net 30\" requires the person paying it to work out what day that is, and an invoice that requires arithmetic gets set aside for the one that does not.\n\nWrite \"Payment due: 14 April 2026\" and the invoice enters the payment run for that date. If you agreed payment terms in your contract, the due date on the invoice should simply reflect them — the invoice is not the place to negotiate terms, it is the place to state them unambiguously.",
      },
      {
        heading: "Describe deliverables, not activities",
        body: "The person approving your invoice is often not the person you worked with. \"Writing — 10 hours\" tells them nothing they can check. \"Homepage and three product pages, final draft delivered 4 March\" matches something they can verify against what was ordered.\n\nThis matters most on larger invoices, which are the ones that get queried. A line item that names the deliverable and the date it was delivered removes the most common reason for a hold: the approver not being sure what they are approving.",
      },
      {
        heading: "Address it to the right person",
        body: "Invoices sent to your day-to-day contact frequently sit in their inbox rather than entering the payment system. Ask, once, who invoices should go to and whether there is a portal or a purchase order number to reference, then put that on every invoice.\n\nThe template includes an \"Attn: accounts payable contact\" line for exactly this. On the first invoice with a new client, it is worth asking directly: \"who should I address invoices to, and do you need a PO number?\" It costs one email and removes a recurring delay.",
      },
      {
        heading: "Your invoices are your tax records",
        body: "The invoices you issue are the primary record of the income you report on Schedule C, and they should reconcile with what clients report to the IRS. That reconciliation changed in 2026: the Form 1099-NEC filing threshold rose from $600 to $2,000, so a lot of genuine client income now arrives with no form attached at all.\n\nThat does not make it untaxed. Your own obligation begins at $400 of net self-employment earnings, and the IRS requires gig and freelance income to be reported whether or not an information return is issued. Number your invoices sequentially, keep a copy of every one, and the year-end total becomes a report rather than a reconstruction. Our [1099 tax calculator](/self-employment-tax/1099-tax-calculator/) turns that figure into what you owe.",
      },
      {
        heading: "Take a deposit on anything substantial",
        body: "The template has a deposit line because a deposit is the most reliable protection a freelancer has. It filters out clients who were never going to pay, it funds the start of the work, and it changes the dynamic if a project goes wrong — you are negotiating over the balance rather than the whole fee.\n\nA common structure is 25% to 50% up front, non-refundable, with the balance on delivery or split across milestones. Agree it in the contract before the work starts; an invoice is too late to introduce it.",
      },
    ],
    faqs: [
      {
        question: "What should be on a freelance invoice?",
        answer:
          "An invoice number, the issue date, an explicit due date, your name and address, the client's name and address, an itemised description of the work with quantities and rates, the total due, and the payment methods you accept with the details needed to use them. If you took a deposit, show it as a deduction so the balance is unambiguous.",
      },
      {
        question: "Do I need to put my SSN or EIN on an invoice?",
        answer:
          "No. Clients collect your taxpayer identification number on a Form W-9, not from your invoices, and putting an SSN on a document that gets emailed and forwarded is an unnecessary exposure. If a client asks for it on the invoice, offer a W-9 instead. Getting an EIN from the IRS is free and lets you avoid sharing your SSN with clients entirely.",
      },
      {
        question: "How long should I give a client to pay?",
        answer:
          "Fourteen days is a reasonable default for a solo freelancer, and shorter terms are common for smaller clients. Thirty days is standard with larger companies whose payment runs are monthly. Whatever you choose, agree it in the contract rather than on the invoice, and state it as a date rather than a period.",
      },
      {
        question: "Can I charge a late fee?",
        answer:
          "Only if it was agreed in writing before the work started, and even then it is subject to state limits on interest. In practice, an automatic reminder on the due date recovers more money than a penalty clause, because most late payment is administrative rather than deliberate. Put the late fee in the contract if you want it, but rely on the reminder.",
      },
      {
        question: "Do I need to send an invoice if the client sends me a 1099?",
        answer:
          "Yes. A 1099 is the client's report to the IRS of what they paid you; an invoice is your request for payment and your own record of the income. They serve different purposes and the two should reconcile. Note that for 2026 many clients will not send a 1099-NEC at all, since the threshold rose to $2,000 — which makes your own invoice records more important, not less.",
      },
    ],
    sources: [IRS_1099NEC, IRS_SCHED_C],
    tools: [
      { label: "1099 Tax Calculator", href: "/self-employment-tax/1099-tax-calculator/" },
      { label: "Freelance Rate Calculator", href: "/freelance-rate/" },
    ],
  },

  {
    slug: "freelance-contract-template",
    updated: "2026-09-05",
    title: "Free Freelance Contract Template (Word)",
    metaDescription:
      "A free freelance contract template in Word, with the clauses that actually prevent disputes — scope, revisions, IP transfer on payment, and kill fees.",
    targetKeyword: "freelance contract template",
    estimatedVolume: 880,
    estimatedKD: 37,
    h1: "Freelance Contract Template",
    cardBlurb: "An editable services agreement, and which clauses decide whether it protects you.",
    introText:
      "A free, editable freelance services agreement in Word format, covering scope, payment, revisions, intellectual property, confidentiality, and termination.\n\nMost freelance disputes are not about bad faith. They are about a scope that was never written down and a revision count nobody agreed. Those two clauses do more work than everything else in the document.",
    file: {
      filename: "freelance-contract-template.docx",
      format: "DOCX",
      contains: "A twelve-section services agreement with bracketed placeholders, covering services, fees, scope changes, revisions, timeline, IP, confidentiality, contractor status, termination, liability, and governing law.",
    },
    includes: [
      "Scope of services, with a prompt to describe deliverables specifically",
      "Fees, deposit, invoicing cadence, payment terms, and late interest",
      "Scope-change and revision-limit clauses",
      "Timeline tied to client dependencies, so their delays do not become your missed deadline",
      "IP transfer on full payment, with portfolio rights retained",
      "Independent contractor status, termination, liability cap, and governing law",
      "Signature blocks for both parties",
    ],
    sections: [
      {
        heading: "The revision limit is the clause that saves the project",
        body: "A fixed fee with unlimited revisions is not a fixed fee — it is an open-ended commitment priced as though it were bounded. It is the most common way a profitable project becomes an unprofitable one, and it rarely happens through bad faith. A client who has not been told there is a limit has no reason to think there is one.\n\nName a number. Two rounds per deliverable is a common default, with further rounds billed hourly. The clause protects the client too: it tells them that feedback is a defined process with a cost attached, which tends to produce more considered feedback the first time.",
      },
      {
        heading: "Tie your deadline to their dependencies",
        body: "The template's timeline clause makes your delivery date conditional on the client supplying what you need by an agreed date. Without that, a client who takes three weeks to send brand assets has still hired you against a fixed deadline, and the slippage becomes your problem.\n\nWrite it as a symmetry: you deliver by a date, provided they supply materials, access, or approvals by an earlier one, and your date moves by the length of any delay in theirs. It is not an aggressive clause — it is a description of how the work actually functions.",
      },
      {
        heading: "IP transfers on payment, not on delivery",
        body: "The intellectual property clause says ownership passes to the client when they have paid in full. That single word — \"full\" — is what gives you leverage if an invoice goes unpaid, because until then the client does not own what you made.\n\nThe clause also keeps two things with you. Pre-existing tools, templates, and know-how stay yours, so a client does not acquire your working methods by hiring you once. And portfolio rights let you show the work, which for most freelancers is how the next client arrives. If a client needs to remove that right for confidentiality reasons, it is a reasonable thing to negotiate — but it should be a negotiation, not a default.",
      },
      {
        heading: "Independent contractor status is not just boilerplate",
        body: "The clause stating you are an independent contractor rather than an employee matters because misclassification is a real legal question with tax consequences, and the IRS looks at the substance of the relationship rather than what the contract calls it.\n\nThe factors that matter are behavioural and financial control: who decides how the work is done, who supplies the equipment, whether you can work for others, and how you are paid. The contract clause should describe an arrangement that is actually true. If a client directs your hours, supplies your equipment, and requires exclusivity, a clause calling you a contractor will not settle the question. See the [1099 vs W-2 comparison](/compare/1099-vs-w2/) for what turns on the distinction.",
      },
      {
        heading: "What this template does not do",
        body: "It does not replace a lawyer, and there are situations where you should not rely on a template at all: work involving personal data or regulated industries, contracts with liability exposure larger than the fee, anything with an unusual IP arrangement, and any agreement a client has redlined in ways you do not fully understand.\n\nIt also does not cover state-specific requirements. Contract law varies, some states limit what a liability cap or non-compete can do, and a clause that is standard in one state can be unenforceable in another. Use this to have a better-informed conversation with an attorney, not to avoid one.",
      },
    ],
    faqs: [
      {
        question: "Do freelancers need a written contract?",
        answer:
          "For anything beyond a very small job, yes. A written contract is what makes scope, payment terms, and revision limits enforceable, and it is what you rely on if a client disputes the work or stops paying. It also protects the client, which is why professional clients expect one. Verbal agreements can be binding but are difficult to prove and typically leave the details undefined.",
      },
      {
        question: "What should a freelance contract include?",
        answer:
          "Scope of services described as deliverables, fees and payment terms including any deposit, a revision limit, a scope-change process, a timeline tied to client dependencies, intellectual property transfer conditional on full payment, confidentiality, independent contractor status, termination terms, a liability cap, and governing law. The template here covers all of these with bracketed placeholders.",
      },
      {
        question: "Who owns the work in a freelance contract?",
        answer:
          "Whatever the contract says — which is why the clause matters. This template transfers ownership to the client on full payment, keeps your pre-existing tools and know-how with you, and retains your right to show the work in a portfolio. Without a clause, ownership depends on default copyright rules and the type of work, which is a worse position for both sides than a clear agreement.",
      },
      {
        question: "Can I use a contract template without a lawyer?",
        answer:
          "For straightforward, low-risk work with a modest fee, freelancers commonly do. The risk rises with the size of the engagement, the sensitivity of the data involved, and how far the client's redlines depart from the original. A single attorney review of a template you will reuse across many clients is usually a better investment than reviewing each contract individually.",
      },
      {
        question: "What is a kill fee and should I include one?",
        answer:
          "A kill fee is an amount payable if the client cancels a project after it has started. This template handles the same problem through its termination clause: the client pays for work completed and expenses incurred, and deposits are non-refundable. That structure is usually easier to enforce than a flat kill fee because it is tied to work actually performed.",
      },
    ],
    sources: [IRS_CONTRACTOR],
    tools: [
      { label: "Freelance Rate Calculator", href: "/freelance-rate/" },
      { label: "1099 vs W-2 Calculator", href: "/freelance-rate/1099-vs-w2-calculator/" },
    ],
    disclaimer: LEGAL_DISCLAIMER,
  },

  {
    slug: "statement-of-work-template",
    updated: "2026-09-05",
    title: "Free Statement of Work Template (Word)",
    metaDescription:
      "A free statement of work template in Word, with deliverables, acceptance criteria, milestones, and the out-of-scope section that prevents most disputes.",
    targetKeyword: "statement of work template",
    estimatedVolume: 1900,
    estimatedKD: 31,
    h1: "Statement of Work Template",
    cardBlurb: "An editable SOW with acceptance criteria, milestones, and an out-of-scope section.",
    introText:
      "A free, editable statement of work in Word format, designed to sit underneath a master services agreement and define one specific project.\n\nThe two sections that do the work are the ones most SOWs leave out: explicit acceptance criteria, and an out-of-scope list. Without them, \"done\" is a matter of opinion.",
    file: {
      filename: "statement-of-work-template.docx",
      format: "DOCX",
      contains: "An eight-section SOW with a deliverables table carrying acceptance criteria and dates, a milestone payment schedule, client responsibilities, an acceptance window, change control, and assumptions.",
    },
    includes: [
      "Reference to the governing master agreement, with a precedence rule",
      "Objective statement in the client's terms",
      "Deliverables table with acceptance criteria and due dates",
      "An explicit out-of-scope section",
      "Milestone-based payment schedule",
      "Client responsibilities and a deemed-acceptance window",
      "Change control and stated assumptions",
    ],
    sections: [
      {
        heading: "Acceptance criteria turn opinion into a test",
        body: "\"Client is happy with the design\" is not an acceptance criterion. It cannot be met, because it can always be un-met. \"Three homepage concepts delivered as Figma files at 1440px, each with mobile and desktop frames\" can be checked.\n\nThe deliverables table in this template has a column for acceptance criteria for exactly this reason. Write something a third party could verify without knowing either of you. It protects the freelancer from an endlessly moving target, and it protects the client from a supplier who declares the work finished when it plainly is not.",
      },
      {
        heading: "The out-of-scope section prevents more disputes than any other",
        body: "Most scope disputes come from an assumption that was never stated, and the assumption is almost always the client's. They expected the copy to be written; you expected it supplied. Neither of you was unreasonable, and neither wrote it down.\n\nAn out-of-scope list is the cheapest insurance in the document. List the adjacent things a reasonable person might assume are included and say they are not: content creation, hosting setup, post-launch support, training, third-party licence costs. It reads as slightly pedantic and saves entire projects.",
      },
      {
        heading: "Deemed acceptance stops a project stalling in silence",
        body: "The most common way a project fails to finish is not rejection — it is silence. The deliverable goes out, nobody responds, and the final invoice cannot be raised. Weeks pass.\n\nThe acceptance clause here gives the client a defined window, typically five business days, to accept or provide written feedback against the criteria. Anything not rejected in writing within that window is deemed accepted. It is not a trick: it obliges you to deliver against criteria you both agreed, and it obliges them to look. It is the clause that lets a project end.",
      },
      {
        heading: "Milestone payments beat a single invoice at the end",
        body: "A payment schedule tied to milestones does two things. It funds the work as it progresses, which matters when you are carrying costs, and it limits your exposure: if a client stops paying at the midpoint, you have lost one milestone rather than the entire project.\n\nA common structure is a deposit before work begins, one or more payments on delivery of specific items, and a final payment on acceptance. Tie each payment to an event that is unambiguous — \"on delivery of item 1\" rather than \"halfway through\".",
      },
      {
        heading: "How an SOW relates to your contract",
        body: "The SOW describes one project. The master services agreement describes the relationship — payment terms, IP, confidentiality, liability, governing law — and does not change project to project.\n\nSplitting them this way means a repeat client signs the long document once and a short SOW for each new piece of work. The template includes a precedence clause stating that the master agreement controls where the two conflict, which prevents an SOW from accidentally rewriting terms you negotiated carefully. If you do not yet have a master agreement, our [freelance contract template](/templates/freelance-contract-template/) is the document this sits under.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between a statement of work and a contract?",
        answer:
          "A contract, or master services agreement, governs the relationship: payment terms, intellectual property, confidentiality, liability, and governing law. A statement of work defines one specific project underneath it — deliverables, acceptance criteria, timeline, and price. The split lets a repeat client sign the long document once and a short SOW for each new engagement.",
      },
      {
        question: "What should a statement of work include?",
        answer:
          "An objective, a deliverables table with acceptance criteria and due dates, an explicit out-of-scope list, a milestone payment schedule, client responsibilities, an acceptance window, a change-control process, and any assumptions the estimate relies on. The acceptance criteria and out-of-scope sections are the two most often omitted and the two that prevent the most disputes.",
      },
      {
        question: "How specific should acceptance criteria be?",
        answer:
          "Specific enough that someone who knows neither party could judge whether the deliverable meets them. \"Client approves\" fails that test; \"three concepts as Figma files with mobile and desktop frames, delivered by 14 March\" passes it. Vague criteria are not neutral — they systematically favour whoever is more persistent when a disagreement arises.",
      },
      {
        question: "Do I need an SOW for a small project?",
        answer:
          "For a very small job a contract with a clear scope section is usually enough. The SOW earns its place when a project has multiple deliverables, several milestones, or dependencies on the client — that is, when \"what is included\" is complicated enough that memory will not settle it later. If you work with a client repeatedly, an SOW per project is also simply less paperwork than a new contract each time.",
      },
      {
        question: "Can a client change the scope after signing?",
        answer:
          "Only through the change-control process, which is why the template includes one. Any change to scope, deliverables, timeline, or fees requires a written change order signed by both parties before the affected work begins. Without that clause, scope creep arrives as a series of small requests that individually seem unreasonable to refuse.",
      },
    ],
    sources: [IRS_CONTRACTOR],
    tools: [
      { label: "Freelance Rate Calculator", href: "/freelance-rate/" },
      { label: "Day Rate Calculator", href: "/freelance-rate/day-rate-calculator/" },
    ],
    disclaimer: LEGAL_DISCLAIMER,
  },

  {
    slug: "retainer-agreement-template",
    updated: "2026-09-05",
    title: "Free Retainer Agreement Template (Word)",
    metaDescription:
      "A free retainer agreement template in Word. Covers the capacity-versus-deliverables choice, rollover caps, overage rates, and response times.",
    targetKeyword: "retainer agreement template",
    estimatedVolume: 390,
    estimatedKD: 12,
    h1: "Retainer Agreement Template",
    cardBlurb: "An editable monthly retainer, including the rollover clause that keeps it profitable.",
    introText:
      "A free, editable retainer agreement in Word format for freelancers and consultants billing a fixed monthly fee.\n\nA retainer is the closest thing freelancing has to a salary, and the closest thing it has to a trap. Which one you get depends almost entirely on two clauses: what the fee actually buys, and what happens to unused time.",
    file: {
      filename: "retainer-agreement-template.docx",
      format: "DOCX",
      contains: "A ten-section retainer agreement covering the capacity-versus-deliverables model, fee and payment timing, rollover rules, overage rates, scope, response times, term and termination, contractor status, and IP.",
    },
    includes: [
      "A choice between a capacity retainer and a deliverables retainer, with both drafted",
      "Fee, payment-in-advance timing, and a review cadence",
      "Rollover clause with an expiry and a cap",
      "Overage rate for work beyond the retained amount",
      "Covered and not-covered scope lists",
      "Response times and working hours, so a retainer is not an on-call arrangement",
      "Initial term, rolling renewal, and notice period",
    ],
    sections: [
      {
        heading: "Decide what the fee buys before anything else",
        body: "There are two kinds of retainer and confusing them is the source of most retainer problems. A capacity retainer reserves your availability — the client is buying a claim on your time, and the fee is payable whether or not they use it. A deliverables retainer buys a defined monthly output, and how long it takes you is your business.\n\nThe template drafts both so you can delete the one you do not want. Capacity retainers suit ongoing support work where demand is unpredictable. Deliverables retainers suit recurring output like a monthly report or a fixed content volume, and they reward you for getting faster. What does not work is leaving it ambiguous, because the client will assume whichever reading is more generous to them, and so will you.",
      },
      {
        heading: "Cap the rollover or the retainer becomes a liability",
        body: "Unused hours that roll over indefinitely turn a retainer into a debt. A client can under-use you for six months, then call in a banked block of time in a month when you are fully booked, and you are contractually obliged to deliver it.\n\nThe template's default is that unused time does not roll over, with an alternative that caps rollover at a set number of hours expiring after one month. Either is defensible. Unlimited rollover is not, and it is worth explaining why to a client who asks: the fee reserves capacity you turned other work away to hold, so the value was delivered whether or not they used it.",
      },
      {
        heading: "Get paid in advance",
        body: "A retainer should be payable in advance, on a fixed day of the month, before the work in that month begins. This is the norm, clients expect it, and it removes the awkward situation of having reserved capacity for someone who then does not pay.\n\nThe template also includes a first-payment-before-work clause. If a client will not pay the first month up front, that is useful information about how the rest of the arrangement will go.",
      },
      {
        heading: "Response times stop a retainer becoming on-call",
        body: "A monthly fee creates an implicit expectation of availability that nobody states, and the mismatch surfaces at the worst moment: a request at 6pm on a Friday that the client believes is covered and you believe is not.\n\nSay what your working hours are and how quickly you will acknowledge a request. Acknowledging within one business day is a common standard and is different from resolving within one business day — the distinction is worth writing down. If genuine on-call availability is part of the deal, it should be priced as such rather than assumed.",
      },
      {
        heading: "Price the retainer against your real rate",
        body: "A retainer is not a discount for loyalty; it is a trade. You give up some flexibility and gain predictable income, and the client gives up flexibility and gains guaranteed access. A small discount against your standard rate is reasonable, because a booked month costs you less pitching time than an unbooked one.\n\nWhat makes it unprofitable is discounting against a rate that was already too low. Work out the hourly rate you need first — accounting for the hours you cannot bill and both halves of self-employment tax — then apply the retainer discount to that figure rather than to a number you picked. Our [freelance rate calculator](/freelance-rate/) solves for the rate that produces the take-home you want.",
      },
    ],
    faqs: [
      {
        question: "What is a retainer agreement?",
        answer:
          "An agreement where a client pays a fixed recurring fee, usually monthly, in exchange for either reserved capacity — a set number of your hours or days — or a defined set of monthly deliverables. It differs from project work in that the fee recurs regardless of any single project, which gives the freelancer predictable income and the client guaranteed access.",
      },
      {
        question: "Should unused retainer hours roll over?",
        answer:
          "Preferably not, and if they do they should expire and be capped. The fee reserves capacity you held for that client and turned other work away to protect, so the value was delivered whether or not they used the time. Unlimited rollover lets a client bank months of your availability and call it in when you are fully committed elsewhere, which converts a stable arrangement into a liability.",
      },
      {
        question: "How much should I charge for a retainer?",
        answer:
          "Start from the hourly or day rate you need — one that accounts for your unbillable hours, both halves of self-employment tax, and your overhead — then multiply by the capacity you are reserving. A modest discount against your standard rate is reasonable because a booked month saves you pitching time. Discounting against a rate that was already too low is how retainers become unprofitable.",
      },
      {
        question: "How long should a retainer run?",
        answer:
          "An initial term of three months, then continuing month to month with thirty days' notice, is a common and workable structure. The initial term gives both sides enough time to judge whether the arrangement works, and the rolling continuation avoids renegotiating every quarter. Fees payable during the notice period should be stated explicitly.",
      },
      {
        question: "What is the difference between a retainer and a subscription?",
        answer:
          "In practice, little — both are recurring fees for ongoing access. The useful distinction is what is being sold: a capacity retainer sells your time, while a deliverables retainer or productised subscription sells a defined output. The second scales better, because getting faster increases your effective rate rather than simply freeing hours the client has already paid for.",
      },
    ],
    sources: [IRS_CONTRACTOR],
    tools: [
      { label: "Freelance Rate Calculator", href: "/freelance-rate/" },
      { label: "Billable Hours Calculator", href: "/freelance-rate/billable-hours-calculator/" },
    ],
    disclaimer: LEGAL_DISCLAIMER,
  },

  {
    slug: "mileage-log-template",
    updated: "2026-09-05",
    title: "Free Mileage Log Template (2026 IRS Rates)",
    metaDescription:
      "A free mileage log template built for 2026's two IRS rates — 72.5¢ through June and 76¢ from July. Includes the fields the IRS actually requires.",
    targetKeyword: "mileage log template",
    estimatedVolume: 720,
    estimatedKD: 21,
    h1: "Mileage Log Template for 2026",
    cardBlurb: "A CSV mileage log with the four fields the IRS requires — and dated rows for 2026's split rate.",
    introText:
      "A free mileage log in CSV format, openable in Excel, Google Sheets, or Numbers, with the four fields the IRS actually requires: date, business miles, destination, and business purpose.\n\nIt is dated by row for a specific reason. 2026 has two business mileage rates — 72.5 cents through June 30 and 76 cents from July 1 — so an annual total cannot be deducted correctly.",
    file: {
      filename: "mileage-log-template.csv",
      format: "CSV",
      contains: "Column headers for date, start location, destination, business purpose, odometer start and end, and business miles, with usage notes and two sample rows to delete.",
    },
    includes: [
      "Date column, so miles fall into the correct 2026 rate period",
      "Start location, destination, and business purpose — the substantiation the IRS asks for",
      "Odometer start and end alongside a business miles column",
      "Notes on the 2026 split rate and the commuting exclusion",
      "Two sample rows showing the expected format, to be deleted before use",
    ],
    sections: [
      {
        heading: "Why the log has to be dated in 2026",
        body: "The IRS set the 2026 business standard mileage rate at 72.5 cents a mile for January 1 through June 30, then raised it to 76 cents for July 1 through December 31. Both rates apply within the same tax year.\n\nThat makes a year-end odometer difference useless as a record. Twelve thousand miles cannot be deducted without knowing when they were driven — spread evenly they are worth $8,910, but a flat calculation at the January rate produces $8,700. Every row in this log carries a date so the split is a filter rather than a guess.",
      },
      {
        heading: "What the IRS actually requires",
        body: "A contemporaneous record showing, for each trip, the date, the number of business miles, the destination, and the business purpose — plus the vehicle's total mileage for the year, which establishes your business-use percentage.\n\n\"Contemporaneous\" is the word that does the work. It means recorded at or near the time of the trip. A log assembled in April from calendar entries and bank statements is a reconstruction, and reconstructions are what get disallowed on audit. Filling this in weekly is enough; filling it in annually is not.",
      },
      {
        heading: "Which miles count",
        body: "Business miles are miles driven for the business: to a client, between job sites, to collect supplies, to the post office with orders. For gig drivers, miles driven while the app is on and you are available — including driving to a pickup and repositioning between jobs — are business miles, not just the paid delivery distance.\n\nCommuting is never deductible. Driving from home to a regular place of work is personal, however far it is, and the fact that you are self-employed does not change it. The distinction the IRS draws is between travelling to work and travelling for work.",
      },
      {
        heading: "What the deduction is worth",
        body: "More than most people assume, because a business mileage deduction reduces Schedule C net profit — and net profit is the base for both income tax and self-employment tax. A deducted dollar therefore saves your marginal income-tax rate plus the 14.13% effective self-employment rate.\n\nFor a driver in the 12% bracket that is 26.13%, so an $8,910 deduction is worth about $2,328 rather than the $1,069 an income-tax-only calculation suggests. It is why a log filled in weekly is one of the better-paid half hours in a self-employed year. Our [mileage deduction calculator](/mileage-deduction/) prices your own miles at both 2026 rates.",
      },
      {
        heading: "A spreadsheet or an app?",
        body: "Either satisfies the IRS. The practical difference is that an app records trips automatically, which is the failure mode a spreadsheet does not solve — the miles you lose are usually the ones you forgot to write down, not the ones you recorded incorrectly.\n\nUse this template if your business driving is occasional and predictable enough to log reliably: a few client visits a month, a weekly supply run. If you drive daily for a gig platform, an automatic tracker will capture more and cost you less effort, and the tax saved on the extra captured miles typically exceeds the subscription — see our [comparison of mileage tracker apps](/roundup/best-mileage-tracker-apps/).",
      },
    ],
    faqs: [
      {
        question: "What does the IRS require in a mileage log?",
        answer:
          "For each trip: the date, the number of business miles, the destination, and the business purpose. You also need the vehicle's total annual mileage to establish the business-use percentage. The record must be contemporaneous — kept at or near the time of the trip — which is why a figure reconstructed at filing time is the deduction most often disallowed.",
      },
      {
        question: "What is the 2026 mileage rate?",
        answer:
          "72.5 cents per business mile for miles driven January 1 through June 30, 2026, and 76 cents per mile from July 1 through December 31. The IRS raised the rate mid-year, so both apply within the same tax year and your log must be dated well enough to separate them. Medical and moving mileage is 20.5 cents then 23.5 cents; the charitable rate stays at 14 cents.",
      },
      {
        question: "Can I use a spreadsheet instead of a mileage app?",
        answer:
          "Yes. The IRS does not require an app, only a contemporaneous record with the right fields. A spreadsheet works well for occasional, predictable business driving. It works poorly for daily gig work, where the miles you lose are the ones you forget to record rather than the ones you record wrongly — an automatic tracker usually captures more than it costs.",
      },
      {
        question: "Do I have to log personal miles too?",
        answer:
          "You do not need trip-level detail for personal driving, but you do need the vehicle's total annual mileage, because your business-use percentage is business miles divided by total miles. That percentage matters if you ever use the actual expense method, and it supports the reasonableness of your business figure either way. Recording the odometer on January 1 and December 31 is enough.",
      },
      {
        question: "Does the mileage deduction reduce self-employment tax?",
        answer:
          "Yes, and that is where most of its value comes from. The deduction reduces Schedule C net profit, which is the base for both income tax and self-employment tax, so it saves your marginal rate plus the 14.13% effective self-employment rate — about 26% combined in the 12% bracket. Estimates that quote only the income-tax saving understate it by more than half.",
      },
    ],
    sources: [IRS_MILEAGE, IRS_PUB463, IRS_SCHED_C],
    tools: [
      { label: "Mileage Deduction Calculator", href: "/mileage-deduction/" },
      { label: "2026 IRS Mileage Rate", href: "/mileage-deduction/irs-mileage-rate-2026/" },
    ],
  },

  {
    slug: "expense-report-template",
    updated: "2026-09-05",
    title: "Free Expense Report Template (Schedule C)",
    metaDescription:
      "A free business expense report template in CSV, with Schedule C categories and a business-use column so shared costs are split correctly.",
    targetKeyword: "expense report template",
    estimatedVolume: 2900,
    estimatedKD: 34,
    h1: "Business Expense Report Template",
    cardBlurb: "A CSV expense log with Schedule C categories and a business-use percentage column.",
    introText:
      "A free business expense log in CSV format, structured so the year-end totals map straight onto a Schedule C rather than needing to be re-sorted at filing time.\n\nIt includes a business-use percentage column, which is the field most templates omit and the one that matters for anything shared with personal life — your phone, your internet, your laptop.",
    file: {
      filename: "expense-report-template.csv",
      format: "CSV",
      contains: "Column headers for date, vendor, description, Schedule C category, amount, business-use percentage, deductible amount, and receipt status, with usage notes and two sample rows.",
    },
    includes: [
      "A Schedule C category column so year-end totals map onto the form",
      "Business-use percentage and a calculated deductible amount",
      "Receipt-kept flag, so gaps are visible before filing rather than after",
      "Vendor and description fields for substantiation",
      "Two sample rows demonstrating a full-business and a partial-business expense",
    ],
    sections: [
      {
        heading: "Categorise as you go, not in April",
        body: "The reason to put a Schedule C category on each row as you enter it is that the year-end total becomes a sum rather than a project. Sorting twelve months of undifferentiated transactions in April is the task most likely to be rushed, and rushing it is how deductions get missed.\n\nUse the categories from the form itself — advertising, car and truck expenses, insurance, legal and professional services, office expense, supplies, utilities, and so on. Matching the form's own vocabulary means the totals transfer directly, and it also makes the conversation with a preparer considerably shorter.",
      },
      {
        heading: "The business-use percentage is what most templates miss",
        body: "Very few self-employed expenses are 100% business. A phone plan you also use personally, home internet, a laptop that runs your accounts and your streaming — each is deductible only at its business share, and inventing a percentage after the fact is neither defensible nor accurate.\n\nThe template makes the split explicit: enter the full amount, enter the business-use percentage, and the deductible amount is the product. Recording your reasoning once, when the expense is fresh, is far easier than reconstructing it, and it gives you something to point at if the figure is ever questioned. A 60% business phone is a normal claim; a 100% business phone that is also your only phone is not.",
      },
      {
        heading: "What a deduction is actually worth to you",
        body: "For a Schedule C filer, more than the equivalent deduction is worth to an employee. It reduces net profit, and net profit is the base for both income tax and self-employment tax, so a deducted dollar saves your marginal income-tax rate plus the 14.13% effective self-employment rate.\n\nIn the 12% bracket that is about 26 cents on the dollar. So $2,000 of small expenses you would otherwise have forgotten — software, supplies, a professional subscription, the business share of a phone bill — is worth around $520. That is the return on keeping this file up to date, and it is why the receipt column is worth using.",
      },
      {
        heading: "The ordinary and necessary test",
        body: "The standard for deducting a business expense is that it is ordinary — common and accepted in your line of work — and necessary, meaning helpful and appropriate for it. That is a broader test than people assume and a narrower one than the internet suggests.\n\nIt does not stretch to \"write off your whole life\". A laptop you use for client work is deductible at its business share. Clothing is deductible only if it is unsuitable for everyday wear, which excludes almost everything. A meal is deductible when there is a business purpose and a business contact, at the limit the rules allow, and the person you had lunch with matters. When a claim requires an elaborate justification, that is usually the signal it does not hold.",
      },
      {
        heading: "Keep the receipt, and note that you did",
        body: "The receipt-kept column exists so that gaps are visible while you can still do something about them. A charge on a bank statement shows an amount and a vendor; it does not show what was bought or why it was for the business, and for larger items that distinction is what substantiates the claim.\n\nPhotograph receipts as they arrive and store them in one folder named by year. It takes seconds and removes the single most common reason a legitimate deduction fails: not that it was ineligible, but that nothing was kept to show it happened.",
      },
    ],
    faqs: [
      {
        question: "What expenses can a self-employed person deduct?",
        answer:
          "Anything ordinary and necessary for the business: business mileage, a home office used regularly and exclusively for work, software and subscriptions, equipment, supplies, professional insurance, accounting and legal fees, training relevant to your work, and the business-use share of phone and internet. Each reduces income tax and self-employment tax together, so a deducted dollar is worth about 26 cents in the 12% bracket.",
      },
      {
        question: "How do I calculate business use percentage?",
        answer:
          "Estimate the share of the item's use that is genuinely for the business, and record how you arrived at it at the time. For a phone, that might be the proportion of usage or of hours; for a laptop, the split between business and personal work. Enter the full amount and the percentage in the template, and the deductible amount follows. Reconstructing the figure a year later is neither accurate nor easy to defend.",
      },
      {
        question: "Do I need receipts for every business expense?",
        answer:
          "Keep them for everything you can. A bank statement shows an amount and a vendor but not what was purchased or why it was business-related, and that gap is what causes otherwise legitimate deductions to fail. Photographing receipts as they arrive and filing them by year takes seconds; the receipt column in this template exists so missing ones are visible before filing rather than after.",
      },
      {
        question: "What Schedule C categories should I use?",
        answer:
          "The ones printed on the form: advertising, car and truck expenses, commissions and fees, insurance, interest, legal and professional services, office expense, rent or lease, repairs and maintenance, supplies, taxes and licences, travel, meals, utilities, and other expenses. Using the form's own vocabulary as you record each expense means the year-end totals transfer directly rather than needing to be re-sorted.",
      },
      {
        question: "Can I deduct expenses if I made a loss?",
        answer:
          "If the activity is genuinely a business, yes — expenses are deducted against income and a resulting loss can generally offset other income, subject to the rules. If the IRS treats the activity as a hobby, you report the income but cannot deduct expenses against it, and the loss cannot offset your salary. The distinction turns on whether you run the activity with a genuine profit motive and in a businesslike way.",
      },
    ],
    sources: [IRS_SCHED_C, IRS_PUB535],
    tools: [
      { label: "Self-Employment Tax Calculator", href: "/self-employment-tax/" },
      { label: "1099 Tax Calculator", href: "/self-employment-tax/1099-tax-calculator/" },
    ],
  },
];

export const TEMPLATE_BY_SLUG: Record<string, TemplateEntry> = Object.fromEntries(
  TEMPLATES.map((t) => [t.slug, t]),
);
