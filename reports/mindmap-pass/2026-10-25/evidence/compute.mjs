// Reproducible counts behind each checklist page's worked example. Run: node reports/mindmap-pass/2026-10-25/evidence/compute.mjs
import * as L from "../../../../src/lib/checklists.ts";
const P = (o) => ({ ...L.DEFAULT_PROFILE, ...o });
const loc = (st, city) => ({ state: st, city, ...L.climateDefaults(st) });
const ids = (id, p) => L.buildChecklist(id, p).flatMap((s) => s.items.map((i) => i.id));
const lib = (id) => (L.SECTIONS[id] ?? []).reduce((n, s) => n + s.items.length, 0);
const out = {};
const scen = {
  "home-buying": [
    ["miami-condo-fha", P({ ...loc("FL", "Miami"), propertyType: "condo", era: "2000+", loan: "fha", firstTime: true })],
    ["minneapolis-1962-house-conventional", P({ ...loc("MN", "Minneapolis"), propertyType: "single-family", era: "1950-1977", loan: "conventional", firstTime: false })],
  ],
  "home-selling": [
    ["agent-owner-occupied-2005-house", P({ ...loc("OH", "Columbus"), era: "2000+", agent: "agent", occupancy: "owner" })],
    ["fsbo-vacant-1965-house-freeze", P({ ...loc("IL", "Chicago"), era: "1950-1977", agent: "fsbo", occupancy: "vacant" })],
  ],
  renting: [
    ["miami-complex-apartment", P({ ...loc("FL", "Miami"), propertyType: "apartment", era: "2000+", pets: false, car: true })],
    ["denver-house-1970-pet", P({ ...loc("CO", "Denver"), propertyType: "single-family", era: "1950-1977", pets: true, car: true })],
  ],
  landlord: [
    ["condo-long-term-self", P({ ...loc("TX", "Austin"), propertyType: "condo", era: "2000+", term: "long", manager: "self" })],
    ["1960-house-furnished-freeze", P({ ...loc("NY", "Buffalo"), propertyType: "single-family", era: "1950-1977", term: "furnished", manager: "self" })],
  ],
  "home-inspection": [
    ["2005-slab-house-phoenix", P({ ...loc("AZ", "Phoenix"), era: "2000+", foundation: "slab" })],
    ["1940-basement-house-boston", P({ ...loc("MA", "Boston"), era: "pre1950", foundation: "basement" })],
  ],
  "final-walkthrough": [
    ["resale-repairs-moved-out", P({ propertyType: "single-family", repairs: true, sellerOut: true })],
    ["new-construction", P({ propertyType: "new-construction", repairs: false, sellerOut: true })],
  ],
};
for (const [id, list] of Object.entries(scen)) {
  out[id] = { library: lib(id), scenarios: {} };
  for (const [name, p] of list) out[id].scenarios[name] = { count: ids(id, p).length, profile: { state: p.state, propertyType: p.propertyType, era: p.era, freeze: p.freeze, hurricane: p.hurricane, wildfire: p.wildfire, earthquake: p.earthquake }, items: ids(id, p) };
}
// Freeze items present?
const has = (id, p, x) => ids(id, p).includes(x);
out.checks = {
  miamiRenterHasFreezeQuestion: has("renting", scen.renting[0][1], "r-q-freeze"),
  denverHouseHasFreezeQuestion: has("renting", scen.renting[1][1], "r-q-freeze"),
  miamiBuyerHasFrozenPipeItem: has("home-buying", scen["home-buying"][0][1], "frz-pipes"),
  minneapolisBuyerHasFrozenPipeItem: has("home-buying", scen["home-buying"][1][1], "frz-pipes"),
  miamiBuyerHasHurricaneItems: has("home-buying", scen["home-buying"][0][1], "hur-roof"),
};
const mio = (o) => { const r = L.roomsFor(P(o)); return { rooms: r.length, items: r.reduce((n, x) => n + x.items.length, 0) }; };
out["move-in-move-out"] = { studioApartment: mio({ propertyType: "apartment", bedrooms: 0, bathrooms: 1 }), threeBedHouseAllFeatures: mio({ propertyType: "single-family", bedrooms: 3, bathrooms: 2, laundry: true, dishwasher: true, garage: true, yard: true }) };
const shop = (o) => { const s = L.buildShopping(P(o)); const it = s.flatMap((x) => x.items); return { items: it.length, dayOne: it.filter((i) => i.dayOne).length }; };
out["first-apartment"] = { library: L.FIRST_APARTMENT.reduce((n, s) => n + s.items.length, 0), unfurnishedOneBed: shop({ bedrooms: 1, furnished: false }), furnishedStudioRoommates: shop({ bedrooms: 0, furnished: true, roommates: true, laundry: true }) };
out.sourcesCited = Object.keys(L.SOURCES).length;
console.log(JSON.stringify(out, (k, v) => (k === "items" && Array.isArray(v) ? undefined : v), 1));
import("fs").then((fs) => fs.writeFileSync(new URL("./counts.json", import.meta.url), JSON.stringify(out, null, 1)));
