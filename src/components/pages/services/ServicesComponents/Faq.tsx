import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AnimatedContainer, AnimatedItem } from "@/lib/animation/AnimatedContainer";
import { fadeInUp, staggerContainer } from "@/lib/animation/animations";

const faqData = [
  {
    question: "What is CyberNark?",
    answer: "CyberNark is a cybersecurity risk management platform designed to help organizations manage supplier and third-party cyber risks in compliance with the NIS2 Directive.",
    icon: "🛡️"
  },
  {
    question: "Who is CyberNark for?",
    answer: "CyberNark is built for organizations that work with multiple suppliers or third parties and need visibility, control, and compliance across their cyber risk ecosystem.",
    icon: "🏢"
  },
  {
    question: "Is CyberNark compliant with GDPR?",
    answer: "Yes. CyberNark is designed following GDPR principles, including data minimization, access control, and privacy by design.",
    icon: "📜"
  },
  {
    question: "How secure is the platform?",
    answer: "CyberNark implements security controls aligned with industry best practices, including access control, encryption, and secure infrastructure management.",
    icon: "🔐"
  },
  {
    question: "How is CyberNark delivered?",
    answer: "CyberNark is provided as a hosted SaaS (Software as a Service) solution, requiring no on-premise installation.",
    icon: "☁️"
  },
  {
    question: "Does CyberNark support role-based access?",
    answer: "Yes. CyberNark uses role-based access control (RBAC) to clearly separate permissions between vendors, suppliers, and internal users.",
    icon: "👥"
  },
];

export default function FAQ() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#E9EFFD] to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-chart-6/5 rounded-full blur-3xl" />
      </div>

      <AnimatedContainer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 lg:mb-20"
        >
         <AnimatedItem>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-chart-6 to-primary bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </AnimatedItem>

          <AnimatedItem delay={0.1}>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about our Vendor Risk Management platform.
            </p>
          </AnimatedItem>
        </motion.div>

        {/* Accordion FAQ - Wrap the entire accordion in Accordion component */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Accordion type="single" collapsible className="space-y-6">
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -2 }}
                className="overflow-hidden"
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-none"
                >
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <AccordionTrigger className="px-6 py-5 lg:px-8 lg:py-6 hover:bg-accent/50 transition-all duration-300 hover:no-underline group-data-[state=open]:bg-accent/30 w-full">
                      <div className="flex items-start gap-5 w-full">
                        {/* Number with Icon */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-6/20 to-primary/20 flex items-center justify-center">
                              <span className="text-2xl">{item.icon}</span>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center">
                              <span className="text-xs font-bold text-chart-6">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Question */}
                        <div className="flex-1 text-left">
                          <h3 className="text-lg lg:text-xl font-semibold text-foreground group-hover:text-chart-6 transition-colors">
                            {item.question}
                          </h3>
                        </div>

                        {/* Chevron Icon */}
                        <motion.div
                          animate={{ rotate: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0 ml-4"
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 group-data-[state=open]:text-chart-6 transition-all duration-300" />
                        </motion.div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-6 pb-6 lg:px-8 lg:pb-8 pt-0">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="pl-20 pr-4 lg:pr-6"
                      >
                        <div className="relative">
                          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-chart-6/50 to-primary/50 rounded-full" />
                          <p className="text-muted-foreground leading-relaxed pl-6">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    </AccordionContent>
                  </motion.div>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

      </AnimatedContainer>
    </section>
  );
}