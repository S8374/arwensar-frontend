import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, CreditCard, Calendar, Users } from "lucide-react";

export default function SubscriptionBilling() {
  return (
    <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Subscription & Billing</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your subscription and billing preferences
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Download Invoice
        </Button>
      </div>

      {/* Current Plan Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                This According to plans
              </h3>
              <p className="text-sm text-muted-foreground">
                You are currently on the <strong>Professional</strong> plan
              </p>
            </div>
            <Badge className="bg-chart-6/30 text-foreground px-3 py-1">
              Active
            </Badge>
          </div>

          {/* Plan Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4 border-t border-b border-muted">
            {/* Monthly Cost */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <CreditCard className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Cost</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">€199</p>
              </div>
            </div>

            {/* Client Limit */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Client Limit</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">25 Suppliers</p>
              </div>
            </div>

            {/* Next Billing Date */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">Apr 1, 2026</p>
              </div>
            </div>
          </div>

          {/* Usage + Manage Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Currently using</span>
              <strong className="text-foreground">127 of 200</strong>
              <span>clients</span>
            </div>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}