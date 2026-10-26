// Executes the real engine (src/lib/charitable-deduction.ts) on named scenarios; writes raw outputs.
import { computeCharitable, computeYear } from "../../../../src/lib/charitable-deduction.ts";
import { writeFileSync } from "node:fs";
const base = { status: "mfj", agi: 150000, cashGifts: 12000, otherItemized: 20000, marginalRatePct: 22 } as const;
const cases: Record<string, any> = {
  guide_example_mfj_150k_12k: base,
  small_giver_nonitemizer_mfj: { ...base, cashGifts: 1500, otherItemized: 0 },
  single_itemizer_big_mortgage: { status: "single", agi: 90000, cashGifts: 6000, otherItemized: 18000, marginalRatePct: 24 },
  below_floor_gift: { ...base, cashGifts: 500, otherItemized: 0 },
  at_60pct_cap: { status: "single", agi: 20000, cashGifts: 15000, otherItemized: 20000, marginalRatePct: 12 },
  zero_gifts: { ...base, cashGifts: 0 },
  zero_agi: { ...base, agi: 0 },
  mfs_small: { status: "mfs", agi: 60000, cashGifts: 2000, otherItemized: 0, marginalRatePct: 22 },
};
const out: any = {};
for (const [k, v] of Object.entries(cases)) out[k] = { input: v, result: computeCharitable(v) };
writeFileSync(new URL("./calc-output.json", import.meta.url), JSON.stringify(out, null, 2));
// Assertions
const a = out.guide_example_mfj_150k_12k.result;
const checks: [string, boolean][] = [
  ["guide example even year = 34,200", computeYear(base, 12000).bestTotal === 34200 && a.standardTotal === 34200],
  ["guide example itemized year-one with 24k gift = 43,250", computeYear(base, 24000).itemizedTotal === 43250],
  ["guide example bunching gain = 7,050", a.bunchingGain === 7050],
  ["floor = 750", a.floorAmount === 750],
  ["small giver takes non-itemizer 1,500 gift -> 1,500 added (cap 2,000)", out.small_giver_nonitemizer_mfj.result.nonItemizerDeduction === 1500],
  ["gift below floor itemizes zero charity", out.below_floor_gift.result.charityIfItemizing === 0],
  ["60% cap binds", out.at_60pct_cap.result.charityIfItemizing === 12000 - 100],
  ["zero gifts add nothing", out.zero_gifts.result.addedByGiving === 0 && out.zero_gifts.result.taxSaved === 0],
  ["zero AGI no NaN", Number.isFinite(out.zero_agi.result.bunchedTwoYear)],
];
let bad = 0; for (const [n, ok] of checks) { console.log(ok ? "PASS" : "FAIL", n); if (!ok) bad++; }
console.log(JSON.stringify(a, null, 1));
process.exit(bad ? 1 : 0);
