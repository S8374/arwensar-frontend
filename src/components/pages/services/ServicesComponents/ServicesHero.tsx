import image1 from '../../../../assets/home/image1.png'
import image2 from '../../../../assets/home/image2.png'
import image3 from '../../../../assets/home/image3.png'
import image4 from '../../../../assets/home/image3.png'
export default function ServicesHero() {
    const heroData = {
        title: "See how CyberNark simplifies supplier risk management",
        description: "Everything you need to assess, monitor, and manage supplier risks in one secure platform.",
        stats: [
            {
                id: 1,
                title: "Vendors Assessed",
                value: "2,847",
                change: "+12%",
                color: "green"
            },
            {
                id: 2,
                title: "Avg. Risk Score",
                value: "94.2",
                change: "+8%",
                color: "green"
            },
            {
                id: 3,
                title: "Compliance Rate",
                value: "98%",
                change: "+5%",
                color: "green"
            }
        ],
        images: [
            {
                id: 1,
                src: image1,
                alt: "Supplier risk management dashboard"
            },
            {
                id: 2,
                src: image2,
                alt: "Vendor assessment interface"
            },
            {
                id: 3,
                src: image3,
                alt: "Compliance tracking"
            },
            {
                id: 4,
                src: image4,
                alt: "Risk analytics"
            }
        ]
    };

    return (
        <div className=" w-full bg-background relative text-foreground">


            {/* Main Content */}
            <div className="w-full  relative bg-linear-to-b from-primary/75 via-primary/45  mb-8 overflow-hidden pt-16 md:pt-16 lg:pt-24">
                {/* Background Circle */}
                <div className="absolute inset-0 rounded-full border border-foreground/0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-start pt-16 sm:pt-24 lg:pt-32">

                        {/* Left Content - Text */}
                        <div className="w-full lg:w-1/2">
                            <div className="space-y-4 sm:space-y-6 max-w-lg">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold  text-foreground leading-tight sm:leading-normal lg:leading-16">
                                    {heroData.title}
                                </h1>
                                <p className="text-sm sm:text-base lg:text-lg font-medium  text-muted-foreground leading-relaxed">
                                    {heroData.description}
                                </p>
                            </div>

                            {/* Stats Cards */}
                            <div className="mt-6 sm:mt-8 lg:mt-12 w-full max-w-md">
                                <div className="bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-border/50 p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        {heroData.stats.map((stat) => (
                                            <div
                                                key={stat.id}
                                                className="flex-1 bg-muted/50 rounded-lg border border-border/50 p-3 sm:p-4 hover:bg-muted/70 transition-colors duration-200"
                                            >
                                                <div className="text-xs sm:text-sm font-normal text-muted-foreground">
                                                    {stat.title}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="text-xl sm:text-2xl font-normal text-foreground">
                                                        {stat.value}
                                                    </div>
                                                    <div className={`text-xs font-normal ${stat.color === 'green' ? 'text-chart-6' : 'text-chart-1'
                                                        }`}>
                                                        {stat.change}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Images Grid */}
                        <div className="w-full lg:w-1/2 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                                {/* First Column */}
                                <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                                    {heroData.images.slice(0, 2).map((image) => (
                                        <img
                                            key={image.id}
                                            className="w-full h-40 sm:h-48 lg:h-56 xl:h-64 rounded-lg sm:rounded-xl border border-border/50 object-cover shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                                            src={image.src}
                                            alt={image.alt}
                                        />
                                    ))}
                                </div>

                                {/* Second Column */}
                                <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                                    {heroData.images.slice(2, 4).map((image) => (
                                        <img
                                            key={image.id}
                                            className="w-full h-40 sm:h-48 lg:h-56 xl:h-64 rounded-lg sm:rounded-xl border border-border/50 object-cover shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                                            src={image.src}
                                            alt={image.alt}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}