// Indexed universal life (IUL) cash-value engine, projected against a retirement-account baseline.
//
// Every carrier calculator on page one for "iul calculator" illustrates the upside: a credited
// rate, a rising cash value, a big number at the end. None of them show the two things that
// actually decide whether an IUL is worth funding:
//   1. THE CAP. Credited interest is `min(indexReturn * participationRate, cap)`, floored at
//      `floorPct`. In a year the index beats the cap, the difference is gain the policy never
//      receives. Over 20 to 30 years that forgone gain compounds into a large number nobody shows.
//   2. THE COST OF INSURANCE. COI is charged on the NET AMOUNT AT RISK (death benefit minus cash
//      value), at a rate per $1,000 that RISES every year with the insured's age. It is deducted
//      from cash value. This is the mechanism behind most universal-life lapses: on a minimally
//      funded policy the charge eventually outgrows the credited interest, cash value drains, and
//      the coverage ends.
//
// The 0% floor protects against an index LOSS, not against charges. In a 0% credited year the cash
// value still falls, because COI and expenses are still deducted. That is the single most
// misunderstood mechanic in the category, and the year-by-year table has to show it.
//
// Year-by-year loop (not a closed form) so every step is independently checkable by hand. It is the
// same convention as `taxable-vs-tax-deferred.ts`, and it matters more here, because the whole
// claim of the page is that it shows the drag in full.
//
// MODELLING BOUNDARIES (deliberate, see the spec):
//   - Every policy input is USER-SUPPLIED. No carrier's real cap, COI table, or pricing is
//     hard-coded anywhere in this file. Defaults live in the island and are labelled assumptions.
//   - A projection is a what-if on the assumptions entered, never a prediction. Carriers can lower
//     a cap rate on an in-force policy; only the guaranteed floor and guaranteed maximum charges
//     are contractual in a typical product.
//   - Tax treatment beyond the baseline's `taxRatePct` is out of scope: no MEC status, no section
//     7702 premium limits, no policy-loan taxation. Those are prose-and-primary-source topics.

export type BaselineKind = "401k" | "brokerage";

export interface IulInput {
  // ---- Policy ----
  /** Annual premium paid into the policy. */
  annualPremium: number;
  /** How many years premium is actually paid (funding can stop before the projection ends). */
  yearsFunded: number;
  /** Insured's age at issue. Drives the COI curve and the projection horizon. */
  currentAge: number;
  /** Age the projection runs to. */
  projectToAge: number;
  /** Face amount / death benefit. Net amount at risk = this minus cash value. */
  deathBenefit: number;
  /** Ceiling on credited interest in a good year, percent. */
  capRatePct: number;
  /** Share of the index gain credited before the cap applies, percent. */
  participationRatePct: number;
  /** Guaranteed minimum credited rate, percent. Conventionally 0. */
  floorPct: number;
  /** The index's own assumed return before cap/participation/floor, percent. */
  assumedIndexReturnPct: number;
  /** When true, a repeating up/down sequence is used instead of a level return, so the cap
   *  actually binds in above-cap years the way it does in real markets. */
  variableReturns: boolean;
  /** Starting annual COI rate per $1,000 of net amount at risk. A user assumption. */
  coiPerThousand: number;
  /** Annual escalation of that COI rate, percent. This is what rises with age. */
  coiEscalationPct: number;
  /** Premium load taken off each premium before it reaches cash value, percent. */
  premiumLoadPct: number;
  /** Flat monthly administrative/policy charge, dollars. */
  monthlyAdminFee: number;
  /** Surrender charge in year 1 as a percent of cash value. */
  surrenderChargePct: number;
  /** Years over which the surrender charge grades straight-line to zero. */
  surrenderChargeYears: number;

  // ---- Baseline ----
  baseline: BaselineKind;
  /** Expected annual return on the baseline account, percent. */
  baselineReturnPct: number;
  /** Baseline fund expense ratio, percent. */
  baselineExpenseRatioPct: number;
  /** Employer match as a percent of the contribution (401k baseline only). 50 = 50 cents on the
   *  dollar. Applied to the same dollars the premium would have used. */
  employerMatchPct: number;
  /** Tax rate applied to the brokerage baseline's annual realized gain, percent. */
  taxRatePct: number;
}

export interface IulYearRow {
  year: number;
  age: number;
  premiumPaid: number;
  /** Rate actually credited after participation, cap, and floor. */
  creditedRatePct: number;
  /** What the index did that year, before cap/participation/floor. */
  uncappedRatePct: number;
  /** Dollars of index gain the cap kept out of the policy this year. */
  capGivenUp: number;
  costOfInsurance: number;
  expenses: number;
  cashValue: number;
  surrenderValue: number;
  deathBenefit: number;
  baselineBalance: number;
}

export interface IulResult {
  rows: IulYearRow[] | null;
  totalPremium: number | null;
  totalCostOfInsurance: number | null;
  totalExpenses: number | null;
  totalCapGivenUp: number | null;
  finalCashValue: number | null;
  finalSurrenderValue: number | null;
  finalBaselineBalance: number | null;
  /** First year the IUL surrender value exceeds the baseline. null = never inside the horizon. */
  crossoverYear: number | null;
  /** Year cash value is exhausted by charges. null = does not lapse inside the horizon. */
  lapseYear: number | null;
  /** Ending cash value the SAME policy would have reached with no cap (participation and floor
   *  still applied, all charges still deducted). The true measure of what the cap costs: the
   *  annual `capGivenUp` figures never compound, this one does. */
  uncappedFinalCashValue: number | null;
  /** uncappedFinalCashValue minus finalCashValue. The compounded lifetime cost of the cap. */
  capCostCompounded: number | null;
}

const EMPTY: IulResult = {
  rows: null,
  totalPremium: null,
  totalCostOfInsurance: null,
  totalExpenses: null,
  totalCapGivenUp: null,
  finalCashValue: null,
  finalSurrenderValue: null,
  finalBaselineBalance: null,
  crossoverYear: null,
  lapseYear: null,
  uncappedFinalCashValue: null,
  capCostCompounded: null,
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** IRC section 7702 forces a minimum gap between death benefit and cash value: as cash value grows
 *  toward the face amount, the death benefit must rise to stay life insurance. Without this, a
 *  well-funded policy's net amount at risk falls to zero and the model stops charging COI
 *  entirely, which makes an IUL look considerably better than it is. Simplified age-banded
 *  corridor percentages from the cash-value-accumulation test. */
function corridorFactor(age: number): number {
  if (age <= 40) return 2.5;
  if (age >= 95) return 1.0;
  if (age <= 45) return 2.15;
  if (age <= 50) return 1.85;
  if (age <= 55) return 1.5;
  if (age <= 60) return 1.3;
  if (age <= 65) return 1.2;
  if (age <= 70) return 1.15;
  if (age <= 75) return 1.05;
  if (age <= 90) return 1.05;
  return 1.0;
}

/** A repeating sequence standing in for real index behaviour: strong years the cap clips, flat
 *  years, and down years the floor catches. Deterministic so the output is reproducible and
 *  hand-checkable. Scaled so its mean equals the assumed return the user entered. */
const PATTERN = [0.22, 0.09, -0.06, 0.15, 0.03, 0.28, -0.14, 0.11, 0.06, 0.19];
const PATTERN_MEAN = PATTERN.reduce((a, b) => a + b, 0) / PATTERN.length;

export function computeIul(input: IulInput): IulResult {
  const currentAge = Math.round(input.currentAge ?? 0);
  const projectToAge = Math.round(input.projectToAge ?? 0);
  const years = projectToAge - currentAge;
  if (!(years > 0) || !(currentAge > 0)) return { ...EMPTY };

  const annualPremium = Math.max(0, input.annualPremium ?? 0);
  const yearsFunded = Math.min(years, Math.max(0, Math.round(input.yearsFunded ?? 0)));
  const deathBenefit = Math.max(0, input.deathBenefit ?? 0);
  const cap = Math.max(0, input.capRatePct ?? 0) / 100;
  const par = Math.max(0, input.participationRatePct ?? 0) / 100;
  const floor = Math.max(0, input.floorPct ?? 0) / 100;
  const assumed = (input.assumedIndexReturnPct ?? 0) / 100;
  const coiRate0 = Math.max(0, input.coiPerThousand ?? 0);
  const coiEsc = Math.max(0, input.coiEscalationPct ?? 0) / 100;
  const load = Math.min(100, Math.max(0, input.premiumLoadPct ?? 0)) / 100;
  const adminAnnual = Math.max(0, input.monthlyAdminFee ?? 0) * 12;
  const surrPct0 = Math.min(100, Math.max(0, input.surrenderChargePct ?? 0)) / 100;
  const surrYears = Math.max(0, Math.round(input.surrenderChargeYears ?? 0));

  const baseR = Math.max(0, input.baselineReturnPct ?? 0) / 100;
  const baseER = Math.max(0, input.baselineExpenseRatioPct ?? 0) / 100;
  const matchPct = Math.max(0, input.employerMatchPct ?? 0) / 100;
  const taxRate = Math.min(100, Math.max(0, input.taxRatePct ?? 0)) / 100;
  const isK = input.baseline === "401k";

  const rows: IulYearRow[] = [];
  let cashValue = 0;
  // A twin of the same policy with the cap lifted, carrying every identical charge. Its ending
  // value minus the real one is the compounded lifetime cost of the cap.
  let uncappedCashValue = 0;
  let baselineBalance = 0;
  let totalPremium = 0;
  let totalCoi = 0;
  let totalExpenses = 0;
  let totalCapGivenUp = 0;
  let lapseYear: number | null = null;
  let crossoverYear: number | null = null;

  for (let y = 1; y <= years; y++) {
    const age = currentAge + y - 1;

    // Once a policy lapses the coverage is over: no further premium is paid into it and no further
    // charge is taken. Continuing to accrue cost of insurance against a dead policy would inflate
    // the lifetime-charge totals into a meaningless number. The baseline keeps running so the
    // comparison still has something to show.
    if (lapseYear !== null) {
      const contributionAfterLapse = 0;
      if (isK) {
        baselineBalance += contributionAfterLapse;
        baselineBalance *= 1 + (baseR - baseER);
      } else {
        const gainAfterLapse = baselineBalance * (baseR - baseER);
        baselineBalance += gainAfterLapse - gainAfterLapse * taxRate;
      }
      rows.push({
        year: y,
        age,
        premiumPaid: 0,
        creditedRatePct: 0,
        uncappedRatePct: 0,
        capGivenUp: 0,
        costOfInsurance: 0,
        expenses: 0,
        cashValue: 0,
        surrenderValue: 0,
        deathBenefit: 0,
        baselineBalance: round2(baselineBalance),
      });
      continue;
    }

    const premium = y <= yearsFunded ? annualPremium : 0;

    // ---- Index return for the year ----
    // Shift the deterministic pattern so its mean matches the user's assumed return.
    const uncapped = input.variableReturns
      ? PATTERN[(y - 1) % PATTERN.length] - PATTERN_MEAN + assumed
      : assumed;

    // ---- Policy: premium in, load off the top ----
    const loadCharge = premium * load;
    cashValue += premium - loadCharge;

    // ---- Credited interest: participation, then cap, then floor ----
    // The floor catches an index LOSS. It does not stop the charges below.
    const beforeCap = uncapped * par;
    const credited = Math.max(floor, Math.min(beforeCap, cap));
    const interest = cashValue * credited;
    // What the cap kept out this year: only counted when the capped rate actually binds.
    const uncappedInterest = cashValue * Math.max(floor, beforeCap);
    const givenUp = Math.max(0, uncappedInterest - interest);
    cashValue += interest;

    // ---- Charges: COI on the net amount at risk, plus admin ----
    // COI rises with age. This is the lapse mechanism.
    const coiRate = coiRate0 * Math.pow(1 + coiEsc, y - 1);
    // Section 7702's corridor keeps a real policy's death benefit above its cash value, so the net
    // amount at risk never collapses to zero the way an unconstrained model would let it.
    const yearDeathBenefit = Math.max(deathBenefit, cashValue * corridorFactor(age));
    const netAtRisk = Math.max(0, yearDeathBenefit - cashValue);
    const coi = (netAtRisk / 1000) * coiRate;
    const expenses = loadCharge + adminAnnual;
    cashValue -= coi + adminAnnual;

    // ---- The uncapped twin: same premium, same charges, no cap ----
    uncappedCashValue += premium - loadCharge;
    uncappedCashValue += uncappedCashValue * Math.max(floor, beforeCap);
    const uncappedDb = Math.max(deathBenefit, uncappedCashValue * corridorFactor(age));
    uncappedCashValue -= (Math.max(0, uncappedDb - uncappedCashValue) / 1000) * coiRate + adminAnnual;
    if (uncappedCashValue < 0) uncappedCashValue = 0;

    if (cashValue <= 0) {
      cashValue = 0;
      if (lapseYear === null) lapseYear = y;
    }

    totalPremium += premium;
    totalCoi += coi;
    totalExpenses += expenses;
    totalCapGivenUp += givenUp;

    // ---- Surrender value: cash value minus the grading surrender charge ----
    const surrRemaining = surrYears > 0 ? Math.max(0, (surrYears - (y - 1)) / surrYears) : 0;
    const surrenderValue = Math.max(0, cashValue * (1 - surrPct0 * surrRemaining));

    // ---- Baseline: the same premium dollars into a 401(k) or a brokerage ----
    const contribution = premium;
    if (isK) {
      baselineBalance += contribution * (1 + matchPct);
      baselineBalance *= 1 + (baseR - baseER);
    } else {
      baselineBalance += contribution;
      const gain = baselineBalance * (baseR - baseER);
      baselineBalance += gain - gain * taxRate;
    }

    if (crossoverYear === null && surrenderValue > baselineBalance && y > 1) {
      crossoverYear = y;
    }

    rows.push({
      year: y,
      age,
      premiumPaid: round2(premium),
      creditedRatePct: round2(credited * 100),
      uncappedRatePct: round2(uncapped * 100),
      capGivenUp: round2(givenUp),
      costOfInsurance: round2(coi),
      expenses: round2(expenses),
      cashValue: round2(cashValue),
      surrenderValue: round2(surrenderValue),
      deathBenefit: round2(yearDeathBenefit),
      baselineBalance: round2(baselineBalance),
    });
  }

  const last = rows[rows.length - 1];
  return {
    rows,
    totalPremium: round2(totalPremium),
    totalCostOfInsurance: round2(totalCoi),
    totalExpenses: round2(totalExpenses),
    totalCapGivenUp: round2(totalCapGivenUp),
    finalCashValue: last.cashValue,
    finalSurrenderValue: last.surrenderValue,
    finalBaselineBalance: last.baselineBalance,
    crossoverYear,
    lapseYear,
    uncappedFinalCashValue: round2(uncappedCashValue),
    capCostCompounded: round2(Math.max(0, uncappedCashValue - cashValue)),
  };
}
