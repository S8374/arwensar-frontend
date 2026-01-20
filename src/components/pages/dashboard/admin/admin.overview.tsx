/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminDashboardStatsQuery } from "@/redux/features/admin/admin.api";

// Optional: install lucide-react → npm install lucide-react
import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading, isError } = useGetAdminDashboardStatsQuery(undefined);

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data?.data) return <ErrorState />;

  const stats = data.data;

  // Optional: you can compute real percentage change from previous period
  const revenueTrend = stats.totalRevenue > 10000 ? "up" : "down"; // placeholder

  return (
    <div className="min-h-screen ">
      <div className="space-y-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pt-8">
          <h1 className="text-4xl font-bold tracking-tight ">
          Admin  Dashboard Overview
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Real-time insights into your platform performance
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Vendors"
            value={stats.totalVendors}
            icon={<Building2 className="h-6 w-6 text-indigo-600" />}
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Suppliers"
            value={stats.totalSuppliers}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            trend="up"
            trendValue="+8%"
          />
          <StatCard
            title="Active Subscriptions"
            value={stats.totalActiveSubscriptions}
            icon={<CreditCard className="h-6 w-6 text-emerald-600" />}
            trend="up"
            trendValue="+15%"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-amber-600" />}
            trend={revenueTrend}
            trendValue={revenueTrend === "up" ? "+18%" : "-3%"}
          />
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Chart – larger, more prominent */}
          <Card className="lg:col-span-8 shadow-xl border-none ring-1 ring-gray-200/50 dark:ring-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                Monthly Revenue Trend
                <TrendingUp className="h-5 w-5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-96 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.revenueChart}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 13 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 13 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.98)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ fontWeight: 600, color: "#1f2937" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 8, stroke: "#6366f1", strokeWidth: 3 }}
                    fill="url(#revenueGradient)"
                    strokeLinecap="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Vendors – moved to side on large screens */}
          <Card className="lg:col-span-4 shadow-xl border-none ring-1 ring-gray-200/50 dark:ring-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Recent Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 dark:bg-gray-800/50 sticky top-0">
                    <tr className="text-left text-gray-600 dark:text-gray-300">
                      <th className="py-3 px-4 font-medium">Company</th>
                      <th className="py-3 px-4 font-medium">Email</th>
                      <th className="py-3 px-4 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {stats.recentVendors.map((vendor: any) => (
                      <tr
                        key={vendor.id}
                        className="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          {vendor.companyName}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {vendor.email}
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-500">
                          {new Date(vendor.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: "up" | "down";
  trendValue: string;
}) {

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80 backdrop-blur-sm ring-1 ring-gray-200/60 dark:ring-gray-800/60">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h2 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">
              {value}
            </h2>
          </div>
          <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/40 dark:to-purple-950/40 p-3">
            {icon}
          </div>
        </div>
    
      </CardContent>
    </Card>
  );
}

/* ──────────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 space-y-10">
      <Skeleton className="h-12 w-80 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-8 h-96 rounded-2xl" />
        <Skeleton className="lg:col-span-4 h-96 rounded-2xl" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <Card className="max-w-md w-full p-10 text-center shadow-2xl border-none bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Failed to load dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Something went wrong. Please try again or contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
        >
          Retry
        </button>
      </Card>
    </div>
  );
}



















//Infeauture good design it is .




// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Users,
//   Building2,
//   CreditCard,
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Package,
//   Download,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   BarChart3,
//   PieChart as PieChartIcon,
//   LineChart as LineChartIcon,
// } from "lucide-react";
// import { useGetAdminDashboardStatsQuery } from "@/redux/features/admin/admin.api";
// import { format } from "date-fns";

// // Mock data for demonstration
// const STATS_GROWTH = {
//   vendors: 12.5,
//   suppliers: 8.3,
//   subscriptions: 15.2,
//   revenue: 18.7,
// };

// const CHART_COLORS = {
//   primary: "#6366f1",
//   secondary: "#10b981",
//   accent: "#f59e0b",
//   danger: "#ef4444",
//   purple: "#8b5cf6",
//   pink: "#ec4899",
// };

// const PIE_CHART_COLORS = [
//   "#6366f1",
//   "#10b981",
//   "#f59e0b",
//   "#ef4444",
//   "#8b5cf6",
//   "#ec4899",
// ];

// export default function AdminDashboard() {
//   const [timeRange, setTimeRange] = useState("month");
//   const { data, isLoading, isError, refetch } =
//     useGetAdminDashboardStatsQuery(undefined);

//   useEffect(() => {
//     // Auto-refresh every 5 minutes
//     const interval = setInterval(() => {
//       refetch();
//     }, 300000);

//     return () => clearInterval(interval);
//   }, [refetch]);

//   if (isLoading) return <DashboardSkeleton />;
//   if (isError) return <ErrorState onRetry={refetch} />;

//   const stats = data?.data || {};
//   const formattedStats = {
//     ...stats,
//     revenueChart: stats.revenueChart || generateMockRevenueData(timeRange),
//     subscriptionGrowth: stats.subscriptionGrowth || generateMockGrowthData(),
//     vendorDistribution: stats.vendorDistribution || generateMockDistributionData(),
//   };

//   return (
//     <div className="space-y-8 max-w-screen-2xl mx-auto px-4 pb-12">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Dashboard Overview</h1>
//           <p className="text-gray-500">
//             Welcome back! Here's what's happening with your platform today.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger className="w-32">
//               <SelectValue placeholder="Select range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="week">Last Week</SelectItem>
//               <SelectItem value="month">Last Month</SelectItem>
//               <SelectItem value="quarter">Last Quarter</SelectItem>
//               <SelectItem value="year">Last Year</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="outline" size="icon" onClick={() => refetch()}>
//             <RefreshCw className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" className="gap-2">
//             <Download className="h-4 w-4" />
//             Export
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Vendors"
//           value={formattedStats.totalVendors}
//           change={STATS_GROWTH.vendors}
//           icon={<Users className="h-5 w-5" />}
//           color="blue"
//         />
//         <StatCard
//           title="Total Suppliers"
//           value={formattedStats.totalSuppliers}
//           change={STATS_GROWTH.suppliers}
//           icon={<Building2 className="h-5 w-5" />}
//           color="green"
//         />
//         <StatCard
//           title="Active Subscriptions"
//           value={formattedStats.totalActiveSubscriptions}
//           change={STATS_GROWTH.subscriptions}
//           icon={<CreditCard className="h-5 w-5" />}
//           color="purple"
//         />
//         <StatCard
//           title="Total Revenue"
//           value={formattedStats.totalRevenue}
//           change={STATS_GROWTH.revenue}
//           icon={<DollarSign className="h-5 w-5" />}
//           color="amber"
//           isCurrency
//         />
//       </div>

//       {/* Charts Section */}
//       <Tabs defaultValue="revenue" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
//           <TabsTrigger value="revenue" className="gap-2">
//             <LineChartIcon className="h-4 w-4" />
//             Revenue
//           </TabsTrigger>
//           <TabsTrigger value="subscriptions" className="gap-2">
//             <BarChart3 className="h-4 w-4" />
//             Subscriptions
//           </TabsTrigger>
//           <TabsTrigger value="distribution" className="gap-2">
//             <PieChartIcon className="h-4 w-4" />
//             Distribution
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="revenue" className="space-y-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <Card className="lg:col-span-2">
//               <CardHeader>
//                 <CardTitle>Revenue Overview</CardTitle>
//                 <CardDescription>
//                   Monthly revenue trends and projections
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={formattedStats.revenueChart}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis
//                       dataKey="month"
//                       stroke="#6b7280"
//                       fontSize={12}
//                       tickLine={false}
//                       axisLine={false}
//                     />
//                     <YAxis
//                       stroke="#6b7280"
//                       fontSize={12}
//                       tickLine={false}
//                       axisLine={false}
//                       tickFormatter={(value) => `$${value}`}
//                     />
//                     <Tooltip
//                       formatter={(value) => [`$${value}`, "Revenue"]}
//                       labelStyle={{ color: "#374151", fontWeight: 600 }}
//                       contentStyle={{
//                         borderRadius: "0.5rem",
//                         border: "1px solid #e5e7eb",
//                       }}
//                     />
//                     <Legend />
//                     <Area
//                       type="monotone"
//                       dataKey="revenue"
//                       stroke={CHART_COLORS.primary}
//                       fill={CHART_COLORS.primary}
//                       fillOpacity={0.1}
//                       strokeWidth={2}
//                       name="Revenue"
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="target"
//                       stroke={CHART_COLORS.secondary}
//                       fill={CHART_COLORS.secondary}
//                       fillOpacity={0.1}
//                       strokeWidth={2}
//                       strokeDasharray="5 5"
//                       name="Target"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Revenue Insights</CardTitle>
//                 <CardDescription>Key metrics</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-500">Avg. Monthly</span>
//                     <span className="font-semibold">
//                       ${calculateAverage(formattedStats.revenueChart, "revenue")}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-500">Growth Rate</span>
//                     <Badge variant="outline" className="bg-green-50 text-green-700">
//                       <TrendingUp className="h-3 w-3 mr-1" />
//                       +{STATS_GROWTH.revenue}%
//                     </Badge>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-500">Target Achievement</span>
//                     <Badge variant="outline" className="bg-blue-50 text-blue-700">
//                       {calculateTargetAchievement(formattedStats.revenueChart)}%
//                     </Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="subscriptions" className="space-y-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <Card className="lg:col-span-2">
//               <CardHeader>
//                 <CardTitle>Subscription Growth</CardTitle>
//                 <CardDescription>Monthly subscription trends</CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={formattedStats.subscriptionGrowth}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                     <XAxis
//                       dataKey="month"
//                       stroke="#6b7280"
//                       fontSize={12}
//                       tickLine={false}
//                       axisLine={false}
//                     />
//                     <YAxis
//                       stroke="#6b7280"
//                       fontSize={12}
//                       tickLine={false}
//                       axisLine={false}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         borderRadius: "0.5rem",
//                         border: "1px solid #e5e7eb",
//                       }}
//                     />
//                     <Legend />
//                     <Bar
//                       dataKey="new"
//                       fill={CHART_COLORS.primary}
//                       name="New Subscriptions"
//                       radius={[4, 4, 0, 0]}
//                     />
//                     <Bar
//                       dataKey="churned"
//                       fill={CHART_COLORS.danger}
//                       name="Churned"
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Subscription Stats</CardTitle>
//                 <CardDescription>Current status</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//                     <div>
//                       <p className="text-sm text-blue-700">Active</p>
//                       <p className="text-xl font-bold">
//                         {formattedStats.totalActiveSubscriptions}
//                       </p>
//                     </div>
//                     <CheckCircle className="h-8 w-8 text-blue-600" />
//                   </div>
//                   <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
//                     <div>
//                       <p className="text-sm text-amber-700">Trial</p>
//                       <p className="text-xl font-bold">
//                         {formattedStats.trialSubscriptions || 12}
//                       </p>
//                     </div>
//                     <Clock className="h-8 w-8 text-amber-600" />
//                   </div>
//                   <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
//                     <div>
//                       <p className="text-sm text-red-700">Cancelled</p>
//                       <p className="text-xl font-bold">
//                         {formattedStats.cancelledSubscriptions || 5}
//                       </p>
//                     </div>
//                     <AlertCircle className="h-8 w-8 text-red-600" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="distribution" className="space-y-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <Card className="lg:col-span-2">
//               <CardHeader>
//                 <CardTitle>Plan Distribution</CardTitle>
//                 <CardDescription>Subscription plan breakdown</CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={formattedStats.vendorDistribution}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={(entry) => `${entry.name}: ${entry.value}`}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {formattedStats.vendorDistribution.map((_: any, index: number) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       formatter={(value, name) => [`${value} vendors`, name]}
//                     />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Top Plans</CardTitle>
//                 <CardDescription>Most popular subscription plans</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   {formattedStats.vendorDistribution
//                     .sort((a: any, b: any) => b.value - a.value)
//                     .slice(0, 4)
//                     .map((plan: any, index: number) => (
//                       <div
//                         key={plan.name}
//                         className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div
//                             className="h-3 w-3 rounded-full"
//                             style={{
//                               backgroundColor:
//                                 PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
//                             }}
//                           />
//                           <div>
//                             <p className="font-medium">{plan.name}</p>
//                             <p className="text-sm text-gray-500">
//                               {plan.value} vendors
//                             </p>
//                           </div>
//                         </div>
//                         <Badge variant="outline">
//                           {Math.round((plan.value / formattedStats.totalVendors) * 100)}%
//                         </Badge>
//                       </div>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Recent Activity & Quick Stats */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Recent Vendors</CardTitle>
//             <CardDescription>Latest vendor registrations</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {formattedStats.recentVendors.slice(0, 5).map((vendor: any) => (
//                 <div
//                   key={vendor.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                       <Building2 className="h-5 w-5 text-indigo-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{vendor.companyName}</p>
//                       <p className="text-sm text-gray-500">{vendor.email}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-500">
//                       {format(new Date(vendor.createdAt), "MMM d, yyyy")}
//                     </p>
//                     <Badge variant="outline" className="mt-1">
//                       {vendor.plan || "Free Plan"}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button variant="ghost" className="w-full">
//               View All Vendors
//             </Button>
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Stats</CardTitle>
//             <CardDescription>Platform performance</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <Package className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm">Avg. Suppliers/Vendor</span>
//                 </div>
//                 <span className="font-semibold">
//                   {formattedStats.totalSuppliers / formattedStats.totalVendors || 0}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <CreditCard className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm">Avg. Revenue/Subscription</span>
//                 </div>
//                 <span className="font-semibold">
//                   ${formattedStats.avgRevenuePerSubscription || 0}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <Users className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm">Conversion Rate</span>
//                 </div>
//                 <Badge variant="outline" className="bg-green-50 text-green-700">
//                   {formattedStats.conversionRate || "12.5"}%
//                 </Badge>
//               </div>
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <Clock className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm">Avg. Session Duration</span>
//                 </div>
//                 <span className="font-semibold">
//                   {formattedStats.avgSessionDuration || "4m 32s"}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// /* ---------------- Stat Card Component ---------------- */

// function StatCard({
//   title,
//   value,
//   change,
//   icon,
//   color = "blue",
//   isCurrency = false,
// }: {
//   title: string;
//   value: number;
//   change: number;
//   icon: React.ReactNode;
//   color: "blue" | "green" | "purple" | "amber" | "red";
//   isCurrency?: boolean;
// }) {
//   const colorClasses = {
//     blue: "bg-blue-50 text-blue-700 border-blue-200",
//     green: "bg-green-50 text-green-700 border-green-200",
//     purple: "bg-purple-50 text-purple-700 border-purple-200",
//     amber: "bg-amber-50 text-amber-700 border-amber-200",
//     red: "bg-red-50 text-red-700 border-red-200",
//   };

//   const formatValue = (val: number) => {
//     if (isCurrency) {
//       return `$${val.toLocaleString()}`;
//     }
//     return val.toLocaleString();
//   };

//   return (
//     <Card className="overflow-hidden transition-all hover:shadow-lg">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-medium text-gray-600">{title}</p>
//             <h3 className="text-3xl font-bold mt-2">{formatValue(value)}</h3>
//             <div className="flex items-center gap-1 mt-2">
//               {change > 0 ? (
//                 <TrendingUp className="h-4 w-4 text-green-600" />
//               ) : (
//                 <TrendingDown className="h-4 w-4 text-red-600" />
//               )}
//               <span
//                 className={`text-sm font-medium ${
//                   change > 0 ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 {change > 0 ? "+" : ""}
//                 {change}%
//               </span>
//               <span className="text-sm text-gray-500">from last month</span>
//             </div>
//           </div>
//           <div
//             className={`p-3 rounded-full ${colorClasses[color]} border`}
//           >
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// /* ---------------- Helper Functions ---------------- */

// function generateMockRevenueData(range: string) {
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   const base = range === "year" ? months : months.slice(0, 6);
  
//   return base.map((month, i) => ({
//     month,
//     revenue: 50000 + Math.random() * 50000,
//     target: 70000 + i * 5000,
//   }));
// }

// function generateMockGrowthData() {
//   return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => ({
//     month,
//     new: Math.floor(Math.random() * 50) + 20,
//     churned: Math.floor(Math.random() * 10) + 5,
//   }));
// }

// function generateMockDistributionData() {
//   return [
//     { name: "Free", value: 120 },
//     { name: "Starter", value: 85 },
//     { name: "Professional", value: 60 },
//     { name: "Enterprise", value: 25 },
//     { name: "Custom", value: 10 },
//   ];
// }

// function calculateAverage(data: any[], key: string) {
//   if (!data.length) return 0;
//   const sum = data.reduce((acc, item) => acc + (item[key] || 0), 0);
//   return Math.round(sum / data.length).toLocaleString();
// }

// function calculateTargetAchievement(data: any[]) {
//   if (!data.length) return 0;
//   const totalRevenue = data.reduce((acc, item) => acc + (item.revenue || 0), 0);
//   const totalTarget = data.reduce((acc, item) => acc + (item.target || 0), 0);
//   return Math.round((totalRevenue / totalTarget) * 100);
// }

// /* ---------------- Loading Skeleton ---------------- */

// function DashboardSkeleton() {
//   return (
//     <div className="space-y-8 px-4 pb-12">
//       {/* Header Skeleton */}
//       <div className="flex justify-between items-center">
//         <div>
//           <Skeleton className="h-8 w-64 mb-2" />
//           <Skeleton className="h-4 w-96" />
//         </div>
//         <div className="flex gap-3">
//           <Skeleton className="h-10 w-32" />
//           <Skeleton className="h-10 w-10" />
//           <Skeleton className="h-10 w-24" />
//         </div>
//       </div>

//       {/* Stats Grid Skeleton */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <Card key={i} className="overflow-hidden">
//             <CardContent className="p-6">
//               <div className="flex justify-between items-center">
//                 <div className="space-y-3">
//                   <Skeleton className="h-4 w-32" />
//                   <Skeleton className="h-8 w-24" />
//                   <Skeleton className="h-3 w-48" />
//                 </div>
//                 <Skeleton className="h-12 w-12 rounded-full" />
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Chart Skeleton */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <Skeleton className="h-6 w-48 mb-2" />
//             <Skeleton className="h-4 w-64" />
//           </CardHeader>
//           <CardContent className="h-80">
//             <Skeleton className="h-full w-full" />
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <Skeleton className="h-6 w-32 mb-2" />
//             <Skeleton className="h-4 w-48" />
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <Skeleton key={i} className="h-16 w-full" />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Vendors Skeleton */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <Skeleton className="h-6 w-48 mb-2" />
//             <Skeleton className="h-4 w-64" />
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {Array.from({ length: 5 }).map((_, i) => (
//                 <Skeleton key={i} className="h-20 w-full" />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <Skeleton className="h-6 w-48 mb-2" />
//             <Skeleton className="h-4 w-64" />
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <Skeleton key={i} className="h-12 w-full" />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// /* ---------------- Error State ---------------- */

// function ErrorState({ onRetry }: { onRetry: () => void }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <Card className="max-w-md w-full p-8 text-center border-red-200">
//         <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
//           <AlertCircle className="h-8 w-8 text-red-600" />
//         </div>
//         <h2 className="text-xl font-bold mb-2">Unable to Load Dashboard</h2>
//         <p className="text-gray-500 mb-6">
//           There was an error loading your dashboard data. Please check your connection and try again.
//         </p>
//         <div className="flex flex-col sm:flex-row gap-3 justify-center">
//           <Button onClick={onRetry} className="gap-2">
//             <RefreshCw className="h-4 w-4" />
//             Retry
//           </Button>
//           <Button variant="outline" onClick={() => window.location.reload()}>
//             Refresh Page
//           </Button>
//         </div>
//         <p className="text-sm text-gray-500 mt-6">
//           If the problem persists, please contact support.
//         </p>
//       </Card>
//     </div>
//   );
// }