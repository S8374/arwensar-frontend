// src/pages/Unauthorized.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteLoadingIndicator } from "@/hooks/page-transition";
import { AlertCircle, ArrowLeft, Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
        <RouteLoadingIndicator/>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <CardHeader className="text-center pb-8 pt-10">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-destructive" />
          </div>

          <CardTitle className="text-3xl font-bold text-foreground">
            Access Restricted
          </CardTitle>

          <CardDescription className="text-base text-muted-foreground mt-3 max-w-sm mx-auto">
            You don't have permission to view this page. This area is restricted to authorized users only.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-10">
          {/* Info Boxes */}
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3 text-muted-foreground">
              <Lock className="w-4 h-4 mt-0.5 text-destructive" />
              <p>Your current role does not have access to this resource.</p>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <AlertCircle className="w-4 h-4 mt-0.5 text-orange-600" />
              <p>If you believe this is an error, please contact your administrator.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild className="flex-1" size="lg">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link to="/support">
                Contact Support
              </Link>
            </Button>
          </div>

          {/* Optional: Show current user/role (if available) */}
          <div className="text-center text-xs text-muted-foreground pt-6 border-t">
            <p>
              Logged in as <span className="font-medium text-foreground">Nayan Dhali</span> •{" "}
              <span className="font-medium">Vendor Access</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}