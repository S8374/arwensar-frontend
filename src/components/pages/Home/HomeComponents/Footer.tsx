import logo from "@/assets/logo/logo.svg";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "Our Vision", to: "/aboutus" },
    { name: "Contact", to: "/contact" },
  ];

  const supportLinks = [
    { name: "Privacy Policy", to: "/privacy-policy" },
    { name: "Our Service", to: "/services" },
    { name: "About Us", to: "/aboutus" },
  ];

  return (
    <footer className="w-full bg-background border-t">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-11 relative">
                <img src={logo} alt="CyberNark Logo" />
              </div>
              <div className="text-2xl font-bold text-foreground leading-8">
                CyberNark
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-6 max-w-xs">
              Your Shield Against Third-Party Risk
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Quick Access</h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className="block text-sm text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Customer Support</h3>
            <nav className="space-y-3">
              {supportLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className="block text-sm text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Contact</h3>
            <div className="space-y-3">
              <a
                href="mailto:info@cybernark.com"
                className="block text-sm text-foreground hover:text-primary transition-colors underline"
              >
                info@cybernark.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-muted border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-muted-foreground font-medium">
              Copyright © 2026 CyberNark. All rights reserved.
            </p>

            <div className="flex gap-8">
              <NavLink
                to="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Privacy Policy
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}