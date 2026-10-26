import * as L from "/Users/jonathanteplitsky/Desktop/Github Projects/Growth Sites/WealthFinance-viewing/src/lib/checklists.ts";
const P=(o)=>({...L.DEFAULT_PROFILE,...L.PRESETS["house-viewing"],...o});
const loc=(st)=>({state:st,...L.climateDefaults(st)});
const sc={ "denver-1965-house":P({...loc("CO"),propertyType:"single-family",era:"1950-1977"}), "miami-2005-condo":P({...loc("FL"),propertyType:"condo",era:"2000+"}), "default-house":P({}) };
const out={library:(L.SECTIONS["house-viewing"]).reduce((n,s)=>n+s.items.length,0)};
for(const [k,p] of Object.entries(sc)){const b=L.buildChecklist("house-viewing",p);out[k]={profile:{state:p.state,type:p.propertyType,era:p.era,freeze:p.freeze,hurricane:p.hurricane,wildfire:p.wildfire,earthquake:p.earthquake},ask:b[0].items.map(i=>i.id),look:b[1].items.map(i=>i.id)};}
console.log(JSON.stringify(out,null,1));
