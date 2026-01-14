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

          {/* RIGHT IMAGE - Simple Version */}
          <AnimatedItem delay={0.2} className="flex-1 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-full lg:max-w-[500px] xl:max-w-[600px]">
              <div className="relative w-full p-4">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-chart-6/5 to-primary/5 p-2">
                  <img
                    src={image1}
                    alt="CyberNark illustration"
                    className="w-full h-auto max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-chart-6/20 to-primary/20 blur-2xl opacity-50" />
              </div>
            </div>
          </AnimatedItem>
        </div>
      </div>
    </AnimatedContainer>
  );
}