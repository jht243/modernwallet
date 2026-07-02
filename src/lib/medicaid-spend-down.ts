// Pure Medicaid spend-down engine for /elder-care/medicaid-spend-down-calculator/.
//   computeSpendDown() — state + assets by class + marital status + income → countable assets,
//   exempt assets, spend-down target, CSRA available, income cap check, medically-needy pathway.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - 2026 federal Medicaid figures (CMS CIB 12/9/2025):
//     * Individual asset limit: $2,000 (federal default)
//     * CSRA min $32,532 / max $162,660 (42 U.S.C. §1924(f)(2))
//     * MMMNA min $2,643.75 / max $4,066.50 (48 states; AK $3,381.25; HI $3,111.25)
//     * Home equity min $752,000 / max $1,130,000 (state option)
//     * Institutional income cap: $2,982/mo (300% SSI FBR $994)
//   - Home equity max-limit states (12 + DC): AL, CA, CO, CT, DC, HI, ME, MA, NJ, NY, TN, WA
//   - Income-cap states (~20): AL, AK, AZ, CO, DE, FL, GA, ID, IN, IA, LA, MS, NV, NM, OK, OR,
//     SC, SD, TX, WY
//   - CA re-added asset test 1/1/2026: $130,000 individual / $195,000 couple (Community Medi-Cal)
//   - NY: $33,038 individual / $44,796 couple asset limit
//   - Exempt assets (universal): primary residence (if community spouse there OR applicant intent
//     to return + equity ≤ state limit), one vehicle, household goods, term life, permanent life
//     with face value ≤ $1,500, irrevocable burial trust ($1,500-$15,000 state cap)
//   - Retirement accounts (401k/IRA): countable in most states; exempt in payout status in FL, TX,
//     GA, KY, MS, NY, OH; countable regardless in CA, PA, IL
//   - 5-year lookback under 42 U.S.C. §1396p(c); state divisors: CA $14,440, TX $7,900, FL $10,645

export type MaritalStatus = "single" | "married-both-well" | "married-spouse-needs-care";

export interface MedicaidSpendDownInput {
  state: string;
  maritalStatus: MaritalStatus;
  /** Cash + checking + savings. */
  cashAndSavings: number;
  /** Taxable investment accounts. */
  investments: number;
  /** Retirement accounts (401(k), IRA). */
  retirement: number;
  /** Second home, non-residence real estate. */
  otherRealEstate: number;
  /** Second vehicle beyond exempt one. */
  extraVehicles: number;
  /** Cash surrender value of permanent life insurance (over $1,500 face). */
  lifeInsuranceCashValue: number;
  /** Applicant's monthly income (SS + pension + investment income). */
  applicantMonthlyIncome: number;
  /** Spouse's monthly income (if married). */
  spouseMonthlyIncome: number;
  /** Primary residence equity. */
  homeEquity: number;
}

export interface SpendDownResult {
  /** Total countable assets. */
  countableAssets: number;
  /** Exempt assets total (home + one vehicle + other exempt). */
  exemptAssetsNarrative: string;
  /** Applicable asset limit for applicant (state-specific). */
  assetLimit: number;
  /** Applicable CSRA for community spouse. */
  csra: number;
  /** Amount that must be spent down before applicant qualifies. */
  spendDownTarget: number;
  /** Home equity limit for this state. */
  homeEquityLimit: number;
  /** True if home equity exceeds the state's limit (blocks Medicaid unless community spouse resides). */
  homeEquityExceedsLimit: boolean;
  /** Whether state uses an income cap (Miller Trust required if income above cap). */
  incomeCapState: boolean;
  /** Whether applicant's income exceeds the institutional income cap. */
  aboveIncomeCap: boolean;
  /** MMMNA available for community spouse. */
  mmmna: number;
  /** State-specific note. */
  stateNote: string;
}

// ---- 2026 federal figures ----

const INDIVIDUAL_ASSET_LIMIT_FEDERAL = 2_000;
const CSRA_MIN = 32_532;
const CSRA_MAX = 162_660;
const MMMNA_MIN = 2_643.75;
const HOME_EQUITY_MIN = 752_000;
const HOME_EQUITY_MAX = 1_130_000;
const INCOME_CAP = 2_982;

// ---- State overrides ----

const HOME_EQUITY_MAX_STATES = new Set<string>([
  "alabama", "california", "colorado", "connecticut", "hawaii",
  "maine", "massachusetts", "new-jersey", "new-york", "tennessee", "washington",
]);

const INCOME_CAP_STATES = new Set<string>([
  "alabama", "alaska", "arizona", "colorado", "delaware", "florida", "georgia",
  "idaho", "indiana", "iowa", "louisiana", "mississippi", "nevada", "new-mexico",
  "oklahoma", "oregon", "south-carolina", "south-dakota", "texas", "wyoming",
]);

/** State-specific individual asset limits (2026). */
const STATE_ASSET_LIMITS: Record<string, number> = {
  "california": 130_000,       // Community Medi-Cal re-added test 1/1/2026
  "new-york": 33_038,          // NY DOH GIS 25 MA/12
  "illinois": 17_500,
  "missouri": 4_000,
  "minnesota": 3_000,
};

/** State-specific home equity limits (2026). */
function homeEquityLimit(state: string): number {
  return HOME_EQUITY_MAX_STATES.has(state) ? HOME_EQUITY_MAX : HOME_EQUITY_MIN;
}

/** State-specific retirement account treatment: true = countable, false = exempt in payout status. */
const RETIREMENT_COUNTABLE_STATES = new Set<string>(["california", "pennsylvania", "illinois"]);
const RETIREMENT_PAYOUT_EXEMPT_STATES = new Set<string>([
  "florida", "texas", "georgia", "kentucky", "mississippi", "new-york", "ohio",
]);

/** MMMNA minimums for special states. */
function mmmnaForState(state: string): number {
  if (state === "alaska") return 3_381.25;
  if (state === "hawaii") return 3_111.25;
  return MMMNA_MIN;
}

// ---- Engine ----

export function computeSpendDown(input: MedicaidSpendDownInput): SpendDownResult {
  const state = input.state;
  const married = input.maritalStatus !== "single";

  // Retirement handling — countable in most states.
  let retirementCountable = input.retirement;
  if (RETIREMENT_PAYOUT_EXEMPT_STATES.has(state)) {
    // Assume applicant is in payout status; retirement is exempt.
    retirementCountable = 0;
  } else if (RETIREMENT_COUNTABLE_STATES.has(state)) {
    // Fully countable.
    retirementCountable = input.retirement;
  }

  // Life insurance countable only if face value > $1,500 (approximation: use cash value input).
  const lifeInsuranceCountable = input.lifeInsuranceCashValue > 1_500 ? input.lifeInsuranceCashValue : 0;

  const countableAssets =
    Math.max(0, input.cashAndSavings || 0) +
    Math.max(0, input.investments || 0) +
    Math.max(0, retirementCountable) +
    Math.max(0, input.otherRealEstate || 0) +
    Math.max(0, input.extraVehicles || 0) +
    lifeInsuranceCountable;

  // Asset limit for applicant.
  const assetLimit = STATE_ASSET_LIMITS[state] ?? INDIVIDUAL_ASSET_LIMIT_FEDERAL;

  // CSRA — protects community spouse assets.
  let csra = 0;
  if (married) {
    const halfAssets = Math.floor(countableAssets / 2);
    csra = Math.max(CSRA_MIN, Math.min(halfAssets, CSRA_MAX));
  }

  // Spend-down target: countable assets − (asset limit for applicant + CSRA if married).
  const protectedTotal = assetLimit + csra;
  const spendDownTarget = Math.max(0, countableAssets - protectedTotal);

  // Home equity check.
  const hLimit = homeEquityLimit(state);
  const homeEquityExceedsLimit = (input.homeEquity || 0) > hLimit && input.maritalStatus !== "married-both-well";

  // Income cap check.
  const incomeCapState = INCOME_CAP_STATES.has(state);
  const applicantIncome = Math.max(0, input.applicantMonthlyIncome || 0);
  const aboveIncomeCap = applicantIncome > INCOME_CAP;

  // MMMNA for community spouse.
  const mmmna = married ? mmmnaForState(state) : 0;

  // State note.
  let stateNote = "";
  if (state === "california") {
    stateNote = "California re-added a Medi-Cal asset test on January 1, 2026 at $130,000 individual / $195,000 couple. This is much higher than the federal $2,000, but a real cap that CA residents must plan around. CA is in the 12 home-equity-max-limit states ($1,130,000).";
  } else if (state === "new-york") {
    stateNote = "New York uses higher individual asset limits ($33,038 individual / $44,796 couple) and is in the 12 home-equity-max-limit states ($1,130,000). NY does NOT have a 5-year lookback for Community Medicaid (institutional Medicaid still has the 60-month lookback). Estate recovery is expanded to non-probate assets in NY.";
  } else if (INCOME_CAP_STATES.has(state)) {
    stateNote = "This is an income-cap state under 42 U.S.C. §1396a(a)(10)(A)(ii)(V). If your monthly income exceeds the 2026 cap of $2,982 (300% SSI FBR), you'll need a Qualified Income Trust (QIT / Miller Trust under 42 U.S.C. §1396p(d)(4)(B)) to redirect excess income and qualify for institutional Medicaid.";
  } else {
    stateNote = "This is a medically-needy (spend-down) state. If your monthly income exceeds the institutional cap, you can qualify by spending the excess on medical expenses each month until you hit the state's Medically Needy Income Level (MNIL). Range of MNILs across states: $100 (Louisiana) to $1,842 (New York) per month.";
  }

  const exemptAssetsNarrative = `Home equity up to $${hLimit.toLocaleString()} (state max)${input.homeEquity > 0 ? ` — you have $${input.homeEquity.toLocaleString()}${homeEquityExceedsLimit ? " (EXCEEDS LIMIT)" : ""}` : ""}, one vehicle (no cap), household goods, term life insurance, irrevocable burial trust (state cap $1,500–$15,000).`;

  return {
    countableAssets,
    exemptAssetsNarrative,
    assetLimit,
    csra,
    spendDownTarget,
    homeEquityLimit: hLimit,
    homeEquityExceedsLimit,
    incomeCapState,
    aboveIncomeCap,
    mmmna,
    stateNote,
  };
}
