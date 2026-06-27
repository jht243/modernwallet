// Build-time stat injection: turns a spoke's preset into a few real headline numbers that get
// baked into the static HTML before the React island hydrates. Good for crawlers + AEO, and gives
// the page substance even with JS disabled.
//
// Calculator-aware: each calculator contributes its own headline stats. Phase 2 extends the switch.

import type { SpokeEntry } from "../data/types";
import { computeAutoLoan, type AutoLoanInput } from "./auto-loan";
import { computeRental, type RentalInput } from "./rental";
import { projectRetirement, early401kWithdrawal, computeRMD } from "./retirement";
import { computeInvestment, type InvestmentInput } from "./investment";
import { computePortfolio, type PortfolioInput } from "./portfolio";
import { computeNetWorth, type NetWorthInput } from "./net-worth";
import { carAffordability, homeAffordability, downPaymentBreakdown, closingCostEstimate } from "./affordability";
import { fmtUSD, fmtMonths, fmtPct, fmtNum } from "./format";

export interface Stat {
  label: string;
  value: string;
}

export function spokeStats(entry: SpokeEntry): Stat[] {
  // Buyer-journey override tools key off the spoke's islandId + preset.kind.
  if (entry.islandId === "affordability") return affordabilityStats(entry.preset as Record<string, unknown>);
  if (entry.islandId === "mortgage-extras") return extrasStats(entry.preset as Record<string, unknown>);
  switch (entry.calculator) {
    case "auto-loan":
    case "mortgage":
      return autoLoanStats(entry.preset as Partial<AutoLoanInput>);
    case "real-estate":
      return rentalStats(entry.preset as Partial<RentalInput>);
    case "retirement":
      return retirementStats(entry.preset as Record<string, unknown>);
    case "investing":
      return investingStats(entry.preset as Record<string, unknown>);
    case "portfolio":
      return portfolioStats(entry.preset as Partial<PortfolioInput>);
    case "net-worth":
      return netWorthStats(entry.preset as Partial<NetWorthInput>);
    default:
      return [];
  }
}

function affordabilityStats(preset: Record<string, unknown>): Stat[] {
  if (preset.kind === "home") {
    const r = homeAffordability({
      annualIncome: Number(preset.annualIncome) || 0,
      monthlyDebts: Number(preset.monthlyDebts) || 0,
      downPayment: Number(preset.downPayment) || 0,
      interestRatePct: Number(preset.interestRatePct) || 0,
      loanTermYears: Number(preset.loanTermYears) || 30,
    });
    if (r.maxHomePrice == null) return [];
    return [
      { label: "home you can afford", value: fmtUSD(r.maxHomePrice) },
      { label: "monthly budget", value: fmtUSD(r.maxMonthlyPayment) },
      { label: "loan amount", value: fmtUSD(r.maxLoanAmount) },
    ];
  }
  const r = carAffordability({
    monthlyBudget: Number(preset.monthlyBudget) || 0,
    downPayment: Number(preset.downPayment) || 0,
    tradeInValue: Number(preset.tradeInValue) || 0,
    interestRatePct: Number(preset.interestRatePct) || 0,
    loanTermMonths: Number(preset.loanTermMonths) || 60,
  });
  if (r.maxVehiclePrice == null) return [];
  return [
    { label: "car you can afford", value: fmtUSD(r.maxVehiclePrice) },
    { label: "max loan", value: fmtUSD(r.maxLoanAmount) },
    { label: "total interest", value: fmtUSD(r.totalInterest) },
  ];
}

function extrasStats(preset: Record<string, unknown>): Stat[] {
  if (preset.kind === "closing-cost") {
    const r = closingCostEstimate(Number(preset.homePrice) || 0);
    if (!r) return [];
    return [
      { label: "typical closing costs", value: fmtUSD(r.typical) },
      { label: "low (2%)", value: fmtUSD(r.low) },
      { label: "high (5%)", value: fmtUSD(r.high) },
    ];
  }
  const r = downPaymentBreakdown(Number(preset.homePrice) || 0, Number(preset.downPaymentPct) || 0);
  if (!r) return [];
  return [
    { label: "down payment", value: fmtUSD(r.downPaymentAmount) },
    { label: "loan amount", value: fmtUSD(r.loanAmount) },
    { label: "loan-to-value", value: fmtPct(r.ltvPct, 0) },
  ];
}

function netWorthStats(preset: Partial<NetWorthInput>): Stat[] {
  const r = computeNetWorth(preset as NetWorthInput);
  if (r.netWorth == null) return [];
  const stats: Stat[] = [
    { label: "net worth", value: fmtUSD(r.netWorth) },
    { label: "total assets", value: fmtUSD(r.totalAssets) },
    { label: "total debt", value: fmtUSD(r.totalLiabilities) },
  ];
  if (r.medianNetWorthForAge != null) {
    stats.push({ label: `vs median for ${r.ageBracket}`, value: `${r.aboveMedian ? "+" : ""}${fmtUSD(r.vsMedian)}` });
  }
  return stats;
}

function portfolioStats(preset: Partial<PortfolioInput>): Stat[] {
  const r = computePortfolio({
    stocks: Number(preset.stocks) || 0,
    bonds: Number(preset.bonds) || 0,
    realEstate: Number(preset.realEstate) || 0,
    cash: Number(preset.cash) || 0,
    monthlyContribution: Number(preset.monthlyContribution) || 0,
    years: Number(preset.years) || 0,
  } as PortfolioInput);
  if (r.expectedReturnPct == null) return [];
  const stats: Stat[] = [
    { label: "expected return", value: fmtPct(r.expectedReturnPct, 2) },
    { label: "volatility", value: fmtPct(r.volatilityPct, 2) },
    { label: "Sharpe ratio", value: r.sharpeRatio == null ? "—" : fmtNum(r.sharpeRatio, 2) },
  ];
  return stats;
}

function investingStats(preset: Record<string, unknown>): Stat[] {
  const r = computeInvestment({
    currentBalance: Number(preset.currentBalance) || 0,
    monthlyContribution: Number(preset.monthlyContribution) || 0,
    annualReturnPct: Number(preset.annualReturnPct) || 0,
    years: Number(preset.years) || 0,
    compoundsPerYear: Number(preset.compoundsPerYear) || 12,
    targetAmount: Number(preset.targetAmount) || 0,
  } as InvestmentInput);
  if (preset.goalMode && r.monthlyNeededForTarget != null) {
    return [
      { label: "monthly to hit the goal", value: fmtUSD(r.monthlyNeededForTarget) },
      { label: "target", value: fmtUSD(r.targetAmount) },
    ];
  }
  if (r.futureValue == null) return [];
  return [
    { label: "future value", value: fmtUSD(r.futureValue) },
    { label: "you put in", value: fmtUSD(r.totalContributions) },
    { label: "investment growth", value: fmtUSD(r.totalGrowth) },
  ];
}

function retirementStats(preset: Record<string, unknown>): Stat[] {
  const mode = (preset.mode as string) ?? "projection";
  if (mode === "early-withdrawal") {
    const r = early401kWithdrawal({
      withdrawalAmount: Number(preset.withdrawalAmount) || 0,
      age: Number(preset.age) || 0,
      federalTaxRatePct: Number(preset.federalTaxRatePct) || 0,
      stateTaxRatePct: Number(preset.stateTaxRatePct) || 0,
      yearsToRetirement: Number(preset.yearsToRetirement) || undefined,
      annualReturnPct: Number(preset.annualReturnPct) || undefined,
    });
    const stats: Stat[] = [
      { label: "you keep", value: fmtUSD(r.netReceived) },
      { label: "lost to tax & penalty", value: fmtUSD(r.totalCost) },
    ];
    if (r.lostFutureValue) stats.push({ label: "lost future growth", value: fmtUSD(r.lostFutureValue) });
    return stats;
  }
  if (mode === "rmd") {
    const r = computeRMD(Number(preset.accountBalance) || 0, Number(preset.age) || 0);
    if (r.rmd == null) return [];
    return [
      { label: "this year's RMD", value: fmtUSD(r.rmd) },
      { label: "distribution period", value: r.factor == null ? "—" : String(r.factor) },
      { label: "of the balance", value: fmtPct(r.rmdPctOfBalance, 2) },
    ];
  }
  const r = projectRetirement({
    currentAge: Number(preset.currentAge) || 0,
    retirementAge: Number(preset.retirementAge) || 0,
    currentSavings: Number(preset.currentSavings) || 0,
    monthlyContribution: Number(preset.monthlyContribution) || 0,
    annualReturnPct: Number(preset.annualReturnPct) || 0,
  });
  if (r.balanceAtRetirement == null) return [];
  return [
    { label: "savings at retirement", value: fmtUSD(r.balanceAtRetirement) },
    { label: "monthly income (4% rule)", value: fmtUSD(r.monthlyRetirementIncome) },
    { label: "investment growth", value: fmtUSD(r.growth) },
  ];
}

function rentalStats(preset: Partial<RentalInput>): Stat[] {
  const r = computeRental({ purchasePrice: 0, monthlyRent: 0, downPaymentPct: 0, interestRatePct: 0, loanTermYears: 30, ...preset } as RentalInput);
  if (r.monthlyCashFlow == null) return [];
  return [
    { label: "monthly cash flow", value: fmtUSD(r.monthlyCashFlow) },
    { label: "cap rate", value: fmtPct(r.capRate, 2) },
    { label: "cash-on-cash", value: fmtPct(r.cashOnCashReturn, 2) },
  ];
}

function autoLoanStats(preset: Partial<AutoLoanInput>): Stat[] {
  const r = computeAutoLoan({
    vehiclePrice: 0,
    interestRatePct: 0,
    loanTermMonths: 0,
    ...preset,
  } as AutoLoanInput);
  if (r.monthlyPaymentPI == null) return [];

  const stats: Stat[] = [
    { label: "monthly payment", value: fmtUSD(r.monthlyPaymentPI) },
    { label: "total interest", value: fmtUSD(r.lifetimeInterest) },
  ];
  if (r.interestSaved != null && r.interestSaved > 0) {
    stats.push({ label: "saved with extra payments", value: fmtUSD(r.interestSaved) });
  } else if (r.monthsToPayoff != null) {
    stats.push({ label: "to payoff", value: fmtMonths(r.monthsToPayoff) });
  }
  return stats;
}
