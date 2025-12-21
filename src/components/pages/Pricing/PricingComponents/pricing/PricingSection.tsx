import { useState } from "react";
import { Button } from "@/components/ui/button";
import PricingCard from "./PricingCard";
import { useBuyNewPriceMutation } from "@/redux/features/supplyer/supplyer.api";

interface Plan {
  name: string;
  price: number;
  gradient: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: 199,
    gradient: "from-blue-200 to-blue-50",
    features: [
      "Up to 25 suppliers",
      "Compliance dashboard",
      "Basic assessments",
      "Standard alerts & reminders",
      "Document uploads (limited)",
      "Email support",
    ],
    buttonText: "Try for free",
  },
  {
    name: "Business",
    price: 399,
    gradient: "from-amber-200 to-amber-50",
    popular: true,
    features: [
      "Up to 100 suppliers",
      "Everything in Starter",
      "Full assessments",
      "Automated alerts & expiry notifications",
      "AI-based risk scoring",
      "Multi-user access (team roles)",
      "Integrations (ERP/CRM)",
      "Priority support",
    ],
    buttonText: "Choose This Plan",
  },
  {
    name: "Enterprise",
    price: 699,
    gradient: "from-indigo-200 to-indigo-50",
    features: [
      "Unlimited suppliers",
      "Everything Business",
      "Customer workflows",
      "API access",
      "Vendor performance analytics",
      "Dedicated integrations",
      "Enterprise-level security/SAML",
    ],
    buttonText: "Choose This Plan",
  },
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [buyPlan] = useBuyNewPriceMutation();

  const handlePlanSelect = async (plan: Plan, annual: boolean) => {
    const calculatedPrice = annual ? Math.round(plan.price * 0.7) : plan.price;

    // Create the plan data object
    const planData = {
      planName: plan.name,
      price: plan.price,
      calculatedPrice: calculatedPrice,
      billingPeriod: annual ? "annual" : "monthly",
      discount: annual ? 30 : 0,
      features: plan.features,
      isPopular: plan.popular || false,
      buttonText: plan.buttonText,
    };

    // Log to console
    console.log("Selected Plan Details:", planData);


    try {
      // If you want to send to API, uncomment this:
       const result = await buyPlan(planData).unwrap();
      console.log("API Response:", result);
    } catch (error) {
      console.error("Error purchasing plan:", error);
    }
  };

  return (
    <section className="py-20 bg-background pt-36">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="text-5xl font-bold text-foreground leading-tight">
          Pricing designed to grow <br />
          <span className="text-foreground">alongside your needs</span>
        </h2>
        <p className="mt-4 text-f max-w-2xl text-muted-foreground mx-auto">
          Specify streamlines the distribution of your design tokens and assets, making life
          easier for both designers and developers in their daily tasks.
        </p>

        {/* Toggle */}
        <div className="mt-10 flex justify-center items-center gap-4">
          <Button
            variant={isAnnual ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAnnual(true)}
            className="rounded-full"
          >
            Annual <span className="text-xs ml-1">(30% OFF)</span>
          </Button>
          <Button
            variant={!isAnnual ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAnnual(false)}
            className="rounded-full"
          >
            Monthly
          </Button>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isAnnual={isAnnual}
              onPlanSelect={handlePlanSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}