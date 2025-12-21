
import { useState } from "react";
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
import { X, Edit2 } from "lucide-react";

const supplierSchema = z.object({
  companyName: z.string().min(2),
  category: z.string().min(1),
  riskLevel: z.string().min(1),
  contactName: z.string().min(2),
  email: z.string().email(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface EditSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: {
    company: string;
    category: string;
    criticality: string;
    contactPerson: string;
    email: string;
  };
}

export default function EditSupplierModal({
  open,
  onOpenChange,
  supplier = {
    company: "FinanceGuard LTD",
    category: "Financial Services",
    criticality: "High",
    contactPerson: "Nayan Dhali",
    email: "contact@supplier.com",
  },
}: EditSupplierModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      companyName: supplier.company,
      category: supplier.category,
      riskLevel: supplier.criticality,
      contactName: supplier.contactPerson,
      email: supplier.email,
    },
  });

  const onSubmit = (data: SupplierFormData) => {
    setIsSaving(true);
    console.log("Saved:", data);
    console.log(errors)
    setTimeout(() => {
      setIsSaving(false);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Custom Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-600" />
              Edit Supplier
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update supplier details such as company info, contact, or risk classification.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 space-y-6">
          {/* Company Name */}
          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="text-sm font-medium">
              Company Name
            </Label>
            <Input
              id="companyName"
              {...register("companyName")}
              placeholder="FinanceGuard LTD"
              className="h-11 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {/* Supplier Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm font-medium">
              Supplier Category
            </Label>
            <Input
              id="category"
              {...register("category")}
              placeholder="Financial Services"
              className="h-11 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {/* Risk Level */}
          <div className="space-y-1.5">
            <Label htmlFor="riskLevel" className="text-sm font-medium">
              Risk Level
            </Label>
            <Select
              onValueChange={(v) => setValue("riskLevel", v)}
              defaultValue={supplier.criticality}
            >
              <SelectTrigger className="h-11 bg-muted/40 border-0 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5">
            <Label htmlFor="contactName" className="text-sm font-medium">
              Contact Info
            </Label>
            <Input
              id="contactName"
              {...register("contactName")}
              placeholder="Nayan Dhali"
              className="h-11 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="contact@supplier.com"
              className="h-11 bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          {/* Footer */}
          <DialogFooter className="flex gap-3 pt-6 pb-6 !flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}