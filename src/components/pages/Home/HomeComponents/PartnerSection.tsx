/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import bgImage from "@/assets/bgImage.png";
import { useState } from "react";
import { AnimatedContainer, AnimatedItem } from "@/lib/animation/AnimatedContainer";
import { AnimatedButton } from "@/lib/animation/AnimatedButton";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Wesley G. Brown",
    role: "CEO, Engineering",
    company: "TechCorp Inc.",
    quote: "This is a Compliance & Risk Management tool that really makes sense. It saves us time and provides complete visibility into our vendor ecosystem.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "CTO",
    company: "SecureNet Solutions",
    quote: "The automated risk assessments have reduced our compliance time by 70%. The platform is intuitive and the support team is exceptional.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Head of Risk Management",
    company: "Global Finance Corp",
    quote: "Implementing NIS2 compliance was overwhelming until we found this platform. The vendor communication portal has been a game-changer.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w-400&h=400&fit=crop&crop=face"
  }
];

// Client avatars data
const clientAvatars = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop&crop=face",
];

export default function Partnerpage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [, setDirection] = useState(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <AnimatedContainer 
      className="w-full relative py-16 lg:py-60 bg-[#E9EFFD] overflow-hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
    >
      {/* Background Image */}
      <AnimatedItem>
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt="Background gradient"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/10"></div>
        </div>
      </AnimatedItem>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <AnimatedItem>
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
                Lifetime Discount for Pilot Partners
              </h2>
            </AnimatedItem>

            <AnimatedItem>
              <p className="text-base lg:text-lg font-medium text-muted-foreground leading-relaxed">
                Trusted feedback from teams using our Vendor Risk Management platform.
              </p>
            </AnimatedItem>

            <div className="space-y-8">
              <AnimatedItem>
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
                  {/* Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-5 h-5 ${i < 4.9 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-3xl font-semibold text-foreground">4.9/5</div>
                    <div className="text-sm font-normal text-muted-foreground">Rating</div>
                  </div>

                  {/* Vendor Count */}
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-semibold text-foreground bg-primary/10 px-4 py-2 rounded-lg">
                      500+
                    </div>
                    <div className="text-sm font-normal text-muted-foreground">
                      Active vendors
                    </div>
                  </div>
                </div>
              </AnimatedItem>

              <AnimatedItem>
                <div className="text-sm font-normal text-muted-foreground">
                  Clients praise our exceptional work.
                </div>
              </AnimatedItem>

              {/* Client Avatars */}
              <AnimatedItem>
                <div className="flex -space-x-4">
                  {clientAvatars.map((avatar, index) => (
                    <AnimatedItem key={index}>
                      <img
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-background shadow-lg cursor-pointer hover:z-10"
                        src={avatar}
                        alt={`Client ${index + 1}`}
                        onClick={() => setCurrentTestimonial(index % testimonials.length)}
                      />
                    </AnimatedItem>
                  ))}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-semibold text-primary">+25</span>
                  </div>
                </div>
              </AnimatedItem>
            </div>
          </div>

          {/* Right Content - Testimonial */}
          <div className="w-full lg:w-1/2 space-y-7">
            <AnimatedItem>
              <div className="pb-7 border-b-2 border-border">
                <p className="text-xl lg:text-2xl font-medium text-foreground leading-8 italic">
                  "{testimonials[currentTestimonial].quote}"
                </p>
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3.5">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-primary/20"
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                  />
                  <div className="space-y-0.5">
                    <div className="text-sm font-normal text-muted-foreground">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm font-normal text-foreground">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <AnimatedButton
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </AnimatedButton>

                  <AnimatedButton
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </AnimatedButton>
                </div>
              </div>
            </AnimatedItem>

            {/* Indicators */}
            <AnimatedItem>
              <div className="flex justify-center gap-2 pt-4">
                {testimonials.map((_, index) => (
                  <AnimatedButton
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full ${index === currentTestimonial ? "w-8 bg-primary" : "bg-muted hover:bg-primary/50"}`}
                        aria-label={`Go to testimonial ${index + 1}`} children={undefined}                  />
                ))}
              </div>
            </AnimatedItem>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
}
