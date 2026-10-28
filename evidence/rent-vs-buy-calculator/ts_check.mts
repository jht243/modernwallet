// Cross-check: TypeScript engine vs Python reference (check.out.json). Run: node --experimental-strip-types ts_check.mts
import { readFileSync } from "node:fs";
import { computeRentVsBuy, RVB_DEFAULTS } from "../../src/lib/rent-vs-buy.ts";
const ref = JSON.parse(readFileSync("check.out.json", "utf8"));
const map: Record<string,string> = { down_pct:"downPct", rate_pct:"ratePct", appr_pct:"apprPct", return_pct:"returnPct", rent:"rent", price:"price" };
let bad = 0;
function cmp(name: string, inp: any, exp: any) {
  const r = computeRentVsBuy({ ...RVB_DEFAULTS, ...inp })!;
  const h = r.atHorizon;
  const ok = Math.abs(h.diff - exp.at_horizon.diff) < 0.5 && r.breakEven === exp.break_even && Math.abs(r.payment - exp.payment) < 0.01;
  if (!ok) { bad++; console.log("MISMATCH", name, r.breakEven, exp.break_even, h.diff, exp.at_horizon.diff); }
  else console.log("ok", name, r.breakEven, Math.round(h.diff));
}
cmp("default", {}, ref.default);
for (const [k, v] of Object.entries<any>(ref.scenarios)) {
  const inp: any = {}; for (const [a, b] of Object.entries<any>(v.inputs)) inp[map[a]] = b;
  cmp(k, inp, v);
}
process.exit(bad ? 1 : 0);
