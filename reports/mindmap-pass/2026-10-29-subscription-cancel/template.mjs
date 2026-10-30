// Register the API-generated cancellation-planner prose without replacing existing spoke data.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const draft = readJson("reports/mindmap-pass/2026-10-29-subscription-cancel/drafts/cancel-subscription-planner.json");
const sourceRows = readJson("reports/mindmap-pass/2026-10-29-subscription-cancel/research/primary-sources.json");
const registryPath = path.join(root, "src/data/spokes-checklists.ts");
let registry = fs.readFileSync(registryPath, "utf8");
if (registry.includes('"slug": "cancel-subscription-planner"')) throw new Error("Planner is already registered; refusing to duplicate it.");

const route = {
  calculator: "checklists",
  slug: "cancel-subscription-planner",
  updated: "2026-10-29",
  title: draft.title,
  metaDescription: draft.metaDescription,
  targetKeyword: "what to do if you can't cancel a subscription",
  h1: draft.h1,
  introText: draft.introText,
  toolHeading: draft.toolHeading,
  toolSubheading: draft.toolSubheading,
  // The approved destination is a specific, inspected section in the budget guide.
  howItWorks: draft.howItWorks.replace(
    "/guides/how-to-budget-for-teens-college-students/",
    "/guides/how-to-budget-for-teens-college-students/#subscription-creep-the-quiet-budget-killer",
  ),
  sectionHeadings: [
    "Find the Company That Bills You",
    "What the Federal Rule Change Means",
    "State and NYC Protections: Selected Examples",
    "Use These Scripts and Keep Proof",
    "If Charges Continue After You Ask",
    "After Cancellation: Check the Next Statement",
  ],
  workedExample: draft.workedExample,
  workedExampleHeading: "Two Hypothetical Paths Through the Planner",
  commonMistakes: draft.commonMistakes,
  commonMistakesHeading: "Common Cancellation Mistakes",
  faqs: draft.faqs,
  sources: sourceRows.map((item) => ({ label: item.source, url: item.url })),
  preset: {},
  relatedSlugs: [],
  suppressRelatedFallback: true,
  islandId: "subscription-cancellation-planner",
  disclaimerText: "This page provides general information, not legal advice. Coverage depends on the service, biller, signup method, location, offer date and contract. Check the current official rule and provider instructions before acting.",
};

const end = registry.lastIndexOf("]; ");
const close = end >= 0 ? end : registry.lastIndexOf("];");
if (close < 0) throw new Error("Could not find the checklist spoke array end.");
const before = registry.slice(0, close).trimEnd();
const separator = before.endsWith(",") ? "" : ",";
const serialized = JSON.stringify(route, null, 2).split("\n").map((line) => `  ${line}`).join("\n");
registry = `${before}${separator}\n  // Mindmap pass (2026-10-29): subscription cancellation rights and route planner.\n${serialized}\n];\n`;
fs.writeFileSync(registryPath, registry);
console.log("Registered /checklists/cancel-subscription-planner/ with", route.sources.length, "official sources.");
