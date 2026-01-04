// components/OurOffer.tsx
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckSquare, 
  BarChart3, 
  BellRing, 
  TrendingUp 
} from "lucide-react";

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
    description: "Comprehensive evaluation tools to assess supplier compliance and performance.",
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
    <section className="w-full py-20 lg:py-32 bg-primary/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            What We Offer
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            A complete suite of tools designed to make vendor risk management simple, transparent, and effective.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group bg-card border-border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-8 flex flex-col items-start gap-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                  </div>

                  {/* Text */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}