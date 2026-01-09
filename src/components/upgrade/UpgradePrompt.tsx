// src/components/upgrade/UpgradePrompt.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpgradePromptProps {
  title: string;
  description: string;
  currentPlan: string;
  requiredPlan: string;
  feature: string;
}

export default function UpgradePrompt({
  title,
  description,
  currentPlan,
  requiredPlan,
}: UpgradePromptProps) {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              <span className="font-medium">{currentPlan}</span>
              <ArrowRight className="w-4 h-4 inline mx-2" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {requiredPlan}
              </span>
            </div>
            <Button
              onClick={() => navigate('/pricing')}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 whitespace-nowrap"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}