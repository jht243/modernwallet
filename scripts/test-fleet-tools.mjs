import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const temp=await mkdtemp(join(tmpdir(),'mw-tools-'));let checks=0;
try{
 const built=await build({entryPoints:['src/lib/fleet-tool-math.ts'],bundle:true,platform:'node',format:'cjs',write:false});const filename=join(temp,'math.cjs');await writeFile(filename,built.outputFiles[0].contents);const m=createRequire(import.meta.url)(filename);
 const close=(a,b)=>{assert.ok(Math.abs(a-b)<.005,`${a} != ${b}`);checks++;};const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
 const ira={deathYear:2025,birthYear:1976,account:'traditional',category:'ordinary',separate:true,rbd:'after',previousBalance:100000,balance:100000,withdrawn:0,custom:10000};
 let r=m.inheritedIra(ira);close(r.annual,2762.43093922652);eq(r.endYear,2035);close(r.rows[0].equal,10000);close(r.rows.at(-1).remaining,0);close(r.rows.reduce((a,b)=>a+b.minimum,0),100000);
 close(m.inheritedIra({...ira,deathYear:2024,birthYear:1975}).annual,2840.90909090909);close(m.inheritedIra({...ira,withdrawn:5000}).due,0);close(m.inheritedIra({...ira,account:'roth'}).annual,0);close(m.inheritedIra({...ira,rbd:'before'}).annual,0);eq(m.inheritedIra({...ira,category:'other'}).error!==undefined,true);eq(m.inheritedIra({...ira,rbd:'unknown'}).error!==undefined,true);eq(m.inheritedIra({...ira,balance:NaN}).error!==undefined,true);eq(m.inheritedIra({...ira,deathYear:2019}).error!==undefined,true);eq(m.inheritedIra({...ira,deathYear:2026}).yearOfDeath,true);
 const income={agi:109000,interest:0,additional:1,status:'single',apart:false,b:true,d:true,plan:0};r=m.irmaa(income);close(r.base.monthly,202.90);close(r.changed.monthly,298.60);close(r.changed.annualSurcharge-r.base.annualSurcharge,1148.4);
 for(const [status,n,expected] of [['single',137000,284.1],['single',137000.01,405.8],['single',205000,527.5],['single',205000.01,649.2],['single',499999.99,649.2],['single',500000,689.9],['joint',218000,202.9],['joint',218000.01,284.1],['joint',750000,689.9],['separate',109001,649.2],['separate',391000,689.9]])close(m.irmaa({...income,status,agi:n,additional:0}).base.partB,expected);
 close(m.irmaa({...income,status:'separate',apart:true}).base.partB,202.9);close(m.irmaa({...income,b:false,agi:137000.01}).base.monthly,37.5);eq(m.irmaa({...income,agi:Infinity}).error!==undefined,true);
 let rows=m.parseCsv('\uFEFFdate,destination,purpose,miles\r\n2026-01-01,"A, B","Client ""visit""",12.5\r\n2026-02-28,C,Delivery,7.5');eq(rows[1][1],'A, B');eq(rows[1][2],'Client "visit"');const map={date:0,destination:1,purpose:2,miles:3,start:-1,end:-1};r=m.checkMileage(rows,map,'iso',2026);close(r.total,20);eq(r.complete,2);rows.push([...rows[1]]);r=m.checkMileage(rows,map,'iso',2026);eq(r.rows[2].issues,['Possible duplicate of row 2']);close(r.total,32.5);
 eq(m.calendarDate('2026-02-30','iso'),null);eq(m.calendarDate('02/29/2024','us'),'2024-02-29');eq(m.calendarDate('02/29/2026','us'),null);eq(m.parseCsv('a;b\n"line1\nline2";2',';')[1][0],'line1\nline2');assert.throws(()=>m.parseCsv('a,b\n"unfinished,1'));checks++;assert.throws(()=>m.parseCsv('a,b\n1,2,3'));checks++;eq(m.csvCell('=HYPERLINK("bad")'),'"\'=HYPERLINK(""bad"")"');eq(m.csvCell(' @SUM(A1)'),'"\' @SUM(A1)"');
 r=m.checkMileage([['date','destination','purpose','miles'],['2026-02-30','X','','-3']],map,'iso',2026);eq(r.excluded,1);close(r.total,0);eq(r.rows[0].issues.length,3);
 const odoMap={date:0,destination:1,purpose:2,miles:-1,start:3,end:4};
 r=m.checkMileage([['date','destination','purpose','start','end'],['2026-01-01','Office','Meeting','-10','0']],odoMap,'iso',2026);eq(r.excluded,1);close(r.total,0);eq(r.rows[0].miles,null);eq(r.rows[0].issues.includes('Review odometer values'),true);
 r=m.checkMileage([['date','destination','purpose','start','end'],['2026-01-01','Office','Meeting','0','10']],odoMap,'iso',2026);close(r.total,10);eq(r.excluded,0);
 r=m.checkMileage([['date','destination','purpose','start','end','miles'],['2026-01-01','Office','Meeting','-10','0','12']],{...odoMap,miles:5},'iso',2026);close(r.total,12);eq(r.excluded,0);
 console.log(JSON.stringify({checks,status:'PASS',scope:'Source-based financial boundaries, beneficiary exclusions, zero-growth exhaustion and CSV input safety; not product testing.'}));
}finally{await rm(temp,{recursive:true,force:true});}
