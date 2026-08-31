// Membership sets for the Business Financing pillar. Used to gate the lead-capture form so it
// renders ONLY on business-financing pages (calculators, roundups, comparisons, guides) and never
// on the consumer personal-finance pages that share the same route templates.

export const BUSINESS_CALC_IDS = new Set<string>([
  "merchant-cash-advance",
  "invoice-factoring",
  "business-line-of-credit",
]);

export const BUSINESS_ROUNDUP_SLUGS = new Set<string>([
  "best-merchant-cash-advance-companies",
  "best-invoice-factoring-companies",
]);

export const BUSINESS_COMPARISON_SLUGS = new Set<string>([
  "merchant-cash-advance-vs-loan",
  "factor-rate-vs-interest-rate",
  "invoice-factoring-vs-merchant-cash-advance",
  "invoice-factoring-vs-invoice-discounting",
]);

export const BUSINESS_GUIDE_SLUGS = new Set<string>([
  "small-business-financing-guide",
  "how-revenue-affects-business-loan-approval",
  "how-to-account-for-invoice-factoring",
  "how-to-get-a-business-loan-with-bad-credit",
  "business-line-of-credit-requirements",
]);
