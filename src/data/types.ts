// Shared content/SEO types for the hub-and-spoke architecture.
// One CalculatorDef per category hub (targets the head term); many SpokeEntry per calculator
// (each targets a winnable long-tail intent and pre-configures the same calculator).

export interface FAQ {
  question: string;
  answer: string;
}

/** An authoritative external citation (primary source) shown in a "Sources" section + JSON-LD. */
export interface Source {
  label: string;
  url: string;
}

export interface CalculatorDef {
  /** category slug + island key, e.g. "auto-loan" → /auto-loan/ */
  id: string;
  /** Key into the island registry (src/components/islands.ts). A calculator is "live" iff it has one. */
  islandId: string;
  /** short label for nav/cards/breadcrumbs, e.g. "Auto Loan" */
  label: string;
  navOrder: number;

  // ---- Hub-page SEO (targets the head term) ----
  metaTitle: string; // ≤60 chars
  metaDescription: string; // ≤160 chars
  targetKeyword: string; // the head term, e.g. "auto loan calculator"
  h1: string;
  /** AEO: opens with a complete, self-contained sentence. */
  intro: string;

  // ---- Hub-page content ----
  howItWorks: string;
  faqs: FAQ[];
  /** Authoritative primary sources cited on the page (E-E-A-T). */
  sources?: Source[];

  /** Initial inputs for the hub's live calculator. Shape is calculator-specific. */
  defaultPreset: Record<string, unknown>;
}

export interface SpokeEntry {
  /** which calculator/category this belongs under, e.g. "auto-loan" */
  calculator: string;
  /** intent slug → /<calculator>/<slug>, e.g. "payoff-calculator" */
  slug: string;

  // ---- SEO meta ----
  title: string; // ≤60 chars
  metaDescription: string; // ≤160 chars
  targetKeyword: string;
  estimatedVolume?: number;
  estimatedKD?: number;

  // ---- Page content ----
  h1: string;
  intro: string;
  /** "How it's calculated" — the methodology, in plain language. */
  howItWorks: string;
  commonMistakes: string[];
  /** Optional narrative worked example (build-time numbers get injected around it). */
  workedExample?: string;
  faqs: FAQ[];
  /** Authoritative primary sources cited on the page (E-E-A-T). */
  sources?: Source[];

  // ---- Tool customization ----
  toolHeading?: string;
  toolSubheading?: string;
  /** Calculator-specific initial inputs for this intent. */
  preset: Record<string, unknown>;
  /** Curated sibling slugs (within the same calculator) for cross-linking. */
  relatedSlugs?: string[];
}
