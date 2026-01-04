import curvedGradient from "@/assets/CurvedGradient.png";
import { Button } from "@/components/ui/button";
export default function CallToAction() {
    return (
        <section className="relative py-16 sm:py-20 lg:py-24 bg-background overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0">
                <img
                    src={curvedGradient}
                    alt="Background gradient"
                    className="w-full h-full object-cover"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-background"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mt-12 lg:mt-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                        Ready to Get Started?
                    </h1>

                    <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl  text-muted-foreground max-w-2xl mx-auto">
                        Join our pilot program and get lifetime benefits
                    </p>

                    <Button className="mt-6 sm:mt-8 bg-chart-1 hover:bg-chart-1/95 text-background px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        Get Started Now
                    </Button>
                </div>
            </div>
        </section>
    )
}