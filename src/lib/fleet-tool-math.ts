// IRS Publication 590-B (2025), Appendix B Table I; checked 2026-10-31.
export const SINGLE_LIFE: Record<number, number> = {"0": 84.6, "30": 55.3, "1": 83.7, "31": 54.4, "2": 82.8, "32": 53.4, "3": 81.8, "33": 52.5, "4": 80.8, "34": 51.5, "5": 79.8, "35": 50.5, "6": 78.8, "36": 49.6, "7": 77.9, "37": 48.6, "8": 76.9, "38": 47.7, "9": 75.9, "39": 46.7, "10": 74.9, "40": 45.7, "11": 73.9, "41": 44.8, "12": 72.9, "42": 43.8, "13": 71.9, "43": 42.9, "14": 70.9, "44": 41.9, "15": 69.9, "45": 41.0, "16": 69.0, "46": 40.0, "17": 68.0, "47": 39.0, "18": 67.0, "48": 38.1, "19": 66.0, "49": 37.1, "20": 65.0, "50": 36.2, "21": 64.1, "51": 35.3, "22": 63.1, "52": 34.3, "23": 62.1, "53": 33.4, "24": 61.1, "54": 32.5, "25": 60.2, "55": 31.6, "26": 59.2, "56": 30.6, "27": 58.2, "57": 29.8, "28": 57.3, "58": 28.9, "29": 56.3, "59": 28.0, "60": 27.1, "91": 5.3, "61": 26.2, "92": 4.9, "62": 25.4, "93": 4.6, "63": 24.5, "94": 4.3, "64": 23.7, "95": 4.0, "65": 22.9, "96": 3.7, "66": 22.0, "97": 3.4, "67": 21.2, "98": 3.2, "68": 20.4, "99": 3.0, "69": 19.6, "100": 2.8, "70": 18.8, "101": 2.6, "71": 18.0, "102": 2.5, "72": 17.2, "103": 2.3, "73": 16.4, "104": 2.2, "74": 15.6, "105": 2.1, "75": 14.8, "106": 2.1, "76": 14.1, "107": 2.1, "77": 13.3, "108": 2.0, "78": 12.6, "109": 2.0, "79": 11.9, "110": 2.0, "80": 11.2, "111": 2.0, "81": 10.5, "112": 2.0, "82": 9.9, "113": 1.9, "83": 9.3, "114": 1.9, "84": 8.7, "115": 1.8, "85": 8.1, "116": 1.8, "86": 7.6, "117": 1.6, "87": 7.1, "118": 1.4, "88": 6.6, "119": 1.1, "89": 6.1, "90": 5.7, "120": 1.0};
export const PREMIUM_YEAR = 2026;
export const DISTRIBUTION_YEAR = 2026;
export const INCOME_YEAR = 2024;
export const MAX_MONEY = 100_000_000; // Interface guard, not a program limit.
export const finiteRange = (n: number, min: number, max: number) => Number.isFinite(n) && n >= min && n <= max;
export type IraInput = { deathYear: number; birthYear: number; account: "traditional" | "roth"; category: "ordinary" | "other"; separate: boolean; rbd: "before" | "after" | "unknown"; previousBalance: number; balance: number; withdrawn: number; custom: number };
export type IraRow = {year: number; opening: number; minimum: number; equal: number; custom: number; remaining: number};
export function inheritedIra(i: IraInput) {
 const year = DISTRIBUTION_YEAR;
 if (![i.deathYear,i.birthYear].every(Number.isInteger) || !finiteRange(i.deathYear,2020,year) || !finiteRange(i.birthYear,1900,year-18) || ![i.previousBalance,i.balance,i.withdrawn,i.custom].every(n=>finiteRange(n,0,MAX_MONEY))) return {error:"Enter valid years and nonnegative balances within the field limits."};
 if (i.category!=="ordinary" || !i.separate) return {error:"This planner covers a first-generation individual beneficiary under the ordinary ten-year rule with a separate inherited account. Ask your custodian about the schedule for your beneficiary category."};
 if (i.account==="traditional" && i.rbd==="unknown") return {error:"Confirm with the custodian whether the owner died before or on/after their required beginning date."};
 const firstYear=i.deathYear+1, endYear=i.deathYear+10, firstAge=firstYear-i.birthYear;
 const base=SINGLE_LIFE[Math.max(0,Math.min(120,firstAge))];
 if (!base) return {error:"The beneficiary age is outside the supported life-expectancy table."};
 const factor=Math.max(1,base-(year-firstYear));
 const annual=i.account==="traditional" && i.rbd==="after" && year>=firstYear ? i.previousBalance/factor : 0;
 const due=Math.max(0,annual-i.withdrawn);
 // Zero growth is a stated modeling assumption, not an investment forecast.
 let even=i.balance, minimumOnly=i.balance, custom=i.balance;
 const rows:IraRow[]=[];
 for(let y=year;y<=endYear;y++){
  const years=endYear-y+1, divisor=Math.max(1,base-(y-firstYear));
  const requiresAnnual=i.account==="traditional" && i.rbd==="after" && y>=firstYear;
  const minFloor= y===endYear ? minimumOnly : y===year ? Math.min(minimumOnly,due) : requiresAnnual ? Math.min(minimumOnly,minimumOnly/divisor) : 0;
  const evenFloor=y===year?due:requiresAnnual?even/divisor:0;
  const customFloor=y===year?due:requiresAnnual?custom/divisor:0;
  const equalDraw=y===endYear?even:Math.min(even,Math.max(even/years,evenFloor));
  const customDraw=y===endYear?custom:Math.min(custom,Math.max(i.custom,customFloor));
  rows.push({year:y,opening:minimumOnly,minimum:minFloor,equal:equalDraw,custom:customDraw,remaining:Math.max(0,minimumOnly-minFloor)});
  even=Math.max(0,even-equalDraw);minimumOnly=Math.max(0,minimumOnly-minFloor);custom=Math.max(0,custom-customDraw);
 }
 return {annual,due,factor,endYear,rows,yearOfDeath:year===i.deathYear,insufficientBalance:due>i.balance};
}
// CMS full Part B and SSA POMS HI 01101.020 (2026), not immunosuppressive-only coverage.
const PART_B=[202.90,284.10,405.80,527.50,649.20,689.90];
const PART_D=[0,14.50,37.50,60.40,83.30,91.00];
const BRACKETS={single:[109000,137000,171000,205000,500000],joint:[218000,274000,342000,410000,750000]};
export type IrmaaInput={agi:number;interest:number;additional:number;status:"single"|"joint"|"separate";apart:boolean;b:boolean;d:boolean;plan:number};
export function irmaa(i:IrmaaInput){
 if (![i.agi,i.interest,i.additional].every(n=>finiteRange(n,0,10_000_000)) || !finiteRange(i.plan,0,2000)) return {error:"Use finite, nonnegative income and plan premiums within the field limits."};
 const special=i.status==="separate"&&!i.apart;
 const bounds=BRACKETS[i.status==="joint"?"joint":"single"];
 const tier=(n:number)=>special?(n<=109000?0:n<391000?4:5):n<=bounds[0]?0:n<=bounds[1]?1:n<=bounds[2]?2:n<=bounds[3]?3:n<bounds[4]?4:5;
 const magi=i.agi+i.interest, scenario=magi+i.additional;
 const cost=(n:number)=>{const t=tier(n);const partB=i.b?PART_B[t]:0, partD=i.d?PART_D[t]:0;return {tier:t,partB,partD,monthly:partB+partD+(i.d?i.plan:0),annualSurcharge:12*((i.b?PART_B[t]-PART_B[0]:0)+partD)};};
 const thresholds=special?[109000,391000]:bounds;
 const next=thresholds.find(n=>n>=magi && (n!==thresholds[thresholds.length-1] || n>magi));
 return {magi,scenario,base:cost(magi),changed:cost(scenario),headroom:next===undefined?null:Math.max(0,next-magi),next};
}
export const MAX_CSV_BYTES=1_000_000, MAX_CSV_ROWS=10000, MAX_CSV_CELL=500;
export function parseCsv(text:string,delimiter=","):string[][]{
 const rows:string[][]=[];let row:string[]=[],cell="",quoted=false,closed=false;
 const pushCell=()=>{if(cell.length>MAX_CSV_CELL)throw Error("A cell exceeds 500 characters.");row.push(cell);cell="";closed=false;};
 const pushRow=()=>{pushCell();if(row.some(v=>v.trim()))rows.push(row);row=[];if(rows.length>MAX_CSV_ROWS+1)throw Error("The file exceeds 10,000 data rows.");};
 text=text.replace(/^\uFEFF/,"");
 for(let x=0;x<text.length;x++){
  const c=text[x];
  if(quoted){if(c==='"'){if(text[x+1]==='"'){cell+='"';x++;}else{quoted=false;closed=true;}}else cell+=c;}
  else if(c==='"'){if(cell.trim()||closed)throw Error("Unexpected quote in a CSV field.");quoted=true;}
  else if(c===delimiter)pushCell();
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[x+1]==='\n')x++;pushRow();}
  else {if(closed&&!/\s/.test(c))throw Error("Unexpected text after a quoted field.");if(!closed)cell+=c;}
  if(cell.length>MAX_CSV_CELL)throw Error("A cell exceeds 500 characters.");
 }
 if(quoted)throw Error("A quoted field is not closed.");if(cell.length||row.length)pushRow();
 if(!rows.length)throw Error("The file is empty.");const width=rows[0].length;
 if(!width||width>100)throw Error("Use a CSV with at most 100 columns.");
 if(rows.some(r=>r.length!==width))throw Error("Rows have different numbers of columns. Check the delimiter and quotes.");
 return rows;
}
export type MileageMap={date:number;destination:number;purpose:number;miles:number;start:number;end:number};
export function calendarDate(text:string,format:"iso"|"us"){
 const m=format==="iso"?/^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim()):/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text.trim());if(!m)return null;
 const [y,mo,d]=format==="iso"?[+m[1],+m[2],+m[3]]:[+m[3],+m[1],+m[2]];const date=new Date(Date.UTC(y,mo-1,d));return date.getUTCFullYear()===y&&date.getUTCMonth()===mo-1&&date.getUTCDate()===d?`${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`:null;
}
export function checkMileage(rows:string[][],map:MileageMap,format:"iso"|"us",year:number){
 const seen=new Map<string,number>();let total=0,complete=0,excluded=0;
 const output=rows.slice(1).map((r,index)=>{
  const cell=(k:keyof MileageMap)=>map[k]>=0?(r[map[k]]??"").trim():"";
  const issues:string[]=[];const date=calendarDate(cell("date"),format);
  if(!date)issues.push("Missing or invalid date");else if(+date.slice(0,4)!==year)issues.push("Outside selected year");
  if(!cell("destination"))issues.push("Missing destination");if(!cell("purpose"))issues.push("Missing business purpose");
  const raw=cell("miles");const start=cell("start"),end=cell("end");
  const a=Number(start),b=Number(end);
  const odometerValid=Boolean(start&&end)&&finiteRange(a,0,1e8)&&finiteRange(b,0,1e8)&&b>=a;
  let miles=raw?Number(raw):odometerValid?b-a:NaN;
  if(!finiteRange(miles,0.000001,10000)){issues.push("Missing or invalid business miles");miles=NaN;excluded++;}else total+=miles;
  if(start||end){if(!odometerValid)issues.push("Review odometer values");else if(raw&&Number.isFinite(miles)&&Math.abs(b-a-miles)>0.01)issues.push("Review odometer/distance difference");}
  const key=JSON.stringify([date,cell("destination").toLowerCase(),cell("purpose").toLowerCase(),miles]);
  if(date&&Number.isFinite(miles)&&cell("destination")&&cell("purpose")){const previous=seen.get(key);if(previous)issues.push(`Possible duplicate of row ${previous}`);else seen.set(key,index+2);}
  if(!issues.length)complete++;
  return {row:index+2,date:date??cell("date"),miles:Number.isFinite(miles)?miles:null,issues};
 });return {rows:output,total,complete,excluded};
}
export function csvCell(v:unknown){let s=String(v??"");if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
