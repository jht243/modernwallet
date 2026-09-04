import type { SpokeEntry } from "./types";

// Personal-loan spokes. First entry (2026-08-28, competitor-monitor pass): extra-payment/payoff
// calculator, a per-spoke island override — mirrors business-loan-payoff's dual-mode UX (extra
// payment vs. target payoff date) with personal-loan-scaled defaults and term cap.
export const PERSONAL_LOAN_SPOKES: SpokeEntry[] = [
  {
    calculator: "personal-loan",
    slug: "extra-payment-calculator",
    title: "Personal Loan Extra Payment Calculator: See Your Savings",
    metaDescription:
      "Free personal loan extra payment calculator: see how much interest you save and how many months you cut by adding extra to your monthly payment.",
    targetKeyword: "personal loan extra payment calculator",
    h1: "Personal Loan Extra Payment Calculator",
    islandId: "personal-loan-payoff",
    introText:
      "A personal loan extra payment calculator shows how much faster you clear the loan, and how much interest you skip, once you add even a small amount to your normal monthly payment. Enter your remaining balance, rate, and term above, add an extra monthly amount or switch to picking a payoff date instead, and the calculator shows the new timeline next to your original one. Extra payments work because a personal loan charges interest only on what you still owe, so every extra dollar toward principal now stops earning the lender interest for every month that follows.",
    howItWorks:
      "The calculator above takes your remaining balance, interest rate, and remaining term to find your scheduled monthly payment, the same fully amortizing math your lender uses. From there it runs two payoff schedules side by side: one at your normal payment, and one with your extra amount added straight to principal every month, then shows the gap between them in dollars and months.\n\nSwitch to \"I want a payoff date\" mode, and the calculator works backward instead. Pick how many months you want left on the loan, and it solves for the exact extra payment that gets you there, using the same amortization formula in reverse. Either direction, the underlying math never changes. Every dollar that goes to principal early stops accruing interest for every remaining month of the loan, which is why even a modest extra payment can meaningfully shorten a multi-year loan.",
    commonMistakes: [
      "Assuming every lender applies an extra payment to principal automatically. Some apply it toward next month's payment instead unless you specifically mark it for principal, so confirm your lender's process before sending extra money.",
      "Not confirming a prepayment penalty first. Most personal loan lenders don't charge one, but the [CFPB](https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/) confirms a few loan contracts still include one, so check your agreement before committing to a payoff plan.",
      "Comparing only the interest saved, without weighing it against other financial priorities. An extra loan payment competes with an emergency fund, a 401(k) match, or a higher-interest credit card balance, so pay down the highest-rate debt first if you're carrying more than one.",
      "Ignoring the loan's origination fee when judging the real cost of the loan itself. The fee already came out of your original disbursement, not your remaining balance, so it doesn't change the payoff math above, but it does change what the loan actually cost you; our [personal loan calculator](/personal-loan/) accounts for that fee separately.",
      "Picking a token extra amount instead of running the actual numbers. Twenty extra dollars a month barely moves the timeline on a large balance, while the same amount makes a real dent on a small one, so run your specific balance and rate instead of guessing at a round number.",
    ],
    workedExample:
      "Say you have $15,000 left on a personal loan at 12.5% APR with 48 months remaining. Your scheduled payment is about $398.70 a month, and paying only that amount takes about 49 months and costs roughly $4,138 in interest before the loan is gone, the extra month coming from how a fixed payment amortizes a balance that started with a small rounding gap. Add $100 a month in extra payments, and the same loan clears in about 37 months instead, saving roughly $1,048 in interest over the life of the loan.\n\nSwitch to payoff-date mode and ask for that same loan to be gone in 30 months instead, and the calculator solves for the extra payment directly: about $186 a month on top of the scheduled payment, cutting total interest to roughly $2,543, rather than making you guess and check different extra amounts by hand.",
    faqs: [
      { question: "How much do extra payments actually save on a personal loan?", answer: "It depends on your balance, rate, and how much extra you add, but the effect compounds fast. On a $15,000 loan at 12.5% APR with 48 months left, a $100 monthly extra payment saves roughly $1,048 in interest and clears the loan about a year sooner. Enter your own numbers in the calculator above to see your exact savings." },
      { question: "Do personal loans have prepayment penalties?", answer: "Most don't, but some still do. The CFPB confirms a prepayment penalty is legal on some loan contracts, so check your loan agreement or ask your lender directly before committing to an extra-payment plan, rather than assuming your loan works like most others." },
      { question: "Does my lender automatically apply extra money to principal?", answer: "Not always. Some lenders apply an extra payment toward your next month's bill instead of your principal balance unless you specifically designate it for principal, often through an option on the payment screen or a note with a mailed payment. Confirm the process with your lender before sending extra money, since a payment applied the wrong way won't shorten your payoff the way you expect." },
      { question: "Should I pay extra on a personal loan or invest the money instead?", answer: "Compare your loan's interest rate to what you'd realistically earn investing instead. A personal loan charging 12% or more is a rate few investments reliably beat after taxes, so extra payments usually win at that range. At a lower personal loan rate, say under 7%, investing a long-term retirement contribution can be the better math, especially if it captures an employer 401(k) match first." },
      { question: "How is this different from the regular personal loan calculator?", answer: "This calculator solves a payoff question for a loan you already have: how much an extra payment saves, or what extra payment hits a target payoff date. Our [personal loan calculator](/personal-loan/) answers a different question, what a new loan actually costs once its origination fee is factored into the real, effective APR. Use this one once you're already repaying a loan and want to speed that up." },
    ],
    sources: [
      { label: "CFPB — What Is a Prepayment Penalty?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/" },
      { label: "CFPB — What Is the Difference Between a Loan Interest Rate and the APR?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/" },
    ],
    toolHeading: "See what an extra payment saves",
    toolSubheading: "Enter your remaining balance, rate, and term, then add an extra amount or pick a payoff date.",
    preset: { loanBalance: 15000, interestRatePct: 12.5, remainingTermMonths: 48, extraMonthlyPayment: 100, targetPayoffMonths: 24 },
    relatedSlugs: [],
  },
];
