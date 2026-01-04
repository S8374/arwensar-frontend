/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useGetPlansQuery } from "@/redux/features/public/public.api";

/* ---------------- TYPES ---------------- */

type PlanType = "starter" | "professional" | "enterprise" | "starter";

type FeatureValue = boolean | number | null;

interface NormalizedFeature {
  name: string;
  starter?: FeatureValue;
  professional?: FeatureValue;
  enterprise?: FeatureValue;
}

/* ---------------- HELPERS ---------------- */

function formatFeatureName(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}

function normalizeFeatures(plans: any[]): NormalizedFeature[] {
  const map = new Map<string, NormalizedFeature>();

  plans.forEach((plan) => {
    const planKey = plan.type.toLowerCase() as PlanType;

    Object.entries(plan.features).forEach(([key, value]) => {
      if (!map.has(key)) {
        map.set(key, { name: formatFeatureName(key) });
      }

      map.get(key)![planKey] = value as FeatureValue;
    });
  });

  return Array.from(map.values());
}

/* 🔥 FIXED: now accepts undefined + enterprise force check */
function renderFeatureValue(
  value: FeatureValue | undefined,
  forceCheck = false
) {
  if (forceCheck) {
    return <Check className="w-5 h-5 text-chart-2 mx-auto" />;
  }

  if (typeof value === "boolean") {
    return value ? (
      <Check className="w-5 h-5 text-chart-2 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-muted-foreground mx-auto" />
    );
  }

  if (typeof value === "number") {
    return <span className="font-medium">{value}</span>;
  }

  return <span>—</span>;
}

/* ---------------- COMPONENT ---------------- */

export default function PricingComparisonTable({
  onPlanSelect,
}: {
  onPlanSelect?: (data: any) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const { data, isLoading } = useGetPlansQuery();
  const plans = data?.data ?? [];

  const starter = plans.find((p) => p.type === "STARTER");
  const professional = plans.find((p) => p.type === "PROFESSIONAL");
  const enterprise = plans.find((p) => p.type === "ENTERPRISE");

  const features = normalizeFeatures(plans);

  const getPrice = (price?: string | number) => Number(price ?? 0);


  const handlePlanSelect = (plan: PlanType, price: number) => {
    setSelectedPlan(plan);

    const payload = {
      plan,
      price,
      billing: "monthly",
    };

    onPlanSelect?.(payload);
    console.log("✅ Selected Plan:", payload);
  };

  if (isLoading) {
    return <p className="text-center py-20">Loading plans...</p>;
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">

        {/* Title */}
        <h2 className="text-center text-4xl font-bold mb-12">
          Pricing Plans
        </h2>

        {/* ---------------- MOBILE ---------------- */}
        <div className="lg:hidden space-y-6">
          {[starter, professional, enterprise].map((plan) => {
            if (!plan) return null;

            const planKey = plan.type.toLowerCase() as PlanType;
            const price = getPrice(plan.price);

            return (
              <div key={plan.id} className="border rounded-2xl p-6 shadow">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>

                <p className="text-3xl font-bold mb-4">
                  €{price}/month
                </p>

                <div className="space-y-2 mb-6">
                  {features.map((f, i) => {
                    const value = f[planKey];
                    if (!value && planKey !== "enterprise") return null;

                    return (
                      <div key={i} className="flex gap-2">
                        <Check className="w-4 h-4 text-chart-2" />
                        <span>{f.name}</span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={() => handlePlanSelect(planKey, price)}
                  className="w-full"
                >
                  Choose Plan
                </Button>
              </div>
            );
          })}
        </div>

        {/* ---------------- DESKTOP ---------------- */}
        <div className="hidden lg:block overflow-x-auto border rounded-2xl shadow">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th className="p-6 text-left">Features</th>
                <th className="p-6 text-center">
                  €{getPrice(starter?.price)}/month
                </th>
                <th className="p-6 text-center">
                  €{getPrice(professional?.price)}/month
                </th>
                <th className="p-6 text-center">
                  €{getPrice(enterprise?.price)}/month
                </th>
              </tr>
            </thead>

            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-t">
                  <td className="p-6 font-medium">{feature.name}</td>

                  <td className="p-6 text-center">
                    {renderFeatureValue(feature.starter)}
                  </td>

                  <td className="p-6 text-center">
                    {renderFeatureValue(feature.professional)}
                  </td>

                  {/* 🔥 Enterprise ALWAYS shows check */}
                  <td className="p-6 text-center">
                    {renderFeatureValue(feature.enterprise, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Info */}
        {selectedPlan && (
          <p className="text-center mt-8 text-green-600 font-medium">
            ✅ {selectedPlan.toUpperCase()} plan selected
          </p>
        )}
      </div>
    </section>
  );
}
