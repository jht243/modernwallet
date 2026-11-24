export interface ReviewerNoteEntry {
  note: string;
  reviewedDate: string;
  label?: string;
}

export interface ApprovedTopicInsight extends ReviewerNoteEntry {
  id: string;
  matchGroups: string[][];
}

/**
 * Verified human-approved Publisher / Editorial Reviewer notes by canonical route path.
 * ZERO-FABRICATION RULE: Only notes explicitly written or approved by Jonathan Teplitsky
 * may appear here. Never populate with AI-invented personal quotes.
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

export const APPROVED_TOPIC_INSIGHTS: ApprovedTopicInsight[] = [
  {
    id: "self-employed-retirement",
    ...REVIEWER_NOTES["/roundup/best-retirement-accounts-for-self-employed/"],
    matchGroups: [["solo-401k"], ["sep-ira"], ["self-employed", "retirement"]],
  },
  {
    id: "529-plan-flexibility",
    ...REVIEWER_NOTES["/guides/529-leftover-money-options/"],
    matchGroups: [["529-"], ["college-savings-529"]],
  },
];

export function getReviewerNote(pathname: string): ReviewerNoteEntry | undefined {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const exact = REVIEWER_NOTES[normalized] ?? REVIEWER_NOTES[pathname.replace(/\/$/, "")];
  if (exact) return exact;
  const low = normalized.toLowerCase();
  if (low === "/" || low.startsWith("/about/") || low.startsWith("/editorial-policy/") || low.startsWith("/methodology/") || low.startsWith("/contact/")) {
    return undefined;
  }
  for (const item of APPROVED_TOPIC_INSIGHTS) {
    if (item.matchGroups.some((group) => group.every((tok) => low.includes(tok)))) {
      return { note: item.note, reviewedDate: item.reviewedDate, label: item.label };
    }
  }
  return undefined;
}
