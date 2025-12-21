import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import bgImage from "@/assets/bgImage.png";

export default function Partnerpage() {
    return (
        <section className="w-full relative py-16 lg:py-60 bg-[#E9EFFD] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={bgImage}
                    alt="Background gradient"
                    className="w-full h-full object-cover"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-background/10"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-6">
                            {/* Title */}
                            <h2 className="text-3xl lg:text-4xl font-semibold  text-foreground leading-tight">
                                Lifetime Discount for Pilot Partners
                            </h2>

                            {/* Description */}
                            <p className="text-base lg:text-lg font-medium  text-muted-foreground leading-relaxed">
                                Trusted feedback from teams using our Vendor Risk Management platform.
                            </p>

                            {/* Stats Section */}
                            <div className="space-y-8">
                                {/* Rating and Vendor Count */}
                                <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                                    {/* Rating */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-primary rounded-sm"></div>
                                        <div className="text-3xl font-semibold  text-foreground">
                                            4.9/5 Rating
                                        </div>
                                    </div>

                                    {/* Vendor Count */}
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl font-semibold  text-foreground">
                                            500+
                                        </div>
                                        <div className="text-sm font-normal  text-muted-foreground">
                                            Active vendors
                                        </div>
                                    </div>
                                </div>

                                {/* Client Praise */}
                                <div className="text-sm font-normal  text-muted-foreground">
                                    Clients praise our exceptional work.
                                </div>

                                {/* Client Avatars */}
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <img
                                            key={item}
                                            className="w-16 h-16 rounded-full border-4 border-background shadow-lg"
                                            src="https://placehold.co/66x66"
                                            alt={`Client ${item}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Testimonial */}
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-7">
                            {/* Testimonial Quote */}
                            <div className="pb-7 border-b-2 border-border">
                                <p className="text-xl lg:text-2xl font-medium  text-foreground leading-8">
                                    "This is a Compliance & Risk Management tool that really makes sense. It saves us time and provides complete visibility into our vendor ecosystem."
                                </p>
                            </div>

                            {/* Testimonial Author */}
                            <div className="flex justify-between items-center">
                                {/* Author Info */}
                                <div className="flex items-center gap-3.5">
                                    <img
                                        className="w-10 h-10 rounded-full"
                                        src="https://placehold.co/40x40"
                                        alt="Wesley G. Brown"
                                    />
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-normal  text-muted-foreground">
                                            Wesley G. Brown
                                        </div>
                                        <div className="text-sm font-normal  text-foreground">
                                            CEO, Engineering
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Arrows */}
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="icon"
                                        className="w-8 h-8 rounded-full shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon"
                                        className="w-8 h-8 rounded-full shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}