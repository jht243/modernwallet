import {chromium} from '/Users/jonathanteplitsky/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const [base,manifestFile,out] = process.argv.slice(2);
const manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Users/jonathanteplitsky/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const context=await browser.newContext({viewport:{width:1280,height:900},permissions:['clipboard-read','clipboard-write'],acceptDownloads:true});
const report={base,startedAt:new Date().toISOString(),externalRequestsBlocked:true,pages:[],checks:[],pageErrors:[]};
await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
const page=await context.newPage();page.on('pageerror',e=>report.pageErrors.push(e.message)); report.consoleErrors=[]; page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('net::ERR_FAILED'))report.consoleErrors.push({url:page.url(),text:m.text()})});
async function ready(route){await page.goto(base+route,{waitUntil:'networkidle'});if(route.includes('snap-benefits-calculator')||route.includes('aca-subsidy-calculator'))await page.locator('.mw-utility-result').waitFor();}
try{
 for(const route of manifest.routes){
  await ready(route.path);let toolTests=[];
  if(route.path==='/budget/snap-benefits-calculator/'){
   assert.match(await page.locator('.mw-utility-result').innerText(),/\$766\.00/);
   await page.getByLabel('Monthly allowed rent, mortgage and other shelter costs ($)',{exact:true}).fill('1400');assert.match(await page.locator('.mw-utility-result').innerText(),/\$826\.00/);
   await page.getByLabel('SNAP household members',{exact:true}).fill('1');await page.getByLabel('Monthly earned income before taxes ($)',{exact:true}).fill('10000');assert.equal(await page.locator('.mw-utility-number').count(),0);
   await page.getByLabel(/^State eligibility determination/).selectOption('confirmed');assert.match(await page.locator('.mw-utility-number').innerText(),/\$25\.00/);
   await page.getByLabel(/^Household location/).selectOption('other');assert.equal(await page.locator('.mw-utility-result').count(),0);assert.match(await page.getByRole('alert').innerText(),/Alaska/);
   await ready(route.path);await page.getByRole('button',{name:'Copy result',exact:true}).click();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Conditional full-month amount: \$766\.00/);assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Supplemental Nutrition Assistance Program/);
   const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Download result',exact:true}).click();const downloaded=await dl;const file=path.join(out,'snap-result.txt');await downloaded.saveAs(file);assert.match(await fs.readFile(file,'utf8'),/Monthly earned income before taxes \(\$\): 2000/);
   toolTests=['Default766','Shelter1400→826','High-income unknown suppresses amount','State-confirmed conditional minimum25','Unsupported region blocks result','Clipboard contains inputs and result','Downloaded text contains inputs and result'];
  }
  if(route.path==='/budget/aca-subsidy-calculator/'){
   assert.equal(await page.locator('.mw-utility-number').count(),0);await page.getByLabel(/^Other premium-credit eligibility conditions/).selectOption('confirmed');assert.match(await page.locator('.mw-utility-number').innerText(),/\$268\.85/);
   await page.getByLabel('Tax household members',{exact:true}).fill('1');await page.getByLabel('Expected 2027 annual household MAGI ($)',{exact:true}).fill('21226.80');assert.match(await page.locator('.mw-utility-result').innerText(),/3\.2300%/);
   await page.getByLabel('Tax household members',{exact:true}).fill('2');await page.getByLabel('Expected 2027 annual household MAGI ($)',{exact:true}).fill('86560');await page.getByLabel('Monthly benchmark Silver premium without tobacco rating ($)',{exact:true}).fill('1000');await page.getByLabel('Monthly tax-credit-eligible selected plan premium ($)',{exact:true}).fill('1000');assert.match(await page.locator('.mw-utility-number').innerText(),/\$262\.80/);
   await page.getByLabel('Expected 2027 annual household MAGI ($)',{exact:true}).fill('86560.01');assert.equal(await page.locator('.mw-utility-number').count(),0);
   await ready(route.path);await page.getByLabel(/^Other premium-credit eligibility conditions/).selectOption('confirmed');await page.getByRole('button',{name:'Copy result',exact:true}).click();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Conditional monthly federal credit: \$268\.85/);assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Affordable Care Act/);assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/MAGI means modified adjusted gross income/);
   const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Download result',exact:true}).click();const downloaded=await dl;const file=path.join(out,'aca-result.txt');await downloaded.saveAs(file);assert.match(await fs.readFile(file,'utf8'),/Monthly eligible plan premium after credit: \$281\.15/);
   toolTests=['Unknown eligibility suppresses credit','Confirmed default268.85/net281.15','Exact133%correct3.23','400%credit262.80','Above400%withholds estimate','Clipboard contains inputs and result','Downloaded text contains inputs and result'];
  }
  await ready(route.path);const dest=path.join(out,'dom',route.path,'index.html');await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,await page.content());
  const filename=route.path==='/'?'home':route.path.replaceAll('/','_');await page.screenshot({path:path.join(out,filename+'desktop.png'),fullPage:true});
  const headings=await page.locator('main h2').allTextContents();assert.equal(await page.locator('h1').count(),1);
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,filename+'mobile.png'),fullPage:true});
  const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));assert.ok(width.scroll<=width.viewport+1,route.path+' horizontal overflow '+JSON.stringify(width));
  if(toolTests.length)await page.locator('.mw-utility').screenshot({path:path.join(out,filename+'mobile-tool.png')});
  report.pages.push({path:route.path,title:await page.title(),headings,width,toolTests,domFile:dest,htmlLength:(await page.content()).length});await page.setViewportSize({width:1280,height:900});
 }
 assert.equal(report.pageErrors.length,0);assert.equal(report.consoleErrors.length,0);report.status='observed-independent-browser-checks-completed';report.completedAt=new Date().toISOString();
}catch(e){report.status='FAIL';report.error=String(e.stack);process.exitCode=1;}finally{await fs.writeFile(path.join(out,'browser-checks.json'),JSON.stringify(report,null,2)+'\n');await browser.close();}
console.log(JSON.stringify({status:report.status,pages:report.pages.length,error:report.error||null}));
