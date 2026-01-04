// components/notifications/SupplierDetailModal.tsx
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, FileText, TrendingUp } from "lucide-react";

export default function SupplierDetailModal() {
  return (
    <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-lg">
      <div className="overflow-y-auto px-6 pt-6 pb-2">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Supplier Name
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Static supplier alert title goes here.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-5 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Alert Date: 15 Nov 2024</span>
          </div>

          <div className="flex items-center gap-3 text-destructive">
            <FileText className="w-4 h-4" />
            <span>Contract Ends: 25 Dec 2024</span>
          </div>

          <div className="flex items-center gap-3 text-destructive ">
            <TrendingUp className="w-4 h-4" />
            <span>Current Risk Score: 55/100</span>
          </div>

          <div className="pt-4 border-t">
            <p className="text-foreground leading-relaxed">
              Static supplier description goes here. You can modify this text
              with any information you want.
            </p>
          </div>

          <div className="py-4 space-y-3">
            <h4 className="font-medium text-foreground">Recommended Actions</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>• Contact supplier immediately</li>
              <li>• Review contract details</li>
              <li>• Perform risk assessment</li>
            </ul>
          </div>
        </div>
      </div>

      <DialogFooter className="  px-6  sticky bottom-0">
        <Button  className="mr-2 bg-chart-6 text-background  hover:bg-chart-6/90">
          Close
        </Button>
        <Button className="bg-chart-6 text-background  hover:bg-chart-6/90">Contact Supplier</Button>
      </DialogFooter>
    </DialogContent>
  );
}
