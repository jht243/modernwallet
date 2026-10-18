import type { Guide } from "./guides";
import { GLOBAL_GATE_REVIEW } from "./client-reviews/global-gate-tax-relief-review";
import { DANIELSON_REVIEW } from "./client-reviews/danielson-bookkeeping-review";
import { HEATHERS_REVIEW } from "./client-reviews/heathers-tax-service-review";
import { ELITE_PRO_TAX_REVIEW } from "./client-reviews/elite-pro-tax-review";
import { HAIGLER_REVIEW } from "./client-reviews/haigler-cpa-group-review";
import { MURPHY_REVIEW } from "./client-reviews/murphy-accounting-review";

// Company deep dives for tax, bookkeeping and accounting firms (paid placements, 2026-10-18).
// Each page is noAds; links to the firm render rel="sponsored nofollow" via data/paid-placements.json.

export const CLIENT_REVIEW_GUIDES: Guide[] = [
  GLOBAL_GATE_REVIEW,
  DANIELSON_REVIEW,
  HEATHERS_REVIEW,
  ELITE_PRO_TAX_REVIEW,
  HAIGLER_REVIEW,
  MURPHY_REVIEW,
];
