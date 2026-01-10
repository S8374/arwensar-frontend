
import { Card, CardContent } from "@/components/ui/card";
interface Compliance {
    title: string;
    description: string;
    image: string;

}

export default function ComplianceCard({ feature}: { feature: Compliance}) {
    return (
        <Card
            
            className="group relative bg-background overflow-hidden rounded-lg border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background"
        >


            {/* Image */}
            <div className="relative h-64 overflow-hidden  p-4">
                <div className="rounded-2xl shadow-xl overflow-hidden border ">
                    <img
                        src={feature.image}
                        alt={feature.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover "
                    />
                </div>
            </div>

            <CardContent className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {feature.title}
                </h3>
                <p className="text-foreground leading-relaxed">
                    {feature.description}
                </p>
            </CardContent>
        </Card>
    );
}