import { Button } from "@/components/ui/button";
import image1 from "../../../../assets/home/image1.png";

export default function AboutHero() {
  return (
    <section className="bg-linear-to-b from-primary/75 via-primary/45 text-foreground pt-32 md:pt-44 lg:pt-52 mb-8 ">
      <div className="container mx-auto px-4 sm:px-40  ">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left  mx-auto lg:mx-0">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight sm:leading-tight lg:leading-tight">
              From onboarding to audits, CyberNark automates every step to keep you NIS2-ready at all times.
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Dictum aliquam porta in condimentum ac integer turpis pulvinar, est scelerisque ligula sem.
            </p>

            <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">
              <Button
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-background text-foreground rounded-lg border-2 border-foreground hover:bg-background/90 transition-all duration-200 min-h-12 sm:min-h-14"
              >
                Suspenses
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <img
                src={image1}
                alt="CyberNark illustration"
                className="w-full h-auto object-contain drop-shadow-2xl"
                style={{
                  maxHeight: '400px',
                  height: 'auto'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}