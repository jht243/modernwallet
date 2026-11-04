// Regression check for row F1 (tool-usage pass 2026-11-04). The repo has no test runner, so this is a plain
// Node script. Node 22.18+ strips TypeScript types natively, so it imports the engine source directly.
// Run from the repo root: node reports/tool-usage-pass/2026-11-04/checks/florida-amendment-3.check.mjs
import assert from "node:assert/strict";
import { computeFlAmendment3, currentExemptionFor } from "../../../../src/lib/florida-amendment-3.ts";

const round2 = (n) => Math.round(n * 100) / 100;
const run = (assessedValue, mills, residentBy2027) => {
  const r = computeFlAmendment3({ assessedValue, mills, residentBy2027 });
  return Object.fromEntries(Object.entries(r).map(([k, v]) => [k, typeof v === "number" ? round2(v) : v]));
};
const cases = [];
const check = (name, fn) => { fn(); cases.push(name); };

// Banded exemption: 25,000 + clamp(assessed - 50,000, 0, 26,411).
check("exemption bands", () => {
  assert.equal(currentExemptionFor(20_000), 25_000);
  assert.equal(currentExemptionFor(45_000), 25_000);
  assert.equal(currentExemptionFor(60_000), 35_000);
  assert.equal(currentExemptionFor(76_411), 51_411);
  assert.equal(currentExemptionFor(285_000), 51_411);
});
// $60,000 at 11.2 mills: taxable 25,000 -> $280.00 today, $0 in 2027/2028 (was $96.20 before the fix).
check("$60,000 at 11.2 mills", () => {
  const r = run(60_000, 11.2);
  assert.equal(r.billNow, 280);
  assert.equal(r.bill2027, 0);
  assert.equal(r.savings2027, 280);
  assert.equal(r.savings2028, 280);
});
// $45,000 at 11.2 mills: taxable 20,000 -> $224.00 today (was $0 before the fix).
check("$45,000 at 11.2 mills", () => {
  const r = run(45_000, 11.2);
  assert.equal(r.billNow, 224);
  assert.equal(r.savings2028, 224);
});
// At or above $76,411 nothing changes versus the pre-fix engine output (captured 2026-11-04 before the edit).
check("$285,000 at 11.2 mills unchanged", () => {
  assert.deepEqual(run(285_000, 11.2), {
    extraExempt2027: 98_589, extraExempt2028: 198_589, savings2027: 1104.2, savings2028: 2224.2,
    billNow: 2616.2, bill2027: 1512, bill2028: 392, capped: false,
  });
});
check("$76,411 at 11.2 mills unchanged", () => {
  const r = run(76_411, 11.2);
  assert.equal(r.billNow, 280);
  assert.equal(r.savings2028, 280);
});
check("$76,411 at 10 mills = $250", () => assert.equal(run(76_411, 10).billNow, 250));
// Default (undefined) and explicit Yes behave the same.
check("resident default = Yes", () => assert.deepEqual(run(285_000, 11.2, true), run(285_000, 11.2)));
// Newcomer (No): 2027/2028 reuse today's exemption, so no savings yet; today's bill unchanged.
check("newcomer keeps current exemption", () => {
  const r = run(285_000, 11.2, false);
  assert.equal(r.billNow, 2616.2);
  assert.equal(r.bill2027, 2616.2);
  assert.equal(r.bill2028, 2616.2);
  assert.equal(r.savings2027, 0);
  assert.equal(r.savings2028, 0);
  assert.equal(r.extraExempt2028, 0);
});
check("zero millage returns $0 bills, not null", () => {
  const r = run(285_000, 0);
  assert.equal(r.billNow, 0);
  assert.equal(r.savings2028, 0);
});

console.log(`PASS ${cases.length} checks: ${cases.join("; ")}`);
