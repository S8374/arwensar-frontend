/* eslint-disable react-hooks/set-state-in-effect */
// CheckoutStatus.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface CheckoutStatusProps {
  status: 'success' | 'error' | null;
  sessionId?: string;
  onClose: () => void;
}

export default function CheckoutStatus({ status, sessionId, onClose }: CheckoutStatusProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status) {
      setIsOpen(true);
    }
  }, [status]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!status) return null;

  const isSuccess = status === 'success';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 text-center space-y-4">
          <div className="flex justify-center">
            {isSuccess ? (
              <CheckCircle className="w-20 h-20 text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500" />
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              {isSuccess ? "Welcome to VendorHawk!" : "Something went wrong"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isSuccess 
                ? "Your subscription is now active. You can access all features immediately."
                : "We couldn't process your payment. Please try again or contact support."
              }
            </p>
          </div>

          {sessionId && (
            <div className="text-sm text-gray-500">
              Reference: {sessionId.slice(0, 8)}...
            </div>
          )}

          <div className="pt-4 space-y-3">
            {isSuccess ? (
              <Button onClick={handleClose} className="w-full">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={handleClose} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}