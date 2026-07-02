import AutoLoanCalculator from "./AutoLoanCalculator";
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

// Single React entry point for every calculator island. Astro imports THIS component literally
// (a requirement for client:only) and passes `calculatorId`; the right calculator is picked here,
// on the client. Phase 2 adds the other calculators to the map below.

const ISLANDS: Record<string, React.ComponentType<any>> = {
  "auto-loan": AutoLoanCalculator,
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
  // Pillar 3 (Probate) — hub + 3 spokes reuse the same island with different presets/content.
  "probate": ProbateHubCalculator,
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
