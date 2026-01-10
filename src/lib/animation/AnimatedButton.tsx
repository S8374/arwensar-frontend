/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  withHoverAnimation?: boolean;
  withTapAnimation?: boolean;
  size?: any;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function AnimatedButton({ 
  children, 
  withHoverAnimation = true,
  withTapAnimation = true,
  size = "default",
  variant = "default",
  className = "",
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={withHoverAnimation ? { scale: 1.05 } : undefined}
      whileTap={withTapAnimation ? { scale: 0.98 } : undefined}
    >
      <Button 
        size={size}
        variant={variant}
        className={className}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}