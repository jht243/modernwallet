import { readFileSync, writeFileSync } from "node:fs";
import { computeHiddenCosts, NATIONAL_TYPICAL_TOTAL } from "../../src/lib/home-ownership-costs.ts";
const dir = new URL(".", import.meta.url).pathname;
const inp = JSON.parse(readFileSync(dir + "inputs.json", "utf8"));
const n = inp.national;
const out: Record<string, unknown> = {};
out.nationalSumCheck = { components: n.maintenance + n.propertyTax + n.insurance, reportedTotal: n.reportedTotal, engineTotal: NATIONAL_TYPICAL_TOTAL, monthly: n.reportedTotal / 12 };
// Back-cast five years: today's component divided by (1 + five-year change). Derived, not reported.
const r = inp.reportedChanges;
const back = { maintenance: n.maintenance / (1 + r.maintenanceFiveYearPct / 100), propertyTax: n.propertyTax / (1 + r.propertyTaxFiveYearPct / 100), insurance: n.insurance / (1 + r.insuranceFiveYearPct / 100) };
const backSum = back.maintenance + back.propertyTax + back.insurance;
out.backcastFiveYears = { ...back, sum: backSum, totalFromReportedPct: n.reportedTotal / (1 + r.totalFiveYearPct / 100), impliedTotalChangePct: (n.reportedTotal / backSum - 1) * 100 };
out.scenarios = inp.scenarios.map((s: { id: string; input: Parameters<typeof computeHiddenCosts>[0] }) => ({ id: s.id, input: s.input, result: computeHiddenCosts(s.input) }));
writeFileSync(dir + "output.json", JSON.stringify(out, null, 1) + "\n");
console.log("ok");
