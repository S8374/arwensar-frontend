import Nis2Features from "./DemoComponents/Compliance/Nis2Features";
import ComplianceSupport from "./DemoComponents/ComplianceSupport";
import ContactForm from "./DemoComponents/ContactForm";
import CyberNarkShowcase from "./DemoComponents/CyberNarkShowcase";
import DemoHero from "./DemoComponents/DemoHero";
import HowItWorks from "./DemoComponents/HowItWorkes";

export default function Demo() {
return(
    <div>
        <DemoHero/>
        <Nis2Features/>
        <CyberNarkShowcase/>
        <HowItWorks/>
        <ComplianceSupport/>
        <ContactForm/>
    </div>
)
}