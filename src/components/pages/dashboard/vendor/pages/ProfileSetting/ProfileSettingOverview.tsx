import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "./components/Profile";
import NotificationSetting from "./components/NotificationSetting";
import SecuritySettings from "./components/SecuritySettings";
import SubscriptionTab from "./components/SubscriptionTab";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Bell, Lock, CreditCard } from "lucide-react";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";

export default function ProfileSettingOverview() {
  const { data: userData, isLoading } = useGetUserProfileQuery(undefined);
  const user = userData?.data;
  const isVendor = user?.role === "VENDOR";
  const plan = user?.subscription?.plan;

  const baseTabs = [
    { value: "profile", label: "Profile", icon: ShieldCheck },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "security", label: "Security", icon: Lock },
  ];

  const tabs = isVendor
    ? [...baseTabs, { value: "subscription", label: "Subscription", icon: CreditCard }]
    : baseTabs;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-6 mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account, preferences, and subscription
              </p>
            </div>

            {isVendor && plan && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="px-4 py-2 text-sm font-semibold text-white shadow-md">
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

      {/* Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="profile" className="w-full">
          {/* Tabs */}
          <TabsList
            className="
              w-full
              flex
              gap-2
              overflow-x-auto
              bg-muted
              p-1
              h-full
              rounded-xl
              lg:grid lg:grid-cols-4
            "
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
                    flex items-center justify-center lg:justify-start
                    gap-2
                    min-w-[120px] lg:min-w-0
                    px-4 py-3
                    rounded-lg
                    text-sm lg:text-base
                    font-medium
                    whitespace-nowrap
                    data-[state=active]:bg-chart-6
                    data-[state=active]:text-white
                    data-[state=active]:shadow-md
                    hover:bg-muted/70
                  "
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Panels */}
          <div className="mt-6 sm:mt-10">
            <TabsContent value="profile">
              <Profile isVendor={isVendor} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSetting />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>

            {isVendor && (
              <TabsContent value="subscription">
                <SubscriptionTab user={user} />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
