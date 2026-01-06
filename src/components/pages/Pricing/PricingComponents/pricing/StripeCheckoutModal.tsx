// CheckoutModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, CreditCard, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  planName: string;
  price: number;
  isLoading: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onContinue,
  planName,
  price,
  isLoading,
}: CheckoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{planName} Plan</h3>
              <span className="font-bold text-lg">€{price}/month</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Billed monthly • Cancel anytime
            </p>
          </div>

          {/* Security Info */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Secure Checkout</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Your payment is processed securely by Stripe. We never store your card details.
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="space-y-3">
            <h4 className="font-semibold">What's included:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Full platform access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{planName === "Starter" ? "14-day" : "7-day"} free trial</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No setup fees</span>
              </li>
            </ul>
          </div>

          <Separator />

          {/* Footer */}
          <div className="space-y-3">
            <Button
              onClick={onContinue}
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Continue to Secure Checkout
                </>
              )}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
            
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}