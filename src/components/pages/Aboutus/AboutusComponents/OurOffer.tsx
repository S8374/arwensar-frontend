// components/OurOffer.tsx
import { CardContent } from "@/components/ui/card";
import { CheckSquare, BarChart3, BellRing, TrendingUp } from "lucide-react";
import { AnimatedContainer, AnimatedItem, AnimatedSection } from "@/lib/animation/AnimatedContainer";
import { AnimatedCard } from "@/lib/animation/AnimatedCard";

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    title: "Vendor Risk Assessment",
    description: "Comprehensive evaluation tools to assess supplier compliance .",
    icon: CheckSquare,
    color: "blue",
    bgColor: "bg-blue-100",
  },
  {
    title: "Real-Time Insights & Reports",
    description: "Dynamic dashboards and detailed analytics at your fingertips.",
    icon: BarChart3,
    color: "purple",
    bgColor: "bg-purple-100",
  },
  {
    title: "Automated Alerts & Notifications",
    description: "Stay informed with intelligent notifications for critical updates.",
    icon: BellRing,
    color: "green",
    bgColor: "bg-green-100",
  },
  {
    title: "Continuous Supplier Improvement",
    description: "Track progress and drive accountability across your vendor network.",
    icon: TrendingUp,
    color: "orange",
    bgColor: "bg-orange-100",
  },
];

export default function OurOffer() {
  return (
    <AnimatedContainer className="w-full py-20 lg:py-32 bg-primary/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <AnimatedItem>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              What We Offer
            </h2>
          </AnimatedItem>
          <AnimatedItem delay={0.1}>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              A complete suite of tools designed to make vendor risk management simple, transparent, and effective.
            </p>
          </AnimatedItem>
        </AnimatedSection>

        {/* Features Flex Wrap */}
        <AnimatedSection className="flex flex-wrap justify-center gap-8 md:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedItem key={feature.title} delay={0.1 + index * 0.1} className="flex-1 max-w-sm">
                <AnimatedCard
                  className="group bg-card border-border rounded-2xl shadow-sm h-full hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6 sm:p-8 flex flex-col items-start gap-6 h-full">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                    </div>

                    {/* Text */}
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </AnimatedCard>
              </AnimatedItem>
            );
          })}
        </AnimatedSection>
      </div>
    </AnimatedContainer>
  );
}
