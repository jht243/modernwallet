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
import MerchantCashAdvanceCalculator from "./MerchantCashAdvanceCalculator";
import InvoiceFactoringCalculator from "./InvoiceFactoringCalculator";
import BusinessLineOfCreditCalculator from "./BusinessLineOfCreditCalculator";
import InterestPerDayCalculator from "./InterestPerDayCalculator";
import TaxableVsTaxDeferredCalculator from "./TaxableVsTaxDeferredCalculator";

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
  // Interest per day — competitor-monitor pass (2026-08-03): daily interest earned/owed on any
  // balance, plus the effective annual yield (APY) once that daily rate compounds daily.
  "interest-per-day": InterestPerDayCalculator,
  // Taxable vs. tax-deferred — competitor-monitor pass (2026-08-05): the dollar gap between a
  // regular taxable account and a tax-deferred 401(k)/IRA for the same return and tax rate.
  "taxable-vs-tax-deferred": TaxableVsTaxDeferredCalculator,
  // Business Financing pillar — MCA, invoice factoring, business line of credit.
  "merchant-cash-advance": MerchantCashAdvanceCalculator,
  "invoice-factoring": InvoiceFactoringCalculator,
  "business-line-of-credit": BusinessLineOfCreditCalculator,
  // Per-spoke override islands (buyer-journey tools)
  "affordability": AffordabilityCalculator,
  "mortgage-extras": MortgageExtrasCalculator,
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
