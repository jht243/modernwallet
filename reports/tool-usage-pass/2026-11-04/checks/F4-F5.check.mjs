// Regression check for rows F4 and F5 (tool-usage pass 2026-11-04). The repo has no test runner, so this is a
// plain Node script. Node 22.18+ strips TypeScript types natively, so it imports the engine source directly.
// Run from the repo root: node reports/tool-usage-pass/2026-11-04/checks/F4-F5.check.mjs
import assert from "node:assert/strict";
import { register } from "node:module";

// src/lib/stock-capital-gains.ts imports "./tax-bracket" with no extension (bundler style). This hook
// retries such relative imports with ".ts" so Node can load the engine source unchanged.
register("data:text/javascript," + encodeURIComponent(`
export async function resolve(spec, ctx, next) {
  try { return await next(spec, ctx); }
  catch (e) { if (spec.startsWith(".") && !/\\.[cm]?[jt]s$/.test(spec)) return next(spec + ".ts", ctx); throw e; }
}`));
import {
  calculateSelfEmploymentTax,
  QBI_THRESHOLD_2026,
} from "../../../../src/lib/self-employment-tax.ts";

const round = (n) => Math.round(n);
const cases = [];
const check = (name, fn) => { fn(); cases.push(name); };
const se = (netProfit, filingStatus, extra = {}) =>
  calculateSelfEmploymentTax({ netProfit, filingStatus, includeIncomeTax: true, applyQbi: true, ...extra });

// ---- F4: $400 floor (Schedule SE instructions) ----
check("F4 $420 profit -> SE tax $0", () => {
  const r = se(420, "single");
  assert.equal(round(r.netEarnings * 100) / 100, 387.87);
  assert.equal(r.belowSeFloor, true);
  assert.equal(r.totalSelfEmploymentTax, 0);
  assert.equal(r.socialSecurityTax, 0);
  assert.equal(r.medicareTax, 0);
  assert.equal(r.additionalMedicareTax, 0);
  assert.equal(r.halfSeTaxDeduction, 0);
  assert.equal(r.incrementalFederalTax, 0); // income under the standard deduction, so no income tax either
});
check("F4 $433 profit still under floor, $434 over it", () => {
  assert.equal(se(433, "single").totalSelfEmploymentTax, 0);
  const r = se(434, "single");
  assert.equal(r.belowSeFloor, false);
  assert.ok(r.totalSelfEmploymentTax > 0);
});
check("F4 $420 profit on top of W-2 wages: still no SE tax, income tax only", () => {
  const r = se(420, "single", { w2Wages: 50_000 });
  assert.equal(r.totalSelfEmploymentTax, 0);
  assert.equal(r.halfSeTaxDeduction, 0);
  // 33,900 + 420 - 84 QBI = 34,236 taxable, all at 12%: 336 x 12% = 40.32
  assert.equal(r.incrementalFederalTax, 40.32);
});

// ---- F4: QBI thresholds (Rev. Proc. 2025-32 s.4.26) and pre-QBI test ----
check("F4 thresholds 201,750 single/HOH, 403,500 MFJ", () => {
  assert.equal(QBI_THRESHOLD_2026.single, 201_750);
  assert.equal(QBI_THRESHOLD_2026.hoh, 201_750);
  assert.equal(QBI_THRESHOLD_2026.mfj, 403_500);
});
check("F4 single W-2 $180,000 + profit $30,000 -> no warning", () => {
  const r = se(30_000, "single", { w2Wages: 180_000 });
  // taxable income before QBI = 210,000 - 680.72 - 16,100 = 193,219.28 < 201,750
  assert.equal(r.qbiAboveThreshold, false);
  // unchanged figures from the persona walkthrough
  assert.equal(round(r.socialSecurityTax), 558);
  assert.equal(round(r.medicareTax), 803);
  assert.equal(round(r.additionalMedicareTax), 69);
});
check("F4 warning shows once pre-QBI taxable income passes the threshold", () => {
  // single, profit 30,000, W-2 190,000: pre-QBI taxable = 220,000 - half SE - 16,100 > 201,750
  assert.equal(se(30_000, "single", { w2Wages: 190_000 }).qbiAboveThreshold, true);
  // boundary: pre-QBI taxable just under / just over 201,750 with no SE income
  assert.equal(se(0, "single", { otherIncome: 201_750 + 16_100 }).qbiAboveThreshold, false);
  assert.equal(se(0, "single", { otherIncome: 201_751 + 16_100 }).qbiAboveThreshold, true);
  assert.equal(se(0, "mfj", { otherIncome: 403_500 + 32_200 }).qbiAboveThreshold, false);
  assert.equal(se(0, "mfj", { otherIncome: 403_501 + 32_200 }).qbiAboveThreshold, true);
});

// ---- F4: persona figures that must not change ----
check("F4 persona $62,000 single unchanged ($12,498, 20.2%, quarterly $3,125)", () => {
  const r = se(62_000, "single");
  assert.equal(round(r.totalSelfEmploymentTax), 8_760);
  assert.equal(round(r.incrementalFederalTax), 12_498);
  assert.equal(Math.round(r.setAsideRate * 1000) / 10, 20.2);
  assert.equal(round(r.quarterlyPayment), 3_125);
});
check("F4 other walkthrough cases unchanged", () => {
  assert.equal(round(se(45_000, "single").incrementalFederalTax), 8_580);
  assert.equal(round(se(62_000, "mfj").incrementalFederalTax), 10_794);
  assert.equal(round(se(62_000, "single", { applyQbi: false }).incrementalFederalTax), 13_495);
  assert.equal(round(se(48_000, "hoh").incrementalFederalTax), 8_419);
});

// ---- F5: component-side figures, reproduced with the same formulas the component uses ----
const { computeStockGains, ordinaryTax } = await import("../../../../src/lib/stock-capital-gains.ts");
{
  check("F5 MFJ TI 80,000 + LT gain 30,000: room 18,900 before, uses 18,900, 0 left", () => {
    const r = computeStockGains({ status: "mfj", taxableIncome: 80_000, basis: 12_000, proceeds: 42_000, longTerm: true });
    assert.equal(r.zeroRoom, 18_900);
    assert.equal(r.at0, 18_900);
    assert.equal(Math.max(0, r.zeroRoom - r.at0), 0);
    assert.equal(round(r.totalTax), 1_665);
  });
  check("F5 single TI 30,000 + LT gain 25,000: uses 19,450 at 0%, 0 left", () => {
    const r = computeStockGains({ status: "single", taxableIncome: 30_000, basis: 0, proceeds: 25_000, longTerm: true });
    assert.equal(r.at0, 19_450);
    assert.equal(Math.max(0, r.zeroRoom - r.at0), 0);
    assert.equal(round(r.totalTax), 833);
  });
  check("F5 single TI 20,000 + LT gain 10,000: uses 10,000 at 0%, 19,450 left", () => {
    const r = computeStockGains({ status: "single", taxableIncome: 20_000, basis: 0, proceeds: 10_000, longTerm: true });
    assert.equal(r.at0, 10_000);
    assert.equal(Math.max(0, r.zeroRoom - r.at0), 19_450);
  });
  const lossStats = (status, taxableIncome, basis, proceeds) => {
    const r = computeStockGains({ status, taxableIncome, basis, proceeds, longTerm: true });
    const limit = status === "mfs" ? 1500 : 3000;
    const loss = r.isLoss ? -r.gain : 0;
    const deductible = Math.min(loss, limit);
    const saving = ordinaryTax(status, taxableIncome) - ordinaryTax(status, Math.max(0, taxableIncome - deductible));
    return { r, deductible, carried: loss - deductible, saving };
  };
  check("F5 single TI 72,000, loss 23,500: 3,000 deductible, ~$660 saved, 20,500 carried", () => {
    const { r, deductible, carried, saving } = lossStats("single", 72_000, 41_500, 18_000);
    assert.equal(r.totalTax, 0);
    assert.equal(deductible, 3_000);
    assert.equal(round(saving), 660);
    assert.equal(carried, 20_500);
  });
  check("F5 MFS loss limit 1,500", () => {
    const { deductible, carried } = lossStats("mfs", 72_000, 41_500, 18_000);
    assert.equal(deductible, 1_500);
    assert.equal(carried, 22_000);
  });
  check("F5 small loss under the limit: all deductible, nothing carried", () => {
    const { deductible, carried } = lossStats("single", 72_000, 10_000, 8_800);
    assert.equal(deductible, 1_200);
    assert.equal(carried, 0);
  });
  check("F5 tax math unchanged (persona $3,525 LT, $5,170 ST, NIIT $1,900)", () => {
    assert.equal(round(computeStockGains({ status: "single", taxableIncome: 72_000, basis: 18_000, proceeds: 41_500, longTerm: true }).totalTax), 3_525);
    assert.equal(round(computeStockGains({ status: "single", taxableIncome: 72_000, basis: 18_000, proceeds: 41_500, longTerm: false }).totalTax), 5_170);
    assert.equal(round(computeStockGains({ status: "single", taxableIncome: 220_000, basis: 0, proceeds: 50_000, longTerm: true }).niit), 1_900);
  });
}

for (const c of cases) console.log("ok", c);
console.log(`${cases.length} checks passed`);
