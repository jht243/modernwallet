// HELOC engine — standalone. A home equity line of credit has two phases: a draw period where the
// payment is commonly interest-only, then a repayment period where the balance amortizes over a
// fixed number of years. Two limits matter to a borrower: how much line the equity supports
// (lender-set combined loan-to-value cap x home value, less the mortgage still owed) and what the
// payment does when the variable rate resets from draw to repayment.
//
// Every rate, cap and term is a user input. Nothing here assumes a market rate or a lender cap.

export type DrawPaymentType = "interest-only" | "amortizing";

export interface HelocInput {
  homeValue: number;
  mortgageBalance: number;
  /** Lender's combined loan-to-value cap, as a percent of home value. */
  maxCltvPct: number;
  /** Amount actually drawn (may be less than the maximum line). */
  drawnBalance: number;
  aprPct: number;
  drawYears: number;
  repayYears: number;
  drawPaymentType: DrawPaymentType;
  /** Extra percentage points added to the APR for the rate-stress row. */
  stressPoints: number;
}

export interface HelocResult {
  /** Most the equity supports under the CLTV cap: max(0, value x cap - mortgage). */
  maxLine: number;
  cltvAfterDrawPct: number | null;
  drawExceedsLine: boolean;
  drawPayment: number | null;
  repayPayment: number | null;
  totalInterestDraw: number | null;
  totalInterestRepay: number | null;
  totalInterest: number | null;
  stressDrawPayment: number | null;
  stressRepayPayment: number | null;
  /** Repayment-period payment minus draw-period payment, at the entered APR. */
  paymentJump: number | null;
}

const EMPTY: HelocResult = {
  maxLine: 0, cltvAfterDrawPct: null, drawExceedsLine: false, drawPayment: null, repayPayment: null,
  totalInterestDraw: null, totalInterestRepay: null, totalInterest: null,
  stressDrawPayment: null, stressRepayPayment: null, paymentJump: null,
};

function level(balance: number, aprPct: number, months: number): number {
  if (months <= 0) return balance;
  const r = aprPct / 100 / 12;
  if (r === 0) return balance / months;
  return (balance * r) / (1 - Math.pow(1 + r, -months));
}

/** Payments for one rate path: draw-period payment, repayment payment, and interest totals.
 *  Interest-only draw: balance is unchanged through the draw. Amortizing draw: the balance is paid
 *  down over the draw + repayment window as one level-payment loan, so the payment does not jump. */
function path(balance: number, aprPct: number, drawMonths: number, repayMonths: number, type: DrawPaymentType) {
  const r = aprPct / 100 / 12;
  if (type === "interest-only" && drawMonths > 0) {
    const drawPayment = balance * r;
    const repayPayment = level(balance, aprPct, repayMonths);
    return {
      drawPayment,
      repayPayment,
      interestDraw: drawPayment * drawMonths,
      interestRepay: repayPayment * repayMonths - balance,
    };
  }
  const total = drawMonths + repayMonths;
  const payment = level(balance, aprPct, total);
  const paid = payment * total;
  const balanceAtDrawEnd = r === 0 ? balance - payment * drawMonths : balance * Math.pow(1 + r, drawMonths) - payment * ((Math.pow(1 + r, drawMonths) - 1) / r);
  const interestRepay = payment * repayMonths - Math.max(0, balanceAtDrawEnd);
  return { drawPayment: payment, repayPayment: payment, interestDraw: paid - balance - interestRepay, interestRepay };
}

export function computeHeloc(input: HelocInput): HelocResult {
  const { homeValue, mortgageBalance, maxCltvPct, drawnBalance, aprPct, drawYears, repayYears, drawPaymentType, stressPoints } = input;
  if (!(homeValue > 0) || mortgageBalance < 0) return EMPTY;

  const maxLine = Math.max(0, homeValue * (Math.max(0, maxCltvPct) / 100) - mortgageBalance);
  const drawn = Math.max(0, drawnBalance);
  const drawExceedsLine = drawn > maxLine + 0.005;
  const cltvAfterDrawPct = ((mortgageBalance + drawn) / homeValue) * 100;
  if (drawn === 0 || aprPct < 0 || repayYears <= 0 || drawYears < 0) return { ...EMPTY, maxLine, cltvAfterDrawPct, drawExceedsLine };

  const dm = Math.round(drawYears * 12);
  const rm = Math.round(repayYears * 12);
  const base = path(drawn, aprPct, dm, rm, drawPaymentType);
  const stress = path(drawn, aprPct + Math.max(0, stressPoints), dm, rm, drawPaymentType);
  return {
    maxLine,
    cltvAfterDrawPct,
    drawExceedsLine,
    drawPayment: base.drawPayment,
    repayPayment: base.repayPayment,
    totalInterestDraw: base.interestDraw,
    totalInterestRepay: base.interestRepay,
    totalInterest: base.interestDraw + base.interestRepay,
    stressDrawPayment: stress.drawPayment,
    stressRepayPayment: stress.repayPayment,
    paymentJump: base.repayPayment - base.drawPayment,
  };
}
