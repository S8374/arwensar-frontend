
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        company: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Fake "sending" delay (looks more real)
        setTimeout(() => {
            // Show success toast with all values
            toast.success(
                "Message Sent!"
            );

            // Reset form
            setFormData({
                firstName: "",
                email: "",
                company: "",
                message: "",
            });

            setIsSubmitting(false);
        }, 200); // 1.2 second delay
    };

    return (
        <div className="w-full px-6 py-16 bg-background flex justify-center">
            <Card className="w-full max-w-6xl p-6 rounded-xl">
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-2">
                                <Label className="text-foreground font-semibold">
                                    First name
                                </Label>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Nayan Dhali"
                                    className="bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Label className="text-foreground font-semibold">Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@company.com"
                                    className="bg-background text-foreground"
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col space-y-2">
                            <Label className="text-foreground font-semibold">Company</Label>
                            <Input
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Your Company Name"
                                className="bg-background text-foreground"
                            />
                        </div>

                        {/* Row 3 */}
                        <div className="flex flex-col space-y-2">
                            <Label className="text-foreground font-semibold">
                                Message (Optional)
                            </Label>
                            <Textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us about your needs..."
                                className="bg-background text-foreground min-h-[140px]"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}