import { role } from "@/constants/role";
import { suppliersSidebarItems } from "@/routes/SupplierSidebarItems";
import { vendorSidebarItems } from "@/routes/VendorSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.vendor:
      return [...vendorSidebarItems];
    case role.suplier:
      return [...suppliersSidebarItems];
    default:
      return [];
  }
};