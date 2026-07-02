// Pure living-trust-cost engine for /estate-planning/living-trust-cost-calculator/.
//   estimateLivingTrustCost() — takes state + trust type + estate complexity + funding scope →
//   returns cost range + itemized breakdown + best online options.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - Attorney revocable living trust (RLT) cost: $1,500–$5,000 simple, $3,000–$5,000+ complex,
//     $5,000–$10,000+ in California / high-cost metros (LegalZoom 2026 guide, OC Elder Law,
//     LegalShield).
//   - Irrevocable trust cost: ILIT $2,500–$4,000; Medicaid Asset Protection Trust (MAPT)
//     $3,000–$6,000 typical (range $2,000–$12,000); dynasty/GST $5,000–$10,000+.
//   - Trust funding costs (retitling assets): $500–$2,000 additional; deed recording $50–$150
//     per property; annual Form 1041 prep for irrevocable trust $500–$2,000.
//   - Online RLT services: Trust & Will $499 individual / $599 couple; LegalZoom RLT ~$279–$399;
//     Nolo Quicken WillMaker Plus $139 (includes RLT template).
//   - State-specific note: Nine community property states affect how spousal assets pass into
//     the trust; Medicaid five-year lookback applies to irrevocable transfers for asset
//     protection (2026 five-year rule under IRC §1917).

import { STATE_ESTATE_TAX, STATE_INHERITANCE_TAX } from "./estate-planning-hub";

export type TrustType = "revocable" | "irrevocable-ilit" | "irrevocable-mapt" | "irrevocable-dynasty";
export type EstateComplexity = "simple" | "moderate" | "complex";

export interface LivingTrustCostInput {
  /** State slug (e.g. "california"). Regional cost multipliers apply. */
  state: string;
  /** Trust type — revocable is the default living trust; irrevocable subtypes are for tax/asset protection. */
  trustType: TrustType;
  /** Complexity: simple = one property, standard heirs; moderate = multiple properties or beneficiaries; complex = business, blended family, cross-state. */
  complexity: EstateComplexity;
  /** Use an attorney (true) or online service (false). */
  useAttorney: boolean;
  /** Include trust funding (retitling deeds, brokerage accounts, etc.). */
  includeFunding: boolean;
  /** Number of properties to retitle into the trust (for funding cost calculation). */
  numberOfProperties: number;
}

export interface LivingTrustOnlineOption {
  name: string;
  price: number;
  priceLabel: string;
  url: string;
  suits: TrustType[];
}

export interface LivingTrustCostResult {
  costLow: number;
  costHigh: number;
  breakdown: Array<{ item: string; costLow: number; costHigh: number }>;
  onlineOptions: LivingTrustOnlineOption[];
  /** State-specific note (community property, Medicaid lookback, state estate tax). */
  stateNote: string;
  /** True if state has estate or inheritance tax that a living trust could help address. */
  stateTaxWarning: boolean;
  /** True if a community property state (affects funding of spousal assets). */
  isCommunityProperty: boolean;
}

// ---- Baseline attorney costs by trust type ----

interface BaselineAttorney {
  low: number;
  high: number;
}

const REVOCABLE_TRUST_BASELINE: Record<EstateComplexity, BaselineAttorney> = {
  "simple": { low: 1_500, high: 3_000 },
  "moderate": { low: 2_500, high: 5_000 },
  "complex": { low: 4_000, high: 8_000 },
};

const IRREVOCABLE_ILIT_BASELINE: BaselineAttorney = { low: 2_500, high: 4_000 };
const IRREVOCABLE_MAPT_BASELINE: BaselineAttorney = { low: 3_000, high: 6_000 };
const IRREVOCABLE_DYNASTY_BASELINE: BaselineAttorney = { low: 5_000, high: 10_000 };

/** Trust funding costs — retitling deeds + accounts. */
const FUNDING_COST_PER_PROPERTY: BaselineAttorney = { low: 200, high: 500 };
const FUNDING_COST_ACCOUNTS: BaselineAttorney = { low: 300, high: 1_500 };

/** Regional cost multiplier by state (same as will-cost). */
const STATE_COST_MULTIPLIER: Record<string, number> = {
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
};

/** Community property states (default 50/50 marital assets). */
const COMMUNITY_PROPERTY_STATES = new Set<string>([
  "arizona", "california", "idaho", "louisiana", "nevada",
  "new-mexico", "texas", "washington", "wisconsin",
]);

// ---- Online options ----

const ONLINE_OPTIONS: LivingTrustOnlineOption[] = [
  { name: "Nolo Quicken WillMaker Plus (RLT template)", price: 139, priceLabel: "$139", url: "https://www.nolo.com/products/quicken-willmaker-plus", suits: ["revocable"] },
  { name: "LegalZoom Living Trust", price: 279, priceLabel: "$279", url: "https://www.legalzoom.com/business/estate-planning/living-trust-overview.html", suits: ["revocable"] },
  { name: "Trust & Will (individual)", price: 499, priceLabel: "$499", url: "https://trustandwill.com", suits: ["revocable"] },
  { name: "Trust & Will (couple)", price: 599, priceLabel: "$599", url: "https://trustandwill.com", suits: ["revocable"] },
];

// ---- Engine ----

export function estimateLivingTrustCost(input: LivingTrustCostInput): LivingTrustCostResult {
  const multiplier = STATE_COST_MULTIPLIER[input.state] ?? 1.00;
  const breakdown: LivingTrustCostResult["breakdown"] = [];

  let costLow = 0;
  let costHigh = 0;

  if (input.useAttorney) {
    let base: BaselineAttorney;
    let label: string;

    if (input.trustType === "revocable") {
      base = REVOCABLE_TRUST_BASELINE[input.complexity];
      label = `${input.complexity.charAt(0).toUpperCase() + input.complexity.slice(1)} revocable living trust`;
    } else if (input.trustType === "irrevocable-ilit") {
      base = IRREVOCABLE_ILIT_BASELINE;
      label = "Irrevocable Life Insurance Trust (ILIT)";
    } else if (input.trustType === "irrevocable-mapt") {
      base = IRREVOCABLE_MAPT_BASELINE;
      label = "Medicaid Asset Protection Trust (MAPT)";
    } else {
      base = IRREVOCABLE_DYNASTY_BASELINE;
      label = "Dynasty / GST trust";
    }

    const trustLow = Math.round(base.low * multiplier);
    const trustHigh = Math.round(base.high * multiplier);
    breakdown.push({ item: label, costLow: trustLow, costHigh: trustHigh });
    costLow += trustLow;
    costHigh += trustHigh;

    if (input.includeFunding) {
      const propertiesLow = Math.round(FUNDING_COST_PER_PROPERTY.low * multiplier * Math.max(0, input.numberOfProperties));
      const propertiesHigh = Math.round(FUNDING_COST_PER_PROPERTY.high * multiplier * Math.max(0, input.numberOfProperties));
      const accountsLow = Math.round(FUNDING_COST_ACCOUNTS.low * multiplier);
      const accountsHigh = Math.round(FUNDING_COST_ACCOUNTS.high * multiplier);
      if (input.numberOfProperties > 0) {
        breakdown.push({ item: `Deed recording × ${input.numberOfProperties}`, costLow: propertiesLow, costHigh: propertiesHigh });
        costLow += propertiesLow;
        costHigh += propertiesHigh;
      }
      breakdown.push({ item: "Retitle brokerage/bank accounts", costLow: accountsLow, costHigh: accountsHigh });
      costLow += accountsLow;
      costHigh += accountsHigh;
    }
  } else {
    // Online only supports revocable living trust; force revocable.
    const suited = ONLINE_OPTIONS.filter((o) => o.suits.includes("revocable"));
    const low = suited[0]?.price ?? 0;
    const high = suited[suited.length - 1]?.price ?? 0;
    breakdown.push({ item: "Online revocable living trust package", costLow: low, costHigh: high });
    costLow = low;
    costHigh = high;

    if (input.includeFunding) {
      const propertiesLow = FUNDING_COST_PER_PROPERTY.low * Math.max(0, input.numberOfProperties);
      const propertiesHigh = FUNDING_COST_PER_PROPERTY.high * Math.max(0, input.numberOfProperties);
      if (input.numberOfProperties > 0) {
        breakdown.push({ item: `Deed recording × ${input.numberOfProperties} (DIY)`, costLow: propertiesLow, costHigh: propertiesHigh });
        costLow += propertiesLow;
        costHigh += propertiesHigh;
      }
    }
  }

  // ---- State note ----
  const isCommunityProperty = COMMUNITY_PROPERTY_STATES.has(input.state);
  const stateTax = STATE_ESTATE_TAX[input.state];
  const hasInheritanceTax = STATE_INHERITANCE_TAX.has(input.state);
  const stateTaxWarning = !!stateTax || hasInheritanceTax;

  let stateNote = "";
  if (isCommunityProperty) {
    stateNote = "This is a community property state — assets acquired during marriage are generally owned 50/50 by both spouses. Funding a revocable living trust needs to account for that: a joint trust is common in community property states because it preserves the community-property status of assets for basis-adjustment purposes at the first spouse's death (a step-up on both halves under IRC §1014(b)(6)).";
  } else if (input.trustType === "irrevocable-mapt") {
    stateNote = "For a Medicaid Asset Protection Trust, remember the 5-year lookback: transfers into an irrevocable trust are considered gifts, and Medicaid disqualifies you from long-term-care coverage for a period equal to the transferred amount divided by the state's monthly regional rate. Plan MAPT funding at least 5 years before any anticipated Medicaid need.";
  } else if (stateTax) {
    stateNote = `${input.state.replace(/-/g, " ")} imposes a state estate tax with an exemption of $${(stateTax.exemption / 1_000_000).toFixed(2)}M — meaningfully below the federal $15M. A revocable living trust does not reduce state estate tax, but an irrevocable trust (funded during life) can move assets out of the state taxable estate. Model the tradeoff with your attorney.`;
  } else {
    stateNote = "This state does not impose its own estate or inheritance tax. A revocable living trust is a probate-avoidance tool here — it does not save federal or state estate tax, but it keeps your estate settlement private and out of probate court.";
  }

  const onlineOptions = ONLINE_OPTIONS.filter((o) => o.suits.includes(input.trustType));

  return {
    costLow,
    costHigh,
    breakdown,
    onlineOptions,
    stateNote,
    stateTaxWarning,
    isCommunityProperty,
  };
}
