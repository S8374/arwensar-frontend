/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Building2, Mail, User, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCompleteSupplierRegistrationMutation, useVerifyInvitationQuery } from "@/redux/features/supplyer/supplyer.api";

const supplierRegistrationSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SupplierRegistrationFormData = z.infer<typeof supplierRegistrationSchema>;

interface InvitationData {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  vendor?: {
    companyName: string;
    firstName?: string;
    lastName?: string;
  };
}

export default function SignInSupplyer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // FIXED: Proper query hook usage
  const { data: verificationResult, refetch, isLoading: isVerifyingQuery } = useVerifyInvitationQuery(token || '', {
    skip: !token, // Skip query if no token
  });

  const [completeRegistration, { isLoading, isSuccess }] = useCompleteSupplierRegistrationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierRegistrationFormData>({
    resolver: zodResolver(supplierRegistrationSchema),
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationError("No invitation token provided");
        setIsVerifying(false);
        return;
      }

      try {
        // Trigger the query manually if it hasn't run
        if (!verificationResult && !isVerifyingQuery) {
          const result = await refetch().unwrap();
          
          if (result.data?.success && result.data.data) {
            setInvitationData(result.data.data.supplier || result.data.data);
          } else {
            setVerificationError(result.data?.message || "Invalid invitation link");
          }
        } else if (verificationResult) {
          // Use existing query result
          if (verificationResult.success && verificationResult.data) {
            setInvitationData(verificationResult.data.supplier || verificationResult.data);
          } else {
            setVerificationError(verificationResult.message || "Invalid invitation link");
          }
        }
        
        setIsVerifying(false);
      } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || "This invitation link is invalid or has expired";
        setVerificationError(errorMessage);
        toast.error(errorMessage);
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, verificationResult, isVerifyingQuery, refetch]);

  const onSubmit = async (data: SupplierRegistrationFormData) => {
    if (!token) return;

    try {
      const result = await completeRegistration({
        password: data.password,
        confirmPassword: data.confirmPassword,
        invitationToken: token,
      }).unwrap();
      
      if (result.success) {
        toast.success("Account created successfully! Redirecting to login...");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  const getVendorName = () => {
    if (!invitationData?.vendor) return "your partner company";
    return invitationData.vendor.companyName || 
           `${invitationData.vendor.firstName || ''} ${invitationData.vendor.lastName || ''}`.trim() || 
           "your partner company";
  };

  // Loading State
  if (isVerifying || isVerifyingQuery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-12 pb-16 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Verifying your invitation...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we validate your link</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (verificationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-red-200">
          <CardContent className="pt-12 pb-16 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Invitation Invalid</h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">{verificationError}</p>
            <Button 
              onClick={() => navigate('/')}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-green-200">
          <CardContent className="pt-12 pb-16 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome aboard! 🎉</h2>
            <p className="text-gray-600 mb-8">
              Your supplier account has been created successfully.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              You will be redirected to login in a moment...
            </p>
            <Button 
              onClick={() => navigate('/loginvendor')}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardHeader className="space-y-1 pb-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Supplier Registration</CardTitle>
          <CardDescription className="text-base mt-3">
            You've been invited by <span className="font-semibold text-primary">{getVendorName()}</span> 
            {" "}to join their supply chain network.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">


          {invitationData && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Supplier Profile
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-blue-800">
                  <Building2 className="w-4 h-4" />
                  <strong>Company:</strong> {invitationData.name}
                </p>
                <p className="flex items-center gap-2 text-blue-800">
                  <User className="w-4 h-4" />
                  <strong>Contact Person:</strong> {invitationData.contactPerson || "N/A"}
                </p>
                <p className="flex items-center gap-2 text-blue-800">
                  <Mail className="w-4 h-4" />
                  <strong>Email:</strong> {invitationData.email}
                </p>
              </div>
            </div>
          )}

       


          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Create Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 pr-12 text-base"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Use 8+ characters with uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 pr-12 text-base"
                  {...register("confirmPassword")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </a>
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Creating Your Account...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate('/loginvendor')}
                className="p-0 h-auto font-medium text-primary"
              >
                Sign in here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}