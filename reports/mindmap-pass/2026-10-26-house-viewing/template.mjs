// Templates the audited house-viewing draft into src/data/spokes-checklists.ts (mindmap-pass 2026-10-26).
// Run: node reports/mindmap-pass/2026-10-26-house-viewing/template.mjs — re-running replaces the entry.
import fs from "fs";
import * as L from "../../../src/lib/checklists.ts";

const R = new URL("./", import.meta.url);
const d = JSON.parse(fs.readFileSync(new URL("drafts/house-viewing-checklist.json", R), "utf8"));
const vols = JSON.parse(fs.readFileSync(new URL("../2026-10-26-house-viewing.volumes.json", R), "utf8"));
const KW = "questions to ask when viewing a house";

const srcKeys = new Set();
for (const s of L.SECTIONS["house-viewing"]) for (const it of s.items) if (it.src) srcKeys.add(it.src);

const entry = {
  calculator: "checklists",
  slug: "house-viewing-checklist",
  updated: "2026-10-26",
  title: d.title,
  metaDescription: d.metaDescription,
  targetKeyword: KW,
  estimatedVolume: vols[KW]?.volume,
  estimatedKD: vols[KW]?.kd,
  h1: d.h1,
  introText: d.introText,
  toolHeading: d.toolHeading,
  toolSubheading: d.toolSubheading,
  howItWorks: d.howItWorks,
  workedExample: d.workedExample,
  commonMistakes: d.commonMistakes,
  faqs: d.faqs,
  sources: [...srcKeys].map((k) => L.SOURCES[k]),
  islandId: "house-viewing",
  preset: { checklist: "house-viewing" },
  relatedSlugs: ["home-buying-checklist", "home-inspection-checklist", "final-walkthrough-checklist"],
};

const p = new URL("../../../src/data/spokes-checklists.ts", R);
let ts = fs.readFileSync(p, "utf8");
const START = "  // House viewing checklist — mindmap-pass 2026-10-26 (reports/mindmap-pass/2026-10-26-house-viewing/template.mjs).";
const END = "  // /House viewing checklist";
const block = `${START}\n  ${JSON.stringify(entry, null, 2).replace(/\n/g, "\n  ")},\n${END}\n`;
if (ts.includes(START)) ts = ts.slice(0, ts.indexOf(START)) + block + ts.slice(ts.indexOf(END) + END.length + 1);
else ts = ts.replace(/\n\];\s*$/, `\n${block}];\n`);
fs.writeFileSync(p, ts);
console.log("templated house-viewing-checklist");
