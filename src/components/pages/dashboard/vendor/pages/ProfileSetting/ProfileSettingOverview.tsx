// components/settings/ProfileSettingOverview.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "./components/Profile";
import NotificationSetting from "./components/NotificationSetting";
import SecuritySettings from "./components/SecuritySettings";

export default function ProfileSettingOverview() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Tabs defaultValue="profile" className="w-full">
          {/* Responsive Tabs */}
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-2 p-1 bg-muted/60 rounded-xl h-auto">
            <TabsTrigger
              value="profile"
              className="rounded-lg py-3 px-4 text-sm sm:text-base font-medium transition-all data-[state=active]:bg-chart-6 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-lg py-3 px-4 text-sm sm:text-base font-medium transition-all data-[state=active]:bg-chart-6 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-lg py-3 px-4 text-sm sm:text-base font-medium transition-all data-[state=active]:bg-chart-6 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/80"
            >
              Security
            </TabsTrigger>
          </TabsList>

          {/* Tab Panels */}
          <div className="mt-10 sm:mt-12">
            <TabsContent value="profile" className="mt-0">
              <Profile />
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <NotificationSetting />
            </TabsContent>
            <TabsContent value="security" className="mt-0">
              <SecuritySettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}