import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedContainer, AnimatedItem } from "@/lib/animation/AnimatedContainer";
import { slideInRight, slideInLeft, staggerContainer } from "@/lib/animation/animations";
import { useState } from "react";

interface Feature {
  icon?: React.ReactNode;
  text: string;
}

interface ReusableComponentProps {
  id?: string;
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description1: string;
  description2: string;
  features: Feature[];
  buttonText?: string;
  buttonVariant?: "primary" | "secondary" | "outline";
  buttonSize?: "sm" | "md" | "lg";
  reverse?: boolean;
  className?: string;
  onButtonClick?: () => void;
  showImageFrame?: boolean;
}

export default function ReusableComponent({
  id,
  imageSrc,
  imageAlt = "Feature image",
  title,
  description1,
  description2,
  features,
  buttonText = "See More",
  buttonVariant = "outline",
  buttonSize = "md",
  reverse = false,
  className = "",
  onButtonClick,
  showImageFrame = true
}: ReusableComponentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const buttonStyles = {
    primary: "bg-primary text-white hover:bg-primary/95 border shadow-lg",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 border-gray-600 shadow-lg",
    outline: "bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 shadow-md"
  };

  const buttonSizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base sm:px-6 sm:py-3 font-semibold",
    lg: "px-6 py-4 text-lg sm:px-8 sm:py-4 font-semibold"
  };

  const DefaultCheckIcon = () => (
    <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shrink-0">
      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-chart-6 rounded-sm flex items-center justify-center bg-chart-6/10">
        <ChevronRight className="w-2 h-2 sm:w-3 sm:h-3 text-chart-6" />
      </div>
    </div>
  );

  return (
    <AnimatedContainer
      id={id}
      className={cn(
        "w-full flex flex-col lg:flex-row justify-center mx-auto items-center gap-8 sm:gap-12 lg:gap-16 xl:gap-24 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24",
        reverse ? "lg:flex-row-reverse" : "",
        className
      )}
    >
      {/* Image Section - Flexible */}
      <AnimatedContainer
        variants={reverse ? slideInRight : slideInLeft}
        className={cn(
          "w-full lg:w-1/2 xl:w-2/5 max-w-lg lg:max-w-none",
          showImageFrame && "border-2 shadow-sm rounded-lg overflow-hidden"
        )}
      >
        <motion.div
          whileHover={{ scale: showImageFrame ? 1.02 : 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-full"
        >
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg" />
          )}
          
          {/* Image that shows fully */}
          <div className="relative w-full overflow-hidden rounded-lg">
            <img
              src={imageSrc}
              alt={imageAlt}
              className={cn(
                "w-full h-auto max-h-[600px] object-contain transition-transform duration-700 hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0",
                "mx-auto" // Center the image
              )}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              // Preserve aspect ratio while showing full image
              style={{ 
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
          
          {/* Optional Hover Overlay */}
          {showImageFrame && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
        </motion.div>
      </AnimatedContainer>

      {/* Content Section */}
      <AnimatedContainer
        variants={staggerContainer}
        className="w-full lg:flex-1 max-w-2xl flex flex-col justify-start items-start gap-4 sm:gap-6"
      >
        {/* Title */}
        <AnimatedItem className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-tight lg:leading-tight text-foreground">
          {title}
        </AnimatedItem>

        {/* Description */}
        <AnimatedItem className="flex flex-col gap-3 sm:gap-4">
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
            {description1}
          </p>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
            {description2}
          </p>
        </AnimatedItem>

        {/* Features List */}
        <AnimatedItem className="flex flex-col gap-3 sm:gap-4 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ x: 5 }}
              className="flex justify-start items-start sm:items-center gap-3 sm:gap-4 group transition-transform duration-200"
            >
              {feature.icon || <DefaultCheckIcon />}
              <span className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed sm:leading-7 group-hover:text-foreground transition-colors">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </AnimatedItem>

        {/* Button */}
        <AnimatedItem>
          <motion.button
            onClick={onButtonClick}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border-2 font-semibold transition-all duration-300 mt-4 sm:mt-6",
              buttonStyles[buttonVariant],
              buttonSizes[buttonSize]
            )}
          >
            {buttonText}
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </AnimatedItem>
      </AnimatedContainer>
    </AnimatedContainer>
  );
}