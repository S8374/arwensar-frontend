import { CardContent, CardHeader } from "@/components/ui/card";
import image1 from "../../../../assets/home/image1.png";
import image2 from "../../../../assets/home/image2.png";
import image3 from "../../../../assets/home/dataevidence.png";
import image4 from "../../../../assets/home/datacenter.png";
import { AnimatedContainer, AnimatedItem, AnimatedSection } from "@/lib/animation/AnimatedContainer";
import { AnimatedCard } from "@/lib/animation/AnimatedCard";

const showcases = [
    {
        title: "Vendor & Supplier Dashboard",
        description: "Manage everything from one easy dashboard. Vendors can track risks, alerts, assessments, and evidence in real time, while suppliers see exactly what tasks they need to complete. Clear, organized, and built to keep both sides aligned.",
        images: [image1, image2],
    },
    {
        title: "BIV/CIA Risk Scoring",
        description: "Automatically calculate risk based on Business Impact (BIV) and Confidentiality-Integrity-Availability (CIA) levels. Get clear, color-coded scores that help you instantly understand supplier risk.",
        image: image4,
    },
    {
        title: "Evidence Management",
        description: "Streamline your compliance process by uploading, tracking, and managing all your documents in a single location. Keep everything organized with reminders for expirations and ensure secure storage for audits.",
        image: image3,
    },
];

export default function CyberNarkShowcase() {
    return (
        <AnimatedContainer className="py-20 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <AnimatedSection className="text-center mb-16">
                    <AnimatedItem>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                            Experience{" "}
                            <span className="bg-gradient-to-r from-chart-6 to-primary bg-clip-text text-transparent">
                                CyberNark
                            </span>{" "}
                            in Action
                        </h2>
                    </AnimatedItem>
                    <AnimatedItem delay={0.1}>
                        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                            Explore the platform through real workflows and guided interactions.<br />
                            See how CyberNark simplifies supplier risk management from start to finish.
                        </p>
                    </AnimatedItem>
                </AnimatedSection>

                {/* Vendor Dashboard - Two Images Side by Side */}
                <AnimatedItem delay={0.2}>
                    <AnimatedCard className="overflow-hidden border-accent bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
                        <CardHeader className="pb-8">
                            <h3 className="text-3xl lg:text-4xl font-bold text-foreground text-center lg:text-left">
                                {showcases[0].title}
                            </h3>
                            <p className="mt-4 text-lg text-muted-foreground max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
                                {showcases[0].description}
                            </p>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {(showcases[0].images ?? []).map((img, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl overflow-hidden shadow-xl border hover:shadow-2xl transition-all duration-500 group"
                                >
                                    <img
                                        src={img}
                                        alt={`${showcases[0].title} screenshot ${i + 1}`}
                                        width={1200}
                                        height={800}
                                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </AnimatedCard>
                </AnimatedItem>

                {/* Bottom Two Cards - Side by Side */}
                <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                    {showcases.slice(1).map((item, index) => (
                        <AnimatedItem
                            key={index}
                            delay={0.3 + index * 0.1}
                            className="h-full"
                        >
                            <AnimatedCard
                                className="overflow-hidden border shadow-xl hover:shadow-2xl rounded-3xl transition-all duration-500"
                                whileHover={{ y: -8 }}
                            >
                                <CardContent className="p-0">
                                    {/* Image */}
                                    <div className="p-4 rounded-lg overflow-hidden group">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            width={1200}
                                            height={800}
                                            className="w-full h-80 lg:h-96 rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="p-10">
                                        <h3 className="text-3xl font-bold text-foreground mb-4">
                                            {item.title}
                                        </h3>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </AnimatedCard>
                        </AnimatedItem>
                    ))}
                </AnimatedSection>
            </div>
        </AnimatedContainer>
    );
}