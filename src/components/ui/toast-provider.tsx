// components/ui/toast-provider.tsx
import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster 
      position="top-center"
      expand={true}
      richColors
      closeButton
      duration={4000}
    />
  );
}