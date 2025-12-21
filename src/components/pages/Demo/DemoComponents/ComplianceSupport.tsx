import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Rocket, Star } from "lucide-react";

export default function ComplianceSupport() {
    return (
        <section className="w-full py-16 bg-chart-4/10 flex flex-col items-center gap-8 px-6">
            {/* Header */}
            <div className="max-w-xl text-center flex flex-col gap-4">
                <h2 className="text-foreground font-bold text-5xl  leading-tight">
                    Ready to Streamline Your NIS2 Compliance?
                </h2>
                <p className="text-neutral-700 text-base font-medium leading-6">
                    Join leading organizations using CyberNark to manage supplier risk and ensure compliance. Get started today with a personalized demo.
                </p>
            </div>


            {/* Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-4">
                <Button className="bg-chart-6 hover:bg-chart-6/90 text-background flex gap-2">
                    <Play className="h-4 w-4" />
                    Book a Demo
                </Button>


                <Button className="bg-chart-2 hover:bg-chart-2/90 text-background flex gap-2">
                    <Rocket className="h-4 w-4" />
                    Join the Pilot
                </Button>


                <Button className="bg-chart-4 hover:bg-chart-4/90 text-background flex gap-2">
                    <Star className="h-4 w-4" />
                    Try CyberNark
                </Button>
            </div>


            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-7 mt-4">
                {[{
                    value: "500+",
                    label: "Suppliers Assessed",
                },
                {
                    value: "99.9%",
                    label: "Uptime Guarantee",
                },
                {
                    value: "24/7",
                    label: "Support Available",
                }].map((stat, i) => (
                    <Card key={i} className="px-6 py-4 bg-background border  rounded-lg text-center">
                        <CardContent className="p-0 flex flex-col items-center gap-2">
                            <div className="text-stone-950 text-lg font-medium">{stat.value}</div>
                            <div className="text-stone-950 text-base font-medium">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}