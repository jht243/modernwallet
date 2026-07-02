// Pure IRS Payment Plan engine for /tax-resolution/irs-payment-plan-calculator/.
//   computePaymentPlans() — takes balance + monthly capacity + household size → the three viable
//   plan tiers (short-term, streamlined long-term, non-streamlined) with per-tier monthly payment,
//   setup fee, total interest, total penalty, and total repayment.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - Payment plans page: https://www.irs.gov/payments/payment-plans-installment-agreements
//     * Short-term: ≤ 180 days, $0 setup fee, individuals ≤ $100k combined (tax+penalties+interest).
//     * Long-term streamlined online: individuals ≤ $50k combined; setup fees:
//       online + direct debit $22, online non-DDIA $69, phone/mail DDIA $107, phone/mail non-DDIA $178.
//       Low-income (≤ 250% FPL): $43 setup fee (may be reimbursed).
//     * Non-streamlined: > $50k requires Form 433-F.
//   - Failure-to-pay penalty (https://www.irs.gov/payments/failure-to-pay-penalty):
//     * Standard rate: 0.5%/month of unpaid balance.
//     * On approved installment agreement: 0.25%/month.
//     * After Notice of Intent to Levy: 1%/month.
//   - Quarterly interest rate on underpayments (2026 Q3, non-corporate): 7%/year.
//     https://www.irs.gov/payments/quarterly-interest-rates

export type PlanTier = "short-term" | "streamlined-long-term" | "non-streamlined";

export interface IRSPaymentPlanInput {
  /** Combined balance owed: tax + accrued penalties + accrued interest, whole dollars. */
  balance: number;
  /** Monthly payment capacity — what the taxpayer can afford. Used for term/eligibility hints. */
  monthlyCapacity: number;
  /** Household size for Low Income Certification (≤ 250% FPL waives most fees). */
  householdSize: number;
  /** Region for FPL threshold. Default contiguous 48. */
  region?: "contiguous48" | "alaska" | "hawaii";
  /** Approximate annual income (used only for the Low Income Certification threshold check). */
  annualIncome: number;
}

export interface PlanEstimate {
  tier: PlanTier;
  eligible: boolean;
  reason: string;
  /** Term in months. Short-term: ≤ 6. Streamlined: up to 72 (or 84 in some cases). Non-streamlined: up to CSED (120). */
  termMonths: number;
  monthlyPayment: number;
  setupFee: number;
  /** Total underpayment interest over the life of the plan (7%/yr APR on avg outstanding balance). */
  totalInterest: number;
  /** Total FTP penalty over the life of the plan. 0.5%/mo short-term, 0.25%/mo on approved IA. */
  totalPenalty: number;
  /** Total dollars paid over the life of the plan (principal + interest + penalty). */
  totalRepayment: number;
  /** How to apply (short human string). */
  howToApply: string;
}

export interface IRSPaymentPlanResult {
  /** True if this filer qualifies for Low Income Certification (fee reductions/waivers). */
  lowIncomeCertification: boolean;
  /** The three plan tiers, each with eligibility + estimate. */
  plans: PlanEstimate[];
  /** The engine's suggested pick (highest-eligible tier that fits monthlyCapacity). */
  recommendedTier: PlanTier | null;
}

// 2026 Federal Poverty Guidelines snapshot (same as src/lib/oic.ts).
const FPG_2026_48: Record<number, number> = {
  1: 15060, 2: 20440, 3: 25820, 4: 31200, 5: 36580, 6: 41960, 7: 47340, 8: 52720,
};
const FPG_2026_ALASKA: Record<number, number> = {
  1: 18810, 2: 25540, 3: 32270, 4: 39000, 5: 45730, 6: 52460, 7: 59190, 8: 65920,
};
const FPG_2026_HAWAII: Record<number, number> = {
  1: 17310, 2: 23490, 3: 29670, 4: 35850, 5: 42030, 6: 48210, 7: 54390, 8: 60570,
};

function annualFPL(householdSize: number, region: IRSPaymentPlanInput["region"]): number {
  const size = Math.max(1, Math.min(8, Math.round(householdSize || 1)));
  const table =
    region === "alaska" ? FPG_2026_ALASKA :
    region === "hawaii" ? FPG_2026_HAWAII :
    FPG_2026_48;
  const base = table[size]!;
  const add = region === "alaska" ? 6730 : region === "hawaii" ? 6180 : 5380;
  const extra = Math.max(0, (householdSize || 1) - 8);
  return base + extra * add;
}

/** 2026 Q3 non-corporate underpayment interest rate (annual, decimal). */
const UNDERPAYMENT_APR = 0.07;
/** Failure-to-pay monthly rate on an approved installment agreement (§6651(a)(2) reduced rate). */
const FTP_MONTHLY_IA = 0.0025;
/** Failure-to-pay monthly rate for a short-term / no-formal-IA situation. */
const FTP_MONTHLY_STANDARD = 0.005;
/** IRS FTP cap: 25% of the unpaid tax. */
const FTP_CAP_FRACTION = 0.25;

interface CostBreakdown { interest: number; penalty: number; }

/** Compute total interest + FTP over the plan life on a linearly-amortizing balance.
 *  Average outstanding balance = balance/2 (linear payoff). */
function costOverPlan(balance: number, months: number, ftpMonthly: number): CostBreakdown {
  const avgBalance = balance / 2;
  const interest = avgBalance * UNDERPAYMENT_APR * (months / 12);
  // FTP is capped at 25% of the tax portion. This is an approximation — we cap at 25% of balance.
  const penaltyUncapped = avgBalance * ftpMonthly * months;
  const penalty = Math.min(penaltyUncapped, balance * FTP_CAP_FRACTION);
  return {
    interest: Math.round(interest),
    penalty: Math.round(penalty),
  };
}

export function computePaymentPlans(input: IRSPaymentPlanInput): IRSPaymentPlanResult {
  const balance = Math.max(0, input.balance || 0);
  const capacity = Math.max(0, input.monthlyCapacity || 0);
  const income = Math.max(0, input.annualIncome || 0);
  const householdSize = Math.max(1, Math.round(input.householdSize || 1));
  const fplThreshold = 2.5 * annualFPL(householdSize, input.region);
  const lowIncomeCertification = income <= fplThreshold;

  // ---- Short-term payment plan (≤ 180 days = 6 months) ----
  const shortEligible = balance > 0 && balance <= 100_000;
  const shortMonths = Math.min(6, Math.max(1, Math.ceil(balance / Math.max(capacity, 1))));
  const shortMonthly = balance / shortMonths;
  const shortCost = costOverPlan(balance, shortMonths, FTP_MONTHLY_STANDARD);
  const shortSetupFee = 0;
  const shortReason = shortEligible
    ? `Combined debt ≤ $100,000 qualifies you for a short-term plan. No setup fee, but FTP penalty stays at 0.5%/month (not reduced) because this isn't a formal Installment Agreement.`
    : `Combined debt exceeds the $100,000 short-term limit for individuals.`;

  // ---- Streamlined long-term IA (≤ $50k, online, 72 months) ----
  const streamlinedEligible = balance > 0 && balance <= 50_000;
  const streamlinedMonths = 72;
  const streamlinedMonthly = balance / streamlinedMonths;
  const streamlinedCost = costOverPlan(balance, streamlinedMonths, FTP_MONTHLY_IA);
  const streamlinedSetupFee = lowIncomeCertification ? 43 : 22;
  const streamlinedReason = streamlinedEligible
    ? `Combined debt ≤ $50,000 qualifies for the streamlined online agreement. ${lowIncomeCertification ? "Low Income Certification means $43 setup (may be reimbursed)." : "$22 setup with direct debit online."} FTP penalty drops from 0.5% to 0.25% per month once approved.`
    : `Combined debt exceeds the $50,000 streamlined limit for individuals. You'll need a non-streamlined agreement (Form 433-F required).`;

  // ---- Non-streamlined IA (> $50k, requires Form 433-F, up to 120 months = CSED cap) ----
  const nonStreamlinedEligible = balance > 0;
  // Term is the shorter of: months to pay off at capacity, or 120 (CSED cap).
  const nonStreamlinedMonths = capacity > 0
    ? Math.min(120, Math.max(24, Math.ceil(balance / capacity)))
    : 84;
  const nonStreamlinedMonthly = balance / nonStreamlinedMonths;
  const nonStreamlinedCost = costOverPlan(balance, nonStreamlinedMonths, FTP_MONTHLY_IA);
  const nonStreamlinedSetupFee = lowIncomeCertification ? 43 : 178; // phone/mail non-DDIA
  const nonStreamlinedReason = balance > 50_000
    ? `Debt > $50,000 puts you outside the online streamlined program. Form 433-F required. Term up to 120 months (CSED cap). FTP penalty drops from 0.5% to 0.25% per month once approved.`
    : `Available for any balance but the streamlined option above is cheaper to set up and administer.`;

  const plans: PlanEstimate[] = [
    {
      tier: "short-term",
      eligible: shortEligible,
      reason: shortReason,
      termMonths: shortMonths,
      monthlyPayment: round2(shortMonthly),
      setupFee: shortSetupFee,
      totalInterest: shortCost.interest,
      totalPenalty: shortCost.penalty,
      totalRepayment: Math.round(balance + shortCost.interest + shortCost.penalty + shortSetupFee),
      howToApply: "Apply online at irs.gov/payments — Online Payment Agreement",
    },
    {
      tier: "streamlined-long-term",
      eligible: streamlinedEligible,
      reason: streamlinedReason,
      termMonths: streamlinedMonths,
      monthlyPayment: round2(streamlinedMonthly),
      setupFee: streamlinedSetupFee,
      totalInterest: streamlinedCost.interest,
      totalPenalty: streamlinedCost.penalty,
      totalRepayment: Math.round(balance + streamlinedCost.interest + streamlinedCost.penalty + streamlinedSetupFee),
      howToApply: "Apply online at irs.gov/payments — Online Payment Agreement (direct debit)",
    },
    {
      tier: "non-streamlined",
      eligible: nonStreamlinedEligible,
      reason: nonStreamlinedReason,
      termMonths: nonStreamlinedMonths,
      monthlyPayment: round2(nonStreamlinedMonthly),
      setupFee: nonStreamlinedSetupFee,
      totalInterest: nonStreamlinedCost.interest,
      totalPenalty: nonStreamlinedCost.penalty,
      totalRepayment: Math.round(balance + nonStreamlinedCost.interest + nonStreamlinedCost.penalty + nonStreamlinedSetupFee),
      howToApply: "Submit Form 9465 + Form 433-F by mail or through your tax professional",
    },
  ];

  // ---- Recommendation ----
  let recommendedTier: PlanTier | null = null;
  if (balance > 0) {
    if (shortEligible && capacity >= plans[0]!.monthlyPayment) {
      recommendedTier = "short-term";
    } else if (streamlinedEligible) {
      recommendedTier = "streamlined-long-term";
    } else {
      recommendedTier = "non-streamlined";
    }
  }

  return { lowIncomeCertification, plans, recommendedTier };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
