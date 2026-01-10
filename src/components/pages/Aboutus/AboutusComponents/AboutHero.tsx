import image1 from "../../../../assets/home/image1.png";
import { motion } from "framer-motion";
import { AnimatedContainer, AnimatedItem } from "@/lib/animation/AnimatedContainer";
import { AnimatedButton } from "@/lib/animation/AnimatedButton";
import { fadeInUp, slideInRight, staggerContainer } from "@/lib/animation/animations";

export default function AboutHero() {
  return (
    <AnimatedContainer className="bg-gradient-to-b from-primary/75 via-primary/45 to-transparent text-foreground pt-32 md:pt-44 lg:pt-52 mb-8 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-chart-6/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-40 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16"
        >
          {/* LEFT CONTENT */}
          <motion.div
            variants={staggerContainer}
            className="flex-1 flex flex-col justify-center text-center lg:text-left mx-auto lg:mx-0"
          >
            <AnimatedItem>
              <motion.h1
                variants={fadeInUp}
                className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight sm:leading-tight lg:leading-tight"
              >
                From onboarding to audits,{" "}
                <span className="bg-gradient-to-r from-chart-6 to-primary bg-clip-text text-transparent">
                  CyberNark 
                </span>{" "}
                automates every step to keep you NIS2-ready at all times.
              </motion.h1>
            </AnimatedItem>

            <AnimatedItem delay={0.1}>
              <motion.p
                variants={fadeInUp}
                className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Protect your organization with advanced supplier risk monitoring, real-time compliance alerts, and proactive threat mitigation to stay ahead of cyber threats.
              </motion.p>
            </AnimatedItem>

            <AnimatedItem delay={0.2}>
              <motion.div
                variants={fadeInUp}
                className="mt-6 sm:mt-8 flex justify-center lg:justify-start"
              >
                <AnimatedButton
                  onClick={() => {
                    document.getElementById("details")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-background text-foreground rounded-xl border-2 border-foreground hover:bg-background/90 transition-all duration-200 min-h-12 sm:min-h-14 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <span>See Details</span>
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      animate={{ y: [0, 3, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    >
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </motion.svg>
                  </div>
                </AnimatedButton>

              </motion.div>
            </AnimatedItem>

        
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="flex-1 flex justify-center lg:justify-end w-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
            >
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-chart-6/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  delay: 1,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-xl"
              />

              {/* Main Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <img
                  src={image1}
                  alt="CyberNark illustration"
                  className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm"
                  style={{
                    maxHeight: '400px',
                    height: 'auto'
                  }}
                />

                {/* Image Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chart-6/10 to-primary/10 blur-2xl -z-10" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-xs text-muted-foreground">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
              className="w-1 h-3 bg-chart-6 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatedContainer>
  );
}