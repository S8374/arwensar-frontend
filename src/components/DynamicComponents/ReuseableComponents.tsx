import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Feature {
    icon?: React.ReactNode;
    text: string;
}

interface ReusableComponentProps {
    imageSrc: string;
    imageAlt?: string;
    title: string;
    description1: string;
    description2: string;
    features: Feature[];
    buttonText?: string;
    buttonVariant?: "primary" | "secondary" | "outline";
    buttonSize?: "sm" | "md" | "lg";
    reverse?: boolean;
    className?: string;
}

export default function ReusableComponent({
    imageSrc,
    imageAlt = "Feature image",
    title,
    description1,
    description2,
    features,
    buttonText = "See More",
    buttonVariant = "outline",
    buttonSize = "md",
    reverse = false,
    className = ""
}: ReusableComponentProps) {

    const buttonStyles = {
        primary: "bg-primary text-white hover:bg-primary/95 border shadow-lg",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 border-gray-600 shadow-lg",
        outline: "bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 shadow-md"
    };

    const buttonSizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base sm:px-6 sm:py-3 font-semibold",
        lg: "px-6 py-4 text-lg sm:px-8 sm:py-4 font-semibold"
    };

    const DefaultCheckIcon = () => (
        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shrink-0">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-chart-6 rounded-sm flex items-center justify-center bg-chart-6/10">
                <ChevronRight className="w-2 h-2 sm:w-3 sm:h-3 text-chart-6" />
            </div>
        </div>
    );

    return (
        <div className={cn(
            "w-full flex flex-col lg:flex-row justify-center mx-auto items-center gap-8 sm:gap-12 lg:gap-16 xl:gap-24 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24",
            reverse ? "lg:flex-row-reverse" : "",
            className
        )}>
            {/* Image Section */}
            <div className="relative flex flex-col border-2  shadow-sm rounded-lg w-full lg:w-1/2 xl:w-2/5 max-w-lg lg:max-w-none overflow-hidden">
                <div className="relative w-full aspect-video lg:aspect-square xl:aspect-video overflow-hidden text-foreground rounded-md">
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:flex-1 max-w-2xl flex flex-col justify-start items-start gap-4 sm:gap-6">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-tight lg:leading-tight text-foreground">
                    {title}
                </h2>

                {/* Description */}
                <div className="flex flex-col gap-3 sm:gap-4">
                    <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
                        {description1}
                    </p>
                    <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
                        {description2}
                    </p>
                </div>

                {/* Features List */}
                <div className="flex flex-col gap-3 sm:gap-4 w-full">
                    {features.map((feature, index) => (
                        <div key={index} className="flex justify-start items-start sm:items-center gap-3 sm:gap-4 group hover:translate-x-1 transition-transform duration-200">
                            {feature.icon || <DefaultCheckIcon />}
                            <span className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed sm:leading-7 group-hover:text-foreground transition-colors">
                                {feature.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Button */}
                <button className={cn(
                    "flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 mt-4 sm:mt-6",
                    buttonStyles[buttonVariant],
                    buttonSizes[buttonSize]
                )}>
                    {buttonText}
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}