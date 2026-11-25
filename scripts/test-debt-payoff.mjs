import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
// Replays the Python model fixtures (Mindmap run autocomplete-2026-11-25, evidence/debt-payoff-calculator/output.json)
// against src/lib/debt-payoff.ts. Arithmetic checks of a formula engine only; not product testing.
const temp=await mkdtemp(join(tmpdir(),'mw-dp-'));let checks=0;
const built=await build({entryPoints:['src/lib/debt-payoff.ts'],bundle:true,platform:'node',format:'cjs',write:false});
const f=join(temp,'dp.cjs');await writeFile(f,built.outputFiles[0].contents);
const m=createRequire(import.meta.url)(f);
const fx=JSON.parse(await readFile(process.argv[2]??'reports/mindmap-pass/2026-11-25-autocomplete-run/evidence/debt-payoff-calculator/output.json','utf8'));
const conv=(ds)=>ds.map(d=>({name:d.name,balance:d.balance,aprPct:d.apr,minPayment:d.min}));
const close=(a,b,t=0.01)=>{assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);checks++;};
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const cmp=(res,py)=>{eq(res.months,py.months);if(py.interest==null)eq(res.totalInterest,null);else close(res.totalInterest,py.interest);eq(res.payoffOrder,py.order);eq(res.payoffMonth,py.payoffMonth);};
const ex=fx.example;
let r=m.computeDebtPayoff({debts:conv(ex.debts),extraMonthly:ex.extraMonthly,lumpSum:0});
cmp(r.avalanche,ex.avalanche);cmp(r.snowball,ex.snowball);cmp(r.minimums,ex.minimums);
close(r.snowballExtraInterest,ex.gap.snowballExtraInterest);eq(r.avalancheMonthsSooner,ex.gap.monthsDifference);
close(r.totalBalance,ex.totalBalance);close(r.totalMinimums,ex.totalMinimums);
r=m.computeDebtPayoff({debts:conv(ex.debts),extraMonthly:ex.extraMonthly,lumpSum:fx.lumpSumVariant.lumpSum});
cmp(r.avalanche,fx.lumpSumVariant.avalanche);cmp(r.snowball,fx.lumpSumVariant.snowball);
let c=fx.counterexampleEqualRates;
r=m.computeDebtPayoff({debts:conv(c.debts),extraMonthly:c.extraMonthly,lumpSum:0});
cmp(r.avalanche,c.avalanche);cmp(r.snowball,c.snowball);eq(r.ratesTie,true);close(r.snowballExtraInterest,0,0.005);
c=fx.counterexampleSmallestIsHighest;
r=m.computeDebtPayoff({debts:conv(c.debts),extraMonthly:c.extraMonthly,lumpSum:0});
cmp(r.avalanche,c.avalanche);cmp(r.snowball,c.snowball);eq(r.sameOrder,true);
c=fx.minimumBelowInterest;
r=m.computeDebtPayoff({debts:conv(c.debts),extraMonthly:0,lumpSum:0});
eq(r.minimums.months,null);eq(r.minimums.notCleared,true);eq(r.warnings.length,1);
r=m.computeDebtPayoff({debts:conv(c.debts),extraMonthly:150,lumpSum:0});
cmp(r.avalanche,c.avalancheWith150Extra);
// invariants: balances never negative, total paid = balance + interest
r=m.computeDebtPayoff({debts:conv(ex.debts),extraMonthly:ex.extraMonthly,lumpSum:0});
for(const s of [r.avalanche,r.snowball,r.minimums]){close(s.totalPaid,r.totalBalance+s.totalInterest,0.02);assert.ok(s.balanceByMonth.every(b=>b>=0));checks++;}
// empty input is safe
r=m.computeDebtPayoff({debts:[],extraMonthly:0,lumpSum:0});eq(r.debts.length,0);
console.log(`debt-payoff engine: ${checks} checks passed`);
