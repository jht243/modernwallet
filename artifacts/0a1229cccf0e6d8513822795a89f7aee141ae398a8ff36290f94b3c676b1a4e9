// Capital loss carryover engine — tool-usage pass 2026-11-25. Standalone, no React/DOM.
//
// What it answers: how much of this year's net capital loss you can deduct against other income, what carries forward, and
// how many tax years the carryforward lasts.
//
// Sources (saved under reports/mindmap-pass/2026-11-25-tool-usage/research/sources/):
//   - IRS Topic no. 409, Capital gains and losses, and IRS Publication 550 (2025), chapter 4 "Capital Losses":
//       * Losses first offset capital gains. A net loss on Schedule D line 16 is deductible against other income up to
//         $3,000 ($1,500 if married filing separately), "the lesser of" that limit or the total net loss.
//       * The unused part carries forward to later years with no expiry, and keeps its short-term or long-term character.
//       * "When you figure your capital loss carryover, use your short-term capital losses first" (Pub 550, Worksheet 4-1).
//   - Worksheet 4-1 (Capital Loss Carryover Worksheet) lines 4 to 13 are implemented in `carryoverAfterYear` below.
//
// The $3,000 and $1,500 limits are set by law and are not indexed for inflation, so this schedule does not depend on a tax year.
//
// Simplifications (stated on the page): taxable income is assumed to be at least the allowed deduction in every year, so
// Worksheet 4-1 line 4 equals the allowed deduction (a low-income year would carry more forward); future gains are entered as
// one net long-term gain per year; wash-sale disallowed losses, AMT, state rules and the decedent and joint/separate-return
// special cases in Pub 550 are not modeled.

export type LossStatus = "single" | "mfj" | "mfs";

/** Yearly limit on deducting a net capital loss against other income (IRC 1211(b); Pub 550). */
export const LOSS_LIMIT: Record<LossStatus, number> = { single: 3000, mfj: 3000, mfs: 1500 };

/** Stop the schedule after this many tax years so a tiny deduction against a huge loss cannot run forever. */
export const MAX_YEARS = 200;

export interface CarryoverInput {
  status: LossStatus;
  /** Short-term gains and losses this year, each entered as a positive amount. */
  stGains: number;
  stLosses: number;
  /** Long-term gains and losses this year, each entered as a positive amount. */
  ltGains: number;
  ltLosses: number;
  /** Capital loss carryover brought in from earlier years, by character, as positive amounts. */
  priorSt: number;
  priorLt: number;
  /** Net long-term capital gain you expect in each later year (0 if none). */
  futureGain: number;
}

export interface YearRow {
  /** 1 = this tax year. */
  year: number;
  /** Net gain (+) or loss (-) from the year's capital transactions and the carryover brought in. */
  net: number;
  /** Deduction taken against other income. */
  deduction: number;
  /** Short-term and long-term carryover leaving the year. */
  carrySt: number;
  carryLt: number;
  carryTotal: number;
}

export interface CarryoverResult {
  limit: number;
  /** Net result for this year: gains minus losses, including the carryover brought in. Negative = net loss. */
  netThisYear: number;
  /** Net short-term and long-term results before they are combined. */
  netSt: number;
  netLt: number;
  isNetLoss: boolean;
  /** Deduction against other income this year. */
  deductionThisYear: number;
  /** Loss carried to next year. */
  carryTotal: number;
  carrySt: number;
  carryLt: number;
  schedule: YearRow[];
  /** Tax years in which a deduction is taken, counting this one. 0 when there is no net loss. */
  yearsOfDeductions: number;
  /** Deduction in the last year of the schedule. */
  lastYearDeduction: number;
  /** Loss still unused when the schedule hit MAX_YEARS (practically never). */
  unusedAfterMax: number;
  /** Sum of all deductions in the schedule. */
  totalDeducted: number;
}

const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r2 = (v: number) => Math.round(v * 100) / 100;

/**
 * One tax year of Pub 550 Worksheet 4-1. `netSt` and `netLt` are the year's net short-term and long-term results
 * (gain positive, loss negative), already including carryovers brought in.
 */
export function carryoverAfterYear(netSt: number, netLt: number, limit: number) {
  const total = netSt + netLt;
  const deduction = total < 0 ? Math.min(limit, -total) : 0;
  const stLoss = Math.max(0, -netSt);
  const ltLoss = Math.max(0, -netLt);
  const stGain = Math.max(0, netSt);
  const ltGain = Math.max(0, netLt);
  // Worksheet 4-1: line 4 = deduction (taxable income assumed sufficient).
  const carrySt = r2(Math.max(0, stLoss - (deduction + ltGain)));
  const carryLt = r2(Math.max(0, ltLoss - (stGain + Math.max(0, deduction - stLoss))));
  return { deduction: r2(deduction), carrySt, carryLt };
}

export function computeCarryover(i: CarryoverInput): CarryoverResult {
  const limit = LOSS_LIMIT[i.status];
  const netSt = r2(clean(i.stGains) - clean(i.stLosses) - clean(i.priorSt));
  const netLt = r2(clean(i.ltGains) - clean(i.ltLosses) - clean(i.priorLt));
  const first = carryoverAfterYear(netSt, netLt, limit);
  const future = clean(i.futureGain);

  const schedule: YearRow[] = [
    { year: 1, net: r2(netSt + netLt), deduction: first.deduction, carrySt: first.carrySt, carryLt: first.carryLt, carryTotal: r2(first.carrySt + first.carryLt) },
  ];
  let cs = first.carrySt;
  let cl = first.carryLt;
  while ((cs > 0 || cl > 0) && schedule.length < MAX_YEARS) {
    const year = schedule.length + 1;
    const st = -cs;
    const lt = future - cl;
    const step = carryoverAfterYear(st, lt, limit);
    schedule.push({ year, net: r2(st + lt), deduction: step.deduction, carrySt: step.carrySt, carryLt: step.carryLt, carryTotal: r2(step.carrySt + step.carryLt) });
    cs = step.carrySt;
    cl = step.carryLt;
  }

  const deductionYears = schedule.filter((r) => r.deduction > 0);
  const last = schedule[schedule.length - 1];
  return {
    limit,
    netThisYear: r2(netSt + netLt),
    netSt,
    netLt,
    isNetLoss: netSt + netLt < 0,
    deductionThisYear: first.deduction,
    carryTotal: schedule[0].carryTotal,
    carrySt: first.carrySt,
    carryLt: first.carryLt,
    schedule,
    yearsOfDeductions: deductionYears.length,
    lastYearDeduction: deductionYears.length ? deductionYears[deductionYears.length - 1].deduction : 0,
    unusedAfterMax: last.carryTotal,
    totalDeducted: r2(schedule.reduce((a, r) => a + r.deduction, 0)),
  };
}
