// Pure back-taxes-impact engine for /tax-resolution/back-taxes-impact-calculator/.
//   assessBackTaxesImpact() — given balance owed + lien status + years accumulating → surfaces
//   the concrete downstream impacts (mortgage approval, credit score, passport, professional
//   licenses, wage garnishment risk), plus estimated Collection Statute Expiration Date (CSED).
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - CSED: 10 years from assessment. IRC §6502(a)(1). https://www.law.cornell.edu/uscode/text/26/6502
//   - Seriously Delinquent Tax Debt (passport certification threshold), 2026:
//     $65,000 (indexed for inflation from $50k in 2015; verify against IRS.gov page).
//     https://www.irs.gov/businesses/small-businesses-self-employed/revocation-or-denial-of-passport-in-case-of-certain-unpaid-taxes
//   - Notice of Federal Tax Lien (NFTL) is generally filed when balance owed > $10,000 and
//     IRS demands payment go unmet. Public record (recorded at county) → visible on credit
//     reports removed from Equifax/Experian/TransUnion since April 2018 (no longer show tax liens),
//     but still recorded at the county courthouse and visible to lenders on title / public records.
//     https://www.irs.gov/businesses/small-businesses-self-employed/understanding-a-federal-tax-lien
//   - Wage garnishment: IRS can levy wages after (1) demand for payment, (2) Notice of Intent
//     to Levy, and (3) 30-day CDP window elapses without CDP appeal filed. IRC §6331.
//   - Mortgage approval: FHA guidelines (Handbook 4000.1) allow a mortgage with IRS debt if:
//     the debt is under a formal installment agreement AND at least 3 monthly payments have
//     been made on time. Fannie Mae/Freddie Mac follow the same "IA + 3 payments" rule with
//     documentation. A tax lien filed against the property blocks approval until subordinated
//     or released.

export interface BackTaxesImpactInput {
  /** Combined balance owed (tax + penalties + interest), whole dollars. */
  balance: number;
  /** Years since the tax was assessed (used to estimate remaining CSED). */
  yearsSinceAssessment: number;
  /** Has the IRS filed a Notice of Federal Tax Lien? */
  hasFederalTaxLien: boolean;
  /** Are you on an approved installment agreement (with ≥ 3 payments made on time)? */
  onInstallmentAgreementWith3Payments: boolean;
  /** Have you received a Notice of Intent to Levy (Letter 1058 / LT11)? */
  receivedIntentToLevy: boolean;
}

export type ImpactLevel = "clear" | "flag" | "block" | "already-active";

export interface Impact {
  /** Which downstream area is affected. */
  area: "mortgage" | "credit" | "passport" | "professional-licenses" | "wage-garnishment" | "bank-levy";
  level: ImpactLevel;
  headline: string;
  detail: string;
}

export interface BackTaxesImpactResult {
  /** Estimated years remaining on the 10-year CSED (assumes no tolling events; conservative). */
  csedYearsRemaining: number;
  /** True if balance exceeds the Seriously Delinquent Tax Debt threshold (2026: $65,000). */
  seriouslyDelinquent: boolean;
  /** Concrete impact grid, sorted by severity (block → flag → clear). */
  impacts: Impact[];
}

/** 2026 IRC §7345 Seriously Delinquent Tax Debt threshold ($50,000 indexed for inflation). */
const SERIOUSLY_DELINQUENT_THRESHOLD_2026 = 65_000;
/** Standard NFTL filing threshold ($10,000; can vary in individual cases). */
const NFTL_THRESHOLD = 10_000;

export function assessBackTaxesImpact(input: BackTaxesImpactInput): BackTaxesImpactResult {
  const balance = Math.max(0, input.balance || 0);
  const yearsSince = Math.max(0, input.yearsSinceAssessment || 0);
  const csedYearsRemaining = Math.max(0, Math.round((10 - yearsSince) * 10) / 10);
  const seriouslyDelinquent = balance >= SERIOUSLY_DELINQUENT_THRESHOLD_2026;

  const impacts: Impact[] = [];

  // ---- Mortgage approval ----
  if (balance === 0) {
    impacts.push({
      area: "mortgage",
      level: "clear",
      headline: "No IRS-related mortgage obstacle",
      detail: "With no back taxes owed, IRS debt is not a factor in your mortgage approval.",
    });
  } else if (input.hasFederalTaxLien) {
    impacts.push({
      area: "mortgage",
      level: "block",
      headline: "Federal tax lien blocks approval",
      detail:
        "A recorded Notice of Federal Tax Lien on the property (or on you as borrower for a purchase money loan) blocks conventional, FHA, and VA approval until the lien is released, discharged, or subordinated. Options: pay the balance in full, file Form 14135 (Application for Certificate of Discharge) if selling, or Form 14134 (Application for Certificate of Subordination) so a new mortgage can take priority.",
    });
  } else if (input.onInstallmentAgreementWith3Payments) {
    impacts.push({
      area: "mortgage",
      level: "clear",
      headline: "Mortgage approval available with IA + 3 on-time payments",
      detail:
        "Fannie Mae, Freddie Mac, and FHA (Handbook 4000.1) allow mortgage approval when you're on a formal installment agreement AND have made at least 3 monthly payments on time. Bring your IA acceptance letter, your bank statements showing the 3 payments, and a signed acknowledgment that the plan will continue.",
    });
  } else {
    impacts.push({
      area: "mortgage",
      level: "flag",
      headline: "Mortgage blocked until you set up an IA",
      detail:
        "Lenders (Fannie/Freddie/FHA) will not underwrite while there is an unaddressed IRS balance. The fix is to enter a formal installment agreement and make 3 on-time monthly payments. A short-term payment plan (< 180 days) does not count — you need a long-term installment agreement.",
    });
  }

  // ---- Credit score ----
  impacts.push({
    area: "credit",
    level: balance === 0 ? "clear" : (input.hasFederalTaxLien ? "flag" : "clear"),
    headline: balance === 0
      ? "No direct credit-score impact"
      : (input.hasFederalTaxLien
          ? "Tax lien recorded at courthouse (not on credit report since April 2018)"
          : "IRS balance does not appear on your credit report"),
    detail: balance === 0
      ? "IRS debt (paid or none) has no direct credit-score impact."
      : (input.hasFederalTaxLien
          ? "The 3 credit bureaus (Equifax, Experian, TransUnion) removed public-record tax liens from consumer reports in April 2018 under the National Consumer Assistance Plan. But your Notice of Federal Tax Lien is recorded at the county courthouse and shows up in lender title searches, background checks, and public-records databases — so mortgage underwriters, professional-license boards, and some employers still see it."
          : "The IRS does not report to Equifax, Experian, or TransUnion. Your back-tax balance alone doesn't affect your FICO score. It becomes indirect only if the IRS files a Notice of Federal Tax Lien, which is a public record visible on manual lender searches even though it's no longer on credit reports."),
  });

  // ---- Passport ----
  if (seriouslyDelinquent) {
    impacts.push({
      area: "passport",
      level: "block",
      headline: "Passport can be denied or revoked (Seriously Delinquent Tax Debt)",
      detail:
        `Under IRC §7345, the IRS certifies debts over $${SERIOUSLY_DELINQUENT_THRESHOLD_2026.toLocaleString()} (2026 threshold, indexed) to the State Department as Seriously Delinquent Tax Debt. The State Department can then deny new passport applications and revoke existing passports. The fix: enter an installment agreement, get an Offer in Compromise accepted, request Currently Not Collectible status, or pay the balance below the threshold. Certification is reversed within 30 days.`,
    });
  } else if (balance > 0) {
    impacts.push({
      area: "passport",
      level: "clear",
      headline: "Balance below $65,000 Seriously Delinquent threshold",
      detail:
        `Your balance is below the 2026 IRC §7345 threshold of $${SERIOUSLY_DELINQUENT_THRESHOLD_2026.toLocaleString()}, so the IRS should not certify your debt to the State Department. Passport applications and renewals should not be blocked by IRS debt. Continue to monitor — the threshold is indexed for inflation.`,
    });
  } else {
    impacts.push({
      area: "passport",
      level: "clear",
      headline: "No passport impact",
      detail: "With no back taxes owed, there is no IRS-driven passport risk.",
    });
  }

  // ---- Professional licenses ----
  if (balance > 0) {
    impacts.push({
      area: "professional-licenses",
      level: "flag",
      headline: "State licensing boards may see the tax lien",
      detail:
        "Many state boards (medical, legal, real estate, insurance, CPA) run background checks that surface public-record tax liens even though the liens no longer appear on consumer credit reports. Some states have a specific 'good moral character' or 'financial responsibility' provision that back-tax debt can trigger. Check your state's licensing statute or ask the board directly before your next renewal — a formal installment agreement in writing is usually enough to satisfy the concern.",
    });
  }

  // ---- Wage garnishment / bank levy ----
  if (input.receivedIntentToLevy && !input.onInstallmentAgreementWith3Payments) {
    impacts.push({
      area: "wage-garnishment",
      level: "already-active",
      headline: "Wage garnishment / bank levy possible within 30 days",
      detail:
        "You've received a Notice of Intent to Levy (Letter 1058 or LT11). Under IRC §6331, the IRS can garnish wages or levy bank accounts once the 30-day Collection Due Process window elapses without a CDP appeal filed. File Form 12153 (Request for a CDP Hearing) within 30 days of the notice date to stop the levy, or set up an installment agreement immediately.",
    });
  } else if (balance > NFTL_THRESHOLD) {
    impacts.push({
      area: "wage-garnishment",
      level: "flag",
      headline: "Wage garnishment risk if collection notices go ignored",
      detail:
        "The IRS's collection escalation follows a predictable path: CP14 (initial balance due), CP501/CP503 (reminders), CP504 (Intent to Levy state tax refund), and finally Letter 1058 / LT11 (Final Notice of Intent to Levy). Once Letter 1058 is issued and 30 days pass without a CDP appeal, the IRS can levy wages (typically 25%+ of disposable income) or bank accounts. An installment agreement pauses the escalation immediately.",
    });
  }

  // ---- Sort impacts by severity (block/already-active first, then flag, then clear) ----
  const order: Record<ImpactLevel, number> = { block: 0, "already-active": 1, flag: 2, clear: 3 };
  impacts.sort((a, b) => order[a.level] - order[b.level]);

  return {
    csedYearsRemaining,
    seriouslyDelinquent,
    impacts,
  };
}
