import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, Shield, Crown, Mail, ChevronRight } from "lucide-react";
import { useLogOutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { authApi } from "@/redux/features/auth/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSendVerificationMutation } from "@/redux/features/verification/verification.api";

export default function ProfileMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: userData, isLoading: userLoading } = useUserInfoQuery(undefined);
  const [logout, { isLoading: logoutLoading }] = useLogOutMutation();
  const [sendVerification, { isLoading: isSending }] = useSendVerificationMutation();

  const user = userData?.data;
  const userRole = user?.role; // "VENDOR" | "SUPPLYER" | "ADMIN"
  const isVerified = user?.isVerified || user?.emailVerified;
  const userEmail = user?.email || user?.vendor?.businessEmail || user?.supplier?.email;
  const vendor = user?.vendor;

  // Generate initials for Avatar
  const getInitials = () => {
    if (vendor?.firstName && vendor?.lastName) {
      return `${vendor.firstName[0]}${vendor.lastName[0]}`.toUpperCase();
    }
    if (vendor?.companyName) {
      return vendor.companyName
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  const displayName =
    vendor?.firstName && vendor?.lastName
      ? `${vendor.firstName} ${vendor.lastName}`
      : vendor?.companyName || user?.email || "User";

  // Role badge
  const getRoleBadge = () => {
    switch (userRole) {
      case "VENDOR":
        return (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Vendor
          </Badge>
        );
      case "SUPPLYER":
        return (
          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Shield className="w-3 h-3 mr-1" />
            Supplyer
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return <Badge variant="secondary">{userRole || "User"}</Badge>;
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      dispatch(authApi.util.resetApiState());
      navigate(userRole === "VENDOR" ? "/loginvendor" : "/loginvendor");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendVerification({ email: userEmail }).unwrap();
      toast.success("Verification email sent");
    } catch {
      toast.error("Failed to send verification email");
    }
  };

  const handleDashboardNavigation = () => {
    let dashboardPath = "/";
    
    switch (userRole) {
      case "VENDOR":
        dashboardPath = "/vendor/analytics";
        break;
      case "SUPPLIER":
        dashboardPath = "/supplier/analytics";
        break;
      case "ADMIN":
        dashboardPath = "/admin/dashboard";
        break;
      default:
        dashboardPath = "/dashboard";
    }
    
    navigate(dashboardPath);
  };

  if (userLoading) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
        <Avatar className="h-10 w-10 animate-pulse">
          <AvatarFallback className="bg-muted" />
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative z-50  h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all p-0"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={vendor?.companyLogo || undefined} />
            <AvatarFallback className="text-lg font-bold bg-primary text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-2 py-3">
          <Avatar className="h-14 w-14 ring-4 ring-background">
            <AvatarImage src={vendor?.companyLogo || undefined} />
            <AvatarFallback className="text-lg font-bold bg-primary text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-lg truncate">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
            <div className="flex items-center gap-2 mt-2">
              {getRoleBadge()}
              {isVerified ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  Unverified
                </Badge>
              )}
            </div>
          </div>
        </div>

        {vendor?.companyName && (
          <>
            <DropdownMenuSeparator className="my-3" />
            <div className="px-3 text-xs text-muted-foreground">
              <span className="font-medium">Company:</span> {vendor.companyName}
            </div>
          </>
        )}

        <DropdownMenuSeparator className="my-3" />

        <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Dashboard
        </DropdownMenuLabel>

        {/* Role-based dashboard link - Fixed click handler */}
        <DropdownMenuItem 
          onClick={handleDashboardNavigation}
          className="rounded-xl cursor-pointer flex items-center justify-between hover:bg-accent transition-colors"
        >
          <div className="flex items-center">
            <Settings className="w-4 h-4 mr-3 text-primary" />
            <span className="font-medium">
              {userRole === "VENDOR" && "Vendor Dashboard"}
              {userRole === "SUPPLIER" && "Supplier Dashboard"}
              {userRole === "ADMIN" && "Admin Dashboard"}
              {!userRole && "Dashboard"}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-3" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={logoutLoading}
          className="rounded-xl cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="font-medium">{logoutLoading ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>

        {/* Email verification */}
        {!isVerified && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <p className="text-xs text-muted-foreground mb-2">
                Verify your email to access all features
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleSendVerification}
                disabled={isSending}
              >
                <Mail className="mr-2 h-3 w-3" />
                {isSending ? "Sending..." : "Send Verification Link"}
              </Button>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}