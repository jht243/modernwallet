import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
// Replays the engine fixtures from the approved Mindmap manifest (trend-lane-c-2026-11-23) for src/lib/rule-of-78.ts.
// Arithmetic checks of a formula engine only; not product testing.
const temp=await mkdtemp(join(tmpdir(),'mw-r78-'));let checks=0;
const load=async(entry)=>{const built=await build({entryPoints:[entry],bundle:true,platform:'node',format:'cjs',write:false});const f=join(temp,entry.replace(/[^a-z0-9]/gi,'_')+'.cjs');await writeFile(f,built.outputFiles[0].contents);return createRequire(import.meta.url)(f);};
const close=(a,b,t=.005)=>{assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);checks++;};
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
try{
 const m=await load('src/lib/rule-of-78.ts');
 const run=(amount,aprPct,termMonths,payoffAfter)=>m.computeRule78({amount,aprPct,termMonths,payoffAfter});
 // golden case: $15,000 / 7% / 48 / after 12 payments
 let r=run(15000,7,48,12);
 close(r.payment,359.19,.005);close(r.financeCharge,2241.30,.005);
 close(r.rule78Earned,971.99,.005);close(r.actuarialEarned,943.34,.005);close(r.difference,28.65,.005);
 close(r.rule78Refund,2241.30-971.99,.01);close(r.actuarialRefund,2241.30-943.34,.01);
 eq(r.digitSum,1176);eq(r.remainingPayments,36);eq(r.overFederalLimit,false);
 // payoff amounts agree with each other: R78 payoff = actuarial payoff + difference
 close(r.payoffRule78-r.payoffActuarial,r.difference,1e-6);
 close(r.payoffActuarial,r.payment*36-r.actuarialRefund,1e-6);
 // schedule sums back to the finance charge for both methods and to the earned figures at k
 eq(r.schedule.length,48);
 close(r.schedule.reduce((a,x)=>a+x.rule78Interest,0),r.financeCharge,1e-6);
 close(r.schedule.reduce((a,x)=>a+x.actuarialInterest,0),r.financeCharge,1e-6);
 close(r.schedule.slice(0,12).reduce((a,x)=>a+x.rule78Interest,0),r.rule78Earned,1e-6);
 close(r.schedule.slice(0,12).reduce((a,x)=>a+x.actuarialInterest,0),r.actuarialEarned,1e-6);
 // manifest fixtures
 close(run(15000,7,48,24).difference,26.26);close(run(15000,7,48,24).rule78Earned,1669.54);
 close(run(15000,7,48,42).difference,3.30);
 close(run(25000,8,60,12).difference,88.13);close(run(25000,8,60,12).rule78Earned,1935.05);close(run(25000,8,60,12).actuarialEarned,1846.92);
 close(run(30000,9,72,24).difference,227.82);eq(run(30000,9,72,24).overFederalLimit,true);
 // k = n: both methods have earned the whole finance charge, difference 0, refund 0
 r=run(15000,7,48,48);close(r.difference,0,1e-6);close(r.rule78Refund,0,1e-6);close(r.actuarialRefund,0,1e-6);close(r.rule78Earned,r.financeCharge,1e-6);eq(r.remainingPayments,0);
 // 61 vs 62 month boundary for the federal notice flag
 eq(run(10000,6,61,10).overFederalLimit,false);eq(run(10000,6,62,10).overFederalLimit,true);
 // APR = 0: no finance charge, nothing to allocate
 r=run(12000,0,24,6);close(r.payment,500,1e-9);close(r.financeCharge,0,1e-9);close(r.rule78Earned,0,1e-9);close(r.actuarialEarned,0,1e-9);close(r.difference,0,1e-9);close(r.payoffActuarial,12000-500*6,1e-6);
 // term 1: one payment, k must be 1, everything earned
 r=run(1000,12,1,1);close(r.difference,0,1e-9);close(r.rule78Earned,r.financeCharge,1e-9);close(r.payment,1010,1e-9);
 // n = 12 gives the classic 78 digit sum, month 1 credited 12/78 of the finance charge
 r=run(10000,10,12,3);eq(r.digitSum,78);close(r.schedule[0].rule78Interest,r.financeCharge*12/78,1e-9);
 // difference is never negative for k in 1..n (front-loading only moves interest earlier)
 for(const [a,p,n] of [[15000,7,48],[25000,8,60],[30000,9,72],[5000,29,36],[8000,3,120]]){for(let k=1;k<=n;k++){assert.ok(run(a,p,n,k).difference>=-1e-9);checks++;}}
 // invalid input returns null: k = 0, k > n, non-integer, bad amount, APR out of range, term out of range, NaN
 eq(run(15000,7,48,0),null);eq(run(15000,7,48,49),null);eq(run(15000,7,48,12.5),null);eq(run(15000,7,47.5,12),null);
 eq(run(0,7,48,12),null);eq(run(-5,7,48,12),null);eq(run(15000,-1,48,12),null);eq(run(15000,31,48,12),null);
 eq(run(15000,7,0,1),null);eq(run(15000,7,121,12),null);eq(run(NaN,7,48,12),null);eq(run(15000,7,48,NaN),null);
 console.log(`rule-of-78 engine: ${checks} checks passed`);
}finally{await rm(temp,{recursive:true,force:true});}
