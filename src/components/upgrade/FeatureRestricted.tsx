// src/components/upgrade/FeatureRestricted.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FeatureRestrictedProps {
  title: string;
  description: string;
  requiredPlan: 'premium' | 'enterprise';
  feature: string;
  className?: string;
}

export default function FeatureRestricted({
  title,
  description,
  requiredPlan,
  feature,
  className
}: FeatureRestrictedProps) {
  const navigate = useNavigate();

  return (
    <Card className={cn(
      "border-dashed border-2 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50",
      className
    )}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
            {description}
          </p>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
              <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Feature
              </span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/pricing')}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full"
          >
            Upgrade to {requiredPlan}
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Feature ID: {feature}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}