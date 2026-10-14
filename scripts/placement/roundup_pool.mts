/**
 * Phase 2+3 of /vendor-roundup-auto, deterministic (port of thehoaguide roundup_pool.mjs).
 *
 * For every vertical in data/placement-verticals.json: read the qualified vendor pool from
 * fleet_placement_prospects, diff it against the companies ALREADY in that roundup's table
 * (data/roundup-vendors.json, by domain), and route it:
 *   ENRICH — has a roundupSlug and >= 1 qualified vendor missing from its table
 *   BUILD  — no roundupSlug and >= 4 qualified vendors (the honest-roundup floor)
 *   ACCRUE — otherwise
 * Writes reports/vendor-roundup/pool.json and prints the chart. Read-only. NO cap.
 *
 *   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… npx -y tsx scripts/placement/roundup_pool.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { config, listedDomains, normalizeDomain, qualified, requireSupabase, roundup, type Vertical } from "./lib.mts";

requireSupabase();
const BUILD_FLOOR = 4;
const rows: any[] = [];
for (const v of config.verticals as Vertical[]) {
  const pool = await qualified(v.id);
  if (v.roundupSlug && !roundup(v.roundupSlug)) {
    rows.push({ vertical: v.id, label: v.label, roundupSlug: v.roundupSlug, route: "ACCRUE", qualified: pool.length, listed: 0, missing: [],
      note: `roundupSlug ${v.roundupSlug} NOT FOUND in src/data/roundups*.ts — hard blocker` });
    continue;
  }
  const listed = v.roundupSlug ? listedDomains(v.roundupSlug) : new Set<string>();
  const missing = pool.filter((p) => !listed.has(normalizeDomain(p.domain))).map((p) => ({
    domain: normalizeDomain(p.domain), name: p.name, site_url: p.site_url, one_liner: p.one_liner,
    site_kind: p.site_kind, has_pricing: p.has_pricing, serp_rank: p.serp_rank, primary_email: p.primary_email,
  }));
  let route = "ACCRUE";
  if (v.roundupSlug && missing.length) route = "ENRICH";
  else if (!v.roundupSlug && pool.length >= BUILD_FLOOR) route = "BUILD";
  rows.push({ vertical: v.id, label: v.label, roundupSlug: v.roundupSlug, route, qualified: pool.length, listed: pool.length - missing.length, missing });
}

mkdirSync("reports/vendor-roundup", { recursive: true });
writeFileSync("reports/vendor-roundup/pool.json", JSON.stringify({ generated: new Date().toISOString(), rows }, null, 2) + "\n");
console.log("vertical | route | qualified | listed | missing | slug");
for (const r of rows) console.log(`${r.vertical} | ${r.route} | ${r.qualified} | ${r.listed} | ${r.missing.length} | ${r.roundupSlug ?? "—"}${r.note ? " | " + r.note : ""}`);
const enrich = rows.filter((r) => r.route === "ENRICH");
const build = rows.filter((r) => r.route === "BUILD");
console.log(`\nENRICH ${enrich.length} verticals (${enrich.reduce((n, r) => n + r.missing.length, 0)} rows) · BUILD ${build.length} · ACCRUE ${rows.length - enrich.length - build.length}`);
console.log("→ reports/vendor-roundup/pool.json");
