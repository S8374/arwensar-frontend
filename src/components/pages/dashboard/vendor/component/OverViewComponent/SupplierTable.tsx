/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/SupplierTable.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ImportSuppliersModal from "../../model/ImportSuplierModel";
import { Link } from "react-router-dom";
import { useGetMySuppliersQuery, useResendSupplierInvitationMutation } from "@/redux/features/vendor/vendor.api";
import { format } from "date-fns";
import { Search, Filter, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getRiskBadgeVariant = (criticality: string) => {
  switch (criticality?.toUpperCase()) {
    case "HIGH":
      return "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800";
    case "MEDIUM":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
    case "LOW":
    default:
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
  }
};

const getRiskLabel = (criticality: string) => {
  switch (criticality?.toUpperCase()) {
    case "HIGH": return "High Risk";
    case "MEDIUM": return "Medium Risk";
    case "LOW": default: return "Low Risk";
  }
};

export default function SupplierTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useGetMySuppliersQuery(undefined);
  const suppliers = data?.data || [];
  const [resendInvitation, { isLoading: isResending }] =
    useResendSupplierInvitationMutation();

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((s: any) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === "all" || s.criticality?.toUpperCase() === riskFilter.toUpperCase();
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && s.isActive) ||
      (statusFilter === "pending" && !s.isActive);

    return matchesSearch && matchesRisk && matchesStatus;
  });
  const handleResendInvitation = async (supplierId: string) => {
    try {
      await resendInvitation({ supplierId }).unwrap();
      alert("Invitation resent successfully");
    } catch (err) {
      alert("Failed to resend invitation");
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading suppliers...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-2">Failed to load suppliers</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Please try again later</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0  overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white ">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Supplier List
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage and monitor all your suppliers
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Import Suppliers
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-700 focus:border-blue-500"
                />
              </div>

              {/* Risk Filter */}
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="border-gray-300 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Risk Level" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Low Risk
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      Medium Risk
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      High Risk
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Registration</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center justify-between sm:justify-end">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold">{filteredSuppliers.length}</span> of{" "}
                  <span className="font-semibold">{suppliers.length}</span> suppliers
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50  border-b border-gray-200 ">
                <tr>
                  {["Supplier Name", "Contact", "Category", "Contract End", "Status", "Risk Level", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="text-left px-6 py-4 font-medium text-gray-700  text-sm uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium mb-2">No suppliers found</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((s: any) => (
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {s.name?.[0]?.toUpperCase() || "S"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {s.name || "Unnamed Supplier"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {s.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-gray-900 dark:text-white">{s.contactPerson || "-"}</p>
                        {s.email && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{s.email}</p>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {s.category || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-gray-900 dark:text-white">
                            {s.contractEndDate
                              ? format(new Date(s.contractEndDate), "MMM dd, yyyy")
                              : "-"}
                          </span>
                          {s.contractEndDate && (
                            <span className={`text-xs ${new Date(s.contractEndDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              ? "text-amber-600"
                              : "text-gray-500"
                              }`}>
                              {new Date(s.contractEndDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? "Expiring soon"
                                : "Active"
                              }
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant={s.isActive ? "default" : "secondary"}
                          className={s.isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }
                        >
                          {s.isActive ? "Active" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <Badge className={getRiskBadgeVariant(s.criticality)}>
                          {getRiskLabel(s.criticality)}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            <Link to={`/vendor/suppliers/${s.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleResendInvitation(s.id)}
                                disabled={isResending}
                              >
                                Resend Invitation
                              </DropdownMenuItem>

                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium mb-2">No suppliers found</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredSuppliers.map((s: any) => (
                <Card key={s.id} className="p-5  border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {s.name?.[0]?.toUpperCase() || "S"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {s.name || "Unnamed Supplier"}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {s.category || "No category"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {s.contactPerson || "No contact"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Contract Ends</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {s.contractEndDate
                          ? format(new Date(s.contractEndDate), "MMM dd, yyyy")
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <Badge
                        variant={s.isActive ? "default" : "secondary"}
                        className={s.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }
                      >
                        {s.isActive ? "Active" : "Pending"}
                      </Badge>
                      <Badge className={getRiskBadgeVariant(s.criticality)}>
                        {getRiskLabel(s.criticality)}
                      </Badge>
                    </div>
                    <Button asChild variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                      <Link to={`/vendor/suppliers/${s.id}`}>View →</Link>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <ImportSuppliersModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}