;
import Alerts from "@/components/pages/dashboard/vendor/pages/Alerts/Alerts";
import VendorOverview from "@/components/pages/dashboard/vendor/overview";
import type { ISidebarItem } from "@/types";
import VendorSupplierManageSection from "@/components/pages/dashboard/vendor/pages/SupplierManagement/component/VendorSupplierManageSection";
import ProfileSettingOverview from "@/components/pages/dashboard/vendor/pages/ProfileSetting/ProfileSettingOverview";
import ReportsPage from "@/components/pages/dashboard/vendor/pages/Reports/overview";
import ProblemsPage from "@/components/pages/dashboard/problem/ProblemList";

export const vendorSidebarItems: ISidebarItem[] = [
  {
    title: "",
    items: [
      {
        title: "Dashboard",
        url: "/vendor/analytics",
        icon: "LayoutDashboard",
        component: VendorOverview,
      },
      {
        title: "Suppliers",
        url: "/vendor/suppliers",
        icon: "Users",
        component: VendorSupplierManageSection,
      },
      {
        title: "Alerts & Notifications ",
        url: "/vendor/alerts",
        icon: "AlertCircle",
        component: Alerts,
      },
      {
        title: "Reports",
        url: "/vendor/reports",
        icon: "FileWarning",
        component: ReportsPage,
      },
      {
        title: "Profile & Setting",
        url: "/vendor/profileSetting",
        icon: "Settings",
        component: ProfileSettingOverview,
      },
      {
        title: "Problems & Issues",
        url: "/vendor/problem",
        icon: "Settings",
        component: ProblemsPage,
      }
    ],

  }
];