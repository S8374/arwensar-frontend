import { CardContent } from "@/components/ui/card";
import { Rocket, Star, ShieldCheck, Clock, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AnimatedContainer, AnimatedItem, AnimatedSection } from "@/lib/animation/AnimatedContainer";
import { AnimatedButton } from "@/lib/animation/AnimatedButton";
import { AnimatedCard } from "@/lib/animation/AnimatedCard";

export default function ComplianceSupport() {
    const stats = [
        {
            value: "500+",
            label: "Suppliers Assessed",
            icon: Users,
            color: "from-chart-6 "
        },
        {
            value: "99.9%",
            label: "Uptime Guarantee",
            icon: ShieldCheck,
            color: "from-chart-4 to-chart-6"
        },
        {
            value: "24/7",
            label: "Support Available",
            icon: Clock,
            color: "from-chart-2 to-chart-4"
        }
    ];

    return (
        <AnimatedContainer className="w-full py-16 lg:py-20 ">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <AnimatedSection className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
                    <AnimatedItem>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-chart-6/10 rounded-full mb-6">
                            <ShieldCheck className="w-4 h-4 text-chart-6" />
                            <span className="text-sm font-semibold text-chart-6">GET STARTED</span>
                        </div>
                    </AnimatedItem>
                    
                    <AnimatedItem>
                        <h2 className="text-foreground font-bold text-4xl lg:text-5xl leading-tight">
                            Ready to{" "}
                            <span className="">
                                Streamline
                            </span>{" "}
                            Your NIS2 Compliance?
                        </h2>
                    </AnimatedItem>

                    <AnimatedItem delay={0.1}>
                        <p className="text-muted-foreground text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto mt-4">
                            Join leading organizations using CyberNark to manage supplier risk and ensure compliance. Get started today with a personalized demo.
                        </p>
                    </AnimatedItem>
                </AnimatedSection>

                {/* Buttons */}
                <AnimatedItem delay={0.2}>
                    <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
                        <NavLink to={"/signinvendor"}>
                            <AnimatedButton
                                className="h-14 px-8 lg:px-10 text-base  text-background font-semibold rounded-xl shadow-lg hover:shadow-xl group"
                                withHoverAnimation={true}
                                withTapAnimation={true}
                            >
                                <div className="flex items-center gap-3">
                                    <Rocket className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
                                    <span>Join With Us</span>
                                </div>
                            </AnimatedButton>
                        </NavLink>

                        <NavLink to={"/loginvendor"}>
                            <AnimatedButton
                                className="h-14 px-8 lg:px-10 text-base text-foreground bg-background hover:bg-background font-semibold rounded-xl shadow-lg hover:shadow-xl group"
                                withHoverAnimation={true}
                                withTapAnimation={true}
                            >
                                <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    <span>Try CyberNark Now</span>
                                </div>
                            </AnimatedButton>
                        </NavLink>
                    </div>
                </AnimatedItem>

                {/* Stats */}
                <AnimatedItem delay={0.3}>
                    <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 mt-12 lg:mt-16">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <AnimatedCard
                                    key={i}
                                    className="px-8 py-6 bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 min-w-[220px]"
                                    whileHover={{ 
                                        y: -8,
                                        transition: { type: "spring", stiffness: 300 }
                                    }}
                                >
                                    <CardContent className="p-0 flex flex-col items-center gap-4">
                                        {/* Icon with Gradient Background */}
                                        <div className={`w-16 h-16 rounded-2xl  ${stat.color} flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-8 h-8 text-foreground" />
                                        </div>
                                        
                                        {/* Stats Value */}
                                        <div className="text-3xl lg:text-4xl font-bold text-foreground">
                                            {stat.value}
                                        </div>
                                        
                                        {/* Stats Label */}
                                        <div className="text-base font-medium text-foreground group-hover:text-chart-6 transition-colors">
                                            {stat.label}
                                        </div>
                                    </CardContent>
                                </AnimatedCard>
                            );
                        })}
                    </div>
                </AnimatedItem>

                {/* CTA Note */}
                <AnimatedItem delay={0.4}>
                    <div className="mt-12 lg:mt-16 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-chart-6/5 to-primary/5 backdrop-blur-sm rounded-2xl border border-border/50">
                            <div className="w-3 h-3 rounded-full bg-chart-6 animate-pulse" />
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">Free 14-day trial</span> available. No credit card required.
                            </p>
                        </div>
                    </div>
                </AnimatedItem>
            </div>
        </AnimatedContainer>
    );
}