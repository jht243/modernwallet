// Pure will-cost engine for /estate-planning/will-cost-calculator/.
//   estimateWillCost() — takes state + complexity + attorney/DIY + supporting-document
//   selections → returns cost range + itemized breakdown + best online options.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - Attorney will costs (Legaltemplates 2026 909-firm study + Nolo + NCOA):
//     simple $300-$1,200 (national avg ~$375-$500), moderate $750-$2,500,
//     complex $2,500-$7,500+. Hourly rates $150-$450/hr (junior→specialist).
//   - Online will maker pricing (verified July 2026):
//     Trust & Will: $199 individual / $299 couple; $499/$599 trust; $299 attorney add-on
//     LegalZoom: Basic Will $129/$229, Pro $149/$249, Premium $299/$399
//     Nolo Quicken WillMaker & Trust 2026: Starter $99, Plus $139, All Access $209
//     FreeWill: $0 (monetized via nonprofit partnerships)
//     Mama Bear Legal Forms: $159 individual / $249 couple (includes POA + HIPAA)
//   - State-specific will execution requirements:
//     * 2 witnesses required in essentially all 50 states + DC (default)
//     * Louisiana requires 2 witnesses PLUS a notary (notarial testament, La. Civ. Code art. 1577)
//     * Holographic (handwritten, unwitnessed) wills recognized in ~27 states
//     * Colorado + North Dakota accept notarization WITHOUT witnesses
//     * Self-proving affidavit available in 48 states + DC (Ohio + DC don't offer it)

import { STATE_ESTATE_TAX, STATE_INHERITANCE_TAX } from "./estate-planning-hub";

export type Complexity = "simple" | "moderate" | "complex";

export interface WillCostInput {
  /** State slug (e.g. "california"). Regional cost multipliers apply. */
  state: string;
  /** simple = single, standard heirs; moderate = married + kids; complex = blended family, business, out-of-state property. */
  complexity: Complexity;
  /** Use an attorney (true) or online service (false). */
  useAttorney: boolean;
  /** Add a durable power of attorney to the package. */
  includePOA: boolean;
  /** Add an advance healthcare directive to the package. */
  includeHealthcareDirective: boolean;
}

export interface OnlineOption {
  name: string;
  price: number;
  priceLabel: string;
  url: string;
  suits: Complexity[];
}

export interface WillCostResult {
  costLow: number;
  costHigh: number;
  breakdown: Array<{ item: string; costLow: number; costHigh: number }>;
  onlineOptions: OnlineOption[];
  /** State-specific execution note (witnesses, holographic, notarization). */
  stateNote: string;
  /** True if state has estate or inheritance tax that affects planning. */
  stateTaxWarning: boolean;
}

// ---- Baseline costs (national averages before regional multiplier) ----

interface BaselineAttorney {
  low: number;
  high: number;
}

const ATTORNEY_WILL_BASELINE: Record<Complexity, BaselineAttorney> = {
  "simple": { low: 300, high: 800 },
  "moderate": { low: 750, high: 2_500 },
  "complex": { low: 2_500, high: 7_500 },
};

const ATTORNEY_POA_BASELINE: BaselineAttorney = { low: 150, high: 400 };
const ATTORNEY_HEALTHCARE_BASELINE: BaselineAttorney = { low: 100, high: 300 };

/** Regional cost multiplier by state (high-cost metros run 1.25-1.35x national). */
const STATE_COST_MULTIPLIER: Record<string, number> = {
  // High-cost metros / states
  "california": 1.35,
  "new-york": 1.35,
  "massachusetts": 1.25,
  "connecticut": 1.20,
  "new-jersey": 1.20,
  "washington": 1.20,
  "hawaii": 1.20,
  "maryland": 1.15,
  "illinois": 1.10,
  "colorado": 1.10,
  "oregon": 1.10,
  "virginia": 1.05,
  "texas": 1.00,
  "florida": 1.00,
  // Low-cost states
  "mississippi": 0.85,
  "alabama": 0.85,
  "west-virginia": 0.85,
  "arkansas": 0.85,
  "kentucky": 0.85,
  "oklahoma": 0.85,
  "louisiana": 0.90,
  "tennessee": 0.90,
  "north-dakota": 0.90,
  "south-dakota": 0.90,
  "wyoming": 0.90,
  "iowa": 0.95,
  "kansas": 0.95,
  "nebraska": 0.95,
  "montana": 0.95,
  "idaho": 0.95,
  "utah": 0.95,
  "new-mexico": 0.95,
  "indiana": 0.95,
  "missouri": 0.95,
  "ohio": 0.95,
  // Everything else defaults to 1.00
};

// ---- State execution notes ----

const HOLOGRAPHIC_STATES = new Set<string>([
  "california", "texas", "north-carolina", "west-virginia", "wyoming",
  "mississippi", "kentucky", "virginia", "arkansas", "tennessee",
  "alaska", "arizona", "idaho", "maine", "michigan", "montana",
  "new-jersey", "north-dakota", "oklahoma", "pennsylvania", "south-dakota",
  "utah", "hawaii", "colorado", "louisiana",
]);

const NOTARIZATION_ONLY_STATES = new Set<string>(["colorado", "north-dakota"]);

// ---- Online options ----

const ONLINE_OPTIONS: OnlineOption[] = [
  { name: "FreeWill", price: 0, priceLabel: "Free", url: "https://www.freewill.com", suits: ["simple", "moderate"] },
  { name: "Nolo Quicken WillMaker Starter", price: 99, priceLabel: "$99", url: "https://www.nolo.com/products/quicken-willmaker-plus", suits: ["simple", "moderate"] },
  { name: "LegalZoom Basic Will (individual)", price: 129, priceLabel: "$129", url: "https://www.legalzoom.com", suits: ["simple", "moderate"] },
  { name: "Nolo WillMaker Plus", price: 139, priceLabel: "$139", url: "https://www.nolo.com/products/quicken-willmaker-plus", suits: ["simple", "moderate"] },
  { name: "Mama Bear Legal Forms (individual)", price: 159, priceLabel: "$159", url: "https://www.mamabearlegalforms.com", suits: ["simple", "moderate"] },
  { name: "Trust & Will (individual)", price: 199, priceLabel: "$199", url: "https://trustandwill.com", suits: ["simple", "moderate"] },
  { name: "LegalZoom Basic Will (couple)", price: 229, priceLabel: "$229", url: "https://www.legalzoom.com", suits: ["moderate"] },
  { name: "Mama Bear Legal Forms (couple)", price: 249, priceLabel: "$249", url: "https://www.mamabearlegalforms.com", suits: ["moderate"] },
  { name: "Trust & Will (couple)", price: 299, priceLabel: "$299", url: "https://trustandwill.com", suits: ["moderate"] },
  { name: "LegalZoom Premium Will", price: 299, priceLabel: "$299", url: "https://www.legalzoom.com", suits: ["moderate", "complex"] },
];

// ---- Engine ----

export function estimateWillCost(input: WillCostInput): WillCostResult {
  const multiplier = STATE_COST_MULTIPLIER[input.state] ?? 1.00;
  const breakdown: WillCostResult["breakdown"] = [];

  let costLow = 0;
  let costHigh = 0;

  if (input.useAttorney) {
    const base = ATTORNEY_WILL_BASELINE[input.complexity];
    const willLow = Math.round(base.low * multiplier);
    const willHigh = Math.round(base.high * multiplier);
    breakdown.push({ item: `${input.complexity.charAt(0).toUpperCase() + input.complexity.slice(1)} will (attorney-drafted)`, costLow: willLow, costHigh: willHigh });
    costLow += willLow;
    costHigh += willHigh;

    if (input.includePOA) {
      const poaLow = Math.round(ATTORNEY_POA_BASELINE.low * multiplier);
      const poaHigh = Math.round(ATTORNEY_POA_BASELINE.high * multiplier);
      breakdown.push({ item: "Durable power of attorney", costLow: poaLow, costHigh: poaHigh });
      costLow += poaLow;
      costHigh += poaHigh;
    }

    if (input.includeHealthcareDirective) {
      const hcLow = Math.round(ATTORNEY_HEALTHCARE_BASELINE.low * multiplier);
      const hcHigh = Math.round(ATTORNEY_HEALTHCARE_BASELINE.high * multiplier);
      breakdown.push({ item: "Advance healthcare directive + HIPAA release", costLow: hcLow, costHigh: hcHigh });
      costLow += hcLow;
      costHigh += hcHigh;
    }
  } else {
    // Online — pick the best-fit option
    const suited = ONLINE_OPTIONS.filter((o) => o.suits.includes(input.complexity));
    // Baseline: cheapest suitable + most-features suitable
    const low = suited[0]?.price ?? 0;
    const high = suited[suited.length - 1]?.price ?? 0;
    const label = input.complexity === "complex"
      ? "Online will package (may not fully cover complex facts)"
      : "Online will package";
    breakdown.push({ item: label, costLow: low, costHigh: high });
    costLow = low;
    costHigh = high;

    // POA + healthcare directive are usually bundled with the online will package at these
    // prices, so we don't add them separately.
  }

  // ---- State execution note ----
  let stateNote = "";
  if (input.state === "louisiana") {
    stateNote = "Louisiana requires a notarial testament: 2 witnesses AND a notary must sign at execution (La. Civ. Code art. 1577). Online tools that skip the notary won't produce a valid will here.";
  } else if (NOTARIZATION_ONLY_STATES.has(input.state)) {
    const stateName = input.state === "colorado" ? "Colorado" : "North Dakota";
    stateNote = `${stateName} allows a will to be executed with a notary INSTEAD of witnesses — one of only two states that do (${input.state === "colorado" ? "C.R.S. §15-11-502(2)" : "N.D.C.C. §30.1-08-02"}). Most attorneys and online tools still use two witnesses for portability.`;
  } else if (HOLOGRAPHIC_STATES.has(input.state)) {
    stateNote = "This state recognizes holographic (handwritten, unwitnessed) wills as a fallback, but attorney-drafted or online-service wills with two witnesses remain the standard for enforceability and self-proving affidavits.";
  } else {
    stateNote = "This state follows the standard rule: two witnesses at execution, both present when the testator signs. Adding a self-proving affidavit at signing means the will can be probated without calling the witnesses to court later.";
  }

  const stateTaxWarning =
    !!STATE_ESTATE_TAX[input.state] || STATE_INHERITANCE_TAX.has(input.state);

  const onlineOptions = ONLINE_OPTIONS.filter((o) => o.suits.includes(input.complexity));

  return {
    costLow,
    costHigh,
    breakdown,
    onlineOptions,
    stateNote,
    stateTaxWarning,
  };
}
