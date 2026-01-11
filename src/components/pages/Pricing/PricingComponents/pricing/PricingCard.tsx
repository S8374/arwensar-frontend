/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Check, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { useCreateCheckoutSessionMutation } from "@/redux/features/payment/payment.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

/* ---------------- TYPES ---------------- */
type PlanFeatures = Record<string, boolean | number | null>;

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  supplierLimit: number | null;
  userLimit: number | null;
  features: PlanFeatures;
  isPopular: boolean;
  trialDays: number;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelect?: () => void;
}

/* ---------------- HELPERS ---------------- */
function formatFeatureLabel(
  key: string,
  value: boolean | number | null
): string | null {
  const title = key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(" Per Month", "");

  if (value === true) return title;
  if (value === null) return `${title}: Unlimited`;
  if (typeof value === "number") return `${title}: ${value}`;
  return null;
}

/* ---------------- COMPONENT ---------------- */
export default function PricingCard({ plan, onSelect }: PricingCardProps) {
  const navigate = useNavigate();
  const price = Number(plan.price);

  /* ---------- USER INFO ---------- */
  const {
    data: userInfo,
    isLoading: isCheckingAuth,
    isError: isAuthError,
  } = useUserInfoQuery(undefined);

  const subscription = userInfo?.data?.subscription;
  const subscriptionStatus = subscription?.status;
  const currentPlanId = subscription?.plan?.id;

  const isAuthenticated = !!userInfo && !isAuthError;
  const isCurrentPlan = currentPlanId === plan.id;
  const isActivePlan = isCurrentPlan && subscriptionStatus === "ACTIVE";

  /* ---------- STRIPE ---------- */
  const [createCheckoutSession, { isLoading: isCreatingSession }] =
    useCreateCheckoutSessionMutation();

  /* ---------- LOCAL STATE ---------- */
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /* ---------- BUTTON LOGIC ---------- */
  let buttonLabel = "Choose Plan";
  let isButtonDisabled = isCheckingAuth || isProcessing || isCreatingSession;

  if (isActivePlan) {
    buttonLabel = "Active";
    isButtonDisabled = true;
  } else if (isCurrentPlan && subscriptionStatus === "PENDING") {
    buttonLabel = "Complete Payment";
  } else if (!isCurrentPlan && subscriptionStatus === "ACTIVE") {
    buttonLabel = "Switch Plan";
  }

  /* ---------- HANDLERS ---------- */
  const handlePlanClick = async () => {
    onSelect?.();

    if (!isAuthenticated) {
      navigate("/loginvendor", {
        state: { from: window.location.pathname },
      });
      return;
    }

    if (isCurrentPlan && subscriptionStatus === "PENDING") {
      setIsModalOpen(true);
      return;
    }

    if (isButtonDisabled) return;

    setIsProcessing(true);

    try {
      const res = await createCheckoutSession({
        planId: plan.id,
        billingCycle: "MONTHLY",
      }).unwrap();

      if (!res.data?.url) throw new Error("Checkout URL missing");

      setCheckoutUrl(String(res.data.url));
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Unable to start checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      setIsModalOpen(false);
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <>
      <Card
        className={cn(
          "relative flex h-full flex-col rounded-2xl border shadow-md transition-all hover:shadow-lg",
          plan.isPopular && "border-primary/50 ring-2 ring-primary/20"
        )}
      >
        {plan.isPopular && (
          <Badge className="absolute right-3 top-3 bg-primary px-3 py-1 text-xs">
            Popular
          </Badge>
        )}

        <CardHeader className="pb-3 pt-5 text-center">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {plan.description}
          </p>
        </CardHeader>

        <CardContent className="flex-1 px-5">
          <div className="mb-5 text-center">
            <span className="text-4xl font-bold">€{price}</span>
            <span className="ml-1 text-sm text-muted-foreground">/month</span>
          </div>

          <ul className="space-y-2">
            {Object.entries(plan.features).map(([key, value]) => {
              const label = formatFeatureLabel(key, value);
              if (!label) return null;

              return (
                <li key={key} className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-4">
          {isActivePlan ? (
            <Button
              disabled
              className="h-11 w-full rounded-xl bg-emerald-600 text-sm text-white"
            >
              <Check className="mr-2 h-4 w-4" />
              Active Plan
            </Button>
          ) : (
            <Button
              onClick={handlePlanClick}
              disabled={isButtonDisabled}
              className={cn(
                "h-11 w-full rounded-xl text-sm",
                plan.isPopular
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "border border-primary  hover:bg-primary"
              )}
            >
              {isCheckingAuth || isProcessing || isCreatingSession ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                buttonLabel
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* ---------- MODAL ---------- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Proceed to Payment</DialogTitle>
            <DialogDescription>
              Subscribe to <strong>{plan.name}</strong> for{" "}
              <strong>€{price}/month</strong>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProceedToCheckout}
              disabled={!checkoutUrl}
            >
              Continue to Stripe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
