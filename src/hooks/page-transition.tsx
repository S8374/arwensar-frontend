// src/components/ui/page-transition.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousPath, setPreviousPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== previousPath) {
      setIsAnimating(true);
      setPreviousPath(location.pathname);
      
      // Reset animation state after transition
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, previousPath]);

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnimating ? 0.7 : 1, 
        y: 0,
        scale: isAnimating ? 0.98 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.3 },
        scale: { duration: 0.4 }
      }}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}

// Optional: Loading spinner for route transitions
export function RouteLoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 h-1 z-[9999] overflow-hidden"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-primary/60 to-primary"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}