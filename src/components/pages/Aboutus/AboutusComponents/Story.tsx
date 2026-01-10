import image1 from '../../../../assets/home/image1.png'
import { motion } from "framer-motion";
import { AnimatedContainer, AnimatedItem, AnimatedSection } from "@/lib/animation/AnimatedContainer";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/animation/animations";
import { Target, Eye, Shield, Zap, Users, Quote } from "lucide-react";

export default function Story() {
    const missionPoints = [
        { icon: <Shield className="w-5 h-5" />, text: "simplifies NIS2 and security compliance" },
        { icon: <Zap className="w-5 h-5" />, text: "automates assessments, scoring, and monitoring" },
        { icon: <Users className="w-5 h-5" />, text: "strengthens collaboration between vendors and suppliers" },
        { icon: <Eye className="w-5 h-5" />, text: "provides real-time insight into every risk in the supply chain" },
        { icon: <Target className="w-5 h-5" />, text: "empowers companies to act before issues become threats" }
    ];

    return (
        <AnimatedContainer 
            id='details' 
            className="w-full px-4 sm:px-8 lg:px-14 py-12 lg:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden"
            threshold={0.1}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute bottom-20 right-10 w-64 h-64 bg-chart-6/5 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10">
                {/* Main Content Section */}
                <AnimatedSection className="self-stretch flex flex-col justify-start items-center gap-12 lg:gap-16 max-w-6xl mx-auto">

                    {/* Intro Text */}
                    <AnimatedItem>
                        <motion.div
                            variants={fadeInUp}
                            className="w-full lg:w-[912px] text-center text-foreground text-2xl sm:text-3xl lg:text-4xl font-semibold leading-8 sm:leading-10 lg:leading-[52px]"
                        >
                            We believe in{" "}
                            <span className="bg-gradient-to-r from-primary to-chart-6 bg-clip-text text-transparent">
                                security by design
                            </span>
                            , regulatory alignment, transparency, and long-term trust.
                        </motion.div>
                    </AnimatedItem>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="self-stretch h-1 bg-gradient-to-r from-transparent via-border to-transparent rounded-xl origin-left"
                    />

                    {/* Founding Story */}
                    <div className="self-stretch flex flex-col lg:flex-row justify-start items-start gap-8 lg:gap-12">
                        <AnimatedItem className="text-center lg:text-left text-foreground text-3xl sm:text-4xl font-semibold leading-10 sm:leading-[52px] lg:w-1/3">
                            <motion.div
                                variants={slideInLeft}
                                className="relative"
                            >
                                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary to-chart-6 rounded-full hidden lg:block" />
                                Our Background
                            </motion.div>
                        </AnimatedItem>

                        <AnimatedItem className="lg:w-2/3 justify-start text-muted-foreground text-lg sm:text-xl font-normal leading-7 space-y-4">
                            <motion.div variants={fadeInUp}>
                                <p>
                                    CyberNark was founded in response to the increasing complexity of cybersecurity regulations and
                                    the operational burden they place on organizations.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} custom={1}>
                                <p>
                                    Our team brings together experience in cybersecurity operations, risk management, and software
                                    development.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} custom={2}>
                                <p>So CyberNark was created with one mission:</p>
                            </motion.div>

                            <motion.div
                                variants={fadeInUp}
                                custom={3}
                                whileHover={{ scale: 1.02 }}
                                className="relative mt-8"
                            >
                                <AnimatedItem>
                                    <div className="relative p-6 lg:p-8 bg-gradient-to-r from-primary/5 to-chart-6/5 backdrop-blur-sm rounded-2xl border border-border/50">
                                        <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/30" />
                                        <blockquote className="text-foreground font-semibold italic text-xl lg:text-2xl border-l-4 border-chart-6 pl-6 ml-2">
                                            "To make supplier risk management simple, automated, and accessible for every organization."
                                        </blockquote>
                                        <Quote className="absolute bottom-4 right-4 w-8 h-8 text-chart-6/30 rotate-180" />
                                    </div>
                                </AnimatedItem>
                            </motion.div>
                        </AnimatedItem>
                    </div>
                </AnimatedSection>

                {/* Image */}
                <AnimatedItem className="mt-12 lg:mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        className="relative w-full max-w-[1130px] mx-auto"
                    >
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-chart-6/20 blur-xl -z-10" />
                        <img
                            className="w-full h-auto aspect-1130/775 rounded-2xl object-cover border-2 border-border/50 shadow-2xl"
                            src={image1}
                            alt="CyberNark platform overview"
                        />
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-3 -right-3 w-6 h-6 bg-chart-6 rounded-full"
                        />
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                            className="absolute -bottom-3 -left-3 w-6 h-6 bg-primary rounded-full"
                        />
                    </motion.div>
                </AnimatedItem>

                {/* Vision & Mission Section */}
                <AnimatedSection className="self-stretch flex flex-col lg:flex-row justify-start items-start gap-8 lg:gap-12 mt-12 lg:mt-16 max-w-6xl mx-auto">

                    {/* Vision */}
                    <AnimatedItem className="flex-1">
                        <motion.div
                            variants={slideInLeft}
                            className="inline-flex flex-col justify-start items-center gap-6 p-6 lg:p-8 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm rounded-2xl border border-border/50 h-full"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-center lg:text-left text-foreground text-3xl sm:text-4xl font-semibold leading-10 sm:leading-[52px]">
                                    Our Vision
                                </div>
                            </div>
                            <div className="self-stretch flex-1 justify-start text-muted-foreground text-lg sm:text-xl font-medium leading-7">
                                <motion.p variants={fadeInUp}>
                                    We envision a digital ecosystem in which trust between organizations is measurable, verifiable, and
                                    continuously maintained.
                                </motion.p>
                            </div>
                        </motion.div>
                    </AnimatedItem>

                    {/* Vertical Divider */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:block w-0.5 self-stretch bg-gradient-to-b from-transparent via-border to-transparent"
                    />

                    {/* Horizontal Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:hidden w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent my-4"
                    />

                    {/* Mission */}
                    <AnimatedItem className="flex-1">
                        <motion.div
                            variants={slideInRight}
                            className="inline-flex flex-col justify-start items-center gap-6 p-6 lg:p-8 bg-gradient-to-br from-chart-6/5 to-transparent backdrop-blur-sm rounded-2xl border border-border/50 h-full"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-chart-6/10 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-chart-6" />
                                </div>
                                <div className="text-center lg:text-left text-foreground text-3xl sm:text-4xl font-semibold leading-10 sm:leading-[52px]">
                                    Our Mission
                                </div>
                            </div>
                            <div className="self-stretch justify-start text-muted-foreground space-y-4">
                                <motion.p variants={fadeInUp} className="text-lg sm:text-xl font-medium leading-7">
                                    Our mission is to help organizations achieve control, transparency, and confidence in their supply
                                    chain cybersecurity posture.
                                </motion.p>

                                <motion.p variants={fadeInUp} custom={1} className="text-lg sm:text-xl font-semibold leading-7">
                                    We achieve this by delivering a platform that:
                                </motion.p>

                                <motion.div variants={staggerContainer} className="space-y-3">
                                    {missionPoints.map((point, index) => (
                                        <motion.div
                                            key={index}
                                            variants={fadeInUp}
                                            custom={index + 2}
                                            whileHover={{ x: 5 }}
                                            className="flex items-start gap-3 group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary/10 to-chart-6/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                                                <div className="text-chart-6">
                                                    {point.icon}
                                                </div>
                                            </div>
                                            <span className="text-lg sm:text-xl font-normal leading-7 group-hover:text-foreground transition-colors">
                                                {point.text}
                                            </span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatedItem>
                </AnimatedSection>
            </div>
        </AnimatedContainer>
    )
}