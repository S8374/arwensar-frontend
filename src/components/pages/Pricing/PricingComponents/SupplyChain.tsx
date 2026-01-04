import { Button } from "@/components/ui/button";

export default function SupplyChain() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Strengthen Your Supply Chain <br />
            Confidence
          </h1>

          {/* Description */}
          <p className="mt-8 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Gain full visibility into supplier performance, risks, and improvements — all in one platform.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Button size="lg" className="h-12 px-8 text-base bg-chart-6 hover:bg-chart-6/95 font-medium rounded-xl">
              Join Waitlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}