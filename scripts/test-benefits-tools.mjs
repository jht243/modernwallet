import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const temp = await mkdtemp(join(tmpdir(), 'mw-benefits-'));
let checks = 0;
const eq = (actual, expected) => {assert.deepEqual(actual, expected); checks++;};
const close = (actual, expected) => {assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`); checks++;};
try {
  const built = await build({entryPoints: ['src/lib/benefits-math.ts'], bundle: true, platform: 'node', format: 'cjs', write: false});
  const file = join(temp, 'math.cjs'); await writeFile(file, built.outputFiles[0].contents);
  const m = createRequire(import.meta.url)(file);
  const s = m.SNAP_DEFAULTS, a = {...m.ACA_DEFAULTS, eligibility: 'confirmed'};
  const snap = m.snapBenefits(s);
  eq(snap.standardDeduction, 229); close(snap.adjusted, 1371); close(snap.shelterDeduction, 514.5); close(snap.net, 856.5); eq(snap.contribution, 257); eq(snap.conditionalAmount, 766);
  eq(m.snapBenefits({...s, rent: 1400}).conditionalAmount, 826);
  eq(m.snapBenefits({...s, rent: 10000}).shelterDeduction, 769);
  eq(m.snapBenefits({...s, rent: 10000, elderlyDisabled: true}).net, 0);
  const medical = m.snapBenefits({...s, medical: 135, elderlyDisabled: true}); eq(medical.medicalDeduction, 100);
  eq(m.snapBenefits({...s, medical: 35, elderlyDisabled: true}).medicalDeduction, 0);
  eq(m.snapBenefits({...s, medical: 135}).medicalDeduction, 0);
  close(m.snapBenefits({...s, dependentCare: 100, childSupport: 50}).adjusted, 1221);
  close(m.snapBenefits({...s, utilities: 200}).net, 656.5);
  eq(m.snapBenefits({...s, earned: 0, dependentCare: 999}).net, 0);
  for (let household = 1; household <= 8; household++) {
    const r = m.snapBenefits({...s, household, earned: 0});
    eq(r.maximum, [306, 562, 808, 1023, 1217, 1463, 1616, 1841][household - 1]);
    eq(r.conditionalAmount, r.maximum);
  }
  // Raw contribution is exactly $300: upward rounding must not become $301.
  eq(m.snapBenefits({...s, household: 1, earned: 0, unearned: 1217, rent: 0}).contribution, 300);
  const minimum = m.snapBenefits({...s, household: 1, earned: 0, unearned: 1400, rent: 0});
  eq(minimum.formulaAmount, 0); eq(minimum.conditionalAmount, 25); eq(minimum.minimumApplied, true);
  const highIncome = m.snapBenefits({...s, household: 1, earned: 10000, rent: 0});
  eq(highIncome.formulaAmount, 0); eq(highIncome.conditionalAmount, null); eq(highIncome.minimumApplied, false);
  eq(m.snapBenefits({...s, household: 1, earned: 10000, rent: 0, eligibility: 'confirmed'}).conditionalAmount, 25);
  eq(m.snapBenefits({...s, eligibility: 'excluded'}).conditionalAmount, null);
  eq(m.snapBenefits({...s, household: 3, earned: 10000, eligibility: 'confirmed'}).conditionalAmount, 0);
  const aca = m.acaSubsidy(a);
  close(aca.fplPercent, 231.0536044362292); close(aca.percentage, 7.947615526802218); close(aca.contribution, 331.1506469500924); close(aca.credit, 268.8493530499076); close(aca.netPremium, 281.1506469500924);
  for (const [p, expected] of [[100,2.15],[132.999,2.15],[133,3.23],[150,4.30],[175,5.54],[200,6.78],[225,7.72],[250,8.66],[275,9.44],[300,10.22],[400,10.22]]) close(m.acaApplicablePercentage(p), expected);
  for (const p of [99.999,400.001,NaN,Infinity,-1]) eq(m.acaApplicablePercentage(p), null);
  const boundary = m.acaSubsidy({...a, income: 86560, benchmark: 1000, enrollment: 1000});
  close(boundary.credit, 262.7973333333333);
  eq(m.acaSubsidy({...a, income: 86561, benchmark: 1000, enrollment: 1000}).credit, null);
  eq(m.acaSubsidy({...a, income: 21640}).inRange, true);
  eq(m.acaSubsidy({...a, income: 21639.99}).credit, null);
  eq(m.acaSubsidy({...a, income: 30000, benchmark: 900, enrollment: 100}).credit, 100);
  eq(m.acaSubsidy({...a, benchmark: 0}).credit, 0);
  eq(m.acaSubsidy({...a, enrollment: 0}).credit, 0);
  eq(m.acaSubsidy({...a, benchmark: 100}).credit, 0);
  eq(m.acaSubsidy(m.ACA_DEFAULTS).credit, null);
  eq(m.acaSubsidy({...a, eligibility: 'excluded'}).credit, null);
  for (let household = 1; household <= 8; household++) {
    const poverty = [15960,21640,27320,33000,38680,44360,50040,55720][household - 1];
    eq(m.acaSubsidy({...a, household, income: poverty * 4}).inRange, true);
    eq(m.acaSubsidy({...a, household, income: poverty * 4 + .01}).credit, null);
    // Exercise the real annual-income path. A direct percentage-function call
    // cannot catch an exact 133% income dividing to 132.99999999999997.
    const thresholdCents = poverty * 133;
    const below = m.acaSubsidy({...a, household, income: (thresholdCents - 1) / 100});
    const exact = m.acaSubsidy({...a, household, income: thresholdCents / 100});
    const above = m.acaSubsidy({...a, household, income: (thresholdCents + 1) / 100});
    eq(below.percentage, 2.15);
    eq(exact.percentage, 3.23);
    close(above.percentage, 3.23 + 1.07 / (poverty * 17));
    close(exact.contribution, thresholdCents / 100 * .0323 / 12);
    for (const [boundaryPercent, rate] of [[100,2.15],[150,4.30],[200,6.78],[250,8.66],[300,10.22],[400,10.22]]) {
      const cents = poverty * boundaryPercent;
      const atBoundary = m.acaSubsidy({...a, household, income: cents / 100});
      close(atBoundary.percentage, rate);
      const before = m.acaSubsidy({...a, household, income: (cents - 1) / 100});
      const after = m.acaSubsidy({...a, household, income: (cents + 1) / 100});
      if (boundaryPercent === 100) eq(before.credit, null);
      else {assert.ok(before.percentage <= rate); checks++;}
      if (boundaryPercent === 400) eq(after.credit, null);
      else {assert.ok(after.percentage >= rate); checks++;}
    }
  }
  for (const fn of ['snapBenefits', 'acaSubsidy']) {
    const defaults = fn === 'snapBenefits' ? s : a;
    for (const household of [0, 9, 1.5, NaN, Infinity]) eq(typeof m[fn]({...defaults, household}).error, 'string');
    eq(typeof m[fn]({...defaults, region: 'other'}).error, 'string');
    eq(typeof m[fn]({...defaults, eligibility: 'bad'}).error, 'string');
    const fields = fn === 'snapBenefits' ? ['earned','unearned','dependentCare','childSupport','medical','rent','utilities'] : ['income','benchmark','enrollment'];
    for (const key of fields) for (const invalid of [NaN, Infinity, -1, 100000001, .001, undefined, '']) eq(typeof m[fn]({...defaults, [key]: invalid}).error, 'string');
  }
  const result = {status: 'PASS', checks, scope: 'Deterministic calculator-code validation. Not product testing or an independent editorial audit.', cases: {snapDefault: snap, snapHighIncome: highIncome, acaConfirmed: aca, aca400Percent: boundary}};
  if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
} finally {await rm(temp, {recursive: true, force: true});}
