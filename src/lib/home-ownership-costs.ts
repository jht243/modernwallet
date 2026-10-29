// Hidden cost of owning a home engine (X-trends pass 2026-10-29) — standalone, no React/DOM.
//
// Scope: the yearly cost of owning a home that sits ON TOP of the mortgage payment: maintenance, property taxes,
// homeowners insurance, plus an optional HOA line. All arithmetic is addition, division and compounding on the
// reader's own inputs. Nothing here is a forecast of any particular house.
//
// Reference point: the 2026 Zillow and Thumbtack hidden-costs-of-homeownership study, as reported by Fox Business
// (2026-10-22): typical U.S. homeowner pays $16,566 a year ($11,171 maintenance, $3,129 property taxes, $2,266
// insurance), in addition to a mortgage payment, up about 32% in five years and 3% in the last year.
// Not modeled: utilities, furnishings, remodeling by choice, mortgage insurance, income-tax effects of owning,
// and local price differences. The reader supplies those or leaves them out.

/** Typical U.S. homeowner, per year, excluding the mortgage payment (Zillow and Thumbtack 2026, via Fox Business). */
export const NATIONAL_TYPICAL = { maintenance: 11171, propertyTax: 3129, insurance: 2266 } as const;
/** Sum of the three national components ($16,566, matching the reported total). */
export const NATIONAL_TYPICAL_TOTAL = NATIONAL_TYPICAL.maintenance + NATIONAL_TYPICAL.propertyTax + NATIONAL_TYPICAL.insurance;
/** Reported one-year change in the national total (3%). Used only as the default growth assumption. */
export const DEFAULT_GROWTH_PCT = 3;

export interface HocInput {
  /** Yearly upkeep and repairs, dollars. */
  maintenance: number;
  /** Yearly property tax bill, dollars. */
  propertyTax: number;
  /** Yearly homeowners insurance premium, dollars. */
  insurance: number;
  /** Monthly HOA dues, dollars (0 when none). */
  hoaMonthly: number;
  /** Monthly mortgage principal and interest, dollars (0 to hide the all-in line). */
  mortgageMonthly: number;
  /** Home value, dollars (0 to hide the percent-of-value line). */
  homeValue: number;
  /** Assumed yearly growth of these costs, percent. */
  growthPct: number;
  /** Years to project, 1 to 30. */
  years: number;
}

export interface HocResult {
  /** Maintenance + property tax + insurance + HOA for one year. */
  annual: number;
  /** annual / 12. */
  monthly: number;
  /** Yearly HOA dues. */
  hoaAnnual: number;
  /** annual minus the national typical total (positive = above typical). Compares like with like: HOA is left out. */
  vsNationalAnnual: number;
  /** Share of the annual total (0 to 1) for each of the four lines. */
  share: { maintenance: number; propertyTax: number; insurance: number; hoa: number };
  /** annual as a percent of home value, or null when no home value was given. */
  pctOfValue: number | null;
  /** Mortgage principal and interest plus the monthly cost above, or null when no mortgage was given. */
  allInMonthly: number | null;
  /** Monthly set-aside for maintenance alone. */
  maintenanceMonthly: number;
  /** Year-by-year totals with growth compounding from year 2. */
  schedule: { year: number; total: number }[];
  /** Sum of the schedule. */
  cumulative: number;
}

const nn = (x: number) => (Number.isFinite(x) && x > 0 ? x : 0);

export function computeHiddenCosts(i: HocInput): HocResult {
  const maintenance = nn(i.maintenance);
  const propertyTax = nn(i.propertyTax);
  const insurance = nn(i.insurance);
  const hoaAnnual = nn(i.hoaMonthly) * 12;
  const annual = maintenance + propertyTax + insurance + hoaAnnual;
  const years = Math.min(30, Math.max(1, Math.round(Number.isFinite(i.years) ? i.years : 5)));
  const g = (Number.isFinite(i.growthPct) ? i.growthPct : 0) / 100;
  const schedule: { year: number; total: number }[] = [];
  let cumulative = 0;
  for (let y = 1; y <= years; y++) {
    const total = annual * Math.pow(1 + g, y - 1);
    schedule.push({ year: y, total });
    cumulative += total;
  }
  const share = annual > 0
    ? { maintenance: maintenance / annual, propertyTax: propertyTax / annual, insurance: insurance / annual, hoa: hoaAnnual / annual }
    : { maintenance: 0, propertyTax: 0, insurance: 0, hoa: 0 };
  const value = nn(i.homeValue);
  const mortgage = nn(i.mortgageMonthly);
  return {
    annual,
    monthly: annual / 12,
    hoaAnnual,
    vsNationalAnnual: maintenance + propertyTax + insurance - NATIONAL_TYPICAL_TOTAL,
    share,
    pctOfValue: value > 0 ? (annual / value) * 100 : null,
    allInMonthly: mortgage > 0 ? mortgage + annual / 12 : null,
    maintenanceMonthly: maintenance / 12,
    schedule,
    cumulative,
  };
}
