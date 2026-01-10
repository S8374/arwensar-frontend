import ReusableComponent from "@/components/DynamicComponents/ReuseableComponents";
import { FeaturesSection } from "./HomeComponents/FeaturesSection";
import { HeroText } from "./HomeComponents/HeroText";
import image1 from "@/assets/home/image1.png";
import image2 from "@/assets/home/image2.png";
import CallToAction from "./HomeComponents/CallToAction";
import Partnerpage from "./HomeComponents/PartnerSection";
import { AnimatedContainer } from "@/lib/animation/AnimatedContainer";

export default function Homepage() {
  return (
    <div className="relative overflow-hidden">
      <HeroText />

      {/* Features Section */}
      <AnimatedContainer
        id="features-section"
        className="backdrop-blur-sm lg:backdrop-blur-3xl rounded-t-2xl lg:rounded-t-3xl"
      >
        <FeaturesSection />
      </AnimatedContainer>

      {/* Reusable Components Section */}
      <div className="bg-primary/10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <ReusableComponent
          imageSrc={image1}
          title="NIS2 Supplier Risk Tool"
          description1="Our comprehensive platform helps you manage all aspects of vendor risk management in accordance with NIS2 requirements."
          description2="Get instant insights into your supplier security posture, automate compliance checks, and receive real-time alerts when risks emerge."
          features={[
            { text: "Automated security assessments" },
            { text: "CIA/BIV risk classification" },
            { text: "Compliance tracking and reporting" },
            { text: "Vendor communication portal" }
          ]}
          buttonText="Learn More"
          buttonVariant="outline"
          onButtonClick={() => {
            document.getElementById("features-section2")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
        <ReusableComponent
          id="features-section2"
          imageSrc={image2}
          reverse={true}
          title="Data Security & Compliance Dashboard"
          description1="Show how your platform gives real-time visibility into data protection."
          description2="Get instant insights into your supplier security posture, automate compliance checks, and receive real-time alerts when risks emerge."
          features={[
            { text: "GDPR compliance tools" },
            { text: "API-first architecture" },
            { text: "Webhook integrations" },
            { text: "Session management" }
          ]}
          buttonText="Learn More"
          buttonVariant="outline"
          onButtonClick={() => {
            document.getElementById("get-Start")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>
      <CallToAction />
      <Partnerpage />
    </div>
  );
}