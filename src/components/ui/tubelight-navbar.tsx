import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";

interface NavBarProps {
  navItems: {
    href: string;
    label: string;
  }[];
  className?: string;
}

export function NavBar({ navItems, className }: NavBarProps) {
  const { pathname } = useLocation();

  return (
    <div className={cn("relative flex bg-primary p-1 rounded-2xl", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "relative z-10 flex items-center justify-center px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-2xl",
              isActive
                ? "text-foreground"
                : "text-foreground hover:text-foreground/80"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tubelight"
                className="absolute inset-0 bg-primary-foreground rounded-2xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-20">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}