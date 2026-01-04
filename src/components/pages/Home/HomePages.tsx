import ReusableComponent from "@/components/DynamicComponents/ReuseableComponents";
import { FeaturesSection } from "./HomeComponents/FeaturesSection";
import { HeroText } from "./HomeComponents/HeroText";
import image1 from "@/assets/home/image1.png";
import image2 from "@/assets/home/image2.png";
import CallToAction from "./HomeComponents/CallToAction";
import Partnerpage from "./HomeComponents/PartnerSection";






export default function Homepage() {
  return (
    <div className="relative ">

      <HeroText />


      {/* Features Section positioned over the hero image */}
      <div className=" lg:-mt-[500px] md:-mt-72 sm:-mt-40 -mt-32  backdrop-blur-sm lg:backdrop-blur-3xl rounded-t-2xl lg:rounded-t-3xl">
        <FeaturesSection />
      </div>

      {/* Reusable Components Section */}
      <div className="bg-primary/10 py-12  sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
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
        />
        <ReusableComponent
          imageSrc={image2}
          reverse={true}
          title="Data Security & Compliance Dashboard"
          description1="Show how your platform gives real-time visibility into data protection."
          description2="Get instant insights into your supplier security posture, automate compliance checks, and receive real-time alerts when risks emerge."
          features={[
            { text: "Automated security assessments" },
            { text: "CIA/BIV risk classification" },
            { text: "Compliance tracking and reporting" },
            { text: "Vendor communication portal" }
          ]}
          buttonText="Learn More"
          buttonVariant="outline"
        />
      </div>
      <CallToAction />
      <Partnerpage />
    </div>
  );
}