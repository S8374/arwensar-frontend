/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Upload, CalendarIcon, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAddSupplierMutation } from "@/redux/features/vendor/vendor.api";
import { useMinioUpload } from "@/lib/useMinioUpload";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getPlanFeatures } from "@/lib/planFeatures";

// Zod Schema – Strong Validation
const supplierSchema = z.object({
  name: z.string().min(2, "Supplier name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  criticality: z.string().min(1, "Please select criticality level"),
  contractStartDate: z.date({ message: "Start date is required" }),
  contractEndDate: z.date({ message: "End date is required" }),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface AddSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddSupplierModal({ open, onOpenChange }: AddSupplierModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [addSupplier, { isLoading: isSubmitting }] = useAddSupplierMutation();

  // ✅ useMinioUpload hook called at top level
  const minioUpload = useMinioUpload();
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

  // Watch dates to sync with calendar
  watch((data) => {
    if (data.contractStartDate !== startDate) setStartDate(data.contractStartDate as Date);
    if (data.contractEndDate !== endDate) setEndDate(data.contractEndDate as Date);
  });

  const onSubmit = async (data: SupplierFormData) => {
    setIsUploading(true);
    try {
      let contractDocument = undefined;
      let documentType = undefined;

      // Upload document if exists
      if (files.length > 0) {
        const file = files[0]; // support one for now, easy to extend
        const uploaded = await minioUpload.uploadFile(file);
        contractDocument = uploaded;
        documentType = file.type;
      }

      const payload = {
        name: data.name.trim(),
        contact: data.contactPerson,
        contactPerson: data.contactPerson.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || "",
        category: data.category,
        criticality: data.criticality.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
        contractStartDate: data.contractStartDate.toISOString().split("T")[0], // YYYY-MM-DD
        contractEndDate: data.contractEndDate.toISOString().split("T")[0],
        contractDocument,
        documentType,
        files: files.length > 0 ? files : undefined,
      };

      await addSupplier(payload).unwrap();

      toast.success("Supplier invited successfully!");
      onOpenChange(false);
      reset();
      setFiles([]);
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (err: any) {
      if (err?.status === 402) {
        toast.error("Limit Expired");
        return;
      }
      else {
        toast.error(err?.data?.message || "Failed to add supplier");

      }
    } finally {
      setIsUploading(false);
    }
  };
  const { data: userData } = useUserInfoQuery(undefined);
  const plan = userData?.data?.subscription;
  const limit = getPlanFeatures(plan);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isLoading = isUploading || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b space-y-1">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Add New Supplier
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Supplier creation limit:{" "}
            <span className="font-medium">
              {limit.supplierLimit === null ? (
                <span className="text-emerald-600">Unlimited</span>
              ) : (
                <span className="text-destructive">
                  {limit.supplierLimit}
                </span>
              )}
            </span>
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Provide supplier information manually or upload relevant supporting documents
            to streamline the onboarding process.
          </p>
        </DialogHeader>


        {/* File Upload Section */}
        <div className="p-6 bg-muted/30 border-b">
          <Label>Supporting Documents (Optional)</Label>
          <div className="mt-3">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="cursor-pointer"
              disabled={isLoading}
            />
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-chart-6" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFile(i)}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <h3 className="text-lg font-semibold">Supplier Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <Label>Supplier Name *</Label>
                <Input
                  {...register("name")}
                  placeholder="Acme Corp"
                  className="mt-2"
                  disabled={isLoading}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label>Contact Person *</Label>
                <Input
                  {...register("contactPerson")}
                  placeholder="John Doe"
                  className="mt-2"
                  disabled={isLoading}
                />
                {errors.contactPerson && <p className="text-destructive text-xs mt-1">{errors.contactPerson.message}</p>}
              </div>

              <div>
                <Label>Criticality Level *</Label>
                <Select
                  onValueChange={(v) => setValue("criticality", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select criticality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                {errors.criticality && <p className="text-destructive text-xs mt-1">{errors.criticality.message}</p>}
              </div>

              <div>
                <Label>Contract Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal mt-2", !startDate && "text-muted-foreground")}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setValue("contractStartDate", date as Date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.contractStartDate && <p className="text-destructive text-xs mt-1">{errors.contractStartDate.message}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <Label>Category *</Label>
                <Select
                  onValueChange={(v) => setValue("category", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT Services</SelectItem>
                    <SelectItem value="data">Data Management</SelectItem>
                    <SelectItem value="security">Cybersecurity</SelectItem>
                    <SelectItem value="cloud">Cloud Services</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="contact@acme.com"
                  className="mt-2"
                  disabled={isLoading}
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label>Phone (Optional)</Label>
                <Input
                  {...register("phone")}
                  placeholder="+1 (555) 000-0000"
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label>Contract End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal mt-2", !endDate && "text-muted-foreground")}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setValue("contractEndDate", date as Date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.contractEndDate && <p className="text-destructive text-xs mt-1">{errors.contractEndDate.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-chart-6 hover:bg-chart-6/90 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Adding..."}
                </>
              ) : (
                "Add Supplier"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}