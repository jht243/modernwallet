// Pure estate-tax engine for /estate-planning/estate-tax-calculator/.
//   computeEstateTax() — takes net worth + state + filing status → federal + state estate tax
//   exposure with NY 105% cliff logic and portability handling.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - Federal exemption 2026: $15,000,000 per individual (OBBBA P.L. 119-21; IRC §2010(c)(3);
//     permanent + indexed). Rate: 40% flat. Portability preserved.
//     https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
//   - 12 state estate tax states + DC (already imported from estate-planning-hub).
//   - NY unique 105% cliff: estates over 105% of exemption are taxed FROM $0 (not just excess).
//   - 5 state inheritance tax states (post–Iowa repeal).

import { STATE_ESTATE_TAX, STATE_INHERITANCE_TAX, FEDERAL_ESTATE_EXEMPTION_2026, FEDERAL_ESTATE_RATE } from "./estate-planning-hub";

export type FilingStatus = "single" | "married";

export interface EstateTaxInput {
  /** Gross estate value (assets before deductions), whole dollars. */
  netWorth: number;
  /** State slug. */
  state: string;
  /** Filing status — married couples can shield up to 2× federal exemption via portability. */
  filingStatus: FilingStatus;
}

export interface EstateTaxResult {
  /** Effective federal exemption applied (single: $15M; married: $30M via portability). */
  effectiveFederalExemption: number;
  /** Federal taxable estate (net worth − effective federal exemption, floored). */
  federalTaxable: number;
  /** Federal estate tax owed (40% × federalTaxable). */
  federalTax: number;

  /** State exemption if applicable (0 if state has no estate tax). */
  stateExemption: number;
  /** State taxable estate. */
  stateTaxable: number;
  /** State estate tax owed. */
  stateTax: number;
  /** Whether the NY 105% cliff was triggered. */
  nyCliff: boolean;

  /** Whether state also has an inheritance tax (separate from estate tax). */
  stateInheritanceTax: boolean;

  /** Total estimated estate tax (federal + state). */
  totalTax: number;
  /** Amount passing to heirs. */
  toHeirs: number;
}

export function computeEstateTax(input: EstateTaxInput): EstateTaxResult {
  const netWorth = Math.max(0, input.netWorth || 0);
  const effectiveFederalExemption = input.filingStatus === "married"
    ? FEDERAL_ESTATE_EXEMPTION_2026 * 2
    : FEDERAL_ESTATE_EXEMPTION_2026;

  const federalTaxable = Math.max(0, netWorth - effectiveFederalExemption);
  const federalTax = Math.round(federalTaxable * FEDERAL_ESTATE_RATE);

  const stateData = STATE_ESTATE_TAX[input.state];
  let stateExemption = 0;
  let stateTaxable = 0;
  let stateTax = 0;
  let nyCliff = false;

  if (stateData) {
    stateExemption = stateData.exemption;
    // New York 105% cliff: if estate > 105% of exemption, taxed from $0
    if (input.state === "new-york" && netWorth > stateData.exemption * 1.05) {
      nyCliff = true;
      stateTaxable = netWorth;
      stateTax = Math.round(netWorth * stateData.topRate);
    } else {
      stateTaxable = Math.max(0, netWorth - stateData.exemption);
      stateTax = Math.round(stateTaxable * stateData.topRate);
    }
  }

  const stateInheritanceTax = STATE_INHERITANCE_TAX.has(input.state);
  const totalTax = federalTax + stateTax;
  const toHeirs = Math.max(0, netWorth - totalTax);

  return {
    effectiveFederalExemption,
    federalTaxable,
    federalTax,
    stateExemption,
    stateTaxable,
    stateTax,
    nyCliff,
    stateInheritanceTax,
    totalTax,
    toHeirs,
  };
}
