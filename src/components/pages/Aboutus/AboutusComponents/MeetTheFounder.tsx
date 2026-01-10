import sampleImage from "../../../../assets/bgImage.png";
import { AnimatedContainer, AnimatedItem, AnimatedSection } from "@/lib/animation/AnimatedContainer";
import { AnimatedCard } from "@/lib/animation/AnimatedCard";

export default function MeetTheFounder() {
  return (
    <AnimatedContainer className="py-20 lg:py-32 bg-gradient-to-b from-primary/20 to-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <AnimatedCard
          className="bg-background/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 overflow-hidden hover:shadow-3xl transition-all duration-500"
          whileHover={{ y: -5 }}
        >
          <div className="p-8 sm:p-12 lg:p-16">
            <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Founder Image */}
              <AnimatedItem delay={0.1}>
                <div className="flex justify-center lg:justify-end">
                  <div className="relative group">
                    {/* Animated background gradient using CSS */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-chart-6/40 to-primary/40 rounded-full blur-xl opacity-70 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-pulse" />
                    
                    {/* Additional rotating glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-chart-6/20 via-primary/10 to-chart-6/20 rounded-full opacity-60 group-hover:animate-spin-slow" />

                    {/* Main Image */}
                    <div className="relative">
                      <img
                        src={sampleImage}
                        alt="Founder"
                        className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover shadow-2xl border-8 border-background ring-4 ring-chart-6/30 group-hover:scale-105 group-hover:ring-chart-6/50 transition-all duration-500"
                        loading="lazy"
                      />
                      
                      {/* CEO Badge */}
                      <div className="absolute bottom-4 right-4 bg-gradient-to-r from-chart-6 to-primary text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg group-hover:scale-110 transition-transform duration-300">
                        Founder & CEO
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedItem>

              {/* Content */}
              <div className="space-y-8 text-center lg:text-left">
                <AnimatedItem delay={0.2}>
                  <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                    Meet the Founder
                  </h2>
                </AnimatedItem>

                <AnimatedItem delay={0.3}>
                  <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed max-w-2xl">
                    I built this platform because I lived the pain of vendor risk management in my previous roles as CISO at two fintech unicorns. 
                    Spreadsheets, endless emails, and blind trust just don't scale.
                  </p>
                </AnimatedItem>

                <AnimatedItem delay={0.4}>
                  <div className="pt-4">
                    <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Experience Badge */}
                      <div className="bg-primary/10 border border-primary/20 rounded-xl px-6 py-4 text-center group hover:bg-primary/15 transition-colors duration-300">
                        <div className="text-2xl font-bold text-chart-6">10+</div>
                        <div className="text-sm text-muted-foreground">Years in Cybersecurity</div>
                      </div>
                      
                      {/* Companies Badge */}
                      <div className="bg-chart-6/10 border border-chart-6/20 rounded-xl px-6 py-4 text-center group hover:bg-chart-6/15 transition-colors duration-300">
                        <div className="text-2xl font-bold text-primary">2</div>
                        <div className="text-sm text-muted-foreground">Fintech Unicorns</div>
                      </div>
                    </div>
                  </div>
                </AnimatedItem>

                <AnimatedItem delay={0.5}>
                  <blockquote className="border-l-4 border-chart-6 pl-6 py-2 italic text-foreground/80 text-lg">
                    "Our mission is to make supplier risk management as transparent and efficient as it should be."
                  </blockquote>
                </AnimatedItem>
              </div>
            </AnimatedSection>
          </div>
        </AnimatedCard>
      </div>
    </AnimatedContainer>
  );
}