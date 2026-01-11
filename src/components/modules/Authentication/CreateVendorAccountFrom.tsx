// src/components/auth/CreateVendorAccountForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useVendorFormSignin } from "@/hooks/useVendorFormSignin";
import { NavLink } from "react-router-dom";

export default function CreateVendorAccountForm() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isError,
    showPassword,
    togglePasswordVisibility,
    setValue,
    watch,
  } = useVendorFormSignin();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          Failed to create account. Please try again.
        </div>
      )}

      {/* Personal Email (for login) */}
      <div className="space-y-2">
        <Label htmlFor="email">Personal Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email")}
          className="h-12"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            {...register("password")}
            className="h-12 pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Must contain uppercase, lowercase, and numbers
        </p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your password"
          {...register("confirmPassword")}
          className="h-12"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="John"
            {...register("firstName")}
            className="h-12"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            {...register("lastName")}
            className="h-12"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          placeholder="Acme Corporation"
          {...register("companyName")}
          className="h-12"
        />
        {errors.companyName && (
          <p className="text-sm text-destructive">{errors.companyName.message}</p>
        )}
      </div>

      {/* Business Email */}
      <div className="space-y-2">
        <Label htmlFor="businessEmail">Business Email *</Label>
        <Input
          id="businessEmail"
          type="email"
          placeholder="contact@company.com"
          {...register("businessEmail")}
          className="h-12"
        />
        {errors.businessEmail && (
          <p className="text-sm text-destructive">{errors.businessEmail.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          This email will be used for business communications
        </p>
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number *</Label>
        <Input
          id="contactNumber"
          placeholder="+1 (555) 000-0000"
          {...register("contactNumber")}
          className="h-12"
        />
        {errors.contactNumber && (
          <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
        )}
      </div>

      {/* Industry Type */}
      <div className="space-y-2">
        <Label>Industry Type *</Label>
        <Select onValueChange={(value) => setValue("industryType", value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Energy & Utilities">Energy & Utilities</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.industryType && (
          <p className="text-sm text-destructive">{errors.industryType.message}</p>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="termsAccepted"
          checked={watch("termsAccepted")}
          onCheckedChange={(checked) => setValue("termsAccepted", checked as boolean)}
        />
        <Label htmlFor="termsAccepted" className="text-sm font-normal leading-tight cursor-pointer">
          I agree to the{" "}
      
            Terms of Service
    
          and{" "}
          <NavLink to="/privacy-policy" className="text-primary underline">
            Privacy Policy
          </NavLink>
        </Label>
      </div>
      {errors.termsAccepted && (
        <p className="text-sm text-destructive -mt-2">
          {errors.termsAccepted.message}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl"
      >
        {isLoading ? "Creating Account..." : "Create Vendor Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <NavLink to="/loginvendor" className="font-medium text-primary hover:underline">
          Sign in
        </NavLink>
      </p>
    </form>
  );
}