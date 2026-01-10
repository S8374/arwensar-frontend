/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Check } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
function formatFeatureLabel(key: string, value: boolean | number) {
  const label = key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
  return typeof value === "number" ? `${label}: ${value}` : label;
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

  /* ---------- STRIPE ---------- */
  const [
    createCheckoutSession,
    { isLoading: isCreatingSession },
  ] = useCreateCheckoutSessionMutation();

  /* ---------- LOCAL STATE ---------- */
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /* ---------- BUTTON LOGIC ---------- */
  let buttonLabel = "Choose This Plan";
  let buttonDisabled = isCheckingAuth || isProcessing || isCreatingSession;

  if (isCurrentPlan && subscriptionStatus === "ACTIVE") {
    buttonLabel = "Active Plan";
    buttonDisabled = true;
  }

  if (isCurrentPlan && subscriptionStatus === "PENDING") {
    buttonLabel = "Complete Payment";
  }

  if (!isCurrentPlan && subscriptionStatus === "ACTIVE") {
    buttonLabel = "Change Plan";
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

    // PENDING → resume payment
    if (isCurrentPlan && subscriptionStatus === "PENDING") {
      setIsModalOpen(true);
      return;
    }

    if (buttonDisabled) return;

    setIsProcessing(true);

    try {
      const res = await createCheckoutSession({
        planId: plan.id,
        billingCycle: "MONTHLY",
      }).unwrap();

      if (!res.data?.url) {
        throw new Error("Checkout URL missing");
      }

      setCheckoutUrl(String(res.data.url));
      setIsModalOpen(true);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Unable to start checkout. Please try again.");
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
        className={`relative overflow-hidden rounded-3xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-3 flex flex-col h-full ${
          plan.isPopular ? "ring-4 ring-primary ring-offset-4" : ""
        }`}
      >
        {plan.isPopular && (
          <Badge className="absolute top-4 right-4 z-20">
            Most Popular
          </Badge>
        )}

        <CardHeader className="pt-12 pb-6 text-center">
          <h3 className="text-3xl font-bold">{plan.name}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            {plan.description}
          </p>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="text-center mb-8">
            <span className="text-6xl font-light">€{price}</span>
            <p className="text-muted-foreground mt-1">/ month</p>
          </div>

          <ul className="space-y-4">
            {Object.entries(plan.features).map(([key, value]) =>
              value ? (
                <li key={key} className="flex gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    {formatFeatureLabel(key, value)}
                  </span>
                </li>
              ) : null
            )}
          </ul>
        </CardContent>

        <CardFooter className="pb-10 px-8">
          <Button
            onClick={handlePlanClick}
            disabled={buttonDisabled}
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-2xl"
            variant={
              isCurrentPlan && subscriptionStatus === "ACTIVE"
                ? "secondary"
                : plan.isPopular
                ? "default"
                : "outline"
            }
          >
            {isCheckingAuth || isProcessing || isCreatingSession
              ? "Processing..."
              : buttonLabel}
          </Button>
        </CardFooter>
      </Card>

      {/* ---------- CHECKOUT MODAL ---------- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proceed to Payment</DialogTitle>
            <DialogDescription>
              Subscribe to <strong>{plan.name}</strong> for{" "}
              <strong>€{price}/month</strong>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProceedToCheckout} disabled={!checkoutUrl}>
              Continue to Stripe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
