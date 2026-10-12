// Hurricane deductible engine — standalone. Turns a percentage hurricane deductible into dollars and
// shows what the policyholder and the insurer each pay on a covered hurricane loss.
//
// Rules (Florida Department of Financial Services, "Florida's Hurricane Deductible"; section 627.701,
// Florida Statutes):
//   • The deductible is a percentage (commonly 2%, 5% or 10%) of the policy's dwelling coverage limit,
//     or a flat dollar amount such as $500 or $2,000. The policy lists it as a dollar amount.
//   • When the hurricane deductible applies, no other deductible under the policy applies.
//   • It applies on an annual basis to all covered hurricane losses in the calendar year (same insurer or
//     insurer group). If the first hurricane did not use it up, the deductible for the next hurricane is the
//     GREATER of the balance left and the policy's all-other-perils deductible; if it was used up in full,
//     the all-other-perils deductible applies to later hurricane claims that year.
// This models a single dwelling under a personal residential policy. It does not model deductibles
// applied per structure, exclusions, coinsurance or other states' wind deductibles.

export type DeductibleKind = "percent" | "flat";

export interface HurricaneDeductibleInput {
  /** Dwelling (Coverage A) limit on the declarations page. */
  dwellingLimit: number;
  /** "percent" = deductibleValue is a percent of the dwelling limit; "flat" = a dollar amount. */
  kind: DeductibleKind;
  /** Percent (2, 5, 10) when kind is "percent"; dollars when kind is "flat". */
  deductibleValue: number;
  /** Covered hurricane damage for this claim. */
  damage: number;
  /** Part of this calendar year's hurricane deductible already used by earlier hurricane claims. */
  alreadyUsed: number;
  /** The policy's separate all-other-perils deductible. */
  otherPerilsDeductible: number;
}

export interface HurricaneDeductibleResult {
  /** The full annual hurricane deductible in dollars. */
  fullDeductible: number;
  /** Balance of the annual deductible before this claim. */
  balanceBefore: number;
  /** The deductible that applies to this claim. */
  applied: number;
  youPay: number;
  insurerPays: number;
  /** Balance of the annual hurricane deductible left for later hurricanes this year. */
  balanceAfter: number;
  /** True when the damage does not exceed the deductible that applies. */
  belowDeductible: boolean;
  /** True when the all-other-perils deductible is the one applied. */
  usesOtherPerils: boolean;
}

const nn = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function computeHurricaneDeductible(input: HurricaneDeductibleInput): HurricaneDeductibleResult {
  const limit = nn(input.dwellingLimit);
  const damage = nn(input.damage);
  const other = nn(input.otherPerilsDeductible);
  const fullDeductible = input.kind === "percent" ? (limit * nn(input.deductibleValue)) / 100 : nn(input.deductibleValue);
  const used = Math.min(nn(input.alreadyUsed), fullDeductible);
  const balanceBefore = Math.max(fullDeductible - used, 0);

  // First hurricane of the year: the full deductible. Later hurricane: greater of balance left and AOP.
  const firstOfYear = used === 0;
  const applied = firstOfYear ? fullDeductible : Math.max(balanceBefore, other);
  const usesOtherPerils = !firstOfYear && other > balanceBefore;

  const youPay = Math.min(damage, applied);
  const insurerPays = Math.max(damage - applied, 0);
  // The deductible balance only shrinks by what the claim credited against it.
  const balanceAfter = usesOtherPerils ? 0 : Math.max(balanceBefore - youPay, 0);

  return { fullDeductible, balanceBefore, applied, youPay, insurerPays, balanceAfter, belowDeductible: damage <= applied, usesOtherPerils };
}
