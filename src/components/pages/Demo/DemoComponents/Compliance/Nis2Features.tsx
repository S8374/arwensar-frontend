import ComplianceCard from "./ComplianceCard";
import image1 from "../../../../../assets/home/image1.png";
import image2 from "../../../../../assets/home/image2.png";
import image3 from "../../../../../assets/home/image3.png";
import image4 from "../../../../../assets/home/image4.png";
import { AnimatedContainer, AnimatedItem, AnimatedSection } from "@/lib/animation/AnimatedContainer";

const features = [
    {
        title: "Supplier Assessments",
        description: "Streamline supplier risk assessments with automated questionnaires and scoring systems tailored to NIS2 requirements.",
        image: image1,
    },
    {
        title: "BIV/CIA Risk Scoring",
        description: "Evaluate suppliers based on Business Impact Value and CIA (Confidentiality, Integrity, Availability) principles.",
        image: image2,
    },
    {
        title: "Vendor & Supplier",
        description: "Centralized view of all your suppliers with real-time risk scores, compliance status, and relationship insights.",
        image: image3,
    },
    {
        title: "Alerts & Monitoring",
        description: "Receive instant notifications about changes in supplier risk profiles, compliance gaps, and critical .",
        image: image4,
    },
    {
        title: "Evidence Management",
        description: "Securely collect, store, and manage compliance documentation and audit evidence from your entire supply chain.",
        image: image2,
    },
    {
        title: "AI Risk Insights",
        description: "Leverage artificial intelligence to identify patterns, predict risks, and get actionable recommendations for mitigation.",
        image: image1,
    },
];

export default function Nis2Features() {
    return (
        <AnimatedContainer className="py-20 lg:py-32 bg-gradient-to-b from-[#E9EFFD] to-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <AnimatedSection className="text-center mb-16">
                    <AnimatedItem>
                        <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                            Everything You Need for{" "}
                            <span className="bg-gradient-to-r from-chart-6 to-primary bg-clip-text text-transparent">
                                NIS2 Compliance
                            </span>
                        </h2>
                    </AnimatedItem>
                    <AnimatedItem delay={0.1}>
                        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                            Comprehensive tools to manage supplier risk, ensure compliance, and protect your organization.
                        </p>
                    </AnimatedItem>
                </AnimatedSection>

                {/* Feature Grid */}
                <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <AnimatedItem
                            key={feature.title}
                            delay={0.1 + index * 0.05}
                            className="h-full"
                        >
                            <ComplianceCard feature={feature} />
                        </AnimatedItem>
                    ))}
                </AnimatedSection>
            </div>
        </AnimatedContainer>
    );
}