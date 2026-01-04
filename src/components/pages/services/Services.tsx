import ReusableComponent from "@/components/DynamicComponents/ReuseableComponents";
import ServicesHero from "./ServicesComponents/ServicesHero";
import ServicesText from "./ServicesComponents/ServicesText";
import image1 from "@/assets/home/image1.png";
import image2 from "@/assets/home/image2.png";
import image3 from "@/assets/home/image3.png";
import image4 from "@/assets/home/image4.png";
import FAQ from "./ServicesComponents/Faq";
export default function Services() {
  return (
    <div className=" -mt-24 md:-mt-36">
      <ServicesHero />
      <ServicesText />
      <div>
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
          buttonVariant="primary"
        />
        <ReusableComponent
          imageSrc={image2}
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
          buttonVariant="primary"
          reverse={true}
        />
        <ReusableComponent
          imageSrc={image3}
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
          buttonVariant="primary"
        />
        <ReusableComponent
          imageSrc={image4}
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
          buttonVariant="primary"
          reverse={true}
        />
      </div>
      <FAQ />
    </div>
  )
}