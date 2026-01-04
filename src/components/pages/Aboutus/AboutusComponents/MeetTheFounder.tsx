import sampleImage from "../../../../assets/bgImage.png";
export default function MeetTheFounder() {
  return (
    <section className="py-20 lg:py-32 bg-primary/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-background/85 backdrop-blur-sm rounded-3xl shadow-lg border  overflow-hidden">
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Founder Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-linear-to-r rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>
                  <img
                    src={sampleImage}
                    alt="Founder"
                    className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover shadow-2xl border-8  ring-4"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 right-4 bg-primary/90 text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Founder & CEO
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-8 text-center lg:text-left">
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                  Meet the Founder
                </h2>

                <p className="text-lg sm:text-xl text-foreground leading-relaxed max-w-2xl">
                  I built this platform because I lived the pain of vendor risk management in my previous roles as CISO at two fintech unicorns. 
                  Spreadsheets, endless emails, and blind trust just don’t scale.
                </p>

            

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}