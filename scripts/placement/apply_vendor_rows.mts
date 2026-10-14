/**
 * Append vendor rows to a published roundup's comparison table from a reviewed rows file
 * (port of thehoaguide apply_vendor_rows.mjs).
 *
 * Reads reports/vendor-roundup/rows/<vertical>.json:
 *   { "slug": "<roundupSlug>",
 *     "rows": [ { "name", "domain", "url", "values": [ one cell per comparisonTable header ] } ],
 *     "cut":  [ { "domain", "why" } ] }
 * and does the things that must land together:
 *   1. appends each row to data/roundup-vendors.json pages[<slug>].added (rendered under the
 *      editorial rows of the page's ONE comparison table; the roundup's .ts file is untouched)
 *   2. marks every cut domain status='dead' so it never re-enters tomorrow's pool
 * Idempotent: a domain already in the table is skipped.
 *
 *   npx -y tsx scripts/placement/apply_vendor_rows.mts <vertical> [--dry-run]
 *   (SUPABASE_* needed only for step 2; without them the cut list is reported, not written)
 */
import { readFileSync } from "node:fs";
import { listedDomains, normalizeDomain, patch, readVendors, roundup, verticalById, writeVendors } from "./lib.mts";

const vertical = process.argv[2];
const dryRun = process.argv.includes("--dry-run");
if (!vertical) throw new Error("usage: apply_vendor_rows.mts <vertical> [--dry-run]");
const v = verticalById(vertical);
if (!v?.roundupSlug) throw new Error(`unknown vertical or no roundupSlug: ${vertical}`);
const entry = roundup(v.roundupSlug);
if (!entry) throw new Error(`roundup ${v.roundupSlug} not found (or draft) in src/data/roundups*.ts`);
const spec = JSON.parse(readFileSync(`reports/vendor-roundup/rows/${vertical}.json`, "utf8"));
if (spec.slug !== v.roundupSlug) throw new Error(`rows file slug ${spec.slug} != vertical roundupSlug ${v.roundupSlug}`);

const headers = entry.comparisonTable.headers;
const today = new Date().toISOString().slice(0, 10);
const BANNED_CELL = /see vendor site|check vendor site|visit (the )?(vendor|website)|tbd|lorem/i;
for (const r of spec.rows) {
  for (const k of ["name", "domain", "url"]) if (!r[k] || typeof r[k] !== "string") throw new Error(`row ${r.name || r.domain}: missing ${k}`);
  if (!/^https?:\/\//.test(r.url)) throw new Error(`row ${r.name}: url must be absolute`);
  if (normalizeDomain(r.url) !== normalizeDomain(r.domain) && !normalizeDomain(r.url).endsWith("." + normalizeDomain(r.domain)))
    throw new Error(`row ${r.name}: url ${r.url} is not on ${r.domain}`);
  if (!Array.isArray(r.values) || r.values.length !== headers.length)
    throw new Error(`row ${r.name}: needs ${headers.length} values, one per header (${headers.join(" / ")})`);
  r.values.forEach((cell: string, i: number) => {
    if (!cell || typeof cell !== "string") throw new Error(`row ${r.name}: empty "${headers[i]}" — put the real figure or "Not published"`);
    if (BANNED_CELL.test(cell)) throw new Error(`row ${r.name}: "${headers[i]}" defers to the vendor ("${cell}") — put the real figure or "Not published"`);
  });
}

const data = readVendors();
const page = (data.pages[v.roundupSlug] ??= { domains: {}, added: [] });
const listed = listedDomains(v.roundupSlug);
const added: string[] = [];
const skipped: string[] = [];
for (const r of spec.rows) {
  const d = normalizeDomain(r.domain);
  if (listed.has(d)) { skipped.push(r.name); continue; }
  listed.add(d);
  page.added.push({ name: r.name, domain: d, url: r.url, values: r.values, added: today });
  added.push(r.name);
}
if (!dryRun && added.length) writeVendors(data);

const cutDone: string[] = [];
for (const c of spec.cut || []) {
  if (dryRun || !process.env.SUPABASE_URL) break;
  const n = await patch(c.domain, { status: "dead", notes: `cut from ${spec.slug} ${today}: ${c.why}` });
  if (n) cutDone.push(c.domain);
}

console.log(`${spec.slug}  (/roundup/${spec.slug}/)`);
console.log(`  added   ${added.length}: ${added.join(", ") || "—"}`);
if (skipped.length) console.log(`  already ${skipped.length}: ${skipped.join(", ")}`);
if (spec.cut?.length) console.log(`  cut     ${spec.cut.length}: ${spec.cut.map((c: any) => `${c.domain} (${c.why})`).join("; ")}  [marked dead: ${cutDone.length}]`);
if (dryRun) console.log("  DRY RUN — nothing written");
