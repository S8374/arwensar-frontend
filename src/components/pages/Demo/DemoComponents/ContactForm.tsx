
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
    return (
        <div className="w-full px-6 py-16 bg-background flex justify-center">
            <Card className="w-full max-w-6xl p-6 rounded-xl">
                <CardContent className="space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-2">
                            <Label className="text-foreground font-semibold">First name</Label>
                            <Input
                                placeholder="Nayan Dhali"
                                className="bg-background text-foreground"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label className="text-foreground font-semibold">Email</Label>
                            <Input
                                placeholder="john@company.com"
                                className="bg-background text-foreground"
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex flex-col space-y-2">
                        <Label className="text-foreground font-semibold">Company</Label>
                        <Input
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
                            placeholder="Tell us about your needs..."
                            className="bg-background text-foreground min-h-[140px]"
                        />
                    </div>

                    {/* Button */}
                    <Button className="w-full bg-primary text-foreground font-semibold hover:bg-primary/90">
                        Send Message
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
