import { Button } from "@/components/ui/button";
import logo from "@/assets/logo/logo.svg";
export default function Footer() {
    return (
        <footer className="w-full bg-background border-t">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {/* Logo Icon */}
                            <div className="w-10 h-11 relative">
                                <img src={logo} alt="" />
                            </div>
                            <div className="text-2xl font-bold text-foreground leading-8">
                                CyberNark
                            </div>
                        </div>
                        <p className="text-sm font-normal  text-muted-foreground leading-5">
                            Your Shield Against Third-Party Risk
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-base font-bold  text-foreground leading-6">
                            Quick access
                        </h3>
                        <div className="space-y-3">
                            {['Home', 'Our Vision', 'Services', 'Contact'].map((item) => (
                                <Button
                                    key={item}
                                    variant="ghost"
                                    className="w-full justify-start p-0 h-auto text-sm font-normal  text-foreground hover:text-primary transition-colors"
                                >
                                    {item}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Customer Support */}
                    <div className="space-y-4">
                        <h3 className="text-base font-bold  text-foreground leading-6">
                            Customer Support
                        </h3>
                        <div className="space-y-3">
                            {['Privacy Policy', 'Our Service', 'About Us', 'FAQ'].map((item) => (
                                <Button
                                    key={item}
                                    variant="ghost"
                                    className="w-full justify-start p-0 h-auto text-sm font-normal  text-foreground hover:text-primary transition-colors"
                                >
                                    {item}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-base font-bold  text-foreground leading-6">
                            Contact
                        </h3>
                        <div className="space-y-3">
                            <Button
                                variant="ghost"
                                className="w-full justify-start p-0 h-auto text-sm font-normal  text-foreground hover:text-primary transition-colors underline"
                            >
                                info@cybernark.com
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start p-0 h-auto text-sm font-normal  text-foreground hover:text-primary transition-colors"
                            >
                                sales@cybernark.com
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-chart-6 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                        <div className="text-xs font-bold font-['Outfit'] text-primary-foreground leading-4">
                            Copyright © 2025 CyberNark. All rights reserved
                        </div>

                        <div className="flex gap-6">
                            <Button
                                variant="ghost"
                                className="p-0 h-auto text-sm font-semibold  text-primary-foreground 
        hover:bg-transparent hover:text-primary-foreground"
                            >
                                Privacy Policy
                            </Button>

                            <Button
                                variant="ghost"
                                className="p-0 h-auto text-sm font-semibold  text-primary-foreground 
        hover:bg-transparent hover:text-primary-foreground"
                            >
                                Terms of Service
                            </Button>
                        </div>

                    </div>
                </div>

            </div>
        </footer>
    );
}