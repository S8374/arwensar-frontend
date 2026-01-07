import image1 from '../../../../assets/home/image1.png'
export default function Story() {
    return (
        <div className="w-full px-4 sm:px-8 lg:px-14 py-12 lg:py-16 bg-muted/30 inline-flex flex-col justify-start items-center gap-12 lg:gap-16">
            {/* Main Content Section */}
            <div className="self-stretch flex flex-col justify-start items-center gap-8 lg:gap-12 max-w-6xl mx-auto">

                {/* Intro Text */}
                <div className="w-full lg:w-[912px] text-center text-foreground text-2xl sm:text-3xl font-semibold leading-8 sm:leading-10">
                    We believe in security by design, regulatory alignment, transparency, and long-term trust.
                </div>

                {/* Divider */}
                <div className="self-stretch h-1 bg-border rounded-xl" />

                {/* Founding Story */}
                <div className="self-stretch flex flex-col lg:flex-row justify-start items-start gap-8 lg:gap-12">
                    <div className="text-center lg:text-left text-foreground text-3xl sm:text-4xl font-semibold leading-10 sm:leading-[52px] lg:w-1/3">
                        Our Background
                    </div>
                    <div className="lg:w-2/3 justify-start text-muted-foreground text-lg sm:text-xl font-normal leading-7 space-y-4">
                        <p>
                            CyberNark was founded in response to the increasing complexity of cybersecurity regulations and
                            the operational burden they place on organizations.

                        </p>

                        <p>
                            Our team brings together experience in cybersecurity operations, risk management, and software
                            development.

                        </p>
{/* 
                        <p>There was no affordable solution.</p>

                        <p>
                            No simple tool for companies that needed real vendor insight without paying enterprise prices like OneTrust or Drata.
                        </p> */}

                        <p>So CyberNark was created with one mission:</p>

                        <blockquote className="text-foreground font-semibold italic text-xl border-l-4 border-primary pl-4 ml-4">
                            "To make supplier risk management simple, automated, and accessible for every organization."
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Image */}
            <img
                className="w-full max-w-[1130px] h-auto aspect-1130/775 rounded-lg object-cover"
                src={image1}
                alt="CyberNark platform overview"
            />

            {/* Vision & Mission Section */}
            <div className="self-stretch flex flex-col lg:flex-row justify-start items-start gap-8 lg:gap-7 max-w-6xl mx-auto">

                {/* Vision */}
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-6">
                    <div className="self-stretch text-center text-foreground text-3xl sm:text-4xl font-semibold leading-10 sm:leading-[52px]">
                        Our Vision
                    </div>
                    <div className="self-stretch flex-1 justify-start text-muted-foreground text-lg sm:text-xl font-medium leading-7">
                        We envision a digital ecosystem in which trust between organizations is measurable, verifiable, and
continuously maintained.

                    </div>
                </div>

                {/* Vertical Divider - Hidden on mobile */}
                <div className="hidden lg:block w-0.5 self-stretch bg-border" />

                {/* Horizontal Divider - Visible on mobile */}
                <div className="lg:hidden w-full h-0.5 bg-border my-4" />

                {/* Mission */}
                <div className="flex-1 inline-flex flex-col justify-start items-center gap-6">
                    <div className="self-stretch text-center text-foreground text-3xl sm:text-4xl font-semibold leading-10 sm:leading-[52px]">
                        Our Mission
                    </div>
                    <div className="self-stretch justify-start text-muted-foreground space-y-4">
                        <p className="text-lg sm:text-xl font-medium leading-7">
                            Our mission is to help organizations achieve control, transparency, and confidence in their supply
chain cybersecurity posture.

                        </p>

                        <p className="text-lg sm:text-xl font-semibold leading-7">
                            We achieve this by delivering a platform that:
                        </p>

                        <ul className="text-lg sm:text-xl font-normal leading-7 space-y-2 list-disc list-inside">
                            <li>simplifies NIS2 and security compliance</li>
                            <li>automates assessments, scoring, and monitoring</li>
                            <li>strengthens collaboration between vendors and suppliers</li>
                            <li>provides real-time insight into every risk in the supply chain</li>
                            <li>empowers companies to act before issues become threats</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}