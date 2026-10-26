// Runs the moving checklist's own rules on example moves (mindmap-pass 2026-10-26).
// Run: node reports/mindmap-pass/2026-10-26-moving/evidence/compute.mjs
import fs from "fs";
import * as L from "../../../../src/lib/checklists.ts";
const secs = L.SECTIONS.moving;
const lib = secs.reduce((n, s) => n + s.items.length, 0);
// rule/label parity
const conditional = secs.flatMap((s) => s.items.filter((i) => i.when).map((i) => i.id));
const missing = conditional.filter((id) => !L.ONLY[id]);
const extra = Object.keys(L.ONLY).filter((k) => k.startsWith("mv-") && !conditional.includes(k));
const base = { ...L.DEFAULT_PROFILE, ...L.PRESETS.moving };
const scen = {
  A: { label: "Renter moving across town to another rental, hiring movers, in summer, no kids or pets, Chicago, Illinois", p: { ...base, state: "IL", ...L.climateDefaults("IL"), moveFrom: "rent", moveTo: "rent", distance: "local", method: "movers", season: "summer", kids: false, pets: false, car: true } },
  B: { label: "Homeowner selling in Ohio and buying in Arizona, hiring interstate movers, in winter, with kids and a dog", p: { ...base, state: "AZ", ...L.climateDefaults("AZ"), freeze: true, moveFrom: "own-sell", moveTo: "buy", distance: "interstate", method: "movers", season: "winter", kids: true, pets: true, car: true } },
  C: { label: "Renter moving within Florida with a rental truck, in summer, no kids or pets", p: { ...base, state: "FL", ...L.climateDefaults("FL"), moveFrom: "rent", moveTo: "rent", distance: "in-state", method: "truck", season: "summer", kids: false, pets: false, car: true } },
};
const out = { library: lib, sections: secs.length, conditional: conditional.length, always: lib - conditional.length, parity: { missing, extra }, scenarios: {} };
for (const [k, v] of Object.entries(scen)) {
  const built = L.buildChecklist("moving", v.p);
  out.scenarios[k] = { label: v.label, items: built.reduce((n, s) => n + s.items.length, 0), perSection: Object.fromEntries(built.map((s) => [s.title, s.items.length])), ids: built.flatMap((s) => s.items.map((i) => i.id)) };
}
fs.writeFileSync(new URL("./counts.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify({ ...out, scenarios: Object.fromEntries(Object.entries(out.scenarios).map(([k, v]) => [k, { items: v.items, perSection: v.perSection }])) }, null, 1));
