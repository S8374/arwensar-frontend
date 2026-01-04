/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/vendor/tabs/SupplierOverviewTab.tsx
import { Building, User, Mail, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RiskMetrics from "../RiskMetrics";

const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";

type Props = {
  supplier: any;
  progress: any;
  contractStatus: { status: string; variant: any; days: number | null };
};

export default function SupplierOverviewTab({ supplier, contractStatus }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5" />Supplier Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Category:</span><p className="font-medium">{supplier.category}</p></div>
            <div><span className="text-muted-foreground">Status:</span><p className="font-medium">{supplier.isActive ? "Active" : "Inactive"}</p></div>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-3">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><User className="w-4 h-4 text-muted-foreground" />{supplier.contactPerson}</div>
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-muted-foreground" /><a href={`mailto:${supplier.email}`} className="text-primary">{supplier.email}</a></div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-muted-foreground" />{supplier.phone || "N/A"}</div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-3">Contract</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Start:</span><p>{formatDate(supplier.contractStartDate)}</p></div>
              <div><span className="text-muted-foreground">End:</span><p>{formatDate(supplier.contractEndDate)}</p></div>
            </div>
            <p className="mt-3">
              <strong>Status:</strong> <span className="capitalize">{contractStatus.status}</span>
              {contractStatus.days !== null && ` (${contractStatus.days} days)`}
            </p>
          </div>
        </CardContent>
      </Card>

      <RiskMetrics supplier={supplier}  />
    </div>
  );
}