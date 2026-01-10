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
    <AnimatedCard className="group relative overflow-hidden border bg-background backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl hover:border">
      {/* Subtle glow background */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-16 -left-16 sm:-top-32 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-background blur-2xl sm:blur-3xl" />
        <div className="absolute -bottom-16 -right-16 sm:-bottom-32 sm:-right-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-background blur-2xl sm:blur-3xl" />
      </div>

      <CardHeader className="pb-3 sm:pb-4">
        <motion.div
          className="relative aspect-4/3 w-full overflow-hidden rounded-lg sm:rounded-xl border bg-muted/50"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </AnimatedCard>
  );
}