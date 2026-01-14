/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hoverLift } from "./animations";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  whileHover?: any;
  whileTap?: any;
}

export function AnimatedCard({ 
  children, 
  className = "",
  whileHover = hoverLift.whileHover,
  whileTap
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  );
}

// Pre-configured animated card for features
interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
}

export function FeatureCard({ title, description, image, imageAlt = title }: FeatureCardProps) {
  return (
    <AnimatedCard 
      className="group relative overflow-hidden border bg-background/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/50 h-full flex flex-col"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="pb-4 relative overflow-hidden">
        <motion.div
          className="relative aspect-video w-full overflow-hidden  border bg-muted/30"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            loading="lazy" // Improve performance
          />
        </motion.div>
      </CardHeader>

      <CardContent className="flex-grow space-y-3 sm:space-y-4 px-6 pb-6">
        <CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </AnimatedCard>
  );
}