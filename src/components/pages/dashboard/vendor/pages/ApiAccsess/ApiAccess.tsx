import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Link, Shield } from "lucide-react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getPlanFeatures } from "@/lib/planFeatures";
import FeatureRestricted from "@/components/upgrade/FeatureRestricted";

export default function ApiAccess() {
  const { data: userData } = useUserInfoQuery(undefined);
  const plan = userData?.data?.subscription;

  const permissions = getPlanFeatures(plan);
  const apiLink = "https://dev.api.cybernark.com";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
      })
      .catch(() => {
        alert("Failed to copy!");
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">API Access</h2>
        <p className="text-sm text-muted-foreground">
          Use the API endpoint to integrate your system with our platform
        </p>
      </div>

      {/* Conditional Rendering based on API Access */}
      {permissions.apiAccess || permissions.isAllFeaturesAccessible ? (
        <>
          {/* API Link Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                API Base URL
              </CardTitle>
              <CardDescription>
                All API requests should be sent to this base URL
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* API Link Display */}
              <div className="flex items-center gap-2">
                <Input value={apiLink} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                {copied && <span className="text-sm text-green-500">Copied!</span>}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <Badge variant="success">Live</Badge>
                <span className="text-sm text-muted-foreground">Version: v1</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Always use HTTPS for API requests</li>
                <li>Store API keys securely</li>
                <li>Do not expose API credentials in frontend code</li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <FeatureRestricted
          title="API Access"
          description="Enable API integration to connect your system with our platform."
          requiredPlan="enterprise"
          feature="apiAccess"
        />
      )}
    </div>
  );
}
