/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CreditCard, Sparkles } from "lucide-react";
import { useCreateCheckoutSessionMutation, useGetCurrentSubscriptionQuery } from "@/redux/features/payment/payment.api";

interface SubscriptionTabProps {
  user: any;
}

export default function SubscriptionTab({ user }: SubscriptionTabProps) {
  const subscription = user?.subscription;
  const plan = subscription?.plan;

  const [createCheckoutSession, { isLoading }] =
    useCreateCheckoutSessionMutation();
  const { data } = useGetCurrentSubscriptionQuery();
  // const { } = useConfirmPaymentMutation();
  // const { } = useGetSessionStatusQuery
  // const { } = useCancelSubscriptionMutation()
  console.log(data)
  /* ---------------- EMPTY STATE ---------------- */
  if (!plan) {
    return (
      <Card className="border-dashed bg-muted/40">
        <CardContent className="p-14 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-2xl font-semibold">No Active Subscription</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You’re currently on the free plan. Upgrade to unlock premium features,
            advanced analytics, and priority support.
          </p>

          <Button size="lg" className="px-8">
            View Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  /* ---------------- PAYMENT HANDLER ---------------- */
  const handleCompletePayment = async () => {
    try {
      const res = await createCheckoutSession({
        planId: plan.id,
        billingCycle: "MONTHLY",
      }).unwrap();

      if (res?.data?.url) {
        window.location.href = res.data.url as string; // ✅ STRIPE REDIRECT
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };


  const trialDaysLeft = subscription?.trialEnd
    ? Math.ceil(
      (new Date(subscription.trialEnd).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;

  /* ---------------- STATUS COLOR ---------------- */
  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-500/15 text-green-700",
    TRIALING: "bg-blue-500/15 text-blue-700",
    PENDING: "bg-yellow-500/20 text-yellow-800",
    CANCELED: "bg-red-500/15 text-red-700",
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-xl border">
        {/* HEADER */}
        <div className="p-8 text-black">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold">{plan.name}</h2>
                <Badge className={`${statusColor[subscription.status]} uppercase`}>
                  {subscription.status}
                </Badge>
              </div>
              <p className="text-black mt-1 text-sm">
                {plan.type || "Professional Plan"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-4xl font-bold">€{plan.price}</p>
              <p className="text-black text-sm">
                per {plan.billingCycle.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <CardContent className="p-8 space-y-6">
          {/* TRIAL */}
          {subscription.status === "TRIALING" && trialDaysLeft > 0 && (
            <div className="flex items-center gap-4 rounded-xl border bg-blue-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">
                  Free Trial Active
                </p>
                <p className="text-sm text-blue-700">
                  {trialDaysLeft} days remaining
                </p>
              </div>
            </div>
          )}

          {/* PENDING PAYMENT */}
          {subscription.status === "PENDING" && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border bg-yellow-50 p-5">
              <div className="flex items-center gap-3 text-yellow-900">
                <CreditCard className="w-5 h-5" />
                <p className="font-medium">
                  Your payment is pending. Please complete it to activate your plan.
                </p>
              </div>

              <Button
                size="lg"
                disabled={isLoading}
                onClick={handleCompletePayment}
                className="bg-yellow-400 text-black hover:bg-yellow-500"
              >
                {isLoading ? "Redirecting..." : "Complete Payment"}
              </Button>
            </div>
          )}

          {/* ACTIVE */}
          {subscription.status === "ACTIVE" && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Your subscription is active and running smoothly.
              </p>

              <div className="flex gap-3">
                <Button variant="outline">Change Plan</Button>
                <Button variant="destructive">Cancel Subscription</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}





