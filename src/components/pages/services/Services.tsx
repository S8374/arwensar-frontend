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
          title="Platform Overview"
          description1="CyberNark is a cloud-native SaaS platform created to address the growing regulatory and
operational challenges related to supplier and third-party cyber risk management.
"
          description2="The platform is specifically designed to support organizations subject to NIS2 requirements, with a
strong focus on supply chain security and accountability.
"
          features={[
            { text: "User behavior analytics" },
            { text: "Firewall configuration monitoring" },

            { text: "Risk scoring dashboard" },

            { text: "Behavioral anomaly detection" },

          ]}
          buttonText="Learn More"
          buttonVariant="primary"
          onButtonClick={() => {
            document.getElementById("section2")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
        <ReusableComponent
          id="section2"

          imageSrc={image2}
          title="Supplier Risk Management"
          description1="Organizations can onboard suppliers through manual entry or bulk import, ensuring a structured
and consistent registration process."
          description2="Suppliers are guided through standardized security assessments and evidence submissions."
          features={[
            { text: "Access request workflow" },

            { text: "Multi-cloud security oversight" },

            { text: "Data integrity monitoring" },

            { text: "Critical asset tracking" },

          ]}
          buttonText="Learn More"
          buttonVariant="primary"
          reverse={true}
          onButtonClick={() => {
            document.getElementById("section3")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
        <ReusableComponent
          id="section3"
          imageSrc={image3}
          title="Risk Scoring and Monitoring"
          description1="CyberNark applies BIV/CIA impact principles to assess the criticality and risk exposure of suppliers."
          description2="Risk levels are continuously monitored and updated based on assessment results, evidence, and
changes over time."
          features={[
            { text: "Real-time compliance alerts" },

            { text: "CIA (Confidentiality, Integrity, Availability) triad assessment" },

            { text: "BIV (Business, Integrity, Availability) risk classification" },
            { text: "Dynamic risk questionnaires" }
          ]}
          buttonText="Learn More"
          buttonVariant="primary"
          onButtonClick={() => {
            document.getElementById("section4")?.scrollIntoView({ behavior: "smooth" });
          }}

        />
        <ReusableComponent
          id="section4"
          imageSrc={image4}
          title="Alerts and Reporting"
          description1="Automated alerts notify vendors of missing information, elevated risks, or expiring certifications."
          description2="Comprehensive dashboards and reports provide audit-ready insight into supplier risk governance."
          features={[
            { text: "NIS2 compliance tracking" },
            { text: "Regulatory requirement mapping" },
            { text: "Compliance tracking and reporting" },
            { text: "Vendor communication portal" }
          ]}
          buttonText="Learn More"
          buttonVariant="primary"
          reverse={true}
          onButtonClick={() => {
            document.getElementById("section5")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>
      <FAQ />
    </div>
  )
}