import ProblemsPage from "@/components/pages/dashboard/problem/ProblemList";
import SupplierDashboard from "@/components/pages/dashboard/supplier/overview";
import NotificationsPage from "@/components/pages/dashboard/supplier/pages/NotificationAlerts/NotificationAlerts";
import ReportsPage from "@/components/pages/dashboard/supplier/pages/Reports/Report";
import UploadeEvidencePage from "@/components/pages/dashboard/supplier/pages/upladeEvidence/upladeEvidence";
import ProfileSettingOverview from "@/components/pages/dashboard/vendor/pages/ProfileSetting/ProfileSettingOverview";
import type { ISidebarItem } from "@/types";

export const suppliersSidebarItems: ISidebarItem[] = [
  {
    title: "",
    items: [
      {
        title: "Dashboard",
        url: "/supplier/analytics",
        icon: "LayoutDashboard",
        component: SupplierDashboard,
      },
      {
        title: "Uplade Evidence",
        url: "/supplier/evidence",
        icon: "LayoutDashboard",
        component: UploadeEvidencePage,
      },
      {
        title: "Notification Alerts",
        url: "/supplier/notification-alerts",
        icon: "LayoutDashboard",
        component: NotificationsPage,
      },
      {
        title: "Reports",
        url: "/supplier/Reports",
        icon: "LayoutDashboard",
        component: ReportsPage,
      },
      
      {
        title: "Profile & Setting",
        url: "/supplier/profileSetting",
        icon: "Settings",
        component: ProfileSettingOverview,
      },
      {
        title: "Problems & Issues",
        url: "/supplier/problem",
        icon: "Settings",
        component: ProblemsPage,
      }
    ]
  }
]