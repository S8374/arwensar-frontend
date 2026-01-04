/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Settings
} from "lucide-react";

interface SubscriptionTabProps {
  user: any;
}

export default function SubscriptionTab({ user }: SubscriptionTabProps) {
  const subscription = user?.subscription;
  const plan = subscription?.plan;

  if (!plan) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-12 text-center space-y-4">
          <h2 className="text-2xl font-semibold">No Active Subscription</h2>
          <p className="text-muted-foreground">
            Upgrade to unlock premium features and insights.
          </p>
          <Button size="lg">View Plans</Button>
        </CardContent>
      </Card>
    );
  }

  const trialDaysLeft = subscription?.trialEnd
    ? Math.ceil(
      (new Date(subscription.trialEnd).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;

  const features = plan?.features
    ? Object.entries(plan.features).map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, " $1"),
      included: Boolean(value),
    }))
    : [];

  return (
    <div className="space-y-6">
      {/* Main Plan Card */}
      <Card className="overflow-hidden border shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-br from-chart-6 to-chart-6/80 text-white p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">{plan.name}</h2>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {subscription.status}
                </Badge>
              </div>
              <p className="text-white/80 mt-1">
                {plan.type || "Professional Plan"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-4xl font-bold">€{plan.price}</p>
              <p className="text-white/80">
                per {plan.billingCycle.toLowerCase()}
              </p>
            </div>
          </div>

          {subscription.status === "TRIALING" && trialDaysLeft > 0 && (
            <div className="mt-6 flex items-center gap-3 bg-white/15 rounded-xl p-4">
              <Clock className="w-5 h-5" />
              <div>
                <p className="font-semibold">Free Trial Active</p>
                <p className="text-sm text-white/80">
                  {trialDaysLeft} days remaining
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-8 space-y-8">
          {/* Features */}
          {features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Included Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-lg bg-muted/40"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium capitalize">
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 md:justify-end">
            {subscription.status === "TRIALING" && (
              <Button variant="outline" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            )}
            <Button
              size="lg"
              className="bg-chart-6 hover:bg-chart-6/90"
              onClick={() => window.location.href = '/dashboard/pricing'}
            >
              <Settings className="w-4 h-4 mr-2" />
              {subscription ? 'Change Plan' : 'Choose Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
