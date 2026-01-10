import { AnimatedButton } from "@/lib/animation/AnimatedButton";
import { AnimatedContainer, AnimatedItem } from "@/lib/animation/AnimatedContainer";
import { scaleIn } from "@/lib/animation/animations";
import { NavLink } from "react-router-dom";

export const HeroText = () => {
  return (
    <div className="w-full flex flex-col items-center overflow-hidden justify-center gap-6 sm:gap-8 lg:gap-10 py-6 md:py-12 lg:pt-24 xl:pt-24 px-4 sm:px-6 lg:px-8 relative">
      <AnimatedContainer
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
        className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 max-w-7xl w-full"
      >
        {/* Text Content */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 text-center">
          {/* Main Heading */}
          <h1 className="text-center text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
            <AnimatedItem className="text-primary block">
              Simplify Supplier Risk.
            </AnimatedItem>
            <AnimatedItem className="text-chart-3 block mt-2 sm:mt-4">
              Strengthen Compliance.
            </AnimatedItem>
          </h1>

          {/* Subheading */}
          <AnimatedItem>
            <p className="max-w-4xl text-center text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed px-4">
              A smarter way to manage and document supplier security under NIS2.
            </p>
          </AnimatedItem>

          {/* CTA Buttons */}
          <AnimatedItem className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 mt-2 sm:mt-4">
            <NavLink to={"/"} />
            
            <AnimatedButton
              onClick={() => {
                document.getElementById("hero-video")?.scrollIntoView({ behavior: "smooth" });
              }}
              size="lg"
              className="bg-chart-6 hover:bg-chart/10 text-secondary rounded-xl px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Get Started
            </AnimatedButton>

            <AnimatedButton
              onClick={() => {
                document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              size="lg"
              variant="outline"
              className="border-2 border-chart-6 bg-chart-6/15 hover:bg-chart-6/10 text-foreground rounded-xl px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Learn More
            </AnimatedButton>
          </AnimatedItem>
        </div>

        {/* Hero Video */}
        <AnimatedContainer
          variants={scaleIn}
          delay={0.5}
          className="w-full max-w-7xl mt-6 sm:mt-8 lg:mt-12 xl:mt-16"
        >
          <div
            id="hero-video"
            className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl sm:shadow-3xl border-2 border-border/50 group aspect-video"
          >
           <iframe
  src="https://drive.google.com/file/d/1ezl_U1W1Wefjmlz-BaHlfCN4sW2KjwOK/preview"
  title="Supplier Risk Management Dashboard Demo"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="absolute inset-0 w-full h-full"
/>

            <div className="absolute inset-0 bg-linear-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
          </div>

          <AnimatedItem delay={0.8}>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Watch our platform in action - Real-time supplier risk dashboard demo
            </p>
          </AnimatedItem>
        </AnimatedContainer>
      </AnimatedContainer>
    </div>
  );
};