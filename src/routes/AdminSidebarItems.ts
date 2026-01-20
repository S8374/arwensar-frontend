import AdminDashboard from "@/components/pages/dashboard/admin/admin.overview";
import AssessmentManagement from "@/components/pages/dashboard/admin/user/assessment.management";
import PlanManagement from "@/components/pages/dashboard/admin/user/plan.management";
import UserManagement from "@/components/pages/dashboard/admin/user/User.Management";
import type { ISidebarItem } from "@/types";

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "",
    items: [
      
      {
        title: "Dashboard",
        url: "/admin/analytics",
        icon: "LayoutDashboard",
        component : AdminDashboard
      }
      ,
      {
        title: "Users",
        url: "/admin/users",
        icon: "Users",
        component: UserManagement,
      },
      {
        title: "Plans",
        url: "/admin/plans",
        icon: "CreditCard",
        component: PlanManagement,
      },
      {
        title: "Assignment ",
        url: "/admin/assainment",
        icon: "CreditCard",
        component: AssessmentManagement,
      },
    ]
  }
]