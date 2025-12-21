// components/dashboard/SupplierTable.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ImportSuppliersModal from "../../model/ImportSuplierModel";
import { Link } from "react-router-dom";
import { useGetMySuppliersQuery } from "@/redux/features/vendor/vendor.api";
import { format } from "date-fns";

// Map criticality to risk level
const getRiskLevel = (criticality: string) => {
  switch (criticality) {
    case "HIGH": return "High Risk";
    case "MEDIUM": return "Medium Risk";
    case "LOW": return "Low Risk";
    default: return "Low Risk";
  }
};

export default function SupplierTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real data from backend
  const { data, isLoading, error } = useGetMySuppliersQuery(undefined);
  const suppliers = data?.data || []; // ← This is your real data!
  console.log("......suppliers",suppliers);
  if (isLoading) {
    return <div className="text-center py-8">Loading suppliers...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Failed to load suppliers</div>;
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Supplier List</CardTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto justify-center"
              >
                Import Suppliers
              </Button>

              <Input placeholder="Search suppliers..." className="w-full sm:w-48 lg:w-64" />
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue>All Risks</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue>All Status</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Supplier Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Contract End</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Risk Level</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s: any) => (
                  <tr key={s.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{s.contactPerson}</td>
                    <td className="p-4">{s.category}</td>
                    <td className="p-4">
                      {format(new Date(s.contractEndDate), "MMM dd, yyyy")}
                    </td>
                    <td className="p-4">
                      <Badge variant={s.isActive ? "default" : "secondary"}>
                        {s.isActive ? "Active" : "Pending Registration"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          s.criticality === "HIGH"
                            ? "bg-destructive/10 text-destructive"
                            : s.criticality === "MEDIUM"
                            ? "bg-orange-500/10 text-orange-600"
                            : "bg-green-500/10 text-green-600"
                        }
                      >
                        {getRiskLevel(s.criticality)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button asChild variant="link" size="sm" className="p-0 h-auto text-chart-6">
                        <Link to={`/vendor/suppliers/${s.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {suppliers.map((s: any) => (
              <div key={s.id} className="bg-card border rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg">{s.name}</h4>
                  <Badge
                    className={
                      s.criticality === "HIGH"
                        ? "bg-destructive/10 text-destructive"
                        : s.criticality === "MEDIUM"
                        ? "bg-orange-500/10 text-orange-600"
                        : "bg-green-500/10 text-green-600"
                    }
                  >
                    {getRiskLevel(s.criticality)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Contact:</span> {s.contactPerson}</p>
                  <p><span className="text-muted-foreground">Category:</span> {s.category}</p>
                  <p><span className="text-muted-foreground">Ends:</span> {format(new Date(s.contractEndDate), "MMM dd, yyyy")}</p>
                  <p>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <Badge variant={s.isActive ? "default" : "secondary"} className="ml-2">
                      {s.isActive ? "Active" : "Invitation Sent"}
                    </Badge>
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button asChild variant="link" size="sm" className="p-0 h-auto text-chart-6">
                    <Link to={`/vendor/suppliers/${s.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ImportSuppliersModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}



