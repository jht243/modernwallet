import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
// Replays the engine fixtures from the approved Mindmap manifest (trend-lane-c-2026-11-14) for the
// 401(k) loan, hard money loan and bridge loan engines. Arithmetic checks only; not product testing.
const temp=await mkdtemp(join(tmpdir(),'mw-loan-'));let checks=0;
const load=async(entry)=>{const built=await build({entryPoints:[entry],bundle:true,platform:'node',format:'cjs',write:false});const f=join(temp,entry.replace(/[^a-z0-9]/gi,'_')+'.cjs');await writeFile(f,built.outputFiles[0].contents);return createRequire(import.meta.url)(f);};
const close=(a,b,t=.005)=>{assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);checks++;};
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
try{
 // ---- 401(k) loan ----
 const k=await load('src/lib/401k-loan.ts');
 const lim=(v,o,h)=>k.loanLimit(v,o,h);
 close(lim(15000,0,0).totalLimit,10000);close(lim(15000,0,0).maxNewLoan,10000);
 close(lim(60000,0,0).totalLimit,30000);
 close(lim(200000,0,0).totalLimit,50000);
 // existing guide fixture: highest12 50,000, outstanding 20,000 -> prong 1 is 20,000, so no room for a new loan
 close(lim(200000,20000,50000).prongDollar,20000);close(lim(200000,20000,50000).maxNewLoan,0);
 // CR-C1 fixture: vested 200,000, outstanding 10,000, highest12 20,000 -> 30,000 (a double-deduction reading would give 20,000)
 close(lim(200000,10000,20000).prongDollar,40000);close(lim(200000,10000,20000).prongVested,100000);close(lim(200000,10000,20000).maxNewLoan,30000);
 // boundary: vested exactly 100,000 -> half is 50,000
 close(lim(100000,0,0).totalLimit,50000);close(lim(100000,0,0).maxNewLoan,50000);
 close(lim(19999,0,0).totalLimit,10000);
 const base={vestedBalance:60000,outstandingLoans:0,highest12:0,loanAmount:10000,aprPct:8,termYears:5,paymentsPerYear:12,purpose:'general'};
 let r=k.computeLoan401k(base);
 eq(r.valid,true);close(r.payment,202.7640,.0005);close(r.totalRepaid,r.payment*60,.01);close(r.schedule.at(-1).balance,0);eq(r.schedule.length,60);eq(r.yearly.length,5);close(r.yearly.reduce((a,y)=>a+y.principal,0),10000,.01);
 eq(r.overLimit,false);eq(r.deemedDistributionRisk,false);
 close(k.computeLoan401k({...base,aprPct:0}).payment,10000/60,1e-6);
 eq(k.computeLoan401k({...base,termYears:6}).termTooLong,true);eq(k.computeLoan401k({...base,termYears:6,purpose:'residence'}).termTooLong,false);
 eq(k.computeLoan401k({...base,paymentsPerYear:2}).tooInfrequent,true);eq(k.computeLoan401k({...base,paymentsPerYear:4}).tooInfrequent,false);
 eq(k.computeLoan401k({...base,loanAmount:40000}).overLimit,true);close(k.computeLoan401k({...base,loanAmount:40000}).excessOverLimit,10000);
 eq(k.computeLoan401k({...base,loanAmount:0}).valid,false);eq(k.computeLoan401k({...base,vestedBalance:NaN}).totalLimit,10000);

 // ---- hard money loan ----
 const h=await load('src/lib/hard-money-loan.ts');
 const hb={purchasePrice:200000,rehabBudget:50000,purchaseAdvancePct:90,rehabAdvancePct:100,aprPct:12,pointsPct:2,months:6,otherFees:2500,extensionMonths:0,extensionFeePct:0,drawMode:'closing',arv:0,sellingCostPct:0,monthlyHoldingCost:0};
 let m=h.computeHardMoney(hb);
 close(m.loan,230000);close(m.points,4600);close(m.monthlyInterestFull,2300);close(m.interest,13800);close(m.totalFinancingCost,20900);close(m.balloon,230000);close(m.ltcPct,92);
 close(m.downPayment,20000);close(m.cashToClose,20000+4600+2500);eq(m.ltarvPct,null);eq(m.profit,null);eq(m.months.length,6);close(m.annualizedCostPct,20900/230000*2*100,1e-6);
 // extension: 3 more months at 1% of balance
 m=h.computeHardMoney({...hb,extensionMonths:3,extensionFeePct:1});close(m.extensionFee,2300);close(m.extensionInterest,6900);close(m.totalFinancingCost,20900+2300+6900);
 // ARV and profit
 m=h.computeHardMoney({...hb,arv:350000,sellingCostPct:6,monthlyHoldingCost:1000});close(m.ltarvPct,230000/350000*100,1e-6);close(m.sellingCosts,21000);close(m.profit,350000-21000-200000-50000-20900-6000);
 // rehab drawn evenly: 6 months carries 3.5/6 average -> rehab interest 50,000 x 1% x 3.5 = 1,750
 m=h.computeHardMoney({...hb,drawMode:'even'});close(m.interest,180000*.01*6+50000*.01*3.5);
 // boundaries
 close(h.computeHardMoney({...hb,pointsPct:0}).points,0);close(h.computeHardMoney({...hb,aprPct:0}).interest,0);close(h.computeHardMoney({...hb,aprPct:0}).totalFinancingCost,4600+2500);
 close(h.computeHardMoney({...hb,rehabBudget:0}).loan,180000);close(h.computeHardMoney({...hb,purchaseAdvancePct:100,rehabAdvancePct:100}).downPayment,0);
 eq(h.computeHardMoney({...hb,purchasePrice:0,rehabBudget:0}).valid,false);eq(h.computeHardMoney({...hb,months:0}).valid,false);
 const s=h.hardMoneySensitivity(hb);eq(s.length,6);close(s[1].change,2300*3);

 // ---- bridge loan ----
 const b=await load('src/lib/bridge-loan.ts');
 const bb={salePrice:400000,oldMortgagePayoff:200000,bridgeLoan:100000,aprPct:10,originationPct:2,otherFees:0,months:6,newMortgagePayment:0,oldMonthlyCarrying:0,sellingCostPct:6,alternativeMonthlyCost:0,maxCombinedLtvPct:0};
 let x=b.computeBridge(bb);
 close(x.interest,5000);close(x.fees,2000);close(x.bridgeCost,7000);close(x.sellingCosts,24000);close(x.netProceeds,69000);eq(x.negativeProceeds,false);eq(x.breakEvenMonths,null);eq(x.maxBridgeFromLtv,null);
 // boundaries: months 0, fee 0, bridge 0, payoff above price
 x=b.computeBridge({...bb,months:0});close(x.interest,0);close(x.bridgeCost,2000);
 x=b.computeBridge({...bb,originationPct:0});close(x.bridgeCost,5000);
 eq(b.computeBridge({...bb,bridgeLoan:0}).valid,false);
 x=b.computeBridge({...bb,oldMortgagePayoff:450000});eq(x.negativeProceeds,true);
 // overlap outlay and break-even against an alternative that costs 1,500 a month
 x=b.computeBridge({...bb,newMortgagePayment:2500,oldMonthlyCarrying:1800,alternativeMonthlyCost:1500});close(x.monthlyOverlapOutlay,4300);close(x.totalOverlapOutlay,25800);close(x.breakEvenMonths,2000/(1500-833.3333333),1e-6);
 x=b.computeBridge({...bb,maxCombinedLtvPct:80});close(x.maxBridgeFromLtv,120000);
 eq(b.computeBridge({...bb,months:4}).byMonth.map(r=>r.months),[3,4,6,9]);
 console.log(JSON.stringify({checks,status:'PASS',scope:'Manifest engine fixtures for the 401(k) loan, hard money loan and bridge loan calculators; arithmetic only, not product testing.'}));
}finally{await rm(temp,{recursive:true,force:true});}
