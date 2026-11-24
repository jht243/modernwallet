export interface ReviewerNoteEntry {
  note: string;
  reviewedDate: string;
  label?: string;
}

/**
 * Verified human-written Publisher / Editorial Reviewer notes by canonical route path.
 * ZERO-FABRICATION RULE: Only real notes written or explicitly approved by Jonathan Teplitsky
 * may be entered here. Never populate with AI-generated personal quotes.
 */
export const REVIEWER_NOTES: Record<string, ReviewerNoteEntry> = {};

export function getReviewerNote(pathname: string): ReviewerNoteEntry | undefined {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return REVIEWER_NOTES[normalized] ?? REVIEWER_NOTES[pathname.replace(/\/$/, "")];
}
