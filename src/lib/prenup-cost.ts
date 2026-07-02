// Pure prenup-cost engine for /estate-planning/prenup-cost-calculator/.
//   estimatePrenupCost() — takes state + complexity + both-parties-attorney → cost range +
//   state enforceability notes (UPAA/UPMAA, CA 7-day rule, independent counsel).
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - Cost bands (ContractsCounsel + TheKnot + firm surveys, national attorney data):
//     NYC/NY $2,500-$10,000+ per party; CA $3,000-$10,000+ per party; FL $1,500-$5,000;
//     TX $1,500-$5,000; WA $2,500-$8,000; NJ $2,000-$7,500; IL $2,000-$6,000.
//   - UPAA (1983) adopters: ~28 states + DC.
//   - UPMAA (2012) confirmed adopters: Colorado, North Dakota (more introduced but not enacted).
//   - California independent-counsel rule: Cal. Fam. Code §1615(c) — waivers require own counsel.
//   - California 7-day rule: Cal. Fam. Code §1615(c)(2)(B) — 7 days between final agreement
//     presentation and signing.

export type PrenupComplexity = "simple" | "moderate" | "complex";

export interface PrenupCostInput {
  state: string;
  complexity: PrenupComplexity;
  /** Both parties have their own attorneys (required for enforceability in many states, doubles cost). */
  bothPartiesAttorney: boolean;
}

export interface PrenupCostResult {
  costLow: number;
  costHigh: number;
  breakdown: Array<{ item: string; costLow: number; costHigh: number }>;
  /** State enforceability + UPAA/UPMAA + independent-counsel note. */
  stateNote: string;
  /** True if state has adopted UPAA. */
  upaaState: boolean;
  /** True if state has adopted UPMAA (2012). */
  upmaaState: boolean;
  /** True if California-specific rules apply (independent counsel + 7-day waiting period). */
  californiaRules: boolean;
  /** True if community property state (prenup opts out of default community regime). */
  isCommunityProperty: boolean;
}

// ---- Cost tables ----

interface CostBand { low: number; high: number; }

/** Base per-party cost by state (attorney-drafted). If not listed, national baseline applies. */
const PRENUP_COST_PER_PARTY: Record<string, Record<PrenupComplexity, CostBand>> = {
  "new-york": {
    "simple": { low: 2_500, high: 5_000 },
    "moderate": { low: 4_000, high: 7_500 },
    "complex": { low: 6_000, high: 12_000 },
  },
  "california": {
    "simple": { low: 3_000, high: 5_500 },
    "moderate": { low: 4_500, high: 8_000 },
    "complex": { low: 6_500, high: 12_500 },
  },
  "washington": {
    "simple": { low: 2_500, high: 4_500 },
    "moderate": { low: 3_500, high: 6_000 },
    "complex": { low: 5_000, high: 10_000 },
  },
  "new-jersey": {
    "simple": { low: 2_000, high: 4_000 },
    "moderate": { low: 3_500, high: 6_000 },
    "complex": { low: 5_000, high: 9_000 },
  },
  "illinois": {
    "simple": { low: 2_000, high: 4_000 },
    "moderate": { low: 3_000, high: 5_500 },
    "complex": { low: 4_500, high: 8_000 },
  },
  "massachusetts": {
    "simple": { low: 2_000, high: 4_000 },
    "moderate": { low: 3_000, high: 5_500 },
    "complex": { low: 4_500, high: 8_000 },
  },
  "florida": {
    "simple": { low: 1_500, high: 3_000 },
    "moderate": { low: 2_500, high: 4_500 },
    "complex": { low: 3_500, high: 6_500 },
  },
  "texas": {
    "simple": { low: 1_500, high: 3_000 },
    "moderate": { low: 2_500, high: 4_500 },
    "complex": { low: 3_500, high: 6_500 },
  },
};

const NATIONAL_BASELINE: Record<PrenupComplexity, CostBand> = {
  "simple": { low: 1_500, high: 3_500 },
  "moderate": { low: 2_500, high: 5_000 },
  "complex": { low: 4_000, high: 8_000 },
};

const UPAA_STATES = new Set<string>([
  "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida",
  "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "maine", "montana", "nebraska",
  "nevada", "new-jersey", "new-mexico", "north-carolina", "north-dakota", "oregon",
  "rhode-island", "south-dakota", "texas", "utah", "virginia", "wisconsin",
]);

const UPMAA_STATES = new Set<string>(["colorado", "north-dakota"]);

const COMMUNITY_PROPERTY_STATES = new Set<string>([
  "arizona", "california", "idaho", "louisiana", "nevada",
  "new-mexico", "texas", "washington", "wisconsin",
]);

// ---- Engine ----

export function estimatePrenupCost(input: PrenupCostInput): PrenupCostResult {
  const stateData = PRENUP_COST_PER_PARTY[input.state];
  const base = stateData?.[input.complexity] ?? NATIONAL_BASELINE[input.complexity];

  const parties = input.bothPartiesAttorney ? 2 : 1;
  const costLow = base.low * parties;
  const costHigh = base.high * parties;

  const breakdown: PrenupCostResult["breakdown"] = [];
  if (input.bothPartiesAttorney) {
    breakdown.push({ item: `Drafting attorney (party 1) — ${input.complexity}`, costLow: base.low, costHigh: base.high });
    breakdown.push({ item: `Reviewing attorney (party 2) — ${input.complexity}`, costLow: base.low, costHigh: base.high });
  } else {
    breakdown.push({ item: `Attorney-drafted prenup — ${input.complexity}`, costLow: base.low, costHigh: base.high });
  }

  const upaaState = UPAA_STATES.has(input.state);
  const upmaaState = UPMAA_STATES.has(input.state);
  const californiaRules = input.state === "california";
  const isCommunityProperty = COMMUNITY_PROPERTY_STATES.has(input.state);

  let stateNote = "";
  if (californiaRules) {
    stateNote = "California has two strict rules that make independent counsel functionally required: (1) Cal. Fam. Code §1615(c) — waivers of spousal-support rights or property rights are unenforceable without independent counsel; and (2) §1615(c)(2)(B) — a mandatory 7-day waiting period between final agreement presentation and signing. Both apply regardless of whether the parties agree to waive them.";
  } else if (upmaaState) {
    stateNote = `This state has adopted the Uniform Premarital and Marital Agreements Act (UPMAA, 2012). UPMAA treats access to independent counsel + adequate review time as core procedural safeguards. A party without counsel must receive plain-language notice of the rights being waived.`;
  } else if (upaaState) {
    stateNote = `This state has adopted the Uniform Premarital Agreement Act (UPAA, 1983). Enforceability requires: written form, voluntary execution, full disclosure of assets/income/debts, and either the opportunity to consult counsel or a written waiver. Independent counsel is not statutorily required but strongly recommended.`;
  } else if (input.state === "louisiana") {
    stateNote = "Louisiana's civil-law regime requires a matrimonial agreement executed as an authentic act — before a notary and two witnesses — under La. Civ. Code arts. 2325–2337. Louisiana cannot waive temporary spousal support (public policy). The notary requirement is stricter than most states.";
  } else if (input.state === "ohio") {
    stateNote = "Ohio governs enforceability under Ohio Rev. Code §3103.05 and the Ohio Supreme Court's Gross v. Gross (1984) test: written, voluntary, full disclosure, no divorce-incentive terms. Two-witness signing is customary.";
  } else if (input.state === "georgia") {
    stateNote = "Georgia's Scherer v. Scherer (1982) three-part test applies: enforceable unless (1) obtained through fraud/duress/mistake/nondisclosure, (2) unconscionable, or (3) circumstances changed so materially that enforcement would be unfair.";
  } else if (input.state === "new-york") {
    stateNote = "New York requires prenups to be in writing, signed, and acknowledged with the formality of a recordable deed (DRL §236B(3)). Independent counsel is strongly recommended and heavily weighted by courts, though not statutorily required.";
  } else {
    stateNote = "This state governs enforceability by case law rather than the Uniform Act. Common requirements across states: written form, voluntary execution, full financial disclosure, and terms not unconscionable at execution (some states also review at enforcement). Independent counsel is strongly recommended everywhere.";
  }

  return {
    costLow,
    costHigh,
    breakdown,
    stateNote,
    upaaState,
    upmaaState,
    californiaRules,
    isCommunityProperty,
  };
}
