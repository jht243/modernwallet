import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp,writeFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
// Replays the engine fixtures from the approved Mindmap manifest (2026-11-25-tool-usage) for src/lib/sep-solo-401k.ts,
// src/lib/social-security-withholding.ts and src/lib/capital-loss-carryover.ts, and for the COLA worked example in
// src/lib/social-security-cola.ts. Arithmetic checks of formula engines only; not product testing.
// Usage: node scripts/test-tool-usage-1125.mjs [output.json] [cola|sep|w4v|cl]   (every check always runs; with a path, the computed fixture
// results of the chosen group, or of all groups when omitted, are written as deterministic JSON)
const out=process.argv[2];const group=process.argv[3];
const temp=await mkdtemp(join(tmpdir(),'mw-tu1125-'));let checks=0;const rec={};
const load=async(entry)=>{const built=await build({entryPoints:[entry],bundle:true,platform:'node',format:'cjs',write:false});const f=join(temp,entry.replace(/[^a-z0-9]/gi,'_')+'.cjs');await writeFile(f,built.outputFiles[0].contents);return createRequire(import.meta.url)(f);};
const close=(a,b,t=.005)=>{assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);checks++;};
const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
try{
 // ---- COLA worked example (CR-1): $1,850 x 1.036 = $1,916.60 gross; net after the $209.40 premium = $1,707 ----
 const cola=await load('src/lib/social-security-cola.ts');
 const c=cola.computeCola({currentBenefit:1850,partBPremium:209.4});
 close(c.newBenefit,1916.6);close(c.monthlyIncrease,66.6);eq(c.netPayment,1707);close(cola.PART_B_2027_STANDARD,209.4);
 rec.cola={input:{currentBenefit:1850,partBPremium:209.4},result:c};
 // $2,000 check on the guide: raise $72, premium up $6.50 (209.40 - 202.90) => net gain $65.50
 const c2=cola.computeCola({currentBenefit:2000,partBPremium:0});close(c2.monthlyIncrease,72);close(209.4-202.9,6.5);
 rec.cola2000={result:c2,premiumIncrease:Math.round((209.4-202.9)*100)/100,netGain:Math.round((c2.monthlyIncrease-6.5)*100)/100};close(rec.cola2000.netGain,65.5);

 // ---- SEP IRA / solo 401(k) ----
 const sep=await load('src/lib/sep-solo-401k.ts');
 const run=(netProfit,year,age='under50',otherDeferrals=0)=>sep.computeSepSolo({netProfit,year,age,otherDeferrals});
 let r=run(100000,2027);rec.sep100k2027=r;
 close(r.seTax,14129.55,.01);close(r.halfSeTax,7064.77,.011);close(r.netEarnings,92935.23,.011);
 eq(sep.wholeDollars(r.sepMax),18587);eq(sep.wholeDollars(r.soloMax),44087);eq(r.catchUp,0);
 close(r.employeeDeferral,25500);close(r.employer,18587.05,.011);
 const r50=run(100000,2027,'50plus');rec.sep100k2027age50=r50;close(r50.catchUp,8500);eq(sep.wholeDollars(r50.soloMaxWithCatchUp),52587);
 const r60=run(100000,2027,'60to63');rec.sep100k2027age60=r60;close(r60.catchUp,11750);
 const r26=run(100000,2026);rec.sep100k2026=r26;close(r26.employeeDeferral,24500);eq(sep.wholeDollars(r26.soloMax),43087);close(r26.employer,r.employer,.001);
 // boundary: employer share capped (profit well above the compensation limit)
 const rcap=run(500000,2027);rec.sep500k2027=rcap;close(rcap.employer,75000);close(rcap.sepMax,75000);close(rcap.soloMax,75000);eq(rcap.flags.employerCapped,true);eq(rcap.flags.compensationCapped,true);
 const rcap26=run(500000,2026);rec.sep500k2026=rcap26;close(rcap26.employer,72000);
 // above-the-wage-base boundary (CR-4): SE tax uses the base for the chosen year: $192,300 for 2027 (SSA, Federal Register 2026-21796), $184,500 for 2026
 const r250=run(250000,2027);rec.sep250k2027=r250;
 close(r250.seTax,192300*0.124+250000*0.9235*0.029,.01);
 const r250b=run(250000,2026);rec.sep250k2026=r250b;close(r250b.seTax,184500*0.124+250000*0.9235*0.029,.01);
 // below the 2027 base the two years agree on SE tax
 close(run(150000,2027).seTax,run(150000,2026).seTax,.001);
 // other-plan deferrals use the shared 402(g) limit
 const rfull=run(100000,2027,'under50',25500);rec.sep100kOtherFull=rfull;close(rfull.employeeDeferral,0);close(rfull.soloMax,rfull.sepMax);eq(rfull.flags.deferralReducedByOtherPlans,true);
 const rpart=run(100000,2027,'under50',10000);close(rpart.employeeDeferral,15500);
 // low profit: deferral limited by earned income, solo total equals net earnings
 const rlow=run(20000,2027);rec.sep20k2027=rlow;close(rlow.soloMax,rlow.netEarnings,.011);eq(rlow.flags.deferralLimitedByEarnings,true);
 // zero and negative profit
 const r0=run(0,2027);eq(r0.sepMax,0);eq(r0.soloMax,0);eq(r0.flags.noEarnings,true);close(run(-5000,2026).soloMaxWithCatchUp,0);
 // below the $400 SE floor
 const r300=run(300,2027);eq(r300.flags.belowSeFloor,true);close(r300.seTax,0);
 // solo never below SEP
 for(const p of [1000,10000,30000,60000,100000,200000,375000,900000])for(const y of [2026,2027]){const a=run(p,y);assert.ok(a.soloMax>=a.sepMax-1e-9);checks++;}
 close(sep.earningsForCap(2027),375000);close(sep.earningsForCap(2026),360000);

 // ---- Social Security withholding (W-4V) ----
 const w=await load('src/lib/social-security-withholding.ts');
 const wd={status:'single',monthlyBenefit:2400,months:12,otherIncome:24000,filers65:1,alreadyPaid:0};
 let x=w.computeWithholding(wd);rec.w4vDefault={input:wd,result:x};
 eq(x.taxYear,2026);close(x.annualBenefits,28800);
 // provisional income 24,000 + 14,400 = 38,400 > 34,000: 85% tier
 close(x.provisionalIncome,38400);close(x.taxableBenefits,Math.min(0.85*28800,0.85*(38400-34000)+Math.min(14400,4500)),0.01);
 close(x.deduction,16100+2050);
 eq(x.rows.map(a=>a.rate),[0.07,0.1,0.12,0.22]);
 // each row = rate x monthly x months
 for(const row of x.rows)close(row.withheld,2400*12*row.rate,0.01);
 // best = lowest covering rate; every lower rate falls short
 const bi=x.rows.findIndex(a=>a.rate===x.best);assert.ok(bi>=0);assert.ok(x.rows[bi].coversTax);for(let k=0;k<bi;k++)assert.ok(!x.rows[k].coversTax);checks+=2;
 // boundary: benefit fully tax-free -> no withholding needed
 const wf=w.computeWithholding({status:'single',monthlyBenefit:1500,months:12,otherIncome:0,filers65:1,alreadyPaid:0});rec.w4vTaxFree=wf;eq(wf.taxableBenefits,0);eq(wf.advice,'none');eq(wf.best,null);
 // boundary: high other income -> 22% still short
 const wh=w.computeWithholding({status:'single',monthlyBenefit:3000,months:12,otherIncome:200000,filers65:1,alreadyPaid:0});rec.w4vHighIncome=wh;eq(wh.advice,'short');eq(wh.best,0.22);assert.ok(wh.rows[3].surplus<0);checks++;
 // already paid covers the tax -> none
 const wp=w.computeWithholding({...wd,alreadyPaid:100000});eq(wp.advice,'none');
 // months shortens the withheld total and can change the best rate
 const wm=w.computeWithholding({...wd,months:3});rec.w4vThreeMonths=wm;close(wm.rows[0].withheld,2400*3*0.07,0.01);
 // married filing jointly allows two 65+ filers; single clamps to one
 const wj=w.computeWithholding({status:'mfj',monthlyBenefit:3800,months:12,otherIncome:30000,filers65:2,alreadyPaid:0});rec.w4vMfj=wj;close(wj.deduction,32200+2*1650);
 close(w.computeWithholding({...wd,filers65:2}).deduction,16100+2050);
 // mfs lived together: base amount $0
 const wmfs=w.computeWithholding({status:'mfs-together',monthlyBenefit:2000,months:12,otherIncome:5000,filers65:0,alreadyPaid:0});eq(wmfs.taxableBenefits>0,true);
 // zero benefit
 eq(w.computeWithholding({...wd,monthlyBenefit:0}).advice,'none');

 // ---- Capital loss carryover ----
 const cl=await load('src/lib/capital-loss-carryover.ts');
 const base={status:'single',stGains:0,stLosses:30000,ltGains:0,ltLosses:20000,priorSt:0,priorLt:0,futureGain:0};
 let k=cl.computeCarryover(base);rec.cl50k=k;
 // CR-2: $50,000 net loss, no gains: $3,000 this year, 16 more tax years, final year $2,000 (17 tax years in all)
 eq(k.deductionThisYear,3000);eq(k.carryTotal,47000);eq(k.carrySt,27000);eq(k.carryLt,20000);eq(k.yearsOfDeductions,17);eq(k.lastYearDeduction,2000);
 eq(k.schedule.length,17);eq(k.schedule.slice(0,16).every(r=>r.deduction===3000),true);eq(k.schedule[16].deduction,2000);eq(k.schedule[16].carryTotal,0);eq(k.totalDeducted,50000);
 // short-term used first: the short-term carryover is exhausted before long-term shrinks
 const stZero=k.schedule.findIndex(r=>r.carrySt===0);assert.ok(stZero>=0);assert.ok(k.schedule.slice(0,stZero).every(r=>r.carryLt===20000));checks+=2;
 // married filing separately: $1,500 a year -> 34 years, last year $500
 const kmfs=cl.computeCarryover({...base,status:'mfs'});rec.cl50kMfs=kmfs;eq(kmfs.deductionThisYear,1500);eq(kmfs.yearsOfDeductions,34);eq(kmfs.lastYearDeduction,500);eq(kmfs.totalDeducted,50000);
 // loss below the limit: deduct it all, no carryover
 const ksm=cl.computeCarryover({...base,stLosses:2000,ltLosses:0});eq(ksm.deductionThisYear,2000);eq(ksm.carryTotal,0);eq(ksm.yearsOfDeductions,1);
 // Pub 550 example: $7,000 loss -> deduct $3,000, carry $4,000
 const kp=cl.computeCarryover({...base,stLosses:0,ltLosses:7000});eq(kp.deductionThisYear,3000);eq(kp.carryTotal,4000);eq(kp.carryLt,4000);eq(kp.yearsOfDeductions,3);eq(kp.lastYearDeduction,1000);
 // gains cancel losses first
 const kg=cl.computeCarryover({...base,stLosses:10000,ltLosses:0,ltGains:4000});rec.clMixed=kg;eq(kg.netThisYear,-6000);eq(kg.deductionThisYear,3000);eq(kg.carrySt,3000);eq(kg.carryLt,0);
 // net gain: nothing to deduct or carry
 const kn=cl.computeCarryover({...base,stLosses:5000,ltLosses:0,ltGains:9000});eq(kn.isNetLoss,false);eq(kn.deductionThisYear,0);eq(kn.carryTotal,0);eq(kn.netThisYear,4000);
 // prior carryover joins this year's result
 const kc=cl.computeCarryover({...base,stLosses:0,ltLosses:0,priorSt:5000,priorLt:0});eq(kc.deductionThisYear,3000);eq(kc.carrySt,2000);
 // counterexample: $10,000 of net long-term gain each later year shortens the schedule
 const kf=cl.computeCarryover({...base,futureGain:10000});rec.cl50kFutureGain=kf;assert.ok(kf.yearsOfDeductions<k.yearsOfDeductions);checks++;
 close(kf.schedule[kf.schedule.length-1].carryTotal,0);
 // gains in later years that exceed the carryover absorb it with no further deduction
 const kbig=cl.computeCarryover({...base,futureGain:100000});eq(kbig.schedule.length,2);eq(kbig.schedule[1].deduction,0);eq(kbig.yearsOfDeductions,1);
 // schedule stays finite
 const khuge=cl.computeCarryover({...base,status:'mfs',stLosses:10_000_000});eq(khuge.schedule.length,cl.MAX_YEARS);assert.ok(khuge.unusedAfterMax>0);checks++;
 // characters never go negative and totals always reconcile: sum of deductions + future-gain absorption never exceeds the loss
 for(const [s,l] of [[30000,20000],[0,50000],[50000,0],[12345.67,8765.43]]){const q=cl.computeCarryover({...base,stLosses:s,ltLosses:l});assert.ok(q.totalDeducted<=s+l+0.01);close(q.totalDeducted,s+l,0.02);assert.ok(q.schedule.every(r=>r.carrySt>=0&&r.carryLt>=0));checks++;}
 console.log(`tool-usage 2026-11-25 engine checks passed: ${checks}`);
 const pick=group?Object.fromEntries(Object.entries(rec).filter(([k])=>k.startsWith(group))):rec;
 if(out){await mkdir(dirname(out),{recursive:true});await writeFile(out,JSON.stringify({group:group||'all',checks,results:pick},null,2)+'\n');}
}finally{await rm(temp,{recursive:true,force:true});}
