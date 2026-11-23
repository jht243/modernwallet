// Rule of 78 model run (trend-lane-c pass 2026-11-23). Bundles and executes the SHIPPED engine src/lib/rule-of-78.ts
// for each illustrative case in inputs.json and writes machine-readable results. Usage: node model.mjs <inputs.json> <output.json>
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const [inputsPath,outPath]=process.argv.slice(2);
const temp=await mkdtemp(join(tmpdir(),'mw-r78-model-'));
try{
 const built=await build({entryPoints:['src/lib/rule-of-78.ts'],bundle:true,platform:'node',format:'cjs',write:false});
 const f=join(temp,'engine.cjs');await writeFile(f,built.outputFiles[0].contents);
 const eng=createRequire(import.meta.url)(f);
 const inputs=JSON.parse(await readFile(inputsPath,'utf8'));
 const r2=(x)=>Math.round(x*100)/100;
 const cases=inputs.cases.map((c)=>{
  const r=eng.computeRule78(c);
  const first=r.schedule[0];
  return {id:c.id,inputs:{amount:c.amount,aprPct:c.aprPct,termMonths:c.termMonths,payoffAfter:c.payoffAfter},
   payment:r2(r.payment),financeCharge:r2(r.financeCharge),digitSum:r.digitSum,remainingPayments:r.remainingPayments,
   rule78Earned:r2(r.rule78Earned),rule78Refund:r2(r.rule78Refund),actuarialEarned:r2(r.actuarialEarned),actuarialRefund:r2(r.actuarialRefund),
   difference:r2(r.difference),payoffRule78:r2(r.payoffRule78),payoffActuarial:r2(r.payoffActuarial),
   rule78SharePct:r.financeCharge>0?r2(100*r.rule78Earned/r.financeCharge):0,actuarialSharePct:r.financeCharge>0?r2(100*r.actuarialEarned/r.financeCharge):0,
   termSharePct:r2(100*c.payoffAfter/c.termMonths),
   month1:{rule78:r2(first.rule78Interest),actuarial:r2(first.actuarialInterest)},
   lastMonth:{rule78:r2(r.schedule[r.schedule.length-1].rule78Interest),actuarial:r2(r.schedule[r.schedule.length-1].actuarialInterest)},
   overFederalLimit:r.overFederalLimit};
 });
 const golden=eng.computeRule78(inputs.cases[0]);
 const table=golden.schedule.slice(0,12).map((x)=>({month:x.month,rule78:r2(x.rule78Interest),actuarial:r2(x.actuarialInterest)}));
 await writeFile(outPath,JSON.stringify({engine:'src/lib/rule-of-78.ts',cases,goldenFirst12Months:table,federalTermLimitMonths:eng.FEDERAL_ACTUARIAL_TERM_MONTHS},null,1)+'\n');
}finally{await rm(temp,{recursive:true,force:true});}
