import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "What is CyberNark?",
    answer:
      "CyberNark is a cybersecurity risk management platform designed to help organizations manage supplier and third-party cyber risks in compliance with the NIS2 Directive.",
  },
  {
    question: "Who is CyberNark for?",
    answer:
      "CyberNark is built for organizations that work with multiple suppliers or third parties and need visibility, control, and compliance across their cyber risk ecosystem.",
  },
  {
    question: "Is CyberNark compliant with GDPR?",
    answer:
      "Yes. CyberNark is designed following GDPR principles, including data minimization, access control, and privacy by design.",
  },
  {
    question: "How secure is the platform?",
    answer:
      "CyberNark implements security controls aligned with industry best practices, including access control, encryption, and secure infrastructure management.",
  },
  {
    question: "How is CyberNark delivered?",
    answer:
      "CyberNark is provided as a hosted SaaS (Software as a Service) solution, requiring no on-premise installation.",
  },
  {
    question: "Does CyberNark support role-based access?",
    answer:
      "Yes. CyberNark uses role-based access control (RBAC) to clearly separate permissions between vendors, suppliers, and internal users.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16 lg:py-24 bg-[#E9EFFD]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-foreground  leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-foreground  max-w-2xl mx-auto">
            Everything you need to know about our Vendor Risk Management platform.
          </p>
        </div>

        {/* Accordion FAQ */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background  border   rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <AccordionTrigger className="px-6 py-5 text-left font-medium text-foreground hover:no-underline   transition-colors">
                <div className="flex items-start gap-4">
                  <span className="text-chart-6 font-bold text-lg mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg">{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <div className="pl-14 pr-4 text-foreground  leading-relaxed">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

       
      </div>
    </section>
  );
}