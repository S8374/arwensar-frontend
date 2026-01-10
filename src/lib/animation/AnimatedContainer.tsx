import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import type { Variants } from "framer-motion";

interface AnimatedContainerProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  threshold?: number;
  once?: boolean;
  delay?: number;
  id?: string;
}

export function AnimatedContainer({
  children,
  variants,
  className = "",
  threshold = 0.2,
  once = true,
  delay = 0,
  id
}: AnimatedContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Common animated components
export function AnimatedSection({ children, ...props }: AnimatedContainerProps) {
  return (
    <AnimatedContainer
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
          }
        }
      }}
      {...props}
    >
      {children}
    </AnimatedContainer>
  );
}

export function AnimatedItem({ children, ...props }: Omit<AnimatedContainerProps, 'threshold' | 'once'>) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 100 }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}