// Pure Long-Term Care cost engine for /elder-care/long-term-care-cost-calculator/.
//   projectLTCCost() — care type + state + duration + start age → present-day cost + inflated
//   future cost + total lifetime + funding-gap analysis vs Medicare/SS/pension.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - Genworth Cost of Care Survey 2024 baseline (published Nov 2024, projected forward 4.5% inflation)
//   - National 2026 medians (projected):
//     * Nursing home private room: $132,000/yr ($361/day)
//     * Nursing home semi-private:  $115,000/yr ($315/day)
//     * Assisted living:            $ 68,000/yr ($5,668/mo)
//     * Home health aide (44 hr/wk): $76,000/yr ($33/hr)
//     * Adult day care:             $ 25,000/yr ($95/day)
//   - LTC costs inflate ~4.5%/year over the last decade (Genworth trend data)
//   - Medicare covers ONLY skilled nursing up to 100 days (SNF benefit) after a 3-night hospital
//     stay; days 21-100 have a $209.50/day copay (2026 figure, projected from CMS Part A deductible)
//   - Medicare does NOT cover custodial care, assisted living, or long-term home aide (CMS.gov)

export type CareType = "nursing-private" | "nursing-semi-private" | "assisted-living" | "home-health-aide" | "adult-day-care";

export interface LTCInput {
  careType: CareType;
  state: string;
  currentAge: number;
  yearsUntilCare: number;
  expectedYearsOfCare: number;
  monthlySocialSecurity: number;
  monthlyPension: number;
  hasLTCInsurance: boolean;
  ltcInsuranceDailyBenefit: number;
  otherLiquidAssets: number;
}

export interface LTCResult {
  annualCostToday: number;
  annualCostAtStart: number;
  totalLifetimeCost: number;
  monthlyIncomeAvailable: number;
  monthlyLTCInsuranceBenefit: number;
  monthlyShortfall: number;
  totalShortfall: number;
  yearsOfAssetsCoverage: number;
  medicaidLikelihood: "high" | "medium" | "low";
  reasoning: string;
  medicareCoverageNote: string;
}

// 2026 US-median annual cost baselines (projected forward from Genworth 2024 at 4.5%).
const BASE_2026: Record<CareType, number> = {
  "nursing-private": 132_000,
  "nursing-semi-private": 115_000,
  "assisted-living": 68_000,
  "home-health-aide": 76_000,
  "adult-day-care": 25_000,
};

const INFLATION_RATE = 0.045;

// State cost factors (relative to US median). Selective set; states not listed default to 1.0.
// Values drawn from Genworth 2024 survey state medians vs national median.
const STATE_FACTOR: Record<string, number> = {
  "alaska": 2.19,          // Highest LTC costs in nation
  "hawaii": 1.35,
  "connecticut": 1.42,
  "massachusetts": 1.51,
  "new-jersey": 1.24,
  "new-york": 1.48,
  "california": 1.31,
  "washington": 1.29,
  "oregon": 1.22,
  "minnesota": 1.36,
  "north-dakota": 1.25,
  "vermont": 1.30,
  "maine": 1.19,
  "rhode-island": 1.22,
  "colorado": 1.14,
  "virginia": 1.05,
  "illinois": 1.02,
  "arizona": 0.97,
  "florida": 0.95,
  "nevada": 1.03,
  "texas": 0.88,
  "georgia": 0.85,
  "north-carolina": 0.92,
  "tennessee": 0.86,
  "south-carolina": 0.83,
  "alabama": 0.75,
  "mississippi": 0.71,
  "louisiana": 0.72,
  "oklahoma": 0.78,
  "arkansas": 0.73,
  "kansas": 0.86,
  "missouri": 0.83,
  "iowa": 0.87,
  "nebraska": 0.90,
  "kentucky": 0.83,
  "west-virginia": 0.80,
  "michigan": 0.94,
  "ohio": 0.90,
  "indiana": 0.87,
  "pennsylvania": 1.06,
  "wisconsin": 1.05,
  "new-mexico": 0.85,
  "utah": 0.95,
  "idaho": 0.93,
  "montana": 0.99,
  "wyoming": 0.99,
  "south-dakota": 0.95,
  "delaware": 1.20,
  "maryland": 1.15,
  "new-hampshire": 1.32,
  "district-of-columbia": 1.28,
};

export function projectLTCCost(input: LTCInput): LTCResult {
  const factor = STATE_FACTOR[input.state] ?? 1.0;
  const base = BASE_2026[input.careType] ?? 100_000;

  const annualCostToday = Math.round(base * factor);

  const yrsUntil = Math.max(0, input.yearsUntilCare || 0);
  const yrsOfCare = Math.max(0, input.expectedYearsOfCare || 0);

  const annualCostAtStart = Math.round(annualCostToday * Math.pow(1 + INFLATION_RATE, yrsUntil));

  let totalLifetimeCost = 0;
  for (let y = 0; y < yrsOfCare; y++) {
    totalLifetimeCost += annualCostAtStart * Math.pow(1 + INFLATION_RATE, y);
  }
  totalLifetimeCost = Math.round(totalLifetimeCost);

  const monthlyIncomeAvailable = Math.max(0, input.monthlySocialSecurity || 0) + Math.max(0, input.monthlyPension || 0);
  const monthlyCost = Math.round(annualCostAtStart / 12);

  const monthlyLTCInsuranceBenefit = input.hasLTCInsurance
    ? Math.min(monthlyCost, Math.round((input.ltcInsuranceDailyBenefit || 0) * 30.42))
    : 0;

  const monthlyShortfall = Math.max(0, monthlyCost - monthlyIncomeAvailable - monthlyLTCInsuranceBenefit);
  const annualShortfall = monthlyShortfall * 12;
  const totalShortfall = Math.round(annualShortfall * yrsOfCare);

  const yearsOfAssetsCoverage = annualShortfall > 0
    ? Math.round((input.otherLiquidAssets / annualShortfall) * 10) / 10
    : 999;

  let medicaidLikelihood: "high" | "medium" | "low" = "low";
  if (yearsOfAssetsCoverage < yrsOfCare * 0.5) medicaidLikelihood = "high";
  else if (yearsOfAssetsCoverage < yrsOfCare) medicaidLikelihood = "medium";

  let reasoning = "";
  if (medicaidLikelihood === "high") {
    reasoning = `Your assets ($${input.otherLiquidAssets.toLocaleString()}) cover only ${yearsOfAssetsCoverage} years of the projected ${yrsOfCare}-year care shortfall. Medicaid planning is likely needed — start the 5-year Medicaid asset-protection window NOW, since transfers within 60 months of application trigger the lookback penalty under 42 U.S.C. §1396p(c).`;
  } else if (medicaidLikelihood === "medium") {
    reasoning = `Your assets cover ${yearsOfAssetsCoverage} of the projected ${yrsOfCare} care years. You may partially self-fund and rely on Medicaid for the tail. Consider hybrid strategies: LTC insurance rider on a life policy, a Medicaid Asset Protection Trust for a portion of assets, or a partnership LTC policy that adds asset protection above the policy benefit paid.`;
  } else {
    reasoning = `Your assets ($${input.otherLiquidAssets.toLocaleString()}) plus income and LTC insurance cover the projected ${yrsOfCare}-year cost. Focus on tax-efficient withdrawal ordering and ensure the LTC insurance triggers on the qualifying event (2 of 6 ADLs or cognitive impairment per HIPAA §7702B).`;
  }

  const medicareCoverageNote = "Medicare pays $0 for custodial care, assisted living, and long-term home aide. Medicare's Skilled Nursing Facility benefit covers up to 100 days after a qualifying 3-night hospital stay — days 1-20 fully covered, days 21-100 with a $209.50/day copay (2026). Day 101 onward: $0 Medicare coverage.";

  return {
    annualCostToday,
    annualCostAtStart,
    totalLifetimeCost,
    monthlyIncomeAvailable,
    monthlyLTCInsuranceBenefit,
    monthlyShortfall,
    totalShortfall,
    yearsOfAssetsCoverage: Math.min(yearsOfAssetsCoverage, 99),
    medicaidLikelihood,
    reasoning,
    medicareCoverageNote,
  };
}
