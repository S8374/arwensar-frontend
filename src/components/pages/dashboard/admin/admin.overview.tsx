/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminDashboardStatsQuery } from "@/redux/features/admin/admin.api";

const COLORS = ["#ef4444", "#facc15", "#22c55e"];

export default function AdminDashboard() {
  const { data, isLoading, isError } =
    useGetAdminDashboardStatsQuery(undefined);

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorState />;

  const stats = data?.data;

  const riskData = [
    { name: "High", value: stats.riskDistribution.high },
    { name: "Medium", value: stats.riskDistribution.medium },
    { name: "Low", value: stats.riskDistribution.low },
  ];

  return (
    <div className="space-y-8 max-w-screen-2xl mx-auto px-4 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500">Monitor your platform performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Vendors" value={stats.totalVendors} />
        <StatCard title="Suppliers" value={stats.totalSuppliers} />
        <StatCard
          title="Active Subscriptions"
          value={stats.totalActiveSubscriptions}
        />
        <StatCard title="Revenue ($)" value={stats.totalRevenue} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.revenueChart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {riskData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="py-2">Company</th>
                  <th>Email</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentVendors.map((vendor: any) => (
                  <tr key={vendor.id} className="border-b last:border-none">
                    <td className="py-3 font-medium">
                      {vendor.companyName}
                    </td>
                    <td>{vendor.email}</td>
                    <td>
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </CardContent>
    </Card>
  );
}

/* ---------------- Loading ---------------- */

function DashboardSkeleton() {
  return (
    <div className="space-y-6 px-4">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

/* ---------------- Error ---------------- */

function ErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Failed to load dashboard</h2>
        <p className="text-gray-500 mb-4">
          Please refresh or try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Retry
        </button>
      </Card>
    </div>
  );
}
