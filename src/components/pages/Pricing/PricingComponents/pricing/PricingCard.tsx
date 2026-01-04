// components/pricing/PricingCard.tsx

import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ---------------- TYPES ---------------- */

type PlanFeatures = Record<string, boolean | number | null>;

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  supplierLimit: number | null;
  userLimit: number | null;
  features: PlanFeatures;
  isPopular: boolean;
  trialDays: number;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelect: () => void;
}

/* ---------------- HELPERS ---------------- */

function formatFeatureLabel(key: string, value: boolean | number) {
  const label = key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  if (typeof value === "number") {
    return `${label}: ${value}`;
  }

  return label;
}

/* ---------------- COMPONENT ---------------- */

export default function PricingCard({ plan, onSelect }: PricingCardProps) {
  const price = Number(plan.price);

  return (
    <Card
      className={`relative overflow-hidden rounded-3xl shadow-xl border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 flex flex-col h-full ${
        plan.isPopular ? "ring-4 ring-primary ring-offset-4" : ""
      }`}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b opacity-60 ${
          plan.name === "Starter"
            ? "from-blue-100 to-blue-50 dark:from-blue-900/40"
            : plan.name === "Business"
            ? "from-amber-100 to-amber-50 dark:from-amber-900/40"
            : "from-purple-100 to-purple-50 dark:from-purple-900/40"
        }`}
      />

      {/* Popular Badge */}
      {plan.isPopular && (
        <Badge className="absolute top-4 right-4 z-20">
          Most Popular
        </Badge>
      )}

      {/* Header */}
      <CardHeader className="relative z-10 pt-12 pb-6 text-center">
        <h3 className="text-3xl font-bold">{plan.name}</h3>
        <p className="mt-4 text-muted-foreground text-sm max-w-xs mx-auto">
          {plan.description}
        </p>
      </CardHeader>

      {/* Content */}
      <CardContent className="relative z-10 flex-1 pb-8">
        {/* Price */}
        <div className="text-center mb-10">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-extralight">€{price}</span>
            <span className="text-xl text-muted-foreground">/month</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Billed monthly
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-4">
          {Object.entries(plan.features).map(([key, value]) => {
            if (!value) return null;

            return (
              <li key={key} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed">
                  {formatFeatureLabel(key, value)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>

      {/* Footer */}
      <CardFooter className="relative z-10 pt-6 pb-12 px-8">
        <Button
          onClick={onSelect}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          variant={plan.isPopular ? "default" : "outline"}
        >
          {plan.name === "Starter"
            ? "Start Free Trial"
            : "Choose This Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
