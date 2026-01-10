/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // ← Required for client-side hooks

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Zod schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits"),
  companyName: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      companyName: "",
      message: "",
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;

  const onSubmit = (_data: FormValues) => {
    setIsLoading(true);
    setSubmitError(false);

    // Fake API delay (1.2 seconds)
    setTimeout(() => {
      // Simulate success (90% chance) - you can make it always succeed
      const success = Math.random() > 0.1; // ~90% success rate

      if (success) {
        toast.success("Message Sent!"
        );
        setIsSuccess(true);
        reset(); // Clear form
      } else {
        toast("Error"
        );
        setSubmitError(true);
      }

      setIsLoading(false);
    }, 200);
  };

  return (
    <section className="w-full px-6 -mt-20 py-36 bg-muted flex flex-col items-center gap-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
        <p className="text-muted-foreground text-base">
          Have questions about Cybernark? We'd love to hear from you.
          Get in touch with our team.
        </p>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div className="w-full max-w-6xl">
          <Card className="bg-background border">
            <CardContent className="pt-6">
              <p className="text-chart-2 font-medium">
                Thank you for your message! We'll get back to you soon.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="w-full max-w-6xl">
          <Card className="bg-background border">
            <CardContent className="pt-6">
              <p className="text-chart-1 font-medium">
                There was an error sending your message. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Layout */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column — Form */}
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader>
            <h2 className="text-2xl font-bold text-foreground">
              Send us a message
            </h2>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label>First Name</Label>
                  <Input
                    placeholder="Enter your first name"
                    className="bg-background"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-chart-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Last Name</Label>
                  <Input
                    placeholder="Enter your last name"
                    className="bg-background"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-chart-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-chart-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Enter your phone number"
                  className="bg-background"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-chart-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Company */}
              <div className="flex flex-col gap-2">
                <Label>Company Name</Label>
                <Input
                  placeholder="Enter your company name"
                  className="bg-background"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-chart-1">{errors.companyName?.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[130px] bg-background"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-sm text-chart-1">{errors.message.message}</p>
                )}
              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-foreground font-medium hover:bg-primary/95 disabled:opacity-50"
              >
                {isLoading ? (
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

        {/* Right Column — Contact Info */}
        <Card className="border flex flex-col justify-between">
          <CardContent className="pt-8 space-y-10">
            {/* Email Us */}
            <Card className="border shadow-sm">
              <CardContent className="pt-6 pb-8 flex flex-col items-start gap-6">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">Email Us</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    Send us an email anytime
                  </p>
                  <p className="text-primary text-lg">Info@cybernark.com</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}