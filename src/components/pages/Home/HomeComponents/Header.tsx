/* eslint-disable react-hooks/set-state-in-effect */
import { Menu as MenuIcon, ChevronRight } from "lucide-react";
import logo from "@/assets/logo/logo.svg";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import ProfileMenu from "../../dashboard/vendor/model/ProfileMenu";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

// Reusable Default Profile Avatar (shown while loading)
const DefaultProfileAvatar = () => (
  <Button
    variant="ghost"
    className="relative h-11 w-11 rounded-full p-0 
               transition-transform duration-200 ease-out
               hover:scale-110 active:scale-95
               focus-visible:outline-none 
               focus-visible:ring-2 focus-visible:ring-primary 
               focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    <Avatar className="h-11 w-11">
      <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-bold text-[10px]">
        Loading
      </AvatarFallback>
    </Avatar>
  </Button>
);

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Service" },
    { href: "/aboutus", label: "About US" },
    { href: "/pricing", label: "Pricing" },
    { href: "/demo", label: "Demo" },
    { href: "/contact", label: "Contact" },
  ];

  const { data, isLoading, refetch } = useUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    setIsMounted(true);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetch]);

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Unified profile rendering (desktop + mobile)
  const renderProfile = () => {
    if (isLoading) {
      return <DefaultProfileAvatar />;
    }
    if (data) {
      return <ProfileMenu />;
    }
    return null; // Not logged in → hide avatar
  };

  return (
    <div className="w-full flex justify-center py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 fixed top-4 md:top-6 left-0 right-0 z-50 pointer-events-none">
        <div className=" mx-auto pointer-events-auto">
          <div className="h-16 md:h-20 px-6 md:px-10 py-3 md:py-4 bg-background/95 backdrop-blur-xl rounded-full border border-border/50 flex items-center justify-between shadow-2xl shadow-primary/5">
            <nav className="flex items-center justify-between w-full">

              {/* Logo */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-9 h-9 relative flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-primary/10 rounded-full"
                    />
                    <img
                      src={logo}
                      alt="CyberNark Logo"
                      className="w-full h-full object-contain relative z-10"
                    />
                  </div>
                  <span className="md:text-xl text-sm font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    CyberNark
                  </span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center">
                <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-full px-3 py-2 border border-border/30">
                  {navigationLinks.map((link, index) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNavigation(link.href)}
                          className={cn(
                            "relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                            active
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {active && (
                            <motion.div
                              layoutId="activeNavItem"
                              className="absolute inset-0 bg-primary/10 rounded-full"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <span className="relative z-10">{link.label}</span>
                          {active && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                            />
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Auth / Profile */}
              <div className="hidden lg:flex items-center gap-4">
                {isLoading ? (
                  <DefaultProfileAvatar />
                ) : data ? (
                  <ProfileMenu />
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => handleNavigation("/loginvendor")}
                        className="rounded-full px-6 py-2.5 text-sm font-medium hover:bg-accent/50"
                      >
                        Log in
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        onClick={() => handleNavigation("/signinvendor")}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-full px-7 py-2.5 font-medium shadow-lg shadow-primary/20"
                      >
                        Sign up
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Mobile Menu */}
              <div className="lg:hidden flex items-center gap-3">
                {/* Mobile Profile Avatar */}
                {renderProfile()}

                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10 border-primary/20 hover:border-primary/40"
                      >
                        <MenuIcon className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </SheetTrigger>

                  <SheetContent
                    side="top"
                    className="pt-16 border-border/50 bg-background/95 backdrop-blur-xl"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-left">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3"
                          >
                            <img src={logo} alt="CyberNark" className="w-12 h-12" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                              CyberNark
                            </span>
                          </Link>
                        </motion.div>
                      </SheetTitle>
                    </SheetHeader>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 flex flex-col gap-2"
                    >
                      {navigationLinks.map((link, index) => {
                        const active = isActive(link.href);
                        return (
                          <motion.div
                            key={link.href}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 10 }}
                          >
                            <Button
                              variant="ghost"
                              size="lg"
                              onClick={() => handleNavigation(link.href)}
                              className={cn(
                                "w-full justify-start px-6 py-6 rounded-xl text-lg font-medium group",
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              )}
                            >
                              <span className="flex items-center gap-4">
                                <ChevronRight
                                  className={cn(
                                    "w-5 h-5 transition-transform",
                                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                  )}
                                />
                                {link.label}
                              </span>
                            </Button>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Mobile Auth Buttons */}
                    {!isLoading && !data && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex flex-col gap-3"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => handleNavigation("/loginvendor")}
                          className="w-full rounded-full py-6 text-lg"
                        >
                          Log in
                        </Button>
                        <Button
                          size="lg"
                          onClick={() => handleNavigation("/signinvendor")}
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-full py-6 shadow-lg shadow-primary/20 text-lg"
                        >
                          Sign up
                        </Button>
                      </motion.div>
                    )}

                    {/* Logged-in user info in mobile menu */}
                    {!isLoading && data && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 px-6 py-5 bg-accent/30 rounded-2xl"
                      >
                        <p className="text-sm text-muted-foreground mb-3">Logged in as:</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-lg">
                              {data?.name || data?.email || "User"}
                            </p>
                            <p className="text-sm text-muted-foreground">{data?.email}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleNavigation("/dashboard");
                              setIsMobileMenuOpen(false);
                            }}
                            className="rounded-full px-5"
                          >
                            Dashboard
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </SheetContent>
                </Sheet>
              </div>

            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;