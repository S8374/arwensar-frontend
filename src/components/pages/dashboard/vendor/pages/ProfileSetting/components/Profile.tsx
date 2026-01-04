import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Building, Phone } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";
import { useGetUserProfileQuery } from "@/redux/features/user/user.api";

export default function Profile() {
 const { data: userData } = useGetUserProfileQuery(undefined);
  console.log("user data for profile",userData);
  const profileData = {
    firstName: userData?.data?.vendorProfile?.firstName || "",
    lastName: userData?.data?.vendorProfile?.lastName || "",
    email: userData?.data?.email || "", // This comes from user table
    companyName: userData?.data?.vendorProfile?.companyName || "", // Changed from 'company'
    contactNumber: userData?.data?.vendorProfile?.contactNumber || "", // Changed from 'phone'
    industryType: userData?.data?.vendorProfile?.industryType || "",
  };
  console.log("profile data",profileData);
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isSuccess,
    isError,
    isDirty,
    reset,
  } = useProfile(profileData);

  // Reset form when userData changes
  useEffect(() => {
    reset(profileData);
  }, [userData]);

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            Profile updated successfully!
          </p>
        </div>
      )}

      {/* Error Message */}
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            Failed to update profile. Please try again.
          </p>
        </div>
      )}

      {/* Section Title */}
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-chart-6" />
        <h2 className="text-xl font-semibold text-foreground">
          Profile Information
        </h2>
      </div>

      {/* Form Grid */}
       <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name - same */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              className="h-11 bg-muted/40 border-0 focus-visible:ring"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name - same */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              className="h-11 bg-muted/40 border-0 focus-visible:ring-1"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email - disabled field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="h-11 pl-10 bg-muted/40 border-0 focus-visible:ring"
                value={profileData.email}
                disabled
              />
            </div>
            <p className="text-xs text-muted-foreground">Contact support to change email</p>
          </div>

          {/* Company Name - changed from 'company' */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <Input
                id="companyName"
                className="h-11 pl-10 bg-muted/40 border-0 focus-visible:ring-1"
                {...register("companyName")}
              />
            </div>
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName.message}</p>
            )}
          </div>

          {/* Contact Number - changed from 'phone' */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <Input
                id="contactNumber"
                type="tel"
                className="h-11 pl-10 bg-muted/40 border-0 focus-visible:ring-1"
                {...register("contactNumber")}
              />
            </div>
            {errors.contactNumber && (
              <p className="text-sm text-red-500">{errors.contactNumber.message}</p>
            )}
          </div>

          {/* Industry Type - new field */}
          <div className="space-y-2">
            <Label htmlFor="industryType">Industry Type</Label>
            <Input
              id="industryType"
              className="h-11 bg-muted/40 border-0 focus-visible:ring-1"
              {...register("industryType")}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-start pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={!isDirty || isLoading}
            className="bg-chart-6 hover:bg-chart-6/90 font-medium px-8 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
