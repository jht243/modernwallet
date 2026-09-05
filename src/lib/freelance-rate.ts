// Freelance rate engine — works backwards from the take-home pay you actually want to the hourly
// rate, day rate, and billable-hour target that produce it.
//
// The rate mistake this engine exists to correct: freelancers convert a salary to an hourly rate
// by dividing by 2,080 hours. That number is wrong twice over.
//
//   1. Nobody bills 2,080 hours. Client work is bought in billable hours, but admin, sales,
//      invoicing, and unpaid revisions are not billable. Real utilization for a solo freelancer
//      typically lands between 50% and 70%. Dividing by 2,080 prices a full-time year of work as
//      if every hour sold.
//   2. A 1099 earner pays both halves of FICA and buys their own time off. Self-employment tax is
//      15.3% of 92.35% of profit (an effective 14.13% of net profit), and there are no paid
//      holidays, no paid sick days, and no employer benefit contribution.
//
// So this engine does not apply a flat "add 30%" markup. It solves for the gross revenue at which
// take-home — after real business overhead, real self-employment tax, and real federal income tax
// from `self-employment-tax.ts` — equals the target, then divides that revenue across the hours
// actually available to bill.
//
// Estimates only. Federal figures for 2026; no state or local income tax, no health-insurance or
// retirement deduction, no credits.

import {
  calculateSelfEmploymentTax,
  type FilingStatus,
} from "./self-employment-tax";

export interface FreelanceRateInput {
  /** The annual take-home pay you want, after federal tax and after business expenses. */
  targetTakeHome: number;
  /** Hours per week you can realistically bill to a client (not hours worked). */
  billableHoursPerWeek: number;
  /** Weeks per year you intend to work — 52 minus vacation, holidays, and sick time. */
  weeksWorkedPerYear: number;
  /** Annual business overhead: software, insurance, equipment, accounting, coworking. */
  annualOverhead?: number;
  filingStatus?: FilingStatus;
  /** Other household income (a spouse's salary, a part-time W-2 job) — changes the marginal rate. */
  otherIncome?: number;
  /** Hours in your standard working day, for the day-rate conversion. Default 8. */
  hoursPerDay?: number;
  /** Total hours per week you actually work, billable or not — drives the utilization figure. */
  totalHoursPerWeek?: number;
}

export interface FreelanceRateResult {
  /** Billable hours available in the year. */
  billableHours: number;
  /** Gross revenue you must invoice to hit the target take-home. */
  requiredRevenue: number;
  /** Schedule C net profit at that revenue (revenue − overhead). */
  netProfit: number;
  /** Total federal tax the self-employment income causes at that profit. */
  federalTax: number;
  /** The hourly rate that produces the target. */
  hourlyRate: number;
  /** hourlyRate × hours per day. */
  dayRate: number;
  /** Revenue needed per working week. */
  weeklyRevenueTarget: number;
  /** Billable hours ÷ total hours worked, as a decimal. null when total hours were not given. */
  utilization: number | null;
  /**
   * The W-2 salary that would leave an employee with the same take-home. The gap between this and
   * requiredRevenue is what freelancing has to cover: both FICA halves, unpaid time off, and
   * overhead.
   */
  equivalentW2Salary: number;
  /** requiredRevenue ÷ equivalentW2Salary — the multiple a freelance rate has to clear. */
  freelancePremium: number;
  /** True when the target could not be solved inside the search range. */
  unsolvable: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Take-home from a given gross revenue, after overhead and federal tax. */
function takeHomeFromRevenue(
  revenue: number,
  overhead: number,
  filingStatus: FilingStatus,
  otherIncome: number,
): { takeHome: number; netProfit: number; federalTax: number } {
  const netProfit = Math.max(0, revenue - overhead);
  const r = calculateSelfEmploymentTax({ netProfit, filingStatus, otherIncome });
  return { takeHome: netProfit - r.incrementalFederalTax, netProfit, federalTax: r.incrementalFederalTax };
}

/**
 * Bisection solve for the revenue whose take-home equals the target. Bisection rather than a
 * closed form because the tax function is piecewise (brackets, the wage-base cap, the QBI cap),
 * so there is no single algebraic inverse.
 */
function solveRevenueForTakeHome(
  target: number,
  overhead: number,
  filingStatus: FilingStatus,
  otherIncome: number,
): { revenue: number; netProfit: number; federalTax: number; unsolvable: boolean } {
  let lo = 0;
  let hi = Math.max(1000, (target + overhead) * 3);

  // Grow the ceiling until it clears the target, so an aggressive goal still solves.
  let guard = 0;
  while (takeHomeFromRevenue(hi, overhead, filingStatus, otherIncome).takeHome < target && guard < 40) {
    hi *= 2;
    guard += 1;
  }
  if (guard >= 40) {
    const at = takeHomeFromRevenue(hi, overhead, filingStatus, otherIncome);
    return { revenue: hi, netProfit: at.netProfit, federalTax: at.federalTax, unsolvable: true };
  }

  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (takeHomeFromRevenue(mid, overhead, filingStatus, otherIncome).takeHome < target) lo = mid;
    else hi = mid;
  }
  const at = takeHomeFromRevenue(hi, overhead, filingStatus, otherIncome);
  return { revenue: hi, netProfit: at.netProfit, federalTax: at.federalTax, unsolvable: false };
}

/** The W-2 salary leaving an employee the same take-home: income tax plus the employee half of FICA. */
function solveW2SalaryForTakeHome(
  target: number,
  filingStatus: FilingStatus,
  otherIncome: number,
): number {
  const EMPLOYEE_FICA = 0.0765;
  let lo = 0;
  let hi = Math.max(1000, target * 3);
  const takeHome = (salary: number) => {
    // Employee-side FICA plus federal income tax, using the same bracket schedule.
    const r = calculateSelfEmploymentTax({
      netProfit: 0,
      filingStatus,
      w2Wages: salary,
      otherIncome,
    });
    const incomeTax = r.federalIncomeTax ?? 0;
    return salary - salary * EMPLOYEE_FICA - incomeTax;
  };
  let guard = 0;
  while (takeHome(hi) < target && guard < 40) {
    hi *= 2;
    guard += 1;
  }
  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (takeHome(mid) < target) lo = mid;
    else hi = mid;
  }
  return hi;
}

export function calculateFreelanceRate(input: FreelanceRateInput): FreelanceRateResult {
  const targetTakeHome = clampNonNeg(input.targetTakeHome);
  const billableHoursPerWeek = clampNonNeg(input.billableHoursPerWeek);
  const weeksWorkedPerYear = Math.min(52, clampNonNeg(input.weeksWorkedPerYear));
  const annualOverhead = clampNonNeg(input.annualOverhead ?? 0);
  const filingStatus = input.filingStatus ?? "single";
  const otherIncome = clampNonNeg(input.otherIncome ?? 0);
  const hoursPerDay = clampNonNeg(input.hoursPerDay ?? 8) || 8;

  const billableHours = billableHoursPerWeek * weeksWorkedPerYear;

  const solved = solveRevenueForTakeHome(targetTakeHome, annualOverhead, filingStatus, otherIncome);
  const hourlyRate = billableHours > 0 ? solved.revenue / billableHours : 0;
  const equivalentW2Salary = solveW2SalaryForTakeHome(targetTakeHome, filingStatus, otherIncome);

  const totalHoursPerWeek = input.totalHoursPerWeek;
  const utilization =
    totalHoursPerWeek && totalHoursPerWeek > 0
      ? Math.min(1, billableHoursPerWeek / totalHoursPerWeek)
      : null;

  return {
    billableHours: round2(billableHours),
    requiredRevenue: round2(solved.revenue),
    netProfit: round2(solved.netProfit),
    federalTax: round2(solved.federalTax),
    hourlyRate: round2(hourlyRate),
    dayRate: round2(hourlyRate * hoursPerDay),
    weeklyRevenueTarget: weeksWorkedPerYear > 0 ? round2(solved.revenue / weeksWorkedPerYear) : 0,
    utilization: utilization === null ? null : Math.round(utilization * 10000) / 10000,
    equivalentW2Salary: round2(equivalentW2Salary),
    freelancePremium:
      equivalentW2Salary > 0 ? Math.round((solved.revenue / equivalentW2Salary) * 1000) / 1000 : 0,
    unsolvable: solved.unsolvable,
  };
}
