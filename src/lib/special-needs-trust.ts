// Pure Special Needs Trust engine for /elder-care/special-needs-trust-calculator/.
//   recommendSNT() — beneficiary age + benefits + funding source + trust purpose → recommended
//   SNT type (first-party, third-party, pooled) + setup cost + benefits impact.
// ZERO React/DOM deps.
//
// Primary-source grounding (verified July 2026):
//   - First-party SNT: 42 U.S.C. §1396p(d)(4)(A) — under-65 beneficiary; Medicaid payback required
//   - Third-party SNT: not codified in §1396p; POMS SI 01120.200; no age, no payback
//   - Pooled SNT: 42 U.S.C. §1396p(d)(4)(C) — nonprofit-managed; 65+ funding may trigger transfer
//     penalty in most states
//   - Food no longer counts as ISM (89 FR 21199, effective 9/30/2024, still in effect 2026)
//   - Shelter distributions trigger PMV reduction (up to 1/3 SSI FBR + $20)

export type FundingSource = "beneficiary-own" | "family-member" | "small-modest";
export type BenefitStatus = "ssi" | "ssdi" | "medicaid" | "multiple" | "none-yet";

export interface SNTInput {
  beneficiaryAge: number;
  fundingSource: FundingSource;
  benefitStatus: BenefitStatus;
  fundingAmount: number;
}

export type SNTType = "first-party" | "third-party" | "pooled";

export interface SNTResult {
  recommended: SNTType;
  setupCostLow: number;
  setupCostHigh: number;
  medicaidPayback: boolean;
  ageLimit: string;
  benefitsImpact: string;
  canPayFor: string[];
  cannotPayFor: string[];
  reasoning: string;
  statuteCite: string;
}

const FIRST_PARTY_COST: [number, number] = [3_000, 5_000];
const THIRD_PARTY_COST: [number, number] = [2_500, 5_000];
const POOLED_COST: [number, number] = [500, 1_500];

const CAN_PAY_FOR = [
  "Medical + dental care not covered by Medicaid",
  "Therapy (physical, occupational, speech)",
  "Transportation + adaptive vehicles",
  "Education + tutoring",
  "Vacation + entertainment",
  "Personal care attendants (beyond Medicaid-covered)",
  "Electronics, phone, internet",
  "Pets + hobbies",
  "Food (no longer ISM as of 9/30/2024)",
];

const CANNOT_PAY_FOR_DIRECTLY = [
  "Cash to beneficiary (counts as unearned income, reduces SSI dollar-for-dollar)",
  "Rent or mortgage (shelter → PMV reduction up to 1/3 SSI FBR + $20)",
  "Utilities (heat, gas, electricity, water, sewer, trash)",
  "Property taxes (shelter expense)",
];

export function recommendSNT(input: SNTInput): SNTResult {
  const age = Math.max(0, input.beneficiaryAge || 0);
  const funding = input.fundingAmount || 0;

  let type: SNTType;
  let reasoning: string;

  if (input.fundingSource === "beneficiary-own" && age < 65) {
    type = "first-party";
    reasoning = "The beneficiary is under 65 and the trust is being funded with their own money (personal injury settlement, inheritance, back-owed SSDI). A first-party SNT under 42 U.S.C. §1396p(d)(4)(A) preserves Medicaid/SSI eligibility while the funds are held in trust, but Medicaid payback is required at the beneficiary's death.";
  } else if (input.fundingSource === "beneficiary-own" && age >= 65) {
    type = "pooled";
    reasoning = "The beneficiary is 65 or older and the trust is being funded with their own money. A first-party (d)(4)(A) SNT is unavailable at this age. A pooled SNT under 42 U.S.C. §1396p(d)(4)(C) is the standard option — a nonprofit administers pooled sub-accounts. Note: in most states, 65+ funding triggers a Medicaid transfer penalty; consult an elder-law attorney about state-specific rules.";
  } else if (input.fundingSource === "small-modest" || funding < 100_000) {
    type = "pooled";
    reasoning = "For modest funding amounts, a pooled SNT under 42 U.S.C. §1396p(d)(4)(C) is often more cost-effective than a standalone trust. A nonprofit administers pooled sub-accounts with lower setup costs ($500-$1,500) and shared trustee expertise.";
  } else {
    type = "third-party";
    reasoning = "The trust is being funded by a family member (parent, grandparent, sibling) with their own assets, not the beneficiary's. A third-party SNT preserves the beneficiary's SSI/Medicaid eligibility, has no age limit, and — crucially — has NO Medicaid payback at the beneficiary's death. Remainder passes to family beneficiaries you name in the trust.";
  }

  const setupCost = type === "first-party" ? FIRST_PARTY_COST
    : type === "third-party" ? THIRD_PARTY_COST
    : POOLED_COST;

  const medicaidPayback = type === "first-party" || type === "pooled";
  const ageLimit = type === "first-party" ? "Under 65 at establishment"
    : type === "pooled" ? "No hard age limit, but 65+ funding may trigger state Medicaid transfer penalty"
    : "No age limit";

  const statuteCite = type === "first-party" ? "42 U.S.C. §1396p(d)(4)(A)"
    : type === "pooled" ? "42 U.S.C. §1396p(d)(4)(C)"
    : "POMS SI 01120.200 (third-party SNT rules)";

  const benefitsImpact = input.benefitStatus === "ssi" || input.benefitStatus === "multiple"
    ? "Properly drafted SNT is NOT a countable resource for SSI (POMS SI 01120.200). Distributions for food or non-shelter needs do NOT reduce SSI. Shelter distributions trigger PMV reduction (up to 1/3 SSI FBR + $20)."
    : input.benefitStatus === "medicaid"
      ? "Properly drafted SNT is NOT a countable resource for Medicaid. Distributions for medical care not covered by Medicaid are permitted."
      : input.benefitStatus === "ssdi"
        ? "SSDI is an insurance benefit (not needs-based), so SNT distributions do not affect eligibility. If SSDI recipient also receives Medicaid (many do), SNT protects Medicaid eligibility."
        : "Not currently receiving benefits — SNT allows the beneficiary to receive future SSI/Medicaid if eligibility is later established, without the trust assets being counted.";

  return {
    recommended: type,
    setupCostLow: setupCost[0],
    setupCostHigh: setupCost[1],
    medicaidPayback,
    ageLimit,
    benefitsImpact,
    canPayFor: CAN_PAY_FOR,
    cannotPayFor: CANNOT_PAY_FOR_DIRECTLY,
    reasoning,
    statuteCite,
  };
}
