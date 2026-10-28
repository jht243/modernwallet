// Cross-check: TypeScript engine vs Python reference. Run: node --experimental-strip-types ts_check.mts
import { readFileSync } from "node:fs";
import { computeStockGains } from "../../src/lib/stock-capital-gains.ts";
const ref = JSON.parse(readFileSync("check.out.json", "utf8"));
let bad = 0;
for (const [k, v] of Object.entries<any>(ref)) {
  const r = computeStockGains(v.inputs)!;
  const ok = Math.abs(r.incomeTax - v.tax) < 0.01 && Math.abs(r.niit - v.niit) < 0.01 && Math.abs(r.totalTax - v.total) < 0.01;
  if (!ok) bad++;
  console.log(ok ? "ok" : "MISMATCH", k, Math.round(r.totalTax), v.total);
}
process.exit(bad ? 1 : 0);
