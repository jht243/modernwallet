// Salary inflation engine — standalone (tool-usage pass 2026-10-28). Restates a past salary in today's dollars
// with BLS CPI-U (src/lib/cpi-u.ts): adjusted = past salary × CPI(latest month) ÷ CPI(annual average of that
// year). Compares it with the reader's current salary and gives the raise that matches the latest 12-month
// CPI-U change. National average prices; the reader's own costs can differ.

import { pastToToday, CPI_12M_CHANGE_PCT } from "./cpi-u";

export interface SalaryInflationInput {
  pastSalary: number;
  pastYear: number;
  /** Today's salary; 0 = not entered. */
  currentSalary: number;
}

export interface SalaryInflationResult {
  /** The past salary in dollars of the latest CPI month. */
  adjusted: number;
  cumulativePct: number;
  years: number;
  /** current − adjusted (null without a current salary). */
  gap: number | null;
  /** current ÷ adjusted − 1, in percent. */
  gapPct: number | null;
  /** Average real (after-inflation) change in pay per year, in percent. */
  realChangePerYearPct: number | null;
  /** Average nominal raise per year from the past salary to the current one, in percent. */
  nominalChangePerYearPct: number | null;
  /** Dollar raise on the current salary that matches the latest 12-month CPI-U change. */
  keepPaceRaise: number | null;
  keepPacePct: number;
}

export function computeSalaryInflation(i: SalaryInflationInput): SalaryInflationResult | null {
  if (!(i.pastSalary > 0)) return null;
  const p = pastToToday(i.pastSalary, i.pastYear);
  if (!p) return null;
  const hasCurrent = i.currentSalary > 0;
  const ratio = hasCurrent ? i.currentSalary / p.todayValue : null;
  return {
    adjusted: p.todayValue,
    cumulativePct: p.cumulativePct,
    years: p.years,
    gap: hasCurrent ? i.currentSalary - p.todayValue : null,
    gapPct: ratio == null ? null : (ratio - 1) * 100,
    realChangePerYearPct: ratio == null || p.years < 1 ? null : (Math.pow(ratio, 1 / p.years) - 1) * 100,
    nominalChangePerYearPct: !hasCurrent || p.years < 1 ? null : (Math.pow(i.currentSalary / i.pastSalary, 1 / p.years) - 1) * 100,
    keepPaceRaise: hasCurrent ? (i.currentSalary * CPI_12M_CHANGE_PCT) / 100 : null,
    keepPacePct: CPI_12M_CHANGE_PCT,
  };
}
