import PricingComparisonTable from "./PricingComponents/PlansFeatures/PricingComparisonTable";
import PricingSection from "./PricingComponents/pricing/PricingSection";
import SupplyChain from "./PricingComponents/SupplyChain";


export default function Pricing() {

    return (
        <div>
              <PricingSection />
              <PricingComparisonTable/>
            <SupplyChain/>
        </div>
    );
}