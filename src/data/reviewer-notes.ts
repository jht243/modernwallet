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
};

export function getReviewerNote(pathname: string): ReviewerNoteEntry | undefined {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return REVIEWER_NOTES[normalized] ?? REVIEWER_NOTES[pathname.replace(/\/$/, "")];
}
