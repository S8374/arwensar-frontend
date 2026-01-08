// components/settings/ProfileSettingOverview.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "./components/Profile";
import NotificationSetting from "./components/NotificationSetting";
import SecuritySettings from "./components/SecuritySettings";
import SubscriptionTab from "./components/SubscriptionTab"; // We'll create this next
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Bell, Lock, CreditCard } from "lucide-react";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";

export default function ProfileSettingOverview() {
  const { data: userData, isLoading } = useGetUserProfileQuery(undefined);
  const user = userData?.data;
  const isVendor = user?.role === "VENDOR";
  const plan = user?.subscription?.plan;

  // Default tabs for all users
  const baseTabs = [
    { value: "profile", label: "Profile", icon: ShieldCheck },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "security", label: "Security", icon: Lock },
  ];

  // Add Subscription tab only for vendors
  const tabs = isVendor 
    ? [...baseTabs, { value: "subscription", label: "Subscription", icon: CreditCard }]
    : baseTabs;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-6 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account, preferences, and subscription
              </p>
            </div>

            {/* Show current plan badge for vendors */}
            {isVendor && plan && (
              <div className="flex items-center gap-3">
                <Badge className="px-4 py-2 text-sm font-semibold text-white shadow-lg">
                  {plan.name} Plan
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {plan.type === "PROFESSIONAL" ? "Professional Level" : plan.type}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ">
        <Tabs defaultValue="profile" className="w-full">
          {/* Responsive Tabs */}
          <TabsList className="grid bg-forground w-full grid-cols-3 lg:grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl py-4 px-6 text-sm lg:text-base font-medium 
                    data-[state=active]:bg-chart-6 data-[state=active]:text-white 
                    data-[state=active]:shadow-lg hover:bg-muted/80 flex items-center gap-3"
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Panels */}
          <div className="mt-10">
            <TabsContent value="profile" className="mt-0">
              <Profile  isVendor={isVendor}/>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <NotificationSetting />
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <SecuritySettings />
            </TabsContent>

            {isVendor && (
              <TabsContent value="subscription" className="mt-0">
                <SubscriptionTab user={user} />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}