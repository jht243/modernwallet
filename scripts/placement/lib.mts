// Shared helpers for the vendor-roundup routine (port of thehoaguide scripts/placement/lib.mjs).
// fleet_placement_prospects rows for this site; the roundup tables' vendor data in
// data/roundup-vendors.json (editorial rows' domains + the rows this routine added).
// Run with: npx -y tsx scripts/placement/<script>.mts
import { readFileSync, writeFileSync } from "node:fs";
import { ROUNDUPS } from "../../src/data/roundups.ts";

export const VERTICALS_FILE = "data/placement-verticals.json";
export const VENDORS_FILE = "data/roundup-vendors.json";
export const config = JSON.parse(readFileSync(VERTICALS_FILE, "utf8"));
export const SITE: string = config.site;
export const BASE_URL: string = config.baseUrl;
export type Vertical = { id: string; label: string; topic: string; roundupSlug: string | null; keywords: string[] };
export const verticalById = (id: string): Vertical | undefined => config.verticals.find((v: Vertical) => v.id === id);
export const pageUrl = (v: Vertical) => `${BASE_URL}/roundup/${v.roundupSlug}/`;

export function normalizeDomain(input: string): string {
  return String(input || "").trim().toLowerCase()
    .replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "").replace(/\.$/, "");
}

/** The live (non-draft) roundup entry, or undefined. */
export const roundup = (slug: string) => ROUNDUPS.find((r) => r.slug === slug && !r.draft);

export type Added = { name: string; domain: string; url: string; values: string[]; added?: string };
export type Page = { domains: Record<string, string>; added: Added[] };
export function readVendors(): { _note: string; pages: Record<string, Page> } {
  return JSON.parse(readFileSync(VENDORS_FILE, "utf8"));
}
export function writeVendors(data: ReturnType<typeof readVendors>) {
  writeFileSync(VENDORS_FILE, JSON.stringify(data, null, 1) + "\n");
}

/** Every company on the page's table: domain -> name (editorial rows with a domain + added rows). */
export function listedOn(slug: string): Map<string, string> {
  const page = readVendors().pages[slug];
  const out = new Map<string, string>();
  if (!page) return out;
  for (const [name, d] of Object.entries(page.domains)) if (!out.has(normalizeDomain(d))) out.set(normalizeDomain(d), name);
  for (const a of page.added) out.set(normalizeDomain(a.domain), a.name);
  return out;
}
export const listedDomains = (slug: string) => new Set(listedOn(slug).keys());

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const TABLE = "fleet_placement_prospects";
export function requireSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
    process.exit(2);
  }
}
const h = (extra: Record<string, string> = {}) => ({ "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, ...extra });
const q = (query: string) => `${SUPABASE_URL}/rest/v1/${TABLE}?site=eq.${encodeURIComponent(SITE)}&${query}`;

export async function select(query: string): Promise<any[]> {
  const r = await fetch(q(query), { headers: h() });
  if (!r.ok) throw new Error(`${TABLE} read ${r.status}: ${await r.text()}`);
  return r.json();
}
export async function patch(domain: string, fields: Record<string, unknown>): Promise<number> {
  const r = await fetch(q(`domain=eq.${encodeURIComponent(normalizeDomain(domain))}`), {
    method: "PATCH", headers: h({ Prefer: "return=representation" }),
    body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`${TABLE} patch ${r.status}: ${await r.text()}`);
  return (await r.json()).length;
}
/** Insert rows that are not tracked yet; existing (site, domain) rows are never touched. */
export async function insertMissing(rows: Array<Record<string, unknown>>): Promise<number> {
  if (!rows.length) return 0;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=site,domain`, {
    method: "POST", headers: h({ Prefer: "resolution=ignore-duplicates,return=representation" }),
    body: JSON.stringify(rows.map((x) => ({ site: SITE, ...x }))),
  });
  if (!r.ok) throw new Error(`${TABLE} insert ${r.status}: ${await r.text()}`);
  return (await r.json()).length;
}

/**
 * The roundup inclusion bar: classified (vendor OR unknown), not dead/suppressed. Email NOT
 * required. The routine reviews every 'unknown' row on its homepage and CUTS the publishers
 * (cut[] -> status 'dead'). 'publisher' rows are already dead.
 */
export const qualified = (vertical: string) => select(
  `select=*&vertical=eq.${encodeURIComponent(vertical)}&site_kind=in.(vendor,unknown)&status=not.in.(dead,suppressed)` +
  `&order=priority.desc.nullslast,serp_rank.asc.nullslast,first_seen.asc&limit=500`);
