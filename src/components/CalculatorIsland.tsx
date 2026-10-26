import AutoLoanCalculator from "./AutoLoanCalculator";
import AutoRefinanceCalculator from "./AutoRefinanceCalculator";
import RentalCalculator from "./RentalCalculator";
import RetirementCalculator from "./RetirementCalculator";
import InvestmentCalculator from "./InvestmentCalculator";
import PortfolioCalculator from "./PortfolioCalculator";
import NetWorthCalculator from "./NetWorthCalculator";
import AffordabilityCalculator from "./AffordabilityCalculator";
import MortgageExtrasCalculator from "./MortgageExtrasCalculator";
import BudgetCalculator from "./BudgetCalculator";
import TaxResolutionHubCalculator from "./TaxResolutionHubCalculator";
import OfferInCompromiseCalculator from "./OfferInCompromiseCalculator";
import IRSPaymentPlanCalculator from "./IRSPaymentPlanCalculator";
import PenaltyAbatementCalculator from "./PenaltyAbatementCalculator";
import BackTaxesImpactCalculator from "./BackTaxesImpactCalculator";
import EstatePlanningHubCalculator from "./EstatePlanningHubCalculator";
import WillCostCalculator from "./WillCostCalculator";
import LivingTrustCostCalculator from "./LivingTrustCostCalculator";
import EstateTaxCalculator from "./EstateTaxCalculator";
import PrenupCostCalculator from "./PrenupCostCalculator";
import ProbateHubCalculator from "./ProbateHubCalculator";
import ElderCareHubCalculator from "./ElderCareHubCalculator";
import MedicaidSpendDownCalculator from "./MedicaidSpendDownCalculator";
import SpecialNeedsTrustCalculator from "./SpecialNeedsTrustCalculator";
import LongTermCareCostCalculator from "./LongTermCareCostCalculator";
import TrumpAccountCalculator from "./TrumpAccountCalculator";
import CollegeSavings529Calculator from "./CollegeSavings529Calculator";
import CoastFireCalculator from "./CoastFireCalculator";
import BusinessLoanPayoffCalculator from "./BusinessLoanPayoffCalculator";
import PersonalLoanCalculator from "./PersonalLoanCalculator";
import PersonalLoanPayoffCalculator from "./PersonalLoanPayoffCalculator";
import MerchantCashAdvanceCalculator from "./MerchantCashAdvanceCalculator";
import InvoiceFactoringCalculator from "./InvoiceFactoringCalculator";
import BusinessLineOfCreditCalculator from "./BusinessLineOfCreditCalculator";
import InterestPerDayCalculator from "./InterestPerDayCalculator";
import TaxableVsTaxDeferredCalculator from "./TaxableVsTaxDeferredCalculator";
import CreditCardPayoffCalculator from "./CreditCardPayoffCalculator";
import WithdrawalReverseCalculator from "./WithdrawalReverseCalculator";
import PtoCashoutCalculator from "./PtoCashoutCalculator";
import IulCalculator from "./IulCalculator";
import ZakatCalculator from "./ZakatCalculator";
import SelfEmploymentTaxCalculator from "./SelfEmploymentTaxCalculator";
import MileageDeductionCalculator from "./MileageDeductionCalculator";
import FreelanceRateCalculator from "./FreelanceRateCalculator";
import SCorpTaxCalculator from "./SCorpTaxCalculator";
import LifeInsuranceNeedsCalculator from "./LifeInsuranceNeedsCalculator";
import OperatingCashFlowCalculator from "./OperatingCashFlowCalculator";
import CashConversionCycleCalculator from "./CashConversionCycleCalculator";
import AnnualizedReturnCalculator from "./AnnualizedReturnCalculator";
import StockSplitCalculator from "./StockSplitCalculator";
import StockAverageCostCalculator from "./StockAverageCostCalculator";
import StockProfitCalculator from "./StockProfitCalculator";
import NavCalculator from "./NavCalculator";
import HelocCalculator from "./HelocCalculator";
import CommercialMortgageCalculator from "./CommercialMortgageCalculator";
import CdCalculator from "./CdCalculator";
import EmergencyFundCalculator from "./EmergencyFundCalculator";
import InflationCalculator from "./InflationCalculator";
import ExpenseRatioCalculator from "./ExpenseRatioCalculator";
import DebtConsolidationCalculator from "./DebtConsolidationCalculator";
import SocialSecurityBreakEvenCalculator from "./SocialSecurityBreakEvenCalculator";
import SocialSecurityColaCalculator from "./SocialSecurityColaCalculator";
import MileageReimbursementCalculator from "./MileageReimbursementCalculator";
import PortfolioRebalancingCalculator from "./PortfolioRebalancingCalculator";
import HurricaneDeductibleCalculator from "./HurricaneDeductibleCalculator";
import AnnuityCalculator from "./AnnuityCalculator";
import CreditCardInterestCalculator from "./CreditCardInterestCalculator";
import LoanPaymentCalculator from "./LoanPaymentCalculator";
import RothVsTraditional401kCalculator from "./RothVsTraditional401kCalculator";
import HysaVsCdCalculator from "./HysaVsCdCalculator";
import TrumpVs529Calculator from "./TrumpVs529Calculator";
import MortgageRecastCalculator from "./MortgageRecastCalculator";
import DebtToIncomeCalculator from "./DebtToIncomeCalculator";
import SocialSecurityTaxableCalculator from "./SocialSecurityTaxableCalculator";
import CharitableDeductionCalculator from "./CharitableDeductionCalculator";
import FloridaAmendment3Calculator from "./FloridaAmendment3Calculator";
import StudentLoanGarnishmentCalculator from "./StudentLoanGarnishmentCalculator";
import TaxBracketCalculator from "./TaxBracketCalculator";
import ChecklistBuilder from "./ChecklistBuilder";

// Single React entry point for every calculator island. Astro imports THIS component literally
// (a requirement for client:only) and passes `calculatorId`; the right calculator is picked here,
// on the client. Phase 2 adds the other calculators to the map below.

const ISLANDS: Record<string, React.ComponentType<any>> = {
  "auto-loan": AutoLoanCalculator,
  "auto-refinance": AutoRefinanceCalculator,
  // MortgageIQ reuses the auto-loan amortization engine in mortgageMode (home price + 15/30-yr terms).
  "mortgage": AutoLoanCalculator,
  "real-estate": RentalCalculator,
  "retirement": RetirementCalculator,
  "investing": InvestmentCalculator,
  "annualized-return": AnnualizedReturnCalculator,
  "portfolio": PortfolioCalculator,
  "net-worth": NetWorthCalculator,
  "budget": BudgetCalculator,
  // Pillar 1 (Tax Resolution) — IRS relief-program decision-tree hub + spoke calculators.
  "tax-resolution": TaxResolutionHubCalculator,
  "oic": OfferInCompromiseCalculator,
  "irs-payment-plan": IRSPaymentPlanCalculator,
  "penalty-abatement": PenaltyAbatementCalculator,
  "back-taxes-impact": BackTaxesImpactCalculator,
  // Pillar 2 (Estate Planning) — decision-tree hub + 4 spokes (will/trust/estate-tax/prenup).
  "estate-planning": EstatePlanningHubCalculator,
  "will-cost": WillCostCalculator,
  "living-trust-cost": LivingTrustCostCalculator,
  "estate-tax": EstateTaxCalculator,
  "prenup-cost": PrenupCostCalculator,
  "probate": ProbateHubCalculator,
  // Pillar 4 (Elder Care) — aging-assessment hub + 3 spokes (Medicaid spend-down, SNT, LTC cost).
  "elder-care": ElderCareHubCalculator,
  "medicaid-spend-down": MedicaidSpendDownCalculator,
  "special-needs-trust": SpecialNeedsTrustCalculator,
  "long-term-care-cost": LongTermCareCostCalculator,
  // Trump Account (federal child savings account, live 2026-07-04) — seed + capped contributions to age 18.
  "trump-account": TrumpAccountCalculator,
  // 529 / college-savings — projects balance to college start + funding-gap vs an inflated cost target.
  "529-savings-calculator": CollegeSavings529Calculator,
  // Coast FIRE — competitor-monitor pass (2026-07-15): does current savings alone reach the FIRE
  // number by retirement, and if not, when does it (with real contributions)?
  "coast-fire": CoastFireCalculator,
  // Business loan payoff — competitor-monitor pass (2026-07-15): standard amortizing term-loan
  // payoff + extra-payment scenario (distinct from the factor-rate MCA/factoring tools below).
  "business-loan-payoff": BusinessLoanPayoffCalculator,
  // Personal loan — competitor-monitor pass (2026-07-20): amortizing personal-loan payment +
  // origination-fee-aware effective APR (the gap most basic personal loan calculators skip).
  "personal-loan": PersonalLoanCalculator,
  // Personal loan extra-payment / payoff — competitor-monitor pass (2026-08-28): payoff timeline
  // for a personal loan you already have, distinct from the origination-fee/effective-APR tool
  // above (which prices a NEW loan). Per-spoke override island (mirrors business-loan-payoff).
  "personal-loan-payoff": PersonalLoanPayoffCalculator,
  // Interest per day — competitor-monitor pass (2026-08-03): daily interest earned/owed on any
  // balance, plus the effective annual yield (APY) once that daily rate compounds daily.
  "interest-per-day": InterestPerDayCalculator,
  // Taxable vs. tax-deferred — competitor-monitor pass (2026-08-05): the dollar gap between a
  // regular taxable account and a tax-deferred 401(k)/IRA for the same return and tax rate.
  "taxable-vs-tax-deferred": TaxableVsTaxDeferredCalculator,
  // Credit card payoff — competitor-monitor pass (2026-08-12): fixed-payment payoff timeline vs. a
  // minimum-payment-only path computed side by side, using the issuer minimum-payment formula.
  "credit-card-payoff": CreditCardPayoffCalculator,
  // HELOC — keyword-gap-pass (2026-09-28): equity limit + draw-period vs repayment-period payment.
  "heloc-calculator": HelocCalculator,
  // Commercial mortgage — keyword-gap-pass (2026-10-04): payment, balloon at term end, DSCR.
  "commercial-mortgage-calculator": CommercialMortgageCalculator,
  // autocomplete-pass (2026-10-07): CD maturity/penalty, emergency fund target, debt consolidation comparison.
  "cd-calculator": CdCalculator,
  "emergency-fund-calculator": EmergencyFundCalculator,
  "debt-consolidation-calculator": DebtConsolidationCalculator,
  // keyword-gap-pass (2026-10-11): purchasing power / future cost, and fund fee drag.
  "inflation-calculator": InflationCalculator,
  "expense-ratio-calculator": ExpenseRatioCalculator,
  // tool-usage pass (2026-10-11): the next tool each persona reached for — claiming-age break-even
  // (seed: Social Security retirement), employee mileage reimbursement (seed: IRS mileage 2026),
  // and buy/sell rebalancing trades (seed: 60/40 portfolio).
  "social-security-break-even-calculator": SocialSecurityBreakEvenCalculator,
  // mindmap-pass (2026-10-14): 2027 Social Security COLA — benefit after the 3.6% raise, with SSA rounding.
  "social-security-cola-calculator": SocialSecurityColaCalculator,
  "mileage-reimbursement-calculator": MileageReimbursementCalculator,
  "portfolio-rebalancing-calculator": PortfolioRebalancingCalculator,
  // x-trends pass (2026-10-12): Florida hurricane deductible in dollars, with the calendar-year carryover.
  "hurricane-deductible-calculator": HurricaneDeductibleCalculator,
  // Autocomplete pass (2026-10-14): annuity payout/growth/present value, card interest per cycle, level loan payment.
  "annuity-calculator": AnnuityCalculator,
  "credit-card-interest-calculator": CreditCardInterestCalculator,
  "loan-payment-calculator": LoanPaymentCalculator,
  // Trend-pass (2026-10-17): Roth vs Traditional 401(k) after-tax balance at equal take-home cost.
  "roth-vs-traditional-401k-calculator": RothVsTraditional401kCalculator,
  // tool-usage pass (2026-10-14): the next tool each persona reached for — HYSA vs CD (seed: HYSA calculator),
  // Trump Account vs 529 (seed: Trump Account), lump-sum recast (seed: mortgage payoff).
  "hysa-vs-cd-calculator": HysaVsCdCalculator,
  "trump-account-vs-529-calculator": TrumpVs529Calculator,
  "mortgage-recast-calculator": MortgageRecastCalculator,
  "debt-to-income-ratio-calculator": DebtToIncomeCalculator,
  "social-security-taxable-benefits-calculator": SocialSecurityTaxableCalculator,
  "charitable-donation-tax-deduction-calculator": CharitableDeductionCalculator,
  // X-trends pass (2026-10-19): Florida Amendment 3 homestead savings (Nov 3, 2026 ballot).
  "florida-amendment-3-calculator": FloridaAmendment3Calculator,
  // X-trends pass (2026-10-20): defaulted student loan collection exposure (wage garnishment, refund and Social Security offsets).
  "student-loan-wage-garnishment-calculator": StudentLoanGarnishmentCalculator,
  // Mindmap Autocomplete pass (2026-10-21): 2026 federal tax bracket, marginal and effective rate.
  "tax-bracket-calculator": TaxBracketCalculator,
  // Mindmap pass (2026-10-25): /checklists/ — one rule-driven checklist island for buying, selling,
  // renting, landlord, inspection, final walkthrough, move-in/out and first-apartment pages (preset.checklist).
  "checklists": ChecklistBuilder,
  // PTO / leave-days cash-out — competitor-monitor pass (2026-08-17): sell-back payout calculator
  // that also shows an estimated net-of-tax figure and the unpaid-time-off value for comparison.
  "pto-cashout": PtoCashoutCalculator,
  // Mindmap pass (2026-08-30) — indexed universal life projection vs a 401(k)/brokerage baseline.
  "iul-calculator": IulCalculator,
  // Competitor-monitor pass (2026-09-02): zakat calculator — derives the nisab threshold live
  // from a user-entered gold/silver price instead of hardcoding a dollar figure that goes stale.
  "zakat": ZakatCalculator,
  // Business Financing pillar — MCA, invoice factoring, business line of credit.
  "merchant-cash-advance": MerchantCashAdvanceCalculator,
  "invoice-factoring": InvoiceFactoringCalculator,
  "business-line-of-credit": BusinessLineOfCreditCalculator,
  // Self-employed / 1099 silo (2026-09-05): SE tax + set-aside share, the 2026 split-rate mileage
  // deduction, and a reverse-solved freelance rate. The SE-tax island also serves every
  // per-platform gig spoke through its preset.
  "self-employment-tax": SelfEmploymentTaxCalculator,
  "mileage-deduction": MileageDeductionCalculator,
  "freelance-rate": FreelanceRateCalculator,
  // Business-structure pillar (2026-09-05): S-corp election net saving after payroll cost and
  // the forfeited QBI deduction — the two offsets vendor calculators leave out.
  "s-corp-tax": SCorpTaxCalculator,
  "life-insurance-needs": LifeInsuranceNeedsCalculator,
  "operating-cash-flow": OperatingCashFlowCalculator,
  "cash-conversion-cycle": CashConversionCycleCalculator,
  // Per-spoke override islands (buyer-journey tools)
  "affordability": AffordabilityCalculator,
  "mortgage-extras": MortgageExtrasCalculator,
  // GA4 top-pages pass (2026-08-17): reverse withdrawal solver — the inverse of the forward
  // /investing/withdrawal-calculator/ tool (balance + years → max sustainable monthly withdrawal).
  "withdrawal-reverse": WithdrawalReverseCalculator,
  // Competitor-monitor pass (2026-09-18): stock-position mini-tools — split adjustment, blended
  // average cost basis, single-trade buy/sell profit, and fund NAV per share.
  "stock-split": StockSplitCalculator,
  "stock-average-cost": StockAverageCostCalculator,
  "stock-profit": StockProfitCalculator,
  "nav-calculator": NavCalculator,
};

interface Props {
  calculatorId: string;
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
  mortgageMode?: boolean;
}

export default function CalculatorIsland({ calculatorId, ...rest }: Props) {
  const Cmp = ISLANDS[calculatorId];
  if (!Cmp) {
    return (
      <div style={{ padding: 16, color: "#777", fontStyle: "italic" }}>
        This calculator is coming soon.
      </div>
    );
  }
  return <Cmp {...rest} />;
}
