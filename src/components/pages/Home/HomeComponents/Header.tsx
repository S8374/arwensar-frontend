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

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Service" },
    { href: "/aboutus", label: "About US" },
    { href: "/pricing", label: "Pricing" },
    { href: "/demo", label: "Demo" },
    { href: "/contact", label: "Contact" },
  ];

  const { data } = useUserInfoQuery(undefined);

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <motion.section
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "w-full py-4 md:py-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="w-full h-16 md:h-20 px-4 md:px-8 py-3 md:py-4 bg-background/95 backdrop-blur-xl rounded-full border border-border/50 flex items-center justify-between shadow-2xl shadow-primary/5">
          <nav className="flex items-center justify-between w-full gap-1.5">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center relative">
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
                <span className="text-xl md:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  CyberNark
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex">
              <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm rounded-full px-2 py-1 border border-border/30">
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
                          "relative rounded-full px-4 py-2 transition-all duration-300",
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
                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                          />
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {data ? (
                <ProfileMenu />
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleNavigation("/loginvendor")}
                      className="rounded-full text-sm md:text-base hover:bg-accent/50"
                    >
                      Log in
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => handleNavigation("/signinvendor")}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-full font-medium text-sm md:text-base shadow-lg shadow-primary/20"
                    >
                      Sign up
                    </Button>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-10 w-10 md:h-12 md:w-12 border-primary/20 hover:border-primary/40"
                  >
                    <MenuIcon className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent 
                side="top" 
                className="pt-16 md:pt-20 border-border/50 bg-background/95 backdrop-blur-xl"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link to="/" className="flex items-center gap-3">
                        <img
                          src={logo}
                          alt="CyberNark"
                          className="w-10 h-10 md:w-12 md:h-12"
                        />
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                          CyberNark
                        </span>
                      </Link>
                    </motion.div>
                  </SheetTitle>
                </SheetHeader>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 md:mt-8 flex flex-col gap-2"
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
                          onClick={() => {
                            handleNavigation(link.href);
                            const sheetTrigger = document.querySelector('[data-state="open"]') as HTMLButtonElement;
                            if (sheetTrigger) {
                              sheetTrigger.click();
                            }
                          }}
                          className={cn(
                            "w-full justify-start px-4 md:px-6 py-6 rounded-xl text-base md:text-lg font-medium transition-all duration-300 group",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <ChevronRight className={cn(
                              "w-4 h-4 transition-transform duration-300",
                              active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )} />
                            {link.label}
                          </span>
                        </Button>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mt-6 md:mt-8 flex flex-col gap-2 md:gap-3"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      handleNavigation("/loginvendor");
                      const sheetTrigger = document.querySelector('[data-state="open"]') as HTMLButtonElement;
                      if (sheetTrigger) {
                        sheetTrigger.click();
                      }
                    }}
                    className="w-full rounded-full text-base md:text-lg py-6"
                  >
                    Log in
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      handleNavigation("/signinvendor");
                      const sheetTrigger = document.querySelector('[data-state="open"]') as HTMLButtonElement;
                      if (sheetTrigger) {
                        sheetTrigger.click();
                      }
                    }}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-full text-base md:text-lg py-6 shadow-lg shadow-primary/20"
                  >
                    Sign up
                  </Button>
                </motion.div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </motion.section>
  );
};

export default Header;