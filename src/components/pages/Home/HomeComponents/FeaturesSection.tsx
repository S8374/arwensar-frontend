import image1 from "@/assets/home/image1.png";
import image2 from "@/assets/home/image2.png";
import image3 from "@/assets/home/image3.png";
import { FeatureCard } from "@/lib/animation/AnimatedCard";
import { AnimatedContainer, AnimatedItem } from "@/lib/animation/AnimatedContainer";

export const FeaturesSection = () => {
  const features = [
    {
      title: "Vendor",
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
        <AnimatedContainer className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            NIS2 Supplier Risk Management
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            CyberNark secures every link in your supply chain with clarity, automation, and trust
          </p>
        </AnimatedContainer>

        {/* Feature Cards */}
        <AnimatedContainer
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {features.map((feature) => (
            <AnimatedItem key={feature.title}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                image={feature.image}
              />
            </AnimatedItem>
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
};