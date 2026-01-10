import image1 from "../../../../assets/home/image1.png";
import { AnimatedContainer, AnimatedItem } from "@/lib/animation/AnimatedContainer";

export default function DemoHero() {
  return (
    <AnimatedContainer className="bg-background text-foreground pt-8 md:pt-24 mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-14 xl:px-36">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left max-w-4xl mx-auto lg:mx-0">
            <AnimatedItem>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight sm:leading-tight lg:leading-tight">
                From onboarding to audits,{" "}
                <span className="bg-gradient-to-r from-chart-6 to-primary bg-clip-text text-transparent">
                  CyberNark 
                </span>{" "}
               automates  every step to keep you NIS2-ready at all times.
              </h1>
            </AnimatedItem>

            <AnimatedItem delay={0.1}>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Protect your organization with advanced supplier risk monitoring, real-time compliance alerts, and proactive threat mitigation.
              </p>
            </AnimatedItem>
          </div>

          {/* RIGHT IMAGE */}
          <AnimatedItem delay={0.2} className="flex-1 flex justify-center lg:justify-end w-full">
            <div className="relative group w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[440px] xl:max-w-[500px]">
              <div className="absolute -inset-4 bg-gradient-to-r from-chart-6/20 to-primary/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={image1}
                alt="CyberNark illustration"
                className="relative w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </AnimatedItem>
        </div>
      </div>
    </AnimatedContainer>
  );
}