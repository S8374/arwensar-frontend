// src/components/common/GoBackAndHomeButtons.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface GoBackAndHomeButtonsProps {
  /** Label for the back button */
  backLabel?: string;
  /** Where to navigate when clicking "Back" (default: previous page) */
  backTo?: string | number;
  /** Label for the home button */
  homeLabel?: string;
  /** Where to navigate when clicking "Home" (default: "/") */
  homeTo?: string;
  /** Variant for back button */
  backVariant?: "default" | "secondary" | "ghost" | "outline" | "link" | "destructive";
  /** Variant for home button */
  homeVariant?: "default" | "secondary" | "ghost" | "outline" | "link" | "destructive";
  /** Show only icons (great for headers) */
  iconOnly?: boolean;
  /** Extra className for the container */
  className?: string;
}

export default function GoBackAndHomeButtons({
  backLabel = "Back",
  backTo = -1,
  homeLabel = "Home",
  homeTo = "/",
  backVariant = "ghost",
  iconOnly = false,
  className,
}: GoBackAndHomeButtonsProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof backTo === "string") {
      navigate(backTo);
    } else {
      navigate(backTo); // -1, -2, etc.
    }
  };

  const handleHome = () => {
    navigate(homeTo);
  };

  return (
    <div className={cn("flex items-center text-foreground gap-3 py-3", className)}>
      {/* Back Button */}
      <Button
        variant={backVariant}
        size={iconOnly ? "icon" : "sm"}
        onClick={handleBack}
        className={cn(
          "flex items-center gap-2",
          !iconOnly && backVariant === "ghost" && "-ml-2" // better alignment for ghost
        )}
        aria-label={iconOnly ? "Go back" : undefined}
      >
        <ArrowLeft className={cn("h-4 w-4", iconOnly && "h-5 w-5")} />
        {!iconOnly && backLabel}
      </Button>

      {/* Home Button */}
      <Button
        variant={backVariant}
        size={iconOnly ? "icon" : "sm"}
        onClick={handleHome}
        className="flex items-center gap-2"
        aria-label={iconOnly ? "Go to home" : undefined}
      >
        <Home className={cn("h-4 w-4", iconOnly && "h-5 w-5")} />
        {!iconOnly && homeLabel}
      </Button>
    </div>
  );
}