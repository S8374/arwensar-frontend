/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { getSidebarItems } from "@/lib/getSidebarItems";
import logo from "../assets/logo/logo.svg";
import { getIconComponent } from "@/lib/icon-maper";
import { cn } from "@/lib/utils";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: userData } = useUserInfoQuery(undefined);
  const data = {
    navMain: getSidebarItems(userData.data.role),
  };
  console.log("navMain",data)
  const location = useLocation();
  return (
    <Sidebar {...props} className="border-r bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarHeader className="h-16 border-b px-6">
        <Link to="/" className="flex items-center gap-3 h-full group">
          <img
            src={logo}
            alt="CyberNark Logo"
            className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
          />
          <div className="text-xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            CyberNark
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title} className="mb-6 last:mb-0">
            {group.title && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item: any) => {
                  const Icon = getIconComponent(item.icon);
                  const isActive = location.pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "relative group/navitem transition-all duration-200 rounded-lg border-2",
                          "hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
                          isActive
                            ? "bg-chart-6 border text-background shadow-lg"
                            : "bg-transparent border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          {/* Active indicator bar */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-background rounded-r-full shadow-sm" />
                          )}

                          <Icon className={cn(
                            "w-5 h-5 transition-transform duration-200 shrink-0",
                            isActive
                              ? "text-background"
                              : "text-muted-foreground group-hover/navitem:text-foreground group-hover/navitem:scale-110"
                          )} />

                          <span className={cn(
                            "font-medium transition-all duration-200",
                            isActive
                              ? "text-background font-semibold"
                              : "group-hover/navitem:text-foreground group-hover/navitem:font-semibold"
                          )}>
                            {item.title}
                          </span>

                          {/* Hover effect */}
                          <div className={cn(
                            "absolute inset-0 rounded-lg transition-opacity duration-200",
                            isActive
                              ? "bg-linear-to-r from-chart-6 to-[oklch(0.5459_0.2154_262.75)/90]"
                              : "bg-linear-to-r from-accent to-accent/50 opacity-0 group-hover/navitem:opacity-100"
                          )} style={{ zIndex: -1 }} />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>



      <SidebarRail />
    </Sidebar>
  );
}



















