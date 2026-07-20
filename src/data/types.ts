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

// ---- Compliance Alerts vertical (/compliance/) ------------------------------------------------
// A ComplianceAlert is one "new law/rule imposes an obligation on businesses" explainer page.
// Mirrors SpokeEntry's SEO/content shape, plus the structured-obligation fields that drive the
// above-the-fold summary box and the professional-matching lead form.

/** Which professional a business needs to comply — drives lead tagging + routing. */
export type ProfessionalType = "attorney" | "cpa" | "consultant" | "tech";

/** Controlled category vocabulary (kept tight so the pillar-page grouping stays usable). */
export type ComplianceCategory =
  | "Employment & Labor"
  | "Tax & Finance"
  | "Privacy & Data"
  | "Licensing & Professions"
  | "Environment & Energy"
  | "Consumer Protection"
  | "Healthcare"
  | "Insurance"
  | "Real Estate & Housing"
  | "Transportation";

export interface ComplianceAlert {
  /** URL slug → /compliance/<slug>/ */
  slug: string;

  // ---- SEO meta ----
  title: string; // ≤60 chars
  metaDescription: string; // ≤160 chars
  targetKeyword: string;
  h1: string;
  /** AEO: opens with a complete, self-contained sentence. */
  intro: string;

  // ---- Structured obligation (the above-the-fold summary box) ----
  /** "Federal" or a state name, e.g. "California". */
  jurisdiction: string;
  /** Enforcing agency, e.g. "FinCEN (U.S. Treasury)". */
  agency: string;
  /** Law/rule identifier, e.g. "Corporate Transparency Act, 31 U.S.C. § 5336". */
  citation: string;
  /** Primary-source URL for the citation (must load — verified at audit time). */
  citationUrl: string;
  /** Who must comply, with thresholds, e.g. "Employers with 25+ Massachusetts employees". */
  whoMustComply: string;
  /** The affirmative duty in one line: file / register / disclose / post / upgrade … */
  actionRequired: string;
  /** When the obligation starts, e.g. "2026-01-01" or "In effect". */
  effectiveDate: string;
  /** Filing/compliance deadline if distinct from the effective date. */
  deadline?: string;
  /** What non-compliance costs, e.g. "Up to $591/day in civil penalties". */
  penalty: string;
  /** high = act now (≤90 days / already in effect), medium = this year, low = further out. */
  urgency: "high" | "medium" | "low";
  category: ComplianceCategory;
  /** Which professionals a business should be matched with for this obligation. */
  recommendedProfessionals: ProfessionalType[];

  // ---- Page content ----
  /** "What changed" — the new law/rule in plain English. */
  whatChanged: string;
  /** "Who is affected" — thresholds, exemptions, edge cases. */
  whoIsAffected: string;
  /** Ordered, concrete compliance steps. */
  complianceSteps: string[];
  faqs: FAQ[];
  /** Authoritative primary sources cited on the page (E-E-A-T). */
  sources?: Source[];
  /** Sibling alert slugs for cross-linking. REQUIRED non-empty before publish (no-orphan rule). */
  relatedSlugs: string[];
  /** Optional per-page reviewer override (attorney byline). Falls back to REVIEWER. */
  reviewer?: Reviewer;
  /** Staged but not yet published (excluded from getStaticPaths + pillar grid). */
  draft?: boolean;
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
