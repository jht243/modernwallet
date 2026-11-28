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
  "/guides/medicaid-work-requirements-2027-hold-harmless/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "Based on our work optimizing operations across over 7 small medical practices, Medicaid eligibility changes almost always show up as front-desk surprises and billing delays long before patients expect a coverage gap. Treat the first half of 2027 as a preparation window by confirming state hold-harmless rules early, gathering exemption or 80-hour records ahead of renewal, and running coverage checks days before any clinic visit.",
  },
  "/compare/dividend-stocks-vs-sp500/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "Based on our work with over 50 small business founders, doctors, and law firm owners, the real divide between dividend stocks and an S&P 500 index fund comes down to tax bracket and owner bandwidth rather than headline yield. Busy owners in peak earning years usually get more value from low-maintenance index compounding, while owners preparing for an exit or needing quarterly cash flow tend to look harder at dividend payers once they can manage single-company risk.",
  },
  "/guides/conforming-loan-limit-2027/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "Borrowers near the borrowing boundary should calculate their loan balance rather than relying on listing prices, because each additional dollar of cash equity lowers the debt dollar for dollar. The $22,650 baseline expansion provides meaningful flexibility for purchases in early 2027, provided your lender confirms that your mortgage qualifies under the new annual acquisition schedule.",
  },
  "/guides/hud-mixed-status-housing-rule/": {
    label: "Publisher's Take",
    reviewedDate: "November 25, 2026",
    note: "HUD's shift from permanent proration to a temporary 90-day verification window directly threatens household stability across public housing and voucher programs. Families must request written documentation from housing authorities immediately while monitoring whether the multi-state federal lawsuit yields an injunction before mid-December.",
  },
  "/alternatives/upstart/": {
    label: "Publisher's Take",
    reviewedDate: "November 27, 2026",
    note: "The trap after the first month is that Upstart shows its fee only after a rate check, so a borrower who budgeted for the full loan amount can receive less cash than expected. Anyone who needs the exact proceeds fixed in advance, or needs a loan under $1,000, should walk away from this page and read each lender's disclosure first.",
  },
  "/alternatives/square/": {
    label: "Publisher's Take",
    reviewedDate: "November 28, 2026",
    note: "Switching card systems after month one means re-keying items, tax settings and saved customers, which costs real hours that a few cents per sale rarely repays. If your average ticket is above $100, Square's free plan already costs less per sale than Stripe Terminal, so staying put is the cheaper move.",
  },
  "/alternatives/expensify/": {
    label: "Publisher's Take",
    reviewedDate: "November 28, 2026",
    note: "Teams under five people tend to pay for empty seats whenever a vendor sets a five-seat minimum, and that cost shows up on every invoice. Ramp's Plus tier adds a platform fee that isn't posted publicly, so its full total can only be known after a quote.",
  },
  "/alternatives/stripe/": {
    label: "Publisher's Take",
    reviewedDate: "November 28, 2026",
    note: "After month one, the fee that stings is usually the first $15 dispute or the first batch of international cards at an extra 1.5%. If a large share of your buyers are overseas, price those lines before moving, and skip the switch if a $25 monthly gateway fee would outweigh the rate you save.",
  },

};

export function getReviewerNote(pathname: string): ReviewerNoteEntry | undefined {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const direct = REVIEWER_NOTES[normalized] ?? REVIEWER_NOTES[pathname.replace(/\/$/, "")];
  if (direct) return direct;
  const segs = normalized.split("/").filter(Boolean);
  if (segs.length >= 2) {
    const leaf = `/${segs[segs.length - 1]}/`;
    return REVIEWER_NOTES[leaf] ?? REVIEWER_NOTES[leaf.slice(0, -1)];
  }
  return undefined;
}
