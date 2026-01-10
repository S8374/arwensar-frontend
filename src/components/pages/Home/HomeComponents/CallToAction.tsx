import curvedGradient from "@/assets/CurvedGradient.png";
import { AnimatedButton } from "@/lib/animation/AnimatedButton";
import { AnimatedContainer, AnimatedItem } from "@/lib/animation/AnimatedContainer";
import { NavLink } from "react-router-dom";

export default function CallToAction() {
    return (
        <section id="get-Start" className="relative py-16 sm:py-20 lg:py-24 bg-background overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0">
                <img
                    src={curvedGradient}
                    alt="Background gradient"
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-background"></div>
            </div>

            {/* Content with animations */}
            <AnimatedContainer 
                className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2
                        }
                    }
                }}
            >
                <div className="mt-8 sm:mt-12 lg:mt-16">
                    <AnimatedItem>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                            Ready to Get Started?
                        </h1>
                    </AnimatedItem>

                    <AnimatedItem>
                        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Join our pilot program and get lifetime benefits
                        </p>
                    </AnimatedItem>

                    <AnimatedItem>
                        <NavLink to={"/loginvendor"}>
                            <AnimatedButton
                                className="mt-6 sm:mt-8 bg-chart-1 hover:bg-chart-1/95 text-background px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Get Started Now
                            </AnimatedButton>
                        </NavLink>
                    </AnimatedItem>
                </div>
            </AnimatedContainer>
        </section>
    )
}