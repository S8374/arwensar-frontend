import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/AdminSidebarItems";
import { suppliersSidebarItems } from "@/routes/SupplierSidebarItems";
import { vendorSidebarItems } from "@/routes/VendorSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
  switch (userRole) {
    case role.vendor || role.admin :
      return [...vendorSidebarItems];
    case role.suplier:
      return [...suppliersSidebarItems];
    case role.admin:
      return [...adminSidebarItems ];
    default:
      return [];
  }
};