import { Button } from "@/components/ui/button";
import { useBuyNewPriceMutation } from "@/redux/features/supplyer/supplyer.api";
import type { PlanData, PlanFeature, PricingTableProps } from "@/validation/pricing";
import { Check, X } from "lucide-react";
import { useState } from "react";

const features: PlanFeature[] = [
  { name: "Number of Users", starter: "25 Pages", pro: "100 Pages", enterprise: "Unlimited" },
  { name: "Users Per Page", starter: "25 supplier", pro: "100 supplier", enterprise: "Unlimited" },
  { name: "Includes essential features to get started", starter: true, pro: true, enterprise: true },
  { name: "More advanced features for increased productivity", starter: false, pro: true, enterprise: true },
  { name: "Designing & Development", starter: false, pro: true, enterprise: true },
  { name: "Customizable options to meet your specific needs", starter: false, pro: false, enterprise: true },
  { name: "Secure data storage", starter: false, pro: false, enterprise: true },
  { name: "Email Support", starter: true, pro: true, enterprise: true },
  { name: "24/7 customer support", starter: false, pro: true, enterprise: true },
  { name: "Analytics and reporting", starter: false, pro: true, enterprise: true },
  { name: "Account Management", starter: true, pro: true, enterprise: true },
];

const planPrices = {
  starter: 199,
  pro: 399,
  enterprise: 699
};

export default function PricingComparisonTable({ onPlanSelect }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [buyPlan, { isLoading }] = useBuyNewPriceMutation();
   console.log(buyPlan)
  const handlePlanSelect = async (planName: "starter" | "pro" | "enterprise") => {
    const price = planPrices[planName];
    const calculatedPrice = isAnnual ? Math.round(price * 0.6) : price;

    // Get features for the selected plan
    const planFeatures = features
      .filter(feature => {
        const featureValue = feature[planName];
        return featureValue === true || (typeof featureValue === "string" && featureValue !== "");
      })
      .map(feature => feature.name);

    const planData: PlanData = {
      planName: planName.charAt(0).toUpperCase() + planName.slice(1),
      price: calculatedPrice,
      billingPeriod: isAnnual ? 'annual' : 'monthly',
      features: planFeatures,
      selectedFeature: `Selected ${planName} plan at $${calculatedPrice}/${isAnnual ? 'year' : 'month'}`
    };

    // Log to console
    console.log("🎯 Selected Plan Details:", {
      plan: planName,
      originalPrice: price,
      calculatedPrice: calculatedPrice,
      billingPeriod: isAnnual ? 'annual' : 'monthly',
      discount: isAnnual ? '40%' : '0%',
      features: planFeatures,
      totalFeatures: planFeatures.length,
      timestamp: new Date().toISOString()
    });

    console.log("📋 Full Plan Data for API:", planData);

    // Update selected plan state
    setSelectedPlan(planName);

    try {
      // Call parent callback if provided
      if (onPlanSelect) {
        onPlanSelect(planData);
      }

      // Uncomment to enable API call
      // const result = await buyPlan(planData).unwrap();
      // console.log("✅ API Response:", result);

    } catch (error) {
      console.error("❌ Error purchasing plan:", error);
    }
  };

  const getPlanPrice = (planName: "starter" | "pro" | "enterprise") => {
    const price = planPrices[planName];
    return isAnnual ? Math.round(price * 0.6) : price;
  };

  const renderFeatureValue = (value: string | boolean, planName: string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-chart-2 mx-auto" />
      ) : (
        <X className="w-5 h-5 sm:w-6 sm:h-6 text-background mx-auto" />
      );
    }
    return (
      // build purpuse add planeName , after build reomve
      <span className="text-foreground font-medium text-xs sm:text-sm">{value} {planName}</span>
    );
  };

  // Mobile Card View Component
  const MobilePlanCard = ({ planName, price }: { planName: "starter" | "pro" | "enterprise", price: number }) => {
    const calculatedPrice = getPlanPrice(planName);
    
    return (
      <div className="bg-background border rounded-2xl shadow-lg p-6 mb-6">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-foreground capitalize mb-2">{planName} {price}  </h3>
          <div className="text-3xl font-bold text-foreground">
            ${calculatedPrice}
            <span className="text-base font-normal text-foreground ml-1">/{isAnnual ? 'year' : 'month'}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-6">
          {features.map((feature, index) => {
            const featureValue = feature[planName];
            const hasFeature = featureValue === true || (typeof featureValue === "string" && featureValue !== "");
            
            if (!hasFeature) return null;

            return (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-chart-2 flex-shrink-0" />
                <span className="text-foreground text-sm">{feature.name}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <Button 
          onClick={() => handlePlanSelect(planName)}
          disabled={isLoading && selectedPlan === planName}
          className="w-full py-3 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-xl transition disabled:opacity-50"
        >
          {isLoading && selectedPlan === planName ? "Processing..." : "Choose This Plan"}
        </Button>
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8 sm:mb-16">
          Plans and features
        </h2>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center bg-background border rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                !isAnnual 
                  ? "bg-foreground text-background" 
                  : "text-foreground hover:text-foreground/80"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isAnnual 
                  ? "bg-foreground text-background" 
                  : "text-foreground hover:text-foreground/80"
              }`}
            >
              Annual <span className="text-xs ml-1">(40% OFF)</span>
            </button>
          </div>
        </div>

        {/* Mobile View - Cards */}
        <div className="block lg:hidden space-y-6">
          <MobilePlanCard planName="starter" price={planPrices.starter} />
          <MobilePlanCard planName="pro" price={planPrices.pro} />
          <MobilePlanCard planName="enterprise" price={planPrices.enterprise} />
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl border shadow-lg">
          <table className="w-full min-w-[800px] table-fixed">
            <thead>
              <tr className="border-b border bg-background">
                <th className="text-left p-6 lg:p-8 font-medium text-foreground w-80">
                  Compare plans 
                  <p className="mt-2 text-sm text-muted-foreground">
                    Choose your workspace plan according to your organizational plan
                  </p>
                </th>

                {/* Starter */}
                <th className="text-center p-6 lg:p-8">
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">
                    ${getPlanPrice("starter")} 
                    <span className="text-base lg:text-lg font-normal text-foreground">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  <Button 
                    onClick={() => handlePlanSelect("starter")}
                    disabled={isLoading && selectedPlan === "starter"}
                    className="mt-4 lg:mt-6 w-full py-3 lg:py-4 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-xl transition disabled:opacity-50 text-sm lg:text-base"
                  >
                    {isLoading && selectedPlan === "starter" ? "Processing..." : "Choose This Plan"}
                  </Button>
                </th>

                {/* Pro */}
                <th className="text-center p-6 lg:p-8">
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">
                    ${getPlanPrice("pro")} 
                    <span className="text-base lg:text-lg font-normal text-foreground">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  <Button 
                    onClick={() => handlePlanSelect("pro")}
                    disabled={isLoading && selectedPlan === "pro"}
                    className="mt-4 lg:mt-6 w-full py-3 lg:py-4 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-xl transition disabled:opacity-50 text-sm lg:text-base"
                  >
                    {isLoading && selectedPlan === "pro" ? "Processing..." : "Choose This Plan"}
                  </Button>
                </th>

                {/* Enterprise */}
                <th className="text-center p-6 lg:p-8">
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">
                    ${getPlanPrice("enterprise")} 
                    <span className="text-base lg:text-lg font-normal text-foreground">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  <Button 
                    onClick={() => handlePlanSelect("enterprise")}
                    disabled={isLoading && selectedPlan === "enterprise"}
                    className="mt-4 lg:mt-6 w-full py-3 lg:py-4 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-xl transition disabled:opacity-50 text-sm lg:text-base"
                  >
                    {isLoading && selectedPlan === "enterprise" ? "Processing..." : "Choose This Plan"}
                  </Button>
                </th>
              </tr>
            </thead>

            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border last:border-0">
                  {/* Feature Name */}
                  <td className="p-6 lg:p-8 text-gray-800 font-medium text-left text-sm lg:text-base">
                    {feature.name}
                  </td>

                  {/* Starter */}
                  <td className="p-6 lg:p-8 text-center">
                    {renderFeatureValue(feature.starter, "starter")}
                  </td>

                  {/* Pro */}
                  <td className="p-6 lg:p-8 text-center">
                    {renderFeatureValue(feature.pro, "pro")}
                  </td>

                  {/* Enterprise */}
                  <td className="p-6 lg:p-8 text-center">
                    {renderFeatureValue(feature.enterprise, "enterprise")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Plan Info */}
        {selectedPlan && (
          <div className="mt-6 sm:mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center text-sm sm:text-base">
              ✅ <strong>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</strong> selected at 
              ${getPlanPrice(selectedPlan as "starter" | "pro" | "enterprise")}/{isAnnual ? 'year' : 'month'}
              <br />
              <span className="text-xs sm:text-sm">Check console for detailed information</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}