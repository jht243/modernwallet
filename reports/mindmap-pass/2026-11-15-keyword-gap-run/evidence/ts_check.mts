// Cross-check: TypeScript engines (src/lib/salary.ts, paycheck.ts, tax-bracket.ts) vs Python reference outputs. Node cannot resolve the extensionless import in paycheck.ts, so the check was run on a scratch copy of the three lib files with ".ts" import suffixes (output in ts_check.out.txt).
import { readFileSync } from "node:fs";
import { computeSalary } from "../../../../src/lib/salary.ts";
import { computePaycheck } from "../../../../src/lib/paycheck.ts";
const dir = new URL(".", import.meta.url).pathname;
const sal = JSON.parse(readFileSync(dir + "salary-calculator/output.json", "utf8"));
const pay = JSON.parse(readFileSync(dir + "paycheck-calculator/output.json", "utf8"));
let bad = 0;
const near = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;
const salIn: Record<string, any> = {
  default_52000: { amount: 52000, period: "annual", hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 },
  hourly_25_to_annual: { amount: 25, period: "hourly", hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 },
  monthly_5000: { amount: 5000, period: "monthly", hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 },
  biweekly_2000: { amount: 2000, period: "biweekly", hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 },
  hourly_30_37_5h: { amount: 30, period: "hourly", hoursPerWeek: 37.5, weeksPerYear: 52, daysPerWeek: 5 },
  annual_60000_50_weeks: { amount: 60000, period: "annual", hoursPerWeek: 40, weeksPerYear: 50, daysPerWeek: 5 },
};
for (const [k, exp] of Object.entries<any>(sal.cases)) {
  const r = computeSalary(salIn[k])!;
  const ok = (["annual", "monthly", "semimonthly", "biweekly", "weekly", "daily"] as const).every((f) => near((r as any)[f], exp[f])) && near(r.hourly, exp.hourly, 0.0001);
  if (!ok) { bad++; console.log("MISMATCH salary", k, r, exp); } else console.log("ok salary", k, r.hourly.toFixed(2));
}
const payIn: Record<string, any> = {
  default_60000_single: { gross: 60000, status: "single", pretax: 0, frequency: "biweekly" },
  mfj_60000: { gross: 60000, status: "mfj", pretax: 0, frequency: "biweekly" },
  hoh_60000: { gross: 60000, status: "hoh", pretax: 0, frequency: "biweekly" },
  pretax_100000_10000: { gross: 100000, status: "single", pretax: 10000, frequency: "biweekly" },
  ss_cap_300000: { gross: 300000, status: "single", pretax: 0, frequency: "biweekly" },
  at_std_deduction_16100: { gross: 16100, status: "single", pretax: 0, frequency: "biweekly" },
  ss_cap_edge_184500_hoh: { gross: 184500, status: "hoh", pretax: 0, frequency: "biweekly" },
  addl_medicare_250000: { gross: 250000, status: "single", pretax: 0, frequency: "biweekly" },
  weekly_60000: { gross: 60000, status: "single", pretax: 0, frequency: "weekly" },
};
for (const [k, exp] of Object.entries<any>(pay.cases)) {
  const r = computePaycheck({ basis: "annual", ...payIn[k] })!;
  const ok = near(r.federal, exp.federal) && near(r.socialSecurity, exp.ss) && near(r.medicare, exp.medicare) && near(r.net, exp.net_annual) && near(r.perCheck.net, exp.net_per_period);
  if (!ok) { bad++; console.log("MISMATCH paycheck", k, r.federal, exp.federal, r.net, exp.net_annual); } else console.log("ok paycheck", k, Math.round(r.net));
}
// per-paycheck basis: $2,307.69 x 26 = $60,000 (rounded)
const pc = computePaycheck({ gross: 60000 / 26, basis: "paycheck", frequency: "biweekly", status: "single", pretax: 0 })!;
if (!near(pc.net, 50390, 0.5)) { bad++; console.log("MISMATCH per-paycheck basis", pc.net); } else console.log("ok per-paycheck basis");
process.exit(bad ? 1 : 0);
