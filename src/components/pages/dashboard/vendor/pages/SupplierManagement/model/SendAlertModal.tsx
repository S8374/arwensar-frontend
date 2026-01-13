import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Bell, CheckCircle2 } from "lucide-react";
import { useSendAlert } from "@/hooks/useSendAlert";
import { Controller } from "react-hook-form";

interface SendAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId?: string;
  supplierName?: string;
}

export default function SendAlertModal({
  open,
  onOpenChange,
  supplierId,
  supplierName,
}: SendAlertModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    errors,
    isLoading,
    isSuccess,
    isError,
    isValid,
    reset,
  } = useSendAlert({
    onSuccess: () => {
      setTimeout(() => onOpenChange(false), 2000);
    },
    supplierId,
  });
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95%] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-base sm:text-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            Send Alert {supplierName ? `to ${supplierName}` : "to Supplier"}
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground -mt-1">
            Notify the supplier about important updates or issues. sss
          </p>
        </DialogHeader>

        {/* Success Message */}
        {isSuccess && (
          <div className="p-3 bg-background border rounded-lg flex items-center gap-3 mt-2">
            <CheckCircle2 className="w-5 h-5 text-green shrink-0" />
            <div>
              <p className="text-green font-medium text-sm">
                Alert sent successfully!
              </p>
              <p className="text-green text-xs">The supplier has been notified.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="p-3 bg-background border rounded-lg flex items-center gap-3 mt-2">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <p className="text-destructive font-medium text-sm">
                Failed to send alert
              </p>
              <p className="text-destructive text-xs">Please try again.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Alert Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Alert Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. Certificate Renewal Required"
              className="text-base"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Severity *</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-destructive rounded-full" />
                        <span>HIGH</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="MEDIUM">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>MEDIUM</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="LOW">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green rounded-full" />
                        <span>LOW</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-sm text-destructive">{errors.priority.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information..."
              rows={5}
              className="resize-none text-base"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch("description")?.length || 0}/1000 characters
            </p>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full sm:w-auto bg-chart-6 min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Send Alert
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
