// Vendor lane: the roundup comparison table's company rows (data/roundup-vendors.json) and the
// Featured slot (data/paid-placements.json). Used by src/pages/roundup/[slug].astro.
//
// The data-vendor-* attributes the page renders from this are a contract, not decoration:
// growth-sites-api (/api/placement-tick) reads them off the LIVE page to confirm a vendor is
// still listed and to word the outreach note ("We just included X in our guide to <topic>").
// Renaming them silently stops outreach.
import vendors from "../../data/roundup-vendors.json";
import verticals from "../../data/placement-verticals.json";
import paid from "../../data/paid-placements.json";
import { ROBINHOOD_URL, PARTNER_REL } from "../data/partners";

type Row = { name: string; href?: string; values: string[] };
type Added = { name: string; domain: string; url?: string; values: string[] };
type Page = { domains: Record<string, string>; added: Added[] };
type Placement = { domain: string; pages: string[] | "all" };

export interface VendorRow {
  name: string;
  values: string[];
  href?: string;
  rel?: string;
  external: boolean;
  domain?: string;
  featured: boolean;
}

const PAGES = (vendors as { pages: Record<string, Page> }).pages;
const PLACEMENTS = ((paid as { placements: Placement[] }).placements || []);
const norm = (d?: string) => (d || "").toLowerCase().replace(/^www\./, "");
const paidAnywhere = new Set(PLACEMENTS.map((p) => norm(p.domain)));

/** Links that carry our own tracking or referral code (the client / referral partner). */
const OWN_LINKS: Record<string, string> = {
  "robinhood.com": ROBINHOOD_URL,
  "killswitch.rip": "https://killswitch.rip/?utm_source=modern_wallet&utm_medium=article-roundup",
};

function relFor(domain?: string): string {
  const d = norm(domain);
  if (d && (paidAnywhere.has(d) || OWN_LINKS[d])) return d === "robinhood.com" ? PARTNER_REL : "sponsored nofollow noopener";
  return "nofollow noopener";
}

/** The topic for this roundup's vendor table, or null when the roundup is not a vendor category. */
export function vendorTopic(slug: string): string | null {
  const v = (verticals as { verticals: Array<{ roundupSlug: string | null; topic: string }> }).verticals
    .find((x) => x.roundupSlug === slug);
  return v ? v.topic : null;
}

/**
 * The table's rows: Featured (paid) rows first in the order sold, then the editorial rows, then
 * the vendors the routine added. Pages without a vertical render their rows exactly as before.
 */
export function vendorRows(slug: string, rows: Row[]): VendorRow[] {
  const page = PAGES[slug];
  const featuredHere = new Set(
    PLACEMENTS.filter((p) => p.pages === "all" || p.pages.includes(slug)).map((p) => norm(p.domain)),
  );
  const editorial: VendorRow[] = rows.map((r) => {
    const domain = page?.domains[r.name];
    const href = r.href ?? (domain ? OWN_LINKS[norm(domain)] ?? `https://${domain}/` : undefined);
    const external = Boolean(href?.startsWith("http"));
    return {
      name: r.name, values: r.values, href, external, domain,
      rel: external ? (domain ? relFor(domain) : "noopener") : undefined,
      featured: Boolean(domain && featuredHere.has(norm(domain))),
    };
  });
  const added: VendorRow[] = (page?.added || []).map((a) => ({
    name: a.name, values: a.values, domain: a.domain, external: true,
    href: a.url || `https://${a.domain}/`, rel: relFor(a.domain),
    featured: featuredHere.has(norm(a.domain)),
  }));
  const all = [...editorial, ...added];
  return [...all.filter((r) => r.featured), ...all.filter((r) => !r.featured)];
}
