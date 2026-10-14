/**
 * Phase 9 of /vendor-roundup-auto: flag the outreach lane (port of thehoaguide flag_vendors.mjs).
 *
 * Fetches the LIVE roundup and, for every vendor in reports/vendor-roundup/rows/<vertical>.json
 * whose <tr data-vendor-domain="…"> is actually on the live page, sets roundup_slug +
 * roundup_url + roundup_row_added_at on that vendor's fleet_placement_prospects row. That is
 * what makes the vendor eligible for the note sent by growth-sites-api /api/placement-tick.
 * Never flag a row that is not live: the note is built from the live page.
 *
 *   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… npx -y tsx scripts/placement/flag_vendors.mts <vertical> [--all-listed] [--register]
 *   --all-listed  flag every company in the page's table, not just this run's rows file
 *   --register    first insert any listed company that has no prospect row yet (editorial rows
 *                 that were never discovered), so it gets an email lookup and a note too
 */
import { existsSync, readFileSync } from "node:fs";
import { insertMissing, listedOn, normalizeDomain, pageUrl, patch, requireSupabase, verticalById } from "./lib.mts";

requireSupabase();
const vertical = process.argv[2];
if (!vertical) throw new Error("usage: flag_vendors.mts <vertical> [--all-listed] [--register]");
const v = verticalById(vertical);
if (!v?.roundupSlug) throw new Error(`vertical ${vertical} has no roundupSlug`);
const rowsFile = `reports/vendor-roundup/rows/${vertical}.json`;
const nameOf = listedOn(v.roundupSlug);
const domains = process.argv.includes("--all-listed") || !existsSync(rowsFile)
  ? [...nameOf.keys()]
  : JSON.parse(readFileSync(rowsFile, "utf8")).rows.map((r: any) => normalizeDomain(r.domain));

const url = pageUrl(v);
const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "modernwallet-roundup-flag/1" } });
if (res.status !== 200) { console.error(`${url} → HTTP ${res.status}; flagging nothing`); process.exit(1); }
const html = (await res.text()).toLowerCase();

if (process.argv.includes("--register")) {
  const n = await insertMissing(domains.map((d: string) => ({
    domain: d, name: nameOf.get(d) || d, site_url: `https://${d}/`, vertical: v.id, status: "new",
    site_kind: "vendor", priority: 50, sources: ["roundup-table"], notes: `listed on ${v.roundupSlug} (registered from the live table)`,
  })));
  console.log(`  registered ${n} new prospect row(s)`);
}

const flagged: string[] = [], notLive: string[] = [], noRow: string[] = [];
const now = new Date().toISOString();
for (const d of domains) {
  if (!html.includes(`data-vendor-domain="${d}"`)) { notLive.push(d); continue; }
  // name <- the brand as listed (discovery stored the SERP title).
  const n = await patch(d, { roundup_slug: v.roundupSlug, roundup_url: url, roundup_row_added_at: now, ...(nameOf.get(d) ? { name: nameOf.get(d) } : {}) });
  (n ? flagged : noRow).push(d);
}
console.log(`${v.roundupSlug}  ${url}  200`);
console.log(`  flagged ${flagged.length}: ${flagged.join(", ") || "—"}`);
if (noRow.length) console.log(`  live but no prospect row ${noRow.length}: ${noRow.join(", ")} (run with --register)`);
if (notLive.length) console.log(`  NOT live ${notLive.length}: ${notLive.join(", ")}`);
process.exit(notLive.length ? 1 : 0);
