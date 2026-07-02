// Pure decision-tree engine for the /tax-resolution/ hub calculator.
//   recommendReliefPrograms() — takes the taxpayer's debt/income/expenses/assets → recommends the
//   right IRS relief program(s) with a professional-cost band and a plain-language reason.
// ZERO React/DOM deps → safe at build time (stat injection) and runtime (island).
//
// Primary-source grounding (verified July 2026):
//   OIC RCP formula (IRM 5.8.5, Form 656-B): offer ≥ Net Realizable Equity + Future Income × K
//     K = 12 for Lump-Sum Cash Offer (5 or fewer payments within 5 months)
//     K = 24 for Periodic Payment Offer (6–24 months)
//   OIC application fee: $205 (waived if AGI ≤ 250% federal poverty guidelines).
//   Installment Agreement tiers (irs.gov/payments/payment-plans-installment-agreements):
//     Short-term: ≤ 180 days, $0 setup, individuals ≤ $100k combined.
//     Streamlined online: ≤ $50k combined for individuals; $22 online DDIA / $69 online non-DDIA.
//     Non-streamlined: > $50k requires Form 433-F financials.
//     PPIA (IRM 5.14.2): pay less than full over remaining CSED; requires 433 financials.
//     On any approved IA, failure-to-pay drops from 0.5%/mo to 0.25%/mo.
//   CNC / Status 53 (IRM 5.16.1): hardship suspends active collection; interest+penalties keep
//     accruing; CSED (10-yr per IRC §6502(a)(1)) keeps running.
//   Filing compliance: ALL relief programs require every required return filed first.
//   Innocent Spouse (IRC §6015; Pub 971; Form 8857): 2-yr deadline for (b)/(c); flexible for (f).
//   First Time Abate (FTA): 3 prior clean years + all returns filed + tax paid/arranged.
//   Underpayment interest rate 2026 Q3: 7%/yr (non-corporate; irs.gov/payments/quarterly-interest-rates).
//
// Professional cost ranges (practitioner surveys — TaxCure, boutique tax-attorney fee schedules):
//   OIC: $3,500–$7,500 typical, up to $10k+ complex.
//   Streamlined IA: $500–$1,500 (much can be DIY online).
//   Non-streamlined / PPIA: $1,500–$3,500.
//   Penalty Abatement (FTA / Reasonable Cause): $500–$1,500 (FTA on the low end).
//   Innocent Spouse: $2,500–$5,000+ (documentation-heavy).

export type ProgramKey =
  | "oic"
  | "ia-short"
  | "ia-streamlined"
  | "ia-nonstreamlined"
  | "ia-ppia"
  | "cnc"
  | "fta"
  | "innocent-spouse"
  | "file-returns-first";

export type FitLabel = "primary" | "strong" | "possible" | "unlikely";

export interface ProgramRecommendation {
  key: ProgramKey;
  name: string;
  /** How well this fits the taxpayer's situation. */
  fit: FitLabel;
  /** [low, high] typical professional cost, in whole dollars. */
  costLow: number;
  costHigh: number;
  /** Plain-language reason grounded in the engine inputs. */
  reason: string;
  /** IRS form(s) or key requirement the taxpayer needs to know. */
  keyRequirement?: string;
}

export interface TaxResolutionInput {
  /** Total tax debt (tax + penalties + interest), whole dollars. */
  totalDebt: number;
  /** Number of years behind on filing (0 = current). */
  yearsBehind: number;
  /** Household monthly income (gross), whole dollars. */
  monthlyIncome: number;
  /** IRS allowable monthly living expenses — housing, food, transportation, healthcare, taxes.
   *  If unknown, use the IRS Collection Financial Standards for the taxpayer's county + family size. */
  monthlyAllowableExpenses: number;
  /** Net realizable equity in assets (real estate + vehicles + accounts + investments − loans).
   *  Whole dollars. */
  assetEquity: number;
  /** Is the debt joint or from a spouse's under-reporting? Gates the Innocent Spouse route. */
  isJointSpousal: boolean;
  /** Was the taxpayer penalty-free for the 3 prior years? Gates First Time Abate. */
  cleanPriorThreeYears?: boolean;
}

export interface TaxResolutionResult {
  /** Monthly disposable income used in the RCP formula (income − allowable expenses, floored at 0). */
  monthlyDisposable: number;
  /** IRS Reasonable Collection Potential for a Lump-Sum Cash Offer: NRE + 12 × disposable. */
  rcpLumpSum: number;
  /** IRS Reasonable Collection Potential for a Periodic Payment Offer: NRE + 24 × disposable. */
  rcpPeriodic: number;
  /** Streamlined IA estimated monthly payment (72 months, minimum practical). */
  streamlinedIAMonthly: number | null;
  /** True if any required returns are unfiled — a hard prerequisite for every other program. */
  filingComplianceGap: boolean;
  /** The best-fit program for the taxpayer's situation. */
  primary: ProgramRecommendation;
  /** Additional programs to consider (strong/possible fits), in fit order. */
  others: ProgramRecommendation[];
  /** Headline number to display in the hero — depends on `primary.key`. */
  headline: { label: string; value: string };
}

// ---- Program catalog (labels, cost bands, form/statute) ----

interface ProgramSpec {
  name: string;
  costLow: number;
  costHigh: number;
  keyRequirement: string;
}

const PROGRAMS: Record<ProgramKey, ProgramSpec> = {
  "oic": {
    name: "Offer in Compromise",
    costLow: 3500,
    costHigh: 7500,
    keyRequirement: "IRS Form 656 + Form 433-A(OIC); $205 application fee (waived if income ≤ 250% FPL)",
  },
  "ia-short": {
    name: "Short-Term Payment Plan",
    costLow: 0,
    costHigh: 500,
    keyRequirement: "Pay in full within 180 days; individuals with combined debt ≤ $100,000; $0 setup fee",
  },
  "ia-streamlined": {
    name: "Streamlined Installment Agreement",
    costLow: 500,
    costHigh: 1500,
    keyRequirement: "Combined debt ≤ $50,000 for individuals; apply online with $22 direct-debit setup",
  },
  "ia-nonstreamlined": {
    name: "Non-Streamlined Installment Agreement",
    costLow: 1500,
    costHigh: 3500,
    keyRequirement: "Combined debt > $50,000 requires Form 433-F (Collection Information Statement)",
  },
  "ia-ppia": {
    name: "Partial Pay Installment Agreement",
    costLow: 1500,
    costHigh: 3500,
    keyRequirement: "Form 433-F + 2-year mandatory reviews; pay less than full over remaining CSED",
  },
  "cnc": {
    name: "Currently Not Collectible (Status 53)",
    costLow: 750,
    costHigh: 2000,
    keyRequirement: "Form 433-F showing allowable expenses ≥ income; interest & penalties keep accruing",
  },
  "fta": {
    name: "First Time Abate (Penalty Abatement)",
    costLow: 500,
    costHigh: 1500,
    keyRequirement: "Call the IRS or file Form 843; needs 3 prior clean years + all returns filed",
  },
  "innocent-spouse": {
    name: "Innocent Spouse Relief",
    costLow: 2500,
    costHigh: 5000,
    keyRequirement: "IRS Form 8857; 2-year deadline from first IRS collection notice for §6015(b)/(c)",
  },
  "file-returns-first": {
    name: "File your missing returns first",
    costLow: 300,
    costHigh: 1500,
    keyRequirement: "Every relief program requires all required returns filed first — this is step zero",
  },
};

function make(
  key: ProgramKey,
  fit: FitLabel,
  reason: string,
  override?: Partial<ProgramSpec>,
): ProgramRecommendation {
  const p = { ...PROGRAMS[key], ...override };
  return {
    key,
    name: p.name,
    fit,
    costLow: p.costLow,
    costHigh: p.costHigh,
    reason,
    keyRequirement: p.keyRequirement,
  };
}

// ---- Formatting helpers (used by headline builders) ----

function usd(n: number): string {
  if (!isFinite(n)) return "—";
  return "$" + Math.round(n).toLocaleString("en-US");
}

// ---- Engine ----

export function recommendReliefPrograms(input: TaxResolutionInput): TaxResolutionResult {
  const debt = Math.max(0, input.totalDebt || 0);
  const yrsBehind = Math.max(0, Math.round(input.yearsBehind || 0));
  const income = Math.max(0, input.monthlyIncome || 0);
  const expenses = Math.max(0, input.monthlyAllowableExpenses || 0);
  const equity = Math.max(0, input.assetEquity || 0);
  const monthlyDisposable = Math.max(0, income - expenses);
  const rcpLumpSum = round0(equity + 12 * monthlyDisposable);
  const rcpPeriodic = round0(equity + 24 * monthlyDisposable);
  const filingGap = yrsBehind >= 1;

  // Streamlined IA — 72 months is the standard cap for a debt ≤ $50k on Form 9465.
  const streamlinedMonths = 72;
  const streamlinedIAMonthly =
    debt > 0 && debt <= 50_000 ? round2(debt / streamlinedMonths) : null;

  // ---- Filing compliance is the hard gate. If returns are missing, that's step zero. ----
  if (filingGap) {
    const others: ProgramRecommendation[] = [];
    // Once caught up, show the next-most-likely fit as a "then" step.
    others.push(nextBestAfterCompliance(debt, monthlyDisposable, equity, rcpLumpSum, input));
    return {
      monthlyDisposable,
      rcpLumpSum,
      rcpPeriodic,
      streamlinedIAMonthly,
      filingComplianceGap: true,
      primary: make(
        "file-returns-first",
        "primary",
        `You reported being ${yrsBehind} year${yrsBehind === 1 ? "" : "s"} behind on filing. Every IRS relief program — OIC, installment agreement, CNC, penalty abatement — requires that all required returns be filed first. Bring filings current, then choose a relief path.`,
      ),
      others,
      headline: { label: "First step", value: "File your missing returns" },
    };
  }

  const others: ProgramRecommendation[] = [];

  // ---- Hardship (CNC) — allowable expenses ≥ income and thin equity ----
  const hardship = monthlyDisposable === 0 && equity < Math.max(2000, debt * 0.05);

  if (hardship) {
    // CNC primary.
    if (input.cleanPriorThreeYears) {
      others.push(
        make(
          "fta",
          "possible",
          "Because you've been penalty-free for the last 3 years, you can also request First Time Abate on the failure-to-file / failure-to-pay penalties baked into your balance. It's free to request and doesn't change your CNC status.",
        ),
      );
    }
    if (input.isJointSpousal) {
      others.push(
        make(
          "innocent-spouse",
          "possible",
          "The debt is joint or from a spouse. Innocent Spouse Relief under IRC §6015 can shift liability off your account entirely — worth pursuing before locking into CNC.",
        ),
      );
    }
    return {
      monthlyDisposable,
      rcpLumpSum,
      rcpPeriodic,
      streamlinedIAMonthly,
      filingComplianceGap: false,
      primary: make(
        "cnc",
        "primary",
        `Your allowable living expenses meet or exceed your income and you have no material asset equity. That's the definition of hardship under IRM 5.16.1 — the IRS should place your account in Currently Not Collectible status. Interest and penalties will keep accruing, but active collection stops. The 10-year CSED clock keeps running in your favor.`,
      ),
      others,
      headline: { label: "Active collection", value: "Suspended (Status 53)" },
    };
  }

  // ---- OIC — viable when RCP (lump-sum) is less than the debt ----
  const oicViable = rcpLumpSum < debt;
  const oicMargin = debt > 0 ? (debt - rcpLumpSum) / debt : 0;

  if (oicViable && oicMargin > 0.1) {
    // Primary OIC recommendation.
    const oicReason =
      `Your Reasonable Collection Potential — the IRS's own formula, net asset equity plus 12 months of disposable income — is ${usd(rcpLumpSum)}, which is ${usd(debt - rcpLumpSum)} below your ${usd(debt)} balance. That gap is what makes an Offer in Compromise viable. Historically ~20% of offers are accepted (FY2025: 21.4%), and offers built to this floor have a real shot.`;
    // Secondary: FTA if clean, PPIA if not eligible for full OIC.
    if (input.cleanPriorThreeYears) {
      others.push(
        make(
          "fta",
          "possible",
          "You mentioned 3 prior clean years — stack First Time Abate on top of the OIC to strip out failure-to-file / failure-to-pay penalties from your balance first. It's free to request.",
        ),
      );
    }
    others.push(
      make(
        "ia-ppia",
        "possible",
        `If the OIC gets rejected, a Partial Pay Installment Agreement is your fallback — you'd pay ~${usd(monthlyDisposable)}/mo over the remaining CSED, which typically totals less than the full balance.`,
      ),
    );
    if (input.isJointSpousal) {
      others.unshift(
        make(
          "innocent-spouse",
          "possible",
          "Because the debt is joint or spousal, file Innocent Spouse Relief (Form 8857) BEFORE the OIC — if granted, it removes the liability from your account entirely, no offer needed.",
        ),
      );
    }
    return {
      monthlyDisposable,
      rcpLumpSum,
      rcpPeriodic,
      streamlinedIAMonthly,
      filingComplianceGap: false,
      primary: make("oic", "primary", oicReason),
      others,
      headline: { label: "Suggested OIC floor", value: usd(rcpLumpSum) },
    };
  }

  // ---- Installment Agreement path — RCP ≥ debt (IRS will collect in full) ----

  // Streamlined IA if debt ≤ $50k.
  if (debt > 0 && debt <= 50_000) {
    const monthly = streamlinedIAMonthly ?? 0;
    const reason =
      `Your combined balance is ≤ $50,000 and your Reasonable Collection Potential (${usd(rcpLumpSum)}) already exceeds the debt, so the IRS will collect in full over time. Apply online for a Streamlined Installment Agreement — a ~${usd(monthly)}/mo direct-debit plan over 72 months costs just $22 to set up. Your failure-to-pay penalty drops from 0.5% to 0.25% per month the moment the plan is approved.`;
    // Secondary: OIC as "unlikely" so users see why.
    others.push(
      make(
        "oic",
        "unlikely",
        `Your RCP (${usd(rcpLumpSum)}) is not enough below your ${usd(debt)} balance for an OIC to make sense — the IRS won't accept less than they can already collect.`,
      ),
    );
    if (input.cleanPriorThreeYears) {
      others.push(
        make(
          "fta",
          "strong",
          "With 3 prior clean years, request First Time Abate on the penalties baked into your balance before setting up the plan — it can meaningfully shrink the amount you're paying interest on.",
        ),
      );
    }
    if (input.isJointSpousal) {
      others.push(
        make(
          "innocent-spouse",
          "possible",
          "Because the debt is joint or spousal, evaluate Innocent Spouse Relief (Form 8857) — if granted, it removes the debt from your account entirely.",
        ),
      );
    }
    return {
      monthlyDisposable,
      rcpLumpSum,
      rcpPeriodic,
      streamlinedIAMonthly,
      filingComplianceGap: false,
      primary: make("ia-streamlined", "primary", reason),
      others,
      headline: { label: "Est. streamlined IA payment", value: `${usd(monthly)}/mo` },
    };
  }

  // Short-term plan if debt ≤ $100k AND monthly disposable × 6 covers it.
  const canPayIn180Days = monthlyDisposable * 6 >= debt;
  if (debt > 0 && debt <= 100_000 && canPayIn180Days) {
    others.push(
      make(
        "ia-streamlined",
        "possible",
        `If you'd rather spread this out, a streamlined 72-month IA at ~${usd(debt / 72)}/mo is available. Cheaper monthly payment, more interest total.`,
      ),
    );
    if (input.cleanPriorThreeYears) {
      others.push(
        make(
          "fta",
          "strong",
          "3 prior clean years qualifies you for First Time Abate on the penalty portion of the balance — strip that off before starting to pay.",
        ),
      );
    }
    return {
      monthlyDisposable,
      rcpLumpSum,
      rcpPeriodic,
      streamlinedIAMonthly,
      filingComplianceGap: false,
      primary: make(
        "ia-short",
        "primary",
        `Your combined balance is ≤ $100,000 and your disposable income can cover it inside 180 days (~${usd(debt / 6)}/mo). A Short-Term Payment Plan is free to set up and avoids the paperwork of a formal installment agreement. Failure-to-pay penalty at 0.5% per month keeps accruing until paid.`,
      ),
      others,
      headline: { label: "Short-term monthly", value: `${usd(debt / 6)}/mo` },
    };
  }

  // Non-streamlined IA — debt > $50k requires Form 433-F.
  if (debt > 50_000) {
    const monthlyEst = monthlyDisposable > 0 ? monthlyDisposable : debt / 84;
    const primary = make(
      "ia-nonstreamlined",
      "primary",
      `Your balance is over $50,000, which puts you outside the online streamlined program. You'll need Form 433-F (Collection Information Statement) and IRS approval on a proposed monthly amount — roughly ${usd(monthlyEst)}/mo based on your disposable income. The failure-to-pay penalty drops from 0.5% to 0.25% per month once the agreement is approved.`,
    );
    // Add PPIA as alternate if the numbers won't cover the full debt over the CSED.
    const csedMonths = 120; // 10 years — max case; actual varies by assessment date.
    if (monthlyDisposable > 0 && monthlyDisposable * csedMonths < debt) {
      others.push(
        make(
          "ia-ppia",
          "strong",
          `Your disposable income (${usd(monthlyDisposable)}/mo × 120 months) wouldn't cover the full ${usd(debt)} inside the 10-year CSED. A Partial Pay Installment Agreement lets you pay what you can — the unpaid balance expires with the CSED.`,
        ),
      );
    }
    if (rcpLumpSum < debt) {
      others.push(
        make(
          "oic",
          "possible",
          `Your RCP (${usd(rcpLumpSum)}) is below the ${usd(debt)} debt, so an OIC is technically viable. Complex cases often start here — expect $5–$10k in professional fees and 6–12 months for a decision.`,
        ),
      );
    }
    if (input.cleanPriorThreeYears) {
      others.push(
        make(
          "fta",
          "strong",
          "3 prior clean years qualifies you for First Time Abate on the failure-to-file / failure-to-pay penalties in your balance. Free to request, applied before payments start.",
        ),
      );
    }
    if (input.isJointSpousal) {
      others.push(
        make(
          "innocent-spouse",
          "possible",
          "Debt is joint or spousal — evaluate Innocent Spouse Relief before locking into a multi-year IA.",
        ),
      );
    }
    return {
      monthlyDisposable,
      rcpLumpSum,
      rcpPeriodic,
      streamlinedIAMonthly,
      filingComplianceGap: false,
      primary,
      others,
      headline: { label: "Est. monthly IA payment", value: `${usd(monthlyEst)}/mo` },
    };
  }

  // Fallback — should be rare (debt is 0 or something odd).
  return {
    monthlyDisposable,
    rcpLumpSum,
    rcpPeriodic,
    streamlinedIAMonthly,
    filingComplianceGap: false,
    primary: make(
      "ia-streamlined",
      "possible",
      "Enter your balance and financials to see a specific recommendation.",
    ),
    others: [],
    headline: { label: "Balance owed", value: usd(debt) },
  };
}

// ---- Helpers ----

function nextBestAfterCompliance(
  debt: number,
  monthlyDisposable: number,
  equity: number,
  rcpLumpSum: number,
  input: TaxResolutionInput,
): ProgramRecommendation {
  if (monthlyDisposable === 0 && equity < Math.max(2000, debt * 0.05)) {
    return make(
      "cnc",
      "strong",
      "Once your returns are filed, your allowable expenses ≥ income means Currently Not Collectible (Status 53) is the likely next step.",
    );
  }
  if (rcpLumpSum < debt) {
    return make(
      "oic",
      "strong",
      `Once your returns are filed, an Offer in Compromise at your RCP floor (${usd(rcpLumpSum)}) is the likely next step.`,
    );
  }
  if (debt <= 50_000) {
    return make(
      "ia-streamlined",
      "strong",
      "Once your returns are filed, a Streamlined Installment Agreement (online, $22 setup) is the fastest next step.",
    );
  }
  return make(
    "ia-nonstreamlined",
    "strong",
    "Once your returns are filed, a Non-Streamlined Installment Agreement (with Form 433-F) is the likely next step.",
  );
}

function round0(n: number): number { return Math.round(n); }
function round2(n: number): number { return Math.round(n * 100) / 100; }
