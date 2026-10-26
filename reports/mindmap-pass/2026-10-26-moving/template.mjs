// Templates the audited moving-checklist draft into the spoke store (mindmap-pass 2026-10-26).
// Run: node reports/mindmap-pass/2026-10-26-moving/template.mjs
// Appends (or replaces) the moving-checklist entry in src/data/spokes-checklists.ts; every other entry is left untouched.
import fs from "fs";
import * as L from "../../../src/lib/checklists.ts";

const R = new URL("./", import.meta.url);
const d = JSON.parse(fs.readFileSync(new URL("drafts/moving-checklist.json", R), "utf8"));
const sources = [...new Set(L.SECTIONS.moving.flatMap((s) => s.items.map((i) => i.src).filter(Boolean)))].map((k) => L.SOURCES[k]);
const spoke = {
  calculator: "checklists",
  slug: "moving-checklist",
  updated: "2026-10-26",
  title: d.title,
  metaDescription: d.metaDescription,
  targetKeyword: "moving checklist",
  estimatedVolume: 12100,
  estimatedKD: 32,
  h1: d.h1,
  introText: d.introText,
  toolHeading: d.toolHeading,
  toolSubheading: d.toolSubheading,
  howItWorks: d.howItWorks,
  workedExample: d.workedExample,
  commonMistakes: d.commonMistakes,
  faqs: d.faqs,
  sources,
  preset: { checklist: "moving" },
  relatedSlugs: ["renting-checklist", "home-buying-checklist", "move-in-move-out-checklist"],
};
const path = new URL("../../../src/data/spokes-checklists.ts", R);
let ts = fs.readFileSync(path, "utf8");
const START = "  // moving-checklist — mindmap-pass 2026-10-26 (reports/mindmap-pass/2026-10-26-moving/drafts/moving-checklist.json)\n";
const body = START + "  " + JSON.stringify(spoke, null, 2).replace(/\n/g, "\n  ") + ",\n";
if (ts.includes(START)) {
  const a = ts.indexOf(START);
  const b = ts.indexOf("\n];", a);
  ts = ts.slice(0, a) + body + ts.slice(b + 1);
} else {
  const end = ts.lastIndexOf("\n];");
  const before = ts.slice(0, end).replace(/\}\s*$/, "},");
  ts = before + "\n" + body + "];\n";
}
fs.writeFileSync(path, ts);
console.log("templated moving-checklist with", sources.length, "sources");
