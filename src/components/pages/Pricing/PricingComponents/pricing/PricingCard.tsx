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
  onSelect?: () => void; // Optional, for analytics or parent highlighting
}

/* ---------------- HELPERS ---------------- */
function formatFeatureLabel(key: string, value: boolean | number) {
  const label = key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
  if (typeof value === "number") {
    return `${label}: ${value}`;
  }
  return label;
}

/* ---------------- COMPONENT ---------------- */
export default function PricingCard({ plan, onSelect }: PricingCardProps) {
  const price = Number(plan.price);
  const navigate = useNavigate();

  // Check authentication status
  const { data: userInfo, isLoading: isCheckingAuth, isError: isAuthError } = useUserInfoQuery(undefined);

  const [createCheckoutSession, { isLoading: isCreatingSession }] = useCreateCheckoutSessionMutation();

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAuthenticated = !!userInfo && !isAuthError;

  const handlePlanClick = async () => {
    onSelect?.(); // Optional callback for parent (e.g. scroll highlight)

    // If user is not logged in → redirect to login
    if (!isAuthenticated) {
      navigate("/loginvendor", { state: { from: window.location.pathname } });
      return;
    }

    // If already processing or loading, prevent double click
    if (isProcessing || isCreatingSession) return;

    setIsProcessing(true);

    try {
      const res = await createCheckoutSession({
        planId: plan.id,
        billingCycle: "MONTHLY",
      }).unwrap();

      if (!res.data?.url) {
        throw new Error("No checkout URL received from server");
      }

      setCheckoutUrl(String(res.data.url));

      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to create checkout session:", err);
      alert("Unable to start checkout. Please try again later.");
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

  const isButtonDisabled = isCheckingAuth || isProcessing || isCreatingSession;

  return (
    <>
      <Card
        className={`relative overflow-hidden rounded-3xl shadow-xl border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 flex flex-col h-full ${plan.isPopular ? "ring-4 ring-primary ring-offset-4" : ""
          }`}
      >
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-b opacity-60 ${plan.name === "Starter"
              ? "from-blue-100 to-blue-50 dark:from-blue-900/40"
              : plan.name === "Business"
                ? "from-amber-100 to-amber-50 dark:from-amber-900/40"
                : "from-purple-100 to-purple-50 dark:from-purple-900/40"
            }`}
        />

        {/* Popular Badge */}
        {plan.isPopular && (
          <Badge className="absolute top-4 right-4 z-20">Most Popular</Badge>
        )}

        <CardHeader className="relative z-10 pt-12 pb-6 text-center">
          <h3 className="text-3xl font-bold">{plan.name}</h3>
          <p className="mt-4 text-muted-foreground text-sm max-w-xs mx-auto">
            {plan.description}
          </p>
        </CardHeader>

        <CardContent className="relative z-10 flex-1 pb-8">
          <div className="text-center mb-10">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-extralight">€{price}</span>
              <span className="text-xl text-muted-foreground">/month</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Billed monthly</p>
    
          </div>

          <ul className="space-y-4">
            {Object.entries(plan.features).map(([key, value]) => {
              if (!value) return null;
              return (
                <li key={key} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">
                    {formatFeatureLabel(key, value)}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>

        <CardFooter className="relative z-10 pt-6 pb-12 px-8">
          <Button
            onClick={handlePlanClick}
            disabled={isButtonDisabled}
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            variant={plan.isPopular ? "default" : "outline"}
          >
            {isCheckingAuth || isProcessing ? (
              "Loading..."
            ) : plan.name === "Starter" ? (
              "Start Free Trial"
            ) : (
              "Choose This Plan"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Checkout Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Proceed to Payment
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              You're about to subscribe to the{" "}
              <strong>{plan.name}</strong> plan for{" "}
              <strong>€{price}/month</strong>.
              <br />
              You'll be taken to Stripe's secure checkout.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-3 sm:justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isProcessing}
            >
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