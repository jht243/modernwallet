// Pure Coast FIRE engine.
//
// "Coast FIRE" means your current retirement savings, left to grow untouched at your expected
// return, will compound into your full retirement number (the "FIRE number") by your target
// retirement age — WITHOUT any further contributions. Once you hit that point you can "coast":
// keep working (or not) without adding another dollar to retirement and still retire on time.
//
// FIRE number uses the standard 25x / "safe withdrawal rate" rule: annual retirement spending
// divided by the withdrawal rate (4% → 25x spending is the common default, per Bengen's original
// 1994 "4% rule" research and the later Trinity Study).
//
// Beyond a static snapshot, this engine also simulates month-by-month (like src/lib/trump-account.ts)
// to find the actual COAST DATE if the user keeps contributing — the age/date at which their real,
// still-growing balance first clears the shrinking "coast number" needed for their remaining years.
// That forward simulation is the information-gain feature most basic Coast FIRE calculators skip;
// they only tell you whether you've ALREADY coasted, not when you WILL. ZERO React/DOM deps.

export interface CoastFireInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  /** Monthly amount still being added today (0 = "if I stopped contributing right now"). */
  monthlyContribution: number;
  annualReturnPct: number;
  /** Desired ANNUAL retirement spending in today's dollars. */
  desiredAnnualSpend: number;
  /** Safe withdrawal rate, % (default 4 → 25x rule). */
  withdrawalRatePct: number;
}

export interface CoastFireResult {
  yearsToRetirement: number | null;
  /** Target nest egg at retirement: desiredAnnualSpend / (withdrawalRatePct/100). */
  fireNumber: number | null;
  /** What's needed TODAY, growing untouched at annualReturnPct, to hit fireNumber by retirement. */
  coastNumberToday: number | null;
  /** What currentSavings alone (no more contributions) would grow to by retirement. */
  projectedNoContribValue: number | null;
  hasReachedCoastFire: boolean;
  /** Dollars short of the coast number today (0 if already reached). */
  gapToday: number | null;
  /** Surplus above the FIRE number if projectedNoContribValue already clears it. */
  surplus: number | null;
  /** Months from now until the still-growing balance (with contributions) first clears the
   *  shrinking coast number for the remaining years. Null if never reached by retirement, or if
   *  already coasting today (0). */
  monthsToCoast: number | null;
  ageAtCoast: number | null;
}

const EMPTY: CoastFireResult = {
  yearsToRetirement: null, fireNumber: null, coastNumberToday: null, projectedNoContribValue: null,
  hasReachedCoastFire: false, gapToday: null, surplus: null, monthsToCoast: null, ageAtCoast: null,
};

export function computeCoastFire(input: CoastFireInput): CoastFireResult {
  const currentAge = clampInt(input.currentAge, 0, 100);
  const retirementAge = clampInt(input.retirementAge, currentAge + 1, 100);
  const yearsToRetirement = retirementAge - currentAge;
  if (!(yearsToRetirement > 0)) return EMPTY;

  const savings = Math.max(0, input.currentSavings ?? 0);
  const monthly = Math.max(0, input.monthlyContribution ?? 0);
  const returnPct = Math.max(0, input.annualReturnPct ?? 0);
  const wr = clampPct(input.withdrawalRatePct ?? 4, 1, 10);
  const spend = Math.max(0, input.desiredAnnualSpend ?? 0);

  const fireNumber = spend / (wr / 100);
  const growth = Math.pow(1 + returnPct / 100, yearsToRetirement);
  const coastNumberToday = fireNumber / growth;
  const projectedNoContribValue = savings * growth;
  const hasReachedCoastFire = savings >= coastNumberToday;
  const gapToday = hasReachedCoastFire ? 0 : round2(coastNumberToday - savings);
  const surplus = hasReachedCoastFire ? round2(projectedNoContribValue - fireNumber) : null;

  // Month-by-month simulation: with the user's real ongoing contribution, find the first month
  // the running balance clears the coast number needed for the years still remaining at that point.
  let monthsToCoast: number | null = hasReachedCoastFire ? 0 : null;
  let ageAtCoast: number | null = hasReachedCoastFire ? currentAge : null;
  if (!hasReachedCoastFire && monthly > 0) {
    const i = returnPct / 100 / 12;
    let balance = savings;
    const totalMonths = yearsToRetirement * 12;
    for (let m = 1; m <= totalMonths; m++) {
      balance = balance * (1 + i) + monthly;
      const remainingYears = (totalMonths - m) / 12;
      const coastNumberAtM = fireNumber / Math.pow(1 + returnPct / 100, remainingYears);
      if (balance >= coastNumberAtM) {
        monthsToCoast = m;
        ageAtCoast = round2(currentAge + m / 12);
        break;
      }
    }
  }

  return {
    yearsToRetirement,
    fireNumber: round2(fireNumber),
    coastNumberToday: round2(coastNumberToday),
    projectedNoContribValue: round2(projectedNoContribValue),
    hasReachedCoastFire,
    gapToday,
    surplus,
    monthsToCoast,
    ageAtCoast,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function clampInt(n: number, lo: number, hi: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, v));
}
function clampPct(n: number, lo: number, hi: number): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, v));
}
