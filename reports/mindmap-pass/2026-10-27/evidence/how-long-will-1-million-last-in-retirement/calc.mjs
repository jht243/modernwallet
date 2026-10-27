// Reproducible calculation for the $1M / $2M "how long will it last" guides.
// Run: node --experimental-strip-types reports/mindmap-pass/2026-10-27/evidence/how-long-will-1-million-last-in-retirement/calc.mjs
// Uses the site's real engine (src/lib/investment.ts effectiveMonthlyRate + the same monthly loop as withdrawalSchedule),
// constant real (inflation-adjusted) dollars: the "return" is a REAL annual return and withdrawals are flat in today's dollars.
import { effectiveMonthlyRate, maxSustainableWithdrawal } from "../../../../../src/lib/investment.ts";

function monthsToZero(balance, annualRealPct, monthlyW, capMonths = 12 * 100) {
  const i = effectiveMonthlyRate(annualRealPct, 12);
  let b = balance;
  for (let m = 1; m <= capMonths; m++) {
    b = b * (1 + i) - monthlyW;
    if (b <= 0) return m;
  }
  return null; // lasts beyond cap (effectively never depletes)
}
// closed-form cross-check: n = -ln(1 - P*i/W) / ln(1+i)  (i monthly), i=0 -> P/W
function closedForm(P, annualRealPct, W) {
  const i = effectiveMonthlyRate(annualRealPct, 12);
  if (i === 0) return P / W;
  const x = 1 - (P * i) / W;
  if (x <= 0) return null;
  return -Math.log(x) / Math.log(1 + i);
}
const out = { generated: "2026-10-27", convention: "flat monthly withdrawal in today's dollars; return is REAL annual return, compounded monthly (annual/12), withdrawal at end of each month", scenarios: [] };
for (const P of [1_000_000, 2_000_000]) {
  const withdrawals = P === 1_000_000 ? [3000, 3333.33, 4000, 5000, 6000, 8000] : [6000, 6666.67, 8000, 10000, 12000, 16000];
  for (const W of withdrawals) {
    for (const r of [0, 2, 4, 5]) {
      const m = monthsToZero(P, r, W);
      const cf = closedForm(P, r, W);
      out.scenarios.push({ balance: P, monthly: W, annualRealPct: r, months: m, years: m ? +(m / 12).toFixed(1) : null, closedFormMonths: cf ? +cf.toFixed(1) : null, perpetual: m === null });
    }
  }
}
// monthly spending that exactly exhausts the balance over fixed horizons (engine function)
out.exhaustAt = [];
for (const P of [1_000_000, 2_000_000]) for (const r of [0, 2, 4, 5]) for (const y of [20, 25, 30, 35]) out.exhaustAt.push({ balance: P, annualRealPct: r, years: y, monthly: maxSustainableWithdrawal(P, r, y, 12) });
// perpetual threshold: interest-only monthly income at real return r (annual rate/12 on balance)
out.interestOnly = [];
for (const P of [1_000_000, 2_000_000]) for (const r of [2, 3, 4, 5]) out.interestOnly.push({ balance: P, annualRealPct: r, annual: P * r / 100, monthly: +(P * r / 100 / 12).toFixed(2) });
console.log(JSON.stringify(out, null, 1));
