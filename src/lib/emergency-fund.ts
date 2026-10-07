// Emergency fund engine — standalone. The target is a number of months of essential expenses, the
// gap is the target minus what is already saved, and the time to goal comes from a monthly deposit
// (optionally earning interest on the balance). Every figure, including how many months to cover, is
// a user input. Nothing here asserts how many months a household "should" hold.

export interface EmergencyFundInput {
  /** Monthly essential spending the fund must cover (housing, food, utilities, insurance, minimum debt payments, transport, other). */
  housing: number;
  food: number;
  utilities: number;
  insurance: number;
  debtMinimums: number;
  transport: number;
  other: number;
  targetMonths: number;
  currentSavings: number;
  monthlyDeposit: number;
  /** Annual yield on the savings balance, in percent (0 for none). */
  apyPct: number;
}

export interface EmergencyFundResult {
  monthlyEssentials: number;
  targetAmount: number;
  gap: number;
  /** How many months of essentials the current savings already cover. */
  monthsCovered: number;
  /** Months of deposits to reach the target; null when it cannot be reached on these inputs. */
  monthsToGoal: number | null;
  /** Deposit needed each month to reach the target within 12 months. */
  depositForOneYear: number | null;
  goalReached: boolean;
}

export function computeEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const monthlyEssentials =
    input.housing + input.food + input.utilities + input.insurance + input.debtMinimums + input.transport + input.other;
  const targetAmount = monthlyEssentials * Math.max(input.targetMonths, 0);
  const gap = Math.max(0, targetAmount - input.currentSavings);
  const monthsCovered = monthlyEssentials > 0 ? input.currentSavings / monthlyEssentials : 0;
  const goalReached = targetAmount > 0 && gap === 0;

  const r = Math.pow(1 + Math.max(input.apyPct, 0) / 100, 1 / 12) - 1;
  let monthsToGoal: number | null = null;
  if (goalReached) monthsToGoal = 0;
  else if (targetAmount > 0 && input.monthlyDeposit > 0) {
    let bal = input.currentSavings;
    for (let m = 1; m <= 1200; m++) {
      bal = bal * (1 + r) + input.monthlyDeposit;
      if (bal >= targetAmount) { monthsToGoal = m; break; }
    }
  } else if (targetAmount > 0 && r > 0 && input.currentSavings > 0) {
    let bal = input.currentSavings;
    for (let m = 1; m <= 1200; m++) {
      bal = bal * (1 + r);
      if (bal >= targetAmount) { monthsToGoal = m; break; }
    }
  }

  let depositForOneYear: number | null = null;
  if (targetAmount > 0 && !goalReached) {
    const grown = input.currentSavings * Math.pow(1 + r, 12);
    const annuity = r === 0 ? 12 : (Math.pow(1 + r, 12) - 1) / r;
    depositForOneYear = Math.max(0, (targetAmount - grown) / annuity);
  }

  return { monthlyEssentials, targetAmount, gap, monthsCovered, monthsToGoal, depositForOneYear, goalReached };
}
