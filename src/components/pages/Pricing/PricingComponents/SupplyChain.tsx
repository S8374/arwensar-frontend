import { NavLink } from "react-router-dom";
import { AnimatedContainer, AnimatedItem, AnimatedSection } from "@/lib/animation/AnimatedContainer";
import { AnimatedButton } from "@/lib/animation/AnimatedButton";
import { ChevronRight, ShieldCheck, Users, TrendingUp } from "lucide-react";

export default function SupplyChain() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Risk Assessment",
      description: "Comprehensive security evaluation"
    },
    {
      icon: Users,
      title: "Vendor Network",
      description: "Manage all suppliers in one place"
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Real-time progress monitoring"
    }
  ];

  return (
    <AnimatedContainer className="py-24 lg:py-32 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-chart-6/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <AnimatedItem>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Strengthen Your{" "}
              <span className=" text-foreground">
                Supply Chain
              </span>{" "}
              Confidence
            </h1>
          </AnimatedItem>

          {/* Description */}
          <AnimatedItem delay={0.1}>
            <p className="mt-6 lg:mt-8 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Gain full visibility into supplier performance, risks, and improvements — all in one platform.
            </p>
          </AnimatedItem>

          {/* Feature Indicators */}
          <AnimatedItem delay={0.2}>
            <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 group cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-chart-6/10 flex items-center justify-center group-hover:bg-chart-6/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5 text-chart-6" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-foreground group-hover:text-chart-6 transition-colors">
                        {feature.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedItem>

          {/* Stats Bar */}
          <AnimatedItem delay={0.3}>
            <div className="mt-8 lg:mt-12 max-w-2xl mx-auto">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-lg">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "98%", label: "Compliance Rate" },
                    { value: "2,500+", label: "Vendors Managed" },
                    { value: "85%", label: "Risk Reduction" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="text-2xl lg:text-3xl font-bold text-chart-6 group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </div>
                      <div className="text-xs lg:text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedItem>

          {/* CTA Button */}
          <AnimatedItem delay={0.4}>
            <div className="mt-10 lg:mt-14">
              <NavLink to={"/loginvendor"}>
                <AnimatedButton
                  size="lg"
                  className="h-14 px-10 text-base bg-gradient-to-r from-chart-6 to-chart-6/90 hover:from-chart-6/95 hover:to-chart-6/85 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl"
                  withHoverAnimation={true}
                  withTapAnimation={true}
                >
                  <div className="flex items-center gap-3">
                    <span>Join With Us</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </AnimatedButton>
              </NavLink>
            </div>
          </AnimatedItem>
        </AnimatedSection>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-1/3 left-10 w-2 h-2 rounded-full bg-chart-6/30 animate-bounce" />
      <div className="absolute bottom-1/3 right-10 w-2 h-2 rounded-full bg-primary/30 animate-bounce delay-500" />
    </AnimatedContainer>
  );
}