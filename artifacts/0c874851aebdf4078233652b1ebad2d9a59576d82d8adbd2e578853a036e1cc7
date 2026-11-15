// Salary conversion engine (mindmap keyword-gap pass 2026-11-15). Pure arithmetic on the reader's own inputs, no external figures.
//
// Annual pay = hourly x hours per week x weeks per year. Every other period is derived from annual pay:
// weekly, biweekly, daily and hourly amounts are pay for time worked (so they follow weeks and hours),
// monthly and semimonthly amounts are annual pay divided by 12 and 24. Gross pay only: tax, overtime and unpaid leave are not modelled.

export type PayPeriod = "hourly" | "daily" | "weekly" | "biweekly" | "semimonthly" | "monthly" | "annual";

export const PERIOD_LABEL: Record<PayPeriod, string> = {
  hourly: "Hour",
  daily: "Day",
  weekly: "Week",
  biweekly: "Two weeks",
  semimonthly: "Half month (24 a year)",
  monthly: "Month",
  annual: "Year",
};

export interface SalaryInput {
  amount: number;
  period: PayPeriod;
  hoursPerWeek: number;
  weeksPerYear: number;
  daysPerWeek: number;
}

export interface SalaryResult {
  annual: number;
  monthly: number;
  semimonthly: number;
  biweekly: number;
  weekly: number;
  daily: number;
  hourly: number;
  hoursPerYear: number;
}

export const SALARY_DEFAULTS: SalaryInput = { amount: 52000, period: "annual", hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 };

export function computeSalary(i: SalaryInput): SalaryResult | null {
  const { amount, period, hoursPerWeek, weeksPerYear, daysPerWeek } = i;
  if (!(amount > 0) || !(hoursPerWeek > 0) || !(weeksPerYear > 0) || !(daysPerWeek > 0)) return null;
  const hoursPerYear = hoursPerWeek * weeksPerYear;
  let annual: number;
  switch (period) {
    case "hourly": annual = amount * hoursPerYear; break;
    case "daily": annual = amount * daysPerWeek * weeksPerYear; break;
    case "weekly": annual = amount * weeksPerYear; break;
    case "biweekly": annual = amount * (weeksPerYear / 2); break;
    case "semimonthly": annual = amount * 24; break;
    case "monthly": annual = amount * 12; break;
    default: annual = amount;
  }
  return {
    annual,
    monthly: annual / 12,
    semimonthly: annual / 24,
    biweekly: annual / (weeksPerYear / 2),
    weekly: annual / weeksPerYear,
    daily: annual / (daysPerWeek * weeksPerYear),
    hourly: annual / hoursPerYear,
    hoursPerYear,
  };
}
