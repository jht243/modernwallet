// Pure probate engine — hub + fee + timeline + cost-vs-trust math shared across all 3 Pillar 3 spokes.
//   estimateProbate() — state + estate value + complexity → attorney fee, executor commission,
//   court filing fees, timeline months, and a comparison to a living-trust setup that would
//   have avoided probate entirely.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   California statutory fees: Cal. Prob. Code §10810 (attorney) / §10800 (executor same schedule)
//     - 4% first $100k, 3% next $100k, 2% next $800k, 1% next $9M, 0.5% next $15M, reasonable > $25M
//     - Base = inventory + gains − losses; GROSS estate (not net of debts)
//     - Attorney AND executor each get the schedule → statutory bill roughly doubles
//   Florida: Fla. Stat. §733.6171 (attorney presumed reasonable) + §733.617 (PR commission)
//     - Attorney: $1,500 base first $40k, +$750 next $30k, +$750 next $30k, 3% $100k–$1M,
//       2.5% $1M–$3M, 2% $3M–$5M, 1.5% $5M–$10M, 1% > $10M
//     - PR commission: 3% first $1M, 2.5% next $4M, 2% next $5M, 1.5% > $10M
//   Iowa: Iowa Code §633.197 (executor) / §633.198 (attorney "not to exceed" same)
//     - 6% first $1k, 4% next $4k, 2% > $5k
//   Missouri: Mo. Rev. Stat. §473.153
//     - 5% first $5k, 4% next $20k, 3% next $75k, 2.75% next $300k, 2.5% next $600k, 2% > $1M
//   New York: NY SCPA §2307 (executor commissions only; attorney is "reasonable")
//     - 5% first $100k, 4% next $200k, 3% next $700k, 2.5% next $4M, 2% > $5M
//   Other statutory schedules: MT §72-3-631, WY §2-7-803, AR §28-48-108, OK tit. 58 §527, NJ (executor)
//   ~40 other states: reasonable-fee model — 2-4% of gross estate typical; simple flat fee
//     $2,500-$5,000; complex hourly $200-$500/hr; contested $50k+.
//   Timelines:
//     Simple uncontested: 6-12 months
//     Real estate: 9-18 months
//     CA: 12-24 months (§9100 creditor claim period + court backlogs)
//     NY Surrogate's: 12-24 months for non-summary
//     TX independent admin: 3-6 months
//     UPC informal (UT, CO, MN, AZ, ID): 4-8 months
//     Contested: 2-5 years
//     Ancillary: +6-12 months per additional state
//   Ancillary cost: $2,000-$8,000 per additional state.

export type ProbateComplexity = "simple" | "moderate" | "contested";

export interface ProbateInput {
  /** State slug. */
  state: string;
  /** Gross estate value (before deducting debts), whole dollars. */
  estateValue: number;
  /** Complexity: simple = uncontested, no real estate; moderate = uncontested with real estate; contested. */
  complexity: ProbateComplexity;
  /** Number of ADDITIONAL states where real property is located (triggers ancillary probate). */
  ancillaryStates: number;
}

export interface ProbateResult {
  /** Attorney fee (statutory in fee-schedule states, market-typical in reasonable-fee states). */
  attorneyFeeLow: number;
  attorneyFeeHigh: number;
  /** Executor / personal representative commission. */
  executorFeeLow: number;
  executorFeeHigh: number;
  /** Court filing fees + publication + certified copies. */
  courtFeesLow: number;
  courtFeesHigh: number;
  /** Ancillary probate cost across all extra states. */
  ancillaryFeeLow: number;
  ancillaryFeeHigh: number;
  /** Total probate cost. */
  totalLow: number;
  totalHigh: number;

  /** Timeline range in months (uncontested unless complexity="contested"). */
  timelineMonthsLow: number;
  timelineMonthsHigh: number;

  /** Whether the state uses a statutory fee schedule (vs reasonable-fee). */
  statutoryScheme: boolean;
  /** Statute citation if applicable. */
  statuteCite?: string;
  /** State-specific note (statutory basis, timeline driver, ancillary rule). */
  stateNote: string;

  /** Living trust cost that would have avoided probate entirely (from living-trust-cost baselines). */
  trustAvoidanceCostLow: number;
  trustAvoidanceCostHigh: number;
  /** Net probate savings had a living trust been in place (probate cost − trust cost). */
  savingsIfTrustLow: number;
  savingsIfTrustHigh: number;
}

// ---- Attorney fee schedules for statutory states ----

/** California statutory schedule (Cal. Prob. Code §10810). Returns fee based on gross estate. */
function californiaStatutoryFee(estate: number): number {
  if (estate <= 0) return 0;
  let fee = 0;
  let remaining = estate;
  const tiers: Array<[number, number]> = [
    [100_000, 0.04],
    [100_000, 0.03],
    [800_000, 0.02],
    [9_000_000, 0.01],
    [15_000_000, 0.005],
  ];
  for (const [bandSize, rate] of tiers) {
    if (remaining <= 0) break;
    const applied = Math.min(remaining, bandSize);
    fee += applied * rate;
    remaining -= applied;
  }
  if (remaining > 0) fee += remaining * 0.005; // above $25M — approximate as court-reasonable
  return Math.round(fee);
}

/** Florida attorney fee schedule under Fla. Stat. §733.6171 (presumed reasonable). */
function floridaAttorneyFee(estate: number): number {
  if (estate <= 40_000) return 1_500;
  if (estate <= 70_000) return 1_500 + 750;
  if (estate <= 100_000) return 1_500 + 750 + 750;
  let fee = 3_000;
  let remaining = estate - 100_000;
  const tiers: Array<[number, number]> = [
    [900_000, 0.03],
    [2_000_000, 0.025],
    [2_000_000, 0.02],
    [5_000_000, 0.015],
  ];
  for (const [bandSize, rate] of tiers) {
    if (remaining <= 0) break;
    const applied = Math.min(remaining, bandSize);
    fee += applied * rate;
    remaining -= applied;
  }
  if (remaining > 0) fee += remaining * 0.01; // over $10M
  return Math.round(fee);
}

/** Florida personal representative commission under §733.617. */
function floridaPRFee(estate: number): number {
  let fee = 0;
  let remaining = estate;
  const tiers: Array<[number, number]> = [
    [1_000_000, 0.03],
    [4_000_000, 0.025],
    [5_000_000, 0.02],
  ];
  for (const [bandSize, rate] of tiers) {
    if (remaining <= 0) break;
    const applied = Math.min(remaining, bandSize);
    fee += applied * rate;
    remaining -= applied;
  }
  if (remaining > 0) fee += remaining * 0.015; // over $10M
  return Math.round(fee);
}

/** Iowa Code §633.197 / §633.198 — attorney and executor each capped at the same schedule. */
function iowaStatutoryFee(estate: number): number {
  let fee = 0;
  let remaining = estate;
  const tiers: Array<[number, number]> = [
    [1_000, 0.06],
    [4_000, 0.04],
  ];
  for (const [bandSize, rate] of tiers) {
    if (remaining <= 0) break;
    const applied = Math.min(remaining, bandSize);
    fee += applied * rate;
    remaining -= applied;
  }
  if (remaining > 0) fee += remaining * 0.02; // over $5k
  return Math.round(fee);
}

/** Missouri Mo. Rev. Stat. §473.153 — executor minimum. */
function missouriStatutoryFee(estate: number): number {
  let fee = 0;
  let remaining = estate;
  const tiers: Array<[number, number]> = [
    [5_000, 0.05],
    [20_000, 0.04],
    [75_000, 0.03],
    [300_000, 0.0275],
    [600_000, 0.025],
  ];
  for (const [bandSize, rate] of tiers) {
    if (remaining <= 0) break;
    const applied = Math.min(remaining, bandSize);
    fee += applied * rate;
    remaining -= applied;
  }
  if (remaining > 0) fee += remaining * 0.02;
  return Math.round(fee);
}

/** New York SCPA §2307 — executor commissions only (attorney is "reasonable"). */
function newYorkStatutoryExecutor(estate: number): number {
  let fee = 0;
  let remaining = estate;
  const tiers: Array<[number, number]> = [
    [100_000, 0.05],
    [200_000, 0.04],
    [700_000, 0.03],
    [4_000_000, 0.025],
  ];
  for (const [bandSize, rate] of tiers) {
    if (remaining <= 0) break;
    const applied = Math.min(remaining, bandSize);
    fee += applied * rate;
    remaining -= applied;
  }
  if (remaining > 0) fee += remaining * 0.02;
  return Math.round(fee);
}

// ---- State-level metadata ----

interface StateProbate {
  statutoryScheme: boolean;
  statuteCite?: string;
  /** Compute attorney fee — returns [low, high]. Reasonable-fee states use percentage of estate. */
  attorneyFee: (estate: number) => [number, number];
  /** Compute executor commission — returns [low, high]. */
  executorFee: (estate: number) => [number, number];
  /** Base timeline range (months) — before complexity/contested adjustments. */
  timelineLow: number;
  timelineHigh: number;
  /** State note for the lawContext / detail render. */
  note: string;
}

const STATUTORY_STATES: Record<string, StateProbate> = {
  "california": {
    statutoryScheme: true,
    statuteCite: "Cal. Prob. Code §10810",
    attorneyFee: (e) => {
      const stat = californiaStatutoryFee(e);
      return [stat, Math.round(stat * 1.1)]; // court often approves extraordinary fees on top
    },
    executorFee: (e) => {
      const stat = californiaStatutoryFee(e);
      return [stat, stat]; // §10800 mirrors attorney schedule
    },
    timelineLow: 12,
    timelineHigh: 24,
    note: "California uses a statutory percentage schedule under Cal. Prob. Code §10810 (attorney) and §10800 (executor). Both are entitled to the SAME schedule, so total statutory fees roughly double. The 4-month creditor claim period under §9100 plus urban court backlogs push typical timelines to 12-24 months.",
  },
  "florida": {
    statutoryScheme: true,
    statuteCite: "Fla. Stat. §733.6171 (attorney) + §733.617 (PR)",
    attorneyFee: (e) => [floridaAttorneyFee(e), Math.round(floridaAttorneyFee(e) * 1.15)],
    executorFee: (e) => [floridaPRFee(e), floridaPRFee(e)],
    timelineLow: 6,
    timelineHigh: 12,
    note: "Florida's attorney fee is presumptively reasonable under Fla. Stat. §733.6171 with a stepped schedule ($1,500 base + $750 + $750 + tiered percentages). Personal-representative commission runs under §733.617 (3% first $1M, tiered down). Summary administration under §735.201 is available if the estate is ≤ $75,000 or the death is 2+ years old — a fast path that many Florida estates use.",
  },
  "iowa": {
    statutoryScheme: true,
    statuteCite: "Iowa Code §633.197 (executor) / §633.198 (attorney)",
    attorneyFee: (e) => [iowaStatutoryFee(e), iowaStatutoryFee(e)],
    executorFee: (e) => [iowaStatutoryFee(e), iowaStatutoryFee(e)],
    timelineLow: 6,
    timelineHigh: 12,
    note: "Iowa Code §633.197 caps the executor commission and §633.198 caps attorney fees at the same schedule (6% first $1k, 4% next $4k, 2% above $5k). Both are 'not to exceed' — reasonable fees below the cap are typical.",
  },
  "missouri": {
    statutoryScheme: true,
    statuteCite: "Mo. Rev. Stat. §473.153",
    attorneyFee: (e) => [missouriStatutoryFee(e), Math.round(missouriStatutoryFee(e) * 1.1)],
    executorFee: (e) => [missouriStatutoryFee(e), missouriStatutoryFee(e)],
    timelineLow: 6,
    timelineHigh: 12,
    note: "Mo. Rev. Stat. §473.153 sets minimum executor compensation; courts routinely apply the same schedule to attorney fees. Missouri also allows refusal of letters for small estates under $40,000.",
  },
  "montana": {
    statutoryScheme: true,
    statuteCite: "MCA §72-3-631 (PR) / §72-3-633 (attorney)",
    attorneyFee: (e) => {
      const prFee = e * 0.02 + Math.min(e, 40_000) * 0.01; // 3% first $40k, 2% over
      return [Math.round(prFee * 1.5), Math.round(prFee * 1.75)]; // attorney = 1.5-1.75x PR fee
    },
    executorFee: (e) => {
      const prFee = e * 0.02 + Math.min(e, 40_000) * 0.01;
      return [Math.round(prFee), Math.round(prFee)];
    },
    timelineLow: 6,
    timelineHigh: 12,
    note: "Montana MCA §72-3-631 sets personal-representative compensation at 3% of the first $40,000 and 2% above; attorney fees under §72-3-633 typically approximate 1.5x the PR schedule.",
  },
  "new-york": {
    statutoryScheme: true,
    statuteCite: "NY SCPA §2307 (executor only; attorney is 'reasonable')",
    attorneyFee: (e) => [Math.round(e * 0.02), Math.round(e * 0.05)],
    executorFee: (e) => [newYorkStatutoryExecutor(e), newYorkStatutoryExecutor(e)],
    timelineLow: 12,
    timelineHigh: 24,
    note: "New York SCPA §2307 sets executor commissions on a statutory schedule (5% first $100k, tiered down). Attorney fees are 'reasonable' and court-supervised, not fixed — typical range is 2-5% of gross estate. Surrogate's Court timelines run 12-24 months for anything beyond voluntary administration (SCPA Article 13, available for personal property ≤ $50,000).",
  },
  "wyoming": {
    statutoryScheme: true,
    statuteCite: "Wyo. Stat. §2-7-803 (executor) / §2-7-804 (attorney)",
    attorneyFee: (e) => {
      let fee = 0;
      let rem = e;
      const tiers: Array<[number, number]> = [[1_000, 0.10], [4_000, 0.05], [15_000, 0.03]];
      for (const [b, r] of tiers) { if (rem <= 0) break; const app = Math.min(rem, b); fee += app * r; rem -= app; }
      if (rem > 0) fee += rem * 0.02;
      return [Math.round(fee), Math.round(fee)];
    },
    executorFee: (e) => {
      let fee = 0;
      let rem = e;
      const tiers: Array<[number, number]> = [[1_000, 0.10], [4_000, 0.05], [15_000, 0.03]];
      for (const [b, r] of tiers) { if (rem <= 0) break; const app = Math.min(rem, b); fee += app * r; rem -= app; }
      if (rem > 0) fee += rem * 0.02;
      return [Math.round(fee), Math.round(fee)];
    },
    timelineLow: 6,
    timelineHigh: 12,
    note: "Wyoming Wyo. Stat. §2-7-803 and §2-7-804 set both executor and attorney fees under the same schedule (10% first $1k, 5% next $4k, 3% next $15k, 2% above $20k) — one of the lowest statutory ceilings in the country. Wyoming also permits summary distribution for estates up to $200,000.",
  },
  "arkansas": {
    statutoryScheme: true,
    statuteCite: "Ark. Code §28-48-108 (PR) / §28-48-109 (attorney)",
    attorneyFee: (e) => {
      let fee = 0;
      let rem = e;
      const tiers: Array<[number, number]> = [[1_000, 0.10], [4_000, 0.05], [20_000, 0.03]];
      for (const [b, r] of tiers) { if (rem <= 0) break; const app = Math.min(rem, b); fee += app * r; rem -= app; }
      if (rem > 0) fee += rem * 0.02;
      return [Math.round(fee), Math.round(fee * 1.5)]; // above $25k is court-reasonable
    },
    executorFee: (e) => {
      let fee = 0;
      let rem = e;
      const tiers: Array<[number, number]> = [[1_000, 0.10], [4_000, 0.05], [20_000, 0.03]];
      for (const [b, r] of tiers) { if (rem <= 0) break; const app = Math.min(rem, b); fee += app * r; rem -= app; }
      if (rem > 0) fee += rem * 0.02;
      return [Math.round(fee), Math.round(fee)];
    },
    timelineLow: 6,
    timelineHigh: 12,
    note: "Arkansas Ark. Code §28-48-108 caps personal-representative compensation at 10% first $1k, 5% next $4k, 3% next $20k; §28-48-109 sets attorney fees at the same schedule. Above $25,000, the court sets a reasonable fee.",
  },
  "oklahoma": {
    statutoryScheme: true,
    statuteCite: "Okla. Stat. tit. 58 §527",
    attorneyFee: (e) => {
      let fee = 0;
      let rem = e;
      const tiers: Array<[number, number]> = [[1_000, 0.05], [5_000, 0.04]];
      for (const [b, r] of tiers) { if (rem <= 0) break; const app = Math.min(rem, b); fee += app * r; rem -= app; }
      if (rem > 0) fee += rem * 0.025;
      return [Math.round(fee), Math.round(fee * 1.2)];
    },
    executorFee: (e) => {
      let fee = 0;
      let rem = e;
      const tiers: Array<[number, number]> = [[1_000, 0.05], [5_000, 0.04]];
      for (const [b, r] of tiers) { if (rem <= 0) break; const app = Math.min(rem, b); fee += app * r; rem -= app; }
      if (rem > 0) fee += rem * 0.025;
      return [Math.round(fee), Math.round(fee)];
    },
    timelineLow: 6,
    timelineHigh: 12,
    note: "Oklahoma Okla. Stat. tit. 58 §527 sets executor commissions at 5% first $1k, 4% next $5k, 2.5% above. Attorney fees are 'reasonable' and court-approved, and typically mirror the executor schedule.",
  },
  "new-jersey": {
    statutoryScheme: true,
    statuteCite: "N.J.S.A. §3B:18-14 (executor only)",
    attorneyFee: (e) => [Math.round(e * 0.02), Math.round(e * 0.04)],
    executorFee: (e) => {
      let fee = 0;
      let rem = e;
      const tiers: Array<[number, number]> = [[200_000, 0.05], [800_000, 0.035]];
      for (const [b, r] of tiers) { if (rem <= 0) break; const app = Math.min(rem, b); fee += app * r; rem -= app; }
      if (rem > 0) fee += rem * 0.02;
      return [Math.round(fee), Math.round(fee)];
    },
    timelineLow: 9,
    timelineHigh: 15,
    note: "New Jersey N.J.S.A. §3B:18-14 sets executor commissions at 5% first $200k, 3.5% next $800k, 2% above $1M. Attorney fees are 'reasonable' — no statutory schedule — and typically 2-4% of gross estate.",
  },
};

// ---- Reasonable-fee states — market-typical percentages ----

/** State-specific market attorney fee percentage bands (of gross estate) for uncontested probate. */
const REASONABLE_FEE_BANDS: Record<string, { attorneyPct: [number, number]; executorPct: [number, number]; timeline: [number, number]; note: string; statutoryScheme: false }> = {
  "texas": {
    attorneyPct: [0.015, 0.03],
    executorPct: [0.02, 0.05],
    timeline: [3, 6],
    note: "Texas has no statutory attorney fee schedule; independent administration (Tex. Est. Code §401.001+) is the default in most estates, which dramatically speeds probate. Attorney fees typically run 1.5-3% of gross estate; typical uncontested independent probate closes in 3-6 months.",
    statutoryScheme: false,
  },
  "colorado": {
    attorneyPct: [0.02, 0.04],
    executorPct: [0.02, 0.04],
    timeline: [4, 8],
    note: "Colorado follows the Uniform Probate Code with informal probate available for most uncontested estates. No statutory fee schedule — attorney fees are reasonable, typically 2-4% of gross estate. UPC informal probate closes in 4-8 months for most cases.",
    statutoryScheme: false,
  },
  "utah": {
    attorneyPct: [0.02, 0.035],
    executorPct: [0.02, 0.035],
    timeline: [4, 8],
    note: "Utah follows the Uniform Probate Code with informal probate. No statutory fee schedule. Small estates under $100,000 (excluding real property) can use the collection-by-affidavit procedure and bypass probate entirely.",
    statutoryScheme: false,
  },
  "arizona": {
    attorneyPct: [0.02, 0.04],
    executorPct: [0.02, 0.04],
    timeline: [6, 10],
    note: "Arizona follows the Uniform Probate Code with informal probate. No statutory fee schedule; attorney fees run 2-4% of gross estate. Estates under $75,000 personal / $100,000 real can use an affidavit and skip formal probate.",
    statutoryScheme: false,
  },
  "minnesota": {
    attorneyPct: [0.02, 0.04],
    executorPct: [0.02, 0.04],
    timeline: [6, 10],
    note: "Minnesota follows the Uniform Probate Code with informal probate available. No statutory fee schedule. Small estates under $75,000 can use an affidavit and skip formal probate.",
    statutoryScheme: false,
  },
  "idaho": {
    attorneyPct: [0.02, 0.035],
    executorPct: [0.02, 0.035],
    timeline: [4, 8],
    note: "Idaho follows the Uniform Probate Code with informal probate. No statutory fee schedule. Small estates under $100,000 can use collection-by-affidavit.",
    statutoryScheme: false,
  },
};

// ---- Small-estate thresholds (2026) ----

const SMALL_ESTATE_THRESHOLD: Record<string, number> = {
  "alabama": 34_611, "alaska": 100_000, "arizona": 200_000, "arkansas": 100_000,
  "california": 208_850, "colorado": 82_000, "connecticut": 40_000, "delaware": 30_000,
  "florida": 75_000, "georgia": 0, "hawaii": 100_000, "idaho": 100_000,
  "illinois": 100_000, "indiana": 100_000, "iowa": 200_000, "kansas": 40_000,
  "kentucky": 30_000, "louisiana": 125_000, "maine": 40_000, "maryland": 50_000,
  "massachusetts": 25_000, "michigan": 53_000, "minnesota": 75_000, "mississippi": 75_000,
  "missouri": 40_000, "montana": 50_000, "nebraska": 100_000, "nevada": 25_000,
  "new-hampshire": 0, "new-jersey": 50_000, "new-mexico": 50_000, "new-york": 50_000,
  "north-carolina": 20_000, "north-dakota": 50_000, "ohio": 35_000, "oklahoma": 50_000,
  "oregon": 275_000, "pennsylvania": 50_000, "rhode-island": 15_000, "south-carolina": 25_000,
  "south-dakota": 100_000, "tennessee": 50_000, "texas": 75_000, "utah": 100_000,
  "vermont": 45_000, "virginia": 50_000, "washington": 100_000, "west-virginia": 100_000,
  "wisconsin": 50_000, "wyoming": 200_000,
};

// ---- Living trust cost (for savings comparison) — copied from living-trust-cost.ts ----
// Simplifies rather than importing to keep this module standalone.
const LIVING_TRUST_COST_BAND: [number, number] = [1_500, 5_000];
const LIVING_TRUST_CA_MULTIPLIER = 1.35;
const LIVING_TRUST_HIGH_MULTIPLIER_STATES = new Set(["california", "new-york", "massachusetts", "connecticut", "new-jersey", "washington", "hawaii"]);

function trustCostForState(state: string): [number, number] {
  const mult = state === "california" ? LIVING_TRUST_CA_MULTIPLIER
    : LIVING_TRUST_HIGH_MULTIPLIER_STATES.has(state) ? 1.25
    : 1.00;
  return [Math.round(LIVING_TRUST_COST_BAND[0] * mult), Math.round(LIVING_TRUST_COST_BAND[1] * mult)];
}

// ---- Engine ----

function reasonableFeeDefault(state: string): typeof REASONABLE_FEE_BANDS["colorado"] {
  return REASONABLE_FEE_BANDS[state] ?? {
    attorneyPct: [0.02, 0.04],
    executorPct: [0.02, 0.04],
    timeline: [6, 12],
    note: "This state uses a reasonable-fee model rather than a statutory schedule. Attorney fees typically run 2-4% of gross estate for uncontested probate; executor commission is comparable. Simple estates are often billed at a flat fee of $2,500-$5,000; complex or contested estates hit hourly billing at $200-$500/hr with totals commonly $5,000-$20,000+.",
    statutoryScheme: false,
  };
}

export function estimateProbate(input: ProbateInput): ProbateResult {
  const estate = Math.max(0, input.estateValue || 0);
  const state = input.state;
  const complexity = input.complexity;
  const ancillary = Math.max(0, Math.round(input.ancillaryStates || 0));

  // Fee computation
  let attorneyLow: number, attorneyHigh: number;
  let execLow: number, execHigh: number;
  let statutoryScheme: boolean;
  let statuteCite: string | undefined;
  let stateNote: string;
  let baseTimelineLow: number, baseTimelineHigh: number;

  const statutory = STATUTORY_STATES[state];
  if (statutory) {
    statutoryScheme = true;
    statuteCite = statutory.statuteCite;
    const [aL, aH] = statutory.attorneyFee(estate);
    const [eL, eH] = statutory.executorFee(estate);
    attorneyLow = aL; attorneyHigh = aH;
    execLow = eL; execHigh = eH;
    stateNote = statutory.note;
    baseTimelineLow = statutory.timelineLow;
    baseTimelineHigh = statutory.timelineHigh;
  } else {
    const band = reasonableFeeDefault(state);
    statutoryScheme = false;
    attorneyLow = Math.round(estate * band.attorneyPct[0]);
    attorneyHigh = Math.round(estate * band.attorneyPct[1]);
    execLow = Math.round(estate * band.executorPct[0]);
    execHigh = Math.round(estate * band.executorPct[1]);
    stateNote = band.note;
    baseTimelineLow = band.timeline[0];
    baseTimelineHigh = band.timeline[1];
  }

  // Complexity/contested adjustments
  if (complexity === "moderate") {
    baseTimelineLow += 3;
    baseTimelineHigh += 6;
  }
  if (complexity === "contested") {
    baseTimelineLow = 24;
    baseTimelineHigh = 60;
    attorneyLow = Math.round(attorneyLow * 2);
    attorneyHigh = Math.round(attorneyHigh * 5);
  }

  // Court filing fees + publication
  const courtFeesLow = 400 + (complexity === "contested" ? 500 : 0);
  const courtFeesHigh = 1_500 + (complexity === "contested" ? 3_000 : 0);

  // Ancillary probate
  const ancillaryFeeLow = ancillary * 2_000;
  const ancillaryFeeHigh = ancillary * 8_000;
  if (ancillary > 0) {
    baseTimelineLow += ancillary * 6;
    baseTimelineHigh += ancillary * 12;
  }

  const totalLow = attorneyLow + execLow + courtFeesLow + ancillaryFeeLow;
  const totalHigh = attorneyHigh + execHigh + courtFeesHigh + ancillaryFeeHigh;

  const [trustLow, trustHigh] = trustCostForState(state);
  const savingsLow = Math.max(0, totalLow - trustHigh);
  const savingsHigh = Math.max(0, totalHigh - trustLow);

  return {
    attorneyFeeLow: attorneyLow,
    attorneyFeeHigh: attorneyHigh,
    executorFeeLow: execLow,
    executorFeeHigh: execHigh,
    courtFeesLow,
    courtFeesHigh,
    ancillaryFeeLow,
    ancillaryFeeHigh,
    totalLow,
    totalHigh,
    timelineMonthsLow: baseTimelineLow,
    timelineMonthsHigh: baseTimelineHigh,
    statutoryScheme,
    statuteCite,
    stateNote,
    trustAvoidanceCostLow: trustLow,
    trustAvoidanceCostHigh: trustHigh,
    savingsIfTrustLow: savingsLow,
    savingsIfTrustHigh: savingsHigh,
  };
}

/** Small-estate threshold for the state (in whole dollars). 0 if no formal threshold. */
export function smallEstateThreshold(state: string): number {
  return SMALL_ESTATE_THRESHOLD[state] ?? 0;
}

/** True if the state has a statutory fee schedule. */
export function isStatutoryFeeState(state: string): boolean {
  return state in STATUTORY_STATES;
}
