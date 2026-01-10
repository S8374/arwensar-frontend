import { type Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideInLeft: Variants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export const slideInRight: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const hoverLift = {
  whileHover: { 
    y: -8,
    transition: { type: "spring", stiffness: 300 }
  }
};

export const hoverScale = {
  whileHover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

export const tapScale = {
  whileTap: { 
    scale: 0.98,
    transition: { type: "spring", stiffness: 400 }
  }
};

// Common animation configurations
export const animationConfig = {
  once: true, // Animate only once
  amount: 0.2, // Trigger when 20% of element is visible
  duration: 0.6,
};