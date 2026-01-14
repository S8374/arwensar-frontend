/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/redux/features/admin/admin.api";
import { Badge } from "@/components/ui/badge";

export default function UserDetailsModal({
  userId,
}: {
  userId: string | null;
}) {
  const { data, isLoading } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  const user = data?.data;
  if (!user) return null;

  const isVendor = user.role === "VENDOR";
  const isSupplier = user.role === "SUPPLIER";

  return (
    <>
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
        <DialogDescription>
          Complete information about this user
        </DialogDescription>
      </DialogHeader>

      {/* SCROLLABLE CONTENT */}
      <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2 space-y-6">
        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Item label="User ID" value={user.id} />
          <Item label="Email" value={user.email} />
          <Item label="Phone" value={user.phoneNumber || "N/A"} />
          <Item label="Role">
            <Badge>{user.role}</Badge>
          </Item>
          <Item label="Status">
            <Badge
              variant={
                user.status === "ACTIVE"
                  ? "default"
                  : user.status === "SUSPENDED"
                  ? "destructive"
                  : "outline"
              }
            >
              {user.status}
            </Badge>
          </Item>
          <Item label="Verified">
            <Badge variant={user.isVerified ? "outline" : "secondary"}>
              {user.isVerified ? "Yes" : "No"}
            </Badge>
          </Item>
          <Item
            label="Created At"
            value={new Date(user.createdAt).toLocaleString()}
          />
        </Section>

        {/* SUBSCRIPTION */}
        {user.subscription && (
          <Section title="Subscription">
            <Item label="Plan ID" value={user.subscription.planId} />
            <Item label="Status" value={user.subscription.status} />
            <Item
              label="Billing Cycle"
              value={user.subscription.billingCycle}
            />
            <Item
              label="Period Start"
              value={new Date(
                user.subscription.currentPeriodStart
              ).toLocaleString()}
            />
            <Item
              label="Period End"
              value={new Date(
                user.subscription.currentPeriodEnd
              ).toLocaleString()}
            />
          </Section>
        )}

        {/* VENDOR PROFILE */}
        {isVendor && user.vendorProfile && (
          <Section title="Vendor Profile">
            <Item
              label="Company Name"
              value={user.vendorProfile.companyName}
            />
            <Item
              label="Business Email"
              value={user.vendorProfile.businessEmail}
            />
            <Item
              label="Vendor Active"
              value={user.vendorProfile.isActive ? "Yes" : "No"}
            />
          </Section>
        )}

        {/* VENDOR → SUPPLIERS LIST */}
        {isVendor &&
          user.vendorProfile?.suppliers &&
          user.vendorProfile.suppliers.length > 0 && (
            <Section title={`Suppliers (${user.vendorProfile.suppliers.length})`}>
              <div className="space-y-4">
                {user.vendorProfile.suppliers.map((supplier: any) => (
                  <div
                    key={supplier.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{supplier.name}</p>
                      <Badge
                        variant={
                          supplier.invitationStatus === "ACCEPTED"
                            ? "default"
                            : "outline"
                        }
                      >
                        {supplier.invitationStatus}
                      </Badge>
                    </div>

                    <Item label="Category" value={supplier.category} />
                    <Item
                      label="Contact Person"
                      value={supplier.contactPerson}
                    />
                    <Item label="Email" value={supplier.email} />
                    <Item label="Phone" value={supplier.phone} />
                    <Item
                      label="Risk Level"
                      value={supplier.riskLevel || "N/A"}
                    />
                    <Item
                      label="Criticality"
                      value={supplier.criticality}
                    />
                    <Item
                      label="Contract Period"
                      value={`${new Date(
                        supplier.contractStartDate
                      ).toLocaleDateString()} → ${new Date(
                        supplier.contractEndDate
                      ).toLocaleDateString()}`}
                    />
                    <Item
                      label="Assessment Completed"
                      value={
                        supplier.fullAssessmentCompleted ? "Yes" : "No"
                      }
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

        {/* SUPPLIER PROFILE */}
        {isSupplier && user.supplierProfile && (
          <Section title="Supplier Profile">
            <Item label="Supplier Name" value={user.supplierProfile.name} />
            <Item label="Email" value={user.supplierProfile.email} />
            <Item label="Supplier ID" value={user.supplierProfile.id} />
          </Section>
        )}

        {/* ACTIVITY COUNTS */}
        {user._count && (
          <Section title="Activity Summary">
            <Item
              label="Activity Logs"
              value={user._count.activityLogs}
            />
            <Item
              label="Notifications"
              value={user._count.notifications}
            />
          </Section>
        )}
      </div>

      <DialogFooter className="mt-4">
        <Button variant="outline">Close</Button>
      </DialogFooter>
    </>
  );
}

/* ---------- HELPERS ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-sm">{title}</h3>
      {children}
    </div>
  );
}

function Item({
  label,
  value,
  children,
}: {
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="font-medium text-sm">
        {children ?? value ?? "N/A"}
      </div>
    </div>
  );
}
