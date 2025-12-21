// HowItWorks.tsx - Responsive version
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, CheckCircle2, BarChart3, Eye } from "lucide-react";

const steps = [
  {
    icon: ArrowUpRight,
    title: "Invite Your Suppliers",
    description:
      "Send assessment invitations to your vendors and suppliers directly from the platform. Track who has received and opened invitations.",
  },
  {
    icon: CheckCircle2,
    title: "Suppliers Complete Assessment",
    description:
      "Suppliers fill out comprehensive NIS2-compliant questionnaires about their security posture, controls, and compliance status.",
  },
  {
    icon: BarChart3,
    title: "Automatic Risk Calculation",
    description:
      "CyberNark analyzes responses and calculates BIV/CIA risk scores using AI-powered algorithms and industry best practices.",
  },
  {
    icon: Eye,
    title: "Monitor & Get Insights",
    description:
      "Access your dashboard for real-time insights, risk alerts, compliance reports, and AI-driven recommendations for risk mitigation.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-16 lg:py-20 bg-indigo-50 flex flex-col items-center gap-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl lg:max-w-4xl flex flex-col items-center gap-4 text-center">
        <h2 className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
          How It Works
        </h2>
        <p className="text-neutral-700 text-base lg:text-lg font-medium leading-6 max-w-xl">
          From invitation to insights in four simple steps
        </p>
      </div>

      {/* Steps */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card
              key={index}
              className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-xl shadow-md border border-stone-300 flex flex-col items-center gap-4 lg:gap-5 hover:shadow-xl transition duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>

              {/* Text */}
              <CardContent className="flex flex-col items-center gap-3 lg:gap-4 p-0 text-center">
                <h3 className="text-gray-900 text-sm sm:text-base lg:text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-5 lg:leading-6">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}