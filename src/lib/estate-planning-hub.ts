// Pure decision-tree engine for the /estate-planning/ hub calculator.
//   recommendEstatePlan() — takes marital + kids + assets + state + special-needs inputs and
//   returns the recommended plan type (simple will → full estate plan) with a professional-cost
//   band and rationale.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - Federal estate tax exemption 2026: $15,000,000 per individual (OBBBA P.L. 119-21 amended
//     IRC §2010(c)(3); now permanent + indexed). Rate: 40% flat on excess. Portability preserved.
//     GST exemption mirrors at $15M. Annual gift exclusion: $19,000.
//     https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
//   - 12 state estate tax states + DC (2026): CT $15M, HI $5.49M, IL $4M, ME $7M, MD $5M,
//     MA $2M, MN $3M, NY $7.35M (105% cliff), OR $1M, RI $1.84M, VT $5M, WA $3M (rate reset
//     35%→20% effective 7/1/2026). DC $4.99M.
//   - 5 state inheritance tax states (2026, Iowa repealed 2025): KY (Class B exempt in 2026),
//     MD (10% flat on non-exempt), NE (1%/11%/15% by class), NJ (Class A exempt, C 11-16%,
//     D 15-16%), PA (0% spouse/minor, 4.5% lineal, 12% sibling, 15% other).
//   - Attorney will costs (Legaltemplates 2026 909-firm study + Nolo + NCOA):
//     simple $300-$1,200, moderate $750-$2,500, complex $2,500-$7,500+.
//   - Attorney revocable-living-trust: $1,500-$5,000+ typical; CA/HNW metros $5,000-$10,000+.
//   - Irrevocable trust: ILIT $2,500-$4,000, MAPT $3,000-$6,000, Dynasty $5,000-$10,000+.

export type PlanType =
  | "simple-will"
  | "moderate-will"
  | "complex-will"
  | "living-trust"
  | "living-trust-with-snt"
  | "full-estate-plan";

export interface EstatePlanningInput {
  married: boolean;
  kids: boolean;
  /** Real estate or business interests in more than one state. */
  multipleStates: boolean;
  /** Approximate net worth (assets − liabilities), whole dollars. */
  netWorth: number;
  /** State slug (e.g. "california"). Used for state estate/inheritance tax exposure. */
  state: string;
  /** Special-needs dependent (child or sibling) requiring an SNT. */
  specialNeedsDependent: boolean;
}

export interface EstatePlanRecommendation {
  plan: PlanType;
  name: string;
  /** Documents included in the recommendation. */
  documents: string[];
  /** Professional-cost band (attorney-drafted), USD. */
  costLow: number;
  costHigh: number;
  /** DIY / online cost floor (Trust & Will / LegalZoom / Nolo tier), USD. */
  diyLow: number;
  diyHigh: number;
  /** Plain-language rationale. */
  reason: string;
  /** Federal estate-tax exposure (net worth − $15M exemption, or 0). */
  federalExposure: number;
  /** State estate-tax exposure for the taxpayer's state (0 if state has no estate tax). */
  stateExposure: number;
  /** Whether the state also has an inheritance tax that could affect heirs. */
  stateInheritanceTax: boolean;
}

// ---- 2026 estate-tax data ----

/** 2026 federal estate tax exemption per individual (OBBBA-permanent, indexed). */
export const FEDERAL_ESTATE_EXEMPTION_2026 = 15_000_000;
/** 2026 federal estate tax rate on the excess (flat). */
export const FEDERAL_ESTATE_RATE = 0.40;

interface StateEstateTax {
  exemption: number;
  topRate: number;
  notes?: string;
}

/** State-level estate tax exemption + top rate for 2026 (12 states + DC). */
export const STATE_ESTATE_TAX: Record<string, StateEstateTax> = {
  "connecticut": { exemption: 15_000_000, topRate: 0.12, notes: "Tied to federal exemption." },
  "hawaii": { exemption: 5_490_000, topRate: 0.20 },
  "illinois": { exemption: 4_000_000, topRate: 0.16 },
  "maine": { exemption: 7_000_000, topRate: 0.12 },
  "maryland": { exemption: 5_000_000, topRate: 0.16, notes: "Also has a 10% inheritance tax on non-exempt beneficiaries." },
  "massachusetts": { exemption: 2_000_000, topRate: 0.16, notes: "Lowest threshold among mainstream states." },
  "minnesota": { exemption: 3_000_000, topRate: 0.16 },
  "new-york": { exemption: 7_350_000, topRate: 0.16, notes: "Cliff: estates over 105% of the exemption are taxed from $0." },
  "oregon": { exemption: 1_000_000, topRate: 0.16, notes: "Lowest state exemption in the country." },
  "rhode-island": { exemption: 1_838_056, topRate: 0.16, notes: "Indexed annually." },
  "vermont": { exemption: 5_000_000, topRate: 0.16, notes: "Flat 16%." },
  "washington": { exemption: 3_000_000, topRate: 0.20, notes: "Rate reset from 35% (7/1/2025–6/30/2026) to 20% effective 7/1/2026." },
};

/** State-level inheritance tax states (2026, post–Iowa repeal). Rates by beneficiary class. */
export const STATE_INHERITANCE_TAX = new Set<string>([
  "kentucky", "maryland", "nebraska", "new-jersey", "pennsylvania",
]);

// ---- Engine ----

export function recommendEstatePlan(input: EstatePlanningInput): EstatePlanRecommendation {
  const netWorth = Math.max(0, input.netWorth || 0);
  const federalExposure = Math.max(0, netWorth - FEDERAL_ESTATE_EXEMPTION_2026);
  const stateData = STATE_ESTATE_TAX[input.state];
  const stateExposure = stateData ? Math.max(0, netWorth - stateData.exemption) : 0;
  const stateInheritanceTax = STATE_INHERITANCE_TAX.has(input.state);

  // 1. Full estate plan — federal or state exposure warrants advanced planning.
  if (federalExposure > 0 || stateExposure > 0) {
    return {
      plan: "full-estate-plan",
      name: "Full estate plan (revocable trust + irrevocable trust)",
      documents: [
        "Revocable living trust (avoids probate, retains lifetime control)",
        "Irrevocable trust (ILIT, dynasty trust, or gifting trust — removes assets from taxable estate)",
        "Pour-over will (catches assets outside the trust)",
        "Durable power of attorney",
        "Advance healthcare directive + HIPAA release",
        "Beneficiary designation review (401(k), IRA, life insurance)",
      ],
      costLow: 5_000,
      costHigh: 15_000,
      diyLow: 0,
      diyHigh: 0,
      reason: `Your net worth exceeds ${federalExposure > 0 ? "the $15 million federal estate tax exemption" : `the ${input.state}'s $${(stateData!.exemption / 1_000_000).toFixed(2)}M state estate tax exemption`}. At 40% federal / up to ${stateData ? Math.round(stateData.topRate * 100) : 16}% state rates on the excess, planning to reduce the taxable estate through irrevocable trusts, lifetime gifting (2026 annual exclusion $19,000 per donee), and charitable strategies is the highest-value step. DIY tools are not appropriate at this net-worth tier.`,
      federalExposure,
      stateExposure,
      stateInheritanceTax,
    };
  }

  // 2. Special-needs dependent — SNT is a hard requirement.
  if (input.specialNeedsDependent) {
    return {
      plan: "living-trust-with-snt",
      name: "Revocable living trust + Special Needs Trust",
      documents: [
        "Revocable living trust (for the household's assets)",
        "Third-party Special Needs Trust (funds for the dependent without disqualifying SSI/Medicaid)",
        "Pour-over will",
        "Guardianship nomination (if the dependent is a minor)",
        "Durable power of attorney",
        "Advance healthcare directive + HIPAA release",
      ],
      costLow: 3_500,
      costHigh: 7_500,
      diyLow: 0,
      diyHigh: 0,
      reason: "You reported a special-needs dependent. A Third-Party Special Needs Trust preserves the dependent's eligibility for means-tested benefits (SSI, Medicaid) while providing supplemental resources. SNT drafting is technical enough that DIY tools should not be used — the wrong language can disqualify benefits and be counted as a countable asset.",
      federalExposure,
      stateExposure,
      stateInheritanceTax,
    };
  }

  // 3. Multiple states OR named heir with complex facts — living trust to avoid probate.
  if (input.multipleStates) {
    return {
      plan: "living-trust",
      name: "Revocable living trust + supporting documents",
      documents: [
        "Revocable living trust (avoids probate in every state where you own property)",
        "Pour-over will",
        "Durable power of attorney",
        "Advance healthcare directive + HIPAA release",
        "Trust funding — retitle real estate deeds, brokerage accounts",
      ],
      costLow: 1_500,
      costHigh: 5_000,
      diyLow: 499,
      diyHigh: 599,
      reason: "Property in more than one state means your estate would face ancillary probate — a separate probate proceeding in each state — without a living trust. A revocable living trust holds title to real estate in every state and avoids that duplicative probate. DIY services like Trust & Will ($499 individual / $599 couple) can handle a straightforward RLT if your facts are clean.",
      federalExposure,
      stateExposure,
      stateInheritanceTax,
    };
  }

  // 4. Married + kids — moderate-complex will with guardianship.
  if (input.married && input.kids) {
    return {
      plan: "complex-will",
      name: "Will (with guardianship) + POA + healthcare directive",
      documents: [
        "Last will and testament with guardian nomination for minor children",
        "Durable power of attorney (both spouses)",
        "Advance healthcare directive + HIPAA release",
        "Beneficiary designation review (401(k), IRA, life insurance) — these override the will",
      ],
      costLow: 750,
      costHigh: 2_500,
      diyLow: 199,
      diyHigh: 299,
      reason: "Married with minor children needs a will that names guardians for the kids, appoints an executor, and (usually) creates a testamentary trust for the children until age 25 or 30. Trust & Will's couple plan ($299) or LegalZoom's $229 couple plan can handle this if you have straightforward assets and clear heirs. Attorney-drafted becomes worth it if there are second marriages, business interests, or specific-bequest complexity.",
      federalExposure,
      stateExposure,
      stateInheritanceTax,
    };
  }

  // 5. Single with kids OR married without kids.
  if (input.married || input.kids) {
    return {
      plan: "moderate-will",
      name: "Will + POA + healthcare directive",
      documents: [
        "Last will and testament (guardian nomination if minor children)",
        "Durable power of attorney",
        "Advance healthcare directive + HIPAA release",
        "Beneficiary designation review (401(k), IRA, life insurance)",
      ],
      costLow: 500,
      costHigh: 1_500,
      diyLow: 129,
      diyHigh: 299,
      reason: input.kids
        ? "Single parents need a will primarily to name a guardian for the kids and appoint an executor. Beneficiary designations on retirement accounts and life insurance override the will, so review those in parallel. Online services like Trust & Will ($199) or LegalZoom Basic ($129) handle straightforward cases; attorney-drafted for more complex facts."
        : "Married without children still needs a will to name the surviving spouse as executor and address any specific bequests. Online services like Trust & Will's couple plan ($299) or LegalZoom's $229 couple work for straightforward cases.",
      federalExposure,
      stateExposure,
      stateInheritanceTax,
    };
  }

  // 6. Fallback — simple will.
  return {
    plan: "simple-will",
    name: "Simple will + POA + healthcare directive",
    documents: [
      "Last will and testament (name executor + primary beneficiaries)",
      "Durable power of attorney",
      "Advance healthcare directive + HIPAA release",
      "Beneficiary designation review",
    ],
    costLow: 300,
    costHigh: 800,
    diyLow: 0,
    diyHigh: 199,
    reason: "Single without children, no cross-state property, no exposure to estate tax — a simple will (or a state-specific statutory will) plus a POA and healthcare directive covers the essentials. FreeWill offers all three at $0 (monetized via nonprofit partnerships); Trust & Will's individual will is $199. Attorney-drafted is $300–$800 if you want the review.",
    federalExposure,
    stateExposure,
    stateInheritanceTax,
  };
}
