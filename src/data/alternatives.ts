// "<Product> Alternatives" pages (daily alternatives routine, owner rules 2026-11-13).
//
// Content: src/data/alternatives.json (an array of AlternativesPage, appended by the routine).
// Registry: data/alternatives-pages.json. A content entry renders at /alternatives/<slug>/ ONLY
// when the registry lists that route; the registry row also supplies the hosts the page may link.
// These pages list products and their published prices. They give no financial advice.
import CONTENT from "./alternatives.json";
import REGISTRY from "../../data/alternatives-pages.json";

export interface AlternativesRow {
  /** Product name as the vendor writes it. */
  product: string;
  /** Fees / pricing exactly as the vendor's own site publishes them. */
  pricing: string;
  /** Who it fits, in neutral wording ("fits people who…"). */
  bestFit: string;
  /** true on the ONE row for the page's subject product. */
  subject?: boolean;
}

export interface AlternativesSection {
  heading: string;
  /** Paragraphs separated by a blank line; a block of lines starting "- " renders as a list.
   *  Inline links: [text](/internal/path/) or [text](https://<official host>/…). */
  body: string;
}

export interface AlternativesPage {
  slug: string;
  /** The subject product, e.g. "Chime". Title and H1 must start with "<product> Alternatives". */
  product: string;
  /** The subject's official site. The ONLY external link on the page. */
  officialUrl: string;
  title: string;
  h1: string;
  metaDescription: string;
  /** ISO yyyy-mm-dd. */
  published: string;
  updated?: string;
  /** Answers "what should I use instead of <product>?" in the first two sentences. */
  intro: string;
  tableTitle: string;
  /** Optional short line above the table, e.g. "Prices from each provider's own site, checked November 13, 2026." */
  tableNote?: string;
  /** Column labels: product, pricing, best fit. */
  tableColumns?: [string, string, string];
  /** Subject first, then 5-8 alternatives. */
  rows: AlternativesRow[];
  /** The second section (first body section after the table). The "Want to be added" CTA band
   *  renders at its end. Usually "How to choose a <product> alternative". */
  chooseSection: AlternativesSection;
  /** One short section per alternative. */
  alternatives: AlternativesSection[];
  /** "When <product> is still the better fit". */
  stillBetterFit: AlternativesSection;
  verdict: string;
  /** 3-5 FAQs (FAQPage JSON-LD). */
  faqs: { question: string; answer: string }[];
  /** Optional internal links only: {label, href: "/path/"}. */
  related?: { label: string; href: string }[];
}

export interface AlternativesRegistryRow {
  route: string;
  vendorHost: string;
  officialHosts: string[];
}

export const ALTERNATIVES_REGISTRY: AlternativesRegistryRow[] =
  (REGISTRY as { pages: AlternativesRegistryRow[] }).pages ?? [];

export const alternativesRoute = (slug: string) => `/alternatives/${slug}/`;

export function registryRow(slug: string): AlternativesRegistryRow | undefined {
  const route = alternativesRoute(slug);
  return ALTERNATIVES_REGISTRY.find((r) => r.route === route);
}

/** Every content entry that has a registry row (only these render). */
export const ALTERNATIVES: AlternativesPage[] = (CONTENT as AlternativesPage[]).filter((p) => registryRow(p.slug));
