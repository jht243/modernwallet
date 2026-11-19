import type { ComparisonEntry } from "./comparisons";
import { AMEX_COMPARISONS_WAVE1 } from "./comparisons-amex-wave1";
import { AMEX_COMPARISONS_WAVE2 } from "./comparisons-amex-wave2";
import { AMEX_COMPARISONS_WAVE3 } from "./comparisons-amex-wave3";

export const AMEX_COMPARISONS: ComparisonEntry[] = [
  ...AMEX_COMPARISONS_WAVE1,
  ...AMEX_COMPARISONS_WAVE2,
  ...AMEX_COMPARISONS_WAVE3,
];
