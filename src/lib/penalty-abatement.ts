// Pure IRS Penalty Abatement engine for /tax-resolution/penalty-abatement-calculator/.
//   estimateAbatement() — takes penalty type + amount + compliance signals → estimated abatement
//   dollars + First Time Abate (FTA) vs Reasonable Cause routing + likelihood band.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - First Time Abate: https://www.irs.gov/payments/penalty-relief-due-to-first-time-abate-or-other-administrative-waiver
//     Criteria:
//       (a) No penalties (except estimated-tax) assessed in the prior 3 years (or abated for
//           reasonable cause / IRS error).
//       (b) All required returns filed (or valid extension on file).
//       (c) All tax owed paid or arranged (installment agreement counts).
//     Eligible penalties under FTA: Failure to File (§6651(a)(1)), Failure to Pay (§6651(a)(2)/(a)(3)),
//       Failure to Deposit (§6656). Accuracy-related (§6662) is NOT FTA-eligible.
//   - Reasonable Cause: https://www.irs.gov/payments/penalty-relief-for-reasonable-cause
//     Case-by-case; standard is "ordinary business care and prudence." Broader penalty coverage
//     (including accuracy-related). Common bases: death/serious illness, natural disaster,
//     unable to obtain records, written IRS advice reliance, ordinary care exercised.
//   - Failure-to-File penalty: 5%/month of unpaid tax, max 25% (§6651(a)(1)). Reduced by the FTP
//     rate when both apply in the same month (so FTF+FTP together = 5%/mo).
//   - Failure-to-Pay: 0.5%/month, max 25%; 0.25% on approved IA; 1% after Notice of Intent to Levy.
//   - Minimum FTF penalty for returns > 60 days late: $525 or 100% of tax due (whichever less)
//     for returns due after 12/31/2025.

export type PenaltyType =
  | "failure-to-file"     // §6651(a)(1) — 5%/mo cap 25%; FTA-eligible
  | "failure-to-pay"      // §6651(a)(2)/(a)(3) — 0.5%/mo cap 25%; FTA-eligible
  | "failure-to-deposit"  // §6656 — FTA-eligible
  | "accuracy-related"    // §6662 — NOT FTA-eligible; only reasonable-cause
  | "estimated-tax";      // §6654 — NOT abatable; the taxpayer must pay

export type AbatementPath = "fta" | "reasonable-cause" | "none";
export type LikelihoodBand = "high" | "moderate" | "low" | "not-eligible";

export interface PenaltyAbatementInput {
  /** Which penalty is on the notice? */
  penaltyType: PenaltyType;
  /** Total penalty dollars assessed (across all months, for this penalty type). */
  penaltyAmount: number;
  /** Were you penalty-free for the prior 3 tax years? (Estimated-tax penalty doesn't count.) */
  cleanPriorThreeYears: boolean;
  /** Are all required returns filed (or extension on file)? */
  filingCurrent: boolean;
  /** Is the underlying tax paid or arranged (installment agreement counts)? */
  taxPaidOrArranged: boolean;
  /** Did a documented reasonable-cause event apply? (death/serious illness, disaster, records lost, IRS-written advice, etc.) */
  reasonableCauseEvent: boolean;
}

export interface PenaltyAbatementResult {
  /** Which route is available. */
  path: AbatementPath;
  /** Estimated abatement dollars. */
  estimatedAbatement: number;
  /** Likelihood band for the recommended route. */
  likelihood: LikelihoodBand;
  /** Human-readable explanation of the routing decision. */
  reason: string;
  /** Which IRS form / procedure to use. */
  howToRequest: string;
  /** Is FTA on the table (meets the 3 criteria AND penalty type is eligible)? */
  ftaEligible: boolean;
  /** Is Reasonable Cause on the table (any penalty type; case-by-case)? */
  reasonableCauseEligible: boolean;
}

// Penalty types eligible for FTA (First Time Abate administrative waiver).
const FTA_ELIGIBLE = new Set<PenaltyType>([
  "failure-to-file",
  "failure-to-pay",
  "failure-to-deposit",
]);

export function estimateAbatement(input: PenaltyAbatementInput): PenaltyAbatementResult {
  const amt = Math.max(0, input.penaltyAmount || 0);
  const type = input.penaltyType;

  // Estimated-tax penalty is not administratively abatable.
  if (type === "estimated-tax") {
    return {
      path: "none",
      estimatedAbatement: 0,
      likelihood: "not-eligible",
      reason: "The estimated-tax penalty under IRC §6654 is not administratively abatable. Options: (1) file Form 2210 to compute an annualized income safe harbor if income was uneven; (2) request reasonable cause under the narrow §6654(e)(3)(A) exception for casualty, disaster, or unusual circumstances; (3) pay it and adjust future withholding.",
      howToRequest: "File Form 2210 with your return; or write to the address on the notice citing §6654(e)(3)(A)",
      ftaEligible: false,
      reasonableCauseEligible: false,
    };
  }

  const ftaTypeOk = FTA_ELIGIBLE.has(type);
  const ftaCriteriaOk = input.cleanPriorThreeYears && input.filingCurrent && input.taxPaidOrArranged;
  const ftaEligible = ftaTypeOk && ftaCriteriaOk;

  // Reasonable Cause is available for a broader set of penalties (including accuracy-related).
  const reasonableCauseEligible = input.reasonableCauseEvent;

  if (ftaEligible) {
    return {
      path: "fta",
      estimatedAbatement: amt,
      likelihood: "high",
      reason:
        "You meet all three First Time Abate criteria: penalty-free for the prior 3 tax years, all required returns filed, and the tax is paid or under an installment agreement. FTA is an administrative waiver — the IRS grants it on request without requiring you to prove hardship. It's essentially automatic for eligible penalties.",
      howToRequest:
        "Call the IRS toll-free number on your penalty notice and request First Time Abate. If denied, file Form 843 (Claim for Refund and Request for Abatement).",
      ftaEligible: true,
      reasonableCauseEligible,
    };
  }

  if (reasonableCauseEligible) {
    // Reasonable-cause success rate is more variable; band by how strong the case looks.
    // Without more inputs (documentation strength), default to moderate.
    return {
      path: "reasonable-cause",
      estimatedAbatement: Math.round(amt * 0.7), // conservative — reasonable cause is granted in part often
      likelihood: "moderate",
      reason:
        ftaTypeOk && !ftaCriteriaOk
          ? "You don't qualify for First Time Abate (prior penalties, unfiled returns, or unpaid tax without an installment agreement), but the reasonable-cause event you described gives you a viable path under the 'ordinary business care and prudence' standard."
          : "This penalty type isn't eligible for First Time Abate (only reasonable cause applies to the accuracy-related penalty under §6662). The reasonable-cause event you described gives you a viable path.",
      howToRequest:
        "File Form 843 with a written statement documenting the reasonable-cause event, its timing, and its causal connection to the failure. Attach supporting evidence (medical records, disaster declaration, IRS written advice, etc.).",
      ftaEligible: false,
      reasonableCauseEligible,
    };
  }

  // No FTA, no reasonable cause — path is limited.
  return {
    path: "none",
    estimatedAbatement: 0,
    likelihood: "low",
    reason:
      ftaTypeOk
        ? "You don't meet all three First Time Abate criteria (need 3 prior clean years + all returns filed + tax paid/arranged) and haven't identified a documented reasonable-cause event. Without one of those two paths, penalty abatement is unlikely. Consider whether an installment agreement — which drops the ongoing failure-to-pay penalty from 0.5% to 0.25% monthly — is a more practical goal."
        : "This penalty type (accuracy-related under §6662) isn't eligible for First Time Abate and there's no reasonable-cause event on the record. Abatement is unlikely without documented facts supporting reasonable cause.",
    howToRequest:
      "Consider a reasonable-cause request if documentable facts exist (illness, disaster, records loss, reliance on IRS advice). Otherwise, consult an Enrolled Agent, CPA, or tax attorney.",
    ftaEligible: false,
    reasonableCauseEligible: false,
  };
}
