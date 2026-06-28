import AutoLoanCalculator from "./AutoLoanCalculator";
import RentalCalculator from "./RentalCalculator";
import RetirementCalculator from "./RetirementCalculator";
import InvestmentCalculator from "./InvestmentCalculator";
import PortfolioCalculator from "./PortfolioCalculator";
import NetWorthCalculator from "./NetWorthCalculator";
import AffordabilityCalculator from "./AffordabilityCalculator";
import MortgageExtrasCalculator from "./MortgageExtrasCalculator";
import BudgetCalculator from "./BudgetCalculator";

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
