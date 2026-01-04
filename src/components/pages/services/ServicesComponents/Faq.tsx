import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "How quickly can I onboard my vendors?",
    answer:
      "Most teams complete their first vendor onboarding in under 15 minutes. Our intelligent automation extracts risk data, sends assessments, and generates reports instantly.",
  },
  {
    question: "Do you integrate with existing security tools?",
    answer:
      "Yes! We have native integrations with Slack, Jira, ServiceNow, Okta, and 50+ security tools. Our API also allows custom integrations in minutes.",
  },
  {
    question: "Is the platform SOC 2 compliant?",
    answer:
      "Absolutely. We're SOC 2 Type II certified, ISO 27001 compliant, and undergo annual penetration testing. Your data is encrypted at rest and in transit with AES-256.",
  },
  {
    question: "Can I customize risk questionnaires?",
    answer:
      "Yes — fully. Choose from our library of 200+ pre-built templates (NIST, ISO, SIG, etc.) or create unlimited custom questionnaires with conditional logic, scoring, and branding.",
  },
  {
    question: "What happens during the pilot program?",
    answer:
      "You get full access to all Premium features for 14 days, dedicated onboarding support, and a lifetime discount locked in if you convert. No credit card required.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Simple and transparent: based on the number of active vendors you monitor. No hidden fees, no per-user pricing. Pilot partners lock in special rates forever.",
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