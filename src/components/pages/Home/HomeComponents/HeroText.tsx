import { Button } from "@/components/ui/button";
import imageHero from "@/assets/home/image1.png"

export const HeroText = () => {
  return (
    <div className="w-full   flex flex-col items-center  overflow-hidden justify-center gap-6 sm:gap-8 lg:gap-10 py-6 md:py-12 lg:pt-24 xl:pt-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Main Content */}
      <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 max-w-7xl w-full">
        {/* Text Content */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 text-center">
          {/* Main Heading */}
          <h1 className="text-center text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight sm:leading-tight md:leading-tight tracking-tight">
            <span className="text-primary block">Simplify Supplier Risk.</span>
            <span className="text-chart-3 block mt-2 sm:mt-4">
              Strengthen Compliance.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-4xl text-center text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed sm:leading-relaxed px-4">
            A smarter way to manage and document supplier security under NIS2.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 mt-2 sm:mt-4">
            <Button
              size="lg"
              className="bg-chart-6 hover:bg-chart/10 text-secondary rounded-xl px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Get Started
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-chart-6 bg-chart-6/15 hover:bg-chart-6/10  text-foreground  rounded-xl px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image with Professional Styling */}
        <div className="w-full max-w-7xl mt-6 sm:mt-8 lg:mt-12 xl:mt-16">
          <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 ">
            <img
              src={imageHero}
              alt="Cyber Security Dashboard showing supplier risk management interface"
              className="w-full h-auto object-cover"
            />
            
            {/* Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-linear-to-t from-background/10 via-transparent to-transparent pointer-events-none" />
          </div>
          
        </div>
      </div>
    </div>
  );
};