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

/** Optional per-page reviewer override for YMYL legal/tax pages (attorney byline + Article `reviewedBy`). */
export interface Reviewer {
  name: string;
  credentials: string;
  url?: string;
}

/** A U.S. state entry used by the state-subpage route (`/[category]/[slug]/[state]/`). */
export interface StateContext {
  /** URL slug, e.g. "california" */
  slug: string;
  /** Display name, e.g. "California" */
  name: string;
  /** USPS 2-letter code, e.g. "CA" */
  usps: string;
  /** 2–3 paragraphs of state-specific law/cost context, rendered on the state subpage. */
  lawContext?: string;
  /** Multiplier applied to the parent spoke's baseline cost estimate for this state. Default 1.0. */
  costFactor?: number;
  /** Optional short note surfaced in cards/comparisons (e.g. "community property state"). */
  notes?: string;
}

/** Per-state content override for a specific spoke × state combination.
 *  Lives in the spoke's own overrides file (e.g. `src/data/oic-state-overrides.ts`).
 *  When present, the state-subpage route uses these fields in place of template defaults —
 *  the mechanism that lets each state page have its own bespoke Phase-3 content. */
export interface StateOverride {
  /** Full page title (≤ 60 chars). Falls back to the templated `${targetKeyword} — ${state.name} | ${SITE.name}` if unset. */
  title?: string;
  /** Meta description (≤ 160 chars). */
  metaDescription?: string;
  /** H1 heading. */
  h1?: string;
  /** State-specific intro paragraph — replaces the templated wrapper around the parent spoke intro. */
  intro?: string;
  /** State-specific law + cost context — replaces `state.lawContext` on the page. */
  lawContext?: string;
  /** Any state-specific additional FAQs. Merged with the parent spoke's faqs on the state page. */
  extraFaqs?: FAQ[];
  /** Any state-specific additional sources. Merged with the parent spoke's sources. */
  extraSources?: Source[];
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
  /** Override the island this spoke renders (defaults to the calculator's islandId). Lets a spoke
   *  use a different tool than its category — e.g. an affordability tool under /auto-loan/. */
  islandId?: string;
  /** Calculator-specific initial inputs for this intent. */
  preset: Record<string, unknown>;
  /** Curated sibling slugs (within the same calculator) for cross-linking. */
  relatedSlugs?: string[];
  /** State slugs this spoke has variants for. When set, the `[category]/[slug]/[state]` route
   *  generates one page per state, pre-filled with state-specific defaults + law context. */
  stateVariants?: string[];
  /** Optional page-level reviewer override (attorney byline on legal pages). Falls back to the
   *  category-level default if unset. */
  reviewer?: Reviewer;
}
