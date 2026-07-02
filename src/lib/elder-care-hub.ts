// Pure decision-tree engine for the /elder-care/ hub calculator.
//   assessElderCarePlan() — takes age + assets + income + marital status + LTC risk + special-needs
//   dependent → recommended planning steps with 5-year lookback deadline math.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - 2026 federal Medicaid figures (CMS CIB 12/9/2025):
//     * SSI FBR individual: $994/mo; institutional income cap (300% SSI): $2,982/mo
//     * CSRA min $32,532 / max $162,660 (42 U.S.C. §1924(f)(2))
//     * MMMNA min $2,643.75 / max $4,066.50 (48 states; AK $3,381.25; HI $3,111.25)
//     * Home equity min $752,000 / max $1,130,000 (state option; 12 states + DC use max)
//     * Individual asset limit $2,000 default; CA re-added test 1/1/2026 at $130k/$195k
//   - 5-year lookback under 42 U.S.C. §1396p(c) — all transfers to MAPT or non-exempt person
//     within 60 months trigger penalty period
//   - Public Law 119-21 (OBBBA, 7/4/25): home equity ceiling capped at $1,000,000 effective 1/1/2028
//   - SNT rules under 42 U.S.C. §1396p(d)(4) — First-party (d)(4)(A) age <65, Medicaid payback;
//     Third-party no age no payback; Pooled (d)(4)(C) nonprofit
//   - Food no longer ISM per 89 FR 21199 (effective 9/30/2024, still in effect 2026)

export type MaritalStatus = "single" | "married-both-well" | "married-spouse-needs-care";
export type CareRisk = "none" | "within-5-years" | "current";

export interface ElderCareInput {
  /** Current age. */
  age: number;
  /** Total countable assets (excluding home + one vehicle + household effects), whole dollars. */
  countableAssets: number;
  /** Monthly income from all sources (Social Security + pensions + investments), whole dollars. */
  monthlyIncome: number;
  /** Marital status affects CSRA + MMMNA analysis. */
  maritalStatus: MaritalStatus;
  /** How likely is long-term care in the planning horizon? */
  careRisk: CareRisk;
  /** True if planning for a special-needs dependent (child, sibling, etc.). */
  specialNeedsDependent: boolean;
}

export type PlanStep = {
  name: string;
  costLow: number;
  costHigh: number;
  urgency: "critical" | "recommended" | "optional";
  reason: string;
  deadline?: string;
};

export interface ElderCareResult {
  /** Overall risk tier. */
  riskTier: "urgent" | "planning-window" | "stable";
  /** Whether the applicant already exceeds the federal income cap for institutional Medicaid. */
  aboveIncomeCap: boolean;
  /** Whether assets already exceed the countable limit (state-dependent; default $2,000). */
  aboveAssetLimit: boolean;
  /** Applicable CSRA for a married-well spouse (whichever calculation applies). */
  csra: number;
  /** Deadline for a 5-year Medicaid look-back plan (target transfer date so lookback closes). */
  lookbackDeadline: string;
  /** Ordered plan steps. */
  steps: PlanStep[];
  /** Headline recommendation. */
  headline: string;
}

// ---- 2026 federal figures ----

export const SSI_FBR_2026 = 994;
export const INCOME_CAP_2026 = 2_982;
export const CSRA_MIN_2026 = 32_532;
export const CSRA_MAX_2026 = 162_660;
export const MMMNA_MIN_2026 = 2_643.75;
export const MMMNA_MAX_2026 = 4_066.50;
export const HOME_EQUITY_MIN_2026 = 752_000;
export const HOME_EQUITY_MAX_2026 = 1_130_000;
export const INDIVIDUAL_ASSET_LIMIT_DEFAULT = 2_000;
/** Cost bands for planning documents. */
export const MAPT_COST: [number, number] = [3_000, 6_000];
export const FIRST_PARTY_SNT_COST: [number, number] = [3_000, 5_000];
export const THIRD_PARTY_SNT_COST: [number, number] = [2_500, 5_000];
export const POOLED_SNT_COST: [number, number] = [500, 1_500];
export const LTC_INSURANCE_ANNUAL_55: [number, number] = [2_200, 3_750];
export const LTC_INSURANCE_ANNUAL_65: [number, number] = [7_137, 12_250];
/** Approximate national median annual costs — CareScout 2025 survey. */
export const NURSING_HOME_ANNUAL_MEDIAN = 114_975;

// ---- Engine ----

export function assessElderCarePlan(input: ElderCareInput): ElderCareResult {
  const age = Math.max(0, input.age || 0);
  const assets = Math.max(0, input.countableAssets || 0);
  const income = Math.max(0, input.monthlyIncome || 0);
  const risk = input.careRisk;
  const married = input.maritalStatus !== "single";

  // 5-year lookback deadline — target transfer date so the 60-month clock has run.
  // Approximation: if care may be needed within 5 years, funding MAPT NOW is urgent.
  const lookbackDeadline = risk === "current"
    ? "Already needed — lookback penalty period will apply to any recent transfers"
    : risk === "within-5-years"
      ? "Immediately — fund transfers today so the 60-month clock runs before care is needed"
      : "5 years from any planned Medicaid application — the sooner, the better";

  const aboveIncomeCap = income > INCOME_CAP_2026;
  const aboveAssetLimit = assets > INDIVIDUAL_ASSET_LIMIT_DEFAULT;

  // CSRA if married and community spouse is well.
  let csra = 0;
  if (input.maritalStatus === "married-both-well" || input.maritalStatus === "married-spouse-needs-care") {
    const halfAssets = Math.floor(assets / 2);
    csra = Math.max(CSRA_MIN_2026, Math.min(halfAssets, CSRA_MAX_2026));
  }

  const steps: PlanStep[] = [];

  // 1. Special Needs Trust for dependent — always critical if applicable.
  if (input.specialNeedsDependent) {
    steps.push({
      name: "Third-Party Special Needs Trust for dependent",
      costLow: THIRD_PARTY_SNT_COST[0],
      costHigh: THIRD_PARTY_SNT_COST[1],
      urgency: "critical",
      reason: "Preserves the dependent's SSI/Medicaid eligibility while providing supplemental resources. No age limit, no Medicaid payback at your death. Governed by POMS SI 01120.200 and (for first-party trusts using dependent's own money) 42 U.S.C. §1396p(d)(4)(A).",
    });
  }

  // 2. Medicaid planning — Medicaid Asset Protection Trust if care risk within 5 years.
  if (risk === "within-5-years" && assets > INDIVIDUAL_ASSET_LIMIT_DEFAULT + (married ? CSRA_MAX_2026 : 0)) {
    steps.push({
      name: "Medicaid Asset Protection Trust (MAPT)",
      costLow: MAPT_COST[0],
      costHigh: MAPT_COST[1],
      urgency: "critical",
      reason: `Long-term care may be needed within 5 years. A MAPT — an irrevocable trust — moves assets out of your countable pool, but the 60-month lookback under 42 U.S.C. §1396p(c) means transfers today only fully shield assets after 5 years. Every month you delay compresses the window.`,
      deadline: "Fund the trust today; the 60-month clock starts on the transfer date",
    });
  } else if (risk === "none" && assets > CSRA_MAX_2026 && age >= 55) {
    steps.push({
      name: "Consider a Medicaid Asset Protection Trust (MAPT)",
      costLow: MAPT_COST[0],
      costHigh: MAPT_COST[1],
      urgency: "recommended",
      reason: "You're above the CSRA maximum and past age 55 with no immediate LTC need — the ideal planning window. Fund a MAPT now and the 60-month lookback runs before any application is likely to be filed.",
      deadline: "5 years from any planned Medicaid application",
    });
  }

  // 3. Long-term care insurance if age <65 and no MAPT-critical stance.
  if (age <= 65 && risk === "none") {
    const insuranceBand = age <= 55 ? LTC_INSURANCE_ANNUAL_55 : LTC_INSURANCE_ANNUAL_65;
    steps.push({
      name: "Long-term care insurance",
      costLow: insuranceBand[0],
      costHigh: insuranceBand[1],
      urgency: "recommended",
      reason: `Traditional LTCi at your age runs ~$${insuranceBand[0].toLocaleString()}-${insuranceBand[1].toLocaleString()}/year (AALTCI 2025 rates). Hybrid life+LTC products dominate new sales in 2026. Underwriting tightens after 65, and premiums roughly double every 10 years of purchase delay.`,
    });
  }

  // 4. Estate planning — always relevant at this stage.
  if (assets > 100_000 || age >= 60) {
    steps.push({
      name: "Estate plan review (will + POA + healthcare directive)",
      costLow: 500,
      costHigh: 2_500,
      urgency: "recommended",
      reason: "Elder-care planning depends on incapacity documents — durable POA (finances) and advance healthcare directive (medical decisions) — that must be in place BEFORE any cognitive decline. Attorney-drafted $500-$2,500 or online (Trust & Will $199-$299) with plan-tier check via our estate planning calculator.",
    });
  }

  // 5. WA Cares Fund note for Washington residents (added if applicable — need state field, so omit for now).

  // 6. Immediate spend-down warning if care is current.
  if (risk === "current" && aboveAssetLimit) {
    steps.unshift({
      name: "Emergency Medicaid spend-down planning",
      costLow: 5_000,
      costHigh: 15_000,
      urgency: "critical",
      reason: `Care is needed now and countable assets ($${assets.toLocaleString()}) exceed the $2,000 individual limit${married ? ` (community spouse can keep up to $${CSRA_MAX_2026.toLocaleString()} CSRA)` : ""}. Attorney-guided spend-down converts countable assets to exempt (home improvements, prepaid burial, spousal transfers) or funds a Miller Trust in income-cap states. The 5-year lookback DOES apply to transfers made now, so speed matters.`,
      deadline: "Immediate — every month of delay costs $${NURSING_HOME_ANNUAL_MEDIAN / 12}k in private-pay nursing home costs at national median",
    });
  }

  // Risk tier + headline
  let riskTier: ElderCareResult["riskTier"];
  let headline: string;
  if (risk === "current") {
    riskTier = "urgent";
    headline = "Care is needed now — emergency spend-down planning is the priority";
  } else if (risk === "within-5-years" || (risk === "none" && age >= 70 && assets > CSRA_MAX_2026)) {
    riskTier = "planning-window";
    headline = "You're in the 5-year planning window — fund transfers now so the lookback runs before care";
  } else {
    riskTier = "stable";
    headline = age <= 55
      ? "Age advantage: LTC insurance is affordable; MAPT less urgent"
      : "Estate plan review + insurance review are the next steps";
  }

  return {
    riskTier,
    aboveIncomeCap,
    aboveAssetLimit,
    csra,
    lookbackDeadline,
    steps,
    headline,
  };
}
