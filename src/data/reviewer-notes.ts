export interface ReviewerNoteEntry {
  note: string;
  reviewedDate: string;
  label?: string;
}

/**
 * Page-specific Publisher / Editorial Reviewer notes by canonical route path.
 * Each entry is generated specifically for its own route grounded in Jonathan Teplitsky's
 * verified career dossier and voice profile (.claude/reviewer-voice-profile.json).
 */
export const REVIEWER_NOTES: Record<string, ReviewerNoteEntry> = {
  "/roundup/best-retirement-accounts-for-self-employed/": {
    label: "Publisher's Take",
    reviewedDate: "November 24, 2026",
    note: "Once your self-employed profit grows past side-hustle territory, picking between a Solo 401(k) and a SEP IRA can swing your annual tax-advantaged contribution room by tens of thousands of dollars. Run both numbers against your actual net business income before year-end deadlines lock you out.",
  },
  "/guides/529-leftover-money-options/": {
    label: "Publisher's Take",
    reviewedDate: "November 24, 2026",
    note: "Parents hesitate to fund 529 plans because they worry about locking money up if their kid skips college or gets a scholarship. With the newer Roth IRA rollover rules and beneficiary-transfer options, unused balances have far more flexibility than most families realize, so check the holding-period rules before paying a penalty.",
  },
  "/debt-payoff-calculator/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "Mathematical modeling shows the avalanche strategy eliminates debt with the lowest overall interest cost, yet the behavioral momentum of early snowball wins cannot be discounted for individuals seeking immediate milestones. Reviewing the spread between your highest and lowest borrowing rates clarifies whether the interest savings justify delaying that first account closure.",
  },
  "/guides/compound-interest-formula-excel-google-sheets/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "Spreadsheet models only deliver dependable projections when input periods strictly match cash flow timing. Confirming your periodic rates against documented formula baselines prevents projection errors in multi-year wealth plans.",
  },
  "/guides/property-tax-by-state-mortgage-payment/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "State-level effective tax rates offer a helpful baseline, but regional millage variances and assessment formulas ultimately dictate your closing escrow requirements. When sizing residential debt, always verify your specific county tax rate to avoid sudden shifts in debt-to-income underwriting.",
  },
  "/sep-ira-solo-401k-contribution-calculator/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "A solo 401(k) usually leaves room for far more than a SEP IRA at the same profit, but only while you have no employees and no other job plan using up the deferral limit. Run your own profit through both columns first, then check the plan setup deadline before the year closes.",
  },
  "/social-security-withholding-calculator/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "Form W-4V offers four fixed rates, so the practical question is which one lands nearest your estimated tax without falling short. If none fits, estimated payments on your other income are the cleaner fix than a rate that over-withholds all year.",
  },
  "/capital-loss-carryover-calculator/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "A big realized loss stays on your books until it is used, and with no gains the yearly cap against other income can stretch that over many years. Check last year's carryover worksheet before you enter figures, and treat a low-income year as a chance to realize gains.",
  },

};

export function getReviewerNote(pathname: string): ReviewerNoteEntry | undefined {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return REVIEWER_NOTES[normalized] ?? REVIEWER_NOTES[pathname.replace(/\/$/, "")];
}
