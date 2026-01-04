// src/components/pages/dashboard/vendor/component/OverViewComponent/QuickActions.tsx
import { Button } from "@/components/ui/button";
import { Send, FileText, AlertTriangle, Users, Clock, Shield } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { icon: Send, label: "Send Assessment", color: "bg-blue-500 hover:bg-blue-600" },
    { icon: FileText, label: "Generate Report", color: "bg-emerald-500 hover:bg-emerald-600" },
    { icon: AlertTriangle, label: "High Risk Alert", color: "bg-red-500 hover:bg-red-600" },
    { icon: Users, label: "Supplier Onboarding", color: "bg-purple-500 hover:bg-purple-600" },
    { icon: Clock, label: "Pending Reviews", color: "bg-amber-500 hover:bg-amber-600" },
    { icon: Shield, label: "Compliance Check", color: "bg-indigo-500 hover:bg-indigo-600" },
  ];

  return (
    <div className="bg-gradient-to-r from-background via-blue-50/50 dark:via-blue-950/10 to-background border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        <span className="text-xs text-muted-foreground">Click to perform action</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              className={`${action.color} text-white flex flex-col items-center justify-center h-20 gap-2 transition-all hover:scale-105`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}