// components/pricing/PricingSection.tsx
import PricingCard from "./PricingCard";
import { useGetPlansQuery } from "@/redux/features/public/public.api";

export default function PricingSection() {
  const { data, isLoading, isError } = useGetPlansQuery(undefined);
  const plans = (data?.data || []).filter(
    (plan) => Number(plan.price) > 0 && plan.type !== "FREE"
  );

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded w-96 mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-muted/30 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || plans.length === 0) {
    return (
      <section className="py-32 text-center">
        <p className="text-destructive text-2xl font-medium">
          Failed to load pricing plans. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
          Choose the perfect plan <br />
          for your business
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
          Start with a 30-day free trial. No credit card required.
        </p>

        {/* Pricing Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={{
                ...plan,
                price: String(plan.price) // 👈 FIX HERE
              }}
              onSelect={() => {
                console.log("Selected Plan:", {
                  id: plan.id,
                  name: plan.name,
                  price: plan.price,
                  currency: plan.currency,
                  stripePriceId: plan.stripePriceId,
                  features: plan.features,
                });
              }}
            />
          ))}

        </div>
      </div>
    </section>
  );
}