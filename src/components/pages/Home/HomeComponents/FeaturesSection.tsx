import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import image1 from "@/assets/home/image1.png";
import image2 from "@/assets/home/image2.png";
import image3 from "@/assets/home/image3.png";

export const FeaturesSection = () => {
    const features = [
        {
            title: "Suppliers",
            description: "Complete overview of your supplier ecosystem with real-time status tracking",
            image: image1,
        },
        {
            title: "Assess Risk",
            description: "Automated risk scoring based on security posture and compliance status",
            image: image2,
        },
        {
            title: "Realtime Alerts",
            description: "Instant notifications when vendor risk levels change or issues arise",
            image: image3,
        },
    ];
    
    return (
        <section className="w-full py-16 sm:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 bg-[#E9EFFD]">
            <div className="container mx-auto max-w-7xl">
                {/* Heading */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                        NIS2 Supplier Risk Management
                    </h2>
                    <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                        CyberNark secures every link in your supply chain with clarity, automation, and trust
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className="group relative overflow-hidden border bg-background backdrop-blur-sm 
                         transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 
                         hover:border"
                        >
                            {/* Subtle glow background */}
                            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute -top-16 -left-16 sm:-top-32 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-background blur-2xl sm:blur-3xl" />
                                <div className="absolute -bottom-16 -right-16 sm:-bottom-32 sm:-right-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-background blur-2xl sm:blur-3xl" />
                            </div>

                            <CardHeader className="pb-3 sm:pb-4">
                                <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg sm:rounded-xl border bg-muted/50">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3 sm:space-y-4">
                                <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
                                    {feature.title}
                                </CardTitle>
                                <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};