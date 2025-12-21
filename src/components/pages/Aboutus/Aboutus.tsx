// AboutUs.tsx
import AboutHero from "./AboutusComponents/AboutHero";
import MeetTheFounder from "./AboutusComponents/MeetTheFounder";
import OurOffer from "./AboutusComponents/OurOffer";
import Story from "./AboutusComponents/Story";

export default function AboutUs() {
  return (
    <div className="">
      <AboutHero />
    
      <Story />
      <OurOffer/>
      <MeetTheFounder/>
    </div>
  )
}