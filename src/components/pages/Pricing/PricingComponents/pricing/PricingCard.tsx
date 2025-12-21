import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Plan {
  name: string;
  price: number;
  gradient: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

interface PricingCardProps {
  plan: Plan;
  isAnnual: boolean;
  onPlanSelect: (plan: Plan, isAnnual: boolean) => void;
}

export default function PricingCard({ plan, isAnnual, onPlanSelect }: PricingCardProps) {
  const handleClick = () => {
    onPlanSelect(plan, isAnnual);
  };

  const calculatedPrice = isAnnual ? Math.round(plan.price * 0.7) : plan.price;

  return (
    <Card
      className={`relative overflow-hidden rounded-3xl shadow-xl border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        plan.popular
          ? "ring-4 ring-chart-6 ring-offset-4 ringe"
          : ""
      }`}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-linear-to-b ${plan.gradient}`} />

      <CardHeader className="relative z-10 pt-12 pb-6 text-left">
        <h3 className="text-2xl font-medium text-foreground">{plan.name}</h3>
      </CardHeader>

      <CardContent className="relative z-10 flex-1 pb-8">
        {/* Price */}
        <div className="mb-8 flex items-end gap-2">
          <span className="text-6xl font-light text-foreground">
            €{calculatedPrice}
          </span>
          <span className="text-xl text-foreground mb-2">Per seat/month</span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-foreground my-8" />

        {/* Features */}
        <ul className="space-y-4">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-chart-6 mt-0.5 shrink-0" />
              <span className="text-foreground text-sm leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* CTA Button */}
      <div className="relative z-10 px-8 pb-10">
        <Button 
          onClick={handleClick}
          className="w-full h-12 bg-chart-6 font-medium rounded-full shadow-lg hover:bg-chart-6/90 transition-all duration-200"
        >
          {plan.buttonText}
        </Button>
      </div>
    </Card>
  );
}