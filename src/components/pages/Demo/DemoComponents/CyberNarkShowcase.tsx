// components/CyberNarkShowcase.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import image1 from "../../../../assets/home/image1.png";
import image2 from "../../../../assets/home/image1.png";
import image3 from "../../../../assets/home/dataevidence.png";
import image4 from "../../../../assets/home/datacenter.png";
const showcases = [
    {
        title: "Vendor & Supplier Dashboard",
        description:
            "Manage everything from one easy dashboard. Vendors can track risks, alerts, assessments, and evidence in real time, while suppliers see exactly what tasks they need to complete. Clear, organized, and built to keep both sides aligned.",
        images: [
            image1,
            image2,
        ],
    },
    {
        title: "BIV/CIA Risk Scoring",
        description:
            "Automatically calculate risk based on Business Impact (BIV) and Confidentiality-Integrity-Availability (CIA) levels. Get clear, color-coded scores that help you instantly understand supplier risk.",
        image: image4,
    },
    {
        title: "Evidence Management",
        description:
            "Streamline your compliance process by uploading, tracking, and managing all your documents in a single location. Keep everything organized with reminders for expirations and ensure secure storage for audits.",
        image: image3,
    },
];

export default function CyberNarkShowcase() {
    return (
        <section className="py-20 lg:py-32 bg-primary/10">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                        Experience <span className="text-foreground">CyberNark</span> in Action
                    </h2>
                    <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                        Explore the platform through real workflows and guided interactions.<br />
                        See how CyberNark simplifies supplier risk management from start to finish.
                    </p>
                </div>

                {/* Vendor Dashboard - Two Images Side by Side */}
                <div className="mb-20 ">
                    <Card className="overflow-hidden border-accent bg-primary/0  ">
                        <CardHeader className="pb-8 ">
                            <h3 className="text-3xl lg:text-4xl font-bold text-foreground text-center lg:text-left">
                                {showcases[0].title}
                            </h3>
                            <p className="mt-4 text-lg text-muted-foreground max-w-4xl mx-auto lg:mx-0 text-center lg:text-left">
                                {showcases[0].description}
                            </p>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8  ">
                            {(showcases[0].images ?? []).map((img, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl overflow-hidden shadow-xl border   transition-shadow duration-300"
                                >
                                    <img
                                        src={img}
                                        alt={`${showcases[0].title} screenshot ${i + 1}`}
                                        width={1200}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Two Cards - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {showcases.slice(1).map((item, index) => (
                        <Card
                            key={index}
                            className="overflow-hidden border shadow-2xl rounded-3xl  hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <CardContent className="p-0">
                                {/* Image */}
                                <div className=" p-4 rounded-lg overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        width={1200}
                                        height={800}
                                        className="w-full h-80 lg:h-96 rounded-lg  object-cover"
                                    />
                                </div>

                                {/* Text */}
                                <div className="p-10">
                                    <h3 className="text-3xl font-bold text-foreground mb-4">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}