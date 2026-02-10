/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Edit2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateSupplierProfileMutation } from "@/redux/features/supplyer/supplyer.api";

const supplierSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  criticality: z.string().min(1, "Criticality is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  contractStartDate: z.date().optional(),
  contractEndDate: z.date().nullable().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface EditSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: any; // Your full supplier object
  onSuccess?: () => void; // Callback to refetch or update UI
  refetch: any
}

export default function EditSupplierModal({
  open,
  onOpenChange,
  supplier,
  onSuccess,
  refetch
}: EditSupplierModalProps) {
  const [updateSupplier, { isLoading: isSaving }] = useUpdateSupplierProfileMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  // Reset form when modal opens or supplier changes
  useEffect(() => {
    if (open && supplier) {
      reset({
        name: supplier.name || "",
        category: supplier.category || "",
        criticality: supplier.criticality || "LOW",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        contractStartDate: supplier.contractStartDate ? new Date(supplier.contractStartDate) : undefined,
        contractEndDate: supplier.contractEndDate ? new Date(supplier.contractEndDate) : null,
      });
    }
  }, [open, supplier, reset]);

  const onSubmit = async (data: SupplierFormData) => {
    try {
      const updatePayload: any = {
        name: data.name,
        category: data.category,
        criticality: data.criticality,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone || null,
      };

      // Only include dates if they exist
      if (data.contractStartDate) {
        updatePayload.contractStartDate = data.contractStartDate.toISOString();
      }
      if (data.contractEndDate) {
        updatePayload.contractEndDate = data.contractEndDate.toISOString();
      } else if (data.contractEndDate === null) {
        updatePayload.contractEndDate = null;
      }

      await updateSupplier({
        supplierId: supplier.id,
        data: updatePayload,
      }).unwrap();
      refetch();
      toast.success("Supplier profile updated successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error?.data?.message || "Failed to update supplier profile");
    }
  };

  const contractStartDate = watch("contractStartDate");
  const contractEndDate = watch("contractEndDate");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-4 border-b">
          <div>
            <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
              <Edit2 className="w-6 h-6 text-primary" />
              Edit Supplier Profile
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Update supplier information, contact details, and contract dates.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Company & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Acme Corp"
                disabled={isSaving}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                {...register("contactPerson")}
                placeholder="John Doe"
                disabled={isSaving}
              />
              {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson.message}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="contact@supplier.com"
                disabled={isSaving}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+1 234 567 8900"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Category & Criticality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                {...register("category")}
                placeholder="IT Services"
                disabled={isSaving}
              />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Criticality</Label>
              <Select
                onValueChange={(value) => setValue("criticality", value)}
                defaultValue={supplier.criticality || "LOW"}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select criticality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
              {errors.criticality && <p className="text-sm text-destructive">{errors.criticality.message}</p>}
            </div>
          </div>

          {/* Contract Dates */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Contract Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Contract Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !contractStartDate && "text-muted-foreground"
                      )}
                      disabled={isSaving}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {contractStartDate ? format(contractStartDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={contractStartDate}
                      onSelect={(date) => setValue("contractStartDate", date || undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Contract End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !contractEndDate && "text-muted-foreground"
                      )}
                      disabled={isSaving}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {contractEndDate ? format(contractEndDate, "PPP") : "No end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={contractEndDate || undefined}
                      onSelect={(date) => setValue("contractEndDate", date || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Leave empty for ongoing contracts
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}